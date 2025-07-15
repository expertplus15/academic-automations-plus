import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CheckCircle, 
  AlertCircle, 
  Eye, 
  MessageSquare,
  TrendingUp,
  Users,
  BookOpen,
  Clock,
  FileCheck,
  XCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function ValidationDashboard() {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState<'current' | 'all'>('current');

  // Mock data for validation metrics
  const validationMetrics = {
    pending: 23,
    approved: 156,
    rejected: 8,
    anomalies: 12,
    qualityScore: 94.2
  };

  const pendingItems = [
    {
      id: '1',
      type: 'bulletin',
      title: 'Bulletins S1 - L3 Informatique',
      studentCount: 45,
      anomalies: 2,
      submittedBy: 'Prof. Martin',
      submittedAt: '2024-01-15T10:30:00Z',
      priority: 'high'
    },
    {
      id: '2',
      type: 'transcript',
      title: 'Relevés Master 1 - Gestion',
      studentCount: 28,
      anomalies: 0,
      submittedBy: 'Prof. Dubois',
      submittedAt: '2024-01-14T15:45:00Z',
      priority: 'medium'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-orange-600 bg-orange-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return 'Urgent';
      case 'medium': return 'Normal';
      case 'low': return 'Faible';
      default: return 'Non définie';
    }
  };

  return (
    <div className="space-y-6">
      {/* Métriques de validation */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">En attente</p>
                <p className="text-2xl font-bold">{validationMetrics.pending}</p>
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
                <p className="text-sm text-muted-foreground">Approuvés</p>
                <p className="text-2xl font-bold">{validationMetrics.approved}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Rejetés</p>
                <p className="text-2xl font-bold">{validationMetrics.rejected}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Anomalies</p>
                <p className="text-2xl font-bold">{validationMetrics.anomalies}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Score qualité</p>
                <p className="text-2xl font-bold">{validationMetrics.qualityScore}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Eye className="w-5 h-5 text-blue-600" />
              Consultation Rapide
            </CardTitle>
            <CardDescription>
              Accès direct aux consultations par classe ou étudiant
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button 
                onClick={() => navigate('/results/validation/by-class')}
                className="w-full"
              >
                <Users className="w-4 h-4 mr-2" />
                Par Classe
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('/results/validation/by-student')}
                className="w-full"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Par Étudiant
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileCheck className="w-5 h-5 text-green-600" />
              Validation Lot
            </CardTitle>
            <CardDescription>
              Approbation groupée et gestion des anomalies
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button 
                onClick={() => navigate('/results/validation/batch')}
                className="w-full"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Approuver Lot
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('/results/validation/anomalies')}
                className="w-full"
              >
                <AlertCircle className="w-4 h-4 mr-2" />
                Gérer Anomalies
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              Vers Production
            </CardTitle>
            <CardDescription>
              Lancer la production après validation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button 
                onClick={() => navigate('/results/production')}
                className="w-full"
              >
                <FileCheck className="w-4 h-4 mr-2" />
                Aller à Production
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('/results/validation/history')}
                className="w-full"
              >
                <Clock className="w-4 h-4 mr-2" />
                Historique
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des éléments en attente */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Éléments en Attente de Validation</CardTitle>
              <CardDescription>
                Documents soumis nécessitant votre approbation
              </CardDescription>
            </div>
            <Button onClick={() => navigate('/results/validation/batch')}>
              <CheckCircle className="w-4 h-4 mr-2" />
              Valider Tout
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedPeriod} onValueChange={(value) => setSelectedPeriod(value as any)}>
            <TabsList>
              <TabsTrigger value="current">En cours ({pendingItems.length})</TabsTrigger>
              <TabsTrigger value="all">Historique</TabsTrigger>
            </TabsList>

            <TabsContent value={selectedPeriod} className="space-y-4">
              {pendingItems.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <p className="text-muted-foreground">Tous les documents sont validés !</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingItems.map((item) => (
                    <Card key={item.id} className="border border-border/50">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="p-2 bg-orange-100 rounded-lg">
                              <Clock className="w-5 h-5 text-orange-600" />
                            </div>
                            <div>
                              <h3 className="font-medium">{item.title}</h3>
                              <p className="text-sm text-muted-foreground">
                                {item.studentCount} étudiants • Soumis par {item.submittedBy}
                                {item.anomalies > 0 && (
                                  <> • <span className="text-red-600">{item.anomalies} anomalie(s)</span></>
                                )}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-3">
                            <Badge className={getPriorityColor(item.priority)}>
                              {getPriorityText(item.priority)}
                            </Badge>
                            
                            {item.anomalies > 0 && (
                              <Badge className="text-red-600 bg-red-50">
                                <AlertCircle className="w-3 h-3 mr-1" />
                                {item.anomalies} anomalies
                              </Badge>
                            )}
                            
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4 mr-2" />
                              Consulter
                            </Button>
                            
                            <Button size="sm">
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Valider
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