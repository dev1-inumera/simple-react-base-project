
import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { XCircle, ArrowLeft } from 'lucide-react';

const PaymentFailure = () => {
  const [searchParams] = useSearchParams();
  const quoteId = searchParams.get('quoteId');
  const navigate = useNavigate();

  useEffect(() => {
    const sendFailureNotification = async () => {
      try {
        // Prepare notification data
        const notificationData = {
          paymentStatus: 'FAILED',
          paymentMethod: 'STRIPE',
          amount: 0, // This would ideally come from the payment provider
          fee: 0,    // This would ideally come from the payment provider
          clientName: 'Client', // This would ideally come from the payment provider
          description: 'Quote payment attempt failed',
          merchantPaymentReference: `MREF-${Date.now()}`,
          paymentReference: `PREF-${Date.now()}`,
          notificationToken: `TOKEN-${Date.now()}`
        };
        
        // Send payment notification to our endpoint
        await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/payment-notification`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(notificationData)
        });
      } catch (error) {
        console.error("Error sending payment failure notification:", error);
      }
    };

    sendFailureNotification();
  }, []);

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
            <XCircle className="h-16 w-16 text-red-500" />
          </div>
          <CardTitle className="text-2xl">Échec du paiement</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-center text-muted-foreground">
            Votre paiement n'a pas été traité. Veuillez réessayer ou contacter le support.
          </p>
          
          <div className="flex flex-col space-y-2">
            {quoteId && (
              <Button 
                onClick={() => navigate(`/quotes/${quoteId}`)} 
                className="w-full"
              >
                Retourner au devis
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

export default PaymentFailure;
