import { DiscoveryResult } from './discoveryManager';

export interface TopicRecord {
  topic: string;        // Discovery type or manual label
  keywords: string[];   // Extracted key terms
  timestamp: number;
  text: string;         // Original transcript snippet
}

export interface AlignmentResult {
  isAligned: boolean;
  confidence: number;   // 0-1 similarity score
  activeTopic: string | null;
  reason?: string;      // Debug info
}

export class TopicAlignmentGate {
  private recentTopics: TopicRecord[] = [];
  private readonly topicWindowMs = 60000; // 1 minute context horizon
  private readonly alignmentThreshold = 0.35; // Lower threshold for keyword-based similarity
  private readonly minTopicsForAlignment = 1; // Start enforcing after 1 topic established

  /**
   * Update active topic context from new transcript or discovery
   */
  updateTopic(topic: string, text: string): void {
    const keywords = this.extractKeywords(text);
    
    this.recentTopics.push({
      topic,
      keywords,
      timestamp: Date.now(),
      text: text.substring(0, 200), // Store snippet for debug
    });

    // Prune old topics outside time window
    const cutoff = Date.now() - this.topicWindowMs;
    this.recentTopics = this.recentTopics.filter(t => t.timestamp > cutoff);

    console.log(`📍 Topic updated: [${topic}] - Active topics: ${this.recentTopics.length}`);
  }

  /**
   * Check if proposed text (question/response) aligns with recent topics
   */
  checkAlignment(text: string): AlignmentResult {
    // No active topics → allow anything
    if (this.recentTopics.length < this.minTopicsForAlignment) {
      return {
        isAligned: true,
        confidence: 1.0,
        activeTopic: null,
        reason: 'No active topics yet - bootstrap mode',
      };
    }

    const textKeywords = this.extractKeywords(text);
    const recentTopic = this.recentTopics[this.recentTopics.length - 1];

    // Calculate keyword overlap similarity
    const similarity = this.calculateKeywordSimilarity(textKeywords, recentTopic.keywords);

    const isAligned = similarity >= this.alignmentThreshold;

    console.log(
      `🎯 Alignment check: ${isAligned ? '✅' : '🤫'} | ` +
      `Score: ${similarity.toFixed(2)} | ` +
      `Topic: [${recentTopic.topic}] | ` +
      `Text: "${text.substring(0, 50)}..."`
    );

    return {
      isAligned,
      confidence: similarity,
      activeTopic: recentTopic.topic,
      reason: isAligned
        ? `Aligned with ${recentTopic.topic}`
        : `Misaligned - expected ${recentTopic.topic} context`,
    };
  }

  /**
   * Extract significant keywords from text
   */
  private extractKeywords(text: string): string[] {
    // Lowercase and clean
    const cleaned = text.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    // Split into words
    const words = cleaned.split(' ');

    // Remove stop words (common English + Filipino)
    const stopWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
      'of', 'with', 'by', 'from', 'is', 'are', 'was', 'were', 'been', 'be',
      'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should',
      'can', 'could', 'may', 'might', 'must', 'shall', 'i', 'you', 'we', 'they',
      'ang', 'ng', 'sa', 'na', 'ay', 'mga', 'ko', 'mo', 'niya', 'natin',
    ]);

    const keywords = words.filter(word => 
      word.length > 2 && !stopWords.has(word)
    );

    // Return unique keywords
    return [...new Set(keywords)];
  }

  /**
   * Calculate keyword overlap similarity (Jaccard similarity)
   */
  private calculateKeywordSimilarity(keywords1: string[], keywords2: string[]): number {
    if (keywords1.length === 0 || keywords2.length === 0) {
      return 0;
    }

    const set1 = new Set(keywords1);
    const set2 = new Set(keywords2);

    // Intersection
    const intersection = [...set1].filter(k => set2.has(k)).length;

    // Union
    const union = new Set([...set1, ...set2]).size;

    // Jaccard similarity
    return intersection / union;
  }

  /**
   * Get current active topic for debugging
   */
  getActiveTopic(): string | null {
    if (this.recentTopics.length === 0) return null;
    return this.recentTopics[this.recentTopics.length - 1].topic;
  }

  /**
   * Get topic history for debugging
   */
  getTopicHistory(): TopicRecord[] {
    return [...this.recentTopics];
  }

  /**
   * Reset topic context (e.g., new interview session)
   */
  resetTopics(): void {
    this.recentTopics = [];
    console.log('🔄 Topic alignment reset');
  }
}

// Export singleton instance
export const topicAlignmentGate = new TopicAlignmentGate();
