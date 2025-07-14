import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { DocumentPDFGenerator } from '@/services/DocumentPDFGenerator';

export interface GenerationJob {
  id: string;
  template_id: string;
  student_ids: string[];
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress_percentage: number;
  generated_count: number;
  total_count: number;
  error_message?: string;
  created_at: string;
}

export interface GeneratedDocument {
  id: string;
  document_number: string;
  file_path: string;
  download_url?: string;
  generated_at: string;
  expires_at?: string;
  is_valid: boolean;
}

export function useDocumentGeneration() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const generateDocument = async (templateId: string, studentId: string, additionalData?: any) => {
    try {
      setLoading(true);
      setError(null);

      // Génération côté client avec jsPDF
      const { pdfBlob, fileName } = await DocumentPDFGenerator.generatePDF(
        templateId, 
        studentId, 
        additionalData
      );

      // Sauvegarder le document généré en base
      const documentNumber = `DOC${Date.now()}`;
      const documentId = crypto.randomUUID(); // Générer un UUID valide
      
      const { data: documentRecord, error: saveError } = await supabase
        .from('generated_documents')
        .insert({
          id: documentId,
          document_number: documentNumber,
          request_id: documentId, // Utiliser l'UUID comme request_id
          file_path: fileName,
          generated_at: new Date().toISOString(),
          is_valid: true,
          expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() // 1 an
        })
        .select()
        .single();

      if (saveError) throw saveError;

      // Télécharger automatiquement le PDF
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      return {
        document: documentRecord,
        fileName,
        success: true
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la génération';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const previewDocument = async (templateId: string, studentId: string, additionalData?: any) => {
    try {
      setLoading(true);
      setError(null);

      // Génération de la prévisualisation HTML côté client
      const previewHTML = await DocumentPDFGenerator.previewHTML(
        templateId, 
        studentId, 
        additionalData
      );

      return {
        html: previewHTML,
        success: true
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la prévisualisation';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const batchGenerate = async (templateId: string, studentIds: string[], additionalData?: any) => {
    try {
      setLoading(true);
      setError(null);
      setProgress(0);

      const results = [];
      const total = studentIds.length;

      // Générer les documents un par un
      for (let i = 0; i < studentIds.length; i++) {
        const studentId = studentIds[i];
        setProgress(Math.round((i / total) * 100));

        try {
          const result = await generateDocument(templateId, studentId, additionalData);
          results.push({ studentId, success: true, result });
        } catch (error) {
          console.error(`Erreur génération pour étudiant ${studentId}:`, error);
          results.push({ 
            studentId, 
            success: false, 
            error: error instanceof Error ? error.message : 'Erreur inconnue' 
          });
        }
      }

      setProgress(100);
      
      const successCount = results.filter(r => r.success).length;
      const failedCount = results.filter(r => !r.success).length;

      return {
        success: true,
        total_processed: total,
        successful_generations: successCount,
        failed_generations: failedCount,
        results
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la génération en lot';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    progress,
    generateDocument,
    previewDocument,
    batchGenerate
  };
}