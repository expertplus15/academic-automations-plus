import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, User, BookOpen, Calendar } from 'lucide-react';
import { ManualGradeEntry } from './ManualGradeEntry';
import { useSubjects } from '@/hooks/useSubjects';
import { useAcademicYears } from '@/hooks/useAcademicYears';

export function ManualGradeEntryPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedAcademicYear, setSelectedAcademicYear] = useState<string>('');
  const [selectedSemester, setSelectedSemester] = useState<number>(1);

  const { subjects } = useSubjects();
  const { academicYears } = useAcademicYears();
  const currentAcademicYear = academicYears.find(ay => ay.is_current);

  const handleOpenDialog = () => {
    if (!selectedSubject || !selectedAcademicYear) {
      alert('Veuillez sélectionner une matière et une année académique');
      return;
    }
    setIsDialogOpen(true);
  };

  const handleGradeAdded = () => {
    // Callback après ajout d'une note
    console.log('Note ajoutée avec succès');
  };

  return (
    <div className="space-y-6">
      {/* Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Saisie Manuelle des Notes
          </CardTitle>
          <CardDescription>
            Saisissez les notes individuellement pour des cas spécifiques ou des rattrapages.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Année académique</label>
              <Select value={selectedAcademicYear} onValueChange={setSelectedAcademicYear}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner l'année" />
                </SelectTrigger>
                <SelectContent>
                  {academicYears.map((year) => (
                    <SelectItem key={year.id} value={year.id}>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {year.name}
                        {year.is_current && <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Actuelle</span>}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Matière</label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner la matière" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        {subject.name} ({subject.code})
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Semestre</label>
              <Select value={selectedSemester.toString()} onValueChange={(value) => setSelectedSemester(parseInt(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Semestre 1</SelectItem>
                  <SelectItem value="2">Semestre 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end">
            <Button 
              onClick={handleOpenDialog}
              disabled={!selectedSubject || !selectedAcademicYear}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Ajouter une note
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="font-medium mb-2">Utilisation</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Sélectionnez l'année académique et la matière</li>
                <li>• Cliquez sur "Ajouter une note" pour ouvrir le formulaire</li>
                <li>• Remplissez les informations de l'étudiant et de l'évaluation</li>
                <li>• La note sera automatiquement calculée et sauvegardée</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Conseils</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Utilisez cette interface pour les cas particuliers</li>
                <li>• Pour la saisie en masse, préférez l'interface matricielle</li>
                <li>• Les notes sont automatiquement validées</li>
                <li>• Un historique est conservé pour chaque modification</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dialog de saisie */}
      {selectedSubject && selectedAcademicYear && (
        <ManualGradeEntry
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          subjectId={selectedSubject}
          academicYearId={selectedAcademicYear}
          semester={selectedSemester}
          onGradeAdded={handleGradeAdded}
        />
      )}
    </div>
  );
}