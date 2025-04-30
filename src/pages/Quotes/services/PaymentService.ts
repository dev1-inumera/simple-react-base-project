
import { supabase } from "@/integrations/supabase/client";

/**
 * Service for handling payment related operations
 */

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

export const createPaymentLink = async (
  
  amount: number,
  clientEmail: string,
  options: {
    change?: {
      currency: string,
      rate: number,
    },
    failureUrl?: string,
    successUrl?: string,
    callbackUrl?: string,
    paymentDescription?: string,
    methods?: string[],
    message?: string,
  } = {}
) => {
  try {
    const origin = window.location.origin;
    const TOKEN = "$2a$12$abjdxfghijtlmnopqrutwu8RVLPW4J3M9umNeC5rOrzo81WdnpEFy";

    const payload = {
     
      amount: amount,
      clientEmail,
      change: options.change || { currency: "EUR", rate: 1 },
      failureUrl: options.failureUrl || `${origin}/payment/failure?quoteId=${quoteId}`,
      successUrl: options.successUrl || `${origin}/payment/success?quoteId=${quoteId}`,
      callbackUrl: options.callbackUrl || `${origin}/payment/callback/${quoteId}`,
      paymentDescription: options.paymentDescription || "Plaquette d'offres",
      methods: options.methods || ["ORANGE_MONEY", "MVOLA", "VISA"],
      message: options.message || "i-numera",
      notificationUrl: "https://wprlkplzlhyrphbcaalc.supabase.co/functions/v1/payment-notification"
    };

    const response = await fetch(
      "https://wprlkplzlhyrphbcaalc.supabase.co/functions/v1/payment-link",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${TOKEN}`
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.error || "Erreur lors de la création du lien de paiement.");
    }

    return data;
  } catch (error) {
    console.error("Error creating payment link:", error);
    throw error;
  }
};
