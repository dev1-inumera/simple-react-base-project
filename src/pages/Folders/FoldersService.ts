import { supabase } from "@/integrations/supabase/client";
import { Folder, OfferPlate, Quote } from "@/types";
import { mapFolders, mapFolder, mapOfferPlates, mapQuotes } from "@/utils/dataMapper";

export const fetchFolders = async (userId: string, isAgent: boolean) => {
  try {
    let query = supabase.from("folders").select(`
      id,
      name,
      client_id,
      agent_id,
      created_at
    `);

    // Filter based on user role
    if (isAgent) {
      query = query.eq("agent_id", userId);
    } else {
      query = query.eq("client_id", userId);
    }

    const { data, error } = await query.order("created_at", { ascending: false });
    
    if (error) throw error;
    return mapFolders(data);
  } catch (error) {
    console.error("Error fetching folders:", error);
    throw error;
  }
};

export const fetchOfferPlatesForFolder = async (folderId: string) => {
  try {
    const { data, error } = await supabase
      .from("offer_plates")
      .select(`
        id,
        name,
        client_id,
        agent_id,
        status,
        created_at
      `)
      .eq("folder_id", folderId)
      .neq("status", "draft")
      .order("created_at", { ascending: false });
    
    if (error) throw error;
    return mapOfferPlates(data);
  } catch (error) {
    console.error("Error fetching offer plates:", error);
    throw error;
  }
};

export const fetchQuotesForFolder = async (folderId: string) => {
  try {
    // First get the folder to get client_id and agent_id
    const { data: folder, error: folderError } = await supabase
      .from("folders")
      .select("client_id, agent_id")
      .eq("id", folderId)
      .single();
    
    if (folderError) throw folderError;
    
    // Then get all quotes for this client-agent pair
    const { data, error } = await supabase
      .from("quotes")
      .select(`
        id,
        offer_plate_id,
        client_id,
        agent_id,
        status,
        total_amount,
        payment_status,
        created_at
      `)
      .eq("client_id", folder.client_id)
      .eq("agent_id", folder.agent_id)
      .order("created_at", { ascending: false });
    
    if (error) throw error;
    return mapQuotes(data);
  } catch (error) {
    console.error("Error fetching quotes:", error);
    throw error;
  }
};

export const createFolder = async (name: string, clientId: string, agentId: string) => {
  try {
    const { data, error } = await supabase
      .from("folders")
      .insert({
        name,
        client_id: clientId,
        agent_id: agentId
      })
      .select()
      .single();
    
    if (error) throw error;
    return mapFolder(data);
  } catch (error) {
    console.error("Error creating folder:", error);
    throw error;
  }
};

export const fetchClientProfiles = async () => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, first_name, last_name, email")
      .eq("role", "client");
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching client profiles:", error);
    throw error;
  }
};
