import { useState, useEffect, useCallback } from 'react';
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

  // Mock data for now until tables are created
  const fetchTypes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Mock data - replace with real data once tables exist
      const mockData: DocumentType[] = [
        {
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
        },
        {
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
      ];

      // Apply filters
      let filteredData = mockData;
      if (filters.search) {
        filteredData = filteredData.filter(type => 
          type.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          type.description?.toLowerCase().includes(filters.search.toLowerCase())
        );
      }
      if (filters.category) {
        filteredData = filteredData.filter(type => type.category === filters.category);
      }
      if (filters.isActive !== null) {
        filteredData = filteredData.filter(type => type.is_active === filters.isActive);
      }

      setTypes(filteredData);
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

  // Create document type (mock for now)
  const createType = useCallback(async (typeData: Omit<DocumentType, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setLoading(true);
      
      // Mock creation - replace with real API call once tables exist
      const newType: DocumentType = {
        ...typeData,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      setTypes(prev => [newType, ...prev]);
      toast({
        title: "Succès",
        description: "Type de document créé avec succès",
      });
      
      return { data: newType, error: null };
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

  // Update document type (mock for now)
  const updateType = useCallback(async (id: string, updates: Partial<DocumentType>) => {
    try {
      setLoading(true);
      
      // Mock update - replace with real API call once tables exist
      const updatedType = { ...updates, updated_at: new Date().toISOString() };
      
      setTypes(prev => prev.map(type => 
        type.id === id ? { ...type, ...updatedType } : type
      ));
      
      toast({
        title: "Succès",
        description: "Type de document mis à jour",
      });
      
      return { data: updatedType, error: null };
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

  // Delete document type (soft delete, mock for now)
  const deleteType = useCallback(async (id: string) => {
    try {
      setLoading(true);
      
      // Mock soft delete - replace with real API call once tables exist
      setTypes(prev => prev.map(type => 
        type.id === id ? { ...type, is_active: false, updated_at: new Date().toISOString() } : type
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