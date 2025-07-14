import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Users, Filter, Download, Upload } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Student {
  id: string;
  student_number: string;
  profiles: {
    full_name: string;
    email: string;
  };
  programs: {
    name: string;
  };
}

interface DataConfigurationProps {
  data: any;
  onDataChange: (data: any) => void;
}

export function DataConfiguration({ data, onDataChange }: DataConfigurationProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<string[]>(data.students || []);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProgram, setSelectedProgram] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [programs, setPrograms] = useState<any[]>([]);
  const [levels, setLevels] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterStudents();
  }, [students, searchTerm, selectedProgram, selectedLevel]);

  useEffect(() => {
    onDataChange({ ...data, students: selectedStudents });
  }, [selectedStudents]);

  const loadData = async () => {
    try {
      // Charger les étudiants
      const { data: studentsData, error: studentsError } = await supabase
        .from('students')
        .select(`
          id,
          student_number,
          profiles!inner(full_name, email),
          programs(name)
        `)
        .eq('status', 'active');

      if (studentsError) throw studentsError;

      // Charger les programmes
      const { data: programsData, error: programsError } = await supabase
        .from('programs')
        .select('id, name');

      if (programsError) throw programsError;

      // Charger les niveaux
      const { data: levelsData, error: levelsError } = await supabase
        .from('academic_levels')
        .select('id, name')
        .order('order_index');

      if (levelsError) throw levelsError;

      setStudents(studentsData || []);
      setPrograms(programsData || []);
      setLevels(levelsData || []);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterStudents = () => {
    let filtered = students;

    if (searchTerm) {
      filtered = filtered.filter(student =>
        student.profiles?.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.student_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.profiles?.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedProgram !== 'all') {
      filtered = filtered.filter(student => student.programs?.name === selectedProgram);
    }

    // Note: Level filtering disabled as academic_levels relation not available
    // if (selectedLevel !== 'all') {
    //   filtered = filtered.filter(student => student.academic_levels?.name === selectedLevel);
    // }

    setFilteredStudents(filtered);
  };

  const handleStudentToggle = (studentId: string) => {
    setSelectedStudents(prev => 
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSelectAll = () => {
    const allIds = filteredStudents.map(s => s.id);
    setSelectedStudents(prev => {
      const newSelection = [...new Set([...prev, ...allIds])];
      return newSelection;
    });
  };

  const handleDeselectAll = () => {
    const filteredIds = filteredStudents.map(s => s.id);
    setSelectedStudents(prev => prev.filter(id => !filteredIds.includes(id)));
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-4 bg-muted rounded w-1/4 animate-pulse"></div>
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-12 bg-muted rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="selection" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="selection">Sélection des étudiants</TabsTrigger>
          <TabsTrigger value="parameters">Paramètres additionnels</TabsTrigger>
        </TabsList>

        <TabsContent value="selection" className="space-y-4">
          {/* Filtres et recherche */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-base">
                <Filter className="w-4 h-4 mr-2" />
                Filtres et recherche
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Rechercher par nom, numéro étudiant ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Programme</label>
                  <Select value={selectedProgram} onValueChange={setSelectedProgram}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tous les programmes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les programmes</SelectItem>
                      {programs.map(program => (
                        <SelectItem key={program.id} value={program.name}>
                          {program.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Niveau académique</label>
                  <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tous les niveaux" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les niveaux</SelectItem>
                      {levels.map(level => (
                        <SelectItem key={level.id} value={level.name}>
                          {level.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Résumé de la sélection */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Badge variant="secondary" className="px-3 py-1">
                    {selectedStudents.length} étudiant(s) sélectionné(s)
                  </Badge>
                  <Badge variant="outline" className="px-3 py-1">
                    {filteredStudents.length} étudiant(s) affiché(s)
                  </Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={handleSelectAll}>
                    Tout sélectionner
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleDeselectAll}>
                    Tout désélectionner
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Liste des étudiants */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-base">
                <Users className="w-4 h-4 mr-2" />
                Liste des étudiants
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredStudents.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h4 className="font-medium mb-2">Aucun étudiant trouvé</h4>
                  <p className="text-sm text-muted-foreground">
                    Modifiez vos critères de recherche pour voir plus de résultats.
                  </p>
                </div>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {filteredStudents.map(student => (
                    <div
                      key={student.id}
                      className={`
                        flex items-center justify-between p-3 rounded-lg border transition-all
                        ${selectedStudents.includes(student.id) 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border hover:bg-muted/50'
                        }
                      `}
                    >
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          checked={selectedStudents.includes(student.id)}
                          onCheckedChange={() => handleStudentToggle(student.id)}
                        />
                        <div>
                          <h4 className="font-medium">{student.profiles?.full_name}</h4>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span>N° {student.student_number}</span>
                            <span>{student.profiles?.email}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {student.programs?.name}
                        </Badge>
                        {/* Level badge disabled as academic_levels relation not available */}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="parameters" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres de génération</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Année académique
                </label>
                <Select 
                  value={data.parameters?.academicYear || ''} 
                  onValueChange={(value) => 
                    onDataChange({ 
                      ...data, 
                      parameters: { ...data.parameters, academicYear: value }
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner l'année académique" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2023-2024">2023-2024</SelectItem>
                    <SelectItem value="2024-2025">2024-2025</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Semestre (optionnel)
                </label>
                <Select 
                  value={data.parameters?.semester || ''} 
                  onValueChange={(value) => 
                    onDataChange({ 
                      ...data, 
                      parameters: { ...data.parameters, semester: value }
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tous les semestres" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Semestre 1</SelectItem>
                    <SelectItem value="2">Semestre 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Options d'export</label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="includeGrades" />
                    <label htmlFor="includeGrades" className="text-sm">
                      Inclure les notes détaillées
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="includeAttendance" />
                    <label htmlFor="includeAttendance" className="text-sm">
                      Inclure les données de présence
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="includeComments" />
                    <label htmlFor="includeComments" className="text-sm">
                      Inclure les commentaires des enseignants
                    </label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}