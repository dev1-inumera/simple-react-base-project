
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
    // Get the quoteId from the URL
    const url = new URL(req.url);
    const pathSegments = url.pathname.split('/');
    const quoteId = pathSegments[pathSegments.length - 1];

    if (!quoteId) {
      return new Response(
        JSON.stringify({ error: "Quote ID is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Get payment status from request body
    const { status } = await req.json();

    if (!status) {
      return new Response(
        JSON.stringify({ error: "Payment status is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') as string;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') as string;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Update quote payment status
    if (status === 'success') {
      const { error } = await supabase
        .from('quotes')
        .update({ payment_status: 'Payé' })
        .eq('id', quoteId);

      if (error) {
        throw new Error(`Failed to update quote: ${error.message}`);
      }
    }

    return new Response(
      JSON.stringify({ success: true, message: "Payment status updated" }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
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
