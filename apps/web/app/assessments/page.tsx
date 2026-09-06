'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Car, 
  Bike, 
  Wrench, 
  FilePlus2, 
  CheckCircle2, 
  Activity, 
  Globe, 
  Cpu, 
  ChevronDown, 
  RotateCw, 
  Maximize2, 
  MessageSquare,
  ArrowLeft,
  LayoutDashboard,
  FileText,
  UserCheck,
  ShieldAlert
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

  // 4-Wheeler Car Dataset
  const carHotspots: DamageHotspot[] = [
    {
      id: 'car-front-bumper',
      part: 'FRONT BUMPER',
      type: 'SCRATCHES / IMPACT',
      confidence: 98,
      cost: 78500,
      measurement: '6.8mm',
      color: 'cyan',
      coords: { x: '35%', y: '52%' },
      image: '/images/car_front_bumper.jpg',
    },
    {
      id: 'car-left-door',
      part: 'LEFT DOOR',
      type: 'DENT / DEEP SCRATCH',
      confidence: 94,
      cost: 102500,
      measurement: '14.5mm',
      color: 'magenta',
      coords: { x: '62%', y: '45%' },
      image: '/images/car_left_door.jpg',
    },
    {
      id: 'car-rear-quarter',
      part: 'REAR QUARTER PANEL',
      type: 'PAINT ABRASION & TAIL LIGHT',
      confidence: 91,
      cost: 52000,
      measurement: '9.2mm',
      color: 'amber',
      coords: { x: '78%', y: '55%' },
      image: '/images/car_rear_quarter.jpg',
    },
  ];

  // 2-Wheeler Motorcycle Dataset
  const bikeHotspots: DamageHotspot[] = [
    {
      id: 'bike-front-fork',
      part: 'FRONT FORK & HANDLEBAR',
      type: 'HYDRAULIC LEAK & BEND',
      confidence: 96,
      cost: 18500,
      measurement: '4.2mm',
      color: 'cyan',
      coords: { x: '32%', y: '48%' },
      image: '/images/bike_front_fork.jpg',
    },
    {
      id: 'bike-fuel-tank',
      part: 'FUEL TANK & FAIRING',
      type: 'DENT & PAINT SCUFF',
      confidence: 98,
      cost: 24000,
      measurement: '1.45cm',
      color: 'magenta',
      coords: { x: '55%', y: '38%' },
      image: '/images/bike_fuel_tank.jpg',
    },
    {
      id: 'bike-rear-exhaust',
      part: 'REAR EXHAUST & TAIL LIGHT',
      type: 'MUFFLER ABRASION & LENS CRACK',
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
  const [isWireframeMode, setIsWireframeMode] = useState(false);

  const handleVehicleTypeChange = (type: VehicleType) => {
    setVehicleType(type);
    const targetHotspots = type === 'car' ? carHotspots : bikeHotspots;
    setSelectedHotspot(targetHotspots[0]);
  };

  const handleSelectHotspot = (item: DamageHotspot) => {
    setSelectedHotspot(item);
    setIsWireframeMode(false); // Switch to inspection image of selected damage item
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
    <div className="min-h-screen bg-[#06070B] text-slate-100 p-4 md:p-6 space-y-6 bg-cyber-grid">
      {/* Top Global Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl glass-panel border border-purple-500/30">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="px-3.5 py-2 rounded-xl bg-slate-900/90 hover:bg-purple-600/30 border border-purple-500/30 text-purple-300 text-xs font-bold flex items-center gap-2 transition-all hover:scale-[1.02]"
          >
            <ArrowLeft className="w-4 h-4 text-cyan-400" />
            <span>Back to Dashboard</span>
          </Link>

          <div className="h-6 w-px bg-purple-500/20 hidden sm:block" />

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-fuchsia-500 flex items-center justify-center text-white shadow-lg shadow-purple-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white">
              SHIELD <span className="text-gradient-purple">. AI</span>
            </span>
          </div>
        </div>

        {/* Quick Route Nav Links */}
        <div className="flex items-center gap-2 text-xs font-semibold">
          <Link
            href="/dashboard"
            className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-all flex items-center gap-1.5"
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-purple-400" />
            <span>Dashboard</span>
          </Link>
          <Link
            href="/claims/new"
            className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-all flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5 text-cyan-400" />
            <span>New Claim</span>
          </Link>
          <Link
            href="/adjuster/dashboard"
            className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-all flex items-center gap-1.5"
          >
            <UserCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Adjuster</span>
          </Link>
          <Link
            href="/admin/dashboard"
            className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-all flex items-center gap-1.5"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-fuchsia-400" />
            <span>Admin</span>
          </Link>
        </div>
      </div>

      {/* Assessment Header Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 glass-panel p-4 rounded-2xl border-purple-500/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/30">
            {vehicleType === 'car' ? <Car className="w-6 h-6" /> : <Bike className="w-6 h-6" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-white">AETHER AUTO AI</h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                PRO VISION 3.0
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              {vehicleType === 'car' 
                ? 'VIN: AAE-7F4R-3901 • AUDI GTR-7 (2024)' 
                : 'VIN: RE-350B-8812 • ROYAL ENFIELD BULLET 350 (2024)'}
            </p>
          </div>
        </div>

        {/* Vehicle Category & View Mode Switcher */}
        <div className="flex flex-wrap items-center gap-3">
          {/* 4-Wheeler vs 2-Wheeler Tab Switcher */}
          <div className="flex items-center p-1 rounded-xl bg-slate-900/90 border border-purple-500/30 text-xs font-bold">
            <button
              onClick={() => handleVehicleTypeChange('car')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                vehicleType === 'car'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Car className="w-3.5 h-3.5" />
              <span>4-Wheeler (Car)</span>
            </button>
            <button
              onClick={() => handleVehicleTypeChange('bike')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                vehicleType === 'bike'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Bike className="w-3.5 h-3.5" />
              <span>2-Wheeler (Bike)</span>
            </button>
          </div>

          <button 
            onClick={() => setIsWireframeMode(!isWireframeMode)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all border ${
              isWireframeMode 
                ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-lg glow-cyan' 
                : 'glass-panel hover:border-cyan-500/50 text-slate-300'
            }`}
          >
            <RotateCw className="w-4 h-4 text-cyan-400" />
            {isWireframeMode ? '3D Wireframe Active' : 'Photorealistic Scan'}
          </button>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: DAMAGE REPORT OVERVIEW */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between text-xs font-mono uppercase tracking-widest text-slate-400 font-bold px-1">
            <span>DAMAGE REPORT OVERVIEW</span>
            <span className="text-[10px] text-purple-400 font-normal">Click to Inspect</span>
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
                  onClick={() => handleSelectHotspot(item)}
                  className={`p-4 rounded-2xl cursor-pointer transition-all border ${
                    isSelected 
                      ? borderClass + ' shadow-lg glow-cyan scale-[1.02] ring-1 ring-purple-500/50' 
                      : 'glass-panel hover:border-purple-500/40 opacity-80 hover:opacity-100'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold font-mono tracking-wider text-white">{item.part}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 font-mono font-semibold text-cyan-400">
                      {item.confidence}% CONFIDENCE
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1 font-light">{item.type}</div>
                  <div className="mt-3 flex justify-between items-center text-xs font-mono">
                    <span className="text-slate-400">ESTIMATED COST</span>
                    <span className="font-extrabold text-emerald-400 text-sm">{formatINR(item.cost)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Center Stage: 3D Hologram / Damage Inspection Canvas */}
        <div className="lg:col-span-6 relative rounded-3xl glass-panel p-4 border border-purple-500/30 shadow-2xl flex flex-col justify-between overflow-hidden min-h-[420px]">
          {/* Top Stage Control Overlay */}
          <div className="flex justify-between items-center z-10 p-2">
            <span className="px-3 py-1 rounded-full bg-slate-950/80 border border-purple-500/30 text-xs font-mono text-purple-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>
                STAGE: {isWireframeMode ? '360° LASER WIREFRAME' : `AI SCAN (${selectedHotspot.part})`}
              </span>
            </span>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsWireframeMode(!isWireframeMode)}
                className="px-2.5 py-1 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-300 hover:text-white text-xs font-mono"
              >
                {isWireframeMode ? 'Show Damage Photo' : 'Show Wireframe'}
              </button>
              <button className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-400 hover:text-white">
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 3D Model Render / Damage Inspection Canvas */}
          <div className="relative w-full h-80 my-auto rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
            <Image 
              key={`${vehicleType}-${selectedHotspot.id}-${isWireframeMode}`}
              src={isWireframeMode ? wireframeImage : selectedHotspot.image} 
              alt={`AI Inspection - ${selectedHotspot.part}`} 
              fill 
              className="object-cover transition-all duration-700 animate-in fade-in"
              priority
            />

            {/* Glowing Hotspot Callout Markers (Visible in Wireframe mode) */}
            {isWireframeMode && hotspots.map((item) => (
              <div 
                key={item.id}
                onClick={() => handleSelectHotspot(item)}
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
            <div className="text-cyan-300 font-bold">{formatINR(selectedHotspot.cost)} ESTIMATE</div>
          </div>
        </div>

        {/* Right Column: REPAIR PLAN */}
        <div className="lg:col-span-3 space-y-4">
          <div className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold px-1">
            REPAIR PLAN ({vehicleType === 'car' ? '4-WHEELER' : '2-WHEELER'})
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-purple-500/20 space-y-4 font-mono text-xs">
            <div className="flex justify-between items-center pb-3 border-b border-purple-500/10">
              <span className="text-slate-400">Parts Needed</span>
              <span className="font-extrabold text-white">
                {vehicleType === 'car' ? '32 PARTS' : '14 PARTS'}
              </span>
            </div>

            <div className="flex justify-between items-center pb-3 border-b border-purple-500/10">
              <span className="text-slate-400">Est. Labor</span>
              <span className="font-extrabold text-white">
                {vehicleType === 'car' ? '5,200 hrs' : '1,800 hrs'}
              </span>
            </div>

            <div className="flex justify-between items-center pb-3 border-b border-purple-500/10">
              <span className="text-slate-400">Severity</span>
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40">
                MODERATE
              </span>
            </div>

            <div className="pt-2 flex justify-between items-center text-sm">
              <span className="text-slate-300 font-bold">TOTAL COST</span>
              <span className="text-xl font-black text-emerald-400">{formatINR(totalCost)}</span>
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
          <div className="h-16 rounded-xl bg-slate-900 flex items-center justify-center text-slate-400 text-xs font-mono border border-slate-800">
            GPS: ACTIVE [IND]
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
            <span className="text-slate-400">
              {vehicleType === 'car' ? 'AUDI GTR-7' : 'ROYAL ENFIELD 350'}
            </span>
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
              TOGGLE WIREFRAME
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
