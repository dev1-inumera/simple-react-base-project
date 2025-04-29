
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { User } from "@/types";
import { fetchClientDetails, fetchClientFolders, fetchClientQuotes } from "../ClientsService";
import { ArrowLeft } from "lucide-react";
import { createFolder } from "@/pages/Folders/FoldersService";
import { useAuth } from "@/lib/auth";
import ClientInfo from "./ClientInfo";
import ClientFolders from "./ClientFolders";
import ClientQuotes from "./ClientQuotes";

interface ClientDetailViewProps {
  clientId: string;
  onBack: () => void;
}

const ClientDetailView: React.FC<ClientDetailViewProps> = ({ clientId, onBack }) => {
  const { toast } = useToast();
  const { auth } = useAuth();
  
  const [client, setClient] = useState<User | null>(null);
  const [folders, setFolders] = useState<any[]>([]);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creatingFolder, setCreatingFolder] = useState(false);

  const loadClientDetails = async () => {
    try {
      setLoading(true);
      
      const [clientData, foldersData, quotesData] = await Promise.all([
        fetchClientDetails(clientId),
        fetchClientFolders(clientId),
        fetchClientQuotes(clientId)
      ]);
      
      setClient(clientData);
      setFolders(foldersData);
      setQuotes(quotesData);
    } catch (error: any) {
      toast({
        title: "Erreur de chargement",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClientDetails();
  }, [clientId]);

  const handleCreateFolder = async () => {
    if (!auth.user || !client) return;
    
    try {
      setCreatingFolder(true);
      const folderName = `Dossier de ${client.firstName} ${client.lastName}`;
      await createFolder(folderName, clientId, auth.user.id);
      
      toast({
        title: "Dossier créé",
        description: "Le dossier a été créé avec succès.",
      });
      
      loadClientDetails();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setCreatingFolder(false);
    }
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={onBack} className="mr-2">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <h2 className="text-2xl font-bold">
          Fiche client
        </h2>
      </div>

      <ClientInfo
        client={client}
        loading={loading}
        onCreateFolder={handleCreateFolder}
        creatingFolder={creatingFolder}
      />

      <Tabs defaultValue="folders">
        <TabsList className="mb-4">
          <TabsTrigger value="folders">Dossiers</TabsTrigger>
          <TabsTrigger value="quotes">Devis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="folders">
          <ClientFolders folders={folders} loading={loading} />
        </TabsContent>
        
        <TabsContent value="quotes">
          <ClientQuotes quotes={quotes} loading={loading} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClientDetailView;
