import React, { useState } from 'react';
import { ResultsPageHeader } from "@/components/ResultsPageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  FileText, 
  Download, 
  Eye, 
  Search, 
  Filter, 
  Users, 
  Calendar,
  Clock,
  Zap,
  BarChart3,
  Settings,
  Upload,
  Printer,
  FileSpreadsheet,
  GraduationCap,
  Award,
  RefreshCw
} from 'lucide-react';

interface BulletinTemplate {
  id: string;
  name: string;
  type: 'semestre' | 'annuel' | 'partiel' | 'international';
  description: string;
  format: 'A4' | 'Letter';
  language: 'fr' | 'en' | 'ar';
  lastModified: string;
  usageCount: number;
}

interface GenerationJob {
  id: string;
  name: string;
  template: string;
  studentsCount: number;
  progress: number;
  status: 'pending' | 'processing' | 'completed' | 'error';
  startTime: string;
  estimatedTime?: string;
  downloadUrl?: string;
}

export default function Reports() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [generationJobs, setGenerationJobs] = useState<GenerationJob[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const templates: BulletinTemplate[] = [
    {
      id: 'standard-semestre',
      name: 'Bulletin Standard Semestre',
      type: 'semestre',
      description: 'Modèle standard pour bulletins semestriels avec notes détaillées et moyennes',
      format: 'A4',
      language: 'fr',
      lastModified: '2024-01-15',
      usageCount: 145
    },
    {
      id: 'releve-annuel',
      name: 'Relevé de Notes Annuel',
      type: 'annuel',
      description: 'Relevé complet pour année universitaire avec crédits ECTS',
      format: 'A4',
      language: 'fr',
      lastModified: '2024-01-10',
      usageCount: 89
    },
    {
      id: 'bulletin-partiel',
      name: 'Bulletin Partiel',
      type: 'partiel',
      description: 'Bulletin pour évaluations partielles et contrôles continus',
      format: 'A4',
      language: 'fr',
      lastModified: '2024-01-08',
      usageCount: 267
    },
    {
      id: 'transcript-international',
      name: 'Transcript of Records',
      type: 'international',
      description: 'Relevé international bilingue conforme aux standards européens',
      format: 'A4',
      language: 'en',
      lastModified: '2024-01-12',
      usageCount: 45
    }
  ];

  const stats = [
    {
      title: 'Bulletins Générés',
      value: '1,247',
      change: '+23%',
      changeType: 'positive' as const,
      icon: FileText,
      description: 'Ce mois'
    },
    {
      title: 'Temps Moyen',
      value: '2.3s',
      change: '-45%',
      changeType: 'positive' as const,
      icon: Clock,
      description: 'Par bulletin'
    },
    {
      title: 'Taux de Réussite',
      value: '99.8%',
      change: '+0.2%',
      changeType: 'positive' as const,
      icon: Award,
      description: 'Génération sans erreur'
    },
    {
      title: 'Étudiants Traités',
      value: '3,456',
      change: '+18%',
      changeType: 'positive' as const,
      icon: GraduationCap,
      description: 'Dernière session'
    }
  ];

  const getTypeBadge = (type: BulletinTemplate['type']) => {
    const config = {
      semestre: { label: 'Semestre', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' },
      annuel: { label: 'Annuel', className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' },
      partiel: { label: 'Partiel', className: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300' },
      international: { label: 'International', className: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300' }
    };
    return config[type];
  };

  const getStatusBadge = (status: GenerationJob['status']) => {
    const config = {
      pending: { label: 'En attente', className: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300' },
      processing: { label: 'En cours', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' },
      completed: { label: 'Terminé', className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' },
      error: { label: 'Erreur', className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' }
    };
    return config[status];
  };

  const handleGenerateBulletins = () => {
    if (!selectedTemplate) return;
    
    const template = templates.find(t => t.id === selectedTemplate);
    if (!template) return;

    setIsGenerating(true);
    
    const newJob: GenerationJob = {
      id: Date.now().toString(),
      name: `Génération ${template.name}`,
      template: template.name,
      studentsCount: Math.floor(Math.random() * 200) + 50,
      progress: 0,
      status: 'processing',
      startTime: new Date().toLocaleTimeString(),
      estimatedTime: '45 secondes'
    };

    setGenerationJobs(prev => [newJob, ...prev]);

    // Simulation de la génération
    const interval = setInterval(() => {
      setGenerationJobs(prev => prev.map(job => {
        if (job.id === newJob.id && job.progress < 100) {
          const newProgress = Math.min(job.progress + Math.random() * 15, 100);
          return {
            ...job,
            progress: newProgress,
            status: newProgress === 100 ? 'completed' : 'processing',
            downloadUrl: newProgress === 100 ? `/downloads/bulletins-${job.id}.pdf` : undefined
          };
        }
        return job;
      }));
    }, 1000);

    setTimeout(() => {
      clearInterval(interval);
      setIsGenerating(false);
    }, 6000);
  };

  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <ResultsPageHeader 
        title="Bulletins personnalisables" 
        subtitle="Génération en moins de 5 secondes"
      />
      
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Génération Express */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Génération Express de Bulletins
              </CardTitle>
              <CardDescription>
                Sélectionnez un modèle et générez des bulletins pour vos étudiants en quelques clics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Modèle de bulletin</label>
                  <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir un modèle" />
                    </SelectTrigger>
                    <SelectContent>
                      {templates.map(template => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Classe/Promotion</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="l1-info">L1 Informatique</SelectItem>
                      <SelectItem value="l2-info">L2 Informatique</SelectItem>
                      <SelectItem value="l3-info">L3 Informatique</SelectItem>
                      <SelectItem value="m1-info">M1 Informatique</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Période</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="s1-2024">Semestre 1 2024</SelectItem>
                      <SelectItem value="s2-2024">Semestre 2 2024</SelectItem>
                      <SelectItem value="annuel-2024">Année 2024</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button 
                  onClick={handleGenerateBulletins}
                  disabled={!selectedTemplate || isGenerating}
                  className="flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  {isGenerating ? 'Génération...' : 'Générer Bulletins'}
                </Button>
                <Button variant="outline">
                  <Eye className="h-4 w-4 mr-2" />
                  Aperçu
                </Button>
                <Button variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Paramètres
                </Button>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="templates" className="space-y-6">
            <TabsList>
              <TabsTrigger value="templates">Modèles disponibles</TabsTrigger>
              <TabsTrigger value="generation">Générations en cours</TabsTrigger>
              <TabsTrigger value="history">Historique</TabsTrigger>
            </TabsList>

            <TabsContent value="templates" className="space-y-4">
              {/* Filtres et recherche */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Rechercher un modèle..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filtres
                  </Button>
                  <Button variant="outline" size="sm">
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>

              {/* Liste des modèles */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filteredTemplates.map((template) => {
                  const typeBadge = getTypeBadge(template.type);
                  
                  return (
                    <Card key={template.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{template.name}</CardTitle>
                            <CardDescription className="mt-1">
                              {template.description}
                            </CardDescription>
                          </div>
                          <Badge className={typeBadge.className}>
                            {typeBadge.label}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex justify-between items-center text-sm text-muted-foreground mb-4">
                          <span>Format: {template.format}</span>
                          <span>Utilisé {template.usageCount} fois</span>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            Aperçu
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            Utiliser
                          </Button>
                          <Button size="sm" variant="outline">
                            <Settings className="h-4 w-4 mr-2" />
                            Modifier
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="generation" className="space-y-4">
              {generationJobs.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Aucune génération en cours</h3>
                    <p className="text-muted-foreground">
                      Lancez une génération de bulletins pour voir le progès ici
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {generationJobs.map((job) => {
                    const statusBadge = getStatusBadge(job.status);
                    
                    return (
                      <Card key={job.id}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="font-medium">{job.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                {job.studentsCount} étudiants • Démarré à {job.startTime}
                              </p>
                            </div>
                            <Badge className={statusBadge.className}>
                              {statusBadge.label}
                            </Badge>
                          </div>
                          
                          {job.status === 'processing' && (
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Progression</span>
                                <span>{Math.round(job.progress)}%</span>
                              </div>
                              <Progress value={job.progress} className="h-2" />
                              {job.estimatedTime && (
                                <p className="text-xs text-muted-foreground">
                                  Temps estimé restant: {job.estimatedTime}
                                </p>
                              )}
                            </div>
                          )}
                          
                          {job.status === 'completed' && job.downloadUrl && (
                            <div className="flex gap-2 mt-3">
                              <Button size="sm">
                                <Download className="h-4 w-4 mr-2" />
                                Télécharger
                              </Button>
                              <Button size="sm" variant="outline">
                                <Printer className="h-4 w-4 mr-2" />
                                Imprimer
                              </Button>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </TabsContent>

            <TabsContent value="history" className="space-y-4">
              <Card>
                <CardContent className="text-center py-8">
                  <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Historique des générations</h3>
                  <p className="text-muted-foreground">
                    L'historique des générations précédentes apparaîtra ici
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}