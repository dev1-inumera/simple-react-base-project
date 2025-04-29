import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Offer } from "@/types";
import { ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { addToCart } from "../MarketplaceService";

interface OfferDetailDialogProps {
  offer: Offer | null;
  open: boolean;
  onClose: () => void;
}

const OfferDetailDialog: React.FC<OfferDetailDialogProps> = ({
  offer,
  open,
  onClose,
}) => {
  const { toast } = useToast();
  const { auth } = useAuth();

  if (!offer) return null;

  const handleAddToCart = async () => {
    try {
      if (!auth.user) {
        toast({
          title: "Connexion requise",
          description: "Vous devez être connecté pour ajouter des articles au panier.",
          variant: "destructive",
        });
        return;
      }

      await addToCart(offer, 1, auth.user.id);
      toast({
        title: "Ajouté au panier",
        description: `${offer.name} a été ajouté à votre panier.`,
      });
      onClose();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: `Impossible d'ajouter au panier: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{offer.name}</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {offer.category}
          </DialogDescription>
        </DialogHeader>
        
        {offer.imageUrl && (
          <div className="w-full h-48 bg-muted rounded-md overflow-hidden">
            <img 
              src={offer.imageUrl} 
              alt={offer.name} 
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">Description</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {offer.description}
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium">Fonctionnalités</h3>
            <ul className="mt-2 space-y-2">
              {offer.features.map((feature, index) => (
                <li key={index} className="flex items-start text-sm">
                  <div className="mr-2 mt-0.5 h-2 w-2 rounded-full bg-primary" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium">Prix</h3>
            <div className="space-y-1 mt-1">
              {offer.priceMonthly > 0 && (
                <p className="text-xl font-bold">
                  {Number(offer.priceMonthly).toFixed(2)} € <span className="text-sm font-normal text-muted-foreground">/mois</span>
                </p>
              )}
              {offer.setupFee > 0 && (
                <p className="text-sm text-muted-foreground">
                  Frais d'installation : {Number(offer.setupFee).toFixed(2)} €
                </p>
              )}
              {offer.priceMonthly === 0 && offer.setupFee === 0 && (
                <p className="font-medium text-muted-foreground">Sur devis</p>
              )}
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex sm:justify-between">
          <Button variant="outline" onClick={onClose}>
            Fermer
          </Button>
          <Button onClick={handleAddToCart}>
            <ShoppingCart className="h-4 w-4 mr-2" />
            Ajouter au panier
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OfferDetailDialog;
