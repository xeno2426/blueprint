import React, { useEffect, useState } from 'react';
import { Sparkles, Cpu, Zap, Box, Wrench, CheckCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function GenerationModal({ prompt, onComplete }) {
  const steps = [
    { id: 1, label: "Admitting prompt into AI planning queue…", icon: Sparkles },
    { id: 2, label: "Synthesizing MCU architecture & power budget…", icon: Cpu },
    { id: 3, label: "Matching components across DigiKey, Mouser & Adafruit…", icon: Zap },
    { id: 4, label: "Generating pin-to-pin wiring netlist & power rails…", icon: Zap },
    { id: 5, label: "Parametric 3D CAD modeling & enclosure synthesis…", icon: Box },
    { id: 6, label: "Compiling physical build manual & assembly steps…", icon: Wrench }
  ];

  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStepIndex(prev => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(timer);
          try {
            confetti({
              particleCount: 75,
              spread: 70,
              origin: { y: 0.6 }
            });
          } catch {}
          setTimeout(() => {
            onComplete();
          }, 600);
          return prev;
        }
      });
    }, 600);

    return () => clearInterval(timer);
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
          Blueprint Labs Multimodal CAD Pipeline v2.0
        </div>
      </div>
    </div>
  );
}
