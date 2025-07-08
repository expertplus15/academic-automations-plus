-- Communication & Relations Module - Database Schema (Modified)
-- Phase 1: Critical Infrastructure Tables

-- Messages and Conversations Tables
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255),
  type VARCHAR(50) NOT NULL DEFAULT 'DIRECT', -- DIRECT, GROUP, CHANNEL
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_archived BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS public.conversation_participants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role VARCHAR(50) DEFAULT 'MEMBER', -- ADMIN, MODERATOR, MEMBER
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  last_read_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_muted BOOLEAN DEFAULT false,
  UNIQUE(conversation_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id),
  content TEXT NOT NULL,
  message_type VARCHAR(50) DEFAULT 'TEXT', -- TEXT, IMAGE, FILE, AUDIO, VIDEO
  reply_to_id UUID REFERENCES public.messages(id),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_edited BOOLEAN DEFAULT false,
  is_deleted BOOLEAN DEFAULT false
);

-- Call Sessions Table
CREATE TABLE IF NOT EXISTS public.call_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  initiator_id UUID NOT NULL REFERENCES public.profiles(id),
  conversation_id UUID REFERENCES public.conversations(id),
  type VARCHAR(50) NOT NULL, -- AUDIO, VIDEO, SCREEN_SHARE
  status VARCHAR(50) DEFAULT 'INITIATING', -- INITIATING, RINGING, ACTIVE, ENDED, FAILED
  started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  ended_at TIMESTAMP WITH TIME ZONE,
  duration_seconds INTEGER,
  recording_url TEXT,
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS public.call_participants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  call_session_id UUID NOT NULL REFERENCES public.call_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id),
  status VARCHAR(50) DEFAULT 'INVITED', -- INVITED, JOINED, LEFT, REJECTED
  joined_at TIMESTAMP WITH TIME ZONE,
  left_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(call_session_id, user_id)
);

-- User Presence Table
CREATE TABLE IF NOT EXISTS public.user_presence (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) UNIQUE,
  status VARCHAR(50) DEFAULT 'OFFLINE', -- ONLINE, AWAY, BUSY, OFFLINE
  last_seen_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  custom_status TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Partners/CRM Table
CREATE TABLE IF NOT EXISTS public.partners (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(50),
  company VARCHAR(255),
  sector VARCHAR(100),
  type VARCHAR(50) NOT NULL, -- STAGE, EMPLOI, PARTENARIAT, FOURNISSEUR
  status VARCHAR(50) DEFAULT 'ACTIF', -- ACTIF, INACTIF, PROSPECT, CLIENT
  address JSONB,
  contact_person JSONB,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  notes TEXT,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Partner Interactions Table
CREATE TABLE IF NOT EXISTS public.partner_interactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  partner_id UUID NOT NULL REFERENCES public.partners(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id),
  type VARCHAR(50) NOT NULL, -- EMAIL, CALL, MEETING, NOTE
  subject VARCHAR(255),
  content TEXT,
  interaction_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Events Table
CREATE TABLE IF NOT EXISTS public.events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  location VARCHAR(255),
  type VARCHAR(50) NOT NULL, -- CONFERENCE, ATELIER, FORUM, NETWORKING, FORMATION
  capacity_max INTEGER,
  is_free BOOLEAN DEFAULT true,
  price DECIMAL(10,2),
  registration_required BOOLEAN DEFAULT true,
  registration_deadline TIMESTAMP WITH TIME ZONE,
  organizer_id UUID NOT NULL REFERENCES public.profiles(id),
  status VARCHAR(50) DEFAULT 'ACTIVE', -- ACTIVE, CANCELLED, COMPLETED, DRAFT
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Event Registrations Table
CREATE TABLE IF NOT EXISTS public.event_registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id),
  registration_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  status VARCHAR(50) DEFAULT 'REGISTERED', -- REGISTERED, CANCELLED, ATTENDED, NO_SHOW
  checked_in_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}'::jsonb,
  UNIQUE(event_id, user_id)
);

-- Announcements Table
CREATE TABLE IF NOT EXISTS public.announcements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  priority VARCHAR(50) DEFAULT 'NORMAL', -- NORMAL, IMPORTANT, URGENT
  category VARCHAR(50) NOT NULL, -- ACADEMIQUE, ADMINISTRATIF, TECHNIQUE, GENERAL
  target_audience JSONB NOT NULL, -- Array of roles: ETUDIANTS, ENSEIGNANTS, ADMINISTRATION, TOUS
  publication_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expiration_date TIMESTAMP WITH TIME ZONE,
  distribution_channels JSONB NOT NULL, -- Array: EMAIL, PUSH, SMS, HOMEPAGE
  author_id UUID NOT NULL REFERENCES public.profiles(id),
  status VARCHAR(50) DEFAULT 'DRAFT', -- DRAFT, PUBLISHED, EXPIRED, ARCHIVED
  view_count INTEGER DEFAULT 0,
  acknowledgment_required BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Email Campaigns Table
CREATE TABLE IF NOT EXISTS public.email_campaigns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  template_id UUID,
  target_audience JSONB NOT NULL,
  send_date TIMESTAMP WITH TIME ZONE,
  status VARCHAR(50) DEFAULT 'DRAFT', -- DRAFT, SCHEDULED, SENDING, SENT, FAILED
  created_by UUID NOT NULL REFERENCES public.profiles(id),
  sent_count INTEGER DEFAULT 0,
  delivered_count INTEGER DEFAULT 0,
  opened_count INTEGER DEFAULT 0,
  clicked_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Enable RLS on new tables only if they don't already have it
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'conversations' AND table_schema = 'public') THEN
    ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'conversation_participants' AND table_schema = 'public') THEN
    ALTER TABLE public.conversation_participants ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'messages' AND table_schema = 'public') THEN
    ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'call_sessions' AND table_schema = 'public') THEN
    ALTER TABLE public.call_sessions ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'call_participants' AND table_schema = 'public') THEN
    ALTER TABLE public.call_participants ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_presence' AND table_schema = 'public') THEN
    ALTER TABLE public.user_presence ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'partners' AND table_schema = 'public') THEN
    ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'partner_interactions' AND table_schema = 'public') THEN
    ALTER TABLE public.partner_interactions ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'events' AND table_schema = 'public') THEN
    ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'event_registrations' AND table_schema = 'public') THEN
    ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'announcements' AND table_schema = 'public') THEN
    ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'email_campaigns' AND table_schema = 'public') THEN
    ALTER TABLE public.email_campaigns ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Create RLS Policies (drop existing if they exist)
DROP POLICY IF EXISTS "Users can access conversations they participate in" ON public.conversations;
CREATE POLICY "Users can access conversations they participate in"
ON public.conversations FOR ALL
USING (
  id IN (
    SELECT conversation_id FROM public.conversation_participants 
    WHERE user_id = auth.uid()
  ) OR created_by = auth.uid() OR get_current_user_role() = 'admin'::user_role
);

DROP POLICY IF EXISTS "Users can access messages in their conversations" ON public.messages;
CREATE POLICY "Users can access messages in their conversations"
ON public.messages FOR ALL
USING (
  conversation_id IN (
    SELECT conversation_id FROM public.conversation_participants 
    WHERE user_id = auth.uid()
  ) OR get_current_user_role() = 'admin'::user_role
);

DROP POLICY IF EXISTS "Users can access their call sessions" ON public.call_sessions;
CREATE POLICY "Users can access their call sessions"
ON public.call_sessions FOR ALL
USING (
  initiator_id = auth.uid() OR 
  id IN (
    SELECT call_session_id FROM public.call_participants 
    WHERE user_id = auth.uid()
  ) OR get_current_user_role() = 'admin'::user_role
);

DROP POLICY IF EXISTS "Staff can manage partners" ON public.partners;
CREATE POLICY "Staff can manage partners"
ON public.partners FOR ALL
USING (get_current_user_role() = ANY (ARRAY['admin'::user_role, 'hr'::user_role, 'teacher'::user_role]));

DROP POLICY IF EXISTS "Users can view events" ON public.events;
CREATE POLICY "Users can view events"
ON public.events FOR SELECT
USING (status = 'ACTIVE' OR organizer_id = auth.uid() OR get_current_user_role() = 'admin'::user_role);

DROP POLICY IF EXISTS "Staff can manage events" ON public.events;
CREATE POLICY "Staff can manage events"
ON public.events FOR ALL
USING (get_current_user_role() = ANY (ARRAY['admin'::user_role, 'hr'::user_role, 'teacher'::user_role]));

DROP POLICY IF EXISTS "Users can view published announcements" ON public.announcements;
CREATE POLICY "Users can view published announcements"
ON public.announcements FOR SELECT
USING (
  status = 'PUBLISHED' AND 
  (target_audience ? 'TOUS' OR 
   (get_current_user_role()::text = 'student' AND target_audience ? 'ETUDIANTS') OR
   (get_current_user_role()::text = 'teacher' AND target_audience ? 'ENSEIGNANTS') OR
   (get_current_user_role()::text IN ('admin', 'hr') AND target_audience ? 'ADMINISTRATION'))
);

DROP POLICY IF EXISTS "Staff can manage announcements" ON public.announcements;
CREATE POLICY "Staff can manage announcements"
ON public.announcements FOR ALL
USING (get_current_user_role() = ANY (ARRAY['admin'::user_role, 'hr'::user_role, 'teacher'::user_role]));

-- Add indexes for performance (if not exists)
CREATE INDEX IF NOT EXISTS idx_messages_conversation_created ON public.messages(conversation_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_conversation_participants_user ON public.conversation_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_user_presence_status ON public.user_presence(status, last_seen_at);
CREATE INDEX IF NOT EXISTS idx_partners_type_status ON public.partners(type, status);
CREATE INDEX IF NOT EXISTS idx_events_dates ON public.events(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_announcements_status_date ON public.announcements(status, publication_date);

-- Add triggers for updated_at (drop and recreate)
DROP TRIGGER IF EXISTS update_conversations_updated_at ON public.conversations;
CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON public.conversations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_messages_updated_at ON public.messages;
CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON public.messages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_presence_updated_at ON public.user_presence;
CREATE TRIGGER update_user_presence_updated_at BEFORE UPDATE ON public.user_presence FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_partners_updated_at ON public.partners;
CREATE TRIGGER update_partners_updated_at BEFORE UPDATE ON public.partners FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_events_updated_at ON public.events;
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_announcements_updated_at ON public.announcements;
CREATE TRIGGER update_announcements_updated_at BEFORE UPDATE ON public.announcements FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_email_campaigns_updated_at ON public.email_campaigns;
CREATE TRIGGER update_email_campaigns_updated_at BEFORE UPDATE ON public.email_campaigns FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();