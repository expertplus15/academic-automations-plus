
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Calendar as CalendarIcon, 
  Plus, 
  Filter, 
  Download,
  BookOpen,
  GraduationCap,
  Clock,
  Users
} from 'lucide-react';
import { format, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { fr } from 'date-fns/locale';

interface AcademicEvent {
  id: string;
  title: string;
  date: Date;
  type: 'exam' | 'holiday' | 'deadline' | 'semester_start' | 'semester_end' | 'course';
  description?: string;
  program?: string;
  level?: string;
}

export function AcademicCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'agenda'>('month');
  const [filterType, setFilterType] = useState<string>('all');

  // Mock academic events
  const [events, setEvents] = useState<AcademicEvent[]>([
    {
      id: '1',
      title: 'Début du semestre',
      date: new Date(2025, 0, 15),
      type: 'semester_start',
      description: 'Début des cours du semestre de printemps'
    },
    {
      id: '2',
      title: 'Examen de Mathématiques',
      date: new Date(2025, 0, 20),
      type: 'exam',
      program: 'Informatique',
      level: 'L1'
    },
    {
      id: '3',
      title: 'Vacances d\'hiver',
      date: new Date(2025, 1, 10),
      type: 'holiday',
      description: 'Congés scolaires'
    },
    {
      id: '4',
      title: 'Date limite projet',
      date: new Date(2025, 0, 25),
      type: 'deadline',
      program: 'Informatique',
      description: 'Remise du projet final'
    }
  ]);

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'exam': return 'bg-red-100 text-red-800 border-red-200';
      case 'holiday': return 'bg-green-100 text-green-800 border-green-200';
      case 'deadline': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'semester_start': 
      case 'semester_end': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'course': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'exam': return <BookOpen className="h-4 w-4" />;
      case 'deadline': return <Clock className="h-4 w-4" />;
      case 'semester_start':
      case 'semester_end': return <GraduationCap className="h-4 w-4" />;
      case 'course': return <Users className="h-4 w-4" />;
      default: return <CalendarIcon className="h-4 w-4" />;
    }
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => isSameDay(event.date, date));
  };

  const filteredEvents = events.filter(event => 
    filterType === 'all' || event.type === filterType
  );

  const currentMonthEvents = events.filter(event => {
    const monthStart = startOfMonth(selectedDate);
    const monthEnd = endOfMonth(selectedDate);
    return event.date >= monthStart && event.date <= monthEnd;
  });

  return (
    <div className="space-y-6">
      {/* En-tête et contrôles */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Calendrier Académique
            </CardTitle>
            <div className="flex items-center gap-4">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les événements</SelectItem>
                  <SelectItem value="exam">Examens</SelectItem>
                  <SelectItem value="holiday">Vacances</SelectItem>
                  <SelectItem value="deadline">Échéances</SelectItem>
                  <SelectItem value="semester_start">Début semestre</SelectItem>
                  <SelectItem value="semester_end">Fin semestre</SelectItem>
                </SelectContent>
              </Select>

              <Select value={viewMode} onValueChange={(value: 'month' | 'agenda') => setViewMode(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="month">Mois</SelectItem>
                  <SelectItem value="agenda">Agenda</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exporter
              </Button>

              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Nouvel événement
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendrier principal */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              {viewMode === 'month' ? (
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  locale={fr}
                  className="w-full"
                  components={{
                    Day: ({ date, ...props }) => {
                      const dayEvents = getEventsForDate(date);
                      return (
                        <div className="relative">
                          <button {...props} className={props.className}>
                            {date.getDate()}
                          </button>
                          {dayEvents.length > 0 && (
                            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
                              <div className="flex gap-1">
                                {dayEvents.slice(0, 3).map((event, index) => (
                                  <div
                                    key={index}
                                    className={`w-1.5 h-1.5 rounded-full ${
                                      event.type === 'exam' ? 'bg-red-500' :
                                      event.type === 'holiday' ? 'bg-green-500' :
                                      event.type === 'deadline' ? 'bg-orange-500' :
                                      'bg-blue-500'
                                    }`}
                                  />
                                ))}
                                {dayEvents.length > 3 && (
                                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    }
                  }}
                />
              ) : (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">
                    Événements - {format(selectedDate, 'MMMM yyyy', { locale: fr })}
                  </h3>
                  <div className="space-y-3">
                    {currentMonthEvents
                      .filter(event => filterType === 'all' || event.type === filterType)
                      .sort((a, b) => a.date.getTime() - b.date.getTime())
                      .map((event) => (
                        <div key={event.id} className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                          <div className="flex items-start justify-between">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className={getEventTypeColor(event.type)}>
                                  {getEventTypeIcon(event.type)}
                                  <span className="ml-1 capitalize">
                                    {event.type.replace('_', ' ')}
                                  </span>
                                </Badge>
                                <span className="text-sm text-muted-foreground">
                                  {format(event.date, 'dd/MM/yyyy')}
                                </span>
                              </div>
                              <h4 className="font-medium">{event.title}</h4>
                              {event.description && (
                                <p className="text-sm text-muted-foreground">{event.description}</p>
                              )}
                              {(event.program || event.level) && (
                                <div className="flex gap-2">
                                  {event.program && (
                                    <Badge variant="outline">{event.program}</Badge>
                                  )}
                                  {event.level && (
                                    <Badge variant="outline">{event.level}</Badge>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Panneau latéral */}
        <div className="space-y-6">
          {/* Événements du jour sélectionné */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                {format(selectedDate, 'dd MMMM yyyy', { locale: fr })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {getEventsForDate(selectedDate).length > 0 ? (
                <div className="space-y-3">
                  {getEventsForDate(selectedDate).map((event) => (
                    <div key={event.id} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={getEventTypeColor(event.type)}>
                          {getEventTypeIcon(event.type)}
                          <span className="ml-1 text-xs">
                            {event.type.replace('_', ' ')}
                          </span>
                        </Badge>
                      </div>
                      <h4 className="font-medium text-sm">{event.title}</h4>
                      {event.description && (
                        <p className="text-xs text-muted-foreground">{event.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Aucun événement ce jour</p>
              )}
            </CardContent>
          </Card>

          {/* Statistiques du mois */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Statistiques du mois</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Examens</span>
                  <Badge variant="outline" className="bg-red-50">
                    {currentMonthEvents.filter(e => e.type === 'exam').length}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Échéances</span>
                  <Badge variant="outline" className="bg-orange-50">
                    {currentMonthEvents.filter(e => e.type === 'deadline').length}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Congés</span>
                  <Badge variant="outline" className="bg-green-50">
                    {currentMonthEvents.filter(e => e.type === 'holiday').length}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
