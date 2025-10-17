/// <reference path="../renderer.d.ts" />

declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext
  }
}

import React, { useState, useEffect, useCallback, useRef } from "react";
import Timer from "../components/Timer";
import { useKnowledgeBase } from "../contexts/KnowledgeBaseContext";
import { usePrompt } from "../contexts/PromptContext";
import ErrorDisplay from "../components/ErrorDisplay";
import { useError } from "../contexts/ErrorContext";
import { useInterview } from "../contexts/InterviewContext";
import ReactMarkdown from 'react-markdown';
import { suggestionEngine } from '../utils/reasoningEngine';
import { ASRProviderController } from '../utils/providerController';

// Safety cap for EventEmitter to prevent listener warnings
require("events").EventEmitter.defaultMaxListeners = 30;

const InterviewPage: React.FC = () => {
  const { knowledgeBase, conversations, addConversation, clearConversations } = useKnowledgeBase();
  const { promptConfig, buildSystemMessage, contextData } = usePrompt();
  const { error, setError, clearError } = useError();
  const {
    currentText,
    setCurrentText,
    aiResult,
    setAiResult,
    displayedAiResult,
    setDisplayedAiResult,
    lastProcessedIndex,
    setLastProcessedIndex,
    liveSuggestion,
    setLiveSuggestion,
    suggestionHistory,
    setSuggestionHistory,
    lastTranscriptChunk,
    setLastTranscriptChunk
  } = useInterview();
  const [isRecording, setIsRecording] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAutoGPTEnabled, setIsAutoGPTEnabled] = useState(false);
  const [userMedia, setUserMedia] = useState<MediaStream | null>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [workletNode, setWorkletNode] = useState<AudioWorkletNode | null>(null);
  const resamplerWorkerRef = useRef<Worker | null>(null);
  const [autoSubmitTimer, setAutoSubmitTimer] = useState<NodeJS.Timeout | null>(null);
  const [activeASRProvider, setActiveASRProvider] = useState<'local' | 'deepgram' | null>(null);
  const [asrHealthStatus, setAsrHealthStatus] = useState<{ local: any, deepgram: any } | null>(null);
  const [showHelperModal, setShowHelperModal] = useState(false);
  const [discoveryModeEnabled, setDiscoveryModeEnabled] = useState(true);
  const aiResponseRef = useRef<HTMLDivElement>(null);
  const lastFinalTranscriptRef = useRef<string>('');
  const currentTextRef = useRef<string>(currentText);
  const lastProcessedIndexRef = useRef<number>(lastProcessedIndex);

  const markdownStyles = `
    .markdown-body {
      font-size: 16px;
      line-height: 1.5;
    }
    .markdown-body p {
      margin-bottom: 16px;
    }
    .markdown-body h1, .markdown-body h2, .markdown-body h3, .markdown-body h4, .markdown-body h5, .markdown-body h6 {
      margin-top: 24px;
      margin-bottom: 16px;
      font-weight: 600;
      line-height: 1.25;
    }
    .markdown-body code {
      padding: 0.2em 0.4em;
      margin: 0;
      font-size: 85%;
      background-color: rgba(27,31,35,0.05);
      border-radius: 3px;
    }
    .markdown-body pre {
      word-wrap: normal;
      padding: 16px;
      overflow: auto;
      font-size: 85%;
      line-height: 1.45;
      background-color: #f6f8fa;
      border-radius: 3px;
    }
  `;

  useEffect(() => {
    currentTextRef.current = currentText;
  }, [currentText]);

  useEffect(() => {
    lastProcessedIndexRef.current = lastProcessedIndex;
  }, [lastProcessedIndex]);

  useEffect(() => {
    loadConfig();
  }, []);

  const handleAskGPT = async (newContent?: string) => {
    const contentToProcess = newContent || currentText.slice(lastProcessedIndex).trim();
    if (!contentToProcess) return;

    setIsLoading(true);
    try {
      const config = await window.electronAPI.getConfig();
      
      // Build messages array with system prompts if enabled
      const messages: any[] = [];
      
      // DEBUG: Log prompt configuration
      console.log('🔧 PROMPT DEBUG INFO:');
      console.log('promptConfig.enabled:', promptConfig.enabled);
      console.log('promptConfig.behaviorEnabled:', promptConfig.behaviorEnabled);
      console.log('promptConfig.languageEnabled:', promptConfig.languageEnabled);
      console.log('promptConfig.responseStyleEnabled:', promptConfig.responseStyleEnabled);
      
      // Add system message if prompts are enabled
      if (promptConfig.enabled) {
        const systemMessage = buildSystemMessage();
        console.log('📝 System Message Length:', systemMessage.length);
        console.log('📝 System Message Preview:', systemMessage.substring(0, 200) + '...');
        
        if (systemMessage) {
          messages.push({ role: "system", content: systemMessage });
        }
      } else {
        console.log('❌ System prompts are DISABLED');
      }
      
      // Add knowledge base and conversation history
      messages.push(
        ...knowledgeBase.map(item => ({ role: "user", content: item })),
        ...conversations,
        { role: "user", content: contentToProcess }
      );

      // DEBUG: Log complete messages array
      console.log('📤 Complete Messages Array:', messages);
      console.log('📤 Messages Count:', messages.length);

      const response = await window.electronAPI.callOpenAI({
        config: config,
        messages: messages
      });

      if ('error' in response) {
        throw new Error(response.error);
      }

      const formattedResponse = response.content.trim();
      addConversation({ role: "user", content: contentToProcess });
      addConversation({ role: "assistant", content: formattedResponse });
      setDisplayedAiResult(prev => prev + (prev ? '\n\n' : '') + formattedResponse);
      setLastProcessedIndex(currentText.length);
    } catch (error) {
      setError('Failed to get response from GPT. Please try again.');
    } finally {
      setIsLoading(false);
      if (aiResponseRef.current) {
        aiResponseRef.current.scrollTop = aiResponseRef.current.scrollHeight;
      }
    }
  };

  const handleSuggestionGeneration = async (newContent: string) => {
    try {
      const normalizedContent = newContent.replace(/\s+/g, ' ').trim();
      if (!normalizedContent) {
        return;
      }

      // Use rolling buffer approach - get last 60 tokens for context
      const words = normalizedContent.match(/\S+/g) || [];
      const bufferSize = 60;
      const bufferedContent = words.slice(-bufferSize).join(' ');

      let currentSuggestion = '';
      setLiveSuggestion('');

      await suggestionEngine.processTranscriptStream(
        bufferedContent,
        promptConfig,
        contextData,
        (chunk: string) => {
          // Stream chunks to live suggestion
          currentSuggestion += chunk;
          setLiveSuggestion(currentSuggestion.trim());
        },
        (intent: string, isDuplicate: boolean) => {
          if (!isDuplicate && currentSuggestion.trim()) {
            setLastTranscriptChunk(bufferedContent);
            setSuggestionHistory(prev => {
              const updated = [...prev, currentSuggestion];
              return updated.slice(-5); // Keep only last 5
            });
            // CRITICAL: Update lastProcessedIndex to prevent re-processing same transcript
            const newIndex = currentTextRef.current.length;
            setLastProcessedIndex(newIndex);
            lastProcessedIndexRef.current = newIndex;
            console.log('💡 New streaming suggestion:', currentSuggestion);
            console.log('🎯 Detected intent:', intent);
            console.log('📝 Based on transcript:', bufferedContent.slice(-100));
          } else if (isDuplicate) {
            console.log('🚫 Duplicate suggestion prevented');
          }
        }
      );
    } catch (error) {
      console.error('Error generating streaming suggestion:', error);
    }
  };

  const handleAskGPTStable = useCallback(async (newContent: string) => {
    handleAskGPT(newContent);
  }, [handleAskGPT]);

  const loadConfig = async () => {
    try {
      const config = await window.electronAPI.getConfig();
      
      // Load discovery mode setting
      setDiscoveryModeEnabled(config.discoveryModeEnabled !== false); // Default to true
      
      // Check ASR health
      const healthStatus = await window.electronAPI.checkASRHealth(config);
      setAsrHealthStatus(healthStatus);
      
      // Determine if we can start recording
      const hasDeepgramKey = !!(config.deepgram_api_key && config.deepgram_api_key.trim());
      const asrMode = config.asr_provider || 'auto';
      
      const canStart = ASRProviderController.shouldEnableStart(
        asrMode,
        healthStatus.local,
        hasDeepgramKey
      );
      
      setIsConfigured(canStart);
      
      if (!canStart) {
        setShowHelperModal(true);
      }
      
    } catch (err) {
      setError("Failed to load configuration. Please check settings.");
    }
  };

  const startRecording = async () => {
    try {
      const config = await window.electronAPI.getConfig();
      
      // Get fresh health status
      const healthStatus = await window.electronAPI.checkASRHealth(config);
      setAsrHealthStatus(healthStatus);
      
      const hasDeepgramKey = !!(config.deepgram_api_key && config.deepgram_api_key.trim());
      const asrMode = config.asr_provider || 'auto';
      
      // Select provider
      const selectedProvider = ASRProviderController.selectProvider(
        asrMode,
        healthStatus.local,
        hasDeepgramKey
      );
      
      if (!selectedProvider) {
        setShowHelperModal(true);
        return;
      }
      
      setActiveASRProvider(selectedProvider);
      
      // Start audio capture
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: false,
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      setUserMedia(stream);

      // Start the selected ASR provider
      const result = await window.electronAPI.startASR(config);
      
      if (!result.success) {
        throw new Error(result.error);
      }

      // Set up audio processing with AudioWorklet
      const context = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 48000 });
      setAudioContext(context);
      
      // Diagnostic logging
      console.log('🎤 Mic input initialized:', stream.getTracks()[0].enabled);
      console.log('🎧 AudioContext state:', context.state);
      console.log('🎧 AudioContext sample rate:', context.sampleRate);
      
      // Load the audio worklet processor
      try {
        await context.audioWorklet.addModule('/audio-processor.js');
        console.log('✅ AudioWorklet loaded successfully');
      } catch (err) {
        console.error('❌ Failed to load AudioWorklet:', err);
        throw new Error('AudioWorklet loading failed');
      }
      
      const source = context.createMediaStreamSource(stream);
      
      // Create simple muted audio chain (like interviewer2)
      const gainNode = context.createGain();
      gainNode.gain.value = 0; // Mute to prevent feedback
      source.connect(gainNode);
      
      // Create AudioWorkletNode
      const worklet = new AudioWorkletNode(context, 'pcm-worklet');
      setWorkletNode(worklet);
      
      // Connect simple chain: source -> gain(muted) -> worklet -> destination
      gainNode.connect(worklet);
      worklet.connect(context.destination);

      // Handle PCM chunks from worklet with diagnostic logging
      let frameCount = 0;
      worklet.port.onmessage = (e) => {
        if (e.data?.byteLength) {
          frameCount++;
          if (frameCount % 50 === 0) {
            console.log('🎧 Frames:', frameCount, '| Provider:', selectedProvider);
          }

          // Direct send without conversion for Deepgram (48kHz)
          if (selectedProvider === 'deepgram') {
            window.electronAPI.ipcRenderer.send('send-audio-to-deepgram', e.data);
          }
          // Resample for local ASR (16kHz)
          else if (selectedProvider === 'local' && resamplerWorkerRef.current) {
            const float32 = new Float32Array(e.data);
            resamplerWorkerRef.current.postMessage({ float32_48k: float32, targetSampleRate: 16000 });
          }
        }
      };

      // Optional: Set up resampler worker if needed (for 16kHz ASR)
      if (selectedProvider === 'local') {
        try {
          console.log('🔄 Initializing resampler worker for local ASR...');
          if (resamplerWorkerRef.current) {
            resamplerWorkerRef.current.terminate();
          }
          const worker = new Worker('/pcm-worker.js');
          resamplerWorkerRef.current = worker;
          console.log('✅ Resampler worker initialized successfully');

          // ✅ DON'T override worklet.port.onmessage - the handler at line 333 already handles this correctly
          // ✅ It checks for resamplerWorker and posts to it

          worker.onmessage = (event) => {
            if (event.data.error) {
              console.error('Resampler error:', event.data.error);
              return;
            }

            const resampledSamples = event.data.out as Float32Array;
            const audioData = new Int16Array(resampledSamples.length);
            for (let i = 0; i < resampledSamples.length; i++) {
              audioData[i] = Math.max(-1, Math.min(1, resampledSamples[i])) * 0x7FFF;
            }

            console.log('📤 Sending resampled audio to main process:', audioData.buffer.byteLength, 'bytes');
            window.electronAPI.ipcRenderer.send('send-audio-to-deepgram', audioData.buffer);
          };
        } catch (error) {
          console.warn('Resampler worker not available, using direct 48kHz:', error);
        }
      } else {
        if (resamplerWorkerRef.current) {
          resamplerWorkerRef.current.terminate();
          resamplerWorkerRef.current = null;
        }
      }

      setIsRecording(true);
    } catch (err: any) {
      setError("Failed to start recording. Please check permissions or try again.");
    }
  };

  const stopRecording = () => {
    if (userMedia) {
      userMedia.getTracks().forEach((track) => track.stop());
    }
    if (audioContext) {
      audioContext.close();
    }
    if (workletNode) {
      workletNode.disconnect();
    }
    if (resamplerWorkerRef.current) {
      resamplerWorkerRef.current.terminate();
      resamplerWorkerRef.current = null;
    }
    window.electronAPI.stopASR();
    setIsRecording(false);
    setUserMedia(null);
    setAudioContext(null);
    setWorkletNode(null);
    setActiveASRProvider(null);
  };

  // Consolidated IPC listeners with proper cleanup
  useEffect(() => {
    loadConfig();
    
    // Handle ASR provider changes
    const handleProviderChange = (_event: any, data: any) => {
      console.log('🔄 ASR Provider changed:', data);
      setActiveASRProvider(data.to);
      
      if (data.from && data.to) {
        const message = `Switched to ${ASRProviderController.getProviderLabel(data.to)} (${data.reason})`;
        console.log('📢 Toast:', message);
      }
    };
    
    // Handle transcript updates
    const handleDeepgramTranscript = (_event: any, data: any) => {
      if (data.transcript && data.is_final) {
        const incoming = data.transcript.trim();
        if (incoming) {
          const updatedText = currentText + (currentText ? ' ' : '') + incoming;
          setCurrentText(updatedText);
          setLastTranscriptChunk(incoming);
          
          // Discovery capture (non-blocking)
          if (discoveryModeEnabled) {
            window.electronAPI.captureDiscovery(incoming).catch(err => 
              console.error('Discovery capture failed:', err)
            );
          }
          
          // Auto GPT processing
          if (isAutoGPTEnabled) {
            if (autoSubmitTimer) {
              clearTimeout(autoSubmitTimer);
            }
            const newTimer = setTimeout(async () => {
              const newContent = updatedText.slice(lastProcessedIndexRef.current);
              if (newContent.trim()) {
                handleSuggestionGeneration(newContent);
              }
            }, 300);
            setAutoSubmitTimer(newTimer);
          }
        }
      }
    };
    
    // Register listeners
    window.electronAPI.ipcRenderer.on('asr-provider-changed', handleProviderChange);
    window.electronAPI.ipcRenderer.on('deepgram-transcript', handleDeepgramTranscript);
    
    // Cleanup function
    return () => {
      window.electronAPI.ipcRenderer.removeListener('asr-provider-changed', handleProviderChange);
      window.electronAPI.ipcRenderer.removeListener('deepgram-transcript', handleDeepgramTranscript);
      
      if (isRecording) {
        stopRecording();
      }
      
      if (autoSubmitTimer) {
        clearTimeout(autoSubmitTimer);
      }
    };
  }, [isRecording, isAutoGPTEnabled, discoveryModeEnabled, currentText, lastProcessedIndex]);


  useEffect(() => {
    if (aiResponseRef.current) {
      aiResponseRef.current.scrollTop = aiResponseRef.current.scrollHeight;
    }
  }, [displayedAiResult]);

  const retestConnectivity = async () => {
    try {
      const config = await window.electronAPI.getConfig();
      const healthStatus = await window.electronAPI.checkASRHealth(config);
      setAsrHealthStatus(healthStatus);
      
      const hasDeepgramKey = !!(config.deepgram_api_key && config.deepgram_api_key.trim());
      const asrMode = config.asr_provider || 'auto';
      
      const canStart = ASRProviderController.shouldEnableStart(
        asrMode,
        healthStatus.local,
        hasDeepgramKey
      );
      
      setIsConfigured(canStart);
      
      if (canStart) {
        setShowHelperModal(false);
      }
    } catch (error) {
      console.error('Failed to retest connectivity:', error);
    }
  };

  const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  return (
    <div className="flex flex-col h-[calc(100vh-2.5rem)] p-2 space-y-2">
      <style>{markdownStyles}</style>
      <ErrorDisplay error={error} onClose={clearError} />
      
      
      <div className="flex justify-center items-center space-x-2">
        <button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={!isConfigured}
          className={`btn ${isRecording ? "btn-secondary" : "btn-primary"}`}
        >
          {isRecording ? "Stop Recording" : "Start Recording"}
        </button>
        <Timer isRunning={isRecording} />
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={isAutoGPTEnabled}
            onChange={(e) => setIsAutoGPTEnabled(e.target.checked)}
            className="checkbox mr-1"
          />
          <span>Auto GPT</span>
        </label>
        
        {/* ASR Provider Pill */}
        {activeASRProvider && (
          <div className="badge badge-info badge-sm">
            ASR: {ASRProviderController.getProviderLabel(activeASRProvider)}
          </div>
        )}
        
        {/* System Prompts Status Indicator */}
        <div className={`badge ${promptConfig.enabled ? 'badge-success' : 'badge-error'} badge-sm`}>
          {promptConfig.enabled ? '🟢 Prompts: ON' : '🔴 Prompts: OFF'}
        </div>
      </div>
      <div className="flex flex-1 space-x-2 overflow-hidden">
        <div className="flex-1 flex flex-col bg-base-200 p-2 rounded-lg">
          <textarea
            value={currentText}
            onChange={(e) => setCurrentText(e.target.value)}
            className="textarea textarea-bordered flex-1 mb-1 bg-base-100 min-h-[80px] whitespace-pre-wrap"
            placeholder="Transcribed text will appear here..."
          />
          <button
            onClick={() => setCurrentText("")}
            className="btn btn-ghost mt-1"
          >
            Clear Content
          </button>
        </div>
        <div className="flex-1 flex flex-col bg-base-200 p-2 rounded-lg">
          <div 
            ref={aiResponseRef}
            className="flex-1 overflow-auto bg-base-100 p-2 rounded mb-1 min-h-[80px]"
          >
            <h2 className="text-lg font-bold mb-2">
              {isAutoGPTEnabled ? "Live Suggestions & Manual Q&A:" : "AI Response:"}
            </h2>
            
            {/* Live Suggestion - shown at top when Auto GPT is enabled */}
            {isAutoGPTEnabled && liveSuggestion && (
              <div className="mb-4 p-3 bg-gradient-to-r from-accent/20 to-primary/20 border-l-4 border-accent rounded-r-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-accent uppercase">💡 Live Suggestion</span>
                  <div className="flex items-center space-x-2">
                    {/* Streaming indicator */}
                    <div className="flex space-x-1">
                      <div className="w-1 h-1 bg-accent rounded-full animate-pulse"></div>
                      <div className="w-1 h-1 bg-accent rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                      <div className="w-1 h-1 bg-accent rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                    </div>
                    <button
                      onClick={() => {
                        setLiveSuggestion("");
                        setLastTranscriptChunk("");
                      }}
                      className="btn btn-ghost btn-xs"
                    >
                      ✕
                    </button>
                  </div>
                </div>
                <div className="text-base font-medium text-base-content mt-2 leading-relaxed">
                  {liveSuggestion}
                  {/* Typing cursor */}
                  <span className="animate-pulse">|</span>
                </div>
                {lastTranscriptChunk && (
                  <div className="text-xs text-base-content/60 mt-3 p-2 bg-base-100/50 rounded border-t border-accent/30">
                    <span className="font-semibold">📝 Client said:</span>
                    <div className="mt-1 italic">"{lastTranscriptChunk}"</div>
                  </div>
                )}
              </div>
            )}
            
            {/* Display Q&A pairs from conversation history */}
            {conversations.length > 0 ? (
              <div className="space-y-4">
                {conversations.map((conv, index) => {
                  // Only show assistant responses with their corresponding user questions
                  if (conv.role === 'assistant') {
                    const userQuestion = conversations[index - 1];
                    return (
                      <div key={index} className="border-b border-base-300 pb-4 last:border-b-0">
                        {userQuestion && (
                          <div className="mb-2 p-2 bg-base-200 rounded text-sm">
                            <span className="font-medium text-primary">📝 Question:</span>
                            <div className="mt-1 text-base-content/80">
                              "{userQuestion.content}"
                            </div>
                          </div>
                        )}
                        <div className="p-2 bg-primary/10 rounded">
                          <span className="font-medium text-primary">💬 Answer:</span>
                          <div className="mt-1">
                            <ReactMarkdown className="whitespace-pre-wrap markdown-body" components={{
                              p: ({node, ...props}) => <p style={{whiteSpace: 'pre-wrap'}} {...props} />
                            }}>
                              {conv.content}
                            </ReactMarkdown>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            ) : (
              <div className="text-base-content/60 italic">
                {isAutoGPTEnabled 
                  ? "Live suggestions will appear above in real-time. Manual Q&A responses will show here when you click 'Ask GPT'."
                  : "No responses yet. Start recording and ask questions!"
                }
              </div>
            )}
          </div>
          <div className="flex justify-between mt-1">
            <button
              onClick={debounce(() => handleAskGPT(), 300)}
              disabled={!currentText || isLoading}
              className="btn btn-primary"
            >
              {isLoading ? "Loading..." : "Ask GPT"}
            </button>
            <button onClick={() => {
              setDisplayedAiResult("");
            }} className="btn btn-ghost">
              Clear AI Result
            </button>
          </div>
          
          {/* System Message Preview */}
          {promptConfig.enabled && (
            <div className="collapse collapse-arrow bg-base-200 mt-2">
              <input type="checkbox" />
              <div className="collapse-title text-sm font-medium">
                🔍 Preview System Message ({buildSystemMessage().length} chars)
              </div>
              <div className="collapse-content">
                <div className="text-xs text-base-content/70 whitespace-pre-wrap max-h-40 overflow-auto bg-base-100 p-2 rounded">
                  {buildSystemMessage()}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* ASR Helper Modal */}
      {showHelperModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">ASR Service Unavailable</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Current Status:</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${asrHealthStatus?.local?.healthy ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span>Local ASR: {asrHealthStatus?.local?.healthy ? 'Healthy' : 'Unavailable'}</span>
                    {asrHealthStatus?.local?.error && (
                      <span className="text-sm text-gray-500">({asrHealthStatus.local.error})</span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${asrHealthStatus?.deepgram?.healthy ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span>Deepgram: {asrHealthStatus?.deepgram?.healthy ? 'Ready' : 'No API Key'}</span>
                    {asrHealthStatus?.deepgram?.error && (
                      <span className="text-sm text-gray-500">({asrHealthStatus.deepgram.error})</span>
                    )}
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">How to start Local ASR:</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>Install a local ASR service (e.g., Whisper server)</li>
                  <li>Start the service on port 9001 (default)</li>
                  <li>Ensure it responds to GET /health</li>
                  <li>Configure the URL in Settings if different</li>
                </ol>
              </div>
              
              <div className="flex justify-end space-x-2">
                <button
                  onClick={retestConnectivity}
                  className="btn btn-primary btn-sm"
                >
                  Re-test Connectivity
                </button>
                <button
                  onClick={() => setShowHelperModal(false)}
                  className="btn btn-ghost btn-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewPage;
