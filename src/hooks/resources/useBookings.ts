import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Booking {
  id: string;
  asset_id?: string;
  room_id?: string;
  user_id: string;
  start_date: string;
  end_date: string;
  purpose: string;
  status: string;
  approved_by?: string;
  approved_at?: string;
  notes?: string;
  created_at: string;
  asset?: {
    name: string;
    asset_number: string;
  };
  room?: {
    name: string;
  };
  user?: {
    full_name: string;
    email: string;
  };
  approver?: {
    full_name: string;
  };
}

export function useBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('asset_bookings')
        .select(`
          *,
          asset:assets(name, asset_number),
          room:rooms(name),
          user:profiles!user_id(full_name, email),
          approver:profiles!approved_by(full_name)
        `)
        .order('start_date', { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Erreur",
        description: "Impossible de charger les réservations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createBooking = async (bookingData: any) => {
    try {
      const { data, error } = await supabase
        .from('asset_bookings')
        .insert(bookingData)
        .select()
        .single();

      if (error) throw error;
      
      await fetchBookings();
      toast({
        title: "Succès",
        description: "Réservation créée avec succès",
      });
      
      return data;
    } catch (err: any) {
      toast({
        title: "Erreur",
        description: err.message,
        variant: "destructive",
      });
      throw err;
    }
  };

  const approveBooking = async (id: string, approved: boolean, notes?: string) => {
    try {
      const { data, error } = await supabase
        .from('asset_bookings')
        .update({
          status: approved ? 'approved' : 'rejected',
          approved_at: new Date().toISOString(),
          notes: notes
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      await fetchBookings();
      toast({
        title: "Succès",
        description: `Réservation ${approved ? 'approuvée' : 'rejetée'}`,
      });
      
      return data;
    } catch (err: any) {
      toast({
        title: "Erreur",
        description: err.message,
        variant: "destructive",
      });
      throw err;
    }
  };

  const cancelBooking = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('asset_bookings')
        .update({ status: 'cancelled' })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      await fetchBookings();
      toast({
        title: "Succès",
        description: "Réservation annulée",
      });
      
      return data;
    } catch (err: any) {
      toast({
        title: "Erreur",
        description: err.message,
        variant: "destructive",
      });
      throw err;
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return {
    bookings,
    loading,
    error,
    fetchBookings,
    createBooking,
    approveBooking,
    cancelBooking
  };
}