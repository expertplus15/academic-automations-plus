import React, { useState } from 'react';
import { CommunicationModuleLayout } from '@/components/layouts/CommunicationModuleLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { NewCampaignModal } from '@/components/communication/NewCampaignModal';
import { Mail, Plus, Send, Users, BarChart3, Eye, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const initialCampaigns = [
  {
    id: 1,
    name: "Rentrée 2024 - Informations importantes",
    status: "sent",
    recipients: 456,
    openRate: 78.5,
    clickRate: 23.1,
    sentDate: "2024-01-15",
    subject: "Informations importantes pour la rentrée"
  },
  {
    id: 2,
    name: "Événement portes ouvertes",
    status: "draft",
    recipients: 1200,
    openRate: 0,
    clickRate: 0,
    sentDate: null,
    subject: "Découvrez notre établissement"
  },
  {
    id: 3,
    name: "Rappel frais de scolarité",
    status: "scheduled",
    recipients: 234,
    openRate: 0,
    clickRate: 0,
    sentDate: "2024-01-20",
    subject: "Échéance de paiement approchant"
  }
];

export default function Campaigns() {
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [showNewCampaignModal, setShowNewCampaignModal] = useState(false);
  const [campaignsData, setCampaignsData] = useState(initialCampaigns);
  const { toast } = useToast();

  const handleCreateCampaign = (campaignData: any) => {
    const newCampaign = {
      id: campaignsData.length + 1,
      name: campaignData.name,
      status: campaignData.scheduleType === 'now' ? 'sent' : 
              campaignData.scheduleType === 'draft' ? 'draft' : 'scheduled',
      recipients: getAudienceCount(campaignData.targetAudience),
      openRate: 0,
      clickRate: 0,
      sentDate: campaignData.scheduleType === 'scheduled' ? campaignData.scheduledDate : 
                 campaignData.scheduleType === 'now' ? new Date().toISOString().split('T')[0] : null,
      subject: campaignData.subject
    };
    
    setCampaignsData(prev => [...prev, newCampaign]);
    toast({
      title: "Campagne créée",
      description: `La campagne "${campaignData.name}" a été créée avec succès.`,
    });
  };

  const getAudienceCount = (audienceId: string) => {
    const audiences = {
      'all': 1250,
      'students': 856,
      'teachers': 124,
      'parents': 567,
      'staff': 89
    };
    return audiences[audienceId] || 0;
  };

  const handleViewCampaign = (campaignId: number) => {
    toast({
      title: "Consulter la campagne",
      description: `Ouverture de la campagne #${campaignId}`,
    });
  };

  const handleShowStats = (campaignId: number) => {
    toast({
      title: "Statistiques",
      description: `Affichage des statistiques de la campagne #${campaignId}`,
    });
  };

  const handleEditCampaign = (campaignId: number) => {
    toast({
      title: "Modifier la campagne",
      description: `Modification de la campagne #${campaignId}`,
    });
  };

  const handleSendCampaign = (campaignId: number) => {
    toast({
      title: "Campagne envoyée",
      description: `La campagne #${campaignId} a été envoyée avec succès.`,
    });
  };

  const headerActions = [
    {
      label: "Nouvelle campagne",
      icon: Plus,
      onClick: () => setShowNewCampaignModal(true),
      variant: 'default' as const
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'sent':
        return <Badge variant="default" className="bg-green-100 text-green-800">Envoyée</Badge>;
      case 'draft':
        return <Badge variant="secondary">Brouillon</Badge>;
      case 'scheduled':
        return <Badge variant="default" className="bg-blue-100 text-blue-800">Programmée</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <ProtectedRoute allowedRoles={['admin', 'teacher', 'hr']}>
      <CommunicationModuleLayout 
        showHeader={true}
        title="Campagnes Email"
        subtitle="Créez et gérez vos campagnes d'emailing"
        actions={headerActions}
      >
        <div className="p-6 space-y-6">
          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Campagnes totales
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">+2 ce mois</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Taux d'ouverture moyen
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">76.2%</div>
                <p className="text-xs text-muted-foreground">+3.2% vs mois dernier</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Emails envoyés
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3,456</div>
                <p className="text-xs text-muted-foreground">Ce mois</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Taux de clic moyen
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">18.4%</div>
                <p className="text-xs text-muted-foreground">+1.1% vs mois dernier</p>
              </CardContent>
            </Card>
          </div>

          {/* Campaigns List */}
          <Card>
            <CardHeader>
              <CardTitle>Vos campagnes</CardTitle>
              <CardDescription>
                Gérez et suivez vos campagnes d'emailing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {campaignsData.map((campaign) => (
                  <div key={campaign.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Mail className="w-5 h-5 text-primary" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium">{campaign.name}</h3>
                          {getStatusBadge(campaign.status)}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{campaign.subject}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {campaign.recipients} destinataires
                          </span>
                          {campaign.status === 'sent' && (
                            <>
                              <span>Ouverture: {campaign.openRate}%</span>
                              <span>Clic: {campaign.clickRate}%</span>
                            </>
                          )}
                          {campaign.sentDate && (
                            <span>
                              {campaign.status === 'sent' ? 'Envoyée le' : 'Programmée pour le'} {campaign.sentDate}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleViewCampaign(campaign.id)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleShowStats(campaign.id)}>
                        <BarChart3 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleEditCampaign(campaign.id)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      {campaign.status === 'draft' && (
                        <Button size="sm" onClick={() => handleSendCampaign(campaign.id)}>
                          <Send className="w-4 h-4 mr-2" />
                          Envoyer
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Templates section */}
          <Card>
            <CardHeader>
              <CardTitle>Modèles disponibles</CardTitle>
              <CardDescription>
                Utilisez nos modèles prédéfinis pour créer rapidement vos campagnes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {['Newsletter mensuelle', 'Annonce événement', 'Rappel paiement'].map((template) => (
                  <div key={template} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center">
                        <Mail className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">{template}</h4>
                        <p className="text-sm text-muted-foreground">Modèle prêt à utiliser</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <NewCampaignModal
          open={showNewCampaignModal}
          onOpenChange={setShowNewCampaignModal}
          onSave={handleCreateCampaign}
        />
      </CommunicationModuleLayout>
    </ProtectedRoute>
  );
}