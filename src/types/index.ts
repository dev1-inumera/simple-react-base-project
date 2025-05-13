export enum UserRole {
  CLIENT = "client",
  AGENT = "agent",
  ADMIN = "admin",
  RESPONSABLE_PLATEAU = "responsable_plateau"
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phone?: string;
  company?: string;
  position?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}

export interface Folder {
  id: string;
  name: string;
  client_id: string;
  description?: string;
  status?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OfferPlate {
  id: string;
  title: string;
  description?: string;
  folder_id: string;
  status: string;
  total?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Quote {
  id: string;
  title: string;
  description?: string;
  folder_id?: string;
  offer_plate_id?: string;
  status: string;
  total: number;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  offerPlateId: string;
  quantity: number;
}

export interface Payment {
  id: string;
  userId: string;
  amount: number;
  status: string;
  createdAt: string;
}

export interface Campaign {
  id: string;
  name: string;
  description?: string;
  objectives?: string;
  startDate: string;
  endDate: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  company?: string;
  position?: string;
  status: string;
  campaignId: string;
  createdAt: string;
  updatedAt: string;
  assignedTo?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: UserRole;
  };
}

export interface LeadNote {
  id: string;
  leadId: string;
  agentId: string;
  content: string;
  createdAt: string;
}

export interface LeadTask {
  id: string;
  leadId: string;
  agentId: string;
  title: string;
  description?: string;
  dueDate?: string;
  due_date?: string;
  status: string;
  createdAt: string;
}
