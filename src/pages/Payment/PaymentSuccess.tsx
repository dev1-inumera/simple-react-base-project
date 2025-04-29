
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
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(true);

  useEffect(() => {
    const updatePaymentStatus = async () => {
      if (!quoteId) return;
      
      try {
        await updateQuotePaymentStatus(quoteId, "Payé");
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
  }, [quoteId, toast]);

  return (
    <div className="container mx-auto py-10 px-4">
      <Card className="max-w-md mx-auto">
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
              <Button onClick={() => navigate(`/quotes/${quoteId}`)}>
                Retourner au devis
              </Button>
            )}
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour au tableau de bord
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccess;
