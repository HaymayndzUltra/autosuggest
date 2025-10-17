export type ContextFileKey =
  | 'resume'
  | 'jobPost'
  | 'discoveryQuestions'
  | 'skillsKnowledge'
  | 'workflowMethod';

export type PromptFileKey = 'behaviorRules' | 'languageGuide' | 'responseStyle';

export type ASRProvider = 'auto' | 'local' | 'deepgram';

export interface ASRHealthStatus {
  healthy: boolean;
  latency?: number;
  error?: string;
  lastChecked?: number;
}

export interface ProviderSwitchEvent {
  from: 'local' | 'deepgram' | null;
  to: 'local' | 'deepgram' | null;
  reason: 'timeout' | 'errors' | 'manual' | 'health_check';
  timestamp: number;
}

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
  checkASRHealth: (config: any) => Promise<{ local: ASRHealthStatus, deepgram: ASRHealthStatus }>;
  ipcRenderer: {
    removeAllListeners: any;
    invoke(channel: string, ...args: any[]): Promise<any>;
    send(channel: string, ...args: any[]): void;
    on(channel: string, listener: (event: any, ...args: any[]) => void): void;
    removeListener(channel: string, listener: (...args: any[]) => void): void;
  };
  callOpenAI: (params: {
    config: any;
    messages: any[];
    signal?: AbortSignal;
  }) => Promise<{ content: string } | { error: string }>;
  callOpenAIStream: (params: {
    config: any;
    messages: any[];
  }) => Promise<{ success: boolean } | { error: string }>;
  startASR: (config: any) => Promise<{ success: boolean, error?: string }>;
  startLocalASR: (config: any) => Promise<{ success: boolean, error?: string }>;
  startDeepgram: (config: any) => Promise<{ success: boolean, error?: string }>;
  stopASR: () => Promise<void>;
  exportMetrics: () => Promise<{ success: boolean, data?: string, error?: string }>;
  getMetricsSummary: () => Promise<{ success: boolean, data?: any, error?: string }>;
  captureDiscovery: (transcript: string) => Promise<{ success: boolean, error?: string }>;
  resetDiscoverySession: () => Promise<{ success: boolean, error?: string }>;
  getTopicAlignmentStatus: () => Promise<{ success: boolean, activeTopic?: string, topicCount?: number, topics?: Array<{ topic: string, timestamp: number }>, error?: string }>;
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
