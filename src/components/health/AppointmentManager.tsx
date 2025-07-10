import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { CalendarDays, Clock, User, MapPin, Phone, CheckCircle, AlertCircle, Plus } from 'lucide-react';

export function AppointmentManager() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [reason, setReason] = useState('');

  const doctors = [
    {
      id: 1,
      name: 'Dr. Sophie Martin',
      specialty: 'Médecin généraliste',
      location: 'Infirmerie campus',
      phone: '01 23 45 67 89',
      availableDays: ['monday', 'tuesday', 'wednesday', 'friday'],
      consultationTypes: ['Consultation générale', 'Certificat médical', 'Renouvellement ordonnance']
    },
    {
      id: 2,
      name: 'Dr. Jean Dubois',
      specialty: 'Psychologue',
      location: 'Service santé étudiante',
      phone: '01 23 45 67 90',
      availableDays: ['tuesday', 'wednesday', 'thursday'],
      consultationTypes: ['Consultation psychologique', 'Suivi thérapeutique', 'Gestion du stress']
    },
    {
      id: 3,
      name: 'Mme Claire Rousseau',
      specialty: 'Infirmière',
      location: 'Infirmerie campus',
      phone: '01 23 45 67 91',
      availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
      consultationTypes: ['Soins infirmiers', 'Vaccination', 'Prise de tension']
    }
  ];

  const timeSlots = [
    '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
  ];

  const myAppointments = [
    {
      id: 1,
      doctorName: 'Dr. Sophie Martin',
      specialty: 'Médecin généraliste',
      date: '2024-01-18',
      time: '09:30',
      duration: 30,
      reason: 'Certificat médical pour le sport',
      status: 'confirmed',
      location: 'Infirmerie campus',
      reminderSent: true
    },
    {
      id: 2,
      doctorName: 'Dr. Jean Dubois',
      specialty: 'Psychologue',
      date: '2024-01-15',
      time: '14:00',
      duration: 45,
      reason: 'Gestion du stress examens',
      status: 'completed',
      location: 'Service santé étudiante',
      notes: 'Séance très utile, techniques de relaxation apprises'
    },
    {
      id: 3,
      doctorName: 'Mme Claire Rousseau',
      specialty: 'Infirmière',
      date: '2024-01-25',
      time: '10:00',
      duration: 15,
      reason: 'Vaccination grippe',
      status: 'pending',
      location: 'Infirmerie campus',
      reminderSent: false
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
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Prendre un rendez-vous
            </CardTitle>
            <CardDescription>
              Planifiez un rendez-vous avec un professionnel de santé
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Choix du professionnel */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Choisir un professionnel</label>
              <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un professionnel" />
                </SelectTrigger>
                <SelectContent>
                  {doctors.map((doctor) => (
                    <SelectItem key={doctor.id} value={doctor.id.toString()}>
                      <div className="flex flex-col">
                        <span>{doctor.name}</span>
                        <span className="text-xs text-muted-foreground">{doctor.specialty}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Informations du professionnel sélectionné */}
            {selectedDoctor && (
              <div className="p-4 border rounded-lg bg-muted/50">
                {doctors
                  .filter(d => d.id.toString() === selectedDoctor)
                  .map((doctor) => (
                    <div key={doctor.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{doctor.name}</h4>
                        <Badge variant="outline">{doctor.specialty}</Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        {doctor.location}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="w-4 h-4" />
                        {doctor.phone}
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Types de consultation:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {doctor.consultationTypes.map((type) => (
                            <Badge key={type} variant="secondary" className="text-xs">
                              {type}
                            </Badge>
                          ))}
                        </div>
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
                placeholder="Décrivez brièvement le motif de votre consultation..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
              />
            </div>

            <Button 
              className="w-full"
              disabled={!selectedDoctor || !selectedDate || !selectedTime || !reason}
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
              Vos consultations médicales planifiées et passées
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {myAppointments.map((appointment) => (
                <div key={appointment.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{appointment.doctorName}</h4>
                      <p className="text-sm text-muted-foreground">{appointment.specialty}</p>
                      <p className="text-sm">{appointment.reason}</p>
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

                  {appointment.notes && (
                    <div className="p-2 bg-muted rounded text-sm">
                      <strong>Notes:</strong> {appointment.notes}
                    </div>
                  )}

                  {appointment.status === 'confirmed' && (
                    <div className="flex justify-between items-center pt-2">
                      <div className="text-xs text-muted-foreground">
                        {appointment.reminderSent ? 
                          '✅ Rappel envoyé' : 
                          '⏳ Rappel à venir'
                        }
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Modifier
                        </Button>
                        <Button variant="destructive" size="sm">
                          Annuler
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Informations pratiques */}
      <Card>
        <CardHeader>
          <CardTitle>Informations pratiques</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-medium">Horaires d'ouverture</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>Lundi - Vendredi: 8h30 - 17h30</p>
                <p>Samedi: 9h00 - 12h00</p>
                <p>Dimanche: Fermé</p>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Urgences</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>En cas d'urgence médicale:</p>
                <p className="font-medium">SAMU: 15</p>
                <p className="font-medium">Pompiers: 18</p>
                <p className="font-medium">Urgences campus: 01 23 45 67 99</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}