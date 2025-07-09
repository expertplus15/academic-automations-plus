-- Create tables for communication module

-- User presence tracking table
CREATE TABLE public.user_presence (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status VARCHAR NOT NULL DEFAULT 'OFFLINE' CHECK (status IN ('ONLINE', 'AWAY', 'BUSY', 'OFFLINE')),
  last_seen_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_mobile BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- Conversations table
CREATE TABLE public.conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255),
  type VARCHAR NOT NULL DEFAULT 'DIRECT' CHECK (type IN ('DIRECT', 'GROUP', 'CHANNEL')),
  created_by UUID NOT NULL REFERENCES auth.users(id),
  is_archived BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Conversation participants table
CREATE TABLE public.conversation_participants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR NOT NULL DEFAULT 'MEMBER' CHECK (role IN ('ADMIN', 'MODERATOR', 'MEMBER')),
  last_read_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_muted BOOLEAN DEFAULT false,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(conversation_id, user_id)
);

-- Messages table
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id),
  content TEXT NOT NULL,
  message_type VARCHAR DEFAULT 'TEXT' CHECK (message_type IN ('TEXT', 'IMAGE', 'FILE', 'AUDIO', 'VIDEO')),
  reply_to_id UUID REFERENCES public.messages(id),
  is_edited BOOLEAN DEFAULT false,
  is_deleted BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Notifications table
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  notification_type VARCHAR NOT NULL CHECK (notification_type IN ('MESSAGE', 'EVENT', 'SYSTEM', 'REMINDER')),
  reference_id UUID,
  reference_type VARCHAR,
  is_read BOOLEAN DEFAULT false,
  is_sent_email BOOLEAN DEFAULT false,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Announcements table
CREATE TABLE public.announcements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  category VARCHAR NOT NULL,
  priority VARCHAR NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  status VARCHAR NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'scheduled', 'archived')),
  target_audience JSONB DEFAULT '[]', -- Array of roles or specific user IDs
  author_id UUID NOT NULL REFERENCES auth.users(id),
  publish_date TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  is_pinned BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX idx_user_presence_user_id ON public.user_presence(user_id);
CREATE INDEX idx_user_presence_status ON public.user_presence(status);
CREATE INDEX idx_conversations_created_by ON public.conversations(created_by);
CREATE INDEX idx_conversations_updated_at ON public.conversations(updated_at);
CREATE INDEX idx_conversation_participants_conversation_id ON public.conversation_participants(conversation_id);
CREATE INDEX idx_conversation_participants_user_id ON public.conversation_participants(user_id);
CREATE INDEX idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX idx_messages_created_at ON public.messages(created_at);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at);
CREATE INDEX idx_announcements_status ON public.announcements(status);
CREATE INDEX idx_announcements_publish_date ON public.announcements(publish_date);

-- Enable Row Level Security
ALTER TABLE public.user_presence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_presence
CREATE POLICY "Users can view all presence data" 
ON public.user_presence 
FOR SELECT 
USING (true);

CREATE POLICY "Users can update their own presence" 
ON public.user_presence 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own presence" 
ON public.user_presence 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own presence" 
ON public.user_presence 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for conversations
CREATE POLICY "Users can view their conversations" 
ON public.conversations 
FOR SELECT 
USING (
  id IN (
    SELECT conversation_id 
    FROM public.conversation_participants 
    WHERE user_id = auth.uid()
  ) OR created_by = auth.uid()
);

CREATE POLICY "Users can create conversations" 
ON public.conversations 
FOR INSERT 
WITH CHECK (created_by = auth.uid());

CREATE POLICY "Conversation creators can update" 
ON public.conversations 
FOR UPDATE 
USING (created_by = auth.uid() OR get_current_user_role() = 'admin');

-- Create RLS policies for conversation_participants
CREATE POLICY "Users can view participants of their conversations" 
ON public.conversation_participants 
FOR SELECT 
USING (
  conversation_id IN (
    SELECT conversation_id 
    FROM public.conversation_participants 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can add participants to their conversations" 
ON public.conversation_participants 
FOR INSERT 
WITH CHECK (
  conversation_id IN (
    SELECT id 
    FROM public.conversations 
    WHERE created_by = auth.uid()
  ) OR get_current_user_role() = ANY(ARRAY['admin', 'hr'])
);

-- Create RLS policies for messages
CREATE POLICY "Users can view messages in their conversations" 
ON public.messages 
FOR SELECT 
USING (
  conversation_id IN (
    SELECT conversation_id 
    FROM public.conversation_participants 
    WHERE user_id = auth.uid()
  ) AND is_deleted = false
);

CREATE POLICY "Users can send messages to their conversations" 
ON public.messages 
FOR INSERT 
WITH CHECK (
  conversation_id IN (
    SELECT conversation_id 
    FROM public.conversation_participants 
    WHERE user_id = auth.uid()
  ) AND sender_id = auth.uid()
);

CREATE POLICY "Users can update their own messages" 
ON public.messages 
FOR UPDATE 
USING (sender_id = auth.uid());

-- Create RLS policies for notifications
CREATE POLICY "Users can view their own notifications" 
ON public.notifications 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "System can create notifications" 
ON public.notifications 
FOR INSERT 
WITH CHECK (get_current_user_role() = ANY(ARRAY['admin', 'hr', 'teacher']) OR user_id = auth.uid());

CREATE POLICY "Users can update their own notifications" 
ON public.notifications 
FOR UPDATE 
USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own notifications" 
ON public.notifications 
FOR DELETE 
USING (user_id = auth.uid());

-- Create RLS policies for announcements
CREATE POLICY "Everyone can view published announcements" 
ON public.announcements 
FOR SELECT 
USING (
  status = 'published' 
  AND (publish_date IS NULL OR publish_date <= now())
  AND (expires_at IS NULL OR expires_at > now())
);

CREATE POLICY "Staff can manage announcements" 
ON public.announcements 
FOR ALL 
USING (get_current_user_role() = ANY(ARRAY['admin', 'hr']));

-- Create trigger to update updated_at columns
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_conversations_updated_at
    BEFORE UPDATE ON public.conversations
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_presence_updated_at
    BEFORE UPDATE ON public.user_presence
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_announcements_updated_at
    BEFORE UPDATE ON public.announcements
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_messages_updated_at
    BEFORE UPDATE ON public.messages
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();