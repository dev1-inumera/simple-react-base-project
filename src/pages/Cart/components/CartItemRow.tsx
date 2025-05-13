
import React, { useState } from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, Plus } from "lucide-react";
import { CartItem } from "@/types";
import { updateCartItemQuantity, removeCartItem } from "../CartService";
import { useToast } from "@/hooks/use-toast";
import OfferExtrasDialog from "@/pages/Marketplace/components/OfferExtrasDialog";

interface CartItemRowProps {
  item: CartItem;
  onUpdate: () => void;
}

const CartItemRow: React.FC<CartItemRowProps> = ({ item, onUpdate }) => {
  const { toast } = useToast();
  const [isRemoving, setIsRemoving] = useState(false);
  const [extrasDialogOpen, setExtrasDialogOpen] = useState(false);

  const handleRemoveItem = async () => {
    if (!item.id) return;
    
    try {
      setIsRemoving(true);
      await removeCartItem(item.id);
      toast({
        title: "Article supprimé",
        description: `${item.offer.name} a été supprimé du panier.`,
      });
      onUpdate();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsRemoving(false);
    }
  };

  // Safely handle extras calculations
  const extrasCount = item.selectedExtras 
    ? Object.values(item.selectedExtras).reduce((sum, quantity) => sum + (quantity || 0), 0)
    : 0;
    
  const extrasTotal = item.selectedExtras && item.offer.extras
    ? Object.entries(item.selectedExtras).reduce((sum, [extraId, quantity]) => {
        const extra = item.offer.extras?.find(e => e.id === extraId);
        return sum + (extra ? extra.unitPrice * (quantity || 0) : 0);
      }, 0)
    : 0;

  const setupFeeDisplay = item.offer.setupFee || item.offer.creationCost || 0;
  const priceMonthlyDisplay = item.offer.priceMonthly || item.offer.monthlyPayment || 0;

  return (
    <>
      <TableRow>
        <TableCell className="font-medium">{item.offer.name}</TableCell>
        <TableCell>{item.offer.description}</TableCell>
        <TableCell className="text-right">
          {setupFeeDisplay > 0 ? `${Number(setupFeeDisplay).toFixed(2)}€` : "-"}
        </TableCell>
        <TableCell className="text-right">
          {priceMonthlyDisplay > 0 ? `${Number(priceMonthlyDisplay).toFixed(2)}€` : "-"}
        </TableCell>
        <TableCell className="text-right">
          {extrasCount > 0 ? (
            <Button
              variant="ghost"
              size="sm"
              className="h-8"
              onClick={() => setExtrasDialogOpen(true)}
            >
              {extrasCount} extras ({extrasTotal.toFixed(2)}€)
              <Plus className="ml-2 h-4 w-4" />
            </Button>
          ) : item.offer.extras && item.offer.extras.length ? (
            <Button
              variant="ghost"
              size="sm"
              className="h-8"
              onClick={() => setExtrasDialogOpen(true)}
            >
              Ajouter des extras
              <Plus className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            "-"
          )}
        </TableCell>
        <TableCell>
          <Button 
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={handleRemoveItem}
            disabled={isRemoving}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </TableCell>
      </TableRow>

      {item.offer.extras && (
        <OfferExtrasDialog
          open={extrasDialogOpen}
          onOpenChange={setExtrasDialogOpen}
          extras={item.offer.extras}
          onSaveSelection={async (selectedExtras) => {
            try {
              await updateCartItemQuantity(item.id!, item.quantity, selectedExtras);
              onUpdate();
            } catch (error: any) {
              toast({
                title: "Erreur",
                description: error.message,
                variant: "destructive",
              });
            }
          }}
          initialSelection={item.selectedExtras}
        />
      )}
    </>
  );
};

export default CartItemRow;
