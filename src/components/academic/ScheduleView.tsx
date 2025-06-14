import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Users, MapPin } from 'lucide-react';

export function ScheduleView() {
  const scheduleData = [
    {
      id: 1,
      time: '08:00 - 10:00',
      course: 'Mathématiques Avancées',
      teacher: 'Dr. Martin',
      room: 'Salle A101',
      program: 'Ingénierie',
      students: 45
    },
    {
      id: 2,
      time: '10:30 - 12:30',
      course: 'Physique Quantique',
      teacher: 'Prof. Dubois',
      room: 'Lab B205',
      program: 'Physique',
      students: 32
    },
    {
      id: 3,
      time: '14:00 - 16:00',
      course: 'Histoire Contemporaine',
      teacher: 'Dr. Leroy',
      room: 'Amphi C',
      program: 'Histoire',
      students: 78
    },
    {
      id: 4,
      time: '16:30 - 18:30',
      course: 'Programmation Web',
      teacher: 'M. Bernard',
      room: 'Info D12',
      program: 'Informatique',
      students: 25
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Emploi du Temps - Aujourd'hui
            </CardTitle>
            <Button variant="outline">
              Voir la semaine complète
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {scheduleData.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 text-primary">
                    <Clock className="h-4 w-4" />
                    <span className="font-medium">{item.time}</span>
                  </div>
                  <div className="border-l h-8"></div>
                  <div>
                    <h3 className="font-semibold">{item.course}</h3>
                    <p className="text-sm text-muted-foreground">{item.teacher}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{item.room}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span className="text-sm">{item.students}</span>
                  </div>
                  <Badge variant="outline">{item.program}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Statistiques du Jour</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total cours:</span>
                <span className="font-medium">12</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Étudiants:</span>
                <span className="font-medium">346</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Salles utilisées:</span>
                <span className="font-medium">8</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Prochains Cours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 border rounded">
                <p className="font-medium">Chimie Organique</p>
                <p className="text-sm text-muted-foreground">19:00 - Salle E201</p>
              </div>
              <div className="p-3 border rounded">
                <p className="font-medium">Économie</p>
                <p className="text-sm text-muted-foreground">20:30 - Amphi F</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Actions Rapides</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button variant="outline" className="w-full">
                Générer Planning
              </Button>
              <Button variant="outline" className="w-full">
                Exporter PDF
              </Button>
              <Button variant="outline" className="w-full">
                Modifier Créneaux
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}