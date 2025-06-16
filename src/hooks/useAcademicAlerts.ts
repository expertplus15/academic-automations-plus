
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AcademicAlert {
  id: string;
  student_id: string;
  alert_type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  related_subject_id?: string;
  threshold_value?: number;
  current_value?: number;
  is_active: boolean;
  is_read: boolean;
  acknowledged_by?: string;
  acknowledged_at?: string;
  expires_at?: string;
  created_at: string;
  updated_at: string;
}

export interface AlertsFilters {
  severity?: string;
  alert_type?: string;
  student_id?: string;
  is_read?: boolean;
  is_active?: boolean;
}

export function useAcademicAlerts(filters?: AlertsFilters) {
  const [alerts, setAlerts] = useState<AcademicAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('academic_alerts')
        .select(`
          *,
          students!inner(
            id,
            student_number,
            profiles!inner(full_name)
          ),
          subjects(name)
        `)
        .order('created_at', { ascending: false });

      if (filters?.severity) {
        query = query.eq('severity', filters.severity);
      }
      if (filters?.alert_type) {
        query = query.eq('alert_type', filters.alert_type);
      }
      if (filters?.student_id) {
        query = query.eq('student_id', filters.student_id);
      }
      if (filters?.is_read !== undefined) {
        query = query.eq('is_read', filters.is_read);
      }
      if (filters?.is_active !== undefined) {
        query = query.eq('is_active', filters.is_active);
      }

      const { data, error } = await query;

      if (error) {
        setError(error.message);
      } else {
        setAlerts(data || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (alertId: string) => {
    const { error } = await supabase
      .from('academic_alerts')
      .update({ is_read: true })
      .eq('id', alertId);

    if (!error) {
      setAlerts(prev => prev.map(alert => 
        alert.id === alertId ? { ...alert, is_read: true } : alert
      ));
    }
    return { error };
  };

  const acknowledgeAlert = async (alertId: string) => {
    const { error } = await supabase
      .from('academic_alerts')
      .update({ 
        acknowledged_by: (await supabase.auth.getUser()).data.user?.id,
        acknowledged_at: new Date().toISOString()
      })
      .eq('id', alertId);

    if (!error) {
      fetchAlerts(); // Refresh data
    }
    return { error };
  };

  const deactivateAlert = async (alertId: string) => {
    const { error } = await supabase
      .from('academic_alerts')
      .update({ is_active: false })
      .eq('id', alertId);

    if (!error) {
      setAlerts(prev => prev.map(alert => 
        alert.id === alertId ? { ...alert, is_active: false } : alert
      ));
    }
    return { error };
  };

  useEffect(() => {
    fetchAlerts();
  }, [JSON.stringify(filters)]);

  return {
    alerts,
    loading,
    error,
    refetch: fetchAlerts,
    markAsRead,
    acknowledgeAlert,
    deactivateAlert
  };
}
