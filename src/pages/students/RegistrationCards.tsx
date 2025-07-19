
import { StudentsModuleLayout } from "@/components/layouts/StudentsModuleLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CreditCard, 
  Printer, 
  Download, 
  QrCode,
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle,
  Camera
} from "lucide-react";

export default function RegistrationCards() {
  const cardStats = {
    totalCards: 156,
    printed: 142,
    pending: 14,
    expired: 8
  };

  const cardQueue = [
    {
      id: 1,
      studentName: "Marie Dubois",
      studentNumber: "2024001",
      program: "DUT Informatique",
      status: "ready",
      photoStatus: "approved",
      generatedDate: "2024-01-15"
    },
    {
      id: 2,
      studentName: "Jean Martin", 
      studentNumber: "2024002",
      program: "DUT GEA",
      status: "pending",
      photoStatus: "missing",
      generatedDate: null
    },
    {
      id: 3,
      studentName: "Sarah Johnson",
      studentNumber: "2024003", 
      program: "DUT GMP",
      status: "printed",
      photoStatus: "approved",
      generatedDate: "2024-01-14"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'text-success bg-success/10';
      case 'pending': return 'text-warning bg-warning/10';
      case 'printed': return 'text-info bg-info/10';
      default: return 'text-muted-foreground bg-muted/10';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ready': return 'Prête';
      case 'pending': return 'En attente';
      case 'printed': return 'Imprimée';
      default: return 'Inconnue';
    }
  };

  return (
    <StudentsModuleLayout 
      title="Cartes Étudiants" 
      subtitle="Gestion et production des cartes d'identité étudiantes"
    >
      <div className="p-6 space-y-6">
        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Cartes</p>
                  <p className="text-2xl font-bold">{cardStats.totalCards}</p>
                </div>
                <CreditCard className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Imprimées</p>
                  <p className="text-2xl font-bold text-success">{cardStats.printed}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">En attente</p>
                  <p className="text-2xl font-bold text-warning">{cardStats.pending}</p>
                </div>
                <Clock className="h-8 w-8 text-warning" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Expirées</p>
                  <p className="text-2xl font-bold text-destructive">{cardStats.expired}</p>
                </div>
                <Calendar className="h-8 w-8 text-destructive" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions rapides */}
        <Card>
          <CardHeader>
            <CardTitle>Actions de Production</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Button className="justify-start">
                <Printer className="w-4 h-4 mr-2" />
                Imprimer lot
              </Button>
              <Button variant="outline" className="justify-start">
                <Download className="w-4 h-4 mr-2" />
                Exporter PDF
              </Button>
              <Button variant="outline" className="justify-start">
                <QrCode className="w-4 h-4 mr-2" />
                Générer QR codes
              </Button>
              <Button variant="outline" className="justify-start">
                <Camera className="w-4 h-4 mr-2" />
                Photos manquantes
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* File d'attente d'impression */}
        <Card>
          <CardHeader>
            <CardTitle>File d'Attente de Production</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {cardQueue.map((card) => (
                <div key={card.id} 
                     className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-12 bg-gradient-to-br from-primary to-primary/70 rounded flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium">{card.studentName}</p>
                        <Badge 
                          variant="secondary" 
                          className={getStatusColor(card.status)}
                        >
                          {getStatusLabel(card.status)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {card.studentNumber} • {card.program}
                      </p>
                      <div className="flex items-center gap-4 mt-1">
                        <div className="flex items-center gap-1">
                          <Camera className="w-3 h-3" />
                          <span className="text-xs">
                            {card.photoStatus === 'approved' ? (
                              <span className="text-success">Photo OK</span>
                            ) : (
                              <span className="text-warning">Photo manquante</span>
                            )}
                          </span>
                        </div>
                        {card.generatedDate && (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span className="text-xs text-muted-foreground">
                              Générée le {card.generatedDate}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {card.status === 'ready' && (
                      <Button size="sm">
                        <Printer className="w-4 h-4 mr-2" />
                        Imprimer
                      </Button>
                    )}
                    {card.status === 'pending' && card.photoStatus === 'missing' && (
                      <Button variant="outline" size="sm">
                        <Camera className="w-4 h-4 mr-2" />
                        Ajouter photo
                      </Button>
                    )}
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Template et configuration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Modèle de Carte</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="w-full h-32 bg-gradient-to-br from-primary to-primary/70 rounded-lg flex items-center justify-center text-white">
                  <div className="text-center">
                    <CreditCard className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-sm font-medium">Carte Étudiant IUT</p>
                    <p className="text-xs opacity-80">Format 85.60 × 53.98 mm</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  Modifier le modèle
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Configuration d'Impression</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Imprimante:</span>
                  <Badge variant="outline">Canon PIXMA PRO-200</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Papier:</span>
                  <Badge variant="outline">PVC 0.76mm</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Qualité:</span>
                  <Badge variant="outline">Haute (600 DPI)</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Status:</span>
                  <Badge className="text-success">Prête</Badge>
                </div>
                <Button variant="outline" className="w-full">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Tester l'impression
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </StudentsModuleLayout>
  );
}
