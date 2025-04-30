
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // 🔁 Gère les requêtes OPTIONS (pré-vol CORS)
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // 📥 Lecture du corps de la requête
    const reqBody = await req.json();
    console.log("📨 Données reçues :", JSON.stringify(reqBody, null, 2));

    const {
      amount,
      clientName,
      clientEmail = "",
      apiKey,
      change = { currency: "EUR", rate: 1 },
      failureUrl,
      successUrl,
      callbackUrl,
      notificationUrl,
      description = "i-numera",
      methods = ["ORANGE_MONEY", "MVOLA", "VISA"],
      message = "i-numera",
      validDuration = 4,
      reference = `quote-${Date.now()}`
    } = reqBody;

    // ❌ Vérif des champs obligatoires
    if (!amount || !clientName || !apiKey) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const origin = req.headers.get("origin") || "http://localhost:3000";
    const baseUrl = origin.replace(/\/$/, ''); // Remove trailing slash if any

    // 🧱 Construction du payload de la requête vers PAPI
    const requestBody = {
      change: change,
      amount: amount, // Use the amount directly as passed from the client
      failureUrl: failureUrl || `${baseUrl}/payment/failure`,
      successUrl: successUrl || `${baseUrl}/payment/success`,
      callbackUrl: callbackUrl || `${baseUrl}/payment/callback`,
      notificationUrl: notificationUrl,
      clientName: clientName,
      clientEmail: clientEmail,
      description: description,
      methods: methods,
      message: message,
      validDuration: validDuration,
      reference: reference
    };

    // 📝 Log du payload final envoyé à l'API (sans afficher l'API key)
    console.log("🚀 Payload envoyé à l'API PAPI:", JSON.stringify(requestBody, null, 2));

    // 🔗 Envoi vers l'API PAPI avec le format d'authentification correct
    const response = await fetch("https://app.papi.mg/dashboard/api/payment-links", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Token": apiKey,
      },
      body: JSON.stringify(requestBody),
    });

    console.log("📡 Statut réponse API:", response.status);

    // 🧾 Lecture du corps brut de la réponse
    const responseText = await response.text();
    console.log("📄 Réponse brute de l'API:", responseText);

    // 🧠 Tentative de parse JSON
    let responseData;
    try {
      responseData = JSON.parse(responseText);
      console.log("✅ Réponse JSON parsée:", JSON.stringify(responseData, null, 2));
    } catch (parseError) {
      console.error("❌ Échec du parse JSON:", parseError);
      return new Response(
        JSON.stringify({
          error: "Invalid response from payment API",
          details: responseText.substring(0, 200) + "..."
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(JSON.stringify(responseData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("🔥 Erreur serveur:", error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
