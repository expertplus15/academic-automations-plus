import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Mail, Users, Send, Calendar, FileText } from 'lucide-react';

interface NewCampaignModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (campaignData: any) => void;
}

export function NewCampaignModal({ open, onOpenChange, onSave }: NewCampaignModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    template: '',
    targetAudience: '',
    content: '',
    scheduleType: 'now',
    scheduledDate: '',
    scheduledTime: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onOpenChange(false);
    setFormData({
      name: '',
      subject: '',
      template: '',
      targetAudience: '',
      content: '',
      scheduleType: 'now',
      scheduledDate: '',
      scheduledTime: ''
    });
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const templates = [
    { id: 'newsletter', name: 'Newsletter mensuelle', description: 'Modèle pour newsletter' },
    { id: 'event', name: 'Annonce événement', description: 'Modèle pour événements' },
    { id: 'reminder', name: 'Rappel paiement', description: 'Modèle pour rappels' },
    { id: 'custom', name: 'Personnalisé', description: 'Créer depuis zéro' }
  ];

  const audiences = [
    { id: 'all', name: 'Tous les utilisateurs', count: 1250 },
    { id: 'students', name: 'Étudiants', count: 856 },
    { id: 'teachers', name: 'Enseignants', count: 124 },
    { id: 'parents', name: 'Parents', count: 567 },
    { id: 'staff', name: 'Personnel', count: 89 }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Créer une nouvelle campagne
          </DialogTitle>
          <DialogDescription>
            Configurez votre campagne d'emailing pour communiquer avec votre audience.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom de la campagne *</Label>
              <Input
                id="name"
                placeholder="Ex: Newsletter janvier 2024"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Objet de l'email *</Label>
              <Input
                id="subject"
                placeholder="Ex: Informations importantes - Rentrée 2024"
                value={formData.subject}
                onChange={(e) => handleInputChange('subject', e.target.value)}
                required
              />
            </div>
          </div>

          {/* Template Selection */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Modèle de campagne
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    formData.template === template.id 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:bg-muted/50'
                  }`}
                  onClick={() => handleInputChange('template', template.id)}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="template"
                      value={template.id}
                      checked={formData.template === template.id}
                      onChange={() => handleInputChange('template', template.id)}
                      className="text-primary"
                    />
                    <div>
                      <h4 className="font-medium">{template.name}</h4>
                      <p className="text-sm text-muted-foreground">{template.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Target Audience */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Audience cible *
            </Label>
            <Select value={formData.targetAudience} onValueChange={(value) => handleInputChange('targetAudience', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner l'audience" />
              </SelectTrigger>
              <SelectContent>
                {audiences.map((audience) => (
                  <SelectItem key={audience.id} value={audience.id}>
                    <div className="flex items-center justify-between w-full">
                      <span>{audience.name}</span>
                      <Badge variant="secondary" className="ml-2">
                        {audience.count}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content">Contenu de l'email</Label>
            <Textarea
              id="content"
              placeholder="Rédigez le contenu de votre email..."
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              rows={6}
            />
            <p className="text-sm text-muted-foreground">
              Vous pourrez utiliser l'éditeur avancé après création de la campagne.
            </p>
          </div>

          {/* Scheduling */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Send className="w-4 h-4" />
              Programmation
            </Label>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="sendNow"
                  name="scheduleType"
                  value="now"
                  checked={formData.scheduleType === 'now'}
                  onChange={(e) => handleInputChange('scheduleType', e.target.value)}
                  className="text-primary"
                />
                <Label htmlFor="sendNow">Envoyer maintenant</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="saveDraft"
                  name="scheduleType"
                  value="draft"
                  checked={formData.scheduleType === 'draft'}
                  onChange={(e) => handleInputChange('scheduleType', e.target.value)}
                  className="text-primary"
                />
                <Label htmlFor="saveDraft">Sauvegarder en brouillon</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="schedule"
                  name="scheduleType"
                  value="scheduled"
                  checked={formData.scheduleType === 'scheduled'}
                  onChange={(e) => handleInputChange('scheduleType', e.target.value)}
                  className="text-primary"
                />
                <Label htmlFor="schedule">Programmer l'envoi</Label>
              </div>

              {formData.scheduleType === 'scheduled' && (
                <div className="grid grid-cols-2 gap-4 ml-6">
                  <div className="space-y-2">
                    <Label htmlFor="scheduledDate" className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Date
                    </Label>
                    <Input
                      id="scheduledDate"
                      type="date"
                      value={formData.scheduledDate}
                      onChange={(e) => handleInputChange('scheduledDate', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="scheduledTime">Heure</Label>
                    <Input
                      id="scheduledTime"
                      type="time"
                      value={formData.scheduledTime}
                      onChange={(e) => handleInputChange('scheduledTime', e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit">
              {formData.scheduleType === 'now' ? 'Créer et envoyer' : 
               formData.scheduleType === 'draft' ? 'Sauvegarder' : 'Programmer'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}