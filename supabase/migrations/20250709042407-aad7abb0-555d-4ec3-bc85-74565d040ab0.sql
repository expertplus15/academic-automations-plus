-- Drop the problematic policies first
DROP POLICY IF EXISTS "Users can view conversations they participate in" ON public.conversations;
DROP POLICY IF EXISTS "Conversation participants can update conversations" ON public.conversations;
DROP POLICY IF EXISTS "Users can view participants of conversations they're in" ON public.conversation_participants;

-- Create corrected RLS Policies for conversations
CREATE POLICY "Users can view conversations they participate in" ON public.conversations FOR SELECT USING (
  id IN (SELECT conversation_id FROM public.conversation_participants WHERE user_id = auth.uid())
);

CREATE POLICY "Conversation participants can update conversations" ON public.conversations FOR UPDATE USING (
  id IN (SELECT conversation_id FROM public.conversation_participants WHERE user_id = auth.uid())
);

-- Create corrected RLS Policies for conversation_participants
CREATE POLICY "Users can view participants of conversations they're in" ON public.conversation_participants FOR SELECT USING (
  conversation_id IN (SELECT conversation_id FROM public.conversation_participants cp WHERE cp.user_id = auth.uid())
);

-- Also correct the messages and message_reactions policies
DROP POLICY IF EXISTS "Users can view messages from conversations they participate in" ON public.messages;
DROP POLICY IF EXISTS "Users can send messages to conversations they participate in" ON public.messages;
DROP POLICY IF EXISTS "Users can view reactions on accessible messages" ON public.message_reactions;
DROP POLICY IF EXISTS "Users can react to accessible messages" ON public.message_reactions;

CREATE POLICY "Users can view messages from conversations they participate in" ON public.messages FOR SELECT USING (
  conversation_id IN (SELECT conversation_id FROM public.conversation_participants WHERE user_id = auth.uid())
);

CREATE POLICY "Users can send messages to conversations they participate in" ON public.messages FOR INSERT WITH CHECK (
  auth.uid() = sender_id AND
  conversation_id IN (SELECT conversation_id FROM public.conversation_participants WHERE user_id = auth.uid())
);

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