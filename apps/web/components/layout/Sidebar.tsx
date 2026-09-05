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
} from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  if (!user) return null;

  const customerLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/claims/new', label: 'Submit Claim', icon: FilePlus2 },
    { href: '/documents', label: 'My Documents', icon: FolderOpen },
  ];

  const adjusterLinks = [
    { href: '/adjuster/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/adjuster/queue', label: 'Claims Queue', icon: FileText },
    { href: '/adjuster/queue?riskLevel=HIGH', label: 'High Risk Claims', icon: AlertTriangle },
    { href: '/adjuster/analytics', label: 'Performance Analytics', icon: BarChart3 },
  ];

  const adminLinks = [
    { href: '/admin/dashboard', label: 'Overview', icon: LayoutDashboard },
    { href: '/admin/users', label: 'User Management', icon: Users },
    { href: '/admin/policies', label: 'Policy Catalog', icon: ShieldAlert },
    { href: '/admin/audit-logs', label: 'System Audit Logs', icon: ScrollText },
  ];

  let navItems = customerLinks;
  if (user.role === UserRole.ADJUSTER) navItems = adjusterLinks;
  if (user.role === UserRole.ADMIN) navItems = adminLinks;

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col p-4 shrink-0 hidden md:flex">
      <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-3 mb-2">
        {user.role} Navigation
      </div>
      <nav className="space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400 font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
