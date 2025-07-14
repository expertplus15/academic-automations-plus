import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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

  // Fetch templates with document type info
  const fetchTemplates = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('document_templates')
        .select(`
          *,
          document_type:document_types(id, name, code, category, color)
        `)
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }
      if (filters.documentTypeId) {
        query = query.eq('document_type_id', filters.documentTypeId);
      }
      if (filters.isActive !== null) {
        query = query.eq('is_active', filters.isActive);
      }
      if (filters.isDefault !== null) {
        query = query.eq('is_default', filters.isDefault);
      }

      const { data, error } = await query;

      if (error) throw error;
      setTemplates(data || []);
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
      const { data, error } = await supabase
        .from('document_templates')
        .insert([{ ...templateData, version: 1 }])
        .select(`
          *,
          document_type:document_types(id, name, code, category, color)
        `)
        .single();

      if (error) throw error;

      setTemplates(prev => [data, ...prev]);
      toast({
        title: "Succès",
        description: "Template créé avec succès",
      });
      
      return { data, error: null };
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

  // Update template
  const updateTemplate = useCallback(async (id: string, updates: Partial<DocumentTemplate>) => {
    try {
      setLoading(true);
      const currentTemplate = templates.find(t => t.id === id);
      const newVersion = currentTemplate ? currentTemplate.version + 1 : 1;

      const { data, error } = await supabase
        .from('document_templates')
        .update({ 
          ...updates, 
          version: newVersion,
          updated_at: new Date().toISOString() 
        })
        .eq('id', id)
        .select(`
          *,
          document_type:document_types(id, name, code, category, color)
        `)
        .single();

      if (error) throw error;

      setTemplates(prev => prev.map(template => template.id === id ? data : template));
      toast({
        title: "Succès",
        description: "Template mis à jour",
      });
      
      return { data, error: null };
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
  }, [templates, toast]);

  // Delete template
  const deleteTemplate = useCallback(async (id: string) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('document_templates')
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

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

      // Remove default from other templates of same type
      await supabase
        .from('document_templates')
        .update({ is_default: false })
        .eq('document_type_id', template.document_type_id);

      // Set this template as default
      const { error } = await supabase
        .from('document_templates')
        .update({ is_default: true })
        .eq('id', id);

      if (error) throw error;

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