'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Car, 
  Wrench, 
  FilePlus2, 
  CheckCircle2, 
  Activity, 
  Globe, 
  Cpu, 
  ChevronDown, 
  RotateCw, 
  Maximize2, 
  MessageSquare 
} from 'lucide-react';

interface DamageHotspot {
  id: string;
  part: string;
  type: string;
  confidence: number;
  cost: number;
  measurement: string;
  color: 'cyan' | 'magenta' | 'amber';
  coords: { x: string; y: string };
}

export default function DamageAssessmentViewerPage() {
  const hotspots: DamageHotspot[] = [
    {
      id: 'front-bumper',
      part: 'FRONT BUMPER',
      type: 'SCRATCHES / IMPACT',
      confidence: 88,
      cost: 950,
      measurement: '6.8mm',
      color: 'cyan',
      coords: { x: '35%', y: '52%' },
    },
    {
      id: 'left-door',
      part: 'LEFT DOOR',
      type: 'DENT / DEEP SCRATCH',
      confidence: 94,
      cost: 1250,
      measurement: '14.5mm',
      color: 'magenta',
      coords: { x: '62%', y: '45%' },
    },
    {
      id: 'rear-quarter',
      part: 'REAR QUARTER PANEL',
      type: 'PAINT ABRASION',
      confidence: 91,
      cost: 650,
      measurement: '9.2mm',
      color: 'amber',
      coords: { x: '78%', y: '55%' },
    },
  ];

  const [selectedHotspot, setSelectedHotspot] = useState<DamageHotspot>(hotspots[0]);
  const [isWireframeMode, setIsWireframeMode] = useState(true);

  const totalCost = hotspots.reduce((sum, h) => sum + h.cost, 0);

  return (
    <div className="min-h-screen bg-[#06070B] text-slate-100 p-4 md:p-6 space-y-6 bg-cyber-grid">
      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 glass-panel p-4 rounded-2xl border-purple-500/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/30">
            <Car className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-white">AETHER AUTO AI</h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                PRO VISION 3.0
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">VIN: AAE-7F4R-3901 • AUDI GTR-7 (2024)</p>
          </div>
        </div>

        {/* Model Selector Pill */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/80 border border-purple-500/30 text-xs font-semibold text-purple-300">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>VEHICLE: AUDI GTR-7</span>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </div>

          <button 
            onClick={() => setIsWireframeMode(!isWireframeMode)}
            className="p-2 rounded-xl glass-panel hover:border-cyan-500/50 text-cyan-400 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <RotateCw className="w-4 h-4" />
            {isWireframeMode ? 'Wireframe Mode' : 'Photorealistic'}
          </button>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: DAMAGE REPORT OVERVIEW */}
        <div className="lg:col-span-3 space-y-4">
          <div className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold px-1">
            DAMAGE REPORT OVERVIEW
          </div>

          <div className="space-y-3">
            {hotspots.map((item) => {
              const isSelected = selectedHotspot.id === item.id;
              const borderClass = 
                item.color === 'cyan' ? 'border-cyan-500/40 bg-cyan-950/20 text-cyan-300' :
                item.color === 'magenta' ? 'border-fuchsia-500/40 bg-fuchsia-950/20 text-fuchsia-300' :
                'border-amber-500/40 bg-amber-950/20 text-amber-300';

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedHotspot(item)}
                  className={`p-4 rounded-2xl cursor-pointer transition-all border ${
                    isSelected ? borderClass + ' shadow-lg glow-cyan scale-[1.02]' : 'glass-panel hover:border-purple-500/40'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold font-mono tracking-wider">{item.part}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 font-mono font-semibold">
                      {item.confidence}% CONFIDENCE
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1 font-light">{item.type}</div>
                  <div className="mt-3 flex justify-between items-center text-xs font-mono">
                    <span className="text-slate-400">ESTIMATED COST</span>
                    <span className="font-extrabold text-white text-sm">${item.cost}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Center Stage: 3D Hologram / Inspection Canvas */}
        <div className="lg:col-span-6 relative rounded-3xl glass-panel p-4 border border-purple-500/30 shadow-2xl flex flex-col justify-between overflow-hidden min-h-[420px]">
          {/* Top Stage Control Overlay */}
          <div className="flex justify-between items-center z-10 p-2">
            <span className="px-3 py-1 rounded-full bg-slate-950/80 border border-purple-500/30 text-xs font-mono text-purple-300">
              STAGE: 360° LASER SCANNER ACTIVE
            </span>
            <button className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-400 hover:text-white">
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          {/* 3D Model Render / Hologram Canvas */}
          <div className="relative w-full h-80 my-auto rounded-2xl overflow-hidden border border-slate-800">
            <Image 
              src={isWireframeMode ? "/images/hologram_car.jpg" : "/images/hero_assessment.jpg"} 
              alt="3D Interactive Vehicle Inspection" 
              fill 
              className="object-cover transition-all duration-500"
            />

            {/* Glowing Hotspot Callout Markers */}
            {hotspots.map((item) => (
              <div 
                key={item.id}
                onClick={() => setSelectedHotspot(item)}
                style={{ top: item.coords.y, left: item.coords.x }}
                className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
              >
                <div className={`w-5 h-5 rounded-full flex items-center justify-center animate-bounce ${
                  item.color === 'cyan' ? 'bg-cyan-400 text-black shadow-lg shadow-cyan-500/50' :
                  item.color === 'magenta' ? 'bg-fuchsia-400 text-black shadow-lg shadow-fuchsia-500/50' :
                  'bg-amber-400 text-black shadow-lg shadow-amber-500/50'
                }`}>
                  <div className="w-2 h-2 rounded-full bg-white" />
                </div>

                {/* Popover Callout */}
                <div className="hidden group-hover:block absolute bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1.5 rounded-lg bg-slate-950 border border-purple-500/40 text-[10px] font-mono text-white shadow-xl">
                  {item.part} [{item.measurement}]
                </div>
              </div>
            ))}
          </div>

          {/* Selected Hotspot Detail Callout Footer */}
          <div className="z-10 p-3 rounded-xl bg-slate-950/90 border border-purple-500/30 flex justify-between items-center font-mono text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
              <span className="text-white font-bold">{selectedHotspot.part}</span>
              <span className="text-slate-400">({selectedHotspot.measurement} depth)</span>
            </div>
            <div className="text-cyan-300 font-bold">${selectedHotspot.cost} ESTIMATE</div>
          </div>
        </div>

        {/* Right Column: REPAIR PLAN */}
        <div className="lg:col-span-3 space-y-4">
          <div className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold px-1">
            REPAIR PLAN
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-purple-500/20 space-y-4 font-mono text-xs">
            <div className="flex justify-between items-center pb-3 border-b border-purple-500/10">
              <span className="text-slate-400">Parts Needed</span>
              <span className="font-extrabold text-white">32 PARTS</span>
            </div>

            <div className="flex justify-between items-center pb-3 border-b border-purple-500/10">
              <span className="text-slate-400">Est. Labor</span>
              <span className="font-extrabold text-white">5,200 hrs</span>
            </div>

            <div className="flex justify-between items-center pb-3 border-b border-purple-500/10">
              <span className="text-slate-400">Severity</span>
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40">
                MODERATE
              </span>
            </div>

            <div className="pt-2 flex justify-between items-center text-sm">
              <span className="text-slate-300 font-bold">TOTAL COST</span>
              <span className="text-2xl font-black text-gradient-purple">${totalCost}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom HUD Telemetry Panel Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-2">
        {/* Vehicle Status Map */}
        <div className="md:col-span-2 glass-panel p-4 rounded-2xl border-purple-500/20 space-y-2">
          <div className="text-[10px] font-mono uppercase text-slate-400 flex items-center justify-between">
            <span>VEHICLE STATUS</span>
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="h-16 rounded-xl bg-slate-900 flex items-center justify-center text-slate-600 text-xs font-mono border border-slate-800">
            GPS: ACTIVE [NYC]
          </div>
        </div>

        {/* Damage Probability Graph */}
        <div className="md:col-span-2 glass-panel p-4 rounded-2xl border-purple-500/20 space-y-2">
          <div className="text-[10px] font-mono uppercase text-slate-400 flex items-center justify-between">
            <span>DAMAGE PROBABILITY</span>
            <Activity className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="h-16 rounded-xl bg-slate-900/60 p-2 border border-slate-800 flex items-end">
            <svg className="w-full h-full text-cyan-400 overflow-visible" viewBox="0 0 100 40">
              <path fill="none" stroke="currentColor" strokeWidth="2" d="M0 35 Q 25 10, 50 30 T 100 5" />
            </svg>
          </div>
        </div>

        {/* Central Actions Bar */}
        <div className="md:col-span-5 glass-panel p-5 rounded-2xl border-purple-500/30 flex flex-col justify-between space-y-3">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-white font-bold">DAMAGE ANALYSIS COMPLETE</span>
            <span className="text-slate-400">VEHICLE: AUDI GTR-7</span>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/claims/new"
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold text-xs tracking-wider uppercase shadow-lg shadow-cyan-500/20 text-center transition-all"
            >
              GENERATE CLAIM
            </Link>

            <button 
              onClick={() => setIsWireframeMode(!isWireframeMode)}
              className="py-3 px-4 rounded-xl bg-slate-900 border border-purple-500/30 text-white font-mono text-xs hover:bg-slate-800 transition-colors"
            >
              VIEW 3D MODEL
            </button>

            <button className="py-3 px-4 rounded-xl bg-slate-900 border border-purple-500/30 text-slate-300 font-mono text-xs hover:bg-slate-800 transition-colors flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
              CONTACT MECHANIC
            </button>
          </div>
        </div>

        {/* Telemetry Live Feed */}
        <div className="md:col-span-3 glass-panel p-4 rounded-2xl border-purple-500/20 space-y-1 font-mono text-[10px]">
          <div className="text-slate-400 uppercase font-bold flex items-center justify-between pb-1 border-b border-purple-500/10">
            <span>LIVE DATA FEED</span>
            <Cpu className="w-3 h-3 text-cyan-400" />
          </div>
          <div className="text-slate-400 flex justify-between"><span>MAX LOWER-CMRK</span> <span className="text-cyan-400 font-bold">100.00</span></div>
          <div className="text-slate-400 flex justify-between"><span>LOW SVIMPEYCNIFT</span> <span className="text-purple-400 font-bold">32,630</span></div>
          <div className="text-slate-400 flex justify-between"><span>MAX DESEVERITY</span> <span className="text-emerald-400 font-bold">100.00</span></div>
        </div>
      </div>
    </div>
  );
}
