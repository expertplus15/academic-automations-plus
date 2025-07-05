import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface StudentCard {
  id: string;
  student_id: string;
  template_id: string;
  card_number: string;
  qr_code_data: string | null;
  barcode_data: string | null;
  issue_date: string;
  expiry_date: string | null;
  status: 'active' | 'expired' | 'suspended' | 'lost' | 'replaced';
  is_printed: boolean;
  printed_at: string | null;
  created_at: string;
  students: {
    student_number: string;
    profiles: {
      full_name: string;
    };
    programs: {
      name: string;
    };
  };
  student_card_templates: {
    name: string;
  };
}

export interface CardTemplate {
  id: string;
  name: string;
  description: string | null;
  template_data: any;
  is_default: boolean;
  is_active: boolean;
  created_at: string;
}

export interface PrintBatch {
  id: string;
  batch_name: string;
  card_ids: string[];
  status: 'pending' | 'processing' | 'completed' | 'failed';
  total_cards: number;
  printed_cards: number;
  created_at: string;
  completed_at: string | null;
}

export function useStudentCards() {
  const [cards, setCards] = useState<StudentCard[]>([]);
  const [templates, setTemplates] = useState<CardTemplate[]>([]);
  const [printBatches, setPrintBatches] = useState<PrintBatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchCards = async () => {
    try {
      const { data, error } = await supabase
        .from('student_cards')
        .select(`
          *,
          students!student_cards_student_id_fkey (
            student_number,
            profiles!students_profile_id_fkey (
              full_name
            ),
            programs!students_program_id_fkey (
              name
            )
          ),
          student_card_templates!student_cards_template_id_fkey (
            name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCards((data || []) as StudentCard[]);
    } catch (err) {
      console.error('Error fetching cards:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
    }
  };

  const fetchTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('student_card_templates')
        .select('*')
        .eq('is_active', true)
        .order('is_default', { ascending: false });

      if (error) throw error;
      setTemplates(data || []);
    } catch (err) {
      console.error('Error fetching templates:', err);
    }
  };

  const fetchPrintBatches = async () => {
    try {
      const { data, error } = await supabase
        .from('student_card_prints')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setPrintBatches((data || []) as PrintBatch[]);
    } catch (err) {
      console.error('Error fetching print batches:', err);
    }
  };

  const generateCard = async (studentId: string, templateId?: string) => {
    try {
      setLoading(true);
      
      // Get default template if none specified
      let selectedTemplateId = templateId;
      if (!selectedTemplateId) {
        const defaultTemplate = templates.find(t => t.is_default);
        if (defaultTemplate) {
          selectedTemplateId = defaultTemplate.id;
        }
      }

      // Generate card number
      const { data: cardNumber, error: numberError } = await supabase
        .rpc('generate_card_number');

      if (numberError) throw numberError;

      // Create QR code data
      const qrCodeData = JSON.stringify({
        student_id: studentId,
        card_number: cardNumber,
        issued: new Date().toISOString()
      });

      // Calculate expiry date (2 years from now)
      const expiryDate = new Date();
      expiryDate.setFullYear(expiryDate.getFullYear() + 2);

      const { data, error } = await supabase
        .from('student_cards')
        .insert({
          student_id: studentId,
          template_id: selectedTemplateId,
          card_number: cardNumber,
          qr_code_data: qrCodeData,
          barcode_data: cardNumber,
          expiry_date: expiryDate.toISOString().split('T')[0],
          status: 'active'
        })
        .select(`
          *,
          students!student_cards_student_id_fkey (
            student_number,
            profiles!students_profile_id_fkey (full_name)
          )
        `)
        .single();

      if (error) throw error;

      toast({
        title: "Carte générée",
        description: `Carte ${cardNumber} créée avec succès`
      });

      await fetchCards();
      return { success: true, card: data };

    } catch (error) {
      console.error('Error generating card:', error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Erreur lors de la génération",
        variant: "destructive"
      });
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const generateCardsForApprovedStudents = async () => {
    try {
      setLoading(true);
      
      // Get approved students without cards
      const { data: studentsData, error: studentsError } = await supabase
        .from('students')
        .select(`
          id,
          student_number,
          profiles!students_profile_id_fkey (full_name)
        `)
        .eq('status', 'active')
        .not('id', 'in', `(${cards.map(c => `'${c.student_id}'`).join(',')})`);

      if (studentsError) throw studentsError;

      if (!studentsData || studentsData.length === 0) {
        toast({
          title: "Aucune carte à générer",
          description: "Tous les étudiants actifs ont déjà une carte"
        });
        return { success: true, generated: 0 };
      }

      let generated = 0;
      for (const student of studentsData) {
        const result = await generateCard(student.id);
        if (result.success) generated++;
      }

      toast({
        title: "Génération terminée",
        description: `${generated} cartes générées avec succès`
      });

      return { success: true, generated };

    } catch (error) {
      console.error('Error generating cards for approved students:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la génération automatique",
        variant: "destructive"
      });
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const createPrintBatch = async (cardIds: string[], batchName: string) => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('student_card_prints')
        .insert({
          batch_name: batchName,
          card_ids: cardIds,
          total_cards: cardIds.length,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      // Mark cards as printed
      const { error: updateError } = await supabase
        .from('student_cards')
        .update({ 
          is_printed: true, 
          printed_at: new Date().toISOString() 
        })
        .in('id', cardIds);

      if (updateError) throw updateError;

      toast({
        title: "Lot d'impression créé",
        description: `${cardIds.length} cartes prêtes pour l'impression`
      });

      await fetchCards();
      await fetchPrintBatches();
      return { success: true, batch: data };

    } catch (error) {
      console.error('Error creating print batch:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la création du lot",
        variant: "destructive"
      });
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const getCardStats = () => {
    const active = cards.filter(c => c.status === 'active').length;
    const pending = cards.filter(c => !c.is_printed).length;
    const expired = cards.filter(c => c.status === 'expired').length;
    const toPrint = cards.filter(c => c.status === 'active' && !c.is_printed).length;

    return { active, pending, expired, toPrint, total: cards.length };
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchCards(),
        fetchTemplates(),
        fetchPrintBatches()
      ]);
      setLoading(false);
    };

    loadData();
  }, []);

  const createTemplate = async (templateData: Partial<CardTemplate>) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('student_card_templates')
        .insert({
          name: templateData.name,
          description: templateData.description,
          template_data: templateData.template_data,
          is_default: templateData.is_default,
          is_active: templateData.is_active
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Template créé",
        description: `Template "${templateData.name}" créé avec succès`
      });

      await fetchTemplates();
      return { success: true, template: data };

    } catch (error) {
      console.error('Error creating template:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la création du template",
        variant: "destructive"
      });
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const updateTemplate = async (templateId: string, templateData: Partial<CardTemplate>) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('student_card_templates')
        .update({
          name: templateData.name,
          description: templateData.description,
          template_data: templateData.template_data,
          is_default: templateData.is_default,
          is_active: templateData.is_active
        })
        .eq('id', templateId)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Template mis à jour",
        description: `Template "${templateData.name}" mis à jour avec succès`
      });

      await fetchTemplates();
      return { success: true, template: data };

    } catch (error) {
      console.error('Error updating template:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la mise à jour du template",
        variant: "destructive"
      });
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  return {
    cards,
    templates,
    printBatches,
    loading,
    error,
    generateCard,
    generateCardsForApprovedStudents,
    createPrintBatch,
    createTemplate,
    updateTemplate,
    getCardStats,
    refetch: () => Promise.all([fetchCards(), fetchTemplates(), fetchPrintBatches()])
  };
}