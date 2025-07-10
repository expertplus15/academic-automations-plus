import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Bell, AlertTriangle, Info, CheckCircle } from 'lucide-react';

interface NewNotificationModalProps {
  open: boolean;
  onClose: () => void;
}

export function NewNotificationModal({ open, onClose }: NewNotificationModalProps) {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState('info');
  const [targetRoles, setTargetRoles] = useState<string[]>([]);

  const roles = [
    { value: 'admin', label: 'Administrateurs' },
    { value: 'teacher', label: 'Enseignants' },
    { value: 'hr', label: 'Ressources Humaines' },
    { value: 'student', label: 'Étudiants' }
  ];

  const notificationTypes = [
    { value: 'info', label: 'Information', icon: Info, color: 'text-primary' },
    { value: 'warning', label: 'Attention', icon: AlertTriangle, color: 'text-yellow-500' },
    { value: 'success', label: 'Succès', icon: CheckCircle, color: 'text-green-500' },
    { value: 'general', label: 'Général', icon: Bell, color: 'text-muted-foreground' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement notification creation
    console.log('Creating notification:', { title, message, type, targetRoles });
    onClose();
    // Reset form
    setTitle('');
    setMessage('');
    setType('info');
    setTargetRoles([]);
  };

  const toggleRole = (roleValue: string) => {
    setTargetRoles(prev => 
      prev.includes(roleValue) 
        ? prev.filter(r => r !== roleValue)
        : [...prev, roleValue]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Créer une notification</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Titre</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titre de la notification"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Message</label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Contenu de la notification"
              rows={3}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Type</label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un type" />
              </SelectTrigger>
              <SelectContent>
                {notificationTypes.map((notifType) => {
                  const IconComponent = notifType.icon;
                  return (
                    <SelectItem key={notifType.value} value={notifType.value}>
                      <div className="flex items-center gap-2">
                        <IconComponent className={`w-4 h-4 ${notifType.color}`} />
                        {notifType.label}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Destinataires</label>
            <div className="flex flex-wrap gap-2">
              {roles.map((role) => (
                <Badge
                  key={role.value}
                  variant={targetRoles.includes(role.value) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleRole(role.value)}
                >
                  {role.label}
                  {targetRoles.includes(role.value) && (
                    <X className="w-3 h-3 ml-1" />
                  )}
                </Badge>
              ))}
            </div>
            {targetRoles.length === 0 && (
              <p className="text-xs text-muted-foreground mt-1">
                Sélectionnez au moins un groupe de destinataires
              </p>
            )}
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Annuler
            </Button>
            <Button 
              type="submit" 
              className="flex-1"
              disabled={!title || !message || targetRoles.length === 0}
            >
              Créer
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}