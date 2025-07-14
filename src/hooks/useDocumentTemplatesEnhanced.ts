import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export interface DocumentTemplate {
  id: string;
  name: string;
  document_type_id: string;
  description?: string;
  content: any;
  variables: Record<string, any>;
  preview_url?: string;
  is_active: boolean;
  is_default: boolean;
  version: number;
  created_at: string;
  updated_at: string;
  document_type?: {
    id: string;
    name: string;
    code: string;
    category: string;
    color: string;
  };
}

export interface TemplateFilters {
  search: string;
  documentTypeId: string;
  isActive: boolean | null;
  isDefault: boolean | null;
}

// Mock data for development
const mockTemplates: DocumentTemplate[] = [
  {
    id: '1',
    name: 'Template Bulletin Standard',
    document_type_id: '1',
    description: 'Template standard pour les bulletins de notes',
    content: { layout: 'standard', sections: ['header', 'grades', 'footer'] },
    variables: { student_name: '', semester: '', grades: [] },
    is_active: true,
    is_default: true,
    version: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    document_type: {
      id: '1',
      name: 'Bulletin de Notes',
      code: 'BULLETIN',
      category: 'academique',
      color: 'blue'
    }
  },
  {
    id: '2',
    name: 'Template Relevé Complet',
    document_type_id: '2',
    description: 'Template détaillé pour les relevés de notes',
    content: { layout: 'detailed', sections: ['header', 'all_grades', 'statistics', 'footer'] },
    variables: { student_name: '', all_grades: [], gpa: 0 },
    is_active: true,
    is_default: true,
    version: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    document_type: {
      id: '2',
      name: 'Relevé de Notes',
      code: 'RELEVE',
      category: 'academique',
      color: 'green'
    }
  },
];

export function useDocumentTemplatesEnhanced() {
  const [templates, setTemplates] = useState<DocumentTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<TemplateFilters>({
    search: '',
    documentTypeId: '',
    isActive: null,
    isDefault: null
  });
  const { toast } = useToast();

  // Fetch templates (with persistent storage)
  const fetchTemplates = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get from localStorage
      const savedTemplates = localStorage.getItem('document_templates');
      let allTemplates = savedTemplates ? JSON.parse(savedTemplates) : [...mockTemplates];
      
      // Apply filters
      if (filters.search) {
        allTemplates = allTemplates.filter((template: DocumentTemplate) =>
          template.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          template.description?.toLowerCase().includes(filters.search.toLowerCase())
        );
      }
      if (filters.documentTypeId) {
        allTemplates = allTemplates.filter((template: DocumentTemplate) => 
          template.document_type_id === filters.documentTypeId
        );
      }
      if (filters.isActive !== null) {
        allTemplates = allTemplates.filter((template: DocumentTemplate) => 
          template.is_active === filters.isActive
        );
      }
      if (filters.isDefault !== null) {
        allTemplates = allTemplates.filter((template: DocumentTemplate) => 
          template.is_default === filters.isDefault
        );
      }
      
      setTemplates(allTemplates);
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

  // Create template
  const createTemplate = useCallback(async (templateData: Omit<DocumentTemplate, 'id' | 'created_at' | 'updated_at' | 'version'>) => {
    try {
      setLoading(true);
      console.log('🔨 Création du template:', templateData);
      
      const newTemplate: DocumentTemplate = {
        ...templateData,
        id: `new_${Date.now()}`,
        version: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      // Save to localStorage
      const savedTemplates = localStorage.getItem('document_templates');
      const allTemplates = savedTemplates ? JSON.parse(savedTemplates) : [...mockTemplates];
      const updatedTemplates = [newTemplate, ...allTemplates];
      localStorage.setItem('document_templates', JSON.stringify(updatedTemplates));
      console.log('💾 Sauvegardé dans localStorage:', updatedTemplates.length, 'templates');
      
      // Clear filters and update state immediately
      const clearedFilters = { search: '', documentTypeId: '', isActive: null, isDefault: null };
      setFilters(clearedFilters);
      
      // Update state directly
      setTemplates(updatedTemplates);
      console.log('✅ État mis à jour directement avec', updatedTemplates.length, 'templates');
      
      toast({
        title: "✅ Succès",
        description: `Template "${templateData.name}" créé avec succès`,
      });
      
      return { data: newTemplate, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la création';
      console.error('❌ Erreur création template:', err);
      toast({
        title: "❌ Erreur",
        description: errorMessage,
        variant: "destructive",
      });
      return { data: null, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Update template
  const updateTemplate = useCallback(async (id: string, updates: Partial<DocumentTemplate>) => {
    try {
      setLoading(true);
      
      // Update in localStorage
      const savedTemplates = localStorage.getItem('document_templates');
      const allTemplates = savedTemplates ? JSON.parse(savedTemplates) : [...mockTemplates];
      
      const updatedTemplates = allTemplates.map((template: DocumentTemplate) => {
        if (template.id === id) {
          return {
            ...template,
            ...updates,
            version: template.version + 1,
            updated_at: new Date().toISOString(),
          };
        }
        return template;
      });
      
      localStorage.setItem('document_templates', JSON.stringify(updatedTemplates));
      const updatedTemplate = updatedTemplates.find((template: DocumentTemplate) => template.id === id);

      setTemplates(prev => prev.map(template => template.id === id ? updatedTemplate : template));
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

  // Delete template
  const deleteTemplate = useCallback(async (id: string) => {
    try {
      setLoading(true);
      
      // Update in localStorage
      const savedTemplates = localStorage.getItem('document_templates');
      const allTemplates = savedTemplates ? JSON.parse(savedTemplates) : [...mockTemplates];
      
      const updatedTemplates = allTemplates.map((template: DocumentTemplate) => 
        template.id === id ? { ...template, is_active: false } : template
      );
      
      localStorage.setItem('document_templates', JSON.stringify(updatedTemplates));
      
      setTemplates(prev => prev.map(template => 
        template.id === id ? { ...template, is_active: false } : template
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
    };
    delete (duplicatedData as any).id;
    delete (duplicatedData as any).created_at;
    delete (duplicatedData as any).updated_at;
    delete (duplicatedData as any).version;
    delete (duplicatedData as any).document_type;

    return createTemplate(duplicatedData);
  }, [createTemplate]);

  // Set as default
  const setAsDefault = useCallback(async (id: string) => {
    try {
      setLoading(true);
      const template = templates.find(t => t.id === id);
      if (!template) throw new Error('Template non trouvé');

      setTemplates(prev => prev.map(t => ({
        ...t,
        is_default: t.document_type_id === template.document_type_id 
          ? t.id === id 
          : t.is_default
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

  // Separate useEffect for filters to avoid circular dependency
  useEffect(() => {
    console.log('🔄 Filtres templates changés:', filters);
    fetchTemplates();
  }, [filters.search, filters.documentTypeId, filters.isActive, filters.isDefault, toast]);

  // Initial load
  useEffect(() => {
    const savedTemplates = localStorage.getItem('document_templates');
    const allTemplates = savedTemplates ? JSON.parse(savedTemplates) : [...mockTemplates];
    console.log('🔄 Chargement initial templates:', allTemplates.length, 'templates depuis localStorage');
    setTemplates(allTemplates);
  }, []);

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