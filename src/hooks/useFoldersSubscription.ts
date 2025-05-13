
import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Folder } from '@/types';

/**
 * Hook to subscribe to real-time folder changes in Supabase
 */
export const useFoldersSubscription = (userId?: string) => {
  const queryClient = useQueryClient();
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch folders
  useEffect(() => {
    if (!userId) return;

    const fetchFolders = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('folders')
          .select('*')
          .or(`agent_id.eq.${userId},client_id.eq.${userId}`);

        if (error) throw error;
        
        // Map the data to the Folder type
        const mappedFolders: Folder[] = (data || []).map(folder => ({
          id: folder.id,
          name: folder.name,
          clientId: folder.client_id,
          agentId: folder.agent_id,
          createdAt: folder.created_at,
          updatedAt: folder.updated_at,
          quoteId: folder.quote_id
        }));
        
        setFolders(mappedFolders);
      } catch (error) {
        console.error('Error fetching folders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFolders();

    // Subscribe to changes on folders for this user (as agent or client)
    const folderChannel = supabase
      .channel('folders-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'folders',
        filter: `agent_id=eq.${userId}`
      }, () => {
        // Invalidate folders query to refresh data
        queryClient.invalidateQueries({ queryKey: ['folders', userId] });
        fetchFolders();
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'folders',
        filter: `client_id=eq.${userId}`
      }, () => {
        // Invalidate folders query to refresh data
        queryClient.invalidateQueries({ queryKey: ['folders', userId] });
        fetchFolders();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(folderChannel);
    };
  }, [userId, queryClient]);

  return { folders, loading };
};

// Also export as default for backward compatibility
export default useFoldersSubscription;
