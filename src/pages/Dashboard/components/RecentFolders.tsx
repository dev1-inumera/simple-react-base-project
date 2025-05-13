
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Folder } from '@/types';
import { useNavigate } from 'react-router-dom';
import FolderCard from '@/pages/Folders/components/FolderCard';

interface RecentFoldersProps {
  folders: Folder[];
  loading?: boolean;
}

const RecentFolders: React.FC<RecentFoldersProps> = ({ folders, loading }) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Dossiers récents</CardTitle>
          <CardDescription>Vos derniers dossiers clients</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-24 bg-muted rounded-md"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dossiers récents</CardTitle>
        <CardDescription>Vos derniers dossiers clients</CardDescription>
      </CardHeader>
      <CardContent>
        {folders.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {folders.slice(0, 3).map((folder) => (
              <FolderCard
                key={folder.id}
                folder={folder}
                onClick={() => navigate(`/folders/${folder.id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Aucun dossier récent
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentFolders;
