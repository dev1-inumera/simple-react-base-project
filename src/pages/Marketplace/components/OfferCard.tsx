
import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { Offer } from "@/types";
import { addToCart } from "../MarketplaceService";
import { Eye, ShoppingCart, Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface OfferCardProps {
  offer: Offer;
  onViewDetails: (offer: Offer) => void;
}

const OfferCard: React.FC<OfferCardProps> = ({ offer, onViewDetails }) => {
  const { toast } = useToast();
  const { auth } = useAuth();
  const [showFeatures, setShowFeatures] = useState(false);

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
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: `Impossible d'ajouter au panier: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  if (!offer.isActive) {
    return null;
  }

  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <CardHeader className="pb-3 space-y-1">
        <CardTitle className="line-clamp-1 text-xl font-semibold tracking-tight text-gray-900">
          {offer.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow space-y-6">
        <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
          {offer.description}
        </p>
        <div className="space-y-4">
          {offer.priceMonthly > 0 && (
            <p className="font-semibold text-lg text-gray-900">
              A partir de {Number(offer.priceMonthly).toFixed(2)} € 
              <span className="text-sm font-normal text-gray-500 ml-1">/mois</span>
            </p>
          )}
          {offer.setupFee > 0 && (
            <p className="text-sm font-medium text-gray-700">
              Prix de création : {Number(offer.setupFee).toFixed(2)} €
            </p>
          )}
          {offer.priceMonthly === 0 && offer.setupFee === 0 && (
            <p className="font-medium text-gray-700">Sur devis</p>
          )}
        </div>
        <div className="flex flex-col space-y-3">
          <div className="text-xs font-medium text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full w-fit">
            {offer.category}
          </div>
          {offer.features && offer.features.length > 0 && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFeatures(true)}
                className="h-7 px-3 bg-[#6E59A5] text-white hover:bg-[#7E69AB] hover:text-white border-none w-fit"
              >
                <Info className="h-4 w-4 mr-1" />
                <span className="text-xs">Fonctionnalités</span>
              </Button>

              <Dialog open={showFeatures} onOpenChange={setShowFeatures}>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle className="text-lg font-semibold mb-4">
                      Fonctionnalités de {offer.name}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                      {offer.features.map((feature, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <div className="h-2 w-2 rounded-full bg-[#6E59A5] mt-2" />
                          <p className="text-sm text-gray-700">{feature}</p>
                        </div>
                      ))}
                  </div>
                </DialogContent>
              </Dialog>
            </>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-4 border-t">
        <Button
          variant="outline"
          size="sm"
          className="w-[48%]"
          onClick={() => onViewDetails(offer)}
        >
          <Eye className="h-4 w-4 mr-2" />
          Détails
        </Button>
        <Button
          size="sm"
          className="w-[48%]"
          onClick={handleAddToCart}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Ajouter
        </Button>
      </CardFooter>
    </Card>
  );
};

export default OfferCard;
