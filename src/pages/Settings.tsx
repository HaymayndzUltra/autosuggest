import React, { useState, useEffect } from 'react';
import { useError } from '../contexts/ErrorContext';
import ErrorDisplay from '../components/ErrorDisplay';
import { languageOptions } from '../utils/languageOptions';
import { usePrompt } from '../contexts/PromptContext';
import { ASRProviderController } from '../utils/providerController';

const Settings: React.FC = () => {
  const { error, setError, clearError } = useError();
  const { promptConfig, updatePromptConfig } = usePrompt();
  const [apiKey, setApiKey] = useState('');
  const [apiBase, setApiBase] = useState('');
  const [apiModel, setApiModel] = useState('gpt-4o');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [apiCallMethod, setApiCallMethod] = useState<'direct' | 'proxy'>('direct');
  const [testResult, setTestResult] = useState<string | null>(null);
  const [primaryLanguage, setPrimaryLanguage] = useState('auto');
  const [secondaryLanguage, setSecondaryLanguage] = useState('');
  const [deepgramApiKey, setDeepgramApiKey] = useState('');
  const [showPromptSettings, setShowPromptSettings] = useState(false);
  const [asrProvider, setAsrProvider] = useState<'auto' | 'local' | 'deepgram'>('auto');
  const [localAsrUrl, setLocalAsrUrl] = useState('http://127.0.0.1:9001');
  const [asrHealthStatus, setAsrHealthStatus] = useState<{ local: any, deepgram: any } | null>(null);
  const [discoveryModeEnabled, setDiscoveryModeEnabled] = useState(true);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const config = await window.electronAPI.getConfig();
      setApiKey(config.openai_key || '');
      setApiModel(config.gpt_model || 'gpt-4o');
      setApiBase(config.api_base || '');
      setApiCallMethod(config.api_call_method || 'direct');
      setPrimaryLanguage(config.primaryLanguage || 'auto');
      setSecondaryLanguage(config.secondaryLanguage || '');
      setDeepgramApiKey(config.deepgram_api_key || '');
      setAsrProvider(config.asr_provider || 'auto');
      setLocalAsrUrl(config.local_asr_url || 'http://127.0.0.1:9001');
      setDiscoveryModeEnabled(config.discoveryModeEnabled !== false); // Default to true
      
      // Load prompt config if available
      if (config.promptConfig) {
        updatePromptConfig(config.promptConfig);
      }
      
      // Check ASR health
      await checkASRHealth();
    } catch (err) {
      console.error('Failed to load configuration', err);
      setError('Failed to load configuration. Please check your settings.');
    }
  };

  const handleSave = async () => {
    try {
      await window.electronAPI.setConfig({
        openai_key: apiKey,
        gpt_model: apiModel,
        api_base: apiBase,
        api_call_method: apiCallMethod,
        primaryLanguage: primaryLanguage,
        deepgram_api_key: deepgramApiKey,
        asr_provider: asrProvider,
        local_asr_url: localAsrUrl,
        promptConfig: promptConfig,
        discoveryModeEnabled: discoveryModeEnabled,
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setError('Failed to save configuration');
    }
  };

  const testAPIConfig = async () => {
    try {
      setTestResult('Testing...');
      console.log('Sending test-api-config request with config:', {
        openai_key: apiKey,
        gpt_model: apiModel,
        api_base: apiBase,
      });
      const result = await window.electronAPI.testAPIConfig({
        openai_key: apiKey,
        gpt_model: apiModel,
        api_base: apiBase,
      });
      console.log('Received test-api-config result:', result);
      if (result.success) {
        setTestResult('API configuration is valid!');
      } else {
        setTestResult(`API configuration test failed: ${result.error || 'Unknown error'}`);
        setError(`Failed to test API configuration: ${result.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('API configuration test error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setTestResult(`API configuration test failed: ${errorMessage}`);
      setError(`Failed to test API configuration: ${errorMessage}`);
    }
  };

  const checkASRHealth = async () => {
    try {
      const config = {
        local_asr_url: localAsrUrl,
        deepgram_api_key: deepgramApiKey,
      };
      const healthStatus = await window.electronAPI.checkASRHealth(config);
      setAsrHealthStatus(healthStatus);
    } catch (error) {
      console.error('Failed to check ASR health:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <ErrorDisplay error={error} onClose={clearError} />
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <div className="mb-4">
        <label className="label">API Key</label>
        <input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className="input input-bordered w-full"
        />
      </div>
      <div className="mb-4">
        <label className="label">API Base URL (Optional)</label>
        <input
          type="text"
          value={apiBase}
          onChange={(e) => setApiBase(e.target.value)}
          className="input input-bordered w-full"
        />
        <label className="label">
          <span className="label-text-alt">
            Enter proxy URL if using API proxy. For example: https://your-proxy.com/v1
          </span>
        </label>
      </div>
      <div className="mb-4">
        <label className="label">API Model</label>
        <input
          type="text"
          value={apiModel}
          onChange={(e) => setApiModel(e.target.value)}
          className="input input-bordered w-full"
        />
        <label className="label">
          <span className="label-text-alt">Please use a model supported by your API. Preferably gpt-4.</span>
        </label>
      </div>
      <div className="mb-4">
        <label className="label">API Call Method</label>
        <select
          value={apiCallMethod}
          onChange={(e) => setApiCallMethod(e.target.value as 'direct' | 'proxy')}
          className="select select-bordered w-full"
        >
          <option value="direct">Direct</option>
          <option value="proxy">Proxy</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="label">Deepgram API Key</label>
        <input
          type="password"
          value={deepgramApiKey}
          onChange={(e) => setDeepgramApiKey(e.target.value)}
          className="input input-bordered w-full"
        />
      </div>
      <div className="mb-4">
        <label className="label">Primary Language</label>
        <select
          value={primaryLanguage}
          onChange={(e) => setPrimaryLanguage(e.target.value)}
          className="select select-bordered w-full"
        >
          {languageOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      
      {/* ASR Provider Settings */}
      <div className="divider my-8"></div>
      <h2 className="text-xl font-bold mb-4">ASR Provider Settings</h2>
      
      <div className="mb-4">
        <label className="label">ASR Provider Mode</label>
        <div className="space-y-2">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="asrProvider"
              value="auto"
              checked={asrProvider === 'auto'}
              onChange={(e) => setAsrProvider(e.target.value as 'auto' | 'local' | 'deepgram')}
              className="radio radio-primary"
            />
            <span>Auto (prefer local, fallback to Deepgram)</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="asrProvider"
              value="local"
              checked={asrProvider === 'local'}
              onChange={(e) => setAsrProvider(e.target.value as 'auto' | 'local' | 'deepgram')}
              className="radio radio-primary"
            />
            <span>Local ASR only</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="asrProvider"
              value="deepgram"
              checked={asrProvider === 'deepgram'}
              onChange={(e) => setAsrProvider(e.target.value as 'auto' | 'local' | 'deepgram')}
              className="radio radio-primary"
            />
            <span>Deepgram only</span>
          </label>
        </div>
        <label className="label">
          <span className="label-text-alt">
            {ASRProviderController.getModeRequirements(asrProvider).description}
          </span>
        </label>
      </div>
      
      <div className="mb-4">
        <label className="label">Local ASR URL</label>
        <input
          type="text"
          value={localAsrUrl}
          onChange={(e) => setLocalAsrUrl(e.target.value)}
          className="input input-bordered w-full"
        />
        <label className="label">
          <span className="label-text-alt">
            URL of your local ASR service (e.g., http://127.0.0.1:9001)
          </span>
        </label>
      </div>
      
      <div className="mb-4">
        <h4 className="font-semibold mb-2">Provider Status:</h4>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${asrHealthStatus?.local?.healthy ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span>Local ASR: {asrHealthStatus?.local?.healthy ? 'Healthy' : 'Unavailable'}</span>
            {asrHealthStatus?.local?.latency && (
              <span className="text-sm text-gray-500">({asrHealthStatus.local.latency}ms)</span>
            )}
            {asrHealthStatus?.local?.error && (
              <span className="text-sm text-red-500">({asrHealthStatus.local.error})</span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${asrHealthStatus?.deepgram?.healthy ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span>Deepgram: {asrHealthStatus?.deepgram?.healthy ? 'Ready' : 'No API Key'}</span>
            {asrHealthStatus?.deepgram?.latency && (
              <span className="text-sm text-gray-500">({asrHealthStatus.deepgram.latency}ms)</span>
            )}
            {asrHealthStatus?.deepgram?.error && (
              <span className="text-sm text-red-500">({asrHealthStatus.deepgram.error})</span>
            )}
          </div>
        </div>
        <button
          onClick={checkASRHealth}
          className="btn btn-outline btn-sm mt-2"
        >
          Re-test Connectivity
        </button>
      </div>
      <div className="flex justify-between mt-4">
        <button onClick={handleSave} className="btn btn-primary">
          Save Settings
        </button>
        <button onClick={testAPIConfig} className="btn btn-secondary">
          Test API Configuration
        </button>
      </div>
      
      {/* System Prompts Section */}
      <div className="divider my-8"></div>
      <h2 className="text-xl font-bold mb-4">System Prompts Configuration</h2>
      
      <div className="mb-4">
        <label className="label">
          <span className="label-text">Enable System Prompts</span>
          <input
            type="checkbox"
            checked={promptConfig.enabled}
            onChange={(e) => updatePromptConfig({ enabled: e.target.checked })}
            className="checkbox checkbox-primary"
          />
        </label>
        <label className="label">
          <span className="label-text-alt">Enable behavior rules, language guide, and response style for AI responses</span>
        </label>
      </div>

      {promptConfig.enabled && (
        <>
          <div className="mb-4">
            <label className="label">
              <span className="label-text">Behavior Rules</span>
              <input
                type="checkbox"
                checked={promptConfig.behaviorEnabled}
                onChange={(e) => updatePromptConfig({ behaviorEnabled: e.target.checked })}
                className="checkbox checkbox-primary"
              />
            </label>
          </div>
          
          <div className="mb-4">
            <label className="label">
              <span className="label-text">Language Guide</span>
              <input
                type="checkbox"
                checked={promptConfig.languageEnabled}
                onChange={(e) => updatePromptConfig({ languageEnabled: e.target.checked })}
                className="checkbox checkbox-primary"
              />
            </label>
          </div>
          
          <div className="mb-4">
            <label className="label">
              <span className="label-text">Response Style</span>
              <input
                type="checkbox"
                checked={promptConfig.responseStyleEnabled}
                onChange={(e) => updatePromptConfig({ responseStyleEnabled: e.target.checked })}
                className="checkbox checkbox-primary"
              />
            </label>
          </div>

          <div className="mb-4">
            <button 
              onClick={() => setShowPromptSettings(!showPromptSettings)}
              className="btn btn-outline btn-sm"
            >
              {showPromptSettings ? 'Hide' : 'Show'} Prompt Content
            </button>
          </div>

          {showPromptSettings && (
            <div className="space-y-4">
              <div className="collapse collapse-arrow bg-base-200">
                <input type="checkbox" />
                <div className="collapse-title text-sm font-medium">
                  Behavior Rules Preview
                </div>
                <div className="collapse-content">
                  <div className="text-xs text-base-content/70 whitespace-pre-wrap max-h-40 overflow-auto">
                    {promptConfig.behaviorRules.substring(0, 200)}...
                  </div>
                </div>
              </div>
              
              <div className="collapse collapse-arrow bg-base-200">
                <input type="checkbox" />
                <div className="collapse-title text-sm font-medium">
                  Language Guide Preview
                </div>
                <div className="collapse-content">
                  <div className="text-xs text-base-content/70 whitespace-pre-wrap max-h-40 overflow-auto">
                    {promptConfig.languageGuide.substring(0, 200)}...
                  </div>
                </div>
              </div>
              
              <div className="collapse collapse-arrow bg-base-200">
                <input type="checkbox" />
                <div className="collapse-title text-sm font-medium">
                  Response Style Preview
                </div>
                <div className="collapse-content">
                  <div className="text-xs text-base-content/70 whitespace-pre-wrap max-h-40 overflow-auto">
                    {promptConfig.responseStyle.substring(0, 200)}...
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
      
      {/* Discovery Mode Section */}
      <div className="divider my-8"></div>
      <h2 className="text-xl font-bold mb-4">Discovery Capture Configuration</h2>
      
      <div className="mb-4">
        <label className="label">
          <span className="label-text">Discovery Capture Mode</span>
          <input
            type="checkbox"
            checked={discoveryModeEnabled}
            onChange={(e) => setDiscoveryModeEnabled(e.target.checked)}
            className="checkbox checkbox-primary"
          />
        </label>
        <label className="label">
          <span className="label-text-alt">
            Automatically capture client context from interview conversation
          </span>
        </label>
      </div>
      
      <div className="flex justify-between mt-4">
        <button onClick={handleSave} className="btn btn-primary">
          Save Settings
        </button>
        <button onClick={testAPIConfig} className="btn btn-secondary">
          Test API Configuration
        </button>
      </div>
      {saveSuccess && <p className="text-success mt-2">Settings saved successfully</p>}
      {testResult && <p className={`mt-2 ${testResult.includes('valid') ? 'text-success' : 'text-error'}`}>{testResult}</p>}
    </div>
  );
};

export default Settings;
