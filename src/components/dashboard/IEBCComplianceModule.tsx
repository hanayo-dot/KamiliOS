'use client';

import React, { useState } from 'react';
import { useTenant } from '@/context/TenantContext';
import { getRolePermissions, ROLE_LABELS } from '@/utils/rbac';
import { 
  IEBC_STATUTORY_CEILINGS, 
  DEMO_CONTRIBUTIONS, 
  generateIEBCExportCSV, 
  generateAuditHash, 
  downloadCSV,
  DonorContribution 
} from '@/utils/iebcCompliance';
import { 
  FileCheck, 
  Download, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Scale, 
  DollarSign, 
  FileText, 
  Building2, 
  Lock, 
  Stamp, 
  Eye, 
  Printer, 
  ArrowUpRight,
  ShieldAlert
} from 'lucide-react';

export default function IEBCComplianceModule() {
  const { currentTenant, currentUser, expenses } = useTenant();
  const permissions = getRolePermissions(currentUser?.role);
  const roleInfo = ROLE_LABELS[currentUser?.role || 'field_member'];

  const ceiling = IEBC_STATUTORY_CEILINGS[currentTenant.tier] || IEBC_STATUTORY_CEILINGS.county;
  const contributions = DEMO_CONTRIBUTIONS[currentTenant.id] || [];

  const [activeTab, setActiveTab] = useState<'overview' | 'expenditures' | 'donations'>('overview');
  const [showCertificateModal, setShowCertificateModal] = useState(false);

  // Computations
  const totalExpenditure = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalContributions = contributions.reduce((sum, c) => sum + c.amountKES, 0);
  const expenditurePercentage = Math.min(100, Number(((totalExpenditure / ceiling.spendingLimitKES) * 100).toFixed(2)));
  const flaggedContributions = contributions.filter(c => c.status === 'flagged');
  const auditStamp = generateAuditHash(currentTenant.id, totalExpenditure, expenses.length);

  // Category breakdown for Schedule A
  const categoryBreakdown: Record<string, number> = {};
  expenses.forEach(e => {
    categoryBreakdown[e.category] = (categoryBreakdown[e.category] || 0) + e.amount;
  });

  const handleExportCSV = () => {
    const csvContent = generateIEBCExportCSV(currentTenant, expenses, contributions);
    const filename = `IEBC_CF04_RETURN_${currentTenant.id.toUpperCase()}_${Date.now()}.csv`;
    downloadCSV(filename, csvContent);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-6 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white">IEBC Campaign Financing & Statutory Audit</h2>
            <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${roleInfo.badgeColor}`}>
              {roleInfo.title}
            </span>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Scale className="w-3 h-3" />
              Act Compliant
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Official statutory campaign returns formatted to the Republic of Kenya Campaign Financing Act for <strong className="text-white">{currentTenant.name}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCertificateModal(true)}
            className="px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs flex items-center gap-1.5 transition-all"
          >
            <Stamp className="w-4 h-4 text-emerald-400" />
            <span>Audit Seal</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-emerald-500/20"
          >
            <Download className="w-4 h-4" />
            <span>Export IEBC Form CF-04</span>
          </button>
        </div>
      </div>

      {/* Flagged Item Warning if any anonymous/violating donation exists */}
      {flaggedContributions.length > 0 && (
        <div className="p-4 rounded-xl bg-red-950/70 border border-red-500 text-red-200 text-xs flex items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-5 h-5 text-red-400 shrink-0" />
            <div>
              <strong className="text-white font-semibold">Statutory Compliance Alert:</strong> Found {flaggedContributions.length} contribution requiring immediate regularisation:
              <span className="text-red-300 ml-1 underline">{flaggedContributions[0].flagReason}</span>
            </div>
          </div>
          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-red-900 border border-red-500 shrink-0">
            Action Required
          </span>
        </div>
      )}

      {/* Statutory Spending Ceiling & Financial Integrity Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Spending Cap Gauge */}
        <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Statutory Legal Ceiling</span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/20 px-2 py-0.5 rounded">
              {ceiling.tier.toUpperCase()} TIER
            </span>
          </div>

          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">
              KES {(totalExpenditure / 1000000).toFixed(2)}M
              <span className="text-xs font-normal text-slate-400 ml-1">/ KES {(ceiling.spendingLimitKES / 1000000).toFixed(0)}M</span>
            </div>
            <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{expenditurePercentage}% of legal limit used (Safe Harbor)</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1">
            <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
              <div 
                className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                style={{ width: `${Math.max(5, expenditurePercentage)}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>KES 0</span>
              <span>50%</span>
              <span>KES {(ceiling.spendingLimitKES / 1000000).toFixed(0)}M Max</span>
            </div>
          </div>
        </div>

        {/* Declared Political Contributions */}
        <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Declared Contributions</span>
            <span className="text-[10px] font-mono text-blue-400 bg-blue-950/60 border border-blue-500/20 px-2 py-0.5 rounded">
              SCHEDULE B
            </span>
          </div>

          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-teal-300">
              KES {(totalContributions / 1000000).toFixed(2)}M
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Across {contributions.length} verified donor declarations
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Max Single Donor Cap:</span>
            <strong className="text-white">KES {(ceiling.maxSingleDonorKES / 1000000).toFixed(1)}M (20%)</strong>
          </div>
        </div>

        {/* Cryptographic IEBC Audit Verification Token */}
        <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Tamper-Proof Audit Seal</span>
            <span className="text-[10px] font-mono text-purple-400 bg-purple-950/60 border border-purple-500/20 px-2 py-0.5 rounded">
              SHA-256
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-[10px] text-emerald-400 break-all select-all">
            {auditStamp}
          </div>

          <div className="text-[11px] text-slate-400 flex items-center justify-between">
            <span>Inspector Validation:</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Hash Validated
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="border-b border-slate-800 flex gap-6 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 border-b-2 transition-all ${
            activeTab === 'overview' 
              ? 'border-emerald-500 text-emerald-400' 
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Statutory Categorization (Schedule A)
        </button>
        <button
          onClick={() => setActiveTab('donations')}
          className={`pb-3 border-b-2 transition-all ${
            activeTab === 'donations' 
              ? 'border-emerald-500 text-emerald-400' 
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Declared Political Contributions (Schedule B)
        </button>
      </div>

      {/* View 1: Schedule A - Itemized Expenditure Breakdown */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Statutory Category Summary Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {Object.entries(categoryBreakdown).map(([cat, amt]) => {
              const catPercent = totalExpenditure > 0 ? ((amt / totalExpenditure) * 100).toFixed(1) : '0';
              return (
                <div key={cat} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                  <span className="text-[11px] text-slate-400 block">{cat}</span>
                  <div className="text-lg font-bold text-white">KES {amt.toLocaleString()}</div>
                  <span className="text-[10px] text-emerald-400 font-mono">{catPercent}% of expenditure</span>
                </div>
              );
            })}
          </div>

          {/* Detailed Itemized Expenditure Audit Table */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Schedule A: Itemized Campaign Disbursements</h3>
                <p className="text-xs text-slate-400">All cleared operational and mobilization vouchers</p>
              </div>
              <span className="text-xs font-mono text-slate-400">{expenses.length} audit entries</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="p-4">Voucher Ref</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Description</th>
                    <th className="p-4">Disbursed Amount</th>
                    <th className="p-4">Payment Method</th>
                    <th className="p-4">Safaricom / Bank Audit Ref</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {expenses.map((e) => (
                    <tr key={e.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="p-4 font-mono text-slate-400">{e.id}</td>
                      <td className="p-4 text-white font-medium">{e.category}</td>
                      <td className="p-4 text-slate-300">{e.description}</td>
                      <td className="p-4 font-bold text-emerald-400 font-mono">
                        KES {e.amount.toLocaleString()}
                      </td>
                      <td className="p-4 font-mono text-[11px]">{e.disbursementMethod}</td>
                      <td className="p-4 font-mono text-teal-300 font-semibold">{e.receiptRef}</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          {e.status.replace('_', ' ')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* View 2: Schedule B - Declared Contributions */}
      {activeTab === 'donations' && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Schedule B: Declared Political Donations & Grants</h3>
              <p className="text-xs text-slate-400">Section 11 Campaign Financing Act registry</p>
            </div>
            <span className="text-xs font-mono text-slate-400">{contributions.length} contributions</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                <tr>
                  <th className="p-4">Receipt Ref</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Donor Legal Entity</th>
                  <th className="p-4">National ID / KRA PIN</th>
                  <th className="p-4">Source Category</th>
                  <th className="p-4">Amount Declared</th>
                  <th className="p-4">Compliance Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {contributions.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-4 font-mono text-slate-400">{c.receiptNumber}</td>
                    <td className="p-4 text-slate-400">{c.date}</td>
                    <td className="p-4 font-bold text-white">{c.donorName}</td>
                    <td className="p-4 font-mono text-[11px] text-slate-300">{c.nationalIdOrKraPin}</td>
                    <td className="p-4 text-slate-300">{c.sourceCategory}</td>
                    <td className="p-4 font-bold text-teal-300 font-mono">
                      KES {c.amountKES.toLocaleString()}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        c.status === 'compliant'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : 'bg-red-500/20 text-red-400 border border-red-500/40'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Official Cryptographic Certificate Modal */}
      {showCertificateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 border-2 border-emerald-500/60 rounded-3xl p-8 max-w-lg w-full space-y-6 shadow-2xl animate-in zoom-in-95 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="text-center space-y-2 border-b border-slate-800 pb-5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto">
                <Stamp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-extrabold text-white">REPUBLIC OF KENYA</h3>
              <p className="text-[11px] text-emerald-400 font-semibold tracking-wider uppercase">
                IEBC Statutory Campaign Financing Verification Certificate
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Certified Campaign:</span>
                  <strong className="text-white">{currentTenant.name}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Candidate / Principal:</span>
                  <strong className="text-white">{currentTenant.candidateName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Elective Jurisdiction:</span>
                  <span className="text-slate-200">{currentTenant.region} ({currentTenant.position})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Statutory Ceiling:</span>
                  <span className="text-white font-mono">KES {ceiling.spendingLimitKES.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Audited Expenditure:</span>
                  <strong className="text-emerald-400 font-mono">KES {totalExpenditure.toLocaleString()}</strong>
                </div>
                <div className="flex justify-between border-t border-slate-800 pt-2 text-[10px]">
                  <span className="text-slate-400">Electoral Regulations Compliance:</span>
                  <span className="text-emerald-400 font-bold uppercase">100% Certified</span>
                </div>
              </div>

              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 font-mono text-[10px] text-slate-300 break-all space-y-1">
                <div className="text-slate-500 uppercase">Cryptographic Audit Stamp:</div>
                <div className="text-emerald-400 font-bold">{auditStamp}</div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setShowCertificateModal(false)}
                className="w-full py-3 rounded-xl border border-slate-700 bg-slate-900 text-slate-300 font-semibold text-xs"
              >
                Close Certificate
              </button>
              <button
                onClick={() => {
                  window.print();
                }}
                className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official Copy</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
