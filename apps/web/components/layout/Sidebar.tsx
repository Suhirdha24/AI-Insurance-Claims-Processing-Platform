'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  Settings,
  ShieldCheck
} from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  if (!user) return null;

  const customerLinks = [
    { href: '/dashboard', label: 'Damage Assessment', icon: LayoutDashboard },
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

  return (
    <aside className="w-64 bg-[#06070B]/90 backdrop-blur-xl border-r border-purple-500/20 flex flex-col p-4 shrink-0 hidden md:flex min-h-[calc(100vh-65px)]">
      {/* INSURE.AI Profile Header Panel */}
      <div className="p-4 rounded-2xl glass-panel border border-purple-500/20 mb-6 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-300 font-bold text-sm">
            {user.name?.charAt(0) || 'U'}
          </div>
          <div>
            <div className="text-xs font-extrabold text-white truncate max-w-[130px]">{user.name}</div>
            <div className="text-[10px] text-purple-300 font-medium">Verified User</div>
          </div>
        </div>

        {/* Balance Badge */}
        <div className="p-2.5 rounded-xl bg-slate-900/80 border border-purple-500/20 flex items-center justify-between text-xs">
          <span className="text-slate-400 text-[11px]">Policy Coverage</span>
          <span className="font-extrabold text-purple-300">₹10,00,000</span>
        </div>
      </div>

      <div className="text-[10px] font-extrabold text-purple-400 uppercase tracking-widest px-3 mb-3">
        {user.role} Navigation
      </div>

      <nav className="space-y-1.5 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-purple-600/30 to-fuchsia-600/20 text-white border border-purple-500/40 font-bold shadow-lg shadow-purple-500/10'
                  : 'text-slate-400 hover:bg-slate-900/60 hover:text-white border border-transparent hover:border-purple-500/20'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-purple-400' : 'text-slate-500'}`} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer System Badge */}
      <div className="pt-4 border-t border-purple-500/10">
        <div className="flex items-center gap-2 text-[10px] text-slate-500 px-3">
          <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
          <span>Advisory AI Engine Enabled</span>
        </div>
      </div>
    </aside>
  );
}
