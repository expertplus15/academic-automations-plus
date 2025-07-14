import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface DocumentType {
  id: string;
  name: string;
  code: string;
  description?: string;
  icon: string;
  color: string;
  category: string;
  variables: string[];
  validation_rules: Record<string, any>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DocumentTypeFilters {
  search: string;
  category: string;
  isActive: boolean | null;
}

export function useDocumentTypes() {
  const [types, setTypes] = useState<DocumentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<DocumentTypeFilters>({
    search: '',
    category: '',
    isActive: null
  });
  const { toast } = useToast();

  // Fetch document types
  const fetchTypes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('document_types')
        .select('*')
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }
      if (filters.category) {
        query = query.eq('category', filters.category);
      }
      if (filters.isActive !== null) {
        query = query.eq('is_active', filters.isActive);
      }

      const { data, error } = await query;

      if (error) throw error;
      setTypes(data || []);
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

  // Create document type
  const createType = useCallback(async (typeData: Omit<DocumentType, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('document_types')
        .insert([typeData])
        .select()
        .single();

      if (error) throw error;

      setTypes(prev => [data, ...prev]);
      toast({
        title: "Succès",
        description: "Type de document créé avec succès",
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

  // Update document type
  const updateType = useCallback(async (id: string, updates: Partial<DocumentType>) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('document_types')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setTypes(prev => prev.map(type => type.id === id ? data : type));
      toast({
        title: "Succès",
        description: "Type de document mis à jour",
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
  }, [toast]);

  // Delete document type (soft delete)
  const deleteType = useCallback(async (id: string) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('document_types')
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      setTypes(prev => prev.map(type => 
        type.id === id ? { ...type, is_active: false } : type
      ));
      
      toast({
        title: "Succès",
        description: "Type de document supprimé",
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

  // Duplicate document type
  const duplicateType = useCallback(async (originalType: DocumentType) => {
    const duplicatedData = {
      ...originalType,
      name: `${originalType.name} (Copie)`,
      code: `${originalType.code}_copy_${Date.now()}`,
    };
    delete (duplicatedData as any).id;
    delete (duplicatedData as any).created_at;
    delete (duplicatedData as any).updated_at;

    return createType(duplicatedData);
  }, [createType]);

  // Update filters
  const updateFilters = useCallback((newFilters: Partial<DocumentTypeFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Clear filters
  const clearFilters = useCallback(() => {
    setFilters({ search: '', category: '', isActive: null });
  }, []);

  // Get statistics
  const getStats = useCallback(() => {
    const total = types.length;
    const active = types.filter(type => type.is_active).length;
    const byCategory = types.reduce((acc, type) => {
      acc[type.category] = (acc[type.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return { total, active, inactive: total - active, byCategory };
  }, [types]);

  useEffect(() => {
    fetchTypes();
  }, [fetchTypes]);

  return {
    types,
    loading,
    error,
    filters,
    fetchTypes,
    createType,
    updateType,
    deleteType,
    duplicateType,
    updateFilters,
    clearFilters,
    getStats,
  };
}