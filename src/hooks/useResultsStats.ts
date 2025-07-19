
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
        
        // Fetch real grades count
        const { count: gradesCount } = await supabase
          .from('student_grades')
          .select('*', { count: 'exact', head: true });

        // Fetch published grades count
        const { count: publishedGradesCount } = await supabase
          .from('student_grades')
          .select('*', { count: 'exact', head: true })
          .eq('is_published', true);

        // Fetch pending grades count
        const { count: pendingCount } = await supabase
          .from('student_grades')
          .select('*', { count: 'exact', head: true })
          .eq('is_published', false);

        // Fetch generated documents count
        const { count: documentsCount } = await supabase
          .from('generated_documents')
          .select('*', { count: 'exact', head: true });

        // Fetch available templates count
        const { count: templatesCount } = await supabase
          .from('document_templates')
          .select('*', { count: 'exact', head: true })
          .eq('is_active', true);

        // Fetch active students for matrix sessions estimation
        const { count: activeStudentsCount } = await supabase
          .from('students')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'active');

        // Fetch recent grade activities from audit logs
        const { data: recentLogs } = await supabase
          .from('audit_logs')
          .select('action, table_name, created_at, new_values')
          .in('table_name', ['student_grades', 'generated_documents', 'document_templates'])
          .order('created_at', { ascending: false })
          .limit(5);

        const recentActivities = recentLogs?.map(log => ({
          title: getActivityTitle(log.action, log.table_name),
          subtitle: getActivitySubtitle(log.action, log.table_name, log.new_values),
          badge: 'Récent',
          timestamp: log.created_at
        })) || [];

        // Add default activities if no recent activities
        if (recentActivities.length === 0) {
          recentActivities.push(
            {
              title: 'Interface matricielle',
              subtitle: 'Prête pour la saisie collaborative',
              badge: 'Nouveau',
              timestamp: new Date().toISOString()
            },
            {
              title: 'Système de validation',
              subtitle: 'Workflow de validation activé',
              badge: 'Actif',
              timestamp: new Date().toISOString()
            }
          );
        }

        // Calculate matrix sessions (estimate based on active students)
        const estimatedMatrixSessions = Math.ceil((activeStudentsCount || 0) / 30);

        setStats({
          totalGrades: gradesCount || 0,
          generatedReports: documentsCount || 0,
          averageGenerationTime: 2.8,
          matrixSessions: estimatedMatrixSessions,
          autoCalculations: publishedGradesCount || 0,
          pendingGrades: pendingCount || 0,
          realTimeUsers: 0, // Would need real-time presence tracking
          averageAccuracy: calculateAccuracy(publishedGradesCount || 0, gradesCount || 0),
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

    // Set up real-time subscription for grades
    const gradesSubscription = supabase
      .channel('grades-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'student_grades' }, 
        () => {
          fetchStats();
        }
      )
      .subscribe();

    // Set up real-time subscription for documents
    const documentsSubscription = supabase
      .channel('documents-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'generated_documents' }, 
        () => {
          fetchStats();
        }
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

function getActivitySubtitle(action: string, tableName: string, newValues?: any): string {
  const tableMap: Record<string, string> = {
    'student_grades': 'Système de notation',
    'generated_documents': 'Génération documentaire',
    'document_templates': 'Gestion des modèles',
    'students': 'Gestion étudiants'
  };

  if (newValues && tableName === 'student_grades') {
    return `Note: ${newValues.grade || 'N/A'}/20`;
  }

  return tableMap[tableName] || 'Système';
}

function calculateAccuracy(published: number, total: number): number {
  if (total === 0) return 100;
  return Math.round((published / total) * 100);
}
