import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface BulkExportJob {
  id: string;
  job_type: string;
  status: string;
  parameters: any;
  card_ids: string[];
  result_url: string | null;
  progress_percentage: number;
  error_message: string | null;
  created_by: string | null;
  created_at: string;
  completed_at: string | null;
}

interface ExportOptions {
  format: 'pdf' | 'csv' | 'excel';
  includePhotos: boolean;
  includeQrCodes: boolean;
  layout: 'single' | 'grid' | 'sheet';
  paperSize: 'A4' | 'A5' | 'card';
}

export function useBulkOperations() {
  const [jobs, setJobs] = useState<BulkExportJob[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const createBulkExportJob = async (cardIds: string[], options: ExportOptions) => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('bulk_export_jobs')
        .insert({
          job_type: `${options.format}_export`,
          status: 'pending',
          parameters: options as any,
          card_ids: cardIds,
          created_by: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single();

      if (error) throw error;

      // Simulate job processing (in real implementation, this would be handled by background workers)
      await simulateJobProcessing(data.id, cardIds.length);

      toast({
        title: "Export lancé",
        description: `Export de ${cardIds.length} cartes en cours...`
      });

      await fetchJobs();
      return { success: true, jobId: data.id };
    } catch (error) {
      console.error('Error creating bulk export job:', error);
      toast({
        title: "Erreur",
        description: "Impossible de lancer l'export en lot",
        variant: "destructive"
      });
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('bulk_export_jobs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setJobs(data || []);
    } catch (error) {
      console.error('Error fetching bulk jobs:', error);
    }
  };

  const simulateJobProcessing = async (jobId: string, totalCards: number) => {
    // Simulate progressive job completion
    const updateProgress = async (progress: number, status?: string) => {
      await supabase
        .from('bulk_export_jobs')
        .update({
          progress_percentage: progress,
          status: status || 'processing'
        })
        .eq('id', jobId);
    };

    // Start processing
    await updateProgress(10, 'processing');
    
    // Simulate processing time
    setTimeout(async () => {
      await updateProgress(50);
      
      setTimeout(async () => {
        await updateProgress(80);
        
        setTimeout(async () => {
          // Complete the job
          await supabase
            .from('bulk_export_jobs')
            .update({
              progress_percentage: 100,
              status: 'completed',
              completed_at: new Date().toISOString(),
              result_url: `https://example.com/exports/cards-${jobId}.pdf` // Mock URL
            })
            .eq('id', jobId);
            
          toast({
            title: "Export terminé",
            description: `${totalCards} cartes exportées avec succès`
          });
          
          await fetchJobs();
        }, 2000);
      }, 2000);
    }, 2000);
  };

  const downloadExport = async (job: BulkExportJob) => {
    if (!job.result_url) {
      toast({
        title: "Erreur",
        description: "Fichier d'export non disponible",
        variant: "destructive"
      });
      return;
    }

    try {
      // In a real implementation, this would download from the actual URL
      toast({
        title: "Téléchargement démarré",
        description: "Le fichier va être téléchargé..."
      });

      // Mock download
      const link = document.createElement('a');
      link.href = job.result_url;
      link.download = `export-cartes-${job.id}.${job.job_type.split('_')[0]}`;
      link.click();
    } catch (error) {
      console.error('Error downloading export:', error);
      toast({
        title: "Erreur de téléchargement",
        description: "Impossible de télécharger le fichier",
        variant: "destructive"
      });
    }
  };

  const cancelJob = async (jobId: string) => {
    try {
      const { error } = await supabase
        .from('bulk_export_jobs')
        .update({
          status: 'cancelled',
          completed_at: new Date().toISOString()
        })
        .eq('id', jobId)
        .eq('status', 'processing'); // Only cancel if still processing

      if (error) throw error;

      toast({
        title: "Tâche annulée",
        description: "L'export a été annulé"
      });

      await fetchJobs();
      return { success: true };
    } catch (error) {
      console.error('Error cancelling job:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'annuler la tâche",
        variant: "destructive"
      });
      return { success: false, error };
    }
  };

  const deleteJob = async (jobId: string) => {
    try {
      const { error } = await supabase
        .from('bulk_export_jobs')
        .delete()
        .eq('id', jobId);

      if (error) throw error;

      toast({
        title: "Tâche supprimée",
        description: "L'historique de la tâche a été supprimé"
      });

      await fetchJobs();
      return { success: true };
    } catch (error) {
      console.error('Error deleting job:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la tâche",
        variant: "destructive"
      });
      return { success: false, error };
    }
  };

  const getJobStatusColor = (status: string): string => {
    const colors: Record<string, string> = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'processing': 'bg-blue-100 text-blue-800',
      'completed': 'bg-emerald-100 text-emerald-800',
      'failed': 'bg-red-100 text-red-800',
      'cancelled': 'bg-gray-100 text-gray-800'
    };

    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getJobStatusLabel = (status: string): string => {
    const labels: Record<string, string> = {
      'pending': 'En attente',
      'processing': 'En cours',
      'completed': 'Terminé',
      'failed': 'Échoué',
      'cancelled': 'Annulé'
    };

    return labels[status] || status;
  };

  const generateSampleExport = async (cardIds: string[], format: 'pdf' | 'csv') => {
    try {
      if (format === 'csv') {
        // Generate CSV data
        const { data: cards, error } = await supabase
          .from('student_cards')
          .select(`
            *,
            students!student_cards_student_id_fkey (
              student_number,
              profiles!students_profile_id_fkey (full_name, email),
              programs!students_program_id_fkey (name)
            ),
            student_card_templates!student_cards_template_id_fkey (name)
          `)
          .in('id', cardIds);

        if (error) throw error;

        const headers = [
          'Numéro de carte',
          'Nom étudiant',
          'Email',
          'Numéro étudiant',
          'Programme',
          'Template',
          'Date émission',
          'Date expiration',
          'Statut',
          'Imprimée'
        ];

        const csvData = (cards || []).map(card => [
          card.card_number,
          card.students.profiles.full_name,
          card.students.profiles.email,
          card.students.student_number,
          card.students.programs.name,
          card.student_card_templates.name,
          card.issue_date,
          card.expiry_date || '',
          card.status,
          card.is_printed ? 'Oui' : 'Non'
        ]);

        const csvContent = [headers, ...csvData]
          .map(row => row.map(cell => `"${cell}"`).join(','))
          .join('\n');

        // Download CSV
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `cartes-export-${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        URL.revokeObjectURL(link.href);

        toast({
          title: "Export CSV terminé",
          description: `${cardIds.length} cartes exportées`
        });
      }

      return { success: true };
    } catch (error) {
      console.error('Error generating sample export:', error);
      toast({
        title: "Erreur d'export",
        description: "Impossible de générer l'export",
        variant: "destructive"
      });
      return { success: false, error };
    }
  };

  return {
    jobs,
    loading,
    createBulkExportJob,
    fetchJobs,
    downloadExport,
    cancelJob,
    deleteJob,
    getJobStatusColor,
    getJobStatusLabel,
    generateSampleExport
  };
}