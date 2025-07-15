import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Factory, 
  Play, 
  Pause,
  Square,
  Download,
  Clock,
  CheckCircle,
  AlertCircle,
  Users,
  FileText,
  Settings,
  Archive
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function ProductionBatchInterface() {
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [selectedScope, setSelectedScope] = useState<string>("");

  // Mock data for production jobs
  const productionJobs = [
    {
      id: '1',
      title: 'Bulletins S1 2024 - L3 Info',
      status: 'running',
      progress: 67,
      studentsTotal: 120,
      studentsProcessed: 80,
      startedAt: '2024-01-15T14:30:00Z',
      estimatedCompletion: '2024-01-15T15:45:00Z',
      template: 'Bulletin Standard',
      scope: 'L3 Informatique'
    },
    {
      id: '2',
      title: 'Relevés Master - Gestion',
      status: 'completed',
      progress: 100,
      studentsTotal: 45,
      studentsProcessed: 45,
      startedAt: '2024-01-15T10:00:00Z',
      completedAt: '2024-01-15T10:45:00Z',
      template: 'Relevé Officiel',
      scope: 'Master Gestion',
      downloadUrl: '/downloads/releves-master-gestion-2024.zip'
    },
    {
      id: '3',
      title: 'Attestations de réussite',
      status: 'failed',
      progress: 23,
      studentsTotal: 89,
      studentsProcessed: 20,
      startedAt: '2024-01-15T09:15:00Z',
      failedAt: '2024-01-15T09:30:00Z',
      template: 'Attestation Standard',
      scope: 'L2 Économie',
      error: 'Données manquantes pour 15 étudiants'
    }
  ];

  const templates = [
    { id: '1', name: 'Bulletin Standard', type: 'bulletin' },
    { id: '2', name: 'Bulletin Détaillé', type: 'bulletin' },
    { id: '3', name: 'Relevé Officiel', type: 'transcript' },
    { id: '4', name: 'Attestation Standard', type: 'certificate' }
  ];

  const scopes = [
    { id: '1', name: 'L1 Informatique', studentCount: 150 },
    { id: '2', name: 'L2 Informatique', studentCount: 120 },
    { id: '3', name: 'L3 Informatique', studentCount: 95 },
    { id: '4', name: 'Master 1 Gestion', studentCount: 60 },
    { id: '5', name: 'Master 2 Gestion', studentCount: 45 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'text-blue-600 bg-blue-50';
      case 'completed': return 'text-green-600 bg-green-50';
      case 'failed': return 'text-red-600 bg-red-50';
      case 'paused': return 'text-orange-600 bg-orange-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'running': return 'En cours';
      case 'completed': return 'Terminé';
      case 'failed': return 'Échec';
      case 'paused': return 'En pause';
      default: return 'Inconnu';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return <Play className="w-3 h-3" />;
      case 'completed': return <CheckCircle className="w-3 h-3" />;
      case 'failed': return <AlertCircle className="w-3 h-3" />;
      case 'paused': return <Pause className="w-3 h-3" />;
      default: return <Clock className="w-3 h-3" />;
    }
  };

  const canStartProduction = selectedTemplate && selectedScope;

  return (
    <div className="space-y-6">
      {/* Configuration de production */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-blue-600" />
            Configuration de Production
          </CardTitle>
          <CardDescription>
            Sélectionnez le template et la portée pour lancer une nouvelle production
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Sélection du template */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Template de document *</label>
              <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir un template" />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name} ({template.type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sélection de la portée */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Portée de génération *</label>
              <Select value={selectedScope} onValueChange={setSelectedScope}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir une classe/niveau" />
                </SelectTrigger>
                <SelectContent>
                  {scopes.map((scope) => (
                    <SelectItem key={scope.id} value={scope.id}>
                      {scope.name} ({scope.studentCount} étudiants)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Actions de lancement */}
          <div className="flex items-center gap-4 pt-4 border-t">
            <Button 
              disabled={!canStartProduction}
              className="flex items-center gap-2"
            >
              <Play className="w-4 h-4" />
              Lancer Production
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => navigate('/results/validation')}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Retour Validation
            </Button>

            <Button 
              variant="outline"
              onClick={() => navigate('/results/production/history')}
            >
              <Archive className="w-4 h-4 mr-2" />
              Historique
            </Button>
          </div>

          {!canStartProduction && (
            <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <p className="text-sm text-orange-700">
                Veuillez sélectionner un template et une portée pour lancer la production.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Jobs de production en cours */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Factory className="h-5 w-5 text-green-600" />
            Jobs de Production
          </CardTitle>
          <CardDescription>
            Suivi en temps réel des générations en cours et terminées
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {productionJobs.map((job) => (
              <Card key={job.id} className="border border-border/50">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {/* En-tête du job */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Factory className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">{job.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {job.template} • {job.scope}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Badge className={getStatusColor(job.status)}>
                          {getStatusIcon(job.status)}
                          {getStatusText(job.status)}
                        </Badge>
                      </div>
                    </div>

                    {/* Barre de progression */}
                    {job.status === 'running' && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>{job.studentsProcessed} / {job.studentsTotal} étudiants</span>
                          <span>{job.progress}%</span>
                        </div>
                        <Progress value={job.progress} className="h-2" />
                        <p className="text-xs text-muted-foreground">
                          Fin estimée : {new Date(job.estimatedCompletion!).toLocaleTimeString('fr-FR')}
                        </p>
                      </div>
                    )}

                    {/* Informations selon le statut */}
                    {job.status === 'completed' && (
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center gap-2 text-sm text-green-700">
                          <CheckCircle className="w-4 h-4" />
                          Terminé le {new Date(job.completedAt!).toLocaleString('fr-FR')}
                        </div>
                        {job.downloadUrl && (
                          <Button size="sm" variant="outline">
                            <Download className="w-4 h-4 mr-2" />
                            Télécharger
                          </Button>
                        )}
                      </div>
                    )}

                    {job.status === 'failed' && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center gap-2 text-sm text-red-700 mb-2">
                          <AlertCircle className="w-4 h-4" />
                          Échec le {new Date(job.failedAt!).toLocaleString('fr-FR')}
                        </div>
                        <p className="text-sm text-red-600">{job.error}</p>
                        <Button size="sm" variant="outline" className="mt-2">
                          <Play className="w-4 h-4 mr-2" />
                          Relancer
                        </Button>
                      </div>
                    )}

                    {/* Actions selon le statut */}
                    {job.status === 'running' && (
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline">
                          <Pause className="w-4 h-4 mr-2" />
                          Pause
                        </Button>
                        <Button size="sm" variant="destructive">
                          <Square className="w-4 h-4 mr-2" />
                          Arrêter
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Actions rapides */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="w-5 h-5 text-purple-600" />
              Export Matriciel
            </CardTitle>
            <CardDescription>
              Génération d'exports Excel pour analyse
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => navigate('/results/production/matrix')}
              className="w-full"
            >
              <Download className="w-4 h-4 mr-2" />
              Interface Matricielle
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="w-5 h-5 text-blue-600" />
              Production Programmée
            </CardTitle>
            <CardDescription>
              Planifier des générations automatiques
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="outline"
              onClick={() => navigate('/results/production/scheduler')}
              className="w-full"
            >
              <Clock className="w-4 h-4 mr-2" />
              Programmer
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}