import { useState, useEffect, useCallback } from 'react';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Announcement schema for validation
export const announcementSchema = z.object({
  title: z.string().min(1, 'Titre requis').max(255, 'Titre trop long'),
  content: z.string().min(1, 'Contenu requis'),
  category: z.string().min(1, 'Catégorie requise'),
  priority: z.enum(['low', 'normal', 'high', 'urgent']).default('normal'),
  target_audience: z.array(z.string()).default([]),
  publication_date: z.date().optional(),
  expiration_date: z.date().optional(),
  acknowledgment_required: z.boolean().default(false),
  distribution_channels: z.array(z.string()).default(['internal'])
});

interface Announcement {
  id: string;
  title: string;
  content: string;
  category: string;
  priority: string;
  status: string;
  target_audience: any;
  author_id: string;
  publication_date: string | null;
  expiration_date: string | null;
  acknowledgment_required: boolean | null;
  distribution_channels: any;
  view_count: number | null;
  metadata: any;
  created_at: string;
  updated_at: string;
  author?: {
    full_name: string;
    email: string;
  };
}

export function useAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Fetch announcements
  const fetchAnnouncements = useCallback(async (status?: string) => {
    try {
      setLoading(true);
      let query = supabase
        .from('announcements')
        .select(`
          *,
          author:profiles (full_name, email)
        `)
        .order('created_at', { ascending: false });

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;

      if (error) throw error;
      setAnnouncements(data || []);
    } catch (error) {
      console.error('Error fetching announcements:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les annonces',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Create announcement
  const createAnnouncement = useCallback(async (data: z.infer<typeof announcementSchema>) => {
    try {
      const validatedData = announcementSchema.parse(data);
      
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      const { data: announcement, error } = await supabase
        .from('announcements')
        .insert({
          title: validatedData.title,
          content: validatedData.content,
          category: validatedData.category,
          priority: validatedData.priority,
          target_audience: validatedData.target_audience,
          author_id: user.user.id,
          publication_date: validatedData.publication_date?.toISOString(),
          expiration_date: validatedData.expiration_date?.toISOString(),
          acknowledgment_required: validatedData.acknowledgment_required,
          distribution_channels: validatedData.distribution_channels,
          status: validatedData.publication_date ? 'SCHEDULED' : 'DRAFT'
        })
        .select(`
          *,
          author:profiles (full_name, email)
        `)
        .single();

      if (error) throw error;

      // Add to local state
      setAnnouncements(prev => [announcement, ...prev]);

      toast({
        title: 'Annonce créée',
        description: 'L\'annonce a été créée avec succès'
      });

      return announcement;
    } catch (error) {
      console.error('Error creating announcement:', error);
      toast({
        title: 'Erreur',
        description: error instanceof z.ZodError 
          ? error.errors[0].message 
          : 'Impossible de créer l\'annonce',
        variant: 'destructive'
      });
      throw error;
    }
  }, [toast]);

  // Update announcement
  const updateAnnouncement = useCallback(async (
    id: string, 
    data: Partial<z.infer<typeof announcementSchema>>
  ) => {
    try {
      const { data: announcement, error } = await supabase
        .from('announcements')
        .update({
          ...data,
          publication_date: data.publication_date?.toISOString(),
          expiration_date: data.expiration_date?.toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select(`
          *,
          author:profiles (full_name, email)
        `)
        .single();

      if (error) throw error;

      // Update local state
      setAnnouncements(prev => 
        prev.map(ann => ann.id === id ? announcement : ann)
      );

      toast({
        title: 'Annonce mise à jour',
        description: 'L\'annonce a été mise à jour avec succès'
      });

      return announcement;
    } catch (error) {
      console.error('Error updating announcement:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour l\'annonce',
        variant: 'destructive'
      });
      throw error;
    }
  }, [toast]);

  // Publish announcement
  const publishAnnouncement = useCallback(async (id: string) => {
    try {
      const { data: announcement, error } = await supabase
        .from('announcements')
        .update({
          status: 'PUBLISHED',
          publication_date: new Date().toISOString()
        })
        .eq('id', id)
        .select(`
          *,
          author:profiles (full_name, email)
        `)
        .single();

      if (error) throw error;

      // Update local state
      setAnnouncements(prev => 
        prev.map(ann => ann.id === id ? announcement : ann)
      );

      toast({
        title: 'Annonce publiée',
        description: 'L\'annonce a été publiée avec succès'
      });

      return announcement;
    } catch (error) {
      console.error('Error publishing announcement:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de publier l\'annonce',
        variant: 'destructive'
      });
      throw error;
    }
  }, [toast]);

  // Delete announcement
  const deleteAnnouncement = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('announcements')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Remove from local state
      setAnnouncements(prev => prev.filter(ann => ann.id !== id));

      toast({
        title: 'Annonce supprimée',
        description: 'L\'annonce a été supprimée avec succès'
      });
    } catch (error) {
      console.error('Error deleting announcement:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer l\'annonce',
        variant: 'destructive'
      });
      throw error;
    }
  }, [toast]);

  // Get published announcements for current user
  const getPublishedAnnouncements = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .select(`
          *,
          author:profiles (full_name, email)
        `)
        .eq('status', 'PUBLISHED')
        .lte('publication_date', new Date().toISOString())
        .or('expiration_date.is.null,expiration_date.gt.' + new Date().toISOString())
        .order('publication_date', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching published announcements:', error);
      return [];
    }
  }, []);

  // Set up real-time subscriptions
  useEffect(() => {
    const announcementsSubscription = supabase
      .channel('announcements')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'announcements' },
        () => {
          fetchAnnouncements();
        }
      )
      .subscribe();

    return () => {
      announcementsSubscription.unsubscribe();
    };
  }, [fetchAnnouncements]);

  // Initialize
  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  return {
    announcements,
    loading,
    fetchAnnouncements,
    createAnnouncement,
    updateAnnouncement,
    publishAnnouncement,
    deleteAnnouncement,
    getPublishedAnnouncements
  };
}