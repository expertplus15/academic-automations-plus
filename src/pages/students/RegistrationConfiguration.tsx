
import { StudentsModuleLayout } from "@/components/layouts/StudentsModuleLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Settings, 
  Database, 
  Mail,
  Upload,
  Download,
  CheckCircle,
  AlertTriangle,
  Users,
  FileText
} from "lucide-react";

export default function RegistrationConfiguration() {
  const systemSettings = {
    autoValidation: true,
    emailNotifications: true,
    documentValidation: false,
    bulkImport: true,
    integrationActive: true
  };

  const integrationStatus = [
    {
      service: "Système de scolarité",
      status: "connected",
      lastSync: "Il y a 15 min",
      icon: Database
    },
    {
      service: "Service email institutionnel",
      status: "connected", 
      lastSync: "Il y a 5 min",
      icon: Mail
    },
    {
      service: "Plateforme pédagogique",
      status: "warning",
      lastSync: "Il y a 2 heures",
      icon: Users
    },
    {
      service: "Gestionnaire de documents",
      status: "disconnected",
      lastSync: "Il y a 3 jours",
      icon: FileText
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'text-success bg-success/10';
      case 'warning': return 'text-warning bg-warning/10';
      case 'disconnected': return 'text-destructive bg-destructive/10';
      default: return 'text-muted-foreground bg-muted/10';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'connected': return 'Connecté';
      case 'warning': return 'Attention';
      case 'disconnected': return 'Déconnecté';
      default: return 'Inconnu';
    }
  };

  return (
    <StudentsModuleLayout 
      title="Configuration du Système" 
      subtitle="Paramètres et configuration du processus d'inscription automatisé"
    >
      <div className="p-6 space-y-6">
        {/* Paramètres principaux */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Paramètres du Système
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-medium">Validation automatique</p>
                  <p className="text-sm text-muted-foreground">
                    Approuver automatiquement les dossiers qui respectent tous les critères
                  </p>
                </div>
                <Switch checked={systemSettings.autoValidation} />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-medium">Notifications email</p>
                  <p className="text-sm text-muted-foreground">
                    Envoyer des notifications automatiques aux étudiants et au personnel
                  </p>
                </div>
                <Switch checked={systemSettings.emailNotifications} />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-medium">Validation des documents</p>
                  <p className="text-sm text-muted-foreground">
                    Vérifier automatiquement la validité et la conformité des documents
                  </p>
                </div>
                <Switch checked={systemSettings.documentValidation} />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-medium">Import en lot</p>
                  <p className="text-sm text-muted-foreground">
                    Permettre l'importation de multiples candidatures via fichier CSV
                  </p>
                </div>
                <Switch checked={systemSettings.bulkImport} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Intégrations système */}
        <Card>
          <CardHeader>
            <CardTitle>Intégrations Système</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {integrationStatus.map((integration, index) => (
                <div key={index} 
                     className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <integration.icon className="h-8 w-8 text-primary" />
                    <div>
                      <p className="font-medium">{integration.service}</p>
                      <p className="text-sm text-muted-foreground">
                        Dernière synchronisation: {integration.lastSync}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge 
                      variant="secondary" 
                      className={getStatusColor(integration.status)}
                    >
                      {getStatusLabel(integration.status)}
                    </Badge>
                    <Button variant="outline" size="sm">
                      {integration.status === 'connected' ? 'Configurer' : 'Reconnecter'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Import/Export */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Import de Données</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border-2 border-dashed border-muted rounded-lg text-center">
                  <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm font-medium">Importer des candidatures</p>
                  <p className="text-xs text-muted-foreground">
                    Format CSV avec les colonnes: nom, prénom, email, programme
                  </p>
                </div>
                <Button className="w-full">
                  <Upload className="w-4 h-4 mr-2" />
                  Sélectionner un fichier
                </Button>
                <Button variant="outline" className="w-full">
                  Télécharger le modèle CSV
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Export de Données</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="w-4 h-4 mr-2" />
                    Exporter toutes les inscriptions
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="w-4 h-4 mr-2" />
                    Exporter les inscriptions approuvées
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="w-4 h-4 mr-2" />
                    Exporter les demandes en attente
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="w-4 h-4 mr-2" />
                    Rapport d'activité
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* État du système */}
        <Card>
          <CardHeader>
            <CardTitle>État du Système</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-success/10 rounded-lg">
                <CheckCircle className="w-8 h-8 text-success mx-auto mb-2" />
                <p className="font-medium text-success">Services opérationnels</p>
                <p className="text-sm text-muted-foreground">Tous les services fonctionnent normalement</p>
              </div>
              
              <div className="text-center p-4 bg-warning/10 rounded-lg">
                <AlertTriangle className="w-8 h-8 text-warning mx-auto mb-2" />
                <p className="font-medium text-warning">1 Service en attention</p>
                <p className="text-sm text-muted-foreground">Plateforme pédagogique partiellement synchronisée</p>
              </div>
              
              <div className="text-center p-4 bg-info/10 rounded-lg">
                <Database className="w-8 h-8 text-info mx-auto mb-2" />
                <p className="font-medium text-info">Base de données</p>
                <p className="text-sm text-muted-foreground">542 enregistrements • Sauvegarde OK</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions de maintenance */}
        <Card>
          <CardHeader>
            <CardTitle>Maintenance & Support</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Button variant="outline" className="justify-start">
                <Database className="w-4 h-4 mr-2" />
                Sauvegarde manuelle
              </Button>
              <Button variant="outline" className="justify-start">
                <Settings className="w-4 h-4 mr-2" />
                Réinitialiser cache
              </Button>
              <Button variant="outline" className="justify-start">
                <CheckCircle className="w-4 h-4 mr-2" />
                Test de connectivité
              </Button>
              <Button variant="outline" className="justify-start">
                <FileText className="w-4 h-4 mr-2" />
                Logs système
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </StudentsModuleLayout>
  );
}
