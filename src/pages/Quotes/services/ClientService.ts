
import { supabase } from "@/integrations/supabase/client";

/**
 * Service for handling client data related to quotes
 */

export const fetchClientByQuoteId = async (quoteId: string) => {
  try {
    // Fetch the quote to get the client_id
    const { data: quote, error: quoteError } = await supabase
      .from("quotes")
      .select("client_id")
      .eq("id", quoteId)
      .single();
    
    if (quoteError) throw quoteError;
    
    if (!quote.client_id) {
      throw new Error("Ce devis n'a pas de client associé");
    }
    
    // Get the client details from profiles
    const { data: clientProfile, error: clientProfileError } = await supabase
      .from("profiles")
      .select(`
        id,
        first_name,
        last_name,
        phone,
        company_name,
        email
      `)
      .eq("id", quote.client_id)
      .single();
    
    if (clientProfileError) throw clientProfileError;
    
    // Use email directly from profiles table
    return {
      id: clientProfile.id,
      first_name: clientProfile.first_name,
      last_name: clientProfile.last_name,
      email: clientProfile.email || "",
      phone: clientProfile.phone,
      company_name: clientProfile.company_name
    };
  } catch (error) {
    console.error("Error fetching client for quote:", error);
    throw error;
  }
};
