import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Notification {
  id: string;
  type: 'contract_expiry' | 'evaluation_due' | 'maintenance_due' | 'booking_request' | 'procurement_approval';
  title: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  target_user_id?: string;
  target_role?: string;
  related_entity_id?: string;
  related_entity_type?: string;
  is_read: boolean;
  scheduled_for?: string;
  created_at: string;
  data?: any;
}

export function useNotificationSystem() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Simuler les notifications avec des données locales pour l'instant
  const mockNotifications: Notification[] = [
    {
      id: '1',
      type: 'contract_expiry',
      title: 'Contrat expirant bientôt',
      message: 'Le contrat de Marie Dubois expire dans 30 jours',
      severity: 'high',
      target_role: 'hr',
      is_read: false,
      created_at: new Date().toISOString(),
      data: { teacher_id: '1', expiry_date: '2024-02-15' }
    },
    {
      id: '2',
      type: 'evaluation_due',
      title: 'Évaluation en retard',
      message: 'L\'évaluation de Jean Martin est en retard de 5 jours',
      severity: 'medium',
      target_role: 'hr',
      is_read: false,
      created_at: new Date(Date.now() - 86400000).toISOString(),
      data: { teacher_id: '2', due_date: '2024-01-10' }
    },
    {
      id: '3',
      type: 'booking_request',
      title: 'Nouvelle demande de réservation',
      message: 'Demande de réservation pour la salle informatique',
      severity: 'low',
      target_role: 'admin',
      is_read: true,
      created_at: new Date(Date.now() - 172800000).toISOString(),
      data: { booking_id: '1', room_name: 'Salle informatique' }
    },
    {
      id: '4',
      type: 'maintenance_due',
      title: 'Maintenance programmée',
      message: 'Maintenance préventive du projecteur P001 prévue demain',
      severity: 'medium',
      target_role: 'hr',
      is_read: false,
      created_at: new Date(Date.now() - 3600000).toISOString(),
      data: { asset_id: '1', asset_name: 'Projecteur P001' }
    }
  ];

  const fetchNotifications = async () => {
    setLoading(true);
    // Simuler un délai de chargement
    setTimeout(() => {
      setNotifications(mockNotifications);
      setUnreadCount(mockNotifications.filter(n => !n.is_read).length);
      setLoading(false);
    }, 500);
  };

  const markAsRead = async (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, is_read: true } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
    
    toast({
      title: "Notification marquée comme lue",
      variant: "default",
    });
  };

  const markAllAsRead = async () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, is_read: true }))
    );
    setUnreadCount(0);
    
    toast({
      title: "Toutes les notifications marquées comme lues",
      variant: "default",
    });
  };

  const deleteNotification = async (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    const notification = notifications.find(n => n.id === id);
    if (notification && !notification.is_read) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
    
    toast({
      title: "Notification supprimée",
      variant: "default",
    });
  };

  const createNotification = async (notificationData: Partial<Notification>) => {
    const newNotification: Notification = {
      id: Date.now().toString(),
      type: notificationData.type || 'booking_request',
      title: notificationData.title || 'Nouvelle notification',
      message: notificationData.message || '',
      severity: notificationData.severity || 'medium',
      target_role: notificationData.target_role,
      target_user_id: notificationData.target_user_id,
      related_entity_id: notificationData.related_entity_id,
      related_entity_type: notificationData.related_entity_type,
      is_read: false,
      created_at: new Date().toISOString(),
      data: notificationData.data
    };

    setNotifications(prev => [newNotification, ...prev]);
    setUnreadCount(prev => prev + 1);
    
    toast({
      title: "Nouvelle notification",
      description: newNotification.message,
      variant: "default",
    });
    
    return newNotification;
  };

  // Fonction pour détecter automatiquement les alertes
  const checkAutomaticAlerts = async () => {
    // Vérifier les contrats expirants
    // Vérifier les évaluations en retard
    // Vérifier les maintenances dues
    // etc.
    
    // Pour l'instant, simulation
    console.log('Vérification des alertes automatiques...');
  };

  useEffect(() => {
    fetchNotifications();
    
    // Vérifier les alertes toutes les heures
    const interval = setInterval(checkAutomaticAlerts, 3600000);
    
    return () => clearInterval(interval);
  }, []);

  return {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    createNotification,
    checkAutomaticAlerts
  };
}