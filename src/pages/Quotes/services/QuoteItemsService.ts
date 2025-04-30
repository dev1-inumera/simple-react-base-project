
import { supabase } from "@/integrations/supabase/client";
import { CartItem } from "@/types";
import { mapCartItems, mapOfferPlates } from "@/utils/dataMapper";

/**
 * Service for handling quote items and offer plates
 */

export const fetchQuoteItems = async (offerPlateId: string) => {
  try {
    const { data, error } = await supabase
      .from("offer_plate_items")
      .select(`
        id,
        quantity,
        offer_id,
        offers (
          id,
          name,
          description,
          price_monthly,
          setup_fee,
          category,
          image_url
        )
      `)
      .eq("offer_plate_id", offerPlateId);
    
    if (error) throw error;
    
    return mapCartItems(data);
  } catch (error) {
    console.error("Error fetching quote items:", error);
    throw error;
  }
};

export const fetchOfferPlatesWithoutQuotes = async (userId: string, isAgent: boolean) => {
  try {
    let query = supabase.from("offer_plates")
      .select(`
        id,
        name,
        client_id,
        agent_id,
        status,
        created_at
      `)
      .neq("status", "draft");
    
    if (isAgent) {
      query = query.eq("agent_id", userId);
    } else {
      query = query.eq("client_id", userId);
    }
    
    const { data: offerPlates, error: offerPlatesError } = await query;
    
    if (offerPlatesError) throw offerPlatesError;
    
    // Get all quotes for these offer plates
    const { data: quotes, error: quotesError } = await supabase
      .from("quotes")
      .select("offer_plate_id");
    
    if (quotesError) throw quotesError;
    
    // Filter out offer plates that already have quotes
    const offerPlateIdsWithQuotes = quotes.map((q: any) => q.offer_plate_id);
    
    const platesWithoutQuotes = offerPlates.filter(
      (plate: any) => !offerPlateIdsWithQuotes.includes(plate.id)
    );
    
    return mapOfferPlates(platesWithoutQuotes);
  } catch (error) {
    console.error("Error fetching offer plates without quotes:", error);
    throw error;
  }
};
