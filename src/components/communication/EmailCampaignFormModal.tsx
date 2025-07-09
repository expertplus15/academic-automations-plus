import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Mail, Users, Clock, Target } from "lucide-react";

interface EmailCampaignFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaign?: any;
}

export function EmailCampaignFormModal({ 
  open, 
  onOpenChange, 
  campaign 
}: EmailCampaignFormModalProps) {
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: campaign?.name || '',
    subject: campaign?.subject || '',
    content: campaign?.content || '',
    template_id: campaign?.template_id || '',
    target_audience: campaign?.target_audience || 'all',
    trigger_type: campaign?.trigger_type || 'manual',
    frequency: campaign?.frequency || 'once',
    send_time: campaign?.send_time || '09:00',
    is_active: campaign?.is_active ?? true,
    track_opens: campaign?.track_opens ?? true,
    track_clicks: campaign?.track_clicks ?? true,
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentTab, setCurrentTab] = useState('basic');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.subject.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulation de la création/modification
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: campaign ? "Campagne modifiée" : "Campagne créée",
        description: campaign 
          ? "La campagne a été modifiée avec succès" 
          : "La campagne a été créée avec succès"
      });
      
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la sauvegarde",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      subject: '',
      content: '',
      template_id: '',
      target_audience: 'all',
      trigger_type: 'manual',
      frequency: 'once',
      send_time: '09:00',
      is_active: true,
      track_opens: true,
      track_clicks: true,
    });
    setCurrentTab('basic');
  };

  const templates = [
    { id: '1', name: 'Bienvenue étudiant', category: 'Inscription' },
    { id: '2', name: 'Rappel examen', category: 'Académique' },
    { id: '3', name: 'Notification paiement', category: 'Finance' },
    { id: '4', name: 'Newsletter mensuelle', category: 'Communication' },
  ];

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      onOpenChange(newOpen);
      if (!newOpen) resetForm();
    }}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            {campaign ? 'Modifier la campagne' : 'Nouvelle campagne email'}
          </DialogTitle>
        </DialogHeader>
        
        <Tabs value={currentTab} onValueChange={setCurrentTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Informations</TabsTrigger>
            <TabsTrigger value="content">Contenu</TabsTrigger>
            <TabsTrigger value="audience">Audience</TabsTrigger>
            <TabsTrigger value="settings">Paramètres</TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit} className="space-y-6 mt-6">
            <TabsContent value="basic" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Informations de base</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nom de la campagne *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Ex: Rappel inscription examens"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="subject">Objet de l'email *</Label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                      placeholder="Ex: N'oubliez pas de vous inscrire aux examens"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="template">Template (optionnel)</Label>
                    <Select value={formData.template_id} onValueChange={(value) => 
                      setFormData(prev => ({ ...prev, template_id: value }))
                    }>
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir un template" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Aucun template</SelectItem>
                        {templates.map((template) => (
                          <SelectItem key={template.id} value={template.id}>
                            <div className="flex items-center gap-2">
                              {template.name}
                              <Badge variant="outline" className="text-xs">
                                {template.category}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="content" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Contenu de l'email</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="content">Contenu HTML/Texte</Label>
                    <Textarea
                      id="content"
                      value={formData.content}
                      onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                      placeholder="Contenu de votre email..."
                      rows={10}
                      className="font-mono"
                    />
                  </div>
                  
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-medium mb-2">Variables disponibles :</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <code>{'{{nom_etudiant}}'}</code>
                      <code>{'{{prenom_etudiant}}'}</code>
                      <code>{'{{email_etudiant}}'}</code>
                      <code>{'{{programme_etudiant}}'}</code>
                      <code>{'{{date_actuelle}}'}</code>
                      <code>{'{{nom_etablissement}}'}</code>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="audience" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Public cible
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Audience</Label>
                    <Select value={formData.target_audience} onValueChange={(value) => 
                      setFormData(prev => ({ ...prev, target_audience: value }))
                    }>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner l'audience" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            Tous les utilisateurs
                          </div>
                        </SelectItem>
                        <SelectItem value="students">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            Étudiants uniquement
                          </div>
                        </SelectItem>
                        <SelectItem value="teachers">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            Enseignants uniquement
                          </div>
                        </SelectItem>
                        <SelectItem value="new_students">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            Nouveaux étudiants
                          </div>
                        </SelectItem>
                        <SelectItem value="inactive_students">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            Étudiants inactifs
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-blue-900">Aperçu de l'audience</span>
                    </div>
                    <p className="text-sm text-blue-700">
                      Cette campagne sera envoyée à environ <strong>1,247 destinataires</strong> selon les critères sélectionnés.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Paramètres d'envoi
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Type de déclenchement</Label>
                    <Select value={formData.trigger_type} onValueChange={(value) => 
                      setFormData(prev => ({ ...prev, trigger_type: value }))
                    }>
                      <SelectTrigger>
                        <SelectValue placeholder="Type de déclenchement" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manual">Manuel</SelectItem>
                        <SelectItem value="automatic">Automatique</SelectItem>
                        <SelectItem value="event">Basé sur un événement</SelectItem>
                        <SelectItem value="schedule">Programmé</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.trigger_type === 'schedule' && (
                    <>
                      <div>
                        <Label>Fréquence</Label>
                        <Select value={formData.frequency} onValueChange={(value) => 
                          setFormData(prev => ({ ...prev, frequency: value }))
                        }>
                          <SelectTrigger>
                            <SelectValue placeholder="Fréquence d'envoi" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="once">Une fois</SelectItem>
                            <SelectItem value="daily">Quotidien</SelectItem>
                            <SelectItem value="weekly">Hebdomadaire</SelectItem>
                            <SelectItem value="monthly">Mensuel</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="send_time">Heure d'envoi</Label>
                        <Input
                          id="send_time"
                          type="time"
                          value={formData.send_time}
                          onChange={(e) => setFormData(prev => ({ ...prev, send_time: e.target.value }))}
                        />
                      </div>
                    </>
                  )}

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="is_active">Campagne active</Label>
                        <p className="text-sm text-muted-foreground">La campagne sera activée immédiatement</p>
                      </div>
                      <Switch
                        id="is_active"
                        checked={formData.is_active}
                        onCheckedChange={(checked) => 
                          setFormData(prev => ({ ...prev, is_active: checked }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="track_opens">Suivi des ouvertures</Label>
                        <p className="text-sm text-muted-foreground">Suivre qui ouvre les emails</p>
                      </div>
                      <Switch
                        id="track_opens"
                        checked={formData.track_opens}
                        onCheckedChange={(checked) => 
                          setFormData(prev => ({ ...prev, track_opens: checked }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="track_clicks">Suivi des clics</Label>
                        <p className="text-sm text-muted-foreground">Suivre les clics sur les liens</p>
                      </div>
                      <Switch
                        id="track_clicks"
                        checked={formData.track_clicks}
                        onCheckedChange={(checked) => 
                          setFormData(prev => ({ ...prev, track_clicks: checked }))
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <div className="flex justify-between">
              <div className="flex gap-2">
                {currentTab !== 'basic' && (
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => {
                      const tabs = ['basic', 'content', 'audience', 'settings'];
                      const currentIndex = tabs.indexOf(currentTab);
                      if (currentIndex > 0) {
                        setCurrentTab(tabs[currentIndex - 1]);
                      }
                    }}
                  >
                    Précédent
                  </Button>
                )}
              </div>

              <div className="flex gap-2">
                {currentTab !== 'settings' ? (
                  <Button 
                    type="button"
                    onClick={() => {
                      const tabs = ['basic', 'content', 'audience', 'settings'];
                      const currentIndex = tabs.indexOf(currentTab);
                      if (currentIndex < tabs.length - 1) {
                        setCurrentTab(tabs[currentIndex + 1]);
                      }
                    }}
                  >
                    Suivant
                  </Button>
                ) : (
                  <>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => onOpenChange(false)}
                      disabled={isSubmitting}
                    >
                      Annuler
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? 'Sauvegarde...' : (campaign ? 'Modifier' : 'Créer la campagne')}
                    </Button>
                  </>
                )}
              </div>
            </div>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}