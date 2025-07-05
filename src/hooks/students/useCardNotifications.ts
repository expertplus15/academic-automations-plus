import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ExpiringCard {
  card_id: string;
  student_name: string;
  student_email: string;
  card_number: string;
  expiry_date: string;
  days_until_expiry: number;
}

interface NotificationSetting {
  id: string;
  notification_type: string;
  days_before: number;
  is_active: boolean;
  recipients: string[];
  message_template: string;
}

export function useCardNotifications() {
  const [expiringCards, setExpiringCards] = useState<ExpiringCard[]>([]);
  const [notifications, setNotifications] = useState<NotificationSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchExpiringCards = async (daysAhead: number = 30) => {
    try {
      const { data, error } = await supabase
        .rpc('get_expiring_cards', { days_ahead: daysAhead });

      if (error) throw error;
      setExpiringCards(data || []);
    } catch (error) {
      console.error('Error fetching expiring cards:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les cartes qui expirent",
        variant: "destructive"
      });
    }
  };

  const fetchNotificationSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('card_notification_settings')
        .select('*')
        .eq('is_active', true)
        .order('notification_type');

      if (error) throw error;
      setNotifications((data || []).map(item => ({
        ...item,
        recipients: Array.isArray(item.recipients) ? item.recipients.map(r => String(r)) : [],
        days_before: item.days_before || 0,
        is_active: item.is_active || false,
        message_template: item.message_template || ''
      })));
    } catch (error) {
      console.error('Error fetching notification settings:', error);
    }
  };

  const createNotificationSetting = async (setting: Omit<NotificationSetting, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('card_notification_settings')
        .insert({
          notification_type: setting.notification_type,
          days_before: setting.days_before,
          is_active: setting.is_active,
          recipients: setting.recipients,
          message_template: setting.message_template
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Notification créée",
        description: "Paramètre de notification ajouté avec succès"
      });

      await fetchNotificationSettings();
      return { success: true, data };
    } catch (error) {
      console.error('Error creating notification setting:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer le paramètre de notification",
        variant: "destructive"
      });
      return { success: false, error };
    }
  };

  const updateNotificationSetting = async (id: string, updates: Partial<NotificationSetting>) => {
    try {
      const { data, error } = await supabase
        .from('card_notification_settings')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Notification mise à jour",
        description: "Paramètre de notification modifié avec succès"
      });

      await fetchNotificationSettings();
      return { success: true, data };
    } catch (error) {
      console.error('Error updating notification setting:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier le paramètre de notification",
        variant: "destructive"
      });
      return { success: false, error };
    }
  };

  const deleteNotificationSetting = async (id: string) => {
    try {
      const { error } = await supabase
        .from('card_notification_settings')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Notification supprimée",
        description: "Paramètre de notification supprimé avec succès"
      });

      await fetchNotificationSettings();
      return { success: true };
    } catch (error) {
      console.error('Error deleting notification setting:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le paramètre de notification",
        variant: "destructive"
      });
      return { success: false, error };
    }
  };

  const getNotificationPriority = (daysUntilExpiry: number): 'low' | 'medium' | 'high' | 'critical' => {
    if (daysUntilExpiry <= 7) return 'critical';
    if (daysUntilExpiry <= 15) return 'high';
    if (daysUntilExpiry <= 30) return 'medium';
    return 'low';
  };

  const getNotificationStats = () => {
    const stats = {
      total: expiringCards.length,
      critical: expiringCards.filter(card => card.days_until_expiry <= 7).length,
      high: expiringCards.filter(card => card.days_until_expiry > 7 && card.days_until_expiry <= 15).length,
      medium: expiringCards.filter(card => card.days_until_expiry > 15 && card.days_until_expiry <= 30).length,
      low: expiringCards.filter(card => card.days_until_expiry > 30).length,
    };

    return stats;
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchExpiringCards(),
        fetchNotificationSettings()
      ]);
      setLoading(false);
    };

    loadData();

    // Set up real-time subscription for card updates
    const channel = supabase
      .channel('card-notifications')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'student_cards'
        },
        () => {
          fetchExpiringCards();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    expiringCards,
    notifications,
    loading,
    getNotificationStats,
    getNotificationPriority,
    fetchExpiringCards,
    createNotificationSetting,
    updateNotificationSetting,
    deleteNotificationSetting
  };
}