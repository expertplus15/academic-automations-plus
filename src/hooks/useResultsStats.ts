import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ResultsStats {
  totalGrades: number;
  generatedReports: number;
  averageGenerationTime: number;
  matrixSessions: number;
  autoCalculations: number;
  pendingGrades: number;
  realTimeUsers: number;
  averageAccuracy: number;
  documentsGenerated: number;
  templatesAvailable: number;
  recentActivities: Array<{
    title: string;
    subtitle: string;
    badge: string;
    timestamp?: string;
  }>;
}

export function useResultsStats() {
  const [stats, setStats] = useState<ResultsStats>({
    totalGrades: 0,
    generatedReports: 0,
    averageGenerationTime: 0,
    matrixSessions: 0,
    autoCalculations: 0,
    pendingGrades: 0,
    realTimeUsers: 0,
    averageAccuracy: 0,
    documentsGenerated: 0,
    templatesAvailable: 0,
    recentActivities: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // Fetch all data in parallel for better performance
        const [
          { count: gradesCount },
          { count: documentsCount },
          { count: pendingCount },
          { count: templatesCount },
          { data: recentLogs }
        ] = await Promise.all([
          supabase
            .from('student_grades')
            .select('*', { count: 'exact', head: true })
            .eq('is_published', true),
          supabase
            .from('generated_documents')
            .select('*', { count: 'exact', head: true }),
          supabase
            .from('student_grades')
            .select('*', { count: 'exact', head: true })
            .eq('is_published', false),
          supabase
            .from('document_templates')
            .select('*', { count: 'exact', head: true })
            .eq('is_active', true),
          supabase
            .from('audit_logs')
            .select('action, table_name, created_at')
            .order('created_at', { ascending: false })
            .limit(5)
        ]);

        const recentActivities = recentLogs?.map(log => ({
          title: getActivityTitle(log.action, log.table_name),
          subtitle: getActivitySubtitle(log.action, log.table_name),
          badge: 'Récent',
          timestamp: log.created_at
        })) || [];

        // Add default activity if no recent activities
        if (recentActivities.length === 0) {
          recentActivities.push({
            title: 'Système initialisé',
            subtitle: 'Prêt pour la saisie de notes',
            badge: 'Nouveau',
            timestamp: new Date().toISOString()
          });
        }

        setStats({
          totalGrades: gradesCount || 0,
          generatedReports: documentsCount || 0,
          averageGenerationTime: 3.2, // Mock data - could be calculated from logs
          matrixSessions: 0, // Could be tracked via real-time sessions
          autoCalculations: 95, // Mock percentage
          pendingGrades: pendingCount || 0,
          realTimeUsers: 0, // Could be tracked via presence
          averageAccuracy: 98.5, // Mock percentage
          documentsGenerated: documentsCount || 0,
          templatesAvailable: templatesCount || 0,
          recentActivities
        });

      } catch (err) {
        console.error('Error fetching results stats:', err);
        setError('Erreur lors du chargement des statistiques');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();

    // Debounced refresh to avoid too many calls
    let refreshTimeout: NodeJS.Timeout;
    const debouncedRefresh = () => {
      clearTimeout(refreshTimeout);
      refreshTimeout = setTimeout(fetchStats, 1000);
    };

    // Set up real-time subscription for grades
    const gradesSubscription = supabase
      .channel('grades-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'student_grades' }, 
        debouncedRefresh
      )
      .subscribe();

    // Set up real-time subscription for documents
    const documentsSubscription = supabase
      .channel('documents-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'generated_documents' }, 
        debouncedRefresh
      )
      .subscribe();

    return () => {
      gradesSubscription.unsubscribe();
      documentsSubscription.unsubscribe();
    };
  }, []);

  return { stats, loading, error };
}

function getActivityTitle(action: string, tableName: string): string {
  const actionMap: Record<string, string> = {
    'INSERT': 'Création',
    'UPDATE': 'Modification',
    'DELETE': 'Suppression'
  };

  const tableMap: Record<string, string> = {
    'student_grades': 'note',
    'generated_documents': 'document',
    'document_templates': 'modèle',
    'students': 'étudiant'
  };

  return `${actionMap[action] || action} ${tableMap[tableName] || tableName}`;
}

function getActivitySubtitle(action: string, tableName: string): string {
  const tableMap: Record<string, string> = {
    'student_grades': 'Système de notation',
    'generated_documents': 'Génération documentaire',
    'document_templates': 'Gestion des modèles',
    'students': 'Gestion étudiants'
  };

  return tableMap[tableName] || 'Système';
}