import React, { useState, useEffect, useRef } from 'react';
import {
  Info,
  Cpu,
  Layers,
  Wrench,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Download,
  Share2,
  Check,
  Send,
  MessageSquare,
  Bot,
  User,
  History,
  RotateCcw,
  Zap,
  Box,
  Copy,
  ExternalLink,
  Plus
} from 'lucide-react';
import { SAMPLE_PROJECTS } from '../data/sampleProjects';
import { buildPlan } from '../data/planPatches';
import { requestAiProject } from '../data/aiClient';
import { saveProject } from '../data/storage';

import RenderHeroView from '../components/RenderHeroView';
import BOMTable from '../components/BOMTable';
import WiringCanvas from '../components/WiringCanvas';
import MechView3D from '../components/MechView3D';
import InstructionsView from '../components/InstructionsView';

export default function StudioView({ project: initialProject, generationNote, onBackToDashboard }) {
  const [project, setProject] = useState(initialProject);
  const [activeTab, setActiveTab] = useState('render');
  const [isChatCollapsed, setIsChatCollapsed] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < 768
  );
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      sender: 'assistant',
      text: `Welcome to Blueprint Studio! Here is the hardware architecture for **${initialProject?.projectName}**.\n\nYou can inspect the 3D CAD enclosure in MECH, review all distributor pricing in PARTS, inspect the circuit pins in WIRING, and follow the assembly manual in INSTRUCTIONS.\n\nWhat would you like to refine?${generationNote ? `\n\nNote: ${generationNote}` : ''}`
    }
  ]);
  const [promptInput, setPromptInput] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [saveStatus, setSaveStatus] = useState('Saved');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState(initialProject?.projectName || '');
  const [showShareModal, setShowShareModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [selectedModelTier, setSelectedModelTier] = useState('Pro');

  const [versionHistory, setVersionHistory] = useState([
    { id: 'v1', name: 'Initial AI Synthesis', timestamp: 'Just now', data: initialProject }
  ]);

  const [pendingPlan, setPendingPlan] = useState(null);

  // Update project name
  const handleSaveTitle = () => {
    if (!titleDraft.trim()) return;
    setProject(prev => ({ ...prev, projectName: titleDraft.trim() }));
    setIsEditingTitle(false);
    triggerAutoSave();
  };

  const triggerAutoSave = () => {
    setSaveStatus('Saving…');
    setTimeout(() => setSaveStatus(st => (st === 'Saving…' ? 'Saved' : st)), 600);
  };

  // Persist every change to this browser. Built-in sample projects are saved as a copy.
  useEffect(() => {
    if (project === initialProject) return;
    const isSample = SAMPLE_PROJECTS.some(p => p.id === project.id);
    const ok = saveProject(isSample ? { ...project, id: 'my-' + project.id } : project);
    setSaveStatus(ok ? 'Saved' : 'Not saved (browser storage blocked)');
  }, [project]);

  // Ask for a change. Uses the AI backend when it is available, otherwise the offline planner.
  const handleSendMessage = async (textToSend) => {
    const text = textToSend || promptInput;
    if (!text.trim() || isAiGenerating) return;

    setChatMessages(prev => [...prev, { id: Date.now(), sender: 'user', text }]);
    setPromptInput('');
    setPendingPlan(null);
    setIsAiGenerating(true);

    let reply = '';
    const ai = await requestAiProject(text, project);
    if (ai.project) {
      setPendingPlan({
        summary: `AI edit: ${text}`,
        changes: [`${ai.project.nodes.length} parts, ${ai.project.electricalConnections.length} wires, est. $${ai.project.estimatedCost}`],
        next: ai.project
      });
      reply = 'The AI prepared an updated version. Review it below, then apply or discard.';
    } else {
      const plan = buildPlan(text, project);
      if (plan.changes.length) {
        setPendingPlan(plan);
        reply = 'I prepared a change using the offline planner. Review it below, then apply or discard.';
      } else {
        reply = plan.summary;
      }
    }

    setChatMessages(prev => [...prev, { id: Date.now() + 1, sender: 'assistant', text: reply }]);
    setIsAiGenerating(false);
  };

  // Apply the pending plan: checkpoint the current version first, then swap in the new one.
  const handleApplyPlan = () => {
    if (!pendingPlan) return;
    const previous = project;
    setVersionHistory(prev => [
      ...prev,
      {
        id: `v${prev.length + 1}`,
        name: `Before: ${pendingPlan.summary.slice(0, 40)}`,
        timestamp: new Date().toLocaleTimeString(),
        data: previous
      }
    ]);
    setProject(pendingPlan.next);
    setChatMessages(prev => [
      ...prev,
      {
        id: Date.now(),
        sender: 'assistant',
        text: `Applied: ${pendingPlan.summary}\n\n${(pendingPlan.changes || []).map(c => '• ' + c).join('\n')}\n\nUse Versions to go back.`
      }
    ]);
    setPendingPlan(null);
    triggerAutoSave();
  };

  // Export full project JSON/ZIP
  const handleExportProject = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(project, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${project?.projectName || 'blueprint'}-project.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="flex flex-col w-full h-dvh bg-[#0e0f12] text-[#f8f8f7] overflow-hidden">
      {/* Top Main Navigation Header */}
      <header className="min-h-[3.25rem] bg-[#111215] border-b border-[#24262c] flex flex-wrap items-center justify-between gap-y-1 px-3 sm:px-4 py-1 shrink-0 z-30">
        {/* Left: Back + Project Name & Rename */}
        <div className="flex items-center gap-3 min-w-0 max-w-sm sm:max-w-md">
          <button
            onClick={onBackToDashboard}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md hover:bg-[#1f2127] text-gray-400 hover:text-white transition-colors text-xs font-mono uppercase"
          >
            <ChevronLeft size={16} />
            <span className="hidden sm:inline">Home</span>
          </button>

          <div className="w-px h-5 bg-[#262831]" />

          {/* Editable Title */}
          {isEditingTitle ? (
            <div className="flex items-center gap-1.5">
              <input
                type="text"
                value={titleDraft}
                onChange={(e) => setTitleDraft(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSaveTitle()}
                className="bg-[#181a20] border border-blue-500 rounded px-2 py-0.5 text-xs font-tech font-bold text-white focus:outline-none"
                autoFocus
              />
              <button
                onClick={handleSaveTitle}
                className="p-1 rounded bg-blue-600 text-white text-xs hover:bg-blue-500"
              >
                <Check size={12} />
              </button>
            </div>
          ) : (
            <div
              onClick={() => { setTitleDraft(project?.projectName); setIsEditingTitle(true); }}
              className="font-tech text-xs sm:text-sm font-bold text-gray-100 truncate cursor-pointer hover:text-blue-400 transition-colors flex items-center gap-1.5"
              title="Click to rename"
            >
              <span className="truncate">{project?.projectName}</span>
              <span className="text-[10px] text-gray-500 font-mono">✎</span>
            </div>
          )}

          {/* Autosave Status */}
          <span className="hidden md:inline text-[10px] font-mono uppercase tracking-wider text-gray-500 shrink-0">
            {saveStatus}
          </span>
        </div>

        {/* Center: 5 Core Blueprint Workspace Tabs */}
        <div className="flex items-center gap-1 bg-[#17181e] p-1 rounded-lg border border-[#262831] order-last w-full md:order-none md:w-auto overflow-x-auto">
          {[
            { id: 'render', label: 'INFO', icon: Info },
            { id: 'parts', label: 'PARTS', icon: Cpu, badge: project?.nodes?.length },
            { id: 'graph', label: 'WIRING', icon: Zap, badge: project?.electricalConnections?.length },
            { id: 'mech', label: 'MECH', icon: Box },
            { id: 'instructions', label: 'INSTRUCTIONS', icon: Wrench, badge: project?.instructions?.length }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-1 md:flex-none justify-center items-center gap-1.5 px-3 py-2 md:py-1.5 rounded-md text-xs font-mono font-bold uppercase tracking-wider transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-[#20222a]'
                }`}
              >
                <Icon size={13} />
                <span className="hidden sm:inline">{tab.label}</span>
                {tab.badge !== undefined && (
                  <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-mono ${
                    isActive ? 'bg-white/20 text-white' : 'bg-[#262832] text-gray-400'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Right: History, Export, Share */}
        <div className="flex items-center gap-2">
          {/* Version History */}
          <button
            onClick={() => setShowHistoryModal(!showHistoryModal)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-mono text-gray-400 hover:text-white hover:bg-[#1a1b22] border border-transparent hover:border-[#2e313d] transition-all"
            title="Version History"
          >
            <History size={14} />
            <span className="hidden xl:inline">Versions</span>
          </button>

          {/* Export / Download */}
          <button
            onClick={handleExportProject}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-mono text-gray-400 hover:text-white hover:bg-[#1a1b22] border border-[#282a35] transition-all"
            title="Export Project File"
          >
            <Download size={13} />
            <span className="hidden sm:inline">Export</span>
          </button>

          {/* Share */}
          <button
            onClick={() => setShowShareModal(true)}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-md text-xs font-mono uppercase font-bold tracking-wider transition-colors shadow-sm"
          >
            <Share2 size={13} />
            <span className="hidden sm:inline">Share</span>
          </button>
        </div>
      </header>

      {/* Main Studio Body (Dual-Pane) */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left: Collapsible AI Conversational & Prompt Drawer */}
        <aside
          className={`shrink-0 border-r border-[#22242b] bg-[#101114] flex flex-col transition-all duration-200 z-20 ${
            isChatCollapsed ? 'w-12' : 'w-[85vw] max-w-sm md:w-96 max-md:absolute max-md:inset-y-0 max-md:left-0 max-md:shadow-2xl'
          }`}
        >
          {/* Panel Top Toggle Header */}
          <div className="h-10 px-3 border-b border-[#22242b] flex items-center justify-between text-xs font-mono text-gray-400 bg-[#131418]">
            {!isChatCollapsed && (
              <div className="flex items-center gap-2">
                <Sparkles size={13} className="text-blue-400" />
                <span className="font-bold tracking-wider uppercase text-gray-200">Blueprint AI</span>
              </div>
            )}
            <button
              onClick={() => setIsChatCollapsed(!isChatCollapsed)}
              className="p-1 rounded hover:bg-[#20222a] text-gray-400 hover:text-white ml-auto"
              title={isChatCollapsed ? 'Expand AI Panel' : 'Collapse AI Panel'}
            >
              {isChatCollapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
            </button>
          </div>

          {!isChatCollapsed && (
            <>
              {/* Chat Messages Log */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-xs">
                {chatMessages.map(msg => (
                  <div
                    key={msg.id}
                    className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.sender === 'assistant' && (
                      <div className="w-6 h-6 rounded bg-blue-600/20 border border-blue-500/40 flex items-center justify-center shrink-0 text-blue-400">
                        <Bot size={13} />
                      </div>
                    )}
                    <div
                      className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-xs leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-blue-600 text-white rounded-br-none'
                          : 'bg-[#181a20] border border-[#2b2d38] text-gray-200 rounded-bl-none'
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{msg.text}</div>
                    </div>
                    {msg.sender === 'user' && (
                      <div className="w-6 h-6 rounded bg-gray-800 flex items-center justify-center shrink-0 text-gray-300">
                        <User size={13} />
                      </div>
                    )}
                  </div>
                ))}

                {/* AI Generating Indicator */}
                {isAiGenerating && (
                  <div className="flex items-center gap-2 text-xs font-mono text-blue-400 bg-[#161820] border border-blue-900/40 p-2.5 rounded-lg animate-pulse">
                    <Sparkles size={13} className="animate-spin" />
                    <span>Preparing the change…</span>
                  </div>
                )}

                {/* Pending Plan Proposal Banner */}
                {pendingPlan && (
                  <div className="bg-[#191b22] border border-blue-500/60 rounded-xl p-3.5 space-y-3 shadow-lg">
                    <div className="flex items-center gap-1.5 text-blue-400 text-[11px] font-bold uppercase tracking-wider">
                      <Sparkles size={12} />
                      Proposed Hardware Edit
                    </div>
                    <p className="text-xs text-gray-200 leading-normal">
                      {pendingPlan.summary}
                    </p>
                    {pendingPlan.changes && pendingPlan.changes.length > 0 && (
                      <ul className="text-[11px] text-gray-400 list-disc pl-4 space-y-0.5">
                        {pendingPlan.changes.map((c, i) => <li key={i}>{c}</li>)}
                      </ul>
                    )}
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={handleApplyPlan}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold uppercase py-1.5 rounded transition-colors"
                      >
                        Apply Changes
                      </button>
                      <button
                        onClick={() => setPendingPlan(null)}
                        className="px-3 py-1.5 border border-[#3b3e4d] text-gray-400 hover:text-white font-mono text-xs uppercase rounded"
                      >
                        Discard
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Prompt Suggestions */}
              <div className="p-3 border-t border-[#1f2128] bg-[#0d0e11] space-y-2">
                <div className="text-[10px] font-mono uppercase text-gray-500">Suggested Modifications:</div>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    "Add an active buzzer",
                    "Add a light sensor",
                    "Add a status LED"
                  ].map((sug, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(sug)}
                      className="text-[10px] font-mono text-gray-300 bg-[#17181e] hover:bg-[#22242c] border border-[#2b2d37] px-2 py-1 rounded truncate max-w-full transition-colors text-left"
                    >
                      + {sug}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input Box & Model Selector */}
              <div className="p-3 border-t border-[#22242b] bg-[#121317] space-y-2">
                <div className="flex items-center justify-between text-[10px] font-mono text-gray-500">
                  <span>Model Engine:</span>
                  <div className="flex items-center gap-1">
                    {['Free', 'Pro', 'Ultra'].map((tier) => (
                      <button
                        key={tier}
                        onClick={() => setSelectedModelTier(tier)}
                        className={`px-1.5 py-0.5 rounded ${
                          selectedModelTier === tier
                            ? 'bg-blue-600/30 text-blue-400 border border-blue-500/50 font-bold'
                            : 'text-gray-500 hover:text-gray-300'
                        }`}
                      >
                        {tier}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="relative flex items-center">
                  <input
                    type="text"
                    placeholder="Refine CAD, components, or wiring…"
                    value={promptInput}
                    onChange={(e) => setPromptInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="w-full bg-[#181a20] border border-[#2d303a] rounded-lg pl-3 pr-10 py-2 text-xs font-mono text-gray-100 placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    onClick={() => handleSendMessage()}
                    disabled={!promptInput.trim() || isAiGenerating}
                    className="absolute right-1.5 p-1.5 rounded-md bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-30 disabled:hover:bg-blue-600 transition-colors"
                  >
                    <Send size={13} />
                  </button>
                </div>
              </div>
            </>
          )}
        </aside>

        {/* Center/Right Active Workspace View Area */}
        <main className="flex-1 relative overflow-hidden bg-[#0d0e11]">
          {activeTab === 'render' && (
            <RenderHeroView project={project} />
          )}
          {activeTab === 'parts' && (
            <BOMTable project={project} />
          )}
          {activeTab === 'graph' && (
            <WiringCanvas project={project} />
          )}
          {activeTab === 'mech' && (
            <MechView3D project={project} />
          )}
          {activeTab === 'instructions' && (
            <InstructionsView project={project} />
          )}
        </main>
      </div>

      {/* Share / Publish Modal */}
      {showShareModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setShowShareModal(false)}
        >
          <div
            className="bg-[#141519] border border-[#333642] rounded-xl max-w-md w-full p-6 space-y-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-tech text-base font-bold uppercase tracking-wider text-white">
                Share Hardware Project
              </h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-gray-500 hover:text-white font-mono"
              >
                ✕
              </button>
            </div>

            <p className="text-xs font-mono text-gray-400 leading-relaxed">
              Anyone with this link can view the complete bill of materials, circuit schematic, interactive 3D CAD viewer, and assembly manual.
            </p>

            <div className="flex items-center gap-2 bg-[#1b1c23] border border-[#2c2f3b] rounded-lg p-2 font-mono text-xs">
              <span className="text-gray-300 truncate flex-1">
                {window.location.origin}/s/{project?.id}
              </span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/s/${project?.id}`);
                  setCopiedLink(true);
                  setTimeout(() => setCopiedLink(false), 2000);
                }}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-bold uppercase shrink-0 transition-colors"
              >
                {copiedLink ? 'Copied!' : 'Copy Link'}
              </button>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowShareModal(false)}
                className="px-4 py-2 border border-[#333642] text-gray-400 hover:text-white rounded-lg text-xs font-mono uppercase"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Version History Modal */}
      {showHistoryModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setShowHistoryModal(false)}
        >
          <div
            className="bg-[#141519] border border-[#333642] rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-tech text-base font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <History size={16} /> Version Checkpoints
              </h3>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="text-gray-500 hover:text-white font-mono"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {versionHistory.map(v => (
                <div
                  key={v.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-[#1a1b22] border border-[#2b2d38] font-mono text-xs"
                >
                  <div>
                    <div className="text-gray-200 font-bold">{v.name}</div>
                    <div className="text-gray-500 text-[10px]">{v.timestamp}</div>
                  </div>
                  <button
                    onClick={() => {
                      setProject(v.data);
                      setShowHistoryModal(false);
                      triggerAutoSave();
                    }}
                    className="flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300 border border-blue-900/40 px-2.5 py-1 rounded bg-blue-950/20"
                  >
                    <RotateCcw size={11} /> Restore
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
