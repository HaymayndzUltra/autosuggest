// PCM Resampler Worker for converting 48kHz to 16kHz
// This is optional - only needed if ASR requires 16kHz input

self.onmessage = ({ data }) => {
  const { float32_48k, targetSampleRate = 16000 } = data;
  
  if (!float32_48k || float32_48k.length === 0) {
    self.postMessage({ error: 'No input data' });
    return;
  }
  
  try {
    const sourceSampleRate = 48000;
    const ratio = sourceSampleRate / targetSampleRate;
    const outLength = Math.floor(float32_48k.length / ratio);
    const out = new Float32Array(outLength);
    
    // Simple linear interpolation resampling
    for (let i = 0; i < outLength; i++) {
      const sourceIndex = i * ratio;
      const index = Math.floor(sourceIndex);
      const fraction = sourceIndex - index;
      
      if (index + 1 < float32_48k.length) {
        // Linear interpolation
        out[i] = float32_48k[index] * (1 - fraction) + float32_48k[index + 1] * fraction;
      } else {
        // Use last available sample
        out[i] = float32_48k[index];
      }
    }
    
    self.postMessage({ 
      out, 
      sourceSampleRate, 
      targetSampleRate,
      originalLength: float32_48k.length,
      resampledLength: out.length
    }, [out.buffer]);
    
  } catch (error) {
    self.postMessage({ error: error.message });
  }
};
