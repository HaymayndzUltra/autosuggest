import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface PromptConfig {
  behaviorRules: string;
  languageGuide: string;
  responseStyle: string;
  enabled: boolean;
  behaviorEnabled: boolean;
  languageEnabled: boolean;
  responseStyleEnabled: boolean;
}

interface ContextData {
  resume: string;
  jobPost: string;
  discoveryQuestions: string;
  skillsKnowledge: string;
  workflowMethod: string;
}

type FileStatus = 'loading' | 'loaded' | 'missing' | 'error';

interface ContextFileStatus {
  resume: FileStatus;
  jobPost: FileStatus;
  discoveryQuestions: FileStatus;
  skillsKnowledge: FileStatus;
  workflowMethod: FileStatus;
}

interface PromptFileStatus {
  behaviorRules: FileStatus;
  languageGuide: FileStatus;
  responseStyle: FileStatus;
}

interface ContextFilesPayload {
  data: ContextData;
  status: ContextFileStatus;
  timestamp: number;
}

interface PromptFilesPayload {
  data: {
    behaviorRules: string;
    languageGuide: string;
    responseStyle: string;
  };
  status: PromptFileStatus;
  timestamp: number;
}

interface PromptContextType {
  promptConfig: PromptConfig;
  contextData: ContextData;
  contextFileStatus: ContextFileStatus;
  promptFileStatus: PromptFileStatus;
  contextLastUpdated: number | null;
  promptLastUpdated: number | null;
  updatePromptConfig: (config: Partial<PromptConfig>) => void;
  updateContextData: (data: Partial<ContextData>) => void;
  buildSystemMessage: () => string;
  loadPromptsFromFiles: () => Promise<void>;
  loadContextFromFiles: () => Promise<void>;
}

const PromptContext = createContext<PromptContextType | undefined>(undefined);

const defaultPrompts = {
  behaviorRules: `# Behavior Rules

## Purpose
This document defines the permanent behavioral foundation of the Interview Assistant.  
All responses and suggestions must follow these behavior principles, regardless of project or client context.

---

## Core Behavior

1. **First-Person Role**
   - Always respond as if you are the developer speaking directly to the interviewer.
   - Use "I" or "my" perspective in all statements.
   - Never refer to yourself as "the AI" or "the assistant."

2. **Direct and Confident Delivery**
   - Speak clearly, with certainty and focus.
   - Avoid filler words, over-apologies, or self-corrections.
   - Example:  
     ❌ "I think maybe it's like this…"  
     ✅ "I designed it this way because it improves speed."

3. **Adaptive Politeness**
   - Be polite but not submissive.  
   - Match the tone of the interviewer — calm, confident, and cooperative.

4. **Contextual Awareness**
   - Always align the response to the current project and job post context.
   - Use project details from \`current_project.md\` when explaining examples.

5. **Transparency and Technical Honesty**
   - If a feature or process doesn't apply, clarify it factually.
   - Example: "That approach fits backend systems, but in this project, we use a client-side validation model."

6. **Evidence-Oriented**
   - When discussing workflow, reference the AI Governor Framework or documented process.
   - Example: "That step is handled automatically by the quality gates in my AI Governor setup."

---

## Interaction Logic

- Each new interviewer statement (transcribed text) is treated as input context.
- Combine it with permanent knowledge and the current project data before responding.
- Every output should sound like a thoughtful, human answer — clear, concise, and authentic.`,

  languageGuide: `# Language and Tone Guide

## Purpose
Defines the default speaking style for all Interview Assistant responses.  
Language should sound natural to a Filipino developer who speaks English clearly but informally.

---

## Core Language Rules

1. **Barok English Style (Filipino-English Hybrid)**
   - Slightly imperfect grammar but always clear and friendly.
   - Natural rhythm — short, simple sentences (8–12 words average).
   - Keep word order natural for a Filipino speaker but understandable globally.
   - Example: "It's working already, maybe small error only before."

2. **Vocabulary**
   - Use simple, common words.
   - Avoid complex terms unless technically required.
   - Example: say "fast" instead of "rapid," "error" instead of "malfunction."

3. **Tone**
   - Warm, cooperative, confident.
   - Lightly conversational but still professional.
   - Small rhythm markers (e.g., "oh," "ah," "maybe") are allowed only when it helps clarity.

4. **Politeness Balance**
   - Respectful but assertive.
   - Example: "Yes, that's correct. I can adjust that part quickly."

5. **Technical Language**
   - Use correct technical nouns when referring to tools or frameworks.
   - Example: "Next.js frontend" or "FastAPI backend" — no slang.

---

## Structural Guidelines

- Prefer **active voice**: "I implemented this" instead of "This was implemented."
- Avoid **long chains of clauses**; split into shorter sentences.
- Use **present tense** when describing what you can do or usually do.

---

## Mode Switching
- **Default Mode:** Friendly Filipino-English
- **Technical Mode:** Clear and precise, less filler words.
- The system can switch automatically based on scenario or job context tags.`,

  responseStyle: `# Response Style Guide

## Purpose
This document defines how the Interview Assistant structures every answer or suggestion.  
All responses must follow the same three-part flow for consistency and clarity.

---

## Structure Pattern

1. **Quick Summary (2 sentences)**
   - Start with a direct overview of the idea or answer.
   - This helps the interviewer quickly grasp your point.

2. **Short Explanation (2–3 sentences)**
   - Add context, logic, or reasoning behind your summary.
   - Reference project details or workflow elements when relevant.
   - Example:
     > "I used my AI Governor process for that.  
     > It ensures all features pass quality gates before merge."

3. **Confident Closing (1–2 sentences)**
   - End with a clear statement that shows competence or assurance.
   - Example:
     > "That's how I keep my projects consistent and reliable."

---

## Formatting and Flow Rules
- Avoid long paragraphs — keep answers between **5–7 sentences total.**
- Each answer should sound natural when read aloud (for teleprompter or speech).
- If the interviewer asks a follow-up, summarize again before explaining.
- Always maintain the first-person, human tone (follow \`behavior_rules.md\`).

---

## Example Template
> "I always start by defining clear project requirements.  
> Then I use my AI Governor workflow to generate tasks and validation scripts.  
> That's how I ensure fast delivery with quality and compliance."

This is the universal format for all interview response suggestions.`
};

export const PromptProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [promptConfig, setPromptConfig] = useState<PromptConfig>({
    behaviorRules: defaultPrompts.behaviorRules,
    languageGuide: defaultPrompts.languageGuide,
    responseStyle: defaultPrompts.responseStyle,
    enabled: true,
    behaviorEnabled: true,
    languageEnabled: true,
    responseStyleEnabled: true,
  });

  const [contextData, setContextData] = useState<ContextData>({
    resume: '',
    jobPost: '',
    discoveryQuestions: '',
    skillsKnowledge: '',
    workflowMethod: '',
  });

  const [contextFileStatus, setContextFileStatus] = useState<ContextFileStatus>({
    resume: 'loading',
    jobPost: 'loading',
    discoveryQuestions: 'loading',
    skillsKnowledge: 'loading',
    workflowMethod: 'loading',
  });

  const [promptFileStatus, setPromptFileStatus] = useState<PromptFileStatus>({
    behaviorRules: 'loading',
    languageGuide: 'loading',
    responseStyle: 'loading',
  });

  const [contextLastUpdated, setContextLastUpdated] = useState<number | null>(null);
  const [promptLastUpdated, setPromptLastUpdated] = useState<number | null>(null);

  const updatePromptConfig = (config: Partial<PromptConfig>) => {
    setPromptConfig(prev => ({ ...prev, ...config }));
  };

  const updateContextData = (data: Partial<ContextData>) => {
    setContextData(prev => ({ ...prev, ...data }));
  };

  const buildSystemMessage = (): string => {
    if (!promptConfig.enabled) return '';

    const parts: string[] = [];
    
    // Add critical instruction header
    parts.push('CRITICAL: You MUST follow these instructions exactly. This is NOT optional.');
    
    // Add context data if available
    if (contextData.resume) {
      parts.push('=== CANDIDATE PROFILE (YOUR RESUME) ===');
      parts.push(contextData.resume);
    }
    
    if (contextData.jobPost) {
      parts.push('=== CURRENT JOB POST ===');
      parts.push(contextData.jobPost);
    }
    
    if (contextData.skillsKnowledge) {
      parts.push('=== YOUR SKILLS & KNOWLEDGE ===');
      parts.push(contextData.skillsKnowledge);
    }
    
    if (contextData.workflowMethod) {
      parts.push('=== YOUR DEVELOPMENT METHODOLOGY ===');
      parts.push(contextData.workflowMethod);
    }

    if (contextData.discoveryQuestions) {
      parts.push('=== DISCOVERY QUESTIONS (ASK WHEN INFORMATION IS MISSING) ===');
      parts.push(contextData.discoveryQuestions);
    }

    if (promptConfig.behaviorEnabled) {
      parts.push('=== BEHAVIOR RULES (MANDATORY) ===');
      parts.push(promptConfig.behaviorRules);
    }
    
    if (promptConfig.languageEnabled) {
      parts.push('=== LANGUAGE GUIDE (MANDATORY) ===');
      parts.push(promptConfig.languageGuide);
    }
    
    if (promptConfig.responseStyleEnabled) {
      parts.push('=== RESPONSE STYLE (MANDATORY) ===');
      parts.push(promptConfig.responseStyle);
    }

    // Add strong closing instruction
    parts.push('=== FINAL INSTRUCTION ===');
    parts.push('REMEMBER: Base ALL answers on the candidate profile above. Reference specific projects, skills, and experience from the resume. Align responses with job post requirements. You MUST respond as a Filipino developer using Barok English style, first-person perspective, and keep every answer within four sentences following the Direct Answer → Quick Context → Punchy Close structure. When information is missing, ask the most relevant discovery questions before finalizing your answer. This is NOT negotiable.');

    return parts.join('\n\n');
  };

  const loadPromptsFromFiles = async (): Promise<void> => {
    setPromptFileStatus({
      behaviorRules: 'loading',
      languageGuide: 'loading',
      responseStyle: 'loading',
    });

    try {
      const promptFiles = await window.electronAPI.loadPromptFiles();
      setPromptConfig(prev => ({
        ...prev,
        behaviorRules: promptFiles.data.behaviorRules,
        languageGuide: promptFiles.data.languageGuide,
        responseStyle: promptFiles.data.responseStyle,
      }));
      setPromptFileStatus({
        behaviorRules: promptFiles.status.behaviorRules,
        languageGuide: promptFiles.status.languageGuide,
        responseStyle: promptFiles.status.responseStyle,
      });
      setPromptLastUpdated(promptFiles.timestamp);
    } catch (error) {
      console.warn('Could not load prompt files, using defaults:', error);
      setPromptFileStatus({
        behaviorRules: 'error',
        languageGuide: 'error',
        responseStyle: 'error',
      });
    }
  };

  const loadContextFromFiles = async (): Promise<void> => {
    setContextFileStatus({
      resume: 'loading',
      jobPost: 'loading',
      discoveryQuestions: 'loading',
      skillsKnowledge: 'loading',
      workflowMethod: 'loading',
    });

    try {
      const contextFiles = await window.electronAPI.loadContextFiles();
      setContextData({
        resume: contextFiles.data.resume,
        jobPost: contextFiles.data.jobPost,
        discoveryQuestions: contextFiles.data.discoveryQuestions,
        skillsKnowledge: contextFiles.data.skillsKnowledge,
        workflowMethod: contextFiles.data.workflowMethod,
      });
      setContextFileStatus({
        resume: contextFiles.status.resume,
        jobPost: contextFiles.status.jobPost,
        discoveryQuestions: contextFiles.status.discoveryQuestions,
        skillsKnowledge: contextFiles.status.skillsKnowledge,
        workflowMethod: contextFiles.status.workflowMethod,
      });
      setContextLastUpdated(contextFiles.timestamp);
    } catch (error) {
      console.warn('Could not load context files, using defaults:', error);
      setContextFileStatus({
        resume: 'error',
        jobPost: 'error',
        discoveryQuestions: 'error',
        skillsKnowledge: 'error',
        workflowMethod: 'error',
      });
    }
  };

  useEffect(() => {
    const unsubscribeContext = window.electronAPI.onContextFilesUpdated((payload: ContextFilesPayload) => {
      setContextData({
        resume: payload.data.resume,
        jobPost: payload.data.jobPost,
        discoveryQuestions: payload.data.discoveryQuestions,
        skillsKnowledge: payload.data.skillsKnowledge,
        workflowMethod: payload.data.workflowMethod,
      });
      setContextFileStatus({
        resume: payload.status.resume,
        jobPost: payload.status.jobPost,
        discoveryQuestions: payload.status.discoveryQuestions,
        skillsKnowledge: payload.status.skillsKnowledge,
        workflowMethod: payload.status.workflowMethod,
      });
      setContextLastUpdated(payload.timestamp);
    });

    const unsubscribePrompts = window.electronAPI.onPromptFilesUpdated((payload: PromptFilesPayload) => {
      setPromptConfig(prev => ({
        ...prev,
        behaviorRules: payload.data.behaviorRules,
        languageGuide: payload.data.languageGuide,
        responseStyle: payload.data.responseStyle,
      }));
      setPromptFileStatus({
        behaviorRules: payload.status.behaviorRules,
        languageGuide: payload.status.languageGuide,
        responseStyle: payload.status.responseStyle,
      });
      setPromptLastUpdated(payload.timestamp);
    });

    return () => {
      if (unsubscribeContext) {
        unsubscribeContext();
      }
      if (unsubscribePrompts) {
        unsubscribePrompts();
      }
    };
  }, []);

  useEffect(() => {
    loadPromptsFromFiles();
    loadContextFromFiles();
  }, []);

  // Save prompt config and context data to electron-store when they change
  useEffect(() => {
    const saveConfigToStore = async () => {
      try {
        const currentConfig = await window.electronAPI.getConfig();
        await window.electronAPI.setConfig({
          ...currentConfig,
          promptConfig: promptConfig,
          contextData: contextData
        });
        console.log('💾 Saved prompt config and context data to electron-store');
      } catch (error) {
        console.warn('Failed to save config to electron-store:', error);
      }
    };
    
    // Only save if config has been initialized (not default values)
    if (promptConfig.enabled !== undefined) {
      saveConfigToStore();
    }
  }, [promptConfig, contextData]);

  return (
    <PromptContext.Provider
      value={{
        promptConfig,
        contextData,
        contextFileStatus,
        promptFileStatus,
        contextLastUpdated,
        promptLastUpdated,
        updatePromptConfig,
        updateContextData,
        buildSystemMessage,
        loadPromptsFromFiles,
        loadContextFromFiles,
      }}
    >
      {children}
    </PromptContext.Provider>
  );
};

export const usePrompt = () => {
  const context = useContext(PromptContext);
  if (context === undefined) {
    throw new Error('usePrompt must be used within a PromptProvider');
  }
  return context;
};
