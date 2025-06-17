
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Users, BookOpen } from 'lucide-react';
import { ExamSession } from '@/hooks/useExams';

interface ExamScheduleGridProps {
  sessions: ExamSession[];
  onSessionClick?: (session: ExamSession) => void;
  onCreateSession?: () => void;
}

export function ExamScheduleGrid({ sessions, onSessionClick, onCreateSession }: ExamScheduleGridProps) {
  const [selectedWeek, setSelectedWeek] = useState(new Date());

  // Générer les jours de la semaine
  const getWeekDays = (date: Date) => {
    const week = [];
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay() + 1); // Lundi
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      week.push(day);
    }
    return week;
  };

  // Générer les créneaux horaires
  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00', 
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
  ];

  const weekDays = getWeekDays(selectedWeek);

  // Filtrer les sessions pour la semaine sélectionnée
  const getSessionsForTimeSlot = (day: Date, time: string) => {
    return sessions.filter(session => {
      const sessionDate = new Date(session.start_time);
      const sessionTime = sessionDate.toLocaleTimeString('fr-FR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      
      return sessionDate.toDateString() === day.toDateString() && 
             sessionTime === time;
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Badge className="bg-blue-100 text-blue-800">Planifié</Badge>;
      case 'in_progress':
        return <Badge className="bg-green-100 text-green-800">En cours</Badge>;
      case 'completed':
        return <Badge className="bg-gray-100 text-gray-800">Terminé</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Annulé</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            Planning des Examens
          </CardTitle>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => {
                const prevWeek = new Date(selectedWeek);
                prevWeek.setDate(selectedWeek.getDate() - 7);
                setSelectedWeek(prevWeek);
              }}
            >
              ← Semaine précédente
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                const nextWeek = new Date(selectedWeek);
                nextWeek.setDate(selectedWeek.getDate() + 7);
                setSelectedWeek(nextWeek);
              }}
            >
              Semaine suivante →
            </Button>
            {onCreateSession && (
              <Button onClick={onCreateSession}>
                Nouveau Créneau
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-8 gap-1 mb-4">
          <div className="p-2 text-sm font-medium text-center">Heure</div>
          {weekDays.map((day, index) => (
            <div key={index} className="p-2 text-sm font-medium text-center">
              <div>{day.toLocaleDateString('fr-FR', { weekday: 'short' })}</div>
              <div className="text-xs text-muted-foreground">
                {day.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-8 gap-1">
          {timeSlots.map((time) => (
            <React.Fragment key={time}>
              <div className="p-2 text-sm font-medium bg-muted/50 rounded text-center">
                {time}
              </div>
              {weekDays.map((day, dayIndex) => {
                const sessionsInSlot = getSessionsForTimeSlot(day, time);
                return (
                  <div 
                    key={`${time}-${dayIndex}`} 
                    className="min-h-[80px] p-1 border border-border/50 rounded hover:bg-muted/30 transition-colors"
                  >
                    {sessionsInSlot.map((session) => (
                      <div
                        key={session.id}
                        className="bg-blue-50 border border-blue-200 rounded p-2 mb-1 cursor-pointer hover:bg-blue-100 transition-colors"
                        onClick={() => onSessionClick?.(session)}
                      >
                        <div className="flex items-center gap-1 mb-1">
                          <BookOpen className="w-3 h-3 text-blue-600" />
                          <span className="text-xs font-medium truncate">
                            Examen #{session.exam_id.slice(-6)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 mb-1">
                          <Clock className="w-3 h-3 text-gray-500" />
                          <span className="text-xs text-gray-600">
                            {new Date(session.start_time).toLocaleTimeString('fr-FR', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })} - {new Date(session.end_time).toLocaleTimeString('fr-FR', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 mb-1">
                          <Users className="w-3 h-3 text-gray-500" />
                          <span className="text-xs text-gray-600">
                            {session.actual_students_count} étudiants
                          </span>
                        </div>
                        {getStatusBadge(session.status)}
                      </div>
                    ))}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
