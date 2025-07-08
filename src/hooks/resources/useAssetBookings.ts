import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface AssetBooking {
  id: string;
  asset_id?: string;
  room_id?: string;
  user_id: string;
  start_date: string;
  end_date: string;
  purpose: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled';
  approved_by?: string;
  approved_at?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  asset?: {
    id: string;
    name: string;
    asset_number: string;
  };
  room?: {
    id: string;
    name: string;
  };
  user?: {
    id: string;
    full_name: string;
  };
  approver?: {
    id: string;
    full_name: string;
  };
}

export function useAssetBookings() {
  const [bookings, setBookings] = useState<AssetBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('asset_bookings')
        .select(`
          *,
          asset:assets(id, name, asset_number),
          room:rooms(id, name)
        `)
        .order('start_date', { ascending: true });

      if (error) throw error;
      setBookings((data as AssetBooking[]) || []);
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

  const createBooking = async (bookingData: Omit<AssetBooking, 'id' | 'created_at' | 'updated_at' | 'asset' | 'room' | 'user' | 'approver'>) => {
    try {
      // Check for conflicts before creating
      const conflicts = await checkBookingConflicts(bookingData);
      if (conflicts.length > 0) {
        throw new Error(`Conflit détecté: ${conflicts[0].message}`);
      }

      const { data, error } = await supabase
        .from('asset_bookings')
        .insert(bookingData as any)
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

  const updateBooking = async (id: string, updates: Partial<AssetBooking>) => {
    try {
      const { data, error } = await supabase
        .from('asset_bookings')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      await fetchBookings();
      toast({
        title: "Succès",
        description: "Réservation mise à jour avec succès",
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

  const approveBooking = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('asset_bookings')
        .update({
          status: 'approved',
          approved_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      await fetchBookings();
      toast({
        title: "Succès",
        description: "Réservation approuvée",
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

  const rejectBooking = async (id: string, reason?: string) => {
    try {
      const { data, error } = await supabase
        .from('asset_bookings')
        .update({
          status: 'rejected',
          notes: reason
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      await fetchBookings();
      toast({
        title: "Succès",
        description: "Réservation rejetée",
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

  const checkBookingConflicts = async (bookingData: Pick<AssetBooking, 'start_date' | 'end_date' | 'asset_id' | 'room_id'>) => {
    const conflicts: { message: string; booking: AssetBooking }[] = [];
    
    try {
      let query = supabase
        .from('asset_bookings')
        .select('*')
        .eq('status', 'approved')
        .or(`start_date.lte.${bookingData.end_date},end_date.gte.${bookingData.start_date}`);

      if (bookingData.asset_id) {
        query = query.eq('asset_id', bookingData.asset_id);
      }
      if (bookingData.room_id) {
        query = query.eq('room_id', bookingData.room_id);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        data.forEach(conflictBooking => {
          conflicts.push({
            message: `Réservation existante du ${new Date(conflictBooking.start_date).toLocaleDateString()} au ${new Date(conflictBooking.end_date).toLocaleDateString()}`,
            booking: conflictBooking as AssetBooking
          });
        });
      }
      
    } catch (err) {
      console.error('Error checking conflicts:', err);
    }
    
    return conflicts;
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
    updateBooking,
    approveBooking,
    rejectBooking,
    checkBookingConflicts
  };
}