
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { Folder, UserRole } from "@/types";
import { fetchFolders } from "./FoldersService";
import FolderCard from "./components/FolderCard";
import FolderDetailView from "./components/FolderDetailView";
import CreateFolderDialog from "./components/CreateFolderDialog";
import { Search, Plus } from "lucide-react";

const FoldersPage: React.FC = () => {
  const { toast } = useToast();
  const { auth, hasRole } = useAuth();
  
  const [folders, setFolders] = useState<Folder[]>([]);
  const [filteredFolders, setFilteredFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const isAgent = hasRole([UserRole.AGENT, UserRole.ADMIN]);

  const loadFolders = async () => {
    if (!auth.user) return;
    
    try {
      setLoading(true);
      const data = await fetchFolders(auth.user.id, isAgent);
      setFolders(data);
      setFilteredFolders(data);
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
    loadFolders();
  }, [auth.user, isAgent]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredFolders(folders);
    } else {
      const filtered = folders.filter(folder => 
        folder.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredFolders(filtered);
    }
  }, [searchTerm, folders]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  if (selectedFolder) {
    return (
      <FolderDetailView 
        folder={selectedFolder} 
        onBack={() => setSelectedFolder(null)} 
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <h1 className="text-3xl font-bold">Dossiers</h1>
        {isAgent && (
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nouveau dossier
          </Button>
        )}
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un dossier..."
            className="pl-8"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>
      
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-36 bg-muted animate-pulse rounded-md" />
          ))}
        </div>
      ) : filteredFolders.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredFolders.map((folder) => (
            <FolderCard
              key={folder.id}
              folder={folder}
              onSelect={setSelectedFolder}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border rounded-md">
          <p className="text-muted-foreground">Aucun dossier trouvé</p>
          {isAgent && (
            <Button 
              variant="link" 
              className="mt-2" 
              onClick={() => setDialogOpen(true)}
            >
              Créer un nouveau dossier
            </Button>
          )}
        </div>
      )}
      
      {isAgent && (
        <CreateFolderDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onSuccess={loadFolders}
        />
      )}
    </div>
  );
};

export default FoldersPage;
