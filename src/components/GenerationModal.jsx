import React, { useEffect, useState } from 'react';
import { Sparkles, Cpu, Zap, Box, Wrench, CheckCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function GenerationModal({ prompt, promise, onComplete }) {
  const steps = [
    { id: 1, label: "Reading your idea…", icon: Sparkles },
    { id: 2, label: "Choosing the microcontroller and power…", icon: Cpu },
    { id: 3, label: "Listing parts, mass and cost estimates…", icon: Zap },
    { id: 4, label: "Wiring pins and checking pin names…", icon: Zap },
    { id: 5, label: "Sizing parts and mechanical joints…", icon: Box },
    { id: 6, label: "Writing the build steps…", icon: Wrench }
  ];

  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const startedAt = Date.now();
    // Advance the steps while we wait, but never past the last one until the real result is in.
    const timer = setInterval(() => {
      setCurrentStepIndex(prev => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 700);

    Promise.resolve(promise).then(async (result) => {
      const minShown = 2500; // keep the progress readable even when the template answers instantly
      await new Promise(r => setTimeout(r, Math.max(0, minShown - (Date.now() - startedAt))));
      if (cancelled) return;
      clearInterval(timer);
      setCurrentStepIndex(steps.length);
      try {
        confetti({ particleCount: 75, spread: 70, origin: { y: 0.6 } });
      } catch {}
      setTimeout(() => { if (!cancelled) onComplete(result); }, 500);
    });

    return () => { cancelled = true; clearInterval(timer); };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 select-none">
      <div className="bg-[#14151a] border border-[#2e313d] rounded-2xl max-w-lg w-full p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-500/30 text-blue-400 mx-auto flex items-center justify-center">
            <Sparkles size={24} className="animate-spin" />
          </div>
          <h2 className="font-tech text-xl font-bold tracking-wide text-white">
            Synthesizing Hardware Project
          </h2>
          <p className="text-xs font-mono text-gray-400 truncate max-w-md mx-auto">
            "{prompt}"
          </p>
        </div>

        {/* Progress Pipeline */}
        <div className="space-y-3 pt-2">
          {steps.map((step, idx) => {
            const isCompleted = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;
            const Icon = step.icon;

            return (
              <div
                key={step.id}
                className={`flex items-center gap-3 text-xs font-mono p-2.5 rounded-lg border transition-all ${
                  isCurrent
                    ? 'bg-blue-600/10 border-blue-500/50 text-blue-300'
                    : isCompleted
                    ? 'bg-[#181a20] border-[#252731] text-gray-300'
                    : 'bg-[#101114] border-transparent text-gray-600'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle size={16} className="text-emerald-400 shrink-0" />
                ) : isCurrent ? (
                  <Icon size={16} className="text-blue-400 animate-pulse shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-gray-700 shrink-0" />
                )}
                <span className="flex-1 truncate">{step.label}</span>
              </div>
            );
          })}
        </div>

        {/* Bottom Status */}
        <div className="pt-2 text-center text-[11px] font-mono text-gray-500">
          Working… AI is used when the bridge has an API key, otherwise an offline template
        </div>
      </div>
    </div>
  );
}
