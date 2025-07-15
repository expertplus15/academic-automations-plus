import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import * as XLSX from 'xlsx';

interface MatrixExportParams {
  programId: string;
  specializationId?: string;
  levelId: string;
  semester: string;
}

export function useMatrixExport({ programId, specializationId, levelId, semester }: MatrixExportParams) {
  const [loading, setLoading] = useState(false);
  const [studentsCount, setStudentsCount] = useState(0);
  const [subjectsCount, setSubjectsCount] = useState(0);
  const { toast } = useToast();

  // Fetch counts when params change
  useEffect(() => {
    if (!programId || !levelId || !semester) {
      setStudentsCount(0);
      setSubjectsCount(0);
      return;
    }

    const fetchCounts = async () => {
      try {
        // Count students (mock data for now)
        setStudentsCount(25);
        setSubjectsCount(6);
      } catch (error) {
        console.error('Error fetching counts:', error);
      }
    };

    fetchCounts();
  }, [programId, specializationId, levelId, semester]);

  const exportToExcel = async () => {
    setLoading(true);
    try {
      // Mock data for demonstration
      const mockData = [
        ['N° Étudiant', 'Nom Complet', 'Mathématiques', 'Physique', 'Chimie', 'Moyenne Générale', 'Mention'],
        ['2024001', 'Martin Dupont', 16, 14, 15, 15, 'Bien'],
        ['2024002', 'Marie Durand', 18, 17, 16, 17, 'Très Bien'],
        ['2024003', 'Paul Bernard', 12, 13, 11, 12, 'Assez Bien'],
        ['', '', '', '', '', '', ''],
        ['Statistiques'],
        ['', 'Moyenne de classe', 15.3, 14.7, 14.0, 14.7, '']
      ];

      // Create workbook
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(mockData);

      // Set column widths
      ws['!cols'] = [
        { width: 15 }, // N° Étudiant
        { width: 25 }, // Nom
        { width: 12 }, // Mathématiques
        { width: 12 }, // Physique
        { width: 12 }, // Chimie
        { width: 15 }, // Moyenne
        { width: 12 }  // Mention
      ];

      // Add the worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, `Relevé S${semester}`);

      // Generate filename
      const date = new Date().toISOString().split('T')[0];
      const filename = `Releve_Notes_S${semester}_${date}.xlsx`;

      // Download the file
      XLSX.writeFile(wb, filename);

      toast({
        title: "Export réussi",
        description: `Le fichier ${filename} a été téléchargé`,
      });

    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Erreur d'export",
        description: "Impossible d'exporter les données",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const exportToPdf = async () => {
    setLoading(true);
    try {
      // TODO: Implement PDF generation
      toast({
        title: "Fonctionnalité en développement",
        description: "La génération PDF sera disponible prochainement",
      });
    } catch (error) {
      console.error('PDF export error:', error);
      toast({
        title: "Erreur d'export PDF",
        description: "Impossible de générer les PDF",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    exportToExcel,
    exportToPdf,
    loading,
    studentsCount,
    subjectsCount
  };
}