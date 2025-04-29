
import { useState, useEffect } from 'react';
import { Folder } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { fetchFolders } from '@/pages/Folders/FoldersService';

export const useFoldersSubscription = (userId: string) => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFolders = async () => {
      try {
        setLoading(true);
        const data = await fetchFolders(userId, false);
        setFolders(data);
      } catch (error) {
        console.error("Error loading folders:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFolders();

    const channel = supabase
      .channel('folders-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'folders',
          filter: `client_id=eq.${userId}`
        },
        () => {
          loadFolders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  return { folders, loading };
};
