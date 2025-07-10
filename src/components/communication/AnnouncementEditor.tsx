import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Megaphone, Users, Calendar, AlertTriangle } from 'lucide-react';
import { useCreateAnnouncement } from '@/hooks/useCommunication';

interface AnnouncementEditorProps {
  open: boolean;
  onClose: () => void;
}

export function AnnouncementEditor({ open, onClose }: AnnouncementEditorProps) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    priority: 'normal',
    target_audience: {
      roles: [] as string[],
      programs: [] as string[],
      levels: [] as string[],
    },
    distribution_channels: {
      email: false,
      sms: false,
      push: true,
      dashboard: true,
    },
    acknowledgment_required: false,
    expiration_date: '',
  });

  const createAnnouncement = useCreateAnnouncement();

  const roles = [
    { value: 'student', label: 'Étudiants' },
    { value: 'teacher', label: 'Enseignants' },
    { value: 'admin', label: 'Administrateurs' },
    { value: 'hr', label: 'RH' },
  ];

  const categories = [
    { value: 'general', label: 'Général' },
    { value: 'academic', label: 'Académique' },
    { value: 'administrative', label: 'Administratif' },
    { value: 'emergency', label: 'Urgence' },
    { value: 'event', label: 'Événement' },
  ];

  const priorities = [
    { value: 'low', label: 'Faible', color: 'default' },
    { value: 'normal', label: 'Normal', color: 'secondary' },
    { value: 'high', label: 'Élevée', color: 'destructive' },
    { value: 'urgent', label: 'Urgent', color: 'destructive' },
  ];

  const handleSubmit = () => {
    if (!formData.title.trim() || !formData.content.trim() || !formData.category) {
      return;
    }

    createAnnouncement.mutate(formData, {
      onSuccess: () => {
        onClose();
        setFormData({
          title: '',
          content: '',
          category: '',
          priority: 'normal',
          target_audience: { roles: [], programs: [], levels: [] },
          distribution_channels: { email: false, sms: false, push: true, dashboard: true },
          acknowledgment_required: false,
          expiration_date: '',
        });
      },
    });
  };

  const handleAudienceChange = (type: 'roles' | 'programs' | 'levels', value: string) => {
    setFormData(prev => ({
      ...prev,
      target_audience: {
        ...prev.target_audience,
        [type]: prev.target_audience[type].includes(value)
          ? prev.target_audience[type].filter(item => item !== value)
          : [...prev.target_audience[type], value],
      },
    }));
  };

  const handleChannelChange = (channel: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      distribution_channels: {
        ...prev.distribution_channels,
        [channel]: checked,
      },
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Megaphone className="w-5 h-5" />
            Nouvelle annonce
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Content */}
          <div className="lg:col-span-2 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Titre *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Titre de l'annonce..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Contenu *</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Contenu de l'annonce..."
                className="min-h-[200px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Catégorie *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Priorité</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {priorities.map(priority => (
                      <SelectItem key={priority.value} value={priority.value}>
                        <div className="flex items-center gap-2">
                          {priority.value === 'urgent' && <AlertTriangle className="w-4 h-4" />}
                          {priority.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="space-y-4">
            {/* Audience */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Public cible
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-xs font-medium">Rôles</Label>
                  <div className="mt-2 space-y-2">
                    {roles.map(role => (
                      <div key={role.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={`role-${role.value}`}
                          checked={formData.target_audience.roles.includes(role.value)}
                          onCheckedChange={() => handleAudienceChange('roles', role.value)}
                        />
                        <Label htmlFor={`role-${role.value}`} className="text-sm">
                          {role.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Distribution */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Canaux de diffusion</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries({
                  dashboard: 'Tableau de bord',
                  push: 'Notifications push',
                  email: 'Email',
                  sms: 'SMS',
                }).map(([key, label]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <Checkbox
                      id={`channel-${key}`}
                      checked={formData.distribution_channels[key as keyof typeof formData.distribution_channels]}
                      onCheckedChange={(checked) => handleChannelChange(key, checked as boolean)}
                    />
                    <Label htmlFor={`channel-${key}`} className="text-sm">
                      {label}
                    </Label>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Options */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Options
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="acknowledgment"
                    checked={formData.acknowledgment_required}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, acknowledgment_required: checked as boolean }))
                    }
                  />
                  <Label htmlFor="acknowledgment" className="text-sm">
                    Accusé de réception requis
                  </Label>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expiration" className="text-sm">Date d'expiration</Label>
                  <Input
                    id="expiration"
                    type="datetime-local"
                    value={formData.expiration_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, expiration_date: e.target.value }))}
                    className="text-sm"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center pt-4 border-t">
          <div className="flex items-center gap-2">
            <Badge variant={formData.priority === 'urgent' ? 'destructive' : 'secondary'}>
              {priorities.find(p => p.value === formData.priority)?.label}
            </Badge>
            {formData.acknowledgment_required && (
              <Badge variant="outline">Accusé requis</Badge>
            )}
          </div>
          
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={createAnnouncement.isPending}
            >
              Annuler
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!formData.title.trim() || !formData.content.trim() || !formData.category || createAnnouncement.isPending}
            >
              {createAnnouncement.isPending ? 'Publication...' : 'Publier l\'annonce'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}