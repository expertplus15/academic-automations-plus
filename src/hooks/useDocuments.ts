import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface DocumentTemplate {
  id: string;
  name: string;
  type: 'bulletin' | 'transcript' | 'certificate' | 'attestation';
  description?: string;
  content: any;
  preview_url?: string;
  is_active: boolean;
  is_default: boolean;
  version: number;
  created_at: string;
  updated_at: string;
}

export interface GeneratedDocument {
  id: string;
  template_id: string;
  student_id?: string;
  document_number: string;
  file_path?: string;
  download_url?: string;
  generation_data: any;
  is_valid: boolean;
  generated_at: string;
  expires_at?: string;
  signed_by?: string;
  template?: DocumentTemplate;
}

export function useDocuments() {
  const [templates, setTemplates] = useState<DocumentTemplate[]>([]);
  const [documents, setDocuments] = useState<GeneratedDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch templates from Supabase
  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('document_templates')
        .select('*')
        .eq('is_active', true);

      if (error) throw error;

      const formattedTemplates: DocumentTemplate[] = data?.map(template => ({
        id: template.id,
        name: template.name,
        type: template.template_type as 'bulletin' | 'transcript' | 'certificate' | 'attestation',
        description: template.description,
        content: template.template_content,
        is_active: template.is_active,
        is_default: false, // Default value since column might not exist yet
        version: 1,
        created_at: template.created_at,
        updated_at: template.updated_at
      })) || [];

      setTemplates(formattedTemplates);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des templates');
      toast({
        title: "Erreur",
        description: "Impossible de charger les templates",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch generated documents
  const fetchDocuments = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('generated_documents')
        .select(`
          *,
          document_requests!inner(
            template_id,
            student_id,
            request_data
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedDocuments: GeneratedDocument[] = data?.map(doc => ({
        id: doc.id,
        template_id: doc.document_requests.template_id,
        student_id: doc.document_requests.student_id,
        document_number: doc.document_number,
        file_path: doc.file_path,
        download_url: undefined, // Will be populated when needed
        generation_data: doc.document_requests.request_data,
        is_valid: true,
        generated_at: doc.generated_at,
        expires_at: doc.expires_at,
        signed_by: doc.generated_by
      })) || [];

      setDocuments(formattedDocuments);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des documents');
    } finally {
      setLoading(false);
    }
  };

  // Generate document
  const generateDocument = async (templateId: string, studentId?: string, additionalData?: any) => {
    try {
      setLoading(true);
      
      // Import DocumentPDFGenerator dynamically
      const { DocumentPDFGenerator } = await import('@/services/DocumentPDFGenerator');
      
      if (!studentId) {
        throw new Error('Student ID is required for document generation');
      }

      const { pdfBlob, fileName } = await DocumentPDFGenerator.generatePDF(
        templateId, 
        studentId, 
        additionalData
      );

      // Save document record to database
      const documentNumber = `DOC${Date.now()}`;
      const { data: documentRecord, error: saveError } = await supabase
        .from('generated_documents')
        .insert({
          document_number: documentNumber,
          request_id: documentNumber,
          file_path: fileName,
          generated_at: new Date().toISOString(),
          is_valid: true,
          expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
        })
        .select()
        .single();

      if (saveError) throw saveError;

      // Auto-download the PDF
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Document généré",
        description: `Le document ${fileName} a été téléchargé avec succès`
      });

      // Refresh documents list
      await fetchDocuments();
      
      return { document: documentRecord, fileName, success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la génération';
      setError(errorMessage);
      toast({
        title: "Erreur de génération",
        description: errorMessage,
        variant: "destructive"
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Preview document
  const previewDocument = async (templateId: string, studentId?: string, data?: any) => {
    try {
      // Import DocumentPDFGenerator dynamically
      const { DocumentPDFGenerator } = await import('@/services/DocumentPDFGenerator');
      
      if (!studentId) {
        throw new Error('Student ID is required for document preview');
      }

      const previewHTML = await DocumentPDFGenerator.previewHTML(
        templateId, 
        studentId, 
        data
      );

      return { html: previewHTML, success: true };
    } catch (err) {
      toast({
        title: "Erreur d'aperçu",
        description: "Impossible de générer l'aperçu",
        variant: "destructive"
      });
      throw err;
    }
  };

  // Save template - mock implementation for now
  const saveTemplate = async (templateData: Partial<DocumentTemplate>) => {
    try {
      setLoading(true);
      
      // Mock save operation
      toast({
        title: "Template sauvegardé",
        description: "Le template a été sauvegardé avec succès"
      });

      await fetchTemplates();
      return templateData;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la sauvegarde';
      toast({
        title: "Erreur de sauvegarde",
        description: errorMessage,
        variant: "destructive"
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get documents by type
  const getDocumentsByType = (type: string) => {
    return templates.filter(template => template.type === type);
  };

  // Get document statistics
  const getStats = async () => {
    try {
      const { data, error } = await supabase
        .from('generated_documents')
        .select('*');
      
      if (error) throw error;
      
      return {
        total_documents: data?.length || 0,
        recent_documents: data?.filter(doc => 
          new Date(doc.generated_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        ).length || 0,
        valid_documents: data?.filter(doc => doc.is_valid).length || 0
      };
    } catch (err) {
      console.error('Error fetching document stats:', err);
      return null;
    }
  };

  useEffect(() => {
    fetchTemplates();
    fetchDocuments();
  }, []);

  return {
    templates,
    documents,
    loading,
    error,
    fetchTemplates,
    fetchDocuments,
    generateDocument,
    previewDocument,
    saveTemplate,
    getDocumentsByType,
    getStats
  };
}