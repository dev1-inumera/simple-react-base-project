
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import * as sendgrid from "npm:@sendgrid/mail@7.7.0";

// Initialize SendGrid
const sgMail = sendgrid.default;
sgMail.setApiKey(Deno.env.get("SENDGRID_API_KEY") || "");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface QuoteEmailRequest {
  quoteId: string;
  clientEmail: string;
  clientName: string;
  quoteAmount: number;
  paymentLink: string;
  htmlContent?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("=== Fonction send-quote-email démarrée ===");
    
    // Parse request body
    const requestData = await req.json();
    console.log("Données reçues (brut):", JSON.stringify(requestData, null, 2));
    
    const { 
      quoteId, 
      clientEmail, 
      clientName, 
      quoteAmount, 
      paymentLink,
      htmlContent 
    } = requestData as QuoteEmailRequest;

    console.log("Données extraites:", { 
      quoteId, 
      clientEmail, 
      clientName, 
      quoteAmount, 
      paymentLinkExists: !!paymentLink,
      htmlContentExists: !!htmlContent
    });

    // Validate required fields
    if (!clientEmail) {
      console.error("Email client manquant");
      throw new Error("Email du client manquant");
    }
    
    if (!paymentLink) {
      console.error("Lien de paiement manquant");
      throw new Error("Lien de paiement manquant");
    }

    // Format the amount for display
    const formattedAmount = new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(quoteAmount);
    
    // Use the complete HTML content with the quote design for the email body
    const emailHtml = htmlContent || `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333; text-align: center;">Votre devis est approuvé</h1>
        <p>Bonjour ${clientName},</p>
        <p>Nous avons le plaisir de vous informer que votre devis #${quoteId.substring(0, 8)} d'un montant de ${formattedAmount} a été approuvé.</p>
        <p>Vous pouvez dès maintenant procéder au paiement en cliquant sur le bouton ci-dessous :</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${paymentLink}" style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Payer maintenant</a>
        </div>
        <p>Si vous avez des questions concernant ce devis ou le processus de paiement, n'hésitez pas à nous contacter.</p>
        <p>Cordialement,<br>L'équipe i-numera</p>
      </div>
    `;

    console.log("Email préparé, tentative d'envoi à:", clientEmail);
    
    try {
      // Préparer l'email
      const msg = {
        to: clientEmail,
        from: 'devis@i-numera.com',
        subject: `Votre devis #${quoteId.substring(0, 8)} est approuvé`,
        html: emailHtml,
      };
      
      console.log("Message préparé:", {
        to: msg.to,
        from: msg.from,
        subject: msg.subject,
        htmlLength: msg.html.length
      });
      
      // Envoi via SendGrid
      await sgMail.send(msg);
      console.log("Email envoyé avec succès via SendGrid");
      
      return new Response(JSON.stringify({ 
        success: true, 
        provider: "sendgrid",
        sentTo: clientEmail
      }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } catch (sendgridError: any) {
      console.error("Erreur SendGrid:", sendgridError);
      console.error("Détails de l'erreur:", JSON.stringify(sendgridError.response?.body || {}, null, 2));
      throw new Error(`Erreur d'envoi d'email: ${sendgridError.message}`);
    }
  } catch (error: any) {
    console.error("Erreur générale dans la fonction send-quote-email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
