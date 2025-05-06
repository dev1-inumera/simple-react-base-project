
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { createFolder } from "../FoldersService";
import { useAuth } from "@/lib/auth";
import { fetchClientProfiles } from "@/pages/Marketplace/MarketplacePlateService";
import { UserRole } from "@/types";

interface CreateFolderDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const formSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  clientId: z.string().min(1, "Le client est requis"),
});

type FormData = z.infer<typeof formSchema>;

const CreateFolderDialog: React.FC<CreateFolderDialogProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const { toast } = useToast();
  const { auth, hasRole } = useAuth();
  const [clients, setClients] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isAgent = hasRole([UserRole.AGENT, UserRole.ADMIN]);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      clientId: auth.user?.id || "",
    },
  });

  const loadClients = async () => {
    try {
      setIsLoading(true);
      const data = await fetchClientProfiles();
      setClients(data);
      
      // Si l'utilisateur n'est pas un agent, on définit le clientId sur son propre ID
      if (!isAgent && auth.user) {
        form.setValue("clientId", auth.user.id);
      }
    } catch (error) {
      console.error("Error loading clients:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger la liste des clients.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      form.reset({
        name: "",
        clientId: auth.user?.id || "",
      });
      loadClients();
    }
  }, [open, auth.user]);

  const onSubmit = async (data: FormData) => {
    if (!auth.user) return;

    try {
      setIsSubmitting(true);
      await createFolder(data.name, data.clientId, auth.user.id);
      toast({
        title: "Dossier créé",
        description: "Le dossier a été créé avec succès.",
      });
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
          <DialogTitle>Créer un dossier</DialogTitle>
          <DialogDescription>
            Créez un nouveau dossier pour un client
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom du dossier</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Nouveau dossier" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {isAgent ? (
              <FormField
                control={form.control}
                name="clientId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      disabled={isLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un client" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {clients.map((client) => (
                          <SelectItem key={client.id} value={client.id}>
                            {`${client.firstName} ${client.lastName}`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : auth.user ? (
              <FormItem>
                <FormLabel>Client</FormLabel>
                <FormControl>
                  <Input 
                    value={`${auth.user.firstName} ${auth.user.lastName}`}
                    disabled={true}
                    className="bg-muted"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            ) : null}
            
            <DialogFooter className="flex justify-end gap-2">
              <Button variant="outline" type="button" onClick={onClose}>
                Annuler
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                Créer le dossier
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateFolderDialog;
