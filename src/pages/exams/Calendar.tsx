import { ExamsModuleLayout } from "@/components/layouts/ExamsModuleLayout";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight,
  Plus,
  Filter,
  Eye,
  Edit,
  Clock,
  MapPin,
  Users,
  Bot
} from 'lucide-react';

export default function ExamsCalendar() {
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  
  // Simulation d'examens pour le calendrier
  const examsByDate = {
    '2024-01-15': [
      { id: 1, time: '09:00', subject: 'Mathématiques', room: 'Amphi A', students: 120, status: 'confirmed' }
    ],
    '2024-01-16': [
      { id: 2, time: '14:00', subject: 'Physique', room: 'Salle B', students: 85, status: 'scheduled' },
      { id: 3, time: '16:30', subject: 'Chimie', room: 'Lab C', students: 45, status: 'pending' }
    ],
    '2024-01-18': [
      { id: 4, time: '10:00', subject: 'Informatique', room: 'Info 1', students: 95, status: 'confirmed' }
    ],
    '2024-01-22': [
      { id: 5, time: '08:30', subject: 'Histoire', room: 'Amphi C', students: 150, status: 'scheduled' },
      { id: 6, time: '14:00', subject: 'Géographie', room: 'Salle D', students: 75, status: 'confirmed' }
    ]
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500';
      case 'scheduled': return 'bg-blue-500';
      case 'pending': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">Confirmé</Badge>;
      case 'scheduled':
        return <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-xs">Planifié</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200 text-xs">En attente</Badge>;
      default:
        return <Badge className="text-xs">{status}</Badge>;
    }
  };

  // Génération des jours du mois (simplifiée pour l'exemple)
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);
  const startDay = 1; // Premier jour de la semaine pour le 1er du mois

  const weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  return (
    <ExamsModuleLayout 
      title="Calendrier Examens"
      subtitle="Vue calendrier interactive avec planification intelligente"
    >
      <div className="p-8 space-y-8">
        {/* Header avec contrôles */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <h2 className="text-xl font-semibold text-foreground min-w-48 text-center">
                {currentMonth}
              </h2>
              <Button variant="outline" size="sm">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            <Button variant="outline" size="sm">
              Aujourd'hui
            </Button>
          </div>
          
          <div className="flex gap-3">
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filtres
            </Button>
            <Button variant="outline">
              <Eye className="w-4 h-4 mr-2" />
              Vue
            </Button>
            <Button className="bg-violet-600 hover:bg-violet-700">
              <Plus className="w-4 h-4 mr-2" />
              Nouvel examen
            </Button>
          </div>
        </div>

        {/* Légende */}
        <div className="flex items-center gap-6 p-4 bg-muted/30 rounded-xl">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm">Confirmé</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-sm">Planifié</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-sm">En attente</span>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <Bot className="w-4 h-4 text-violet-500" />
            <span className="text-sm text-violet-600">Optimisé par IA</span>
          </div>
        </div>

        {/* Calendrier */}
        <Card className="bg-white rounded-2xl shadow-sm border-0">
          <CardContent className="p-6">
            {/* En-têtes des jours */}
            <div className="grid grid-cols-7 gap-1 mb-4">
              {weekDays.map((day) => (
                <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground border-b">
                  {day}
                </div>
              ))}
            </div>

            {/* Grille du calendrier */}
            <div className="grid grid-cols-7 gap-1">
              {/* Espaces vides pour aligner le premier jour */}
              {Array.from({ length: startDay - 1 }, (_, i) => (
                <div key={`empty-${i}`} className="h-32"></div>
              ))}
              
              {/* Jours du mois */}
              {daysInMonth.map((day) => {
                const dateKey = `2024-01-${day.toString().padStart(2, '0')}`;
                const dayExams = examsByDate[dateKey] || [];
                const isToday = day === currentDate.getDate();
                
                return (
                  <div
                    key={day}
                    className={`h-32 p-2 border border-border/30 rounded-lg hover:bg-accent/30 transition-colors cursor-pointer ${
                      isToday ? 'bg-violet-50 border-violet-200' : 'bg-white'
                    }`}
                  >
                    <div className={`text-sm font-medium mb-2 ${
                      isToday ? 'text-violet-600' : 'text-foreground'
                    }`}>
                      {day}
                    </div>
                    
                    <div className="space-y-1 overflow-hidden">
                      {dayExams.slice(0, 2).map((exam) => (
                        <div
                          key={exam.id}
                          className={`text-xs p-1 rounded ${getStatusColor(exam.status)} text-white truncate`}
                        >
                          <div className="font-medium">{exam.time}</div>
                          <div className="truncate">{exam.subject}</div>
                        </div>
                      ))}
                      {dayExams.length > 2 && (
                        <div className="text-xs text-muted-foreground">
                          +{dayExams.length - 2} autres
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Examens du jour sélectionné */}
        <Card className="bg-white rounded-2xl shadow-sm border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-violet-500" />
              Examens du 16 janvier 2024
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {examsByDate['2024-01-16']?.map((exam) => (
                <div key={exam.id} className="flex items-center justify-between p-4 rounded-xl border border-border/50 hover:bg-accent/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(exam.status)}`}></div>
                    <div>
                      <p className="font-semibold text-foreground">{exam.subject}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {exam.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {exam.room}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {exam.students} étudiants
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(exam.status)}
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </ExamsModuleLayout>
  );
}