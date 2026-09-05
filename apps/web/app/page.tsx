'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'front' | 'door'>('overview');

  return (
    <div className="relative min-h-screen bg-[#06070B] text-slate-100 bg-cyber-grid overflow-hidden">
      {/* Top Ambient Glow Aura */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[450px] bg-gradient-to-r from-purple-900/30 via-fuchsia-600/25 to-indigo-900/30 blur-[120px] pointer-events-none -z-10" />

      {/* Header Bar */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#06070B]/70 border-b border-purple-500/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              SHIELD <span className="text-gradient-purple">. AI</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#benefits" className="hover:text-purple-400 transition-colors">Benefits</a>
            <a href="#how-it-works" className="hover:text-purple-400 transition-colors">How It Works</a>
            <a href="#technologies" className="hover:text-purple-400 transition-colors">Technologies</a>
            <a href="#features" className="hover:text-purple-400 transition-colors">Key Features</a>
            <a href="#pricing" className="hover:text-purple-400 transition-colors">Pricing</a>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors px-4 py-2">
              CONTACT US
            </Link>
            <Link href="/login" className="px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-purple-600 via-fuchsia-500 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-lg shadow-purple-500/25 transition-all duration-300 transform hover:scale-[1.02]">
              LOGIN
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-6 max-w-7xl mx-auto text-center">
        {/* Floating Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border-fuchsia-500/30 text-xs font-semibold text-fuchsia-300 mb-8 animate-pulse">
          <span className="w-2 h-2 rounded-full bg-fuchsia-400 animate-ping" />
          Guaranteed Reliability • 100% Advisory AI
        </div>

        {/* Headline */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight">
          AI-Powered Car Damage <br />
          <span className="text-gradient-purple">Assessment in Minutes</span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-lg md:text-xl text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
          Upload photos of the damage, and our AI-powered platform will instantly calculate repair costs, cross-check policy eligibility, and connect you to trusted service providers.
        </p>

        {/* Hero CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-5">
          <Link href="/register" className="w-full sm:w-auto px-8 py-4 rounded-full text-base font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-xl shadow-purple-500/30 transition-all duration-300 transform hover:scale-105">
            START FOR FREE
          </Link>
          <a href="#how-it-works" className="w-full sm:w-auto px-8 py-4 rounded-full text-base font-semibold text-slate-200 glass-panel hover:bg-slate-800/60 transition-all duration-300">
            HOW IT WORKS
          </a>
        </div>

        {/* Hero Interactive UI Mockup Container */}
        <div className="mt-16 relative max-w-5xl mx-auto rounded-3xl glass-panel p-4 md:p-6 glow-purple border border-purple-500/30 shadow-2xl overflow-hidden">
          {/* Top Mockup Header */}
          <div className="flex items-center justify-between mb-4 px-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="ml-3 text-xs font-mono text-slate-400">SHIELD AI / Damage Assessment Engine v2.4</span>
            </div>

            {/* Quick Metrics Pills */}
            <div className="flex items-center gap-3 text-xs font-semibold">
              <span className="px-3 py-1 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/40">
                $790.58 est. cost
              </span>
              <span className="px-3 py-1 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/40">
                2 weeks turnaround
              </span>
              <span className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                4 parts affected
              </span>
            </div>
          </div>

          {/* Damage Assessment Image Showcase */}
          <Link href="/assessments" className="relative rounded-2xl overflow-hidden border border-slate-800 aspect-video block group">
            <Image 
              src="/images/hero_assessment.jpg" 
              alt="AI Car Damage Assessment Dashboard" 
              fill 
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              priority
            />
            {/* Interactive Hotspot Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#06070B] via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="px-5 py-2.5 rounded-full bg-cyan-500/90 text-black font-extrabold text-xs uppercase tracking-wider shadow-xl opacity-0 group-hover:opacity-100 transition-all transform group-hover:scale-105">
                LAUNCH 3D INSPECTOR WORKSPACE →
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* Tech Partners Section */}
      <section className="py-12 border-y border-purple-500/10 bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold mb-8">
            POWERED BY ENTERPRISE AI ARCHITECTURE
          </p>
          <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16 opacity-70">
            <div className="flex items-center gap-2 text-slate-300 font-bold text-lg">
              <span className="text-purple-400 text-2xl">🔥</span> PyTorch
            </div>
            <div className="flex items-center gap-2 text-slate-300 font-bold text-lg">
              <span className="text-cyan-400 text-2xl">👁️</span> OpenCV
            </div>
            <div className="flex items-center gap-2 text-slate-300 font-bold text-lg">
              <span className="text-amber-400 text-2xl">☁️</span> Amazon Web Services
            </div>
            <div className="flex items-center gap-2 text-slate-300 font-bold text-lg">
              <span className="text-indigo-400 text-2xl">🧠</span> Tensor-Core AI
            </div>
          </div>
        </div>
      </section>

      {/* Why Drivers & Insurers Trust Us Section */}
      <section id="benefits" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-xs uppercase tracking-widest text-purple-400 font-semibold">ENTERPRISE BENEFIT</span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mt-2">
              Why Thousands of Drivers <br />& Insurers Trust Us
            </h2>
          </div>
          <p className="text-slate-400 max-w-md text-sm leading-relaxed">
            Powered by cutting-edge AI, our platform delivers fast and accurate damage assessments, trusted by thousands of drivers and top insurance carriers.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl glass-panel glass-panel-hover relative group">
            <div className="w-14 h-14 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-6 text-2xl">
              ⚡
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Instant Assessments</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Get accurate repair estimates in under 5 minutes — no more waiting days for an adjuster. Fast, reliable results delivered instantly.
            </p>
          </div>

          <div className="p-8 rounded-3xl glass-panel glass-panel-hover relative group">
            <div className="w-14 h-14 rounded-2xl bg-fuchsia-600/20 border border-fuchsia-500/30 flex items-center justify-center text-fuchsia-400 mb-6 text-2xl">
              🎯
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Accurate Advisory AI Analysis</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Our vision algorithms identify even micro-damages and cross-reference policy coverage for a fair, transparent estimate.
            </p>
          </div>

          <div className="p-8 rounded-3xl glass-panel glass-panel-hover relative group">
            <div className="w-14 h-14 rounded-2xl bg-cyan-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-6 text-2xl">
              🛡️
            </div>
            <h3 className="text-xl font-bold text-white mb-3">100% Human-in-the-Loop</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              AI provides instant recommendations, but certified human adjusters make final approval decisions for absolute trust and compliance.
            </p>
          </div>
        </div>
      </section>

      {/* Floating 3D Hologram Car & Reviews Showcase */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="rounded-3xl glass-panel p-8 md:p-12 border border-purple-500/20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-semibold text-cyan-300 mb-4">
              AI DIAGNOSTIC MATRIX
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-6">
              Precision Holographic Inspection & Repair Planning
            </h2>
            <p className="text-slate-300 text-base leading-relaxed mb-8">
              Our deep-learning computer vision models construct a 3D structural model of vehicle damage, pin-pointing affected components and providing itemized labor hour estimates automatically.
            </p>

            {/* Testimonials */}
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-purple-500/10">
                <div className="flex items-center gap-1 text-amber-400 mb-2">★★★★★ <span className="text-xs text-slate-400 font-semibold ml-2">5.0</span></div>
                <p className="text-sm text-slate-300 italic">"Managing vehicle repairs used to be a logistical nightmare. Now, I can get accurate damage reports instantly and prioritize repairs effortlessly."</p>
                <div className="mt-3 text-xs font-semibold text-purple-300">— Michael Reynolds, Fleet Manager</div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/60 border border-purple-500/10">
                <div className="flex items-center gap-1 text-amber-400 mb-2">★★★★★ <span className="text-xs text-slate-400 font-semibold ml-2">5.0</span></div>
                <p className="text-sm text-slate-300 italic">"Seamlessly integrated into our workflow. Highly accurate estimates and fast processing times!"</p>
                <div className="mt-3 text-xs font-semibold text-purple-300">— Emily Carter, Service Advisor</div>
              </div>
            </div>
          </div>

          {/* Hologram Graphic */}
          <div className="relative rounded-2xl overflow-hidden border border-cyan-500/30 aspect-square shadow-2xl glow-cyan">
            <Image 
              src="/images/hologram_car.jpg" 
              alt="Holographic 3D Car Damage Assessment" 
              fill 
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Direct Portal Jump Access Footer */}
      <footer className="py-12 border-t border-purple-500/10 bg-slate-950/80">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center text-white font-bold text-xs">
              🛡️
            </div>
            <span className="text-sm font-semibold text-white">SHIELD AI Claims Platform © 2026</span>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-sm font-medium">
            <Link href="/login" className="text-purple-400 hover:text-purple-300 transition-colors">
              Policyholder Portal
            </Link>
            <Link href="/login" className="text-fuchsia-400 hover:text-fuchsia-300 transition-colors">
              Adjuster Portal
            </Link>
            <Link href="/login" className="text-cyan-400 hover:text-cyan-300 transition-colors">
              Admin Portal
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
