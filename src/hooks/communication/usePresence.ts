import { useState, useCallback } from 'react';

export function usePresence() {
  const [presenceData, setPresenceData] = useState<Record<string, any>>({});

  const updatePresence = useCallback(async (status: string, activity?: string) => {
    // Mock implementation
  }, []);

  const getUserStatus = useCallback((userId: string) => {
    return 'OFFLINE' as 'ONLINE' | 'OFFLINE' | 'AWAY';
  }, []);

  const getOnlineUsers = useCallback(() => {
    return [];
  }, []);

  const getUserActivity = useCallback((userId: string) => {
    return undefined;
  }, []);

  return {
    presenceData,
    updatePresence,
    getUserStatus,
    getUserActivity,
    getOnlineUsers
  };
}