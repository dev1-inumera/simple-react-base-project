
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Offer, CartItem } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { mapOffers } from "@/utils/dataMapper";
import { useToast } from "@/hooks/use-toast";
import { Search, Plus, Check } from "lucide-react";

interface AddOffersDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (offers: CartItem[]) => void;
}

const AddOffersDialog: React.FC<AddOffersDialogProps> = ({ open, onClose, onAdd }) => {
  const { toast } = useToast();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOffers, setSelectedOffers] = useState<Record<string, { offer: Offer, quantity: number }>>({});

  useEffect(() => {
    if (open) {
      loadOffers();
    }
  }, [open]);

  useEffect(() => {
    if (open && searchTerm.trim() !== "") {
      loadOffers();
    }
  }, [searchTerm]);

  const loadOffers = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from("offers")
        .select("*")
        .eq("is_active", true);
      
      if (searchTerm.trim() !== "") {
        query = query.ilike("name", `%${searchTerm}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      setOffers(mapOffers(data));
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les offres",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOffer = (offer: Offer) => {
    setSelectedOffers(prev => {
      if (prev[offer.id]) {
        // Déjà sélectionné, donc on désélectionne
        const { [offer.id]: _, ...rest } = prev;
        return rest;
      } else {
        // Pas encore sélectionné
        return {
          ...prev,
          [offer.id]: { offer, quantity: 1 }
        };
      }
    });
  };

  const handleChangeQuantity = (offerId: string, quantity: number) => {
    if (quantity > 0) {
      setSelectedOffers(prev => ({
        ...prev,
        [offerId]: { ...prev[offerId], quantity }
      }));
    }
  };

  const handleAdd = () => {
    const selectedItems: CartItem[] = Object.values(selectedOffers).map(({ offer, quantity }) => ({
      offerId: offer.id,
      offer,
      quantity
    }));
    
    onAdd(selectedItems);
    onClose();
  };
  
  const filteredOffers = offers.filter(offer => 
    offer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={isOpen => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Ajouter des offres</DialogTitle>
        </DialogHeader>
        
        <div className="my-4 flex">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher une offre..."
              className="pl-8"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="max-h-[300px] overflow-y-auto">
          {loading ? (
            <div className="py-8 text-center">
              <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
              <p className="mt-2 text-sm text-muted-foreground">Chargement des offres...</p>
            </div>
          ) : filteredOffers.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">Aucune offre trouvée</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredOffers.map(offer => {
                const isSelected = !!selectedOffers[offer.id];
                return (
                  <div 
                    key={offer.id} 
                    className={`p-3 border rounded-md flex items-center justify-between cursor-pointer transition-colors
                      ${isSelected ? 'border-primary bg-primary/5' : 'hover:bg-muted/30'}`}
                    onClick={() => handleSelectOffer(offer)}
                  >
                    <div className="flex-1">
                      <h3 className="font-medium">{offer.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-1">{offer.description}</p>
                      <div className="flex mt-1 text-xs text-muted-foreground">
                        <span className="mr-3">Prix: {offer.priceMonthly} €/mois</span>
                        {offer.setupFee > 0 && <span>Frais: {offer.setupFee} €</span>}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {isSelected && (
                        <Input
                          type="number"
                          value={selectedOffers[offer.id].quantity}
                          onChange={e => handleChangeQuantity(offer.id, parseInt(e.target.value) || 1)}
                          onClick={e => e.stopPropagation()}
                          min={1}
                          className="w-20 h-8"
                        />
                      )}
                      <div className={`flex items-center justify-center h-6 w-6 rounded-full ${isSelected ? 'bg-primary text-primary-foreground' : 'border border-muted'}`}>
                        {isSelected && (
                          <Check className="h-4 w-4" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        
        <DialogFooter className="flex justify-between mt-4">
          <div>
            <span className="text-sm font-medium">
              {Object.keys(selectedOffers).length} offre(s) sélectionnée(s)
            </span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button 
              onClick={handleAdd} 
              disabled={Object.keys(selectedOffers).length === 0}
            >
              <Plus className="h-4 w-4 mr-2" />
              Ajouter
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddOffersDialog;
