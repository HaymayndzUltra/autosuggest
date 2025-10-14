import axios from 'axios';

/**
 * Client for communicating with local ASR service
 */
export class LocalASRClient {
  private baseUrl: string;
  private audioBuffer: ArrayBuffer[] = [];
  private batchTimer: NodeJS.Timeout | null = null;
  private isConnected = false;
  private failureCount = 0;
  private readonly BATCH_INTERVAL = 1000; // 1 second
  private readonly MAX_RETRIES = 3;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/$/, ''); // Remove trailing slash
  }

  /**
   * Connect to local ASR service
   */
  async connect(): Promise<void> {
    try {
      console.log(`🔗 Connecting to local ASR at ${this.baseUrl}`);
      
      // Test connection with health check
      const response = await axios.get(`${this.baseUrl}/docs`, {
        timeout: 3000,
        validateStatus: (status) => status < 500,
      });

      if (response.status >= 200 && response.status < 300) {
        this.isConnected = true;
        this.failureCount = 0;
        console.log('✅ Local ASR connected successfully');
      } else {
        throw new Error(`Health check failed: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      this.isConnected = false;
      const errorMsg = axios.isAxiosError(error) ? error.message : String(error);
      console.error('❌ Failed to connect to local ASR:', errorMsg);
      throw new Error(`Local ASR connection failed: ${errorMsg}`);
    }
  }

  /**
   * Send audio chunk to local ASR
   */
  async sendAudioChunk(buffer: ArrayBuffer): Promise<void> {
    if (!this.isConnected) {
      console.warn('⚠️ Local ASR not connected, dropping audio chunk');
      return;
    }

    // Add to buffer
    this.audioBuffer.push(buffer);

    // Start batch timer if not already running
    if (!this.batchTimer) {
      this.batchTimer = setTimeout(() => {
        this.processBatch();
      }, this.BATCH_INTERVAL);
    }
  }

  /**
   * Process batched audio data
   */
  private async processBatch(): Promise<void> {
    if (this.audioBuffer.length === 0) {
      this.batchTimer = null;
      return;
    }

    const batch = [...this.audioBuffer];
    this.audioBuffer = [];
    this.batchTimer = null;

    try {
      // Combine audio buffers
      const totalLength = batch.reduce((sum, buf) => sum + buf.byteLength, 0);
      const combinedBuffer = new ArrayBuffer(totalLength);
      const combinedView = new Uint8Array(combinedBuffer);
      
      let offset = 0;
      for (const buf of batch) {
        combinedView.set(new Uint8Array(buf), offset);
        offset += buf.byteLength;
      }

      // Send to local ASR
      await this.sendBatchToASR(combinedBuffer);
      
      // Reset failure count on success
      this.failureCount = 0;
      
    } catch (error) {
      console.error('❌ Failed to process audio batch:', error);
      this.handleFailure();
    }
  }

  /**
   * Convert raw audio buffer to WAV format
   */
  private createWAVBuffer(audioBuffer: ArrayBuffer): ArrayBuffer {
    const data = new Int16Array(audioBuffer);
    const length = data.length;
    
    // Validate audio data
    if (length === 0) {
      throw new Error('Empty audio buffer');
    }
    
    const sampleRate = 16000;
    const numChannels = 1;
    const bitsPerSample = 16;
    const bytesPerSample = bitsPerSample / 8;
    
    // WAV header (44 bytes)
    const headerLength = 44;
    const dataSize = length * bytesPerSample;
    const totalLength = headerLength + dataSize;
    const buffer = new ArrayBuffer(totalLength);
    const view = new DataView(buffer);
    
    // RIFF header
    view.setUint32(0, 0x52494646, false); // "RIFF" (big endian)
    view.setUint32(4, totalLength - 8, true); // File size - 8 (little endian)
    view.setUint32(8, 0x57415645, false); // "WAVE" (big endian)
    
    // fmt chunk
    view.setUint32(12, 0x666d7420, false); // "fmt " (big endian)
    view.setUint32(16, 16, true); // Chunk size (little endian)
    view.setUint16(20, 1, true); // Audio format PCM (little endian)
    view.setUint16(22, numChannels, true); // Number of channels (little endian)
    view.setUint32(24, sampleRate, true); // Sample rate (little endian)
    view.setUint32(28, sampleRate * numChannels * bytesPerSample, true); // Byte rate (little endian)
    view.setUint16(32, numChannels * bytesPerSample, true); // Block align (little endian)
    view.setUint16(34, bitsPerSample, true); // Bits per sample (little endian)
    
    // data chunk
    view.setUint32(36, 0x64617461, false); // "data" (big endian)
    view.setUint32(40, dataSize, true); // Data size (little endian)
    
    // Copy audio data (little endian)
    const audioView = new Int16Array(buffer, headerLength);
    audioView.set(data);
    
    return buffer;
  }

  /**
   * Send batch to local ASR service
   */
  private async sendBatchToASR(audioBuffer: ArrayBuffer): Promise<void> {
    try {
      const formData = new FormData();
      
      // Convert raw audio buffer to proper WAV format
      const wavBuffer = this.createWAVBuffer(audioBuffer);
      const audioBlob = new Blob([wavBuffer], { type: 'audio/wav' });
      formData.append('audio_file', audioBlob, 'audio.wav');
      
      console.log(`📤 Sending audio batch: ${wavBuffer.byteLength} bytes`);

    const response = await axios.post(`${this.baseUrl}/asr?task=transcribe`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 60000, // 60 second timeout (increased for CPU processing)
      validateStatus: (status) => status < 500,
    });

    if (response.status >= 200 && response.status < 300) {
      // Parse response and emit transcript event
      const transcriptData = response.data;
      
      if (transcriptData && transcriptData.text) {
        // Emit transcript event (this will be handled by the main process)
        // We'll use a custom event for local ASR transcripts
        if (typeof window !== 'undefined' && window.electronAPI) {
          // This is a renderer context - emit to main process
          window.electronAPI.ipcRenderer.invoke('local-asr-transcript', {
            transcript: transcriptData.text,
            is_final: true,
            provider: 'local',
            confidence: transcriptData.confidence || 1.0,
          });
        }
      }
    } else {
      throw new Error(`Local ASR error: ${response.status} ${response.statusText}`);
    }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          console.warn('⏰ ASR timeout - audio processing too slow, trying fallback');
          // Don't throw error immediately, let the failure handler deal with it
        } else {
          console.error('❌ ASR request failed:', error.message);
        }
      } else {
        console.error('❌ Failed to send audio batch to ASR:', error);
      }
      throw error;
    }
  }

  /**
   * Handle connection failure
   */
  private handleFailure(): void {
    this.failureCount++;
    console.log(`❌ Local ASR failure #${this.failureCount}`);
    
    if (this.failureCount >= this.MAX_RETRIES) {
      console.log('🔴 Local ASR failed too many times, marking as disconnected');
      this.isConnected = false;
      
      // Notify main process of failure
      if (typeof window !== 'undefined' && window.electronAPI) {
        window.electronAPI.ipcRenderer.invoke('local-asr-failure', {
          failureCount: this.failureCount,
          timestamp: Date.now(),
        });
      }
    }
  }

  /**
   * Disconnect from local ASR service
   */
  disconnect(): void {
    console.log('🔌 Disconnecting from local ASR');
    
    this.isConnected = false;
    
    // Clear any pending batches
    if (this.batchTimer) {
      clearTimeout(this.batchTimer);
      this.batchTimer = null;
    }
    
    // Process any remaining audio
    if (this.audioBuffer.length > 0) {
      this.processBatch().catch(error => {
        console.error('Error processing final batch:', error);
      });
    }
    
    this.audioBuffer = [];
    this.failureCount = 0;
  }

  /**
   * Get connection status
   */
  getConnectionStatus(): { connected: boolean; failureCount: number } {
    return {
      connected: this.isConnected,
      failureCount: this.failureCount,
    };
  }

  /**
   * Reset failure count (called when connection is restored)
   */
  resetFailureCount(): void {
    this.failureCount = 0;
    this.isConnected = true;
  }
}
