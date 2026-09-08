'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/lib/auth';
import { ShieldCheck, ArrowRight, Sparkles, Eye, EyeOff } from 'lucide-react';
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
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="min-h-screen bg-slate-100 dark:bg-black text-slate-900 dark:text-slate-100 bg-cyber-grid flex items-center justify-center p-4 md:p-12 relative overflow-hidden transition-colors duration-300">
      {/* Top Ambient Glow Aura */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1400px] h-[550px] bg-gradient-to-r from-purple-500/15 via-fuchsia-500/15 to-indigo-500/15 dark:from-purple-900/40 dark:via-fuchsia-600/30 dark:to-indigo-900/40 blur-[150px] pointer-events-none -z-10" />

      {/* Main Ultra-Widescreen Split Container (Expanded max-w-[1360px] Cinema Ratio) */}
      <div className="w-full max-w-[1360px] rounded-3xl bg-white dark:bg-black border border-slate-200 dark:border-purple-500/40 shadow-2xl dark:shadow-purple-950/70 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[680px] transition-colors duration-300">
        {/* Left Column: Widescreen Persona Hero Graphic (7 Cols) */}
        <div className="lg:col-span-7 relative hidden lg:flex flex-col justify-between p-12 border-r border-slate-200 dark:border-purple-500/30 overflow-hidden min-h-[650px]">
          {/* Pre-mounted persona hero images for instant zero-lag role switching */}
          {[UserRole.CUSTOMER, UserRole.ADJUSTER, UserRole.ADMIN].map((roleKey) => {
            const hero = roleHeroImages[roleKey];
            return (
              <img
                key={roleKey}
                src={hero.image}
                alt="Role Hero"
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                  formData.role === roleKey ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
                loading="eager"
              />
            );
          })}
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
              {currentHero.badge}
            </div>

            <h2 className="text-4xl font-extrabold text-white leading-tight">
              {currentHero.title}
            </h2>
          </div>
        </div>

        {/* Right Column: Theme-Responsive Registration Form (5 Cols) */}
        <div className="lg:col-span-5 p-10 md:p-12 flex flex-col justify-center space-y-6 bg-white dark:bg-[#040406] backdrop-blur-2xl border-l border-slate-200 dark:border-purple-500/20 transition-colors duration-300">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 via-fuchsia-500 to-indigo-600 flex items-center justify-center text-white mx-auto shadow-lg shadow-purple-500/30 lg:hidden">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Create New <span className="text-gradient-purple">Account</span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-light">
              Select your role to dynamically switch onboarding view
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-200 text-xs font-semibold text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1.5">Full Name</label>
                <input
                  type="text"
                  name="shield_reg_full_name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. John Doe"
                  autoComplete="off"
                  required
                  className="w-full p-3.5 rounded-xl bg-slate-50 dark:bg-[#090a0f] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 font-medium focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1.5">Email Address</label>
                <input
                  type="email"
                  name="shield_reg_user_email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. john@example.com"
                  autoComplete="new-password"
                  required
                  className="w-full p-3.5 rounded-xl bg-slate-50 dark:bg-[#090a0f] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 font-medium focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1.5">Account Role (Hero Switcher)</label>
              <select
                name="shield_reg_user_role"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                className="w-full p-3.5 rounded-xl bg-slate-50 dark:bg-[#090a0f] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-bold outline-none cursor-pointer transition-all"
              >
                <option value={UserRole.CUSTOMER} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Policy Customer (Policyholder)</option>
                <option value={UserRole.ADJUSTER} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Claims Adjuster (Reviewer)</option>
                <option value={UserRole.ADMIN} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">System Administrator (Admin)</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="shield_reg_user_password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Enter password (e.g. ••••••••)"
                    autoComplete="new-password"
                    required
                    className="w-full p-3.5 pr-11 rounded-xl bg-slate-50 dark:bg-[#090a0f] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 font-medium focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 p-1 transition-colors"
                    title={showPassword ? 'Hide Password' : 'Show Password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1.5">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="shield_reg_confirm_password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="Re-enter password"
                    autoComplete="new-password"
                    required
                    className="w-full p-3.5 pr-11 rounded-xl bg-slate-50 dark:bg-[#090a0f] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 font-medium focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 p-1 transition-colors"
                    title={showPassword ? 'Hide Password' : 'Show Password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-500 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-sm transition-all shadow-xl shadow-purple-600/30 flex items-center justify-center gap-2 transform hover:scale-[1.01]"
            >
              {isLoading ? 'Creating Account...' : 'Register Account'} <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center text-xs text-slate-500 dark:text-slate-400 pt-1">
            Already registered?{' '}
            <Link href="/login" className="text-purple-600 dark:text-purple-400 font-bold hover:underline">
              Sign in here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
