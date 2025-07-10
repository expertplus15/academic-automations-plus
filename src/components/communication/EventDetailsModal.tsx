import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Users, Tag } from 'lucide-react';

interface EventDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: {
    id: number;
    title: string;
    date: string;
    time: string;
    location: string;
    type: string;
    attendees: number;
    description: string;
  } | null;
}

export function EventDetailsModal({ open, onOpenChange, event }: EventDetailsModalProps) {
  if (!event) return null;

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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              {event.title}
            </DialogTitle>
            {getEventTypeBadge(event.type)}
          </div>
          <DialogDescription>
            Détails de l'événement
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="prose max-w-none">
            <p className="text-muted-foreground">{event.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium">Date</p>
                  <p className="text-sm text-muted-foreground">{formatDate(event.date)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium">Heure</p>
                  <p className="text-sm text-muted-foreground">{event.time}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium">Lieu</p>
                  <p className="text-sm text-muted-foreground">{event.location}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium">Participants</p>
                  <p className="text-sm text-muted-foreground">{event.attendees} inscrits</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex items-center gap-3">
              <Tag className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium">Type d'événement</p>
                <div className="mt-1">
                  {getEventTypeBadge(event.type)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}