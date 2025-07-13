import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { usePrograms } from '@/hooks/usePrograms';
import { useStudents } from '@/hooks/useStudents';
import { useSubjects } from '@/hooks/useSubjects';
import { useToast } from '@/hooks/use-toast';
import { 
  FileText, 
  Download, 
  Eye, 
  Users, 
  Send, 
  BookOpen, 
  Calculator, 
  Calendar,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

interface AcademicContext {
  program_id?: string;
  academic_year_id?: string;
  semester?: number;
  subject_ids?: string[];
}

export function AcademicDocumentGenerator() {
  const { programs } = usePrograms();
  const { students } = useStudents();
  const { subjects } = useSubjects();
  const { toast } = useToast();
  
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [academicContext, setAcademicContext] = useState<AcademicContext>({});
  const [generationMode, setGenerationMode] = useState<'single' | 'batch' | 'program'>('single');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // Mock templates with academic context
  const academicTemplates = [
    {
      id: '1',
      name: 'Certificat de Scolarité - IG',
      type: 'certificate',
      program_id: 'prog_ig',
      requires_grades: false,
      variables: ['student.full_name', 'student.student_number', 'program.name', 'academic_year.name']
    },
    {
      id: '2',
      name: 'Relevé de Notes - Semestre',
      type: 'transcript',
      program_id: null, // All programs
      requires_grades: true,
      variables: ['student.full_name', 'grades.overall_average', 'ects.earned', 'subjects.list']
    },
    {
      id: '3',
      name: 'Attestation de Réussite',
      type: 'attestation',
      program_id: null,
      requires_grades: true,
      variables: ['student.full_name', 'grades.overall_average', 'program.name', 'academic_year.name']
    }
  ];

  const currentYear = { id: '1', name: '2024-2025' };
  const semesters = [
    { value: 1, label: 'Semestre 1' },
    { value: 2, label: 'Semestre 2' }
  ];

  // Filter templates based on academic context
  const filteredTemplates = academicTemplates.filter(template => {
    if (academicContext.program_id && template.program_id) {
      return template.program_id === academicContext.program_id;
    }
    return true;
  });

  // Filter students based on academic context
  const filteredStudents = students.filter(student => {
    if (academicContext.program_id) {
      return student.program_id === academicContext.program_id;
    }
    return true;
  });

  const selectedTemplateData = academicTemplates.find(t => t.id === selectedTemplate);

  const handlePreview = async () => {
    if (!selectedTemplate || !selectedStudent) {
      toast({
        title: "Sélection incomplète",
        description: "Veuillez sélectionner un modèle et un étudiant.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Aperçu généré",
        description: "L'aperçu du document académique a été généré avec succès.",
      });
    }, 1500);
  };

  const handleGenerate = async () => {
    if (!selectedTemplate || !selectedStudent) {
      toast({
        title: "Sélection incomplète",
        description: "Veuillez sélectionner un modèle et un étudiant.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setProgress(0);

    // Simulate generation progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setLoading(false);
          toast({
            title: "Document généré",
            description: "Le document académique a été généré avec succès.",
          });
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleBatchGenerate = async () => {
    if (!selectedTemplate || selectedStudents.length === 0) {
      toast({
        title: "Sélection incomplète",
        description: "Veuillez sélectionner un modèle et au moins un étudiant.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setProgress(0);

    // Simulate batch generation
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setLoading(false);
          toast({
            title: "Génération en lot terminée",
            description: `${selectedStudents.length} documents ont été générés avec succès.`,
          });
          return 100;
        }
        return prev + 5;
      });
    }, 300);
  };

  const handleProgramGenerate = async () => {
    if (!selectedTemplate || !academicContext.program_id) {
      toast({
        title: "Sélection incomplète",
        description: "Veuillez sélectionner un modèle et un programme.",
        variant: "destructive",
      });
      return;
    }

    const programStudents = filteredStudents.length;
    setLoading(true);
    setProgress(0);

    // Simulate program-wide generation
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setLoading(false);
          toast({
            title: "Génération par programme terminée",
            description: `Documents générés pour ${programStudents} étudiants du programme.`,
          });
          return 100;
        }
        return prev + 2;
      });
    }, 100);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Générateur de Documents Académiques</h2>
        <p className="text-muted-foreground">
          Génération intelligente basée sur les données académiques réelles
        </p>
      </div>

      {/* Academic Context Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Contexte Académique
          </CardTitle>
          <CardDescription>
            Sélectionnez le contexte pour filtrer les modèles et étudiants appropriés
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="program-context">Programme</Label>
              <Select 
                value={academicContext.program_id || ''} 
                onValueChange={(value) => setAcademicContext(prev => ({ ...prev, program_id: value || undefined }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tous les programmes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tous les programmes</SelectItem>
                  {programs.map((program) => (
                    <SelectItem key={program.id} value={program.id}>
                      {program.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="year-context">Année académique</Label>
              <Select value={currentYear.id} disabled>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={currentYear.id}>{currentYear.name}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="semester-context">Semestre</Label>
              <Select 
                value={academicContext.semester?.toString() || ''} 
                onValueChange={(value) => setAcademicContext(prev => ({ ...prev, semester: value ? parseInt(value) : undefined }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tous les semestres" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tous les semestres</SelectItem>
                  {semesters.map((semester) => (
                    <SelectItem key={semester.value} value={semester.value.toString()}>
                      {semester.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={generationMode} onValueChange={(value) => setGenerationMode(value as any)}>
        <TabsList>
          <TabsTrigger value="single">Génération Simple</TabsTrigger>
          <TabsTrigger value="batch">Génération en Lot</TabsTrigger>
          <TabsTrigger value="program">Par Programme</TabsTrigger>
        </TabsList>

        <TabsContent value="single" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Génération pour un étudiant
              </CardTitle>
              <CardDescription>
                Sélectionnez un modèle et un étudiant pour générer un document personnalisé
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="template-select">Modèle de document</Label>
                  <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un modèle" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredTemplates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          <div className="flex items-center justify-between w-full">
                            <span>{template.name}</span>
                            <div className="flex items-center space-x-1 ml-2">
                              <Badge variant="outline" className="text-xs">
                                {template.type}
                              </Badge>
                              {template.requires_grades && (
                                <Calculator className="w-3 h-3" />
                              )}
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="student-select">Étudiant</Label>
                  <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un étudiant" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredStudents.map((student) => (
                        <SelectItem key={student.id} value={student.id}>
                          <div className="flex items-center justify-between w-full">
                            <span>{student.profile.full_name}</span>
                            <div className="text-xs text-muted-foreground ml-2">
                              {student.student_number} • {student.program.name}
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Template Info */}
              {selectedTemplateData && (
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Informations du modèle</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Type :</span> {selectedTemplateData.type}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Nécessite des notes :</span> 
                      {selectedTemplateData.requires_grades ? (
                        <CheckCircle className="inline w-4 h-4 ml-1 text-green-500" />
                      ) : (
                        <AlertTriangle className="inline w-4 h-4 ml-1 text-orange-500" />
                      )}
                    </div>
                    <div className="md:col-span-2">
                      <span className="text-muted-foreground">Variables utilisées :</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedTemplateData.variables.map((variable) => (
                          <Badge key={variable} variant="secondary" className="text-xs">
                            {variable}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {loading && (
                <div className="space-y-2">
                  <Label>Progression: {progress}%</Label>
                  <Progress value={progress} className="w-full" />
                </div>
              )}

              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  onClick={handlePreview}
                  disabled={loading || !selectedTemplate || !selectedStudent}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Aperçu
                </Button>
                <Button 
                  onClick={handleGenerate}
                  disabled={loading || !selectedTemplate || !selectedStudent}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Générer
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="batch" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Génération en lot
              </CardTitle>
              <CardDescription>
                Générez des documents pour plusieurs étudiants avec données académiques intégrées
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="batch-template-select">Modèle de document</Label>
                <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un modèle" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredTemplates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Étudiants sélectionnés ({selectedStudents.length} / {filteredStudents.length})</Label>
                <div className="border rounded-md p-4 max-h-60 overflow-y-auto">
                  <div className="flex items-center space-x-2 mb-3 pb-2 border-b">
                    <input
                      type="checkbox"
                      id="select-all"
                      checked={selectedStudents.length === filteredStudents.length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedStudents(filteredStudents.map(s => s.id));
                        } else {
                          setSelectedStudents([]);
                        }
                      }}
                      className="rounded"
                    />
                    <label htmlFor="select-all" className="text-sm font-medium">
                      Sélectionner tout
                    </label>
                  </div>
                  
                  {filteredStudents.map((student) => (
                    <div key={student.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`student-${student.id}`}
                          checked={selectedStudents.includes(student.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedStudents([...selectedStudents, student.id]);
                            } else {
                              setSelectedStudents(selectedStudents.filter(id => id !== student.id));
                            }
                          }}
                          className="rounded"
                        />
                        <label htmlFor={`student-${student.id}`} className="text-sm">
                          {student.profile.full_name}
                        </label>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {student.student_number} • {student.program.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {loading && (
                <div className="space-y-2">
                  <Label>Progression: {progress}%</Label>
                  <Progress value={progress} className="w-full" />
                  <p className="text-sm text-muted-foreground">
                    Génération en cours pour {selectedStudents.length} étudiants...
                  </p>
                </div>
              )}

              <Button 
                onClick={handleBatchGenerate}
                disabled={loading || !selectedTemplate || selectedStudents.length === 0}
                className="w-full"
              >
                <Send className="w-4 h-4 mr-2" />
                Générer en lot ({selectedStudents.length} étudiants)
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="program" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="w-5 h-5 mr-2" />
                Génération par programme
              </CardTitle>
              <CardDescription>
                Générez automatiquement des documents pour tous les étudiants d'un programme
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="program-template-select">Modèle de document</Label>
                  <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un modèle" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredTemplates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Programme sélectionné</Label>
                  <div className="p-3 border rounded-md bg-muted">
                    {academicContext.program_id ? (
                      <div>
                        <div className="font-medium">
                          {programs.find(p => p.id === academicContext.program_id)?.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {filteredStudents.length} étudiants
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground">
                        Sélectionnez un programme dans le contexte académique
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {loading && (
                <div className="space-y-2">
                  <Label>Progression: {progress}%</Label>
                  <Progress value={progress} className="w-full" />
                  <p className="text-sm text-muted-foreground">
                    Génération automatique pour {filteredStudents.length} étudiants...
                  </p>
                </div>
              )}

              <Button 
                onClick={handleProgramGenerate}
                disabled={loading || !selectedTemplate || !academicContext.program_id}
                className="w-full"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Générer pour le programme ({filteredStudents.length} étudiants)
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}