'use client';

import React, { useState } from 'react';
import { useTenant } from '@/context/TenantContext';
import { getRolePermissions, ROLE_LABELS } from '@/utils/rbac';
import { executeB2CDisbursement, B2CPaymentResponse, normalizeKenyanPhone } from '@/utils/kenyanGateways';
import { CampaignExpense } from '@/types/campaign';
import { 
  DollarSign, 
  Plus, 
  Send, 
  CheckCircle, 
  Clock, 
  FileText, 
  Download,
  AlertCircle,
  Receipt,
  Lock,
  ShieldCheck,
  ShieldAlert,
  Smartphone,
  CheckCircle2,
  Zap,
  ArrowRight
} from 'lucide-react';

export default function FinanceModule() {
  const { currentTenant, currentUser, expenses, addExpense, updateExpenseStatus } = useTenant();
  const permissions = getRolePermissions(currentUser?.role);
  const roleInfo = ROLE_LABELS[currentUser?.role || 'field_member'];

  const [showModal, setShowModal] = useState(false);
  const [b2cTargetExpense, setB2cTargetExpense] = useState<CampaignExpense | null>(null);
  const [b2cPhone, setB2cPhone] = useState('+254 722 000 111');
  const [isDisbursing, setIsDisbursing] = useState(false);
  const [b2cSuccessResult, setB2cSuccessResult] = useState<B2CPaymentResponse | null>(null);

  // Form states
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<'Logistics & Transport' | 'Event Venues' | 'Merchandise & Branding' | 'Field Stipends' | 'Media & Comms' | 'Security'>('Field Stipends');
  const [method, setMethod] = useState<'M-Pesa B2C' | 'Bank Transfer' | 'Petty Cash Float'>('M-Pesa B2C');
  const [receiptRef, setReceiptRef] = useState('');

  // RBAC Data Slicing: Non-finance/executive roles only see their own submitted vouchers
  const visibleExpenses = permissions.canViewFullFinancialLedger
    ? expenses
    : expenses.filter(e => e.submittedBy === currentUser?.name || e.submittingRole === currentUser?.role);

  const totalSpent = visibleExpenses
    .filter(e => e.status === 'candidate_approved' || e.status === 'disbursed')
    .reduce((sum, e) => sum + e.amount, 0);

  const pendingAmount = visibleExpenses
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

  const handleOpenB2C = (expense: CampaignExpense) => {
    setB2cTargetExpense(expense);
    setB2cPhone(expense.beneficiaryPhone || '+254 722 000 111');
    setB2cSuccessResult(null);
  };

  const handleExecuteB2C = async () => {
    if (!b2cTargetExpense) return;
    setIsDisbursing(true);
    try {
      const response = await executeB2CDisbursement({
        phone: b2cPhone,
        amount: b2cTargetExpense.amount,
        commandID: 'BusinessPayment',
        remarks: `KamiliOS Allowance: ${b2cTargetExpense.description.slice(0, 25)}`,
        occasion: 'FieldMobilization',
        tenantId: currentTenant.id,
      });

      setB2cSuccessResult(response);
      // Update expense status to disbursed in state with actual M-Pesa Transaction ID
      updateExpenseStatus(b2cTargetExpense.id, 'disbursed', response.transactionId);
    } catch (err) {
      console.error('Failed to disburse B2C', err);
    } finally {
      setIsDisbursing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-6 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white">Campaign Finance & Petty Cash Floats</h2>
            <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${roleInfo.badgeColor}`}>
              {roleInfo.title}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time expenditure tracking, Safaricom Daraja M-Pesa B2C disbursements, and statutory audit compliance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {permissions.canViewIEBCAudit && (
            <button
              onClick={() => alert('IEBC Statutory Campaign Financing Return exported as audit-ready PDF/CSV')}
              className="px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs flex items-center gap-2"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              IEBC Audit Export
            </button>
          )}
          {permissions.canSubmitExpenseClaim && (
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-emerald-500/20"
            >
              <Plus className="w-4 h-4" />
              Submit Expense Voucher
            </button>
          )}
        </div>
      </div>

      {/* RBAC Notice for Restricted Views */}
      {!permissions.canViewFullFinancialLedger && (
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <strong className="text-white">Field Requisitions Scope:</strong> As <strong className="text-emerald-400">{roleInfo.title}</strong>, you have access to your personal expense claims and float requisitions. The consolidated campaign treasury ledger is isolated to Finance and Executive command.
            </div>
          </div>
          <span className="text-[10px] font-mono text-slate-500 bg-slate-950 px-2 py-0.5 rounded border border-slate-800 shrink-0">
            Ledger Isolated
          </span>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800">
          <span className="text-xs text-slate-400 font-medium">
            {permissions.canViewFullFinancialLedger ? 'Approved & Disbursed' : 'My Approved Claims'}
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
            KES {totalSpent.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-400 mt-1">
            {permissions.canViewFullFinancialLedger ? 'Cleared by candidate & finance' : 'Disbursed to your mobile float'}
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800">
          <span className="text-xs text-slate-400 font-medium">
            {permissions.canViewFullFinancialLedger ? 'Pending Candidate Sign-Off' : 'My Pending Claims'}
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 mt-2">
            KES {pendingAmount.toLocaleString()}
          </div>
          <div className="text-[11px] text-amber-400/80 mt-1">
            {permissions.canViewFullFinancialLedger ? 'Awaiting approval before release' : 'Under treasury verification'}
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Daraja M-Pesa B2C Float</span>
            <span className="text-[10px] font-mono bg-emerald-950/60 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30">
              API Active
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-teal-300 mt-2">
            KES 817,500
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5">
            <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
            <span>Shortcode 600000 (Bulk Disbursement)</span>
          </div>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">
            {permissions.canViewFullFinancialLedger ? 'Recorded Campaign Expenditures' : 'My Submitted Expense Vouchers'}
          </h3>
          <span className="text-xs text-slate-400">{visibleExpenses.length} records</span>
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
                <th className="p-4">M-Pesa / Receipt Ref</th>
                <th className="p-4">Status & Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {visibleExpenses.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    No expense vouchers filed yet under your account. Click "Submit Expense Voucher" above to request a field stipend or operational refund.
                  </td>
                </tr>
              ) : (
                visibleExpenses.map((expense) => {
                  const canDisburse = 
                    (permissions.canVetExpenses || permissions.canApproveDisbursements) && 
                    expense.status === 'candidate_approved';

                  return (
                    <tr key={expense.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="p-4 font-semibold text-white">{expense.description}</td>
                      <td className="p-4 text-slate-300">{expense.category}</td>
                      <td className="p-4 font-bold text-emerald-400">
                        KES {expense.amount.toLocaleString()}
                      </td>
                      <td className="p-4 font-mono text-[11px] flex items-center gap-1.5 pt-5">
                        <Smartphone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{expense.disbursementMethod}</span>
                      </td>
                      <td className="p-4">
                        <div>{expense.submittedBy}</div>
                        <div className="text-[10px] text-slate-500 capitalize">{expense.submittingRole.replace('_', ' ')}</div>
                      </td>
                      <td className="p-4 font-mono text-slate-300">
                        <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 font-semibold text-emerald-400">
                          {expense.receiptRef}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            expense.status === 'disbursed'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                              : expense.status === 'candidate_approved'
                              ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                          }`}>
                            {expense.status.replace('_', ' ')}
                          </span>

                          {/* 1-Click Safaricom M-Pesa Daraja B2C Disbursement Trigger */}
                          {canDisburse && (
                            <button
                              onClick={() => handleOpenB2C(expense)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-[10px] flex items-center gap-1 shadow-md shadow-emerald-500/20 transition-all shrink-0"
                            >
                              <Zap className="w-3 h-3 fill-current" />
                              Pay via B2C
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* M-Pesa Daraja B2C Disbursement Modal */}
      {b2cTargetExpense && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-emerald-500/40 rounded-2xl p-6 max-w-md w-full space-y-5 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Safaricom Daraja B2C Payout</h3>
                  <span className="text-[10px] text-slate-400 font-mono">Bulk Disbursement Engine</span>
                </div>
              </div>
              <button 
                onClick={() => setB2cTargetExpense(null)} 
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                Close
              </button>
            </div>

            {b2cSuccessResult ? (
              <div className="space-y-4 py-2 text-center animate-in fade-in">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center text-emerald-400 mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">M-Pesa B2C Payment Disbursed!</h4>
                  <p className="text-xs text-slate-400 mt-1">Funds deposited immediately to agent's Safaricom wallet.</p>
                </div>

                <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 font-mono text-xs text-left space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-400">M-Pesa Code:</span>
                    <strong className="text-emerald-400">{b2cSuccessResult.transactionId}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Amount Sent:</span>
                    <strong className="text-white">KES {b2cSuccessResult.amount.toLocaleString()}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Recipient Phone:</span>
                    <span className="text-slate-200">{b2cSuccessResult.recipientPhone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Safaricom Fee:</span>
                    <span className="text-slate-400">KES {b2cSuccessResult.serviceChargeKES}</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-800 pt-1 mt-1">
                    <span className="text-slate-400">Remaining Campaign Float:</span>
                    <span className="text-teal-300">KES {b2cSuccessResult.remainingFloatKES.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  onClick={() => setB2cTargetExpense(null)}
                  className="w-full py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
                >
                  Return to Ledger
                </button>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                  <div className="text-slate-400 text-[11px]">Expense Target:</div>
                  <div className="text-white font-bold">{b2cTargetExpense.description}</div>
                  <div className="text-emerald-400 font-extrabold text-sm">
                    Disbursement: KES {b2cTargetExpense.amount.toLocaleString()}
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Beneficiary Safaricom Phone Number</label>
                  <input
                    type="text"
                    value={b2cPhone}
                    onChange={(e) => setB2cPhone(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">Recipient must be a registered M-Pesa subscriber.</span>
                </div>

                <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 space-y-1 text-[11px]">
                  <div className="flex justify-between text-slate-400">
                    <span>Disbursement Amount:</span>
                    <span className="text-white font-bold">KES {b2cTargetExpense.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Safaricom B2C Tariff Fee:</span>
                    <span className="text-slate-300">KES {b2cTargetExpense.amount <= 1000 ? '15.00' : '23.00'}</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-800 pt-1 text-slate-300">
                    <span>Total Deducted from Shortcode:</span>
                    <span className="text-emerald-400 font-bold">
                      KES {(b2cTargetExpense.amount + (b2cTargetExpense.amount <= 1000 ? 15 : 23)).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setB2cTargetExpense(null)}
                    className="px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-900 text-slate-300 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleExecuteB2C}
                    disabled={isDisbursing}
                    className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
                  >
                    <Zap className="w-3.5 h-3.5 fill-current" />
                    <span>{isDisbursing ? 'Connecting to Safaricom...' : 'Authorize B2C Release'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal: New Expense Requisition */}
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
                    <option value="Media & Comms">Media & Comms</option>
                    <option value="Security">Security</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Payment Method</label>
                  <select
                    value={method}
                    onChange={(e: any) => setMethod(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none"
                  >
                    <option value="M-Pesa B2C">M-Pesa B2C</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Petty Cash Float">Petty Cash Float</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Receipt Reference</label>
                  <input
                    type="text"
                    placeholder="Auto or e.g. VOUCH-01"
                    value={receiptRef}
                    onChange={(e) => setReceiptRef(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none font-mono"
                  />
                </div>
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
                  className="px-5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold"
                >
                  Submit for Candidate Sign-Off
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
