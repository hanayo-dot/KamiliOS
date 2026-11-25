'use client';

import React, { useState } from 'react';
import { useTenant } from '@/context/TenantContext';
import { 
  DollarSign, 
  Plus, 
  Send, 
  CheckCircle, 
  Clock, 
  FileText, 
  Download,
  AlertCircle,
  Receipt
} from 'lucide-react';

export default function FinanceModule() {
  const { currentTenant, currentUser, expenses, addExpense } = useTenant();
  const [showModal, setShowModal] = useState(false);

  // Form
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<'Logistics & Transport' | 'Event Venues' | 'Merchandise & Branding' | 'Field Stipends' | 'Media & Comms' | 'Security'>('Field Stipends');
  const [method, setMethod] = useState<'M-Pesa B2C' | 'Bank Transfer' | 'Petty Cash Float'>('M-Pesa B2C');
  const [receiptRef, setReceiptRef] = useState('');

  const totalSpent = expenses
    .filter(e => e.status === 'candidate_approved' || e.status === 'disbursed')
    .reduce((sum, e) => sum + e.amount, 0);

  const pendingAmount = expenses
    .filter(e => e.status === 'pending' || e.status === 'finance_approved')
    .reduce((sum, e) => sum + e.amount, 0);

  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount) return;

    addExpense({
      description,
      amount: Number(amount),
      currency: 'KES',
      category,
      submittedBy: currentUser?.name || 'Campaign Staff',
      submittingRole: currentUser?.role || 'field_member',
      date: 'Today',
      status: 'pending',
      receiptRef: receiptRef || `VOUCH-${Date.now().toString().slice(-4)}`,
      disbursementMethod: method,
    });

    setShowModal(false);
    setDescription('');
    setAmount('');
    setReceiptRef('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-6 rounded-2xl">
        <div>
          <h2 className="text-xl font-bold text-white">Campaign Finance & Petty Cash Floats</h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time expenditure tracking, M-Pesa field stipends, and statutory audit compliance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => alert('IEBC Campaign Financing Return exported as PDF')}
            className="px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs flex items-center gap-2"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            IEBC Audit Export
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-emerald-500/20"
          >
            <Plus className="w-4 h-4" />
            Submit Expense Voucher
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800">
          <span className="text-xs text-slate-400 font-medium">Approved & Disbursed</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
            KES {totalSpent.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-400 mt-1">Cleared by candidate & finance</div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800">
          <span className="text-xs text-slate-400 font-medium">Pending Candidate Sign-Off</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 mt-2">
            KES {pendingAmount.toLocaleString()}
          </div>
          <div className="text-[11px] text-amber-400/80 mt-1">Awaiting approval before release</div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800">
          <span className="text-xs text-slate-400 font-medium">Primary Payout Gateway</span>
          <div className="text-lg font-bold text-teal-300 mt-2 flex items-center gap-2">
            <span>Safaricom Daraja (M-Pesa B2C)</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Sub-second float top-up to ward marshals</div>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">Recorded Campaign Expenditures</h3>
          <span className="text-xs text-slate-400">{expenses.length} records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-4">Description</th>
                <th className="p-4">Category</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Disbursement Method</th>
                <th className="p-4">Submitted By</th>
                <th className="p-4">Receipt Ref</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {expenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-4 font-semibold text-white">{expense.description}</td>
                  <td className="p-4 text-slate-300">{expense.category}</td>
                  <td className="p-4 font-bold text-emerald-400">
                    KES {expense.amount.toLocaleString()}
                  </td>
                  <td className="p-4 font-mono text-[11px]">{expense.disbursementMethod}</td>
                  <td className="p-4">
                    <div>{expense.submittedBy}</div>
                    <div className="text-[10px] text-slate-500 capitalize">{expense.submittingRole.replace('_', ' ')}</div>
                  </td>
                  <td className="p-4 font-mono text-slate-400">{expense.receiptRef}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      expense.status === 'candidate_approved' || expense.status === 'disbursed'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : expense.status === 'pending'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        : 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                    }`}>
                      {expense.status.replace('_', ' ')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Submit Expense Requisition</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white text-xs">
                Cancel
              </button>
            </div>

            <form onSubmit={handleCreateExpense} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Expense Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Boda Boda Fuel Marshals - Kawangware"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Amount (KES)</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 45000"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e: any) => setCategory(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none"
                  >
                    <option value="Field Stipends">Field Stipends</option>
                    <option value="Logistics & Transport">Logistics & Transport</option>
                    <option value="Event Venues">Event Venues</option>
                    <option value="Merchandise & Branding">Merchandise & Branding</option>
                    <option value="Security">Security</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Disbursement Channel</label>
                  <select
                    value={method}
                    onChange={(e: any) => setMethod(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none"
                  >
                    <option value="M-Pesa B2C">M-Pesa B2C</option>
                    <option value="Petty Cash Float">Petty Cash Float</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Receipt / Invoice Ref</label>
                  <input
                    type="text"
                    placeholder="e.g. RCP-8839"
                    value={receiptRef}
                    onChange={(e) => setReceiptRef(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs"
              >
                Submit for Candidate & Finance Review
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
