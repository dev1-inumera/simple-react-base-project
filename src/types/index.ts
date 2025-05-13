
export enum UserRole {
  CLIENT = "client",
  AGENT = "agent",
  ADMIN = "admin",
  RESPONSABLE_PLATEAU = "responsable_plateau"
}

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  birthDate?: string;
  role: UserRole;
  createdAt: string;
  businessSector?: string;
  companyName?: string;
  managerName?: string;
  companyRole?: string;
}

export interface OfferExtra {
  id: string;
  name: string;
  description?: string;
  unitPrice: number;
}

export interface Offer {
  id: string;
  name: string;
  description: string;
  priceMonthly: number;
  setupFee: number;
  category: string;
  imageUrl?: string;
  isActive: boolean;
  createdAt?: string;
  features: string[];
  extras?: OfferExtra[];
  hasExtras?: boolean;  // Added for conditional display of extras button
}

export interface CartItem {
  id?: string;
  offerId: string;
  offer: Offer;
  quantity: number;
  offerPlateId?: string;
  selectedExtras?: Record<string, number>; // Added for selected extras
}

export interface OfferPlate {
  id: string;
  name: string;
  clientId?: string;
  agentId: string;
  status: string;
  createdAt: string;
  items?: CartItem[];
}

export interface Folder {
  id: string;
  name: string;
  clientId: string;
  agentId: string;
  createdAt: string;
  client?: User;
  agent?: User;
  offerPlates?: OfferPlate[];
  quotes?: Quote[];
}

export interface Quote {
  id: string;
  offerPlateId: string;
  clientId?: string;
  agentId: string;
  totalAmount: number;
  status: string;
  paymentStatus: string;  // Added for payment status
  createdAt: string;
  client?: User;
  agent?: User;
  offerPlate?: OfferPlate;
  items?: CartItem[];
  paymentInfo?: PaymentInfo;
}

export interface PaymentInfo {
  id: string;
  quoteId: string;
  bankName: string;
  iban: string;
  bic: string;
  createdAt: string;
}

export interface LineItemType {
  offre: string;
  description: string;
  prix: number;
  quantite: number;
  montant: number;
}

export interface Campaign {
  id: string;
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  objectives?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  leadsCount?: number;
  assignedLeadsCount?: number;
}

export interface Lead {
  id: string;
  campaignId: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  company?: string;
  position?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  tasks?: LeadTask[];
  notes?: LeadNote[];
  assignedTo?: User;
}

export interface LeadAssignment {
  id: string;
  leadId: string;
  agentId: string;
  assignedAt: string;
  status: string;
  createdBy: string;
  agent?: User;
  lead?: Lead;
}

export interface LeadTask {
  id: string;
  leadId: string;
  agentId: string;
  title: string;
  description?: string;
  status: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LeadNote {
  id: string;
  leadId: string;
  agentId: string;
  content: string;
  createdAt: string;
  agent?: User;
}

export interface Report {
  id: string;
  name: string;
  type: string;
  campaignId?: string;
  agentId?: string;
  parameters?: any;
  createdAt: string;
  generatedAt?: string;
  data?: any;
}
