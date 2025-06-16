
import { AcademicPageHeader } from "@/components/AcademicPageHeader";
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SmartScheduleGenerator } from '@/components/academic/SmartScheduleGenerator';
import { TimetableView } from '@/components/academic/TimetableView';
import { Brain, Calendar, BarChart3 } from 'lucide-react';

export default function SmartTimetables() {
  return (
    <ProtectedRoute allowedRoles={['admin', 'teacher']}>
      <div className="min-h-screen bg-background">
        <AcademicPageHeader 
          title="Emploi du Temps Intelligent" 
          subtitle="Génération automatique avec algorithme anti-conflits" 
        />
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            <Tabs defaultValue="generator" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="generator" className="flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  Générateur IA
                </TabsTrigger>
                <TabsTrigger value="schedule" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Emploi du Temps
                </TabsTrigger>
                <TabsTrigger value="analytics" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Analytics
                </TabsTrigger>
              </TabsList>

              <TabsContent value="generator">
                <SmartScheduleGenerator />
              </TabsContent>

              <TabsContent value="schedule">
                <TimetableView />
              </TabsContent>

              <TabsContent value="analytics">
                <Card>
                  <CardHeader>
                    <CardTitle>Analytics de l'Emploi du Temps</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Utilisation des Salles</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-blue-600">78%</div>
                          <p className="text-xs text-muted-foreground">Taux d'occupation moyen</p>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Conflits Résolus</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-green-600">95%</div>
                          <p className="text-xs text-muted-foreground">Taux de résolution automatique</p>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Temps de Génération</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-purple-600">2.3s</div>
                          <p className="text-xs text-muted-foreground">Temps moyen de traitement</p>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
