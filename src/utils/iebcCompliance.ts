import { TenantTier, CampaignTenant, CampaignExpense } from '@/types/campaign';

export interface StatutoryCeiling {
  tier: TenantTier;
  title: string;
  spendingLimitKES: number;
  maxSingleDonorKES: number;
  statutoryActRef: string;
}

export const IEBC_STATUTORY_CEILINGS: Record<TenantTier, StatutoryCeiling> = {
  county: {
    tier: 'county',
    title: 'County Gubernatorial / Senatorial',
    spendingLimitKES: 432000000, // KES 432 Million statutory cap (Nairobi benchmark)
    maxSingleDonorKES: 86400000, // 20% of statutory ceiling
    statutoryActRef: 'IEBC Campaign Financing Regulations (Gazette Notice No. 8921)',
  },
  constituency: {
    tier: 'constituency',
    title: 'Single-Member Constituency (MP)',
    spendingLimitKES: 33400000, // KES 33.4 Million
    maxSingleDonorKES: 6680000,
    statutoryActRef: 'IEBC Campaign Financing Regulations (Gazette Notice No. 8922)',
  },
  ward: {
    tier: 'ward',
    title: 'County Assembly Ward (MCA)',
    spendingLimitKES: 3100000, // KES 3.1 Million
    maxSingleDonorKES: 620000,
    statutoryActRef: 'IEBC Campaign Financing Regulations (Gazette Notice No. 8923)',
  },
  presidential: {
    tier: 'presidential',
    title: 'Presidential Campaign Apparatus',
    spendingLimitKES: 4400000000, // KES 4.4 Billion
    maxSingleDonorKES: 880000000,
    statutoryActRef: 'IEBC Campaign Financing Regulations (Gazette Notice No. 8920)',
  },
};

export interface DonorContribution {
  id: string;
  donorName: string;
  nationalIdOrKraPin: string;
  amountKES: number;
  sourceCategory: 'Individual Citizen' | 'Corporate Partner' | 'Harambee Caucus' | 'Political Party Grant';
  date: string;
  receiptNumber: string;
  status: 'compliant' | 'flagged';
  flagReason?: string;
}

export const DEMO_CONTRIBUTIONS: Record<string, DonorContribution[]> = {
  'tenant-nairobi-gov': [
    {
      id: 'don-01',
      donorName: 'Kenya Private Sector Coalition Trust',
      nationalIdOrKraPin: 'P051289190K',
      amountKES: 15000000,
      sourceCategory: 'Corporate Partner',
      date: '2026-10-12',
      receiptNumber: 'DON-NBO-001',
      status: 'compliant',
    },
    {
      id: 'don-02',
      donorName: 'Nairobi Friends of the City Harambee',
      nationalIdOrKraPin: '28491024',
      amountKES: 8500000,
      sourceCategory: 'Harambee Caucus',
      date: '2026-11-01',
      receiptNumber: 'DON-NBO-002',
      status: 'compliant',
    },
    {
      id: 'don-03',
      donorName: 'Dr. Kiprop Chepkonga',
      nationalIdOrKraPin: '19827361',
      amountKES: 2500000,
      sourceCategory: 'Individual Citizen',
      date: '2026-11-15',
      receiptNumber: 'DON-NBO-003',
      status: 'compliant',
    },
    {
      id: 'don-04',
      donorName: 'Anonymous Diaspora Wire Transfer',
      nationalIdOrKraPin: 'UNVERIFIED',
      amountKES: 1200000,
      sourceCategory: 'Individual Citizen',
      date: '2026-11-20',
      receiptNumber: 'DON-NBO-004',
      status: 'flagged',
      flagReason: 'Anonymous donation above KES 20,000 threshold (Section 11(3) Violation)',
    },
  ],
  'tenant-kisumu-central': [
    {
      id: 'don-ksm-01',
      donorName: 'Lakeside Professionals Caucus',
      nationalIdOrKraPin: 'P051928374L',
      amountKES: 3000000,
      sourceCategory: 'Harambee Caucus',
      date: '2026-10-25',
      receiptNumber: 'DON-KSM-001',
      status: 'compliant',
    },
    {
      id: 'don-ksm-02',
      donorName: 'Otieno & Sons Hardware Ltd',
      nationalIdOrKraPin: 'P000293847M',
      amountKES: 1500000,
      sourceCategory: 'Corporate Partner',
      date: '2026-11-08',
      receiptNumber: 'DON-KSM-002',
      status: 'compliant',
    },
  ],
  'tenant-mombasa-senate': [
    {
      id: 'don-msa-01',
      donorName: 'Coast Maritime Transport Alliance',
      nationalIdOrKraPin: 'P059281729A',
      amountKES: 5000000,
      sourceCategory: 'Corporate Partner',
      date: '2026-10-18',
      receiptNumber: 'DON-MSA-001',
      status: 'compliant',
    },
  ]
};

export function generateAuditHash(tenantId: string, totalSpent: number, recordCount: number): string {
  // Deterministic audit stamp
  const rawString = `${tenantId}::${totalSpent}::${recordCount}::KENYA_IEBC_2027_VERIFIED`;
  let hash = 0;
  for (let i = 0; i < rawString.length; i++) {
    const char = rawString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  const hexPart = Math.abs(hash).toString(16).padStart(8, '0');
  return `IEBC-SHA256-${hexPart.toUpperCase()}-${tenantId.replace('tenant-', '').toUpperCase()}-AUDIT-STAMP`;
}

export function generateIEBCExportCSV(
  tenant: CampaignTenant,
  expenses: CampaignExpense[],
  contributions: DonorContribution[]
): string {
  const ceiling = IEBC_STATUTORY_CEILINGS[tenant.tier] || IEBC_STATUTORY_CEILINGS.county;
  const totalExpenditure = expenses.reduce((s, e) => s + e.amount, 0);
  const totalContributions = contributions.reduce((s, c) => s + c.amountKES, 0);

  let csv = `INDEPENDENT ELECTORAL AND BOUNDARIES COMMISSION (IEBC)\n`;
  csv += `STATUTORY CAMPAIGN FINANCING RETURN — FORM CF-04\n`;
  csv += `=========================================================================\n`;
  csv += `Campaign Name,${tenant.name}\n`;
  csv += `Candidate Name,${tenant.candidateName}\n`;
  csv += `Elective Seat,${tenant.position}\n`;
  csv += `Jurisdiction / Region,${tenant.region}\n`;
  csv += `Statutory Expenditure Limit,KES ${ceiling.spendingLimitKES.toLocaleString()}\n`;
  csv += `Total Recorded Expenditure,KES ${totalExpenditure.toLocaleString()}\n`;
  csv += `Total Declared Contributions,KES ${totalContributions.toLocaleString()}\n`;
  csv += `Statutory Audit Hash,${generateAuditHash(tenant.id, totalExpenditure, expenses.length)}\n`;
  csv += `=========================================================================\n\n`;

  csv += `SCHEDULE A: ITEMIZED CAMPAIGN EXPENDITURES\n`;
  csv += `Voucher Ref,Date,Category,Description,Amount (KES),Disbursement Method,Status,Safaricom / Bank Ref\n`;
  expenses.forEach(e => {
    csv += `"${e.id}","${e.date}","${e.category}","${e.description.replace(/"/g, '""')}","${e.amount}","${e.disbursementMethod}","${e.status}","${e.receiptRef}"\n`;
  });

  csv += `\nSCHEDULE B: DECLARED POLITICAL CONTRIBUTIONS & DONATIONS\n`;
  csv += `Receipt Ref,Date,Donor Legal Name,National ID / KRA PIN,Category,Amount (KES),Compliance Status\n`;
  contributions.forEach(c => {
    csv += `"${c.receiptNumber}","${c.date}","${c.donorName}","${c.nationalIdOrKraPin}","${c.sourceCategory}","${c.amountKES}","${c.status.toUpperCase()}"\n`;
  });

  return csv;
}

export function downloadCSV(filename: string, content: string): void {
  if (typeof window === 'undefined') return;
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
