type FileStatus = 'loaded' | 'missing' | 'error';

export interface ContextFilesPayload {
  data: {
    resume: string;
    jobPost: string;
    discoveryQuestions: string;
    skillsKnowledge: string;
    workflowMethod: string;
  };
  status: {
    resume: FileStatus;
    jobPost: FileStatus;
    discoveryQuestions: FileStatus;
    skillsKnowledge: FileStatus;
    workflowMethod: FileStatus;
  };
  timestamp: number;
}

export interface PromptFilesPayload {
  data: {
    behaviorRules: string;
    languageGuide: string;
    responseStyle: string;
  };
  status: {
    behaviorRules: FileStatus;
    languageGuide: FileStatus;
    responseStyle: FileStatus;
  };
  timestamp: number;
}

export interface ElectronAPI {
  saveTempAudioFile(audioEncoded: ArrayBuffer): unknown;
  transcribeAudioFile(tempFilePath: any, arg1: { primaryLanguage: string; secondaryLanguage: string; api_base: any; openai_key: any; }): TranscriptionResult | PromiseLike<TranscriptionResult>;
  getConfig: () => Promise<any>;
  setConfig: (config: any) => Promise<void>;
  testAPIConfig: (config: any) => Promise<{ success: boolean, error?: string }>;
  startRecording: () => Promise<Array<{id: string, name: string, thumbnail: string}>>;
  parsePDF: (pdfBuffer: ArrayBuffer) => Promise<{ text: string, error?: string }>;
  processImage: (imagePath: string) => Promise<string>;
  highlightCode: (code: string, language: string) => Promise<string>;
  loadContextFiles: () => Promise<ContextFilesPayload>;
  loadPromptFiles: () => Promise<PromptFilesPayload>;
  onContextFilesUpdated: (callback: (payload: ContextFilesPayload) => void) => () => void;
  onPromptFilesUpdated: (callback: (payload: PromptFilesPayload) => void) => () => void;
  getSystemAudioStream: () => Promise<string[]>;
  ipcRenderer: {
    removeAllListeners: any;
    invoke(channel: string, ...args: any[]): Promise<any>;
    on(channel: string, listener: (event: any, ...args: any[]) => void): void;
    removeListener(channel: string, listener: (...args: any[]) => void): void;
  };
  callOpenAI: (params: {
    config: any;
    messages: any[];
    signal?: AbortSignal;
  }) => Promise<{ content: string } | { error: string }>;
  transcribeAudio: (audioBuffer: ArrayBuffer, config: any) => Promise<TranscriptionResult>;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

declare global {
  interface MediaTrackConstraintSet {
    chromeMediaSource?: string;
    mandatory?: {
      chromeMediaSource?: string;
      chromeMediaSourceId?: string;
    };
  }
}
