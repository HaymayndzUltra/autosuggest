import React from 'react';
import { HashRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import { ErrorProvider } from './contexts/ErrorContext';
import { KnowledgeBaseProvider } from './contexts/KnowledgeBaseContext';
import { PromptProvider } from './contexts/PromptContext';
import InterviewPage from './pages/InterviewPage';
import KnowledgeBase from './pages/KnowledgeBase';
import Context from './pages/Context';
import Settings from './pages/Settings';
import Prompts from './pages/Prompts';
import { InterviewProvider } from './contexts/InterviewContext';

const App: React.FC = () => {
  return (
    <InterviewProvider>
      <ErrorProvider>
        <PromptProvider>
          <KnowledgeBaseProvider>
            <Router>
              <div className="flex flex-col min-h-screen">
                <Navigation />
                <main className="flex-grow container mx-auto p-4">
                  <Routes>
                    <Route path="/main_window" element={<InterviewPage />} />
                    <Route path="/knowledge" element={<KnowledgeBase />} />
                    <Route path="/context" element={<Context />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/prompts" element={<Prompts />} />
                    <Route path="/" element={<Navigate to="/main_window" replace />} />
                    <Route path="*" element={<Navigate to="/main_window" replace />} />
                  </Routes>
                </main>
              </div>
            </Router>
          </KnowledgeBaseProvider>
        </PromptProvider>
      </ErrorProvider>
    </InterviewProvider>
  );
};

export default App;
