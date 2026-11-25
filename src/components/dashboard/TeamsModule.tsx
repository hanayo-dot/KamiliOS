'use client';

import React, { useState } from 'react';
import { useTenant } from '@/context/TenantContext';
import { 
  Users, 
  UserPlus, 
  ShieldAlert, 
  Flame, 
  MapPin, 
  Phone, 
  Mail, 
  CheckCircle2, 
  XCircle,
  AlertTriangle
} from 'lucide-react';

export default function TeamsModule() {
  const { currentTenant, users } = useTenant();
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [burnNotice, setBurnNotice] = useState<string | null>(null);

  const handleBurnSwitch = (userName: string) => {
    setBurnNotice(userName);
    setTimeout(() => setBurnNotice(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Campaign Hierarchy & Personnel Directory</h2>
          <p className="text-xs text-slate-400 mt-1">
            Role-Based Access Control and instant session revocation for {currentTenant.name}.
          </p>
        </div>

        <button 
          onClick={() => alert('Add Team Member Dialog')}
          className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-md shadow-emerald-500/20"
        >
          <UserPlus className="w-4 h-4" />
          Register Campaign Operative
        </button>
      </div>

      {burnNotice && (
        <div className="p-4 rounded-xl bg-red-950/80 border border-red-500 text-red-200 text-xs flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-3">
            <Flame className="w-5 h-5 text-red-400 shrink-0" />
            <div>
              <strong className="text-white">Defection Burn Switch Activated:</strong> All active sessions, offline cached field data, and token permissions for <u>{burnNotice}</u> have been instantly revoked and cleared.
            </div>
          </div>
          <button onClick={() => setBurnNotice(null)} className="text-xs font-bold text-red-300">
            Dismiss
          </button>
        </div>
      )}

      {/* Hierarchy Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800">
          <span className="text-xs text-slate-400">Total Registered Personnel</span>
          <div className="text-3xl font-extrabold text-white mt-2">{users.length} Operatives</div>
          <div className="text-[11px] text-emerald-400 mt-1">100% Identity verified</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800">
          <span className="text-xs text-slate-400">Access Control Model</span>
          <div className="text-lg font-bold text-white mt-2">Granular RBAC</div>
          <div className="text-[11px] text-slate-400 mt-1">Ward leads isolated from financial ledgers</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800">
          <span className="text-xs text-slate-400">Campaign War Room Status</span>
          <div className="text-lg font-bold text-emerald-400 mt-2 flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            Active Mobilization
          </div>
          <div className="text-[11px] text-slate-400 mt-1">All 17 coordinators checked in today</div>
        </div>
      </div>

      {/* Personnel Roster */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">Authorized Operatives</h3>
          <span className="text-xs text-slate-400">{users.length} active users</span>
        </div>

        <div className="divide-y divide-slate-800/80">
          {users.map((user) => (
            <div key={user.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-800/20 transition-colors">
              <div className="flex items-center gap-3">
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-10 h-10 rounded-xl object-cover border border-slate-700"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{user.name}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 capitalize">
                      {user.role.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-400 mt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      {user.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3 text-slate-500" />
                      {user.phone}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <span className="text-[11px] text-slate-500 mr-2">Active: {user.lastActive}</span>
                {user.role !== 'candidate' && (
                  <button
                    onClick={() => handleBurnSwitch(user.name)}
                    className="px-3 py-1.5 rounded-lg border border-red-500/30 bg-red-950/40 hover:bg-red-900/60 text-red-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
                    title="Instantly revoke all access if user switches camps"
                  >
                    <Flame className="w-3.5 h-3.5 text-red-400" />
                    Burn Switch
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
