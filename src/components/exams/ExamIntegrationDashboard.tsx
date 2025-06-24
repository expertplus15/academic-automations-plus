
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import {
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Users,
  Calendar,
  MapPin,
  BookOpen,
  Activity,
  Zap
} from 'lucide-react';
import { useModuleSync } from '@/hooks/useModuleSync';
import { useExamAcademicIntegration } from '@/hooks/useExamAcademicIntegration';
import { useExamStudentIntegration } from '@/hooks/useExamStudentIntegration';
import { useExamResourceIntegration } from '@/hooks/useExamResourceIntegration';

interface ExamIntegrationDashboardProps {
  examId?: string;
}

export function ExamIntegrationDashboard({ examId }: ExamIntegrationDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedExam, setSelectedExam] = useState<string>(examId || '');

  const { 
    syncEvents, 
    isConnected, 
    syncConfig,
    publishEvent 
  } = useModuleSync();

  const {
    integrationData: academicData,
    loading: academicLoading,
    syncExamWithAcademic
  } = useExamAcademicIntegration();

  const {
    integrationData: studentData,
    loading: studentLoading,
    syncExamWithStudents
  } = useExamStudentIntegration();

  const {
    integrationData: resourceData,
    loading: resourceLoading,
    syncExamWithResources
  } = useExamResourceIntegration();

  const handleSyncAll = async () => {
    if (!selectedExam) return;

    await Promise.all([
      syncExamWithAcademic(selectedExam),
      syncExamWithStudents(selectedExam),
      syncExamWithResources(selectedExam)
    ]);

    await publishEvent('exams', 'full_sync_completed', {
      examId: selectedExam,
      timestamp: new Date()
    });
  };

  const getOverallSyncStatus = () => {
    if (!selectedExam) return 'pending';
    
    const academic = academicData.find(d => d.examId === selectedExam);
    const student = studentData.find(d => d.examId === selectedExam);
    const resource = resourceData.find(d => d.examId === selectedExam);

    const statuses = [academic?.syncStatus, student?.syncStatus, resource?.syncStatus];
    
    if (statuses.includes('error')) return 'error';
    if (statuses.includes('conflict')) return 'conflict';
    if (statuses.every(s => s === 'synced')) return 'synced';
    if (statuses.some(s => s === 'synced')) return 'partial';
    return 'pending';
  };

  const getSyncProgress = () => {
    if (!selectedExam) return 0;
    
    const academic = academicData.find(d => d.examId === selectedExam);
    const student = studentData.find(d => d.examId === selectedExam);
    const resource = resourceData.find(d => d.examId === selectedExam);

    const syncedCount = [academic, student, resource].filter(d => d?.syncStatus === 'synced').length;
    return (syncedCount / 3) * 100;
  };

  const getStatusBadge = (status: string) => {
    const configs = {
      synced: { label: 'Synchronisé', className: 'bg-green-100 text-green-800', icon: CheckCircle },
      conflict: { label: 'Conflit', className: 'bg-red-100 text-red-800', icon: AlertTriangle },
      partial: { label: 'Partiel', className: 'bg-yellow-100 text-yellow-800', icon: Activity },
      pending: { label: 'En attente', className: 'bg-gray-100 text-gray-800', icon: RefreshCw },
      error: { label: 'Erreur', className: 'bg-red-100 text-red-800', icon: AlertTriangle }
    };

    const config = configs[status as keyof typeof configs] || configs.pending;
    const Icon = config.icon;

    return (
      <Badge className={`${config.className} flex items-center gap-1`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec statut général */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-blue-600" />
                Intégrations Inter-Modules
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Synchronisation temps réel entre Examens, Académique, Étudiants et Ressources
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-sm text-muted-foreground">
                  {isConnected ? 'Connecté' : 'Déconnecté'}
                </span>
              </div>
              
              <Button 
                onClick={handleSyncAll}
                disabled={!selectedExam || academicLoading || studentLoading || resourceLoading}
                size="sm"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Synchroniser Tout
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-600" />
                <span className="font-medium">Académique</span>
              </div>
              {getStatusBadge(academicData.find(d => d.examId === selectedExam)?.syncStatus || 'pending')}
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-green-600" />
                <span className="font-medium">Étudiants</span>
              </div>
              {getStatusBadge(studentData.find(d => d.examId === selectedExam)?.syncStatus || 'pending')}
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-orange-600" />
                <span className="font-medium">Ressources</span>
              </div>
              {getStatusBadge(resourceData.find(d => d.examId === selectedExam)?.syncStatus || 'pending')}
            </div>
            
            <div className="space-y-2">
              <span className="font-medium">Progression Globale</span>
              <div className="space-y-1">
                <Progress value={getSyncProgress()} className="h-2" />
                <span className="text-xs text-muted-foreground">
                  {Math.round(getSyncProgress())}% synchronisé
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Onglets détaillés */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="academic">Académique</TabsTrigger>
          <TabsTrigger value="students">Étudiants</TabsTrigger>
          <TabsTrigger value="resources">Ressources</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Événements récents */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Événements Récents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {syncEvents.slice(0, 10).map((event) => (
                    <div key={event.id} className="flex items-center gap-3 p-2 bg-muted/30 rounded">
                      <div className={`w-2 h-2 rounded-full ${
                        event.status === 'completed' ? 'bg-green-500' :
                        event.status === 'failed' ? 'bg-red-500' :
                        event.status === 'processing' ? 'bg-yellow-500' : 'bg-gray-500'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {event.module}: {event.action}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {event.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  {syncEvents.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Aucun événement récent
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Configuration de synchronisation */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Configuration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Synchronisation automatique</span>
                    <Badge variant={syncConfig.autoSync ? 'default' : 'secondary'}>
                      {syncConfig.autoSync ? 'Activée' : 'Désactivée'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Modules actifs</span>
                    <span className="text-sm text-muted-foreground">
                      {syncConfig.enabledModules.length}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Taille des lots</span>
                    <span className="text-sm text-muted-foreground">
                      {syncConfig.batchSize}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="academic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                Intégration Académique
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedExam && academicData.find(d => d.examId === selectedExam) ? (
                <div className="space-y-4">
                  {/* Détails de l'intégration académique */}
                  <p className="text-sm text-muted-foreground">
                    Détails de l'intégration avec le module académique...
                  </p>
                </div>
              ) : (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Aucune intégration</AlertTitle>
                  <AlertDescription>
                    Sélectionnez un examen pour voir les détails de l'intégration académique.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="students" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-green-600" />
                Intégration Étudiants
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedExam && studentData.find(d => d.examId === selectedExam) ? (
                <div className="space-y-4">
                  {/* Détails de l'intégration étudiants */}
                  <p className="text-sm text-muted-foreground">
                    Détails de l'intégration avec le module étudiants...
                  </p>
                </div>
              ) : (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Aucune intégration</AlertTitle>
                  <AlertDescription>
                    Sélectionnez un examen pour voir les détails de l'intégration étudiants.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-orange-600" />
                Intégration Ressources
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedExam && resourceData.find(d => d.examId === selectedExam) ? (
                <div className="space-y-4">
                  {/* Détails de l'intégration ressources */}
                  <p className="text-sm text-muted-foreground">
                    Détails de l'intégration avec le module ressources...
                  </p>
                </div>
              ) : (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Aucune intégration</AlertTitle>
                  <AlertDescription>
                    Sélectionnez un examen pour voir les détails de l'intégration ressources.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
