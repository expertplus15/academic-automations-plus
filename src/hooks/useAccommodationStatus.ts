import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface MaintenanceStatus {
  id: string;
  type: 'planned' | 'emergency' | 'routine';
  title: string;
  description: string;
  start_date: string;
  end_date: string | null;
  affected_areas: string[];
  status: 'scheduled' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'critical';
}

interface AccommodationStats {
  totalRooms: number;
  availableRooms: number;
  occupiedRooms: number;
  maintenanceRooms: number;
  maintenanceStatus: 'normal' | 'scheduled' | 'in_progress';
  criticalIssues: number;
}

export function useAccommodationStatus() {
  const [maintenanceItems, setMaintenanceItems] = useState<MaintenanceStatus[]>([]);
  const [stats, setStats] = useState<AccommodationStats>({
    totalRooms: 0,
    availableRooms: 0,
    occupiedRooms: 0,
    maintenanceRooms: 0,
    maintenanceStatus: 'normal',
    criticalIssues: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAccommodationData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get accommodation rooms data
      const { data: rooms, error: roomsError } = await supabase
        .from('accommodation_rooms')
        .select('*');

      if (roomsError) throw roomsError;

      // Mock maintenance data (since we don't have a maintenance table)
      const mockMaintenance: MaintenanceStatus[] = [
        {
          id: '1',
          type: 'planned',
          title: 'Rénovation système de chauffage',
          description: 'Remplacement des radiateurs bâtiment A',
          start_date: new Date().toISOString(),
          end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
          affected_areas: ['Bâtiment A - Étages 1-3'],
          status: 'in_progress',
          priority: 'high'
        },
        {
          id: '2',
          type: 'routine',
          title: 'Inspection électrique',
          description: 'Vérification annuelle des installations',
          start_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days
          end_date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days
          affected_areas: ['Bâtiment B'],
          status: 'scheduled',
          priority: 'medium'
        }
      ];

      // Calculate room statistics
      const totalRooms = rooms?.length || 0;
      const availableRooms = rooms?.filter(room => room.is_available)?.length || 0;
      const occupiedRooms = rooms?.reduce((sum, room) => sum + (room.current_occupancy || 0), 0) || 0;
      
      // Count rooms under maintenance (mock calculation)
      const maintenanceRooms = mockMaintenance.filter(m => m.status === 'in_progress').length * 10; // Assume 10 rooms per maintenance

      // Determine overall status
      const inProgressMaintenance = mockMaintenance.filter(m => m.status === 'in_progress');
      const scheduledMaintenance = mockMaintenance.filter(m => m.status === 'scheduled');
      const criticalIssues = mockMaintenance.filter(m => m.priority === 'critical').length;

      let maintenanceStatus: 'normal' | 'scheduled' | 'in_progress' = 'normal';
      if (inProgressMaintenance.length > 0) {
        maintenanceStatus = 'in_progress';
      } else if (scheduledMaintenance.length > 0) {
        maintenanceStatus = 'scheduled';
      }

      setMaintenanceItems(mockMaintenance);
      setStats({
        totalRooms,
        availableRooms,
        occupiedRooms,
        maintenanceRooms,
        maintenanceStatus,
        criticalIssues
      });

    } catch (err) {
      console.error('Error fetching accommodation data:', err);
      setError('Erreur lors du chargement des données hébergement');
    } finally {
      setLoading(false);
    }
  };

  const updateMaintenanceStatus = async (id: string, status: MaintenanceStatus['status']) => {
    try {
      setMaintenanceItems(prev =>
        prev.map(item =>
          item.id === id ? { ...item, status } : item
        )
      );
      await fetchAccommodationData(); // Refresh stats
    } catch (err) {
      console.error('Error updating maintenance status:', err);
    }
  };

  useEffect(() => {
    fetchAccommodationData();
  }, []);

  return {
    maintenanceItems,
    stats,
    loading,
    error,
    updateMaintenanceStatus,
    refreshData: fetchAccommodationData
  };
}