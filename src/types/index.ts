export enum UserRole {
  ADMIN = "admin",
  AGENT = "agent",
  CLIENT = "client",
  RESPONSABLE_PLATEAU = "responsable_plateau",
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: string;
  birthDate?: string;
  role: UserRole;
  createdAt: string;
  businessSector?: string;
  companyName?: string;
  managerName?: string;
  companyRole?: string | null;
}

export interface CartItem {
  id?: string;
  offerId: string;
  quantity: number;
  userId: string;
  offer: Offer;
}

export interface Offer {
  id: string;
  name: string;
  description: string;
  price: number;
  type: OfferType;
  category: OfferCategory;
  imageUrl?: string;
  monthlyPayment: number;
  creationCost: number;
}

export enum OfferType {
  SIMPLE = "simple",
  RECURRENT = "recurrent",
}

export enum OfferCategory {
  SITE_VITRINE = "site_vitrine",
  SITE_E_COMMERCE = "site_e_commerce",
  SEO = "seo",
  SEA = "sea",
  DESIGN_GRAPHIQUE = "design_graphique",
  BRANDING = "branding",
  AUTRE = "autre",
}

// Ajout des types pour les campagnes et leads CRM
export interface Campaign {
  id: string;
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  objectives?: string;
  status: 'preparation' | 'active' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
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
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';
  createdAt: string;
  updatedAt: string;
  assignedTo?: User | null;
}

export interface LeadTask {
  id: string;
  leadId: string;
  agentId: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
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

export interface LeadAssignment {
  id: string;
  leadId: string;
  agentId: string;
  assignedAt: string;
  status: 'active' | 'reassigned' | 'completed';
  createdBy: string;
}
