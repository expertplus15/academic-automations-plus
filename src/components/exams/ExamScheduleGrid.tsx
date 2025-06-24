
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calendar, Clock, MapPin, Users, BookOpen, ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';
import { ExamSession } from '@/hooks/useExams';
import { format, startOfWeek, addWeeks, addDays, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ExamScheduleGridProps {
  sessions: ExamSession[];
  onSessionClick?: (session: ExamSession) => void;
  onCreateSession?: () => void;
  loading?: boolean;
  error?: string | null;
}

export function ExamScheduleGrid({ 
  sessions, 
  onSessionClick, 
  onCreateSession,
  loading = false,
  error = null
}: ExamScheduleGridProps) {
  const [selectedWeek, setSelectedWeek] = useState(new Date());
  const [viewMode, setViewMode] = useState<'week' | 'day'>('week');

  // Générer les jours de la semaine
  const weekDays = useMemo(() => {
    const start = startOfWeek(selectedWeek, { weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  }, [selectedWeek]);

  // Créneaux horaires étendus
  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00', 
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'
  ];

  // Filtrer et organiser les sessions par jour et heure
  const sessionsByDayAndTime = useMemo(() => {
    const organized: Record<string, Record<string, ExamSession[]>> = {};
    
    sessions.forEach(session => {
      const sessionDate = new Date(session.start_time);
      const dateKey = format(sessionDate, 'yyyy-MM-dd');
      const timeKey = format(sessionDate, 'HH:mm');
      
      if (!organized[dateKey]) {
        organized[dateKey] = {};
      }
      if (!organized[dateKey][timeKey]) {
        organized[dateKey][timeKey] = [];
      }
      organized[dateKey][timeKey].push(session);
    });
    
    return organized;
  }, [sessions]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      scheduled: { label: 'Planifié', className: 'bg-blue-100 text-blue-800' },
      in_progress: { label: 'En cours', className: 'bg-green-100 text-green-800' },
      completed: { label: 'Terminé', className: 'bg-gray-100 text-gray-800' },
      cancelled: { label: 'Annulé', className: 'bg-red-100 text-red-800' },
      postponed: { label: 'Reporté', className: 'bg-yellow-100 text-yellow-800' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.scheduled;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    setSelectedWeek(prev => addWeeks(prev, direction === 'next' ? 1 : -1));
  };

  const formatSessionTime = (startTime: string, endTime: string) => {
    return `${format(new Date(startTime), 'HH:mm')} - ${format(new Date(endTime), 'HH:mm')}`;
  };

  const getSessionsForSlot = (day: Date, time: string) => {
    const dateKey = format(day, 'yyyy-MM-dd');
    return sessionsByDayAndTime[dateKey]?.[time] || [];
  };

  const renderSessionCard = (session: ExamSession) => (
    <div
      key={session.id}
      className="bg-white border border-blue-200 rounded-lg p-2 mb-1 cursor-pointer hover:bg-blue-50 transition-colors shadow-sm"
      onClick={() => onSessionClick?.(session)}
    >
      <div className="flex items-center gap-1 mb-1">
        <BookOpen className="w-3 h-3 text-blue-600 flex-shrink-0" />
        <span className="text-xs font-medium truncate">
          Examen #{session.exam_id.slice(-6)}
        </span>
      </div>
      
      <div className="flex items-center gap-1 mb-1">
        <Clock className="w-3 h-3 text-gray-500 flex-shrink-0" />
        <span className="text-xs text-gray-600">
          {formatSessionTime(session.start_time, session.end_time)}
        </span>
      </div>
      
      <div className="flex items-center gap-1 mb-1">
        <Users className="w-3 h-3 text-gray-500 flex-shrink-0" />
        <span className="text-xs text-gray-600">
          {session.actual_students_count} étudiants
        </span>
      </div>
      
      <div className="flex justify-between items-center">
        {getStatusBadge(session.status)}
        {session.room_id && (
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3 text-gray-400" />
            <span className="text-xs text-gray-500">
              Salle #{session.room_id.slice(-4)}
            </span>
          </div>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Chargement du planning...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Erreur lors du chargement du planning: {error}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            Planning des Examens
          </CardTitle>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigateWeek('prev')}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              
              <span className="text-sm font-medium px-3 py-1 bg-muted rounded">
                {format(selectedWeek, 'dd MMMM yyyy', { locale: fr })}
              </span>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigateWeek('next')}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            
            {onCreateSession && (
              <Button onClick={onCreateSession} size="sm">
                Nouveau Créneau
              </Button>
            )}
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'week' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('week')}
          >
            Vue Semaine
          </Button>
          <Button
            variant={viewMode === 'day' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('day')}
          >
            Vue Jour
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* En-têtes des jours */}
        <div className="grid grid-cols-8 gap-1 mb-4">
          <div className="p-2 text-sm font-medium text-center bg-muted/50 rounded">
            Heure
          </div>
          {weekDays.map((day, index) => (
            <div key={index} className="p-2 text-sm font-medium text-center bg-muted/50 rounded">
              <div className="font-semibold">
                {format(day, 'EEE', { locale: fr })}
              </div>
              <div className="text-xs text-muted-foreground">
                {format(day, 'd MMM', { locale: fr })}
              </div>
            </div>
          ))}
        </div>

        {/* Grille des créneaux */}
        <div className="grid grid-cols-8 gap-1 max-h-96 overflow-y-auto">
          {timeSlots.map((time) => (
            <React.Fragment key={time}>
              <div className="p-2 text-sm font-medium bg-muted/30 rounded text-center sticky left-0 z-10">
                {time}
              </div>
              {weekDays.map((day, dayIndex) => {
                const sessionsInSlot = getSessionsForSlot(day, time);
                const isToday = isSameDay(day, new Date());
                
                return (
                  <div 
                    key={`${time}-${dayIndex}`} 
                    className={`min-h-[100px] p-1 border border-border/30 rounded transition-colors ${
                      isToday ? 'bg-blue-50/50' : 'hover:bg-muted/20'
                    }`}
                  >
                    {sessionsInSlot.map(renderSessionCard)}
                    
                    {sessionsInSlot.length === 0 && onCreateSession && (
                      <button
                        onClick={() => onCreateSession()}
                        className="w-full h-full min-h-[80px] border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center text-gray-400 hover:border-blue-300 hover:text-blue-500 transition-colors group"
                      >
                        <div className="text-center">
                          <div className="text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                            + Ajouter
                          </div>
                        </div>
                      </button>
                    )}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>

        {/* Statistiques rapides */}
        <div className="mt-4 p-3 bg-muted/30 rounded-lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="font-semibold text-blue-600">
                {sessions.filter(s => s.status === 'scheduled').length}
              </div>
              <div className="text-muted-foreground">Planifiés</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-green-600">
                {sessions.filter(s => s.status === 'completed').length}
              </div>
              <div className="text-muted-foreground">Terminés</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-orange-600">
                {sessions.filter(s => s.status === 'in_progress').length}
              </div>
              <div className="text-muted-foreground">En cours</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-purple-600">
                {sessions.reduce((acc, s) => acc + s.actual_students_count, 0)}
              </div>
              <div className="text-muted-foreground">Étudiants total</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
