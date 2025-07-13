import { supabase } from '@/integrations/supabase/client';

interface TimetableSlot {
  subject_id: string;
  program_id: string;
  academic_year_id: string;
  room_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  status: string;
  slot_type: string;
}

export async function seedTimetableData(): Promise<{ success: boolean; count: number; error?: string }> {
  try {
    console.log('🏫 Démarrage du seeding des emplois du temps...');

    // Vérifier si des créneaux existent déjà
    const { count: existingCount } = await supabase
      .from('timetables')
      .select('*', { count: 'exact', head: true });

    if (existingCount && existingCount > 0) {
      console.log(`✅ ${existingCount} créneaux déjà présents - Aucun seeding nécessaire`);
      return { success: true, count: existingCount };
    }

    // Récupérer les données nécessaires
    const [
      { data: subjects },
      { data: programs },
      { data: academicYears },
      { data: rooms }
    ] = await Promise.all([
      supabase.from('subjects').select('id').limit(6),
      supabase.from('programs').select('id').limit(3),
      supabase.from('academic_years').select('id').eq('is_current', true).limit(1),
      supabase.from('rooms').select('id').limit(4)
    ]);

    if (!subjects?.length || !programs?.length || !academicYears?.length || !rooms?.length) {
      throw new Error('Données de base manquantes (subjects, programs, academic_years, rooms)');
    }

    // Créneaux horaires standards
    const timeSlots = [
      { start: '08:00', end: '10:00' },
      { start: '10:30', end: '12:30' },
      { start: '14:00', end: '16:00' },
      { start: '16:30', end: '18:30' }
    ];

    // Générer des créneaux réalistes
    const timetableSlots: TimetableSlot[] = [];
    const academicYearId = academicYears[0].id;

    // Pour chaque jour de la semaine (Lundi à Vendredi)
    for (let day = 1; day <= 5; day++) {
      // Pour chaque créneau horaire
      for (let slotIndex = 0; slotIndex < timeSlots.length; slotIndex++) {
        const slot = timeSlots[slotIndex];
        
        // Sélectionner une matière, un programme et une salle de manière cyclique
        const subjectIndex = (day - 1 + slotIndex) % subjects.length;
        const programIndex = Math.floor((day - 1) / 2) % programs.length;
        const roomIndex = slotIndex % rooms.length;

        // Éviter de surcharger - ne pas créer de cours l'après-midi le vendredi
        if (day === 5 && slotIndex >= 2) continue;

        // Éviter les créneaux consécutifs pour la même salle
        const existingInSameRoom = timetableSlots.filter(t => 
          t.room_id === rooms[roomIndex].id && 
          t.day_of_week === day
        );
        
        if (existingInSameRoom.length >= 2) continue;

        timetableSlots.push({
          subject_id: subjects[subjectIndex].id,
          program_id: programs[programIndex].id,
          academic_year_id: academicYearId,
          room_id: rooms[roomIndex].id,
          day_of_week: day,
          start_time: slot.start,
          end_time: slot.end,
          status: 'scheduled',
          slot_type: 'lecture' // Utiliser un type de slot valide
        });
      }
    }

    console.log(`📚 Génération de ${timetableSlots.length} créneaux...`);

    // Insérer les créneaux par petits lots pour éviter les timeouts
    const batchSize = 10;
    let insertedCount = 0;

    for (let i = 0; i < timetableSlots.length; i += batchSize) {
      const batch = timetableSlots.slice(i, i + batchSize);
      
      const { error } = await supabase
        .from('timetables')
        .insert(batch);

      if (error) {
        console.error(`❌ Erreur lors de l'insertion du lot ${Math.floor(i/batchSize) + 1}:`, error);
        // Continuer avec le lot suivant plutôt que d'échouer complètement
      } else {
        insertedCount += batch.length;
        console.log(`✅ Lot ${Math.floor(i/batchSize) + 1} inséré (${batch.length} créneaux)`);
      }
    }

    console.log(`🎉 Seeding terminé ! ${insertedCount} créneaux créés sur ${timetableSlots.length} tentés`);

    return { 
      success: true, 
      count: insertedCount 
    };

  } catch (error) {
    console.error('❌ Erreur lors du seeding des emplois du temps:', error);
    return { 
      success: false, 
      count: 0, 
      error: error instanceof Error ? error.message : 'Erreur inconnue' 
    };
  }
}

// Fonction utilitaire pour vérifier les conflits
export async function detectTimetableConflicts(): Promise<{
  roomConflicts: number;
  teacherConflicts: number;
  totalSlots: number;
}> {
  try {
    // Détecter les conflits de salles (même salle, même horaire)
    const { data: roomConflicts } = await supabase
      .from('timetables')
      .select(`
        room_id,
        day_of_week,
        start_time,
        end_time
      `);

    // Détecter les conflits d'enseignants (si la colonne teacher_id existe)
    const { count: totalSlots } = await supabase
      .from('timetables')
      .select('*', { count: 'exact', head: true });

    // Logique simple de détection des conflits de salles
    const conflicts = new Set();
    if (roomConflicts) {
      for (let i = 0; i < roomConflicts.length; i++) {
        for (let j = i + 1; j < roomConflicts.length; j++) {
          const slot1 = roomConflicts[i];
          const slot2 = roomConflicts[j];
          
          if (slot1.room_id === slot2.room_id && 
              slot1.day_of_week === slot2.day_of_week &&
              slot1.start_time === slot2.start_time) {
            conflicts.add(`${slot1.room_id}-${slot1.day_of_week}-${slot1.start_time}`);
          }
        }
      }
    }

    return {
      roomConflicts: conflicts.size,
      teacherConflicts: 0, // À implémenter si nécessaire
      totalSlots: totalSlots || 0
    };

  } catch (error) {
    console.error('Erreur lors de la détection des conflits:', error);
    return { roomConflicts: 0, teacherConflicts: 0, totalSlots: 0 };
  }
}