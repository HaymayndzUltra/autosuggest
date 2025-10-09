import React, { useMemo, useState } from 'react';
import { usePrompt } from '../contexts/PromptContext';
import { useError } from '../contexts/ErrorContext';
import ErrorDisplay from '../components/ErrorDisplay';

const Prompts: React.FC = () => {
  const { promptConfig, promptStatus, updatePromptConfig, loadPromptsFromFiles } = usePrompt();
  const { error, setError, clearError } = useError();
  const [editingPrompt, setEditingPrompt] = useState<'behavior' | 'language' | 'response' | null>(null);
  const [tempContent, setTempContent] = useState('');

  const promptStatusCards = useMemo(() => ([
    { id: 'behavior', label: 'Behavior Rules', status: promptStatus.behaviorRules },
    { id: 'language', label: 'Language Guide', status: promptStatus.languageGuide },
    { id: 'response', label: 'Response Style', status: promptStatus.responseStyle },
  ] as const), [promptStatus]);

  const getStatusBadge = (status: typeof promptStatus.behaviorRules) => {
    if (!status?.exists) return { text: 'Missing file', className: 'badge badge-error badge-sm' };
    if (!status.hasContent) return { text: 'Loaded (empty)', className: 'badge badge-warning badge-sm' };
    if (status.error) return { text: 'Error', className: 'badge badge-error badge-sm' };
    return { text: 'Loaded', className: 'badge badge-success badge-sm' };
  };

  const handleEditPrompt = (type: 'behavior' | 'language' | 'response') => {
    setEditingPrompt(type);
    switch (type) {
      case 'behavior':
        setTempContent(promptConfig.behaviorRules);
        break;
      case 'language':
        setTempContent(promptConfig.languageGuide);
        break;
      case 'response':
        setTempContent(promptConfig.responseStyle);
        break;
    }
  };

  const handleSavePrompt = () => {
    if (!editingPrompt) return;

    try {
      switch (editingPrompt) {
        case 'behavior':
          updatePromptConfig({ behaviorRules: tempContent });
          break;
        case 'language':
          updatePromptConfig({ languageGuide: tempContent });
          break;
        case 'response':
          updatePromptConfig({ responseStyle: tempContent });
          break;
      }
      setEditingPrompt(null);
      setTempContent('');
    } catch (err) {
      setError('Failed to save prompt changes');
    }
  };

  const handleCancelEdit = () => {
    setEditingPrompt(null);
    setTempContent('');
  };

  const handleResetToDefault = async () => {
    try {
      await loadPromptsFromFiles();
      setError('');
    } catch (err) {
      setError('Failed to reset prompts to default');
    }
  };

  const getPromptTitle = (type: 'behavior' | 'language' | 'response') => {
    switch (type) {
      case 'behavior': return 'Behavior Rules';
      case 'language': return 'Language Guide';
      case 'response': return 'Response Style';
    }
  };

  const getPromptContent = (type: 'behavior' | 'language' | 'response') => {
    switch (type) {
      case 'behavior': return promptConfig.behaviorRules;
      case 'language': return promptConfig.languageGuide;
      case 'response': return promptConfig.responseStyle;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <ErrorDisplay error={error} onClose={clearError} />
      <h1 className="text-2xl font-bold mb-4">System Prompts Management</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        {promptStatusCards.map(card => {
          const badge = getStatusBadge(card.status);
          const lastUpdated = card.status?.lastUpdated
            ? new Date(card.status.lastUpdated).toLocaleTimeString()
            : 'Not loaded yet';
          return (
            <div key={card.id} className="card bg-base-200 shadow-sm">
              <div className="card-body py-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-sm">{card.label}</h3>
                    <p className="text-xs text-base-content/60 break-all">{card.status?.path}</p>
                  </div>
                  <span className={badge.className}>{badge.text}</span>
                </div>
                <p className="text-xs text-base-content/50 mt-2">Last update: {lastUpdated}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Current Configuration</h2>
          <div className="flex space-x-2">
            <button 
              onClick={handleResetToDefault}
              className="btn btn-outline btn-sm"
            >
              Reset to Default
            </button>
            <button 
              onClick={() => window.electronAPI.setConfig({ promptConfig })}
              className="btn btn-primary btn-sm"
            >
              Save All Changes
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="card bg-base-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">Behavior Rules</h3>
              <input
                type="checkbox"
                checked={promptConfig.behaviorEnabled}
                onChange={(e) => updatePromptConfig({ behaviorEnabled: e.target.checked })}
                className="checkbox checkbox-primary checkbox-sm"
              />
            </div>
            <p className="text-sm text-base-content/70">
              {promptConfig.behaviorRules.length} characters
            </p>
            <button 
              onClick={() => handleEditPrompt('behavior')}
              className="btn btn-outline btn-xs mt-2"
            >
              Edit
            </button>
          </div>
          
          <div className="card bg-base-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">Language Guide</h3>
              <input
                type="checkbox"
                checked={promptConfig.languageEnabled}
                onChange={(e) => updatePromptConfig({ languageEnabled: e.target.checked })}
                className="checkbox checkbox-primary checkbox-sm"
              />
            </div>
            <p className="text-sm text-base-content/70">
              {promptConfig.languageGuide.length} characters
            </p>
            <button 
              onClick={() => handleEditPrompt('language')}
              className="btn btn-outline btn-xs mt-2"
            >
              Edit
            </button>
          </div>
          
          <div className="card bg-base-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">Response Style</h3>
              <input
                type="checkbox"
                checked={promptConfig.responseStyleEnabled}
                onChange={(e) => updatePromptConfig({ responseStyleEnabled: e.target.checked })}
                className="checkbox checkbox-primary checkbox-sm"
              />
            </div>
            <p className="text-sm text-base-content/70">
              {promptConfig.responseStyle.length} characters
            </p>
            <button 
              onClick={() => handleEditPrompt('response')}
              className="btn btn-outline btn-xs mt-2"
            >
              Edit
            </button>
          </div>
        </div>
      </div>

      {/* Edit Mode */}
      {editingPrompt && (
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                Edit {getPromptTitle(editingPrompt)}
              </h3>
              <div className="flex space-x-2">
                <button 
                  onClick={handleCancelEdit}
                  className="btn btn-ghost btn-sm"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSavePrompt}
                  className="btn btn-primary btn-sm"
                >
                  Save Changes
                </button>
              </div>
            </div>
            
            <textarea
              value={tempContent}
              onChange={(e) => setTempContent(e.target.value)}
              className="textarea textarea-bordered w-full h-96 font-mono text-sm"
              placeholder="Enter prompt content..."
            />
            
            <div className="text-sm text-base-content/70 mt-2">
              {tempContent.length} characters
            </div>
          </div>
        </div>
      )}

      {/* Preview Mode */}
      {!editingPrompt && (
        <div className="space-y-6">
          <div className="card bg-base-100 shadow">
            <div className="card-body">
              <h3 className="card-title">Behavior Rules Preview</h3>
              <div className="text-sm text-base-content/80 whitespace-pre-wrap max-h-60 overflow-auto bg-base-200 p-4 rounded">
                {promptConfig.behaviorRules}
              </div>
            </div>
          </div>
          
          <div className="card bg-base-100 shadow">
            <div className="card-body">
              <h3 className="card-title">Language Guide Preview</h3>
              <div className="text-sm text-base-content/80 whitespace-pre-wrap max-h-60 overflow-auto bg-base-200 p-4 rounded">
                {promptConfig.languageGuide}
              </div>
            </div>
          </div>
          
          <div className="card bg-base-100 shadow">
            <div className="card-body">
              <h3 className="card-title">Response Style Preview</h3>
              <div className="text-sm text-base-content/80 whitespace-pre-wrap max-h-60 overflow-auto bg-base-200 p-4 rounded">
                {promptConfig.responseStyle}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Prompts;
