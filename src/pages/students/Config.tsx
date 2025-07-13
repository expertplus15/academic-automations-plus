import { StudentsModuleLayout } from "@/components/layouts/StudentsModuleLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  Settings, 
  Save, 
  RotateCcw,
  Shield,
  Bell,
  Database,
  FileText,
  Users,
  Calendar,
  Mail,
  AlertTriangle,
  CheckCircle,
  Clock
} from "lucide-react";
import { useState } from "react";

export default function Config() {
  const [hasChanges, setHasChanges] = useState(false);

  // Configuration générale
  const [generalConfig, setGeneralConfig] = useState({
    institutionName: "École Supérieure de Commerce et Informatique",
    institutionCode: "ESCI",
    currentAcademicYear: "2024-2025",
    defaultLanguage: "fr",
    timezone: "Europe/Paris",
    currency: "EUR",
    maxStudentsPerProgram: 100,
    autoGenerateStudentNumbers: true,
    enableNotifications: true,
    enableAuditLog: true
  });

  // Configuration inscription
  const [enrollmentConfig, setEnrollmentConfig] = useState({
    enableSelfRegistration: true,
    requireEmailVerification: true,
    requireDocumentUpload: true,
    maxUploadSize: 5, // MB
    allowedFileTypes: ["pdf", "jpg", "png"],
    autoApprovalEnabled: false,
    duplicateCheckEnabled: true,
    ageVerificationRequired: true,
    minimumAge: 16
  });

  // Configuration alertes
  const [alertConfig, setAlertConfig] = useState({
    enableAutomaticAlerts: true,
    attendanceThreshold: 3, // absences consécutives
    gradeThreshold: 10, // note minimale
    documentDelayThreshold: 7, // jours
    emailNotifications: true,
    smsNotifications: false,
    realTimeNotifications: true,
    alertRetentionDays: 90
  });

  // Configuration documents
  const [documentConfig, setDocumentConfig] = useState({
    enableDigitalSignature: true,
    defaultSignatory: "director",
    autoArchiving: true,
    documentValidityPeriod: 6, // mois
    watermarkEnabled: true,
    logoUrl: "/logo-institution.png",
    footerText: "Document officiel - Ne pas reproduire sans autorisation"
  });

  // Permissions utilisateurs
  const [permissions, setPermissions] = useState({
    students: {
      canViewOwnProfile: true,
      canEditPersonalInfo: true,
      canDownloadDocuments: true,
      canRequestDocuments: true,
      canViewGrades: true
    },
    teachers: {
      canViewAllStudents: true,
      canEditStudentInfo: false,
      canGenerateDocuments: true,
      canManageAlerts: true,
      canViewAnalytics: true
    },
    admin: {
      fullAccess: true,
      canDeleteStudents: true,
      canModifyGrades: true,
      canManageSystem: true,
      canViewAuditLogs: true
    }
  });

  const configSections = [
    {
      id: "general",
      title: "Configuration générale",
      icon: Settings,
      description: "Paramètres de base de l'institution"
    },
    {
      id: "enrollment", 
      title: "Inscription",
      icon: Users,
      description: "Paramètres du processus d'inscription"
    },
    {
      id: "alerts",
      title: "Alertes",
      icon: Bell,
      description: "Configuration des alertes automatiques"
    },
    {
      id: "documents",
      title: "Documents",
      icon: FileText,
      description: "Gestion des documents administratifs"
    },
    {
      id: "permissions",
      title: "Permissions",
      icon: Shield,
      description: "Droits d'accès par rôle utilisateur"
    },
    {
      id: "backup",
      title: "Sauvegarde",
      icon: Database,
      description: "Configuration des sauvegardes automatiques"
    }
  ];

  const saveConfiguration = () => {
    // Simulation de sauvegarde
    console.log("Configuration sauvegardée");
    setHasChanges(false);
  };

  const resetToDefaults = () => {
    // Reset configuration to defaults
    console.log("Configuration réinitialisée");
    setHasChanges(false);
  };

  return (
    <StudentsModuleLayout 
      title="Configuration Module" 
      subtitle="Paramètres et configuration du module de gestion des étudiants"
    >
      <div className="p-6 space-y-6">
        {/* Actions header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Settings className="w-6 h-6 text-primary" />
            <div>
              <h2 className="text-lg font-semibold">Configuration du module</h2>
              <p className="text-sm text-muted-foreground">
                Dernière modification: 13 Jan 2025, 14:30
              </p>
            </div>
          </div>
          
          <div className="flex gap-2">
            {hasChanges && (
              <Badge variant="outline" className="text-yellow-600">
                <Clock className="w-3 h-3 mr-1" />
                Modifications non sauvegardées
              </Badge>
            )}
            <Button variant="outline" size="sm" onClick={resetToDefaults}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Réinitialiser
            </Button>
            <Button size="sm" onClick={saveConfiguration}>
              <Save className="w-4 h-4 mr-2" />
              Sauvegarder
            </Button>
          </div>
        </div>

        {/* Statut du système */}
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-4 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div>
                  <div className="font-medium">Système opérationnel</div>
                  <div className="text-sm text-muted-foreground">Tous services actifs</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div>
                  <div className="font-medium">Base de données</div>
                  <div className="text-sm text-muted-foreground">Connectée</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div>
                  <div className="font-medium">Notifications</div>
                  <div className="text-sm text-muted-foreground">Actives</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div>
                  <div className="font-medium">Sauvegarde</div>
                  <div className="text-sm text-muted-foreground">Programmée</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            {configSections.map((section) => {
              const Icon = section.icon;
              return (
                <TabsTrigger key={section.id} value={section.id} className="flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  <span className="hidden md:inline">{section.title}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informations de l'institution</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="institutionName">Nom de l'institution</Label>
                    <Input 
                      id="institutionName"
                      value={generalConfig.institutionName}
                      onChange={(e) => {
                        setGeneralConfig(prev => ({...prev, institutionName: e.target.value}));
                        setHasChanges(true);
                      }}
                    />
                  </div>
                  <div>
                    <Label htmlFor="institutionCode">Code institution</Label>
                    <Input 
                      id="institutionCode"
                      value={generalConfig.institutionCode}
                      onChange={(e) => {
                        setGeneralConfig(prev => ({...prev, institutionCode: e.target.value}));
                        setHasChanges(true);
                      }}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="academicYear">Année académique</Label>
                    <Select value={generalConfig.currentAcademicYear}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2024-2025">2024-2025</SelectItem>
                        <SelectItem value="2025-2026">2025-2026</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="language">Langue par défaut</Label>
                    <Select value={generalConfig.defaultLanguage}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="timezone">Fuseau horaire</Label>
                    <Select value={generalConfig.timezone}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Europe/Paris">Europe/Paris</SelectItem>
                        <SelectItem value="UTC">UTC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Paramètres système</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Génération automatique des numéros étudiants</Label>
                      <p className="text-sm text-muted-foreground">Format: {generalConfig.institutionCode}YYXXX</p>
                    </div>
                    <Switch 
                      checked={generalConfig.autoGenerateStudentNumbers}
                      onCheckedChange={(checked) => {
                        setGeneralConfig(prev => ({...prev, autoGenerateStudentNumbers: checked}));
                        setHasChanges(true);
                      }}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Activer les notifications</Label>
                      <p className="text-sm text-muted-foreground">Notifications email et push</p>
                    </div>
                    <Switch 
                      checked={generalConfig.enableNotifications}
                      onCheckedChange={(checked) => {
                        setGeneralConfig(prev => ({...prev, enableNotifications: checked}));
                        setHasChanges(true);
                      }}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Journal d'audit</Label>
                      <p className="text-sm text-muted-foreground">Enregistrer toutes les actions utilisateurs</p>
                    </div>
                    <Switch 
                      checked={generalConfig.enableAuditLog}
                      onCheckedChange={(checked) => {
                        setGeneralConfig(prev => ({...prev, enableAuditLog: checked}));
                        setHasChanges(true);
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="enrollment" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Processus d'inscription</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Auto-inscription étudiants</Label>
                      <p className="text-sm text-muted-foreground">Permettre aux étudiants de s'inscrire directement</p>
                    </div>
                    <Switch 
                      checked={enrollmentConfig.enableSelfRegistration}
                      onCheckedChange={(checked) => {
                        setEnrollmentConfig(prev => ({...prev, enableSelfRegistration: checked}));
                        setHasChanges(true);
                      }}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Vérification email obligatoire</Label>
                      <p className="text-sm text-muted-foreground">Confirmer l'email avant activation</p>
                    </div>
                    <Switch 
                      checked={enrollmentConfig.requireEmailVerification}
                      onCheckedChange={(checked) => {
                        setEnrollmentConfig(prev => ({...prev, requireEmailVerification: checked}));
                        setHasChanges(true);
                      }}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Upload documents requis</Label>
                      <p className="text-sm text-muted-foreground">Exiger des documents justificatifs</p>
                    </div>
                    <Switch 
                      checked={enrollmentConfig.requireDocumentUpload}
                      onCheckedChange={(checked) => {
                        setEnrollmentConfig(prev => ({...prev, requireDocumentUpload: checked}));
                        setHasChanges(true);
                      }}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="maxUploadSize">Taille max upload (MB)</Label>
                    <Input 
                      id="maxUploadSize"
                      type="number"
                      value={enrollmentConfig.maxUploadSize}
                      onChange={(e) => {
                        setEnrollmentConfig(prev => ({...prev, maxUploadSize: parseInt(e.target.value)}));
                        setHasChanges(true);
                      }}
                    />
                  </div>
                  <div>
                    <Label htmlFor="minimumAge">Âge minimum</Label>
                    <Input 
                      id="minimumAge"
                      type="number"
                      value={enrollmentConfig.minimumAge}
                      onChange={(e) => {
                        setEnrollmentConfig(prev => ({...prev, minimumAge: parseInt(e.target.value)}));
                        setHasChanges(true);
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuration des alertes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="attendanceThreshold">Seuil absences</Label>
                    <Input 
                      id="attendanceThreshold"
                      type="number"
                      value={alertConfig.attendanceThreshold}
                      onChange={(e) => {
                        setAlertConfig(prev => ({...prev, attendanceThreshold: parseInt(e.target.value)}));
                        setHasChanges(true);
                      }}
                    />
                    <p className="text-xs text-muted-foreground">Absences consécutives</p>
                  </div>
                  <div>
                    <Label htmlFor="gradeThreshold">Note minimale</Label>
                    <Input 
                      id="gradeThreshold"
                      type="number"
                      value={alertConfig.gradeThreshold}
                      onChange={(e) => {
                        setAlertConfig(prev => ({...prev, gradeThreshold: parseInt(e.target.value)}));
                        setHasChanges(true);
                      }}
                    />
                    <p className="text-xs text-muted-foreground">Sur 20</p>
                  </div>
                  <div>
                    <Label htmlFor="documentDelay">Délai documents</Label>
                    <Input 
                      id="documentDelay"
                      type="number"
                      value={alertConfig.documentDelayThreshold}
                      onChange={(e) => {
                        setAlertConfig(prev => ({...prev, documentDelayThreshold: parseInt(e.target.value)}));
                        setHasChanges(true);
                      }}
                    />
                    <p className="text-xs text-muted-foreground">Jours</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Notifications email</Label>
                      <p className="text-sm text-muted-foreground">Envoyer les alertes par email</p>
                    </div>
                    <Switch 
                      checked={alertConfig.emailNotifications}
                      onCheckedChange={(checked) => {
                        setAlertConfig(prev => ({...prev, emailNotifications: checked}));
                        setHasChanges(true);
                      }}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Alertes temps réel</Label>
                      <p className="text-sm text-muted-foreground">Notifications instantanées dans l'interface</p>
                    </div>
                    <Switch 
                      checked={alertConfig.realTimeNotifications}
                      onCheckedChange={(checked) => {
                        setAlertConfig(prev => ({...prev, realTimeNotifications: checked}));
                        setHasChanges(true);
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuration documents</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Signature électronique</Label>
                      <p className="text-sm text-muted-foreground">Signer automatiquement les documents</p>
                    </div>
                    <Switch 
                      checked={documentConfig.enableDigitalSignature}
                      onCheckedChange={(checked) => {
                        setDocumentConfig(prev => ({...prev, enableDigitalSignature: checked}));
                        setHasChanges(true);
                      }}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Archivage automatique</Label>
                      <p className="text-sm text-muted-foreground">Archiver les documents générés</p>
                    </div>
                    <Switch 
                      checked={documentConfig.autoArchiving}
                      onCheckedChange={(checked) => {
                        setDocumentConfig(prev => ({...prev, autoArchiving: checked}));
                        setHasChanges(true);
                      }}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="signatory">Signataire par défaut</Label>
                    <Select value={documentConfig.defaultSignatory}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="director">Directeur</SelectItem>
                        <SelectItem value="secretary">Secrétaire générale</SelectItem>
                        <SelectItem value="registrar">Responsable scolarité</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="validityPeriod">Période de validité (mois)</Label>
                    <Input 
                      id="validityPeriod"
                      type="number"
                      value={documentConfig.documentValidityPeriod}
                      onChange={(e) => {
                        setDocumentConfig(prev => ({...prev, documentValidityPeriod: parseInt(e.target.value)}));
                        setHasChanges(true);
                      }}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="footerText">Texte de pied de page</Label>
                  <Textarea 
                    id="footerText"
                    value={documentConfig.footerText}
                    onChange={(e) => {
                      setDocumentConfig(prev => ({...prev, footerText: e.target.value}));
                      setHasChanges(true);
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="permissions" className="space-y-6">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Permissions Étudiants</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {Object.entries(permissions.students).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <Label>{key}</Label>
                      <Switch 
                        checked={value}
                        onCheckedChange={(checked) => {
                          setPermissions(prev => ({
                            ...prev, 
                            students: {...prev.students, [key]: checked}
                          }));
                          setHasChanges(true);
                        }}
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Permissions Enseignants</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {Object.entries(permissions.teachers).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <Label>{key}</Label>
                      <Switch 
                        checked={value}
                        onCheckedChange={(checked) => {
                          setPermissions(prev => ({
                            ...prev, 
                            teachers: {...prev.teachers, [key]: checked}
                          }));
                          setHasChanges(true);
                        }}
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="backup" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Sauvegarde automatique</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="backupFrequency">Fréquence</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner la fréquence" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Quotidienne</SelectItem>
                        <SelectItem value="weekly">Hebdomadaire</SelectItem>
                        <SelectItem value="monthly">Mensuelle</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="retentionPeriod">Rétention (jours)</Label>
                    <Input 
                      id="retentionPeriod"
                      type="number"
                      defaultValue="30"
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Sauvegarde automatique activée</Label>
                      <p className="text-sm text-muted-foreground">Prochaine sauvegarde: Demain 02:00</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Inclure les fichiers uploadés</Label>
                      <p className="text-sm text-muted-foreground">Photos et documents étudiants</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <Button variant="outline" className="w-full">
                    <Database className="w-4 h-4 mr-2" />
                    Lancer une sauvegarde manuelle
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </StudentsModuleLayout>
  );
}