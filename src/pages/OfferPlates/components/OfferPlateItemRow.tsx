import React, { useState } from "react";
import { CartItem } from "@/types";
import { Button } from "@/components/ui/button";
import { FileMinus, ChevronDown, ChevronUp, Briefcase } from "lucide-react";
import OfferExtrasDialog from "@/pages/Marketplace/components/OfferExtrasDialog";

interface OfferPlateItemRowProps {
  item: CartItem;
  onQuantityChange: (itemId: string, quantity: number, selectedExtras?: Record<string, number>) => void;
  onRemove: (itemId: string) => void;
}

const OfferPlateItemRow: React.FC<OfferPlateItemRowProps> = ({
  item,
  onQuantityChange,
  onRemove
}) => {
  const [showFeatures, setShowFeatures] = useState(false);
  const [showExtras, setShowExtras] = useState(false);
  const [extrasDialogOpen, setExtrasDialogOpen] = useState(false);

  const extrasCount = Object.values(item.selectedExtras || {}).reduce((sum, quantity) => sum + quantity, 0);
  const extrasTotal = Object.entries(item.selectedExtras || {}).reduce((sum, [extraId, quantity]) => {
    const extra = item.offer.extras?.find(e => e.id === extraId);
    return sum + (extra ? extra.unitPrice * quantity : 0);
  }, 0);

  return (
    <div className="flex flex-col p-4 border rounded-md bg-white">
      <div className="flex flex-col sm:flex-row items-start sm:items-center">
        <div className="flex-1">
          <h3 className="font-medium">{item.offer.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{item.offer.description}</p>
          
          {item.offer.features && item.offer.features.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="mt-1 h-7 px-2 text-xs text-muted-foreground hover:text-primary"
              onClick={() => setShowFeatures(!showFeatures)}
            >
              {showFeatures ? (
                <>
                  <ChevronUp className="w-4 h-4 mr-1" /> 
                  Masquer les fonctionnalités
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4 mr-1" /> 
                  Afficher les fonctionnalités
                </>
              )}
            </Button>
          )}
        </div>
        
        <div className="flex items-center mt-3 sm:mt-0">
          <div className="mr-4">
            <div className="text-xs text-muted-foreground mb-1">Prix mensuel</div>
            <div className="font-medium">{item.offer.priceMonthly} €</div>
          </div>
          
          {item.offer.setupFee > 0 && (
            <div className="mr-4">
              <div className="text-xs text-muted-foreground mb-1">Frais d'installation</div>
              <div className="font-medium">{item.offer.setupFee} €</div>
            </div>
          )}
          
          <div className="w-auto mr-4">
            <div className="text-xs text-muted-foreground mb-1">Options</div>
            {item.offer.hasExtras ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setExtrasDialogOpen(true)}
                className="h-7 px-3 bg-[#6E59A5] text-white hover:bg-[#7E69AB] hover:text-white border-none"
              >
                <Briefcase className="h-4 w-4 mr-1" />
                {extrasCount > 0 ? (
                  <span className="text-xs">{extrasCount} options ({extrasTotal.toFixed(2)}€)</span>
                ) : (
                  <span className="text-xs">Options</span>
                )}
              </Button>
            ) : (
              <div className="font-medium">-</div>
            )}
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(item.id || "")}
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            <FileMinus className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {showFeatures && item.offer.features && item.offer.features.length > 0 && (
        <div className="mt-3 pl-4 border-t pt-3">
          <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
            {item.offer.features.map((feature, idx) => (
              <li key={idx}>{feature}</li>
            ))}
          </ul>
        </div>
      )}

      {item.offer.extras && item.offer.extras.length > 0 && (
        <>
          <Button 
            variant="ghost" 
            size="sm" 
            className="mt-1 h-7 px-2 text-xs text-muted-foreground hover:text-primary"
            onClick={() => setShowExtras(!showExtras)}
          >
            {showExtras ? (
              <>
                <ChevronUp className="w-4 h-4 mr-1" /> 
                Masquer les options
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4 mr-1" /> 
                Afficher les options
              </>
            )}
          </Button>

          {showExtras && (
            <div className="mt-3 pl-4 border-t pt-3">
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                {item.offer.extras.map((extra) => {
                  const quantity = item.selectedExtras?.[extra.id] || 0;
                  return (
                    <li key={extra.id}>
                      {extra.name} ({extra.unitPrice.toFixed(2)}€)
                      {quantity > 0 && ` - ${quantity}x sélectionné(s)`}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </>
      )}

      {item.offer.extras && (
        <OfferExtrasDialog
          open={extrasDialogOpen}
          onOpenChange={setExtrasDialogOpen}
          extras={item.offer.extras}
          onSaveSelection={(selectedExtras) => {
            onQuantityChange(item.id || "", item.quantity, selectedExtras);
          }}
          initialSelection={item.selectedExtras}
        />
      )}
    </div>
  );
};

export default OfferPlateItemRow;
