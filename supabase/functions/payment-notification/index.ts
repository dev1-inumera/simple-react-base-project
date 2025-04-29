
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.33.1';

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
    // Get request body
    const body = await req.json();
    console.log("Payment notification received:", body);

    const {
      paymentStatus,
      paymentMethod,
      amount,
      fee,
      clientName,
      description,
      merchantPaymentReference,
      paymentReference,
      notificationToken,
      quoteId = null
    } = body;

    // Validate required fields
    const requiredFields = ['paymentStatus', 'paymentMethod', 'amount', 'fee', 'clientName', 'description', 'merchantPaymentReference', 'paymentReference', 'notificationToken'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return new Response(
        JSON.stringify({
          error: `Missing required fields: ${missingFields.join(', ')}`,
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') as string;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') as string;
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase environment variables");
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Store payment notification
    const { data, error } = await supabase
      .from('payment_notifications')
      .insert({
        payment_status: paymentStatus,
        payment_method: paymentMethod,
        amount: amount,
        fee: fee,
        client_name: clientName,
        description: description,
        merchant_payment_reference: merchantPaymentReference,
        payment_reference: paymentReference,
        notification_token: notificationToken,
        quote_id: quoteId,
        processed: false
      });

    if (error) {
      console.error("Error storing payment notification:", error);
      throw new Error(`Error storing payment notification: ${error.message}`);
    }

    // If quoteId is provided and payment status is SUCCESS, update the quote payment status
    if (quoteId && paymentStatus === 'SUCCESS') {
      const { error: updateError } = await supabase
        .from('quotes')
        .update({ payment_status: 'Payé' })
        .eq('id', quoteId);

      if (updateError) {
        console.error("Error updating quote payment status:", updateError);
        // Continue execution even if quote update fails
        // We've already stored the notification
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Payment notification received and stored"
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    console.error("Error processing payment notification:", error);
    
    return new Response(
      JSON.stringify({
        error: error.message || "An error occurred processing the payment notification"
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
