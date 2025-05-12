
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@12.0.0?no-check";

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
    // Read request body
    const reqBody = await req.json();
    console.log("📨 Received payment request data:", JSON.stringify(reqBody, null, 2));

    const {
      amount,
      clientName,
      clientEmail = "",
      failureUrl,
      successUrl,
      callbackUrl,
      description = "i-numera",
      message = "i-numera",
      reference = `quote-${Date.now()}`
    } = reqBody;

    // Verify required fields
    if (!amount || !clientName) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const origin = req.headers.get("origin") || "http://localhost:3000";
    const baseUrl = origin.replace(/\/$/, ''); // Remove trailing slash if any

    // Initialize Stripe with the API key from env variables
    const stripe = new Stripe(Deno.env.get("STRIPE_API_KEY") || "", {
      apiVersion: "2022-11-15",
    });

    // Create a Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: description || "i-numera services",
              description: message || "",
            },
            unit_amount: Math.round(amount * 100), // Stripe uses cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: successUrl || `${baseUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: failureUrl || `${baseUrl}/payment/failure`,
      client_reference_id: reference,
      customer_email: clientEmail || undefined,
      metadata: {
        client_name: clientName,
        reference: reference
      }
    });

    console.log("🔗 Created Stripe checkout session:", session.id);
    
    return new Response(
      JSON.stringify({ 
        data: { 
          paymentLink: session.url,
          sessionId: session.id 
        }
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    console.error("🔥 Server error:", error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
