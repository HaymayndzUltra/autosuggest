import fs from 'fs';
import path from 'path';
import { app } from 'electron';

/**
 * Local metrics logger for ASR provider performance and switching
 */
export class MetricsLogger {
  private static readonly LOG_DIR = path.join(app.getPath('temp'), 'autosuggest-metrics');
  private static readonly SESSION_FILE = 'session.json';
  private static instance: MetricsLogger;
  private sessionId: string;
  private sessionStartTime: number;
  private metrics: {
    providerSwitches: Array<{
      from: 'local' | 'deepgram' | null;
      to: 'local' | 'deepgram' | null;
      reason: 'timeout' | 'errors' | 'manual' | 'health_check';
      timestamp: number;
      latency?: number;
    }>;
    utteranceMetrics: Array<{
      provider: 'local' | 'deepgram';
      micToASR_ms: number;
      ASRToSuggestion_ms: number;
      timestamp: number;
      transcriptLength: number;
    }>;
    healthChecks: Array<{
      provider: 'local' | 'deepgram';
      healthy: boolean;
      latency?: number;
      error?: string;
      timestamp: number;
    }>;
  };

  private constructor() {
    this.sessionId = this.generateSessionId();
    this.sessionStartTime = Date.now();
    this.metrics = {
      providerSwitches: [],
      utteranceMetrics: [],
      healthChecks: [],
    };
    
    // Ensure log directory exists
    this.ensureLogDirectory();
  }

  static getInstance(): MetricsLogger {
    if (!MetricsLogger.instance) {
      MetricsLogger.instance = new MetricsLogger();
    }
    return MetricsLogger.instance;
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private ensureLogDirectory(): void {
    try {
      if (!fs.existsSync(MetricsLogger.LOG_DIR)) {
        fs.mkdirSync(MetricsLogger.LOG_DIR, { recursive: true });
      }
    } catch (error) {
      console.error('Failed to create metrics log directory:', error);
    }
  }

  /**
   * Log ASR provider switch event
   */
  logProviderSwitch(
    from: 'local' | 'deepgram' | null,
    to: 'local' | 'deepgram' | null,
    reason: 'timeout' | 'errors' | 'manual' | 'health_check',
    latency?: number
  ): void {
    const switchEvent = {
      from,
      to,
      reason,
      timestamp: Date.now(),
      latency,
    };

    this.metrics.providerSwitches.push(switchEvent);
    
    console.log(`📊 Provider switch logged: ${from} → ${to} (${reason})`);
    
    // Write to file immediately for critical events
    this.writeToFile();
  }

  /**
   * Log utterance processing metrics
   */
  logUtteranceMetrics(
    provider: 'local' | 'deepgram',
    micToASR_ms: number,
    ASRToSuggestion_ms: number,
    transcriptLength: number
  ): void {
    const utteranceEvent = {
      provider,
      micToASR_ms,
      ASRToSuggestion_ms,
      timestamp: Date.now(),
      transcriptLength,
    };

    this.metrics.utteranceMetrics.push(utteranceEvent);
    
    console.log(`📊 Utterance metrics logged: ${provider} (mic→ASR: ${micToASR_ms}ms, ASR→suggestion: ${ASRToSuggestion_ms}ms)`);
  }

  /**
   * Log health check results
   */
  logHealthCheck(
    provider: 'local' | 'deepgram',
    healthy: boolean,
    latency?: number,
    error?: string
  ): void {
    const healthEvent = {
      provider,
      healthy,
      latency,
      error,
      timestamp: Date.now(),
    };

    this.metrics.healthChecks.push(healthEvent);
    
    console.log(`📊 Health check logged: ${provider} ${healthy ? 'healthy' : 'unhealthy'} (${latency}ms)`);
  }

  /**
   * Write current metrics to file
   */
  private writeToFile(): void {
    try {
      const sessionData = {
        sessionId: this.sessionId,
        sessionStartTime: this.sessionStartTime,
        sessionDuration: Date.now() - this.sessionStartTime,
        metrics: this.metrics,
        summary: this.generateSummary(),
      };

      const filePath = path.join(MetricsLogger.LOG_DIR, `${this.sessionId}.json`);
      fs.writeFileSync(filePath, JSON.stringify(sessionData, null, 2));
      
      console.log(`📊 Metrics written to: ${filePath}`);
    } catch (error) {
      console.error('Failed to write metrics to file:', error);
    }
  }

  /**
   * Generate summary statistics
   */
  private generateSummary(): any {
    const switches = this.metrics.providerSwitches;
    const utterances = this.metrics.utteranceMetrics;
    const healthChecks = this.metrics.healthChecks;

    return {
      totalProviderSwitches: switches.length,
      switchReasons: switches.reduce((acc, s) => {
        acc[s.reason] = (acc[s.reason] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      averageMicToASRLatency: utterances.length > 0 
        ? utterances.reduce((sum, u) => sum + u.micToASR_ms, 0) / utterances.length 
        : 0,
      averageASRToSuggestionLatency: utterances.length > 0 
        ? utterances.reduce((sum, u) => sum + u.ASRToSuggestion_ms, 0) / utterances.length 
        : 0,
      healthCheckSuccessRate: healthChecks.length > 0 
        ? healthChecks.filter(h => h.healthy).length / healthChecks.length 
        : 0,
      totalUtterances: utterances.length,
      totalHealthChecks: healthChecks.length,
    };
  }

  /**
   * Export session log as JSON string
   */
  exportSessionLog(): string {
    const sessionData = {
      sessionId: this.sessionId,
      sessionStartTime: this.sessionStartTime,
      sessionDuration: Date.now() - this.sessionStartTime,
      metrics: this.metrics,
      summary: this.generateSummary(),
    };

    return JSON.stringify(sessionData, null, 2);
  }

  /**
   * Get current session summary
   */
  getSessionSummary(): any {
    return {
      sessionId: this.sessionId,
      sessionDuration: Date.now() - this.sessionStartTime,
      summary: this.generateSummary(),
    };
  }

  /**
   * Clear current session metrics
   */
  clearSession(): void {
    this.sessionId = this.generateSessionId();
    this.sessionStartTime = Date.now();
    this.metrics = {
      providerSwitches: [],
      utteranceMetrics: [],
      healthChecks: [],
    };
    
    console.log(`📊 New session started: ${this.sessionId}`);
  }

  /**
   * Get list of all session files
   */
  static getAllSessionFiles(): string[] {
    try {
      if (!fs.existsSync(MetricsLogger.LOG_DIR)) {
        return [];
      }
      
      return fs.readdirSync(MetricsLogger.LOG_DIR)
        .filter(file => file.endsWith('.json'))
        .map(file => path.join(MetricsLogger.LOG_DIR, file));
    } catch (error) {
      console.error('Failed to read session files:', error);
      return [];
    }
  }

  /**
   * Clean up old session files (keep last 10)
   */
  static cleanupOldSessions(): void {
    try {
      const sessionFiles = MetricsLogger.getAllSessionFiles();
      
      if (sessionFiles.length > 10) {
        // Sort by modification time (oldest first)
        const sortedFiles = sessionFiles
          .map(file => ({ file, mtime: fs.statSync(file).mtime.getTime() }))
          .sort((a, b) => a.mtime - b.mtime);
        
        // Remove oldest files
        const filesToRemove = sortedFiles.slice(0, sessionFiles.length - 10);
        filesToRemove.forEach(({ file }) => {
          fs.unlinkSync(file);
          console.log(`📊 Cleaned up old session file: ${file}`);
        });
      }
    } catch (error) {
      console.error('Failed to cleanup old sessions:', error);
    }
  }
}
