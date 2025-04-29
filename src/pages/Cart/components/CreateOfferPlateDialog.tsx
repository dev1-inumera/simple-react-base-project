
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

interface CreateOfferPlateDialogProps {
  userId: string;
  open: boolean;
  onClose: () => void;
  onSuccess: (offerPlateId: string) => void;
}

const formSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  folderId: z.string().optional(),
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

  const isAgent = auth.user && hasRole([UserRole.AGENT, UserRole.ADMIN]);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "Ma plaquette d'offres",
      folderId: "new", // Default to creating a new folder
    },
  });

  useEffect(() => {
    if (open && isAgent) {
      loadFolders();
    }
  }, [open, isAgent]);

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

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      // Pass the folder id as is - it will be handled in the service
      const offerPlate = await createOfferPlate(userId, data.name, data.folderId);
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
