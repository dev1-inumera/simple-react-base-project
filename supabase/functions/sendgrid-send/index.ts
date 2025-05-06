
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import * as sendgrid from "npm:@sendgrid/mail@7.7.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, from, subject, text, html } = await req.json();

    // Suivre strictement l'exemple fourni
    const sgMail = sendgrid.default;
    sgMail.setApiKey(Deno.env.get("SENDGRID_API_KEY"));
    
    const msg = {
      to: to || 'test@example.com',
      from: from || 'devis@i-numera.com', // Utilisation de l'adresse par défaut du projet
      subject: subject || 'Sending with SendGrid is Fun',
      text: text || 'and easy to do anywhere, even with Node.js',
      html: html || '<strong>and easy to do anywhere, even with Node.js</strong>',
    };
    
    console.log("Attempting to send email with SendGrid:", msg);
    
    try {
      const response = await sgMail.send(msg);
      console.log('Email sent', response);
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Email sent successfully",
          response: response
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    } catch (error) {
      console.error("SendGrid error:", error);
      
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
  } catch (error) {
    console.error("Request processing error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
