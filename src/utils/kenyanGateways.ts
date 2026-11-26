/**
 * KamiliOS Kenyan Gateway Integration Layer
 * Safaricom Daraja M-Pesa B2C & Africa's Talking SMS/USSD
 */

// --- 1. SAFARICOM DARAJA B2C (Business-to-Customer) ---

export interface B2CPaymentRequest {
  phone: string;
  amount: number;
  commandID: 'SalaryPayment' | 'BusinessPayment' | 'PromotionPayment';
  remarks: string;
  occasion?: string;
  tenantId: string;
}

export interface B2CPaymentResponse {
  conversationId: string;
  originatorConversationId: string;
  responseCode: string;
  responseDescription: string;
  transactionId: string; // e.g. "SKJ8921094"
  receiptNumber: string;
  disbursedAt: string;
  status: 'completed' | 'queued' | 'failed';
  amount: number;
  recipientPhone: string;
  serviceChargeKES: number;
  remainingFloatKES: number;
}

export function normalizeKenyanPhone(phone: string): string {
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  if (cleaned.startsWith('+254')) return cleaned;
  if (cleaned.startsWith('254')) return `+${cleaned}`;
  if (cleaned.startsWith('0')) return `+254${cleaned.slice(1)}`;
  if (cleaned.startsWith('7') || cleaned.startsWith('1')) return `+254${cleaned}`;
  return cleaned;
}

export function generateMpesaCode(): string {
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const prefix = 'SKJ';
  let middle = '';
  for (let i = 0; i < 4; i++) {
    middle += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  const suffix = Math.floor(100 + Math.random() * 900);
  return `${prefix}${middle}${suffix}`;
}

export async function executeB2CDisbursement(
  request: B2CPaymentRequest
): Promise<B2CPaymentResponse> {
  const normalizedPhone = normalizeKenyanPhone(request.phone);
  const transactionId = generateMpesaCode();
  const receiptNumber = `MPESA-B2C-${Date.now().toString().slice(-6)}`;
  
  // Safaricom B2C tariff approximation (e.g. KES 15 for amounts <= 1000, KES 23 for > 1000)
  const serviceChargeKES = request.amount <= 1000 ? 15 : 23;

  // Simulate network latency (400ms)
  await new Promise(resolve => setTimeout(resolve, 450));

  return {
    conversationId: `AG_${Date.now()}_0001`,
    originatorConversationId: `ORIG_${Math.floor(Math.random() * 100000)}`,
    responseCode: '0',
    responseDescription: 'Accept the service request successfully.',
    transactionId,
    receiptNumber,
    disbursedAt: new Date().toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    status: 'completed',
    amount: request.amount,
    recipientPhone: normalizedPhone,
    serviceChargeKES,
    remainingFloatKES: 842500 - request.amount - serviceChargeKES,
  };
}

// --- 2. AFRICA'S TALKING BULK SMS ---

export interface SMSDispatchTarget {
  id: string;
  label: string;
  recipientCount: number;
  samplePhone: string;
}

export const CAMPAIGN_SMS_TARGETS: SMSDispatchTarget[] = [
  { id: 'all_ward_leads', label: 'All 85 Ward Coordinators', recipientCount: 85, samplePhone: '+254 722 000 111' },
  { id: 'all_field_marshals', label: 'All Registered Youth Marshals (Nairobi Wide)', recipientCount: 350, samplePhone: '+254 733 445 566' },
  { id: 'constituency_directors', label: '17 Constituency Campaign Directors', recipientCount: 17, samplePhone: '+254 711 234 567' },
  { id: 'security_logistics', label: 'Rapid Security & Convoy Drivers', recipientCount: 28, samplePhone: '+254 701 112 233' },
];

export interface SMSDispatchResult {
  messageId: string;
  senderId: string;
  recipientCount: number;
  segmentsPerRecipient: number;
  totalCostKES: number;
  status: 'Sent' | 'Failed';
  dispatchedAt: string;
  recipientsPreview: string;
}

export async function sendCampaignBulkSMS(
  targetLabel: string,
  recipientCount: number,
  message: string,
  senderId = 'KAMILI_CMD'
): Promise<SMSDispatchResult> {
  const characters = message.length;
  const segments = Math.max(1, Math.ceil(characters / 160));
  // Safaricom/Airtel standard rate: KES 0.80 per SMS segment via Africa's Talking
  const costPerSegment = 0.80;
  const totalCostKES = Number((recipientCount * segments * costPerSegment).toFixed(2));

  await new Promise(resolve => setTimeout(resolve, 500));

  return {
    messageId: `ATX_${Date.now()}`,
    senderId,
    recipientCount,
    segmentsPerRecipient: segments,
    totalCostKES,
    status: 'Sent',
    dispatchedAt: new Date().toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' }),
    recipientsPreview: targetLabel,
  };
}

// --- 3. AFRICA'S TALKING USSD PROTOCOL HANDLER ---

export interface USSDSessionState {
  sessionId: string;
  serviceCode: string;
  phoneNumber: string;
  text: string;
}

export interface USSDResponse {
  type: 'CON' | 'END';
  message: string;
}

export function handleUSSDRequest(state: USSDSessionState, candidateName: string): USSDResponse {
  const inputs = state.text.split('*').filter(Boolean);

  // Level 0: Main Menu
  if (inputs.length === 0) {
    return {
      type: 'CON',
      message: `Welcome to KamiliOS Field USSD\nCampaign: ${candidateName}\n1. Check-in at Polling Station\n2. Report Field Incident Alert\n3. Submit Turnout Count\n4. Check My Float Balance`,
    };
  }

  // Branch 1: Check-in
  if (inputs[0] === '1') {
    if (inputs.length === 1) {
      return {
        type: 'CON',
        message: 'Enter your 4-digit Polling Station Agent PIN:',
      };
    }
    const pin = inputs[1];
    return {
      type: 'END',
      message: `Asante! Check-in confirmed for Agent ID ${pin}.\nStation: St. Paul Primary, Westlands Ward.\nIEBC Polling Stream: 02\nGood luck!`,
    };
  }

  // Branch 2: Report Field Incident
  if (inputs[0] === '2') {
    if (inputs.length === 1) {
      return {
        type: 'CON',
        message: 'Select Incident Category:\n1. Sound/PA Failure\n2. Rival Group Clash\n3. Police Permit Block\n4. Vehicle Breakdown',
      };
    }
    const categoryNames: Record<string, string> = {
      '1': 'Sound System Disruption',
      '2': 'Rival Operative Clash',
      '3': 'Police Permit Block',
      '4': 'Transport Logistics Breakdown',
    };
    const chosen = categoryNames[inputs[1]] || 'Operational Incident';
    return {
      type: 'END',
      message: `URGENT ALERT LOGGED:\n${chosen}\nSent to Campaign Command Centre with high priority.\nIncident Ticket #INC-${Date.now().toString().slice(-4)}.`,
    };
  }

  // Branch 3: Submit Turnout Count
  if (inputs[0] === '3') {
    if (inputs.length === 1) {
      return {
        type: 'CON',
        message: 'Enter estimated voter turnout for your polling stream right now:',
      };
    }
    const turnout = inputs[1];
    return {
      type: 'END',
      message: `Turnout count of ${turnout} voters recorded in central tallying matrix.\nThank you for keeping the war room updated.`,
    };
  }

  // Branch 4: Check Float Balance
  if (inputs[0] === '4') {
    return {
      type: 'END',
      message: `KAMILIOS FLOAT BALANCE:\nActive Float: KES 12,500\nLast Top-Up: KES 5,000 via M-Pesa B2C at 09:15 AM.\nDial *384*27# anytime.`,
    };
  }

  return {
    type: 'END',
    message: 'Invalid selection. Please dial *384*27# to retry.',
  };
}
