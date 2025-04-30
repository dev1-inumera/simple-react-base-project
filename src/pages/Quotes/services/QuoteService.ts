
import { supabase } from "@/integrations/supabase/client";
import { Quote } from "@/types";
import { mapQuote, mapQuotes } from "@/utils/dataMapper";

/**
 * Core Quote CRUD operations
 */

export const fetchQuoteById = async (quoteId: string) => {
  try {
    const { data, error } = await supabase
      .from("quotes")
      .select(`
        id,
        offer_plate_id,
        agent_id,
        client_id,
        status,
        total_amount,
        payment_status,
        created_at
      `)
      .eq("id", quoteId)
      .single();
    
    if (error) throw error;
    
    return mapQuote(data);
  } catch (error) {
    console.error("Error fetching quote:", error);
    throw error;
  }
};

export const fetchQuotes = async (userId: string, isAgent: boolean, isAdmin: boolean) => {
  try {
    let query = supabase.from("quotes").select(`
      id,
      offer_plate_id,
      client_id,
      agent_id,
      status,
      total_amount,
      payment_status,
      created_at
    `);

    if (isAdmin) {
      // Admin can see all quotes
    } else if (isAgent) {
      query = query.eq("agent_id", userId);
    } else {
      query = query.eq("client_id", userId);
    }

    const { data, error } = await query.order("created_at", { ascending: false });
    
    if (error) throw error;
    return mapQuotes(data);
  } catch (error) {
    console.error("Error fetching quotes:", error);
    throw error;
  }
};

export const fetchQuoteDetails = async (quoteId: string) => {
  try {
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
        created_at,
        offer_plates (
          id,
          name
        )
      `)
      .eq("id", quoteId)
      .single();
    
    if (error) throw error;
    
    // Create a mapped quote with the mapped offer_plates
    const mappedQuote = mapQuote(data);
    return {
      ...mappedQuote,
      offer_plates: data.offer_plates // Keep original structure for this nested object
    };
  } catch (error) {
    console.error("Error fetching quote details:", error);
    throw error;
  }
};

export const createQuote = async (offerPlateId: string, totalAmount: number, clientId: string, agentId: string) => {
  try {
    const { data, error } = await supabase
      .from("quotes")
      .insert({
        offer_plate_id: offerPlateId,
        client_id: clientId,
        agent_id: agentId,
        total_amount: totalAmount,
      })
      .select()
      .single();
    
    if (error) throw error;
    return mapQuote(data);
  } catch (error) {
    console.error("Error creating quote:", error);
    throw error;
  }
};

export const updateQuoteStatus = async (quoteId: string, status: string) => {
  try {
    const { error } = await supabase
      .from("quotes")
      .update({ status })
      .eq("id", quoteId);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error updating quote status:", error);
    throw error;
  }
};

export const updateQuotePaymentStatus = async (quoteId: string, paymentStatus: string) => {
  try {
    const { error } = await supabase
      .from("quotes")
      .update({ payment_status: paymentStatus })
      .eq("id", quoteId);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error updating quote payment status:", error);
    throw error;
  }
};
