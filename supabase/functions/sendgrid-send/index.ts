
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import * as sendgrid from "npm:@sendgrid/mail@7.7.0";

// Initialize SendGrid
const sgMail = sendgrid.default;
sgMail.setApiKey(Deno.env.get("SENDGRID_API_KEY") || "");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string;
  subject: string;
  html: string;
  from?: string;
  text?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, subject, html, text, from = "devis@i-numera.com" }: EmailRequest = await req.json();

    if (!to || !subject || !html) {
      throw new Error("Destinataire, sujet ou contenu HTML manquant");
    }

    const msg = {
      to,
      from,
      subject,
      html,
      text: text || "",
    };
    
    const [response] = await sgMail.send(msg);
    
    console.log("Email sent successfully via SendGrid:", response);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        id: response?.headers["x-message-id"] || Date.now().toString(),
        statusCode: response?.statusCode
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error in sendgrid-send function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.response?.body || null 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
