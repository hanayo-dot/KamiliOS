'use client';

import React, { useState } from 'react';
import { useTenant } from '@/context/TenantContext';
import { getRolePermissions, ROLE_LABELS } from '@/utils/rbac';
import { 
  CAMPAIGN_SMS_TARGETS, 
  sendCampaignBulkSMS, 
  SMSDispatchResult, 
  handleUSSDRequest, 
  USSDSessionState 
} from '@/utils/kenyanGateways';
import { 
  MessageSquare, 
  Send, 
  Phone, 
  Smartphone, 
  CheckCircle2, 
  Radio, 
  DollarSign, 
  Users, 
  Clock, 
  Layers, 
  Sparkles,
  RefreshCw,
  Hash
} from 'lucide-react';

export default function CommunicationsModule() {
  const { currentTenant, currentUser } = useTenant();
  const permissions = getRolePermissions(currentUser?.role);
  const roleInfo = ROLE_LABELS[currentUser?.role || 'field_member'];

  // SMS Dispatcher State
  const [selectedTargetId, setSelectedTargetId] = useState('all_ward_leads');
  const [senderId, setSenderId] = useState('KAMILI_CMD');
  const [messageText, setMessageText] = useState(
    'ATTENTION TEAM: Central rally moved to Uhuru Park Pavilion at 2:00 PM. Please marshal all youth stewards and confirm arrival on USSD *384*27#.'
  );
  const [isSendingSMS, setIsSendingSMS] = useState(false);
  const [smsHistory, setSmsHistory] = useState<SMSDispatchResult[]>([
    {
      messageId: 'ATX_98214',
      senderId: 'SAKAJA2027',
      recipientCount: 85,
      segmentsPerRecipient: 1,
      totalCostKES: 68.00,
      status: 'Sent',
      dispatchedAt: '08:15 AM',
      recipientsPreview: 'All 85 Ward Coordinators',
    },
    {
      messageId: 'ATX_98102',
      senderId: 'KAMILI_CMD',
      recipientCount: 17,
      segmentsPerRecipient: 1,
      totalCostKES: 13.60,
      status: 'Sent',
      dispatchedAt: 'Yesterday',
      recipientsPreview: '17 Constituency Campaign Directors',
    }
  ]);
  const [smsNotice, setSmsNotice] = useState<string | null>(null);

  // USSD Simulator State
  const [ussdInput, setUssdInput] = useState('*384*27#');
  const [ussdSessionActive, setUssdSessionActive] = useState(false);
  const [ussdScreenText, setUssdScreenText] = useState<string>('Dial *384*27# to initiate field USSD session.');
  const [ussdSessionHistory, setUssdSessionHistory] = useState<string[]>([]);
  const [ussdKeyInput, setUssdKeyInput] = useState('');

  // Calculations for SMS
  const activeTarget = CAMPAIGN_SMS_TARGETS.find(t => t.id === selectedTargetId) || CAMPAIGN_SMS_TARGETS[0];
  const charCount = messageText.length;
  const segments = Math.max(1, Math.ceil(charCount / 160));
  const estimatedCostKES = (activeTarget.recipientCount * segments * 0.80).toFixed(2);

  const handleSendSMS = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    setIsSendingSMS(true);
    try {
      const result = await sendCampaignBulkSMS(
        activeTarget.label,
        activeTarget.recipientCount,
        messageText,
        senderId
      );

      setSmsHistory(prev => [result, ...prev]);
      setSmsNotice(`Bulk SMS broadcast successfully queued to ${result.recipientCount} field personnel via Africa's Talking!`);
      setTimeout(() => setSmsNotice(null), 5000);
    } catch (err) {
      console.error('Failed to send SMS', err);
    } finally {
      setIsSendingSMS(false);
    }
  };

  // USSD Simulator Handlers
  const handleStartUSSD = () => {
    if (ussdInput.trim() !== '*384*27#') {
      setUssdScreenText('Error: Invalid USSD Service Code. Dial *384*27#.');
      return;
    }
    setUssdSessionActive(true);
    setUssdSessionHistory([]);
    setUssdKeyInput('');
    const res = handleUSSDRequest({
      sessionId: `USSD_${Date.now()}`,
      serviceCode: '*384*27#',
      phoneNumber: '+254722000111',
      text: '',
    }, currentTenant.candidateName);
    setUssdScreenText(res.message);
  };

  const handleSendUSSDReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ussdSessionActive || !ussdKeyInput) return;

    const newHistory = [...ussdSessionHistory, ussdKeyInput];
    setUssdSessionHistory(newHistory);
    const fullText = newHistory.join('*');

    const res = handleUSSDRequest({
      sessionId: `USSD_ACTIVE`,
      serviceCode: '*384*27#',
      phoneNumber: '+254722000111',
      text: fullText,
    }, currentTenant.candidateName);

    setUssdScreenText(res.message);
    setUssdKeyInput('');

    if (res.type === 'END') {
      setUssdSessionActive(false);
    }
  };

  const handleResetUSSD = () => {
    setUssdSessionActive(false);
    setUssdSessionHistory([]);
    setUssdKeyInput('');
    setUssdScreenText('Dial *384*27# to initiate field USSD session.');
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-6 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white">War Room Communications & Field USSD</h2>
            <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${roleInfo.badgeColor}`}>
              {roleInfo.title}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Alphanumeric bulk SMS dispatch via Africa's Talking and feature phone (*Kabambe*) USSD session gateway for <strong className="text-white">{currentTenant.name}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            AT Gateway Ready
          </span>
        </div>
      </div>

      {smsNotice && (
        <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500 text-emerald-200 text-xs flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{smsNotice}</span>
          </div>
          <button onClick={() => setSmsNotice(null)} className="text-[11px] font-bold text-emerald-400 underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Main Grid: Left = Bulk SMS Dispatcher, Right = USSD Kabambe Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Alphanumeric Bulk SMS Dispatcher (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                  Alphanumeric Bulk SMS Dispatcher
                </h3>
                <p className="text-xs text-slate-400">Broadcast instant battle orders directly to all registered agents</p>
              </div>
              <span className="text-xs font-mono text-slate-400">Rate: KES 0.80 / SMS</span>
            </div>

            <form onSubmit={handleSendSMS} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Target Personnel Cadre</label>
                  <select
                    value={selectedTargetId}
                    onChange={(e) => setSelectedTargetId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
                  >
                    {CAMPAIGN_SMS_TARGETS.map(t => (
                      <option key={t.id} value={t.id}>
                        {t.label} ({t.recipientCount} Recipients)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Branded Sender ID</label>
                  <input
                    type="text"
                    value={senderId}
                    onChange={(e) => setSenderId(e.target.value.toUpperCase().slice(0, 11))}
                    maxLength={11}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white font-mono uppercase focus:outline-none focus:border-emerald-500"
                    placeholder="e.g. KAMILI_CMD"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">Max 11 chars alphanumeric (CA registered)</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-300 font-medium">Broadcast Message</label>
                  <span className={`text-[11px] font-mono ${charCount > 160 ? 'text-amber-400' : 'text-slate-400'}`}>
                    {charCount} / 160 chars ({segments} {segments === 1 ? 'segment' : 'segments'})
                  </span>
                </div>
                <textarea
                  rows={4}
                  required
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500 resize-none font-sans leading-relaxed"
                />
              </div>

              {/* Cost & Delivery Estimation Card */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-slate-400">Estimated Gateway Cost:</div>
                  <div className="text-base font-extrabold text-emerald-400 font-mono">
                    KES {estimatedCostKES}
                  </div>
                </div>
                <div className="text-right text-[11px] text-slate-400">
                  <div>Recipients: <strong className="text-white">{activeTarget.recipientCount}</strong></div>
                  <div>Carrier Delivery: <strong className="text-teal-300">Safaricom & Airtel</strong></div>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isSendingSMS || !messageText.trim()}
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
                >
                  <Send className={`w-4 h-4 ${isSendingSMS ? 'animate-bounce' : ''}`} />
                  <span>{isSendingSMS ? 'Broadcasting via Africa\'s Talking...' : `Dispatch SMS to ${activeTarget.recipientCount} Agents`}</span>
                </button>
              </div>
            </form>
          </div>

          {/* SMS Broadcast History */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Recent SMS Broadcast Log</h3>
              <span className="text-xs text-slate-400">{smsHistory.length} broadcasts</span>
            </div>

            <div className="divide-y divide-slate-800/80">
              {smsHistory.map((item) => (
                <div key={item.messageId} className="p-4 flex items-center justify-between gap-4 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{item.recipientsPreview}</span>
                      <span className="px-1.5 py-0.2 rounded font-mono text-[10px] bg-emerald-950/60 border border-emerald-500/30 text-emerald-400">
                        {item.senderId}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {item.recipientCount} delivered • {item.segmentsPerRecipient} SMS segment • {item.dispatchedAt}
                    </div>
                  </div>
                  <div className="text-right font-mono shrink-0">
                    <div className="text-emerald-400 font-bold">KES {item.totalCostKES.toFixed(2)}</div>
                    <span className="text-[10px] text-emerald-500 uppercase">{item.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Feature Phone ("Kabambe") USSD Simulator (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-teal-400" />
                  Feature Phone USSD Simulator
                </h3>
                <p className="text-xs text-slate-400">Test how grassroots agents with basic *kabambe* phones interact with KamiliOS</p>
              </div>
              <button 
                onClick={handleResetUSSD}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                title="Reset USSD session"
              >
                <RefreshCw className="w-3 h-3" />
                Reset
              </button>
            </div>

            {/* Visual Phone Casing */}
            <div className="mx-auto max-w-[280px] bg-slate-950 border-4 border-slate-800 rounded-[36px] p-5 shadow-2xl shadow-emerald-500/5 space-y-4">
              {/* Speaker & Earpiece */}
              <div className="w-12 h-1.5 bg-slate-800 rounded-full mx-auto" />

              {/* LCD Screen (Nokia/Kabambe Style) */}
              <div className="bg-[#1b2b23] border-2 border-[#2b4237] rounded-xl p-4 min-h-[190px] flex flex-col justify-between font-mono text-[11px] text-[#4ade80] shadow-inner select-none">
                <div className="flex justify-between text-[9px] text-[#34d399]/70 border-b border-[#2b4237] pb-1">
                  <span>SAFARICOM</span>
                  <span>4/4 G</span>
                </div>

                <div className="py-2 text-left whitespace-pre-line leading-relaxed overflow-y-auto max-h-[140px]">
                  {ussdScreenText}
                </div>

                <div className="text-[9px] text-right text-[#34d399]/60 border-t border-[#2b4237] pt-1">
                  {ussdSessionActive ? 'CON (Session Live)' : 'IDLE'}
                </div>
              </div>

              {/* Input & Dial Bar */}
              {!ussdSessionActive ? (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={ussdInput}
                      onChange={(e) => setUssdInput(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-center text-xs text-white font-mono tracking-wider focus:outline-none"
                    />
                    <button
                      onClick={handleStartUSSD}
                      className="px-3 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs"
                    >
                      Call
                    </button>
                  </div>
                  <span className="text-[10px] text-slate-500 text-center block">Dial code: *384*27#</span>
                </div>
              ) : (
                <form onSubmit={handleSendUSSDReply} className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      autoFocus
                      placeholder="Type option (e.g. 1)..."
                      value={ussdKeyInput}
                      onChange={(e) => setUssdKeyInput(e.target.value)}
                      className="w-full bg-slate-900 border border-emerald-500/50 rounded-lg p-2 text-center text-xs text-white font-mono focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="px-3 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs"
                    >
                      Send
                    </button>
                  </div>
                </form>
              )}

              {/* Hardware Keypad Simulation */}
              <div className="grid grid-cols-3 gap-2 pt-2 text-center">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      if (!ussdSessionActive) {
                        setUssdInput(prev => prev + key);
                      } else {
                        setUssdKeyInput(prev => prev + key);
                      }
                    }}
                    className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-200 active:scale-95 transition-all shadow-sm"
                  >
                    {key}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
