-- Phase 4 : Tables pour Forums et Gamification

-- Table des forums (catégories de discussion)
CREATE TABLE public.forums (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  title VARCHAR NOT NULL,
  description TEXT,
  category VARCHAR DEFAULT 'general', -- 'general', 'course', 'q_and_a', 'announcements'
  is_general BOOLEAN DEFAULT false, -- Forum général accessible à tous
  is_moderated BOOLEAN DEFAULT true,
  is_locked BOOLEAN DEFAULT false,
  posts_count INTEGER DEFAULT 0,
  last_post_at TIMESTAMP WITH TIME ZONE,
  last_post_by UUID REFERENCES public.profiles(id),
  display_order INTEGER DEFAULT 0,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table pour les votes sur les posts
CREATE TABLE public.forum_votes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES public.forum_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  vote_type VARCHAR NOT NULL CHECK (vote_type IN ('upvote', 'downvote')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(post_id, user_id)
);

-- Table pour les badges des étudiants
CREATE TABLE public.student_badges (
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
CREATE TABLE public.student_points (
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
CREATE TABLE public.notifications (
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

-- Indexes pour optimiser les performances
CREATE INDEX idx_forums_course_id ON public.forums(course_id);
CREATE INDEX idx_forums_category ON public.forums(category);
CREATE INDEX idx_forum_votes_post_id ON public.forum_votes(post_id);
CREATE INDEX idx_forum_votes_user_id ON public.forum_votes(user_id);
CREATE INDEX idx_student_badges_student_id ON public.student_badges(student_id);
CREATE INDEX idx_student_badges_badge_id ON public.student_badges(badge_id);
CREATE INDEX idx_student_points_student_id ON public.student_points(student_id);
CREATE INDEX idx_student_points_type ON public.student_points(point_type);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_unread ON public.notifications(user_id, is_read);

-- RLS Policies
ALTER TABLE public.forums ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

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
CREATE TRIGGER update_forums_updated_at
  BEFORE UPDATE ON public.forums
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Fonction pour mettre à jour les compteurs de forums
CREATE OR REPLACE FUNCTION public.update_forum_post_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.forums 
    SET posts_count = posts_count + 1,
        last_post_at = NEW.created_at,
        last_post_by = NEW.author_id
    WHERE id = NEW.forum_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.forums 
    SET posts_count = posts_count - 1
    WHERE id = OLD.forum_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour maintenir les compteurs
CREATE TRIGGER forum_post_count_trigger
  AFTER INSERT OR DELETE ON public.forum_posts
  FOR EACH ROW EXECUTE FUNCTION public.update_forum_post_count();

-- Fonction pour calculer les scores des posts avec votes
CREATE OR REPLACE FUNCTION public.calculate_post_score(post_id UUID)
RETURNS INTEGER AS $$
DECLARE
  upvotes INTEGER;
  downvotes INTEGER;
BEGIN
  SELECT 
    COUNT(*) FILTER (WHERE vote_type = 'upvote'),
    COUNT(*) FILTER (WHERE vote_type = 'downvote')
  INTO upvotes, downvotes
  FROM public.forum_votes
  WHERE forum_votes.post_id = calculate_post_score.post_id;
  
  RETURN COALESCE(upvotes, 0) - COALESCE(downvotes, 0);
END;
$$ LANGUAGE plpgsql STABLE;