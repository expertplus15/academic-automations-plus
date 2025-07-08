import { CommunicationModuleLayout } from "@/components/layouts/CommunicationModuleLayout";
import { CommunicationPageHeader } from "@/components/CommunicationPageHeader";
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { 
  Mail, 
  MailOpen,
  Send,
  Clock,
  Users,
  Settings,
  Plus,
  Edit,
  Play,
  Pause,
  Copy,
  Eye,
  Calendar,
  Target
} from "lucide-react";
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export default function CommunicationEmails() {
  const { hasRole } = useAuth();
  const { toast } = useToast();

  const canManageEmails = hasRole(['admin', 'hr']);

  const emailCampaigns = [
    {
      id: "1",
      name: "Rappel inscription examens",
      subject: "N'oubliez pas de vous inscrire aux examens",
      template: "exam_reminder",
      status: "active",
      trigger: "auto",
      frequency: "weekly",
      targetAudience: "Étudiants",
      nextSend: "2024-01-15 09:00",
      totalSent: 245,
      openRate: 78,
      clickRate: 23
    },
    {
      id: "2",
      name: "Bienvenue nouveaux étudiants",
      subject: "Bienvenue dans notre établissement !",
      template: "welcome_student",
      status: "active",
      trigger: "enrollment",
      frequency: "immediate",
      targetAudience: "Nouveaux étudiants",
      nextSend: "À l'inscription",
      totalSent: 56,
      openRate: 92,
      clickRate: 45
    },
    {
      id: "3",
      name: "Rapport mensuel enseignants",
      subject: "Votre rapport d'activité mensuel",
      template: "monthly_report",
      status: "paused",
      trigger: "scheduled",
      frequency: "monthly",
      targetAudience: "Enseignants",
      nextSend: "2024-02-01 08:00",
      totalSent: 134,
      openRate: 85,
      clickRate: 34
    }
  ];

  const emailTemplates = [
    {
      id: "1",
      name: "Rappel examen",
      category: "Académique",
      usage: 245,
      lastUsed: "Il y a 2 jours"
    },
    {
      id: "2",
      name: "Bienvenue étudiant",
      category: "Inscription",
      usage: 56,
      lastUsed: "Il y a 1 semaine"
    },
    {
      id: "3",
      name: "Notification paiement",
      category: "Finance",
      usage: 89,
      lastUsed: "Il y a 3 jours"
    }
  ];

  const handleCreateCampaign = () => {
    if (canManageEmails) {
      toast({
        title: "Nouvelle campagne",
        description: "Fonctionnalité de création de campagne en développement",
      });
    } else {
      toast({
        title: "Accès refusé",
        description: "Vous n'avez pas les permissions pour créer des campagnes",
        variant: "destructive"
      });
    }
  };

  const handleToggleCampaign = (id: string, currentStatus: string) => {
    if (canManageEmails) {
      const newStatus = currentStatus === 'active' ? 'paused' : 'active';
      toast({
        title: `Campagne ${newStatus === 'active' ? 'activée' : 'mise en pause'}`,
        description: `La campagne a été ${newStatus === 'active' ? 'activée' : 'mise en pause'}`,
      });
    } else {
      toast({
        title: "Accès refusé",
        description: "Vous n'avez pas les permissions pour modifier des campagnes",
        variant: "destructive"
      });
    }
  };

  const handleCreateTemplate = () => {
    if (canManageEmails) {
      toast({
        title: "Nouveau template",
        description: "Fonctionnalité de création de template en développement",
      });
    } else {
      toast({
        title: "Accès refusé",
        description: "Vous n'avez pas les permissions pour créer des templates",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default">Actif</Badge>;
      case 'paused':
        return <Badge variant="secondary">En pause</Badge>;
      case 'draft':
        return <Badge variant="outline">Brouillon</Badge>;
      default:
        return null;
    }
  };

  return (
    <ProtectedRoute allowedRoles={['admin', 'hr', 'teacher', 'student']}>
      <CommunicationModuleLayout>
        <CommunicationPageHeader 
          title="Emails Automatiques" 
          subtitle="Gestion des campagnes d'emails et notifications automatisées" 
        />
        <div className="p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            
            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Campagnes Email</h2>
                <p className="text-muted-foreground">Automatisation des communications par email</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline">
                  <Settings className="w-4 h-4 mr-2" />
                  Paramètres SMTP
                </Button>
                {canManageEmails && (
                  <Button onClick={handleCreateCampaign}>
                    <Plus className="w-4 h-4 mr-2" />
                    Nouvelle Campagne
                  </Button>
                )}
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Emails envoyés/mois</p>
                      <p className="text-2xl font-bold">2,847</p>
                    </div>
                    <Send className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Taux d'ouverture</p>
                      <p className="text-2xl font-bold">85%</p>
                    </div>
                    <MailOpen className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Campagnes actives</p>
                      <p className="text-2xl font-bold">7</p>
                    </div>
                    <Clock className="h-8 w-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Templates</p>
                      <p className="text-2xl font-bold">23</p>
                    </div>
                    <Mail className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Campaigns List */}
              <div className="lg:col-span-2 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Campagnes Email</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {emailCampaigns.map((campaign) => (
                        <div key={campaign.id} className="p-4 border rounded-lg">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="font-semibold">{campaign.name}</h3>
                                {getStatusBadge(campaign.status)}
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">
                                {campaign.subject}
                              </p>
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Target className="h-3 w-3" />
                                  {campaign.targetAudience}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {campaign.frequency}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {campaign.nextSend}
                                </span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleToggleCampaign(campaign.id, campaign.status)}
                              >
                                {campaign.status === 'active' ? 
                                  <Pause className="h-4 w-4" /> : 
                                  <Play className="h-4 w-4" />
                                }
                              </Button>
                              {canManageEmails && (
                                <Button variant="outline" size="sm">
                                  <Edit className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-4 pt-3 border-t">
                            <div className="text-center">
                              <p className="text-sm font-medium">{campaign.totalSent}</p>
                              <p className="text-xs text-muted-foreground">Envoyés</p>
                            </div>
                            <div className="text-center">
                              <p className="text-sm font-medium">{campaign.openRate}%</p>
                              <p className="text-xs text-muted-foreground">Ouverture</p>
                            </div>
                            <div className="text-center">
                              <p className="text-sm font-medium">{campaign.clickRate}%</p>
                              <p className="text-xs text-muted-foreground">Clics</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Templates & Settings */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Templates Email</CardTitle>
                      {canManageEmails && (
                        <Button size="sm" onClick={handleCreateTemplate}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {emailTemplates.map((template) => (
                        <div key={template.id} className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-sm">{template.name}</h4>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="icon" className="h-6 w-6">
                                <Eye className="h-3 w-3" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-6 w-6">
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground space-y-1">
                            <p>Catégorie: {template.category}</p>
                            <p>Utilisé {template.usage} fois</p>
                            <p>{template.lastUsed}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Configuration Globale</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Emails activés</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Tracking d'ouverture</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Tracking de clics</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Limite envois/heure</label>
                      <Input type="number" defaultValue="100" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email expéditeur</label>
                      <Input defaultValue="noreply@etablissement.edu" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </CommunicationModuleLayout>
    </ProtectedRoute>
  );
}