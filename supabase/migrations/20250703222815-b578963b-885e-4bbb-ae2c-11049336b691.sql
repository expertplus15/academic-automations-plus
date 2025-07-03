-- Phase 4 : Tables pour Forums et Gamification (mise à jour)

-- Ajouter la colonne forum_id manquante à forum_posts si elle n'existe pas
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'forum_posts' AND column_name = 'forum_id') THEN
        ALTER TABLE public.forum_posts ADD COLUMN forum_id UUID REFERENCES public.forums(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Table pour les votes sur les posts
CREATE TABLE IF NOT EXISTS public.forum_votes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES public.forum_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  vote_type VARCHAR NOT NULL CHECK (vote_type IN ('upvote', 'downvote')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(post_id, user_id)
);

-- Table pour les badges des étudiants
CREATE TABLE IF NOT EXISTS public.student_badges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  badge_id UUID REFERENCES public.badges(id) ON DELETE CASCADE,
  awarded_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  awarded_by UUID REFERENCES public.profiles(id),
  criteria_met JSONB DEFAULT '{}',
  is_visible BOOLEAN DEFAULT true,
  UNIQUE(student_id, badge_id)
);

-- Table pour les points de gamification
CREATE TABLE IF NOT EXISTS public.student_points (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  points INTEGER NOT NULL,
  point_type VARCHAR NOT NULL, -- 'forum_post', 'helpful_answer', 'course_completion', 'quiz_score', etc.
  reference_id UUID, -- ID de l'élément qui a donné les points
  reference_type VARCHAR, -- Type de l'élément (forum_post, lesson, quiz, etc.)
  description TEXT,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  academic_year_id UUID REFERENCES public.academic_years(id)
);

-- Table pour les notifications
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title VARCHAR NOT NULL,
  message TEXT NOT NULL,
  notification_type VARCHAR NOT NULL, -- 'forum_reply', 'badge_earned', 'course_update', etc.
  reference_id UUID,
  reference_type VARCHAR,
  is_read BOOLEAN DEFAULT false,
  is_sent_email BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Mettre à jour la table forums existante avec les colonnes manquantes
DO $$ 
BEGIN 
    -- Ajouter les colonnes manquantes une par une
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'forums' AND column_name = 'course_id') THEN
        ALTER TABLE public.forums ADD COLUMN course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'forums' AND column_name = 'title') THEN
        ALTER TABLE public.forums ADD COLUMN title VARCHAR NOT NULL DEFAULT 'Untitled';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'forums' AND column_name = 'description') THEN
        ALTER TABLE public.forums ADD COLUMN description TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'forums' AND column_name = 'category') THEN
        ALTER TABLE public.forums ADD COLUMN category VARCHAR DEFAULT 'general';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'forums' AND column_name = 'is_general') THEN
        ALTER TABLE public.forums ADD COLUMN is_general BOOLEAN DEFAULT false;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'forums' AND column_name = 'is_moderated') THEN
        ALTER TABLE public.forums ADD COLUMN is_moderated BOOLEAN DEFAULT true;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'forums' AND column_name = 'is_locked') THEN
        ALTER TABLE public.forums ADD COLUMN is_locked BOOLEAN DEFAULT false;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'forums' AND column_name = 'posts_count') THEN
        ALTER TABLE public.forums ADD COLUMN posts_count INTEGER DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'forums' AND column_name = 'last_post_at') THEN
        ALTER TABLE public.forums ADD COLUMN last_post_at TIMESTAMP WITH TIME ZONE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'forums' AND column_name = 'last_post_by') THEN
        ALTER TABLE public.forums ADD COLUMN last_post_by UUID REFERENCES public.profiles(id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'forums' AND column_name = 'display_order') THEN
        ALTER TABLE public.forums ADD COLUMN display_order INTEGER DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'forums' AND column_name = 'created_by') THEN
        ALTER TABLE public.forums ADD COLUMN created_by UUID REFERENCES public.profiles(id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'forums' AND column_name = 'created_at') THEN
        ALTER TABLE public.forums ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT now();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'forums' AND column_name = 'updated_at') THEN
        ALTER TABLE public.forums ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();
    END IF;
END $$;

-- Indexes pour optimiser les performances (avec IF NOT EXISTS pour éviter les erreurs)
CREATE INDEX IF NOT EXISTS idx_forums_course_id ON public.forums(course_id);
CREATE INDEX IF NOT EXISTS idx_forums_category ON public.forums(category);
CREATE INDEX IF NOT EXISTS idx_forum_votes_post_id ON public.forum_votes(post_id);
CREATE INDEX IF NOT EXISTS idx_forum_votes_user_id ON public.forum_votes(user_id);
CREATE INDEX IF NOT EXISTS idx_student_badges_student_id ON public.student_badges(student_id);
CREATE INDEX IF NOT EXISTS idx_student_badges_badge_id ON public.student_badges(badge_id);
CREATE INDEX IF NOT EXISTS idx_student_points_student_id ON public.student_points(student_id);
CREATE INDEX IF NOT EXISTS idx_student_points_type ON public.student_points(point_type);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON public.notifications(user_id, is_read);

-- RLS Policies
ALTER TABLE public.forums ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Supprimer les policies existantes si elles existent et les recréer
DROP POLICY IF EXISTS "Anyone can view general forums" ON public.forums;
DROP POLICY IF EXISTS "Staff can manage forums" ON public.forums;

-- Policies pour forums
CREATE POLICY "Anyone can view general forums" ON public.forums
  FOR SELECT USING (
    is_general = true OR 
    course_id IN (
      SELECT ce.course_id FROM course_enrollments ce
      JOIN students s ON s.id = ce.student_id
      WHERE s.profile_id = auth.uid()
    ) OR 
    get_current_user_role() = ANY(ARRAY['admin'::user_role, 'teacher'::user_role])
  );

CREATE POLICY "Staff can manage forums" ON public.forums
  FOR ALL USING (
    get_current_user_role() = ANY(ARRAY['admin'::user_role, 'teacher'::user_role])
  );

-- Policies pour forum_votes
CREATE POLICY "Users can manage their own votes" ON public.forum_votes
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Users can view all votes" ON public.forum_votes
  FOR SELECT USING (true);

-- Policies pour student_badges
CREATE POLICY "Students can view their own badges" ON public.student_badges
  FOR SELECT USING (
    student_id IN (
      SELECT s.id FROM students s WHERE s.profile_id = auth.uid()
    ) OR get_current_user_role() = ANY(ARRAY['admin'::user_role, 'teacher'::user_role])
  );

CREATE POLICY "Staff can manage student badges" ON public.student_badges
  FOR ALL USING (
    get_current_user_role() = ANY(ARRAY['admin'::user_role, 'teacher'::user_role])
  );

-- Policies pour student_points
CREATE POLICY "Students can view their own points" ON public.student_points
  FOR SELECT USING (
    student_id IN (
      SELECT s.id FROM students s WHERE s.profile_id = auth.uid()
    ) OR get_current_user_role() = ANY(ARRAY['admin'::user_role, 'teacher'::user_role])
  );

CREATE POLICY "System can insert points" ON public.student_points
  FOR INSERT WITH CHECK (true);

-- Policies pour notifications
CREATE POLICY "Users can manage their own notifications" ON public.notifications
  FOR ALL USING (user_id = auth.uid());

-- Triggers pour updated_at
DROP TRIGGER IF EXISTS update_forums_updated_at ON public.forums;
CREATE TRIGGER update_forums_updated_at
  BEFORE UPDATE ON public.forums
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();