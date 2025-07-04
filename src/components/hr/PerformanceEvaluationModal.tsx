import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { Save, X, Star } from 'lucide-react';

interface PerformanceEvaluationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  evaluation?: any;
  mode: 'create' | 'edit' | 'view';
}

export function PerformanceEvaluationModal({ isOpen, onClose, onSave, evaluation, mode }: PerformanceEvaluationModalProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    teacher_name: evaluation?.teacher_name || '',
    employee_number: evaluation?.employee_number || '',
    evaluation_period: evaluation?.evaluation_period || new Date().getFullYear().toString(),
    pedagogical_skills: evaluation?.pedagogical_skills || 80,
    subject_mastery: evaluation?.subject_mastery || 80,
    student_relations: evaluation?.student_relations || 80,
    administrative_tasks: evaluation?.administrative_tasks || 80,
    professional_development: evaluation?.professional_development || 80,
    evaluator: evaluation?.evaluator || '',
    evaluation_date: evaluation?.evaluation_date || new Date().toISOString().split('T')[0],
    goals_achieved: evaluation?.goals_achieved || 0,
    total_goals: evaluation?.total_goals || 5,
    strengths: evaluation?.strengths || '',
    improvements: evaluation?.improvements || '',
    comments: evaluation?.comments || '',
    next_objectives: evaluation?.next_objectives || ''
  });

  const calculateOverallScore = () => {
    const scores = [
      formData.pedagogical_skills,
      formData.subject_mastery,
      formData.student_relations,
      formData.administrative_tasks,
      formData.professional_development
    ];
    return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.teacher_name || !formData.evaluator) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }

    const evaluationData = {
      ...formData,
      overall_score: calculateOverallScore(),
      status: 'completed'
    };

    onSave(evaluationData);
    toast({
      title: mode === 'create' ? "Évaluation créée" : "Évaluation modifiée",
      description: `L'évaluation a été ${mode === 'create' ? 'créée' : 'modifiée'} avec succès.`,
    });
    onClose();
  };

  const handleSliderChange = (field: string, value: number[]) => {
    setFormData(prev => ({ ...prev, [field]: value[0] }));
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isReadOnly = mode === 'view';
  const title = mode === 'create' ? 'Nouvelle évaluation' : 
                mode === 'edit' ? 'Modifier l\'évaluation' : 
                'Détails de l\'évaluation';

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-yellow-600';
    if (score >= 70) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-500" />
            {title}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations générales */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="teacher_name">Enseignant *</Label>
              <Input
                id="teacher_name"
                value={formData.teacher_name}
                onChange={(e) => handleInputChange('teacher_name', e.target.value)}
                placeholder="Nom de l'enseignant"
                disabled={isReadOnly}
                required
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

            <div className="space-y-2">
              <Label htmlFor="evaluation_period">Période d'évaluation</Label>
              <Select
                value={formData.evaluation_period}
                onValueChange={(value) => handleInputChange('evaluation_period', value)}
                disabled={isReadOnly}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024-2025">2024-2025</SelectItem>
                  <SelectItem value="2023-2024">2023-2024</SelectItem>
                  <SelectItem value="2022-2023">2022-2023</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Score global calculé */}
          <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
            <div className="flex items-center justify-between">
              <span className="font-semibold">Score global calculé:</span>
              <span className={`text-2xl font-bold ${getScoreColor(calculateOverallScore())}`}>
                {calculateOverallScore()}%
              </span>
            </div>
          </div>

          {/* Critères d'évaluation */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Critères d'évaluation</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label>Compétences pédagogiques: {formData.pedagogical_skills}%</Label>
                <Slider
                  value={[formData.pedagogical_skills]}
                  onValueChange={(value) => handleSliderChange('pedagogical_skills', value)}
                  max={100}
                  step={5}
                  disabled={isReadOnly}
                  className="w-full"
                />
              </div>

              <div className="space-y-3">
                <Label>Maîtrise du sujet: {formData.subject_mastery}%</Label>
                <Slider
                  value={[formData.subject_mastery]}
                  onValueChange={(value) => handleSliderChange('subject_mastery', value)}
                  max={100}
                  step={5}
                  disabled={isReadOnly}
                  className="w-full"
                />
              </div>

              <div className="space-y-3">
                <Label>Relations étudiants: {formData.student_relations}%</Label>
                <Slider
                  value={[formData.student_relations]}
                  onValueChange={(value) => handleSliderChange('student_relations', value)}
                  max={100}
                  step={5}
                  disabled={isReadOnly}
                  className="w-full"
                />
              </div>

              <div className="space-y-3">
                <Label>Tâches administratives: {formData.administrative_tasks}%</Label>
                <Slider
                  value={[formData.administrative_tasks]}
                  onValueChange={(value) => handleSliderChange('administrative_tasks', value)}
                  max={100}
                  step={5}
                  disabled={isReadOnly}
                  className="w-full"
                />
              </div>

              <div className="space-y-3 md:col-span-2">
                <Label>Développement professionnel: {formData.professional_development}%</Label>
                <Slider
                  value={[formData.professional_development]}
                  onValueChange={(value) => handleSliderChange('professional_development', value)}
                  max={100}
                  step={5}
                  disabled={isReadOnly}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Objectifs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="goals_achieved">Objectifs atteints</Label>
              <Input
                id="goals_achieved"
                type="number"
                value={formData.goals_achieved}
                onChange={(e) => handleInputChange('goals_achieved', parseInt(e.target.value) || 0)}
                disabled={isReadOnly}
                min="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="total_goals">Total objectifs</Label>
              <Input
                id="total_goals"
                type="number"
                value={formData.total_goals}
                onChange={(e) => handleInputChange('total_goals', parseInt(e.target.value) || 0)}
                disabled={isReadOnly}
                min="1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="evaluation_date">Date d'évaluation</Label>
              <Input
                id="evaluation_date"
                type="date"
                value={formData.evaluation_date}
                onChange={(e) => handleInputChange('evaluation_date', e.target.value)}
                disabled={isReadOnly}
              />
            </div>
          </div>

          {/* Commentaires détaillés */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Commentaires détaillés</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="strengths">Points forts</Label>
                <Textarea
                  id="strengths"
                  value={formData.strengths}
                  onChange={(e) => handleInputChange('strengths', e.target.value)}
                  placeholder="Principaux points forts de l'enseignant..."
                  disabled={isReadOnly}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="improvements">Axes d'amélioration</Label>
                <Textarea
                  id="improvements"
                  value={formData.improvements}
                  onChange={(e) => handleInputChange('improvements', e.target.value)}
                  placeholder="Points à améliorer..."
                  disabled={isReadOnly}
                  rows={3}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="comments">Commentaires généraux</Label>
              <Textarea
                id="comments"
                value={formData.comments}
                onChange={(e) => handleInputChange('comments', e.target.value)}
                placeholder="Commentaires généraux sur l'évaluation..."
                disabled={isReadOnly}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="next_objectives">Objectifs pour la prochaine période</Label>
              <Textarea
                id="next_objectives"
                value={formData.next_objectives}
                onChange={(e) => handleInputChange('next_objectives', e.target.value)}
                placeholder="Objectifs fixés pour la prochaine période..."
                disabled={isReadOnly}
                rows={3}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="evaluator">Évaluateur *</Label>
            <Input
              id="evaluator"
              value={formData.evaluator}
              onChange={(e) => handleInputChange('evaluator', e.target.value)}
              placeholder="Nom de l'évaluateur"
              disabled={isReadOnly}
              required
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