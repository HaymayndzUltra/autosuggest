import axios from 'axios';
import { ASRHealthStatus } from '../renderer.d';

/**
 * Health check utilities for ASR providers
 */
export class ASRHealthChecker {
  private static readonly LOCAL_TIMEOUT = 3000; // 3 seconds
  private static readonly DEEPGRAM_TIMEOUT = 5000; // 5 seconds

  /**
   * Check if local ASR service is healthy
   */
  static async checkLocalASR(url: string): Promise<ASRHealthStatus> {
    const startTime = Date.now();
    
    try {
      // Try HEAD request first, fallback to GET if HEAD fails
      let response;
      try {
        response = await axios.head(`${url}/docs`, {
          timeout: this.LOCAL_TIMEOUT,
          validateStatus: (status) => status < 500, // Accept 2xx, 3xx, 4xx
        });
      } catch (headError) {
        // Fallback to GET request
        response = await axios.get(`${url}/docs`, {
          timeout: this.LOCAL_TIMEOUT,
          validateStatus: (status) => status < 500,
        });
      }

      const latency = Date.now() - startTime;
      
      if (response.status >= 200 && response.status < 300) {
        return {
          healthy: true,
          latency,
          lastChecked: Date.now(),
        };
      } else {
        return {
          healthy: false,
          latency,
          error: `HTTP ${response.status}: ${response.statusText}`,
          lastChecked: Date.now(),
        };
      }
    } catch (error) {
      const latency = Date.now() - startTime;
      
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
          return {
            healthy: false,
            latency,
            error: 'Connection refused - Local ASR service not running',
            lastChecked: Date.now(),
          };
        } else if (error.code === 'ETIMEDOUT') {
          return {
            healthy: false,
            latency,
            error: 'Connection timeout - Local ASR service not responding',
            lastChecked: Date.now(),
          };
        } else {
          return {
            healthy: false,
            latency,
            error: `Network error: ${error.message}`,
            lastChecked: Date.now(),
          };
        }
      } else {
        return {
          healthy: false,
          latency,
          error: `Unknown error: ${error instanceof Error ? error.message : String(error)}`,
          lastChecked: Date.now(),
        };
      }
    }
  }

  /**
   * Check if Deepgram API key is valid
   */
  static async checkDeepgramKey(key: string): Promise<ASRHealthStatus> {
    const startTime = Date.now();
    
    if (!key || key.trim() === '') {
      return {
        healthy: false,
        error: 'Deepgram API key is empty',
        lastChecked: Date.now(),
      };
    }

    try {
      // Test with a minimal request to Deepgram's API
      const response = await axios.get('https://api.deepgram.com/v1/projects', {
        headers: {
          'Authorization': `Token ${key}`,
        },
        timeout: this.DEEPGRAM_TIMEOUT,
        validateStatus: (status) => status < 500,
      });

      const latency = Date.now() - startTime;

      if (response.status === 200) {
        return {
          healthy: true,
          latency,
          lastChecked: Date.now(),
        };
      } else if (response.status === 401) {
        return {
          healthy: false,
          latency,
          error: 'Invalid Deepgram API key',
          lastChecked: Date.now(),
        };
      } else if (response.status === 403) {
        return {
          healthy: false,
          latency,
          error: 'Deepgram API key lacks required permissions',
          lastChecked: Date.now(),
        };
      } else {
        return {
          healthy: false,
          latency,
          error: `Deepgram API error: ${response.status} ${response.statusText}`,
          lastChecked: Date.now(),
        };
      }
    } catch (error) {
      const latency = Date.now() - startTime;
      
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          return {
            healthy: false,
            latency,
            error: 'Invalid Deepgram API key',
            lastChecked: Date.now(),
          };
        } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
          return {
            healthy: false,
            latency,
            error: 'Cannot reach Deepgram API - check internet connection',
            lastChecked: Date.now(),
          };
        } else if (error.code === 'ETIMEDOUT') {
          return {
            healthy: false,
            latency,
            error: 'Deepgram API timeout - check internet connection',
            lastChecked: Date.now(),
          };
        } else {
          return {
            healthy: false,
            latency,
            error: `Deepgram API error: ${error.message}`,
            lastChecked: Date.now(),
          };
        }
      } else {
        return {
          healthy: false,
          latency,
          error: `Unknown error: ${error instanceof Error ? error.message : String(error)}`,
          lastChecked: Date.now(),
        };
      }
    }
  }

  /**
   * Check both providers and return combined status
   */
  static async checkBothProviders(config: {
    local_asr_url?: string;
    deepgram_api_key?: string;
  }): Promise<{
    local: ASRHealthStatus;
    deepgram: ASRHealthStatus;
  }> {
    const [local, deepgram] = await Promise.allSettled([
      this.checkLocalASR(config.local_asr_url || 'http://127.0.0.1:9001'),
      this.checkDeepgramKey(config.deepgram_api_key || ''),
    ]);

    return {
      local: local.status === 'fulfilled' ? local.value : {
        healthy: false,
        error: local.reason?.message || 'Local ASR check failed',
        lastChecked: Date.now(),
      },
      deepgram: deepgram.status === 'fulfilled' ? deepgram.value : {
        healthy: false,
        error: deepgram.reason?.message || 'Deepgram check failed',
        lastChecked: Date.now(),
      },
    };
  }
}
