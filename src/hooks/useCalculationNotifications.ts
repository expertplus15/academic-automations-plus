import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface CalculationNotification {
  id: string;
  type: 'averages' | 'ects' | 'all' | 'advanced';
  status: 'pending' | 'success' | 'error';
  message: string;
  progress?: number;
  timestamp: Date;
  duration?: number;
}

export function useCalculationNotifications() {
  const [notifications, setNotifications] = useState<CalculationNotification[]>([]);
  const { toast } = useToast();

  const addNotification = useCallback((
    type: CalculationNotification['type'],
    message: string,
    status: CalculationNotification['status'] = 'pending'
  ) => {
    const notification: CalculationNotification = {
      id: Date.now().toString(),
      type,
      status,
      message,
      timestamp: new Date(),
    };

    setNotifications(prev => [notification, ...prev.slice(0, 9)]); // Keep last 10
    return notification.id;
  }, []);

  const updateNotification = useCallback((
    id: string,
    updates: Partial<CalculationNotification>
  ) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, ...updates }
          : notification
      )
    );
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev =>
      prev.filter(notification => notification.id !== id)
    );
  }, []);

  const notifyCalculationStart = useCallback((
    type: CalculationNotification['type'],
    message: string
  ) => {
    const id = addNotification(type, message, 'pending');
    
    toast({
      title: "Calcul en cours",
      description: message,
    });

    return id;
  }, [addNotification, toast]);

  const notifyCalculationSuccess = useCallback((
    id: string,
    message: string,
    duration?: number
  ) => {
    updateNotification(id, {
      status: 'success',
      message,
      duration,
      progress: 100
    });

    toast({
      title: "Calcul terminé",
      description: message,
    });

    // Auto-remove after 5 seconds
    setTimeout(() => removeNotification(id), 5000);
  }, [updateNotification, removeNotification, toast]);

  const notifyCalculationError = useCallback((
    id: string,
    message: string
  ) => {
    updateNotification(id, {
      status: 'error',
      message
    });

    toast({
      title: "Erreur de calcul",
      description: message,
      variant: "destructive",
    });

    // Auto-remove after 10 seconds
    setTimeout(() => removeNotification(id), 10000);
  }, [updateNotification, removeNotification, toast]);

  const updateProgress = useCallback((id: string, progress: number) => {
    updateNotification(id, { progress });
  }, [updateNotification]);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const getNotificationsByType = useCallback((type: CalculationNotification['type']) => {
    return notifications.filter(notification => notification.type === type);
  }, [notifications]);

  const getPendingNotifications = useCallback(() => {
    return notifications.filter(notification => notification.status === 'pending');
  }, [notifications]);

  return {
    notifications,
    addNotification,
    updateNotification,
    removeNotification,
    notifyCalculationStart,
    notifyCalculationSuccess,
    notifyCalculationError,
    updateProgress,
    clearAllNotifications,
    getNotificationsByType,
    getPendingNotifications,
    hasActiveCalculations: getPendingNotifications().length > 0,
  };
}