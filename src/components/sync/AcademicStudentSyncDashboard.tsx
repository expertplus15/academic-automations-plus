import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Users, 
  BookOpen,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { useAcademicStudentSync } from '@/hooks/academic-student-sync';
import { usePrograms } from '@/hooks/usePrograms';

export function AcademicStudentSyncDashboard() {
  const [selectedProgram, setSelectedProgram] = useState<string>('');
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  
  const { 
    syncData, 
    loading, 
    syncStudentWithAcademic, 
    syncProgramStudents, 
    detectSyncConflicts, 
    getSyncStatus 
  } = useAcademicStudentSync();
  
  const { programs } = usePrograms();

  const handleSyncStudent = async () => {
    if (!selectedStudent) return;
    await syncStudentWithAcademic(selectedStudent);
  };

  const handleSyncProgram = async () => {
    if (!selectedProgram) return;
    // Utiliser l'année académique courante
    await syncProgramStudents(selectedProgram, 'current-year-id');
  };

  const getSyncStatusColor = (status: string) => {
    switch (status) {
      case 'synced': return 'bg-emerald-500';
      case 'pending': return 'bg-amber-500'; 
      case 'conflict': return 'bg-orange-500';
      case 'error': return 'bg-destructive';
      default: return 'bg-muted';
    }
  };

  const getSyncStatusLabel = (status: string) => {
    switch (status) {
      case 'synced': return 'Synchronisé';
      case 'pending': return 'En attente';
      case 'conflict': return 'Conflit';
      case 'error': return 'Erreur';
      default: return 'Inconnu';
    }
  };

  // Statistiques de synchronisation
  const syncStats = {
    total: syncData.length,
    synced: syncData.filter(s => s.syncStatus === 'synced').length,
    conflicts: syncData.filter(s => s.syncStatus === 'conflict').length,
    errors: syncData.filter(s => s.syncStatus === 'error').length,
    pending: syncData.filter(s => s.syncStatus === 'pending').length
  };

  const syncProgress = syncStats.total > 0 ? (syncStats.synced / syncStats.total) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Synchronisation Académique-Étudiants</h2>
          <p className="text-muted-foreground">
            Synchronisation des données entre les modules académique et étudiants
          </p>
        </div>
        <Button 
          onClick={handleSyncProgram} 
          disabled={loading || !selectedProgram}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Synchroniser Programme
        </Button>
      </div>

      {/* Statistiques globales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <div>
                <div className="text-2xl font-bold">{syncStats.total}</div>
                <p className="text-sm text-muted-foreground">Étudiants synchronisés</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-emerald-600" />
              <div>
                <div className="text-2xl font-bold text-emerald-600">{syncStats.synced}</div>
                <p className="text-sm text-muted-foreground">Synchronisés</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <div>
                <div className="text-2xl font-bold text-orange-600">{syncStats.conflicts}</div>
                <p className="text-sm text-muted-foreground">Conflits</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-destructive" />
              <div>
                <div className="text-2xl font-bold text-destructive">{syncStats.errors}</div>
                <p className="text-sm text-muted-foreground">Erreurs</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Barre de progression globale */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Progression de la synchronisation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Synchronisation globale</span>
              <span>{Math.round(syncProgress)}%</span>
            </div>
            <Progress value={syncProgress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="students">Étudiants</TabsTrigger>
          <TabsTrigger value="conflicts">Conflits</TabsTrigger>
          <TabsTrigger value="settings">Configuration</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Synchronisations récentes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Synchronisations récentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {syncData.slice(0, 5).map((sync) => (
                    <div key={sync.studentId} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Étudiant {sync.studentId.slice(0, 8)}</div>
                        <div className="text-sm text-muted-foreground">
                          {sync.synchronizedAt.toLocaleString()}
                        </div>
                      </div>
                      <Badge 
                        variant="secondary" 
                        className={getSyncStatusColor(sync.syncStatus)}
                      >
                        {getSyncStatusLabel(sync.syncStatus)}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Programmes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Synchronisation par programme
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <select 
                    value={selectedProgram} 
                    onChange={(e) => setSelectedProgram(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="">Sélectionner un programme</option>
                    {programs.map((program) => (
                      <option key={program.id} value={program.id}>
                        {program.name} ({program.code})
                      </option>
                    ))}
                  </select>
                  <Button 
                    onClick={handleSyncProgram} 
                    disabled={loading || !selectedProgram}
                    className="w-full"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                        Synchronisation...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Synchroniser le programme
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="students" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Liste des étudiants synchronisés</CardTitle>
              <CardDescription>
                État de synchronisation pour chaque étudiant
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Étudiant</th>
                      <th className="text-left p-2">Programme</th>
                      <th className="text-left p-2">Progression</th>
                      <th className="text-left p-2">Statut</th>
                      <th className="text-left p-2">Dernière sync</th>
                      <th className="text-left p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {syncData.map((sync) => (
                      <tr key={sync.studentId} className="border-b">
                        <td className="p-2">
                          <div className="font-medium">{sync.studentId.slice(0, 8)}</div>
                        </td>
                        <td className="p-2">{sync.programId.slice(0, 8)}</td>
                        <td className="p-2">
                          <div className="space-y-1">
                            <div className="text-sm">
                              {sync.academicProgress.creditsEarned}/{sync.academicProgress.creditsRequired} ECTS
                            </div>
                            <Progress 
                              value={(sync.academicProgress.creditsEarned / sync.academicProgress.creditsRequired) * 100} 
                              className="h-1"
                            />
                          </div>
                        </td>
                        <td className="p-2">
                          <Badge 
                            variant="secondary" 
                            className={getSyncStatusColor(sync.syncStatus)}
                          >
                            {getSyncStatusLabel(sync.syncStatus)}
                          </Badge>
                        </td>
                        <td className="p-2 text-sm text-muted-foreground">
                          {sync.synchronizedAt.toLocaleString()}
                        </td>
                        <td className="p-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => syncStudentWithAcademic(sync.studentId)}
                            disabled={loading}
                          >
                            Re-sync
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conflicts" className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Les conflits de synchronisation nécessitent une intervention manuelle pour être résolus.
            </AlertDescription>
          </Alert>
          
          <div className="space-y-4">
            {syncData
              .filter(s => s.syncStatus === 'conflict' || s.syncStatus === 'error')
              .map((sync) => (
                <Card key={sync.studentId}>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Conflit - Étudiant {sync.studentId.slice(0, 8)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="text-sm">
                        <strong>Type:</strong> {sync.syncStatus === 'conflict' ? 'Conflit de données' : 'Erreur de synchronisation'}
                      </div>
                      <div className="text-sm">
                        <strong>Programme:</strong> {sync.programId}
                      </div>
                      <div className="text-sm">
                        <strong>Dernière tentative:</strong> {sync.synchronizedAt.toLocaleString()}
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button size="sm" variant="outline">
                          Analyser
                        </Button>
                        <Button size="sm">
                          Résoudre
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuration de la synchronisation</CardTitle>
              <CardDescription>
                Paramètres avancés pour la synchronisation académique-étudiants
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Synchronisation automatique</div>
                    <div className="text-sm text-muted-foreground">
                      Synchroniser automatiquement lors des changements
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Configurer</Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Fréquence de synchronisation</div>
                    <div className="text-sm text-muted-foreground">
                      Intervalle pour la synchronisation automatique
                    </div>
                  </div>
                  <select className="p-2 border rounded-md">
                    <option>Temps réel</option>
                    <option>Toutes les heures</option>
                    <option>Quotidienne</option>
                    <option>Hebdomadaire</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Notifications</div>
                    <div className="text-sm text-muted-foreground">
                      Alertes en cas de conflit ou d'erreur
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Configurer</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}