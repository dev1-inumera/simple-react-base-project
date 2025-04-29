
import { supabase } from "@/integrations/supabase/client";
import { mapOffers, mapCartItems } from "@/utils/dataMapper";
import { User, Offer, CartItem, OfferPlate, UserRole } from "@/types";

export const createOfferPlate = async (
  name: string, 
  agentId: string, 
  clientId: string, 
  items: CartItem[],
  folderId?: string
) => {
  try {
    // Si aucun dossier n'est fourni, en créer un nouveau
    let folderData;
    if (!folderId) {
      const { data: newFolder, error: folderError } = await supabase
        .from('folders')
        .insert({
          name: `Dossier pour ${name}`,
          agent_id: agentId,
          client_id: clientId
        })
        .select()
        .single();

      if (folderError) throw folderError;
      folderData = newFolder;
      folderId = newFolder.id;
    }

    // Créer la plaquette d'offres
    const { data: offerPlateData, error: offerPlateError } = await supabase
      .from('offer_plates')
      .insert({
        name,
        agent_id: agentId,
        client_id: clientId,
        status: 'draft',
        folder_id: folderId
      })
      .select()
      .single();

    if (offerPlateError) throw offerPlateError;

    // Insérer les items de la plaquette
    const itemsToInsert = items.map(item => ({
      offer_plate_id: offerPlateData.id,
      offer_id: item.offerId,
      quantity: item.quantity
    }));

    const { error: itemsError } = await supabase
      .from('offer_plate_items')
      .insert(itemsToInsert);

    if (itemsError) throw itemsError;

    return {
      offerPlate: offerPlateData,
      folder: folderData
    };
  } catch (error) {
    console.error("Erreur lors de la création de la plaquette d'offres :", error);
    throw error;
  }
};

export const fetchClientProfiles = async (): Promise<User[]> => {
  try {
    // Corrected query: The profiles table doesn't have an 'email' column
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        id,
        first_name,
        last_name,
        role,
        created_at
      `)
      .eq('role', 'client');
    
    if (error) throw error;
    
    // Generate a placeholder email since email is not in the profiles table
    return data.map(profile => ({
      id: profile.id,
      email: `${profile.first_name?.toLowerCase() || ''}${profile.last_name?.toLowerCase() || ''}@example.com`, // Placeholder email
      firstName: profile.first_name || '',
      lastName: profile.last_name || '',
      role: UserRole.CLIENT,
      createdAt: profile.created_at || new Date().toISOString()
    }));
  } catch (error) {
    console.error("Erreur lors de la récupération des clients :", error);
    throw error;
  }
};

export const sendOfferPlateThroughPlatform = async (
  offerPlateId: string, 
  clientId: string
) => {
  try {
    const { error } = await supabase
      .from('offer_plates')
      .update({
        status: 'sent', 
        sent_at: new Date().toISOString(),
        sent_method: 'platform',
        client_id: clientId
      })
      .eq('id', offerPlateId);

    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error("Erreur lors de l'envoi de la plaquette :", error);
    throw error;
  }
};

export const fetchOfferPlateDetails = async (offerPlateId: string) => {
  try {
    const { data, error } = await supabase
      .from('offer_plates')
      .select(`
        id, 
        name, 
        status, 
        agent_id,
        client_id,
        folder_id,
        offer_plate_items (
          quantity,
          offers (
            id, 
            name, 
            description, 
            price_monthly, 
            setup_fee, 
            category
          )
        )
      `)
      .eq('id', offerPlateId)
      .single();

    if (error) throw error;

    return {
      ...data,
      items: data.offer_plate_items.map(item => ({
        offerId: item.offers.id,
        offer: item.offers,
        quantity: item.quantity
      }))
    };
  } catch (error) {
    console.error("Erreur lors de la récupération des détails de la plaquette :", error);
    throw error;
  }
};

export const fetchOfferPlatesForFolder = async (folderId: string) => {
  try {
    const { data, error } = await supabase
      .from('offer_plates')
      .select(`
        id,
        name,
        status,
        client_id,
        agent_id,
        created_at,
        folder_id
      `)
      .eq('folder_id', folderId);
    
    if (error) throw error;
    
    return data.map(plate => ({
      id: plate.id,
      name: plate.name,
      status: plate.status,
      clientId: plate.client_id,
      agentId: plate.agent_id,
      createdAt: plate.created_at,
      folderId: plate.folder_id
    }));
  } catch (error) {
    console.error("Erreur lors de la récupération des plaquettes d'offres :", error);
    throw error;
  }
};
