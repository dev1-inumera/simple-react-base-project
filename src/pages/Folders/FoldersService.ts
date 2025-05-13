
import { supabase } from '@/integrations/supabase/client';
import { Folder, OfferPlate, Quote } from '@/types';

// Get user folders
export const fetchUserFolders = async (userId: string): Promise<Folder[]> => {
  const { data, error } = await supabase
    .from('folders')
    .select('*')
    .or(`agent_id.eq.${userId},client_id.eq.${userId}`)
    .order('created_at', { ascending: false });

  if (error) throw error;
  
  return data.map(mapFolder);
};

// Get a single folder
export const fetchFolderById = async (folderId: string): Promise<Folder> => {
  const { data, error } = await supabase
    .from('folders')
    .select('*')
    .eq('id', folderId)
    .single();

  if (error) throw error;
  
  return mapFolder(data);
};

// Get offer plates for a folder
export const fetchFolderOfferPlates = async (folderId: string): Promise<OfferPlate[]> => {
  const { data, error } = await supabase
    .from('offer_plates')
    .select('*')
    .eq('folder_id', folderId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  
  return data.map(mapOfferPlate);
};

// Get quotes for a folder
export const fetchFolderQuotes = async (folderId: string): Promise<Quote[]> => {
  const { data, error } = await supabase
    .from('quotes')
    .select('*')
    .eq('folder_id', folderId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  
  return data.map(mapQuote);
};

// Data mapping functions
export const mapFolder = (data: any): Folder => ({
  id: data.id,
  name: data.name,
  clientId: data.client_id,
  agentId: data.agent_id,
  createdAt: data.created_at,
  updatedAt: data.updated_at,
  quoteId: data.quote_id,
});

export const mapOfferPlate = (data: any): OfferPlate => ({
  id: data.id,
  name: data.name,
  agentId: data.agent_id,
  clientId: data.client_id,
  folderId: data.folder_id,
  status: data.status,
  createdAt: data.created_at,
  updatedAt: data.updated_at,
  sentAt: data.sent_at,
  sentMethod: data.sent_method,
});

export const mapQuote = (data: any): Quote => ({
  id: data.id,
  agentId: data.agent_id,
  clientId: data.client_id,
  offerPlateId: data.offer_plate_id,
  status: data.status,
  paymentStatus: data.payment_status,
  totalAmount: data.total_amount,
  createdAt: data.created_at,
  updatedAt: data.updated_at,
});
