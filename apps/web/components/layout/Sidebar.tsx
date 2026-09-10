'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { UserRole } from '@ai-insurance/shared';
import {
  LayoutDashboard,
  FilePlus2,
  FileText,
  FolderOpen,
  AlertTriangle,
  Users,
  ShieldAlert,
  BarChart3,
  ScrollText,
  Car,
  ShieldCheck
} from 'lucide-react';

function SidebarContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  if (!user) return null;

  const customerLinks = [
    { href: '/dashboard', label: 'Damage Assessment', icon: LayoutDashboard },
    { href: '/assessments', label: '3D AI Inspection', icon: Car },
    { href: '/claims/new', label: 'Submit Damage Claim', icon: FilePlus2 },
    { href: '/documents', label: 'My Documents', icon: FolderOpen },
  ];

  const adjusterLinks = [
    { href: '/adjuster/dashboard', label: 'Claims Overview', icon: LayoutDashboard },
    { href: '/adjuster/queue', label: 'Assessment Queue', icon: FileText },
    { href: '/adjuster/queue?riskLevel=HIGH', label: 'High Risk Claims', icon: AlertTriangle },
    { href: '/adjuster/analytics', label: 'AI Performance Metrics', icon: BarChart3 },
  ];

  const adminLinks = [
    { href: '/admin/dashboard', label: 'System Overview', icon: LayoutDashboard },
    { href: '/admin/users', label: 'User Management', icon: Users },
    { href: '/admin/policies', label: 'Policy Catalog', icon: ShieldAlert },
    { href: '/admin/audit-logs', label: 'Audit Log Matrix', icon: ScrollText },
  ];

  let navItems = customerLinks;
  if (user.role === UserRole.ADJUSTER) navItems = adjusterLinks;
  if (user.role === UserRole.ADMIN) navItems = adminLinks;

  const checkIsActive = (itemHref: string) => {
    if (itemHref.includes('?riskLevel=HIGH')) {
      return pathname === '/adjuster/queue' && searchParams.get('riskLevel') === 'HIGH';
    }
    if (itemHref === '/adjuster/queue') {
      return pathname === '/adjuster/queue' && searchParams.get('riskLevel') !== 'HIGH';
    }
    return pathname === itemHref;
  };

  return (
    <aside className="w-64 bg-white dark:bg-[#06070B] border-r border-slate-200 dark:border-indigo-500/20 flex flex-col p-4 shrink-0 hidden md:flex min-h-[calc(100vh-65px)] transition-colors shadow-sm dark:shadow-none">
      {/* User Profile Header Panel */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-indigo-500/20 mb-6 space-y-3">
        <div className="flex items-center gap-3 justify-start">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-600/20 border border-indigo-300 dark:border-indigo-500/40 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold text-sm">
            {user.name?.charAt(0) || 'U'}
          </div>
          <div className="text-left">
            <div className="text-xs font-extrabold text-slate-900 dark:text-white truncate max-w-[130px]">{user.name}</div>
            <div className="text-[10px] text-indigo-700 dark:text-indigo-300 font-medium">Verified User</div>
          </div>
        </div>

        {/* Balance Badge */}
        <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-indigo-500/20 flex items-center justify-between text-xs">
          <span className="text-slate-600 dark:text-slate-400 text-[11px]">Policy Coverage</span>
          <span className="font-extrabold text-indigo-700 dark:text-indigo-300">₹10,00,000</span>
        </div>
      </div>

      <div className="text-[10px] font-extrabold text-indigo-700 dark:text-indigo-400 uppercase tracking-widest px-3 mb-3 text-left">
        {user.role} Navigation
      </div>

      <nav className="space-y-1.5 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = checkIsActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold shadow-md shadow-indigo-500/20 dark:bg-gradient-to-r dark:from-indigo-600/40 dark:to-cyan-600/30 dark:text-white dark:border dark:border-indigo-500/40'
                  : 'text-slate-700 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900/60 hover:text-slate-900 dark:hover:text-white border border-transparent hover:border-indigo-500/20'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'}`} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer System Badge */}
      <div className="pt-4 border-t border-indigo-500/10">
        <div className="flex items-center gap-2 text-[10px] text-slate-500 px-3">
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span>Advisory AI Engine Enabled</span>
        </div>
      </div>
    </aside>
  );
}

export function Sidebar() {
  return (
    <Suspense fallback={<aside className="w-64 bg-white/95 dark:bg-[#06070B]/90 border-r border-purple-500/20 hidden md:flex shrink-0 min-h-[calc(100vh-65px)]" />}>
      <SidebarContent />
    </Suspense>
  );
}
