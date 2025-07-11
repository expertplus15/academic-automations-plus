import React from 'react';
import { ModuleLayout } from "@/components/layouts/ModuleLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Settings as SettingsIcon, 
  Database, 
  Users, 
  Shield, 
  FileText, 
  Workflow,
  Bell,
  Archive,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export default function Settings() {
  const systemModules = [
    {
      title: "Gestion des catégories",
      description: "Configurer les catégories de documents et leur hiérarchie",
      icon: Database,
      status: "active",
      count: "6 catégories"
    },
    {
      title: "Workflows de signature",
      description: "Définir les circuits de validation et de signature",
      icon: Workflow,
      status: "active",
      count: "3 workflows"
    },
    {
      title: "Sources de données",
      description: "Configurer les connexions aux bases de données externes",
      icon: Database,
      status: "warning",
      count: "2 sources"
    },
    {
      title: "Notifications système",
      description: "Paramétrer les alertes et notifications automatiques",
      icon: Bell,
      status: "active",
      count: "5 types"
    },
    {
      title: "Audit et conformité",
      description: "Configurer les logs d'audit et la conformité RGPD",
      icon: Shield,
      status: "active",
      count: "100% conforme"
    },
    {
      title: "Archive automatique",
      description: "Définir les règles d'archivage automatique des documents",
      icon: Archive,
      status: "active",
      count: "30 jours"
    }
  ];

  const securitySettings = [
    {
      title: "Signatures électroniques",
      description: "Certificats numériques et validation des signatures",
      enabled: true
    },
    {
      title: "Chiffrement des documents",
      description: "Chiffrement AES-256 pour tous les documents sensibles",
      enabled: true
    },
    {
      title: "Authentification multi-facteurs",
      description: "Activation obligatoire pour les opérations critiques",
      enabled: true
    },
    {
      title: "Audit trail immutable",
      description: "Traçabilité complète de toutes les opérations",
      enabled: true
    }
  ];

  const performanceMetrics = [
    { label: "Temps de génération moyen", value: "2.3s", status: "good" },
    { label: "Disponibilité du service", value: "99.8%", status: "excellent" },
    { label: "Espace de stockage utilisé", value: "67%", status: "good" },
    { label: "Documents traités/jour", value: "1,234", status: "good" }
  ];

  return (
    <ModuleLayout 
      title="Paramètres Documentaires" 
      subtitle="Configuration et administration du système de gestion documentaire"
      showHeader={true}
    >
      <div className="p-6 space-y-6">
        
        {/* Configuration des modules */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="h-5 w-5" />
              Configuration des modules
            </CardTitle>
            <CardDescription>
              Gérer les différents composants du système documentaire
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {systemModules.map((module, index) => (
                <Card key={index} className="border border-border">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <module.icon className="h-4 w-4" />
                        <h4 className="font-semibold text-sm">{module.title}</h4>
                      </div>
                      {module.status === 'active' ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-orange-500" />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-xs text-muted-foreground mb-3">
                      {module.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="text-xs">
                        {module.count}
                      </Badge>
                      <Button size="sm" variant="outline">
                        Configurer
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sécurité et conformité */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Sécurité et conformité
            </CardTitle>
            <CardDescription>
              Paramètres de sécurité et conformité réglementaire
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {securitySettings.map((setting, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <h4 className="font-medium">{setting.title}</h4>
                    <p className="text-sm text-muted-foreground">{setting.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={setting.enabled ? "default" : "secondary"}>
                      {setting.enabled ? "Activé" : "Désactivé"}
                    </Badge>
                    <Button size="sm" variant="outline">
                      Modifier
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Métriques de performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Métriques de performance
            </CardTitle>
            <CardDescription>
              Surveillance des performances du système en temps réel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {performanceMetrics.map((metric, index) => (
                <div key={index} className="text-center p-4 border border-border rounded-lg">
                  <div className="text-2xl font-bold mb-1">{metric.value}</div>
                  <div className="text-sm text-muted-foreground">{metric.label}</div>
                  <Badge 
                    variant={metric.status === 'excellent' ? 'default' : 'secondary'}
                    className="mt-2"
                  >
                    {metric.status === 'excellent' ? 'Excellent' : 'Bon'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Actions système */}
        <Card>
          <CardHeader>
            <CardTitle>Actions système</CardTitle>
            <CardDescription>
              Outils d'administration et de maintenance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                <Database className="h-6 w-6" />
                <span className="text-sm">Sauvegarde</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                <Archive className="h-6 w-6" />
                <span className="text-sm">Archivage</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                <Shield className="h-6 w-6" />
                <span className="text-sm">Audit</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                <Users className="h-6 w-6" />
                <span className="text-sm">Utilisateurs</span>
              </Button>
            </div>
          </CardContent>
        </Card>

      </div>
    </ModuleLayout>
  );
}