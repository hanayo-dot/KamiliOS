'use client';

import React, { useState } from 'react';
import { useTenant } from '@/context/TenantContext';
import { 
  MapPin, 
  Plus, 
  WifiOff, 
  CheckCircle, 
  Filter, 
  Camera, 
  Users, 
  Send,
  Sparkles,
  Layers
} from 'lucide-react';

export default function FieldOperationsModule() {
  const { currentTenant, reports, addReport } = useTenant();
  const [showModal, setShowModal] = useState(false);
  const [selectedWard, setSelectedWard] = useState('all');

  // New report form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'Door-to-door' | 'Town Hall' | 'Boda Boda Engagement' | 'Market Outreach' | 'Youth Caucus'>('Market Outreach');
  const [location, setLocation] = useState('');
  const [ward, setWard] = useState('');
  const [leaderName, setLeaderName] = useState('');
  const [attendance, setAttendance] = useState(100);
  const [notes, setNotes] = useState('');

  const handleCreateReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !location) return;

    addReport({
      title,
      category,
      location,
      ward: ward || 'Central Ward',
      constituency: currentTenant.region,
      assignedTeamId: 'team-mobilization-alpha',
      leaderName: leaderName || 'Field Lead',
      date: 'Just now',
      attendanceEstimate: Number(attendance),
      status: 'submitted',
      notes,
      flaggedIssuesCount: 0,
      photos: [],
    });

    setShowModal(false);
    setTitle('');
    setLocation('');
    setNotes('');
  };

  const filteredReports = selectedWard === 'all' 
    ? reports 
    : reports.filter(r => r.ward.toLowerCase().includes(selectedWard.toLowerCase()));

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-6 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white">Field Operations & Grassroots Reporting</h2>
            <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
              <CheckCircle className="w-3 h-3" />
              Offline Sync Enabled
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Standardized operational logs filed by ward, constituency, and youth marshals for <strong className="text-white">{currentTenant.name}</strong>.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-emerald-500/20"
        >
          <Plus className="w-4 h-4" />
          Log Field Activity
        </button>
      </div>

      {/* Offline Sync Banner (PWA feature simulation) */}
      <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-4 flex items-center justify-between text-xs text-slate-300">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <WifiOff className="w-4 h-4" />
          </div>
          <div>
            <strong className="text-white font-semibold">Low-Bandwidth Resilient Cache:</strong> Field personnel can submit logs in areas without 3G/4G. Form data will queue locally in IndexedDB and upload immediately upon reconnection.
          </div>
        </div>
        <span className="text-emerald-400 font-mono text-[11px]">Sync Queue: 0 pending</span>
      </div>

      {/* Reports List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredReports.map((report) => (
          <div 
            key={report.id}
            className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  {report.category}
                </span>
                <span className="text-xs text-slate-400">{report.date}</span>
              </div>

              <h3 className="text-base font-bold text-white mt-2">{report.title}</h3>
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 mt-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>{report.location}</span>
                {report.ward && <span className="text-slate-400">({report.ward} Ward)</span>}
              </div>

              <p className="text-xs text-slate-400 mt-3 leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
                {report.notes}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-slate-400" />
                Team Lead: <strong className="text-slate-200">{report.leaderName}</strong>
              </span>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-200">~{report.attendanceEstimate}</span> attendees
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Report Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Log Field Operation</h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleCreateReport} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Activity Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Kangemi Market Hawkers Caucus"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Engagement Category</label>
                  <select
                    value={category}
                    onChange={(e: any) => setCategory(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none"
                  >
                    <option value="Market Outreach">Market Outreach</option>
                    <option value="Boda Boda Engagement">Boda Boda Engagement</option>
                    <option value="Town Hall">Town Hall</option>
                    <option value="Door-to-door">Door-to-door</option>
                    <option value="Youth Caucus">Youth Caucus</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Estimated Attendance</label>
                  <input
                    type="number"
                    value={attendance}
                    onChange={(e) => setAttendance(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Specific Venue / Location</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Kangemi Stage, Posta"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Ward Name</label>
                  <input
                    type="text"
                    placeholder="e.g., Kangemi"
                    value={ward}
                    onChange={(e) => setWard(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Responsible Team Lead</label>
                <input
                  type="text"
                  placeholder="e.g., Brian Omondi"
                  value={leaderName}
                  onChange={(e) => setLeaderName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Field Intelligence & Key Issues Raised</label>
                <textarea
                  rows={3}
                  placeholder="Briefly state key feedback from voters, requests made, or merchandise distributed..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20"
              >
                Transmit Field Report
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
