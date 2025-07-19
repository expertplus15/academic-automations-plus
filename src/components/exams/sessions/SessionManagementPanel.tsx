
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, 
  BookOpen, 
  Users, 
  Mail, 
  BarChart3,
  Clock,
  CheckCircle,
  AlertTriangle,
  Building,
  FileText
} from 'lucide-react';
import { SessionCreationWizard } from './SessionCreationWizard';
import { useDUT2GESessionManager } from '@/hooks/exams/useDUT2GESessionManager';

// Données simulées pour les métriques DUT2-GE
const DUT2GE_METRICS = {
  sessions: {
    total: 1,
    active: 1,
    completed: 0
  },
  exams: {
    total: 18,
    scheduled: 18,
    pending: 0
  },
  supervisors: {
    assigned: 36,
    conflicts: 0,
    coverage: 100
  },
  convocations: {
    scheduled: 260,
    sent: 260,
    pending_reminders: 78
  }
};

interface SessionManagementPanelProps {
  academicYearId: string;
  programId: string;
}

export function SessionManagementPanel({ 
  academicYearId, 
  programId 
}: SessionManagementPanelProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [sessions, setSessions] = useState<any[]>([]);
  const { getDUT2GESessions, loading } = useDUT2GESessionManager();

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    const data = await getDUT2GESessions();
    setSessions(data);
  };

  const hasActiveSession = sessions.length > 0;

  return (
    <div className="space-y-6">
      {/* En-tête avec métriques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{DUT2GE_METRICS.exams.total}</p>
                <p className="text-sm text-muted-foreground">Examens planifiés</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{DUT2GE_METRICS.supervisors.assigned}</p>
                <p className="text-sm text-muted-foreground">Surveillants affectés</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{DUT2GE_METRICS.convocations.sent}</p>
                <p className="text-sm text-muted-foreground">Convocations envoyées</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{DUT2GE_METRICS.supervisors.coverage}%</p>
                <p className="text-sm text-muted-foreground">Couverture surveillance</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Interface principale */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="create">Nouvelle Session</TabsTrigger>
          <TabsTrigger value="planning">Planification</TabsTrigger>
          <TabsTrigger value="monitoring">Suivi</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Sessions DUT2-GE Actives</CardTitle>
              </CardHeader>
              <CardContent>
                {hasActiveSession ? (
                  <div className="space-y-4">
                    {sessions.map((session) => (
                      <div key={session.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h3 className="font-semibold">{session.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              Code: {session.code}
                            </p>
                          </div>
                          <Badge variant="secondary">{session.status}</Badge>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="font-medium">Période</p>
                            <p className="text-muted-foreground">
                              {session.period_start} - {session.period_end}
                            </p>
                          </div>
                          <div>
                            <p className="font-medium">Type</p>
                            <p className="text-muted-foreground">{session.session_type}</p>
                          </div>
                          <div>
                            <p className="font-medium">Examens</p>
                            <p className="text-muted-foreground">18 configurés</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Aucune session active</h3>
                    <p className="text-muted-foreground mb-4">
                      Créez votre première session DUT2-GE pour commencer
                    </p>
                    <Button onClick={() => setActiveTab('create')}>
                      Créer une session
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {hasActiveSession && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      Statut Global
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>Planification examens</span>
                      <Badge className="bg-green-100 text-green-800">Complète</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Attribution surveillants</span>
                      <Badge className="bg-green-100 text-green-800">100%</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Convocations</span>
                      <Badge className="bg-blue-100 text-blue-800">Envoyées</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Conflits détectés</span>
                      <Badge className="bg-green-100 text-green-800">Aucun</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-blue-500" />
                      Prochaines Échéances
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="border-l-4 border-blue-500 pl-3">
                      <p className="font-medium">Examens S3</p>
                      <p className="text-sm text-muted-foreground">
                        Démarrage: 15 janvier 2024
                      </p>
                    </div>
                    <div className="border-l-4 border-orange-500 pl-3">
                      <p className="font-medium">Rappels convocations</p>
                      <p className="text-sm text-muted-foreground">
                        78 à envoyer cette semaine
                      </p>
                    </div>
                    <div className="border-l-4 border-green-500 pl-3">
                      <p className="font-medium">Examens S4</p>
                      <p className="text-sm text-muted-foreground">
                        Démarrage: 1er juin 2024
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="create">
          <SessionCreationWizard />
        </TabsContent>

        <TabsContent value="planning">
          <Card>
            <CardHeader>
              <CardTitle>Planification Intelligente</CardTitle>
              <p className="text-muted-foreground">
                Gestion des créneaux, salles et surveillants pour les 18 examens DUT2-GE
              </p>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Building className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Interface de planification en cours de développement
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring">
          <Card>
            <CardHeader>
              <CardTitle>Suivi Temps Réel</CardTitle>
              <p className="text-muted-foreground">
                Monitoring des convocations, surveillances et logistique
              </p>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Dashboard de monitoring en cours de développement
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
