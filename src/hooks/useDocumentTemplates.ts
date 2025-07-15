import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface DocumentTemplate {
  id: string;
  name: string;
  code: string;
  description: string | null;
  template_type: string;
  template_content: any;
  variables: any;
  is_active: boolean;
  requires_approval: boolean;
  category_id: string | null;
  program_id: string | null;
  level_id: string | null;
  academic_year_id: string | null;
  auto_generate: boolean;
  target_audience: any;
  created_at: string;
  updated_at: string;
}

export interface DocumentVariable {
  id: string;
  name: string;
  label: string;
  variable_type: string;
  category: string;
  description: string | null;
  default_value: string | null;
  is_required: boolean;
}

export function useDocumentTemplates() {
  const [templates, setTemplates] = useState<DocumentTemplate[]>([]);
  const [variables, setVariables] = useState<DocumentVariable[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('document_templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTemplates(data || []);
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Erreur",
        description: "Impossible de charger les templates",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchVariables = async () => {
    try {
      const { data, error } = await supabase
        .from('document_variables')
        .select('*')
        .order('category', { ascending: true });

      if (error) throw error;
      setVariables(data || []);
    } catch (err: any) {
      console.error('Error fetching variables:', err);
    }
  };

  const createTemplate = async (template: Omit<DocumentTemplate, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('document_templates')
        .insert([template])
        .select()
        .single();

      if (error) throw error;

      setTemplates(prev => [data, ...prev]);
      toast({
        title: "Succès",
        description: "Template créé avec succès"
      });
      return data;
    } catch (err: any) {
      toast({
        title: "Erreur",
        description: err.message,
        variant: "destructive"
      });
      throw err;
    }
  };

  const updateTemplate = async (id: string, updates: Partial<DocumentTemplate>) => {
    try {
      const { data, error } = await supabase
        .from('document_templates')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setTemplates(prev => prev.map(t => t.id === id ? data : t));
      toast({
        title: "Succès",
        description: "Template mis à jour"
      });
      return data;
    } catch (err: any) {
      toast({
        title: "Erreur",
        description: err.message,
        variant: "destructive"
      });
      throw err;
    }
  };

  const deleteTemplate = async (id: string) => {
    try {
      const { error } = await supabase
        .from('document_templates')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setTemplates(prev => prev.filter(t => t.id !== id));
      toast({
        title: "Succès",
        description: "Template supprimé"
      });
    } catch (err: any) {
      toast({
        title: "Erreur",
        description: err.message,
        variant: "destructive"
      });
      throw err;
    }
  };

  const duplicateTemplate = async (id: string) => {
    try {
      const original = templates.find(t => t.id === id);
      if (!original) throw new Error('Template non trouvé');

      const duplicate = {
        ...original,
        name: `${original.name} (Copie)`,
        code: `${original.code}_copy_${Date.now()}`,
        requires_approval: false
      };
      delete (duplicate as any).id;
      delete (duplicate as any).created_at;
      delete (duplicate as any).updated_at;

      return await createTemplate(duplicate);
    } catch (err: any) {
      toast({
        title: "Erreur",
        description: err.message,
        variant: "destructive"
      });
      throw err;
    }
  };

  useEffect(() => {
    fetchTemplates();
    fetchVariables();
  }, []);

  return {
    templates,
    variables,
    loading,
    error,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    duplicateTemplate,
    refetch: fetchTemplates
  };
}