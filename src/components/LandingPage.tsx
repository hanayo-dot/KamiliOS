'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Lock, 
  Database, 
  CheckCircle2, 
  ChevronRight, 
  Zap, 
  Users, 
  MapPin, 
  DollarSign, 
  FileText, 
  Radio, 
  BarChart3, 
  HelpCircle,
  KeyRound,
  EyeOff,
  Flame,
  ArrowRight
} from 'lucide-react';

export default function LandingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'campaign'>('campaign');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-slate-950 font-sans">
      {/* Header Navigation */}
      <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <ShieldCheck className="h-6 w-6 text-slate-950" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                Kamili<span className="text-emerald-400">OS</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                  Enterprise
                </span>
              </span>
              <p className="text-[11px] text-slate-400 font-medium">Political Campaign Command Operating System</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-emerald-400 transition-colors">Capabilities</a>
            <a href="#security" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              Air-Gap Security
            </a>
            <a href="#pricing" className="hover:text-emerald-400 transition-colors">Pricing & Tiers</a>
            <a href="#compliance" className="hover:text-emerald-400 transition-colors">Data Privacy</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/app"
              className="hidden sm:inline-flex items-center justify-center text-xs font-semibold text-slate-300 hover:text-white px-4 py-2.5 rounded-lg border border-slate-800 hover:border-slate-700 transition-all"
            >
              Sign In to Command Portal
            </Link>
            <Link
              href="/app"
              className="inline-flex items-center justify-center gap-2 text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-4 py-2.5 rounded-lg transition-all shadow-md shadow-emerald-500/20 font-bold"
            >
              Launch Live Demo
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-28 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-emerald-500/10 blur-[130px] pointer-events-none rounded-full" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[300px] bg-blue-600/10 blur-[140px] pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/40 text-emerald-400 text-xs font-semibold mb-8 backdrop-blur-sm animate-pulse">
            <Lock className="w-3.5 h-3.5" />
            Zero-Leak Guarantee: Isolated Database Per Campaign
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1] max-w-4xl mx-auto">
            One Campaign. One Command Centre.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">
              Complete Visibility.
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Eliminate WhatsApp chaos, phantom field expenses, and lost intelligence. 
            KamiliOS gives candidates, campaign directors, and field coordinators a single, cryptographic digital operating system to run winning campaigns.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/app"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-base transition-all shadow-xl shadow-emerald-500/25"
            >
              Enter Executive Portal
              <ChevronRight className="w-5 h-5" />
            </Link>
            <a
              href="#security"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-slate-300 font-semibold text-base transition-all"
            >
              <Database className="w-4 h-4 text-emerald-400" />
              Review Data Isolation Model
            </a>
          </div>

          {/* Trust stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto border-t border-slate-800/80 pt-8 text-left">
            <div>
              <div className="text-2xl font-bold text-white">100% Isolated</div>
              <div className="text-xs text-slate-400 mt-1">Independent cryptographic key per politician</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-400">&lt; 30 Seconds</div>
              <div className="text-xs text-slate-400 mt-1">Candidate morning situational overview</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">Full Offline Sync</div>
              <div className="text-xs text-slate-400 mt-1">Field reports queue without cellular coverage</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-teal-300">ODPC Compliant</div>
              <div className="text-xs text-slate-400 mt-1">Kenya Data Protection Act 2019 Certified</div>
            </div>
          </div>
        </div>
      </section>

      {/* Security Architecture & Anti-Mixing Guarantee */}
      <section id="security" className="py-24 bg-slate-900/40 border-y border-slate-800/80 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-3">
              <ShieldCheck className="w-4 h-4" />
              Rigorous Separation of Powers & Data
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Why Rival Candidates Can Safely Use KamiliOS on the Same Platform
            </h2>
            <p className="mt-4 text-slate-400 text-base">
              Political espionage, data cross-contamination, and accidental exposure are unacceptable risks. 
              KamiliOS is engineered with military-grade segregation protocols.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-emerald-500/40 transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6">
                <Database className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Row-Level Security (RLS) & Schema Isolation</h3>
              <p className="mt-3 text-slate-400 text-sm leading-relaxed">
                Every tenant database query is enforced at the database kernel level with cryptographic tenant identifiers. Even a rogue internal query cannot access or return records from another campaign.
              </p>
              <ul className="mt-6 space-y-2.5 text-xs text-slate-300 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  Isolated database schemas for gubernatorial & presidential tiers
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  Subdomain and custom domain DNS partitioning
                </li>
              </ul>
            </div>

            <div className="p-8 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-emerald-500/40 transition-all">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6">
                <KeyRound className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Unique Customer Encryption Keys (KMS)</h3>
              <p className="mt-3 text-slate-400 text-sm leading-relaxed">
                Strategy documents, manifesto drafts, and financial receipts are encrypted using separate AWS/GCP KMS key rings unique to each aspirant. No cross-tenant decryption is computationally possible.
              </p>
              <ul className="mt-6 space-y-2.5 text-xs text-slate-300 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                  AES-256 GCM encryption at rest
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                  Dynamic watermarking on all exported PDF battle orders
                </li>
              </ul>
            </div>

            <div className="p-8 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-emerald-500/40 transition-all">
              <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6">
                <Flame className="w-6 h-6 text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-white">The Defection "Burn Switch"</h3>
              <p className="mt-3 text-slate-400 text-sm leading-relaxed">
                Political coordinators switch camps overnight. If an operative resigns or defects, the Campaign Manager can instantly revoke their sessions, clear cached local data, and lock document access in one click.
              </p>
              <ul className="mt-6 space-y-2.5 text-xs text-slate-300 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-red-400 shrink-0" />
                  Sub-second JWT invalidation across all devices
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-red-400 shrink-0" />
                  Full forensic audit trail of every record viewed or exported
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Core Capabilities */}
      <section id="features" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Built for the Political Battlefield
            </h2>
            <p className="mt-4 text-slate-400 text-base">
              Every tool in KamiliOS was designed to solve real operational bottlenecks faced by candidates, directors, and ward agents.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-white">Executive Command Centre</h4>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                Answers the candidate's core morning question: <em>"What is happening across my campaign right now?"</em> Active teams, pending expenditures, urgent decisions, and geographic activity feeds.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4">
                <MapPin className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-white">Field Operations & Offline Sync</h4>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                Grassroots teams file door-to-door, market, and town hall reports with geo-tagged photos even when data signals drop. Syncs effortlessly when cellular connectivity returns.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4">
                <DollarSign className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-white">Petty Cash Floats & Multi-tier Approvals</h4>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                Stop budget drain. Coordinators request field mobilization allowances; finance vets receipts, and the candidate signs off directly from their phone before M-Pesa disbursement.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4">
                <Users className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-white">Hierarchy & Ward Team Rostering</h4>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                Manage County $\to$ Constituency $\to$ Ward $\to$ Polling Station agents. Every coordinator has defined boundaries, clear reporting lines, and isolated visibility.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4">
                <Radio className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-white">Incident & Security Escalations</h4>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                Sound system failure? Rival youth group confrontation? Police permit delays? Field leaders report high-priority incidents with target resolution deadlines.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4">
                <FileText className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-white">IEBC Compliance & Audit Exports</h4>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                Generate clean, auditable campaign financial returns compliant with statutory campaign financing laws and internal audit inquiries at the touch of a button.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Subscription Pricing */}
      <section id="pricing" className="py-24 bg-slate-900/50 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Transparent, Tiered Campaign Subscriptions
            </h2>
            <p className="mt-4 text-slate-400 text-base">
              Choose the tier matched to your elective seat. Scale seamlessly as your campaign apparatus expands toward election day.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Ward / MCA */}
            <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Ward Level</span>
                <h3 className="text-2xl font-bold text-white mt-1">MCA Aspirant</h3>
                <p className="text-xs text-slate-400 mt-2">Essential command setup for single-ward campaigns.</p>
                
                <div className="mt-6 flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold text-white">KES 35,000</span>
                  <span className="text-xs text-slate-400">/ campaign month</span>
                </div>

                <ul className="mt-8 space-y-3 text-sm text-slate-300">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    Up to 25 Registered Field Personnel
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    Executive Dashboard & Daily Reports
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    Mobile Expense Approvals & Floats
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    Shared RLS Cryptographic Isolation
                  </li>
                </ul>
              </div>

              <Link
                href="/app"
                className="mt-8 w-full py-3 px-4 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-white text-center font-semibold text-sm transition-all"
              >
                Start Ward Trial
              </Link>
            </div>

            {/* Constituency / MP / Woman Rep */}
            <div className="p-8 rounded-2xl bg-slate-950 border-2 border-emerald-500/80 relative flex flex-col justify-between shadow-2xl shadow-emerald-500/10">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-emerald-500 text-slate-950 font-bold text-xs uppercase px-3 py-1 rounded-full">
                Most Popular
              </div>
              <div>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Constituency Level</span>
                <h3 className="text-2xl font-bold text-white mt-1">MP / Woman Rep</h3>
                <p className="text-xs text-slate-400 mt-2">Complete multi-ward coordination across 4–10 wards.</p>
                
                <div className="mt-6 flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold text-white">KES 95,000</span>
                  <span className="text-xs text-slate-400">/ campaign month</span>
                </div>

                <ul className="mt-8 space-y-3 text-sm text-slate-300">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    Up to 150 Registered Campaign Agents
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    Full Ward Hierarchy & Polling Agents
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    M-Pesa B2C Stipend Integration Ready
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    Interactive Geographic Activity Map
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    Subdomain Isolation (e.g. yourname.kamiliapp.com)
                  </li>
                </ul>
              </div>

              <Link
                href="/app"
                className="mt-8 w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-center font-bold text-sm transition-all shadow-lg shadow-emerald-500/20"
              >
                Provision MP Command Hub
              </Link>
            </div>

            {/* County / Gubernatorial / Presidential */}
            <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">County / National</span>
                <h3 className="text-2xl font-bold text-white mt-1">Governor / Senator</h3>
                <p className="text-xs text-slate-400 mt-2">Dedicated sovereign cloud schema with 24/7 war room support.</p>
                
                <div className="mt-6 flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold text-white">KES 280,000</span>
                  <span className="text-xs text-slate-400">/ campaign month</span>
                </div>

                <ul className="mt-8 space-y-3 text-sm text-slate-300">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    Unlimited Personnel & Field Marshals
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    Dedicated Isolated PostgreSQL Schema
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    Custom KMS Encryption Key (Client Owned)
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    Election Day Parallel Tallying & Form 34A Vault
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    Dedicated 24/7 Technical War Room Liaison
                  </li>
                </ul>
              </div>

              <Link
                href="/app"
                className="mt-8 w-full py-3 px-4 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-white text-center font-semibold text-sm transition-all"
              >
                Contact Enterprise Desk
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-emerald-500" />
            <span className="text-slate-300 font-semibold text-sm">KamiliOS Campaign Operating System</span>
          </div>
          <div>
            Complies with the Republic of Kenya Data Protection Act, 2019. Non-partisan technology infrastructure.
          </div>
          <div className="flex items-center gap-6 text-slate-400">
            <Link href="/app" className="hover:text-emerald-400">Portal</Link>
            <a href="#security" className="hover:text-emerald-400">Air-Gap Policy</a>
            <a href="#pricing" className="hover:text-emerald-400">Tiers</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
