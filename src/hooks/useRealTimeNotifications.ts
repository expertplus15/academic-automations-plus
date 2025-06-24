
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Notification {
  id: string;
  type: 'exam_scheduled' | 'exam_cancelled' | 'conflict_detected' | 'supervisor_assigned' | 'room_changed' | 'general';
  title: string;
  message: string;
  data?: any;
  timestamp: Date;
  read: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export function useRealTimeNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      read: false
    };

    setNotifications(prev => [newNotification, ...prev.slice(0, 49)]); // Keep last 50 notifications
    setUnreadCount(prev => prev + 1);

    // Show toast based on priority
    const showToast = () => {
      switch (notification.priority) {
        case 'urgent':
          toast.error(notification.title, {
            description: notification.message,
            duration: 10000,
          });
          break;
        case 'high':
          toast.warning(notification.title, {
            description: notification.message,
            duration: 7000,
          });
          break;
        case 'medium':
          toast.info(notification.title, {
            description: notification.message,
            duration: 5000,
          });
          break;
        case 'low':
          toast(notification.title, {
            description: notification.message,
            duration: 3000,
          });
          break;
      }
    };

    showToast();
    return newNotification;
  }, []);

  const markAsRead = useCallback((notificationId: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId && !notif.read
          ? { ...notif, read: true }
          : notif
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
    setUnreadCount(0);
  }, []);

  const removeNotification = useCallback((notificationId: string) => {
    setNotifications(prev => {
      const filtered = prev.filter(notif => notif.id !== notificationId);
      const removedNotif = prev.find(notif => notif.id === notificationId);
      if (removedNotif && !removedNotif.read) {
        setUnreadCount(count => Math.max(0, count - 1));
      }
      return filtered;
    });
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  // Setup real-time subscriptions
  useEffect(() => {
    const setupRealTimeSubscriptions = () => {
      // Subscribe to exam sessions changes
      const examSessionsChannel = supabase
        .channel('exam_sessions_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'exam_sessions'
          },
          (payload) => {
            console.log('Exam session change:', payload);
            
            switch (payload.eventType) {
              case 'INSERT':
                addNotification({
                  type: 'exam_scheduled',
                  title: 'Nouvel examen programmé',
                  message: `Un examen a été programmé`,
                  data: payload.new,
                  priority: 'medium'
                });
                break;
              case 'UPDATE':
                if (payload.new.status === 'cancelled') {
                  addNotification({
                    type: 'exam_cancelled',
                    title: 'Examen annulé',
                    message: `Un examen a été annulé`,
                    data: payload.new,
                    priority: 'high'
                  });
                } else if (payload.new.room_id !== payload.old.room_id) {
                  addNotification({
                    type: 'room_changed',
                    title: 'Changement de salle',
                    message: `La salle d'un examen a été modifiée`,
                    data: payload.new,
                    priority: 'medium'
                  });
                }
                break;
            }
          }
        )
        .subscribe((status) => {
          console.log('Exam sessions subscription status:', status);
          setIsConnected(status === 'SUBSCRIBED');
        });

      // Subscribe to exam conflicts
      const conflictsChannel = supabase
        .channel('exam_conflicts_changes')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'exam_conflicts'
          },
          (payload) => {
            console.log('New conflict detected:', payload);
            addNotification({
              type: 'conflict_detected',
              title: 'Conflit détecté',
              message: `Un nouveau conflit a été détecté dans le planning`,
              data: payload.new,
              priority: 'urgent'
            });
          }
        )
        .subscribe();

      // Subscribe to supervisor assignments
      const supervisorsChannel = supabase
        .channel('supervisor_assignments_changes')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'exam_supervisors'
          },
          (payload) => {
            console.log('Supervisor assigned:', payload);
            addNotification({
              type: 'supervisor_assigned',
              title: 'Surveillant assigné',
              message: `Un surveillant a été assigné à un examen`,
              data: payload.new,
              priority: 'low'
            });
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(examSessionsChannel);
        supabase.removeChannel(conflictsChannel);
        supabase.removeChannel(supervisorsChannel);
      };
    };

    const cleanup = setupRealTimeSubscriptions();
    return cleanup;
  }, [addNotification]);

  // Simulate some notifications for demo purposes
  useEffect(() => {
    const timer = setTimeout(() => {
      addNotification({
        type: 'general',
        title: 'Système de notifications activé',
        message: 'Les notifications en temps réel sont maintenant actives',
        priority: 'low'
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, [addNotification]);

  return {
    notifications,
    unreadCount,
    isConnected,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications
  };
}

// Hook pour les notifications spécifiques aux examens
export function useExamNotifications() {
  const { addNotification } = useRealTimeNotifications();

  const notifyExamScheduled = useCallback((examData: any) => {
    addNotification({
      type: 'exam_scheduled',
      title: 'Examen planifié',
      message: `L'examen "${examData.title}" a été planifié avec succès`,
      data: examData,
      priority: 'medium'
    });
  }, [addNotification]);

  const notifyConflictDetected = useCallback((conflictData: any) => {
    addNotification({
      type: 'conflict_detected',
      title: 'Conflit détecté',
      message: `Conflit ${conflictData.type}: ${conflictData.description}`,
      data: conflictData,
      priority: conflictData.severity === 'critical' ? 'urgent' : 'high'
    });
  }, [addNotification]);

  const notifySupervisorAssigned = useCallback((supervisorData: any, examData: any) => {
    addNotification({
      type: 'supervisor_assigned',
      title: 'Surveillant assigné',
      message: `${supervisorData.name} a été assigné à l'examen ${examData.title}`,
      data: { supervisor: supervisorData, exam: examData },
      priority: 'low'
    });
  }, [addNotification]);

  return {
    notifyExamScheduled,
    notifyConflictDetected,
    notifySupervisorAssigned
  };
}
