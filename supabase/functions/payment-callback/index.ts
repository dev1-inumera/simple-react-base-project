
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

  console.log("🚀 Payment callback function triggered");
  
  try {
    // Get the quoteId from the URL
    const url = new URL(req.url);
    const pathSegments = url.pathname.split('/');
    const quoteId = pathSegments[pathSegments.length - 1];

    console.log(`📝 Quote ID received: ${quoteId}`);
    
    if (!quoteId) {
      console.error("❌ No quote ID provided in URL");
      return new Response(
        JSON.stringify({ error: "Quote ID is required" }),
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
      console.error("❌ Missing Supabase environment variables");
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    console.log("🔌 Supabase client initialized");

    // Always update quote payment status to 'Payé'
    console.log(`✅ Updating quote ${quoteId} payment status to 'Payé'`);
    const { data, error } = await supabase
      .from('quotes')
      .update({ payment_status: 'Payé' })
      .eq('id', quoteId);

    if (error) {
      console.error(`❌ Failed to update quote: ${error.message}`);
      throw new Error(`Failed to update quote: ${error.message}`);
    }
    
    console.log("✅ Quote payment status successfully updated to 'Payé'");

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Payment status updated to Payé",
        quoteId
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("❌ Error:", error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
