import React, { useState } from 'react';
import LandingPage from './views/LandingPage';
import CommunityView from './views/CommunityView';
import StudioView from './views/StudioView';
import GenerationModal from './components/GenerationModal';
import { SAMPLE_PROJECTS } from './data/sampleProjects';
import { generateProjectFromPrompt } from './data/projectGenerator';

export default function App() {
  const [currentView, setCurrentView] = useState('landing'); // 'landing' | 'community' | 'studio'
  const [currentProject, setCurrentProject] = useState(SAMPLE_PROJECTS[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationPrompt, setGenerationPrompt] = useState('');

  // Start generation flow
  const handleStartGeneration = (prompt) => {
    setGenerationPrompt(prompt);
    setIsGenerating(true);
  };

  // Complete generation flow and open Studio
  const handleGenerationComplete = () => {
    const newProject = generateProjectFromPrompt(generationPrompt);
    setCurrentProject(newProject);
    setIsGenerating(false);
    setCurrentView('studio');
  };

  // Open existing project from landing / community
  const handleOpenProject = (proj) => {
    setCurrentProject(proj);
    setCurrentView('studio');
  };

  return (
    <div className="w-full min-h-screen bg-[#131313] text-[#f8f8f7]">
      {/* View Routing */}
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
          project={currentProject}
          onBackToDashboard={() => setCurrentView('landing')}
        />
      )}

      {/* AI Project Generation Progress Modal */}
      {isGenerating && (
        <GenerationModal
          prompt={generationPrompt}
          onComplete={handleGenerationComplete}
        />
      )}
    </div>
  );
}
