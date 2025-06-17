
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AcademicEvent {
  id: string;
  name: string;
  description?: string;
  event_type: string;
  start_date: string;
  end_date: string;
  is_holiday: boolean;
  affects_programs: string[];
  academic_year_id?: string;
  created_at: string;
  updated_at: string;
}

// Helper function to transform database row to AcademicEvent
const transformDatabaseEvent = (dbEvent: any): AcademicEvent => {
  return {
    id: dbEvent.id,
    name: dbEvent.name,
    description: dbEvent.description || '',
    event_type: dbEvent.event_type,
    start_date: dbEvent.start_date,
    end_date: dbEvent.end_date,
    is_holiday: dbEvent.is_holiday || false,
    affects_programs: Array.isArray(dbEvent.affects_programs) 
      ? dbEvent.affects_programs.map((item: any) => String(item)) 
      : [],
    academic_year_id: dbEvent.academic_year_id || '',
    created_at: dbEvent.created_at || '',
    updated_at: dbEvent.updated_at || ''
  };
};

export function useAcademicEvents(academicYearId?: string) {
  const [events, setEvents] = useState<AcademicEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('academic_calendar')
        .select('*')
        .order('start_date');

      if (academicYearId) {
        query = query.eq('academic_year_id', academicYearId);
      }

      const { data, error } = await query;

      if (error) {
        setError(error.message);
        setEvents([]);
      } else {
        // Transform the data to match our interface
        const transformedEvents = (data || []).map(transformDatabaseEvent);
        setEvents(transformedEvents);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const createEvent = async (eventData: Omit<AcademicEvent, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('academic_calendar')
        .insert([eventData])
        .select()
        .single();

      if (error) throw error;

      // Transform the response data
      const transformedEvent = transformDatabaseEvent(data);

      setEvents(prev => [...prev, transformedEvent]);
      return { success: true, data: transformedEvent };
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Erreur lors de la création' 
      };
    }
  };

  const updateEvent = async (id: string, eventData: Partial<AcademicEvent>) => {
    try {
      const { data, error } = await supabase
        .from('academic_calendar')
        .update(eventData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Transform the response data
      const transformedEvent = transformDatabaseEvent(data);

      setEvents(prev => prev.map(event => event.id === id ? transformedEvent : event));
      return { success: true, data: transformedEvent };
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Erreur lors de la mise à jour' 
      };
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      const { error } = await supabase
        .from('academic_calendar')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setEvents(prev => prev.filter(event => event.id !== id));
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Erreur lors de la suppression' 
      };
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [academicYearId]);

  return { 
    events, 
    loading, 
    error, 
    createEvent, 
    updateEvent, 
    deleteEvent, 
    refetch: fetchEvents 
  };
}
