-- Create partners table for CRM functionality
CREATE TABLE public.partners (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR NOT NULL,
  email VARCHAR,
  phone VARCHAR,
  company VARCHAR NOT NULL,
  sector VARCHAR NOT NULL,
  type VARCHAR NOT NULL CHECK (type IN ('STAGE', 'EMPLOI', 'PARTENARIAT', 'FOURNISSEUR')),
  status VARCHAR NOT NULL DEFAULT 'ACTIF' CHECK (status IN ('ACTIF', 'INACTIF', 'PROSPECT', 'CLIENT')),
  address JSONB DEFAULT '{}',
  contact_person JSONB DEFAULT '{}',
  notes TEXT,
  metadata JSONB DEFAULT '{}',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create partner_interactions table for tracking communications
CREATE TABLE public.partner_interactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  partner_id UUID NOT NULL REFERENCES public.partners(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  type VARCHAR NOT NULL CHECK (type IN ('EMAIL', 'CALL', 'MEETING', 'NOTE')),
  subject VARCHAR NOT NULL,
  content TEXT NOT NULL,
  interaction_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create conversations table for messaging
CREATE TABLE public.conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type VARCHAR NOT NULL DEFAULT 'DIRECT' CHECK (type IN ('DIRECT', 'GROUP')),
  title VARCHAR,
  description TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_archived BOOLEAN DEFAULT FALSE,
  metadata JSONB DEFAULT '{}'
);

-- Create conversation_participants table
CREATE TABLE public.conversation_participants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  left_at TIMESTAMP WITH TIME ZONE,
  role VARCHAR DEFAULT 'member' CHECK (role IN ('admin', 'member')),
  last_read_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT TRUE
);

-- Create messages table
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id),
  parent_message_id UUID REFERENCES public.messages(id),
  content TEXT NOT NULL,
  message_type VARCHAR DEFAULT 'TEXT' CHECK (message_type IN ('TEXT', 'IMAGE', 'FILE', 'AUDIO', 'VIDEO')),
  file_url TEXT,
  file_name TEXT,
  file_size INTEGER,
  metadata JSONB DEFAULT '{}',
  edited_at TIMESTAMP WITH TIME ZONE,
  deleted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create message_reactions table
CREATE TABLE public.message_reactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id UUID NOT NULL REFERENCES public.messages(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  reaction VARCHAR NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(message_id, user_id, reaction)
);

-- Create announcements table
CREATE TABLE public.announcements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR NOT NULL,
  content TEXT NOT NULL,
  category VARCHAR NOT NULL,
  priority VARCHAR NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  target_audience TEXT[] NOT NULL,
  publication_date TIMESTAMP WITH TIME ZONE,
  expiration_date TIMESTAMP WITH TIME ZONE,
  acknowledgment_required BOOLEAN DEFAULT FALSE,
  distribution_channels TEXT[] DEFAULT ARRAY['web'],
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_published BOOLEAN DEFAULT FALSE
);

-- Create announcement_reads table for tracking who read announcements
CREATE TABLE public.announcement_reads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  announcement_id UUID NOT NULL REFERENCES public.announcements(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  read_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  acknowledged_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(announcement_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcement_reads ENABLE ROW LEVEL SECURITY;

-- RLS Policies for partners
CREATE POLICY "Users can view partners" ON public.partners FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can manage partners" ON public.partners FOR ALL USING (get_current_user_role() = ANY (ARRAY['admin'::user_role, 'hr'::user_role]));

-- RLS Policies for partner_interactions
CREATE POLICY "Users can view partner interactions" ON public.partner_interactions FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can create interactions" ON public.partner_interactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can manage interactions" ON public.partner_interactions FOR ALL USING (get_current_user_role() = ANY (ARRAY['admin'::user_role, 'hr'::user_role]));

-- RLS Policies for conversations
CREATE POLICY "Users can view conversations they participate in" ON public.conversations FOR SELECT USING (
  id IN (SELECT conversation_id FROM public.conversation_participants WHERE user_id = auth.uid() AND is_active = TRUE)
);
CREATE POLICY "Users can create conversations" ON public.conversations FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Conversation participants can update conversations" ON public.conversations FOR UPDATE USING (
  id IN (SELECT conversation_id FROM public.conversation_participants WHERE user_id = auth.uid() AND is_active = TRUE)
);

-- RLS Policies for conversation_participants
CREATE POLICY "Users can view participants of conversations they're in" ON public.conversation_participants FOR SELECT USING (
  conversation_id IN (SELECT conversation_id FROM public.conversation_participants WHERE user_id = auth.uid() AND is_active = TRUE)
);
CREATE POLICY "Users can join conversations" ON public.conversation_participants FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own participation" ON public.conversation_participants FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for messages
CREATE POLICY "Users can view messages from conversations they participate in" ON public.messages FOR SELECT USING (
  conversation_id IN (SELECT conversation_id FROM public.conversation_participants WHERE user_id = auth.uid() AND is_active = TRUE)
);
CREATE POLICY "Users can send messages to conversations they participate in" ON public.messages FOR INSERT WITH CHECK (
  auth.uid() = sender_id AND
  conversation_id IN (SELECT conversation_id FROM public.conversation_participants WHERE user_id = auth.uid() AND is_active = TRUE)
);
CREATE POLICY "Users can update their own messages" ON public.messages FOR UPDATE USING (auth.uid() = sender_id);

-- RLS Policies for message_reactions
CREATE POLICY "Users can view reactions on accessible messages" ON public.message_reactions FOR SELECT USING (
  message_id IN (
    SELECT m.id FROM public.messages m 
    WHERE m.conversation_id IN (
      SELECT conversation_id FROM public.conversation_participants WHERE user_id = auth.uid() AND is_active = TRUE
    )
  )
);
CREATE POLICY "Users can react to accessible messages" ON public.message_reactions FOR INSERT WITH CHECK (
  auth.uid() = user_id AND
  message_id IN (
    SELECT m.id FROM public.messages m 
    WHERE m.conversation_id IN (
      SELECT conversation_id FROM public.conversation_participants WHERE user_id = auth.uid() AND is_active = TRUE
    )
  )
);
CREATE POLICY "Users can manage their own reactions" ON public.message_reactions FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for announcements
CREATE POLICY "Users can view published announcements" ON public.announcements FOR SELECT USING (
  is_published = TRUE AND 
  (target_audience IS NULL OR auth.uid()::text = ANY(target_audience) OR 'all' = ANY(target_audience))
);
CREATE POLICY "Admins can manage announcements" ON public.announcements FOR ALL USING (get_current_user_role() = ANY (ARRAY['admin'::user_role, 'hr'::user_role]));

-- RLS Policies for announcement_reads
CREATE POLICY "Users can view their own announcement reads" ON public.announcement_reads FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can mark announcements as read" ON public.announcement_reads FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own reads" ON public.announcement_reads FOR UPDATE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_partners_type ON public.partners(type);
CREATE INDEX idx_partners_status ON public.partners(status);
CREATE INDEX idx_partners_created_at ON public.partners(created_at);
CREATE INDEX idx_partner_interactions_partner_id ON public.partner_interactions(partner_id);
CREATE INDEX idx_partner_interactions_user_id ON public.partner_interactions(user_id);
CREATE INDEX idx_conversations_created_by ON public.conversations(created_by);
CREATE INDEX idx_conversation_participants_conversation_id ON public.conversation_participants(conversation_id);
CREATE INDEX idx_conversation_participants_user_id ON public.conversation_participants(user_id);
CREATE INDEX idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX idx_messages_created_at ON public.messages(created_at);
CREATE INDEX idx_announcements_published ON public.announcements(is_published);
CREATE INDEX idx_announcements_target_audience ON public.announcements USING GIN(target_audience);

-- Create trigger for updated_at
CREATE TRIGGER update_partners_updated_at BEFORE UPDATE ON public.partners FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON public.conversations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_announcements_updated_at BEFORE UPDATE ON public.announcements FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();