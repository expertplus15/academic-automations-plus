import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { useStudentGrades } from '@/hooks/useStudentGrades';
import { usePrograms } from '@/hooks/usePrograms';
import { useSubjects } from '@/hooks/useSubjects';
import { useAcademicYears } from '@/hooks/useAcademicYears';
import { useStudents } from '@/hooks/useStudents';
import { useEvaluationTypes } from '@/hooks/useEvaluationTypes';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Save, Users, RefreshCw, Download, Upload, Edit3, Lock, Unlock, MessageSquare, History, Share, Brain, Zap } from 'lucide-react';
import { CRDTService } from '@/services/CRDTService';
import { CollaborativeChat } from './CollaborativeChat';
import { MultipleCursors } from './MultipleCursors';
import { AIInsightsDashboard } from './AIInsightsDashboard';
interface GradeCell {
  id: string;
  studentId: string;
  evaluationId: string;
  grade: number | null;
  maxGrade: number;
  isEditing: boolean;
  lastModified: Date;
  modifiedBy: string;
  comment?: string;
  isLocked: boolean;
}
interface CollaborativeUser {
  id: string;
  name: string;
  color: string;
  isOnline: boolean;
  currentCell?: string;
}
interface MatriceInterfaceProps {
  isNewSession?: boolean;
}
export function MatriceInterface({
  isNewSession = false
}: MatriceInterfaceProps) {
  const [selectedProgram, setSelectedProgram] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedSemester, setSemester] = useState<number>(1);
  const [matrixData, setMatrixData] = useState<GradeCell[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [evaluations, setEvaluations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [connectedUsers, setConnectedUsers] = useState<CollaborativeUser[]>([]);
  const [selectedCell, setSelectedCell] = useState<string | null>(null);
  const [editingCell, setEditingCell] = useState<string | null>(null);
  const [pendingChanges, setPendingChanges] = useState<Map<string, any>>(new Map());
  const [showComments, setShowComments] = useState(false);
  const [autoSave, setAutoSave] = useState(true);
  const [viewHistory, setViewHistory] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showAIInsights, setShowAIInsights] = useState(false);
  const [crdtInitialized, setCrdtInitialized] = useState(false);
  const matrixRef = useRef<HTMLDivElement>(null);
  const {
    toast
  } = useToast();
  const {
    getMatriceGrades,
    saveGradesBatch
  } = useStudentGrades();
  const {
    programs
  } = usePrograms();
  const {
    subjects
  } = useSubjects();
  const {
    academicYears
  } = useAcademicYears();
  const {
    students: allStudents,
    loading: studentsLoading
  } = useStudents();
  const {
    evaluationTypes,
    loading: evalTypesLoading
  } = useEvaluationTypes();
  const currentAcademicYear = academicYears.find(year => year.is_current);

  // Initialize CRDT for collaborative editing
  useEffect(() => {
    if (selectedSubject && !crdtInitialized) {
      const initCRDT = async () => {
        try {
          const user = (await supabase.auth.getUser()).data.user;
          if (user) {
            await CRDTService.initializeSession(selectedSubject, user.id, user.email || 'Anonymous');
            setCrdtInitialized(true);
          }
        } catch (error) {
          console.error('Failed to initialize CRDT:', error);
        }
      };
      initCRDT();
    }
    return () => {
      if (crdtInitialized) {
        CRDTService.cleanup();
        setCrdtInitialized(false);
      }
    };
  }, [selectedSubject, crdtInitialized]);

  // Listen for CRDT operations
  useEffect(() => {
    const handleCRDTOperation = (event: CustomEvent) => {
      const operation = event.detail;
      if (operation.type === 'update' && operation.cellId) {
        setMatrixData(prev => prev.map(cell => cell.id === operation.cellId ? {
          ...cell,
          grade: operation.value,
          lastModified: new Date()
        } : cell));
      }
    };
    window.addEventListener('crdt-operation', handleCRDTOperation as EventListener);
    return () => {
      window.removeEventListener('crdt-operation', handleCRDTOperation as EventListener);
    };
  }, []);

  // Effet pour nouvelle session
  useEffect(() => {
    if (isNewSession) {
      toast({
        title: "Nouvelle session collaborative",
        description: "Session matricielle démarrée avec succès"
      });
      // Reset des données pour nouvelle session
      setMatrixData([]);
      setPendingChanges(new Map());
      setSelectedCell(null);
    }
  }, [isNewSession, toast]);

  // Collaboration temps réel
  useEffect(() => {
    if (!selectedSubject) return;
    const channel = supabase.channel(`matrix_${selectedSubject}`).on('presence', {
      event: 'sync'
    }, () => {
      const presences = channel.presenceState();
      const users: CollaborativeUser[] = [];
      setConnectedUsers(users);
    }).on('presence', {
      event: 'join'
    }, ({
      newPresences
    }) => {
      console.log('User joined:', newPresences);
    }).on('presence', {
      event: 'leave'
    }, ({
      leftPresences
    }) => {
      console.log('User left:', leftPresences);
    }).on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'student_grades',
      filter: `subject_id=eq.${selectedSubject}`
    }, payload => {
      handleRealTimeUpdate(payload);
    }).subscribe(async status => {
      if (status === 'SUBSCRIBED') {
        await channel.track({
          id: Math.random().toString(),
          name: 'Utilisateur',
          color: '#3b82f6',
          isOnline: true,
          currentCell: selectedCell
        });
      }
    });
    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedSubject, selectedCell]);
  const handleRealTimeUpdate = useCallback((payload: any) => {
    // Mise à jour en temps réel des modifications d'autres utilisateurs
    const {
      eventType,
      new: newRecord,
      old: oldRecord
    } = payload;
    if (eventType === 'UPDATE') {
      setMatrixData(prev => prev.map(cell => cell.id === newRecord.id ? {
        ...cell,
        grade: newRecord.grade,
        lastModified: new Date(newRecord.updated_at)
      } : cell));
      toast({
        title: "Mise à jour collaborative",
        description: "Une note a été modifiée par un autre utilisateur"
      });
    }
  }, [toast]);
  const loadMatrixData = async () => {
    if (!selectedSubject || !currentAcademicYear?.id) {
      setMatrixData([]);
      setStudents([]);
      setEvaluations([]);
      return;
    }
    setIsLoading(true);
    try {
      // Filtrer les étudiants par programme si sélectionné
      let filteredStudents = allStudents;
      if (selectedProgram && selectedProgram !== 'all') {
        filteredStudents = allStudents.filter(student => student.program_id === selectedProgram);
      }

      // Filtrer les types d'évaluation actifs
      const activeEvaluationTypes = evaluationTypes.filter(et => et.is_active);

      // Charger les notes existantes pour cette matière
      const gradesData = await getMatriceGrades(selectedSubject, currentAcademicYear.id, selectedSemester, selectedProgram !== 'all' ? selectedProgram : undefined);
      setStudents(filteredStudents);
      setEvaluations(activeEvaluationTypes);

      // Créer la matrice de cellules
      const matrix: GradeCell[] = [];
      for (const student of filteredStudents) {
        for (const evaluation of activeEvaluationTypes) {
          const existingGrade = gradesData.find((g: any) => g.student_id === student.id && g.evaluation_type_id === evaluation.id);
          matrix.push({
            id: `${student.id}_${evaluation.id}`,
            studentId: student.id,
            evaluationId: evaluation.id,
            grade: existingGrade?.grade || null,
            maxGrade: existingGrade?.max_grade || 20,
            isEditing: false,
            lastModified: existingGrade?.updated_at ? new Date(existingGrade.updated_at) : new Date(),
            modifiedBy: existingGrade?.modified_by || '',
            comment: existingGrade?.comment,
            isLocked: existingGrade?.is_published || false
          });
        }
      }
      setMatrixData(matrix);
    } catch (error) {
      console.error('Error loading matrix data:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données de la matrice",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handleCellEdit = async (cellId: string, value: string) => {
    const numValue = parseFloat(value);
    const cell = matrixData.find(c => c.id === cellId);
    if (!cell || cell.isLocked) return;

    // Validation  
    if (isNaN(numValue) || numValue < 0 || numValue > cell.maxGrade) {
      toast({
        title: "Valeur invalide",
        description: `La note doit être entre 0 et ${cell.maxGrade}`,
        variant: "destructive"
      });
      return;
    }

    // Apply CRDT operation for collaborative editing
    if (crdtInitialized) {
      try {
        await CRDTService.applyOperation({
          type: 'update',
          cellId,
          value: numValue,
          position: 0,
          userId: (await supabase.auth.getUser()).data.user?.id || 'anonymous'
        });
      } catch (error) {
        console.error('CRDT operation failed:', error);
      }
    }

    // Mise à jour optimiste
    setMatrixData(prev => prev.map(c => c.id === cellId ? {
      ...c,
      grade: numValue,
      lastModified: new Date()
    } : c));

    // Ajouter aux changements en attente
    setPendingChanges(prev => new Map(prev.set(cellId, {
      grade: numValue,
      timestamp: Date.now()
    })));

    // Auto-sauvegarde
    if (autoSave) {
      setTimeout(() => {
        console.log('Auto-saving...', cellId);
      }, 1000);
    }
  };
  const saveChanges = async (cellIds?: string[]) => {
    const toSave = cellIds || Array.from(pendingChanges.keys());
    const batch = [];
    for (const cellId of toSave) {
      const cell = matrixData.find(c => c.id === cellId);
      const change = pendingChanges.get(cellId);
      if (cell && change) {
        batch.push({
          student_id: cell.studentId,
          evaluation_type_id: cell.evaluationId,
          subject_id: selectedSubject,
          academic_year_id: currentAcademicYear?.id,
          semester: selectedSemester,
          grade: change.grade,
          max_grade: cell.maxGrade,
          is_published: false
        });
      }
    }
    try {
      await saveGradesBatch(batch);

      // Nettoyer les changements sauvegardés
      const newPending = new Map(pendingChanges);
      toSave.forEach(id => newPending.delete(id));
      setPendingChanges(newPending);
      toast({
        title: "Sauvegarde réussie",
        description: `${batch.length} note(s) sauvegardée(s)`
      });
    } catch (error) {
      toast({
        title: "Erreur de sauvegarde",
        description: "Impossible de sauvegarder les modifications",
        variant: "destructive"
      });
    }
  };
  const renderGradeCell = useCallback((cell: GradeCell, student: any, evaluation: any) => {
    const isSelected = selectedCell === cell.id;
    const isEditing = editingCell === cell.id;
    const hasPendingChange = pendingChanges.has(cell.id);
    return <div key={cell.id} data-cell-id={cell.id} className={`
          relative bg-background min-h-[56px] flex items-center justify-center p-2
          cursor-pointer transition-all duration-200 group
          ${isSelected ? 'ring-2 ring-primary bg-primary/10' : ''}
          ${hasPendingChange ? 'bg-amber-50/80 border-amber-400' : ''}
          ${cell.isLocked ? 'bg-muted/50 cursor-not-allowed opacity-75' : 'hover:bg-primary/5 hover:shadow-sm'}
        `} onClick={async () => {
      if (!cell.isLocked) {
        setSelectedCell(cell.id);
        if (crdtInitialized) {
          await CRDTService.updateCursor(cell.id, 0);
        }
      }
    }} onDoubleClick={() => !cell.isLocked && setEditingCell(cell.id)}>
        {isEditing ? <Input type="number" value={cell.grade || ''} onChange={e => handleCellEdit(cell.id, e.target.value)} onBlur={() => setEditingCell(null)} onKeyDown={e => {
        if (e.key === 'Enter') setEditingCell(null);
        if (e.key === 'Escape') setEditingCell(null);
      }} className="w-full h-8 text-center border-0 bg-transparent" autoFocus /> : <div className="flex flex-col items-center justify-center w-full">
            <span className={`text-sm font-medium ${cell.grade === null ? 'text-muted-foreground' : cell.grade >= cell.maxGrade * 0.8 ? 'text-emerald-600' : cell.grade >= cell.maxGrade * 0.5 ? 'text-amber-600' : 'text-red-600'}`}>
              {cell.grade?.toFixed(1) || '-'}
            </span>
            {cell.grade !== null && <div className="w-full bg-muted/30 h-1 rounded-full mt-1 overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-300 ${cell.grade >= cell.maxGrade * 0.8 ? 'bg-emerald-500' : cell.grade >= cell.maxGrade * 0.5 ? 'bg-amber-500' : 'bg-red-500'}`} style={{
            width: `${cell.grade / cell.maxGrade * 100}%`
          }} />
              </div>}
          </div>}
        
        {cell.isLocked && <Lock className="absolute top-1 right-1 w-3 h-3 text-muted-foreground" />}
        
        {cell.comment && <MessageSquare className="absolute bottom-1 right-1 w-3 h-3 text-primary" />}
        
        {hasPendingChange && <div className="absolute top-1 left-1 w-2 h-2 bg-amber-500 rounded-full" />}
      </div>;
  }, [selectedCell, editingCell, pendingChanges, handleCellEdit]);
  const exportToCSV = useCallback(() => {
    const headers = ['Étudiant', ...evaluations.map(e => e.name)];
    const rows = students.map(student => {
      const row = [student.name || 'N/A'];
      evaluations.forEach(evaluation => {
        const cell = matrixData.find(c => c.studentId === student.id && c.evaluationId === evaluation.id);
        row.push(cell?.grade?.toString() || '');
      });
      return row;
    });
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], {
      type: 'text/csv'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `matrice_notes_${selectedSubject}_${Date.now()}.csv`;
    a.click();
  }, [students, evaluations, matrixData, selectedSubject]);
  useEffect(() => {
    loadMatrixData();
  }, [selectedSubject, selectedProgram, selectedSemester]);
  return <div className="space-y-6">
      {/* Header unique optimisé */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              
              <div>
                
                
              </div>
            </div>
            
            {/* Status badges consolidés */}
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {connectedUsers.length} connecté{connectedUsers.length > 1 ? 's' : ''}
              </Badge>
              {pendingChanges.size > 0 && <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                  {pendingChanges.size} modification{pendingChanges.size > 1 ? 's' : ''} en attente
                </Badge>}
            </div>
          </div>
          
          {/* Toolbar unifié */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <div className="flex items-center gap-3">
              {/* Action principale */}
              <Button size="sm" onClick={() => saveChanges()} disabled={pendingChanges.size === 0} className="bg-primary hover:bg-primary/90">
                <Save className="w-4 h-4 mr-2" />
                Sauvegarder ({pendingChanges.size})
              </Button>
              
              {/* Actions secondaires */}
              <div className="flex items-center gap-1 border-l pl-3">
                <Button variant="outline" size="sm" title="Importer">
                  <Download className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={exportToCSV} title="Exporter CSV">
                  <Upload className="w-4 h-4" />
                </Button>
              </div>
              
              {/* Outils collaboratifs */}
              <div className="flex items-center gap-1 border-l pl-3">
                <Button variant={showChat ? "default" : "outline"} size="sm" onClick={() => setShowChat(!showChat)} title="Chat collaboratif">
                  <MessageSquare className="w-4 h-4" />
                </Button>
                <Button variant={showAIInsights ? "default" : "outline"} size="sm" onClick={() => setShowAIInsights(!showAIInsights)} title="Insights IA">
                  <Brain className="w-4 h-4" />
                </Button>
                <Button variant={viewHistory ? "default" : "outline"} size="sm" onClick={() => setViewHistory(!viewHistory)} title="Historique">
                  <History className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            {/* Auto-save indicator */}
            <Button variant="ghost" size="sm" onClick={() => setAutoSave(!autoSave)} className="text-xs" title={`Auto-save ${autoSave ? 'activé' : 'désactivé'}`}>
              <Zap className={`w-3 h-3 mr-1 ${autoSave ? 'text-emerald-500' : 'text-muted-foreground'}`} />
              Auto-save: {autoSave ? 'ON' : 'OFF'}
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Filtres optimisés */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Programme</label>
              <Select value={selectedProgram} onValueChange={setSelectedProgram}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Tous les programmes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les programmes</SelectItem>
                  {programs.map(program => <SelectItem key={program.id} value={program.id}>
                      {program.name}
                    </SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Matière</label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Sélectionner une matière" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map(subject => <SelectItem key={subject.id} value={subject.id}>
                      {subject.name}
                    </SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Semestre</label>
              <Select value={selectedSemester.toString()} onValueChange={value => setSemester(parseInt(value))}>
                <SelectTrigger className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Semestre 1</SelectItem>
                  <SelectItem value="2">Semestre 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Actualisation</label>
              <Button variant="outline" className="w-full h-10 hover:bg-primary hover:text-primary-foreground transition-colors" onClick={loadMatrixData} disabled={isLoading}>
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                {isLoading ? 'Chargement...' : 'Actualiser'}
              </Button>
            </div>
          </div>

          {/* Utilisateurs connectés */}
          {connectedUsers.length > 1 && <div className="flex items-center gap-2 mt-4 p-3 bg-muted/30 rounded-lg border">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Utilisateurs connectés:</span>
              {connectedUsers.map(user => <Badge key={user.id} variant="outline" className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full" style={{
              backgroundColor: user.color
            }} />
                  {user.name}
                  {user.isOnline && <div className="w-2 h-2 bg-green-500 rounded-full" />}
                </Badge>)}
            </div>}
        </CardContent>
      </Card>

      {/* AI Insights Dashboard */}
      {showAIInsights && <AIInsightsDashboard subjectId={selectedSubject} programId={selectedProgram} />}

      {/* Matrice principale */}
      {students.length > 0 && evaluations.length > 0 && <Card>
          <CardContent className="p-0">
            <div className="relative rounded-lg overflow-hidden bg-background">
              <div ref={matrixRef} className="grid auto-rows-min overflow-auto max-h-[70vh]" style={{
            gridTemplateColumns: `240px repeat(${evaluations.length}, minmax(120px, 1fr))`,
            minWidth: `${240 + evaluations.length * 120}px`
          }}>
                {/* En-tête de la matrice */}
                <div className="bg-muted border-r border-b border-border p-4 font-semibold text-sm sticky left-0 top-0 z-20 flex items-center">
                  <Users className="w-4 h-4 mr-2 text-muted-foreground" />
                  Étudiant
                </div>
                {evaluations.map((evaluation, index) => <div key={evaluation.id} className={`bg-muted border-r border-b border-border p-4 text-center font-semibold text-sm sticky top-0 z-10 min-w-[120px] ${index === evaluations.length - 1 ? 'border-r-0' : ''}`}>
                    <div className="truncate font-medium" title={evaluation.name}>
                      {evaluation.name}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 flex items-center justify-center gap-1">
                      <span>Max:</span>
                      <Badge variant="outline" className="text-xs px-1 py-0">
                        {evaluation.max_points || 20}
                      </Badge>
                    </div>
                  </div>)}
                
                {/* Lignes d'étudiants */}
                {students.map((student, studentIndex) => <React.Fragment key={student.id}>
                    <div className={`bg-background border-r border-b border-border p-4 font-medium text-sm sticky left-0 z-10 flex items-center min-h-[56px] ${studentIndex % 2 === 0 ? 'bg-muted/20' : ''}`}>
                      <div className="flex items-center gap-2 w-full">
                        <div className="w-2 h-2 rounded-full bg-primary/20"></div>
                        <div className="truncate flex-1" title={student.profile?.full_name || student.student_number}>
                          <div className="font-medium">
                            {student.profile?.full_name || 'N/A'}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {student.student_number}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {evaluations.map((evaluation, evalIndex) => {
                const cell = matrixData.find(c => c.studentId === student.id && c.evaluationId === evaluation.id);
                return cell ? <div key={cell.id} className={`border-r border-b border-border min-h-[56px] ${studentIndex % 2 === 0 ? 'bg-muted/10' : ''} ${evalIndex === evaluations.length - 1 ? 'border-r-0' : ''}`}>
                          {renderGradeCell(cell, student, evaluation)}
                        </div> : <div key={`${student.id}_${evaluation.id}`} className={`border-r border-b border-border min-h-[56px] ${studentIndex % 2 === 0 ? 'bg-muted/10' : ''} ${evalIndex === evaluations.length - 1 ? 'border-r-0' : ''}`} />;
              })}
                  </React.Fragment>)}
              </div>
              
              {crdtInitialized && <MultipleCursors containerRef={matrixRef} />}
            </div>
          </CardContent>
        </Card>}

      {/* Instructions compactes */}
      {students.length > 0 && evaluations.length > 0 && <div className="p-3 bg-muted/30 rounded-lg border-l-4 border-l-primary">
          <div className="text-xs text-muted-foreground">
            💡 <kbd className="px-1 py-0.5 text-xs bg-background border rounded">Double-clic</kbd> pour éditer • <span className="inline-block w-2 h-2 bg-amber-500 rounded-full mr-1"></span>Modifications en attente • <Lock className="inline w-3 h-3 mr-1" />Cellules verrouillées
          </div>
        </div>}

      {matrixData.length === 0 && !isLoading && selectedSubject && <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">
              Aucune donnée trouvée pour cette sélection.
            </p>
          </CardContent>
        </Card>}

      {!selectedSubject && <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">
              Sélectionnez une matière pour commencer la saisie matricielle collaborative.
            </p>
          </CardContent>
        </Card>}
    </div>;
}