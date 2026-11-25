'use client';

import React, { useState } from 'react';
import { TenantProvider, useTenant } from '@/context/TenantContext';
import Sidebar from '@/components/dashboard/Sidebar';
import ExecutiveDashboard from '@/components/dashboard/ExecutiveDashboard';
import FieldOperationsModule from '@/components/dashboard/FieldOperationsModule';
import FinanceModule from '@/components/dashboard/FinanceModule';
import ApprovalsModule from '@/components/dashboard/ApprovalsModule';
import TeamsModule from '@/components/dashboard/TeamsModule';
import IncidentsModule from '@/components/dashboard/IncidentsModule';
import Link from 'next/link';
import { 
  Bell, 
  Search, 
  ShieldCheck, 
  Database, 
  ExternalLink,
  Lock
} from 'lucide-react';

function DashboardShell() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { currentTenant, currentUser } = useTenant();

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto h-screen">
        {/* Top Operational Bar */}
        <header className="h-16 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 px-6 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/50 border border-emerald-500/20 px-2.5 py-1 rounded-md flex items-center gap-1.5">
              <Lock className="w-3 h-3 text-emerald-400" />
              Tenant Context: <strong className="text-white">{currentTenant.name}</strong>
            </span>
            <span className="hidden md:inline-flex text-[11px] text-slate-400 font-mono">
              Schema: {currentTenant.tier.toUpperCase()}_PARTITION_01
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
            >
              <span>Landing Page</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <div className="h-4 w-px bg-slate-800" />

            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-semibold text-slate-300">Command Online</span>
            </div>
          </div>
        </header>

        {/* Dynamic Module Rendering */}
        <main className="p-6 sm:p-8 max-w-7xl w-full mx-auto space-y-6 pb-20">
          {activeTab === 'dashboard' && <ExecutiveDashboard onNavigate={setActiveTab} />}
          {activeTab === 'command_centre' && <ExecutiveDashboard onNavigate={setActiveTab} />}
          {activeTab === 'field_ops' && <FieldOperationsModule />}
          {activeTab === 'finance' && <FinanceModule />}
          {activeTab === 'approvals' && <ApprovalsModule />}
          {activeTab === 'teams' && <TeamsModule />}
          {activeTab === 'incidents' && <IncidentsModule />}

          {/* Placeholders for secondary modules */}
          {activeTab === 'calendar' && (
            <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
              <h3 className="text-lg font-bold text-white">Central Campaign Calendar & IEBC Rallies</h3>
              <p className="text-xs text-slate-400 mt-2">
                All confirmed candidate events, meetings, and motorcades are scheduled through the central Command Calendar.
              </p>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
              <h3 className="text-lg font-bold text-white">IEBC Compliance & Statutory Campaign Financing Returns</h3>
              <p className="text-xs text-slate-400 mt-2">
                Export consolidated receipts and expenditure logs formatted directly to Kenyan electoral audit regulations.
              </p>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
              <h3 className="text-lg font-bold text-white">Tenant Security & Cryptographic Isolation Policy</h3>
              <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
                Every tenant is assigned a unique KMS encryption key and isolated database boundary. Data sharing between candidate partitions is physically and logically prohibited by PostgreSQL Row-Level Security and partitioned tables.
              </p>
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-emerald-400 space-y-1">
                <div>Tenant ID: {currentTenant.id}</div>
                <div>KMS Key: {currentTenant.encryptionKeyId}</div>
                <div>Isolation Mode: AES-256 + PostgreSQL RLS Enabled</div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function AppPage() {
  return (
    <TenantProvider>
      <DashboardShell />
    </TenantProvider>
  );
}
