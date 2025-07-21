
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { useAcademicYearContext } from '@/contexts/AcademicYearContext';

interface StudentSyncStatusProps {
  students: any[];
  loading: boolean;
}

export function StudentSyncStatus({ students, loading }: StudentSyncStatusProps) {
  const { selectedAcademicYear } = useAcademicYearContext();

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-4">
          <Clock className="w-4 h-4 mr-2 animate-spin" />
          <span className="text-sm">Vérification de la synchronisation...</span>
        </CardContent>
      </Card>
    );
  }

  const promotedStudents = students.filter(student => 
    student.current_academic_year_id === selectedAcademicYear?.id &&
    student.academic_year_id !== selectedAcademicYear?.id
  );

  const newStudents = students.filter(student => 
    student.current_academic_year_id === selectedAcademicYear?.id &&
    student.academic_year_id === selectedAcademicYear?.id
  );

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Users className="w-4 h-4" />
          Statut de synchronisation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Total étudiants</span>
          <Badge variant="outline">{students.length}</Badge>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-green-600" />
            Étudiants promus
          </span>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            {promotedStudents.length}
          </Badge>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground flex items-center gap-1">
            <AlertCircle className="w-3 h-3 text-blue-600" />
            Nouveaux étudiants
          </span>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            {newStudents.length}
          </Badge>
        </div>
        
        {promotedStudents.length > 0 && (
          <div className="pt-2 border-t">
            <p className="text-xs text-green-600">
              ✅ Synchronisation réussie - Les étudiants promus sont visibles
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
