'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/lib/auth';
import { ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import { UserRole } from '@ai-insurance/shared';

export default function RegisterPage() {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: UserRole.CUSTOMER,
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const roleHeroImages = {
    [UserRole.CUSTOMER]: {
      image: '/images/hero_customer.jpg',
      badge: 'Policyholder Onboarding',
      title: 'Instant AI Damage Detection & Claim Filing',
    },
    [UserRole.ADJUSTER]: {
      image: '/images/hero_adjuster.jpg',
      badge: 'Adjuster Onboarding',
      title: 'AI Risk Telemetry & Human Review Workspace',
    },
    [UserRole.ADMIN]: {
      image: '/images/hero_admin.jpg',
      badge: 'Admin Operations',
      title: 'Enterprise Cyber Security & Audit Operations',
    },
  };

  const currentHero = roleHeroImages[formData.role] || roleHeroImages[UserRole.CUSTOMER];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      await register(formData);
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#06070B] text-slate-100 bg-cyber-grid flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
      {/* Top Ambient Glow Aura */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[450px] bg-gradient-to-r from-purple-900/30 via-fuchsia-600/25 to-indigo-900/30 blur-[120px] pointer-events-none -z-10" />

      {/* Main Split Glassmorphism Container */}
      <div className="w-full max-w-5xl rounded-3xl glass-panel border border-purple-500/30 shadow-2xl glow-purple overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* Left Column: Dynamic Role Hero Graphic */}
        <div className="lg:col-span-5 relative hidden lg:flex flex-col justify-between p-8 border-r border-purple-500/20">
          <Image 
            key={formData.role}
            src={currentHero.image} 
            alt="Role Hero" 
            fill 
            className="object-cover transition-opacity duration-700 animate-in fade-in"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#06070B] via-[#06070B]/50 to-transparent z-10" />

          {/* Top Brand Tag */}
          <div className="relative z-20 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-fuchsia-500 flex items-center justify-center text-white shadow-lg shadow-purple-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              SHIELD <span className="text-gradient-purple">. AI</span>
            </span>
          </div>

          {/* Floating Info */}
          <div className="relative z-20 space-y-3 text-xs">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/20 border border-purple-500/40 font-semibold text-purple-300">
              <Sparkles className="w-3.5 h-3.5" />
              {currentHero.badge}
            </div>
            <h2 className="text-xl font-extrabold text-white leading-tight">
              {currentHero.title}
            </h2>
          </div>
        </div>

        {/* Right Column: Glassmorphism Registration Form */}
        <div className="lg:col-span-7 p-8 md:p-10 flex flex-col justify-center space-y-6 bg-slate-950/60 backdrop-blur-2xl">
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Create New <span className="text-gradient-purple">Account</span>
            </h1>
            <p className="text-xs text-slate-400 font-light">
              Select your role to dynamically switch onboarding view
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-semibold text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                  required
                  className="w-full p-3 rounded-xl bg-slate-900/90 border border-purple-500/30 text-white placeholder-slate-500 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@example.com"
                  required
                  className="w-full p-3 rounded-xl bg-slate-900/90 border border-purple-500/30 text-white placeholder-slate-500 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Account Role (Hero Switcher)</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                className="w-full p-3 rounded-xl bg-slate-900/90 border border-purple-500/30 text-white font-bold outline-none cursor-pointer"
              >
                <option value={UserRole.CUSTOMER}>Policy Customer (Policyholder)</option>
                <option value={UserRole.ADJUSTER}>Claims Adjuster (Reviewer)</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Password</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  required
                  className="w-full p-3 rounded-xl bg-slate-900/90 border border-purple-500/30 text-white placeholder-slate-500 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Confirm Password</label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="••••••••"
                  required
                  className="w-full p-3 rounded-xl bg-slate-900/90 border border-purple-500/30 text-white placeholder-slate-500 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-full bg-gradient-to-r from-purple-600 via-fuchsia-500 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-sm transition-all shadow-lg shadow-purple-500/30 flex items-center justify-center gap-2 transform hover:scale-[1.02]"
            >
              {isLoading ? 'Creating Account...' : 'Register Account'} <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center text-xs text-slate-400">
            Already registered?{' '}
            <Link href="/login" className="text-purple-400 font-bold hover:underline">
              Sign in here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
