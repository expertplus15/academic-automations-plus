import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

type ForumPost = {
  id: string;
  forum_id: string;
  parent_post_id?: string | null;
  author_id: string;
  title?: string | null;
  content: string;
  is_pinned: boolean;
  is_locked: boolean;
  upvotes: number;
  downvotes: number;
  created_at: string;
  updated_at: string;
}

export function useForumPosts(forumId?: string) {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (forumId) {
      fetchPosts();
    }
  }, [forumId]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('forum_posts')
        .select(`
          *,
          author:profiles(id, full_name, email),
          votes:forum_votes(vote_type)
        `)
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false });

      if (forumId) {
        query = query.eq('forum_id', forumId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setPosts(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des posts');
      toast({
        title: "Erreur",
        description: "Impossible de charger les posts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (postData: any) => {
    try {
      const { data, error } = await supabase
        .from('forum_posts')
        .insert([postData])
        .select()
        .single();

      if (error) throw error;

      setPosts(prev => [data, ...prev]);
      toast({
        title: "Succès",
        description: "Post créé avec succès",
      });
      
      return data;
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Impossible de créer le post",
        variant: "destructive",
      });
      throw err;
    }
  };

  const updatePost = async (id: string, updates: Partial<ForumPost>) => {
    try {
      const { data, error } = await supabase
        .from('forum_posts')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setPosts(prev => prev.map(post => 
        post.id === id ? { ...post, ...data } : post
      ));
      
      toast({
        title: "Succès",
        description: "Post mis à jour avec succès",
      });
      
      return data;
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le post",
        variant: "destructive",
      });
      throw err;
    }
  };

  const votePost = async (postId: string, voteType: 'upvote' | 'downvote') => {
    try {
      const { data: existingVote } = await supabase
        .from('forum_votes')
        .select('*')
        .eq('post_id', postId)
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (existingVote) {
        if (existingVote.vote_type === voteType) {
          // Remove vote if same type
          await supabase
            .from('forum_votes')
            .delete()
            .eq('id', existingVote.id);
        } else {
          // Update vote type
          await supabase
            .from('forum_votes')
            .update({ vote_type: voteType })
            .eq('id', existingVote.id);
        }
      } else {
        // Create new vote
        await supabase
          .from('forum_votes')
          .insert([{
            post_id: postId,
            user_id: (await supabase.auth.getUser()).data.user?.id,
            vote_type: voteType
          }]);
      }

      // Refresh posts to get updated vote counts
      await fetchPosts();
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Impossible de voter",
        variant: "destructive",
      });
    }
  };

  const deletePost = async (id: string) => {
    try {
      const { error } = await supabase
        .from('forum_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setPosts(prev => prev.filter(post => post.id !== id));
      toast({
        title: "Succès",
        description: "Post supprimé avec succès",
      });
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le post",
        variant: "destructive",
      });
      throw err;
    }
  };

  return {
    posts,
    loading,
    error,
    fetchPosts,
    createPost,
    updatePost,
    votePost,
    deletePost,
  };
}