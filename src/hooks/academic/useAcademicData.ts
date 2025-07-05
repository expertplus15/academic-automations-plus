import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Types
export interface Program {
  id: string;
  name: string;
  code: string;
  description?: string;
  department_id?: string;
  duration_years: number;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  description?: string;
  credits_ects: number;
  coefficient: number;
  hours_theory: number;
  hours_practice: number;
  hours_project: number;
  status: string;
  program_id?: string;
  level_id?: string;
  class_group_id?: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  description?: string;
  head_id?: string;
  created_at: string;
  updated_at: string;
}

export interface AcademicLevel {
  id: string;
  name: string;
  code: string;
  order_index?: number;
  is_active?: boolean;
}

// Hook générique pour les données académiques
function useAcademicTable<T>(
  tableName: 'programs' | 'subjects' | 'departments' | 'academic_levels',
  select = '*',
  orderBy = 'name'
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log(`🔍 [DEBUG] Fetching ${tableName}...`);
      const { data: result, error: fetchError } = await supabase
        .from(tableName)
        .select(select)
        .order(orderBy);

      if (fetchError) {
        console.error(`❌ [DEBUG] Error fetching ${tableName}:`, fetchError);
        throw fetchError;
      }

      console.log(`✅ [DEBUG] Successfully fetched ${result?.length || 0} ${tableName}`);
      setData((result as T[]) || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : `Erreur lors du chargement des ${tableName}`;
      console.error(`❌ [DEBUG] ${tableName} loading error:`, err);
      setError(message);
      
      // Ne pas montrer de toast pour les erreurs silencieuses de chargement
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [tableName, select, orderBy]);

  return { data, loading, error, refetch: fetchData };
}

// Hooks spécialisés
export function usePrograms() {
  const result = useAcademicTable<Program>('programs', `
    *,
    departments!programs_department_id_fkey(*)
  `);
  
  return {
    data: result.data,
    programs: result.data, // Alias pour compatibilité
    loading: result.loading,
    error: result.error,
    refetch: result.refetch
  };
}

export function useSubjects() {
  const result = useAcademicTable<Subject>('subjects');
  
  return {
    data: result.data,
    subjects: result.data, // Alias pour compatibilité
    loading: result.loading,
    error: result.error,
    refetch: result.refetch
  };
}

export function useDepartments() {
  const result = useAcademicTable<Department>('departments');
  
  return {
    data: result.data,
    departments: result.data, // Alias pour compatibilité
    loading: result.loading,
    error: result.error,
    refetch: result.refetch
  };
}

export function useAcademicLevels() {
  const result = useAcademicTable<AcademicLevel>('academic_levels', '*', 'order_index');
  
  return {
    data: result.data,
    levels: result.data, // Alias pour compatibilité
    loading: result.loading,
    error: result.error,
    refetch: result.refetch
  };
}

// Hook pour créer des entités
export function useCreateAcademic() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const create = async (table: 'programs' | 'subjects' | 'departments' | 'academic_levels', data: any, successMessage: string) => {
    setLoading(true);
    try {
      console.log(`🔍 [DEBUG] Creating ${table}:`, data);
      const { error } = await supabase
        .from(table)
        .insert(data);

      if (error) {
        console.error(`❌ [DEBUG] Error creating ${table}:`, error);
        throw error;
      }

      console.log(`✅ [DEBUG] Successfully created ${table}`);
      toast({
        title: 'Succès',
        description: successMessage,
      });

      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Une erreur est survenue';
      console.error(`❌ [DEBUG] ${table} creation error:`, error);
      
      toast({
        title: 'Erreur',
        description: message,
        variant: 'destructive'
      });

      return false;
    } finally {
      setLoading(false);
    }
  };

  return { create, loading };
}

// Hook pour mettre à jour des entités
export function useUpdateAcademic() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const update = async (table: 'programs' | 'subjects' | 'departments' | 'academic_levels', id: string, data: any, successMessage: string) => {
    setLoading(true);
    try {
      console.log(`🔍 [DEBUG] Updating ${table} ${id}:`, data);
      const { error } = await supabase
        .from(table)
        .update(data)
        .eq('id', id);

      if (error) {
        console.error(`❌ [DEBUG] Error updating ${table}:`, error);
        throw error;
      }

      console.log(`✅ [DEBUG] Successfully updated ${table}`);
      toast({
        title: 'Succès',
        description: successMessage,
      });

      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Une erreur est survenue';
      console.error(`❌ [DEBUG] ${table} update error:`, error);
      
      toast({
        title: 'Erreur',
        description: message,
        variant: 'destructive'
      });

      return false;
    } finally {
      setLoading(false);
    }
  };

  return { update, loading };
}

// Hook pour supprimer des entités
export function useDeleteAcademic() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const deleteItem = async (table: 'programs' | 'subjects' | 'departments' | 'academic_levels', id: string, successMessage: string) => {
    setLoading(true);
    try {
      console.log(`🔍 [DEBUG] Deleting ${table} ${id}`);
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id);

      if (error) {
        console.error(`❌ [DEBUG] Error deleting ${table}:`, error);
        throw error;
      }

      console.log(`✅ [DEBUG] Successfully deleted ${table}`);
      toast({
        title: 'Succès',
        description: successMessage,
      });

      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Une erreur est survenue';
      console.error(`❌ [DEBUG] ${table} deletion error:`, error);
      
      toast({
        title: 'Erreur',
        description: message,
        variant: 'destructive'
      });

      return false;
    } finally {
      setLoading(false);
    }
  };

  return { deleteItem, loading };
}