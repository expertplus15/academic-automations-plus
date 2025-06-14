import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useTimetables, useAcademicYears, useRooms, useClassGroups } from '@/hooks/useAcademic';
import { usePrograms } from '@/hooks/useSupabase';
import { Calendar, Clock, MapPin, Users, AlertTriangle, Plus, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TimetableCalendarProps {
  programId?: string;
  teacherId?: string;
  roomId?: string;
  groupId?: string;
}

const DAYS_OF_WEEK = [
  { value: 1, label: 'Lundi' },
  { value: 2, label: 'Mardi' },
  { value: 3, label: 'Mercredi' },
  { value: 4, label: 'Jeudi' },
  { value: 5, label: 'Vendredi' },
  { value: 6, label: 'Samedi' },
  { value: 7, label: 'Dimanche' }
];

const SLOT_TYPES = {
  theory: { label: 'Cours', color: 'bg-blue-500' },
  practice: { label: 'TD', color: 'bg-green-500' },
  lab: { label: 'TP', color: 'bg-purple-500' },
  project: { label: 'Projet', color: 'bg-orange-500' }
};

export function TimetableCalendar({ programId, teacherId, roomId, groupId }: TimetableCalendarProps) {
  const [selectedAcademicYear, setSelectedAcademicYear] = useState<string>('');
  const [selectedProgram, setSelectedProgram] = useState<string>(programId || '');
  const [selectedRoom, setSelectedRoom] = useState<string>(roomId || '');
  const [selectedGroup, setSelectedGroup] = useState<string>(groupId || '');
  const [timeSlots, setTimeSlots] = useState<string[]>([]);

  const { data: academicYears, getCurrentYear } = useAcademicYears();
  const { data: programs } = usePrograms();
  const { data: rooms } = useRooms();
  const { data: groups } = useClassGroups(selectedProgram, selectedAcademicYear);

  const { data: timetables, loading, error } = useTimetables({
    programId: selectedProgram || undefined,
    academicYearId: selectedAcademicYear || undefined,
    teacherId,
    roomId: selectedRoom || undefined,
    groupId: selectedGroup || undefined
  });

  useEffect(() => {
    const currentYear = getCurrentYear();
    if (currentYear && !selectedAcademicYear) {
      setSelectedAcademicYear(currentYear.id);
    }
  }, [academicYears, getCurrentYear, selectedAcademicYear]);

  // Generate time slots from 8:00 to 20:00
  useEffect(() => {
    const slots = [];
    for (let hour = 8; hour < 20; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    setTimeSlots(slots);
  }, []);

  // Detect conflicts in timetable
  const detectConflicts = () => {
    const conflicts: any[] = [];
    const timeSlotMap = new Map();

    (timetables as any[]).forEach((slot) => {
      const key = `${slot.day_of_week}-${slot.start_time}-${slot.end_time}`;
      
      if (slot.teacher_id) {
        const teacherKey = `teacher-${slot.teacher_id}-${key}`;
        if (timeSlotMap.has(teacherKey)) {
          conflicts.push({
            type: 'teacher',
            message: `Conflit enseignant: ${slot.profiles?.full_name || 'Enseignant non défini'}`,
            slots: [timeSlotMap.get(teacherKey), slot]
          });
        } else {
          timeSlotMap.set(teacherKey, slot);
        }
      }

      if (slot.room_id) {
        const roomKey = `room-${slot.room_id}-${key}`;
        if (timeSlotMap.has(roomKey)) {
          conflicts.push({
            type: 'room',
            message: `Conflit salle: ${slot.rooms?.name || 'Salle non définie'}`,
            slots: [timeSlotMap.get(roomKey), slot]
          });
        } else {
          timeSlotMap.set(roomKey, slot);
        }
      }

      if (slot.group_id) {
        const groupKey = `group-${slot.group_id}-${key}`;
        if (timeSlotMap.has(groupKey)) {
          conflicts.push({
            type: 'group',
            message: `Conflit groupe: ${slot.class_groups?.name || 'Groupe non défini'}`,
            slots: [timeSlotMap.get(groupKey), slot]
          });
        } else {
          timeSlotMap.set(groupKey, slot);
        }
      }
    });

    return conflicts;
  };

  const conflicts = detectConflicts();

  const getSlotPosition = (startTime: string, endTime: string) => {
    const startHour = parseInt(startTime.split(':')[0]);
    const startMinute = parseInt(startTime.split(':')[1]);
    const endHour = parseInt(endTime.split(':')[0]);
    const endMinute = parseInt(endTime.split(':')[1]);

    const startOffset = (startHour - 8) * 60 + startMinute;
    const duration = (endHour - startHour) * 60 + (endMinute - startMinute);

    return {
      top: `${(startOffset / 30) * 2.5}rem`,
      height: `${(duration / 30) * 2.5}rem`
    };
  };

  const getSlotsByDay = (dayOfWeek: number) => {
    return timetables.filter(slot => slot.day_of_week === dayOfWeek);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="grid grid-cols-7 gap-4">
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="h-96 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Erreur lors du chargement de l'emploi du temps: {error}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtres
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Année académique</label>
              <Select value={selectedAcademicYear} onValueChange={setSelectedAcademicYear}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner l'année" />
                </SelectTrigger>
                <SelectContent>
                  {academicYears.map((year) => (
                    <SelectItem key={year.id} value={year.id}>
                      {year.name} {year.is_current && '(Actuel)'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Programme</label>
              <Select value={selectedProgram} onValueChange={setSelectedProgram}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous les programmes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tous les programmes</SelectItem>
                  {programs.map((program) => (
                    <SelectItem key={program.id} value={program.id}>
                      {program.code} - {program.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Salle</label>
              <Select value={selectedRoom} onValueChange={setSelectedRoom}>
                <SelectTrigger>
                  <SelectValue placeholder="Toutes les salles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Toutes les salles</SelectItem>
                  {rooms.map((room) => (
                    <SelectItem key={room.id} value={room.id}>
                      {room.code} - {room.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Groupe</label>
              <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous les groupes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tous les groupes</SelectItem>
                  {groups.map((group) => (
                    <SelectItem key={group.id} value={group.id}>
                      {group.code} - {group.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Conflicts Alert */}
      {conflicts.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="font-medium mb-2">{conflicts.length} conflit(s) détecté(s):</div>
            <ul className="list-disc list-inside space-y-1">
              {conflicts.map((conflict, index) => (
                <li key={index} className="text-sm">{conflict.message}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Timetable Grid */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Emploi du Temps
            </CardTitle>
            <Button size="sm" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Ajouter un créneau
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="grid grid-cols-8 gap-1 min-w-[800px]">
              {/* Header */}
              <div className="p-2 font-medium text-center bg-muted rounded">Heures</div>
              {DAYS_OF_WEEK.map((day) => (
                <div key={day.value} className="p-2 font-medium text-center bg-muted rounded">
                  {day.label}
                </div>
              ))}

              {/* Time slots */}
              {timeSlots.map((time) => (
                <div key={time} className="contents">
                  <div className="p-2 text-sm text-center border-r border-border">
                    {time}
                  </div>
                  {DAYS_OF_WEEK.map((day) => {
                    const daySlots = getSlotsByDay(day.value);
                    const slotAtTime = daySlots.find(
                      slot => slot.start_time <= time && slot.end_time > time
                    );

                    return (
                      <div key={`${day.value}-${time}`} className="h-10 border border-border relative">
                        {slotAtTime && slotAtTime.start_time === time && (
                          <div
                            className={cn(
                              "absolute inset-x-0 rounded p-1 text-xs text-white overflow-hidden",
                              SLOT_TYPES[slotAtTime.slot_type as keyof typeof SLOT_TYPES]?.color || 'bg-gray-500',
                              conflicts.some(c => c.slots.some(s => s.id === slotAtTime.id)) && 'ring-2 ring-red-500 animate-pulse'
                            )}
                            style={getSlotPosition(slotAtTime.start_time, slotAtTime.end_time)}
                          >
                            <div className="font-medium truncate">
                              Cours #{slotAtTime.id.slice(0, 8)}
                            </div>
                            <div className="flex items-center gap-1 text-xs opacity-90">
                              <MapPin className="w-3 h-3" />
                              Salle
                            </div>
                            <div className="flex items-center gap-1 text-xs opacity-90">
                              <Users className="w-3 h-3" />
                              Groupe
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card>
        <CardHeader>
          <CardTitle>Légende</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            {Object.entries(SLOT_TYPES).map(([type, config]) => (
              <div key={type} className="flex items-center gap-2">
                <div className={cn("w-4 h-4 rounded", config.color)}></div>
                <span className="text-sm">{config.label}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}