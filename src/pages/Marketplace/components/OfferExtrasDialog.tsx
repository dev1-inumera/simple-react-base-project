
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Minus, Plus, RotateCcw } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { OfferExtra } from "@/types";

interface SelectedExtras {
  [key: string]: number;
}

interface OfferExtrasDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  extras: OfferExtra[];
  onSaveSelection: (selectedExtras: SelectedExtras) => void;
  initialSelection?: SelectedExtras;
}

const OfferExtrasDialog: React.FC<OfferExtrasDialogProps> = ({
  open,
  onOpenChange,
  extras,
  onSaveSelection,
  initialSelection = {},
}) => {
  const [quantities, setQuantities] = useState<SelectedExtras>(initialSelection);

  const handleQuantityChange = (extraId: string, change: number) => {
    setQuantities((prev) => {
      const currentQty = prev[extraId] || 0;
      const newQty = Math.max(0, currentQty + change);
      return {
        ...prev,
        [extraId]: newQty,
      };
    });
  };

  const handleReset = () => {
    setQuantities({});
  };

  const handleSave = () => {
    onSaveSelection(quantities);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold mb-4">
            Options supplémentaires
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 flex-1 overflow-hidden">
          <div className="grid grid-cols-[2fr,1fr,1fr] gap-4 py-2 font-medium text-sm text-gray-600 bg-white z-10">
            <div>Description</div>
            <div>Prix unitaire</div>
            <div>Quantité</div>
          </div>

          <ScrollArea className="h-[300px] overflow-auto">
            <div className="space-y-3 pr-4">
              {extras.map((extra) => (
                <div
                  key={extra.id}
                  className="grid grid-cols-[2fr,1fr,1fr] gap-4 items-center py-2 border-t"
                >
                  <div>
                    <p className="font-medium text-gray-900">{extra.name}</p>
                    {extra.description && (
                      <p className="text-sm text-gray-600">{extra.description}</p>
                    )}
                  </div>
                  <div className="text-gray-900">
                    {extra.unitPrice.toFixed(2)} €
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleQuantityChange(extra.id, -1)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center">
                      {quantities[extra.id] || 0}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleQuantityChange(extra.id, 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        <div className="flex justify-between mt-6 pt-4 border-t">
          <Button
            variant="outline"
            onClick={handleReset}
            className="flex items-center"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Réinitialiser
          </Button>
          <Button onClick={handleSave}>Enregistrer la sélection</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OfferExtrasDialog;
