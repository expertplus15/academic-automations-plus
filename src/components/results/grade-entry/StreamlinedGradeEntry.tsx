
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Search, Users, BookOpen, ClipboardCheck, ArrowRight } from "lucide-react";
import { useStreamlinedGradeEntry } from '@/hooks/useStreamlinedGradeEntry';

export function StreamlinedGradeEntry() {
  const {
    filters,
    updateFilter,
    programs,
    levels,
    groups,
    subjects,
    evaluationTypes,
    students,
    isLoading,
    canStartGrading,
    currentStep,
    selectedAcademicYear
  } = useStreamlinedGradeEntry();

  const progressPercentage = (currentStep / 4) * 100;

  const getStepIcon = (step: number) => {
    if (currentStep > step) return "✓";
    if (currentStep === step) return step;
    return step;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Progress Header */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg text-foreground">Saisie des Notes</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Configuration et saisie matricielle des évaluations
              </p>
            </div>
            {selectedAcademicYear && (
              <Badge variant="outline" className="text-xs">
                {selectedAcademicYear.name}
              </Badge>
            )}
          </div>
          
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
              <span>Progression</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          <div className="flex items-center gap-4 mt-3 text-xs">
            <div className={`flex items-center gap-1 ${currentStep >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                currentStep > 1 ? 'bg-primary text-primary-foreground' : 
                currentStep === 1 ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
              }`}>
                {getStepIcon(1)}
              </div>
              Programme
            </div>
            <ArrowRight className="w-3 h-3 text-muted-foreground" />
            
            <div className={`flex items-center gap-1 ${currentStep >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                currentStep > 2 ? 'bg-primary text-primary-foreground' : 
                currentStep === 2 ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
              }`}>
                {getStepIcon(2)}
              </div>
              Matière
            </div>
            <ArrowRight className="w-3 h-3 text-muted-foreground" />
            
            <div className={`flex items-center gap-1 ${currentStep >= 3 ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                currentStep > 3 ? 'bg-primary text-primary-foreground' : 
                currentStep === 3 ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
              }`}>
                {getStepIcon(3)}
              </div>
              Évaluation
            </div>
            <ArrowRight className="w-3 h-3 text-muted-foreground" />
            
            <div className={`flex items-center gap-1 ${currentStep >= 4 ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                currentStep >= 4 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                {getStepIcon(4)}
              </div>
              Saisie
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Configuration Section */}
      <Card className="border-border/50">
        <CardHeader className="pb-4">
          <CardTitle className="text-base text-foreground flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Configuration
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {/* Programme */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">
                Programme *
              </label>
              <Select
                value={filters.program}
                onValueChange={(value) => updateFilter('program', value)}
                disabled={isLoading}
              >
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder="Sélectionner un programme" />
                </SelectTrigger>
                <SelectContent>
                  {programs.map((program) => (
                    <SelectItem key={program.id} value={program.id}>
                      {program.code} - {program.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Niveau */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">
                Niveau
              </label>
              <Select
                value={filters.level}
                onValueChange={(value) => updateFilter('level', value)}
                disabled={!filters.program || isLoading}
              >
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder={!filters.program ? "Sélectionner un programme d'abord" : "Tous les niveaux"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les niveaux</SelectItem>
                  {levels.map((level) => (
                    <SelectItem key={level.id} value={level.id}>
                      {level.code} - {level.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Classe */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">
                Classe
              </label>
              <Select
                value={filters.class}
                onValueChange={(value) => updateFilter('class', value)}
                disabled={!filters.program || isLoading}
              >
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder={!filters.program ? "Sélectionner un programme d'abord" : "Toutes les classes"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les classes</SelectItem>
                  {groups.map((group) => (
                    <SelectItem key={group.id} value={group.id}>
                      {group.code} - {group.name} ({group.current_students}/{group.max_students})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Matière et Évaluation - affichées seulement si programme sélectionné */}
          {filters.program && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-border/30">
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">
                  Matière à évaluer *
                </label>
                <Select
                  value={filters.subject}
                  onValueChange={(value) => updateFilter('subject', value)}
                  disabled={isLoading}
                >
                  <SelectTrigger className="h-9 text-xs">
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

              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">
                  Type d'évaluation *
                </label>
                <Select
                  value={filters.evaluationType}
                  onValueChange={(value) => updateFilter('evaluationType', value)}
                  disabled={!filters.subject}
                >
                  <SelectTrigger className="h-9 text-xs">
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

          {/* Recherche */}
          <div className="flex items-center gap-3 pt-2 border-t border-border/30">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un étudiant..."
                  value={filters.search}
                  onChange={(e) => updateFilter('search', e.target.value)}
                  className="h-9 pl-7 text-xs"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Users className="w-3 h-3" />
              <span>{students.length} étudiant{students.length > 1 ? 's' : ''}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grade Entry Table */}
      {canStartGrading && (
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-foreground flex items-center gap-2">
              <ClipboardCheck className="w-4 h-4" />
              Saisie des Notes
              <Badge variant="secondary" className="ml-2 text-xs">
                {students.length} étudiant{students.length > 1 ? 's' : ''}
              </Badge>
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            {students.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Aucun étudiant trouvé avec les filtres appliqués.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {/* En-tête du tableau */}
                <div className="grid grid-cols-4 gap-4 p-3 bg-muted/30 rounded-lg text-xs font-medium">
                  <div>Étudiant</div>
                  <div>Programme</div>
                  <div>Note / 20</div>
                  <div>Actions</div>
                </div>

                {/* Lignes des étudiants */}
                <div className="max-h-96 overflow-y-auto space-y-2">
                  {students.map((student) => (
                    <div key={student.id} className="grid grid-cols-4 gap-4 p-3 border border-border/30 rounded-lg hover:bg-muted/10 transition-colors">
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground text-sm">{student.profile.full_name}</span>
                        <span className="text-xs text-muted-foreground">{student.student_number}</span>
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center">
                        {student.program.code}
                      </div>
                      <div className="flex items-center">
                        <input
                          type="number"
                          min="0"
                          max="20"
                          step="0.5"
                          className="w-20 px-2 py-1 border border-border rounded text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                          placeholder="0.00"
                        />
                      </div>
                      <div className="flex items-center">
                        <Button size="sm" variant="outline" className="text-xs h-7 px-2">
                          Sauvegarder
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
