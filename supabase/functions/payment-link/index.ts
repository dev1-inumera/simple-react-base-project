
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Get the request body
    const { quoteId, totalAmount, clientEmail } = await req.json();

    if (!quoteId || !totalAmount || !clientEmail) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Log the origin and other parameters for debugging
    const origin = req.headers.get("origin");
    console.log("Request origin:", origin);
    console.log("Sending payment link request with params:", { quoteId, totalAmount, clientEmail });

    // Prepare the full payload as required by the payment API
    const paymentPayload = {
      change: {
        currency: "EUR",
        rate: 1
      },
      amount: totalAmount,
      failureUrl: `${origin}/payment/failure?quoteId=${quoteId}`,
      successUrl: `${origin}/payment/success?quoteId=${quoteId}`,
      callbackUrl: `${origin}/payment/callback/${quoteId}`,
      clientEmail: clientEmail,
      paymentDescription: "Plaquette d'offres",
      methods: [
        "ORANGE_MONEY",
        "MVOLA",
        "VISA"
      ],
      message: "Plaquette d'offres"
    };

    console.log("Full payment payload:", JSON.stringify(paymentPayload, null, 2));

    // Create the payment link with the complete payload
    const response = await fetch("https://app-staging.papi.mg/dashboard/api/payment-links", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentPayload),
    });

    const data = await response.json();
    console.log("Payment API response:", data);

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
