import React, { useState, useRef } from 'react';
import { Cpu, Zap, Activity, Info, ZoomIn, ZoomOut, Maximize2, ShieldCheck } from 'lucide-react';

export default function WiringCanvas({ project, onPartClick }) {
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 30, y: 30 });
  const [isPanning, setIsPanning] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedWire, setSelectedWire] = useState(null);

  // Position nodes on canvas
  const [nodePositions, setNodePositions] = useState(() => {
    const pos = {};
    const electricalNodes = project?.nodes?.filter(n => n.pins && n.pins.length > 0) || [];
    electricalNodes.forEach((node, i) => {
      const col = i % 3;
      const row = Math.floor(i / 3);
      pos[node.id] = { x: 80 + col * 320, y: 80 + row * 260 };
    });
    return pos;
  });

  const [activeDraggingNode, setActiveDraggingNode] = useState(null);
  const nodeDragStartRef = useRef({ x: 0, y: 0 });

  const handleStartNodeDrag = (e, nodeId) => {
    e.stopPropagation();
    setActiveDraggingNode(nodeId);
    nodeDragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      nodeX: nodePositions[nodeId]?.x || 0,
      nodeY: nodePositions[nodeId]?.y || 0
    };
  };

  const handleCanvasMouseMove = (e) => {
    if (activeDraggingNode) {
      const deltaX = (e.clientX - nodeDragStartRef.current.mouseX) / scale;
      const deltaY = (e.clientY - nodeDragStartRef.current.mouseY) / scale;
      setNodePositions(prev => ({
        ...prev,
        [activeDraggingNode]: {
          x: nodeDragStartRef.current.nodeX + deltaX,
          y: nodeDragStartRef.current.nodeY + deltaY
        }
      }));
    } else if (isPanning) {
      setPan({
        x: pan.x + (e.clientX - dragStart.x),
        y: pan.y + (e.clientY - dragStart.y)
      });
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleCanvasMouseUp = () => {
    setActiveDraggingNode(null);
    setIsPanning(false);
  };

  const electricalNodes = project?.nodes?.filter(n => n.pins && n.pins.length > 0) || [];
  const wires = project?.electricalConnections || [];

  return (
    <div
      className="relative w-full h-full bg-[#0d0d0d] select-none overflow-hidden"
      onMouseDown={(e) => {
        setIsPanning(true);
        setDragStart({ x: e.clientX, y: e.clientY });
      }}
      onMouseMove={handleCanvasMouseMove}
      onMouseUp={handleCanvasMouseUp}
      onWheel={(e) => {
        e.preventDefault();
        const factor = e.deltaY < 0 ? 1.08 : 0.92;
        setScale(s => Math.max(0.4, Math.min(2.5, s * factor)));
      }}
    >
      {/* Schematic Grid Overlay */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
        <defs>
          <pattern id="schematic-grid" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="#4b5563" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#schematic-grid)" />
      </svg>

      {/* Top Banner & Stats */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-3 bg-[#131313]/90 border border-[#272828] rounded-md px-3.5 py-2 backdrop-blur-md">
        <Zap size={14} className="text-amber-400" />
        <span className="font-tech text-xs tracking-wider uppercase text-gray-300">
          Wiring & Netlist Matrix
        </span>
        <span className="text-[10px] font-mono text-gray-400 bg-[#1c1c1c] px-2 py-0.5 rounded border border-[#333]">
          {wires.length} Connected Nets
        </span>
      </div>

      {/* Canvas Zoom Controls */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-1 bg-[#131313]/90 border border-[#272828] rounded-md p-1.5 backdrop-blur-md">
        <button
          onClick={() => setScale(s => Math.min(2.5, s + 0.15))}
          className="p-1.5 text-gray-400 hover:text-white rounded hover:bg-[#222] transition-colors"
          title="Zoom In"
        >
          <ZoomIn size={14} />
        </button>
        <button
          onClick={() => setScale(s => Math.max(0.4, s - 0.15))}
          className="p-1.5 text-gray-400 hover:text-white rounded hover:bg-[#222] transition-colors"
          title="Zoom Out"
        >
          <ZoomOut size={14} />
        </button>
        <button
          onClick={() => { setScale(1); setPan({ x: 30, y: 30 }); }}
          className="p-1.5 text-gray-400 hover:text-white rounded hover:bg-[#222] transition-colors"
          title="Reset View"
        >
          <Maximize2 size={14} />
        </button>
      </div>

      {/* Interactive Transform Container */}
      <div
        className="absolute inset-0 origin-top-left transition-transform duration-75"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`
        }}
      >
        {/* SVG Wire Lines Layer */}
        <svg className="absolute inset-0 w-[3000px] h-[3000px] pointer-events-none z-0 overflow-visible">
          {wires.map((wire) => {
            const fromPos = nodePositions[wire.fromNode] || { x: 100, y: 100 };
            const toPos = nodePositions[wire.toNode] || { x: 400, y: 100 };

            const x1 = fromPos.x + 240;
            const y1 = fromPos.y + 60;
            const x2 = toPos.x;
            const y2 = toPos.y + 60;

            const dx = Math.abs(x2 - x1) * 0.5;
            const pathData = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;

            const isSelected = selectedWire === wire.id;

            return (
              <g key={wire.id} className="pointer-events-auto cursor-pointer" onClick={() => setSelectedWire(wire.id)}>
                {/* Invisible wide stroke for easier mouse hovering */}
                <path
                  d={pathData}
                  fill="none"
                  stroke="transparent"
                  strokeWidth="16"
                  onMouseEnter={() => setSelectedWire(wire.id)}
                  onMouseLeave={() => setSelectedWire(null)}
                />
                {/* Visible glowing wire */}
                <path
                  d={pathData}
                  fill="none"
                  stroke={wire.color || '#3b82f6'}
                  strokeWidth={isSelected ? '3.5' : '2'}
                  strokeDasharray={isSelected ? '4 2' : 'none'}
                  className="transition-all duration-150"
                  style={{
                    filter: isSelected ? 'drop-shadow(0 0 6px currentColor)' : 'none'
                  }}
                />
                {/* Wire Net Label */}
                {wire.label && (
                  <text
                    x={(x1 + x2) / 2}
                    y={(y1 + y2) / 2 - 8}
                    fill="#9ca3af"
                    fontSize="10"
                    fontFamily="monospace"
                    textAnchor="middle"
                    className="select-none bg-black px-1"
                  >
                    {wire.label}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Component Node Cards */}
        {electricalNodes.map((node) => {
          const pos = nodePositions[node.id] || { x: 100, y: 100 };
          return (
            <div
              key={node.id}
              style={{
                transform: `translate(${pos.x}px, ${pos.y}px)`,
                width: '240px'
              }}
              className="absolute z-10 bg-[#161719] border border-[#2e3138] rounded-lg shadow-xl hover:border-blue-500/80 transition-shadow cursor-move"
              onMouseDown={(e) => handleStartNodeDrag(e, node.id)}
            >
              {/* Node Header */}
              <div className="flex items-center justify-between px-3 py-2 bg-[#1b1d22] border-b border-[#2e3138] rounded-t-lg">
                <div className="flex items-center gap-2 truncate">
                  <Cpu size={14} className="text-blue-400 shrink-0" />
                  <span className="font-tech text-xs font-bold text-gray-200 truncate">
                    {node.name}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-gray-500 uppercase px-1.5 py-0.5 rounded bg-black/40">
                  {node.type}
                </span>
              </div>

              {/* Pins Table */}
              <div className="p-2 space-y-1">
                {node.pins.slice(0, 6).map((pin, pIdx) => (
                  <div
                    key={pIdx}
                    className="flex items-center justify-between text-[11px] font-mono px-2 py-1 rounded bg-[#101113] border border-[#22242a]"
                  >
                    <span className="text-gray-300 font-semibold">{pin.name}</span>
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
                        pin.type === 'power'
                          ? 'text-red-400 bg-red-950/40'
                          : pin.type === 'ground'
                          ? 'text-gray-400 bg-gray-800/40'
                          : 'text-blue-400 bg-blue-950/40'
                      }`}
                    >
                      {pin.signal}
                    </span>
                  </div>
                ))}
                {node.pins.length > 6 && (
                  <div className="text-[10px] font-mono text-gray-500 text-center pt-1">
                    +{node.pins.length - 6} more pins
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Wire Inspector Tooltip */}
      {selectedWire && (
        <div className="absolute bottom-4 left-4 z-20 bg-[#131313]/95 border border-[#3f403f] rounded-lg p-3 text-xs font-mono backdrop-blur-md shadow-2xl">
          <div className="text-gray-400 uppercase text-[10px] mb-1">Selected Net Connection</div>
          <div className="text-white font-bold flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: wires.find(w => w.id === selectedWire)?.color || '#3b82f6' }} />
            {wires.find(w => w.id === selectedWire)?.label || selectedWire}
          </div>
          <div className="text-gray-400 text-[11px] mt-1">
            {wires.find(w => w.id === selectedWire)?.fromNode} → {wires.find(w => w.id === selectedWire)?.toNode}
          </div>
        </div>
      )}
    </div>
  );
}
