'use client';

import React, { useState } from 'react';
import { useTenant } from '@/context/TenantContext';
import { 
  Users, 
  MapPin, 
  Calendar, 
  Clock, 
  DollarSign, 
  AlertTriangle, 
  CheckCircle, 
  ArrowUpRight, 
  Plus, 
  ShieldCheck, 
  Radio, 
  CheckSquare, 
  Send, 
  ChevronRight,
  TrendingUp,
  FileCheck,
  Fuel
} from 'lucide-react';

export default function ExecutiveDashboard({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const { currentTenant, currentUser, reports, expenses, incidents, events, approvals, handleApproval } = useTenant();

  // Metrics computation
  const pendingApprovalsCount = approvals.filter(a => a.status === 'pending').length;
  const totalApprovedExpenses = expenses
    .filter(e => e.status === 'candidate_approved' || e.status === 'disbursed')
    .reduce((sum, e) => sum + e.amount, 0);
  const openIncidentsCount = incidents.filter(i => i.status !== 'resolved').length;
  const totalAttendeesEngaged = reports.reduce((sum, r) => sum + (r.attendanceEstimate || 0), 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative">
          <div className="flex items-center gap-4">
            <img
              src={currentTenant.avatarUrl}
              alt={currentTenant.candidateName}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500/40 shadow-lg shadow-emerald-500/10"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                  {currentTenant.position}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {currentTenant.region}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                Good morning, {currentTenant.candidateName}
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Here is your consolidated campaign operations brief for Wednesday, 25 November.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button 
              onClick={() => onNavigate('approvals')}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-md shadow-emerald-500/20 transition-all"
            >
              <CheckCircle className="w-4 h-4" />
              Review Approvals ({pendingApprovalsCount})
            </button>
            <button 
              onClick={() => onNavigate('field_ops')}
              className="px-4 py-2 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs flex items-center gap-2 transition-all"
            >
              <Plus className="w-4 h-4 text-emerald-400" />
              New Field Directive
            </button>
          </div>
        </div>
      </div>

      {/* Key Executive Performance Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div 
          onClick={() => onNavigate('field_ops')}
          className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-emerald-500/40 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Total Citizens Reached</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl sm:text-3xl font-extrabold text-white group-hover:text-emerald-400 transition-colors">
            {totalAttendeesEngaged.toLocaleString()}
          </div>
          <div className="mt-2 text-[11px] text-emerald-400 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            Across {reports.length} verified field engagements
          </div>
        </div>

        <div 
          onClick={() => onNavigate('finance')}
          className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-emerald-500/40 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Recorded Spending</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl sm:text-3xl font-extrabold text-white group-hover:text-blue-400 transition-colors">
            KES {(totalApprovedExpenses / 1000).toFixed(0)}K
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-1">
            <span>Approved disbursements</span>
          </div>
        </div>

        <div 
          onClick={() => onNavigate('approvals')}
          className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-amber-500/40 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Decisions Awaiting You</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
              <CheckSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl sm:text-3xl font-extrabold text-amber-400">
            {pendingApprovalsCount}
          </div>
          <div className="mt-2 text-[11px] text-amber-400/90 flex items-center gap-1">
            Requires candidate sign-off
          </div>
        </div>

        <div 
          onClick={() => onNavigate('incidents')}
          className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-red-500/40 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Active Operational Incidents</span>
            <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl sm:text-3xl font-extrabold text-red-400">
            {openIncidentsCount}
          </div>
          <div className="mt-2 text-[11px] text-red-400/90 flex items-center gap-1">
            Urgent field bottlenecks flagged
          </div>
        </div>
      </div>

      {/* Main Grid: Live Field Feed & Geographic Operations Map */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Real-time Field Activity Timeline */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                  Live Field Activity Feed
                </h3>
                <p className="text-xs text-slate-400">Real-time reports submitted by ward coordinators</p>
              </div>
              <button 
                onClick={() => onNavigate('field_ops')}
                className="text-xs font-semibold text-emerald-400 hover:underline flex items-center gap-1"
              >
                View all ({reports.length})
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-4">
              {reports.map((report) => (
                <div 
                  key={report.id}
                  className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-200">
                          {report.category}
                        </span>
                        <span className="text-xs font-semibold text-emerald-400">
                          {report.location}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white mt-1.5">{report.title}</h4>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">{report.notes}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[11px] text-slate-400">{report.date}</span>
                      <div className="text-xs font-bold text-slate-200 mt-1">
                        ~{report.attendanceEstimate} attendees
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <Users className="w-3 h-3 text-slate-400" />
                      Lead: <strong className="text-slate-300">{report.leaderName}</strong>
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 capitalize">
                      {report.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Pending Approvals Preview */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-amber-400" />
                Attention Required: Candidate Sign-Offs
              </h3>
              <button 
                onClick={() => onNavigate('approvals')}
                className="text-xs text-slate-400 hover:text-white"
              >
                Go to Approvals Centre
              </button>
            </div>

            <div className="space-y-3">
              {approvals.filter(a => a.status === 'pending').slice(0, 3).map((item) => (
                <div key={item.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                        item.urgency === 'immediate' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-amber-500/20 text-amber-400'
                      }`}>
                        {item.urgency}
                      </span>
                      <span className="text-xs font-semibold text-slate-300">{item.type}</span>
                    </div>
                    <div className="text-sm font-bold text-white mt-1">{item.title}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{item.details}</div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleApproval(item.id, 'approved')}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleApproval(item.id, 'rejected')}
                      className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold"
                    >
                      Hold
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Geographic Coverage & Upcoming Schedule */}
        <div className="space-y-6">
          {/* Geographic Coverage Card */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-emerald-400" />
              Administrative Coverage
            </h3>
            <p className="text-xs text-slate-400 mb-4">Constituency & ward operational status</p>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px] opacity-10" />
              <div className="relative py-4">
                <div className="text-3xl font-extrabold text-white">17 / 17</div>
                <div className="text-xs text-emerald-400 font-medium mt-1">Sub-Counties with Active Marshals</div>
                <div className="mt-4 grid grid-cols-2 gap-2 text-left text-[11px] text-slate-300">
                  <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Wards Covered:</span>
                    <strong className="text-white">85 of 85 (100%)</strong>
                  </div>
                  <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Depots & Offices:</span>
                    <strong className="text-white">4 Regional Hubs</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Schedule Preview */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-400" />
                Candidate's Schedule
              </h3>
              <button onClick={() => onNavigate('calendar')} className="text-xs text-emerald-400 hover:underline">
                View Calendar
              </button>
            </div>

            <div className="space-y-3">
              {events.map((evt) => (
                <div key={evt.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] font-bold text-blue-400 block">{evt.date} • {evt.time}</span>
                  <div className="text-xs font-bold text-white mt-1">{evt.title}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{evt.venue}</div>
                  <div className="mt-2 text-[10px] text-slate-500 flex items-center justify-between">
                    <span>Expected: {evt.expectedAttendees.toLocaleString()}</span>
                    <span className="text-emerald-400 uppercase font-semibold">{evt.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
