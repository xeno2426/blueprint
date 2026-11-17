import React, { useRef, useState } from 'react';
import LandingPage from './views/LandingPage';
import CommunityView from './views/CommunityView';
import StudioView from './views/StudioView';
import GenerationModal from './components/GenerationModal';
import { SAMPLE_PROJECTS } from './data/sampleProjects';
import { generateProjectFromPrompt } from './data/projectGenerator';
import { requestAiProject, describeReason } from './data/aiClient';
import { saveProject } from './data/storage';

export default function App() {
  const [currentView, setCurrentView] = useState('landing'); // 'landing' | 'community' | 'studio'
  const [currentProject, setCurrentProject] = useState(SAMPLE_PROJECTS[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationPrompt, setGenerationPrompt] = useState('');
  const [generationNote, setGenerationNote] = useState('');
  const generationPromise = useRef(null);

  // Start generation. The request is fired here (an event handler) so React
  // StrictMode's double-run of effects cannot send it twice.
  const handleStartGeneration = (prompt) => {
    setGenerationPrompt(prompt);
    setIsGenerating(true);
    generationPromise.current = requestAiProject(prompt).then(({ project, reason }) => {
      if (project) return { project, note: '' };
      return { project: generateProjectFromPrompt(prompt), note: describeReason(reason) };
    });
  };

  const handleGenerationComplete = (result) => {
    saveProject(result.project);
    setCurrentProject(result.project);
    setGenerationNote(result.note || '');
    setIsGenerating(false);
    setCurrentView('studio');
  };

  const handleOpenProject = (proj) => {
    setGenerationNote('');
    setCurrentProject(proj);
    setCurrentView('studio');
  };

  return (
    <div className="w-full min-h-screen bg-[#131313] text-[#f8f8f7]">
      {currentView === 'landing' && (
        <LandingPage
          onGeneratePrompt={handleStartGeneration}
          onOpenProject={handleOpenProject}
          onNavigateCommunity={() => setCurrentView('community')}
        />
      )}

      {currentView === 'community' && (
        <CommunityView
          onOpenProject={handleOpenProject}
          onNavigateHome={() => setCurrentView('landing')}
        />
      )}

      {currentView === 'studio' && (
        <StudioView
          key={currentProject.id}
          project={currentProject}
          generationNote={generationNote}
          onBackToDashboard={() => setCurrentView('landing')}
        />
      )}

      {isGenerating && (
        <GenerationModal
          prompt={generationPrompt}
          promise={generationPromise.current}
          onComplete={handleGenerationComplete}
        />
      )}
    </div>
  );
}
