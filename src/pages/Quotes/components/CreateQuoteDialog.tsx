
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { createQuote, fetchOfferPlatesWithoutQuotes, fetchQuoteItems } from "../QuotesService";
import { useAuth } from "@/lib/auth";
import { OfferPlate } from "@/types";

interface CreateQuoteDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  isAgent: boolean;
}

const formSchema = z.object({
  offerPlateId: z.string().min(1, "La plaquette d'offres est requise"),
  totalAmount: z.string().min(1, "Le montant total est requis"),
});

type FormData = z.infer<typeof formSchema>;

const CreateQuoteDialog: React.FC<CreateQuoteDialogProps> = ({
  open,
  onClose,
  onSuccess,
  isAgent,
}) => {
  const { toast } = useToast();
  const { auth } = useAuth();
  const [offerPlates, setOfferPlates] = useState<OfferPlate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      offerPlateId: "",
      totalAmount: "",
    },
  });

  const loadOfferPlates = async () => {
    if (!auth.user) return;
    
    try {
      setIsLoading(true);
      const data = await fetchOfferPlatesWithoutQuotes(auth.user.id, isAgent);
      setOfferPlates(data);
    } catch (error) {
      console.error("Error loading offer plates:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les plaquettes d'offres.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      loadOfferPlates();
      form.reset();
    }
  }, [open]);

  const handleOfferPlateChange = async (offerPlateId: string) => {
    if (!offerPlateId) return;
    
    try {
      setIsLoading(true);
      const items = await fetchQuoteItems(offerPlateId);
      
      // Calculate the total price
      const total = items.reduce((sum, item) => {
        return sum + (Number(item.offer.priceMonthly) * item.quantity);
      }, 0);
      
      setTotalPrice(total);
      form.setValue("totalAmount", total.toString());
    } catch (error) {
      console.error("Error loading offer plate items:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    if (!auth.user) return;
    
    try {
      setIsSubmitting(true);
      
      const selectedOfferPlate = offerPlates.find(p => p.id === data.offerPlateId);
      if (!selectedOfferPlate) throw new Error("Plaquette d'offres non trouvée");
      
      await createQuote(
        data.offerPlateId,
        Number(data.totalAmount),
        selectedOfferPlate.clientId || auth.user.id,
        isAgent ? auth.user.id : selectedOfferPlate.agentId
      );
      
      toast({
        title: "Devis créé",
        description: "Le devis a été créé avec succès.",
      });
      
      form.reset();
      onSuccess();
      onClose();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Créer un devis</DialogTitle>
          <DialogDescription>
            Créez un devis à partir d'une plaquette d'offres
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="offerPlateId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Plaquette d'offres</FormLabel>
                  <Select 
                    onValueChange={(value) => {
                      field.onChange(value);
                      handleOfferPlateChange(value);
                    }}
                    defaultValue={field.value}
                    disabled={isLoading || offerPlates.length === 0}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une plaquette d'offres" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {offerPlates.map((plate) => (
                        <SelectItem key={plate.id} value={plate.id}>
                          {plate.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {offerPlates.length === 0 && !isLoading && (
                    <p className="text-xs text-muted-foreground">
                      Aucune plaquette d'offres disponible.
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="totalAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Montant total</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        className="pr-8"
                      />
                      <span className="absolute right-3 top-2 text-muted-foreground">
                        €
                      </span>
                    </div>
                  </FormControl>
                  {totalPrice > 0 && (
                    <p className="text-xs text-muted-foreground">
                      Prix calculé: {totalPrice.toFixed(2)} €
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter className="flex justify-end gap-2">
              <Button variant="outline" type="button" onClick={onClose}>
                Annuler
              </Button>
              <Button type="submit" disabled={isSubmitting || isLoading || offerPlates.length === 0}>
                Créer le devis
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateQuoteDialog;
