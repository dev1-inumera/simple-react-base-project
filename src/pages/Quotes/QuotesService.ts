import { supabase } from "@/integrations/supabase/client";
import { Quote, CartItem } from "@/types";
import { createNotification } from "@/services/NotificationService";
import { mapQuote, mapQuotes, mapCartItems, mapOfferPlates } from "@/utils/dataMapper";

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

    // Appel de l'envoi d'email si le statut déclenche l'action
    if (status === "approved") {
      await sendQuoteEmailWithPaymentLink(quoteId);
    }

    return true;
  } catch (error) {
    console.error("Erreur lors de la mise à jour du statut du devis :", error);
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

export const createPaymentInfo = async (paymentData: {
  quoteId: string;
  bankName: string;
  iban: string;
  bic: string;
}) => {
  try {
    const { data, error } = await supabase
      .from("payment_info")
      .insert({
        quote_id: paymentData.quoteId,
        bank_name: paymentData.bankName,
        iban: paymentData.iban,
        bic: paymentData.bic,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error creating payment info:", error);
    throw error;
  }
};

export const fetchPaymentInfoByQuoteId = async (quoteId: string) => {
  try {
    const { data, error } = await supabase
      .from("payment_info")
      .select("*")
      .eq("quote_id", quoteId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching payment info:", error);
    throw error;
  }
};

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
        address,
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
      address: clientProfile.address,
      company_name: clientProfile.company_name
    };
  } catch (error) {
    console.error("Error fetching client for quote:", error);
    throw error;
  }
};

export const createPaymentLink = async (
  amount: number,
  clientName: string,
  options: {
    clientEmail?: string,
    change?: {
      currency: string,
      rate: number,
    },
    failureUrl?: string,
    successUrl?: string,
    callbackUrl?: string,
    notificationUrl?: string,
    description?: string,
    methods?: string[],
    message?: string,
    validDuration?: number,
    reference?: string,
  } = {}
) => {
  try {
    const origin = window.location.origin;
    
    // This is the Papi API Key - normally it should be stored as a Supabase secret
    // and accessed only in the Edge Function
    const apiKey = "$2a$12$abjdxfghijtlmnopqrutwu8RVLPW4J3M9umNeC5rOrzo81WdnpEFy";
    
    // Use the amount directly without any conversion or normalization
    // This assumes the amount is already in the correct format expected by the payment API
    
    const { data, error } = await supabase.functions.invoke('payment-link', {
      body: { 
        amount: amount, // Use the amount directly as passed from QuoteDetailView
        clientName,
        clientEmail: options.clientEmail || "",
        apiKey,
        change: options.change || {
          currency: "EUR",
          rate: 1
        },
        failureUrl: options.failureUrl || `${origin}/payment/failure`,
        successUrl: options.successUrl || `${origin}/payment/success`,
        callbackUrl: options.callbackUrl || `${origin}/payment/callback`,
        notificationUrl: options.notificationUrl || `https://wprlkplzlhyrphbcaalc.supabase.co/functions/v1/payment-notification`,
        description: options.description || "i-numera",
        methods: options.methods || [
          "ORANGE_MONEY",
          "MVOLA",
          "VISA"
        ],
        message: options.message || "i-numera",
        validDuration: options.validDuration || 4,
        reference: options.reference || `quote-${Date.now()}`,
      }
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error creating payment link:", error);
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

// Add this new function to send quote emails with payment links
export const sendQuoteEmailWithPaymentLink = async (quoteId: string) => {
  try {
    // Fetch the required data for the email (client info, quote details, etc.)
    const [quoteDetails, clientData] = await Promise.all([
      fetchQuoteDetails(quoteId),
      fetchClientByQuoteId(quoteId)
    ]);
    
    if (!clientData || !clientData.email) {
      throw new Error("Les informations du client sont incomplètes ou indisponibles");
    }

    // Fetch items for the quote
    const quoteItems = await fetchQuoteItems(quoteDetails.offerPlateId);
    
    // Create a payment link for the quote
    const clientFullName = `${clientData.first_name || ""} ${clientData.last_name || ""}`.trim() || "Client";
    
    const totalAmount = quoteDetails.totalAmount || 0;
    
    // Récupérer les informations de paiement si elles existent
    const paymentInfo = await fetchPaymentInfoByQuoteId(quoteId).catch(() => null);
    
    // Generate a payment link using our payment API
    const paymentLinkResponse = await createPaymentLink(
      totalAmount,
      clientFullName,
      {
        clientEmail: clientData.email,
        description: `Devis #${quoteId.substring(0, 8)}`,
        failureUrl: `${window.location.origin}/payment/failure?quoteId=${quoteId}`,
        successUrl: `${window.location.origin}/payment/success?quoteId=${quoteId}`,
        reference: `quote-${quoteId}`
      }
    );
    
    if (!paymentLinkResponse?.data?.paymentLink) {
      throw new Error("Erreur lors de la création du lien de paiement");
    }
    
    const paymentLink = paymentLinkResponse.data.paymentLink;
    
    // Import the HTML generator to get the complete design
    const generateHTMLContent = (await import('../Quotes/components/QuoteHTML')).default;
    
    // Generate the HTML content with the exact same design as the preview
    const htmlContent = generateHTMLContent(
      {...quoteDetails, paymentLink}, // Pass paymentLink to the quote object
      quoteItems, 
      clientFullName,
      paymentInfo
    );

    console.log("Envoi d'email pour le devis:", quoteId);
    console.log("Email du client:", clientData.email);
    console.log("Lien de paiement généré:", paymentLink);
    
    // Send the email via our edge function with the complete HTML design
    const { data: emailResult, error: emailError } = await supabase.functions.invoke('send-quote-email', {
      body: {
        quoteId,
        clientEmail: clientData.email,
        clientName: clientFullName,
        quoteAmount: totalAmount,
        paymentLink,
        htmlContent // Pass the complete HTML design
      }
    });
    
    if (emailError) {
      console.error("Erreur lors de l'envoi de l'email:", emailError);
      throw emailError;
    }
    
    console.log("Résultat de l'envoi d'email:", emailResult);
    
    // Create notification for the client
    await createNotification(
      clientData.id,
      "Devis approuvé",
      "Votre devis a été approuvé et est prêt pour paiement. Un email vous a été envoyé avec un lien de paiement.",
      "success",
      `/quotes/${quoteId}`
    );
    
    return emailResult;
  } catch (error) {
    console.error("Error sending quote email:", error);
    throw error;
  }
};
