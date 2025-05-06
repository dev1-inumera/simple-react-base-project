
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const sendgridApiKey = Deno.env.get("SENDGRID_API_KEY");

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const { limit, before, after, query } = await req.json();
    
    // Build query params
    const queryParams = new URLSearchParams();
    
    // Add optional params with defaults
    queryParams.append("limit", limit?.toString() || "100");
    
    if (before) queryParams.append("before", before);
    if (after) queryParams.append("after", after);
    if (query) queryParams.append("query", query);
    
    // Make request to SendGrid Email Activity API
    const response = await fetch(`https://api.sendgrid.com/v3/messages?${queryParams.toString()}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${sendgridApiKey}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("SendGrid Activity API error:", errorData);
      throw new Error(`SendGrid Activity API returned ${response.status}: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    console.log("SendGrid activity data retrieved successfully");
    
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching SendGrid activity:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
