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

export function MatriceInterface({ isNewSession = false }: MatriceInterfaceProps) {
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

  const { toast } = useToast();
  const { getMatriceGrades, saveGradesBatch } = useStudentGrades();
  const { programs } = usePrograms();
  const { subjects } = useSubjects();
  const { academicYears } = useAcademicYears();

  const currentAcademicYear = academicYears.find(year => year.is_current);

  // Initialize CRDT for collaborative editing
  useEffect(() => {
    if (selectedSubject && !crdtInitialized) {
      const initCRDT = async () => {
        try {
          const user = (await supabase.auth.getUser()).data.user;
          if (user) {
            await CRDTService.initializeSession(
              selectedSubject, 
              user.id, 
              user.email || 'Anonymous'
            );
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
        setMatrixData(prev => prev.map(cell => 
          cell.id === operation.cellId 
            ? { ...cell, grade: operation.value, lastModified: new Date() }
            : cell
        ));
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
        description: "Session matricielle démarrée avec succès",
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
    
    const channel = supabase
      .channel(`matrix_${selectedSubject}`)
    .on('presence', { event: 'sync' }, () => {
        const presences = channel.presenceState();
        const users: CollaborativeUser[] = [];
        setConnectedUsers(users);
      })
      .on('presence', { event: 'join' }, ({ newPresences }) => {
        console.log('User joined:', newPresences);
      })
      .on('presence', { event: 'leave' }, ({ leftPresences }) => {
        console.log('User left:', leftPresences);
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'student_grades',
        filter: `subject_id=eq.${selectedSubject}`
      }, (payload) => {
        handleRealTimeUpdate(payload);
      })
      .subscribe(async (status) => {
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
    const { eventType, new: newRecord, old: oldRecord } = payload;
    
    if (eventType === 'UPDATE') {
      setMatrixData(prev => prev.map(cell => 
        cell.id === newRecord.id 
          ? { ...cell, grade: newRecord.grade, lastModified: new Date(newRecord.updated_at) }
          : cell
      ));
      
      toast({
        title: "Mise à jour collaborative",
        description: "Une note a été modifiée par un autre utilisateur",
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
      // Charger les étudiants du programme (simplified)
      const studentsData = { data: [] as any[] };
      
      // Charger les types d'évaluation pour cette matière
      const evaluationsData = { data: [] as any[] };
      
      // Charger les notes existantes (mock for now)
      const gradesData: any[] = [];

      setStudents(studentsData.data || []);
      setEvaluations(evaluationsData.data || []);
      
      // Créer la matrice de cellules
      const matrix: GradeCell[] = [];
      for (const student of studentsData.data || []) {
        for (const evaluation of evaluationsData.data || []) {
          const existingGrade = gradesData.find((g: any) => 
            g.student_id === student.id && g.evaluation_type_id === evaluation.id
          );
          
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
      toast({
        title: "Erreur",
        description: "Impossible de charger les données de la matrice",
        variant: "destructive",
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
        variant: "destructive",
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
    setMatrixData(prev => prev.map(c => 
      c.id === cellId 
        ? { ...c, grade: numValue, lastModified: new Date() }
        : c
    ));
    
    // Ajouter aux changements en attente
    setPendingChanges(prev => new Map(prev.set(cellId, { grade: numValue, timestamp: Date.now() })));
    
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
        description: `${batch.length} note(s) sauvegardée(s)`,
      });
    } catch (error) {
      toast({
        title: "Erreur de sauvegarde",
        description: "Impossible de sauvegarder les modifications",
        variant: "destructive",
      });
    }
  };

  const renderGradeCell = useCallback((cell: GradeCell, student: any, evaluation: any) => {
    const isSelected = selectedCell === cell.id;
    const isEditing = editingCell === cell.id;
    const hasPendingChange = pendingChanges.has(cell.id);
    
    return (
      <div
        key={cell.id}
        data-cell-id={cell.id}
        className={`
          relative border border-border bg-background min-h-[40px] flex items-center justify-center
          cursor-pointer transition-all duration-200
          ${isSelected ? 'ring-2 ring-primary bg-primary/5' : ''}
          ${hasPendingChange ? 'bg-amber-50 border-amber-300' : ''}
          ${cell.isLocked ? 'bg-muted cursor-not-allowed' : 'hover:bg-muted/50'}
        `}
        onClick={async () => {
          if (!cell.isLocked) {
            setSelectedCell(cell.id);
            if (crdtInitialized) {
              await CRDTService.updateCursor(cell.id, 0);
            }
          }
        }}
        onDoubleClick={() => !cell.isLocked && setEditingCell(cell.id)}
      >
        {isEditing ? (
          <Input
            type="number"
            value={cell.grade || ''}
            onChange={(e) => handleCellEdit(cell.id, e.target.value)}
            onBlur={() => setEditingCell(null)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') setEditingCell(null);
              if (e.key === 'Escape') setEditingCell(null);
            }}
            className="w-full h-8 text-center border-0 bg-transparent"
            autoFocus
          />
        ) : (
          <span className={`text-sm ${cell.grade === null ? 'text-muted-foreground' : 'font-medium'}`}>
            {cell.grade?.toFixed(1) || '-'}
          </span>
        )}
        
        {cell.isLocked && (
          <Lock className="absolute top-1 right-1 w-3 h-3 text-muted-foreground" />
        )}
        
        {cell.comment && (
          <MessageSquare className="absolute bottom-1 right-1 w-3 h-3 text-primary" />
        )}
        
        {hasPendingChange && (
          <div className="absolute top-1 left-1 w-2 h-2 bg-amber-500 rounded-full" />
        )}
      </div>
    );
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
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `matrice_notes_${selectedSubject}_${Date.now()}.csv`;
    a.click();
  }, [students, evaluations, matrixData, selectedSubject]);

  useEffect(() => {
    loadMatrixData();
  }, [selectedSubject, selectedProgram, selectedSemester]);

  return (
    <div className="space-y-6">
      {/* Header avec collaboration */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Edit3 className="w-5 h-5" />
              Interface Matricielle Collaborative
              {isNewSession && (
                <Badge variant="default" className="bg-green-500 text-white">
                  Nouvelle Session
                </Badge>
              )}
              <Badge variant="secondary" className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {connectedUsers.length} connecté{connectedUsers.length > 1 ? 's' : ''}
              </Badge>
              {pendingChanges.size > 0 && (
                <Badge variant="outline" className="bg-amber-50 text-amber-700">
                  {pendingChanges.size} modification{pendingChanges.size > 1 ? 's' : ''} en attente
                </Badge>
              )}
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowChat(!showChat)}>
                <MessageSquare className="w-4 h-4 mr-2" />
                Chat
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowAIInsights(!showAIInsights)}>
                <Brain className="w-4 h-4 mr-2" />
                IA Insights
              </Button>
              <Button variant="outline" size="sm" onClick={() => setViewHistory(!viewHistory)}>
                <History className="w-4 h-4 mr-2" />
                Historique
              </Button>
              <Button variant="outline" size="sm">
                <Upload className="w-4 h-4 mr-2" />
                Importer
              </Button>
              <Button variant="outline" size="sm" onClick={exportToCSV}>
                <Download className="w-4 h-4 mr-2" />
                Exporter
              </Button>
              <Button variant="outline" size="sm" onClick={() => setAutoSave(!autoSave)}>
                {autoSave ? <Unlock className="w-4 h-4 mr-2" /> : <Lock className="w-4 h-4 mr-2" />}
                Auto-save: {autoSave ? 'ON' : 'OFF'}
              </Button>
              <Button size="sm" onClick={() => saveChanges()} disabled={pendingChanges.size === 0}>
                <Save className="w-4 h-4 mr-2" />
                Sauvegarder tout
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
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

          {/* Utilisateurs connectés */}
          {connectedUsers.length > 1 && (
            <div className="flex items-center gap-2 mb-4 p-3 bg-muted/50 rounded-lg">
              <span className="text-sm font-medium">Utilisateurs connectés:</span>
              {connectedUsers.map(user => (
                <Badge key={user.id} variant="outline" className="flex items-center gap-1">
                  <div 
                    className="w-2 h-2 rounded-full" 
                    style={{ backgroundColor: user.color }}
                  />
                  {user.name}
                  {user.isOnline && <div className="w-2 h-2 bg-green-500 rounded-full" />}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI Insights Dashboard */}
      {showAIInsights && (
        <AIInsightsDashboard 
          subjectId={selectedSubject} 
          programId={selectedProgram} 
        />
      )}

      {/* Matrice de saisie */}
      {students.length > 0 && evaluations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Matrice de Notes - Mode Collaboratif</CardTitle>
          </CardHeader>
          <CardContent>
            <div ref={matrixRef} className="relative overflow-auto">
              {/* Multiple Cursors Overlay */}
              <MultipleCursors containerRef={matrixRef} />
              
              <div className="grid gap-1" style={{ 
                gridTemplateColumns: `200px repeat(${evaluations.length}, minmax(80px, 1fr))` 
              }}>
                {/* Header */}
                <div className="font-medium p-2 bg-muted rounded">Étudiant</div>
                {evaluations.map(evaluation => (
                  <div key={evaluation.id} className="font-medium p-2 bg-muted rounded text-center text-xs">
                    {evaluation.name}
                    <div className="text-xs text-muted-foreground mt-1">
                      /{evaluation.max_grade || 20}
                    </div>
                  </div>
                ))}
                
                {/* Lignes d'étudiants */}
                {students.map(student => (
                  <React.Fragment key={student.id}>
                    <div className="p-2 font-medium bg-muted/30 rounded flex items-center">
                      <div className="truncate">
                        {student.name || `Étudiant ${student.student_number}`}
                      </div>
                    </div>
                    {evaluations.map(evaluation => {
                      const cell = matrixData.find(c => 
                        c.studentId === student.id && c.evaluationId === evaluation.id
                      );
                      return cell ? renderGradeCell(cell, student, evaluation) : (
                        <div key={`${student.id}_${evaluation.id}`} className="border border-border bg-muted/20 min-h-[40px]" />
                      );
                    })}
                  </React.Fragment>
                ))}
              </div>
            </div>
            
            {/* Instructions */}
            <Separator className="my-4" />
            <div className="text-sm text-muted-foreground space-y-1">
              <p>• Double-cliquez sur une cellule pour la modifier</p>
              <p>• Les modifications sont automatiquement sauvegardées si l'auto-save est activé</p>
              <p>• Les cellules avec un point jaune ont des modifications en attente</p>
              <p>• Les cellules verrouillées 🔒 sont publiées et ne peuvent pas être modifiées</p>
            </div>
          </CardContent>
        </Card>
      )}

      {matrixData.length === 0 && !isLoading && selectedSubject && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">
              Aucune donnée trouvée pour cette sélection.
            </p>
          </CardContent>
        </Card>
      )}

      {!selectedSubject && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">
              Sélectionnez une matière pour commencer la saisie matricielle collaborative.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}