import React, { useState } from 'react';
import { CommunicationModuleLayout } from '@/components/layouts/CommunicationModuleLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { NewEventModal } from '@/components/communication/NewEventModal';
import { EventDetailsModal } from '@/components/communication/EventDetailsModal';
import { Calendar, Plus, MapPin, Clock, Users, ChevronLeft, ChevronRight, Eye, Edit } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const initialEvents = [
  {
    id: 1,
    title: "Portes ouvertes",
    date: "2024-01-20",
    time: "09:00",
    location: "Campus principal",
    type: "public",
    attendees: 156,
    description: "Découvrez notre établissement et nos formations"
  },
  {
    id: 2,
    title: "Conférence métiers du numérique",
    date: "2024-01-22",
    time: "14:00",
    location: "Amphithéâtre A",
    type: "academic",
    attendees: 89,
    description: "Rencontrez des professionnels du secteur"
  },
  {
    id: 3,
    title: "Remise des diplômes",
    date: "2024-01-25",
    time: "18:00",
    location: "Grande salle",
    type: "ceremony",
    attendees: 234,
    description: "Cérémonie de remise des diplômes promotion 2023"
  },
  {
    id: 4,
    title: "Formation premiers secours",
    date: "2024-01-28",
    time: "10:00",
    location: "Salle de formation",
    type: "training",
    attendees: 25,
    description: "Formation obligatoire pour le personnel"
  }
];

export default function Events() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'list'>('month');
  const [showNewEventModal, setShowNewEventModal] = useState(false);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventsData, setEventsData] = useState(initialEvents);
  const { toast } = useToast();

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const handleCreateEvent = (eventData: any) => {
    const newEvent = {
      id: eventsData.length + 1,
      title: eventData.title,
      date: eventData.date,
      time: eventData.time,
      location: eventData.location,
      type: eventData.type,
      attendees: 0,
      description: eventData.description
    };
    
    setEventsData(prev => [...prev, newEvent]);
    toast({
      title: "Événement créé",
      description: `L'événement "${eventData.title}" a été créé avec succès.`,
    });
  };

  const handleViewEvent = (eventId: number) => {
    const event = eventsData.find(e => e.id === eventId);
    setSelectedEvent(event);
    setShowEventDetails(true);
  };

  const handleEditEvent = (eventId: number) => {
    toast({
      title: "Modifier l'événement",
      description: `Modification de l'événement #${eventId}`,
    });
  };

  const headerActions = [
    {
      label: "Nouvel événement",
      icon: Plus,
      onClick: () => setShowNewEventModal(true),
      variant: 'default' as const
    }
  ];


  const getEventTypeBadge = (type: string) => {
    switch (type) {
      case 'public':
        return <Badge variant="default" className="bg-blue-100 text-blue-800">Public</Badge>;
      case 'academic':
        return <Badge variant="default" className="bg-green-100 text-green-800">Académique</Badge>;
      case 'ceremony':
        return <Badge variant="default" className="bg-purple-100 text-purple-800">Cérémonie</Badge>;
      case 'training':
        return <Badge variant="default" className="bg-orange-100 text-orange-800">Formation</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <ProtectedRoute allowedRoles={['admin', 'teacher', 'hr', 'student']}>
      <CommunicationModuleLayout 
        showHeader={true}
        title="Événements & Calendrier"
        subtitle="Organisez et suivez les événements de l'établissement"
        actions={headerActions}
      >
        <div className="p-6 space-y-6">
          {/* Calendar Navigation */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Calendrier des événements
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setViewMode('month')} 
                          className={viewMode === 'month' ? 'bg-primary text-primary-foreground' : ''}>
                    Mois
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setViewMode('week')}
                          className={viewMode === 'week' ? 'bg-primary text-primary-foreground' : ''}>
                    Semaine
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setViewMode('list')}
                          className={viewMode === 'list' ? 'bg-primary text-primary-foreground' : ''}>
                    Liste
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <h3 className="text-lg font-medium">
                    {currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                  </h3>
                  <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
                <Button variant="outline" size="sm" onClick={goToToday}>
                  Aujourd'hui
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {viewMode === 'list' ? (
                <div className="space-y-4">
                  {eventsData.map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Calendar className="w-6 h-6 text-primary" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium">{event.title}</h3>
                            {getEventTypeBadge(event.type)}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{event.description}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatDate(event.date)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {event.time}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {event.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {event.attendees} participants
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleViewEvent(event.id)}>
                          <Eye className="w-4 h-4 mr-2" />
                          Voir
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleEditEvent(event.id)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Modifier
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">Vue calendrier en développement</p>
                  <p>La vue calendrier graphique sera disponible prochainement.</p>
                  <p>Utilisez la vue liste pour consulter les événements.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Événements à venir</CardTitle>
                <CardDescription>
                  Prochains événements de la semaine
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {eventsData.slice(0, 3).map((event) => (
                    <div key={event.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{event.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {event.date} à {event.time} - {event.location}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Statistiques</CardTitle>
                <CardDescription>
                  Aperçu des événements ce mois
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Événements planifiés</span>
                  <span className="font-medium">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Participants inscrits</span>
                  <span className="font-medium">1,234</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Événements publics</span>
                  <span className="font-medium">5</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Formations programmées</span>
                  <span className="font-medium">3</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <NewEventModal
          open={showNewEventModal}
          onOpenChange={setShowNewEventModal}
          onSave={handleCreateEvent}
        />
        
        <EventDetailsModal
          open={showEventDetails}
          onOpenChange={setShowEventDetails}
          event={selectedEvent}
        />
      </CommunicationModuleLayout>
    </ProtectedRoute>
  );
}