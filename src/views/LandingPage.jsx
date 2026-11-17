import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Cpu,
  Layers,
  Wrench,
  Zap,
  CheckCircle2,
  Box,
  Compass,
  DollarSign,
  ChevronRight,
  ShieldCheck,
  Star,
  ExternalLink
} from 'lucide-react';
import { SAMPLE_PROJECTS } from '../data/sampleProjects';

export default function LandingPage({ onGeneratePrompt, onOpenProject, onNavigateCommunity }) {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!prompt.trim() || isGenerating) return;
    setIsGenerating(true);
    onGeneratePrompt(prompt);
  };

  const starterPrompts = [
    "Quadruped robot dog with 12 servos and ESP32",
    "Cyberpunk wrist terminal with round DSI screen",
    "Automated aeroponics plant incubator with sensors",
    "Handheld thermal camera with RP2040 and TFT screen"
  ];

  return (
    <div className="min-h-screen bg-[#131313] text-[#f8f8f7] flex flex-col font-sans selection:bg-[#3f403f] selection:text-white">
      {/* Header Bar */}
      <header className="h-16 border-b border-[#24262c] bg-[#131313]/90 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2 font-tech text-lg font-bold tracking-wider text-white">
            <span className="w-5 h-5 rounded bg-blue-600 flex items-center justify-center text-[11px] font-mono font-bold text-white">B</span>
            BLUEPRINT
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs font-mono uppercase tracking-wider text-gray-400">
            <button onClick={onNavigateCommunity} className="hover:text-white transition-colors">
              Community
            </button>
            <a href="#features" className="hover:text-white transition-colors">
              Features
            </a>
            <a href="#pricing" className="hover:text-white transition-colors">
              Pricing
            </a>
            <a href="#faq" className="hover:text-white transition-colors">
              FAQ
            </a>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onOpenProject(SAMPLE_PROJECTS[0])}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-mono uppercase border border-[#333642] text-gray-300 hover:text-white hover:bg-[#1f2127] transition-colors"
          >
            Explore Sample
          </button>
          <button
            onClick={() => onGeneratePrompt("Autonomous Quadruped Robot Dog with ESP32-S3 and Servos")}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md text-xs font-mono uppercase font-bold tracking-wider transition-colors shadow-lg shadow-blue-900/30"
          >
            <span>Launch Studio</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 px-6 max-w-6xl mx-auto w-full flex flex-col items-center text-center">
        {/* Release / Tech Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1b1d24] border border-[#2d303b] text-[11px] font-mono text-gray-300 mb-6 backdrop-blur-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Blueprint 2.0 • AI Hardware Synthesis Engine</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold font-tech tracking-tight text-white max-w-4xl leading-[1.1]">
          Make Any Hardware <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400">
            Idea Real.
          </span>
        </h1>

        <p className="mt-5 text-sm sm:text-base font-mono text-gray-400 max-w-2xl leading-relaxed">
          Turn one prompt into a buildable hardware project, complete with interactive 3D CAD models, bill of materials with distributor pricing, circuit wiring diagrams, and assembly guides.
        </p>

        {/* Interactive Prompt Box */}
        <div className="mt-10 w-full max-w-2xl bg-[#171920] border border-[#2c2f3b] focus-within:border-blue-500 rounded-2xl p-3 shadow-2xl transition-all">
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <textarea
              rows={3}
              placeholder="Describe any hardware idea (e.g. autonomous robot dog with ESP32, cyberdeck with round screen, greenhouse controller)..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full bg-transparent text-sm font-mono text-white placeholder-gray-500 focus:outline-none resize-none px-2 pt-1"
            />

            <div className="flex items-center justify-between pt-2 border-t border-[#232630]">
              <div className="flex items-center gap-2 text-[11px] font-mono text-gray-500">
                <Sparkles size={13} className="text-blue-400" />
                <span>Multimodal Hardware AI</span>
              </div>

              <button
                type="submit"
                disabled={!prompt.trim() || isGenerating}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-xl text-xs font-mono uppercase font-bold tracking-wider disabled:opacity-40 transition-all shadow-md"
              >
                <span>{isGenerating ? 'Synthesizing…' : 'Generate Project'}</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </form>
        </div>

        {/* Starter Prompt Chips */}
        <div className="mt-4 flex flex-wrap justify-center gap-2 max-w-2xl">
          {starterPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => { setPrompt(p); onGeneratePrompt(p); }}
              className="text-[11px] font-mono text-gray-400 hover:text-white bg-[#181a22] hover:bg-[#20232e] border border-[#282b36] px-3 py-1.5 rounded-full transition-colors text-left"
            >
              + {p}
            </button>
          ))}
        </div>

        {/* Hero Visual Render Showcase */}
        <div className="mt-14 relative w-full max-w-4xl rounded-2xl border border-[#2b2e3a] bg-[#0c0d10] p-6 shadow-2xl overflow-hidden group">
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
            <span className="font-tech text-xs tracking-wider uppercase text-gray-300 bg-black/60 border border-[#333] px-3 py-1 rounded-md backdrop-blur-md">
              MechView • 3D Hardware Assembly
            </span>
          </div>

          <div className="relative flex items-center justify-center py-8">
            <div className="absolute inset-0 bg-blue-600/10 blur-3xl rounded-full" />
            <img
              src="/landing/images/hero-dog.webp"
              alt="Autonomous Quadruped Robot Dog"
              className="relative z-10 max-h-[420px] w-auto object-contain drop-shadow-[0_25px_40px_rgba(0,0,0,0.8)] group-hover:scale-102 transition-transform duration-500"
            />
          </div>

          <div className="border-t border-[#1f212a] pt-4 flex flex-wrap items-center justify-between text-xs font-mono text-gray-400 gap-4">
            <div>
              <span className="text-white font-bold">Featured Blueprint:</span> Autonomous Quadruped Robot Dog
            </div>
            <button
              onClick={() => onOpenProject(SAMPLE_PROJECTS[0])}
              className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 font-bold uppercase transition-colors"
            >
              <span>Inspect in Studio</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* Core Platform Pillars / Features */}
      <section id="features" className="py-20 border-t border-[#22242c] bg-[#0e0f13] px-6">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <div className="text-xs font-mono uppercase tracking-widest text-blue-400 font-bold">
              Engineering Architecture
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-tech tracking-wide text-white">
              Everything Needed to Go From Idea to Physical Build
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Cpu,
                title: "Live Distributor BOM",
                desc: "Matches real electronic and mechanical components across DigiKey, Mouser, and Adafruit with live stock and pricing."
              },
              {
                icon: Zap,
                title: "Circuit & Wiring Diagrams",
                desc: "Pinout routing matrices, signal rail inference (5V, 3.3V, GND, I2C, SPI), and connection netlists."
              },
              {
                icon: Box,
                title: "Parametric 3D CAD",
                desc: "Interactive WebGL 3D mechanical models, exploded views, standoffs, PCB layout, and 3D printable enclosures."
              },
              {
                icon: Wrench,
                title: "Physical Assembly Manual",
                desc: "Step-by-step assembly guides with tool lists, soldering instructions, and firmware calibration checkpoints."
              }
            ].map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="bg-[#14151a] border border-[#252732] rounded-xl p-6 space-y-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                    <Icon size={20} />
                  </div>
                  <h3 className="font-tech text-base font-bold text-white">{f.title}</h3>
                  <p className="text-xs font-mono text-gray-400 leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section id="pricing" className="py-20 border-t border-[#22242c] px-6 bg-[#131418]">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <div className="text-xs font-mono uppercase tracking-widest text-blue-400 font-bold">
              Transparent Pricing
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-tech text-white">
              Simple Plans for Makers & Hardware Engineers
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free */}
            <div className="bg-[#16171d] border border-[#2a2d38] rounded-2xl p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="font-tech text-lg font-bold text-gray-200">Community Free</div>
                <div className="text-3xl font-extrabold font-mono text-white">$0</div>
                <p className="text-xs font-mono text-gray-400">For students, hobbyists, and weekend tinkerers.</p>
                <div className="space-y-2 pt-2 text-xs font-mono text-gray-300">
                  <div className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-400" /> Unlimited Public Projects</div>
                  <div className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-400" /> Complete BOM & Distributor Sourcing</div>
                  <div className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-400" /> Wiring Schematics & Netlists</div>
                  <div className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-400" /> Standard Assembly Manuals</div>
                </div>
              </div>
              <button
                onClick={() => onGeneratePrompt("IoT Temperature Sensor with ESP32")}
                className="w-full py-2.5 rounded-lg border border-[#3e4252] text-xs font-mono uppercase font-bold text-gray-200 hover:text-white hover:bg-[#20222a] transition-colors"
              >
                Get Started Free
              </button>
            </div>

            {/* Pro */}
            <div className="bg-[#181a24] border-2 border-blue-500 rounded-2xl p-8 flex flex-col justify-between space-y-6 relative shadow-2xl shadow-blue-900/20">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-mono uppercase font-bold tracking-wider px-3 py-0.5 rounded-full">
                Most Popular
              </div>
              <div className="space-y-4">
                <div className="font-tech text-lg font-bold text-white">Blueprint Pro</div>
                <div className="text-3xl font-extrabold font-mono text-white">$20 <span className="text-xs text-gray-400 font-normal">/ month</span></div>
                <p className="text-xs font-mono text-gray-400">For professional engineers, startups, and R&D labs.</p>
                <div className="space-y-2 pt-2 text-xs font-mono text-gray-200">
                  <div className="flex items-center gap-2"><CheckCircle2 size={14} className="text-blue-400" /> Everything in Free</div>
                  <div className="flex items-center gap-2"><CheckCircle2 size={14} className="text-blue-400" /> Private Hardware Projects</div>
                  <div className="flex items-center gap-2"><CheckCircle2 size={14} className="text-blue-400" /> High-Resolution 3D CAD Exports (STEP/GLB)</div>
                  <div className="flex items-center gap-2"><CheckCircle2 size={14} className="text-blue-400" /> Priority Multimodal Reasoning (Ultra Model)</div>
                  <div className="flex items-center gap-2"><CheckCircle2 size={14} className="text-blue-400" /> Real-time Team Collaboration</div>
                </div>
              </div>
              <button
                onClick={() => onGeneratePrompt("Autonomous Quadruped Robot Dog with ESP32-S3")}
                className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-mono uppercase font-bold text-white transition-colors shadow-lg shadow-blue-900/40"
              >
                Start Pro Trial
              </button>
            </div>

            {/* Enterprise */}
            <div className="bg-[#16171d] border border-[#2a2d38] rounded-2xl p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="font-tech text-lg font-bold text-gray-200">Enterprise CAD</div>
                <div className="text-3xl font-extrabold font-mono text-white">Custom</div>
                <p className="text-xs font-mono text-gray-400">Custom supplier integration, ERP connector, dedicated compute.</p>
                <div className="space-y-2 pt-2 text-xs font-mono text-gray-300">
                  <div className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-400" /> Custom Internal Parts Catalogue</div>
                  <div className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-400" /> On-Premise / Private Cloud VPC</div>
                  <div className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-400" /> SLA & Dedicated Engineering Support</div>
                </div>
              </div>
              <button
                onClick={() => alert("Enterprise contact inquiries: enterprise@blueprint.io")}
                className="w-full py-2.5 rounded-lg border border-[#3e4252] text-xs font-mono uppercase font-bold text-gray-200 hover:text-white hover:bg-[#20222a] transition-colors"
              >
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 border-t border-[#22242c] bg-[#0c0d10] px-6">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold font-tech text-white">Frequently Asked Questions</h2>
            <p className="text-xs font-mono text-gray-400">Common questions about Blueprint hardware design.</p>
          </div>

          <div className="space-y-4 text-xs font-mono">
            {[
              {
                q: "How does Blueprint generate hardware from a text prompt?",
                a: "Blueprint uses a multimodal AI architecture combining hardware component ontology, parametric CAD engines (ForgeCAD), and circuit netlist solvers to translate functional requirements into physical parts, pinouts, and enclosures."
              },
              {
                q: "Are the components real and actually available to buy?",
                a: "Yes. Every component in the Bill of Materials maps to authentic manufacturer part numbers (MPNs) with real-time stock levels and direct purchase links from DigiKey, Mouser, Adafruit, SparkFun, and AliExpress."
              },
              {
                q: "Can I export the 3D models for 3D printing?",
                a: "Yes! You can download the 3D enclosure and mechanical brackets directly as STL or GLB meshes ready for your slicer (Cura, PrusaSlicer, Bambu Studio) or as STEP files for CAD software (Fusion 360, SolidWorks, FreeCAD)."
              },
              {
                q: "Can I modify the design after it is generated?",
                a: "Absolutely. Use the Blueprint AI assistant in the left drawer to ask for changes (e.g. 'Add a temperature sensor', 'Switch to a 12V supply', 'Make the enclosure water resistant'), and approve the plan with one click."
              }
            ].map((item, idx) => (
              <div key={idx} className="bg-[#14151a] border border-[#252732] rounded-xl p-5 space-y-2">
                <div className="font-bold text-sm text-gray-100 font-tech">{item.q}</div>
                <div className="text-gray-400 leading-relaxed">{item.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#22242c] bg-[#0b0b0d] py-10 px-6 text-xs font-mono text-gray-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-tech text-white font-bold tracking-wider">BLUEPRINT LABS</span>
            <span>•</span>
            <span>AI Hardware Design. Make Any Idea Real.</span>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={onNavigateCommunity} className="hover:text-white transition-colors">Community</button>
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
