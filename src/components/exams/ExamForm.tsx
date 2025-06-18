
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, BookOpen, Clock, Users, FileText } from 'lucide-react';
import { useExams } from '@/hooks/useExams';
import { usePrograms, useSubjects } from '@/hooks/useSupabase';
import { toast } from 'sonner';

interface ExamFormProps {
  onSuccess?: () => void;
}

export function ExamForm({ onSuccess }: ExamFormProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { createExam } = useExams();
  const { data: programs } = usePrograms();
  const { data: subjects } = useSubjects();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    exam_type: 'written',
    duration_minutes: 120,
    max_students: 50,
    min_supervisors: 2,
    subject_id: '',
    program_id: '',
    academic_year_id: '2024-2025',
    instructions: {},
    materials_required: []
  });

  const examTypes = [
    { value: 'written', label: 'Écrit', icon: FileText },
    { value: 'oral', label: 'Oral', icon: Users },
    { value: 'practical', label: 'Pratique', icon: BookOpen },
    { value: 'mixed', label: 'Mixte', icon: Clock }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await createExam(formData);
      if (result) {
        toast.success('Examen créé avec succès !');
        setOpen(false);
        setFormData({
          title: '',
          description: '',
          exam_type: 'written',
          duration_minutes: 120,
          max_students: 50,
          min_supervisors: 2,
          subject_id: '',
          program_id: '',
          academic_year_id: '2024-2025',
          instructions: {},
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

  const filteredSubjects = subjects.filter(subject => 
    !formData.program_id || subject.program_id === formData.program_id
  );

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
            <CardHeader>
              <CardTitle className="text-lg">Informations Générales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Titre de l'examen *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ex: Examen final Mathématiques"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Description détaillée de l'examen..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Programme</Label>
                  <Select 
                    value={formData.program_id} 
                    onValueChange={(value) => setFormData({ ...formData, program_id: value, subject_id: '' })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un programme" />
                    </SelectTrigger>
                    <SelectContent>
                      {programs.map((program) => (
                        <SelectItem key={program.id} value={program.id}>
                          {program.name} ({program.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Matière *</Label>
                  <Select 
                    value={formData.subject_id} 
                    onValueChange={(value) => setFormData({ ...formData, subject_id: value })}
                    disabled={!formData.program_id}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une matière" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredSubjects.map((subject) => (
                        <SelectItem key={subject.id} value={subject.id}>
                          {subject.name} ({subject.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Configuration de l'examen */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Type d'examen</Label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {examTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <div
                        key={type.value}
                        className={`p-3 border rounded-lg cursor-pointer transition-all ${
                          formData.exam_type === type.value
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setFormData({ ...formData, exam_type: type.value })}
                      >
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4" />
                          <span className="font-medium">{type.label}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="duration">Durée (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={formData.duration_minutes}
                    onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) || 120 })}
                    min="30"
                    max="480"
                  />
                </div>

                <div>
                  <Label htmlFor="max_students">Étudiants max</Label>
                  <Input
                    id="max_students"
                    type="number"
                    value={formData.max_students}
                    onChange={(e) => setFormData({ ...formData, max_students: parseInt(e.target.value) || 50 })}
                    min="1"
                    max="500"
                  />
                </div>

                <div>
                  <Label htmlFor="min_supervisors">Surveillants min</Label>
                  <Input
                    id="min_supervisors"
                    type="number"
                    value={formData.min_supervisors}
                    onChange={(e) => setFormData({ ...formData, min_supervisors: parseInt(e.target.value) || 1 })}
                    min="1"
                    max="10"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Résumé */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-blue-800">Résumé de l'examen</span>
                <Badge variant="outline" className="bg-white">
                  {examTypes.find(t => t.value === formData.exam_type)?.label}
                </Badge>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-blue-600" />
                  <span>{formData.duration_minutes} min</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3 text-blue-600" />
                  <span>{formData.max_students} étudiants</span>
                </div>
                <div className="flex items-center gap-1">
                  <FileText className="w-3 h-3 text-blue-600" />
                  <span>{formData.min_supervisors} surveillants</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Annuler
            </Button>
            <Button 
              type="submit" 
              disabled={loading || !formData.title || !formData.subject_id}
            >
              {loading ? 'Création...' : 'Créer l\'examen'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
