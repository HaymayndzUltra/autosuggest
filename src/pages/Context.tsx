import React, { useMemo, useState } from 'react';
import { usePrompt } from '../contexts/PromptContext';
import { useError } from '../contexts/ErrorContext';
import ErrorDisplay from '../components/ErrorDisplay';

const Context: React.FC = () => {
  const { contextData, contextStatus, updateContextData, loadContextFromFiles } = usePrompt();
  const { error, setError, clearError } = useError();
  const [activeTab, setActiveTab] = useState<'resume' | 'jobPost' | 'workflow' | 'skills' | 'discovery'>('resume');
  const [editingContent, setEditingContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const contextStatusCards = useMemo(() => ([
    { id: 'resume', label: 'Resume', status: contextStatus.resume },
    { id: 'jobPost', label: 'Job Post', status: contextStatus.jobPost },
    { id: 'workflow', label: 'Workflow', status: contextStatus.workflowMethod },
    { id: 'skills', label: 'Skills & Knowledge', status: contextStatus.skillsKnowledge },
    { id: 'discovery', label: 'Discovery Questions', status: contextStatus.discoveryQuestions },
  ] as const), [contextStatus]);

  const getStatusBadge = (status: typeof contextStatus.resume) => {
    if (!status?.exists) return { text: 'Missing file', className: 'badge badge-error badge-sm' };
    if (!status.hasContent) return { text: 'Loaded (empty)', className: 'badge badge-warning badge-sm' };
    if (status.error) return { text: 'Error', className: 'badge badge-error badge-sm' };
    return { text: 'Loaded', className: 'badge badge-success badge-sm' };
  };

  const getCurrentContent = () => {
    switch (activeTab) {
      case 'resume': return contextData.resume;
      case 'jobPost': return contextData.jobPost;
      case 'workflow': return contextData.workflowMethod;
      case 'skills': return contextData.skillsKnowledge;
      case 'discovery': return contextData.discoveryQuestions;
      default: return '';
    }
  };

  const handleEdit = () => {
    setEditingContent(getCurrentContent());
    setIsEditing(true);
  };

  const handleSave = () => {
    try {
      switch (activeTab) {
        case 'resume':
          updateContextData({ resume: editingContent });
          break;
        case 'jobPost':
          updateContextData({ jobPost: editingContent });
          break;
        case 'workflow':
          updateContextData({ workflowMethod: editingContent });
          break;
        case 'skills':
          updateContextData({ skillsKnowledge: editingContent });
          break;
        case 'discovery':
          updateContextData({ discoveryQuestions: editingContent });
          break;
      }
      setIsEditing(false);
      setEditingContent('');
    } catch (err) {
      setError('Failed to save context data');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingContent('');
  };

  const handleReset = async () => {
    try {
      await loadContextFromFiles();
      setError('');
    } catch (err) {
      setError('Failed to reset context data');
    }
  };

  const getTabTitle = (tab: string) => {
    switch (tab) {
      case 'resume': return 'Resume';
      case 'jobPost': return 'Job Post';
      case 'workflow': return 'Workflow';
      case 'skills': return 'Skills';
      case 'discovery': return 'Discovery Q&A';
    }
  };

  const tabs = [
    { id: 'resume', label: 'Resume', icon: '📄' },
    { id: 'jobPost', label: 'Job Post', icon: '💼' },
    { id: 'workflow', label: 'Workflow', icon: '⚙️' },
    { id: 'skills', label: 'Skills', icon: '🛠️' },
    { id: 'discovery', label: 'Discovery Q&A', icon: '❓' },
  ] as const;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <ErrorDisplay error={error} onClose={clearError} />
      <h1 className="text-2xl font-bold mb-4">Context Management</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
        {contextStatusCards.map(card => {
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

      {/* Tab Navigation */}
      <div className="tabs tabs-boxed mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab ${activeTab === tab.id ? 'tab-active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <div className="flex justify-between items-center mb-4">
            <h2 className="card-title">{getTabTitle(activeTab)}</h2>
            <div className="flex space-x-2">
              {!isEditing ? (
                <button onClick={handleEdit} className="btn btn-primary btn-sm">
                  Edit
                </button>
              ) : (
                <>
                  <button onClick={handleSave} className="btn btn-success btn-sm">
                    Save
                  </button>
                  <button onClick={handleCancel} className="btn btn-ghost btn-sm">
                    Cancel
                  </button>
                </>
              )}
              <button onClick={handleReset} className="btn btn-outline btn-sm">
                Reset to File
              </button>
            </div>
          </div>

          {/* Content Display/Edit */}
          {isEditing ? (
            <textarea
              value={editingContent}
              onChange={(e) => setEditingContent(e.target.value)}
              className="textarea textarea-bordered w-full h-96 font-mono text-sm"
              placeholder={`Enter ${getTabTitle(activeTab).toLowerCase()} content...`}
            />
          ) : (
            <div className="bg-base-200 p-4 rounded-lg min-h-96">
              {getCurrentContent() ? (
                <div className="whitespace-pre-wrap text-sm">
                  {getCurrentContent()}
                </div>
              ) : (
                <div className="text-base-content/60 italic text-center py-8">
                  No {getTabTitle(activeTab).toLowerCase()} content yet. Click Edit to add content.
                </div>
              )}
            </div>
          )}

          {/* Character Count */}
          <div className="text-sm text-base-content/70 mt-2">
            {isEditing ? editingContent.length : getCurrentContent().length} characters
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card bg-base-200">
          <div className="card-body">
            <h3 className="card-title text-lg">📋 Quick Templates</h3>
            <p className="text-sm text-base-content/70 mb-3">
              Use these templates to get started quickly
            </p>
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => {
                  setActiveTab('resume');
                  setEditingContent(`# [Your Name]
## Contact: [email] | [phone]

### Summary
[2-3 sentence professional summary]

### Technical Skills
- Frontend: React, Next.js, TypeScript
- Backend: Node.js, Python, FastAPI
- Tools: Git, Docker, AWS

### Work Experience
**[Job Title]** - [Company] (Date - Date)
- [Achievement/responsibility]
- [Project with tech stack]

### Projects
**[Project Name]**
- Tech Stack: [list]
- Role: [your role]
- Achievement: [what you accomplished]`);
                  setIsEditing(true);
                }}
                className="btn btn-outline btn-xs"
              >
                Resume Template
              </button>
              <button 
                onClick={() => {
                  setActiveTab('jobPost');
                  setEditingContent(`# Job Post: [Position Title]

## Company
[Company name and description]

## Requirements
- [Requirement 1]
- [Requirement 2]

## Tech Stack
- [Technology 1]
- [Technology 2]

## Responsibilities
- [Responsibility 1]
- [Responsibility 2]

## Nice to Have
- [Bonus skill 1]`);
                  setIsEditing(true);
                }}
                className="btn btn-outline btn-xs"
              >
                Job Post Template
              </button>
            </div>
          </div>
        </div>

        <div className="card bg-base-200">
          <div className="card-body">
            <h3 className="card-title text-lg">💡 Tips</h3>
            <ul className="text-sm text-base-content/70 space-y-1">
              <li>• Include specific project names and achievements</li>
              <li>• Mention exact technologies and frameworks</li>
              <li>• Add quantifiable results (performance, users, etc.)</li>
              <li>• Keep content updated for each interview</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Context;
