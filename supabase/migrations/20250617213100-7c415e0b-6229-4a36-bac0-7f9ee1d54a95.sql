
-- Créer les tables spécifiques pour les examens
CREATE TABLE IF NOT EXISTS public.exams (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  subject_id UUID REFERENCES public.subjects(id),
  academic_year_id UUID REFERENCES public.academic_years(id),
  program_id UUID REFERENCES public.programs(id),
  exam_type VARCHAR NOT NULL DEFAULT 'written', -- written, oral, practical, mixed
  title VARCHAR NOT NULL,
  description TEXT,
  duration_minutes INTEGER NOT NULL DEFAULT 120,
  max_students INTEGER,
  min_supervisors INTEGER DEFAULT 1,
  instructions JSONB DEFAULT '{}',
  materials_required JSONB DEFAULT '[]',
  status VARCHAR NOT NULL DEFAULT 'draft', -- draft, scheduled, in_progress, completed, cancelled
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table pour les sessions d'examens (créneaux planifiés)
CREATE TABLE IF NOT EXISTS public.exam_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  exam_id UUID NOT NULL REFERENCES public.exams(id) ON DELETE CASCADE,
  room_id UUID REFERENCES public.rooms(id),
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  actual_students_count INTEGER DEFAULT 0,
  status VARCHAR NOT NULL DEFAULT 'scheduled', -- scheduled, in_progress, completed, cancelled
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table pour les surveillants assignés aux sessions
CREATE TABLE IF NOT EXISTS public.exam_supervisors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.exam_sessions(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL REFERENCES public.profiles(id),
  supervisor_role VARCHAR NOT NULL DEFAULT 'primary', -- primary, secondary, backup
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  confirmed_at TIMESTAMP WITH TIME ZONE,
  status VARCHAR NOT NULL DEFAULT 'assigned' -- assigned, confirmed, declined, replaced
);

-- Table pour les étudiants inscrits aux examens
CREATE TABLE IF NOT EXISTS public.exam_registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  exam_id UUID NOT NULL REFERENCES public.exams(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  session_id UUID REFERENCES public.exam_sessions(id),
  registration_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  status VARCHAR NOT NULL DEFAULT 'registered', -- registered, present, absent, excused
  seat_number VARCHAR,
  special_accommodations JSONB DEFAULT '[]',
  UNIQUE(exam_id, student_id)
);

-- Table pour les conflits d'examens détectés
CREATE TABLE IF NOT EXISTS public.exam_conflicts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conflict_type VARCHAR NOT NULL, -- room_overlap, teacher_overlap, student_overlap, capacity_exceeded
  severity VARCHAR NOT NULL DEFAULT 'medium', -- low, medium, high, critical
  title VARCHAR NOT NULL,
  description TEXT NOT NULL,
  affected_exams JSONB DEFAULT '[]',
  affected_sessions JSONB DEFAULT '[]',
  resolution_status VARCHAR DEFAULT 'pending', -- pending, resolved, ignored
  resolution_notes TEXT,
  auto_resolvable BOOLEAN DEFAULT false,
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Ajouter les triggers pour updated_at
CREATE TRIGGER update_exams_updated_at 
BEFORE UPDATE ON public.exams 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_exam_sessions_updated_at 
BEFORE UPDATE ON public.exam_sessions 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_exam_conflicts_updated_at 
BEFORE UPDATE ON public.exam_conflicts 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Fonction pour détecter les conflits d'examens
CREATE OR REPLACE FUNCTION public.detect_exam_conflicts(p_academic_year_id UUID DEFAULT NULL)
RETURNS TABLE (
  conflict_id UUID,
  conflict_type VARCHAR,
  severity VARCHAR,
  title VARCHAR,
  description TEXT,
  affected_data JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Conflits de salles (même salle, créneaux qui se chevauchent)
  RETURN QUERY
  SELECT 
    gen_random_uuid() as conflict_id,
    'room_overlap'::VARCHAR as conflict_type,
    CASE 
      WHEN COUNT(*) > 3 THEN 'critical'::VARCHAR
      WHEN COUNT(*) > 1 THEN 'high'::VARCHAR
      ELSE 'medium'::VARCHAR
    END as severity,
    ('Conflit de salle: ' || r.name)::VARCHAR as title,
    ('La salle ' || r.name || ' est réservée pour ' || COUNT(*) || ' examens simultanément')::TEXT as description,
    jsonb_agg(
      jsonb_build_object(
        'session_id', es.id,
        'exam_title', e.title,
        'start_time', es.start_time,
        'end_time', es.end_time,
        'room_name', r.name
      )
    ) as affected_data
  FROM public.exam_sessions es1
  JOIN public.exam_sessions es2 ON es2.id != es1.id
  JOIN public.exams e ON e.id = es1.exam_id
  JOIN public.rooms r ON r.id = es1.room_id AND r.id = es2.room_id
  JOIN public.exam_sessions es ON es.id = es1.id OR es.id = es2.id
  WHERE es1.room_id = es2.room_id
    AND es1.status = 'scheduled' 
    AND es2.status = 'scheduled'
    AND (
      (es1.start_time <= es2.start_time AND es1.end_time > es2.start_time) OR
      (es1.start_time < es2.end_time AND es1.end_time >= es2.end_time) OR
      (es1.start_time >= es2.start_time AND es1.end_time <= es2.end_time)
    )
    AND (p_academic_year_id IS NULL OR e.academic_year_id = p_academic_year_id)
  GROUP BY r.name, r.id;

  -- Conflits de surveillants (même surveillant, créneaux qui se chevauchent)
  RETURN QUERY
  SELECT 
    gen_random_uuid() as conflict_id,
    'supervisor_overlap'::VARCHAR as conflict_type,
    'high'::VARCHAR as severity,
    ('Conflit surveillant: ' || p.full_name)::VARCHAR as title,
    ('Le surveillant ' || p.full_name || ' est assigné à plusieurs examens simultanément')::TEXT as description,
    jsonb_agg(
      jsonb_build_object(
        'session_id', es.id,
        'exam_title', e.title,
        'supervisor_name', p.full_name,
        'start_time', es.start_time,
        'end_time', es.end_time
      )
    ) as affected_data
  FROM public.exam_supervisors sup1
  JOIN public.exam_supervisors sup2 ON sup2.id != sup1.id AND sup2.teacher_id = sup1.teacher_id
  JOIN public.exam_sessions es1 ON es1.id = sup1.session_id
  JOIN public.exam_sessions es2 ON es2.id = sup2.session_id
  JOIN public.exams e ON e.id = es1.exam_id
  JOIN public.profiles p ON p.id = sup1.teacher_id
  JOIN public.exam_sessions es ON es.id = es1.id OR es.id = es2.id
  WHERE sup1.status = 'assigned' 
    AND sup2.status = 'assigned'
    AND es1.status = 'scheduled'
    AND es2.status = 'scheduled'
    AND (
      (es1.start_time <= es2.start_time AND es1.end_time > es2.start_time) OR
      (es1.start_time < es2.end_time AND es1.end_time >= es2.end_time) OR
      (es1.start_time >= es2.start_time AND es1.end_time <= es2.end_time)
    )
    AND (p_academic_year_id IS NULL OR e.academic_year_id = p_academic_year_id)
  GROUP BY p.full_name, p.id;

  -- Conflits de capacité (plus d'étudiants que la capacité de la salle)
  RETURN QUERY
  SELECT 
    gen_random_uuid() as conflict_id,
    'capacity_exceeded'::VARCHAR as conflict_type,
    'critical'::VARCHAR as severity,
    ('Capacité dépassée: ' || r.name)::VARCHAR as title,
    ('La salle ' || r.name || ' (capacité: ' || r.capacity || ') accueille ' || COUNT(er.id) || ' étudiants')::TEXT as description,
    jsonb_build_object(
      'session_id', es.id,
      'exam_title', e.title,
      'room_name', r.name,
      'room_capacity', r.capacity,
      'registered_students', COUNT(er.id)
    ) as affected_data
  FROM public.exam_sessions es
  JOIN public.exams e ON e.id = es.exam_id
  JOIN public.rooms r ON r.id = es.room_id
  JOIN public.exam_registrations er ON er.session_id = es.id
  WHERE es.status = 'scheduled'
    AND er.status = 'registered'
    AND (p_academic_year_id IS NULL OR e.academic_year_id = p_academic_year_id)
  GROUP BY es.id, e.title, r.name, r.capacity, e.academic_year_id
  HAVING COUNT(er.id) > r.capacity;
END;
$$;

-- Fonction pour générer automatiquement un planning d'examens
CREATE OR REPLACE FUNCTION public.generate_exam_schedule(
  p_academic_year_id UUID,
  p_program_id UUID DEFAULT NULL,
  p_parameters JSONB DEFAULT '{}'::JSONB
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_generation_id UUID;
  v_exam RECORD;
  v_available_slot RECORD;
  v_conflicts_count INTEGER := 0;
  v_default_duration INTEGER := 120; -- 2 heures par défaut
BEGIN
  -- Créer une session de génération
  INSERT INTO public.schedule_generations (
    academic_year_id, program_id, parameters, generated_by, status, generation_type
  ) VALUES (
    p_academic_year_id, p_program_id, p_parameters, auth.uid(), 'in_progress', 'exam_schedule'
  ) RETURNING id INTO v_generation_id;

  -- Générer les sessions pour chaque examen
  FOR v_exam IN 
    SELECT e.*, COUNT(er.id) as student_count
    FROM public.exams e
    LEFT JOIN public.exam_registrations er ON er.exam_id = e.id AND er.status = 'registered'
    WHERE e.academic_year_id = p_academic_year_id
      AND e.status = 'draft'
      AND (p_program_id IS NULL OR e.program_id = p_program_id)
    GROUP BY e.id
    ORDER BY e.created_at
  LOOP
    -- Trouver le premier créneau disponible
    FOR v_available_slot IN
      SELECT 
        date_trunc('hour', now() + interval '1 week' + (generate_series(0, 30) * interval '1 day') + 
          (CASE 
            WHEN extract('dow' from now() + interval '1 week' + (generate_series(0, 30) * interval '1 day')) IN (1,2,3,4,5)
            THEN (generate_series(8, 17) * interval '1 hour')
            ELSE interval '0 hour'
          END)) as start_time,
        room_id
      FROM (
        VALUES (8), (10), (14), (16) -- Créneaux de 8h, 10h, 14h, 16h
      ) AS time_slots(hour)
      CROSS JOIN (
        SELECT id as room_id, capacity FROM public.rooms 
        WHERE room_type IN ('classroom', 'amphitheater') 
          AND status = 'available'
          AND capacity >= COALESCE(v_exam.student_count, 1)
        ORDER BY capacity
        LIMIT 10
      ) AS available_rooms
      WHERE extract('dow' from date_trunc('hour', now() + interval '1 week' + (generate_series(0, 30) * interval '1 day'))) IN (1,2,3,4,5)
      LIMIT 100
    LOOP
      -- Vérifier s'il n'y a pas de conflit
      IF NOT EXISTS (
        SELECT 1 FROM public.exam_sessions 
        WHERE room_id = v_available_slot.room_id
          AND status = 'scheduled'
          AND (
            (start_time <= v_available_slot.start_time AND end_time > v_available_slot.start_time) OR
            (start_time < v_available_slot.start_time + interval '1 minute' * COALESCE(v_exam.duration_minutes, v_default_duration) 
             AND end_time >= v_available_slot.start_time + interval '1 minute' * COALESCE(v_exam.duration_minutes, v_default_duration))
          )
      ) THEN
        -- Créer la session d'examen
        INSERT INTO public.exam_sessions (
          exam_id, room_id, start_time, end_time, status
        ) VALUES (
          v_exam.id, 
          v_available_slot.room_id,
          v_available_slot.start_time,
          v_available_slot.start_time + interval '1 minute' * COALESCE(v_exam.duration_minutes, v_default_duration),
          'scheduled'
        );
        
        -- Marquer l'examen comme planifié
        UPDATE public.exams SET status = 'scheduled' WHERE id = v_exam.id;
        
        EXIT; -- Sortir de la boucle des créneaux pour cet examen
      END IF;
    END LOOP;
  END LOOP;

  -- Détecter les conflits restants
  SELECT COUNT(*) INTO v_conflicts_count
  FROM public.detect_exam_conflicts(p_academic_year_id);

  -- Mettre à jour la session de génération
  UPDATE public.schedule_generations 
  SET 
    status = 'completed',
    progress_percentage = 100,
    conflicts_count = v_conflicts_count,
    success_rate = CASE WHEN v_conflicts_count = 0 THEN 100.0 ELSE 85.0 END,
    completed_at = now()
  WHERE id = v_generation_id;

  RETURN v_generation_id;
END;
$$;
