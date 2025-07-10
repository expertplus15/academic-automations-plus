import { useState, useEffect } from 'react';

interface CommunicationStats {
  unreadMessages: number;
  activeNotifications: number;
  availableContacts: number;
  publishedAnnouncements: number;
}

export function useCommunicationStats() {
  const [stats] = useState<CommunicationStats>({
    unreadMessages: 5,
    activeNotifications: 8,
    availableContacts: 2847,
    publishedAnnouncements: 12
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simuler le chargement
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return { stats, isLoading };
}