import { useState, useEffect, useCallback } from 'react';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Zod schemas for validation
export const messageSchema = z.object({
  content: z.string().min(1, 'Message ne peut pas être vide').max(1000, 'Message trop long'),
  message_type: z.enum(['TEXT', 'IMAGE', 'FILE', 'AUDIO', 'VIDEO']).default('TEXT'),
  reply_to_id: z.string().uuid().optional(),
  metadata: z.record(z.any()).optional()
});

export const conversationSchema = z.object({
  title: z.string().min(1, 'Titre requis').max(255, 'Titre trop long').optional(),
  type: z.enum(['DIRECT', 'GROUP', 'CHANNEL']).default('DIRECT'),
  participants: z.array(z.string().uuid()).min(1, 'Au moins un participant requis'),
  metadata: z.record(z.any()).optional()
});

interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  message_type: string | null;
  reply_to_id?: string | null;
  metadata?: any;
  created_at: string | null;
  updated_at: string | null;
  is_edited: boolean | null;
  is_deleted: boolean | null;
  sender?: {
    full_name: string;
    email: string;
  };
}

interface Conversation {
  id: string;
  title?: string | null;
  type: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  is_archived: boolean | null;
  metadata?: any;
  participants?: Array<{
    user_id: string;
    role: string;
    last_read_at: string;
    is_muted: boolean;
  }>;
  last_message?: Message;
}

export function useMessages() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [loading, setLoading] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const { toast } = useToast();

  // Fetch conversations
  const fetchConversations = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          conversation_participants (
            user_id,
            role,
            last_read_at,
            is_muted,
            profiles (full_name, email)
          )
        `)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setConversations(data || []);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les conversations',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Fetch messages for a conversation
  const fetchMessages = useCallback(async (conversationId: string) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:profiles (full_name, email)
        `)
        .eq('conversation_id', conversationId)
        .eq('is_deleted', false)
        .order('created_at', { ascending: true });

      if (error) throw error;
      
      setMessages(prev => ({
        ...prev,
        [conversationId]: data || []
      }));
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les messages',
        variant: 'destructive'
      });
    }
  }, [toast]);

  // Create new conversation
  const createConversation = useCallback(async (data: z.infer<typeof conversationSchema>) => {
    try {
      const validatedData = conversationSchema.parse(data);
      
      const { data: conversation, error } = await supabase
        .from('conversations')
        .insert({
          title: validatedData.title,
          type: validatedData.type,
          metadata: validatedData.metadata || {}
        })
        .select()
        .single();

      if (error) throw error;

      // Add participants
      const participantData = validatedData.participants.map(userId => ({
        conversation_id: conversation.id,
        user_id: userId,
        role: 'MEMBER'
      }));

      const { error: participantError } = await supabase
        .from('conversation_participants')
        .insert(participantData);

      if (participantError) throw participantError;

      await fetchConversations();
      
      toast({
        title: 'Succès',
        description: 'Conversation créée avec succès'
      });

      return conversation;
    } catch (error) {
      console.error('Error creating conversation:', error);
      toast({
        title: 'Erreur',
        description: error instanceof z.ZodError 
          ? error.errors[0].message 
          : 'Impossible de créer la conversation',
        variant: 'destructive'
      });
      throw error;
    }
  }, [fetchConversations, toast]);

  // Send message
  const sendMessage = useCallback(async (conversationId: string, data: z.infer<typeof messageSchema>) => {
    try {
      const validatedData = messageSchema.parse(data);
      
      // Get current user
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');
      
      const { data: message, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: user.user.id,
          content: validatedData.content,
          message_type: validatedData.message_type,
          reply_to_id: validatedData.reply_to_id,
          metadata: validatedData.metadata || {}
        })
        .select(`
          *,
          sender:profiles (full_name, email)
        `)
        .single();

      if (error) throw error;

      // Update conversation timestamp
      await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversationId);

      // Update local state
      setMessages(prev => ({
        ...prev,
        [conversationId]: [...(prev[conversationId] || []), message]
      }));

      toast({
        title: 'Message envoyé',
        description: 'Votre message a été envoyé avec succès'
      });

      return message;
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Erreur',
        description: error instanceof z.ZodError 
          ? error.errors[0].message 
          : 'Impossible d\'envoyer le message',
        variant: 'destructive'
      });
      throw error;
    }
  }, [toast]);

  // Mark messages as read
  const markAsRead = useCallback(async (conversationId: string) => {
    try {
      const { error } = await supabase
        .from('conversation_participants')
        .update({ last_read_at: new Date().toISOString() })
        .eq('conversation_id', conversationId)
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id);

      if (error) throw error;
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  }, []);

  // Set up real-time subscriptions
  useEffect(() => {
    const messagesSubscription = supabase
      .channel('messages')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          const newMessage = payload.new as Message;
          setMessages(prev => ({
            ...prev,
            [newMessage.conversation_id]: [
              ...(prev[newMessage.conversation_id] || []),
              newMessage
            ]
          }));
        }
      )
      .subscribe();

    const conversationsSubscription = supabase
      .channel('conversations')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'conversations' },
        () => {
          fetchConversations();
        }
      )
      .subscribe();

    return () => {
      messagesSubscription.unsubscribe();
      conversationsSubscription.unsubscribe();
    };
  }, [fetchConversations]);

  // Initialize
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  return {
    conversations,
    messages,
    loading,
    onlineUsers,
    fetchConversations,
    fetchMessages,
    createConversation,
    sendMessage,
    markAsRead
  };
}