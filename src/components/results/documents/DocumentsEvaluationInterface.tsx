import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Download, 
  Plus, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Eye,
  Settings,
  Zap,
  Users,
  BarChart3,
  Grid
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useResultsStats } from '@/hooks/useResultsStats';

export function DocumentsEvaluationInterface() {
  const navigate = useNavigate();
  const { stats, loading } = useResultsStats();
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'completed'>('all');

  // Mock data for documents - in real app, this would come from a hook
  const documents = [
    {
      id: '1',
      type: 'bulletin',
      title: 'Bulletin S1 - 2024',
      status: 'completed',
      studentCount: 245,
      generatedAt: '2024-01-15T10:30:00Z',
      downloadUrl: '#'
    },
    {
      id: '2',
      type: 'transcript',
      title: 'Relevé de notes - L3',
      status: 'pending',
      studentCount: 89,
      generatedAt: null,
      downloadUrl: null
    },
    {
      id: '3',
      type: 'certificate',
      title: 'Attestations de réussite',
      status: 'completed',
      studentCount: 156,
      generatedAt: '2024-01-14T15:45:00Z',
      downloadUrl: '#'
    }
  ];

  const filteredDocuments = documents.filter(doc => {
    if (activeFilter === 'pending') return doc.status === 'pending';
    if (activeFilter === 'completed') return doc.status === 'completed';
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50';
      case 'pending': return 'text-orange-600 bg-orange-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Généré';
      case 'pending': return 'En attente';
      default: return 'Inconnu';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Documents générés</p>
                <p className="text-2xl font-bold">{stats.documentsGenerated}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Modèles disponibles</p>
                <p className="text-2xl font-bold">{stats.templatesAvailable}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">En attente</p>
                <p className="text-2xl font-bold">{documents.filter(d => d.status === 'pending').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Zap className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Temps moyen</p>
                <p className="text-2xl font-bold">{stats.averageGenerationTime}s</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Zap className="w-5 h-5 text-blue-600" />
              Génération Express
            </CardTitle>
            <CardDescription>
              Créez des bulletins personnalisés en quelques clics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button 
                onClick={() => navigate('/documents/generator')}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nouveau Bulletin
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate('/documents/templates')}
                className="w-full"
              >
                <Eye className="w-4 h-4 mr-2" />
                Voir Modèles
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Grid className="w-5 h-5 text-purple-600" />
              Interface Matricielle
            </CardTitle>
            <CardDescription>
              Accès direct à la saisie collaborative
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button 
                onClick={() => navigate('/results/matrix')}
                className="w-full"
              >
                <Grid className="w-4 h-4 mr-2" />
                Ouvrir Interface
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('/results/matrix?new=true')}
                className="w-full"
              >
                <Users className="w-4 h-4 mr-2" />
                Nouvelle Session
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <BarChart3 className="w-5 h-5 text-green-600" />
              Analytics
            </CardTitle>
            <CardDescription>
              Suivi des performances et métriques
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button 
                onClick={() => navigate('/results/analytics')}
                className="w-full"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Voir Analytics
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('/results/validation')}
                className="w-full"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Validation
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Documents Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Gestion des Documents d'Évaluation</CardTitle>
              <CardDescription>
                Gérez vos bulletins, relevés de notes et attestations
              </CardDescription>
            </div>
            <Button onClick={() => navigate('/documents/generator')}>
              <Plus className="w-4 h-4 mr-2" />
              Nouveau Document
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeFilter} onValueChange={(value) => setActiveFilter(value as any)}>
            <TabsList>
              <TabsTrigger value="all">Tous ({documents.length})</TabsTrigger>
              <TabsTrigger value="pending">En attente ({documents.filter(d => d.status === 'pending').length})</TabsTrigger>
              <TabsTrigger value="completed">Générés ({documents.filter(d => d.status === 'completed').length})</TabsTrigger>
            </TabsList>

            <TabsContent value={activeFilter} className="space-y-4">
              {filteredDocuments.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Aucun document trouvé</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredDocuments.map((doc) => (
                    <Card key={doc.id} className="border border-border/50">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <FileText className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="font-medium">{doc.title}</h3>
                              <p className="text-sm text-muted-foreground">
                                {doc.studentCount} étudiants
                                {doc.generatedAt && (
                                  <> • Généré le {new Date(doc.generatedAt).toLocaleDateString('fr-FR')}</>
                                )}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-3">
                            <Badge className={getStatusColor(doc.status)}>
                              {getStatusText(doc.status)}
                            </Badge>
                            
                            {doc.status === 'completed' && doc.downloadUrl && (
                              <Button size="sm" variant="outline">
                                <Download className="w-4 h-4 mr-2" />
                                Télécharger
                              </Button>
                            )}
                            
                            {doc.status === 'pending' && (
                              <Button size="sm">
                                <Zap className="w-4 h-4 mr-2" />
                                Générer
                              </Button>
                            )}
                            
                            <Button size="sm" variant="ghost">
                              <Settings className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}