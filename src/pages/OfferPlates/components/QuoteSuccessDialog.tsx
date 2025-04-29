
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

interface QuoteSuccessDialogProps {
  open: boolean;
  onClose: () => void;
  quoteId: string;
  onViewQuote: () => void;
}

const QuoteSuccessDialog: React.FC<QuoteSuccessDialogProps> = ({
  open,
  onClose,
  quoteId,
  onViewQuote
}) => {
  return (
    <Dialog open={open} onOpenChange={isOpen => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex justify-center">
            <CheckCircle className="h-12 w-12 text-green-500" />
          </div>
          <DialogTitle className="text-center text-xl mt-2">Devis créé avec succès</DialogTitle>
          <DialogDescription className="text-center">
            Votre devis a été créé et enregistré dans le même dossier que la plaquette d'offres.
          </DialogDescription>
        </DialogHeader>
        
        <div className="text-center my-4">
          <p className="font-medium">Numéro du devis</p>
          <p className="text-muted-foreground">{quoteId.substring(0, 8)}</p>
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-center">
          <Button onClick={onClose} variant="outline">
            Continuer à éditer
          </Button>
          <Button onClick={onViewQuote}>
            Voir le devis
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default QuoteSuccessDialog;
