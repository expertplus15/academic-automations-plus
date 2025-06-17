
import React, { useState, useMemo } from 'react';
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
  Users,
  Edit3,
  Trash2
} from 'lucide-react';
import { format, isSameDay, startOfMonth, endOfMonth, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { DayProps } from 'react-day-picker';
import { useAcademicEvents } from '@/hooks/useAcademicEvents';
import { useAcademicYears } from '@/hooks/useAcademicYears';
import { AcademicEventModal } from './calendar/AcademicEventModal';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

export function DynamicAcademicCalendar() {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'agenda'>('month');
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedAcademicYear, setSelectedAcademicYear] = useState<string>('');
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  const { academicYears, currentYear } = useAcademicYears();
  const { 
    events, 
    loading, 
    createEvent, 
    updateEvent, 
    deleteEvent 
  } = useAcademicEvents(selectedAcademicYear || currentYear?.id);

  // Définir l'année académique par défaut
  React.useEffect(() => {
    if (currentYear && !selectedAcademicYear) {
      setSelectedAcademicYear(currentYear.id);
    }
  }, [currentYear, selectedAcademicYear]);

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'exam_period': return 'bg-red-100 text-red-800 border-red-200';
      case 'holiday': return 'bg-green-100 text-green-800 border-green-200';
      case 'deadline': 
      case 'registration': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'semester_start': 
      case 'semester_end': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'graduation':
      case 'orientation': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'exam_period': return <BookOpen className="h-4 w-4" />;
      case 'deadline': 
      case 'registration': return <Clock className="h-4 w-4" />;
      case 'semester_start':
      case 'semester_end': return <GraduationCap className="h-4 w-4" />;
      case 'orientation':
      case 'graduation': return <Users className="h-4 w-4" />;
      default: return <CalendarIcon className="h-4 w-4" />;
    }
  };

  const getEventTypeLabel = (type: string) => {
    const labels = {
      'semester_start': 'Début semestre',
      'semester_end': 'Fin semestre',
      'exam_period': 'Examens',
      'holiday': 'Vacances',
      'registration': 'Inscription',
      'deadline': 'Échéance',
      'orientation': 'Orientation',
      'graduation': 'Remise diplômes',
      'conference': 'Conférence',
      'other': 'Autre'
    };
    return labels[type] || type;
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const startDate = parseISO(event.start_date);
      const endDate = parseISO(event.end_date);
      return date >= startDate && date <= endDate;
    });
  };

  const filteredEvents = useMemo(() => {
    return events.filter(event => 
      filterType === 'all' || event.event_type === filterType
    );
  }, [events, filterType]);

  const currentMonthEvents = useMemo(() => {
    const monthStart = startOfMonth(selectedDate);
    const monthEnd = endOfMonth(selectedDate);
    
    return filteredEvents.filter(event => {
      const startDate = parseISO(event.start_date);
      const endDate = parseISO(event.end_date);
      return (startDate <= monthEnd && endDate >= monthStart);
    });
  }, [filteredEvents, selectedDate]);

  const handleEventSave = async (eventData: any) => {
    if (editingEvent) {
      return await updateEvent(editingEvent.id, eventData);
    } else {
      return await createEvent(eventData);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
      const result = await deleteEvent(eventId);
      if (result.success) {
        toast({
          title: "Succès",
          description: "Événement supprimé avec succès"
        });
      } else {
        toast({
          title: "Erreur",
          description: result.error || "Erreur lors de la suppression",
          variant: "destructive"
        });
      }
    }
  };

  const CustomDay = (props: DayProps) => {
    const { date, ...dayProps } = props;
    const dayEvents = getEventsForDate(date);
    
    return (
      <div className="relative">
        <button {...dayProps}>
          {date.getDate()}
        </button>
        {dayEvents.length > 0 && (
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
            <div className="flex gap-1">
              {dayEvents.slice(0, 3).map((event, index) => (
                <div
                  key={index}
                  className={`w-1.5 h-1.5 rounded-full ${
                    event.event_type === 'exam_period' ? 'bg-red-500' :
                    event.event_type === 'holiday' ? 'bg-green-500' :
                    event.event_type === 'deadline' ? 'bg-orange-500' :
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
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Chargement du calendrier...</div>
      </div>
    );
  }

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
              <Select value={selectedAcademicYear} onValueChange={setSelectedAcademicYear}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Année académique" />
                </SelectTrigger>
                <SelectContent>
                  {academicYears.map((year) => (
                    <SelectItem key={year.id} value={year.id}>
                      {year.name} {year.is_current && '(Actuelle)'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les événements</SelectItem>
                  <SelectItem value="exam_period">Examens</SelectItem>
                  <SelectItem value="holiday">Vacances</SelectItem>
                  <SelectItem value="deadline">Échéances</SelectItem>
                  <SelectItem value="semester_start">Début semestre</SelectItem>
                  <SelectItem value="semester_end">Fin semestre</SelectItem>
                  <SelectItem value="registration">Inscriptions</SelectItem>
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

              <Button 
                size="sm" 
                onClick={() => {
                  setEditingEvent(null);
                  setIsEventModalOpen(true);
                }}
              >
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
                    Day: CustomDay
                  }}
                />
              ) : (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">
                    Événements - {format(selectedDate, 'MMMM yyyy', { locale: fr })}
                  </h3>
                  <div className="space-y-3">
                    {currentMonthEvents
                      .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())
                      .map((event) => (
                        <div key={event.id} className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                          <div className="flex items-start justify-between">
                            <div className="space-y-2 flex-1">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className={getEventTypeColor(event.event_type)}>
                                  {getEventTypeIcon(event.event_type)}
                                  <span className="ml-1">
                                    {getEventTypeLabel(event.event_type)}
                                  </span>
                                </Badge>
                                <span className="text-sm text-muted-foreground">
                                  {format(parseISO(event.start_date), 'dd/MM/yyyy')}
                                  {event.start_date !== event.end_date && 
                                    ` - ${format(parseISO(event.end_date), 'dd/MM/yyyy')}`
                                  }
                                </span>
                                {event.is_holiday && (
                                  <Badge variant="secondary">Vacances</Badge>
                                )}
                              </div>
                              <h4 className="font-medium">{event.name}</h4>
                              {event.description && (
                                <p className="text-sm text-muted-foreground">{event.description}</p>
                              )}
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="h-8 w-8 p-0"
                                onClick={() => {
                                  setEditingEvent(event);
                                  setIsEventModalOpen(true);
                                }}
                              >
                                <Edit3 className="h-3 w-3" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="h-8 w-8 p-0 text-destructive"
                                onClick={() => handleDeleteEvent(event.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
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
                        <Badge variant="outline" className={getEventTypeColor(event.event_type)}>
                          {getEventTypeIcon(event.event_type)}
                          <span className="ml-1 text-xs">
                            {getEventTypeLabel(event.event_type)}
                          </span>
                        </Badge>
                      </div>
                      <h4 className="font-medium text-sm">{event.name}</h4>
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
                    {currentMonthEvents.filter(e => e.event_type === 'exam_period').length}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Échéances</span>
                  <Badge variant="outline" className="bg-orange-50">
                    {currentMonthEvents.filter(e => e.event_type === 'deadline').length}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Congés</span>
                  <Badge variant="outline" className="bg-green-50">
                    {currentMonthEvents.filter(e => e.event_type === 'holiday').length}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total événements</span>
                  <Badge variant="outline">
                    {currentMonthEvents.length}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal de création/édition d'événement */}
      <AcademicEventModal
        open={isEventModalOpen}
        onClose={() => {
          setIsEventModalOpen(false);
          setEditingEvent(null);
        }}
        event={editingEvent}
        onSave={handleEventSave}
        academicYearId={selectedAcademicYear}
      />
    </div>
  );
}
