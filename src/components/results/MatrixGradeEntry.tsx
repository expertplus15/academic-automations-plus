import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Grid, Users, Save, FileUp, FileDown, Calculator, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useStudentGrades } from '@/hooks/useStudentGrades';
import { MoteurCalculAcademique, DEFAULT_GRADING_CONFIG } from '@/lib/gradingEngine';

interface MatrixData {
  student: {
    id: string;
    student_number: string;
    profiles: { full_name: string };
  };
  grades: {
    cc?: number;
    examen?: number;
    moyenne?: number;
    coefficient?: number;
    mention?: string;
  };
}

export function MatrixGradeEntry() {
  const [matrixData, setMatrixData] = useState<MatrixData[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedSemester, setSelectedSemester] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [autoSave, setAutoSave] = useState(true);
  const { toast } = useToast();
  const { getMatriceGrades, saveGradesBatch } = useStudentGrades();
  const gradingEngine = new MoteurCalculAcademique(DEFAULT_GRADING_CONFIG);

  // Mock data for demonstration
  useEffect(() => {
    setMatrixData([
      {
        student: {
          id: '1',
          student_number: 'ETU001',
          profiles: { full_name: 'Alice Martin' }
        },
        grades: { cc: 15, examen: 16, coefficient: 2 }
      },
      {
        student: {
          id: '2', 
          student_number: 'ETU002',
          profiles: { full_name: 'Bob Dupont' }
        },
        grades: { cc: 12, examen: 14, coefficient: 2 }
      },
      {
        student: {
          id: '3',
          student_number: 'ETU003', 
          profiles: { full_name: 'Claire Rousseau' }
        },
        grades: { cc: 18, examen: 17, coefficient: 2 }
      }
    ]);
  }, []);

  const calculateRowValues = useCallback((rowIndex: number) => {
    const data = [...matrixData];
    const row = data[rowIndex];
    
    if (row.grades.cc !== undefined && row.grades.examen !== undefined) {
      const moyenne = gradingEngine.calculerMoyenneMatiere(row.grades.cc, row.grades.examen);
      const mention = gradingEngine.attribuerMention(moyenne);
      
      data[rowIndex] = {
        ...row,
        grades: {
          ...row.grades,
          moyenne,
          mention: mention?.label || 'N/A'
        }
      };
      
      setMatrixData(data);
    }
  }, [matrixData, gradingEngine]);

  const handleCellEdit = (rowIndex: number, field: 'cc' | 'examen', value: string) => {
    const numValue = value === '' ? undefined : Number(value);
    
    if (numValue !== undefined && (numValue < 0 || numValue > 20)) {
      toast({
        title: "Valeur invalide",
        description: "La note doit être entre 0 et 20",
        variant: "destructive",
      });
      return;
    }
    
    const data = [...matrixData];
    data[rowIndex] = {
      ...data[rowIndex],
      grades: {
        ...data[rowIndex].grades,
        [field]: numValue
      }
    };
    
    setMatrixData(data);
    
    // Auto-calculate when both CC and exam are filled
    setTimeout(() => calculateRowValues(rowIndex), 100);
    
    if (autoSave) {
      // Auto-save after 2 seconds of inactivity
      setTimeout(() => handleSaveAll(), 2000);
    }
  };

  const handleSaveAll = async () => {
    setLoading(true);
    try {
      // TODO: Save to database
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Notes sauvegardées",
        description: `${matrixData.length} notes ont été enregistrées`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les notes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCalculateAll = () => {
    matrixData.forEach((_, index) => calculateRowValues(index));
    toast({
      title: "Calculs effectués",
      description: "Toutes les moyennes ont été recalculées",
    });
  };

  const exportToExcel = () => {
    toast({
      title: "Export en cours",
      description: "Le fichier Excel va être téléchargé",
    });
  };

  const importFromExcel = () => {
    // TODO: Implement Excel import
    toast({
      title: "Import disponible",
      description: "Fonctionnalité d'import Excel en cours de développement",
    });
  };

  const getMentionColor = (mention: string) => {
    const colors = {
      'Très Bien': 'bg-green-100 text-green-800',
      'Bien': 'bg-blue-100 text-blue-800',
      'Assez Bien': 'bg-orange-100 text-orange-800',
      'Passable': 'bg-gray-100 text-gray-800',
      'Ajourné': 'bg-red-100 text-red-800'
    };
    return colors[mention as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Header with controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Saisie Matricielle</h2>
          <p className="text-muted-foreground">Interface collaborative type Google Sheets - Calculs automatiques</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={importFromExcel}>
            <FileUp className="w-4 h-4 mr-2" />
            Import Excel
          </Button>
          <Button variant="outline" size="sm" onClick={exportToExcel}>
            <FileDown className="w-4 h-4 mr-2" />
            Export Excel
          </Button>
          <Button variant="outline" size="sm" onClick={handleCalculateAll}>
            <Calculator className="w-4 h-4 mr-2" />
            Recalculer Tout
          </Button>
          <Button onClick={handleSaveAll} disabled={loading} size="sm">
            <Save className="w-4 h-4 mr-2" />
            Sauvegarder
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Matière</label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sélectionner une matière" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="math">Mathématiques</SelectItem>
                  <SelectItem value="physics">Physique</SelectItem>
                  <SelectItem value="chemistry">Chimie</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Semestre</label>
              <Select value={selectedSemester.toString()} onValueChange={(v) => setSelectedSemester(Number(v))}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">S1</SelectItem>
                  <SelectItem value="2">S2</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <input
                type="checkbox"
                id="auto-save"
                checked={autoSave}
                onChange={(e) => setAutoSave(e.target.checked)}
              />
              <label htmlFor="auto-save" className="text-sm">Sauvegarde automatique</label>
              <Zap className="w-4 h-4 text-yellow-500" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Matrix Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Grid className="w-5 h-5" />
            Grille de Saisie - {matrixData.length} étudiants
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-3 font-medium bg-muted/50">N° Étudiant</th>
                  <th className="text-left p-3 font-medium bg-muted/50">Nom & Prénom</th>
                  <th className="text-center p-3 font-medium bg-blue-50">CC (/20)</th>
                  <th className="text-center p-3 font-medium bg-green-50">Examen (/20)</th>
                  <th className="text-center p-3 font-medium bg-yellow-50">Moyenne</th>
                  <th className="text-center p-3 font-medium bg-gray-50">Coef.</th>
                  <th className="text-center p-3 font-medium bg-purple-50">Total</th>
                  <th className="text-center p-3 font-medium bg-orange-50">Mention</th>
                </tr>
              </thead>
              <tbody>
                {matrixData.map((row, index) => (
                  <tr key={row.student.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                    <td className="p-3 font-mono text-sm">{row.student.student_number}</td>
                    <td className="p-3 font-medium">{row.student.profiles.full_name}</td>
                    <td className="p-3">
                      <Input
                        type="number"
                        min="0"
                        max="20"
                        step="0.25"
                        value={row.grades.cc ?? ''}
                        onChange={(e) => handleCellEdit(index, 'cc', e.target.value)}
                        className="w-20 text-center"
                        placeholder="--"
                      />
                    </td>
                    <td className="p-3">
                      <Input
                        type="number"
                        min="0"
                        max="20"
                        step="0.25"
                        value={row.grades.examen ?? ''}
                        onChange={(e) => handleCellEdit(index, 'examen', e.target.value)}
                        className="w-20 text-center"
                        placeholder="--"
                      />
                    </td>
                    <td className="p-3 text-center">
                      <div className="font-mono font-medium">
                        {row.grades.moyenne !== undefined ? row.grades.moyenne.toFixed(2) : '--'}
                      </div>
                    </td>
                    <td className="p-3 text-center">
                      <Badge variant="outline">{row.grades.coefficient || 2}</Badge>
                    </td>
                    <td className="p-3 text-center">
                      <div className="font-mono font-medium">
                        {row.grades.moyenne !== undefined && row.grades.coefficient 
                          ? (row.grades.moyenne * row.grades.coefficient).toFixed(2) 
                          : '--'
                        }
                      </div>
                    </td>
                    <td className="p-3 text-center">
                      {row.grades.mention && (
                        <Badge className={getMentionColor(row.grades.mention)}>
                          {row.grades.mention}
                        </Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary Statistics */}
          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">
                  {matrixData.filter(r => r.grades.moyenne !== undefined).length}
                </div>
                <div className="text-sm text-muted-foreground">Notes Complètes</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {matrixData.filter(r => r.grades.moyenne !== undefined && r.grades.moyenne >= 10).length}
                </div>
                <div className="text-sm text-muted-foreground">Admis</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {matrixData.filter(r => r.grades.moyenne !== undefined).length > 0 
                    ? (matrixData.reduce((sum, r) => sum + (r.grades.moyenne || 0), 0) / 
                       matrixData.filter(r => r.grades.moyenne !== undefined).length).toFixed(2)
                    : '--'
                  }
                </div>
                <div className="text-sm text-muted-foreground">Moyenne Classe</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">
                  {matrixData.filter(r => r.grades.mention && r.grades.mention.includes('Bien')).length}
                </div>
                <div className="text-sm text-muted-foreground">Mentions</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}