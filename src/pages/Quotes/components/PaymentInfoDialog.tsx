
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { createPaymentInfo } from '../QuotesService';
import { useToast } from '@/hooks/use-toast';

interface PaymentInfoDialogProps {
  open: boolean;
  onClose: () => void;
  quoteId: string;
  onSuccess: (paymentInfo: any) => void;
}

const PaymentInfoDialog: React.FC<PaymentInfoDialogProps> = ({ 
  open, 
  onClose, 
  quoteId, 
  onSuccess 
}) => {
  const { toast } = useToast();
  const [bankName, setBankName] = useState('');
  const [iban, setIban] = useState('');
  const [bic, setBic] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!bankName || !iban || !bic) {
      toast({
        title: "Erreur",
        description: "Tous les champs sont requis",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const paymentInfo = await createPaymentInfo({
        quoteId,
        bankName,
        iban,
        bic
      });
      
      toast({
        title: "Informations de paiement",
        description: "Informations de paiement enregistrées avec succès"
      });
      
      onSuccess(paymentInfo);
      onClose();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer les informations de paiement",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Informations de paiement</DialogTitle>
          <DialogDescription>
            Veuillez saisir les détails de votre compte bancaire
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nom de la banque</label>
            <Input 
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              placeholder="Nom de votre banque"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">IBAN</label>
            <Input 
              value={iban}
              onChange={(e) => setIban(e.target.value)}
              placeholder="Votre numéro IBAN"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">BIC</label>
            <Input 
              value={bic}
              onChange={(e) => setBic(e.target.value)}
              placeholder="Votre code BIC"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={onClose}
            disabled={isSubmitting}
          >
            Annuler
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
          >
            Enregistrer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentInfoDialog;
