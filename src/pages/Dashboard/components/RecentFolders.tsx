
import React from 'react';
import { Card } from '@/components/ui/card';
import { Folder } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface RecentFoldersProps {
  folders: Folder[];
  loading: boolean;
}

export const RecentFolders: React.FC<RecentFoldersProps> = ({ folders, loading }) => {
  const navigate = useNavigate();
  const displayedFolders = folders.slice(0, 3);

  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Derniers dossiers</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate('/folders')}
        >
          Voir tout
        </Button>
      </div>
      
      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-12 bg-muted animate-pulse rounded"></div>
          ))}
        </div>
      ) : displayedFolders.length > 0 ? (
        displayedFolders.map((folder) => (
          <div key={folder.id} className="mb-2 p-2 hover:bg-gray-50 rounded">
            <p className="font-medium">{folder.name}</p>
            <p className="text-sm text-muted-foreground">
              Créé {formatDistanceToNow(new Date(folder.createdAt), { addSuffix: true, locale: fr })}
            </p>
          </div>
        ))
      ) : (
        <p className="text-muted-foreground">Aucun dossier récent</p>
      )}
    </Card>
  );
};
