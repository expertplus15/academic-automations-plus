
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, Settings, BookOpen, Users, AlertCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMatrixConfiguration } from '@/hooks/useMatrixConfiguration';

interface MatrixTableProps {
  students: any[];
  academicYearId?: string;
  isLoading: boolean;
}

export function MatrixTable({ students, academicYearId, isLoading }: MatrixTableProps) {
  const [isConfigurationOpen, setIsConfigurationOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedEvaluationType, setSelectedEvaluationType] = useState<string>('');

  const {
    subjects,
    loading: subjectsLoading,
    error: subjectsError,
    isConfigurationAvailable,
    configurationMessage,
    filters,
    filterParams
  } = useMatrixConfiguration();

  console.log('🔍 [MATRIX_TABLE] Configuration state:', {
    isConfigurationAvailable,
    subjectsCount: subjects.length,
    filterParams,
    selectedSubject,
    selectedEvaluationType
  });

  const evaluationTypes = [
    { id: 'cc', name: 'Contrôle Continu', weight: 40 },
    { id: 'td', name: 'Travaux Dirigés', weight: 30 },
    { id: 'exam', name: 'Examen Final', weight: 30 }
  ];

  const canStartGrading = isConfigurationAvailable && selectedSubject && selectedEvaluationType;

  return (
    <div className="space-y-6">
      {/* Configuration Section */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg text-foreground flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Configuration de la Saisie
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsConfigurationOpen(!isConfigurationOpen)}
              className="hover-scale"
            >
              {isConfigurationOpen ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </Button>
          </div>
        </CardHeader>
        
        {isConfigurationOpen && (
          <CardContent className="pt-0">
            <div className="space-y-4">
              {/* Message d'information */}
              <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
                {isConfigurationAvailable ? (
                  <BookOpen className="w-4 h-4 text-success" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-warning" />
                )}
                <span className="text-sm text-muted-foreground">
                  {configurationMessage}
                </span>
              </div>

              {/* Filtres appliqués */}
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="text-xs">
                  Programme: {filters.program ? 'Sélectionné' : 'Non sélectionné'}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  Niveau: {filters.level ? 'Sélectionné' : 'Non sélectionné'}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  Classe: {filters.class ? 'Sélectionnée' : 'Non sélectionnée'}
                </Badge>
              </div>

              {/* Configuration des matières */}
              {isConfigurationAvailable && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Matière à évaluer
                    </label>
                    <Select 
                      value={selectedSubject} 
                      onValueChange={setSelectedSubject}
                      disabled={subjectsLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une matière" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map((subject) => (
                          <SelectItem key={subject.id} value={subject.id}>
                            {subject.code} - {subject.name} ({subject.credits_ects} ECTS)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Type d'évaluation
                    </label>
                    <Select 
                      value={selectedEvaluationType} 
                      onValueChange={setSelectedEvaluationType}
                      disabled={!selectedSubject}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un type" />
                      </SelectTrigger>
                      <SelectContent>
                        {evaluationTypes.map((type) => (
                          <SelectItem key={type.id} value={type.id}>
                            {type.name} ({type.weight}%)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Tableau de saisie */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-foreground flex items-center gap-2">
            <Users className="w-5 h-5" />
            Saisie des Notes
            {canStartGrading && (
              <Badge variant="secondary" className="ml-2">
                {students.length} étudiant(s)
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          {!canStartGrading ? (
            <div className="text-center py-8">
              <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Veuillez configurer la saisie en sélectionnant un programme, une matière et un type d'évaluation.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* En-tête du tableau */}
              <div className="grid grid-cols-4 gap-4 p-3 bg-muted/30 rounded-lg text-sm font-medium">
                <div>Étudiant</div>
                <div>Programme</div>
                <div>Note / 20</div>
                <div>Actions</div>
              </div>

              {/* Lignes des étudiants */}
              {students.map((student) => (
                <div key={student.id} className="grid grid-cols-4 gap-4 p-3 border border-border/30 rounded-lg">
                  <div className="flex flex-col">
                    <span className="font-medium text-foreground">{student.profile.full_name}</span>
                    <span className="text-sm text-muted-foreground">{student.student_number}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {student.program.code}
                  </div>
                  <div>
                    <input
                      type="number"
                      min="0"
                      max="20"
                      step="0.5"
                      className="w-20 px-2 py-1 border border-border rounded text-sm"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <Button size="sm" variant="outline" className="text-xs">
                      Sauvegarder
                    </Button>
                  </div>
                </div>
              ))}

              {students.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  Aucun étudiant trouvé avec les filtres appliqués.
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
