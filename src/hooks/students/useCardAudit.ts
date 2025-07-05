import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuditRecord {
  id: string;
  card_id: string;
  action_type: string;
  performed_by: string | null;
  old_values: any;
  new_values: any;
  action_details: string | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
  // Joined data
  card_number?: string;
  student_name?: string;
  performer_name?: string;
}

interface AuditFilters {
  cardId?: string;
  actionType?: string;
  dateFrom?: string;
  dateTo?: string;
  performedBy?: string;
}

export function useCardAudit() {
  const [auditRecords, setAuditRecords] = useState<AuditRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<AuditFilters>({});
  const { toast } = useToast();

  const fetchAuditRecords = async (customFilters?: AuditFilters) => {
    try {
      setLoading(true);
      const activeFilters = customFilters || filters;

      let query = supabase
        .from('student_card_audit')
        .select(`
          *,
          student_cards!inner(
            card_number,
            students!inner(
              profiles!inner(full_name)
            )
          )
        `)
        .order('created_at', { ascending: false })
        .limit(100);

      // Apply filters
      if (activeFilters.cardId) {
        query = query.eq('card_id', activeFilters.cardId);
      }

      if (activeFilters.actionType) {
        query = query.eq('action_type', activeFilters.actionType);
      }

      if (activeFilters.dateFrom) {
        query = query.gte('created_at', activeFilters.dateFrom);
      }

      if (activeFilters.dateTo) {
        query = query.lte('created_at', activeFilters.dateTo);
      }

      if (activeFilters.performedBy) {
        query = query.eq('performed_by', activeFilters.performedBy);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Transform data for easier use
      const transformedData = (data || []).map(record => ({
        ...record,
        card_number: record.student_cards?.card_number,
        student_name: record.student_cards?.students?.profiles?.full_name,
        performer_name: 'Système' // Will be enhanced later with proper user lookup
      }));

      setAuditRecords(transformedData);
    } catch (error) {
      console.error('Error fetching audit records:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger l'historique des actions",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createAuditRecord = async (
    cardId: string,
    actionType: string,
    actionDetails?: string,
    oldValues?: any,
    newValues?: any
  ) => {
    try {
      const { error } = await supabase
        .from('student_card_audit')
        .insert({
          card_id: cardId,
          action_type: actionType,
          performed_by: (await supabase.auth.getUser()).data.user?.id,
          action_details: actionDetails,
          old_values: oldValues,
          new_values: newValues,
          ip_address: null, // Could be populated from client if needed
          user_agent: navigator.userAgent
        });

      if (error) throw error;

      // Refresh audit records
      await fetchAuditRecords();
      
      return { success: true };
    } catch (error) {
      console.error('Error creating audit record:', error);
      return { success: false, error };
    }
  };

  const getActionTypeLabel = (actionType: string): string => {
    const labels: Record<string, string> = {
      'created': 'Création',
      'printed': 'Impression',
      'status_changed': 'Changement de statut',
      'updated': 'Modification',
      'suspended': 'Suspension',
      'reactivated': 'Réactivation',
      'expired': 'Expiration'
    };

    return labels[actionType] || actionType;
  };

  const getActionTypeColor = (actionType: string): string => {
    const colors: Record<string, string> = {
      'created': 'bg-emerald-100 text-emerald-800',
      'printed': 'bg-blue-100 text-blue-800',
      'status_changed': 'bg-yellow-100 text-yellow-800',
      'updated': 'bg-gray-100 text-gray-800',
      'suspended': 'bg-red-100 text-red-800',
      'reactivated': 'bg-emerald-100 text-emerald-800',
      'expired': 'bg-red-100 text-red-800'
    };

    return colors[actionType] || 'bg-gray-100 text-gray-800';
  };

  const getAuditStats = () => {
    const stats = {
      total: auditRecords.length,
      byActionType: auditRecords.reduce((acc, record) => {
        acc[record.action_type] = (acc[record.action_type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      recentActivity: auditRecords.filter(record => {
        const recordDate = new Date(record.created_at);
        const dayAgo = new Date();
        dayAgo.setDate(dayAgo.getDate() - 1);
        return recordDate > dayAgo;
      }).length
    };

    return stats;
  };

  const exportAuditData = async (format: 'csv' | 'json' = 'csv') => {
    try {
      let exportData: string;
      let filename: string;
      let mimeType: string;

      if (format === 'csv') {
        const headers = [
          'Date',
          'Action',
          'Carte',
          'Étudiant',
          'Effectué par',
          'Détails'
        ];

        const csvData = auditRecords.map(record => [
          new Date(record.created_at).toLocaleString('fr-FR'),
          getActionTypeLabel(record.action_type),
          record.card_number || '',
          record.student_name || '',
          record.performer_name || '',
          record.action_details || ''
        ]);

        exportData = [headers, ...csvData]
          .map(row => row.map(cell => `"${cell}"`).join(','))
          .join('\n');

        filename = `audit-cartes-${new Date().toISOString().split('T')[0]}.csv`;
        mimeType = 'text/csv;charset=utf-8;';
      } else {
        exportData = JSON.stringify(auditRecords, null, 2);
        filename = `audit-cartes-${new Date().toISOString().split('T')[0]}.json`;
        mimeType = 'application/json;charset=utf-8;';
      }

      // Create and download file
      const blob = new Blob([exportData], { type: mimeType });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.click();
      URL.revokeObjectURL(link.href);

      toast({
        title: "Export réussi",
        description: `Données d'audit exportées vers ${filename}`
      });

      return { success: true };
    } catch (error) {
      console.error('Error exporting audit data:', error);
      toast({
        title: "Erreur d'export",
        description: "Impossible d'exporter les données d'audit",
        variant: "destructive"
      });
      return { success: false, error };
    }
  };

  const applyFilters = (newFilters: AuditFilters) => {
    setFilters(newFilters);
    fetchAuditRecords(newFilters);
  };

  const clearFilters = () => {
    setFilters({});
    fetchAuditRecords({});
  };

  useEffect(() => {
    fetchAuditRecords();

    // Set up real-time subscription for new audit records
    const channel = supabase
      .channel('audit-updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'student_card_audit'
        },
        () => {
          fetchAuditRecords();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    auditRecords,
    loading,
    filters,
    getActionTypeLabel,
    getActionTypeColor,
    getAuditStats,
    fetchAuditRecords,
    createAuditRecord,
    exportAuditData,
    applyFilters,
    clearFilters
  };
}