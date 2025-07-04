import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Save, X } from 'lucide-react';

interface TeacherFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  teacher?: any;
  mode: 'create' | 'edit' | 'view';
}

export function TeacherFormModal({ isOpen, onClose, onSave, teacher, mode }: TeacherFormModalProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    full_name: teacher?.profile?.full_name || '',
    email: teacher?.profile?.email || '',
    phone: teacher?.phone || '',
    employee_number: teacher?.employee_number || '',
    qualification_level: teacher?.qualification_level || '',
    years_experience: teacher?.years_experience || 0,
    hire_date: teacher?.hire_date || new Date().toISOString().split('T')[0],
    status: teacher?.status || 'active',
    notes: teacher?.notes || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.full_name || !formData.email) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }

    onSave(formData);
    toast({
      title: mode === 'create' ? "Enseignant créé" : "Enseignant modifié",
      description: `Le profil a été ${mode === 'create' ? 'créé' : 'modifié'} avec succès.`,
    });
    onClose();
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isReadOnly = mode === 'view';
  const title = mode === 'create' ? 'Ajouter un enseignant' : 
                mode === 'edit' ? 'Modifier l\'enseignant' : 
                'Détails de l\'enseignant';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">{title}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Informations personnelles */}
            <div className="space-y-2">
              <Label htmlFor="full_name">Nom complet *</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => handleInputChange('full_name', e.target.value)}
                placeholder="Nom et prénom"
                disabled={isReadOnly}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="email@exemple.com"
                disabled={isReadOnly}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+33 1 23 45 67 89"
                disabled={isReadOnly}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="employee_number">Numéro employé</Label>
              <Input
                id="employee_number"
                value={formData.employee_number}
                onChange={(e) => handleInputChange('employee_number', e.target.value)}
                placeholder="EMP001"
                disabled={isReadOnly}
              />
            </div>

            {/* Informations professionnelles */}
            <div className="space-y-2">
              <Label htmlFor="qualification_level">Niveau de qualification</Label>
              <Select
                value={formData.qualification_level}
                onValueChange={(value) => handleInputChange('qualification_level', value)}
                disabled={isReadOnly}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un niveau" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="master">Master</SelectItem>
                  <SelectItem value="doctorate">Doctorat</SelectItem>
                  <SelectItem value="hdr">HDR</SelectItem>
                  <SelectItem value="professor">Professeur</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="years_experience">Années d'expérience</Label>
              <Input
                id="years_experience"
                type="number"
                value={formData.years_experience}
                onChange={(e) => handleInputChange('years_experience', parseInt(e.target.value) || 0)}
                placeholder="0"
                disabled={isReadOnly}
                min="0"
                max="50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hire_date">Date d'embauche</Label>
              <Input
                id="hire_date"
                type="date"
                value={formData.hire_date}
                onChange={(e) => handleInputChange('hire_date', e.target.value)}
                disabled={isReadOnly}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleInputChange('status', value)}
                disabled={isReadOnly}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Actif</SelectItem>
                  <SelectItem value="inactive">Inactif</SelectItem>
                  <SelectItem value="on_leave">En congé</SelectItem>
                  <SelectItem value="terminated">Terminé</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Notes supplémentaires..."
              disabled={isReadOnly}
              rows={3}
            />
          </div>

          <DialogFooter className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              <X className="w-4 h-4 mr-2" />
              {isReadOnly ? 'Fermer' : 'Annuler'}
            </Button>
            {!isReadOnly && (
              <Button
                type="submit"
                className="bg-amber-500 hover:bg-amber-600 text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                {mode === 'create' ? 'Créer' : 'Sauvegarder'}
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}