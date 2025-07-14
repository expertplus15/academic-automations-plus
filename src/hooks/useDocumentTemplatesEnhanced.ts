import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { DocumentType } from './useDocumentTypes';

export interface DocumentTemplate {
  id: string;
  name: string;
  description?: string;
  document_type_id: string;
  content: any;
  variables: Record<string, any>;
  is_active: boolean;
  is_default: boolean;
  version: number;
  created_at: string;
  updated_at: string;
  preview_url?: string;
  document_type?: DocumentType;
}

export interface TemplateFilters {
  search: string;
  documentTypeId: string;
  isActive: boolean | null;
  isDefault: boolean | null;
}

export function useDocumentTemplatesEnhanced() {
  const [templates, setTemplates] = useState<DocumentTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<TemplateFilters>({
    search: '',
    documentTypeId: '',
    isActive: null,
    isDefault: null
  });
  const { toast } = useToast();

  // Mock data for now until tables are created
  const fetchTemplates = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Mock data - replace with real data once tables exist
      const mockData: DocumentTemplate[] = [
        {
          id: '1',
          name: 'Template Certificat Standard',
          description: 'Template standard pour les certificats de scolarité',
          document_type_id: '1',
          content: '<html><body><h1>Certificat de Scolarité</h1><p>{{nom_etudiant}}</p></body></html>',
          variables: { nom_etudiant: '', programme: '', annee_academique: '' },
          is_active: true,
          is_default: true,
          version: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          document_type: {
            id: '1',
            name: 'Certificat de Scolarité',
            code: 'CERT_SCOL',
            description: 'Certificat attestant de la scolarité d\'un étudiant',
            icon: 'FileText',
            color: '#3B82F6',
            category: 'Certificats',
            variables: ['nom_etudiant', 'programme', 'annee_academique'],
            validation_rules: {},
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
        },
        {
          id: '2',
          name: 'Template Relevé de Notes',
          description: 'Template pour les relevés de notes',
          document_type_id: '2',
          content: '<html><body><h1>Relevé de Notes</h1><p>{{nom_etudiant}}</p><p>{{notes}}</p></body></html>',
          variables: { nom_etudiant: '', notes: '', moyenne: '' },
          is_active: true,
          is_default: true,
          version: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          document_type: {
            id: '2',
            name: 'Relevé de Notes',
            code: 'RELEVE_NOTES',
            description: 'Relevé officiel des notes d\'un étudiant',
            icon: 'Award',
            color: '#10B981',
            category: 'Académique',
            variables: ['nom_etudiant', 'notes', 'moyenne'],
            validation_rules: {},
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
        }
      ];

      // Apply filters
      let filteredData = mockData;
      if (filters.search) {
        filteredData = filteredData.filter(template => 
          template.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          template.description?.toLowerCase().includes(filters.search.toLowerCase())
        );
      }
      if (filters.documentTypeId) {
        filteredData = filteredData.filter(template => template.document_type_id === filters.documentTypeId);
      }
      if (filters.isActive !== null) {
        filteredData = filteredData.filter(template => template.is_active === filters.isActive);
      }
      if (filters.isDefault !== null) {
        filteredData = filteredData.filter(template => template.is_default === filters.isDefault);
      }

      setTemplates(filteredData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement';
      setError(errorMessage);
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [filters, toast]);

  // Create template (mock for now)
  const createTemplate = useCallback(async (templateData: Omit<DocumentTemplate, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setLoading(true);
      
      // Mock creation - replace with real API call once tables exist
      const newTemplate: DocumentTemplate = {
        ...templateData,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      setTemplates(prev => [newTemplate, ...prev]);
      toast({
        title: "Succès",
        description: "Template créé avec succès",
      });
      
      return { data: newTemplate, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la création';
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
      return { data: null, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Update template (mock for now)
  const updateTemplate = useCallback(async (id: string, updates: Partial<DocumentTemplate>) => {
    try {
      setLoading(true);
      
      // Mock update - replace with real API call once tables exist
      const updatedTemplate = { ...updates, updated_at: new Date().toISOString() };
      
      setTemplates(prev => prev.map(template => 
        template.id === id ? { ...template, ...updatedTemplate } : template
      ));
      
      toast({
        title: "Succès",
        description: "Template mis à jour",
      });
      
      return { data: updatedTemplate, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la mise à jour';
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
      return { data: null, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Delete template (soft delete, mock for now)
  const deleteTemplate = useCallback(async (id: string) => {
    try {
      setLoading(true);
      
      // Mock soft delete - replace with real API call once tables exist
      setTemplates(prev => prev.map(template => 
        template.id === id ? { ...template, is_active: false, updated_at: new Date().toISOString() } : template
      ));
      
      toast({
        title: "Succès",
        description: "Template supprimé",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la suppression';
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Duplicate template
  const duplicateTemplate = useCallback(async (originalTemplate: DocumentTemplate) => {
    const duplicatedData = {
      ...originalTemplate,
      name: `${originalTemplate.name} (Copie)`,
      is_default: false,
      version: 1,
    };
    delete (duplicatedData as any).id;
    delete (duplicatedData as any).created_at;
    delete (duplicatedData as any).updated_at;
    delete (duplicatedData as any).document_type;

    return createTemplate(duplicatedData);
  }, [createTemplate]);

  // Set default template (mock for now)
  const setAsDefault = useCallback(async (id: string) => {
    try {
      setLoading(true);
      
      // Mock set default - replace with real API call once tables exist
      const template = templates.find(t => t.id === id);
      if (!template) return;

      // Update local state
      setTemplates(prev => prev.map(t => ({
        ...t,
        is_default: t.document_type_id === template.document_type_id ? t.id === id : t.is_default,
        updated_at: t.id === id ? new Date().toISOString() : t.updated_at
      })));

      toast({
        title: "Succès",
        description: "Template défini par défaut",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la mise à jour';
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [templates, toast]);

  // Update filters
  const updateFilters = useCallback((newFilters: Partial<TemplateFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Clear filters
  const clearFilters = useCallback(() => {
    setFilters({ search: '', documentTypeId: '', isActive: null, isDefault: null });
  }, []);

  // Get statistics
  const getStats = useCallback(() => {
    const total = templates.length;
    const active = templates.filter(t => t.is_active).length;
    const defaults = templates.filter(t => t.is_default).length;
    const byType = templates.reduce((acc, template) => {
      const typeName = template.document_type?.name || 'Inconnu';
      acc[typeName] = (acc[typeName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return { total, active, inactive: total - active, defaults, byType };
  }, [templates]);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  return {
    templates,
    loading,
    error,
    filters,
    fetchTemplates,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    duplicateTemplate,
    setAsDefault,
    updateFilters,
    clearFilters,
    getStats,
  };
}