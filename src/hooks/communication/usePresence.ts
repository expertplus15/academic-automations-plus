import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UserPresence {
  user_id: string;
  status: string | null;
  last_seen_at: string | null;
  custom_status?: string | null;
  user?: {
    full_name: string;
    email: string;
  };
}

export function usePresence() {
  const [presenceData, setPresenceData] = useState<Record<string, UserPresence>>({});
  const [currentUserStatus, setCurrentUserStatus] = useState<string>('OFFLINE');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Update user presence status
  const updatePresence = useCallback(async (status: string, customStatus?: string) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      const { error } = await supabase
        .from('user_presence')
        .upsert({
          user_id: user.user.id,
          status,
          custom_status: customStatus,
          last_seen_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;

      setCurrentUserStatus(status);
    } catch (error) {
      console.error('Error updating presence:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour le statut',
        variant: 'destructive'
      });
    }
  }, [toast]);

  // Fetch all user presence data
  const fetchPresence = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_presence')
        .select(`
          *,
          profiles (full_name, email)
        `);

      if (error) throw error;

      const presenceMap = (data || []).reduce((acc, presence) => {
        acc[presence.user_id] = {
          ...presence,
          user: presence.profiles
        };
        return acc;
      }, {} as Record<string, UserPresence>);

      setPresenceData(presenceMap);
    } catch (error) {
      console.error('Error fetching presence:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Get online users
  const getOnlineUsers = useCallback(() => {
    return Object.values(presenceData).filter(p => p.status === 'ONLINE');
  }, [presenceData]);

  // Get user status
  const getUserStatus = useCallback((userId: string) => {
    return presenceData[userId]?.status || 'OFFLINE';
  }, [presenceData]);

  // Set up real-time presence updates
  useEffect(() => {
    const presenceSubscription = supabase
      .channel('user_presence')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'user_presence' },
        (payload) => {
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            const presence = payload.new as UserPresence;
            setPresenceData(prev => ({
              ...prev,
              [presence.user_id]: presence
            }));
          } else if (payload.eventType === 'DELETE') {
            const presence = payload.old as UserPresence;
            setPresenceData(prev => {
              const newData = { ...prev };
              delete newData[presence.user_id];
              return newData;
            });
          }
        }
      )
      .subscribe();

    return () => {
      presenceSubscription.unsubscribe();
    };
  }, []);

  // Set online status when component mounts and offline when unmounts
  useEffect(() => {
    updatePresence('ONLINE');

    const handleBeforeUnload = () => {
      updatePresence('OFFLINE');
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        updatePresence('AWAY');
      } else {
        updatePresence('ONLINE');
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Fetch initial presence data
    fetchPresence();

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      updatePresence('OFFLINE');
    };
  }, [updatePresence, fetchPresence]);

  // Heartbeat to keep presence alive
  useEffect(() => {
    const interval = setInterval(() => {
      if (currentUserStatus === 'ONLINE') {
        updatePresence('ONLINE');
      }
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [currentUserStatus, updatePresence]);

  return {
    presenceData,
    currentUserStatus,
    loading,
    updatePresence,
    fetchPresence,
    getOnlineUsers,
    getUserStatus
  };
}
