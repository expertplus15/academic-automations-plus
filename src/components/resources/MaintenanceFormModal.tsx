import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { CalendarIcon, Wrench } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface MaintenanceTask {
  id?: string;
  asset_name: string;
  asset_number: string;
  maintenance_type: 'preventive' | 'corrective' | 'inspection';
  scheduled_date: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  description: string;
  cost?: number;
  performed_by?: string;
}

interface MaintenanceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: MaintenanceTask;
  mode: 'create' | 'edit' | 'view';
  onSave?: (data: Partial<MaintenanceTask>) => Promise<void>;
}

export function MaintenanceFormModal({ isOpen, onClose, task, mode, onSave }: MaintenanceFormModalProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    task?.scheduled_date ? new Date(task.scheduled_date) : undefined
  );

  const [formData, setFormData] = useState({
    asset_name: task?.asset_name || '',
    asset_number: task?.asset_number || '',
    maintenance_type: task?.maintenance_type || 'preventive',
    description: task?.description || '',
    cost: task?.cost || undefined,
    performed_by: task?.performed_by || ''
  });

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.asset_name.trim() || !formData.description.trim() || !selectedDate) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const maintenanceData: Partial<MaintenanceTask> = {
        ...formData,
        scheduled_date: selectedDate.toISOString(),
        status: 'scheduled',
        cost: formData.cost ? Number(formData.cost) : undefined
      };

      if (onSave) {
        await onSave(maintenanceData);
      }

      toast({
        title: "Succès",
        description: `Maintenance ${mode === 'create' ? 'planifiée' : 'modifiée'} avec succès`,
      });
      
      onClose();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la sauvegarde",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isReadOnly = mode === 'view';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wrench className="w-5 h-5 text-primary" />
            {mode === 'create' && 'Planifier une maintenance'}
            {mode === 'edit' && 'Modifier la maintenance'}
            {mode === 'view' && 'Détails de la maintenance'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations de l'équipement */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Équipement</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="asset_name">Nom de l'équipement *</Label>
                <Input
                  id="asset_name"
                  value={formData.asset_name}
                  onChange={(e) => handleChange('asset_name', e.target.value)}
                  placeholder="Ex: Projecteur Salle A1"
                  disabled={isReadOnly}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="asset_number">Numéro d'actif</Label>
                <Input
                  id="asset_number"
                  value={formData.asset_number}
                  onChange={(e) => handleChange('asset_number', e.target.value)}
                  placeholder="Ex: AST240001"
                  disabled={isReadOnly}
                />
              </div>
            </div>
          </div>

          {/* Détails de la maintenance */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Planification</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="maintenance_type">Type de maintenance *</Label>
                <Select
                  value={formData.maintenance_type}
                  onValueChange={(value) => handleChange('maintenance_type', value)}
                  disabled={isReadOnly}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner le type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="preventive">Préventive</SelectItem>
                    <SelectItem value="corrective">Corrective</SelectItem>
                    <SelectItem value="inspection">Inspection</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Date planifiée *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                      disabled={isReadOnly}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? (
                        format(selectedDate, "PPP", { locale: fr })
                      ) : (
                        <span>Sélectionner une date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      initialFocus
                      locale={fr}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description des travaux *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Détaillez les opérations à effectuer..."
              rows={4}
              disabled={isReadOnly}
              required
            />
          </div>

          {/* Informations supplémentaires */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Informations supplémentaires</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cost">Coût estimé (€)</Label>
                <Input
                  id="cost"
                  type="number"
                  value={formData.cost || ''}
                  onChange={(e) => handleChange('cost', e.target.value)}
                  placeholder="0"
                  min="0"
                  step="0.01"
                  disabled={isReadOnly}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="performed_by">Exécutée par</Label>
                <Input
                  id="performed_by"
                  value={formData.performed_by}
                  onChange={(e) => handleChange('performed_by', e.target.value)}
                  placeholder="Nom du technicien ou société"
                  disabled={isReadOnly}
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              {mode === 'view' ? 'Fermer' : 'Annuler'}
            </Button>
            {!isReadOnly && (
              <Button type="submit" disabled={isSubmitting} className="bg-primary text-primary-foreground">
                {isSubmitting ? 'Sauvegarde...' : mode === 'create' ? 'Planifier' : 'Modifier'}
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}