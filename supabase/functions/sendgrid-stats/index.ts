
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
    const { statsType, startDate, endDate, aggregatedBy, categories } = await req.json();
    
    // Default to global stats if not specified
    const endpoint = getStatsEndpoint(statsType);
    
    // Build query params
    const queryParams = new URLSearchParams();
    
    // Always include start and end dates
    if (startDate) queryParams.append("start_date", startDate);
    if (endDate) queryParams.append("end_date", endDate || new Date().toISOString().split('T')[0]);
    
    // Add optional params
    if (aggregatedBy) queryParams.append("aggregated_by", aggregatedBy);
    if (categories && categories.length > 0 && statsType === 'categories') {
      categories.forEach(category => queryParams.append("categories", category));
    }
    
    // Make request to SendGrid API
    const response = await fetch(`https://api.sendgrid.com/v3/stats${endpoint}?${queryParams.toString()}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${sendgridApiKey}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("SendGrid API error:", errorData);
      throw new Error(`SendGrid API returned ${response.status}: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    console.log("SendGrid stats retrieved successfully");
    
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching SendGrid statistics:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

// Helper function to determine the correct endpoint based on statsType
function getStatsEndpoint(statsType) {
  switch (statsType) {
    case 'global':
      return '';  // Base endpoint for global stats
    case 'categories':
      return '/categories';
    case 'browsers':
      return '/browsers';
    case 'devices':
      return '/devices';
    case 'clients':
      return '/clients';
    case 'geo':
      return '/geo';
    default:
      return '';  // Default to global stats
  }
}
