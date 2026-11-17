import React, { useState } from 'react';
import { Search, Star, ExternalLink, Cpu, Layers, DollarSign, Filter, ArrowUpRight } from 'lucide-react';
import { SAMPLE_PROJECTS } from '../data/sampleProjects';

export default function CommunityView({ onOpenProject, onNavigateHome }) {
  const [projects, setProjects] = useState(SAMPLE_PROJECTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [starredMap, setStarredMap] = useState({});

  const toggleStar = (e, id) => {
    e.stopPropagation();
    setStarredMap(prev => {
      const isStarred = !!prev[id];
      const next = { ...prev, [id]: !isStarred };
      setProjects(list => list.map(p => {
        if (p.id === id) {
          return { ...p, stars: p.stars + (isStarred ? -1 : 1) };
        }
        return p;
      }));
      return next;
    });
  };

  const filteredProjects = projects.filter(p => {
    const matchesCategory = activeCategory === 'All' || p.category.toLowerCase().includes(activeCategory.toLowerCase());
    const matchesSearch = !searchQuery ||
      p.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.author && p.author.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#0e0f12] text-[#f8f8f7] flex flex-col font-sans">
      {/* Top Navigation */}
      <header className="h-16 border-b border-[#24262c] bg-[#111215]/90 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-6">
          <button
            onClick={onNavigateHome}
            className="flex items-center gap-2 font-tech text-lg font-bold tracking-wider text-white hover:text-gray-300 transition-colors"
          >
            <span className="w-5 h-5 rounded bg-blue-600 flex items-center justify-center text-[11px] font-mono font-bold text-white">B</span>
            BLUEPRINT
          </button>
          <span className="font-mono text-xs uppercase px-2 py-0.5 rounded bg-[#1c1d24] text-gray-400 border border-[#2b2d38]">
            Community Showcase
          </span>
        </div>

        <button
          onClick={onNavigateHome}
          className="text-xs font-mono uppercase px-3 py-1.5 rounded-md border border-[#30333f] text-gray-300 hover:text-white hover:bg-[#1a1b22] transition-colors"
        >
          Back to Generator
        </button>
      </header>

      {/* Hero Headline */}
      <div className="py-12 px-6 max-w-7xl mx-auto w-full text-center space-y-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold font-tech tracking-wide text-white">
          Explore Public Hardware Blueprints
        </h1>
        <p className="text-sm font-mono text-gray-400 max-w-2xl mx-auto">
          Browse, inspect, and fork open-source electronics, schematics, 3D enclosures, and assembly manuals designed with Blueprint AI.
        </p>

        {/* Search & Filter Bar */}
        <div className="pt-4 max-w-xl mx-auto flex items-center gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search robotic dogs, wrist terminals, sensors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#15171d] border border-[#2a2d38] rounded-lg pl-10 pr-4 py-2 text-xs font-mono text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap justify-center gap-2 pt-2">
          {['All', 'Robotics', 'Wearables', 'Automation', 'IoT'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono uppercase transition-colors ${
                activeCategory === cat
                  ? 'bg-blue-600 text-white font-bold'
                  : 'bg-[#181a21] text-gray-400 hover:text-white border border-[#272a34]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((p) => {
            const isStarred = !!starredMap[p.id];
            return (
              <div
                key={p.id}
                onClick={() => onOpenProject(p)}
                className="group bg-[#131418] hover:bg-[#171920] border border-[#24262f] hover:border-blue-500/60 rounded-xl overflow-hidden transition-all duration-200 cursor-pointer flex flex-col shadow-lg"
              >
                {/* Thumbnail Header */}
                <div className="h-48 bg-[#090a0d] relative overflow-hidden flex items-center justify-center p-4">
                  <div className="absolute inset-0 bg-blue-500/5 group-hover:bg-blue-500/10 transition-colors" />
                  <img
                    src={p.thumbnail}
                    alt={p.projectName}
                    className="max-h-full max-w-full object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.7)] group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Category Pill */}
                  <div className="absolute top-3 left-3">
                    <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-md bg-black/70 border border-[#333] text-gray-300 backdrop-blur-md">
                      {p.category}
                    </span>
                  </div>

                  {/* Star Action */}
                  <button
                    onClick={(e) => toggleStar(e, p.id)}
                    className={`absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono backdrop-blur-md border transition-colors ${
                      isStarred
                        ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                        : 'bg-black/60 text-gray-400 border-[#333] hover:text-white'
                    }`}
                  >
                    <Star size={12} className={isStarred ? 'fill-amber-400 text-amber-400' : ''} />
                    <span>{p.stars}</span>
                  </button>
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-tech text-base font-bold text-white group-hover:text-blue-400 transition-colors flex items-center justify-between">
                      <span className="truncate">{p.projectName}</span>
                      <ArrowUpRight size={15} className="text-gray-500 group-hover:text-blue-400 shrink-0 ml-2 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </h3>
                    <p className="text-xs font-mono text-gray-400 line-clamp-2 mt-1.5 leading-relaxed">
                      {p.description}
                    </p>
                  </div>

                  {/* Stats Footer */}
                  <div className="pt-3 border-t border-[#1f2128] flex items-center justify-between text-xs font-mono text-gray-400">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Cpu size={12} className="text-blue-400" />
                        {p.nodes?.length || 8} parts
                      </span>
                      <span className="flex items-center gap-1 text-emerald-400 font-bold">
                        <DollarSign size={12} />
                        {(p.estimatedCost || 100).toFixed(2)}
                      </span>
                    </div>

                    <div className="text-[11px] text-gray-500">
                      by {p.author}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
