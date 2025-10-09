export type ContextFileKey =
  | 'resume'
  | 'jobPost'
  | 'discoveryQuestions'
  | 'skillsKnowledge'
  | 'workflowMethod';

export type PromptFileKey = 'behaviorRules' | 'languageGuide' | 'responseStyle';

export interface WatchedFileStatus {
  exists: boolean;
  hasContent: boolean;
  path: string;
  lastUpdated: number;
  error?: string;
}

export interface ContextFilePayload {
  data: Record<ContextFileKey, string>;
  status: Record<ContextFileKey, WatchedFileStatus>;
}

export interface PromptFilePayload {
  data: Record<PromptFileKey, string>;
  status: Record<PromptFileKey, WatchedFileStatus>;
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
  loadContextFiles: () => Promise<ContextFilePayload>;
  loadPromptFiles: () => Promise<PromptFilePayload>;
  onContextFilesUpdated: (
    listener: (payload: ContextFilePayload) => void,
  ) => () => void;
  onPromptFilesUpdated: (
    listener: (payload: PromptFilePayload) => void,
  ) => () => void;
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
