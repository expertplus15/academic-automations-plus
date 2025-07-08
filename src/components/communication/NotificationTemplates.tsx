import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Plus, 
  Edit, 
  Copy, 
  Trash2, 
  Eye, 
  Save,
  Mail,
  MessageSquare,
  Bell,
  Calendar,
  AlertTriangle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface NotificationTemplate {
  id: string;
  name: string;
  description: string;
  type: 'EMAIL' | 'PUSH' | 'SMS' | 'IN_APP';
  category: string;
  subject: string;
  content: string;
  variables: string[];
  isActive: boolean;
  usage_count: number;
  created_at: string;
}

export function NotificationTemplates() {
  const { toast } = useToast();
  
  const [templates, setTemplates] = useState<NotificationTemplate[]>([
    {
      id: '1',
      name: 'Bienvenue Étudiant',
      description: 'Message de bienvenue pour nouveaux étudiants',
      type: 'EMAIL',
      category: 'ONBOARDING',
      subject: 'Bienvenue à {{institution_name}}',
      content: 'Bonjour {{student_name}},\n\nNous sommes ravis de vous accueillir à {{institution_name}}. Votre parcours commence maintenant!\n\nCordialement,\nL\'équipe administrative',
      variables: ['student_name', 'institution_name'],
      isActive: true,
      usage_count: 45,
      created_at: '2024-01-15'
    },
    {
      id: '2',
      name: 'Rappel Examen',
      description: 'Notification de rappel d\'examen',
      type: 'PUSH',
      category: 'ACADEMIC',
      subject: 'Examen {{subject}} dans {{days}} jours',
      content: 'N\'oubliez pas votre examen de {{subject}} prévu le {{exam_date}} à {{exam_time}} en salle {{room}}.',
      variables: ['subject', 'days', 'exam_date', 'exam_time', 'room'],
      isActive: true,
      usage_count: 123,
      created_at: '2024-01-10'
    },
    {
      id: '3',
      name: 'Maintenance Système',
      description: 'Alerte de maintenance programmée',
      type: 'IN_APP',
      category: 'SYSTEM',
      subject: 'Maintenance programmée',
      content: 'Le système sera indisponible le {{maintenance_date}} de {{start_time}} à {{end_time}} pour maintenance.',
      variables: ['maintenance_date', 'start_time', 'end_time'],
      isActive: true,
      usage_count: 12,
      created_at: '2024-01-05'
    }
  ]);

  const [selectedTemplate, setSelectedTemplate] = useState<NotificationTemplate | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'EMAIL': return Mail;
      case 'PUSH': return Bell;
      case 'SMS': return MessageSquare;
      case 'IN_APP': return AlertTriangle;
      default: return Bell;
    }
  };

  const getTypeBadge = (type: string) => {
    const colors = {
      EMAIL: 'bg-blue-50 text-blue-700',
      PUSH: 'bg-green-50 text-green-700',
      SMS: 'bg-yellow-50 text-yellow-700',
      IN_APP: 'bg-purple-50 text-purple-700'
    };
    return <Badge className={colors[type as keyof typeof colors] || 'bg-gray-50 text-gray-700'}>{type}</Badge>;
  };

  const getCategoryBadge = (category: string) => {
    const colors = {
      ONBOARDING: 'bg-green-50 text-green-700',
      ACADEMIC: 'bg-blue-50 text-blue-700',
      SYSTEM: 'bg-red-50 text-red-700',
      MARKETING: 'bg-purple-50 text-purple-700'
    };
    return <Badge variant="outline" className={colors[category as keyof typeof colors]}>{category}</Badge>;
  };

  const handleDuplicateTemplate = (template: NotificationTemplate) => {
    const newTemplate = {
      ...template,
      id: Date.now().toString(),
      name: `${template.name} (Copie)`,
      usage_count: 0,
      created_at: new Date().toISOString().split('T')[0]
    };
    setTemplates([...templates, newTemplate]);
    toast({
      title: "Template dupliqué",
      description: "Le template a été dupliqué avec succès",
    });
  };

  const handleDeleteTemplate = (templateId: string) => {
    setTemplates(templates.filter(t => t.id !== templateId));
    toast({
      title: "Template supprimé",
      description: "Le template a été supprimé avec succès",
    });
  };

  const handleSaveTemplate = (template: NotificationTemplate) => {
    setTemplates(templates.map(t => t.id === template.id ? template : t));
    setIsEditModalOpen(false);
    toast({
      title: "Template sauvegardé",
      description: "Le template a été mis à jour avec succès",
    });
  };

  const renderVariables = (variables: string[]) => {
    return variables.map(variable => (
      <code key={variable} className="px-2 py-1 bg-muted rounded text-xs mr-1 mb-1 inline-block">
        {`{{${variable}}}`}
      </code>
    ));
  };

  const previewTemplate = (template: NotificationTemplate) => {
    // Simple preview with mock data
    const mockData = {
      student_name: 'Jean Dupont',
      institution_name: 'Institut Supérieur',
      subject: 'Mathématiques',
      days: '3',
      exam_date: '15/02/2024',
      exam_time: '14h00',
      room: 'A101',
      maintenance_date: '20/02/2024',
      start_time: '22h00',
      end_time: '02h00'
    };

    let preview = template.content;
    template.variables.forEach(variable => {
      const value = mockData[variable as keyof typeof mockData] || `{${variable}}`;
      preview = preview.replace(new RegExp(`{{${variable}}}`, 'g'), value);
    });

    return preview;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Templates de Notifications</h2>
          <p className="text-muted-foreground">Gérez vos modèles de notifications réutilisables</p>
        </div>
        <Button onClick={() => setIsEditModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau Template
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => {
          const IconComponent = getTypeIcon(template.type);
          return (
            <Card key={template.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <IconComponent className="h-5 w-5" />
                    <CardTitle className="text-base">{template.name}</CardTitle>
                  </div>
                  <div className="flex gap-1">
                    {getTypeBadge(template.type)}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{template.description}</p>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Catégorie:</span>
                    {getCategoryBadge(template.category)}
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium">Variables:</span>
                    <div className="mt-1">
                      {renderVariables(template.variables)}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Utilisations: {template.usage_count}</span>
                    <Badge variant={template.isActive ? "default" : "secondary"}>
                      {template.isActive ? 'Actif' : 'Inactif'}
                    </Badge>
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => {
                        setSelectedTemplate(template);
                        setIsPreviewModalOpen(true);
                      }}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      Aperçu
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setSelectedTemplate(template);
                        setIsEditModalOpen(true);
                      }}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDuplicateTemplate(template)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDeleteTemplate(template.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Preview Modal */}
      <Dialog open={isPreviewModalOpen} onOpenChange={setIsPreviewModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Aperçu du Template</DialogTitle>
          </DialogHeader>
          {selectedTemplate && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Sujet:</label>
                <p className="text-sm text-muted-foreground mt-1">{selectedTemplate.subject}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Contenu (avec données fictives):</label>
                <div className="mt-2 p-4 bg-muted rounded-lg">
                  <pre className="whitespace-pre-wrap text-sm">{previewTemplate(selectedTemplate)}</pre>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Variables disponibles:</label>
                <div className="mt-1">
                  {renderVariables(selectedTemplate.variables)}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit/Create Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {selectedTemplate ? 'Modifier le Template' : 'Nouveau Template'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Nom</label>
                <Input placeholder="Nom du template" defaultValue={selectedTemplate?.name} />
              </div>
              <div>
                <label className="text-sm font-medium">Type</label>
                <Input placeholder="EMAIL, PUSH, SMS, IN_APP" defaultValue={selectedTemplate?.type} />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Input placeholder="Description du template" defaultValue={selectedTemplate?.description} />
            </div>
            <div>
              <label className="text-sm font-medium">Sujet</label>
              <Input placeholder="Sujet du message" defaultValue={selectedTemplate?.subject} />
            </div>
            <div>
              <label className="text-sm font-medium">Contenu</label>
              <Textarea 
                rows={6}
                placeholder="Contenu du template avec variables {{variable_name}}"
                defaultValue={selectedTemplate?.content}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Variables (séparées par des virgules)</label>
              <Input 
                placeholder="variable1, variable2, variable3"
                defaultValue={selectedTemplate?.variables.join(', ')}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Annuler
              </Button>
              <Button onClick={() => selectedTemplate && handleSaveTemplate(selectedTemplate)}>
                <Save className="h-4 w-4 mr-2" />
                Sauvegarder
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}