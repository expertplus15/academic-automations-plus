
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, ChevronLeft, ChevronRight, Clock, MapPin, User } from 'lucide-react';
import { useTimetables, Timetable } from '@/hooks/useTimetables';
import { cn } from '@/lib/utils';

interface TimetableCalendarViewProps {
  programId?: string;
  academicYearId?: string;
}

type ViewMode = 'week' | 'month';

export function TimetableCalendarView({ programId, academicYearId }: TimetableCalendarViewProps) {
  const { timetables, loading } = useTimetables(programId, academicYearId);
  const [viewMode, setViewMode] = useState<ViewMode>('week');
  const [currentDate, setCurrentDate] = useState(new Date());

  // Fonction pour obtenir les dates de la semaine courante
  const getWeekDates = (date: Date) => {
    const week = [];
    const startOfWeek = new Date(date);
    const dayOfWeek = startOfWeek.getDay();
    const monday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    startOfWeek.setDate(startOfWeek.getDate() + monday);

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      week.push(day);
    }
    return week;
  };

  // Fonction pour obtenir les dates du mois courant
  const getMonthDates = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    const endDate = new Date(lastDay);
    
    // Ajuster pour commencer le lundi
    const startDayOfWeek = firstDay.getDay();
    const mondayOffset = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;
    startDate.setDate(firstDay.getDate() - mondayOffset);
    
    // Ajuster pour finir le dimanche
    const endDayOfWeek = lastDay.getDay();
    const sundayOffset = endDayOfWeek === 0 ? 0 : 7 - endDayOfWeek;
    endDate.setDate(lastDay.getDate() + sundayOffset);

    const dates = [];
    const current = new Date(startDate);
    while (current <= endDate) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return dates;
  };

  const dates = viewMode === 'week' ? getWeekDates(currentDate) : getMonthDates(currentDate);
  
  // Organiser les créneaux par date
  const timetablesByDate = useMemo(() => {
    const byDate: { [key: string]: Timetable[] } = {};
    
    timetables.forEach(timetable => {
      if (timetable.day_of_week !== null && timetable.day_of_week !== undefined) {
        // Pour chaque date, vérifier si elle correspond au jour de la semaine du créneau
        dates.forEach(date => {
          const dayOfWeek = date.getDay() === 0 ? 7 : date.getDay(); // Convertir dimanche (0) en 7
          if (dayOfWeek === timetable.day_of_week) {
            const dateKey = date.toISOString().split('T')[0];
            if (!byDate[dateKey]) byDate[dateKey] = [];
            byDate[dateKey].push(timetable);
          }
        });
      }
    });
    
    return byDate;
  }, [timetables, dates]);

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    } else {
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    }
    setCurrentDate(newDate);
  };

  const formatTime = (time: string) => time.slice(0, 5);

  const getSlotTypeColor = (slotType: string) => {
    switch (slotType) {
      case 'course': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'exam': return 'bg-red-100 text-red-800 border-red-200';
      case 'practical': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Chargement du calendrier...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* En-tête de contrôle */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Vue Calendrier
            </CardTitle>
            <div className="flex items-center gap-4">
              <Select value={viewMode} onValueChange={(value: ViewMode) => setViewMode(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Semaine</SelectItem>
                  <SelectItem value="month">Mois</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => navigateDate('prev')}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="font-medium min-w-[200px] text-center">
                  {viewMode === 'week' 
                    ? `Semaine du ${dates[0]?.toLocaleDateString('fr-FR')} au ${dates[6]?.toLocaleDateString('fr-FR')}`
                    : currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
                  }
                </span>
                <Button variant="outline" size="sm" onClick={() => navigateDate('next')}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Vue Semaine */}
      {viewMode === 'week' && (
        <Card>
          <CardContent className="p-0">
            <div className="grid grid-cols-8 border-b">
              <div className="p-4 border-r bg-muted font-medium">Horaires</div>
              {dates.slice(0, 7).map((date, index) => (
                <div key={index} className="p-4 border-r bg-muted text-center">
                  <div className="font-medium">
                    {date.toLocaleDateString('fr-FR', { weekday: 'short' })}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Créneaux horaires de 8h à 18h */}
            {Array.from({ length: 11 }, (_, i) => i + 8).map(hour => (
              <div key={hour} className="grid grid-cols-8 border-b min-h-[80px]">
                <div className="p-4 border-r bg-muted/50 text-sm font-medium flex items-center">
                  {hour.toString().padStart(2, '0')}:00
                </div>
                {dates.slice(0, 7).map((date, dayIndex) => {
                  const dateKey = date.toISOString().split('T')[0];
                  const dayTimetables = timetablesByDate[dateKey] || [];
                  const hourTimetables = dayTimetables.filter(t => 
                    parseInt(t.start_time.split(':')[0]) === hour
                  );

                  return (
                    <div key={dayIndex} className="border-r p-2 space-y-1">
                      {hourTimetables.map(timetable => (
                        <div
                          key={timetable.id}
                          className={cn(
                            "p-2 rounded text-xs border",
                            getSlotTypeColor(timetable.slot_type)
                          )}
                        >
                          <div className="font-medium truncate">
                            {timetable.subject?.name}
                          </div>
                          <div className="flex items-center gap-1 text-xs opacity-75">
                            <Clock className="h-3 w-3" />
                            {formatTime(timetable.start_time)}-{formatTime(timetable.end_time)}
                          </div>
                          <div className="flex items-center gap-1 text-xs opacity-75">
                            <MapPin className="h-3 w-3" />
                            {timetable.room?.code}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Vue Mois */}
      {viewMode === 'month' && (
        <Card>
          <CardContent className="p-0">
            <div className="grid grid-cols-7 border-b">
              {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
                <div key={day} className="p-4 border-r bg-muted text-center font-medium">
                  {day}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-7">
              {dates.map((date, index) => {
                const dateKey = date.toISOString().split('T')[0];
                const dayTimetables = timetablesByDate[dateKey] || [];
                const isCurrentMonth = date.getMonth() === currentDate.getMonth();
                const isToday = date.toDateString() === new Date().toDateString();

                return (
                  <div
                    key={index}
                    className={cn(
                      "min-h-[120px] border-r border-b p-2",
                      !isCurrentMonth && "bg-muted/30 text-muted-foreground",
                      isToday && "bg-blue-50"
                    )}
                  >
                    <div className={cn(
                      "text-sm font-medium mb-2",
                      isToday && "text-blue-600"
                    )}>
                      {date.getDate()}
                    </div>
                    
                    <div className="space-y-1">
                      {dayTimetables.slice(0, 3).map(timetable => (
                        <div
                          key={timetable.id}
                          className={cn(
                            "p-1 rounded text-xs border truncate",
                            getSlotTypeColor(timetable.slot_type)
                          )}
                        >
                          <div className="font-medium truncate">
                            {formatTime(timetable.start_time)} {timetable.subject?.code}
                          </div>
                        </div>
                      ))}
                      {dayTimetables.length > 3 && (
                        <div className="text-xs text-muted-foreground">
                          +{dayTimetables.length - 3} autres
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
