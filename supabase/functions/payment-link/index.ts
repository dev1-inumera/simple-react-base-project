
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
    const requestData = await req.json();
    const { quoteId, totalAmount, clientEmail } = requestData;

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
    console.log("Request data received:", JSON.stringify(requestData, null, 2));

    // Ensure we have a valid origin
    if (!origin) {
      console.error("No origin in request headers");
      return new Response(
        JSON.stringify({ error: "Origin header is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

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
        "Accept": "application/json"
      },
      body: JSON.stringify(paymentPayload),
    });

    // Check if the response is valid JSON
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.error("Non-JSON response received:", await response.text());
      return new Response(
        JSON.stringify({ error: "Invalid response from payment API" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const data = await response.json();
    console.log("Payment API response:", data);

    // Check if the response indicates an error
    if (!response.ok) {
      console.error("Error from payment API:", data);
      return new Response(
        JSON.stringify({ error: data.message || "Payment API error" }),
        {
          status: response.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

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
