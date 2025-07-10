import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, Users, ChevronLeft, ChevronRight } from 'lucide-react';

export function ActivityCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewType, setViewType] = useState<'week' | 'month'>('week');

  const events = [
    {
      id: 1,
      title: 'Football - Entraînement',
      activityType: 'sport',
      date: '2024-01-16',
      startTime: '18:00',
      endTime: '20:00',
      location: 'Terrain de football',
      instructor: 'Coach Martin',
      participants: 18,
      maxParticipants: 25,
      status: 'confirmed'
    },
    {
      id: 2,
      title: 'Théâtre - Répétition',
      activityType: 'culture',
      date: '2024-01-17',
      startTime: '17:00',
      endTime: '18:30',
      location: 'Salle de théâtre',
      instructor: 'Marie Dubois',
      participants: 12,
      maxParticipants: 15,
      status: 'confirmed'
    },
    {
      id: 3,
      title: 'Association - Réunion',
      activityType: 'associatif',
      date: '2024-01-18',
      startTime: '19:00',
      endTime: '20:30',
      location: 'Salle de réunion A',
      instructor: 'Bureau de l\'association',
      participants: 25,
      maxParticipants: 50,
      status: 'confirmed'
    },
    {
      id: 4,
      title: 'Football - Match amical',
      activityType: 'sport',
      date: '2024-01-19',
      startTime: '15:00',
      endTime: '17:00',
      location: 'Terrain de football',
      instructor: 'Coach Martin',
      participants: 22,
      maxParticipants: 25,
      status: 'confirmed'
    },
    {
      id: 5,
      title: 'Natation - Cours technique',
      activityType: 'sport',
      date: '2024-01-19',
      startTime: '12:00',
      endTime: '13:00',
      location: 'Piscine universitaire',
      instructor: 'Sarah Laurent',
      participants: 15,
      maxParticipants: 20,
      status: 'confirmed'
    },
    {
      id: 6,
      title: 'Photographie - Sortie terrain',
      activityType: 'culture',
      date: '2024-01-20',
      startTime: '14:00',
      endTime: '16:00',
      location: 'Centre-ville',
      instructor: 'Alex Rousseau',
      participants: 8,
      maxParticipants: 12,
      status: 'confirmed'
    }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'sport': return 'border-l-blue-500 bg-blue-50';
      case 'culture': return 'border-l-purple-500 bg-purple-50';
      case 'associatif': return 'border-l-green-500 bg-green-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  const getWeekDays = () => {
    const startOfWeek = new Date(currentDate);
    const dayOfWeek = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    startOfWeek.setDate(diff);

    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const getEventsForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return events.filter(event => event.date === dateString);
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentDate(newDate);
  };

  const weekDays = getWeekDays();
  const dayNames = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  return (
    <div className="space-y-6">
      {/* Navigation */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold">
            Semaine du {weekDays[0].toLocaleDateString('fr-FR')}
          </h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => navigateWeek('prev')}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
              Aujourd'hui
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigateWeek('next')}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            variant={viewType === 'week' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setViewType('week')}
          >
            Semaine
          </Button>
          <Button 
            variant={viewType === 'month' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setViewType('month')}
          >
            Mois
          </Button>
        </div>
      </div>

      {/* Vue semaine */}
      {viewType === 'week' && (
        <div className="grid grid-cols-7 gap-4">
          {weekDays.map((day, index) => {
            const dayEvents = getEventsForDate(day);
            const isToday = day.toDateString() === new Date().toDateString();
            
            return (
              <div key={index} className="space-y-2">
                <div className={`text-center p-2 rounded-lg ${isToday ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                  <div className="font-medium">{dayNames[index]}</div>
                  <div className="text-lg">{day.getDate()}</div>
                </div>
                
                <div className="space-y-2 min-h-[300px]">
                  {dayEvents.map((event) => (
                    <Card key={event.id} className={`border-l-4 ${getCategoryColor(event.activityType)} cursor-pointer hover:shadow-md transition-shadow`}>
                      <CardContent className="p-3">
                        <div className="space-y-1">
                          <div className="font-medium text-sm">{event.title}</div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {event.startTime} - {event.endTime}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="w-3 h-3" />
                            {event.location}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Users className="w-3 h-3" />
                            {event.participants}/{event.maxParticipants}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Liste des événements à venir */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Prochains événements
          </CardTitle>
          <CardDescription>
            Vos activités programmées pour les 7 prochains jours
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {events.slice(0, 5).map((event) => (
              <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    event.activityType === 'sport' ? 'bg-blue-500' :
                    event.activityType === 'culture' ? 'bg-purple-500' : 'bg-green-500'
                  }`} />
                  <div>
                    <div className="font-medium">{event.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(event.date).toLocaleDateString('fr-FR')} à {event.startTime}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="outline">{event.location}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}