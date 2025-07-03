import { useState } from 'react';
import { ResultsPageHeader } from "@/components/ResultsPageHeader";
import { MatriceInterface } from "@/components/results/MatriceInterface";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Grid, Plus, Settings } from 'lucide-react';
import { useAcademicYears } from '@/hooks/useAcademicYears';
import { useSubjects } from '@/hooks/useSubjects';

export default function Matrix() {
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedProgram, setSelectedProgram] = useState<string>('');
  const [selectedSemester, setSelectedSemester] = useState<string>('1');
  
  // Real hooks
  const { currentYear } = useAcademicYears();
  const { subjects, loading: subjectsLoading } = useSubjects();
  
  // Mock programs data for now - could be replaced with real programs hook
  const programs = [
    { id: '1', name: 'Licence Informatique' },
    { id: '2', name: 'Licence Mathématiques' },
    { id: '3', name: 'Master Informatique' },
    { id: '4', name: 'Master Mathématiques' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <ResultsPageHeader 
        title="Interface Matricielle" 
        subtitle="Saisie collaborative des notes en temps réel" 
      />
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Configuration Panel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Grid className="w-5 h-5" />
                Configuration de la Matrice
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Select value={selectedProgram} onValueChange={setSelectedProgram}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un programme" />
                  </SelectTrigger>
                  <SelectContent>
                    {programs.map(program => (
                      <SelectItem key={program.id} value={program.id}>
                        {program.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une matière" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjectsLoading ? (
                      <SelectItem value="" disabled>Chargement...</SelectItem>
                    ) : (
                      subjects.map(subject => (
                        <SelectItem key={subject.id} value={subject.id}>
                          {subject.name} ({subject.code})
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                
                <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                  <SelectTrigger>
                    <SelectValue placeholder="Semestre" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Semestre 1</SelectItem>
                    <SelectItem value="2">Semestre 2</SelectItem>
                  </SelectContent>
                </Select>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4 mr-1" />
                    Paramètres
                  </Button>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-1" />
                    Nouvelle Session
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Matrix Interface */}
          {selectedSubject && selectedProgram && currentYear ? (
            <MatriceInterface
              subjectId={selectedSubject}
              academicYearId={currentYear.id}
              semester={parseInt(selectedSemester)}
              programId={selectedProgram}
            />
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Grid className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">Sélectionnez une configuration</h3>
                <p className="text-muted-foreground">
                  Choisissez un programme et une matière pour commencer la saisie collaborative des notes.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}