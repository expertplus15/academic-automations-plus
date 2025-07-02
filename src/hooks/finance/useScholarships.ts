import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Scholarship {
  id: string;
  name: string;
  code: string;
  description: string | null;
  scholarship_type: string;
  amount: number;
  percentage: number | null;
  max_recipients: number | null;
  eligibility_criteria: any;
  academic_year_id: string | null;
  is_active: boolean;
  application_deadline: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export function useScholarships() {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchScholarships = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('scholarships')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setScholarships(data || []);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les bourses",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createScholarship = async (scholarshipData: {
    name: string;
    code: string;
    description?: string;
    scholarship_type: string;
    amount: number;
    percentage?: number;
    max_recipients?: number;
    eligibility_criteria?: any;
    academic_year_id?: string;
    application_deadline?: string;
  }) => {
    try {
      const { data, error } = await supabase
        .from('scholarships')
        .insert([{ ...scholarshipData, created_by: (await supabase.auth.getUser()).data.user?.id }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Bourse créée avec succès",
      });

      await fetchScholarships();
      return data;
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de créer la bourse",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateScholarship = async (id: string, updates: Partial<Scholarship>) => {
    try {
      const { data, error } = await supabase
        .from('scholarships')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Bourse mise à jour avec succès",
      });

      await fetchScholarships();
      return data;
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la bourse",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchScholarships();
  }, []);

  return {
    scholarships,
    loading,
    fetchScholarships,
    createScholarship,
    updateScholarship,
  };
}