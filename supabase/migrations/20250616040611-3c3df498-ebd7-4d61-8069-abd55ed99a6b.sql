
-- Ajouter les colonnes manquantes à la table timetables pour supporter l'algorithme intelligent
ALTER TABLE public.timetables 
ADD COLUMN IF NOT EXISTS priority INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS weight DECIMAL(3,2) DEFAULT 1.0,
ADD COLUMN IF NOT EXISTS is_flexible BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS preferred_start_time TIME,
ADD COLUMN IF NOT EXISTS preferred_end_time TIME,
ADD COLUMN IF NOT EXISTS max_daily_hours INTEGER DEFAULT 8,
ADD COLUMN IF NOT EXISTS min_break_minutes INTEGER DEFAULT 15;

-- Table pour gérer les contraintes de disponibilité des enseignants
CREATE TABLE IF NOT EXISTS public.teacher_availability (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_id UUID NOT NULL,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_preferred BOOLEAN DEFAULT false,
  academic_year_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(teacher_id, day_of_week, start_time, end_time, academic_year_id)
);

-- Table pour les conflits détectés
CREATE TABLE IF NOT EXISTS public.schedule_conflicts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conflict_type VARCHAR NOT NULL,
  severity VARCHAR NOT NULL DEFAULT 'medium',
  description TEXT NOT NULL,
  affected_timetables JSONB DEFAULT '[]',
  resolution_status VARCHAR DEFAULT 'pending',
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table pour les sessions de génération automatique
CREATE TABLE IF NOT EXISTS public.schedule_generations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  program_id UUID,
  academic_year_id UUID,
  generation_type VARCHAR NOT NULL DEFAULT 'auto',
  parameters JSONB DEFAULT '{}',
  status VARCHAR NOT NULL DEFAULT 'pending',
  progress_percentage INTEGER DEFAULT 0,
  conflicts_count INTEGER DEFAULT 0,
  success_rate DECIMAL(5,2),
  generated_by UUID,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Ajouter les triggers pour updated_at
CREATE TRIGGER update_teacher_availability_updated_at 
BEFORE UPDATE ON public.teacher_availability 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_schedule_conflicts_updated_at 
BEFORE UPDATE ON public.schedule_conflicts 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Fonction pour détecter les conflits d'emploi du temps
CREATE OR REPLACE FUNCTION public.detect_schedule_conflicts(p_academic_year_id UUID DEFAULT NULL)
RETURNS TABLE (
  conflict_id UUID,
  conflict_type VARCHAR,
  severity VARCHAR,
  description TEXT,
  affected_slots JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Conflits de salles (même salle, même horaire)
  RETURN QUERY
  SELECT 
    gen_random_uuid() as conflict_id,
    'room_overlap'::VARCHAR as conflict_type,
    'high'::VARCHAR as severity,
    ('Salle ' || r.name || ' réservée simultanément')::TEXT as description,
    jsonb_agg(
      jsonb_build_object(
        'timetable_id', t.id,
        'subject', s.name,
        'teacher', p.full_name,
        'time', t.start_time || '-' || t.end_time,
        'day', t.day_of_week
      )
    ) as affected_slots
  FROM public.timetables t1
  JOIN public.timetables t2 ON t2.id != t1.id
  JOIN public.rooms r ON r.id = t1.room_id AND r.id = t2.room_id
  JOIN public.subjects s ON s.id = t1.subject_id
  JOIN public.profiles p ON p.id = t1.teacher_id
  JOIN public.timetables t ON t.id = t1.id OR t.id = t2.id
  WHERE t1.day_of_week = t2.day_of_week
    AND t1.room_id = t2.room_id
    AND (
      (t1.start_time <= t2.start_time AND t1.end_time > t2.start_time) OR
      (t1.start_time < t2.end_time AND t1.end_time >= t2.end_time) OR
      (t1.start_time >= t2.start_time AND t1.end_time <= t2.end_time)
    )
    AND (p_academic_year_id IS NULL OR t1.academic_year_id = p_academic_year_id)
  GROUP BY r.name;

  -- Conflits d'enseignants (même enseignant, même horaire)
  RETURN QUERY
  SELECT 
    gen_random_uuid() as conflict_id,
    'teacher_overlap'::VARCHAR as conflict_type,
    'high'::VARCHAR as severity,
    ('Enseignant ' || p.full_name || ' programmé simultanément')::TEXT as description,
    jsonb_agg(
      jsonb_build_object(
        'timetable_id', t.id,
        'subject', s.name,
        'room', r.name,
        'time', t.start_time || '-' || t.end_time,
        'day', t.day_of_week
      )
    ) as affected_slots
  FROM public.timetables t1
  JOIN public.timetables t2 ON t2.id != t1.id
  JOIN public.profiles p ON p.id = t1.teacher_id AND p.id = t2.teacher_id
  JOIN public.subjects s ON s.id = t1.subject_id
  JOIN public.rooms r ON r.id = t1.room_id
  JOIN public.timetables t ON t.id = t1.id OR t.id = t2.id
  WHERE t1.day_of_week = t2.day_of_week
    AND t1.teacher_id = t2.teacher_id
    AND (
      (t1.start_time <= t2.start_time AND t1.end_time > t2.start_time) OR
      (t1.start_time < t2.end_time AND t1.end_time >= t2.end_time) OR
      (t1.start_time >= t2.start_time AND t1.end_time <= t2.end_time)
    )
    AND (p_academic_year_id IS NULL OR t1.academic_year_id = p_academic_year_id)
  GROUP BY p.full_name;
END;
$$;

-- Fonction pour générer automatiquement un emploi du temps
CREATE OR REPLACE FUNCTION public.generate_smart_schedule(
  p_program_id UUID,
  p_academic_year_id UUID,
  p_parameters JSONB DEFAULT '{}'::JSONB
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_generation_id UUID;
  v_subject RECORD;
  v_available_slot RECORD;
  v_conflicts_count INTEGER := 0;
BEGIN
  -- Créer une session de génération
  INSERT INTO public.schedule_generations (
    program_id, academic_year_id, parameters, generated_by, status
  ) VALUES (
    p_program_id, p_academic_year_id, p_parameters, auth.uid(), 'in_progress'
  ) RETURNING id INTO v_generation_id;

  -- Nettoyer les anciens créneaux pour ce programme
  DELETE FROM public.timetables 
  WHERE program_id = p_program_id 
    AND academic_year_id = p_academic_year_id;

  -- Générer les créneaux pour chaque matière du programme
  FOR v_subject IN 
    SELECT s.*, ps.semester, ps.is_mandatory
    FROM public.subjects s
    JOIN public.program_subjects ps ON ps.subject_id = s.id
    WHERE ps.program_id = p_program_id
    ORDER BY ps.is_mandatory DESC, s.credits_ects DESC
  LOOP
    -- Logique simplifiée de placement (à améliorer avec l'algorithme complet)
    -- Trouver le premier créneau disponible
    FOR v_available_slot IN
      SELECT 
        day_of_week, 
        start_time, 
        end_time,
        room_id
      FROM (
        VALUES 
          (1, '08:00'::TIME, '10:00'::TIME),
          (1, '10:30'::TIME, '12:30'::TIME),
          (1, '14:00'::TIME, '16:00'::TIME),
          (2, '08:00'::TIME, '10:00'::TIME),
          (2, '10:30'::TIME, '12:30'::TIME),
          (3, '08:00'::TIME, '10:00'::TIME)
      ) AS slots(day_of_week, start_time, end_time)
      CROSS JOIN (
        SELECT id as room_id FROM public.rooms 
        WHERE room_type = 'classroom' 
        LIMIT 3
      ) AS available_rooms
    LOOP
      -- Vérifier s'il n'y a pas de conflit
      IF NOT EXISTS (
        SELECT 1 FROM public.timetables 
        WHERE day_of_week = v_available_slot.day_of_week
          AND room_id = v_available_slot.room_id
          AND academic_year_id = p_academic_year_id
          AND (
            (start_time <= v_available_slot.start_time AND end_time > v_available_slot.start_time) OR
            (start_time < v_available_slot.end_time AND end_time >= v_available_slot.end_time)
          )
      ) THEN
        -- Créer le créneau
        INSERT INTO public.timetables (
          subject_id, program_id, academic_year_id,
          day_of_week, start_time, end_time,
          room_id, slot_type, status
        ) VALUES (
          v_subject.id, p_program_id, p_academic_year_id,
          v_available_slot.day_of_week, v_available_slot.start_time, v_available_slot.end_time,
          v_available_slot.room_id, 'course', 'scheduled'
        );
        EXIT; -- Sortir de la boucle des créneaux pour cette matière
      END IF;
    END LOOP;
  END LOOP;

  -- Détecter les conflits restants
  SELECT COUNT(*) INTO v_conflicts_count
  FROM public.detect_schedule_conflicts(p_academic_year_id);

  -- Mettre à jour la session de génération
  UPDATE public.schedule_generations 
  SET 
    status = 'completed',
    progress_percentage = 100,
    conflicts_count = v_conflicts_count,
    success_rate = CASE WHEN v_conflicts_count = 0 THEN 100.0 ELSE 75.0 END,
    completed_at = now()
  WHERE id = v_generation_id;

  RETURN v_generation_id;
END;
$$;
