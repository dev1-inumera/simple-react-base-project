import { supabase } from "@/integrations/supabase/client";
import { CartItem } from "@/types";
import { mapCartItems } from "@/utils/dataMapper";
import { createOfferPlateFromCart } from "@/pages/OfferPlates/OfferPlatesService";
import { createNotification } from "@/services/NotificationService";

export const fetchCartItems = async (userId: string) => {
  try {
    const { data: carts, error: cartError } = await supabase
      .from("offer_plates")
      .select("*")
      .eq("client_id", userId)
      .eq("status", "draft");
    
    if (cartError) throw cartError;
    if (!carts || carts.length === 0) return [];
    
    const cart = carts[0];
    
    const { data: cartItems, error: itemsError } = await supabase
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
          is_active,
          category,
          image_url
        )
      `)
      .eq("offer_plate_id", cart.id);
    
    if (itemsError) throw itemsError;
    
    return mapCartItems(cartItems);
  } catch (error) {
    console.error("Error fetching cart items:", error);
    throw error;
  }
};

export const updateCartItemQuantity = async (itemId: string, quantity: number, selectedExtras: Record<string, number> = {}) => {
  try {
    const { error } = await supabase
      .from("offer_plate_items")
      .update({ 
        quantity,
        selected_extras: selectedExtras
      })
      .eq("id", itemId);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error updating cart item quantity:", error);
    throw error;
  }
};

export const removeCartItem = async (itemId: string) => {
  try {
    const { error } = await supabase
      .from("offer_plate_items")
      .delete()
      .eq("id", itemId);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error removing cart item:", error);
    throw error;
  }
};

export const createOfferPlate = async (userId: string, name: string = "Plaquette d'offres", folderId?: string) => {
  try {
    const { data: carts, error: cartError } = await supabase
      .from("offer_plates")
      .select("*")
      .eq("client_id", userId)
      .eq("status", "draft");
    
    if (cartError) throw cartError;
    if (!carts || carts.length === 0) throw new Error("Votre panier est vide");
    
    const cart = carts[0];
    
    const cartItems = await fetchCartItems(userId);
    
    if (cartItems.length === 0) throw new Error("Votre panier est vide");
    
    const { data: user, error: userError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single();
      
    if (userError) throw userError;
    
    let agentId = userId;
    let clientId = userId;
    
    if (user.role === 'agent' || user.role === 'admin') {
      agentId = userId;
      const { data: clients, error: clientsError } = await supabase
        .from("profiles")
        .select("id")
        .eq("role", "client")
        .limit(1);
        
      if (!clientsError && clients && clients.length > 0) {
        clientId = clients[0].id;
      }
    } else {
      const { data: agents, error: agentsError } = await supabase
        .from("profiles")
        .select("id")
        .eq("role", "agent")
        .limit(1);
        
      if (!agentsError && agents && agents.length > 0) {
        agentId = agents[0].id;
      }
    }
    
    const actualFolderId = folderId === "new" ? undefined : folderId;
    
    const result = await createOfferPlateFromCart(name, agentId, clientId, cartItems, actualFolderId);
    
    const { error: deleteError } = await supabase
      .from("offer_plate_items")
      .delete()
      .eq("offer_plate_id", cart.id);
      
    if (deleteError) throw deleteError;
    
    await createNotification(
      clientId,
      "Nouvelle plaquette d'offres",
      `Une nouvelle plaquette d'offres "${name}" a été créée.`,
      "info",
      `/offer-plates/${result.offerPlate.id}`
    );
    
    if (agentId !== clientId) {
      await createNotification(
        agentId,
        "Nouvelle plaquette d'offres",
        `Une nouvelle plaquette d'offres "${name}" a été créée pour un client.`,
        "info",
        `/offer-plates/${result.offerPlate.id}`
      );
    }
    
    return result.offerPlate;
  } catch (error) {
    console.error("Error creating offer plate:", error);
    throw error;
  }
};
