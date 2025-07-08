import { useState, useCallback } from 'react';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Partner schemas
export const partnerSchema = z.object({
  name: z.string().min(2, 'Nom requis (min 2 caractères)'),
  email: z.string().email('Email invalide').optional(),
  phone: z.string().optional(),
  company: z.string().min(2, 'Entreprise requise'),
  sector: z.string().min(2, 'Secteur requis'),
  type: z.enum(['STAGE', 'EMPLOI', 'PARTENARIAT', 'FOURNISSEUR']),
  status: z.enum(['ACTIF', 'INACTIF', 'PROSPECT', 'CLIENT']).default('ACTIF'),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    postal_code: z.string().optional(),
    country: z.string().optional()
  }).optional(),
  contact_person: z.object({
    name: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    position: z.string().optional()
  }).optional(),
  notes: z.string().optional(),
  metadata: z.record(z.any()).optional()
});

export const interactionSchema = z.object({
  type: z.enum(['EMAIL', 'CALL', 'MEETING', 'NOTE']),
  subject: z.string().min(1, 'Sujet requis').max(255, 'Sujet trop long'),
  content: z.string().min(1, 'Contenu requis'),
  interaction_date: z.date().optional(),
  metadata: z.record(z.any()).optional()
});

interface Partner {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  company: string;
  sector: string;
  type: string;
  status: string;
  address?: any;
  contact_person?: any;
  created_by: string;
  created_at: string;
  updated_at: string;
  notes?: string | null;
  metadata?: any;
}

interface PartnerInteraction {
  id: string;
  partner_id: string;
  user_id: string;
  type: string;
  subject: string;
  content: string;
  interaction_date: string;
  metadata?: any;
  created_at: string;
  user?: {
    full_name: string;
    email: string;
  };
}

export function usePartners() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [interactions, setInteractions] = useState<Record<string, PartnerInteraction[]>>({});
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Fetch partners
  const fetchPartners = useCallback(async (filters?: { 
    type?: string; 
    status?: string; 
    sector?: string; 
  }) => {
    try {
      setLoading(true);
      let query = supabase
        .from('partners')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters?.type) {
        query = query.eq('type', filters.type);
      }
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.sector) {
        query = query.eq('sector', filters.sector);
      }

      const { data, error } = await query;

      if (error) throw error;
      setPartners(data || []);
    } catch (error) {
      console.error('Error fetching partners:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les partenaires',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Create partner
  const createPartner = useCallback(async (data: z.infer<typeof partnerSchema>) => {
    try {
      const validatedData = partnerSchema.parse(data);
      
      const { data: partner, error } = await supabase
        .from('partners')
        .insert({
          name: validatedData.name,
          email: validatedData.email,
          phone: validatedData.phone,
          company: validatedData.company,
          sector: validatedData.sector,
          type: validatedData.type,
          status: validatedData.status,
          address: validatedData.address,
          contact_person: validatedData.contact_person,
          notes: validatedData.notes,
          metadata: validatedData.metadata || {}
        })
        .select()
        .single();

      if (error) throw error;

      setPartners(prev => [partner, ...prev]);

      toast({
        title: 'Partenaire créé',
        description: 'Le partenaire a été ajouté avec succès'
      });

      return partner;
    } catch (error) {
      console.error('Error creating partner:', error);
      toast({
        title: 'Erreur',
        description: error instanceof z.ZodError 
          ? error.errors[0].message 
          : 'Impossible de créer le partenaire',
        variant: 'destructive'
      });
      throw error;
    }
  }, [toast]);

  // Update partner
  const updatePartner = useCallback(async (id: string, data: Partial<z.infer<typeof partnerSchema>>) => {
    try {
      const { data: partner, error } = await supabase
        .from('partners')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setPartners(prev => 
        prev.map(p => p.id === id ? partner : p)
      );

      toast({
        title: 'Partenaire mis à jour',
        description: 'Les informations ont été mises à jour'
      });

      return partner;
    } catch (error) {
      console.error('Error updating partner:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour le partenaire',
        variant: 'destructive'
      });
      throw error;
    }
  }, [toast]);

  // Delete partner
  const deletePartner = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('partners')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setPartners(prev => prev.filter(p => p.id !== id));

      toast({
        title: 'Partenaire supprimé',
        description: 'Le partenaire a été supprimé avec succès'
      });
    } catch (error) {
      console.error('Error deleting partner:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer le partenaire',
        variant: 'destructive'
      });
      throw error;
    }
  }, [toast]);

  // Fetch interactions for a partner
  const fetchInteractions = useCallback(async (partnerId: string) => {
    try {
      const { data, error } = await supabase
        .from('partner_interactions')
        .select(`
          *,
          profiles (full_name, email)
        `)
        .eq('partner_id', partnerId)
        .order('interaction_date', { ascending: false });

      if (error) throw error;

      setInteractions(prev => ({
        ...prev,
        [partnerId]: data || []
      }));
    } catch (error) {
      console.error('Error fetching interactions:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les interactions',
        variant: 'destructive'
      });
    }
  }, [toast]);

  // Create interaction
  const createInteraction = useCallback(async (
    partnerId: string, 
    data: z.infer<typeof interactionSchema>
  ) => {
    try {
      const validatedData = interactionSchema.parse(data);
      
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      const { data: interaction, error } = await supabase
        .from('partner_interactions')
        .insert({
          partner_id: partnerId,
          user_id: user.user.id,
          type: validatedData.type,
          subject: validatedData.subject,
          content: validatedData.content,
          interaction_date: validatedData.interaction_date?.toISOString() || new Date().toISOString(),
          metadata: validatedData.metadata || {}
        })
        .select(`
          *,
          profiles (full_name, email)
        `)
        .single();

      if (error) throw error;

      setInteractions(prev => ({
        ...prev,
        [partnerId]: [interaction, ...(prev[partnerId] || [])]
      }));

      toast({
        title: 'Interaction enregistrée',
        description: 'L\'interaction a été ajoutée avec succès'
      });

      return interaction;
    } catch (error) {
      console.error('Error creating interaction:', error);
      toast({
        title: 'Erreur',
        description: error instanceof z.ZodError 
          ? error.errors[0].message 
          : 'Impossible de créer l\'interaction',
        variant: 'destructive'
      });
      throw error;
    }
  }, [toast]);

  // Get partner statistics
  const getPartnerStats = useCallback(() => {
    const stats = partners.reduce((acc, partner) => {
      acc.total++;
      acc.byType[partner.type] = (acc.byType[partner.type] || 0) + 1;
      acc.byStatus[partner.status] = (acc.byStatus[partner.status] || 0) + 1;
      acc.bySector[partner.sector] = (acc.bySector[partner.sector] || 0) + 1;
      return acc;
    }, {
      total: 0,
      byType: {} as Record<string, number>,
      byStatus: {} as Record<string, number>,
      bySector: {} as Record<string, number>
    });

    return stats;
  }, [partners]);

  return {
    partners,
    interactions,
    loading,
    fetchPartners,
    createPartner,
    updatePartner,
    deletePartner,
    fetchInteractions,
    createInteraction,
    getPartnerStats
  };
}