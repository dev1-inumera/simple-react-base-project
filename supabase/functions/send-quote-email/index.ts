
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import * as sendgrid from "npm:@sendgrid/mail@7.7.0";

// Initialize Resend as primary email provider
const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

// Initialize SendGrid as backup email provider
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
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      quoteId, 
      clientEmail, 
      clientName, 
      quoteAmount, 
      paymentLink 
    }: QuoteEmailRequest = await req.json();

    if (!clientEmail || !paymentLink) {
      throw new Error("Email du client ou lien de paiement manquant");
    }

    // Format the amount for display
    const formattedAmount = new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(quoteAmount);

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <img src="https://wprlkplzlhyrphbcaalc.supabase.co/storage/v1/object/public/assets/i-numera-logo.png" alt="i-numera" style="display: block; margin: 20px auto; max-width: 200px;">
        
        <h1 style="color: #333; text-align: center;">Votre devis est approuvé</h1>
        
        <p>Bonjour ${clientName},</p>
        
        <p>Nous avons le plaisir de vous informer que votre devis #${quoteId.substring(0, 8)} d'un montant de ${formattedAmount} a été approuvé.</p>
        
        <p>Vous pouvez dès maintenant procéder au paiement en cliquant sur le bouton ci-dessous :</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${paymentLink}" style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Payer maintenant</a>
        </div>
        
        <p>Si vous avez des questions concernant ce devis ou le processus de paiement, n'hésitez pas à nous contacter.</p>
        
        <p>Cordialement,<br>L'équipe i-numera</p>
        
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #888; font-size: 12px;">
          <p>Ce message a été envoyé automatiquement, merci de ne pas y répondre directement.</p>
          <p>© ${new Date().getFullYear()} i-numera. Tous droits réservés.</p>
        </div>
      </div>
    `;

    // Try to send email via Resend first
    try {
      const emailResponse = await resend.emails.send({
        from: "i-numera <devis@i-numera.com>",
        to: [clientEmail],
        subject: `Votre devis #${quoteId.substring(0, 8)} est approuvé`,
        html: htmlContent,
      });

      console.log("Email sent successfully via Resend:", emailResponse);

      return new Response(JSON.stringify({ success: true, provider: "resend", data: emailResponse }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } catch (resendError) {
      // If Resend fails, try SendGrid as backup
      console.error("Resend failed, trying SendGrid:", resendError);
      
      try {
        const msg = {
          to: clientEmail,
          from: 'devis@i-numera.com',
          subject: `Votre devis #${quoteId.substring(0, 8)} est approuvé`,
          html: htmlContent,
        };
        
        await sgMail.send(msg);
        
        console.log("Email sent successfully via SendGrid");
        
        return new Response(JSON.stringify({ success: true, provider: "sendgrid" }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } catch (sendgridError) {
        console.error("Both email providers failed:", sendgridError);
        throw new Error("Les deux fournisseurs d'e-mail ont échoué");
      }
    }
  } catch (error: any) {
    console.error("Error in send-quote-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
