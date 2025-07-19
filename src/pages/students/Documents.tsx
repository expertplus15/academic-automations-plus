
import { StudentsModuleLayout } from "@/components/layouts/StudentsModuleLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Download, 
  Upload,
  CheckCircle,
  Clock,
  AlertTriangle,
  Search,
  Filter,
  Archive
} from "lucide-react";

export default function Documents() {
  const documentStats = {
    totalDocuments: 542,
    pending: 23,
    approved: 485,
    rejected: 12
  };

  const documentTypes = [
    {
      type: "Certificats de scolarité",
      count: 145,
      pending: 8,
      icon: FileText,
      color: "text-primary"
    },
    {
      type: "Relevés de notes",
      count: 128,
      pending: 5,
      icon: FileText,
      color: "text-success"
    },
    {
      type: "Attestations diverses",
      count: 89,
      pending: 7,
      icon: FileText,
      color: "text-info"
    },
    {
      type: "Documents d'inscription",
      count: 180,
      pending: 3,
      icon: FileText,
      color: "text-warning"
    }
  ];

  const recentDocuments = [
    {
      id: 1,
      studentName: "Marie Dubois",
      documentType: "Certificat de scolarité",
      status: "approved",
      requestDate: "2024-01-15",
      processedDate: "2024-01-16"
    },
    {
      id: 2,
      studentName: "Jean Martin",
      documentType: "Relevé de notes S1",
      status: "pending",
      requestDate: "2024-01-14",
      processedDate: null
    },
    {
      id: 3,
      studentName: "Sarah Johnson",
      documentType: "Attestation de stage",
      status: "rejected",
      requestDate: "2024-01-13",
      processedDate: "2024-01-14"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-success bg-success/10';
      case 'pending': return 'text-warning bg-warning/10';
      case 'rejected': return 'text-destructive bg-destructive/10';
      default: return 'text-muted-foreground bg-muted/10';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'approved': return 'Approuvé';
      case 'pending': return 'En attente';
      case 'rejected': return 'Rejeté';
      default: return 'Inconnu';
    }
  };

  return (
    <StudentsModuleLayout 
      title="Documents Administratifs" 
      subtitle="Gestion centralisée des documents et attestations étudiantes"
    >
      <div className="p-6 space-y-6">
        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Documents</p>
                  <p className="text-2xl font-bold">{documentStats.totalDocuments}</p>
                </div>
                <FileText className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">En attente</p>
                  <p className="text-2xl font-bold text-warning">{documentStats.pending}</p>
                </div>
                <Clock className="h-8 w-8 text-warning" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Approuvés</p>
                  <p className="text-2xl font-bold text-success">{documentStats.approved}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Rejetés</p>
                  <p className="text-2xl font-bold text-destructive">{documentStats.rejected}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-destructive" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions rapides */}
        <Card>
          <CardHeader>
            <CardTitle>Actions Rapides</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Button className="justify-start">
                <Upload className="w-4 h-4 mr-2" />
                Traiter les demandes
              </Button>
              <Button variant="outline" className="justify-start">
                <Download className="w-4 h-4 mr-2" />
                Génération en lot
              </Button>
              <Button variant="outline" className="justify-start">
                <Search className="w-4 h-4 mr-2" />
                Recherche avancée
              </Button>
              <Button variant="outline" className="justify-start">
                <Archive className="w-4 h-4 mr-2" />
                Archivage
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Types de documents */}
        <Card>
          <CardHeader>
            <CardTitle>Types de Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {documentTypes.map((docType, index) => (
                <div key={index} 
                     className="flex items-center justify-between p-4 bg-muted/20 rounded-lg hover:bg-muted/40 transition-colors">
                  <div className="flex items-center space-x-3">
                    <docType.icon className={`h-8 w-8 ${docType.color}`} />
                    <div>
                      <p className="font-medium">{docType.type}</p>
                      <p className="text-sm text-muted-foreground">
                        {docType.count} documents
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    {docType.pending > 0 && (
                      <Badge variant="secondary" className="mb-2">
                        {docType.pending} en attente
                      </Badge>
                    )}
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Voir tout
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Demandes récentes */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Demandes Récentes</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtrer
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Exporter
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentDocuments.map((doc) => (
                <div key={doc.id} 
                     className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <FileText className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium">{doc.studentName}</p>
                        <Badge 
                          variant="secondary" 
                          className={getStatusColor(doc.status)}
                        >
                          {getStatusLabel(doc.status)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{doc.documentType}</p>
                      <p className="text-xs text-muted-foreground">
                        Demandé le {doc.requestDate}
                        {doc.processedDate && ` • Traité le ${doc.processedDate}`}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Détails
                    </Button>
                    {doc.status === 'approved' && (
                      <Button size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Télécharger
                      </Button>
                    )}
                    {doc.status === 'pending' && (
                      <Button size="sm">
                        Traiter
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Outils de gestion */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Modèles de Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  Certificat de scolarité
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  Relevé de notes
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  Attestation de stage
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  Convention de stage
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Paramètres & Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Signature automatique:</span>
                  <Badge variant="outline" className="text-success">Activée</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Validation directeur:</span>
                  <Badge variant="outline" className="text-warning">Requise</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Archivage automatique:</span>
                  <Badge variant="outline" className="text-success">30 jours</Badge>
                </div>
                <Button variant="outline" className="w-full">
                  Modifier la configuration
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </StudentsModuleLayout>
  );
}
