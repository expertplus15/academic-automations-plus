import { StudentsModuleLayout } from "@/components/layouts/StudentsModuleLayout";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  User,
  FileText,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Eye,
  Filter,
  Search,
  Calendar,
  Download,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Star,
  AlertCircle
} from 'lucide-react';
import { useState } from 'react';

export default function RegistrationApproval() {
  const [selectedApplication, setSelectedApplication] = useState<any>(null);

  const pendingApplications = [
    {
      id: 1,
      student: {
        name: "Marie Dubois",
        email: "marie.dubois@email.com",
        phone: "06.12.34.56.78",
        address: "123 Rue de la Paix, 75001 Paris"
      },
      program: "Master Informatique",
      submittedAt: "2024-01-15T14:32:00",
      priority: "high",
      score: 18.5,
      documents: {
        identity: "complete",
        diploma: "complete", 
        transcript: "pending",
        motivation: "complete",
        recommendation: "missing"
      },
      status: "pending_review",
      reviewer: null,
      notes: "Excellent dossier académique, à traiter en priorité"
    },
    {
      id: 2,
      student: {
        name: "Jean Martin",
        email: "jean.martin@email.com",
        phone: "06.98.76.54.32",
        address: "456 Avenue des Champs, 69000 Lyon"
      },
      program: "Licence Commerce",
      submittedAt: "2024-01-14T11:20:00",
      priority: "medium",
      score: 14.2,
      documents: {
        identity: "complete",
        diploma: "complete",
        transcript: "complete", 
        motivation: "pending",
        recommendation: "complete"
      },
      status: "pending_documents",
      reviewer: "Dr. Smith",
      notes: "Documents manquants pour finaliser"
    },
    {
      id: 3,
      student: {
        name: "Sophie Laurent",
        email: "sophie.laurent@email.com",
        phone: "06.11.22.33.44",
        address: "789 Boulevard des Arts, 13000 Marseille"
      },
      program: "BTS Design Graphique",
      submittedAt: "2024-01-13T16:45:00",
      priority: "low",
      score: 16.8,
      documents: {
        identity: "complete",
        diploma: "complete",
        transcript: "complete",
        motivation: "complete",
        recommendation: "complete"
      },
      status: "ready_for_approval",
      reviewer: "M. Dupont",
      notes: "Dossier complet, portfolio excellent"
    }
  ];

  const approvalStats = [
    { label: "En attente", count: 43, color: "bg-yellow-500" },
    { label: "En révision", count: 18, color: "bg-blue-500" },
    { label: "Approuvées", count: 284, color: "bg-green-500" },
    { label: "Refusées", count: 12, color: "bg-red-500" }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending_review':
        return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200"><Clock className="w-3 h-3 mr-1" />En attente</Badge>;
      case 'pending_documents':
        return <Badge className="bg-blue-100 text-blue-700 border-blue-200"><FileText className="w-3 h-3 mr-1" />Documents</Badge>;
      case 'ready_for_approval':
        return <Badge className="bg-green-100 text-green-700 border-green-200"><CheckCircle className="w-3 h-3 mr-1" />Prêt</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getDocumentStatus = (status: string) => {
    switch (status) {
      case 'complete':
        return <Badge className="bg-green-100 text-green-700 text-xs">✓</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-700 text-xs">⏳</Badge>;
      case 'missing':
        return <Badge className="bg-red-100 text-red-700 text-xs">✗</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-700 text-xs">?</Badge>;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-500';
    }
  };

  const handleApprove = (applicationId: number) => {
    console.log(`Approving application ${applicationId}`);
    // Logique d'approbation
  };

  const handleReject = (applicationId: number, reason: string) => {
    console.log(`Rejecting application ${applicationId} with reason: ${reason}`);
    // Logique de refus
  };

  return (
    <StudentsModuleLayout 
      title="Workflow d'Approbation"
      subtitle="Gestion des validations et approbations d'inscriptions"
    >
      <div className="p-8 space-y-8">
        {/* Actions et filtres */}
        <div className="flex justify-between items-center">
          <div className="flex gap-3">
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filtres
            </Button>
            <Button variant="outline">
              <Search className="w-4 h-4 mr-2" />
              Rechercher
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Exporter
            </Button>
          </div>
          <Badge variant="outline" className="px-3 py-1">
            {pendingApplications.length} candidatures en attente
          </Badge>
        </div>

        {/* Statistiques d'approbation */}
        <div className="grid grid-cols-4 gap-4">
          {approvalStats.map((stat, index) => (
            <Card key={index} className="bg-white rounded-xl shadow-sm border-0">
              <CardContent className="p-4 text-center">
                <div className={`w-3 h-3 ${stat.color} rounded-full mx-auto mb-2`}></div>
                <div className="text-2xl font-bold">{stat.count}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs pour organiser les candidatures */}
        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="pending">En attente ({pendingApplications.filter(app => app.status === 'pending_review').length})</TabsTrigger>
            <TabsTrigger value="documents">Documents manquants ({pendingApplications.filter(app => app.status === 'pending_documents').length})</TabsTrigger>
            <TabsTrigger value="ready">Prêtes à approuver ({pendingApplications.filter(app => app.status === 'ready_for_approval').length})</TabsTrigger>
            <TabsTrigger value="history">Historique</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            {pendingApplications.filter(app => app.status === 'pending_review').map((application) => (
              <Card key={application.id} className={`bg-white rounded-xl shadow-sm border-l-4 ${getPriorityColor(application.priority)} hover:shadow-md transition-all duration-300`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-4">
                      {/* Informations candidat */}
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-emerald-100 rounded-xl">
                          <User className="w-6 h-6 text-emerald-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold">{application.student.name}</h3>
                            <Badge variant="outline" className="text-xs">
                              {application.priority}
                            </Badge>
                            {getStatusBadge(application.status)}
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Mail className="w-3 h-3" />
                              {application.student.email}
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="w-3 h-3" />
                              {application.student.phone}
                            </div>
                            <div className="flex items-center gap-2">
                              <GraduationCap className="w-3 h-3" />
                              {application.program}
                            </div>
                            <div className="flex items-center gap-2">
                              <Star className="w-3 h-3" />
                              Score: {application.score}/20
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* État des documents */}
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-medium">Documents:</span>
                        <div className="flex gap-2">
                          <span className="text-xs">Identité {getDocumentStatus(application.documents.identity)}</span>
                          <span className="text-xs">Diplôme {getDocumentStatus(application.documents.diploma)}</span>
                          <span className="text-xs">Relevés {getDocumentStatus(application.documents.transcript)}</span>
                          <span className="text-xs">Motivation {getDocumentStatus(application.documents.motivation)}</span>
                          <span className="text-xs">Recommandation {getDocumentStatus(application.documents.recommendation)}</span>
                        </div>
                      </div>

                      {/* Notes */}
                      {application.notes && (
                        <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                          <MessageSquare className="w-4 h-4 text-blue-600 mt-0.5" />
                          <span className="text-sm text-blue-700">{application.notes}</span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 ml-6">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setSelectedApplication(application)}>
                            <Eye className="w-4 h-4 mr-2" />
                            Examiner
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Examen de candidature - {application.student.name}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-6">
                            {/* Détails complets du candidat */}
                            <div className="grid grid-cols-2 gap-6">
                              <div className="space-y-4">
                                <h4 className="font-semibold">Informations personnelles</h4>
                                <div className="space-y-2 text-sm">
                                  <div className="flex items-center gap-2">
                                    <User className="w-4 h-4 text-muted-foreground" />
                                    {application.student.name}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-muted-foreground" />
                                    {application.student.email}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-muted-foreground" />
                                    {application.student.phone}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-muted-foreground" />
                                    {application.student.address}
                                  </div>
                                </div>
                              </div>
                              <div className="space-y-4">
                                <h4 className="font-semibold">Candidature</h4>
                                <div className="space-y-2 text-sm">
                                  <div className="flex items-center gap-2">
                                    <GraduationCap className="w-4 h-4 text-muted-foreground" />
                                    {application.program}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-muted-foreground" />
                                    Soumise le {new Date(application.submittedAt).toLocaleDateString()}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Star className="w-4 h-4 text-muted-foreground" />
                                    Score: {application.score}/20
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Actions d'approbation */}
                            <div className="flex gap-4 pt-4 border-t">
                              <Button 
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => handleApprove(application.id)}
                              >
                                <ThumbsUp className="w-4 h-4 mr-2" />
                                Approuver
                              </Button>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="destructive">
                                    <ThumbsDown className="w-4 h-4 mr-2" />
                                    Refuser
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Motif de refus</DialogTitle>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <Textarea 
                                      placeholder="Veuillez indiquer le motif du refus..."
                                      rows={4}
                                    />
                                    <div className="flex gap-2">
                                      <Button 
                                        variant="destructive"
                                        onClick={() => handleReject(application.id, "Motif saisi")}
                                      >
                                        Confirmer le refus
                                      </Button>
                                      <Button variant="outline">Annuler</Button>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                              <Button variant="outline">
                                <MessageSquare className="w-4 h-4 mr-2" />
                                Demander des précisions
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="documents">
            {pendingApplications.filter(app => app.status === 'pending_documents').map((application) => (
              <Card key={application.id} className="bg-white rounded-xl shadow-sm border-l-4 border-l-blue-500">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-100 rounded-xl">
                        <FileText className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{application.student.name}</h3>
                        <p className="text-sm text-muted-foreground">{application.program}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <AlertCircle className="w-4 h-4 text-blue-600" />
                          <span className="text-sm text-blue-600">Documents à compléter</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline">
                      <Mail className="w-4 h-4 mr-2" />
                      Relancer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="ready">
            {pendingApplications.filter(app => app.status === 'ready_for_approval').map((application) => (
              <Card key={application.id} className="bg-white rounded-xl shadow-sm border-l-4 border-l-green-500">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-green-100 rounded-xl">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{application.student.name}</h3>
                        <p className="text-sm text-muted-foreground">{application.program}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm text-green-600">Dossier complet - Prêt à approuver</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button className="bg-green-600 hover:bg-green-700">
                        <ThumbsUp className="w-4 h-4 mr-2" />
                        Approuver
                      </Button>
                      <Button variant="outline">
                        <Eye className="w-4 h-4 mr-2" />
                        Examiner
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="history">
            <Card className="bg-white rounded-xl shadow-sm border-0">
              <CardContent className="p-6 text-center">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">Historique des approbations</p>
                <p className="text-sm text-muted-foreground mt-1">Fonctionnalité en développement</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </StudentsModuleLayout>
  );
}