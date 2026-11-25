# KamiliOS: Comprehensive Master Implementation Roadmap

> **The Sovereign Political Campaign Operating System for Kenyan Electoral Politics**  
> *Non-partisan, air-gapped, multi-tenant digital command platform built for MCA, MP, Woman Rep, Senator, Governor, and Presidential campaigns.*

---

## 1. Executive Vision & Core Problem Statement

KamiliOS replaces the chaos of uncoordinated WhatsApp groups, inflated phantom field allowances, leaked campaign strategies, and disconnected grassroots teams with a unified, military-grade digital command suite.

### Core Strategic Mandates:
1. **The 30-Second Morning Question:** Deliver instant situational awareness to the candidate every morning: *What is happening across my campaign right now?* (Verified citizen outreach, burning incidents, pending financial sign-offs, upcoming IEBC rallies).
2. **Zero-Leak Guarantee Between Rivals:** Enable competing politicians (e.g., rival gubernatorial or parliamentary contenders) to safely run on the same platform without risk of cross-campaign data leaks, corporate espionage, or unauthorized cross-tenant queries.
3. **Decentralized Ground Reporting, Centralized Command:** Equip ward marshals and polling agents to file field intelligence and mobilization requests, while giving the Campaign Manager and Candidate absolute visibility and approval control.
4. **The Defection "Burn Switch":** In an electoral landscape where coordinators defect overnight, provide instant 1-click revocation of credentials, session tokens, and local cache wipes for compromised personnel.
5. **Kenyan Electoral & Regulatory Compliance:** Built specifically to comply with Kenya's **Data Protection Act (2019)** (enforced by the ODPC) and statutory **Independent Electoral and Boundaries Commission (IEBC)** Campaign Financing audit requirements.

---

## 2. Multi-Tenant Cryptographic Architecture & Air-Gap Guarantees

| Security Layer | Technical Specification | Operational Guarantee |
| :--- | :--- | :--- |
| **Row-Level Security (RLS)** | PostgreSQL kernel-level RLS policies keyed by `tenant_id` | No internal or cross-campaign database query can ever return another candidate's records. |
| **Dedicated Schemas** | Schema-per-tenant partitioning for Gubernatorial and Presidential tiers | Physical and logical separation of sensitive voter records and polling matrices. |
| **KMS Key Rings** | Per-tenant AWS/GCP Key Management Service (KMS) AES-256 GCM encryption | Strategy documents, donor manifests, and financial records are encrypted with candidate-owned keys. |
| **Domain Partitioning** | Dedicated subdomains (`<candidate>.<constituency>.kamiliapp.com`) and custom DNS | Strict browser cookie isolation and Origin separation. |
| **Forensic Audit Vault** | Append-only, tamper-evident audit logs with dynamic watermarking on PDF exports | Every file opened, exported, or modified is permanently logged to an immutable trail. |
| **Defection Burn Switch** | Sub-second JWT blacklisting + Service Worker cache-invalidation signal | Instant removal of access and client-side wipe upon coordinator dismissal or defection. |

---

## 3. Personnel Hierarchy & Granular RBAC Matrix

KamiliOS defines **11 operational roles** divided into three strategic echelons:

```
                          ┌────────────────────────┐
                          │   Candidate (Aspirant) │
                          └───────────┬────────────┘
                                      │
                         ┌────────────┴────────────┐
                         │    Campaign Director    │
                         └────────────┬────────────┘
                                      │
                         ┌────────────┴────────────┐
                         │     Campaign Manager    │
                         └────────────┬────────────┘
               ┌──────────────────────┼──────────────────────┐
               │                      │                      │
   ┌───────────┴───────────┐ ┌────────┴────────┐  ┌──────────┴──────────┐
   │ Regional Coordinator  │ │ Finance Officer │  │ Events Coordinator  │
   └───────────┬───────────┘ └─────────────────┘  └─────────────────────┘
               │                      │                      │
 ┌─────────────┴─────────────┐ ┌──────┴────────┐  ┌──────────┴──────────┐
 │ Constituency Coordinator  │ │ Communications│  │     Admin Staff     │
 └─────────────┬─────────────┘ └───────────────┘  └─────────────────────┘
               │
   ┌───────────┴───────────┐
   │   Ward Coordinator    │
   └───────────┬───────────┘
               │
   ┌───────────┴───────────┐
   │ Field Member / Marshal│
   └───────────────────────┘
```

### Access Control Matrix:

| Operational Module | Candidate / Director | Campaign Manager | Finance Officer | Coordinators (Ward/Const.) | Field Members / Volunteers |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Executive Dashboard & High-Level KPIs** | Full Access | Full Access | Financial Metrics Only | Regional Slices Only | Hidden |
| **Candidate Schedule & Battle Orders** | Full Access / Edit | Full Access / Edit | Read-Only | Read Assigned Events | Read Assigned Events |
| **Approvals Queue (Candidate Sign-Off)** | **Sole Authority** | View / Requisition | Review & Queue | Submit Only | Hidden |
| **Finance Ledgers & Float Balances** | Executive View | Operational View | **Full Control** | Hidden | Hidden |
| **Field Requisitions & Expense Claims** | View & Sign Off | Review & Escalate | Pre-Approval Vet | Submit Requisitions | Submit Expense Receipts |
| **Field Operations Feed & Map** | Consolidated | Consolidated | Hidden | Constituency/Ward Slice | Submit Ward Reports |
| **Incident Escalations** | Critical Clashes | Full Response | Hidden | Report & Triage Local | Report Local Incident |
| **Team Directory & Burn Switch** | Full Control | Full Control | Staff Directory Only | Ward Roster Only | Self Profile Only |
| **IEBC Audit & Compliance Reports** | Sign Off & Export | Assist Reporting | **Generate & Verify** | Hidden | Hidden |
| **Election Day Form 34A Vault & Tally** | Consolidated Tally | Command War Room | Hidden | Constituency Tally | Upload Polling 34A Photos |

---

## 4. Phase-by-Phase Implementation Roadmap

### Phase 1: Core Multi-Tenant Architecture & Executive Center *(Status: COMPLETED)*
- [x] Next.js 15 App Router scaffolding with TypeScript, Tailwind CSS, and Lucide icons.
- [x] Multi-tenant context state engine ([TenantContext.tsx](file:///home/hanayo/KamiliOS/src/context/TenantContext.tsx)) supporting dynamic tenant switching.
- [x] High-conversion SaaS landing page ([LandingPage.tsx](file:///home/hanayo/KamiliOS/src/components/LandingPage.tsx)) detailing security, tiers, and Kenyan value proposition.
- [x] Executive Dashboard ([ExecutiveDashboard.tsx](file:///home/hanayo/KamiliOS/src/components/dashboard/ExecutiveDashboard.tsx)) featuring real-time KPIs:
  - Consolidated citizen reach & attendance totals.
  - Approved vs. pending campaign disbursements.
  - Candidate decisions awaiting immediate sign-off.
  - Active high-priority operational blockers.
  - Administrative sub-county & ward coverage metrics (17/17 sub-counties, 85 wards).
- [x] Core operational modules scaffolded:
  - Field Operations feed with activity categorization.
  - Finance Module with expense submission and M-Pesa/Bank/Float selection.
  - Approvals Center for executive hold/approve actions.
  - Incident Escalation logging (Security, Logistics, Clash, Venue).
  - Teams & Hierarchy directory with interactive Defection "Burn Switch" demo.
  - Realistic Kenyan mock datasets across 3 campaign tiers (Nairobi Governor, Kisumu Central MP, Mombasa Senator).

---

### Phase 2: Intra-Campaign Role-Based Access Control (RBAC) *(Status: IMMEDIATE PRIORITY)*
- [ ] **Role Permissions Engine:**
  - Create a centralized permissions map (`src/utils/rbac.ts`) defining explicit module-level, field-level, and action-level permissions for all 11 roles.
- [ ] **Dynamic Navigation Filtering:**
  - Update [Sidebar.tsx](file:///home/hanayo/KamiliOS/src/components/dashboard/Sidebar.tsx) to only render navigation tabs authorized for the currently selected role.
  - Hide Finance, Approvals, and Security Settings from Ward Coordinators and Field Marshals.
- [ ] **Data Slicing & Views per Role:**
  - **Candidate / Director View:** High-level strategic metrics, candidate greeting, executive approval queue, IEBC audit summaries.
  - **Finance View:** Full expense ledgers, petty cash float balance reconciliation, disbursement queues, voucher audits.
  - **Field Coordinator View:** Constituency- and Ward-specific activity logs, team rosters, incident dispatch, stipend requisition forms.
  - **Field Member / Volunteer View:** Simplified mobile-first submit screen (File Activity, Report Incident, Upload Receipt).
- [ ] **Action Guardrails:**
  - Restrict the `handleApproval` trigger exclusively to `candidate` and `campaign_director`.
  - Prevent non-finance roles from modifying disbursement statuses.

---

### Phase 3: Field Mobility, Offline-First PWA & Geotagging *(Status: SCHEDULED)*
- [ ] **Progressive Web App (PWA) Configuration:**
  - Service Worker registration with offline asset caching for low-bandwidth rural operations.
- [ ] **Local-First IndexedDB Storage:**
  - Implement Dexie.js / IndexedDB queue for field reports and receipts filed while outside cellular range.
  - Background sync mechanism that automatically pushes queued payloads when 3G/4G connectivity is restored.
- [ ] **GPS Verification & Media Compression:**
  - Browser Geolocation API capture to verify door-to-door and market rallies at the actual ward location.
  - Client-side image compression before upload to optimize data bundle usage on field smartphones.

---

### Phase 4: Kenyan Integrations: M-Pesa B2C & Africa's Talking SMS/USSD *(Status: SCHEDULED)*
- [ ] **Safaricom M-Pesa Daraja API Integration:**
  - B2C (Business-to-Customer) endpoint integration for direct disbursement of approved field allowances, agent stipends, and fuel floats directly to mobile wallets.
  - Instant MPesa receipt reference validation and automated reconciliation against petty cash vouchers.
- [ ] **SMS / USSD Broadcast Engine (Africa's Talking):**
  - Instant SMS broadcast of campaign rally notices and battle orders to registered grassroots marshals.
  - Fallback USSD code flow (`*XXX#`) for feature phone field agents to report polling station attendance and submit incident alerts without smartphone access.

---

### Phase 5: IEBC Regulatory Audit Engine & Compliance Returns *(Status: SCHEDULED)*
- [ ] **IEBC Campaign Financing Act Compliance:**
  - Automated expenditure categorization matching Kenyan statutory audit reporting standards.
  - Statutory donation limit caps and donor identity tracking.
- [ ] **One-Click Audit PDF/CSV Export:**
  - Formatted statutory returns ready for submission to the IEBC Registrar of Political Parties.
  - Immutable transaction hashing for internal campaign auditing.

---

### Phase 6: Election Day War Room, Parallel Tallying & Form 34A Vault *(Status: SCHEDULED)*
- [ ] **Polling Station Agent Roster:**
  - Complete mapping of polling streams, assigned agents, and check-in statuses across constituencies.
- [ ] **Parallel Vote Tallying System (PVT):**
  - Real-time vote entry by polling station agents as soon as ballot counting concludes.
  - Live turnout tracking and candidate margin calculation.
- [ ] **Form 34A Photographic Vault:**
  - High-resolution photographic capture of physical Form 34As signed by presiding officers and party agents.
  - Client-side OCR for initial number extraction and side-by-side discrepancy flagging against official IEBC portal figures.

---

## 5. Commercial Tier Packaging

| Package Tier | Elective Office Match | Pricing (KES / Mo) | Key Quota & Entitlements |
| :--- | :--- | :--- | :--- |
| **Ward Level** | MCA Aspirant | KES 35,000 | Up to 25 agents, daily field reports, mobile expense requests, shared RLS isolation. |
| **Constituency Level** | MP / Woman Representative | KES 95,000 | Up to 150 agents, full ward hierarchy, M-Pesa B2C ready, interactive territory map, custom subdomain. |
| **County / National** | Senator / Governor / Presidential | KES 280,000 | Unlimited personnel, dedicated isolated PostgreSQL schema, client-owned KMS encryption key, Election Day Form 34A Vault, 24/7 War Room Liaison. |

---

## 6. Document Governance

* **Repository Location:** `/home/hanayo/KamiliOS/ROADMAP.md`
* **Version:** 1.0.0 (Master Blueprint)
* **Maintained By:** Lead Campaign Systems Architect & Antigravity AI
* **Review Frequency:** Synchronized on every sprint milestone and phase progression.
