
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { fetchClientProfiles, sendOfferPlateThroughPlatform } from "../MarketplacePlateService";
import { User } from "@/types";
import { useAuth } from "@/lib/auth";

interface SendOfferPlateDialogProps {
  offerPlateId: string;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const SendOfferPlateDialog: React.FC<SendOfferPlateDialogProps> = ({
  offerPlateId,
  open,
  onClose,
  onSuccess
}) => {
  const { toast } = useToast();
  const { auth } = useAuth();
  const [clients, setClients] = useState<User[]>([]);
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadClients = async () => {
      try {
        const clientList = await fetchClientProfiles();
        setClients(clientList);
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger la liste des clients.",
          variant: "destructive"
        });
      }
    };

    if (open) {
      loadClients();
    }
  }, [open]);

  const handleSend = async () => {
    if (!selectedClient) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un client.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsLoading(true);
      await sendOfferPlateThroughPlatform(offerPlateId, selectedClient);
      
      toast({
        title: "Succès",
        description: "La plaquette d'offres a été envoyée.",
      });

      onSuccess?.();
      onClose();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer la plaquette d'offres.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Envoyer la plaquette d'offres</DialogTitle>
          <DialogDescription>
            Sélectionnez un client à qui envoyer la plaquette d'offres
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <Select 
            onValueChange={setSelectedClient} 
            value={selectedClient}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un client" />
            </SelectTrigger>
            <SelectContent>
              {clients.map((client) => (
                <SelectItem key={client.id} value={client.id}>
                  {client.firstName} {client.lastName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <DialogFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button 
            onClick={handleSend} 
            disabled={!selectedClient || isLoading}
          >
            Envoyer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SendOfferPlateDialog;
