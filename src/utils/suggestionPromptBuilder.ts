import { PromptConfig, ContextData } from '../contexts/PromptContext';

export interface BriefPromptOptions {
  intent: string;
  transcript: string;
  maxTokens?: number;
  temperature?: number;
}

/**
 * Build optimized system prompts for brief suggestion generation
 */
export class SuggestionPromptBuilder {
  
  /**
   * Build a concise system prompt for real-time suggestions
   */
  static buildBriefPrompt(
    options: BriefPromptOptions,
    config: PromptConfig,
    contextData: ContextData
  ): string {
    const parts: string[] = [];
    
    // Core instruction - strict brevity
    parts.push('CRITICAL: You are a real-time suggestion assistant for a Filipino developer in an interview.');
    parts.push('Generate EXACTLY ONE actionable sentence (1-2 sentences max) that the developer should say next.');
    parts.push('Use Filipino-English style (Barok English) - natural rhythm, simple words, friendly but confident.');
    parts.push('Be direct, first-person perspective. NO explanations, NO meta-commentary, NO repetition.');
    parts.push('Output ONLY the suggested response - nothing else.');
    
    // Add essential context
    if (contextData.resume) {
      parts.push(`\n=== YOUR PROFILE ===`);
      parts.push(this.truncateText(contextData.resume, 400));
    }
    
    if (contextData.jobPost) {
      parts.push(`\n=== JOB REQUIREMENTS ===`);
      parts.push(this.truncateText(contextData.jobPost, 300));
    }
    
    // Add behavior rules if enabled
    if (config.behaviorEnabled) {
      parts.push(`\n=== BEHAVIOR RULES ===`);
      parts.push(this.truncateText(config.behaviorRules, 300));
    }
    
    // Add language guide if enabled  
    if (config.languageEnabled) {
      parts.push(`\n=== LANGUAGE STYLE ===`);
      parts.push(this.truncateText(config.languageGuide, 200));
    }
    
    // Add response style if enabled
    if (config.responseStyleEnabled) {
      parts.push(`\n=== RESPONSE STRUCTURE ===`);
      parts.push(this.truncateText(config.responseStyle, 200));
    }
    
    // Add current situation
    parts.push(`\n=== CURRENT SITUATION ===`);
    parts.push(`Detected Intent: ${options.intent}`);
    parts.push(`Client Statement: "${options.transcript}"`);
    
    // Final instruction
    parts.push(`\nGenerate your ONE sentence response suggestion:`);
    
    return parts.join('\n');
  }

  /**
   * Build a minimal prompt for ultra-brief responses
   */
  static buildMinimalPrompt(
    options: BriefPromptOptions,
    contextData: ContextData
  ): string {
    const parts: string[] = [];
    
    parts.push('You are a Filipino developer in an interview.');
    parts.push('Generate ONE short sentence (max 15 words) you should say next.');
    parts.push('Use Filipino-English style. Be confident and direct.');
    parts.push('NO explanations or meta-commentary.');
    
    if (contextData.resume) {
      parts.push(`\nYour background: ${this.truncateText(contextData.resume, 200)}`);
    }
    
    if (contextData.jobPost) {
      parts.push(`\nJob context: ${this.truncateText(contextData.jobPost, 150)}`);
    }
    
    parts.push(`\nClient said: "${options.transcript}"`);
    parts.push(`\nYour response:`);
    
    return parts.join('\n');
  }

  /**
   * Build intent-specific prompts for different conversation types
   */
  static buildIntentSpecificPrompt(
    options: BriefPromptOptions,
    config: PromptConfig,
    contextData: ContextData
  ): string {
    const basePrompt = this.buildBriefPrompt(options, config, contextData);
    
    const intentInstructions: Record<string, string> = {
      'question': 'The client asked a question. Provide a direct, helpful answer.',
      'technical_discussion': 'The client is discussing technical topics. Share relevant experience or knowledge.',
      'experience_inquiry': 'The client wants to know about your experience. Give a specific, relevant example.',
      'problem_solving': 'The client mentioned a problem. Suggest a solution or approach.',
      'process_inquiry': 'The client asked about your process. Explain your methodology briefly.',
      'general_conversation': 'The client is making general conversation. Respond naturally and professionally.'
    };
    
    const intentInstruction = intentInstructions[options.intent] || intentInstructions['general_conversation'];
    
    return `${basePrompt}\n\nIntent-specific instruction: ${intentInstruction}`;
  }

  /**
   * Truncate text to specified length while preserving word boundaries
   */
  private static truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    
    const truncated = text.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');
    
    if (lastSpace > maxLength * 0.8) {
      return truncated.substring(0, lastSpace) + '...';
    }
    
    return truncated + '...';
  }

  /**
   * Get optimized OpenAI parameters for brief suggestions
   */
  static getOptimizedParams(options: BriefPromptOptions): {
    maxTokens: number;
    temperature: number;
    topP: number;
  } {
    return {
      maxTokens: options.maxTokens || 60,
      temperature: options.temperature || 0.7,
      topP: 0.9
    };
  }
}
