import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface SystemHealth {
  academicYears: {
    total: number;
    currentCount: number;
    status: 'healthy' | 'warning' | 'error';
  };
  database: {
    connected: boolean;
    status: 'healthy' | 'error';
  };
  lastCheck: Date;
}

export function useSystemMonitoring() {
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [loading, setLoading] = useState(true);

  const checkSystemHealth = async () => {
    try {
      setLoading(true);
      
      // Check database connection
      const { data: testConnection, error: connectionError } = await supabase
        .from('academic_years')
        .select('count', { count: 'exact', head: true });

      if (connectionError) {
        throw new Error('Database connection failed');
      }

      // Check academic years
      const { data: academicYears, error: yearError } = await supabase
        .from('academic_years')
        .select('is_current');

      if (yearError) {
        throw new Error('Failed to check academic years');
      }

      const total = academicYears?.length || 0;
      const currentCount = academicYears?.filter(y => y.is_current).length || 0;
      
      let academicStatus: 'healthy' | 'warning' | 'error' = 'healthy';
      if (currentCount === 0) {
        academicStatus = 'warning';
      } else if (currentCount > 1) {
        academicStatus = 'error';
      }

      const health: SystemHealth = {
        academicYears: {
          total,
          currentCount,
          status: academicStatus
        },
        database: {
          connected: true,
          status: 'healthy'
        },
        lastCheck: new Date()
      };

      setSystemHealth(health);

      // Alert on critical issues
      if (academicStatus === 'error') {
        toast({
          title: "Problème système critique",
          description: `${currentCount} années académiques marquées comme courantes`,
          variant: "destructive",
        });
      }

    } catch (error) {
      console.error('System health check failed:', error);
      
      setSystemHealth({
        academicYears: {
          total: 0,
          currentCount: 0,
          status: 'error'
        },
        database: {
          connected: false,
          status: 'error'
        },
        lastCheck: new Date()
      });

      toast({
        title: "Erreur système",
        description: "Impossible de vérifier l'état du système",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkSystemHealth();
    
    // Check every 5 minutes
    const interval = setInterval(checkSystemHealth, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  return {
    systemHealth,
    loading,
    checkSystemHealth
  };
}