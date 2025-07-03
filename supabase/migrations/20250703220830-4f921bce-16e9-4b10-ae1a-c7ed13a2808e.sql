-- Tables pour la Phase 3 : Classes Virtuelles et Streaming

-- Table pour les sessions de classes virtuelles
CREATE TABLE public.virtual_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  instructor_id UUID REFERENCES public.profiles(id),
  title VARCHAR NOT NULL,
  description TEXT,
  platform VARCHAR NOT NULL DEFAULT 'zoom', -- 'zoom', 'teams', 'custom'
  meeting_id VARCHAR, -- ID du meeting Zoom/Teams
  meeting_url TEXT,
  password VARCHAR,
  scheduled_start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  scheduled_end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  actual_start_time TIMESTAMP WITH TIME ZONE,
  actual_end_time TIMESTAMP WITH TIME ZONE,
  max_participants INTEGER DEFAULT 100,
  is_recurring BOOLEAN DEFAULT false,
  recurrence_pattern JSONB DEFAULT '{}', -- Configuration de récurrence
  recording_enabled BOOLEAN DEFAULT true,
  auto_record BOOLEAN DEFAULT false,
  status VARCHAR DEFAULT 'scheduled', -- 'scheduled', 'in_progress', 'completed', 'cancelled'
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table pour les enregistrements de sessions
CREATE TABLE public.session_recordings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES public.virtual_sessions(id) ON DELETE CASCADE,
  title VARCHAR NOT NULL,
  file_path TEXT,
  file_size BIGINT,
  duration_seconds INTEGER,
  recording_type VARCHAR DEFAULT 'cloud', -- 'cloud', 'local'
  download_url TEXT,
  streaming_url TEXT,
  thumbnail_url TEXT,
  transcription_url TEXT,
  status VARCHAR DEFAULT 'processing', -- 'processing', 'ready', 'failed'
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table pour les métadonnées des flux vidéo
CREATE TABLE public.video_streams (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
  recording_id UUID REFERENCES public.session_recordings(id),
  title VARCHAR NOT NULL,
  description TEXT,
  file_path TEXT NOT NULL,
  file_size BIGINT,
  duration_seconds INTEGER,
  video_format VARCHAR DEFAULT 'mp4', -- 'mp4', 'hls', 'dash'
  resolution VARCHAR DEFAULT '1080p',
  bitrate INTEGER,
  thumbnail_url TEXT,
  chapters JSONB DEFAULT '[]', -- Chapitres avec timestamps
  quality_variants JSONB DEFAULT '[]', -- Différentes qualités disponibles
  streaming_url TEXT,
  download_url TEXT,
  status VARCHAR DEFAULT 'processing', -- 'processing', 'ready', 'failed'
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table pour les analytics de visionnage
CREATE TABLE public.viewing_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  video_stream_id UUID REFERENCES public.video_streams(id) ON DELETE CASCADE,
  student_id UUID REFERENCES public.students(id),
  session_id UUID, -- Session de visionnage unique
  watch_time_seconds INTEGER DEFAULT 0,
  progress_percentage NUMERIC(5,2) DEFAULT 0,
  playback_speed NUMERIC(3,2) DEFAULT 1.0,
  quality_selected VARCHAR DEFAULT 'auto',
  device_type VARCHAR, -- 'desktop', 'mobile', 'tablet'
  browser VARCHAR,
  engagement_events JSONB DEFAULT '[]', -- Play, pause, seek, etc.
  completion_status VARCHAR DEFAULT 'not_started', -- 'not_started', 'in_progress', 'completed'
  started_at TIMESTAMP WITH TIME ZONE,
  last_position_seconds INTEGER DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table pour les sous-titres et transcriptions
CREATE TABLE public.subtitles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  video_stream_id UUID REFERENCES public.video_streams(id) ON DELETE CASCADE,
  language_code VARCHAR(5) NOT NULL DEFAULT 'fr', -- 'fr', 'en', etc.
  title VARCHAR NOT NULL,
  subtitle_type VARCHAR DEFAULT 'manual', -- 'manual', 'auto_generated'
  file_path TEXT,
  file_format VARCHAR DEFAULT 'vtt', -- 'vtt', 'srt'
  content TEXT, -- Contenu des sous-titres
  confidence_score NUMERIC(3,2), -- Score de confiance pour auto-generated
  is_default BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table pour les participants aux sessions virtuelles
CREATE TABLE public.session_participants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES public.virtual_sessions(id) ON DELETE CASCADE,
  student_id UUID REFERENCES public.students(id),
  joined_at TIMESTAMP WITH TIME ZONE,
  left_at TIMESTAMP WITH TIME ZONE,
  attendance_duration_seconds INTEGER DEFAULT 0,
  participation_score NUMERIC(3,2), -- Score de participation (interactions, etc.)
  status VARCHAR DEFAULT 'invited', -- 'invited', 'joined', 'left', 'removed'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Indexes pour optimiser les performances
CREATE INDEX idx_virtual_sessions_course_id ON public.virtual_sessions(course_id);
CREATE INDEX idx_virtual_sessions_instructor_id ON public.virtual_sessions(instructor_id);
CREATE INDEX idx_virtual_sessions_scheduled_start ON public.virtual_sessions(scheduled_start_time);
CREATE INDEX idx_session_recordings_session_id ON public.session_recordings(session_id);
CREATE INDEX idx_video_streams_lesson_id ON public.video_streams(lesson_id);
CREATE INDEX idx_viewing_analytics_video_id ON public.viewing_analytics(video_stream_id);
CREATE INDEX idx_viewing_analytics_student_id ON public.viewing_analytics(student_id);
CREATE INDEX idx_subtitles_video_id ON public.subtitles(video_stream_id);
CREATE INDEX idx_session_participants_session_id ON public.session_participants(session_id);

-- RLS Policies
ALTER TABLE public.virtual_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_recordings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_streams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.viewing_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subtitles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_participants ENABLE ROW LEVEL SECURITY;

-- Policies pour virtual_sessions
CREATE POLICY "Instructors can manage their virtual sessions" ON public.virtual_sessions
  FOR ALL USING (instructor_id = auth.uid() OR get_current_user_role() = 'admin'::user_role);

CREATE POLICY "Students can view sessions of enrolled courses" ON public.virtual_sessions
  FOR SELECT USING (
    course_id IN (
      SELECT ce.course_id FROM course_enrollments ce
      JOIN students s ON s.id = ce.student_id
      WHERE s.profile_id = auth.uid()
    ) OR get_current_user_role() = ANY(ARRAY['admin'::user_role, 'teacher'::user_role])
  );

-- Policies pour session_recordings
CREATE POLICY "Users can access recordings of accessible sessions" ON public.session_recordings
  FOR SELECT USING (
    session_id IN (
      SELECT vs.id FROM virtual_sessions vs
      WHERE vs.instructor_id = auth.uid() 
      OR vs.course_id IN (
        SELECT ce.course_id FROM course_enrollments ce
        JOIN students s ON s.id = ce.student_id
        WHERE s.profile_id = auth.uid()
      )
    ) OR get_current_user_role() = ANY(ARRAY['admin'::user_role, 'teacher'::user_role])
  );

-- Policies pour video_streams
CREATE POLICY "Users can access video streams of accessible content" ON public.video_streams
  FOR SELECT USING (
    lesson_id IN (
      SELECT l.id FROM lessons l
      JOIN courses c ON c.id = l.course_id
      WHERE c.is_published = true
      OR c.instructor_id = auth.uid()
      OR get_current_user_role() = ANY(ARRAY['admin'::user_role, 'teacher'::user_role])
    )
  );

CREATE POLICY "Instructors can manage video streams" ON public.video_streams
  FOR ALL USING (
    lesson_id IN (
      SELECT l.id FROM lessons l
      JOIN courses c ON c.id = l.course_id
      WHERE c.instructor_id = auth.uid()
    ) OR get_current_user_role() = 'admin'::user_role
  );

-- Policies pour viewing_analytics
CREATE POLICY "Students can manage their own analytics" ON public.viewing_analytics
  FOR ALL USING (
    student_id IN (
      SELECT s.id FROM students s WHERE s.profile_id = auth.uid()
    ) OR get_current_user_role() = ANY(ARRAY['admin'::user_role, 'teacher'::user_role])
  );

-- Policies pour subtitles
CREATE POLICY "Users can view subtitles of accessible videos" ON public.subtitles
  FOR SELECT USING (
    video_stream_id IN (
      SELECT vs.id FROM video_streams vs
      JOIN lessons l ON l.id = vs.lesson_id
      JOIN courses c ON c.id = l.course_id
      WHERE c.is_published = true
      OR c.instructor_id = auth.uid()
      OR get_current_user_role() = ANY(ARRAY['admin'::user_role, 'teacher'::user_role])
    )
  );

-- Policies pour session_participants
CREATE POLICY "Students can view their own participation" ON public.session_participants
  FOR SELECT USING (
    student_id IN (
      SELECT s.id FROM students s WHERE s.profile_id = auth.uid()
    ) OR get_current_user_role() = ANY(ARRAY['admin'::user_role, 'teacher'::user_role])
  );

-- Triggers pour updated_at
CREATE TRIGGER update_virtual_sessions_updated_at
  BEFORE UPDATE ON public.virtual_sessions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_video_streams_updated_at
  BEFORE UPDATE ON public.video_streams
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_viewing_analytics_updated_at
  BEFORE UPDATE ON public.viewing_analytics
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_subtitles_updated_at
  BEFORE UPDATE ON public.subtitles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();