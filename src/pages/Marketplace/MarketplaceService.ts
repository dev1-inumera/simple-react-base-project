
import { supabase } from "@/integrations/supabase/client";
import { Offer, OfferExtra } from "@/types";
import { mapOffers } from "@/utils/dataMapper";

export const fetchOffers = async (searchTerm?: string, category?: string) => {
  try {
    let query = supabase
      .from("offers")
      .select(`
        *,
        offer_features (
          id,
          feature
        ),
        offer_extras (
          id
        )
      `);

    if (searchTerm) {
      query = query.ilike("name", `%${searchTerm}%`);
    }

    if (category) {
      query = query.eq("category", category);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return mapOffers(data);
  } catch (error) {
    console.error("Error fetching offers:", error);
    throw error;
  }
};

export const fetchCategories = async () => {
  try {
    const { data, error } = await supabase
      .from("offers")
      .select("category")
      .order("category");

    if (error) {
      throw error;
    }

    // Remove duplicates
    const categories = [...new Set(data.map((item) => item.category))];
    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

export const fetchOfferExtras = async (offerId: string): Promise<OfferExtra[]> => {
  try {
    const { data, error } = await supabase
      .from('offer_extras')
      .select('*')
      .eq('offer_id', offerId);

    if (error) {
      throw error;
    }

    return data.map(extra => ({
      id: extra.id,
      name: extra.name,
      description: extra.description,
      unitPrice: Number(extra.unit_price) // Ensure unit_price is properly converted to number
    }));
  } catch (error) {
    console.error("Error fetching offer extras:", error);
    throw error;
  }
};

export const addToCart = async (
  offer: Offer, 
  quantity: number = 1, 
  userId: string, 
  selectedExtras: {[key: string]: number} = {}
) => {
  try {
    // Check if there's an existing cart (draft offer plate)
    const { data: existingCarts, error: cartError } = await supabase
      .from("offer_plates")
      .select("*")
      .eq("client_id", userId)
      .eq("status", "draft");
    
    if (cartError) throw cartError;
    
    // Create a new cart if none exists
    let cartId: string | undefined;
    
    if (!existingCarts || existingCarts.length === 0) {
      const { data: newCart, error: createError } = await supabase
        .from("offer_plates")
        .insert({
          client_id: userId,
          agent_id: userId, // In this case the client is the agent of their own cart
          name: "Mon panier",
          status: "draft"
        })
        .select()
        .single();
      
      if (createError) throw createError;
      cartId = newCart.id;
    } else {
      // Use the first cart if multiple draft carts exist
      cartId = existingCarts[0].id;
    }
    
    // Check if the offer already exists in the cart
    const { data: existingItems, error: itemError } = await supabase
      .from("offer_plate_items")
      .select("*")
      .eq("offer_plate_id", cartId)
      .eq("offer_id", offer.id);
    
    if (itemError) throw itemError;
    
    if (existingItems && existingItems.length > 0) {
      // Update quantity if item exists
      const existingItem = existingItems[0];
      const { error: updateError } = await supabase
        .from("offer_plate_items")
        .update({ quantity: existingItem.quantity + quantity })
        .eq("id", existingItem.id);
      
      if (updateError) throw updateError;
    } else {
      // Add new item if it doesn't exist
      const { error: addError } = await supabase
        .from("offer_plate_items")
        .insert({
          offer_plate_id: cartId,
          offer_id: offer.id,
          quantity
        });
      
      if (addError) throw addError;
    }
    
    // Process selected extras if any
    const extraEntries = Object.entries(selectedExtras);
    if (extraEntries.length > 0) {
      for (const [extraId, extraQuantity] of extraEntries) {
        if (extraQuantity > 0) {
          // For each selected extra with quantity > 0, add it to the cart
          const { error: extraError } = await supabase
            .from("offer_plate_items")
            .insert({
              offer_plate_id: cartId,
              offer_id: extraId, // Using the extra ID as the offer ID
              quantity: extraQuantity
            });
          
          if (extraError) {
            console.error("Error adding extra to cart:", extraError);
            // Continue with other extras even if one fails
          }
        }
      }
    }
    
    return true;
  } catch (error) {
    console.error("Error adding to cart:", error);
    throw error;
  }
};
