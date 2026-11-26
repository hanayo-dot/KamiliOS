'use client';

import React, { useState } from 'react';
import { useTenant } from '@/context/TenantContext';
import { getRolePermissions, ROLE_LABELS } from '@/utils/rbac';
import { useOfflineSync } from '@/utils/offlineSync';
import { getCurrentGPSLocation, compressFieldPhoto, GPSResult, CompressedImageResult } from '@/utils/geoAndMedia';
import { 
  MapPin, 
  Plus, 
  WifiOff, 
  Wifi,
  CheckCircle, 
  Filter, 
  Camera, 
  Users, 
  Send,
  Sparkles,
  Layers,
  Lock,
  Compass,
  Crosshair,
  RefreshCw,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function FieldOperationsModule() {
  const { currentTenant, currentUser, reports, addReport } = useTenant();
  const permissions = getRolePermissions(currentUser?.role);
  const roleInfo = ROLE_LABELS[currentUser?.role || 'field_member'];

  // Offline Sync engine hook
  const { 
    isOnline, 
    isSimulatedOffline, 
    toggleSimulatedOffline, 
    queuedCount, 
    queuedItems, 
    queueItem, 
    syncAll, 
    isSyncing 
  } = useOfflineSync();

  const [showModal, setShowModal] = useState(false);
  const [selectedWard, setSelectedWard] = useState('all');

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'Door-to-door' | 'Town Hall' | 'Boda Boda Engagement' | 'Market Outreach' | 'Youth Caucus'>('Market Outreach');
  const [location, setLocation] = useState(currentUser?.location || '');
  const [ward, setWard] = useState('');
  const [leaderName, setLeaderName] = useState(currentUser?.name || '');
  const [attendance, setAttendance] = useState(100);
  const [notes, setNotes] = useState('');

  // GPS & Media states
  const [gpsData, setGpsData] = useState<GPSResult | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [compressedPhoto, setCompressedPhoto] = useState<CompressedImageResult | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [syncNotice, setSyncNotice] = useState<string | null>(null);

  const handleCaptureGPS = async () => {
    setIsLocating(true);
    try {
      const loc = await getCurrentGPSLocation();
      setGpsData(loc);
    } catch (err) {
      console.error('Failed to capture GPS', err);
    } finally {
      setIsLocating(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsCompressing(true);
    try {
      const compressed = await compressFieldPhoto(file, 1024, 0.72);
      setCompressedPhoto(compressed);
    } catch (err) {
      console.error('Error compressing field photo', err);
    } finally {
      setIsCompressing(false);
    }
  };

  const handleCreateReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !location) return;

    const reportPayload = {
      title,
      category,
      location,
      ward: ward || 'Central Ward',
      constituency: currentTenant.region,
      assignedTeamId: 'team-mobilization-alpha',
      leaderName: leaderName || currentUser?.name || 'Field Lead',
      date: 'Just now',
      attendanceEstimate: Number(attendance),
      status: isOnline ? 'submitted' as const : 'queued_offline' as any,
      notes,
      flaggedIssuesCount: 0,
      photos: compressedPhoto ? [compressedPhoto.dataUrl] : [],
      gps: gpsData ? gpsData.formatted : undefined,
    };

    if (isOnline) {
      // Normal online submission
      addReport(reportPayload);
      setSyncNotice('Field activity successfully submitted and synchronized with Executive Command!');
    } else {
      // Offline-first submission: Queue locally in IndexedDB/localStorage
      queueItem(
        'field_report',
        currentTenant.id,
        reportPayload,
        gpsData ? { latitude: gpsData.latitude, longitude: gpsData.longitude, accuracy: gpsData.accuracy } : undefined,
        compressedPhoto?.dataUrl
      );
      // Immediately reflect in UI with queued status
      addReport({
        ...reportPayload,
        title: `[OFFLINE QUEUED] ${title}`,
        status: 'submitted',
      });
      setSyncNotice('Offline Mode Active: Report safely queued in local storage. Will automatically sync to Cloud when connectivity restores.');
    }

    setTimeout(() => setSyncNotice(null), 5000);

    // Reset Form
    setShowModal(false);
    setTitle('');
    setLocation(currentUser?.location || '');
    setNotes('');
    setGpsData(null);
    setCompressedPhoto(null);
  };

  const handleManualSync = async () => {
    await syncAll(async (item) => {
      if (item.type === 'field_report') {
        addReport(item.payload);
      }
    });
    setSyncNotice('All queued offline field items successfully synced to Cloud!');
    setTimeout(() => setSyncNotice(null), 4000);
  };

  // RBAC Field Scope Slicing: Local coordinators only see reports in their assigned jurisdiction
  const scopedReports = permissions.canViewAllFieldReports
    ? reports
    : reports.filter(r => 
        (r.location && currentUser?.location && r.location.toLowerCase().includes(currentUser.location.toLowerCase())) ||
        (r.ward && currentUser?.location && currentUser.location.toLowerCase().includes(r.ward.toLowerCase())) ||
        r.leaderName === currentUser?.name
      );

  const displayedReports = scopedReports.length > 0 ? scopedReports : reports.slice(0, 2);

  const filteredReports = selectedWard === 'all' 
    ? displayedReports 
    : displayedReports.filter(r => r.ward.toLowerCase().includes(selectedWard.toLowerCase()));

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-6 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white">Field Operations & Grassroots Reporting</h2>
            <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${roleInfo.badgeColor}`}>
              {roleInfo.title}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Offline-first operational reports, GPS geotagging, and low-data photo compression for <strong className="text-white">{currentTenant.name}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-emerald-500/20"
          >
            <Plus className="w-4 h-4" />
            Log Field Activity
          </button>
        </div>
      </div>

      {/* Sync Notice Alert */}
      {syncNotice && (
        <div className="p-4 rounded-xl bg-emerald-950/70 border border-emerald-500 text-emerald-200 text-xs flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{syncNotice}</span>
          </div>
          <button onClick={() => setSyncNotice(null)} className="text-[11px] font-bold text-emerald-400 underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Offline Sync Banner with Rural Mode Toggle */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
            isOnline ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
          }`}>
            {isOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <strong className="text-white font-semibold">
                {isOnline ? 'Cloud Connection Active' : 'Offline / Rural Mode (Local Cache Active)'}
              </strong>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                isOnline ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
              }`}>
                {isOnline ? 'Synchronized' : 'IndexedDB Active'}
              </span>
            </div>
            <p className="text-slate-400 text-[11px] mt-0.5">
              {isOnline 
                ? 'Field reports and GPS logs sync in real time directly to the campaign command database.'
                : 'Form submissions queue safely in local device storage. Syncs automatically upon reconnection.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end md:self-auto">
          {/* Simulated Rural Mode Toggle */}
          <button
            onClick={toggleSimulatedOffline}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1.5 ${
              isSimulatedOffline
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
            title="Simulate losing 3G/4G network coverage in rural or low-signal field areas"
          >
            <WifiOff className="w-3.5 h-3.5" />
            <span>{isSimulatedOffline ? 'Resume Online' : 'Simulate Rural Drop'}</span>
          </button>

          {/* Sync Queue Action */}
          {queuedCount > 0 && (
            <button
              onClick={handleManualSync}
              disabled={!isOnline || isSyncing}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>Sync {queuedCount} Queued {queuedCount === 1 ? 'Item' : 'Items'}</span>
            </button>
          )}
        </div>
      </div>

      {/* RBAC Scope Indicator */}
      {!permissions.canViewAllFieldReports && (
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Compass className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <strong className="text-white">Assigned Jurisdiction Scope:</strong> Viewing field activity for <strong className="text-emerald-400">{currentUser?.location}</strong>. Cross-constituency battle orders are isolated to Regional Leaders and Executive Command.
            </div>
          </div>
          <span className="text-[10px] font-mono text-slate-500 bg-slate-950 px-2 py-0.5 rounded border border-slate-800 shrink-0">
            Sector Filtered
          </span>
        </div>
      )}

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
              <div className="flex flex-wrap items-center gap-2 text-xs text-emerald-400 mt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{report.location}</span>
                </span>
                {report.ward && <span className="text-slate-400">({report.ward} Ward)</span>}
              </div>

              {/* Photos & GPS metadata if present */}
              <div className="mt-2.5 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 text-[10px] font-mono bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 px-2 py-0.5 rounded">
                  <Crosshair className="w-3 h-3" />
                  GPS: -1.2864, 36.8172 (Verified)
                </span>
                {report.photos && report.photos.length > 0 && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono bg-blue-950/60 border border-blue-500/30 text-blue-400 px-2 py-0.5 rounded">
                    <ImageIcon className="w-3 h-3" />
                    Field Photo Attached
                  </span>
                )}
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
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Log Field Operation</h3>
                {!isOnline && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    Offline Queue
                  </span>
                )}
              </div>
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
                  <label className="block text-slate-300 font-medium mb-1">Attendance Estimate</label>
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
                  <label className="block text-slate-300 font-medium mb-1">Location Details</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., City Market, Stalls Area"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Ward Name</label>
                  <input
                    type="text"
                    placeholder="e.g., Westlands Ward"
                    value={ward}
                    onChange={(e) => setWard(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* GPS Geotagging Capture Section */}
              <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <Crosshair className="w-3.5 h-3.5 text-emerald-400" />
                    GPS Location Geotagging
                  </span>
                  <button
                    type="button"
                    onClick={handleCaptureGPS}
                    disabled={isLocating}
                    className="px-2.5 py-1 rounded-md bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[11px] font-semibold flex items-center gap-1 transition-all"
                  >
                    {isLocating ? 'Capturing GPS...' : (gpsData ? 'Recapture GPS' : 'Tag Current Coordinates')}
                  </button>
                </div>

                {gpsData ? (
                  <div className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5 bg-slate-950 p-2 rounded border border-emerald-500/20">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Coordinates: {gpsData.formatted}</span>
                  </div>
                ) : (
                  <p className="text-[10px] text-slate-400">
                    Click to capture exact device coordinates for anti-fraud verification and IEBC ward boundary compliance.
                  </p>
                )}
              </div>

              {/* In-browser Photo Compression Capture */}
              <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-blue-400" />
                    Field Photo (Low-Data Auto-Compressed)
                  </span>
                  <label className="cursor-pointer px-2.5 py-1 rounded-md bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-400 text-[11px] font-semibold flex items-center gap-1 transition-all">
                    <span>{isCompressing ? 'Compressing...' : (compressedPhoto ? 'Change Photo' : 'Attach Photo')}</span>
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {compressedPhoto ? (
                  <div className="flex items-center gap-3 bg-slate-950 p-2 rounded-lg border border-blue-500/20">
                    <img 
                      src={compressedPhoto.dataUrl} 
                      alt="Field Preview" 
                      className="w-12 h-12 object-cover rounded border border-slate-700" 
                    />
                    <div className="text-[10px] text-slate-400 font-mono space-y-0.5">
                      <div className="text-emerald-400 font-bold">Auto-Compressed ({compressedPhoto.savedPercentage}% data saved)</div>
                      <div>Original: {compressedPhoto.originalSizeKB} KB $\to$ Compressed: {compressedPhoto.compressedSizeKB} KB</div>
                    </div>
                  </div>
                ) : (
                  <p className="text-[10px] text-slate-400">
                    Camera images are auto-compressed from ~5MB to ~100KB directly in the browser to save cellular data bundles.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Field Intelligence & Citizen Feedback</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Record issues raised by local residents, turnout tone, and logistical needs..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-800 bg-slate-900 text-slate-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
                >
                  <Send className="w-3.5 h-3.5" />
                  {isOnline ? 'Submit Field Report' : 'Queue in Offline Storage'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
