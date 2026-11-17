import React, { useState } from 'react';
import { CheckCircle2, Circle, Wrench, Clock, AlertTriangle, ShieldCheck, ChevronDown, ChevronRight, FileText } from 'lucide-react';

export default function InstructionsView({ project }) {
  const instructions = project?.instructions || [];
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [expandedStep, setExpandedStep] = useState(1);

  const toggleStepCompleted = (stepNum) => {
    setCompletedSteps(prev => {
      const next = new Set(prev);
      if (next.has(stepNum)) {
        next.delete(stepNum);
      } else {
        next.add(stepNum);
      }
      return next;
    });
  };

  const progressPercent = instructions.length > 0
    ? Math.round((completedSteps.size / instructions.length) * 100)
    : 0;

  return (
    <div className="w-full h-full flex flex-col bg-[#0d0d0f] overflow-hidden">
      {/* Top Build Progress Bar */}
      <div className="shrink-0 border-b border-[#24262b] bg-[#121316] p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Wrench size={16} className="text-blue-400" />
            <h2 className="font-tech text-sm font-bold uppercase tracking-wider text-white">
              Hardware Assembly Guide
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
            <Clock size={13} />
            <span>Est. {project?.buildTime || '4-6 hours'}</span>
            <span className="text-gray-600">•</span>
            <span className="px-2 py-0.5 rounded bg-[#1f2127] text-gray-300 text-[10px] uppercase font-bold">
              {project?.difficulty || 'Intermediate'}
            </span>
          </div>
        </div>

        {/* Completion Progress Bar */}
        <div className="flex items-center gap-3 min-w-[200px]">
          <div className="text-xs font-mono text-gray-400">
            Progress: <span className="text-emerald-400 font-bold">{progressPercent}%</span>
          </div>
          <div className="flex-1 h-2 bg-[#202228] rounded-full overflow-hidden border border-[#2e313a]">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Steps List */}
      <div className="flex-1 overflow-auto p-6 max-w-4xl mx-auto w-full space-y-4">
        {instructions.map((step) => {
          const isDone = completedSteps.has(step.step);
          const isExpanded = expandedStep === step.step;

          return (
            <div
              key={step.step}
              className={`rounded-xl border transition-all ${
                isDone
                  ? 'bg-[#121513] border-emerald-900/40 opacity-90'
                  : 'bg-[#141519] border-[#292c35]'
              }`}
            >
              {/* Step Header Accordion */}
              <div
                className="p-4 flex items-center justify-between cursor-pointer select-none"
                onClick={() => setExpandedStep(isExpanded ? null : step.step)}
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleStepCompleted(step.step);
                    }}
                    className="text-gray-400 hover:text-emerald-400 transition-colors"
                  >
                    {isDone ? (
                      <CheckCircle2 size={20} className="text-emerald-500" />
                    ) : (
                      <Circle size={20} className="text-gray-600 hover:text-gray-400" />
                    )}
                  </button>

                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-black/50 text-blue-400 border border-blue-900/40">
                    STEP {step.step}
                  </span>

                  <h3 className={`font-tech text-sm font-bold tracking-wide ${isDone ? 'text-gray-400 line-through' : 'text-gray-100'}`}>
                    {step.title}
                  </h3>
                </div>

                <div className="flex items-center gap-3">
                  {step.tools && step.tools.length > 0 && (
                    <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-mono text-gray-500">
                      <Wrench size={11} />
                      {step.tools.slice(0, 2).join(', ')}
                      {step.tools.length > 2 && ` +${step.tools.length - 2}`}
                    </div>
                  )}
                  {isExpanded ? <ChevronDown size={16} className="text-gray-400" /> : <ChevronRight size={16} className="text-gray-400" />}
                </div>
              </div>

              {/* Step Detail Content */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-1 border-t border-[#22242c] space-y-4">
                  <p className="text-xs font-mono text-gray-300 leading-relaxed">
                    {step.description}
                  </p>

                  {/* Tools Required */}
                  {step.tools && (
                    <div className="bg-[#191a20] p-3 rounded-lg border border-[#2b2d37]">
                      <div className="text-[10px] font-mono uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-1.5">
                        <Wrench size={12} className="text-blue-400" />
                        Tools & Materials Required
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {step.tools.map((t, idx) => (
                          <span
                            key={idx}
                            className="text-[11px] font-mono px-2.5 py-1 rounded bg-[#101115] text-gray-300 border border-[#353742]"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Sub-steps Checklist */}
                  {step.subSteps && step.subSteps.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-[10px] font-mono uppercase tracking-wider text-gray-400">
                        Detailed Action Steps:
                      </div>
                      <ol className="space-y-1.5">
                        {step.subSteps.map((sub, sIdx) => (
                          <li
                            key={sIdx}
                            className="flex items-start gap-2 text-xs font-mono text-gray-300 pl-1"
                          >
                            <span className="text-blue-500 font-bold shrink-0">{sIdx + 1}.</span>
                            <span>{sub}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
