import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { useTeacherProfiles } from '@/hooks/hr/useTeacherProfiles';
import { useTeacherSpecialties } from '@/hooks/hr/useTeacherSpecialties';

interface TeacherAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  assignment?: any;
  mode: 'create' | 'edit' | 'view';
}

export function TeacherAssignmentModal({ isOpen, onClose, assignment, mode }: TeacherAssignmentModalProps) {
  const { toast } = useToast();
  const { teacherProfiles } = useTeacherProfiles();
  const { specialties } = useTeacherSpecialties();
  
  const [formData, setFormData] = useState({
    teacher_id: assignment?.teacher_id || '',
    specialty_id: assignment?.specialty_id || '',
    proficiency_level: assignment?.proficiency_level || 'basic',
    years_experience: assignment?.years_experience || '',
    is_primary: assignment?.is_primary || false,
    certified_date: assignment?.certified_date ? new Date(assignment.certified_date) : undefined,
    certification_authority: assignment?.certification_authority || ''
  });

  const [certifiedDate, setCertifiedDate] = useState<Date>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: mode === 'create' ? "Affectation créée" : "Affectation modifiée",
      description: mode === 'create' 
        ? "La nouvelle affectation a été créée avec succès" 
        : "L'affectation a été modifiée avec succès",
    });
    
    onClose();
  };

  const isReadOnly = mode === 'view';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' && 'Nouvelle Affectation'}
            {mode === 'edit' && 'Modifier l\'Affectation'}
            {mode === 'view' && 'Détails de l\'Affectation'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Enseignant */}
          <div>
            <Label htmlFor="teacher_id">Enseignant *</Label>
            <Select 
              value={formData.teacher_id} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, teacher_id: value }))}
              disabled={isReadOnly}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un enseignant" />
              </SelectTrigger>
              <SelectContent>
                {teacherProfiles.map((teacher) => (
                  <SelectItem key={teacher.id} value={teacher.id}>
                    {teacher.profile?.full_name} ({teacher.employee_number})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Spécialité */}
          <div>
            <Label htmlFor="specialty_id">Spécialité *</Label>
            <Select 
              value={formData.specialty_id} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, specialty_id: value }))}
              disabled={isReadOnly}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une spécialité" />
              </SelectTrigger>
              <SelectContent>
                {specialties.filter(s => s.is_active).map((specialty) => (
                  <SelectItem key={specialty.id} value={specialty.id}>
                    {specialty.name} ({specialty.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Niveau de compétence */}
          <div>
            <Label htmlFor="proficiency_level">Niveau de compétence *</Label>
            <Select 
              value={formData.proficiency_level} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, proficiency_level: value }))}
              disabled={isReadOnly}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="basic">Débutant</SelectItem>
                <SelectItem value="intermediate">Intermédiaire</SelectItem>
                <SelectItem value="advanced">Avancé</SelectItem>
                <SelectItem value="expert">Expert</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Années d'expérience */}
          <div>
            <Label htmlFor="years_experience">Années d'expérience *</Label>
            <Input
              id="years_experience"
              type="number"
              value={formData.years_experience}
              onChange={(e) => setFormData(prev => ({ ...prev, years_experience: e.target.value }))}
              placeholder="0"
              min="0"
              readOnly={isReadOnly}
              required
            />
          </div>

          {/* Spécialité principale */}
          <div className="flex items-center space-x-2">
            <Switch
              id="is_primary"
              checked={formData.is_primary}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_primary: checked }))}
              disabled={isReadOnly}
            />
            <Label htmlFor="is_primary">Spécialité principale</Label>
          </div>

          {/* Date de certification */}
          <div>
            <Label>Date de certification</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                  disabled={isReadOnly}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {certifiedDate ? format(certifiedDate, "dd/MM/yyyy", { locale: fr }) : "Sélectionner..."}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={certifiedDate}
                  onSelect={setCertifiedDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Autorité de certification */}
          <div>
            <Label htmlFor="certification_authority">Autorité de certification</Label>
            <Input
              id="certification_authority"
              value={formData.certification_authority}
              onChange={(e) => setFormData(prev => ({ ...prev, certification_authority: e.target.value }))}
              placeholder="Ex: Ministère de l'Éducation"
              readOnly={isReadOnly}
            />
          </div>

          {/* Boutons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              {isReadOnly ? 'Fermer' : 'Annuler'}
            </Button>
            {!isReadOnly && (
              <Button type="submit" className="bg-amber-500 hover:bg-amber-600 text-white">
                {mode === 'create' ? 'Créer l\'affectation' : 'Enregistrer'}
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}