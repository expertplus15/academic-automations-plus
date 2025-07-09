-- Enable Row Level Security
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcement_reads ENABLE ROW LEVEL SECURITY;

-- RLS Policies for conversations
DROP POLICY IF EXISTS "Users can view conversations they participate in" ON public.conversations;
DROP POLICY IF EXISTS "Users can create conversations" ON public.conversations;
DROP POLICY IF EXISTS "Conversation participants can update conversations" ON public.conversations;

CREATE POLICY "Users can view conversations they participate in" ON public.conversations FOR SELECT USING (
  id IN (SELECT conversation_id FROM public.conversation_participants WHERE user_id = auth.uid())
);
CREATE POLICY "Users can create conversations" ON public.conversations FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Conversation participants can update conversations" ON public.conversations FOR UPDATE USING (
  id IN (SELECT conversation_id FROM public.conversation_participants WHERE user_id = auth.uid())
);

-- RLS Policies for conversation_participants
DROP POLICY IF EXISTS "Users can view participants of conversations they're in" ON public.conversation_participants;
DROP POLICY IF EXISTS "Users can join conversations" ON public.conversation_participants;
DROP POLICY IF EXISTS "Users can update their own participation" ON public.conversation_participants;

CREATE POLICY "Users can view participants of conversations they're in" ON public.conversation_participants FOR SELECT USING (
  conversation_id IN (SELECT conversation_id FROM public.conversation_participants cp WHERE cp.user_id = auth.uid())
);
CREATE POLICY "Users can join conversations" ON public.conversation_participants FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own participation" ON public.conversation_participants FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for messages
DROP POLICY IF EXISTS "Users can view messages from conversations they participate in" ON public.messages;
DROP POLICY IF EXISTS "Users can send messages to conversations they participate in" ON public.messages;
DROP POLICY IF EXISTS "Users can update their own messages" ON public.messages;

CREATE POLICY "Users can view messages from conversations they participate in" ON public.messages FOR SELECT USING (
  conversation_id IN (SELECT conversation_id FROM public.conversation_participants WHERE user_id = auth.uid())
);
CREATE POLICY "Users can send messages to conversations they participate in" ON public.messages FOR INSERT WITH CHECK (
  auth.uid() = sender_id AND
  conversation_id IN (SELECT conversation_id FROM public.conversation_participants WHERE user_id = auth.uid())
);
CREATE POLICY "Users can update their own messages" ON public.messages FOR UPDATE USING (auth.uid() = sender_id);

-- RLS Policies for message_reactions
DROP POLICY IF EXISTS "Users can view reactions on accessible messages" ON public.message_reactions;
DROP POLICY IF EXISTS "Users can react to accessible messages" ON public.message_reactions;
DROP POLICY IF EXISTS "Users can manage their own reactions" ON public.message_reactions;

CREATE POLICY "Users can view reactions on accessible messages" ON public.message_reactions FOR SELECT USING (
  message_id IN (
    SELECT m.id FROM public.messages m 
    WHERE m.conversation_id IN (
      SELECT conversation_id FROM public.conversation_participants WHERE user_id = auth.uid()
    )
  )
);
CREATE POLICY "Users can react to accessible messages" ON public.message_reactions FOR INSERT WITH CHECK (
  auth.uid() = user_id AND
  message_id IN (
    SELECT m.id FROM public.messages m 
    WHERE m.conversation_id IN (
      SELECT conversation_id FROM public.conversation_participants WHERE user_id = auth.uid()
    )
  )
);
CREATE POLICY "Users can manage their own reactions" ON public.message_reactions FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for announcements
DROP POLICY IF EXISTS "Users can view published announcements" ON public.announcements;
DROP POLICY IF EXISTS "Admins can manage announcements" ON public.announcements;

CREATE POLICY "Users can view published announcements" ON public.announcements FOR SELECT USING (
  is_published = TRUE AND 
  (target_audience IS NULL OR auth.uid()::text = ANY(target_audience) OR 'all' = ANY(target_audience))
);
CREATE POLICY "Admins can manage announcements" ON public.announcements FOR ALL USING (get_current_user_role() = ANY (ARRAY['admin'::user_role, 'hr'::user_role]));

-- RLS Policies for announcement_reads
DROP POLICY IF EXISTS "Users can view their own announcement reads" ON public.announcement_reads;
DROP POLICY IF EXISTS "Users can mark announcements as read" ON public.announcement_reads;
DROP POLICY IF EXISTS "Users can update their own reads" ON public.announcement_reads;

CREATE POLICY "Users can view their own announcement reads" ON public.announcement_reads FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can mark announcements as read" ON public.announcement_reads FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own reads" ON public.announcement_reads FOR UPDATE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_conversations_created_by ON public.conversations(created_by);
CREATE INDEX IF NOT EXISTS idx_conversation_participants_conversation_id ON public.conversation_participants(conversation_id);
CREATE INDEX IF NOT EXISTS idx_conversation_participants_user_id ON public.conversation_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at);
CREATE INDEX IF NOT EXISTS idx_announcements_published ON public.announcements(is_published);
CREATE INDEX IF NOT EXISTS idx_announcements_target_audience ON public.announcements USING GIN(target_audience);

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_conversations_updated_at ON public.conversations;
CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON public.conversations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_announcements_updated_at ON public.announcements;
CREATE TRIGGER update_announcements_updated_at BEFORE UPDATE ON public.announcements FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();