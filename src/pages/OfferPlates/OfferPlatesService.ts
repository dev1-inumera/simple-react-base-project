
import { supabase } from "@/integrations/supabase/client";
import { Offer, CartItem, OfferPlate, Folder } from "@/types";
import { mapOfferPlates, mapOffers, mapFolders } from "@/utils/dataMapper";

export const fetchOfferPlateDetails = async (offerPlateId: string) => {
  try {
    const { data, error } = await supabase
      .from("offer_plates")
      .select(`
        id, 
        name, 
        status, 
        agent_id,
        client_id,
        folder_id,
        created_at,
        offer_plate_items (
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
            image_url,
            offer_features (
              feature
            )
          )
        )
      `)
      .eq("id", offerPlateId)
      .single();

    if (error) throw error;

    return {
      id: data.id,
      name: data.name,
      status: data.status,
      agentId: data.agent_id,
      clientId: data.client_id,
      folderId: data.folder_id,
      createdAt: data.created_at,
      items: data.offer_plate_items.map(item => ({
        id: item.id,
        offerId: item.offer_id,
        offer: {
          id: item.offers.id,
          name: item.offers.name,
          description: item.offers.description,
          priceMonthly: item.offers.price_monthly,
          setupFee: item.offers.setup_fee,
          category: item.offers.category,
          imageUrl: item.offers.image_url,
          isActive: true,
          features: item.offers.offer_features?.map(f => f.feature) || []
        },
        quantity: item.quantity
      }))
    };
  } catch (error) {
    console.error("Erreur lors de la récupération des détails de la plaquette:", error);
    throw error;
  }
};

export const fetchAllFolders = async (userId: string, isAgent: boolean) => {
  try {
    let query = supabase
      .from("folders")
      .select(`
        id,
        name,
        client_id,
        agent_id,
        created_at
      `);

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

export const updateOfferPlateItems = async (offerPlateId: string, items: CartItem[]) => {
  try {
    // D'abord, supprimez tous les articles existants
    await supabase
      .from('offer_plate_items')
      .delete()
      .eq('offer_plate_id', offerPlateId);
    
    // Ensuite, insérez les nouveaux articles
    const itemsToInsert = items.map(item => ({
      offer_plate_id: offerPlateId,
      offer_id: item.offerId,
      quantity: item.quantity,
      selected_extras: item.selectedExtras || {}
    }));

    const { error: insertError } = await supabase
      .from('offer_plate_items')
      .insert(itemsToInsert);

    if (insertError) throw insertError;
    
    return true;
  } catch (error) {
    console.error("Erreur lors de la mise à jour des articles de la plaquette :", error);
    throw error;
  }
};

export const createQuoteFromOfferPlate = async (offerPlateId: string) => {
  try {
    // Fetch offer plate details to get all necessary information
    const offerPlate = await fetchOfferPlateDetails(offerPlateId);
    
    // Calculate total amount
    const totalAmount = offerPlate.items.reduce(
      (total, item) => total + (item.offer.priceMonthly * item.quantity) + (item.offer.setupFee || 0),
      0
    );
    
    // Create the quote
    const { data: quote, error } = await supabase
      .from("quotes")
      .insert({
        offer_plate_id: offerPlateId,
        client_id: offerPlate.clientId,
        agent_id: offerPlate.agentId,
        status: "pending",
        total_amount: totalAmount
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: quote.id,
      offerPlateId: quote.offer_plate_id,
      clientId: quote.client_id,
      agentId: quote.agent_id,
      status: quote.status,
      totalAmount: quote.total_amount,
      createdAt: quote.created_at
    };
  } catch (error) {
    console.error("Error creating quote from offer plate:", error);
    throw error;
  }
};

export const createOfferPlateFromCart = async (
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
        status: 'sent',
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

    // Récupérer les informations sur l'agent et le client
    const [agentData, clientData] = await Promise.all([
      supabase
        .from('profiles')
        .select('first_name, last_name, email')
        .eq('id', agentId)
        .single(),
      supabase
        .from('profiles')
        .select('first_name, last_name, email')
        .eq('id', clientId)
        .single()
    ]);
    
    if (clientData.data?.email) {
      try {
        // Préparer les données pour l'email
        const agentName = `${agentData.data?.first_name || ""} ${agentData.data?.last_name || ""}`.trim();
        const clientName = `${clientData.data?.first_name || ""} ${clientData.data?.last_name || ""}`.trim();
        
        // Récupérer les détails complets des offres pour l'email
        const emailItems = await Promise.all(items.map(async item => {
          const { data: offerData } = await supabase
            .from('offers')
            .select('name, description, price_monthly, setup_fee, image_url')
            .eq('id', item.offerId)
            .single();
            
          return {
            name: offerData?.name || "",
            description: offerData?.description || "",
            priceMonthly: offerData?.price_monthly || 0,
            setupFee: offerData?.setup_fee || 0,
            imageUrl: offerData?.image_url,
            quantity: item.quantity
          };
        }));
        
        // Envoyer l'email de présentation
        await supabase.functions.invoke('send-offer-plate-email', {
          body: {
            offerPlateId: offerPlateData.id,
            clientEmail: clientData.data.email,
            clientName,
            offerPlateName: name,
            agentName,
            items: emailItems
          }
        });
        
        console.log("Email de plaquette envoyé avec succès");
      } catch (emailError) {
        console.error("Erreur lors de l'envoi de l'email de plaquette:", emailError);
        // On ne relance pas l'erreur pour ne pas bloquer la création de la plaquette
      }
    }

    return {
      offerPlate: offerPlateData,
      folder: folderData
    };
  } catch (error) {
    console.error("Erreur lors de la création de la plaquette d'offres :", error);
    throw error;
  }
};
