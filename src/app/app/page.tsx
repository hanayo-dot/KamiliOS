'use client';

import React, { useState, useEffect } from 'react';
import { TenantProvider, useTenant } from '@/context/TenantContext';
import { isTabAllowed, getRolePermissions, ROLE_LABELS } from '@/utils/rbac';
import { useOfflineSync } from '@/utils/offlineSync';
import Sidebar from '@/components/dashboard/Sidebar';
import ExecutiveDashboard from '@/components/dashboard/ExecutiveDashboard';
import FieldOperationsModule from '@/components/dashboard/FieldOperationsModule';
import FinanceModule from '@/components/dashboard/FinanceModule';
import ApprovalsModule from '@/components/dashboard/ApprovalsModule';
import TeamsModule from '@/components/dashboard/TeamsModule';
import IncidentsModule from '@/components/dashboard/IncidentsModule';
import CommunicationsModule from '@/components/dashboard/CommunicationsModule';
import Link from 'next/link';
import { 
  Bell, 
  Search, 
  ShieldCheck, 
  Database, 
  ExternalLink,
  Lock,
  ShieldAlert,
  UserCheck,
  Wifi,
  WifiOff
} from 'lucide-react';

function DashboardShell() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { currentTenant, currentUser } = useTenant();
  const { isOnline, queuedCount } = useOfflineSync();

  // Guard: Automatically redirect if active tab is forbidden for current role
  useEffect(() => {
    if (currentUser?.role && !isTabAllowed(currentUser.role, activeTab)) {
      const defaultTab = getRolePermissions(currentUser.role).defaultTab;
      setActiveTab(defaultTab);
    }
  }, [currentUser?.role, activeTab]);

  const roleInfo = ROLE_LABELS[currentUser?.role || 'field_member'];

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto h-screen">
        {/* Top Operational Bar */}
        <header className="h-16 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 px-6 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/50 border border-emerald-500/20 px-2.5 py-1 rounded-md flex items-center gap-1.5">
              <Lock className="w-3 h-3 text-emerald-400" />
              Tenant Context: <strong className="text-white">{currentTenant.name}</strong>
            </span>
            <div className="hidden lg:flex items-center gap-1.5">
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${roleInfo.badgeColor}`}>
                {roleInfo.title}
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                ({roleInfo.tier})
              </span>
            </div>
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
              {isOnline ? (
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-emerald-400">Cloud Online</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-950/60 border border-amber-500/30 text-amber-400 text-xs font-semibold">
                  <WifiOff className="w-3.5 h-3.5 animate-pulse" />
                  <span>Rural Mode ({queuedCount} Queued)</span>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic Module Rendering */}
        <main className="p-6 sm:p-8 max-w-7xl w-full mx-auto space-y-6 pb-20">
          {!isTabAllowed(currentUser?.role, activeTab) ? (
            <div className="p-12 text-center rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
              <ShieldAlert className="w-12 h-12 text-amber-400 mx-auto" />
              <h3 className="text-lg font-bold text-white">Access Restricted</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Your role as <strong className="text-white">{roleInfo.title}</strong> does not have clearance for the requested module.
              </p>
              <button
                onClick={() => setActiveTab(getRolePermissions(currentUser?.role).defaultTab)}
                className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
              >
                Return to Primary Workspace
              </button>
            </div>
          ) : (
            <>
              {activeTab === 'dashboard' && <ExecutiveDashboard onNavigate={setActiveTab} />}
              {activeTab === 'command_centre' && <ExecutiveDashboard onNavigate={setActiveTab} />}
              {activeTab === 'field_ops' && <FieldOperationsModule />}
              {activeTab === 'finance' && <FinanceModule />}
              {activeTab === 'approvals' && <ApprovalsModule />}
              {activeTab === 'teams' && <TeamsModule />}
              {activeTab === 'incidents' && <IncidentsModule />}
              {activeTab === 'communications' && <CommunicationsModule />}

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
            </>
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
