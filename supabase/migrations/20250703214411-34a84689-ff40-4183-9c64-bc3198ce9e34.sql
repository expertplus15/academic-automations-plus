-- Create eLearning tables for Phase 1

-- Courses table
CREATE TABLE public.courses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR NOT NULL,
  description TEXT,
  code VARCHAR UNIQUE NOT NULL,
  instructor_id UUID REFERENCES public.profiles(id),
  category_id UUID,
  status VARCHAR NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'archived')),
  difficulty_level VARCHAR DEFAULT 'beginner' CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  estimated_duration INTEGER, -- in minutes
  thumbnail_url TEXT,
  is_published BOOLEAN DEFAULT false,
  enrollment_limit INTEGER,
  enrollment_start_date DATE,
  enrollment_end_date DATE,
  course_start_date DATE,
  course_end_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Course categories table
CREATE TABLE public.course_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR NOT NULL,
  code VARCHAR UNIQUE NOT NULL,
  description TEXT,
  color VARCHAR DEFAULT '#06b6d4',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Lessons table
CREATE TABLE public.lessons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title VARCHAR NOT NULL,
  description TEXT,
  content JSONB DEFAULT '{}', -- Rich content (HTML, videos, etc.)
  order_index INTEGER NOT NULL,
  duration_minutes INTEGER,
  lesson_type VARCHAR DEFAULT 'content' CHECK (lesson_type IN ('content', 'video', 'quiz', 'assignment', 'scorm')),
  video_url TEXT,
  scorm_package_id UUID,
  is_mandatory BOOLEAN DEFAULT true,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Course enrollments table
CREATE TABLE public.course_enrollments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  enrollment_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completion_date TIMESTAMP WITH TIME ZONE,
  progress_percentage DECIMAL(5,2) DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  status VARCHAR DEFAULT 'enrolled' CHECK (status IN ('enrolled', 'in_progress', 'completed', 'dropped')),
  final_grade DECIMAL(5,2),
  certificate_url TEXT,
  UNIQUE(course_id, student_id)
);

-- Lesson progress tracking
CREATE TABLE public.lesson_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  enrollment_id UUID NOT NULL REFERENCES public.course_enrollments(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  time_spent_minutes INTEGER DEFAULT 0,
  progress_percentage DECIMAL(5,2) DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  current_position JSONB DEFAULT '{}', -- For tracking position in video/content
  attempts_count INTEGER DEFAULT 0,
  best_score DECIMAL(5,2),
  UNIQUE(enrollment_id, lesson_id)
);

-- Forums table
CREATE TABLE public.forums (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  title VARCHAR NOT NULL,
  description TEXT,
  is_general BOOLEAN DEFAULT false, -- true for general forums, false for course-specific
  is_moderated BOOLEAN DEFAULT true,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Forum posts table
CREATE TABLE public.forum_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  forum_id UUID NOT NULL REFERENCES public.forums(id) ON DELETE CASCADE,
  parent_post_id UUID REFERENCES public.forum_posts(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES public.profiles(id),
  title VARCHAR,
  content TEXT NOT NULL,
  is_pinned BOOLEAN DEFAULT false,
  is_locked BOOLEAN DEFAULT false,
  upvotes INTEGER DEFAULT 0,
  downvotes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Badges/Achievements table
CREATE TABLE public.badges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR NOT NULL,
  description TEXT,
  icon VARCHAR, -- icon name or URL
  badge_type VARCHAR DEFAULT 'achievement' CHECK (badge_type IN ('achievement', 'progress', 'special')),
  criteria JSONB DEFAULT '{}', -- Requirements to earn the badge
  points_value INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- User badges (earned badges)
CREATE TABLE public.user_badges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  course_id UUID REFERENCES public.courses(id),
  UNIQUE(user_id, badge_id, course_id)
);

-- SCORM packages table
CREATE TABLE public.scorm_packages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR NOT NULL,
  identifier VARCHAR NOT NULL,
  version VARCHAR DEFAULT '1.2',
  manifest_url TEXT NOT NULL,
  launch_url TEXT NOT NULL,
  file_size BIGINT,
  uploaded_by UUID REFERENCES public.profiles(id),
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_active BOOLEAN DEFAULT true
);

-- Add foreign key for course categories
ALTER TABLE public.courses ADD CONSTRAINT fk_courses_category 
  FOREIGN KEY (category_id) REFERENCES public.course_categories(id);

-- Add foreign key for SCORM packages in lessons
ALTER TABLE public.lessons ADD CONSTRAINT fk_lessons_scorm 
  FOREIGN KEY (scorm_package_id) REFERENCES public.scorm_packages(id);

-- Create indexes for better performance
CREATE INDEX idx_courses_instructor ON public.courses(instructor_id);
CREATE INDEX idx_courses_category ON public.courses(category_id);
CREATE INDEX idx_courses_status ON public.courses(status);
CREATE INDEX idx_lessons_course ON public.lessons(course_id);
CREATE INDEX idx_lessons_order ON public.lessons(course_id, order_index);
CREATE INDEX idx_enrollments_student ON public.course_enrollments(student_id);
CREATE INDEX idx_enrollments_course ON public.course_enrollments(course_id);
CREATE INDEX idx_lesson_progress_student ON public.lesson_progress(student_id);
CREATE INDEX idx_forum_posts_forum ON public.forum_posts(forum_id);
CREATE INDEX idx_forum_posts_author ON public.forum_posts(author_id);

-- Enable RLS
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forums ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scorm_packages ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Courses: Everyone can view published courses, only instructors/admins can manage
CREATE POLICY "Anyone can view published courses" ON public.courses
  FOR SELECT USING (is_published = true OR get_current_user_role() = ANY(ARRAY['admin'::user_role, 'teacher'::user_role]));

CREATE POLICY "Instructors can manage their courses" ON public.courses
  FOR ALL USING (instructor_id = auth.uid() OR get_current_user_role() = 'admin'::user_role);

-- Course categories: All can view, only admins can manage
CREATE POLICY "Anyone can view active categories" ON public.course_categories
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage categories" ON public.course_categories
  FOR ALL USING (get_current_user_role() = 'admin'::user_role);

-- Lessons: Visible based on course access
CREATE POLICY "Users can view lessons of accessible courses" ON public.lessons
  FOR SELECT USING (
    course_id IN (
      SELECT id FROM public.courses 
      WHERE is_published = true OR instructor_id = auth.uid() OR get_current_user_role() = ANY(ARRAY['admin'::user_role, 'teacher'::user_role])
    )
  );

CREATE POLICY "Instructors can manage lessons" ON public.lessons
  FOR ALL USING (
    course_id IN (
      SELECT id FROM public.courses 
      WHERE instructor_id = auth.uid() OR get_current_user_role() = 'admin'::user_role
    )
  );

-- Course enrollments: Students can view/manage own enrollments
CREATE POLICY "Students can view own enrollments" ON public.course_enrollments
  FOR SELECT USING (
    student_id IN (SELECT id FROM public.students WHERE profile_id = auth.uid()) 
    OR get_current_user_role() = ANY(ARRAY['admin'::user_role, 'teacher'::user_role])
  );

CREATE POLICY "Students can enroll themselves" ON public.course_enrollments
  FOR INSERT WITH CHECK (
    student_id IN (SELECT id FROM public.students WHERE profile_id = auth.uid())
  );

CREATE POLICY "Staff can manage enrollments" ON public.course_enrollments
  FOR ALL USING (get_current_user_role() = ANY(ARRAY['admin'::user_role, 'teacher'::user_role]));

-- Lesson progress: Students can view/update own progress
CREATE POLICY "Students can manage own progress" ON public.lesson_progress
  FOR ALL USING (
    student_id IN (SELECT id FROM public.students WHERE profile_id = auth.uid())
    OR get_current_user_role() = ANY(ARRAY['admin'::user_role, 'teacher'::user_role])
  );

-- Forums: Based on course access
CREATE POLICY "Users can view accessible forums" ON public.forums
  FOR SELECT USING (
    is_general = true OR 
    course_id IN (
      SELECT ce.course_id FROM public.course_enrollments ce 
      JOIN public.students s ON s.id = ce.student_id 
      WHERE s.profile_id = auth.uid()
    ) OR
    get_current_user_role() = ANY(ARRAY['admin'::user_role, 'teacher'::user_role])
  );

CREATE POLICY "Staff can manage forums" ON public.forums
  FOR ALL USING (get_current_user_role() = ANY(ARRAY['admin'::user_role, 'teacher'::user_role]));

-- Forum posts: Based on forum access
CREATE POLICY "Users can view posts in accessible forums" ON public.forum_posts
  FOR SELECT USING (
    forum_id IN (
      SELECT id FROM public.forums 
      WHERE is_general = true OR 
      course_id IN (
        SELECT ce.course_id FROM public.course_enrollments ce 
        JOIN public.students s ON s.id = ce.student_id 
        WHERE s.profile_id = auth.uid()
      ) OR
      get_current_user_role() = ANY(ARRAY['admin'::user_role, 'teacher'::user_role])
    )
  );

CREATE POLICY "Users can create posts in accessible forums" ON public.forum_posts
  FOR INSERT WITH CHECK (
    forum_id IN (
      SELECT id FROM public.forums 
      WHERE is_general = true OR 
      course_id IN (
        SELECT ce.course_id FROM public.course_enrollments ce 
        JOIN public.students s ON s.id = ce.student_id 
        WHERE s.profile_id = auth.uid()
      )
    ) AND auth.uid() = author_id
  );

CREATE POLICY "Users can update own posts" ON public.forum_posts
  FOR UPDATE USING (author_id = auth.uid() OR get_current_user_role() = ANY(ARRAY['admin'::user_role, 'teacher'::user_role]));

-- Badges: All can view, only admins can manage
CREATE POLICY "Anyone can view active badges" ON public.badges
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage badges" ON public.badges
  FOR ALL USING (get_current_user_role() = 'admin'::user_role);

-- User badges: Users can view own badges
CREATE POLICY "Users can view own badges" ON public.user_badges
  FOR SELECT USING (user_id = auth.uid() OR get_current_user_role() = ANY(ARRAY['admin'::user_role, 'teacher'::user_role]));

CREATE POLICY "Staff can award badges" ON public.user_badges
  FOR INSERT WITH CHECK (get_current_user_role() = ANY(ARRAY['admin'::user_role, 'teacher'::user_role]));

-- SCORM packages: Based on role
CREATE POLICY "Staff can view SCORM packages" ON public.scorm_packages
  FOR SELECT USING (get_current_user_role() = ANY(ARRAY['admin'::user_role, 'teacher'::user_role]));

CREATE POLICY "Staff can manage SCORM packages" ON public.scorm_packages
  FOR ALL USING (get_current_user_role() = ANY(ARRAY['admin'::user_role, 'teacher'::user_role]));

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON public.courses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lessons_updated_at BEFORE UPDATE ON public.lessons
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_forums_updated_at BEFORE UPDATE ON public.forums
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_forum_posts_updated_at BEFORE UPDATE ON public.forum_posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();