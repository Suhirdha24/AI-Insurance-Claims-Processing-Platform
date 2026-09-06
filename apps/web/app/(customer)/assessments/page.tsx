'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Car, 
  Bike, 
  RotateCw, 
  Maximize2, 
  MessageSquare,
  Globe,
  Activity,
  Cpu,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Crosshair,
  Settings,
  Zap,
  Sliders
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
  image: string;
}

type VehicleType = 'car' | 'bike';

export default function DamageAssessmentViewerPage() {
  const [vehicleType, setVehicleType] = useState<VehicleType>('car');
  const [isWireframeMode, setIsWireframeMode] = useState(true);

  // 4-Wheeler Car Dataset
  const carHotspots: DamageHotspot[] = [
    {
      id: 'car-front-bumper',
      part: 'FRONT BUMPER',
      type: 'SCRATCHES/IMPACT',
      confidence: 88,
      cost: 78500,
      measurement: '6.8mm',
      color: 'cyan',
      coords: { x: '34%', y: '50%' },
      image: '/images/car_front_bumper.jpg',
    },
    {
      id: 'car-left-door',
      part: 'LEFT DOOR',
      type: 'DENT/SCRATCH',
      confidence: 94,
      cost: 102500,
      measurement: '14.5mm',
      color: 'magenta',
      coords: { x: '63%', y: '45%' },
      image: '/images/car_left_door.jpg',
    },
    {
      id: 'car-rear-quarter',
      part: 'REAR QUARTER PANEL',
      type: 'PAINT ABRASION',
      confidence: 91,
      cost: 52000,
      measurement: '9.2mm',
      color: 'amber',
      coords: { x: '78%', y: '56%' },
      image: '/images/car_rear_quarter.jpg',
    },
  ];

  // 2-Wheeler Motorcycle Dataset
  const bikeHotspots: DamageHotspot[] = [
    {
      id: 'bike-front-fork',
      part: 'FRONT FORK',
      type: 'HYDRAULIC LEAK/BEND',
      confidence: 96,
      cost: 18500,
      measurement: '4.2mm',
      color: 'cyan',
      coords: { x: '32%', y: '48%' },
      image: '/images/bike_front_fork.jpg',
    },
    {
      id: 'bike-fuel-tank',
      part: 'FUEL TANK',
      type: 'DENT/SCRATCH',
      confidence: 98,
      cost: 24000,
      measurement: '1.45cm',
      color: 'magenta',
      coords: { x: '55%', y: '38%' },
      image: '/images/bike_fuel_tank.jpg',
    },
    {
      id: 'bike-rear-exhaust',
      part: 'REAR EXHAUST',
      type: 'MUFFLER ABRASION',
      confidence: 93,
      cost: 12500,
      measurement: '8.5mm',
      color: 'amber',
      coords: { x: '75%', y: '60%' },
      image: '/images/bike_rear_exhaust.jpg',
    },
  ];

  const hotspots = vehicleType === 'car' ? carHotspots : bikeHotspots;
  const wireframeImage = vehicleType === 'car' ? '/images/hologram_car.jpg' : '/images/hologram_bike.jpg';

  const [selectedHotspot, setSelectedHotspot] = useState<DamageHotspot>(carHotspots[0]);

  const handleVehicleTypeChange = (type: VehicleType) => {
    setVehicleType(type);
    const targetHotspots = type === 'car' ? carHotspots : bikeHotspots;
    setSelectedHotspot(targetHotspots[0]);
  };

  const handleSelectHotspot = (item: DamageHotspot) => {
    setSelectedHotspot(item);
    setIsWireframeMode(false);
  };

  const totalCost = hotspots.reduce((sum, h) => sum + h.cost, 0);

  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top Banner Control Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl border border-cyan-500/20 glass-panel shadow-lg">
        <div>
          <h1 className="text-xl font-black tracking-wider uppercase text-white flex items-center gap-2">
            <span>AI Holographic Damage Assessment</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 font-mono">
              3D TURNTABLE LIVE
            </span>
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Real-time computer vision scan & depth analysis for claims verification
          </p>
        </div>

        {/* 4W vs 2W Switcher */}
        <div className="flex items-center p-1 rounded-xl bg-slate-950/80 border border-cyan-500/30 text-xs font-mono font-bold">
          <button
            onClick={() => handleVehicleTypeChange('car')}
            className={`px-3.5 py-1.5 rounded-lg flex items-center gap-2 transition-all ${
              vehicleType === 'car'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Car className="w-4 h-4" />
            <span>4W (CAR)</span>
          </button>
          <button
            onClick={() => handleVehicleTypeChange('bike')}
            className={`px-3.5 py-1.5 rounded-lg flex items-center gap-2 transition-all ${
              vehicleType === 'bike'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Bike className="w-4 h-4" />
            <span>2W (BIKE)</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: DAMAGE REPORT OVERVIEW */}
        <div className="lg:col-span-3 space-y-3">
          <div className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold px-1 flex justify-between items-center">
            <span>DAMAGE REPORT OVERVIEW</span>
            <span className="text-[10px] text-cyan-400 font-normal">PRO VISION 3.0</span>
          </div>

          <div className="space-y-3">
            {hotspots.map((item) => {
              const isSelected = selectedHotspot.id === item.id;
              const borderClass = 
                item.color === 'cyan' ? 'border-cyan-500/50 bg-cyan-950/30 text-cyan-300' :
                item.color === 'magenta' ? 'border-fuchsia-500/50 bg-fuchsia-950/30 text-fuchsia-300' :
                'border-amber-500/50 bg-amber-950/30 text-amber-300';

              return (
                <div
                  key={item.id}
                  onClick={() => handleSelectHotspot(item)}
                  className={`p-4 rounded-2xl cursor-pointer transition-all border ${
                    isSelected 
                      ? borderClass + ' shadow-lg glow-cyan scale-[1.02] ring-1 ring-cyan-500/50' 
                      : 'glass-panel hover:border-cyan-500/40 opacity-90 hover:opacity-100'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-black font-mono tracking-wider text-white">{item.part}</span>
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 mt-1 uppercase font-semibold">
                    {item.type} | <span className="text-cyan-400 font-bold">{item.confidence}% CONFIDENCE</span>
                  </div>
                  <div className="mt-3 flex justify-between items-center text-xs font-mono">
                    <span className="text-slate-400 text-[10px]">ESTIMATED COST</span>
                    <span className="font-extrabold text-cyan-300 text-sm">{formatINR(item.cost)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Center Stage: 3D Holographic Turntable Inspection Stage */}
        <div className="lg:col-span-6 relative rounded-3xl glass-panel p-4 border border-cyan-500/30 shadow-2xl flex flex-col justify-between overflow-hidden min-h-[460px]">
          {/* Top Model Badge Pill */}
          <div className="flex justify-center items-center z-10">
            <div className="px-4 py-1 rounded-full bg-slate-950/90 border border-cyan-500/40 text-xs font-mono text-cyan-300 flex items-center gap-3 shadow-lg">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span className="font-extrabold text-white tracking-wider">
                {vehicleType === 'car' ? 'AETHER GTR-7' : 'ROYAL ENFIELD 350'}
              </span>
              <span className="text-slate-500">|</span>
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-slate-500">|</span>
              <Settings className="w-3.5 h-3.5 text-purple-400" />
            </div>
          </div>

          {/* 3D Hologram Turntable Stage Container */}
          <div className="relative w-full h-80 md:h-96 my-auto rounded-2xl overflow-hidden bg-slate-950 flex items-center justify-center">
            <Image 
              key={`${vehicleType}-${selectedHotspot.id}-${isWireframeMode}`}
              src={isWireframeMode ? wireframeImage : selectedHotspot.image} 
              alt="3D Hologram Inspection Stage" 
              fill 
              className="object-cover transition-all duration-700 animate-in fade-in"
              priority
            />

            {/* Glowing Hologram Hotspot Laser Callouts */}
            {isWireframeMode && hotspots.map((item) => (
              <div 
                key={item.id}
                onClick={() => handleSelectHotspot(item)}
                style={{ top: item.coords.y, left: item.coords.x }}
                className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
              >
                {/* Glowing Beacon Indicator */}
                <div className={`w-4 h-4 rounded-full flex items-center justify-center animate-bounce ${
                  item.color === 'cyan' ? 'bg-cyan-400 text-black shadow-lg shadow-cyan-500/60' :
                  item.color === 'magenta' ? 'bg-fuchsia-400 text-black shadow-lg shadow-fuchsia-500/60' :
                  'bg-amber-400 text-black shadow-lg shadow-amber-500/60'
                }`}>
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                </div>

                {/* Laser Callout Annotation Box */}
                <div className="absolute left-6 -top-3 whitespace-nowrap p-2 rounded-lg bg-slate-950/95 border border-cyan-500/40 text-[10px] font-mono text-white shadow-2xl space-y-0.5">
                  <div className="font-extrabold text-cyan-300">{item.part}</div>
                  <div className="text-slate-400 text-[9px]">[{item.type}]</div>
                  <div className="text-fuchsia-400 font-bold">{item.measurement}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Stage Bottom Control Status Bar */}
          <div className="z-10 px-4 py-2 rounded-xl bg-slate-950/90 border border-cyan-500/30 flex justify-between items-center text-[10px] font-mono text-slate-400">
            <div className="flex items-center gap-2">
              <span className="text-cyan-400 font-bold">STAGE: 360° LASER SCANNER ACTIVE</span>
              <span>•</span>
              <span>{isWireframeMode ? 'WIREFRAME MODEL' : `AI PHOTO SCAN (${selectedHotspot.part})`}</span>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsWireframeMode(!isWireframeMode)}
                className="text-cyan-300 font-bold hover:underline"
              >
                {isWireframeMode ? 'Show Damage Photo' : 'Show 3D Wireframe'}
              </button>
              <span>STATUS: ⚡ 🔒 ⚙</span>
            </div>
          </div>
        </div>

        {/* Right Column: REPAIR PLAN */}
        <div className="lg:col-span-3 space-y-3">
          <div className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold px-1">
            REPAIR PLAN
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-cyan-500/20 space-y-4 font-mono text-xs">
            <div className="flex justify-between items-center pb-3 border-b border-cyan-500/10">
              <span className="text-slate-400">Parts Needed</span>
              <span className="font-extrabold text-white">
                {vehicleType === 'car' ? '32 PARTS' : '14 PARTS'}
              </span>
            </div>

            <div className="flex justify-between items-center pb-3 border-b border-cyan-500/10">
              <span className="text-slate-400">Est. Labor</span>
              <span className="font-extrabold text-white">
                {vehicleType === 'car' ? '5,200 hrs' : '1,800 hrs'}
              </span>
            </div>

            <div className="flex justify-between items-center pb-3 border-b border-cyan-500/10">
              <span className="text-slate-400">Severity</span>
              <span className="px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-extrabold border border-amber-500/40 text-[10px]">
                MODERATE
              </span>
            </div>

            <div className="pt-2 flex justify-between items-center text-sm">
              <span className="text-slate-300 font-bold">TOTAL COST</span>
              <span className="text-xl font-black text-cyan-300">{formatINR(totalCost)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom HUD 5-Column Telemetry Panel Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-1 font-mono text-[10px]">
        {/* 1. VEHICLE STATUS (World Map) */}
        <div className="md:col-span-2 glass-panel p-3.5 rounded-2xl border-cyan-500/20 space-y-2">
          <div className="text-slate-400 uppercase font-bold flex items-center justify-between">
            <span>VEHICLE STATUS</span>
            <Globe className="w-3 h-3 text-cyan-400" />
          </div>
          <div className="h-20 rounded-xl bg-slate-950 border border-slate-800 relative flex items-center justify-center overflow-hidden">
            <Globe className="w-16 h-16 text-cyan-500/20 absolute -right-2 -bottom-2" />
            <div className="text-cyan-300 text-center z-10 font-bold">
              <div>GPS: ACTIVE</div>
              <div className="text-[9px] text-slate-500">[IND / DL]</div>
            </div>
          </div>
        </div>

        {/* 2. DAMAGE PROBABILITY GRAPH */}
        <div className="md:col-span-2 glass-panel p-3.5 rounded-2xl border-cyan-500/20 space-y-2">
          <div className="text-slate-400 uppercase font-bold flex items-center justify-between">
            <span>DAMAGE PROBABILITY</span>
            <Activity className="w-3 h-3 text-purple-400" />
          </div>
          <div className="h-20 rounded-xl bg-slate-950 p-2 border border-slate-800 flex items-end relative overflow-hidden">
            <div className="absolute left-1 top-1 text-[8px] text-slate-600">100</div>
            <div className="absolute left-1 bottom-1 text-[8px] text-slate-600">0</div>
            <svg className="w-full h-full text-purple-400 ml-3 overflow-visible" viewBox="0 0 100 40">
              <path fill="none" stroke="currentColor" strokeWidth="2" d="M0 35 Q 25 10, 50 30 T 100 5" />
            </svg>
          </div>
        </div>

        {/* 3. DAMAGE ANALYSIS (Central Action Panel) */}
        <div className="md:col-span-5 glass-panel p-4 rounded-2xl border-cyan-500/30 flex flex-col justify-between space-y-3">
          <div className="text-center space-y-1">
            <h4 className="text-xs font-black text-white uppercase tracking-wider">DAMAGE ANALYSIS COMPLETE</h4>
            <div className="text-[10px] text-slate-400">
              VEHICLE: <span className="text-cyan-300 font-bold">{vehicleType === 'car' ? 'AETHER GTR-7 (2024)' : 'ROYAL ENFIELD 350'}</span> | VIN: <span className="text-slate-300">AAE-7F4R-3901</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              href="/claims/new"
              className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-black text-[11px] tracking-wider uppercase shadow-lg shadow-cyan-500/30 text-center transition-all"
            >
              GENERATE CLAIM
            </Link>

            <button 
              onClick={() => setIsWireframeMode(!isWireframeMode)}
              className="py-2.5 px-3 rounded-xl bg-slate-950 border border-cyan-500/30 text-white font-bold text-[10px] hover:bg-slate-900 transition-colors"
            >
              VIEW 3D MODEL
            </button>

            <button className="py-2.5 px-3 rounded-xl bg-slate-950 border border-cyan-500/30 text-slate-300 font-bold text-[10px] hover:bg-slate-900 transition-colors flex items-center gap-1">
              <MessageSquare className="w-3 h-3 text-purple-400" />
              CONTACT MECHANIC
            </button>
          </div>
        </div>

        {/* 4. AI DIAGNOSTIC RADAR */}
        <div className="md:col-span-1.5 glass-panel p-3.5 rounded-2xl border-cyan-500/20 space-y-2">
          <div className="text-slate-400 uppercase font-bold flex items-center justify-between">
            <span>AI DIAGNOSTIC</span>
            <Crosshair className="w-3 h-3 text-cyan-400" />
          </div>
          <div className="h-20 rounded-xl bg-slate-950 border border-slate-800 relative flex items-center justify-center">
            <div className="w-12 h-12 rounded-full border border-cyan-500/30 flex items-center justify-center">
              <div className="w-6 h-6 rounded-full border border-cyan-500/50 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              </div>
            </div>
          </div>
        </div>

        {/* 5. LIVE DATA FEED TELEMETRY */}
        <div className="md:col-span-1.5 glass-panel p-3 rounded-2xl border-cyan-500/20 space-y-1 font-mono text-[9px]">
          <div className="text-slate-400 uppercase font-bold flex items-center justify-between pb-1 border-b border-slate-800">
            <span>LIVE DATA FEED</span>
            <Cpu className="w-3 h-3 text-cyan-400" />
          </div>
          <div className="text-slate-400 flex justify-between"><span>MAX LOWER-CMRK</span> <span className="text-cyan-400 font-bold">100.00</span></div>
          <div className="text-slate-400 flex justify-between"><span>LOW SVIMPE/CNIFT</span> <span className="text-purple-400 font-bold">32,630</span></div>
          <div className="text-slate-400 flex justify-between"><span>MAX DESEVERITY</span> <span className="text-emerald-400 font-bold">100.00</span></div>
          <div className="text-slate-400 flex justify-between"><span>MAR. UNIVUEGAITY</span> <span className="text-slate-500">00.00</span></div>
          <div className="text-slate-400 flex justify-between"><span>MAR. CONFIDENCY</span> <span className="text-slate-500">00.00</span></div>
          <div className="text-slate-400 flex justify-between"><span>LIVE DATA</span> <span className="text-slate-500">00.00</span></div>
        </div>
      </div>
    </div>
  );
}
