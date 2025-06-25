
export interface AcademicConstraint {
  id: string;
  type: 'time_conflict' | 'resource_conflict' | 'teacher_availability' | 'student_overlap';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  affectedEntities: string[];
  suggestedResolution?: string;
}

export interface ExamAcademicSync {
  examId: string;
  subjectId: string;
  programId: string;
  academicYearId: string;
  constraints: AcademicConstraint[];
  syncStatus: 'pending' | 'synced' | 'conflict' | 'error';
  lastSyncAt?: Date;
}
