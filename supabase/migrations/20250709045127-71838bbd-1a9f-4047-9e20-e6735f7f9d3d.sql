-- Enable Row Level Security first
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcement_reads ENABLE ROW LEVEL SECURITY;

-- Add simple policies first for conversations
CREATE POLICY "Users can manage conversations" ON public.conversations FOR ALL USING (auth.role() = 'authenticated');

-- Add simple policies for conversation_participants
CREATE POLICY "Users can manage conversation participants" ON public.conversation_participants FOR ALL USING (auth.role() = 'authenticated');

-- Add simple policies for messages
CREATE POLICY "Users can manage messages" ON public.messages FOR ALL USING (auth.role() = 'authenticated');

-- Add simple policies for message_reactions
CREATE POLICY "Users can manage message reactions" ON public.message_reactions FOR ALL USING (auth.role() = 'authenticated');

-- Add simple policies for announcements
CREATE POLICY "Users can view announcements" ON public.announcements FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can manage announcements" ON public.announcements FOR ALL USING (get_current_user_role() = ANY (ARRAY['admin'::user_role, 'hr'::user_role]));

-- Add simple policies for announcement_reads
CREATE POLICY "Users can manage announcement reads" ON public.announcement_reads FOR ALL USING (auth.role() = 'authenticated');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_conversations_created_by ON public.conversations(created_by);
CREATE INDEX IF NOT EXISTS idx_conversation_participants_conversation_id ON public.conversation_participants(conversation_id);
CREATE INDEX IF NOT EXISTS idx_conversation_participants_user_id ON public.conversation_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at);

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_conversations_updated_at ON public.conversations;
CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON public.conversations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_announcements_updated_at ON public.announcements;
CREATE TRIGGER update_announcements_updated_at BEFORE UPDATE ON public.announcements FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();