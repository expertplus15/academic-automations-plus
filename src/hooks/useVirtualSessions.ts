import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

type VirtualSession = {
  id: string;
  course_id: string;
  instructor_id: string;
  title: string;
  description?: string | null;
  platform: string;
  meeting_id?: string | null;
  meeting_url?: string | null;
  password?: string | null;
  scheduled_start_time: string;
  scheduled_end_time: string;
  actual_start_time?: string | null;
  actual_end_time?: string | null;
  max_participants: number;
  is_recurring: boolean;
  recurrence_pattern: any;
  recording_enabled: boolean;
  auto_record: boolean;
  status: string;
  metadata: any;
  created_at: string;
  updated_at: string;
}

export function useVirtualSessions(courseId?: string) {
  const [sessions, setSessions] = useState<VirtualSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchSessions();
  }, [courseId]);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('virtual_sessions')
        .select('*')
        .order('scheduled_start_time', { ascending: false });

      if (courseId) {
        query = query.eq('course_id', courseId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setSessions(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des sessions');
      toast({
        title: "Erreur",
        description: "Impossible de charger les sessions virtuelles",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createSession = async (sessionData: any) => {
    try {
      const { data, error } = await supabase
        .from('virtual_sessions')
        .insert([sessionData])
        .select()
        .single();

      if (error) throw error;

      setSessions(prev => [data, ...prev]);
      toast({
        title: "Succès",
        description: "Session virtuelle créée avec succès",
      });
      
      return data;
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Impossible de créer la session",
        variant: "destructive",
      });
      throw err;
    }
  };

  const updateSession = async (id: string, updates: Partial<VirtualSession>) => {
    try {
      const { data, error } = await supabase
        .from('virtual_sessions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setSessions(prev => prev.map(session => 
        session.id === id ? { ...session, ...data } : session
      ));
      
      toast({
        title: "Succès",
        description: "Session mise à jour avec succès",
      });
      
      return data;
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la session",
        variant: "destructive",
      });
      throw err;
    }
  };

  const deleteSession = async (id: string) => {
    try {
      const { error } = await supabase
        .from('virtual_sessions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setSessions(prev => prev.filter(session => session.id !== id));
      toast({
        title: "Succès",
        description: "Session supprimée avec succès",
      });
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la session",
        variant: "destructive",
      });
      throw err;
    }
  };

  const startSession = async (id: string) => {
    return updateSession(id, {
      status: 'in_progress',
      actual_start_time: new Date().toISOString()
    });
  };

  const endSession = async (id: string) => {
    return updateSession(id, {
      status: 'completed',
      actual_end_time: new Date().toISOString()
    });
  };

  return {
    sessions,
    loading,
    error,
    fetchSessions,
    createSession,
    updateSession,
    deleteSession,
    startSession,
    endSession,
  };
}