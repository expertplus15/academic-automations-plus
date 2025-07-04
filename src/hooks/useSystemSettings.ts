import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface SystemSettings {
  id: string;
  institution_name: string;
  institution_logo_url?: string;
  institution_address?: string;
  institution_email?: string;
  institution_phone?: string;
  default_language: string;
  default_currency: string;
  default_timezone: string;
  date_format: string;
  academic_year_auto_init: boolean;
  grade_scale_max: number;
  passing_grade_min: number;
  attendance_required_percentage: number;
  created_at: string;
  updated_at: string;
}

export function useSystemSettings() {
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('system_settings')
        .select('*')
        .single();

      if (error) {
        setError(error.message);
        setSettings(null);
      } else {
        setSettings(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      setSettings(null);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (updates: Partial<SystemSettings>) => {
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .update(updates)
        .eq('id', settings?.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      setSettings(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour');
      throw err;
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return { 
    settings, 
    loading, 
    error, 
    updateSettings,
    refetch: fetchSettings 
  };
}