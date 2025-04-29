
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

  const extrasCount = Object.values(item.selectedExtras || {}).reduce((sum, quantity) => sum + quantity, 0);
  const extrasTotal = Object.entries(item.selectedExtras || {}).reduce((sum, [extraId, quantity]) => {
    const extra = item.offer.extras?.find(e => e.id === extraId);
    return sum + (extra ? extra.unitPrice * quantity : 0);
  }, 0);

  return (
    <>
      <TableRow>
        <TableCell className="font-medium">{item.offer.name}</TableCell>
        <TableCell>{item.offer.description}</TableCell>
        <TableCell className="text-right">
          {item.offer.setupFee > 0 ? `${Number(item.offer.setupFee).toFixed(2)}€` : "-"}
        </TableCell>
        <TableCell className="text-right">
          {item.offer.priceMonthly > 0 ? `${Number(item.offer.priceMonthly).toFixed(2)}€` : "-"}
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
          ) : item.offer.extras?.length ? (
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
