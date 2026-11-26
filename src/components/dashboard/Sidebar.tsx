'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTenant } from '@/context/TenantContext';
import { isTabAllowed, getRolePermissions, ROLE_LABELS } from '@/utils/rbac';
import { 
  LayoutDashboard, 
  ShieldAlert, 
  Users, 
  MapPin, 
  Calendar, 
  CheckSquare, 
  DollarSign, 
  MessageSquare, 
  AlertTriangle, 
  FolderArchive, 
  BarChart3, 
  CheckCircle, 
  Settings, 
  Shield, 
  Lock, 
  Building,
  UserCheck,
  ChevronDown
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const { currentTenant, allTenants, switchTenant, currentUser, switchUserRole, users } = useTenant();

  const allNavigationItems = [
    { id: 'dashboard', name: 'Executive Dashboard', icon: LayoutDashboard },
    { id: 'command_centre', name: 'Command Centre', icon: ShieldAlert },
    { id: 'field_ops', name: 'Field Operations', icon: MapPin },
    { id: 'teams', name: 'Teams & Hierarchy', icon: Users },
    { id: 'calendar', name: 'Events & Calendar', icon: Calendar },
    { id: 'finance', name: 'Finance & Floats', icon: DollarSign },
    { id: 'approvals', name: 'Approvals Centre', icon: CheckCircle },
    { id: 'incidents', name: 'Incidents & Security', icon: AlertTriangle },
    { id: 'reports', name: 'IEBC & Analytics', icon: BarChart3 },
    { id: 'settings', name: 'Tenant Security', icon: Settings },
  ];

  // RBAC: Dynamically filter navigation items based on active role
  const navigationItems = allNavigationItems.filter(item => 
    isTabAllowed(currentUser?.role, item.id)
  );

  const roleInfo = ROLE_LABELS[currentUser?.role || 'field_member'];

  const handleRoleChange = (userId: string) => {
    switchUserRole(userId);
    const targetUser = users.find(u => u.id === userId);
    if (targetUser) {
      const perms = getRolePermissions(targetUser.role);
      // Auto-switch to default allowed tab if current active tab is inaccessible
      if (!perms.allowedTabs.includes(activeTab)) {
        setActiveTab(perms.defaultTab);
      }
    }
  };

  return (
    <aside className="w-72 bg-slate-950 border-r border-slate-800 flex flex-col justify-between shrink-0 h-screen sticky top-0 overflow-y-auto font-sans">
      <div>
        {/* Brand / Logo */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-emerald-500 flex items-center justify-center font-bold text-slate-950 text-sm shadow-md shadow-emerald-500/20">
              K
            </div>
            <div>
              <span className="font-bold text-white text-base tracking-tight">Kamili<span className="text-emerald-400">OS</span></span>
              <span className="block text-[10px] text-slate-400">Command Suite</span>
            </div>
          </Link>
          <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30 text-[10px] text-emerald-400 font-mono">
            <Lock className="w-2.5 h-2.5" />
            RLS-ON
          </div>
        </div>

        {/* Multi-Tenant Switcher (Guaranteed Data Isolation Demonstration) */}
        <div className="p-4 border-b border-slate-800/80 bg-slate-900/40">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold uppercase tracking-wider mb-1.5">
            <span className="flex items-center gap-1.5">
              <Building className="w-3 h-3 text-emerald-400" />
              Active Politician Tenant
            </span>
          </div>

          <div className="relative">
            <select
              value={currentTenant.id}
              onChange={(e) => switchTenant(e.target.value)}
              className="w-full text-xs font-medium bg-slate-900 border border-slate-700 rounded-lg text-slate-100 p-2 appearance-none focus:outline-none focus:border-emerald-500 transition-colors"
            >
              {allTenants.map((tenant) => (
                <option key={tenant.id} value={tenant.id}>
                  {tenant.candidateName} ({tenant.tier.toUpperCase()})
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
            <span className="truncate text-slate-300 font-medium">{currentTenant.position}</span>
          </div>
          <div className="text-[10px] text-emerald-400/90 font-mono mt-0.5 truncate">
            Key: {currentTenant.encryptionKeyId}
          </div>
        </div>

        {/* Role Switcher */}
        <div className="px-4 py-2.5 border-b border-slate-800/60 bg-slate-950">
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium mb-1">
            <span className="flex items-center gap-1">
              <UserCheck className="w-3 h-3 text-blue-400" />
              Viewing as Role:
            </span>
            <span className="text-[9px] font-mono text-emerald-400">
              {navigationItems.length}/10 Tabs
            </span>
          </div>
          <select
            value={currentUser?.id}
            onChange={(e) => handleRoleChange(e.target.value)}
            className="w-full text-[11px] bg-slate-900/80 border border-slate-800 rounded text-slate-300 px-2 py-1 focus:outline-none focus:border-emerald-500"
          >
            {users.map(u => (
              <option key={u.id} value={u.id}>
                {u.name} — {u.role.replace('_', ' ').toUpperCase()}
              </option>
            ))}
          </select>
          <div className="mt-1 flex items-center justify-between text-[9px]">
            <span className="text-slate-500">{roleInfo.tier}</span>
            <span className="text-emerald-400/80 font-mono">RBAC Active</span>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="p-3 space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* User Session Profile & Security Footer */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/30">
        <div className="flex items-center gap-3">
          <img
            src={currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80'}
            alt={currentUser?.name}
            className="w-8 h-8 rounded-full object-cover border border-slate-700"
          />
          <div className="truncate flex-1">
            <div className="text-xs font-bold text-white truncate">{currentUser?.name}</div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`text-[9px] px-1.5 py-0.2 rounded border font-semibold truncate ${roleInfo.badgeColor}`}>
                {roleInfo.title}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
          <span className="flex items-center gap-1">
            <Shield className="w-3 h-3 text-emerald-500" /> Air-Gapped DB
          </span>
          <span className="text-emerald-400 font-mono">v1.2.0</span>
        </div>
      </div>
    </aside>
  );
}
