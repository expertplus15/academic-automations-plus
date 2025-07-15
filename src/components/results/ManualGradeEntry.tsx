import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useEvaluationTypes } from '@/hooks/useEvaluationTypes';
import { useStudents } from '@/hooks/useStudents';
import { useStudentGrades } from '@/hooks/useStudentGrades';
import { useSubjects } from '@/hooks/useSubjects';
import { usePrograms } from '@/hooks/usePrograms';
import { 
  Plus, 
  Search, 
  Save, 
  X,
  User,
  BookOpen
} from 'lucide-react';

interface ManualGradeEntryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subjectId: string;
  academicYearId: string;
  semester: number;
  onGradeAdded: () => void;
}

interface GradeFormData {
  studentId: string;
  evaluationTypeId: string;
  grade: string;
  maxGrade: string;
  evaluationDate: string;
  comments: string;
}

export function ManualGradeEntry({ 
  open, 
  onOpenChange, 
  subjectId, 
  academicYearId, 
  semester,
  onGradeAdded 
}: ManualGradeEntryProps) {
  const [formData, setFormData] = useState<GradeFormData>({
    studentId: '',
    evaluationTypeId: '',
    grade: '',
    maxGrade: '20',
    evaluationDate: new Date().toISOString().split('T')[0],
    comments: ''
  });
  const [searchStudent, setSearchStudent] = useState('');
  const [saving, setSaving] = useState(false);

  const { toast } = useToast();
  const { evaluationTypes, loading: evalTypesLoading } = useEvaluationTypes();
  const { students, loading: studentsLoading } = useStudents();
  const { saveGradesBatch } = useStudentGrades();
  const { subjects } = useSubjects();
  const { programs } = usePrograms();

  // Filtre des étudiants avec informations du programme
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.profile?.full_name?.toLowerCase().includes(searchStudent.toLowerCase()) ||
      student.student_number?.includes(searchStudent);
    return matchesSearch;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.studentId || !formData.evaluationTypeId || !formData.grade) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }

    const gradeValue = parseFloat(formData.grade);
    const maxGradeValue = parseFloat(formData.maxGrade);

    if (isNaN(gradeValue) || isNaN(maxGradeValue)) {
      toast({
        title: "Valeurs invalides",
        description: "Les notes doivent être des nombres valides",
        variant: "destructive",
      });
      return;
    }

    if (gradeValue < 0 || gradeValue > maxGradeValue) {
      toast({
        title: "Note invalide",
        description: `La note doit être comprise entre 0 et ${maxGradeValue}`,
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    
    try {
      await saveGradesBatch([{
        student_id: formData.studentId,
        subject_id: subjectId,
        evaluation_type_id: formData.evaluationTypeId,
        grade: gradeValue,
        max_grade: maxGradeValue,
        evaluation_date: formData.evaluationDate,
        semester,
        academic_year_id: academicYearId,
        comments: formData.comments || undefined
      }]);

      toast({
        title: "Note enregistrée",
        description: "La note a été ajoutée avec succès",
      });

      onGradeAdded();
      resetForm();
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving grade:', error);
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setFormData({
      studentId: '',
      evaluationTypeId: '',
      grade: '',
      maxGrade: '20',
      evaluationDate: new Date().toISOString().split('T')[0],
      comments: ''
    });
    setSearchStudent('');
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const selectedStudent = students.find(s => s.id === formData.studentId);
  const selectedEvalType = evaluationTypes.find(e => e.id === formData.evaluationTypeId);
  const currentSubject = subjects.find(s => s.id === subjectId);
  const studentProgram = selectedStudent?.program;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Saisie Manuelle de Note
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Student selection */}
          <div>
            <Label htmlFor="student-search">Étudiant * {currentSubject && `(${currentSubject.name})`}</Label>
            <div className="space-y-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="student-search"
                  placeholder={studentsLoading ? "Chargement des étudiants..." : "Rechercher un étudiant..."}
                  value={searchStudent}
                  onChange={(e) => setSearchStudent(e.target.value)}
                  className="pl-10"
                  disabled={studentsLoading}
                />
              </div>
              
              {searchStudent && (
                <Card className="max-h-40 overflow-y-auto">
                  <CardContent className="p-2">
                    {filteredStudents.length === 0 && !studentsLoading ? (
                      <p className="text-sm text-muted-foreground text-center py-2">
                        {searchStudent ? 'Aucun étudiant trouvé' : 'Tapez pour rechercher un étudiant'}
                      </p>
                    ) : (
                      <div className="space-y-1">
                        {filteredStudents.slice(0, 10).map((student) => (
                          <button
                            key={student.id}
                            type="button"
                            onClick={() => {
                              setFormData({ ...formData, studentId: student.id });
                              setSearchStudent('');
                            }}
                            className="w-full text-left p-2 hover:bg-muted rounded-md text-sm"
                          >
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4" />
                              <div>
                                <div className="font-medium">{student.profile?.full_name}</div>
                                <div className="text-muted-foreground text-xs">
                                  {student.student_number}
                                  {student.program && ` - ${student.program.code}`}
                                </div>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
              
              {selectedStudent && (
                <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
                  <User className="w-4 h-4" />
                  <div>
                    <div className="font-medium">{selectedStudent.profile?.full_name}</div>
                    <div className="text-sm text-muted-foreground">
                      {selectedStudent.student_number}
                      {studentProgram && ` - ${studentProgram.name}`}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Evaluation type */}
          <div>
            <Label htmlFor="evaluation-type">Type d'évaluation *</Label>
            <Select 
              value={formData.evaluationTypeId} 
              onValueChange={(value) => setFormData({ ...formData, evaluationTypeId: value })}
              disabled={evalTypesLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder={evalTypesLoading ? "Chargement..." : "Sélectionner un type"} />
              </SelectTrigger>
              <SelectContent>
                {evaluationTypes.filter(type => type.is_active).map(type => (
                  <SelectItem key={type.id} value={type.id}>
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      <span>{type.name} ({type.weight_percentage}%)</span>
                      {type.description && (
                        <span className="text-xs text-muted-foreground">- {type.description}</span>
                      )}
                    </div>
                  </SelectItem>
                ))}
                {evaluationTypes.length === 0 && !evalTypesLoading && (
                  <div className="px-2 py-1 text-sm text-muted-foreground">
                    Aucun type d'évaluation disponible
                  </div>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Grade inputs */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="grade">Note *</Label>
              <Input
                id="grade"
                type="number"
                step="0.25"
                min="0"
                max={formData.maxGrade}
                value={formData.grade}
                onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                placeholder="0"
                required
              />
            </div>
            <div>
              <Label htmlFor="max-grade">Note max</Label>
              <Input
                id="max-grade"
                type="number"
                min="1"
                value={formData.maxGrade}
                onChange={(e) => setFormData({ ...formData, maxGrade: e.target.value })}
              />
            </div>
          </div>

          {/* Date */}
          <div>
            <Label htmlFor="evaluation-date">Date d'évaluation</Label>
            <Input
              id="evaluation-date"
              type="date"
              value={formData.evaluationDate}
              onChange={(e) => setFormData({ ...formData, evaluationDate: e.target.value })}
            />
          </div>

          {/* Comments */}
          <div>
            <Label htmlFor="comments">Commentaires</Label>
            <Textarea
              id="comments"
              value={formData.comments}
              onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
              placeholder="Commentaires optionnels..."
              rows={3}
            />
          </div>

          {/* Summary */}
          {selectedStudent && selectedEvalType && formData.grade && (
            <Card className="bg-muted/50">
              <CardContent className="pt-4">
                <h4 className="font-medium mb-2">Résumé de la Note</h4>
                <div className="text-sm space-y-1">
                  <div>Étudiant: {selectedStudent.profile?.full_name}</div>
                  <div>Programme: {studentProgram?.name || 'Non défini'}</div>
                  <div>Matière: {currentSubject?.name || 'Matière courante'}</div>
                  <div>Type: {selectedEvalType.name} ({selectedEvalType.weight_percentage}%)</div>
                  <div>Note: {formData.grade}/{formData.maxGrade}</div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={saving} className="flex-1">
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
            <Button type="button" variant="outline" onClick={handleClose}>
              Annuler
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}