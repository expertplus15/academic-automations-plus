
import { StudentsModuleLayout } from "@/components/layouts/StudentsModuleLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye,
  FileText,
  User,
  AlertTriangle,
  Filter
} from "lucide-react";
import { useState } from "react";

export default function RegistrationApproval() {
  const [selectedTab, setSelectedTab] = useState('pending');

  const pendingApplications = [
    {
      id: 1,
      studentName: "Marie Dubois",
      program: "DUT Informatique",
      submittedDate: "2024-01-15",
      score: 85,
      documentsComplete: true,
      priority: "high",
      notes: "Dossier complet, excellents résultats"
    },
    {
      id: 2,
      studentName: "Jean Martin",
      program: "DUT GEA",
      submittedDate: "2024-01-14",
      score: 72,
      documentsComplete: false,
      priority: "medium",
      notes: "Manque certificat de scolarité"
    },
    {
      id: 3,
      studentName: "Sarah Johnson",
      program: "DUT GMP",
      submittedDate: "2024-01-13",
      score: 78,
      documentsComplete: true,
      priority: "medium",
      notes: "Profil technique intéressant"
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-destructive bg-destructive/10';
      case 'medium': return 'text-warning bg-warning/10';
      case 'low': return 'text-success bg-success/10';
      default: return 'text-muted-foreground bg-muted/10';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return 'Urgent';
      case 'medium': return 'Normal';
      case 'low': return 'Faible';
      default: return 'Standard';
    }
  };

  return (
    <StudentsModuleLayout 
      title="Gestion des Approbations" 
      subtitle="Validation et traitement des demandes d'inscription en attente"
    >
      <div className="p-6 space-y-6">
        {/* Header avec statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="cursor-pointer hover:shadow-md transition-shadow" 
                onClick={() => setSelectedTab('pending')}>
            <CardContent className="p-4 text-center">
              <Clock className="h-8 w-8 text-warning mx-auto mb-2" />
              <p className="text-2xl font-bold">12</p>
              <p className="text-sm text-muted-foreground">En attente</p>
            </CardContent>
          </Card>
          
          <Card className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedTab('approved')}>
            <CardContent className="p-4 text-center">
              <CheckCircle className="h-8 w-8 text-success mx-auto mb-2" />
              <p className="text-2xl font-bold">28</p>
              <p className="text-sm text-muted-foreground">Approuvées</p>
            </CardContent>
          </Card>
          
          <Card className="cursor-pointer hover-shadow-md transition-shadow"
                onClick={() => setSelectedTab('rejected')}>
            <CardContent className="p-4 text-center">
              <XCircle className="h-8 w-8 text-destructive mx-auto mb-2" />
              <p className="text-2xl font-bold">5</p>
              <p className="text-sm text-muted-foreground">Rejetées</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <AlertTriangle className="h-8 w-8 text-info mx-auto mb-2" />
              <p className="text-2xl font-bold">3</p>
              <p className="text-sm text-muted-foreground">Révision</p>
            </CardContent>
          </Card>
        </div>

        {/* Filtres et actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filtres
            </Button>
            <Badge variant="secondary">Programme: Tous</Badge>
            <Badge variant="secondary">Priorité: Toutes</Badge>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">Traitement par lot</Button>
            <Button size="sm">Actions rapides</Button>
          </div>
        </div>

        {/* Liste des demandes */}
        <Card>
          <CardHeader>
            <CardTitle>Demandes en Attente de Validation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingApplications.map((application) => (
                <div key={application.id} 
                     className="flex items-center justify-between p-4 bg-muted/20 rounded-lg hover:bg-muted/40 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium">{application.studentName}</p>
                        <Badge 
                          variant="secondary" 
                          className={getPriorityColor(application.priority)}
                        >
                          {getPriorityLabel(application.priority)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{application.program}</p>
                      <p className="text-xs text-muted-foreground">
                        Soumis le {application.submittedDate} • Score: {application.score}/100
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className="text-right mr-4">
                      <div className="flex items-center gap-2 mb-1">
                        <FileText className="w-4 h-4" />
                        <span className="text-sm">
                          {application.documentsComplete ? (
                            <Badge variant="outline" className="text-success">Complet</Badge>
                          ) : (
                            <Badge variant="outline" className="text-warning">Incomplet</Badge>
                          )}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">{application.notes}</p>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="text-destructive">
                        <XCircle className="w-4 h-4" />
                      </Button>
                      <Button size="sm" className="text-success">
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Actions groupées */}
        <Card>
          <CardHeader>
            <CardTitle>Actions Groupées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="justify-start">
                <CheckCircle className="w-4 h-4 mr-2" />
                Approuver la sélection
              </Button>
              <Button variant="outline" className="justify-start">
                <XCircle className="w-4 h-4 mr-2" />
                Rejeter la sélection
              </Button>
              <Button variant="outline" className="justify-start">
                <FileText className="w-4 h-4 mr-2" />
                Demander documents
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </StudentsModuleLayout>
  );
}
