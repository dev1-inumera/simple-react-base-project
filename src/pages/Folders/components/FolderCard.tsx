
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Folder } from '@/types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface FolderCardProps {
  folder: Folder;
  onClick?: () => void;
}

const FolderCard: React.FC<FolderCardProps> = ({ folder, onClick }) => {
  return (
    <Card 
      className="hover:bg-accent/5 transition-colors cursor-pointer"
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{folder.name}</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        <div>
          Créé le {format(new Date(folder.createdAt), 'PP', { locale: fr })}
        </div>
      </CardContent>
    </Card>
  );
};

export default FolderCard;
