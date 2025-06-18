
export interface Supervisor {
  id: string;
  teacher_id: string;
  full_name: string;
  email: string;
  department_id?: string;
  phone?: string;
  status: string;
  specializations?: string[];
  availability?: {
    day_of_week: number;
    start_time: string;
    end_time: string;
    is_preferred: boolean;
  }[];
  current_load?: number;
  max_load?: number;
}

export interface SupervisorAssignment {
  id: string;
  session_id: string;
  teacher_id: string;
  supervisor_role: 'primary' | 'secondary' | 'assistant';
  status: 'assigned' | 'confirmed' | 'declined' | 'replaced';
  assigned_at: string;
  confirmed_at?: string;
  notes?: string;
}

export interface SupervisorFilters {
  department?: string;
  available?: boolean;
  specialization?: string;
}
