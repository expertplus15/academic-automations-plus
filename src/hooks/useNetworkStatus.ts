import { useState, useEffect, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';

export interface NetworkStatus {
  isOnline: boolean;
  downlink?: number;
  effectiveType?: string;
  rtt?: number;
}

export function useNetworkStatus() {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    isOnline: navigator.onLine
  });
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  const updateNetworkStatus = useCallback(() => {
    const connection = (navigator as any).connection || 
                      (navigator as any).mozConnection || 
                      (navigator as any).webkitConnection;
    
    setNetworkStatus({
      isOnline: navigator.onLine,
      downlink: connection?.downlink,
      effectiveType: connection?.effectiveType,
      rtt: connection?.rtt
    });

    if (navigator.onLine && retryCount > 0) {
      toast({
        title: "Connexion rétablie",
        description: "Vous êtes de nouveau en ligne",
        variant: "default"
      });
      setRetryCount(0);
      setIsRetrying(false);
    }
  }, [retryCount]);

  const handleOffline = useCallback(() => {
    setNetworkStatus(prev => ({ ...prev, isOnline: false }));
    toast({
      title: "Connexion perdue",
      description: "Vérifiez votre connexion internet",
      variant: "destructive"
    });
  }, []);

  const retryConnection = useCallback(() => {
    setIsRetrying(true);
    setRetryCount(prev => prev + 1);
    
    // Simuler une tentative de reconnexion
    setTimeout(() => {
      if (navigator.onLine) {
        updateNetworkStatus();
      } else {
        setIsRetrying(false);
        toast({
          title: `Échec de reconnexion (${retryCount + 1})`,
          description: "Nouvelle tentative dans quelques instants...",
          variant: "destructive"
        });
      }
    }, 2000);
  }, [retryCount, updateNetworkStatus]);

  useEffect(() => {
    const handleOnline = () => updateNetworkStatus();
    const handleOfflineEvent = () => handleOffline();

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOfflineEvent);

    // Update connection info on change
    const connection = (navigator as any).connection;
    if (connection) {
      connection.addEventListener('change', updateNetworkStatus);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOfflineEvent);
      if (connection) {
        connection.removeEventListener('change', updateNetworkStatus);
      }
    };
  }, [updateNetworkStatus, handleOffline]);

  return {
    ...networkStatus,
    retryCount,
    isRetrying,
    retryConnection,
    isSlowConnection: networkStatus.effectiveType === 'slow-2g' || networkStatus.effectiveType === '2g',
    isFastConnection: networkStatus.effectiveType === '4g' || networkStatus.effectiveType === '5g'
  };
}