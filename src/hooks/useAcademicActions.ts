
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useAcademicActions() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const validateYear = async (yearId: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.rpc('validate_academic_year', {
        p_year_id: yearId
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Succès",
        description: "Année académique validée avec succès",
      });
      return true;
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de la validation",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const archiveYear = async (yearId: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.rpc('archive_academic_year', {
        p_year_id: yearId
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Succès",
        description: "Année académique archivée avec succès",
      });
      return true;
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de l'archivage",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const promoteStudents = async (fromYearId: string, toYearId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('promote_students_to_next_year', {
        p_from_year_id: fromYearId,
        p_to_year_id: toYearId
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Succès",
        description: `${data || 0} étudiants ont été promus avec succès`,
      });
      return data;
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de la promotion",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const unarchiveYear = async (yearId: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.rpc('unarchive_academic_year', {
        p_year_id: yearId
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Succès",
        description: "Année académique désarchivée avec succès",
      });
      return true;
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors du désarchivage",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    validateYear,
    archiveYear,
    promoteStudents,
    unarchiveYear,
    loading
  };
}
