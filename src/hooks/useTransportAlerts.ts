import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface TransportAlert {
  id: string;
  type: 'delay' | 'maintenance' | 'conflict' | 'breakdown';
  line_id: string;
  line_name: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  created_at: string;
  resolved_at: string | null;
  is_active: boolean;
}

interface TransportStats {
  activeLines: number;
  alertsCount: number;
  maintenanceScheduled: number;
  operationalStatus: 'normal' | 'disrupted' | 'maintenance';
}

export function useTransportAlerts() {
  const [alerts, setAlerts] = useState<TransportAlert[]>([]);
  const [stats, setStats] = useState<TransportStats>({
    activeLines: 0,
    alertsCount: 0,
    maintenanceScheduled: 0,
    operationalStatus: 'normal'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransportData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get active transport lines
      const { data: lines, error: linesError } = await supabase
        .from('transport_lines')
        .select('*')
        .eq('is_active', true);

      if (linesError) throw linesError;

      // Mock transport alerts (since we don't have a transport_alerts table)
      const mockAlerts: TransportAlert[] = [
        {
          id: '1',
          type: 'delay',
          line_id: 'line_1',
          line_name: 'Ligne A - Campus Centre',
          severity: 'high',
          message: 'Retard de 15 minutes dû aux conditions météorologiques',
          created_at: new Date().toISOString(),
          resolved_at: null,
          is_active: true
        },
        {
          id: '2',
          type: 'maintenance',
          line_id: 'line_2',
          line_name: 'Ligne B - Campus Sud',
          severity: 'medium',
          message: 'Maintenance préventive programmée demain 06h-08h',
          created_at: new Date().toISOString(),
          resolved_at: null,
          is_active: true
        }
      ];

      // Count critical alerts (severity high or critical)
      const criticalAlerts = mockAlerts.filter(
        alert => alert.is_active && (alert.severity === 'high' || alert.severity === 'critical')
      );

      setAlerts(mockAlerts);
      setStats({
        activeLines: lines?.length || 0,
        alertsCount: criticalAlerts.length,
        maintenanceScheduled: mockAlerts.filter(a => a.type === 'maintenance' && a.is_active).length,
        operationalStatus: criticalAlerts.length > 0 ? 'disrupted' : 'normal'
      });

    } catch (err) {
      console.error('Error fetching transport data:', err);
      setError('Erreur lors du chargement des alertes transport');
    } finally {
      setLoading(false);
    }
  };

  const resolveAlert = async (alertId: string) => {
    try {
      // In a real implementation, this would update the database
      setAlerts(prev => 
        prev.map(alert => 
          alert.id === alertId 
            ? { ...alert, is_active: false, resolved_at: new Date().toISOString() }
            : alert
        )
      );
      
      // Refresh stats
      await fetchTransportData();
    } catch (err) {
      console.error('Error resolving alert:', err);
    }
  };

  useEffect(() => {
    fetchTransportData();
    
    // Refresh every 30 seconds for real-time updates
    const interval = setInterval(fetchTransportData, 30000);
    return () => clearInterval(interval);
  }, []);

  return {
    alerts,
    stats,
    loading,
    error,
    resolveAlert,
    refreshData: fetchTransportData
  };
}