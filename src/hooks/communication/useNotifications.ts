import { useState, useEffect, useCallback } from 'react';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Notification schema
export const notificationSchema = z.object({
  title: z.string().min(1, 'Titre requis').max(255, 'Titre trop long'),
  message: z.string().min(1, 'Message requis'),
  notification_type: z.enum(['MESSAGE', 'EVENT', 'SYSTEM', 'REMINDER']),
  reference_id: z.string().uuid().optional(),
  reference_type: z.string().optional(),
  expires_at: z.date().optional()
});

interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  notification_type: string;
  reference_id: string | null;
  reference_type: string | null;
  is_read: boolean | null;
  is_sent_email: boolean | null;
  expires_at: string | null;
  created_at: string;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      setNotifications(data || []);
      setUnreadCount((data || []).filter(n => !n.is_read).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les notifications',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Create notification (for admins)
  const createNotification = useCallback(async (
    userId: string, 
    data: z.infer<typeof notificationSchema>
  ) => {
    try {
      const validatedData = notificationSchema.parse(data);

      const { data: notification, error } = await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          title: validatedData.title,
          message: validatedData.message,
          notification_type: validatedData.notification_type,
          reference_id: validatedData.reference_id,
          reference_type: validatedData.reference_type,
          expires_at: validatedData.expires_at?.toISOString(),
          is_read: false
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Notification envoyée',
        description: 'La notification a été envoyée avec succès'
      });

      return notification;
    } catch (error) {
      console.error('Error creating notification:', error);
      toast({
        title: 'Erreur',
        description: error instanceof z.ZodError 
          ? error.errors[0].message 
          : 'Impossible de créer la notification',
        variant: 'destructive'
      });
      throw error;
    }
  }, [toast]);

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, is_read: true }
            : notif
        )
      );

      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking as read:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de marquer comme lu',
        variant: 'destructive'
      });
    }
  }, [toast]);

  // Mark all as read
  const markAllAsRead = useCallback(async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user.user.id)
        .eq('is_read', false);

      if (error) throw error;

      setNotifications(prev => 
        prev.map(notif => ({ 
          ...notif, 
          is_read: true 
        }))
      );

      setUnreadCount(0);

      toast({
        title: 'Notifications marquées',
        description: 'Toutes les notifications ont été marquées comme lues'
      });
    } catch (error) {
      console.error('Error marking all as read:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de marquer toutes comme lues',
        variant: 'destructive'
      });
    }
  }, [toast]);

  // Delete notification
  const deleteNotification = useCallback(async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      
      // Update unread count if the deleted notification was unread
      const notification = notifications.find(n => n.id === notificationId);
      if (notification && !notification.is_read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer la notification',
        variant: 'destructive'
      });
    }
  }, [notifications, toast]);

  // Show browser notification
  const showBrowserNotification = useCallback((notification: Notification) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico',
        tag: notification.id
      });
    }
  }, []);

  // Request notification permission
  const requestNotificationPermission = useCallback(async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  }, []);

  // Set up real-time notifications
  useEffect(() => {
    let notificationsSubscription: any;
    
    const setupSubscription = async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;
      
      notificationsSubscription = supabase
        .channel('notifications')
        .on('postgres_changes',
          { 
            event: 'INSERT', 
            schema: 'public', 
            table: 'notifications',
            filter: `user_id=eq.${user.user.id}`
          },
          (payload) => {
            const newNotification = payload.new as Notification;
            setNotifications(prev => [newNotification, ...prev]);
            setUnreadCount(prev => prev + 1);
            
            // Show browser notification
            showBrowserNotification(newNotification);
            
            // Show toast for important notifications
            toast({
              title: newNotification.title,
              description: newNotification.message,
              variant: newNotification.notification_type === 'SYSTEM' ? 'destructive' : 'default'
            });
          }
        )
        .subscribe();
    };

    setupSubscription();

    return () => {
      if (notificationsSubscription) {
        notificationsSubscription.unsubscribe();
      }
    };
  }, [showBrowserNotification, toast]);

  // Initialize
  useEffect(() => {
    fetchNotifications();
    requestNotificationPermission();
  }, [fetchNotifications, requestNotificationPermission]);

  return {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    createNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    requestNotificationPermission
  };
}