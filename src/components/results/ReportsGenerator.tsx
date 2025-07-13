import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  FileText, 
  Download, 
  Eye, 
  Settings, 
  Zap, 
  Clock,
  CheckCircle,
  Printer,
  Mail,
  Filter
} from 'lucide-react';
import { FileService } from '@/services/FileService';

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  type: 'bulletin' | 'transcript' | 'analytics' | 'custom';
  format: 'pdf' | 'excel' | 'csv';
  estimatedTime: number;
  features: string[];
  preview: string;
}

interface GenerationJob {
  id: string;
  templateId: string;
  templateName: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
  createdAt: string;
  completedAt?: string;
  recordsGenerated: number;
  totalRecords: number;
  downloadUrl?: string;
}

export function ReportsGenerator() {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [filters, setFilters] = useState({
    program: '',
    level: '',
    semester: '',
    dateRange: ''
  });
  const [generationJobs, setGenerationJobs] = useState<GenerationJob[]>([]);

  const templates: ReportTemplate[] = [
    {
      id: 'bulletin-standard',
      name: 'Bulletin Standard',
      description: 'Bulletin classique avec moyennes et appréciations',
      type: 'bulletin',
      format: 'pdf',
      estimatedTime: 30,
      features: ['Moyennes par matière', 'Rang de classe', 'Appréciations', 'Graphiques'],
      preview: '/previews/bulletin-standard.png'
    },
    {
      id: 'bulletin-ects',
      name: 'Bulletin ECTS',
      description: 'Bulletin européen avec crédits ECTS',
      type: 'bulletin',
      format: 'pdf',
      estimatedTime: 45,
      features: ['Crédits ECTS', 'Grades européens', 'Compétences', 'Supplément au diplôme'],
      preview: '/previews/bulletin-ects.png'
    },
    {
      id: 'transcript-official',
      name: 'Relevé Officiel',
      description: 'Relevé de notes officiel pour administrations',
      type: 'transcript',
      format: 'pdf',
      estimatedTime: 20,
      features: ['Tampon officiel', 'QR Code', 'Filigrane', 'Signature électronique'],
      preview: '/previews/transcript-official.png'
    },
    {
      id: 'analytics-performance',
      name: 'Analyse de Performance',
      description: 'Rapport détaillé des performances par classe',
      type: 'analytics',
      format: 'pdf',
      estimatedTime: 60,
      features: ['Statistiques avancées', 'Graphiques comparatifs', 'Tendances', 'Recommandations'],
      preview: '/previews/analytics-performance.png'
    }
  ];

  const generateReport = async () => {
    if (!selectedTemplate) return;

    const template = templates.find(t => t.id === selectedTemplate);
    if (!template) return;

    const newJob: GenerationJob = {
      id: `gen-${Date.now()}`,
      templateId: selectedTemplate,
      templateName: template.name,
      status: 'processing',
      progress: 0,
      createdAt: new Date().toISOString(),
      recordsGenerated: 0,
      totalRecords: 125
    };

    setGenerationJobs(prev => [newJob, ...prev]);

    try {
      // Determine PDF type based on template
      let pdfType: 'bulletin' | 'transcript' | 'report' = 'report';
      if (template.type === 'bulletin') pdfType = 'bulletin';
      else if (template.type === 'transcript') pdfType = 'transcript';

      const result = await FileService.generatePDF({
        type: pdfType,
        templateId: selectedTemplate,
        filters: filters
      });

      if (result.success) {
        setGenerationJobs(prev => prev.map(job => 
          job.id === newJob.id 
            ? {
                ...job,
                progress: 100,
                recordsGenerated: 125,
                status: 'completed',
                completedAt: new Date().toISOString(),
                downloadUrl: result.downloadUrl
              }
            : job
        ));
      } else {
        setGenerationJobs(prev => prev.map(job => 
          job.id === newJob.id 
            ? { ...job, status: 'error' }
            : job
        ));
      }
    } catch (error) {
      setGenerationJobs(prev => prev.map(job => 
        job.id === newJob.id 
          ? { ...job, status: 'error' }
          : job
      ));
    }
  };

  const getStatusBadge = (status: GenerationJob['status']) => {
    const variants = {
      pending: { label: 'En attente', className: 'bg-gray-100 text-gray-800' },
      processing: { label: 'Génération...', className: 'bg-blue-100 text-blue-800' },
      completed: { label: 'Terminé', className: 'bg-green-100 text-green-800' },
      error: { label: 'Erreur', className: 'bg-red-100 text-red-800' }
    };
    
    const variant = variants[status];
    return <Badge className={variant.className}>{variant.label}</Badge>;
  };

  const formatEstimatedTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    return `${Math.ceil(seconds / 60)}min`;
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="generate" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="generate">Génération</TabsTrigger>
          <TabsTrigger value="templates">Modèles</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-6">
          {/* Template Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Sélection du Modèle
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      selectedTemplate === template.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedTemplate(template.id)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold">{template.name}</h3>
                        <p className="text-sm text-muted-foreground">{template.description}</p>
                      </div>
                      <Badge variant="outline">{template.format.toUpperCase()}</Badge>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        ~{formatEstimatedTime(template.estimatedTime)}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      {template.features.slice(0, 3).map((feature, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                      {template.features.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{template.features.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filtres de Sélection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Programme</Label>
                  <Select value={filters.program} onValueChange={(value) => 
                    setFilters(prev => ({ ...prev, program: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="Tous les programmes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les programmes</SelectItem>
                      <SelectItem value="informatique">Informatique</SelectItem>
                      <SelectItem value="mathematiques">Mathématiques</SelectItem>
                      <SelectItem value="physique">Physique</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Niveau</Label>
                  <Select value={filters.level} onValueChange={(value) => 
                    setFilters(prev => ({ ...prev, level: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="Tous les niveaux" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les niveaux</SelectItem>
                      <SelectItem value="l1">Licence 1</SelectItem>
                      <SelectItem value="l2">Licence 2</SelectItem>
                      <SelectItem value="l3">Licence 3</SelectItem>
                      <SelectItem value="m1">Master 1</SelectItem>
                      <SelectItem value="m2">Master 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Semestre</Label>
                  <Select value={filters.semester} onValueChange={(value) => 
                    setFilters(prev => ({ ...prev, semester: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="Semestre actuel" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="current">Semestre actuel</SelectItem>
                      <SelectItem value="s1">Semestre 1</SelectItem>
                      <SelectItem value="s2">Semestre 2</SelectItem>
                      <SelectItem value="annual">Année complète</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Période</Label>
                  <Input
                    type="date"
                    value={filters.dateRange}
                    onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Generation Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Génération des Rapports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Button 
                  onClick={generateReport}
                  disabled={!selectedTemplate}
                  className="flex items-center gap-2"
                >
                  <Zap className="h-4 w-4" />
                  Générer les Rapports
                </Button>
                <Button variant="outline">
                  <Eye className="h-4 w-4 mr-2" />
                  Aperçu
                </Button>
                <Button variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Options Avancées
                </Button>
              </div>
              
              {selectedTemplate && (
                <Alert className="mt-4">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Prêt à générer avec le modèle "{templates.find(t => t.id === selectedTemplate)?.name}"
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <CardTitle>Modèles Disponibles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {templates.map((template) => (
                  <div key={template.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{template.name}</h3>
                        <p className="text-muted-foreground">{template.description}</p>
                      </div>
                      <Badge>{template.format.toUpperCase()}</Badge>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <h4 className="font-medium">Fonctionnalités:</h4>
                      <div className="flex flex-wrap gap-1">
                        {template.features.map((feature, index) => (
                          <Badge key={index} variant="secondary">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Temps estimé: {formatEstimatedTime(template.estimatedTime)}
                      </span>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Historique des Générations</CardTitle>
            </CardHeader>
            <CardContent>
              {generationJobs.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">Aucune génération récente</h3>
                  <p className="text-muted-foreground">
                    Vos générations de rapports apparaîtront ici
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {generationJobs.map((job) => (
                    <div key={job.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          <span className="font-medium">{job.templateName}</span>
                          {getStatusBadge(job.status)}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {new Date(job.createdAt).toLocaleString('fr-FR')}
                        </span>
                      </div>
                      
                      {job.status === 'processing' && (
                        <div className="space-y-2">
                          <Progress value={job.progress} className="h-2" />
                          <div className="flex justify-between text-sm text-muted-foreground">
                            <span>{job.recordsGenerated} / {job.totalRecords} rapports</span>
                            <span>{job.progress}%</span>
                          </div>
                        </div>
                      )}
                      
                      {job.status === 'completed' && (
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm text-green-600">
                            {job.totalRecords} rapports générés avec succès
                          </span>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => {
                                if (job.downloadUrl) {
                                  window.open(job.downloadUrl, '_blank');
                                }
                              }}
                            >
                              <Download className="h-4 w-4 mr-1" />
                              Télécharger
                            </Button>
                            <Button size="sm" variant="outline">
                              <Mail className="h-4 w-4 mr-1" />
                              Envoyer
                            </Button>
                            <Button size="sm" variant="outline">
                              <Printer className="h-4 w-4 mr-1" />
                              Imprimer
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}