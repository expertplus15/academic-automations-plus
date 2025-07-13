import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, BookOpen, GraduationCap } from 'lucide-react';
import { ExamCreationData } from '@/hooks/exams/useExamCreation';
import { usePrograms } from '@/hooks/usePrograms';
import { useSubjects } from '@/hooks/useSubjects';

interface BasicInfoProps {
  data: ExamCreationData;
  onChange: (updates: Partial<ExamCreationData>) => void;
}

export function BasicInfo({ data, onChange }: BasicInfoProps) {
  const { programs, loading: programsLoading } = usePrograms();
  const { subjects, loading: subjectsLoading } = useSubjects(data.programId);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-violet-100 rounded-lg">
          <FileText className="w-5 h-5 text-violet-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">Informations de base</h2>
          <p className="text-muted-foreground">Définissez les informations principales de votre examen</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Titre de l'examen */}
        <div className="md:col-span-2 space-y-2">
          <Label htmlFor="title">Titre de l'examen *</Label>
          <Input
            id="title"
            value={data.title || ''}
            onChange={(e) => onChange({ title: e.target.value })}
            placeholder="Ex: Examen final de Mathématiques L2"
            className="text-base"
          />
        </div>

        {/* Type d'examen */}
        <div className="space-y-2">
          <Label>Type d'examen *</Label>
          <Select
            value={data.examType || ''}
            onValueChange={(value) => onChange({ examType: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner le type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="written">📝 Écrit</SelectItem>
              <SelectItem value="oral">🗣️ Oral</SelectItem>
              <SelectItem value="practical">🔬 Pratique</SelectItem>
              <SelectItem value="mixed">🔄 Mixte</SelectItem>
              <SelectItem value="project">📋 Projet</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Matière */}
        <div className="space-y-2">
          <Label>Matière *</Label>
          <Select
            value={data.subjectId || ''}
            onValueChange={(value) => onChange({ subjectId: value })}
            disabled={subjectsLoading || !data.programId}
          >
            <SelectTrigger>
              <SelectValue placeholder={
                !data.programId 
                  ? "Sélectionner d'abord un programme" 
                  : subjectsLoading 
                    ? "Chargement..." 
                    : "Sélectionner la matière"
              } />
            </SelectTrigger>
            <SelectContent>
              {subjects.map((subject) => (
                <SelectItem key={subject.id} value={subject.id}>
                  📚 {subject.name} ({subject.code})
                </SelectItem>
              ))}
              {subjects.length === 0 && !subjectsLoading && (
                <div className="px-2 py-1 text-sm text-muted-foreground">
                  Aucune matière disponible
                </div>
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Programme/Niveau */}
        <div className="space-y-2">
          <Label>Programme *</Label>
          <Select
            value={data.programId || ''}
            onValueChange={(value) => onChange({ programId: value, subjectId: undefined })}
            disabled={programsLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder={programsLoading ? "Chargement..." : "Sélectionner le programme"} />
            </SelectTrigger>
            <SelectContent>
              {programs.map((program) => (
                <SelectItem key={program.id} value={program.id}>
                  🎓 {program.name} ({program.code})
                </SelectItem>
              ))}
              {programs.length === 0 && !programsLoading && (
                <div className="px-2 py-1 text-sm text-muted-foreground">
                  Aucun programme disponible
                </div>
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Semestre */}
        <div className="space-y-2">
          <Label>Semestre *</Label>
          <Select
            value={data.semester?.toString() || ''}
            onValueChange={(value) => onChange({ semester: parseInt(value) })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner le semestre" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Semestre 1</SelectItem>
              <SelectItem value="2">Semestre 2</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description de l'examen</Label>
        <Textarea
          id="description"
          value={data.description || ''}
          onChange={(e) => onChange({ description: e.target.value })}
          placeholder="Décrivez les objectifs et le contenu de cet examen..."
          rows={4}
          className="resize-none"
        />
      </div>

      {/* Suggestions IA */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">✨</span>
            </div>
            Suggestions IA
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2 text-sm text-blue-700">
            <p>• Durée recommandée pour ce type d'examen : 2h</p>
            <p>• Nombre moyen d'étudiants pour cette matière : 45</p>
            <p>• Meilleurs créneaux disponibles : Mardi 14h-16h, Jeudi 10h-12h</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}