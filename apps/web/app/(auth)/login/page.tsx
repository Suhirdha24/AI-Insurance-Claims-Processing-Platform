'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/lib/auth';
import { ShieldCheck, ArrowRight, UserCheck, ShieldAlert, User, Sparkles } from 'lucide-react';

type RoleType = 'customer' | 'adjuster' | 'admin';

export default function LoginPage() {
  const { login } = useAuth();
  const [activeRole, setActiveRole] = useState<RoleType>('customer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const roleConfigs = {
    customer: {
      image: '/images/hero_customer.jpg',
      badge: 'Policyholder Portal • Live AI Scan',
      title: 'Instant AI Car Damage & Claim Filing',
      stat1Title: '99.4% ACCURACY',
      stat1Sub: 'AI Damage Extraction',
      stat2Title: '< 5 MINUTES',
      stat2Sub: 'Instant Claim Estimate',
      email: 'customer@example.com',
      roleLabel: 'Policyholder',
      placeholderEmail: 'customer@example.com',
      placeholderPassword: 'Enter password (e.g. password123)',
      route: '/dashboard',
    },
    adjuster: {
      image: '/images/hero_adjuster.jpg',
      badge: 'Adjuster Command • Advisory AI',
      title: 'AI Risk Assessment & Human Review',
      stat1Title: '100% ADVISORY',
      stat1Sub: 'Human Approval Authority',
      stat2Title: 'OCR & HEATMAPS',
      stat2Sub: 'Cross-Doc Mismatches',
      email: 'adjuster@example.com',
      roleLabel: 'Claims Adjuster',
      placeholderEmail: 'adjuster@example.com',
      placeholderPassword: 'Enter password (e.g. password123)',
      route: '/adjuster/dashboard',
    },
    admin: {
      image: '/images/hero_admin.jpg',
      badge: 'Security Operations • Enterprise Governance',
      title: 'System Audit Matrix & User Access',
      stat1Title: 'RBAC / ABAC',
      stat1Sub: 'Resource Isolation',
      stat2Title: 'REAL-TIME LOGS',
      stat2Sub: 'Audit & System Catalog',
      email: 'admin@example.com',
      roleLabel: 'System Administrator',
      placeholderEmail: 'admin@example.com',
      placeholderPassword: 'Enter password (e.g. password123)',
      route: '/admin/dashboard',
    },
  };

  const currentConfig = roleConfigs[activeRole];

  const handleRoleSelect = (role: RoleType) => {
    setActiveRole(role);
    setEmail('');
    setPassword('');
  };

  const handleAutoLoginRole = async (role: RoleType) => {
    setActiveRole(role);
    const targetEmail = roleConfigs[role].email;
    setEmail(targetEmail);
    setPassword('password123');
    setIsLoading(true);
    setError('');
    try {
      await login(targetEmail, 'password123');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-slate-100 bg-cyber-grid flex items-center justify-center p-4 md:p-12 relative overflow-hidden">
      {/* Top Ambient Glow Aura */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1400px] h-[550px] bg-gradient-to-r from-purple-900/40 via-fuchsia-600/30 to-indigo-900/40 blur-[150px] pointer-events-none -z-10" />

      {/* Main Ultra-Widescreen Split Container (Expanded max-w-[1360px] Cinema Ratio) */}
      <div className="w-full max-w-[1360px] rounded-3xl bg-black border border-purple-500/40 shadow-2xl shadow-purple-950/70 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[680px]">
        {/* Left Column: Widescreen Persona Hero Graphic (7 Cols) */}
        <div className="lg:col-span-7 relative hidden lg:flex flex-col justify-between p-12 border-r border-purple-500/30 overflow-hidden min-h-[650px]">
          {/* Pre-mounted persona hero images for instant zero-lag role switching */}
          {(['customer', 'adjuster', 'admin'] as RoleType[]).map((role) => (
            <img
              key={role}
              src={roleConfigs[role].image}
              alt={`${roleConfigs[role].roleLabel} Hero`}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                activeRole === role ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
              }`}
              loading="eager"
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10 pointer-events-none" />

          {/* Top Brand Tag */}
          <div className="relative z-20 flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 via-fuchsia-500 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-purple-500/40">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-white">
              ClaimFlow <span className="text-gradient-purple">AI</span>
            </span>
          </div>

          {/* Dynamic Floating AI Metrics Overlay */}
          <div className="relative z-20 space-y-5 max-w-xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/20 border border-purple-500/40 text-xs font-semibold text-purple-300 backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-fuchsia-400" />
              {currentConfig.badge}
            </div>

            <h2 className="text-4xl font-extrabold text-white leading-tight">
              {currentConfig.title}
            </h2>

            <div className="grid grid-cols-2 gap-4 text-xs font-mono max-w-lg">
              <div className="p-4.5 rounded-2xl bg-black/90 border border-purple-500/40 backdrop-blur-md">
                <div className="text-purple-400 font-extrabold text-sm">{currentConfig.stat1Title}</div>
                <div className="text-slate-400 text-[11px] mt-0.5">{currentConfig.stat1Sub}</div>
              </div>
              <div className="p-4.5 rounded-2xl bg-black/90 border border-purple-500/40 backdrop-blur-md">
                <div className="text-cyan-400 font-extrabold text-sm">{currentConfig.stat2Title}</div>
                <div className="text-slate-400 text-[11px] mt-0.5">{currentConfig.stat2Sub}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Sleek Black Login Form (5 Cols) */}
        <div className="lg:col-span-5 p-10 md:p-12 flex flex-col justify-center space-y-6 bg-[#040406] backdrop-blur-2xl border-l border-purple-500/20">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 via-fuchsia-500 to-indigo-600 flex items-center justify-center text-white mx-auto shadow-lg shadow-purple-500/30 lg:hidden">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Sign In to <span className="text-gradient-purple">ClaimFlow AI</span>
            </h1>
            <p className="text-xs text-slate-400 font-light">
              Select persona to auto-fill credentials & switch visual workspace
            </p>
          </div>

          {/* Role Selection Switcher Tabs */}
          <div className="grid grid-cols-3 gap-2 text-xs font-bold p-1.5 rounded-2xl bg-black border border-purple-500/30 shadow-inner">
            <button
              type="button"
              onClick={() => handleRoleSelect('customer')}
              className={`py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                activeRole === 'customer'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/30 font-extrabold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Customer</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleSelect('adjuster')}
              className={`py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                activeRole === 'adjuster'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/30 font-extrabold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Adjuster</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleSelect('admin')}
              className={`py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                activeRole === 'admin'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/30 font-extrabold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-200 text-xs font-semibold text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} autoComplete="new-password" className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-slate-300 font-bold">
                  Email Address ({currentConfig.roleLabel})
                </label>
                <span className="text-[10px] text-purple-400 font-mono">
                  {currentConfig.email}
                </span>
              </div>
              <input
                type="email"
                name="shield_user_email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={`e.g. ${currentConfig.placeholderEmail}`}
                autoComplete="new-password"
                required
                className="w-full p-3.5 rounded-xl bg-[#090a0f] border border-slate-800 text-white placeholder-slate-500 font-medium focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 outline-none transition-all"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-slate-300 font-bold">Password</label>
                <span className="text-[10px] text-purple-400 font-mono">
                  password123
                </span>
              </div>
              <input
                type="password"
                name="shield_user_password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={currentConfig.placeholderPassword}
                autoComplete="new-password"
                required
                className="w-full p-3.5 rounded-xl bg-[#090a0f] border border-slate-800 text-white placeholder-slate-500 font-medium focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-500 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-sm transition-all shadow-xl shadow-purple-600/30 flex items-center justify-center gap-2 transform hover:scale-[1.01]"
            >
              {isLoading ? 'Authenticating...' : `Sign In as ${currentConfig.roleLabel}`} <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* One-Click Direct Navigation Launch Buttons */}
          <div className="border-t border-slate-800/80 pt-4 space-y-2.5">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">
              ONE-CLICK PORTAL DIRECT LAUNCH
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleAutoLoginRole('customer')}
                className="p-2.5 rounded-xl bg-[#090a0f] hover:bg-purple-950/40 border border-slate-800 text-slate-300 font-bold flex flex-col items-center gap-1 transition-all hover:border-purple-500/50"
              >
                <User className="w-4 h-4 text-emerald-400" />
                <span>Customer</span>
              </button>
              <button
                type="button"
                onClick={() => handleAutoLoginRole('adjuster')}
                className="p-2.5 rounded-xl bg-[#090a0f] hover:bg-purple-950/40 border border-slate-800 text-slate-300 font-bold flex flex-col items-center gap-1 transition-all hover:border-purple-500/50"
              >
                <UserCheck className="w-4 h-4 text-purple-400" />
                <span>Adjuster</span>
              </button>
              <button
                type="button"
                onClick={() => handleAutoLoginRole('admin')}
                className="p-2.5 rounded-xl bg-[#090a0f] hover:bg-purple-950/40 border border-slate-800 text-slate-300 font-bold flex flex-col items-center gap-1 transition-all hover:border-purple-500/50"
              >
                <ShieldAlert className="w-4 h-4 text-cyan-400" />
                <span>Admin</span>
              </button>
            </div>
          </div>

          <div className="text-center text-xs text-slate-400 pt-1">
            Don't have an account?{' '}
            <Link href="/register" className="text-purple-400 font-bold hover:underline">
              Register here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
