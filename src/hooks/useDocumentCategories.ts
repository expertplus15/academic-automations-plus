import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export interface DocumentCategory {
  id: string;
  name: string;
  code: string;
  description?: string;
  icon: string;
  color: string;
  parent_id?: string | null;
  sort_order: number;
  is_active: boolean;
  is_system: boolean;
  created_at: string;
  updated_at: string;
}

export interface DocumentCategoryFilters {
  search: string;
  parent_id: string | null;
  isActive: boolean | null;
}

// Mock data initial pour le développement (sera remplacé par la base)
const mockCategories: DocumentCategory[] = [
  {
    id: '1',
    name: 'Bulletin de Notes',
    code: 'bulletin',
    description: 'Bulletins scolaires et relevés de notes',
    icon: 'FileText',
    color: 'blue',
    parent_id: null,
    sort_order: 1,
    is_active: true,
    is_system: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Relevé Officiel',
    code: 'transcript',
    description: 'Relevés officiels et transcripts',
    icon: 'FileCheck',
    color: 'green',
    parent_id: null,
    sort_order: 2,
    is_active: true,
    is_system: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Attestation',
    code: 'certificate',
    description: 'Attestations et certificats',
    icon: 'Award',
    color: 'purple',
    parent_id: null,
    sort_order: 3,
    is_active: true,
    is_system: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Certificats de Scolarité',
    code: 'certificats_scolarite',
    description: 'Certificats officiels de scolarité et d\'inscription',
    icon: 'Certificate',
    color: 'indigo',
    parent_id: null,
    sort_order: 4,
    is_active: true,
    is_system: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Rapport',
    code: 'report',
    description: 'Rapports et documents administratifs',
    icon: 'FileText',
    color: 'orange',
    parent_id: null,
    sort_order: 5,
    is_active: true,
    is_system: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const iconOptions = [
  'FileText', 'FileCheck', 'Award', 'Certificate', 'Shield', 'BookOpen',
  'GraduationCap', 'Trophy', 'Star', 'Crown', 'Badge', 'Scroll'
];

const colorOptions = [
  { value: 'blue', label: 'Bleu', class: 'bg-blue-100 text-blue-700' },
  { value: 'green', label: 'Vert', class: 'bg-green-100 text-green-700' },
  { value: 'purple', label: 'Violet', class: 'bg-purple-100 text-purple-700' },
  { value: 'orange', label: 'Orange', class: 'bg-orange-100 text-orange-700' },
  { value: 'red', label: 'Rouge', class: 'bg-red-100 text-red-700' },
  { value: 'yellow', label: 'Jaune', class: 'bg-yellow-100 text-yellow-700' },
  { value: 'pink', label: 'Rose', class: 'bg-pink-100 text-pink-700' },
  { value: 'indigo', label: 'Indigo', class: 'bg-indigo-100 text-indigo-700' },
];

export function useDocumentCategories() {
  const [categories, setCategories] = useState<DocumentCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<DocumentCategoryFilters>({
    search: '',
    parent_id: null,
    isActive: null
  });
  const { toast } = useToast();

  // Fetch categories with filters
  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get from localStorage for now
      const savedCategories = localStorage.getItem('document_categories');
      let allCategories = savedCategories ? JSON.parse(savedCategories) : [...mockCategories];
      
      // Apply filters
      if (filters.search) {
        allCategories = allCategories.filter((cat: DocumentCategory) =>
          cat.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          cat.description?.toLowerCase().includes(filters.search.toLowerCase())
        );
      }
      if (filters.parent_id !== null) {
        allCategories = allCategories.filter((cat: DocumentCategory) => cat.parent_id === filters.parent_id);
      }
      if (filters.isActive !== null) {
        allCategories = allCategories.filter((cat: DocumentCategory) => cat.is_active === filters.isActive);
      }
      
      // Sort by sort_order
      allCategories.sort((a: DocumentCategory, b: DocumentCategory) => a.sort_order - b.sort_order);
      
      setCategories(allCategories);
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

  // Create category
  const createCategory = useCallback(async (categoryData: Omit<DocumentCategory, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setLoading(true);
      
      const newCategory: DocumentCategory = {
        ...categoryData,
        id: `cat_${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      // Save to localStorage
      const savedCategories = localStorage.getItem('document_categories');
      const allCategories = savedCategories ? JSON.parse(savedCategories) : [...mockCategories];
      const updatedCategories = [newCategory, ...allCategories];
      localStorage.setItem('document_categories', JSON.stringify(updatedCategories));
      
      // Clear filters and update state
      setFilters({ search: '', parent_id: null, isActive: null });
      setCategories(updatedCategories.sort((a, b) => a.sort_order - b.sort_order));
      
      toast({
        title: "✅ Succès",
        description: `Catégorie "${categoryData.name}" créée avec succès`,
      });
      
      return { data: newCategory, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la création';
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

  // Update category
  const updateCategory = useCallback(async (id: string, updates: Partial<DocumentCategory>) => {
    try {
      setLoading(true);
      
      const savedCategories = localStorage.getItem('document_categories');
      const allCategories = savedCategories ? JSON.parse(savedCategories) : [...mockCategories];
      
      const updatedCategories = allCategories.map((cat: DocumentCategory) => 
        cat.id === id ? { ...cat, ...updates, updated_at: new Date().toISOString() } : cat
      );
      
      localStorage.setItem('document_categories', JSON.stringify(updatedCategories));
      const updatedCategory = updatedCategories.find((cat: DocumentCategory) => cat.id === id);

      setCategories(prev => prev.map(cat => cat.id === id ? updatedCategory : cat));
      toast({
        title: "Succès",
        description: "Catégorie mise à jour",
      });
      
      return { data: updatedCategory, error: null };
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

  // Delete category (soft delete pour les non-système)
  const deleteCategory = useCallback(async (id: string) => {
    try {
      setLoading(true);
      
      const savedCategories = localStorage.getItem('document_categories');
      const allCategories = savedCategories ? JSON.parse(savedCategories) : [...mockCategories];
      const category = allCategories.find((cat: DocumentCategory) => cat.id === id);
      
      if (category?.is_system) {
        throw new Error('Impossible de supprimer une catégorie système');
      }
      
      const updatedCategories = allCategories.map((cat: DocumentCategory) => 
        cat.id === id ? { ...cat, is_active: false } : cat
      );
      
      localStorage.setItem('document_categories', JSON.stringify(updatedCategories));
      
      setCategories(prev => prev.map(cat => 
        cat.id === id ? { ...cat, is_active: false } : cat
      ));
      
      toast({
        title: "Succès",
        description: "Catégorie supprimée",
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

  // Update filters
  const updateFilters = useCallback((newFilters: Partial<DocumentCategoryFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Clear filters
  const clearFilters = useCallback(() => {
    setFilters({ search: '', parent_id: null, isActive: null });
  }, []);

  // Get statistics
  const getStats = useCallback(() => {
    const total = categories.length;
    const active = categories.filter(cat => cat.is_active).length;
    const system = categories.filter(cat => cat.is_system).length;
    const custom = total - system;

    return { total, active, inactive: total - active, system, custom };
  }, [categories]);

  // Initial load and filter updates
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    loading,
    error,
    filters,
    iconOptions,
    colorOptions,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    updateFilters,
    clearFilters,
    getStats,
  };
}