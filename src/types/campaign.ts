export type TenantTier = 'county' | 'constituency' | 'ward' | 'presidential';

export interface CampaignTenant {
  id: string;
  name: string;
  candidateName: string;
  position: string;
  region: string; // e.g., "Nairobi County", "Kisumu Central", "Kigumo"
  partyAffiliation: string;
  tier: TenantTier;
  subdomain: string;
  encryptionKeyId: string;
  status: 'active' | 'suspended';
  createdDate: string;
  avatarUrl: string;
}

export type UserRole =
  | 'candidate'
  | 'campaign_director'
  | 'campaign_manager'
  | 'regional_coordinator'
  | 'constituency_coordinator'
  | 'ward_coordinator'
  | 'finance_officer'
  | 'events_coordinator'
  | 'communications_officer'
  | 'field_member'
  | 'admin_staff';

export interface CampaignUser {
  id: string;
  tenantId: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  location: string;
  supervisorId?: string;
  avatarUrl: string;
  status: 'active' | 'deactivated';
  lastActive: string;
}

export interface ActivityReport {
  id: string;
  tenantId: string;
  title: string;
  category: 'Door-to-door' | 'Town Hall' | 'Boda Boda Engagement' | 'Market Outreach' | 'Youth Caucus' | 'Inspection';
  location: string;
  ward: string;
  constituency: string;
  assignedTeamId: string;
  leaderName: string;
  date: string;
  attendanceEstimate: number;
  status: 'draft' | 'assigned' | 'in_progress' | 'submitted' | 'reviewed' | 'completed';
  notes: string;
  flaggedIssuesCount: number;
  photos: string[];
}

export interface CampaignExpense {
  id: string;
  tenantId: string;
  description: string;
  amount: number;
  currency: string;
  category: 'Logistics & Transport' | 'Event Venues' | 'Merchandise & Branding' | 'Field Stipends' | 'Media & Comms' | 'Security';
  submittedBy: string;
  submittingRole: string;
  date: string;
  status: 'pending' | 'finance_approved' | 'candidate_approved' | 'rejected' | 'disbursed';
  receiptRef: string;
  beneficiaryPhone?: string;
  disbursementMethod: 'M-Pesa B2C' | 'Bank Transfer' | 'Petty Cash Float';
}

export interface OperationalIncident {
  id: string;
  tenantId: string;
  title: string;
  category: 'Security' | 'Logistics' | 'Venue Dispute' | 'Resource Shortage' | 'Personnel Conflict';
  priority: 'low' | 'medium' | 'high' | 'critical';
  location: string;
  reportedBy: string;
  date: string;
  status: 'open' | 'under_investigation' | 'escalated_to_candidate' | 'resolved';
  resolutionDeadline: string;
  details: string;
}

export interface CampaignEvent {
  id: string;
  tenantId: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  location: string;
  expectedAttendees: number;
  coordinator: string;
  budgetAllocated: number;
  status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
}

export interface ApprovalItem {
  id: string;
  tenantId: string;
  type: 'Expense' | 'Event' | 'Resource Requisition' | 'High-Level Appointment';
  title: string;
  requestedBy: string;
  amount?: number;
  date: string;
  urgency: 'routine' | 'urgent' | 'immediate';
  status: 'pending' | 'approved' | 'rejected';
  details: string;
}
