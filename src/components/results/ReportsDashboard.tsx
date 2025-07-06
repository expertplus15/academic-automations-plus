import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileOutput, 
  Zap, 
  Download, 
  Eye, 
  Settings,
  Printer,
  Mail,
  Clock,
  CheckCircle,
  Users,
  FileText,
  Layout,
  Palette
} from 'lucide-react';

export function ReportsDashboard() {
  const [generationQueue, setGenerationQueue] = useState([
    {
      id: 1,
      type: 'bulletin',
      program: 'Master Commerce',
      students: 89,
      status: 'generating',
      progress: 75,
      estimatedTime: '30s'
    },
    {
      id: 2,
      type: 'attestation',
      program: 'Licence Gestion',
      students: 156,
      status: 'queued',
      progress: 0,
      estimatedTime: '45s'
    },
    {
      id: 3,
      type: 'bulletin',
      program: 'BTS Commerce',
      students: 67,
      status: 'completed',
      progress: 100,
      estimatedTime: 'Terminé'
    }
  ]);

  const reportTemplates = [
    {
      id: 1,
      name: 'Bulletin Standard',
      type: 'bulletin',
      usage: 1250,
      isDefault: true,
      lastModified: '2024-01-10'
    },
    {
      id: 2,
      name: 'Relevé Officiel',
      type: 'transcript',
      usage: 450,
      isDefault: false,
      lastModified: '2024-01-08'
    },
    {
      id: 3,
      name: 'Attestation Réussite',
      type: 'certificate',
      usage: 230,
      isDefault: false,
      lastModified: '2024-01-05'
    }
  ];

  const generationStats = {
    documentsGenerated: 15670,
    averageGenerationTime: '2.3s',
    successRate: 99.8,
    totalPrintRequests: 8450
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'generating':
        return <Zap className="w-4 h-4 text-blue-600 animate-pulse" />;
      case 'queued':
        return <Clock className="w-4 h-4 text-amber-600" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      default:
        return <FileOutput className="w-4 h-4 text-gray-400" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'bulletin':
        return 'Bulletin';
      case 'transcript':
        return 'Relevé';
      case 'certificate':
        return 'Attestation';
      case 'attestation':
        return 'Attestation';
      default:
        return 'Document';
    }
  };

  return (
    <div className="space-y-6">
      {/* Statistiques de génération */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <FileOutput className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{generationStats.documentsGenerated.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Documents générés</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{generationStats.averageGenerationTime}</p>
                <p className="text-sm text-muted-foreground">Temps moyen</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{generationStats.successRate}%</p>
                <p className="text-sm text-muted-foreground">Taux de succès</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <Printer className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{generationStats.totalPrintRequests.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Impressions</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="generate" className="space-y-4">
        <TabsList>
          <TabsTrigger value="generate">Génération rapide</TabsTrigger>
          <TabsTrigger value="queue">File d'attente</TabsTrigger>
          <TabsTrigger value="templates">Modèles</TabsTrigger>
          <TabsTrigger value="settings">Configuration</TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-500" />
                  Bulletins Express
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Génération ultra-rapide de bulletins en moins de 5 secondes
                </p>
                <div className="space-y-3">
                  <Button className="w-full">
                    <Zap className="w-4 h-4 mr-2" />
                    Générer maintenant
                  </Button>
                  <div className="text-xs text-muted-foreground">
                    Dernière génération: il y a 2h
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileOutput className="w-5 h-5 text-emerald-500" />
                  Relevés Officiels
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Documents officiels avec signatures et cachets automatiques
                </p>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full">
                    <Settings className="w-4 h-4 mr-2" />
                    Configurer et générer
                  </Button>
                  <div className="text-xs text-muted-foreground">
                    Template: Relevé Standard
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-amber-500" />
                  Génération en Masse
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Traitement par lots pour plusieurs programmes simultanément
                </p>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full">
                    <Users className="w-4 h-4 mr-2" />
                    Génération groupée
                  </Button>
                  <div className="text-xs text-muted-foreground">
                    Jusqu'à 1000 documents/lot
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="queue" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">File de génération</h3>
            <Button variant="outline" size="sm">
              Actualiser
            </Button>
          </div>
          
          <div className="space-y-4">
            {generationQueue.map(job => (
              <Card key={job.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(job.status)}
                      <div>
                        <h4 className="font-medium">
                          {getTypeLabel(job.type)} - {job.program}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {job.students} étudiants • {job.estimatedTime}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant={
                        job.status === 'completed' ? 'default' : 
                        job.status === 'generating' ? 'secondary' : 
                        'outline'
                      }>
                        {job.status === 'generating' ? 'En cours' : 
                         job.status === 'completed' ? 'Terminé' : 'En attente'}
                      </Badge>
                      {job.status === 'completed' && (
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          Télécharger
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {job.status === 'generating' && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progression</span>
                        <span>{job.progress}%</span>
                      </div>
                      <Progress value={job.progress} />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Modèles de documents</h3>
            <Button size="sm">
              <Layout className="w-4 h-4 mr-2" />
              Nouveau modèle
            </Button>
          </div>
          
          <div className="space-y-3">
            {reportTemplates.map(template => (
              <Card key={template.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{template.name}</p>
                          {template.isDefault && (
                            <Badge variant="secondary" className="text-xs">Par défaut</Badge>
                          )}
                        </div>
                        <div className="flex gap-4 text-sm text-muted-foreground">
                          <span>{getTypeLabel(template.type)}</span>
                          <span>{template.usage} utilisations</span>
                          <span>Modifié le {template.lastModified}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Settings className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Palette className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <h3 className="text-lg font-semibold">Configuration de génération</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Options de sortie</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Format par défaut</label>
                  <p className="text-sm text-muted-foreground">PDF haute qualité</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Qualité d'impression</label>
                  <p className="text-sm text-muted-foreground">300 DPI</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Filigrane</label>
                  <p className="text-sm text-muted-foreground">Logo institutionnel</p>
                </div>
                <Button variant="outline">
                  <Settings className="w-4 h-4 mr-2" />
                  Modifier
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribution automatique</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Email automatique</label>
                  <p className="text-sm text-muted-foreground">Activé pour bulletins</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Impression automatique</label>
                  <p className="text-sm text-muted-foreground">Désactivée</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Stockage cloud</label>
                  <p className="text-sm text-muted-foreground">Drive institutionnel</p>
                </div>
                <Button variant="outline">
                  <Mail className="w-4 h-4 mr-2" />
                  Configurer
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}