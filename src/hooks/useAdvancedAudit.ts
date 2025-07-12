import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AuditLogEntry {
  id: string;
  operation_type: string;
  entity_type: string;
  entity_id: string;
  user_id?: string;
  session_id?: string;
  operation_details: Record<string, any>;
  before_data?: Record<string, any>;
  after_data?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  metadata?: Record<string, any>;
  created_at: string;
  user?: {
    full_name: string;
    email: string;
  };
}

export interface AuditStatistics {
  total_operations: number;
  operations_today: number;
  operations_this_week: number;
  operations_by_type: Record<string, number>;
  operations_by_user: Record<string, number>;
  most_active_entities: Array<{
    entity_type: string;
    entity_id: string;
    operation_count: number;
  }>;
}

export function useAdvancedAudit() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [statistics, setStatistics] = useState<AuditStatistics | null>(null);

  // Log an operation
  const logOperation = async (
    operation_type: string,
    entity_type: string,
    entity_id: string,
    operation_details: Record<string, any>,
    before_data?: Record<string, any>,
    after_data?: Record<string, any>
  ) => {
    try {
      const { data, error } = await supabase
        .from('results_audit_logs')
        .insert([{
          operation_type,
          entity_type,
          entity_id,
          operation_details,
          before_data,
          after_data,
          metadata: {
            timestamp: new Date().toISOString(),
            user_agent: navigator.userAgent
          }
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Erreur lors de l\'enregistrement de l\'audit:', err);
      // Don't throw to avoid breaking the main operation
      return null;
    }
  };

  // Fetch audit logs
  const fetchAuditLogs = async (filters?: {
    operation_type?: string;
    entity_type?: string;
    entity_id?: string;
    user_id?: string;
    date_from?: string;
    date_to?: string;
    limit?: number;
  }) => {
    try {
      setLoading(true);
      let query = supabase
        .from('results_audit_logs')
        .select(`
          *,
          profiles!results_audit_logs_user_id_fkey(full_name, email)
        `);

      if (filters?.operation_type) {
        query = query.eq('operation_type', filters.operation_type);
      }
      if (filters?.entity_type) {
        query = query.eq('entity_type', filters.entity_type);
      }
      if (filters?.entity_id) {
        query = query.eq('entity_id', filters.entity_id);
      }
      if (filters?.user_id) {
        query = query.eq('user_id', filters.user_id);
      }
      if (filters?.date_from) {
        query = query.gte('created_at', filters.date_from);
      }
      if (filters?.date_to) {
        query = query.lte('created_at', filters.date_to);
      }

      const { data, error } = await query
        .order('created_at', { ascending: false })
        .limit(filters?.limit || 100);

      if (error) throw error;

      const formattedData = (data || []).map(log => ({
        id: log.id,
        operation_type: log.operation_type,
        entity_type: log.entity_type,
        entity_id: log.entity_id,
        user_id: log.user_id,
        session_id: log.session_id,
        operation_details: typeof log.operation_details === 'object' ? log.operation_details as Record<string, any> : {},
        before_data: typeof log.before_data === 'object' ? log.before_data as Record<string, any> : undefined,
        after_data: typeof log.after_data === 'object' ? log.after_data as Record<string, any> : undefined,
        ip_address: log.ip_address as string,
        user_agent: log.user_agent,
        metadata: typeof log.metadata === 'object' ? log.metadata as Record<string, any> : undefined,
        created_at: log.created_at,
        user: log.profiles ? {
          full_name: log.profiles.full_name,
          email: log.profiles.email
        } : undefined
      }));

      setAuditLogs(formattedData);
      return formattedData;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des logs d\'audit');
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Get audit statistics
  const fetchAuditStatistics = async (date_from?: string, date_to?: string) => {
    try {
      setLoading(true);

      let query = supabase
        .from('results_audit_logs')
        .select(`
          operation_type,
          entity_type,
          entity_id,
          user_id,
          created_at,
          profiles!results_audit_logs_user_id_fkey(full_name)
        `);

      if (date_from) {
        query = query.gte('created_at', date_from);
      }
      if (date_to) {
        query = query.lte('created_at', date_to);
      }

      const { data, error } = await query;
      if (error) throw error;

      const logs = data || [];
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

      const stats: AuditStatistics = {
        total_operations: logs.length,
        operations_today: logs.filter(log => new Date(log.created_at) >= today).length,
        operations_this_week: logs.filter(log => new Date(log.created_at) >= weekAgo).length,
        operations_by_type: {},
        operations_by_user: {},
        most_active_entities: []
      };

      // Count operations by type
      logs.forEach(log => {
        stats.operations_by_type[log.operation_type] = 
          (stats.operations_by_type[log.operation_type] || 0) + 1;
      });

      // Count operations by user
      logs.forEach(log => {
        if (log.user_id && log.profiles?.full_name) {
          stats.operations_by_user[log.profiles.full_name] = 
            (stats.operations_by_user[log.profiles.full_name] || 0) + 1;
        }
      });

      // Find most active entities
      const entityCounts: Record<string, number> = {};
      logs.forEach(log => {
        const key = `${log.entity_type}:${log.entity_id}`;
        entityCounts[key] = (entityCounts[key] || 0) + 1;
      });

      stats.most_active_entities = Object.entries(entityCounts)
        .map(([key, count]) => {
          const [entity_type, entity_id] = key.split(':');
          return { entity_type, entity_id, operation_count: count };
        })
        .sort((a, b) => b.operation_count - a.operation_count)
        .slice(0, 10);

      setStatistics(stats);
      return stats;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du calcul des statistiques d\'audit');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Get entity history
  const getEntityHistory = async (entity_type: string, entity_id: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('results_audit_logs')
        .select(`
          *,
          profiles!results_audit_logs_user_id_fkey(full_name, email)
        `)
        .eq('entity_type', entity_type)
        .eq('entity_id', entity_id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedData = (data || []).map(log => ({
        ...log,
        user: log.profiles ? {
          full_name: log.profiles.full_name,
          email: log.profiles.email
        } : undefined
      }));

      return formattedData;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Erreur lors du chargement de l\'historique');
    } finally {
      setLoading(false);
    }
  };

  // Get user activity
  const getUserActivity = async (user_id: string, date_from?: string, date_to?: string) => {
    try {
      setLoading(true);
      let query = supabase
        .from('results_audit_logs')
        .select('*')
        .eq('user_id', user_id);

      if (date_from) {
        query = query.gte('created_at', date_from);
      }
      if (date_to) {
        query = query.lte('created_at', date_to);
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;

      return data || [];
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Erreur lors du chargement de l\'activité utilisateur');
    } finally {
      setLoading(false);
    }
  };

  // Export audit logs
  const exportAuditLogs = async (filters?: {
    operation_type?: string;
    entity_type?: string;
    date_from?: string;
    date_to?: string;
  }) => {
    try {
      const logs = await fetchAuditLogs(filters);
      
      // Convert to CSV format
      const headers = [
        'Date/Heure',
        'Type d\'opération',
        'Type d\'entité',
        'ID Entité',
        'Utilisateur',
        'Détails',
        'Adresse IP'
      ];

      const csvContent = [
        headers.join(','),
        ...logs.map(log => [
          new Date(log.created_at).toLocaleString(),
          log.operation_type,
          log.entity_type,
          log.entity_id,
          log.user?.full_name || 'Système',
          JSON.stringify(log.operation_details).replace(/"/g, '""'),
          log.ip_address || ''
        ].map(field => `"${field}"`).join(','))
      ].join('\n');

      // Create download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `audit_logs_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();

      return true;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Erreur lors de l\'export des logs');
    }
  };

  // Utility functions for common operations
  const logGradeOperation = async (
    operation: 'create' | 'update' | 'delete',
    grade_id: string,
    student_id: string,
    subject_id: string,
    before_data?: any,
    after_data?: any
  ) => {
    return await logOperation(
      `grade_${operation}`,
      'grade',
      grade_id,
      {
        student_id,
        subject_id,
        operation,
        timestamp: new Date().toISOString()
      },
      before_data,
      after_data
    );
  };

  const logBulletinGeneration = async (
    student_ids: string[],
    template_id: string,
    generation_time: number
  ) => {
    return await logOperation(
      'bulletin_generation',
      'bulletin_batch',
      `batch_${Date.now()}`,
      {
        student_count: student_ids.length,
        template_id,
        generation_time_ms: generation_time,
        timestamp: new Date().toISOString()
      }
    );
  };

  return {
    loading,
    error,
    auditLogs,
    statistics,
    logOperation,
    fetchAuditLogs,
    fetchAuditStatistics,
    getEntityHistory,
    getUserActivity,
    exportAuditLogs,
    logGradeOperation,
    logBulletinGeneration
  };
}