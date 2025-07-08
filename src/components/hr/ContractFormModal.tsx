import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { useTeacherProfiles } from '@/hooks/hr/useTeacherProfiles';
import { useContractTypes } from '@/hooks/hr/useContractTypes';

interface ContractFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  contract?: any;
  mode: 'create' | 'edit' | 'view';
}

export function ContractFormModal({ isOpen, onClose, contract, mode }: ContractFormModalProps) {
  const { toast } = useToast();
  const { teacherProfiles } = useTeacherProfiles();
  const { contractTypes } = useContractTypes();
  
  const [formData, setFormData] = useState({
    teacher_id: contract?.teacher_id || '',
    contract_type: contract?.contract_type || '',
    status: contract?.status || 'draft',
    start_date: contract?.start_date ? new Date(contract.start_date) : undefined,
    end_date: contract?.end_date ? new Date(contract.end_date) : undefined,
    monthly_salary: contract?.monthly_salary || '',
    hourly_rate: contract?.hourly_rate || '',
    weekly_hours: contract?.weekly_hours || '',
    terms: contract?.terms || '',
    benefits: contract?.benefits || '',
    notes: contract?.notes || ''
  });

  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulation de sauvegarde
    toast({
      title: mode === 'create' ? "Contrat créé" : "Contrat modifié",
      description: mode === 'create' 
        ? "Le nouveau contrat a été créé avec succès" 
        : "Le contrat a été modifié avec succès",
    });
    
    onClose();
  };

  const isReadOnly = mode === 'view';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' && 'Nouveau Contrat'}
            {mode === 'edit' && 'Modifier le Contrat'}
            {mode === 'view' && 'Détails du Contrat'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
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

          {/* Type de contrat */}
          <div>
            <Label htmlFor="contract_type">Type de contrat *</Label>
            <Select 
              value={formData.contract_type} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, contract_type: value }))}
              disabled={isReadOnly}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un type" />
              </SelectTrigger>
              <SelectContent>
                {contractTypes.filter(ct => ct.is_active).map((type) => (
                  <SelectItem key={type.id} value={type.name}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Statut */}
          <div>
            <Label htmlFor="status">Statut</Label>
            <Select 
              value={formData.status} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
              disabled={isReadOnly}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Brouillon</SelectItem>
                <SelectItem value="active">Actif</SelectItem>
                <SelectItem value="expired">Expiré</SelectItem>
                <SelectItem value="terminated">Résilié</SelectItem>
                <SelectItem value="suspended">Suspendu</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Date de début *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                    disabled={isReadOnly}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "dd/MM/yyyy", { locale: fr }) : "Sélectionner..."}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label>Date de fin</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                    disabled={isReadOnly}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "dd/MM/yyyy", { locale: fr }) : "Sélectionner..."}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Rémunération */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="monthly_salary">Salaire mensuel (€)</Label>
              <Input
                id="monthly_salary"
                type="number"
                value={formData.monthly_salary}
                onChange={(e) => setFormData(prev => ({ ...prev, monthly_salary: e.target.value }))}
                placeholder="0"
                readOnly={isReadOnly}
              />
            </div>

            <div>
              <Label htmlFor="hourly_rate">Taux horaire (€)</Label>
              <Input
                id="hourly_rate"
                type="number"
                value={formData.hourly_rate}
                onChange={(e) => setFormData(prev => ({ ...prev, hourly_rate: e.target.value }))}
                placeholder="0"
                readOnly={isReadOnly}
              />
            </div>

            <div>
              <Label htmlFor="weekly_hours">Heures/semaine</Label>
              <Input
                id="weekly_hours"
                type="number"
                value={formData.weekly_hours}
                onChange={(e) => setFormData(prev => ({ ...prev, weekly_hours: e.target.value }))}
                placeholder="0"
                readOnly={isReadOnly}
              />
            </div>
          </div>

          {/* Conditions et avantages */}
          <div>
            <Label htmlFor="terms">Conditions du contrat</Label>
            <Textarea
              id="terms"
              value={formData.terms}
              onChange={(e) => setFormData(prev => ({ ...prev, terms: e.target.value }))}
              placeholder="Conditions spécifiques du contrat..."
              rows={3}
              readOnly={isReadOnly}
            />
          </div>

          <div>
            <Label htmlFor="benefits">Avantages</Label>
            <Textarea
              id="benefits"
              value={formData.benefits}
              onChange={(e) => setFormData(prev => ({ ...prev, benefits: e.target.value }))}
              placeholder="Avantages accordés..."
              rows={3}
              readOnly={isReadOnly}
            />
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Notes additionnelles..."
              rows={2}
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
                {mode === 'create' ? 'Créer le contrat' : 'Enregistrer'}
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}