
import { AcademicPageHeader } from "@/components/AcademicPageHeader";
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Users, MapPin, Plus, Brain, Zap } from 'lucide-react';
import { SmartScheduleGenerator } from '@/components/academic/SmartScheduleGenerator';
import { TimetableView } from '@/components/academic/TimetableView';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Timetables() {
  const currentWeek = getCurrentWeekDates();

  return (
    <ProtectedRoute allowedRoles={['admin', 'teacher']}>
      <div className="min-h-screen bg-background">
        <AcademicPageHeader 
          title="Emploi du Temps" 
          subtitle="Planning intelligent et gestion des créneaux avec IA" 
        />
        <div className="p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            
            {/* Bannière du nouveau générateur IA */}
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Brain className="h-8 w-8 text-blue-600" />
                    <div>
                      <h3 className="font-semibold text-blue-900">
                        Nouveau : Générateur d'Emploi du Temps IA
                      </h3>
                      <p className="text-sm text-blue-700">
                        Génération automatique avec algorithme anti-conflits et optimisation intelligente
                      </p>
                    </div>
                  </div>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Zap className="h-4 w-4 mr-2" />
                    Essayer maintenant
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="intelligent" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="intelligent" className="flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  Générateur IA
                </TabsTrigger>
                <TabsTrigger value="schedule" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Emploi du Temps
                </TabsTrigger>
                <TabsTrigger value="manual" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Gestion Manuelle
                </TabsTrigger>
              </TabsList>

              {/* Onglet Générateur IA */}
              <TabsContent value="intelligent">
                <SmartScheduleGenerator />
              </TabsContent>

              {/* Onglet Emploi du Temps */}
              <TabsContent value="schedule">
                <div className="space-y-6">
                  {/* En-tête avec informations de la semaine */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <Calendar className="h-5 w-5" />
                          Semaine du {currentWeek[0]} au {currentWeek[6]}
                        </CardTitle>
                        <Button variant="outline">
                          <Plus className="h-4 w-4 mr-2" />
                          Ajouter un créneau
                        </Button>
                      </div>
                    </CardHeader>
                  </Card>

                  {/* Vue de l'emploi du temps */}
                  <TimetableView />
                </div>
              </TabsContent>

              {/* Onglet Gestion Manuelle */}
              <TabsContent value="manual">
                {/* Conserver l'ancienne grille pour la gestion manuelle */}
                <Card>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <div className="grid grid-cols-8 min-w-[1000px]">
                        {/* En-tête des jours */}
                        <div className="p-4 border-r border-b bg-muted font-semibold">Horaires</div>
                        {['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'].map((day) => (
                          <div key={day} className="p-4 border-r border-b bg-muted text-center font-semibold">
                            {day}
                          </div>
                        ))}
                        
                        {/* Créneaux horaires */}
                        {generateTimeSlots().map((time) => (
                          <>
                            <div key={time} className="p-4 border-r border-b bg-muted/50 text-sm font-medium">
                              {time}
                            </div>
                            {[0, 1, 2, 3, 4, 5, 6].map((dayIndex) => (
                              <div 
                                key={`${time}-${dayIndex}`} 
                                className="p-2 border-r border-b min-h-[80px] hover:bg-accent/50 cursor-pointer relative"
                              >
                                {/* Exemple de cours */}
                                {shouldShowCourse(time, dayIndex) && (
                                  <div className="bg-primary/10 border-l-4 border-primary p-2 rounded text-xs h-full">
                                    <div className="font-semibold">Bases de Données</div>
                                    <div className="text-muted-foreground flex items-center gap-1 mt-1">
                                      <Users className="h-3 w-3" />
                                      <span>INFO-1A</span>
                                    </div>
                                    <div className="text-muted-foreground flex items-center gap-1">
                                      <MapPin className="h-3 w-3" />
                                      <span>Salle 101</span>
                                    </div>
                                    <Badge variant="secondary" className="mt-1 text-xs">
                                      Dr. Martin
                                    </Badge>
                                  </div>
                                )}
                              </div>
                            ))}
                          </>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Heures par semaine
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">24h</div>
                  <p className="text-xs text-muted-foreground">+2h par rapport à la semaine dernière</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Classes actives
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground">Réparties sur 3 programmes</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Salles utilisées
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">8/15</div>
                  <p className="text-xs text-muted-foreground">Taux d'occupation: 53%</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Brain className="h-4 w-4" />
                    Conflits résolus
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">95%</div>
                  <p className="text-xs text-muted-foreground">Par l'algorithme IA</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

// Fonctions utilitaires
function getCurrentWeekDates(): string[] {
  const today = new Date();
  const currentDay = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - currentDay + 1);
  
  const week = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    week.push(date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }));
  }
  return week;
}

function generateTimeSlots(): string[] {
  const slots = [];
  for (let hour = 8; hour <= 18; hour++) {
    slots.push(`${hour.toString().padStart(2, '0')}:00`);
  }
  return slots;
}

function shouldShowCourse(time: string, dayIndex: number): boolean {
  // Logique simple pour afficher des cours d'exemple
  if (dayIndex === 6) return false; // Pas de cours le dimanche
  if (time === '08:00' && [0, 2, 4].includes(dayIndex)) return true;
  if (time === '10:00' && [1, 3].includes(dayIndex)) return true;
  if (time === '14:00' && [0, 1, 2].includes(dayIndex)) return true;
  return false;
}
