
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { CartItem } from "@/types";
import { fetchCartItems } from "./CartService";
import CartItemRow from "./components/CartItemRow";
import CreateOfferPlateDialog from "./components/CreateOfferPlateDialog";
import { useNavigate } from "react-router-dom";

const CartPage: React.FC = () => {
  const { toast } = useToast();
  const { auth } = useAuth();
  const navigate = useNavigate();
  
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [createdOfferPlateId, setCreatedOfferPlateId] = useState<string | null>(null);

  const loadCartItems = async () => {
    if (!auth.user) return;
    
    try {
      setLoading(true);
      const items = await fetchCartItems(auth.user.id);
      setCartItems(items);
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

  useEffect(() => {
    loadCartItems();
  }, [auth.user]);

  // Fixed the function to wrap the navigate call inside another function that doesn't require parameters
  const handleSuccessfulCreation = (offerPlateId: string) => {
    setCreatedOfferPlateId(offerPlateId);
    loadCartItems();
    navigate(`/offer-plates/${offerPlateId}`);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Mon Panier</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Articles sélectionnés</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-36 bg-muted animate-pulse rounded-md" />
          ) : cartItems.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Article</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Création</TableHead>
                  <TableHead className="text-right">Mensualité</TableHead>
                  <TableHead className="w-[70px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cartItems.map((item) => (
                  <CartItemRow 
                    key={item.id || `${item.offerId}-${item.quantity}`} 
                    item={item} 
                    onUpdate={loadCartItems} 
                  />
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Votre panier est vide</p>
              <Button 
                variant="link" 
                className="mt-2"
                onClick={() => navigate("/marketplace")}
              >
                Parcourir la marketplace
              </Button>
            </div>
          )}
        </CardContent>
        {cartItems.length > 0 && (
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline"
              onClick={() => navigate("/marketplace")}
            >
              Continuer mes achats
            </Button>
            <Button onClick={() => setDialogOpen(true)}>
              Créer une plaquette d'offres
            </Button>
          </CardFooter>
        )}
      </Card>

      {auth.user && (
        <CreateOfferPlateDialog
          userId={auth.user.id}
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onSuccess={handleSuccessfulCreation}
        />
      )}
    </div>
  );
};

export default CartPage;
