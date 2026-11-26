'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  CampaignTenant, 
  CampaignUser, 
  ActivityReport, 
  CampaignExpense, 
  OperationalIncident, 
  CampaignEvent, 
  ApprovalItem 
} from '@/types/campaign';
import { 
  DEMO_TENANTS, 
  DEMO_USERS, 
  DEMO_REPORTS, 
  DEMO_EXPENSES, 
  DEMO_INCIDENTS, 
  DEMO_EVENTS, 
  DEMO_APPROVALS 
} from '@/types/mockData';

interface TenantContextType {
  currentTenant: CampaignTenant;
  allTenants: CampaignTenant[];
  switchTenant: (tenantId: string) => void;
  currentUser: CampaignUser;
  switchUserRole: (userId: string) => void;
  // Isolated Tenant Datasets
  users: CampaignUser[];
  reports: ActivityReport[];
  expenses: CampaignExpense[];
  incidents: OperationalIncident[];
  events: CampaignEvent[];
  approvals: ApprovalItem[];
  // Actions
  addReport: (report: Omit<ActivityReport, 'id' | 'tenantId'>) => void;
  addExpense: (expense: Omit<CampaignExpense, 'id' | 'tenantId'>) => void;
  updateExpenseStatus: (expenseId: string, status: CampaignExpense['status'], receiptRef?: string) => void;
  handleApproval: (approvalId: string, action: 'approved' | 'rejected') => void;
  resolveIncident: (incidentId: string) => void;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const [currentTenantId, setCurrentTenantId] = useState<string>('tenant-nairobi-gov');
  const [tenantsState] = useState<CampaignTenant[]>(DEMO_TENANTS);
  
  // Per-tenant isolated state
  const [tenantReports, setTenantReports] = useState(DEMO_REPORTS);
  const [tenantExpenses, setTenantExpenses] = useState(DEMO_EXPENSES);
  const [tenantIncidents, setTenantIncidents] = useState(DEMO_INCIDENTS);
  const [tenantApprovals, setTenantApprovals] = useState(DEMO_APPROVALS);

  const currentTenant = tenantsState.find(t => t.id === currentTenantId) || tenantsState[0];
  const tenantUsers = DEMO_USERS[currentTenant.id] || [];
  const [currentUserId, setCurrentUserId] = useState<string>(tenantUsers[0]?.id || 'usr-1');

  // Update default user whenever tenant changes
  useEffect(() => {
    const usersForTenant = DEMO_USERS[currentTenantId] || [];
    if (usersForTenant.length > 0) {
      setCurrentUserId(usersForTenant[0].id);
    }
  }, [currentTenantId]);

  const currentUser = tenantUsers.find(u => u.id === currentUserId) || tenantUsers[0];

  const switchTenant = (tenantId: string) => {
    setCurrentTenantId(tenantId);
  };

  const switchUserRole = (userId: string) => {
    setCurrentUserId(userId);
  };

  // Strictly isolated handlers
  const addReport = (newReport: Omit<ActivityReport, 'id' | 'tenantId'>) => {
    const item: ActivityReport = {
      ...newReport,
      id: `rep-${Date.now()}`,
      tenantId: currentTenant.id,
    };
    setTenantReports(prev => ({
      ...prev,
      [currentTenant.id]: [item, ...(prev[currentTenant.id] || [])]
    }));
  };

  const addExpense = (newExpense: Omit<CampaignExpense, 'id' | 'tenantId'>) => {
    const item: CampaignExpense = {
      ...newExpense,
      id: `exp-${Date.now()}`,
      tenantId: currentTenant.id,
    };
    setTenantExpenses(prev => ({
      ...prev,
      [currentTenant.id]: [item, ...(prev[currentTenant.id] || [])]
    }));
  };

  const updateExpenseStatus = (expenseId: string, status: CampaignExpense['status'], receiptRef?: string) => {
    setTenantExpenses(prev => ({
      ...prev,
      [currentTenant.id]: (prev[currentTenant.id] || []).map(exp => 
        exp.id === expenseId 
          ? { ...exp, status, receiptRef: receiptRef || exp.receiptRef }
          : exp
      )
    }));
  };

  const handleApproval = (approvalId: string, action: 'approved' | 'rejected') => {
    setTenantApprovals(prev => ({
      ...prev,
      [currentTenant.id]: (prev[currentTenant.id] || []).map(app => 
        app.id === approvalId ? { ...app, status: action } : app
      )
    }));
  };

  const resolveIncident = (incidentId: string) => {
    setTenantIncidents(prev => ({
      ...prev,
      [currentTenant.id]: (prev[currentTenant.id] || []).map(inc => 
        inc.id === incidentId ? { ...inc, status: 'resolved' as const } : inc
      )
    }));
  };

  return (
    <TenantContext.Provider
      value={{
        currentTenant,
        allTenants: tenantsState,
        switchTenant,
        currentUser,
        switchUserRole,
        users: DEMO_USERS[currentTenant.id] || [],
        reports: tenantReports[currentTenant.id] || [],
        expenses: tenantExpenses[currentTenant.id] || [],
        incidents: tenantIncidents[currentTenant.id] || [],
        events: DEMO_EVENTS[currentTenant.id] || [],
        approvals: tenantApprovals[currentTenant.id] || [],
        addReport,
        addExpense,
        updateExpenseStatus,
        handleApproval,
        resolveIncident,
      }}
    >
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
}
