import { contextBridge, ipcRenderer } from 'electron';
import fs from 'fs';
import path from 'path';

contextBridge.exposeInMainWorld('electronAPI', {
  getConfig: () => ipcRenderer.invoke('get-config'),
  setConfig: (config: any) => ipcRenderer.invoke('set-config', config),
  testAPIConfig: (config: any) => ipcRenderer.invoke('test-api-config', config),
  parsePDF: (buffer: ArrayBuffer) => ipcRenderer.invoke('parsePDF', buffer),
  processImage: (path: string) => ipcRenderer.invoke('process-image', path),
  highlightCode: (code: string, language: string) => ipcRenderer.invoke('highlight-code', code, language),
  loadContextFiles: () => ipcRenderer.invoke('load-context-files'),
  loadPromptFiles: () => ipcRenderer.invoke('load-prompt-files'),
  checkASRHealth: (config: any) => ipcRenderer.invoke('check-asr-health', config),
  exportMetrics: () => ipcRenderer.invoke('export-metrics'),
  getMetricsSummary: () => ipcRenderer.invoke('get-metrics-summary'),
  captureDiscovery: (transcript: string) => ipcRenderer.invoke('capture-discovery', transcript),
  resetDiscoverySession: () => ipcRenderer.invoke('reset-discovery-session'),
  getTopicAlignmentStatus: () => ipcRenderer.invoke('get-topic-alignment-status'),
  onContextFilesUpdated: (listener: (payload: any) => void) => {
    const handler = (_event: unknown, payload: any) => listener(payload);
    ipcRenderer.on('context-files-updated', handler);
    return () => ipcRenderer.removeListener('context-files-updated', handler);
  },
  onPromptFilesUpdated: (listener: (payload: any) => void) => {
    const handler = (_event: unknown, payload: any) => listener(payload);
    ipcRenderer.on('prompt-files-updated', handler);
    return () => ipcRenderer.removeListener('prompt-files-updated', handler);
  },
  ipcRenderer: {
    invoke: (channel: string, ...args: any[]) => ipcRenderer.invoke(channel, ...args),
    send: (channel: string, ...args: any[]) => ipcRenderer.send(channel, ...args),
    on: (channel: string, listener: (event: any, ...args: any[]) => void) => {
      ipcRenderer.on(channel, listener);
      return () => ipcRenderer.removeListener(channel, listener);
    },
    removeListener: (channel: string, listener: (event: any, ...args: any[]) => void) => ipcRenderer.removeListener(channel, listener),
  },
  callOpenAI: (params: any) => ipcRenderer.invoke('callOpenAI', params),
  callOpenAIStream: (params: any) => ipcRenderer.invoke('callOpenAIStream', params),
  startASR: (config: any) => ipcRenderer.invoke('start-asr', config),
  startLocalASR: (config: any) => ipcRenderer.invoke('start-local-asr', config),
  startDeepgram: (config: any) => ipcRenderer.invoke('start-deepgram', config),
  stopASR: () => ipcRenderer.invoke('stop-deepgram'),
  loadAudioProcessor: (): Promise<string> => ipcRenderer.invoke('load-audio-processor'),
  getSystemAudioStream: () => ipcRenderer.invoke('get-system-audio-stream'),
  transcribeAudioFile: (filePath: string, config: any) => ipcRenderer.invoke('transcribe-audio-file', filePath, config),
  saveTempAudioFile: (audioBuffer: ArrayBuffer) => ipcRenderer.invoke('save-temp-audio-file', audioBuffer),
  transcribeAudio: (audioBuffer: ArrayBuffer, config: any) => ipcRenderer.invoke('transcribe-audio', audioBuffer, config),
});
