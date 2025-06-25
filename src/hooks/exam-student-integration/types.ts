
export interface StudentEnrollmentRule {
  id: string;
  name: string;
  conditions: {
    programId?: string;
    levelId?: string;
    semester?: number;
    minGrade?: number;
    prerequisites?: string[];
    yearLevel?: number;
    maxYearLevel?: number;
  };
  autoEnroll: boolean;
  requiresApproval: boolean;
  priority: number;
}

export interface ExamStudentSync {
  examId: string;
  enrolledStudents: string[];
  eligibleStudents: string[];
  pendingApprovals: string[];
  ineligibleStudents: { studentId: string; reason: string }[];
  accommodations: Record<string, any>;
  enrollmentStats: {
    total: number;
    eligible: number;
    enrolled: number;
    pending: number;
    ineligible: number;
  };
  syncStatus: 'pending' | 'synced' | 'partial' | 'error';
  lastSyncAt?: Date;
}

export interface EligibilityResult {
  eligible: boolean;
  reason?: string;
}

export interface PrerequisiteResult {
  success: boolean;
  missingPrerequisites?: string[];
}

export interface GradeResult {
  success: boolean;
  average?: number;
}

export interface AttendanceResult {
  success: boolean;
  rate?: number;
}
