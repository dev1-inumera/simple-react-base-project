
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { EmailService } from "@/services/EmailService";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2 } from "lucide-react";

const MailSend = () => {
  const { toast } = useToast();
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  // État pour l'onglet SendGrid
  const [sgToEmail, setSgToEmail] = useState("");
  const [sgSubject, setSgSubject] = useState("Test email from i-numera");
  const [sgHtmlContent, setSgHtmlContent] = useState("<h1>Bonjour!</h1><p>Ceci est un email de test depuis i-numera.</p>");

  // État pour l'onglet Quote Email
  const [quoteId, setQuoteId] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientName, setClientName] = useState("");
  const [quoteAmount, setQuoteAmount] = useState(100);
  const [paymentLink, setPaymentLink] = useState("https://example.com/payment");

  const handleSendSendgridEmail = async () => {
    if (!sgToEmail) {
      toast({
        title: "Erreur",
        description: "Veuillez fournir une adresse email de destination",
        variant: "destructive",
      });
      return;
    }

    try {
      setSending(true);
      setResult(null);

      const response = await EmailService.sendQuoteEmail({
        to: sgToEmail,
        subject: sgSubject,
        html: sgHtmlContent,
      });

      setResult({
        success: true,
        message: `Email envoyé avec succès! ID: ${response?.id || "N/A"}`,
      });

      toast({
        title: "Succès",
        description: "Email envoyé avec succès",
      });
    } catch (error: any) {
      setResult({
        success: false,
        message: `Erreur: ${error.message}`,
      });

      toast({
        title: "Erreur d'envoi",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const handleSendQuoteEmail = async () => {
    if (!clientEmail || !paymentLink) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }

    try {
      setSending(true);
      setResult(null);

      const { data, error } = await supabase.functions.invoke('send-quote-email', {
        body: {
          quoteId: quoteId || "test-" + Date.now().toString().substring(0, 8),
          clientEmail,
          clientName: clientName || "Client Test",
          quoteAmount: Number(quoteAmount),
          paymentLink
        }
      });

      if (error) throw new Error(error.message);

      setResult({
        success: true,
        message: `Email de devis envoyé avec succès! Provider: ${data?.provider || "N/A"}`,
      });

      toast({
        title: "Succès",
        description: "Email de devis envoyé avec succès",
      });
    } catch (error: any) {
      setResult({
        success: false,
        message: `Erreur: ${error.message}`,
      });

      toast({
        title: "Erreur d'envoi",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Outil de test d'envoi d'emails</h1>
      <p className="text-muted-foreground mb-8">
        Cette page est destinée aux développeurs pour tester les fonctionnalités d'envoi d'emails.
      </p>

      <Tabs defaultValue="sendgrid" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="sendgrid">SendGrid Direct</TabsTrigger>
          <TabsTrigger value="quote-email">Email de Devis</TabsTrigger>
        </TabsList>

        <TabsContent value="sendgrid" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tester l'envoi d'email via SendGrid</CardTitle>
              <CardDescription>
                Envoie un email directement via l'API SendGrid
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="toEmail">Email du destinataire *</Label>
                <Input
                  id="toEmail"
                  value={sgToEmail}
                  onChange={(e) => setSgToEmail(e.target.value)}
                  placeholder="exemple@email.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Sujet</Label>
                <Input
                  id="subject"
                  value={sgSubject}
                  onChange={(e) => setSgSubject(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="htmlContent">Contenu HTML</Label>
                <Textarea
                  id="htmlContent"
                  value={sgHtmlContent}
                  onChange={(e) => setSgHtmlContent(e.target.value)}
                  rows={8}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleSendSendgridEmail}
                disabled={sending}
              >
                {sending ? "Envoi en cours..." : "Envoyer l'email"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="quote-email" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tester l'email de devis</CardTitle>
              <CardDescription>
                Envoie un email de devis avec un lien de paiement
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="quoteId">ID du devis (optionnel)</Label>
                <Input
                  id="quoteId"
                  value={quoteId}
                  onChange={(e) => setQuoteId(e.target.value)}
                  placeholder="UUID du devis ou laissez vide pour générer un ID de test"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="clientEmail">Email du client *</Label>
                <Input
                  id="clientEmail"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="client@email.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="clientName">Nom du client</Label>
                <Input
                  id="clientName"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Nom du client"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quoteAmount">Montant du devis</Label>
                <Input
                  id="quoteAmount"
                  type="number"
                  value={quoteAmount}
                  onChange={(e) => setQuoteAmount(Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="paymentLink">Lien de paiement *</Label>
                <Input
                  id="paymentLink"
                  value={paymentLink}
                  onChange={(e) => setPaymentLink(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleSendQuoteEmail}
                disabled={sending}
              >
                {sending ? "Envoi en cours..." : "Envoyer l'email de devis"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {result && (
        <Alert className={`mt-6 ${result.success ? "bg-green-50" : "bg-red-50"}`}>
          {result.success ? (
            <CheckCircle2 className="h-5 w-5 text-green-600" />
          ) : (
            <AlertCircle className="h-5 w-5 text-red-600" />
          )}
          <AlertTitle>{result.success ? "Succès" : "Erreur"}</AlertTitle>
          <AlertDescription>
            {result.message}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default MailSend;
