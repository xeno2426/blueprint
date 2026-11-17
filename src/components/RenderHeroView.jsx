import React, { useState } from 'react';
import { Sparkles, Cpu, Battery, Gauge, Compass, DollarSign, Clock, RefreshCw, Download, FileSpreadsheet, Layers } from 'lucide-react';

export default function RenderHeroView({ project, onRerollRender }) {
  const [isRerolling, setIsRerolling] = useState(false);
  const [renderEffectIndex, setRenderEffectIndex] = useState(0);

  const handleReroll = () => {
    setIsRerolling(true);
    setTimeout(() => {
      setIsRerolling(false);
      setRenderEffectIndex(prev => (prev + 1) % 3);
    }, 1200);
  };

  const specs = project?.specs || {};

  return (
    <div className="w-full h-full flex flex-col lg:flex-row bg-[#0b0b0c] overflow-y-auto">
      {/* Left Concept Render Showcase */}
      <div className="flex-1 min-h-[380px] p-6 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-[#202127] relative bg-gradient-to-b from-[#111215] to-[#090a0c]">
        {/* Render Badges */}
        <div className="absolute top-6 left-6 flex items-center gap-2">
          <span className="font-tech text-xs tracking-wider uppercase text-gray-300 bg-black/60 border border-[#333] px-3 py-1 rounded-md backdrop-blur-md">
            Concept overview
          </span>
        </div>

        {/* Concept Visual Canvas */}
        <div className="relative max-w-lg w-full flex items-center justify-center my-6 group">
          <div className="absolute inset-0 bg-blue-500/10 blur-3xl rounded-full" />
          {project?.renderImage ? (
            <img
              src={project.renderImage}
              alt={project?.projectName}
              className="relative z-10 max-h-[380px] w-auto object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.8)]"
            />
          ) : (
            <div className="relative z-10 w-full aspect-[4/3] max-h-[380px] rounded-xl border border-dashed border-[#2e3140] bg-[#0f1014] flex flex-col items-center justify-center text-center p-6 gap-2">
              <Cpu size={36} className="text-blue-400" />
              <div className="font-tech text-sm text-gray-200">{project?.projectName}</div>
              <div className="font-mono text-[11px] text-gray-500">
                No render yet. Use PARTS, WIRING and INSTRUCTIONS for the real design data.
              </div>
            </div>
          )}
        </div>

        {/* Caption */}
        <div className="text-center font-mono text-xs text-gray-400 max-w-md">
          {project?.projectName}
        </div>
      </div>

      {/* Right Hardware Specifications & System Profile */}
      <div className="w-full lg:w-[420px] p-6 space-y-6 bg-[#0e0f12]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-blue-400">
            <span>Hardware Architecture</span>
            <span className="text-gray-600">•</span>
            <span className="text-gray-400">{project?.category || 'Hardware'}</span>
          </div>
          <h2 className="font-tech text-xl font-bold text-white mt-1">
            {project?.projectName}
          </h2>
          <p className="text-xs font-mono text-gray-400 leading-relaxed mt-2">
            {project?.description}
          </p>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#15161b] p-3.5 rounded-lg border border-[#262831]">
            <div className="flex items-center gap-1.5 text-gray-500 text-[10px] font-mono uppercase">
              <DollarSign size={12} className="text-emerald-400" />
              Est. BOM Cost
            </div>
            <div className="text-base font-mono font-bold text-emerald-400 mt-1">
              ${(project?.estimatedCost || 120).toFixed(2)}
            </div>
          </div>

          <div className="bg-[#15161b] p-3.5 rounded-lg border border-[#262831]">
            <div className="flex items-center gap-1.5 text-gray-500 text-[10px] font-mono uppercase">
              <Clock size={12} className="text-blue-400" />
              Assembly Time
            </div>
            <div className="text-base font-mono font-bold text-gray-200 mt-1">
              {project?.buildTime || '4-6 hours'}
            </div>
          </div>
        </div>

        {/* Technical Specs Accordion */}
        <div className="space-y-3 font-mono text-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400 border-b border-[#22242c] pb-1.5">
            System Specifications
          </div>

          {specs.mcu && (
            <div className="flex items-start justify-between py-1 border-b border-[#1b1c22]">
              <span className="text-gray-500 flex items-center gap-1.5">
                <Cpu size={12} /> MCU / Processor
              </span>
              <span className="text-gray-200 text-right font-semibold max-w-[200px]">{specs.mcu}</span>
            </div>
          )}

          {specs.power && (
            <div className="flex items-start justify-between py-1 border-b border-[#1b1c22]">
              <span className="text-gray-500 flex items-center gap-1.5">
                <Battery size={12} /> Power Supply
              </span>
              <span className="text-gray-200 text-right font-semibold max-w-[200px]">{specs.power}</span>
            </div>
          )}

          {specs.sensors && (
            <div className="flex items-start justify-between py-1 border-b border-[#1b1c22]">
              <span className="text-gray-500 flex items-center gap-1.5">
                <Gauge size={12} /> Sensors / Telemetry
              </span>
              <span className="text-gray-200 text-right font-semibold max-w-[200px]">{specs.sensors}</span>
            </div>
          )}

          {specs.dimensions && (
            <div className="flex items-start justify-between py-1 border-b border-[#1b1c22]">
              <span className="text-gray-500 flex items-center gap-1.5">
                <Compass size={12} /> Footprint Size
              </span>
              <span className="text-gray-200 text-right font-semibold">{specs.dimensions}</span>
            </div>
          )}

          {specs.weight && (
            <div className="flex items-start justify-between py-1 border-b border-[#1b1c22]">
              <span className="text-gray-500">Total Mass</span>
              <span className="text-gray-200 font-semibold">{specs.weight}</span>
            </div>
          )}
        </div>

        {project?.warnings && project.warnings.length > 0 && (
          <div className="bg-amber-950/20 p-4 rounded-xl border border-amber-800/40 space-y-1.5">
            <div className="text-[10px] font-mono uppercase tracking-wider text-amber-400">Check before building</div>
            <ul className="text-xs font-mono text-amber-100/90 list-disc pl-4 space-y-1">
              {project.warnings.map((w, i) => <li key={i}>{w.replace(/^\[auto\]\s*/, '')}</li>)}
            </ul>
          </div>
        )}

        {/* Quick System Summary */}
        <div className="bg-[#14161c] p-4 rounded-xl border border-[#252833] space-y-2">
          <div className="text-[10px] font-mono uppercase tracking-wider text-gray-400">
            Project Bill of Materials Summary
          </div>
          <div className="flex items-center justify-between text-xs font-mono text-gray-300">
            <span>Total Component Count</span>
            <span className="font-bold text-white">{project?.nodes?.length || 0} items</span>
          </div>
          <div className="flex items-center justify-between text-xs font-mono text-gray-300">
            <span>Electrical Wires & Nets</span>
            <span className="font-bold text-blue-400">{project?.electricalConnections?.length || 0} connections</span>
          </div>
          <div className="flex items-center justify-between text-xs font-mono text-gray-300">
            <span>Assembly Steps</span>
            <span className="font-bold text-emerald-400">{project?.instructions?.length || 0} stages</span>
          </div>
        </div>
      </div>
    </div>
  );
}
