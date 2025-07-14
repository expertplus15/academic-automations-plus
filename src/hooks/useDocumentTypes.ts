import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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

// Mock data for development
const mockDocumentTypes: DocumentType[] = [
  {
    id: '1',
    name: 'Bulletin de Notes',
    code: 'BULLETIN',
    description: 'Bulletin semestriel avec notes et moyennes détaillées',
    icon: 'FileText',
    color: 'blue',
    category: 'academique',
    variables: ['student_name', 'student_number', 'program', 'semester', 'grades'],
    validation_rules: { required: ['student_name', 'semester'] },
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Relevé de Notes',
    code: 'RELEVE',
    description: 'Relevé détaillé de toutes les notes obtenues',
    icon: 'FileText',
    color: 'green',
    category: 'academique',
    variables: ['student_name', 'student_number', 'program', 'all_grades', 'gpa'],
    validation_rules: { required: ['student_name'] },
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Attestation de Scolarité',
    code: 'ATTESTATION',
    description: 'Certificat officiel de scolarité',
    icon: 'FileText',
    color: 'purple',
    category: 'officiel',
    variables: ['student_name', 'student_number', 'program', 'enrollment_date'],
    validation_rules: {},
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Certificat de Réussite',
    code: 'CERTIFICAT',
    description: 'Certificat de réussite aux examens',
    icon: 'FileText',
    color: 'yellow',
    category: 'officiel',
    variables: ['student_name', 'program', 'graduation_date', 'honors'],
    validation_rules: { required: ['graduation_date'] },
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export function useDocumentTypes() {
  const [types, setTypes] = useState<DocumentType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<DocumentTypeFilters>({
    search: '',
    category: '',
    isActive: null
  });
  const { toast } = useToast();

  // Fetch document types (with persistent storage)
  const fetchTypes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get from localStorage
      const savedTypes = localStorage.getItem('document_types');
      let allTypes = savedTypes ? JSON.parse(savedTypes) : [...mockDocumentTypes];
      
      // Apply filters
      if (filters.search) {
        allTypes = allTypes.filter((type: DocumentType) =>
          type.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          type.description?.toLowerCase().includes(filters.search.toLowerCase())
        );
      }
      if (filters.category) {
        allTypes = allTypes.filter((type: DocumentType) => type.category === filters.category);
      }
      if (filters.isActive !== null) {
        allTypes = allTypes.filter((type: DocumentType) => type.is_active === filters.isActive);
      }
      
      setTypes(allTypes);
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
      console.log('🔨 Création du type:', typeData);
      
      const newType: DocumentType = {
        ...typeData,
        id: `new_${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      // Save to localStorage
      const savedTypes = localStorage.getItem('document_types');
      const allTypes = savedTypes ? JSON.parse(savedTypes) : [...mockDocumentTypes];
      const updatedTypes = [newType, ...allTypes];
      localStorage.setItem('document_types', JSON.stringify(updatedTypes));
      console.log('💾 Sauvegardé dans localStorage:', updatedTypes.length, 'types');
      
      // Clear all filters first to ensure the new type is visible
      setFilters({ search: '', category: '', isActive: null });
      
      // Update state with all types (no filters applied)
      setTypes(updatedTypes);
      console.log('✅ État mis à jour avec tous les types:', updatedTypes.length);
      
      toast({
        title: "✅ Succès",
        description: `Type de document "${typeData.name}" créé avec succès`,
      });
      
      return { data: newType, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la création';
      console.error('❌ Erreur création type:', err);
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

  // Update document type
  const updateType = useCallback(async (id: string, updates: Partial<DocumentType>) => {
    try {
      setLoading(true);
      
      const savedTypes = localStorage.getItem('document_types');
      const allTypes = savedTypes ? JSON.parse(savedTypes) : [...mockDocumentTypes];
      
      const updatedTypes = allTypes.map((type: DocumentType) => 
        type.id === id ? { ...type, ...updates, updated_at: new Date().toISOString() } : type
      );
      
      localStorage.setItem('document_types', JSON.stringify(updatedTypes));
      const updatedType = updatedTypes.find((type: DocumentType) => type.id === id);

      setTypes(prev => prev.map(type => type.id === id ? updatedType : type));
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
  }, [types, toast]);

  // Delete document type (soft delete)
  const deleteType = useCallback(async (id: string) => {
    try {
      setLoading(true);
      
      const savedTypes = localStorage.getItem('document_types');
      const allTypes = savedTypes ? JSON.parse(savedTypes) : [...mockDocumentTypes];
      
      const updatedTypes = allTypes.map((type: DocumentType) => 
        type.id === id ? { ...type, is_active: false } : type
      );
      
      localStorage.setItem('document_types', JSON.stringify(updatedTypes));
      
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

  // Apply filters when they change
  useEffect(() => {
    console.log('🔄 Filtres changés:', filters);
    
    // Get all types from localStorage
    const savedTypes = localStorage.getItem('document_types');
    let allTypes = savedTypes ? JSON.parse(savedTypes) : [...mockDocumentTypes];
    
    // Apply current filters
    if (filters.search) {
      allTypes = allTypes.filter((type: DocumentType) =>
        type.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        type.description?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    if (filters.category) {
      allTypes = allTypes.filter((type: DocumentType) => type.category === filters.category);
    }
    if (filters.isActive !== null) {
      allTypes = allTypes.filter((type: DocumentType) => type.is_active === filters.isActive);
    }
    
    setTypes(allTypes);
    console.log('🔍 Filtres appliqués:', allTypes.length, 'types affichés');
  }, [filters.search, filters.category, filters.isActive]);

  // Initial load
  useEffect(() => {
    const savedTypes = localStorage.getItem('document_types');
    const allTypes = savedTypes ? JSON.parse(savedTypes) : [...mockDocumentTypes];
    console.log('🔄 Chargement initial:', allTypes.length, 'types depuis localStorage');
    setTypes(allTypes);
  }, []);

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