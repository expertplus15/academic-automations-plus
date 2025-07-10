import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';
import { toast } from 'sonner';

// Types for communication entities
export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  message_type: string;
  metadata?: any;
  reply_to_id?: string;
  is_edited?: boolean;
  is_deleted?: boolean;
  created_at: string;
  updated_at: string;
  sender?: {
    full_name: string;
    avatar_url?: string;
  };
}

export interface Conversation {
  id: string;
  title?: string;
  type: string;
  is_archived: boolean;
  metadata?: any;
  created_at: string;
  updated_at: string;
  participants?: ConversationParticipant[];
  last_message?: Message;
  unread_count?: number;
}

export interface ConversationParticipant {
  id: string;
  conversation_id: string;
  user_id: string;
  role?: string;
  is_muted: boolean;
  joined_at?: string;
  last_read_at?: string;
  user?: {
    full_name: string;
    avatar_url?: string;
    email: string;
  };
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  notification_type: string;
  reference_id?: string;
  reference_type?: string;
  is_read: boolean;
  is_sent_email: boolean;
  expires_at?: string;
  created_at: string;
}

export interface Contact {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
  role: string;
  phone?: string;
  is_favorite?: boolean;
}

// Conversations hooks
export const useConversations = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: conversations, isLoading, error } = useQuery({
    queryKey: ['conversations', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          participants:conversation_participants(
            *,
            user:profiles(full_name, avatar_url, email)
          )
        `)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      // Process conversations to add last_message and unread_count
      const processedConversations = await Promise.all(
        (data || []).map(async (conversation) => {
          // Get last message
          const { data: lastMessage } = await supabase
            .from('messages')
            .select(`
              id,
              content,
              created_at,
              sender:profiles(full_name, avatar_url)
            `)
            .eq('conversation_id', conversation.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          // Get unread count for current user
          const { count: unreadCount } = await supabase
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .eq('conversation_id', conversation.id)
            .gt('created_at', 
              conversation.participants?.find(p => p.user_id === user.id)?.last_read_at || '1970-01-01'
            );

          return {
            ...conversation,
            last_message: lastMessage || null,
            unread_count: unreadCount || 0,
          };
        })
      );

      return processedConversations;
    },
    enabled: !!user?.id,
  });

  // Real-time subscription
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel('conversations-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations',
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['conversations'] });
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversation_participants',
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['conversations'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, queryClient]);

  return { conversations, isLoading, error };
};

export const useMessages = (conversationId?: string) => {
  const queryClient = useQueryClient();

  const { data: messages, isLoading, error } = useQuery({
    queryKey: ['messages', conversationId],
    queryFn: async () => {
      if (!conversationId) return [];

      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:profiles(full_name, avatar_url)
        `)
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];
    },
    enabled: !!conversationId,
  });

  // Real-time subscription for messages
  useEffect(() => {
    if (!conversationId) return;

    const channel = supabase
      .channel(`messages-${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['messages', conversationId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, queryClient]);

  return { messages, isLoading, error };
};

export const useSendMessage = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ conversationId, content, replyToId }: {
      conversationId: string;
      content: string;
      replyToId?: string;
    }) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: user.id,
          content,
          reply_to_id: replyToId,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['messages', data.conversation_id] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
};

export const useCreateConversation = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ participantIds, title, type = 'direct' }: {
      participantIds: string[];
      title?: string;
      type?: string;
    }) => {
      if (!user?.id) throw new Error('User not authenticated');

      // Create conversation
      const { data: conversation, error: convError } = await supabase
        .from('conversations')
        .insert({
          title,
          type,
          created_by: user.id,
        })
        .select()
        .single();

      if (convError) throw convError;

      // Add participants including creator
      const allParticipants = [user.id, ...participantIds];
      const participants = allParticipants.map(userId => ({
        conversation_id: conversation.id,
        user_id: userId,
      }));

      const { error: participantError } = await supabase
        .from('conversation_participants')
        .insert(participants);

      if (participantError) throw participantError;

      return conversation;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      toast.success('Conversation créée avec succès');
    },
  });
};

// Notifications hooks
export const useNotifications = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: notifications, isLoading, error } = useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });

  // Real-time subscription
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel('notifications-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['notifications'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, queryClient]);

  return { notifications, isLoading, error };
};

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

export const useMarkAllNotificationsAsRead = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user.id)
        .eq('is_read', false);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success('Toutes les notifications marquées comme lues');
    },
  });
};

// Contacts hooks
export const useContacts = () => {
  const { user } = useAuth();

  const { data: contacts, isLoading, error } = useQuery({
    queryKey: ['contacts', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          full_name,
          email,
          avatar_url,
          role,
          phone
        `)
        .neq('id', user.id)
        .order('full_name');

      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });

  return { contacts, isLoading, error };
};

export const useToggleFavoriteContact = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (contactId: string) => {
      if (!user?.id) throw new Error('User not authenticated');

      // Check if already favorite
      const { data: existing } = await supabase
        .from('contact_favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('contact_id', contactId)
        .single();

      if (existing) {
        // Remove from favorites
        const { error } = await supabase
          .from('contact_favorites')
          .delete()
          .eq('id', existing.id);
        if (error) throw error;
      } else {
        // Add to favorites
        const { error } = await supabase
          .from('contact_favorites')
          .insert({
            user_id: user.id,
            contact_id: contactId,
          });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
  });
};

// Announcements hooks
export const useAnnouncements = () => {
  const { data: announcements, isLoading, error } = useQuery({
    queryKey: ['announcements'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('announcements')
        .select(`
          *,
          author:profiles(full_name, avatar_url)
        `)
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  return { announcements, isLoading, error };
};

export const useCreateAnnouncement = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (announcement: {
      title: string;
      content: string;
      category: string;
      priority?: string;
      target_audience: any;
      distribution_channels: any;
      acknowledgment_required?: boolean;
      expiration_date?: string;
    }) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('announcements')
        .insert({
          ...announcement,
          author_id: user.id,
          status: 'published',
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
      toast.success('Annonce créée avec succès');
    },
  });
};