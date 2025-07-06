import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Award, 
  FileText, 
  Shield, 
  Download, 
  Eye, 
  Search,
  CheckCircle,
  Clock,
  Lock,
  Stamp,
  Users,
  BarChart3
} from 'lucide-react';

export function TranscriptsDashboard() {
  const [transcriptRequests, setTranscriptRequests] = useState([
    {
      id: 1,
      studentName: 'Marie Dubois',
      studentNumber: 'ETU2024001',
      program: 'Master Commerce International',
      requestDate: '2024-01-15',
      status: 'approved',
      type: 'official',
      deliveryMethod: 'secure_email'
    },
    {
      id: 2,
      studentName: 'Jean Martin',
      studentNumber: 'ETU2024002',
      program: 'Licence Gestion',
      requestDate: '2024-01-14',
      status: 'pending_review',
      type: 'certified',
      deliveryMethod: 'postal'
    },
    {
      id: 3,
      studentName: 'Sophie Bernard',
      studentNumber: 'ETU2024003',
      program: 'BTS Commerce',
      requestDate: '2024-01-12',
      status: 'completed',
      type: 'standard',
      deliveryMethod: 'pickup'
    }
  ]);

  const transcriptStats = {
    totalRequests: 245,
    pendingApproval: 12,
    completedThisMonth: 89,
    averageProcessingTime: '2.5 jours'
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending_review':
        return <Clock className="w-4 h-4 text-amber-600" />;
      case 'completed':
        return <Award className="w-4 h-4 text-blue-600" />;
      case 'rejected':
        return <Lock className="w-4 h-4 text-red-600" />;
      default:
        return <FileText className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Approuvé';
      case 'pending_review':
        return 'En attente';
      case 'completed':
        return 'Terminé';
      case 'rejected':
        return 'Refusé';
      default:
        return 'Inconnu';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
      case 'completed':
        return 'default';
      case 'pending_review':
        return 'secondary';
      case 'rejected':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'official':
        return 'Officiel';
      case 'certified':
        return 'Certifié';
      case 'standard':
        return 'Standard';
      default:
        return 'Standard';
    }
  };

  return (
    <div className="space-y-6">
      {/* Statistiques des relevés */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{transcriptStats.totalRequests}</p>
                <p className="text-sm text-muted-foreground">Demandes totales</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-600">{transcriptStats.pendingApproval}</p>
                <p className="text-sm text-muted-foreground">En attente</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">{transcriptStats.completedThisMonth}</p>
                <p className="text-sm text-muted-foreground">Ce mois</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{transcriptStats.averageProcessingTime}</p>
                <p className="text-sm text-muted-foreground">Délai moyen</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="requests" className="space-y-4">
        <TabsList>
          <TabsTrigger value="requests">Demandes</TabsTrigger>
          <TabsTrigger value="generate">Génération</TabsTrigger>
          <TabsTrigger value="templates">Modèles officiels</TabsTrigger>
          <TabsTrigger value="security">Sécurité</TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Demandes de relevés</h3>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher une demande..."
                  className="pl-10 w-64"
                />
              </div>
              <Button>
                Nouvelle demande
              </Button>
            </div>
          </div>
          
          <div className="space-y-3">
            {transcriptRequests.map(request => (
              <Card key={request.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(request.status)}
                      <div>
                        <p className="font-medium">{request.studentName}</p>
                        <div className="flex gap-4 text-sm text-muted-foreground">
                          <span>{request.studentNumber}</span>
                          <span>{request.program}</span>
                          <span>Demandé le {request.requestDate}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <Badge variant={getStatusColor(request.status) as any}>
                          {getStatusLabel(request.status)}
                        </Badge>
                        <div className="flex gap-2 text-xs text-muted-foreground mt-1">
                          <span>{getTypeLabel(request.type)}</span>
                          <span>•</span>
                          <span>{request.deliveryMethod}</span>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        {request.status === 'completed' && (
                          <Button variant="ghost" size="sm">
                            <Download className="w-4 h-4" />
                          </Button>
                        )}
                        {request.status === 'pending_review' && (
                          <Button size="sm">
                            Approuver
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="generate" className="space-y-4">
          <h3 className="text-lg font-semibold">Génération de relevés</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-blue-500" />
                  Relevé Standard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Relevé de notes standard pour usage courant
                </p>
                <div className="space-y-3">
                  <Button className="w-full">
                    Générer relevé
                  </Button>
                  <div className="text-xs text-muted-foreground">
                    Sans certification officielle
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-emerald-500" />
                  Relevé Certifié
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Document officiel avec cachet et signature électronique
                </p>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full">
                    <Stamp className="w-4 h-4 mr-2" />
                    Générer certifié
                  </Button>
                  <div className="text-xs text-muted-foreground">
                    Avec authentification
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-amber-500" />
                  Génération en Lot
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Génération automatique pour plusieurs étudiants
                </p>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full">
                    <Users className="w-4 h-4 mr-2" />
                    Traitement groupé
                  </Button>
                  <div className="text-xs text-muted-foreground">
                    Par programme ou promotion
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <h3 className="text-lg font-semibold">Modèles officiels</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-500" />
                  Relevé Standard National
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Format officiel conforme aux standards de l'Éducation Nationale
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span>Utilisations cette année</span>
                    <span className="font-medium">1,247</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Dernière modification</span>
                    <span className="font-medium">15/01/2024</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    Aperçu
                  </Button>
                  <Button variant="outline" size="sm">
                    Modifier
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-emerald-500" />
                  Relevé International
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Format bilingue avec équivalences ECTS pour échanges internationaux
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span>Utilisations cette année</span>
                    <span className="font-medium">156</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Dernière modification</span>
                    <span className="font-medium">08/01/2024</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    Aperçu
                  </Button>
                  <Button variant="outline" size="sm">
                    Modifier
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <h3 className="text-lg font-semibold">Sécurité et authentification</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-red-500" />
                  Authentification
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Signature électronique</label>
                  <p className="text-sm text-muted-foreground">Activée - Certificat valide</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Cachet numérique</label>
                  <p className="text-sm text-muted-foreground">Automatique sur documents certifiés</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Code de vérification</label>
                  <p className="text-sm text-muted-foreground">QR Code + URL de validation</p>
                </div>
                <Button variant="outline">
                  <Shield className="w-4 h-4 mr-2" />
                  Configurer
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Stamp className="w-5 h-5 text-blue-500" />
                  Traçabilité
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Journal des accès</label>
                  <p className="text-sm text-muted-foreground">Tous les accès sont tracés</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Historique des modifications</label>
                  <p className="text-sm text-muted-foreground">Versioning complet</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Archivage sécurisé</label>
                  <p className="text-sm text-muted-foreground">Rétention 10 ans</p>
                </div>
                <Button variant="outline">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Voir les logs
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}