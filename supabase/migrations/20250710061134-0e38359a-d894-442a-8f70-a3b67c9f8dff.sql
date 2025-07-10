-- Create contact_favorites table for directory
CREATE TABLE IF NOT EXISTS public.contact_favorites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  contact_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, contact_id)
);

-- Create message_status table for read receipts
CREATE TABLE IF NOT EXISTS public.message_status (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id UUID NOT NULL REFERENCES public.messages(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'delivered',
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(message_id, user_id)
);

-- Enable RLS on new tables
ALTER TABLE public.contact_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_status ENABLE ROW LEVEL SECURITY;

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
CREATE INDEX IF NOT EXISTS idx_contact_favorites_user_id ON public.contact_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_message_status_message_id ON public.message_status(message_id);

-- Enable realtime for communication tables
DO $$
BEGIN
  -- Add tables to realtime publication if they exist
  IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'messages' AND schemaname = 'public') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'notifications' AND schemaname = 'public') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'conversation_participants' AND schemaname = 'public') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.conversation_participants;
  END IF;
  
  ALTER PUBLICATION supabase_realtime ADD TABLE public.message_status;
  ALTER PUBLICATION supabase_realtime ADD TABLE public.contact_favorites;
END
$$;