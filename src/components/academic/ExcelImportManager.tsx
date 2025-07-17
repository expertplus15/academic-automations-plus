import React, { useState } from 'react';
import { Upload, Download, FileSpreadsheet, CheckCircle, AlertCircle, Users, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import * as XLSX from 'xlsx';

interface ImportResult {
  success: number;
  errors: number;
  total: number;
  errorDetails: string[];
}

export function ExcelImportManager() {
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const { toast } = useToast();

  const downloadTemplate = (type: 'students' | 'grades' | 'subjects') => {
    const templates = {
      students: {
        filename: 'Template_Etudiants.xlsx',
        headers: ['Matricule', 'Nom', 'Prénom', 'Date_Naissance', 'Email', 'Téléphone', 'Classe', 'Programme'],
        sample: [
          ['2425GE001', 'MARTIN', 'Sophie', '2003-03-15', 'sophie.martin@etu.univ.fr', '0612345678', 'DUTGE2-A', 'DUTGE'],
          ['2425GE002', 'BERNARD', 'Lucas', '2003-05-22', 'lucas.bernard@etu.univ.fr', '0623456789', 'DUTGE2-A', 'DUTGE']
        ]
      },
      grades: {
        filename: 'Template_Notes.xlsx',
        headers: ['Matricule', 'Code_Matiere', 'CC1', 'CC2', 'TD', 'Examen_Final'],
        sample: [
          ['2425GE001', 'COMPTA401', '14', '15.5', '13', '14.5'],
          ['2425GE002', 'COMPTA401', '12', '11', '12.5', '13']
        ]
      },
      subjects: {
        filename: 'Template_Matieres.xlsx',
        headers: ['Code_Matiere', 'Intitule', 'Type', 'Coefficient', 'ECTS', 'CM', 'TD', 'TP', 'Enseignant'],
        sample: [
          ['COMPTA401', 'Comptabilité Approfondie', 'Fondamentale', '4', '5', '30', '30', '0', 'Prof. Durand'],
          ['GEST402', 'Contrôle de Gestion', 'Fondamentale', '4', '5', '30', '20', '10', 'Prof. Martin']
        ]
      }
    };

    const template = templates[type];
    const ws = XLSX.utils.aoa_to_sheet([template.headers, ...template.sample]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Template');
    XLSX.writeFile(wb, template.filename);
    
    toast({
      title: "Template téléchargé",
      description: `Le fichier ${template.filename} a été téléchargé`
    });
  };

  const processStudentsImport = async (data: any[]) => {
    let success = 0;
    let errors = 0;
    const errorDetails: string[] = [];
    const total = data.length;

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      setProgress(((i + 1) / total) * 100);

      try {
        // Créer l'étudiant directement
        const { error: studentError } = await supabase
          .from('students')
          .insert({
            student_number: row.Matricule,
            program_id: row.Programme || 'default-program-id',
            enrollment_date: new Date().toISOString().split('T')[0],
            status: 'active'
          });

        if (studentError) throw studentError;
        success++;
      } catch (error) {
        errors++;
        errorDetails.push(`Ligne ${i + 2}: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
      }
    }

    return { success, errors, total, errorDetails };
  };

  const processGradesImport = async (data: any[]) => {
    let success = 0;
    let errors = 0;
    const errorDetails: string[] = [];
    const total = data.length;

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      setProgress(((i + 1) / total) * 100);

      try {
        // Récupérer l'étudiant
        const { data: student, error: studentError } = await supabase
          .from('students')
          .select('id')
          .eq('student_number', row.Matricule)
          .single();

        if (studentError) throw new Error(`Étudiant ${row.Matricule} non trouvé`);

        // Récupérer la matière
        const { data: subject, error: subjectError } = await supabase
          .from('subjects')
          .select('id')
          .eq('code', row.Code_Matiere)
          .single();

        if (subjectError) throw new Error(`Matière ${row.Code_Matiere} non trouvée`);

        // Insérer les notes
        const grades = [];
        if (row.CC1) grades.push({ type: 'CC1', grade: parseFloat(row.CC1) });
        if (row.CC2) grades.push({ type: 'CC2', grade: parseFloat(row.CC2) });
        if (row.TD) grades.push({ type: 'TD', grade: parseFloat(row.TD) });
        if (row.Examen_Final) grades.push({ type: 'Examen', grade: parseFloat(row.Examen_Final) });

        for (const gradeData of grades) {
          const { error: gradeError } = await supabase
            .from('student_grades')
            .insert({
              student_id: student.id,
              subject_id: subject.id,
              grade: gradeData.grade,
              max_grade: 20,
              evaluation_type_id: 'default-eval-type',
              evaluation_date: new Date().toISOString().split('T')[0],
              is_published: true,
              semester: 1
            });

          if (gradeError) throw gradeError;
        }

        success++;
      } catch (error) {
        errors++;
        errorDetails.push(`Ligne ${i + 2}: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
      }
    }

    return { success, errors, total, errorDetails };
  };

  const processSubjectsImport = async (data: any[]) => {
    let success = 0;
    let errors = 0;
    const errorDetails: string[] = [];
    const total = data.length;

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      setProgress(((i + 1) / total) * 100);

      try {
        const { error } = await supabase
          .from('subjects')
          .insert({
            code: row.Code_Matiere,
            name: row.Intitule,
            subject_type: row.Type,
            coefficient: parseFloat(row.Coefficient),
            credits_ects: parseInt(row.ECTS),
            hours_cm: parseInt(row.CM) || 0,
            hours_td: parseInt(row.TD) || 0,
            hours_tp: parseInt(row.TP) || 0,
            is_active: true
          });

        if (error) throw error;
        success++;
      } catch (error) {
        errors++;
        errorDetails.push(`Ligne ${i + 2}: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
      }
    }

    return { success, errors, total, errorDetails };
  };

  const handleFileImport = async (file: File, type: 'students' | 'grades' | 'subjects') => {
    if (!file) return;

    setImporting(true);
    setProgress(0);
    setImportResult(null);

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      if (jsonData.length === 0) {
        throw new Error('Le fichier est vide');
      }

      let result: ImportResult;
      
      switch (type) {
        case 'students':
          result = await processStudentsImport(jsonData);
          break;
        case 'grades':
          result = await processGradesImport(jsonData);
          break;
        case 'subjects':
          result = await processSubjectsImport(jsonData);
          break;
        default:
          throw new Error('Type d\'import non supporté');
      }

      setImportResult(result);

      if (result.errors === 0) {
        toast({
          title: "Import réussi",
          description: `${result.success} éléments importés avec succès`
        });
      } else {
        toast({
          title: "Import terminé avec erreurs",
          description: `${result.success} succès, ${result.errors} erreurs`,
          variant: "destructive"
        });
      }

    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: "Erreur d'import",
        description: error instanceof Error ? error.message : 'Erreur inconnue',
        variant: "destructive"
      });
    } finally {
      setImporting(false);
      setProgress(0);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Import Excel</h2>
        <p className="text-muted-foreground">
          Importez vos données depuis des fichiers Excel (étudiants, notes, matières)
        </p>
      </div>

      <Tabs defaultValue="students" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="students" className="flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>Étudiants</span>
          </TabsTrigger>
          <TabsTrigger value="grades" className="flex items-center space-x-2">
            <FileSpreadsheet className="w-4 h-4" />
            <span>Notes</span>
          </TabsTrigger>
          <TabsTrigger value="subjects" className="flex items-center space-x-2">
            <BookOpen className="w-4 h-4" />
            <span>Matières</span>
          </TabsTrigger>
        </TabsList>

        {['students', 'grades', 'subjects'].map((type) => (
          <TabsContent key={type} value={type}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  {type === 'students' && <Users className="w-5 h-5" />}
                  {type === 'grades' && <FileSpreadsheet className="w-5 h-5" />}
                  {type === 'subjects' && <BookOpen className="w-5 h-5" />}
                  <span>
                    Import {type === 'students' ? 'des étudiants' : 
                            type === 'grades' ? 'des notes' : 'des matières'}
                  </span>
                </CardTitle>
                <CardDescription>
                  Téléchargez d'abord le template pour connaître le format requis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div>
                    <h4 className="font-medium">Template Excel</h4>
                    <p className="text-sm text-muted-foreground">
                      Fichier modèle avec exemples
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => downloadTemplate(type as any)}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Télécharger
                  </Button>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Fichier Excel à importer</label>
                  <Input
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileImport(file, type as any);
                    }}
                    disabled={importing}
                  />
                </div>

                {importing && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Import en cours...</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} />
                  </div>
                )}

                {importResult && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-1" />
                        <p className="text-sm font-medium">Succès</p>
                        <p className="text-lg font-bold text-green-600">{importResult.success}</p>
                      </div>
                      <div className="text-center p-3 bg-red-50 rounded-lg">
                        <AlertCircle className="w-6 h-6 text-red-600 mx-auto mb-1" />
                        <p className="text-sm font-medium">Erreurs</p>
                        <p className="text-lg font-bold text-red-600">{importResult.errors}</p>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <FileSpreadsheet className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                        <p className="text-sm font-medium">Total</p>
                        <p className="text-lg font-bold text-blue-600">{importResult.total}</p>
                      </div>
                    </div>

                    {importResult.errorDetails.length > 0 && (
                      <div className="p-3 bg-red-50 rounded-lg">
                        <h4 className="font-medium text-red-800 mb-2">Détails des erreurs:</h4>
                        <div className="space-y-1 max-h-32 overflow-y-auto">
                          {importResult.errorDetails.slice(0, 10).map((error, index) => (
                            <p key={index} className="text-sm text-red-600">{error}</p>
                          ))}
                          {importResult.errorDetails.length > 10 && (
                            <p className="text-sm text-red-600 font-medium">
                              ... et {importResult.errorDetails.length - 10} autres erreurs
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}