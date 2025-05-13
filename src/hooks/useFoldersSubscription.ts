
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Folder } from '@/types';

/**
 * Hook to subscribe to real-time folder changes in Supabase
 */
const useFoldersSubscription = (userId?: string) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!userId) return;

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
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'folders',
        filter: `client_id=eq.${userId}`
      }, () => {
        // Invalidate folders query to refresh data
        queryClient.invalidateQueries({ queryKey: ['folders', userId] });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(folderChannel);
    };
  }, [userId, queryClient]);
};

export default useFoldersSubscription;
