export interface CalculationResult {
  id: string;
  type: 'averages' | 'ects' | 'all' | 'advanced';
  status: 'pending' | 'success' | 'error' | 'cancelled';
  progress: number;
  message: string;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  affectedStudents?: number;
  details?: Record<string, any>;
}

export interface CalculationParams {
  studentId?: string;
  programId?: string;
  academicYearId?: string;
  semester?: number;
  subjectId?: string;
  classGroupId?: string;
}

export interface CalculationOptions {
  type: 'averages' | 'ects' | 'all' | 'advanced';
  params: CalculationParams;
  priority?: 'low' | 'normal' | 'high';
  async?: boolean;
  notifications?: boolean;
}

export interface CalculationQueue {
  id: string;
  calculations: CalculationResult[];
  status: 'idle' | 'running' | 'paused';
  concurrency: number;
  addCalculation: (options: CalculationOptions) => string;
  removeCalculation: (id: string) => void;
  startQueue: () => void;
  stopQueue: () => void;
  pauseQueue: () => void;
  clearQueue: () => void;
}

export interface GradeStatistics {
  subject_id: string;
  subject_name: string;
  student_count: number;
  min_grade: number;
  max_grade: number;
  average_grade: number;
  median_grade: number;
  pass_rate: number; // Percentage of students with grade >= 10
  distribution: {
    grade_range: string;
    count: number;
    percentage: number;
  }[];
}

export interface StudentCalculationSummary {
  student_id: string;
  student_number: string;
  full_name: string;
  overall_average: number;
  ects_earned: number;
  ects_total: number;
  completion_rate: number;
  decision: 'ADMIS' | 'AJOURNE' | 'REDOUBLEMENT';
  mention?: string;
  compensation_applied: boolean;
  subjects_summary: {
    subject_id: string;
    subject_name: string;
    average: number;
    ects: number;
    status: 'VALIDÉ' | 'NON_VALIDÉ' | 'COMPENSATION';
  }[];
}

export interface BatchCalculationResult {
  batch_id: string;
  type: 'class' | 'program' | 'year' | 'custom';
  parameters: CalculationParams;
  total_students: number;
  processed_students: number;
  success_count: number;
  error_count: number;
  duration_ms: number;
  started_at: Date;
  completed_at?: Date;
  results: StudentCalculationSummary[];
  errors: {
    student_id: string;
    error_message: string;
  }[];
  statistics: {
    overall_average: number;
    pass_rate: number;
    ects_completion_rate: number;
    compensation_rate: number;
  };
}

export interface CalculationHistory {
  id: string;
  type: CalculationResult['type'];
  parameters: CalculationParams;
  user_id: string;
  started_at: Date;
  completed_at?: Date;
  status: CalculationResult['status'];
  affected_records: number;
  execution_time_ms?: number;
  metadata?: Record<string, any>;
}