import { supabase } from "@/integrations/supabase/client";

export interface UploadResult {
  success: boolean;
  uploadData?: any;
  processedData?: any;
  jobId?: string;
  error?: string;
}

export interface PDFGenerationResult {
  success: boolean;
  downloadUrl?: string;
  previewUrl?: string;
  jobId?: string;
  htmlContent?: string;
  error?: string;
}

export interface ExportResult {
  success: boolean;
  downloadUrl?: string;
  fileName?: string;
  recordsCount?: number;
  jobId?: string;
  preview?: any[];
  error?: string;
}

export class FileService {
  
  // Upload file for import
  static async uploadFile(file: File, type: 'grades' | 'students' | 'subjects'): Promise<UploadResult> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      const { data, error } = await supabase.functions.invoke('upload-file', {
        body: formData,
      });

      if (error) {
        return {
          success: false,
          error: error.message
        };
      }

      return data;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed'
      };
    }
  }

  // Generate PDF
  static async generatePDF(params: {
    type: 'bulletin' | 'transcript' | 'report';
    studentId?: string;
    templateId?: string;
    filters?: any;
    format?: 'pdf';
  }): Promise<PDFGenerationResult> {
    try {
      const { data, error } = await supabase.functions.invoke('generate-pdf', {
        body: params,
      });

      if (error) {
        return {
          success: false,
          error: error.message
        };
      }

      return data;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'PDF generation failed'
      };
    }
  }

  // Export data
  static async exportData(params: {
    type: 'grades' | 'students' | 'analytics';
    format: 'csv' | 'excel';
    filters?: any;
    templateType?: string;
  }): Promise<ExportResult> {
    try {
      const { data, error } = await supabase.functions.invoke('export-data', {
        body: params,
      });

      if (error) {
        return {
          success: false,
          error: error.message
        };
      }

      return data;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Export failed'
      };
    }
  }

  // Download template files
  static async downloadTemplate(type: 'grades' | 'students' | 'ects' | 'dutge-grades'): Promise<string> {
    // Generate CSV template based on type
    let csvContent = '';
    
    switch (type) {
      case 'grades':
        csvContent = [
          'Numéro Étudiant,Matière,Type Évaluation,Note,Note Max,Date',
          'STU001,Mathématiques,Contrôle Continu,15,20,2024-01-15',
          'STU001,Physique,Examen Final,17,20,2024-01-20'
        ].join('\n');
        break;
      case 'dutge-grades':
        csvContent = [
          'Matricule,Code_Matiere,CC1,CC2,TD,Examen_Final,Semestre',
          'DUTGE001,COMPTA401,14,16,15,17,1',
          'DUTGE001,GEST402,13,15,14,16,1',
          'DUTGE002,COMPTA401,16,18,17,19,1',
          'DUTGE002,GEST402,15,17,16,18,1',
          '# Instructions:',
          '# - Matricule: Numéro étudiant DUTGE (ex: DUTGE001, DUTGE002...)',
          '# - Code_Matiere: Code de la matière (COMPTA401, GEST402, ECON403, MATH404...)',
          '# - CC1, CC2: Contrôles continus (notes sur 20)',
          '# - TD: Travaux dirigés (note sur 20)',
          '# - Examen_Final: Note de l\'examen final (sur 20)',
          '# - Semestre: 1 ou 2',
          '# - Laissez vide les cases pour les notes non disponibles'
        ].join('\n');
        break;
      case 'students':
        csvContent = [
          'Nom Complet,Email,Numéro Étudiant,Programme,Niveau',
          'Dupont Jean,jean.dupont@email.com,STU001,Informatique,Licence 1',
          'Martin Sophie,sophie.martin@email.com,STU002,Mathématiques,Licence 2'
        ].join('\n');
        break;
      case 'ects':
        csvContent = [
          'Code Matière,Nom Matière,Crédits ECTS,Coefficient,Heures Théorie,Heures Pratique',
          'MATH101,Mathématiques 1,6,2,30,15',
          'PHYS101,Physique 1,4,1.5,20,20'
        ].join('\n');
        break;
    }
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    return url;
  }

  // Get import jobs
  static async getImportJobs() {
    const { data, error } = await supabase
      .from('import_jobs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data;
  }

  // Get PDF generations
  static async getPDFGenerations() {
    const { data, error } = await supabase
      .from('pdf_generations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data;
  }

  // Get export jobs
  static async getExportJobs() {
    const { data, error } = await supabase
      .from('export_jobs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data;
  }
}
