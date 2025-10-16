import { PromptConfig, ContextData } from '../contexts/PromptContext';

export interface SuggestionResult {
  suggestion: string;
  intent: string;
  isDuplicate: boolean;
}

export class SuggestionEngine {
  private suggestionHistory: string[] = [];
  private readonly maxHistorySize = 5;
  private isProcessing = false;
  private lastProcessTime = 0;
  private readonly minProcessInterval = 350; // Allow even faster cadence for streaming responses

  /**
   * Extract client intent from transcript using simple heuristics
   * Can be enhanced with OpenAI-based intent extraction later
   */
  private extractIntent(transcript: string): string {
    const text = transcript.toLowerCase().trim();
    
    // Question patterns
    if (text.includes('?') ||
        text.startsWith('what') || text.startsWith('how') || text.startsWith('why') ||
        text.startsWith('when') || text.startsWith('where') ||
        text.startsWith('can you') || text.startsWith('could you') || text.startsWith('would you') ||
        text.startsWith('ano') || text.startsWith('paano') || text.startsWith('bakit') ||
        text.startsWith('kailan') || text.startsWith('saan') || text.startsWith('pwede') ||
        text.startsWith('maaari bang')) {
      return 'question';
    }

    // Technical discussion patterns
    if (text.includes('architecture') || text.includes('design') || text.includes('system') ||
        text.includes('framework') || text.includes('technology') || text.includes('stack') ||
        text.includes('microservice') || text.includes('infrastructure') ||
        text.includes('arkitektura') || text.includes('disenyo') ||
        text.includes('sistema') || text.includes('teknolohiya')) {
      return 'technical_discussion';
    }

    // Experience/background patterns
    if (text.includes('experience') || text.includes('background') || text.includes('worked') ||
        text.includes('project') || text.includes('previous') || text.includes('before') ||
        text.includes('karanasan') || text.includes('nagtrabaho') ||
        text.includes('proyekto') || text.includes('nakaraan')) {
      return 'experience_inquiry';
    }

    // Problem-solving patterns
    if (text.includes('problem') || text.includes('challenge') || text.includes('issue') ||
        text.includes('difficult') || text.includes('trouble') || text.includes('solve') ||
        text.includes('suliranin') || text.includes('hamon') ||
        text.includes('isyu') || text.includes('solusyon')) {
      return 'problem_solving';
    }

    // Process/methodology patterns
    if (text.includes('process') || text.includes('method') || text.includes('approach') ||
        text.includes('workflow') || text.includes('how do you') || text.includes('methodology') ||
        text.includes('proseso') || text.includes('paraan') ||
        text.includes('daloy') || text.includes('metodolohiya')) {
      return 'process_inquiry';
    }
    
    // General conversation
    return 'general_conversation';
  }

  /**
   * Extract key phrases from text for semantic comparison
   */
  private extractKeyPhrases(text: string): string[] {
    const phrases: string[] = [];
    
    // Extract time-related phrases (3-4 months, 12 weeks, etc.)
    const timeMatches = text.match(/\d+[-–]\d+\s*(months?|weeks?|days?|years?)|within\s+\d+\s*(months?|weeks?)/gi);
    if (timeMatches) phrases.push(...timeMatches.map(m => m.toLowerCase()));
    
    // Extract common project terms
    const projectTerms = ['mvp', 'minimum viable product', 'prototype', 'demo', 'poc', 'proof of concept', 'pilot'];
    projectTerms.forEach(term => {
      if (text.includes(term)) phrases.push(term);
    });

    const filipinoProjectTerms = ['proyekto', 'balangkas', 'halimbawa', 'pagpapatunay', 'pagpapakita'];
    filipinoProjectTerms.forEach(term => {
      if (text.includes(term)) phrases.push(term);
    });

    // Extract key verbs
    const keyVerbs = ['estimate', 'deliver', 'build', 'develop', 'create', 'launch', 'optimize'];
    keyVerbs.forEach(verb => {
      if (text.includes(verb)) phrases.push(verb);
    });

    const filipinoVerbs = ['maghatid', 'magbuo', 'magde-develop', 'magdevelop', 'magpapatupad', 'maglunsad'];
    filipinoVerbs.forEach(verb => {
      if (text.includes(verb)) phrases.push(verb);
    });

    return phrases;
  }

  /**
   * Check if suggestion is duplicate against recent history
   */
  private isDuplicateSuggestion(newSuggestion: string, recentSuggestions: string[]): boolean {
    if (!newSuggestion.trim()) return true;
    
    const normalizedNew = this.normalizeText(newSuggestion);
    const newKeyPhrases = this.extractKeyPhrases(normalizedNew);
    
    return recentSuggestions.some(suggestion => {
      const normalizedExisting = this.normalizeText(suggestion);
      const existingKeyPhrases = this.extractKeyPhrases(normalizedExisting);
      
      // Check key phrase overlap
      const matchingPhrases = newKeyPhrases.filter(p => existingKeyPhrases.includes(p));
      
      // If 2+ key phrases match (especially time + project term), consider duplicate
      if (matchingPhrases.length >= 2) {
        console.log('🚫 Duplicate detected via key phrases:', matchingPhrases);
        return true;
      }
      
      // Fall back to text similarity
      const similarity = this.calculateSimilarity(normalizedNew, normalizedExisting);
      if (similarity > 0.7) {
        console.log('🚫 Duplicate detected via similarity:', similarity.toFixed(2));
        return true;
      }
      
      return false;
    });
  }

  /**
   * Normalize text for comparison (remove punctuation, lowercase, etc.)
   */
  private normalizeText(text: string): string {
    return text.toLowerCase()
      .replace(/[^\w\s]/g, '') // Remove punctuation
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
  }

  /**
   * Calculate text similarity using simple word overlap
   */
  private calculateSimilarity(text1: string, text2: string): number {
    const words1 = text1.split(' ');
    const words2 = text2.split(' ');
    
    const intersection = words1.filter(word => words2.includes(word));
    const union = [...new Set([...words1, ...words2])];
    
    return intersection.length / union.length;
  }

  /**
   * Generate suggestion using OpenAI with streaming
   */
  private async generateSuggestionStream(
    intent: string, 
    transcript: string, 
    config: PromptConfig, 
    contextData: ContextData,
    onChunk: (content: string) => void,
    onComplete: () => void
  ): Promise<void> {
    try {
      const briefPrompt = this.buildBriefPrompt(intent, transcript, config, contextData);
      
      const apiConfig = await window.electronAPI.getConfig();
      
      // Set up stream listener
      const streamListener = (event: any, data: any) => {
        if (data.content) {
          onChunk(data.content);
        }
        if (data.done) {
          window.electronAPI.ipcRenderer.removeListener('openai-stream-chunk', streamListener);
          onComplete();
        }
      };
      
      window.electronAPI.ipcRenderer.on('openai-stream-chunk', streamListener);
      
      await window.electronAPI.callOpenAIStream({
        config: apiConfig,
        messages: [
          { role: "system", content: briefPrompt }
        ]
      });
    } catch (error) {
      console.error('Error generating streaming suggestion:', error);
      onComplete();
    }
  }

  /**
   * Generate suggestion using OpenAI with brief prompt (legacy method)
   */
  private async generateSuggestion(
    intent: string, 
    transcript: string, 
    config: PromptConfig, 
    contextData: ContextData
  ): Promise<string> {
    try {
      const briefPrompt = this.buildBriefPrompt(intent, transcript, config, contextData);
      
      const apiConfig = await window.electronAPI.getConfig();
      
      const response = await window.electronAPI.callOpenAI({
        config: apiConfig,
        messages: [
          { role: "system", content: briefPrompt }
        ]
      });

      if ('error' in response) {
        throw new Error(response.error);
      }

      return response.content.trim();
    } catch (error) {
      console.error('Error generating suggestion:', error);
      return '';
    }
  }

  /**
   * Build brief system prompt for suggestion generation
   */
  private buildBriefPrompt(
    intent: string, 
    transcript: string, 
    config: PromptConfig, 
    contextData: ContextData
  ): string {
    const parts: string[] = [];
    
    // Core instruction
    parts.push('You are a real-time suggestion assistant for a Filipino developer in an interview.');
    parts.push('Generate ONE actionable sentence (1-2 sentences max) that the developer should say next.');
    parts.push('Use Filipino-English style (Barok English) - natural but clear.');
    parts.push('Be confident, direct, and first-person.');
    parts.push('NO explanations, NO meta-commentary, NO repetition of previous suggestions.');
    
    // Add context if available
    if (contextData.resume) {
      parts.push(`\n=== YOUR PROFILE ===\n${contextData.resume.substring(0, 500)}...`);
    }
    
    if (contextData.jobPost) {
      parts.push(`\n=== JOB REQUIREMENTS ===\n${contextData.jobPost.substring(0, 300)}...`);
    }
    
    // Add behavior rules if enabled
    if (config.behaviorEnabled) {
      parts.push(`\n=== BEHAVIOR RULES ===\n${config.behaviorRules.substring(0, 400)}...`);
    }
    
    // Add language guide if enabled
    if (config.languageEnabled) {
      parts.push(`\n=== LANGUAGE STYLE ===\n${config.languageGuide.substring(0, 300)}...`);
    }
    
    // Add current context
    parts.push(`\n=== CURRENT SITUATION ===`);
    parts.push(`Client Intent: ${intent}`);
    parts.push(`Client Statement: "${transcript}"`);
    parts.push(`\nGenerate your response suggestion:`);
    
    return parts.join('\n');
  }

  /**
   * Process transcript and generate streaming suggestion
   */
  async processTranscriptStream(
    transcript: string,
    config: PromptConfig,
    contextData: ContextData,
    onChunk: (content: string) => void,
    onComplete: (intent: string, isDuplicate: boolean) => void
  ): Promise<void> {
    // Prevent rapid-fire processing
    const now = Date.now();
    if (now - this.lastProcessTime < this.minProcessInterval) {
      console.log('⏱️ Too soon - waiting for minimum interval');
      onComplete('', true);
      return;
    }
    
    if (this.isProcessing) {
      console.log('🔒 Already processing - skipping');
      onComplete('', true);
      return;
    }

    this.isProcessing = true;
    this.lastProcessTime = now;

    try {
      // Extract intent
      const intent = this.extractIntent(transcript);
      console.log('🎯 Extracted intent:', intent);
      
      let fullSuggestion = '';
      
      // Generate streaming suggestion
      await this.generateSuggestionStream(
        intent, 
        transcript, 
        config, 
        contextData,
        (chunk: string) => {
          fullSuggestion += chunk;
          onChunk(chunk);
        },
        () => {
          // Check for duplicates
          const isDuplicate = this.isDuplicateSuggestion(fullSuggestion, this.suggestionHistory);
          
          // Update history if not duplicate
          if (!isDuplicate && fullSuggestion.trim()) {
            this.suggestionHistory.push(fullSuggestion);
            if (this.suggestionHistory.length > this.maxHistorySize) {
              this.suggestionHistory.shift(); // Remove oldest
            }
            console.log('✅ New unique suggestion added to history');
          }
          
          onComplete(intent, isDuplicate);
        }
      );
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Process transcript and generate suggestion (legacy method)
   */
  async processTranscript(
    transcript: string,
    config: PromptConfig,
    contextData: ContextData
  ): Promise<SuggestionResult> {
    // Prevent rapid-fire processing
    const now = Date.now();
    if (now - this.lastProcessTime < this.minProcessInterval) {
      console.log('⏱️ Too soon - waiting for minimum interval');
      return { suggestion: '', intent: '', isDuplicate: true };
    }
    
    if (this.isProcessing) {
      console.log('🔒 Already processing - skipping');
      return { suggestion: '', intent: '', isDuplicate: true };
    }

    this.isProcessing = true;
    this.lastProcessTime = now;

    try {
      // Extract intent
      const intent = this.extractIntent(transcript);
      console.log('🎯 Extracted intent:', intent);
      
      // Generate suggestion
      const suggestion = await this.generateSuggestion(intent, transcript, config, contextData);
      
      // Check for duplicates
      const isDuplicate = this.isDuplicateSuggestion(suggestion, this.suggestionHistory);
      
      // Update history if not duplicate
      if (!isDuplicate && suggestion.trim()) {
        this.suggestionHistory.push(suggestion);
        if (this.suggestionHistory.length > this.maxHistorySize) {
          this.suggestionHistory.shift(); // Remove oldest
        }
        console.log('✅ New unique suggestion added to history');
      }
      
      return {
        suggestion: isDuplicate ? '' : suggestion,
        intent,
        isDuplicate
      };
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Clear suggestion history
   */
  clearHistory(): void {
    this.suggestionHistory = [];
  }

  /**
   * Get current suggestion history (for debugging)
   */
  getHistory(): string[] {
    return [...this.suggestionHistory];
  }
}

// Export singleton instance
export const suggestionEngine = new SuggestionEngine();
