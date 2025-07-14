import { useState, useEffect, useCallback, useMemo } from 'react';
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

// État initial optimisé
const INITIAL_STATE = {
  templates: [] as DocumentTemplate[],
  documents: [] as GeneratedDocument[],
  loading: false,
  error: null as string | null
};

export function useDocuments() {
  const [state, setState] = useState(INITIAL_STATE);
  const { toast } = useToast();

  // Helper pour mettre à jour l'état de façon immutable
  const updateState = useCallback((updates: Partial<typeof INITIAL_STATE>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  // Fetch templates optimisé avec gestion d'erreur unifiée
  const fetchTemplates = useCallback(async () => {
    try {
      updateState({ loading: true, error: null });
      
      const { data, error } = await supabase
        .from('document_templates')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedTemplates: DocumentTemplate[] = data?.map(template => ({
        id: template.id,
        name: template.name,
        type: template.template_type as DocumentTemplate['type'],
        description: template.description,
        content: template.template_content,
        is_active: template.is_active,
        is_default: false, // Valeur par défaut pour la compatibilité
        version: 1, // Valeur par défaut pour la compatibilité
        created_at: template.created_at,
        updated_at: template.updated_at
      })) || [];

      updateState({ templates: formattedTemplates, loading: false });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement des templates';
      updateState({ error: errorMessage, loading: false });
      
      toast({
        title: "Erreur",
        description: "Impossible de charger les templates",
        variant: "destructive"
      });
    }
  }, [updateState, toast]);

  // Fetch documents optimisé
  const fetchDocuments = useCallback(async () => {
    try {
      updateState({ loading: true, error: null });
      
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
        .order('created_at', { ascending: false })
        .limit(100); // Limiter pour optimiser les performances

      if (error) throw error;

      const formattedDocuments: GeneratedDocument[] = data?.map(doc => ({
        id: doc.id,
        template_id: doc.document_requests.template_id,
        student_id: doc.document_requests.student_id,
        document_number: doc.document_number,
        file_path: doc.file_path,
        download_url: undefined,
        generation_data: doc.document_requests.request_data,
        is_valid: true,
        generated_at: doc.generated_at,
        expires_at: doc.expires_at,
        signed_by: doc.generated_by
      })) || [];

      updateState({ documents: formattedDocuments, loading: false });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement des documents';
      updateState({ error: errorMessage, loading: false });
    }
  }, [updateState]);

  // Generate document optimisé
  const generateDocument = useCallback(async (templateId: string, studentId?: string, additionalData?: any) => {
    try {
      updateState({ loading: true });
      
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
      const documentId = crypto.randomUUID();
      
      const { data: documentRecord, error: saveError } = await supabase
        .from('generated_documents')
        .insert({
          id: documentId,
          document_number: documentNumber,
          request_id: documentId,
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
      updateState({ error: errorMessage });
      toast({
        title: "Erreur de génération",
        description: errorMessage,
        variant: "destructive"
      });
      throw err;
    } finally {
      updateState({ loading: false });
    }
  }, [updateState, toast, fetchDocuments]);

  // Preview document optimisé
  const previewDocument = useCallback(async (templateId: string, studentId?: string, data?: any) => {
    try {
      // Mock preview pour l'instant
      return { 
        html: `<div class="document-preview">
          <h1>Aperçu du template ${templateId}</h1>
          <p>Étudiant: ${studentId || 'Demo'}</p>
          <p>Ce document sera généré avec les données réelles.</p>
        </div>`, 
        success: true 
      };
    } catch (err) {
      toast({
        title: "Erreur d'aperçu",
        description: "Impossible de générer l'aperçu",
        variant: "destructive"
      });
      throw err;
    }
  }, [toast]);

  // Save template optimisé
  const saveTemplate = useCallback(async (templateData: Partial<DocumentTemplate>) => {
    try {
      updateState({ loading: true });
      
      // Mock save pour l'instant
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
      updateState({ loading: false });
    }
  }, [updateState, toast, fetchTemplates]);

  // Get documents by type optimisé avec mémorisation
  const getDocumentsByType = useCallback((type: string) => {
    return state.templates.filter(template => template.type === type);
  }, [state.templates]);

  // Get document statistics optimisé
  const getStats = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('generated_documents')
        .select('generated_at, is_valid')
        .limit(1000);
      
      if (error) throw error;
      
      const now = Date.now();
      const weekAgo = now - 7 * 24 * 60 * 60 * 1000;
      
      return {
        total_documents: data?.length || 0,
        recent_documents: data?.filter(doc => 
          new Date(doc.generated_at).getTime() > weekAgo
        ).length || 0,
        valid_documents: data?.filter(doc => doc.is_valid).length || 0
      };
    } catch (err) {
      console.error('Error fetching document stats:', err);
      return {
        total_documents: 0,
        recent_documents: 0,
        valid_documents: 0
      };
    }
  }, []);

  // Mémoriser les valeurs dérivées
  const memoizedValues = useMemo(() => ({
    activeTemplates: state.templates.filter(t => t.is_active),
    templatesByType: state.templates.reduce((acc, template) => {
      acc[template.type] = (acc[template.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
  }), [state.templates]);

  // Effect optimisé
  useEffect(() => {
    fetchTemplates();
    fetchDocuments();
  }, [fetchTemplates, fetchDocuments]);

  return {
    ...state,
    ...memoizedValues,
    fetchTemplates,
    fetchDocuments,
    generateDocument,
    previewDocument,
    saveTemplate,
    getDocumentsByType,
    getStats
  };
}