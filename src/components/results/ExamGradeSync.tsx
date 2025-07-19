
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useExamGradeSync } from '@/hooks/useExamGradeSync';
import { 
  Calendar, 
  Users, 
  BookOpen, 
  ArrowRight, 
  CheckCircle, 
  AlertCircle,
  Zap,
  RefreshCw
} from 'lucide-react';

export function ExamGradeSync() {
  const { 
    examSessions, 
    syncing, 
    loadExamSessions, 
    createGradeMatrix, 
    syncBatch 
  } = useExamGradeSync();

  const [selectedExams, setSelectedExams] = React.useState<string[]>([]);

  useEffect(() => {
    loadExamSessions();
  }, [loadExamSessions]);

  const handleSelectExam = (examId: string, checked: boolean) => {
    if (checked) {
      setSelectedExams(prev => [...prev, examId]);
    } else {
      setSelectedExams(prev => prev.filter(id => id !== examId));
    }
  };

  const handleSyncSelected = async () => {
    const selectedSessions = examSessions.filter(exam => 
      selectedExams.includes(exam.examId) && !exam.gradesCreated
    );
    if (selectedSessions.length > 0) {
      await syncBatch(selectedSessions);
      setSelectedExams([]);
    }
  };

  const pendingSessions = examSessions.filter(exam => !exam.gradesCreated);
  const completedSessions = examSessions.filter(exam => exam.gradesCreated);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowRight className="h-5 w-5 text-primary" />
            Synchronisation Examens → Notes
          </CardTitle>
          <p className="text-muted-foreground">
            Créez automatiquement des grilles de saisie de notes à partir des sessions d'examens terminées
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg mb-2 mx-auto">
                <AlertCircle className="w-6 h-6 text-orange-600" />
              </div>
              <p className="text-sm text-muted-foreground">En attente</p>
              <p className="text-lg font-semibold">{pendingSessions.length}</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-2 mx-auto">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-sm text-muted-foreground">Synchronisées</p>
              <p className="text-lg font-semibold">{completedSessions.length}</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-2 mx-auto">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-sm text-muted-foreground">Total étudiants</p>
              <p className="text-lg font-semibold">
                {examSessions.reduce((sum, exam) => sum + exam.studentCount, 0)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions en lot */}
      {pendingSessions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Actions Rapides
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Button
                onClick={handleSyncSelected}
                disabled={syncing || selectedExams.length === 0}
                className="flex items-center gap-2"
              >
                {syncing ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <ArrowRight className="w-4 h-4" />
                )}
                Synchroniser sélectionnés ({selectedExams.length})
              </Button>
              
              <Button
                variant="outline"
                onClick={() => setSelectedExams(pendingSessions.map(e => e.examId))}
                disabled={syncing}
              >
                Tout sélectionner
              </Button>
              
              <Button
                variant="outline"
                onClick={() => setSelectedExams([])}
                disabled={syncing}
              >
                Désélectionner tout
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sessions en attente */}
      {pendingSessions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-500" />
              Sessions en attente de synchronisation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingSessions.map((exam) => (
                <div
                  key={exam.examId}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={selectedExams.includes(exam.examId)}
                      onCheckedChange={(checked) => 
                        handleSelectExam(exam.examId, checked as boolean)
                      }
                      disabled={syncing}
                    />
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <BookOpen className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">{exam.examTitle}</span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {exam.examDate}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {exam.studentCount} étudiants
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    onClick={() => createGradeMatrix(exam)}
                    disabled={syncing}
                    className="flex items-center gap-2"
                  >
                    {syncing ? (
                      <RefreshCw className="w-3 h-3 animate-spin" />
                    ) : (
                      <ArrowRight className="w-3 h-3" />
                    )}
                    Créer grille
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sessions synchronisées */}
      {completedSessions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Sessions synchronisées
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {completedSessions.map((exam) => (
                <div
                  key={exam.examId}
                  className="flex items-center justify-between p-3 border rounded-lg bg-green-50 dark:bg-green-950"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <div>
                      <div className="font-medium">{exam.examTitle}</div>
                      <div className="text-sm text-muted-foreground">
                        {exam.examDate} • {exam.studentCount} étudiants
                      </div>
                    </div>
                  </div>
                  
                  <Badge variant="default">
                    Grille créée
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {examSessions.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Aucune session d'examen terminée trouvée
            </p>
            <Button
              variant="outline"
              onClick={loadExamSessions}
              className="mt-4"
              disabled={syncing}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualiser
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
