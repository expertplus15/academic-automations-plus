
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, BookOpen, Clock, Users, AlertCircle } from 'lucide-react';
import { useExams } from '@/hooks/useExams';
import { toast } from 'sonner';

interface ExamFormProps {
  onSuccess?: () => void;
}

export function ExamForm({ onSuccess }: ExamFormProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { createExam } = useExams();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    exam_type: 'written',
    duration_minutes: 120,
    max_students: 30,
    min_supervisors: 1,
    instructions: {
      general: '',
      materials_allowed: [],
      special_requirements: ''
    },
    materials_required: []
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Le titre est requis';
    }
    
    if (formData.duration_minutes < 30) {
      newErrors.duration_minutes = 'La durée minimum est de 30 minutes';
    }
    
    if (formData.max_students && formData.max_students < 1) {
      newErrors.max_students = 'Le nombre d\'étudiants doit être positif';
    }
    
    if (formData.min_supervisors < 1) {
      newErrors.min_supervisors = 'Au moins 1 surveillant est requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Veuillez corriger les erreurs dans le formulaire');
      return;
    }

    setLoading(true);
    
    try {
      const examData = {
        ...formData,
        status: 'draft'
      };
      
      const result = await createExam(examData);
      
      if (result) {
        toast.success('Examen créé avec succès');
        setOpen(false);
        setFormData({
          title: '',
          description: '',
          exam_type: 'written',
          duration_minutes: 120,
          max_students: 30,
          min_supervisors: 1,
          instructions: {
            general: '',
            materials_allowed: [],
            special_requirements: ''
          },
          materials_required: []
        });
        onSuccess?.();
      }
    } catch (error) {
      toast.error('Erreur lors de la création de l\'examen');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nouvel Examen
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            Créer un Nouvel Examen
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations de base */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <h3 className="font-semibold">Informations générales</h3>
              
              <div className="space-y-2">
                <Label htmlFor="title">Titre de l'examen *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Ex: Examen final de Mathématiques"
                  className={errors.title ? 'border-red-500' : ''}
                />
                {errors.title && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.title}
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Description détaillée de l'examen..."
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="exam_type">Type d'examen</Label>
                <Select
                  value={formData.exam_type}
                  onValueChange={(value) => handleInputChange('exam_type', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="written">Écrit</SelectItem>
                    <SelectItem value="oral">Oral</SelectItem>
                    <SelectItem value="practical">Pratique</SelectItem>
                    <SelectItem value="mixed">Mixte</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Configuration */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <h3 className="font-semibold">Configuration</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration" className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Durée (minutes) *
                  </Label>
                  <Input
                    id="duration"
                    type="number"
                    value={formData.duration_minutes}
                    onChange={(e) => handleInputChange('duration_minutes', parseInt(e.target.value) || 0)}
                    min="30"
                    max="480"
                    className={errors.duration_minutes ? 'border-red-500' : ''}
                  />
                  {errors.duration_minutes && (
                    <p className="text-sm text-red-600">{errors.duration_minutes}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="max_students" className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Étudiants max
                  </Label>
                  <Input
                    id="max_students"
                    type="number"
                    value={formData.max_students || ''}
                    onChange={(e) => handleInputChange('max_students', parseInt(e.target.value) || null)}
                    min="1"
                    placeholder="Illimité"
                    className={errors.max_students ? 'border-red-500' : ''}
                  />
                  {errors.max_students && (
                    <p className="text-sm text-red-600">{errors.max_students}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="min_supervisors">Surveillants min *</Label>
                  <Input
                    id="min_supervisors"
                    type="number"
                    value={formData.min_supervisors}
                    onChange={(e) => handleInputChange('min_supervisors', parseInt(e.target.value) || 1)}
                    min="1"
                    max="10"
                    className={errors.min_supervisors ? 'border-red-500' : ''}
                  />
                  {errors.min_supervisors && (
                    <p className="text-sm text-red-600">{errors.min_supervisors}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <h3 className="font-semibold">Instructions</h3>
              
              <div className="space-y-2">
                <Label htmlFor="instructions">Instructions générales</Label>
                <Textarea
                  id="instructions"
                  value={formData.instructions.general}
                  onChange={(e) => handleInputChange('instructions', {
                    ...formData.instructions,
                    general: e.target.value
                  })}
                  placeholder="Instructions pour la conduite de l'examen..."
                  rows={4}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="special_requirements">Exigences spéciales</Label>
                <Textarea
                  id="special_requirements"
                  value={formData.instructions.special_requirements}
                  onChange={(e) => handleInputChange('instructions', {
                    ...formData.instructions,
                    special_requirements: e.target.value
                  })}
                  placeholder="Calculatrices autorisées, documents permis, etc."
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Création...' : 'Créer l\'Examen'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
