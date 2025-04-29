
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
    const reqBody = await req.json();
    const { 
      quoteId, 
      totalAmount, 
      clientEmail, 
      change, 
      amount, 
      failureUrl, 
      successUrl, 
      callbackUrl, 
      paymentDescription, 
      methods, 
      message 
    } = reqBody;

    console.log("Request received with data:", JSON.stringify(reqBody, null, 2));

    if (!quoteId || !totalAmount || !clientEmail) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const origin = req.headers.get("origin") || "http://localhost:3000";
    
    // Create the payment link request body
    const requestBody = {
      change: change || { currency: "EUR", rate: 1 },
      amount: amount || totalAmount,
      failureUrl: failureUrl || `${origin}/payment/failure?quoteId=${quoteId}`,
      successUrl: successUrl || `${origin}/payment/success?quoteId=${quoteId}`,
      callbackUrl: callbackUrl || `${origin}/payment/callback/${quoteId}`,
      clientEmail: clientEmail,
      paymentDescription: paymentDescription || "Plaquette d'offres",
      methods: methods || ["ORANGE_MONEY", "MVOLA", "VISA"],
      message: message || "Plaquette d'offres"
    };

    console.log("Sending payment request with body:", JSON.stringify(requestBody, null, 2));

    // Create the payment link
    const response = await fetch("https://app-staging.papi.mg/dashboard/api/payment-links", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    console.log("Response status:", response.status);
    
    let responseData;
    try {
      const responseText = await response.text();
      console.log("Raw response:", responseText);
      try {
        responseData = JSON.parse(responseText);
      } catch (parseError) {
        console.error("Failed to parse response as JSON:", parseError);
        return new Response(
          JSON.stringify({ 
            error: "Invalid response from payment API", 
            details: responseText.substring(0, 200) + "..." 
          }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
    } catch (textError) {
      console.error("Failed to get response text:", textError);
      return new Response(
        JSON.stringify({ error: "Failed to read response from payment API" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(JSON.stringify(responseData), {
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
