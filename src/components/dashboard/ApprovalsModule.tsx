'use client';

import React from 'react';
import { useTenant } from '@/context/TenantContext';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  ShieldCheck, 
  DollarSign, 
  Calendar, 
  UserCheck, 
  FileText,
  AlertCircle
} from 'lucide-react';

export default function ApprovalsModule() {
  const { currentTenant, approvals, handleApproval } = useTenant();

  const pendingList = approvals.filter(a => a.status === 'pending');
  const resolvedList = approvals.filter(a => a.status !== 'pending');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white">Approvals & Executive Decisions</h2>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
              {pendingList.length} Pending Actions
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Sole decision-authority queue for <strong className="text-white">{currentTenant.candidateName}</strong>. All signed actions are recorded in immutable audit logs.
          </p>
        </div>
      </div>

      {/* Pending Items */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-400" />
          Awaiting Your Direct Authorization
        </h3>

        {pendingList.length === 0 ? (
          <div className="p-8 text-center bg-slate-900/40 rounded-2xl border border-slate-800 text-slate-400 text-xs">
            <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            No pending decisions requiring your attention right now. Your operational queue is fully cleared!
          </div>
        ) : (
          pendingList.map((item) => (
            <div 
              key={item.id}
              className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
            >
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                    item.urgency === 'immediate' 
                      ? 'bg-red-500/20 text-red-400 border border-red-500/40' 
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  }`}>
                    {item.urgency}
                  </span>
                  <span className="text-xs font-bold text-emerald-400">{item.type}</span>
                  <span className="text-xs text-slate-500">• {item.date}</span>
                </div>

                <h4 className="text-base font-bold text-white">{item.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{item.details}</p>

                <div className="text-[11px] text-slate-400 pt-1">
                  Submitted by: <strong className="text-slate-200">{item.requestedBy}</strong>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 w-full md:w-auto">
                <button
                  onClick={() => handleApproval(item.id, 'rejected')}
                  className="flex-1 md:flex-none px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all"
                >
                  <XCircle className="w-4 h-4 text-red-400" />
                  Decline / Return
                </button>
                <button
                  onClick={() => handleApproval(item.id, 'approved')}
                  className="flex-1 md:flex-none px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20 transition-all"
                >
                  <CheckCircle className="w-4 h-4" />
                  Grant Approval
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Resolved Decision History */}
      {resolvedList.length > 0 && (
        <div className="space-y-3 pt-6 border-t border-slate-800">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Recent Decision Audit Trail
          </h3>
          <div className="divide-y divide-slate-800/80 rounded-xl bg-slate-900/40 border border-slate-800 overflow-hidden text-xs">
            {resolvedList.map((item) => (
              <div key={item.id} className="p-4 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">{item.title}</div>
                  <div className="text-[11px] text-slate-400">{item.requestedBy}</div>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  item.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                }`}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
