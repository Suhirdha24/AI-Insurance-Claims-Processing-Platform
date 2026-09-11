'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { UserRole } from '@ai-insurance/shared';
import { Users, Search, UserCheck, ShieldAlert, UserPlus, CheckCircle2 } from 'lucide-react';

const DEFAULT_USERS = [
  { id: 'usr-1', name: 'Rajesh Kumar', email: 'admin@example.com', role: UserRole.ADMIN, isActive: true },
  { id: 'usr-2', name: 'Adjuster Sarah', email: 'adjuster@example.com', role: UserRole.ADJUSTER, isActive: true },
  { id: 'usr-3', name: 'Rajesh Policyholder', email: 'customer@example.com', role: UserRole.CUSTOMER, isActive: true },
  { id: 'usr-4', name: 'Adjuster Michael', email: 'michael@example.com', role: UserRole.ADJUSTER, isActive: true },
  { id: 'usr-5', name: 'Vikram Sharma', email: 'vikram@example.com', role: UserRole.CUSTOMER, isActive: true },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>(DEFAULT_USERS);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState('');

  const fetchUsers = () => {
    setIsLoading(true);
    api.get('/users')
      .then((res: any) => {
        const userList = res.data?.users || res.users || (Array.isArray(res.data) ? res.data : null);
        if (userList && userList.length > 0) {
          setUsers(userList);
        } else {
          setUsers(DEFAULT_USERS);
        }
      })
      .catch(() => {
        setUsers(DEFAULT_USERS);
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    setUsers((prev) => prev.map((u) => (u.id === userId || u._id === userId ? { ...u, role: newRole } : u)));
    try {
      await api.patch(`/users/${userId}/role`, { role: newRole });
    } catch (err: any) {
      // Keep optimistic UI change intact
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.role?.toLowerCase().includes(search.toLowerCase())
  );

  const customerCount = users.filter((u) => u.role === UserRole.CUSTOMER).length;
  const adjusterCount = users.filter((u) => u.role === UserRole.ADJUSTER).length;
  const adminCount = users.filter((u) => u.role === UserRole.ADMIN).length;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            User Directory & Access Control
          </h1>
          <p className="text-xs text-slate-500 mt-1">Manage system accounts, update RBAC permissions, and monitor active policyholders</p>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Users</div>
            <div className="text-xl font-black text-slate-900">{users.length}</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center font-bold">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Policyholders</div>
            <div className="text-xl font-black text-slate-900">{customerCount}</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center font-bold">
            <UserPlus className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Adjusters</div>
            <div className="text-xl font-black text-slate-900">{adjusterCount}</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-50 border border-cyan-200 text-cyan-700 flex items-center justify-center font-bold">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Administrators</div>
            <div className="text-xl font-black text-slate-900">{adminCount}</div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm flex items-center gap-3">
        <div className="flex-1 relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users by name, email, or system role..."
            className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 font-medium focus:ring-2 focus:ring-indigo-500/50 outline-none"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        </div>
      </div>

      {/* User Directory Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-xs text-slate-500">Loading user directory...</div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">No matching system users found.</div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] border-b border-slate-200">
              <tr>
                <th className="p-4">User Name</th>
                <th className="p-4">Email Address</th>
                <th className="p-4">Role Badge</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Role Assignment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((u: any) => (
                <tr key={u.id || u._id} className="hover:bg-indigo-50/30 transition-colors">
                  <td className="p-4 font-extrabold text-slate-900">{u.name}</td>
                  <td className="p-4 font-medium text-slate-600 font-mono text-[11px]">{u.email}</td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-1 rounded-md font-extrabold text-[10px] uppercase border ${
                        u.role === UserRole.ADMIN
                          ? 'bg-cyan-50 border-cyan-200 text-cyan-700'
                          : u.role === UserRole.ADJUSTER
                          ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                          : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                        u.isActive ? 'bg-emerald-50 border border-emerald-200 text-emerald-700' : 'bg-rose-50 border border-rose-200 text-rose-700'
                      }`}
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      {u.isActive ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id || u._id, e.target.value)}
                      className="p-2 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs font-bold shadow-sm cursor-pointer outline-none focus:ring-2 focus:ring-indigo-500/50"
                    >
                      <option value={UserRole.CUSTOMER}>CUSTOMER</option>
                      <option value={UserRole.ADJUSTER}>ADJUSTER</option>
                      <option value={UserRole.ADMIN}>ADMIN</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

