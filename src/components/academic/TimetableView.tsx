
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, MapPin, User, BookOpen, Edit3, Trash2 } from 'lucide-react';
import { useTimetables } from '@/hooks/useTimetables';

interface TimetableViewProps {
  programId?: string;
  academicYearId?: string;
}

export function TimetableView({ programId, academicYearId }: TimetableViewProps) {
  const { timetables, loading } = useTimetables(programId, academicYearId);

  const getDayName = (dayIndex: number) => {
    const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    return days[dayIndex] || 'Jour inconnu';
  };

  const formatTime = (time: string) => {
    return time.slice(0, 5); // Format HH:MM
  };

  const getSlotTypeColor = (slotType: string) => {
    switch (slotType) {
      case 'course': return 'default';
      case 'exam': return 'destructive';
      case 'practical': return 'secondary';
      default: return 'outline';
    }
  };

  // Grouper les créneaux par jour
  const timetablesByDay = timetables.reduce((acc, timetable) => {
    const day = timetable.day_of_week || 0;
    if (!acc[day]) acc[day] = [];
    acc[day].push(timetable);
    return acc;
  }, {} as Record<number, typeof timetables>);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Chargement de l'emploi du temps...</div>
      </div>
    );
  }

  if (timetables.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center h-64 space-y-4">
          <Clock className="h-12 w-12 text-muted-foreground" />
          <div className="text-center">
            <h3 className="font-semibold">Aucun emploi du temps</h3>
            <p className="text-muted-foreground">
              Aucun créneau programmé pour les critères sélectionnés.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {Object.entries(timetablesByDay)
        .sort(([a], [b]) => Number(a) - Number(b))
        .map(([dayIndex, dayTimetables]) => (
          <Card key={dayIndex}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                {getDayName(Number(dayIndex))}
                <Badge variant="outline" className="ml-auto">
                  {dayTimetables.length} créneau{dayTimetables.length > 1 ? 'x' : ''}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {dayTimetables
                  .sort((a, b) => a.start_time.localeCompare(b.start_time))
                  .map((timetable) => (
                    <div 
                      key={timetable.id}
                      className="border rounded-lg p-4 hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2">
                            <Badge variant={getSlotTypeColor(timetable.slot_type)}>
                              {timetable.slot_type === 'course' ? 'Cours' : 
                               timetable.slot_type === 'exam' ? 'Examen' : 
                               timetable.slot_type === 'practical' ? 'TP' : timetable.slot_type}
                            </Badge>
                            <span className="font-semibold">
                              {formatTime(timetable.start_time)} - {formatTime(timetable.end_time)}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <BookOpen className="h-4 w-4 text-blue-600" />
                              <span>
                                {timetable.subject?.name || 'Matière non définie'}
                                <span className="text-muted-foreground ml-1">
                                  ({timetable.subject?.code})
                                </span>
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-green-600" />
                              <span>
                                {timetable.room?.name || 'Salle non définie'}
                                <span className="text-muted-foreground ml-1">
                                  ({timetable.room?.code})
                                </span>
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-purple-600" />
                              <span>
                                {timetable.teacher?.full_name || 'Enseignant non assigné'}
                              </span>
                            </div>
                          </div>
                          
                          {timetable.status && (
                            <Badge variant="outline" className="text-xs">
                              {timetable.status === 'scheduled' ? 'Programmé' :
                               timetable.status === 'cancelled' ? 'Annulé' :
                               timetable.status === 'moved' ? 'Déplacé' : timetable.status}
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2 ml-4">
                          <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                            <Edit3 className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline" className="h-8 w-8 p-0 text-destructive">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        ))}
    </div>
  );
}
