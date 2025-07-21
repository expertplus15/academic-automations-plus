
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Loader2, Settings, Users, BookOpen, Save, Eye, EyeOff } from "lucide-react";
import { Student } from '@/hooks/useStudents';
import { useSubjects } from '@/hooks/useSubjects';
import { useEvaluationTypes } from '@/hooks/useEvaluationTypes';
import { useMatrixFilters } from '@/hooks/useMatrixFilters';

interface MatrixTableProps {
  students: Student[];
  academicYearId?: string;
  isLoading: boolean;
}

export function MatrixTable({ students, academicYearId, isLoading }: MatrixTableProps) {
  const { filters } = useMatrixFilters();
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedEvaluationType, setSelectedEvaluationType] = useState<string>('');
  const [isConfigurationVisible, setIsConfigurationVisible] = useState(true);
  
  // Hooks pour récupérer les données de configuration
  const { subjects, loading: subjectsLoading } = useSubjects(
    filters.program || undefined,
    filters.level || undefined
  );
  const { evaluationTypes, loading: evaluationTypesLoading } = useEvaluationTypes();

  console.log('🔍 [MATRIX_TABLE] Current configuration:', {
    selectedSubject,
    selectedEvaluationType,
    studentsCount: students.length,
    subjectsCount: subjects.length
  });

  // Fonction pour rendre la section de configuration
  const renderConfiguration = () => (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-base text-foreground flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Configuration de la saisie
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsConfigurationVisible(!isConfigurationVisible)}
            className="h-8 px-2"
          >
            {isConfigurationVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </Button>
        </CardTitle>
      </CardHeader>
      {isConfigurationVisible && (
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Sélection de la matière */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Matière *
              </label>
              <Select
                value={selectedSubject}
                onValueChange={setSelectedSubject}
                disabled={subjectsLoading || !filters.program}
              >
                <SelectTrigger className="h-10">
                  <SelectValue placeholder={!filters.program ? "Sélectionner un programme d'abord" : "Choisir une matière"} />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.code} - {subject.name} ({subject.credits_ects} ECTS)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {subjects.length === 0 && filters.program && (
                <p className="text-xs text-orange-500">
                  Aucune matière disponible pour ce programme
                </p>
              )}
            </div>

            {/* Sélection du type d'évaluation */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Type d'évaluation *
              </label>
              <Select
                value={selectedEvaluationType}
                onValueChange={setSelectedEvaluationType}
                disabled={evaluationTypesLoading || !selectedSubject}
              >
                <SelectTrigger className="h-10">
                  <SelectValue placeholder={!selectedSubject ? "Sélectionner une matière d'abord" : "Choisir un type d'évaluation"} />
                </SelectTrigger>
                <SelectContent>
                  {evaluationTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name} - {type.weight_percentage}%
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Informations sur la configuration */}
          <div className="mt-4 p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{students.length} étudiant{students.length > 1 ? 's' : ''}</span>
              </div>
              <div className="flex items-center gap-1">
                <BookOpen className="w-4 h-4" />
                <span>{subjects.length} matière{subjects.length > 1 ? 's' : ''}</span>
              </div>
              {selectedSubject && selectedEvaluationType && (
                <Badge variant="secondary" className="text-xs">
                  Configuration prête
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );

  // Fonction pour rendre le tableau matriciel
  const renderMatrixTable = () => {
    if (!selectedSubject || !selectedEvaluationType) {
      return (
        <Card className="border-border/50">
          <CardContent className="p-8 text-center">
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center">
                  <Settings className="w-8 h-8 text-muted-foreground" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-foreground">
                  Configuration requise
                </h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  Veuillez sélectionner une matière et un type d'évaluation dans la configuration ci-dessus pour commencer la saisie des notes.
                </p>
              </div>
              <div className="flex justify-center gap-2">
                {!selectedSubject && (
                  <Badge variant="outline" className="text-xs">
                    Matière requise
                  </Badge>
                )}
                {!selectedEvaluationType && (
                  <Badge variant="outline" className="text-xs">
                    Type d'évaluation requis
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }

    if (students.length === 0) {
      return (
        <Card className="border-border/50">
          <CardContent className="p-8 text-center">
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center">
                  <Users className="w-8 h-8 text-muted-foreground" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-foreground">
                  Aucun étudiant trouvé
                </h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  Aucun étudiant ne correspond aux filtres sélectionnés. Veuillez ajuster les filtres ou vérifier les inscriptions.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }

    // Tableau matriciel effectif
    return (
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base text-foreground flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Saisie matricielle des notes
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {students.length} étudiant{students.length > 1 ? 's' : ''}
              </Badge>
              <Button size="sm" className="h-8">
                <Save className="w-4 h-4 mr-1" />
                Sauvegarder
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-2 text-sm font-medium text-foreground">
                    N° Étudiant
                  </th>
                  <th className="text-left p-2 text-sm font-medium text-foreground">
                    Nom complet
                  </th>
                  <th className="text-left p-2 text-sm font-medium text-foreground">
                    Programme
                  </th>
                  <th className="text-center p-2 text-sm font-medium text-foreground">
                    Note / 20
                  </th>
                  <th className="text-center p-2 text-sm font-medium text-foreground">
                    Statut
                  </th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, index) => (
                  <tr key={student.id} className={index % 2 === 0 ? 'bg-muted/20' : ''}>
                    <td className="p-2 text-sm font-mono">
                      {student.student_number}
                    </td>
                    <td className="p-2 text-sm font-medium">
                      {student.profile.full_name}
                    </td>
                    <td className="p-2 text-sm text-muted-foreground">
                      {student.program.code}
                    </td>
                    <td className="p-2 text-center">
                      <Input
                        type="number"
                        min="0"
                        max="20"
                        step="0.25"
                        className="w-20 h-8 text-center text-sm"
                        placeholder="--"
                      />
                    </td>
                    <td className="p-2 text-center">
                      <Badge variant="outline" className="text-xs">
                        À saisir
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <Card className="border-border/50">
        <CardContent className="p-8 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">
            Chargement des données...
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Section de configuration */}
      {renderConfiguration()}
      
      <Separator />
      
      {/* Section tableau matriciel */}
      {renderMatrixTable()}
    </div>
  );
}
