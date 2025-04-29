
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FolderOpen } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

interface ClientFoldersProps {
  folders: any[];
  loading: boolean;
}

const ClientFolders: React.FC<ClientFoldersProps> = ({ folders, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="h-32 bg-muted animate-pulse rounded-md" />
        ))}
      </div>
    );
  }

  if (folders.length === 0) {
    return (
      <div className="text-center py-12 border rounded-md">
        <p className="text-muted-foreground">Aucun dossier trouvé</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {folders.map((folder) => (
        <Card key={folder.id}>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <FolderOpen className="h-5 w-5 mr-2" />
              {folder.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground mb-2">
              Créé {formatDistanceToNow(new Date(folder.created_at), { addSuffix: true, locale: fr })}
            </p>
            <p className="text-sm mb-3">
              Agent: {folder.profiles.first_name} {folder.profiles.last_name}
            </p>
            <Button size="sm">Voir détails</Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ClientFolders;
