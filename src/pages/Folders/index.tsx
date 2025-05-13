
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { fetchUserFolders, fetchFolderById, fetchFolderOfferPlates, fetchFolderQuotes } from './FoldersService';
import { Folder } from '@/types';
import FolderCard from './components/FolderCard';
import FolderDetailView from './components/FolderDetailView';
import useFoldersSubscription from '@/hooks/useFoldersSubscription';

const FoldersPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { auth } = useAuth();
  const userId = auth.user?.id;
  
  // Set up real-time subscription
  useFoldersSubscription(userId);
  
  const { data: folders = [], isLoading: isFoldersLoading } = useQuery({
    queryKey: ['folders', userId],
    queryFn: () => fetchUserFolders(userId || ''),
    enabled: !!userId && !id
  });
  
  const { data: folder } = useQuery({
    queryKey: ['folder', id],
    queryFn: () => fetchFolderById(id!),
    enabled: !!id
  });
  
  const { data: offerPlates = [] } = useQuery({
    queryKey: ['folder-offer-plates', id],
    queryFn: () => fetchFolderOfferPlates(id!),
    enabled: !!id
  });
  
  const { data: quotes = [] } = useQuery({
    queryKey: ['folder-quotes', id],
    queryFn: () => fetchFolderQuotes(id!),
    enabled: !!id
  });
  
  if (id && folder) {
    return (
      <FolderDetailView
        folder={folder}
        offerPlates={offerPlates}
        quotes={quotes}
        onBackClick={() => navigate('/folders')}
      />
    );
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dossiers</h1>
        <p className="text-muted-foreground mt-1">
          Tous les dossiers clients que vous gérez
        </p>
      </div>
      
      {isFoldersLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-32 bg-muted rounded-md"></div>
            </div>
          ))}
        </div>
      ) : folders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {folders.map((folder) => (
            <FolderCard
              key={folder.id}
              folder={folder}
              onClick={() => navigate(`/folders/${folder.id}`)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-xl text-muted-foreground">
            Vous n'avez aucun dossier pour le moment
          </p>
        </div>
      )}
    </div>
  );
};

export default FoldersPage;
