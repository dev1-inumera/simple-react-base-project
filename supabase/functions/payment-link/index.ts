
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
    const { quoteId, totalAmount, clientEmail, change, paymentDescription, message } = await req.json();

    if (!quoteId || !totalAmount || !clientEmail) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Create the payment link
    const response = await fetch("https://app-staging.papi.mg/dashboard/api/payment-links", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        change: change || {currency: "EUR",rate: 1},
        amount: totalAmount,
        failureUrl: `${req.headers.get("origin")}/payment/failure?quoteId=${quoteId}`,
        successUrl: `${req.headers.get("origin")}/payment/success?quoteId=${quoteId}`,
        callbackUrl: `${req.headers.get("origin")}/payment/callback/${quoteId}`,
        clientEmail: clientEmail,
        paymentDescription: paymentDescription || "Plaquette d'offres",
        methods: [
          "ORANGE_MONEY",
          "MVOLA",
          "VISA"
        ],
        message: message || "Plaquette d'offres"
      }),
    });

    const data = await response.json();

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
