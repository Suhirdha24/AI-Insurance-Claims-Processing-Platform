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
  Sliders,
  FilePlus2,
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  FileText
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

  // 4-Wheeler Car Dataset (Real Insured Hyundai Creta SX)
  const carHotspots: DamageHotspot[] = [
    {
      id: 'car-front-bumper',
      part: 'FRONT BUMPER',
      type: 'IMPACT DENT & SCRATCH',
      confidence: 96,
      cost: 78500,
      measurement: '6.8mm depth',
      color: 'cyan',
      coords: { x: '34%', y: '50%' },
      image: '/images/car_front_bumper.jpg',
    },
    {
      id: 'car-left-door',
      part: 'LEFT FRONT DOOR',
      type: 'STRUCTURAL DENT',
      confidence: 94,
      cost: 102500,
      measurement: '14.5mm deformation',
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
      measurement: '9.2mm scratch',
      color: 'amber',
      coords: { x: '78%', y: '56%' },
      image: '/images/car_rear_quarter.jpg',
    },
  ];

  // 2-Wheeler Motorcycle Dataset (Royal Enfield Hunter 350)
  const bikeHotspots: DamageHotspot[] = [
    {
      id: 'bike-front-fork',
      part: 'FRONT FORK ASSEMBLY',
      type: 'HYDRAULIC BEND',
      confidence: 96,
      cost: 18500,
      measurement: '4.2mm misalignment',
      color: 'cyan',
      coords: { x: '32%', y: '48%' },
      image: '/images/bike_front_fork.jpg',
    },
    {
      id: 'bike-fuel-tank',
      part: 'FUEL TANK',
      type: 'SIDE DENT & SCRATCH',
      confidence: 98,
      cost: 24000,
      measurement: '1.45cm dent',
      color: 'magenta',
      coords: { x: '55%', y: '38%' },
      image: '/images/bike_fuel_tank.jpg',
    },
    {
      id: 'bike-rear-exhaust',
      part: 'REAR EXHAUST MUFFLER',
      type: 'SURFACE ABRASION',
      confidence: 93,
      cost: 12500,
      measurement: '8.5mm scratch',
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
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner Control Bar - ClaimFlow AI Branding */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-purple-500/20 shadow-sm dark:shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-0.5 rounded-full bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30 text-xs font-bold uppercase tracking-wider">
              ClaimFlow AI • 3D Damage Inspector
            </span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Live Computer Vision Scan
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            AI Holographic <span className="text-gradient-purple">Damage Inspection</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Automated depth mapping & repair estimate verification for Policy <strong className="text-purple-700 dark:text-purple-300">#POL-2026-8849</strong>
          </p>
        </div>

        {/* 4W vs 2W Switcher */}
        <div className="flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-purple-500/30 text-xs font-bold">
          <button
            onClick={() => handleVehicleTypeChange('car')}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all ${
              vehicleType === 'car'
                ? 'bg-purple-600 text-white font-black shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Car className="w-4 h-4" />
            <span>Hyundai Creta (4W)</span>
          </button>
          <button
            onClick={() => handleVehicleTypeChange('bike')}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all ${
              vehicleType === 'bike'
                ? 'bg-purple-600 text-white font-black shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Bike className="w-4 h-4" />
            <span>Hunter 350 (2W)</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: DAMAGE REPORT OVERVIEW */}
        <div className="lg:col-span-3 space-y-3">
          <div className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400 font-extrabold px-1 flex justify-between items-center">
            <span>Detected Damage Areas</span>
            <span className="text-[10px] text-purple-700 dark:text-purple-400 font-bold">AI SCAN VERIFIED</span>
          </div>

          <div className="space-y-3">
            {hotspots.map((item) => {
              const isSelected = selectedHotspot.id === item.id;
              const borderClass = 
                item.color === 'cyan' ? 'border-cyan-500/50 bg-cyan-950/20 text-cyan-300' :
                item.color === 'magenta' ? 'border-fuchsia-500/50 bg-fuchsia-950/20 text-fuchsia-300' :
                'border-amber-500/50 bg-amber-950/20 text-amber-300';

              return (
                <div
                  key={item.id}
                  onClick={() => handleSelectHotspot(item)}
                  className={`p-4 rounded-2xl cursor-pointer transition-all border ${
                    isSelected 
                      ? 'border-purple-500 bg-purple-50/80 dark:bg-purple-950/40 shadow-md ring-2 ring-purple-500/50 scale-[1.01]' 
                      : 'bg-white dark:bg-slate-900/80 border-slate-200 dark:border-purple-500/20 hover:border-purple-400'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-extrabold text-slate-900 dark:text-white">{item.part}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 uppercase font-semibold">
                    {item.type} | <span className="text-purple-700 dark:text-purple-300 font-bold">{item.confidence}% AI Confidence</span>
                  </div>
                  <div className="mt-3 flex justify-between items-center text-xs">
                    <span className="text-slate-500 dark:text-slate-400 text-[10px]">REPAIR ESTIMATE</span>
                    <span className="font-extrabold text-purple-700 dark:text-purple-300 text-sm">{formatINR(item.cost)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Center Stage: 3D Holographic Turntable Inspection Stage */}
        <div className="lg:col-span-6 relative rounded-3xl bg-slate-950 p-4 border border-purple-500/30 shadow-2xl flex flex-col justify-between overflow-hidden min-h-[460px] text-white">
          {/* Top Model Badge Pill */}
          <div className="flex justify-center items-center z-10">
            <div className="px-4 py-1 rounded-full bg-slate-900/90 border border-purple-500/40 text-xs font-mono text-purple-300 flex items-center gap-3 shadow-lg">
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
              <span className="font-extrabold text-white tracking-wider">
                {vehicleType === 'car' ? 'HYUNDAI CRETA SX (2024)' : 'ROYAL ENFIELD HUNTER 350'}
              </span>
              <span className="text-slate-600">|</span>
              <span className="text-slate-300 text-[11px]">KA-01-MJ-9921</span>
            </div>
          </div>

          {/* 3D Hologram Turntable Stage Container */}
          <div className="relative w-full h-80 md:h-96 my-auto rounded-2xl overflow-hidden bg-slate-950 flex items-center justify-center">
            <Image 
              key={`${vehicleType}-${selectedHotspot.id}-${isWireframeMode}`}
              src={isWireframeMode ? wireframeImage : selectedHotspot.image} 
              alt="3D Damage Inspection Stage" 
              fill 
              className="object-cover transition-all duration-700 animate-in fade-in"
              priority
            />

            {/* Glowing Hologram Hotspot Callouts */}
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
                <div className="absolute left-6 -top-3 whitespace-nowrap p-2.5 rounded-xl bg-slate-950/95 border border-purple-500/40 text-[10px] font-mono text-white shadow-2xl space-y-0.5">
                  <div className="font-extrabold text-purple-300">{item.part}</div>
                  <div className="text-slate-400 text-[9px]">[{item.type}]</div>
                  <div className="text-cyan-400 font-bold">{item.measurement}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Stage Bottom Control Status Bar */}
          <div className="z-10 px-4 py-2 rounded-xl bg-slate-900/90 border border-purple-500/30 flex justify-between items-center text-[10px] font-mono text-slate-300">
            <div className="flex items-center gap-2">
              <span className="text-purple-400 font-bold">LASER SCANNER ACTIVE</span>
              <span>•</span>
              <span>{isWireframeMode ? '3D HOLOGRAPHIC MODEL' : `AI IMAGE SCAN (${selectedHotspot.part})`}</span>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsWireframeMode(!isWireframeMode)}
                className="text-purple-300 font-bold hover:underline"
              >
                {isWireframeMode ? 'Show Damage Photo' : 'Show 3D Wireframe'}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: REPAIR PLAN */}
        <div className="lg:col-span-3 space-y-3">
          <div className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400 font-extrabold px-1">
            CLAIM ESTIMATE SUMMARY
          </div>

          <div className="bg-white dark:bg-slate-900/90 p-5 rounded-2xl border border-slate-200 dark:border-purple-500/20 space-y-4 text-xs font-mono shadow-sm">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400">Policy Number</span>
              <span className="font-extrabold text-slate-900 dark:text-white">POL-2026-8849</span>
            </div>

            <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400">Coverage Limit</span>
              <span className="font-extrabold text-emerald-600 dark:text-emerald-400">₹5,00,000</span>
            </div>

            <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400">Deductible</span>
              <span className="font-bold text-slate-700 dark:text-slate-300">₹15,000</span>
            </div>

            <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400">Damage Severity</span>
              <span className="px-2.5 py-0.5 rounded bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 font-extrabold border border-amber-300 dark:border-amber-500/40 text-[10px]">
                MODERATE
              </span>
            </div>

            <div className="pt-2 flex justify-between items-center text-sm font-sans">
              <span className="text-slate-700 dark:text-slate-300 font-bold">TOTAL ESTIMATE</span>
              <span className="text-xl font-black text-purple-700 dark:text-purple-300">{formatINR(totalCost)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Telemetry & Insurance Actions */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-1 text-xs">
        {/* 1. Policy Coverage Badge */}
        <div className="md:col-span-3 bg-white dark:bg-slate-900/90 p-4 rounded-2xl border border-slate-200 dark:border-purple-500/20 shadow-sm space-y-2">
          <div className="text-slate-500 dark:text-slate-400 uppercase font-bold text-[10px] flex items-center justify-between">
            <span>Policy Status</span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="font-extrabold text-slate-900 dark:text-white text-sm">Comprehensive Auto Cover</div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">Active through Dec 31, 2026 • 0 policy exclusions triggered</p>
        </div>

        {/* 2. AI Confidence Metrics */}
        <div className="md:col-span-3 bg-white dark:bg-slate-900/90 p-4 rounded-2xl border border-slate-200 dark:border-purple-500/20 shadow-sm space-y-2">
          <div className="text-slate-500 dark:text-slate-400 uppercase font-bold text-[10px] flex items-center justify-between">
            <span>AI Scan Confidence</span>
            <Activity className="w-4 h-4 text-purple-500" />
          </div>
          <div className="font-extrabold text-purple-700 dark:text-purple-300 text-sm">94.8% Visual Precision</div>
          <div className="w-full bg-slate-100 dark:bg-slate-950 h-2 rounded-full overflow-hidden">
            <div className="bg-purple-600 dark:bg-purple-500 h-full w-[94.8%]" />
          </div>
        </div>

        {/* 3. Insurance Claim Flow CTAs */}
        <div className="md:col-span-6 bg-white dark:bg-slate-900/90 p-4 rounded-2xl border border-slate-200 dark:border-purple-500/20 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <div className="font-bold text-slate-900 dark:text-white">Ready to File Damage Claim?</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">Attach this 3D AI assessment directly to your new claim submission.</div>
          </div>

          <Link
            href="/claims/new"
            className="w-full sm:w-auto py-3 px-6 rounded-full bg-gradient-to-r from-purple-600 via-fuchsia-500 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-500/30 transition-all shrink-0 text-center"
          >
            File Claim with AI Scan →
          </Link>
        </div>
      </div>
    </div>
  );
}
