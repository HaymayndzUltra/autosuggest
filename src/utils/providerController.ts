import { ASRProvider, ASRHealthStatus } from '../renderer.d';

/**
 * Controller for ASR provider selection and routing logic
 */
export class ASRProviderController {
  private static readonly MAX_FAILURES = 3;
  
  // Keep track of the last active provider
  private static currentProvider: 'local' | 'deepgram' | 'auto' | null = null;
  
  /**
   * Select the appropriate ASR provider based on mode and health status
   */
  static selectProvider(
    mode: ASRProvider,
    localHealth: ASRHealthStatus,
    hasDeepgramKey: boolean
  ): 'local' | 'deepgram' | null {
    console.log('🎯 Selecting ASR provider:', { mode, localHealthy: localHealth.healthy, hasDeepgramKey });
    
    let newProvider: 'local' | 'deepgram' = 'local';

    switch (mode) {
      case 'auto':
        // Prefer local if healthy, fallback to Deepgram if key exists
        if (localHealth.healthy) {
          console.log('✅ Auto mode: Selected local ASR (healthy)');
          newProvider = 'local';
        } else if (hasDeepgramKey) {
          console.log('✅ Auto mode: Selected Deepgram (local down, key available)');
          newProvider = 'deepgram';
        } else {
          console.log('❌ Auto mode: No providers available');
          return null;
        }
        break;
        
      case 'local':
        // Require local to be healthy
        if (localHealth.healthy) {
          console.log('✅ Local mode: Selected local ASR');
          newProvider = 'local';
        } else {
          console.log('❌ Local mode: Local ASR not healthy');
          return null;
        }
        break;
        
      case 'deepgram':
        // Require Deepgram key
        if (hasDeepgramKey) {
          console.log('✅ Deepgram mode: Selected Deepgram');
          newProvider = 'deepgram';
        } else {
          console.log('❌ Deepgram mode: No API key');
          return null;
        }
        break;
        
      default:
        console.log('❌ Unknown mode:', mode);
        return null;
    }

    // 🧠 Prevent unnecessary re-selection
    if (this.currentProvider === newProvider) {
      console.log(`🔒 Provider already active: ${newProvider}, skipping re-initialization`);
      return newProvider; // Return the provider but skip duplicate initialization
    }
    this.currentProvider = newProvider;

    console.log(`🎯 Selecting ASR provider: ${newProvider}`);
    return newProvider;
  }
  
  /**
   * Determine if Start button should be enabled
   */
  static shouldEnableStart(
    mode: ASRProvider,
    localHealth: ASRHealthStatus,
    hasDeepgramKey: boolean
  ): boolean {
    const selectedProvider = this.selectProvider(mode, localHealth, hasDeepgramKey);
    const enabled = selectedProvider !== null;
    
    console.log('🚀 Start button enabled:', enabled, 'provider:', selectedProvider);
    return enabled;
  }
  
  /**
   * Get human-readable label for provider
   */
  static getProviderLabel(provider: 'local' | 'deepgram' | null): string {
    switch (provider) {
      case 'local':
        return 'Local';
      case 'deepgram':
        return 'Deepgram';
      case null:
        return 'None';
      default:
        return 'Unknown';
    }
  }
  
  /**
   * Get detailed status message for provider selection
   */
  static getStatusMessage(
    mode: ASRProvider,
    localHealth: ASRHealthStatus,
    hasDeepgramKey: boolean
  ): string {
    const selectedProvider = this.selectProvider(mode, localHealth, hasDeepgramKey);
    
    if (selectedProvider === 'local') {
      return `Local ASR ready (${localHealth.latency}ms)`;
    } else if (selectedProvider === 'deepgram') {
      return 'Deepgram ready';
    } else {
      // No provider available
      const issues: string[] = [];
      
      if (!localHealth.healthy) {
        issues.push(`Local ASR: ${localHealth.error || 'unavailable'}`);
      }
      
      if (!hasDeepgramKey) {
        issues.push('Deepgram: no API key');
      }
      
      return `No ASR available - ${issues.join(', ')}`;
    }
  }
  
  /**
   * Check if failover should be triggered for local ASR
   */
  static shouldFailoverToDeepgram(
    failureCount: number,
    hasDeepgramKey: boolean,
    lastFailureTime?: number
  ): boolean {
    const now = Date.now();
    const timeSinceLastFailure = lastFailureTime ? now - lastFailureTime : 0;
    
    // Failover if we have 3+ consecutive failures OR 10+ seconds with no response
    const shouldFailover = failureCount >= this.MAX_FAILURES || timeSinceLastFailure > 10000;
    
    if (shouldFailover && hasDeepgramKey) {
      console.log('🔄 Triggering failover to Deepgram:', {
        failureCount,
        timeSinceLastFailure,
        hasDeepgramKey,
      });
      return true;
    }
    
    return false;
  }
  
  /**
   * Check if we should attempt to switch back to local from Deepgram
   */
  static shouldSwitchBackToLocal(
    localHealth: ASRHealthStatus,
    deepgramError?: string
  ): boolean {
    // Only switch back if local is healthy and Deepgram had an error
    if (localHealth.healthy && deepgramError) {
      console.log('🔄 Attempting to switch back to local ASR:', {
        localHealthy: localHealth.healthy,
        deepgramError,
      });
      return true;
    }
    
    return false;
  }
  
  /**
   * Get configuration requirements for each mode
   */
  static getModeRequirements(mode: ASRProvider): {
    localRequired: boolean;
    deepgramRequired: boolean;
    description: string;
  } {
    switch (mode) {
      case 'auto':
        return {
          localRequired: false,
          deepgramRequired: false,
          description: 'Uses local ASR if available, falls back to Deepgram',
        };
        
      case 'local':
        return {
          localRequired: true,
          deepgramRequired: false,
          description: 'Requires local ASR service to be running',
        };
        
      case 'deepgram':
        return {
          localRequired: false,
          deepgramRequired: true,
          description: 'Requires valid Deepgram API key',
        };
        
      default:
        return {
          localRequired: false,
          deepgramRequired: false,
          description: 'Unknown mode',
        };
    }
  }

  /**
   * Reset the current provider tracking (call when stopping recording)
   */
  static resetCurrentProvider(): void {
    console.log('🔄 Resetting provider tracking');
    this.currentProvider = null;
  }
}
