import fs from 'fs';
import path from 'path';
import { app } from 'electron';
import { topicAlignmentGate } from './topicAlignment';

export interface DiscoveryResult {
  type: 'company_info' | 'tech_stack' | 'timeline' | 'team_structure' | 'requirements' | 'pain_points';
  content: string;
  timestamp: number;
  confidence: number;
}

export class DiscoveryManager {
  private static instance: DiscoveryManager;
  private discoveryHistory: Set<string> = new Set();
  private lastWriteTime: number = 0;
  private readonly debounceMs = 2000; // Prevent write flooding
  private readonly contextFilePath: string;

  private constructor() {
    // Use app.getPath for proper path resolution in main process
    const userDataPath = app.getPath('userData');
    this.contextFilePath = path.join(userDataPath, 'context', 'discovery_questions.md');
  }

  static getInstance(): DiscoveryManager {
    if (!DiscoveryManager.instance) {
      DiscoveryManager.instance = new DiscoveryManager();
    }
    return DiscoveryManager.instance;
  }

  /**
   * Analyze transcript for discovery-worthy information
   */
  detectDiscovery(transcript: string): DiscoveryResult | null {
    const normalized = transcript.toLowerCase().trim();
    
    // Skip if too short or already processed
    if (normalized.length < 20 || this.discoveryHistory.has(normalized)) {
      return null;
    }

    // Pattern matching
    const patterns = [
      { type: 'company_info', regex: /we (are|'re|use|have|work with).{10,}/i, confidence: 0.8 },
      { type: 'tech_stack', regex: /(using|built with|migrating to|stack includes).{10,}/i, confidence: 0.9 },
      { type: 'timeline', regex: /(\d+[-–]\d+|within \d+)\s*(months?|weeks?|days?)/i, confidence: 0.95 },
      { type: 'team_structure', regex: /(\d+\s*(developers?|engineers?|team|members?))/i, confidence: 0.85 },
      { type: 'requirements', regex: /(must|need to|should|required to|expecting).{15,}/i, confidence: 0.7 },
      { type: 'pain_points', regex: /(problem|issue|challenge|struggle).{15,}/i, confidence: 0.75 },
    ];

    for (const pattern of patterns) {
      if (pattern.regex.test(transcript)) {
        return {
          type: pattern.type as any,
          content: transcript,
          timestamp: Date.now(),
          confidence: pattern.confidence,
        };
      }
    }

    return null;
  }

  /**
   * Format discovery as markdown Q&A entry
   */
  private formatAsMarkdown(discovery: DiscoveryResult): string {
    const timestamp = new Date(discovery.timestamp).toLocaleString();
    const typeLabel = discovery.type.replace(/_/g, ' ').toUpperCase();
    
    return `
---
**[${typeLabel}]** _(captured: ${timestamp})_
> ${discovery.content}

`;
  }

  /**
   * Append discovery to context file (async, non-blocking)
   */
  async captureDiscovery(transcript: string): Promise<boolean> {
    try {
      const discovery = this.detectDiscovery(transcript);
      
      if (!discovery) {
        return false;
      }

      // Debounce writes
      const now = Date.now();
      if (now - this.lastWriteTime < this.debounceMs) {
        console.log('⏱️ Discovery write debounced');
        return false;
      }

      // Format and append
      const markdownEntry = this.formatAsMarkdown(discovery);
      
      // Ensure directory exists
      const dir = path.dirname(this.contextFilePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      // Append to file (triggers fs.watch auto-reload)
      fs.appendFileSync(this.contextFilePath, markdownEntry, 'utf8');
      
      // Track to prevent duplicates
      this.discoveryHistory.add(transcript.toLowerCase().trim());
      this.lastWriteTime = now;
      
      console.log(`✅ Discovery captured: [${discovery.type}] "${transcript.slice(0, 50)}..."`);
      
      // NEW: Update topic alignment context
      topicAlignmentGate.updateTopic(discovery.type, discovery.content);
      
      // Optional: Log to structured JSON file
      this.logDiscovery(discovery);
      
      return true;
    } catch (error) {
      console.error('❌ Failed to capture discovery:', error);
      return false;
    }
  }

  /**
   * Optional: Maintain structured discovery log
   */
  private logDiscovery(discovery: DiscoveryResult): void {
    try {
      const logPath = path.join(__dirname, '..', '..', 'logs', 'discovery_log.json');
      const logDir = path.dirname(logPath);
      
      if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
      }

      let logs: DiscoveryResult[] = [];
      if (fs.existsSync(logPath)) {
        logs = JSON.parse(fs.readFileSync(logPath, 'utf8'));
      }
      
      logs.push(discovery);
      
      // Keep last 100 entries
      if (logs.length > 100) {
        logs = logs.slice(-100);
      }
      
      fs.writeFileSync(logPath, JSON.stringify(logs, null, 2), 'utf8');
    } catch (error) {
      console.error('Failed to log discovery:', error);
    }
  }

  /**
   * Clear discovery history (for new interview sessions)
   */
  resetSession(): void {
    this.discoveryHistory.clear();
    console.log('🔄 Discovery session reset');
  }
}

// Export singleton instance
export const discoveryManager = DiscoveryManager.getInstance();
