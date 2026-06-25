// CRM TypeScript types matching the backend Motoko types

export type Lead = {
  id: bigint;
  name: string;
  phone: string;
  email: string;
  service: string;
  source: string;
  stage: string;
  score: string;
  estimatedValue: bigint;
  notes: string;
  createdAt: bigint;
  updatedAt: bigint;
  assignedTo: string;
};

export type CrmClient = {
  id: bigint;
  name: string;
  phone: string;
  email: string;
  clientType: string;
  totalDeals: bigint;
  totalValue: bigint;
  ltv: bigint;
  createdAt: bigint;
  lastContact: bigint;
  notes: string;
};

export type CrmAppointment = {
  id: bigint;
  clientName: string;
  type_: string;
  scheduledAt: bigint;
  durationMins: bigint;
  location: string;
  notes: string;
  status: string;
  createdBy: string;
};

export type Proposal = {
  id: bigint;
  clientName: string;
  propertyTitle: string;
  amount: bigint;
  status: string;
  createdAt: bigint;
  expiresAt: bigint;
  notes: string;
};

export type CrmEvent = {
  id: bigint;
  title: string;
  type_: string;
  scheduledAt: bigint;
  venue: string;
  capacity: bigint;
  confirmedCount: bigint;
  budget: bigint;
  status: string;
  description: string;
};

export type CommissionInvoice = {
  id: bigint;
  clientName: string;
  serviceType: string;
  amount: bigint;
  commission: bigint;
  status: string;
  dueDate: bigint;
  paidDate: [] | [bigint];
  description: string;
  createdAt: bigint;
};

export type FinancialMetric = {
  period: string;
  totalRevenue: bigint;
  totalCommissions: bigint;
  newLeads: bigint;
  closedDeals: bigint;
  conversionRate: bigint;
  averageDealSize: bigint;
};

export type Campaign = {
  id: bigint;
  title: string;
  channel: string;
  audience: string;
  messagePreview: string;
  sentCount: bigint;
  openCount: bigint;
  replyCount: bigint;
  status: string;
  scheduledAt: [] | [bigint];
  createdAt: bigint;
};

export type ReviewRecord = {
  id: bigint;
  platform: string;
  reviewerName: string;
  rating: bigint;
  reviewText: string;
  reviewDate: bigint;
  responded: boolean;
  responseText: [] | [string];
  sentiment: string;
};

export type DashboardStat = {
  key: string;
  value: bigint;
  statLabel: string;
  change: bigint;
  period: string;
  icon: string;
};

export type AppNotification = {
  id: bigint;
  appName: string;
  title: string;
  message: string;
  priority: string;
  isRead: boolean;
  createdAt: bigint;
  targetRole: string;
};

export type CrmDashboardStats = {
  totalLeads: bigint;
  totalClients: bigint;
  openDeals: bigint;
  totalRevenue: bigint;
  conversionRate: bigint;
  pendingAppointments: bigint;
  activeProposals: bigint;
  overdueInvoices: bigint;
};
