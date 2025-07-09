import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  message_type: 'TEXT' | 'AUDIO' | 'FILE' | 'IMAGE';
  created_at: string;
  sender?: { id: string; full_name: string; email: string; avatar_url?: string; };
}

interface Conversation {
  id: string;
  title?: string;
  type: 'DIRECT' | 'GROUP' | 'CHANNEL';
  is_archived?: boolean;
  created_at: string;
  updated_at: string;
  participants?: Array<{ user_id: string; role?: string; }>;
  last_message?: Message;
}

export function useMessages() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [loading, setLoading] = useState(false);

  const fetchConversations = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      // Mock data for now
      setConversations([
        { id: '1', title: 'Équipe pédagogique', type: 'GROUP', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { id: '2', title: 'Support technique', type: 'DIRECT', created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
      ]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const fetchMessages = useCallback(async (conversationId: string) => {
    // Mock data
    setMessages(prev => ({ ...prev, [conversationId]: [] }));
  }, []);

  const sendMessage = useCallback(async (conversationId: string, data: any) => {
    // Mock implementation
    console.log('Sending message:', data);
  }, []);

  const createConversation = useCallback(async (data: { type: string; title?: string; participants: string[]; metadata?: any }) => {
    // Mock implementation
    return 'new-conversation-id';
  }, []);

  const markAsRead = useCallback(async (conversationId: string) => {
    // Mock implementation
  }, []);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  return {
    conversations,
    messages,
    loading,
    fetchConversations,
    fetchMessages,
    sendMessage,
    createConversation,
    markAsRead
  };
}