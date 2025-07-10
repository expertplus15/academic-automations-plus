import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Event {
  id: string;
  title: string;
  description?: string;
  start_date: string;
  end_date: string;
  location?: string;
  type: string;
  organizer_id: string;
  capacity_max?: number;
  registration_required?: boolean;
  registration_deadline?: string;
  is_free?: boolean;
  price?: number;
  status?: string;
  metadata?: any;
  created_at?: string;
  updated_at?: string;
}

export interface CreateEventData {
  title: string;
  description?: string;
  start_date: string;
  end_date: string;
  location?: string;
  type: string;
  capacity_max?: number;
  registration_required?: boolean;
  registration_deadline?: string;
  is_free?: boolean;
  price?: number;
  metadata?: any;
}

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch events
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('start_date', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Erreur",
        description: "Impossible de charger les événements",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Create event
  const createEvent = async (eventData: CreateEventData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non authentifié");

      const { data, error } = await supabase
        .from('events')
        .insert([{
          ...eventData,
          organizer_id: user.id,
          status: 'draft'
        }])
        .select()
        .single();

      if (error) throw error;

      setEvents(prev => [...prev, data]);
      toast({
        title: "Événement créé",
        description: `L'événement "${eventData.title}" a été créé avec succès.`,
      });
      return data;
    } catch (err: any) {
      toast({
        title: "Erreur",
        description: "Impossible de créer l'événement",
        variant: "destructive",
      });
      throw err;
    }
  };

  // Update event
  const updateEvent = async (id: string, eventData: Partial<CreateEventData>) => {
    try {
      const { data, error } = await supabase
        .from('events')
        .update(eventData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setEvents(prev => prev.map(event => 
        event.id === id ? { ...event, ...data } : event
      ));
      
      toast({
        title: "Événement modifié",
        description: "L'événement a été modifié avec succès.",
      });
      return data;
    } catch (err: any) {
      toast({
        title: "Erreur", 
        description: "Impossible de modifier l'événement",
        variant: "destructive",
      });
      throw err;
    }
  };

  // Delete event
  const deleteEvent = async (id: string) => {
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setEvents(prev => prev.filter(event => event.id !== id));
      toast({
        title: "Événement supprimé",
        description: "L'événement a été supprimé avec succès.",
      });
    } catch (err: any) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'événement",
        variant: "destructive",
      });
      throw err;
    }
  };

  // Get event by ID
  const getEventById = (id: string) => {
    return events.find(event => event.id === id);
  };

  // Filter events by date range
  const getEventsByDateRange = (startDate: Date, endDate: Date) => {
    return events.filter(event => {
      const eventStart = new Date(event.start_date);
      return eventStart >= startDate && eventStart <= endDate;
    });
  };

  // Get events for current month
  const getEventsForMonth = (date: Date) => {
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return getEventsByDateRange(startOfMonth, endOfMonth);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return {
    events,
    loading,
    error,
    fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    getEventById,
    getEventsByDateRange,
    getEventsForMonth,
  };
}