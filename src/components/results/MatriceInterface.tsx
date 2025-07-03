import { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  Save, 
  Users, 
  Lock, 
  Unlock, 
  Eye, 
  EyeOff, 
  Download,
  Upload,
  Grid,
  Sparkles,
  Calculator,
  CheckCircle
} from 'lucide-react';
import { useStudentGrades } from '@/hooks/useStudentGrades';
import { useEvaluationTypes } from '@/hooks/useEvaluationTypes';
import { useGradeCalculations } from '@/hooks/useGradeCalculations';

interface MatriceCell {
  studentId: string;
  evaluationTypeId: string;
  grade?: number;
  maxGrade: number;
  isLocked: boolean;
  editedBy?: string;
  lastModified?: string;
}

interface MatriceStudent {
  id: string;
  studentNumber: string;
  fullName: string;
  average?: number;
}

interface MatriceProps {
  subjectId: string;
  academicYearId: string;
  semester: number;
  programId?: string;
}

export function MatriceInterface({ subjectId, academicYearId, semester, programId }: MatriceProps) {
  const [students, setStudents] = useState<MatriceStudent[]>([]);
  const [matrixData, setMatrixData] = useState<Map<string, MatriceCell>>(new Map());
  const [lockedCells, setLockedCells] = useState<Set<string>>(new Set());
  const [activeUsers, setActiveUsers] = useState<string[]>(['Vous']);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [showAverages, setShowAverages] = useState(true);
  const [selectedEvaluationType, setSelectedEvaluationType] = useState<string>('all');
  const autoSaveTimer = useRef<NodeJS.Timeout>();
  
  const { toast } = useToast();
  const { getMatriceGrades, saveGradesBatch } = useStudentGrades();
  const { evaluationTypes } = useEvaluationTypes();
  const { calculateStudentAverages } = useGradeCalculations();

  // Generate cell key
  const getCellKey = (studentId: string, evaluationTypeId: string) => 
    `${studentId}-${evaluationTypeId}`;

  // Load matrix data
  const loadMatrixData = useCallback(async () => {
    try {
      const data = await getMatriceGrades(subjectId, academicYearId, semester, programId);
      
      // Process data into matrix format
      const newMatrixData = new Map<string, MatriceCell>();
      const studentsMap = new Map<string, MatriceStudent>();

      data.forEach((studentData: any) => {
        const student = studentData.student;
        const grades = studentData.grades || [];
        
        // Add student - handle both nested and direct profiles access
        if (!studentsMap.has(student.id)) {
          const profileName = student.profiles?.full_name || 
                             (Array.isArray(student.profiles) ? student.profiles[0]?.full_name : null) ||
                             'N/A';
          studentsMap.set(student.id, {
            id: student.id,
            studentNumber: student.student_number,
            fullName: profileName
          });
        }

        // Add grade cells for this student
        grades.forEach((grade: any) => {
          const cellKey = getCellKey(student.id, grade.evaluation_type_id);
          newMatrixData.set(cellKey, {
            studentId: student.id,
            evaluationTypeId: grade.evaluation_type_id,
            grade: grade.grade,
            maxGrade: grade.max_grade || 20,
            isLocked: grade.is_published || false,
            lastModified: grade.updated_at
          });
        });
      });

      setStudents(Array.from(studentsMap.values()));
      setMatrixData(newMatrixData);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les données de la matrice",
        variant: "destructive",
      });
    }
  }, [subjectId, academicYearId, semester, programId, getMatriceGrades, toast]);

  // Update cell value
  const updateCell = useCallback((studentId: string, evaluationTypeId: string, value: string) => {
    const cellKey = getCellKey(studentId, evaluationTypeId);
    const currentCell = matrixData.get(cellKey);
    
    if (currentCell?.isLocked) {
      toast({
        title: "Cellule verrouillée",
        description: "Cette note a été publiée et ne peut plus être modifiée",
        variant: "destructive",
      });
      return;
    }

    const grade = value ? parseFloat(value) : undefined;
    
    setMatrixData(prev => {
      const newData = new Map(prev);
      newData.set(cellKey, {
        ...currentCell,
        studentId,
        evaluationTypeId,
        grade,
        maxGrade: currentCell?.maxGrade || 20,
        isLocked: false,
        editedBy: 'Vous',
        lastModified: new Date().toISOString()
      });
      return newData;
    });

    // Auto-save after delay
    if (autoSaveEnabled) {
      if (autoSaveTimer.current) {
        clearTimeout(autoSaveTimer.current);
      }
      autoSaveTimer.current = setTimeout(() => {
        saveMatrix();
      }, 2000);
    }
  }, [matrixData, autoSaveEnabled, toast]);

  // Save matrix data
  const saveMatrix = useCallback(async () => {
    try {
      const gradesToSave = Array.from(matrixData.values())
        .filter(cell => cell.grade !== undefined && !cell.isLocked)
        .map(cell => ({
          student_id: cell.studentId,
          subject_id: subjectId,
          evaluation_type_id: cell.evaluationTypeId,
          grade: cell.grade!,
          max_grade: cell.maxGrade,
          evaluation_date: new Date().toISOString().split('T')[0],
          semester,
          academic_year_id: academicYearId
        }));

      if (gradesToSave.length > 0) {
        await saveGradesBatch(gradesToSave);
        
        // Recalculate averages
        if (showAverages) {
          await updateAverages();
        }
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Échec de la sauvegarde",
        variant: "destructive",
      });
    }
  }, [matrixData, subjectId, academicYearId, semester, saveGradesBatch, showAverages, toast]);

  // Update student averages
  const updateAverages = useCallback(async () => {
    try {
      const updatedStudents = await Promise.all(
        students.map(async (student) => {
          const averages = await calculateStudentAverages(
            student.id,
            academicYearId,
            semester
          );
          return {
            ...student,
            average: averages?.overall_average
          };
        })
      );
      setStudents(updatedStudents);
    } catch (error) {
      console.error('Error calculating averages:', error);
    }
  }, [students, calculateStudentAverages, academicYearId, semester]);

  // Lock/unlock cell
  const toggleCellLock = useCallback((studentId: string, evaluationTypeId: string) => {
    const cellKey = getCellKey(studentId, evaluationTypeId);
    setLockedCells(prev => {
      const newSet = new Set(prev);
      if (newSet.has(cellKey)) {
        newSet.delete(cellKey);
      } else {
        newSet.add(cellKey);
      }
      return newSet;
    });
  }, []);

  // Initialize data
  useEffect(() => {
    loadMatrixData();
  }, [loadMatrixData]);

  // Cleanup auto-save timer
  useEffect(() => {
    return () => {
      if (autoSaveTimer.current) {
        clearTimeout(autoSaveTimer.current);
      }
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <CardTitle>Interface Matricielle Collaborative</CardTitle>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {activeUsers.length} utilisateur(s)
              </Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAverages(!showAverages)}
              >
                <Calculator className="w-4 h-4 mr-1" />
                {showAverages ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                Moyennes
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAutoSaveEnabled(!autoSaveEnabled)}
              >
                {autoSaveEnabled ? <Save className="w-4 h-4 text-green-600" /> : <Save className="w-4 h-4" />}
                Auto-save {autoSaveEnabled ? 'ON' : 'OFF'}
              </Button>
              
              <Button onClick={saveMatrix} className="bg-primary">
                <Save className="w-4 h-4 mr-1" />
                Sauvegarder
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="flex gap-4">
            <Select value={selectedEvaluationType} onValueChange={setSelectedEvaluationType}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Filtrer par type d'évaluation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                {evaluationTypes.map(type => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name} ({type.weight_percentage}%)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-green-200 rounded" />
                Sauvegardé
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-orange-200 rounded" />
                En cours d'édition
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-red-200 rounded" />
                Publié/Verrouillé
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Matrix Grid */}
      <Card>
        <CardContent className="p-0">
          {students.length === 0 ? (
            <div className="p-12 text-center">
              <Grid className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Aucun étudiant trouvé</h3>
              <p className="text-muted-foreground">
                Aucun étudiant n'est inscrit pour cette matière ou ce programme. 
                Vérifiez vos paramètres de sélection.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="p-3 text-left font-medium sticky left-0 bg-muted/50 min-w-[200px]">
                      Étudiant
                    </th>
                    {evaluationTypes
                      .filter(type => selectedEvaluationType === 'all' || type.id === selectedEvaluationType)
                      .map(evalType => (
                      <th key={evalType.id} className="p-3 text-center font-medium min-w-[120px]">
                        <div>
                          <div className="font-semibold">{evalType.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {evalType.weight_percentage}%
                          </div>
                        </div>
                      </th>
                    ))}
                    {showAverages && (
                      <th className="p-3 text-center font-medium bg-primary/10 min-w-[100px]">
                        Moyenne
                      </th>
                    )}
                  </tr>
                </thead>
                
                <tbody>
                  {students.map((student, index) => (
                    <tr key={student.id} className={index % 2 === 0 ? 'bg-muted/20' : ''}>
                      <td className="p-3 sticky left-0 bg-background font-medium">
                        <div>
                          <div className="font-semibold">{student.fullName}</div>
                          <div className="text-sm text-muted-foreground">
                            {student.studentNumber}
                          </div>
                        </div>
                      </td>
                      
                      {evaluationTypes
                        .filter(type => selectedEvaluationType === 'all' || type.id === selectedEvaluationType)
                        .map(evalType => {
                          const cellKey = getCellKey(student.id, evalType.id);
                          const cell = matrixData.get(cellKey);
                          const isLocked = cell?.isLocked || lockedCells.has(cellKey);
                          
                          return (
                            <td key={evalType.id} className="p-2">
                              <div className="relative">
                                <Input
                                  type="number"
                                  min="0"
                                  max={cell?.maxGrade || 20}
                                  step="0.25"
                                  value={cell?.grade || ''}
                                  onChange={(e) => updateCell(student.id, evalType.id, e.target.value)}
                                  disabled={isLocked}
                                  className={`text-center ${
                                    isLocked 
                                      ? 'bg-red-100 border-red-200' 
                                      : cell?.grade !== undefined 
                                        ? 'bg-green-50 border-green-200' 
                                        : 'bg-orange-50 border-orange-200'
                                  }`}
                                  placeholder="--"
                                />
                                
                                {cell?.editedBy && cell.editedBy !== 'Vous' && (
                                  <div className="absolute -top-2 -right-2 w-3 h-3 bg-blue-500 rounded-full" 
                                       title={`Édité par ${cell.editedBy}`} />
                                )}
                                
                                <button
                                  onClick={() => toggleCellLock(student.id, evalType.id)}
                                  className="absolute top-0 right-0 p-1 opacity-0 hover:opacity-100 transition-opacity"
                                >
                                  {isLocked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                                </button>
                              </div>
                            </td>
                          );
                        })}
                      
                      {showAverages && (
                        <td className="p-3 text-center bg-primary/5">
                          <div className="font-semibold text-lg">
                            {student.average 
                              ? `${student.average.toFixed(2)}/20`
                              : '--'
                            }
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle className="w-4 h-4 text-green-600" />
              {Array.from(matrixData.values()).filter(cell => !cell.isLocked && cell.grade !== undefined).length} notes en attente de sauvegarde
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Upload className="w-4 h-4 mr-1" />
                Importer Excel
              </Button>
              
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-1" />
                Exporter
              </Button>
              
              <Button size="sm" onClick={updateAverages}>
                <Calculator className="w-4 h-4 mr-1" />
                Recalculer Moyennes
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}