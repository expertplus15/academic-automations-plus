import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { CalendarDays, Clock, User, MapPin, CheckCircle, AlertCircle } from 'lucide-react';

export function AppointmentBooking() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedCounselor, setSelectedCounselor] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [reason, setReason] = useState('');

  const counselors = [
    {
      id: 1,
      name: 'Dr. Marie Dubois',
      specialty: 'Orientation scolaire',
      experience: '15 ans',
      description: 'Spécialiste en psychologie de l\'orientation, accompagnement personnalisé',
      availableDays: ['monday', 'tuesday', 'wednesday', 'friday'],
      rating: 4.9
    },
    {
      id: 2,
      name: 'M. Pierre Martin',
      specialty: 'Insertion professionnelle',
      experience: '12 ans',
      description: 'Expert en insertion professionnelle et coaching carrière',
      availableDays: ['tuesday', 'wednesday', 'thursday', 'friday'],
      rating: 4.8
    },
    {
      id: 3,
      name: 'Mme Sophie Laurent',
      specialty: 'Reconversion',
      experience: '10 ans',
      description: 'Accompagnement en reconversion professionnelle et bilans de compétences',
      availableDays: ['monday', 'wednesday', 'thursday'],
      rating: 4.7
    }
  ];

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
  ];

  const myAppointments = [
    {
      id: 1,
      counselorName: 'Dr. Marie Dubois',
      date: '2024-01-18',
      time: '14:30',
      duration: 60,
      reason: 'Choix de spécialisation master',
      status: 'confirmed',
      location: 'Bureau 204 - Bâtiment A'
    },
    {
      id: 2,
      counselorName: 'M. Pierre Martin',
      date: '2024-01-15',
      time: '10:00',
      duration: 45,
      reason: 'Recherche de stage',
      status: 'completed',
      location: 'Bureau 301 - Bâtiment B'
    },
    {
      id: 3,
      counselorName: 'Dr. Marie Dubois',
      date: '2024-01-25',
      time: '15:00',
      duration: 60,
      reason: 'Suivi orientation',
      status: 'pending',
      location: 'Bureau 204 - Bâtiment A'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <AlertCircle className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Prise de rendez-vous */}
        <Card>
          <CardHeader>
            <CardTitle>Prendre un rendez-vous</CardTitle>
            <CardDescription>
              Choisissez un conseiller et planifiez votre entretien d'orientation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Choix du conseiller */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Choisir un conseiller</label>
              <Select value={selectedCounselor} onValueChange={setSelectedCounselor}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un conseiller" />
                </SelectTrigger>
                <SelectContent>
                  {counselors.map((counselor) => (
                    <SelectItem key={counselor.id} value={counselor.id.toString()}>
                      <div className="flex flex-col">
                        <span>{counselor.name}</span>
                        <span className="text-xs text-muted-foreground">{counselor.specialty}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Informations du conseiller sélectionné */}
            {selectedCounselor && (
              <div className="p-4 border rounded-lg bg-muted/50">
                {counselors
                  .filter(c => c.id.toString() === selectedCounselor)
                  .map((counselor) => (
                    <div key={counselor.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{counselor.name}</h4>
                        <div className="flex items-center gap-1">
                          <span className="text-sm">⭐ {counselor.rating}</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{counselor.description}</p>
                      <div className="flex items-center gap-4 text-xs">
                        <span>Expérience: {counselor.experience}</span>
                        <span>Spécialité: {counselor.specialty}</span>
                      </div>
                    </div>
                  ))}
              </div>
            )}

            {/* Calendrier */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Choisir une date</label>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={(date) => date < new Date() || date.getDay() === 0 || date.getDay() === 6}
                className="rounded-md border w-fit"
              />
            </div>

            {/* Créneaux horaires */}
            {selectedDate && (
              <div className="space-y-3">
                <label className="text-sm font-medium">Choisir un créneau</label>
                <div className="grid grid-cols-3 gap-2">
                  {timeSlots.map((time) => (
                    <Button
                      key={time}
                      variant={selectedTime === time ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedTime(time)}
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Motif du rendez-vous */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Motif du rendez-vous</label>
              <Textarea
                placeholder="Décrivez brièvement l'objet de votre demande..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
              />
            </div>

            <Button 
              className="w-full"
              disabled={!selectedCounselor || !selectedDate || !selectedTime || !reason}
            >
              Confirmer le rendez-vous
            </Button>
          </CardContent>
        </Card>

        {/* Mes rendez-vous */}
        <Card>
          <CardHeader>
            <CardTitle>Mes rendez-vous</CardTitle>
            <CardDescription>
              Vos entretiens d'orientation planifiés et passés
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {myAppointments.map((appointment) => (
                <div key={appointment.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{appointment.counselorName}</h4>
                      <p className="text-sm text-muted-foreground">{appointment.reason}</p>
                    </div>
                    <Badge className={getStatusColor(appointment.status)}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(appointment.status)}
                        {appointment.status === 'confirmed' ? 'Confirmé' :
                         appointment.status === 'pending' ? 'En attente' :
                         appointment.status === 'completed' ? 'Terminé' : 'Annulé'}
                      </div>
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="w-4 h-4 text-muted-foreground" />
                      <span>{new Date(appointment.date).toLocaleDateString('fr-FR')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span>{appointment.time} ({appointment.duration}min)</span>
                    </div>
                    <div className="flex items-center gap-2 col-span-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{appointment.location}</span>
                    </div>
                  </div>

                  {appointment.status === 'confirmed' && (
                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm">
                        Modifier
                      </Button>
                      <Button variant="destructive" size="sm">
                        Annuler
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}