
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowLeft } from 'lucide-react';
import { updateQuotePaymentStatus } from '../Quotes/QuotesService';
import { useToast } from '@/hooks/use-toast';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const quoteId = searchParams.get('quoteId');
  const sessionId = searchParams.get('session_id'); // Stripe returns session_id
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(true);

  useEffect(() => {
    const updatePaymentStatus = async () => {
      if (!quoteId && !sessionId) {
        setIsUpdating(false);
        toast({
          title: "Paiement réussi",
          description: "Votre paiement a été traité avec succès.",
        });
        return;
      }
      
      try {
        // If we have a quoteId, update it directly
        if (quoteId) {
          await updateQuotePaymentStatus(quoteId, "Payé");
        } else if (sessionId) {
          // If we only have sessionId, we should verify the payment with Stripe
          // and find the associated quote (this would require additional API call)
          console.log("Stripe session ID received:", sessionId);
          // Future enhancement: Verify payment status with Stripe API
        }
        
        // Send payment notification to our endpoint
        try {
          // Prepare payment notification data
          const notificationData = {
            paymentStatus: 'SUCCESS',
            paymentMethod: 'STRIPE',
            amount: 0, // This would ideally come from the payment provider
            fee: 0,    // This would ideally come from the payment provider
            clientName: 'Client', // This would ideally come from the payment provider
            description: 'Quote payment',
            merchantPaymentReference: sessionId || `MREF-${Date.now()}`,
            paymentReference: `PREF-${Date.now()}`,
            notificationToken: `TOKEN-${Date.now()}`
          };
          
          await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/payment-notification`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(notificationData)
          });
        } catch (notificationError) {
          console.error("Error sending payment notification:", notificationError);
          // Continue even if notification fails, we've already updated the quote
        }
        
        setIsUpdating(false);
        toast({
          title: "Paiement réussi",
          description: "Votre paiement a été traité avec succès et votre devis a été mis à jour.",
        });
      } catch (error) {
        console.error("Error updating payment status:", error);
        setIsUpdating(false);
        toast({
          title: "Information",
          description: "Paiement réussi, mais le statut du devis n'a pas pu être mis à jour automatiquement.",
          variant: "destructive",
        });
      }
    };

    updatePaymentStatus();
  }, [quoteId, sessionId, toast]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md mx-auto mb-8">
        <img 
          src="/lovable-uploads/7250faee-48f7-4ce0-ad3e-ce5cbf2f4084.png" 
          alt="i-numa logo" 
          className="h-14 mx-auto"
        />
      </div>
      
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl">Paiement réussi</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-center text-muted-foreground">
            Votre paiement a été traité avec succès. Merci pour votre achat!
          </p>
          
          <div className="flex flex-col space-y-2">
            {quoteId && (
              <Button 
                onClick={() => navigate(`/quotes/${quoteId}`)} 
                className="w-full"
              >
                Voir mon devis
              </Button>
            )}
            <Button 
              variant="outline" 
              onClick={() => navigate('/')} 
              className="w-full"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour à l'accueil
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccess;
