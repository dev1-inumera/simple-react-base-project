
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { createOfferPlate } from "../CartService";
import { fetchAllFolders } from "@/pages/OfferPlates/OfferPlatesService";
import { useAuth } from "@/lib/auth";
import { UserRole, Folder } from "@/types";
import { fetchClientProfiles } from "@/pages/Marketplace/MarketplacePlateService";

interface CreateOfferPlateDialogProps {
  userId: string;
  open: boolean;
  onClose: () => void;
  onSuccess: (offerPlateId: string) => void;
}

const formSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  folderId: z.string().optional(),
  clientId: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const CreateOfferPlateDialog: React.FC<CreateOfferPlateDialogProps> = ({
  userId,
  open,
  onClose,
  onSuccess,
}) => {
  const { toast } = useToast();
  const { auth, hasRole } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState<any[]>([]);
  const [loadingClients, setLoadingClients] = useState(false);
  const [showClientSelect, setShowClientSelect] = useState(false);

  const isAgent = auth.user && hasRole([UserRole.AGENT, UserRole.ADMIN]);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "Ma plaquette d'offres",
      folderId: "new", // Default to creating a new folder
      clientId: auth.user?.id,
    },
  });

  useEffect(() => {
    if (open && isAgent) {
      loadFolders();
    }
  }, [open, isAgent]);

  useEffect(() => {
    if (open && isAgent) {
      loadClients();
    }
  }, [open, isAgent]);

  useEffect(() => {
    // Si l'utilisateur sélectionne "nouveau dossier" et qu'il est agent/admin,
    // on affiche la sélection de client
    if (form.watch("folderId") === "new" && isAgent) {
      setShowClientSelect(true);
    } else {
      setShowClientSelect(false);
    }
  }, [form.watch("folderId"), isAgent]);

  const loadFolders = async () => {
    if (!auth.user) return;
    
    try {
      setLoading(true);
      const foldersList = await fetchAllFolders(auth.user.id, isAgent);
      setFolders(foldersList);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les dossiers existants",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadClients = async () => {
    if (!isAgent) return;
    
    try {
      setLoadingClients(true);
      const clientData = await fetchClientProfiles();
      setClients(clientData);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger la liste des clients",
        variant: "destructive",
      });
    } finally {
      setLoadingClients(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      
      // Si on crée un nouveau dossier, on utilise le client sélectionné ou l'utilisateur actuel
      const clientId = data.folderId === "new" && isAgent ? data.clientId : auth.user?.id;
      
      const offerPlate = await createOfferPlate(userId, data.name, data.folderId, clientId);
      toast({
        title: "Plaquette créée",
        description: "Votre plaquette d'offres a été créée avec succès.",
      });
      onSuccess(offerPlate.id);
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
          <DialogTitle>Créer une plaquette d'offres</DialogTitle>
          <DialogDescription>
            Transformez votre panier en plaquette d'offres
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom de la plaquette</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ma plaquette d'offres" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {isAgent && (
              <FormField
                control={form.control}
                name="folderId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dossier</FormLabel>
                    <FormControl>
                      <Select 
                        value={field.value} 
                        onValueChange={field.onChange}
                        disabled={loading}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez un dossier" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">Créer un nouveau dossier</SelectItem>
                          {folders.map(folder => (
                            <SelectItem key={folder.id} value={folder.id}>
                              {folder.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            {showClientSelect && isAgent && (
              <FormField
                control={form.control}
                name="clientId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client</FormLabel>
                    <FormControl>
                      <Select 
                        value={field.value} 
                        onValueChange={field.onChange}
                        disabled={loadingClients}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez un client" />
                        </SelectTrigger>
                        <SelectContent>
                          {clients.map(client => (
                            <SelectItem key={client.id} value={client.id}>
                              {`${client.firstName} ${client.lastName}`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            {!isAgent && (
              <FormField
                control={form.control}
                name="clientId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client</FormLabel>
                    <FormControl>
                      <Input 
                        value={auth.user ? `${auth.user.firstName} ${auth.user.lastName}` : ""}
                        disabled={true}
                        className="bg-muted"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <DialogFooter className="flex justify-end gap-2">
              <Button variant="outline" type="button" onClick={onClose}>
                Annuler
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                Créer la plaquette
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateOfferPlateDialog;
