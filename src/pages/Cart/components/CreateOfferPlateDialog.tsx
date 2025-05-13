
import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogDescription, DialogHeader, DialogContent, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { Folder } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserPlus } from 'lucide-react';

interface CreateOfferPlateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { name: string; folderId?: string; clientId?: string; }) => Promise<void>;
}

const CreateOfferPlateDialog: React.FC<CreateOfferPlateDialogProps> = ({ 
  open, 
  onOpenChange,
  onSubmit
}) => {
  const { auth } = useAuth();
  const [name, setName] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string | undefined>();
  const [selectedClient, setSelectedClient] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createNew, setCreateNew] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  // Fetch folders
  const { data: folders = [], isLoading: foldersLoading } = useQuery({
    queryKey: ['folders', auth.user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('folders')
        .select('*')
        .eq('agent_id', auth.user?.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      return data.map(folder => ({
        id: folder.id,
        name: folder.name,
        clientId: folder.client_id,
        agentId: folder.agent_id,
        createdAt: folder.created_at,
        updatedAt: folder.updated_at
      }));
    },
    enabled: !!auth.user?.id && open
  });
  
  // Fetch clients
  const { data: clients = [], isLoading: clientsLoading } = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'client')
        .order('last_name', { ascending: true });
        
      if (error) throw error;
      
      return data.map(client => ({
        id: client.id,
        firstName: client.first_name,
        lastName: client.last_name,
        email: client.email
      }));
    },
    enabled: open
  });

  const handleSubmit = async () => {
    if (!name) return;
    
    try {
      setIsSubmitting(true);
      
      let folderId = selectedFolder;
      
      // Create new folder if needed
      if (createNew && newFolderName && selectedClient) {
        const { data, error } = await supabase
          .from('folders')
          .insert([{
            name: newFolderName,
            client_id: selectedClient,
            agent_id: auth.user?.id,
          }])
          .select();
          
        if (error) throw error;
        
        folderId = data[0].id;
      }
      
      await onSubmit({
        name,
        folderId,
        clientId: selectedClient
      });
      
      // Reset form
      setName('');
      setSelectedFolder(undefined);
      setSelectedClient(undefined);
      setCreateNew(false);
      setNewFolderName('');
      
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating offer plate:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Créer un devis</DialogTitle>
          <DialogDescription>
            Créez un nouveau devis et assignez-le à un dossier.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div>
            <Label htmlFor="name">Nom du devis</Label>
            <Input 
              id="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="Ex: Site vitrine + SEO" 
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="client">Client</Label>
            <Select 
              value={selectedClient} 
              onValueChange={setSelectedClient}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Sélectionner un client" />
              </SelectTrigger>
              <SelectContent>
                {clientsLoading ? (
                  <SelectItem value="loading" disabled>Chargement...</SelectItem>
                ) : clients.length > 0 ? (
                  clients.map(client => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.lastName} {client.firstName}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="none" disabled>Aucun client</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          
          {selectedClient && (
            <div>
              <div className="flex items-center justify-between">
                <Label>Dossier</Label>
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={() => setCreateNew(!createNew)}
                  className="text-xs h-7 px-2"
                >
                  {createNew ? "Utiliser un dossier existant" : "Créer un nouveau dossier"}
                </Button>
              </div>
              
              {createNew ? (
                <div className="flex items-center mt-1 gap-2">
                  <Input
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    placeholder="Nom du nouveau dossier"
                  />
                  <Button 
                    type="button" 
                    size="icon" 
                    variant="outline" 
                    className="shrink-0"
                  >
                    <UserPlus className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Select 
                  value={selectedFolder} 
                  onValueChange={setSelectedFolder}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Sélectionner un dossier" />
                  </SelectTrigger>
                  <SelectContent>
                    {foldersLoading ? (
                      <SelectItem value="loading" disabled>Chargement...</SelectItem>
                    ) : folders.filter(f => f.clientId === selectedClient).length > 0 ? (
                      folders
                        .filter(f => f.clientId === selectedClient)
                        .map(folder => (
                          <SelectItem key={folder.id} value={folder.id}>
                            {folder.name}
                          </SelectItem>
                        ))
                    ) : (
                      <SelectItem value="none" disabled>Aucun dossier pour ce client</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              )}
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button 
            type="button"
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Annuler
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting || !name || (!selectedFolder && !createNew) || (createNew && !newFolderName)}
          >
            {isSubmitting ? "Création..." : "Créer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateOfferPlateDialog;
