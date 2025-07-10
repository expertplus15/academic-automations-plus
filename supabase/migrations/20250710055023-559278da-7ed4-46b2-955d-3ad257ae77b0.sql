-- Create messages table for conversations
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  message_type VARCHAR(50) DEFAULT 'text',
  metadata JSONB DEFAULT '{}',
  reply_to_id UUID REFERENCES public.messages(id) ON DELETE SET NULL,
  edited_at TIMESTAMP WITH TIME ZONE,
  deleted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) NOT NULL DEFAULT 'info',
  category VARCHAR(50) DEFAULT 'general',
  related_id UUID,
  related_type VARCHAR(50),
  is_read BOOLEAN DEFAULT false,
  is_archived BOOLEAN DEFAULT false,
  priority VARCHAR(20) DEFAULT 'normal',
  metadata JSONB DEFAULT '{}',
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create contact_favorites table for directory
CREATE TABLE public.contact_favorites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  contact_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, contact_id)
);

-- Create message_status table for read receipts
CREATE TABLE public.message_status (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id UUID NOT NULL REFERENCES public.messages(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'delivered',
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(message_id, user_id)
);

-- Enable RLS on all new tables
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_status ENABLE ROW LEVEL SECURITY;

-- RLS Policies for messages
CREATE POLICY "Users can view messages in their conversations" 
ON public.messages FOR SELECT 
USING (
  conversation_id IN (
    SELECT cp.conversation_id 
    FROM public.conversation_participants cp 
    WHERE cp.user_id = auth.uid()
  )
);

CREATE POLICY "Users can send messages to their conversations" 
ON public.messages FOR INSERT 
WITH CHECK (
  sender_id = auth.uid() AND
  conversation_id IN (
    SELECT cp.conversation_id 
    FROM public.conversation_participants cp 
    WHERE cp.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update their own messages" 
ON public.messages FOR UPDATE 
USING (sender_id = auth.uid());

-- RLS Policies for notifications
CREATE POLICY "Users can view their own notifications" 
ON public.notifications FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications" 
ON public.notifications FOR UPDATE 
USING (user_id = auth.uid());

CREATE POLICY "System can create notifications" 
ON public.notifications FOR INSERT 
WITH CHECK (true);

-- RLS Policies for contact_favorites
CREATE POLICY "Users can manage their own favorites" 
ON public.contact_favorites FOR ALL 
USING (user_id = auth.uid());

-- RLS Policies for message_status
CREATE POLICY "Users can view message status for their conversations" 
ON public.message_status FOR SELECT 
USING (
  message_id IN (
    SELECT m.id FROM public.messages m
    JOIN public.conversation_participants cp ON cp.conversation_id = m.conversation_id
    WHERE cp.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update their own message status" 
ON public.message_status FOR ALL 
USING (user_id = auth.uid());

-- Create indexes for performance
CREATE INDEX idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX idx_messages_created_at ON public.messages(created_at DESC);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at DESC);
CREATE INDEX idx_message_status_message_id ON public.message_status(message_id);
CREATE INDEX idx_contact_favorites_user_id ON public.contact_favorites(user_id);

-- Create triggers for updated_at
CREATE TRIGGER update_messages_updated_at
  BEFORE UPDATE ON public.messages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_trigger();

CREATE TRIGGER update_notifications_updated_at
  BEFORE UPDATE ON public.notifications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_trigger();

-- Enable realtime for all communication tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.conversation_participants;
ALTER PUBLICATION supabase_realtime ADD TABLE public.message_status;