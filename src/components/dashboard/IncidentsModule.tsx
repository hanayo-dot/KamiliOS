'use client';

import React, { useState } from 'react';
import { useTenant } from '@/context/TenantContext';
import { 
  AlertTriangle, 
  Plus, 
  CheckCircle, 
  Clock, 
  MapPin, 
  ShieldAlert, 
  Radio, 
  ChevronRight 
} from 'lucide-react';

export default function IncidentsModule() {
  const { currentTenant, incidents, resolveIncident } = useTenant();

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white">Field Incidents & Escalations</h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/30">
              {incidents.filter(i => i.status !== 'resolved').length} Open Blockers
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Rapid operational escalation for venue clashes, logistics failures, and security disruptions.
          </p>
        </div>
      </div>

      {/* Incidents Grid */}
      <div className="space-y-4">
        {incidents.length === 0 ? (
          <div className="p-8 text-center bg-slate-900/40 rounded-2xl border border-slate-800 text-slate-400 text-xs">
            <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            No active incidents reported across {currentTenant.region}. All field operations proceeding smoothly.
          </div>
        ) : (
          incidents.map((incident) => (
            <div 
              key={incident.id}
              className={`p-6 rounded-2xl bg-slate-900/80 border transition-all ${
                incident.status === 'resolved' 
                  ? 'border-slate-800/80 opacity-75' 
                  : 'border-red-500/40 shadow-lg shadow-red-500/5'
              }`}
            >
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      incident.priority === 'high' 
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                        : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {incident.priority} Priority
                    </span>
                    <span className="text-xs font-semibold text-slate-300">{incident.category}</span>
                    <span className="text-xs text-slate-500">• {incident.date}</span>
                  </div>

                  <h4 className="text-base font-bold text-white">{incident.title}</h4>
                  
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{incident.location}</span>
                    <span className="text-slate-600">|</span>
                    <span>Reported by: <strong className="text-slate-300">{incident.reportedBy}</strong></span>
                  </div>

                  <p className="text-xs text-slate-300 mt-2 bg-slate-950 p-3 rounded-lg border border-slate-800">
                    {incident.details}
                  </p>
                </div>

                <div className="shrink-0 flex flex-col items-end gap-2">
                  <span className={`text-xs font-bold uppercase ${
                    incident.status === 'resolved' ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {incident.status.replace('_', ' ')}
                  </span>
                  
                  {incident.status !== 'resolved' && (
                    <button
                      onClick={() => resolveIncident(incident.id)}
                      className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Mark Resolved
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
