
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { CartItem, UserRole } from "@/types";
import { fetchOfferPlateDetails, updateOfferPlateItems, createQuoteFromOfferPlate } from "./OfferPlatesService";
import { ArrowLeft, FilePlus, FileText, FileMinus, Send } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import OfferPlatePreview from "./components/OfferPlatePreview";
import OfferPlateItemRow from "./components/OfferPlateItemRow";
import AddOffersDialog from "./components/AddOffersDialog";
import QuoteSuccessDialog from "./components/QuoteSuccessDialog";

const OfferPlateDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { auth, hasRole } = useAuth();
  
  const [offerPlate, setOfferPlate] = useState<any>(null);
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewMode, setPreviewMode] = useState(false);
  const [isAddOffersDialogOpen, setIsAddOffersDialogOpen] = useState(false);
  const [quoteCreated, setQuoteCreated] = useState<string | null>(null);
  
  const isAgent = auth.user && hasRole([UserRole.AGENT, UserRole.ADMIN]);

  useEffect(() => {
    loadOfferPlate();
  }, [id]);
  
  const loadOfferPlate = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const data = await fetchOfferPlateDetails(id);
      setOfferPlate(data);
      setItems(data.items || []);
    } catch (error: any) {
      toast({
        title: "Erreur de chargement",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    const updatedItems = items.map(item => {
      if (item.id === itemId) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    
    setItems(updatedItems);
    
    try {
      await updateOfferPlateItems(id!, updatedItems);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la quantité",
        variant: "destructive",
      });
    }
  };
  
  const handleRemoveItem = async (itemId: string) => {
    const updatedItems = items.filter(item => item.id !== itemId);
    setItems(updatedItems);
    
    try {
      await updateOfferPlateItems(id!, updatedItems);
      toast({
        title: "Supprimé",
        description: "L'offre a été supprimée de la plaquette"
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'offre",
        variant: "destructive",
      });
      // Reload to reset state
      loadOfferPlate();
    }
  };
  
  const handleAddOffers = async (newOffers: CartItem[]) => {
    // Merge new offers with existing ones
    const updatedItems = [...items];
    
    for (const newOffer of newOffers) {
      const existingIndex = updatedItems.findIndex(item => item.offerId === newOffer.offerId);
      if (existingIndex >= 0) {
        // Update quantity if offer already exists
        updatedItems[existingIndex] = {
          ...updatedItems[existingIndex],
          quantity: updatedItems[existingIndex].quantity + newOffer.quantity
        };
      } else {
        // Add new offer
        updatedItems.push(newOffer);
      }
    }
    
    setItems(updatedItems);
    
    try {
      await updateOfferPlateItems(id!, updatedItems);
      toast({
        title: "Ajouté",
        description: "Les offres ont été ajoutées à la plaquette"
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter les offres",
        variant: "destructive",
      });
      // Reload to reset state
      loadOfferPlate();
    }
  };
  
  const handleCreateQuote = async () => {
    if (!id) return;
    
    try {
      const quote = await createQuoteFromOfferPlate(id);
      setQuoteCreated(quote.id);
      toast({
        title: "Devis créé",
        description: "Le devis a été créé avec succès"
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de créer le devis",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="mt-4 text-muted-foreground">Chargement...</p>
      </div>
    );
  }

  if (!offerPlate) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">Plaquette d'offres non trouvée</p>
        <Button 
          variant="link" 
          className="mt-4" 
          onClick={() => navigate("/folders")}
        >
          Retour aux dossiers
        </Button>
      </div>
    );
  }
  
  if (previewMode) {
    return (
      <div>
        <div className="flex items-center mb-4">
          <Button 
            variant="ghost" 
            onClick={() => setPreviewMode(false)}
            className="mr-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <h1 className="text-2xl font-bold">{offerPlate.name}</h1>
        </div>
        <div className="mb-4">
          <OfferPlatePreview items={items} offerPlate={offerPlate} />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center mb-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/folders")}
          className="mr-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <h1 className="text-2xl font-bold">{offerPlate.name}</h1>
      </div>
      
      <div className="mb-4">
        <p className="text-sm text-muted-foreground">
          Créé {formatDistanceToNow(new Date(offerPlate.createdAt), { addSuffix: true, locale: fr })}
        </p>
        <p className="text-sm">
          Dossier: <span className="font-medium">{offerPlate.folderName || "Non attribué"}</span>
        </p>
      </div>
      
      <div className="flex justify-end mb-4 gap-2">
        <Button 
          variant="outline"
          onClick={() => setPreviewMode(true)}
        >
          <FileText className="h-4 w-4 mr-2" />
          Aperçu
        </Button>
        
        <Button 
          onClick={() => setIsAddOffersDialogOpen(true)}
        >
          <FilePlus className="h-4 w-4 mr-2" />
          Ajouter des offres
        </Button>
        
        <Button 
          variant="default"
          onClick={handleCreateQuote}
        >
          <Send className="h-4 w-4 mr-2" />
          Générer un devis
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Offres incluses</CardTitle>
        </CardHeader>
        <CardContent>
          {items.length > 0 ? (
            <div className="space-y-4">
              {items.map(item => (
                <OfferPlateItemRow 
                  key={item.id} 
                  item={item}
                  onQuantityChange={handleQuantityChange}
                  onRemove={handleRemoveItem}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Aucune offre dans cette plaquette</p>
              <Button 
                variant="link" 
                onClick={() => setIsAddOffersDialogOpen(true)}
              >
                Ajouter des offres
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      <AddOffersDialog
        open={isAddOffersDialogOpen}
        onClose={() => setIsAddOffersDialogOpen(false)}
        onAdd={handleAddOffers}
      />
      
      <QuoteSuccessDialog
        open={quoteCreated !== null}
        onClose={() => setQuoteCreated(null)}
        quoteId={quoteCreated || ""}
        onViewQuote={() => {
          if (quoteCreated) {
            navigate(`/quotes/${quoteCreated}`);
          }
        }}
      />
    </div>
  );
};

export default OfferPlateDetailPage;
