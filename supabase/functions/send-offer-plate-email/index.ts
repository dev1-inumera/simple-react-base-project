
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import * as sendgrid from "npm:@sendgrid/mail@7.7.0";

// Initialize SendGrid
const sgMail = sendgrid.default;
sgMail.setApiKey(Deno.env.get("SENDGRID_API_KEY") || "");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OfferPlateEmailRequest {
  offerPlateId: string;
  clientEmail: string;
  clientName: string;
  offerPlateName: string;
  agentName: string;
  items: {
    name: string;
    description: string;
    priceMonthly: number;
    setupFee: number;
    imageUrl?: string;
    quantity: number;
  }[];
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      offerPlateId, 
      clientEmail, 
      clientName, 
      offerPlateName,
      agentName,
      items 
    }: OfferPlateEmailRequest = await req.json();

    if (!clientEmail) {
      throw new Error("Email du client manquant");
    }

    // Generate items HTML
    let itemsHtml = '';
    let totalMonthly = 0;
    let totalSetup = 0;

    items.forEach(item => {
      const monthlyPrice = item.priceMonthly * item.quantity;
      const setupPrice = item.setupFee * item.quantity;
      
      totalMonthly += monthlyPrice;
      totalSetup += setupPrice;

      const formattedMonthlyPrice = new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR'
      }).format(monthlyPrice);

      const formattedSetupPrice = setupPrice > 0 ? new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR'
      }).format(setupPrice) : 'Gratuit';

      itemsHtml += `
        <div style="margin-bottom: 30px; border-bottom: 1px solid #eee; padding-bottom: 20px;">
          <div style="display: flex; align-items: center;">
            ${item.imageUrl ? 
              `<img src="${item.imageUrl}" alt="${item.name}" style="width: 80px; height: 80px; object-fit: cover; margin-right: 20px; border-radius: 8px;">` : 
              `<div style="width: 80px; height: 80px; background-color: #f5f5f5; margin-right: 20px; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #999;">i-numera</div>`
            }
            <div>
              <h3 style="margin: 0; color: #333; font-size: 18px;">${item.name} ${item.quantity > 1 ? `(x${item.quantity})` : ''}</h3>
              <p style="margin: 5px 0 0; color: #666; font-size: 14px;">${item.description.substring(0, 100)}${item.description.length > 100 ? '...' : ''}</p>
              <div style="margin-top: 10px;">
                <span style="background-color: #e8f5e9; color: #2e7d32; padding: 4px 8px; border-radius: 4px; font-size: 14px; font-weight: bold;">${formattedMonthlyPrice}/mois</span>
                ${setupPrice > 0 ? 
                  `<span style="background-color: #e3f2fd; color: #1565c0; padding: 4px 8px; border-radius: 4px; font-size: 14px; margin-left: 8px; font-weight: bold;">Frais d'installation: ${formattedSetupPrice}</span>` : 
                  `<span style="background-color: #e8f5e9; color: #2e7d32; padding: 4px 8px; border-radius: 4px; font-size: 14px; margin-left: 8px; font-weight: bold;">Installation gratuite</span>`
                }
              </div>
            </div>
          </div>
        </div>
      `;
    });

    const formattedTotalMonthly = new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(totalMonthly);

    const formattedTotalSetup = new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(totalSetup);

    const currentDate = new Date();
    const formattedDate = new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(currentDate);

    // Create responsive HTML email
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Nouvelle plaquette d'offres - i-numera</title>
      </head>
      <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f9f9f9; color: #333;">
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          <tr>
            <td style="padding: 0;">
              <!-- Header -->
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td style="background-color: #222; padding: 20px; text-align: center;">
                    <img src="https://wprlkplzlhyrphbcaalc.supabase.co/storage/v1/object/public/assets/i-numera-logo.png" alt="i-numera" style="height: 60px;">
                  </td>
                </tr>
              </table>
              
              <!-- Cover Image / Banner -->
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td>
                    <div style="background-color: #5b21b6; color: white; padding: 40px 20px; text-align: center;">
                      <h1 style="margin: 0; font-size: 28px; font-weight: bold;">Votre plaquette d'offres personnalisée</h1>
                      <p style="margin: 15px 0 0; font-size: 18px; opacity: 0.9;">${offerPlateName}</p>
                      <p style="margin: 8px 0 0; font-size: 14px; opacity: 0.7;">Créée le ${formattedDate}</p>
                    </div>
                  </td>
                </tr>
              </table>
              
              <!-- Main Content -->
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td style="padding: 30px 20px;">
                    <h2 style="margin: 0 0 20px; color: #222; font-size: 22px;">Cher(e) ${clientName},</h2>
                    
                    <p style="margin: 0 0 20px; line-height: 1.6; color: #444;">
                      Nous sommes ravis de vous présenter votre plaquette d'offres personnalisée préparée par ${agentName}. Cette sélection de services a été spécialement conçue pour répondre à vos besoins.
                    </p>
                    
                    <p style="margin: 0 0 30px; line-height: 1.6; color: #444;">
                      Voici un aperçu des services que nous vous proposons:
                    </p>

                    <!-- Services List -->
                    <div style="margin-bottom: 30px;">
                      ${itemsHtml}
                    </div>

                    <!-- Summary -->
                    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #f8f9fa; border-radius: 8px; margin-bottom: 30px;">
                      <tr>
                        <td style="padding: 20px;">
                          <h3 style="margin: 0 0 15px; font-size: 18px; color: #333;">Récapitulatif</h3>
                          <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                            <span style="color: #555;">Montant mensuel total:</span>
                            <span style="font-weight: bold; color: #2e7d32;">${formattedTotalMonthly}</span>
                          </div>
                          <div style="display: flex; justify-content: space-between;">
                            <span style="color: #555;">Frais d'installation totaux:</span>
                            <span style="font-weight: bold; color: #1565c0;">${formattedTotalSetup}</span>
                          </div>
                        </td>
                      </tr>
                    </table>

                    <!-- CTA Button -->
                    <div style="text-align: center; margin: 30px 0;">
                      <a href="${Deno.env.get("APP_URL") || "https://i-numera.com"}/offer-plates/${offerPlateId}" style="display: inline-block; background-color: #5b21b6; color: white; padding: 12px 25px; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 16px;">Voir la plaquette complète</a>
                    </div>
                    
                    <p style="margin: 30px 0 20px; line-height: 1.6; color: #444;">
                      N'hésitez pas à nous contacter pour toute question concernant cette proposition.
                    </p>
                    
                    <p style="margin: 0; line-height: 1.6; color: #444;">
                      Cordialement,<br>
                      L'équipe i-numera
                    </p>
                  </td>
                </tr>
              </table>
              
              <!-- Footer -->
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td style="background-color: #f5f5f5; padding: 20px; text-align: center; color: #777; font-size: 13px;">
                    <p style="margin: 0 0 10px;">© ${new Date().getFullYear()} i-numera - Tous droits réservés</p>
                    <p style="margin: 0;">Cet email vous a été envoyé suite à la création d'une plaquette d'offres pour votre compte.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    try {
      const msg = {
        to: clientEmail,
        from: 'plaquettes@i-numera.com',
        subject: `Votre plaquette d'offres : ${offerPlateName}`,
        html: htmlContent,
      };
      
      console.log("Tentative d'envoi via SendGrid:", msg);
      await sgMail.send(msg);
      console.log("Email envoyé avec succès via SendGrid");
      
      return new Response(JSON.stringify({ success: true, provider: "sendgrid" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } catch (sendgridError) {
      console.error("Erreur SendGrid:", sendgridError);
      throw new Error(`Erreur d'envoi d'email: ${sendgridError.message}`);
    }
  } catch (error: any) {
    console.error("Erreur dans la fonction send-offer-plate-email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
