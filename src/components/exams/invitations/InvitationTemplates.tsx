import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  FileText, 
  Edit, 
  Copy, 
  Trash2, 
  Plus, 
  Eye, 
  Mail,
  MessageSquare,
  Bell
} from 'lucide-react';

interface Template {
  id: string;
  name: string;
  type: 'email' | 'sms' | 'notification';
  subject?: string;
  content: string;
  variables: string[];
  isActive: boolean;
  usage: number;
  lastModified: string;
}

export function InvitationTemplates() {
  const [templates, setTemplates] = useState<Template[]>([
    {
      id: '1',
      name: 'Convocation Standard',
      type: 'email',
      subject: 'Convocation - {{exam_title}}',
      content: `Bonjour {{student_name}},

Vous êtes convoqué(e) à l'examen suivant :

Matière : {{exam_title}}
Date : {{exam_date}}
Heure : {{exam_time}}
Lieu : {{exam_room}}
Durée : {{exam_duration}}

Documents autorisés : {{allowed_materials}}

Merci de vous présenter 15 minutes avant le début de l'épreuve.

Cordialement,
L'équipe pédagogique`,
      variables: ['student_name', 'exam_title', 'exam_date', 'exam_time', 'exam_room', 'exam_duration', 'allowed_materials'],
      isActive: true,
      usage: 245,
      lastModified: '2024-01-15'
    },
    {
      id: '2', 
      name: 'Rappel SMS',
      type: 'sms',
      content: 'Rappel: Examen {{exam_title}} demain à {{exam_time}} en {{exam_room}}. Ne pas oublier sa pièce d\'identité.',
      variables: ['exam_title', 'exam_time', 'exam_room'],
      isActive: true,
      usage: 156,
      lastModified: '2024-01-10'
    },
    {
      id: '3',
      name: 'Notification Urgente',
      type: 'notification',
      content: 'URGENT: L\'examen {{exam_title}} est reporté au {{new_date}} à {{new_time}}.',
      variables: ['exam_title', 'new_date', 'new_time'],
      isActive: true,
      usage: 23,
      lastModified: '2024-01-08'
    }
  ]);

  const [isCreating, setIsCreating] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="w-4 h-4" />;
      case 'sms': return <MessageSquare className="w-4 h-4" />;
      case 'notification': return <Bell className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getTypeBadge = (type: string) => {
    const colors = {
      email: 'bg-blue-100 text-blue-700 border-blue-200',
      sms: 'bg-green-100 text-green-700 border-green-200',
      notification: 'bg-orange-100 text-orange-700 border-orange-200'
    };
    return (
      <Badge className={colors[type as keyof typeof colors]}>
        {getTypeIcon(type)}
        <span className="ml-1 capitalize">{type}</span>
      </Badge>
    );
  };

  const duplicateTemplate = (template: Template) => {
    const newTemplate = {
      ...template,
      id: Date.now().toString(),
      name: `${template.name} (Copie)`,
      usage: 0,
      lastModified: new Date().toISOString().split('T')[0]
    };
    setTemplates([...templates, newTemplate]);
  };

  const deleteTemplate = (id: string) => {
    setTemplates(templates.filter(t => t.id !== id));
  };

  const TemplateForm = ({ template, onSave, onCancel }: {
    template?: Template;
    onSave: (template: Template) => void;
    onCancel: () => void;
  }) => {
    const [formData, setFormData] = useState<Partial<Template>>(
      template || {
        name: '',
        type: 'email',
        subject: '',
        content: '',
        variables: [],
        isActive: true
      }
    );

    const handleSave = () => {
      const newTemplate: Template = {
        id: template?.id || Date.now().toString(),
        name: formData.name!,
        type: formData.type as 'email' | 'sms' | 'notification',
        subject: formData.subject,
        content: formData.content!,
        variables: formData.variables!,
        isActive: formData.isActive!,
        usage: template?.usage || 0,
        lastModified: new Date().toISOString().split('T')[0]
      };
      onSave(newTemplate);
    };

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Nom du modèle</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Ex: Convocation standard"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Type</label>
            <Select 
              value={formData.type} 
              onValueChange={(value) => setFormData({...formData, type: value as any})}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="sms">SMS</SelectItem>
                <SelectItem value="notification">Notification</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {formData.type === 'email' && (
          <div>
            <label className="text-sm font-medium">Sujet</label>
            <Input
              value={formData.subject}
              onChange={(e) => setFormData({...formData, subject: e.target.value})}
              placeholder="Ex: Convocation - {{exam_title}}"
            />
          </div>
        )}

        <div>
          <label className="text-sm font-medium">Contenu</label>
          <Textarea
            value={formData.content}
            onChange={(e) => setFormData({...formData, content: e.target.value})}
            rows={8}
            placeholder="Utilisez {{variable_name}} pour insérer des variables..."
          />
        </div>

        <div>
          <label className="text-sm font-medium">Variables disponibles</label>
          <div className="text-xs text-muted-foreground mb-2">
            {{student_name}}, {{exam_title}}, {{exam_date}}, {{exam_time}}, {{exam_room}}, {{exam_duration}}, {{allowed_materials}}
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button onClick={handleSave} className="bg-violet-600 hover:bg-violet-700">
            Sauvegarder
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Modèles de convocations</h3>
          <p className="text-sm text-muted-foreground">
            Gérez vos modèles d'emails, SMS et notifications
          </p>
        </div>
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button className="bg-violet-600 hover:bg-violet-700">
              <Plus className="w-4 h-4 mr-2" />
              Nouveau modèle
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Créer un nouveau modèle</DialogTitle>
            </DialogHeader>
            <TemplateForm
              onSave={(template) => {
                setTemplates([...templates, template]);
                setIsCreating(false);
              }}
              onCancel={() => setIsCreating(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {templates.map((template) => (
          <Card key={template.id} className="bg-white rounded-2xl shadow-sm border-0">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-violet-100 rounded-lg">
                    {getTypeIcon(template.type)}
                  </div>
                  <div>
                    <CardTitle className="text-base">{template.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      {getTypeBadge(template.type)}
                      <Badge variant={template.isActive ? "default" : "secondary"}>
                        {template.isActive ? "Actif" : "Inactif"}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => duplicateTemplate(template)}>
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Modifier le modèle</DialogTitle>
                      </DialogHeader>
                      <TemplateForm
                        template={template}
                        onSave={(updatedTemplate) => {
                          setTemplates(templates.map(t => 
                            t.id === template.id ? updatedTemplate : t
                          ));
                        }}
                        onCancel={() => {}}
                      />
                    </DialogContent>
                  </Dialog>
                  <Button variant="ghost" size="sm" onClick={() => deleteTemplate(template.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {template.subject && (
                  <div>
                    <p className="text-xs text-muted-foreground">Sujet:</p>
                    <p className="text-sm font-medium">{template.subject}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-muted-foreground">Aperçu du contenu:</p>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {template.content}
                  </p>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Utilisé {template.usage} fois</span>
                  <span>Modifié le {template.lastModified}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}