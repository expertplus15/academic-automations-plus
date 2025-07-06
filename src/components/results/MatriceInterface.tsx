import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useStudentGrades } from '@/hooks/useStudentGrades';
import { usePrograms } from '@/hooks/usePrograms';
import { useSubjects } from '@/hooks/useSubjects';
import { useAcademicYears } from '@/hooks/useAcademicYears';
import { useToast } from '@/hooks/use-toast';
import { Save, Users, RefreshCw, Download, Upload } from 'lucide-react';

export function MatriceInterface() {
  const [selectedProgram, setSelectedProgram] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedSemester, setSemester] = useState<number>(1);
  const [matrixData, setMatrixData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [connectedUsers, setConnectedUsers] = useState(3);

  const { toast } = useToast();
  const { getMatriceGrades, saveGradesBatch } = useStudentGrades();
  const { programs } = usePrograms();
  const { subjects } = useSubjects();
  const { academicYears } = useAcademicYears();

  const currentAcademicYear = academicYears.find(year => year.is_current);

  const loadMatrixData = async () => {
    if (!selectedSubject || !currentAcademicYear?.id) {
      setMatrixData([]);
      return;
    }

    setIsLoading(true);
    try {
      const data = await getMatriceGrades(
        selectedSubject,
        currentAcademicYear.id,
        selectedSemester,
        selectedProgram
      );
      setMatrixData(data);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les données de la matrice",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMatrixData();
  }, [selectedSubject, selectedProgram, selectedSemester]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              Interface Matricielle
              <Badge variant="secondary" className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {connectedUsers} connectés
              </Badge>
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Upload className="w-4 h-4 mr-2" />
                Importer
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Exporter
              </Button>
              <Button size="sm">
                <Save className="w-4 h-4 mr-2" />
                Sauvegarder
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select value={selectedProgram} onValueChange={setSelectedProgram}>
              <SelectTrigger>
                <SelectValue placeholder="Programme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les programmes</SelectItem>
                {programs.map(program => (
                  <SelectItem key={program.id} value={program.id}>
                    {program.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger>
                <SelectValue placeholder="Matière" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map(subject => (
                  <SelectItem key={subject.id} value={subject.id}>
                    {subject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedSemester.toString()} onValueChange={(value) => setSemester(parseInt(value))}>
              <SelectTrigger>
                <SelectValue placeholder="Semestre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Semestre 1</SelectItem>
                <SelectItem value="2">Semestre 2</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={loadMatrixData} disabled={isLoading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Actualiser
            </Button>
          </div>
        </CardContent>
      </Card>

      {matrixData.length === 0 && !isLoading && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">
              Sélectionnez une matière pour commencer la saisie matricielle.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}