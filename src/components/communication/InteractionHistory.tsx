import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  MessageSquare, 
  Phone, 
  Calendar, 
  FileText, 
  Plus,
  User,
  Clock,
  Mail,
  Video
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface InteractionHistoryProps {
  partner: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InteractionHistory({ partner, open, onOpenChange }: InteractionHistoryProps) {
  const { toast } = useToast();
  const [newInteraction, setNewInteraction] = useState({
    type: 'EMAIL',
    subject: '',
    content: '',
    interaction_date: new Date().toISOString().split('T')[0]
  });

  // Mock interaction data - in real app, this would come from usePartners hook
  const mockInteractions = [
    {
      id: '1',
      type: 'EMAIL',
      subject: 'Proposition de partenariat',
      content: 'Première prise de contact pour discuter d\'une collaboration sur les stages étudiants.',
      interaction_date: '2024-01-15T10:30:00Z',
      user: { full_name: 'Marie Dubois', email: 'marie.dubois@school.fr' }
    },
    {
      id: '2',
      type: 'CALL',
      subject: 'Appel de suivi',
      content: 'Discussion téléphonique de 30 minutes sur les modalités de stage. Très intéressés par notre programme.',
      interaction_date: '2024-01-20T14:00:00Z',
      user: { full_name: 'Pierre Martin', email: 'pierre.martin@school.fr' }
    },
    {
      id: '3',
      type: 'MEETING',
      subject: 'Réunion de planification',
      content: 'Réunion en présentiel pour finaliser les détails du partenariat. Signature prévue la semaine prochaine.',
      interaction_date: '2024-01-25T15:30:00Z',
      user: { full_name: 'Marie Dubois', email: 'marie.dubois@school.fr' }
    }
  ];

  const getInteractionIcon = (type: string) => {
    switch (type) {
      case 'EMAIL': return Mail;
      case 'CALL': return Phone;
      case 'MEETING': return Video;
      case 'NOTE': return FileText;
      default: return MessageSquare;
    }
  };

  const getInteractionColor = (type: string) => {
    switch (type) {
      case 'EMAIL': return 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300';
      case 'CALL': return 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300';
      case 'MEETING': return 'bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300';
      case 'NOTE': return 'bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300';
      default: return 'bg-gray-50 text-gray-700 dark:bg-gray-950 dark:text-gray-300';
    }
  };

  const handleAddInteraction = () => {
    if (!newInteraction.subject || !newInteraction.content) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    // In real app, this would call the createInteraction function from usePartners
    toast({
      title: "Interaction ajoutée",
      description: "L'interaction a été enregistrée avec succès",
    });

    // Reset form
    setNewInteraction({
      type: 'EMAIL',
      subject: '',
      content: '',
      interaction_date: new Date().toISOString().split('T')[0]
    });
  };

  if (!partner) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <MessageSquare className="h-5 w-5" />
            Historique des interactions - {partner.name}
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="history" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="history">Historique</TabsTrigger>
            <TabsTrigger value="new">Nouvelle interaction</TabsTrigger>
          </TabsList>
          
          <TabsContent value="history" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center justify-between">
                  <span>Interactions récentes</span>
                  <Badge variant="secondary">{mockInteractions.length} interactions</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  {mockInteractions.length === 0 ? (
                    <div className="text-center py-8">
                      <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                      <p className="text-muted-foreground">Aucune interaction enregistrée</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {mockInteractions.map((interaction) => {
                        const IconComponent = getInteractionIcon(interaction.type);
                        return (
                          <div key={interaction.id} className="border rounded-lg p-4">
                            <div className="flex items-start gap-3">
                              <div className="p-2 rounded-lg bg-muted">
                                <IconComponent className="h-4 w-4" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                  <h3 className="font-medium">{interaction.subject}</h3>
                                  <Badge className={getInteractionColor(interaction.type)}>
                                    {interaction.type}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground mb-3">
                                  {interaction.content}
                                </p>
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                  <div className="flex items-center gap-1">
                                    <User className="h-3 w-3" />
                                    {interaction.user.full_name}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {new Date(interaction.interaction_date).toLocaleDateString('fr-FR', {
                                      year: 'numeric',
                                      month: 'long',
                                      day: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="new" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Ajouter une interaction</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Type d'interaction *</label>
                    <Select 
                      value={newInteraction.type} 
                      onValueChange={(value) => setNewInteraction(prev => ({ ...prev, type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EMAIL">Email</SelectItem>
                        <SelectItem value="CALL">Appel téléphonique</SelectItem>
                        <SelectItem value="MEETING">Réunion</SelectItem>
                        <SelectItem value="NOTE">Note interne</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Date</label>
                    <Input 
                      type="date"
                      value={newInteraction.interaction_date}
                      onChange={(e) => setNewInteraction(prev => ({ ...prev, interaction_date: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Sujet *</label>
                  <Input 
                    placeholder="Sujet de l'interaction"
                    value={newInteraction.subject}
                    onChange={(e) => setNewInteraction(prev => ({ ...prev, subject: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Contenu *</label>
                  <Textarea 
                    placeholder="Détails de l'interaction, points discutés, décisions prises..."
                    className="min-h-[120px]"
                    value={newInteraction.content}
                    onChange={(e) => setNewInteraction(prev => ({ ...prev, content: e.target.value }))}
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => onOpenChange(false)}>
                    Annuler
                  </Button>
                  <Button onClick={handleAddInteraction}>
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter l'interaction
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}