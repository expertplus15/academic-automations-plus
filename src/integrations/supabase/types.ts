export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      academic_alerts: {
        Row: {
          acknowledged_at: string | null
          acknowledged_by: string | null
          alert_type: string
          created_at: string | null
          current_value: number | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          is_read: boolean | null
          message: string
          related_subject_id: string | null
          severity: string
          student_id: string
          threshold_value: number | null
          title: string
          updated_at: string | null
        }
        Insert: {
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          alert_type: string
          created_at?: string | null
          current_value?: number | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          is_read?: boolean | null
          message: string
          related_subject_id?: string | null
          severity?: string
          student_id: string
          threshold_value?: number | null
          title: string
          updated_at?: string | null
        }
        Update: {
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          alert_type?: string
          created_at?: string | null
          current_value?: number | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          is_read?: boolean | null
          message?: string
          related_subject_id?: string | null
          severity?: string
          student_id?: string
          threshold_value?: number | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "academic_alerts_acknowledged_by_fkey"
            columns: ["acknowledged_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "academic_alerts_related_subject_id_fkey"
            columns: ["related_subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "academic_alerts_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      academic_calendar: {
        Row: {
          academic_year_id: string | null
          affects_programs: Json | null
          created_at: string | null
          description: string | null
          end_date: string
          event_type: string
          id: string
          is_holiday: boolean | null
          name: string
          start_date: string
          updated_at: string | null
        }
        Insert: {
          academic_year_id?: string | null
          affects_programs?: Json | null
          created_at?: string | null
          description?: string | null
          end_date: string
          event_type: string
          id?: string
          is_holiday?: boolean | null
          name: string
          start_date: string
          updated_at?: string | null
        }
        Update: {
          academic_year_id?: string | null
          affects_programs?: Json | null
          created_at?: string | null
          description?: string | null
          end_date?: string
          event_type?: string
          id?: string
          is_holiday?: boolean | null
          name?: string
          start_date?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "academic_calendar_academic_year_id_fkey"
            columns: ["academic_year_id"]
            isOneToOne: false
            referencedRelation: "academic_years"
            referencedColumns: ["id"]
          },
        ]
      }
      academic_levels: {
        Row: {
          code: string
          created_at: string | null
          duration_years: number | null
          ects_credits: number | null
          education_cycle: string
          id: string
          name: string
          order_index: number
          semesters: number | null
          updated_at: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          duration_years?: number | null
          ects_credits?: number | null
          education_cycle: string
          id?: string
          name: string
          order_index: number
          semesters?: number | null
          updated_at?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          duration_years?: number | null
          ects_credits?: number | null
          education_cycle?: string
          id?: string
          name?: string
          order_index?: number
          semesters?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      academic_years: {
        Row: {
          created_at: string | null
          end_date: string
          id: string
          is_current: boolean | null
          name: string
          start_date: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          end_date: string
          id?: string
          is_current?: boolean | null
          name: string
          start_date: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          end_date?: string
          id?: string
          is_current?: boolean | null
          name?: string
          start_date?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      accounting_entries: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          entry_date: string
          fiscal_year_id: string | null
          id: string
          reference_number: string
          status: string | null
          total_amount: number
          updated_at: string | null
          validated_at: string | null
          validated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          entry_date: string
          fiscal_year_id?: string | null
          id?: string
          reference_number: string
          status?: string | null
          total_amount: number
          updated_at?: string | null
          validated_at?: string | null
          validated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          entry_date?: string
          fiscal_year_id?: string | null
          id?: string
          reference_number?: string
          status?: string | null
          total_amount?: number
          updated_at?: string | null
          validated_at?: string | null
          validated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "accounting_entries_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accounting_entries_fiscal_year_id_fkey"
            columns: ["fiscal_year_id"]
            isOneToOne: false
            referencedRelation: "fiscal_years"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accounting_entries_validated_by_fkey"
            columns: ["validated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      accounting_entry_lines: {
        Row: {
          account_id: string | null
          created_at: string | null
          credit_amount: number | null
          debit_amount: number | null
          description: string | null
          entry_id: string | null
          id: string
        }
        Insert: {
          account_id?: string | null
          created_at?: string | null
          credit_amount?: number | null
          debit_amount?: number | null
          description?: string | null
          entry_id?: string | null
          id?: string
        }
        Update: {
          account_id?: string | null
          created_at?: string | null
          credit_amount?: number | null
          debit_amount?: number | null
          description?: string | null
          entry_id?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "accounting_entry_lines_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "chart_of_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accounting_entry_lines_entry_id_fkey"
            columns: ["entry_id"]
            isOneToOne: false
            referencedRelation: "accounting_entries"
            referencedColumns: ["id"]
          },
        ]
      }
      alert_configurations: {
        Row: {
          alert_type: string
          created_at: string | null
          created_by: string | null
          id: string
          is_active: boolean | null
          level_id: string | null
          message_template: string | null
          program_id: string | null
          severity: string
          threshold_value: number
          updated_at: string | null
        }
        Insert: {
          alert_type: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          level_id?: string | null
          message_template?: string | null
          program_id?: string | null
          severity?: string
          threshold_value: number
          updated_at?: string | null
        }
        Update: {
          alert_type?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          level_id?: string | null
          message_template?: string | null
          program_id?: string | null
          severity?: string
          threshold_value?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "alert_configurations_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "alert_configurations_level_id_fkey"
            columns: ["level_id"]
            isOneToOne: false
            referencedRelation: "academic_levels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "alert_configurations_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
        ]
      }
      attendance_records: {
        Row: {
          academic_year_id: string | null
          created_at: string | null
          id: string
          is_justified: boolean | null
          justification: string | null
          recorded_by: string | null
          session_date: string
          session_time: string
          status: string
          student_id: string
          subject_id: string
          updated_at: string | null
        }
        Insert: {
          academic_year_id?: string | null
          created_at?: string | null
          id?: string
          is_justified?: boolean | null
          justification?: string | null
          recorded_by?: string | null
          session_date: string
          session_time: string
          status?: string
          student_id: string
          subject_id: string
          updated_at?: string | null
        }
        Update: {
          academic_year_id?: string | null
          created_at?: string | null
          id?: string
          is_justified?: boolean | null
          justification?: string | null
          recorded_by?: string | null
          session_date?: string
          session_time?: string
          status?: string
          student_id?: string
          subject_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "attendance_records_academic_year_id_fkey"
            columns: ["academic_year_id"]
            isOneToOne: false
            referencedRelation: "academic_years"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_records_recorded_by_fkey"
            columns: ["recorded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_records_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_records_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      budget_items: {
        Row: {
          actual_amount: number | null
          budgeted_amount: number
          code: string
          created_at: string | null
          created_by: string | null
          department_id: string | null
          financial_category_id: string
          fiscal_year_id: string
          id: string
          name: string
          notes: string | null
          updated_at: string | null
          variance: number | null
        }
        Insert: {
          actual_amount?: number | null
          budgeted_amount?: number
          code: string
          created_at?: string | null
          created_by?: string | null
          department_id?: string | null
          financial_category_id: string
          fiscal_year_id: string
          id?: string
          name: string
          notes?: string | null
          updated_at?: string | null
          variance?: number | null
        }
        Update: {
          actual_amount?: number | null
          budgeted_amount?: number
          code?: string
          created_at?: string | null
          created_by?: string | null
          department_id?: string | null
          financial_category_id?: string
          fiscal_year_id?: string
          id?: string
          name?: string
          notes?: string | null
          updated_at?: string | null
          variance?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "budget_items_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "budget_items_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "budget_items_financial_category_id_fkey"
            columns: ["financial_category_id"]
            isOneToOne: false
            referencedRelation: "financial_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "budget_items_fiscal_year_id_fkey"
            columns: ["fiscal_year_id"]
            isOneToOne: false
            referencedRelation: "fiscal_years"
            referencedColumns: ["id"]
          },
        ]
      }
      campuses: {
        Row: {
          address: string | null
          code: string
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          code: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          code?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      chart_of_accounts: {
        Row: {
          account_name: string
          account_number: string
          account_type: string
          created_at: string | null
          id: string
          is_active: boolean | null
          parent_account_id: string | null
          updated_at: string | null
        }
        Insert: {
          account_name: string
          account_number: string
          account_type: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          parent_account_id?: string | null
          updated_at?: string | null
        }
        Update: {
          account_name?: string
          account_number?: string
          account_type?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          parent_account_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chart_of_accounts_parent_account_id_fkey"
            columns: ["parent_account_id"]
            isOneToOne: false
            referencedRelation: "chart_of_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      class_groups: {
        Row: {
          academic_year_id: string | null
          code: string
          created_at: string | null
          current_students: number | null
          group_type: string
          id: string
          max_students: number
          metadata: Json | null
          name: string
          parent_group_id: string | null
          program_id: string | null
          updated_at: string | null
        }
        Insert: {
          academic_year_id?: string | null
          code: string
          created_at?: string | null
          current_students?: number | null
          group_type: string
          id?: string
          max_students: number
          metadata?: Json | null
          name: string
          parent_group_id?: string | null
          program_id?: string | null
          updated_at?: string | null
        }
        Update: {
          academic_year_id?: string | null
          code?: string
          created_at?: string | null
          current_students?: number | null
          group_type?: string
          id?: string
          max_students?: number
          metadata?: Json | null
          name?: string
          parent_group_id?: string | null
          program_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "class_groups_academic_year_id_fkey"
            columns: ["academic_year_id"]
            isOneToOne: false
            referencedRelation: "academic_years"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "class_groups_parent_group_id_fkey"
            columns: ["parent_group_id"]
            isOneToOne: false
            referencedRelation: "class_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "class_groups_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
        ]
      }
      departments: {
        Row: {
          code: string
          created_at: string
          head_id: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          head_id?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          head_id?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "departments_head_id_fkey"
            columns: ["head_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      document_requests: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          created_at: string | null
          id: string
          rejection_reason: string | null
          request_data: Json | null
          requested_by: string | null
          status: string
          student_id: string
          template_id: string
          updated_at: string | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          id?: string
          rejection_reason?: string | null
          request_data?: Json | null
          requested_by?: string | null
          status?: string
          student_id: string
          template_id: string
          updated_at?: string | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          id?: string
          rejection_reason?: string | null
          request_data?: Json | null
          requested_by?: string | null
          status?: string
          student_id?: string
          template_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "document_requests_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_requests_requested_by_fkey"
            columns: ["requested_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_requests_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_requests_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "document_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      document_templates: {
        Row: {
          code: string
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          requires_approval: boolean | null
          template_content: Json
          template_type: string
          updated_at: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          requires_approval?: boolean | null
          template_content: Json
          template_type: string
          updated_at?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          requires_approval?: boolean | null
          template_content?: Json
          template_type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      evaluation_types: {
        Row: {
          code: string
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
          weight_percentage: number | null
        }
        Insert: {
          code: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
          weight_percentage?: number | null
        }
        Update: {
          code?: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
          weight_percentage?: number | null
        }
        Relationships: []
      }
      exam_conflicts: {
        Row: {
          affected_exams: Json | null
          affected_sessions: Json | null
          auto_resolvable: boolean | null
          conflict_type: string
          created_at: string | null
          description: string
          id: string
          resolution_notes: string | null
          resolution_status: string | null
          resolved_at: string | null
          resolved_by: string | null
          severity: string
          title: string
          updated_at: string | null
        }
        Insert: {
          affected_exams?: Json | null
          affected_sessions?: Json | null
          auto_resolvable?: boolean | null
          conflict_type: string
          created_at?: string | null
          description: string
          id?: string
          resolution_notes?: string | null
          resolution_status?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          affected_exams?: Json | null
          affected_sessions?: Json | null
          auto_resolvable?: boolean | null
          conflict_type?: string
          created_at?: string | null
          description?: string
          id?: string
          resolution_notes?: string | null
          resolution_status?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      exam_registrations: {
        Row: {
          exam_id: string
          id: string
          registration_date: string | null
          seat_number: string | null
          session_id: string | null
          special_accommodations: Json | null
          status: string
          student_id: string
        }
        Insert: {
          exam_id: string
          id?: string
          registration_date?: string | null
          seat_number?: string | null
          session_id?: string | null
          special_accommodations?: Json | null
          status?: string
          student_id: string
        }
        Update: {
          exam_id?: string
          id?: string
          registration_date?: string | null
          seat_number?: string | null
          session_id?: string | null
          special_accommodations?: Json | null
          status?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "exam_registrations_exam_id_fkey"
            columns: ["exam_id"]
            isOneToOne: false
            referencedRelation: "exams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exam_registrations_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "exam_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exam_registrations_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      exam_sessions: {
        Row: {
          actual_students_count: number | null
          created_at: string | null
          end_time: string
          exam_id: string
          id: string
          notes: string | null
          room_id: string | null
          start_time: string
          status: string
          updated_at: string | null
        }
        Insert: {
          actual_students_count?: number | null
          created_at?: string | null
          end_time: string
          exam_id: string
          id?: string
          notes?: string | null
          room_id?: string | null
          start_time: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          actual_students_count?: number | null
          created_at?: string | null
          end_time?: string
          exam_id?: string
          id?: string
          notes?: string | null
          room_id?: string | null
          start_time?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "exam_sessions_exam_id_fkey"
            columns: ["exam_id"]
            isOneToOne: false
            referencedRelation: "exams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exam_sessions_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      exam_supervisors: {
        Row: {
          assigned_at: string | null
          confirmed_at: string | null
          id: string
          session_id: string
          status: string
          supervisor_role: string
          teacher_id: string
        }
        Insert: {
          assigned_at?: string | null
          confirmed_at?: string | null
          id?: string
          session_id: string
          status?: string
          supervisor_role?: string
          teacher_id: string
        }
        Update: {
          assigned_at?: string | null
          confirmed_at?: string | null
          id?: string
          session_id?: string
          status?: string
          supervisor_role?: string
          teacher_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "exam_supervisors_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "exam_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exam_supervisors_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      exams: {
        Row: {
          academic_year_id: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          duration_minutes: number
          exam_type: string
          id: string
          instructions: Json | null
          materials_required: Json | null
          max_students: number | null
          min_supervisors: number | null
          program_id: string | null
          status: string
          subject_id: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          academic_year_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          duration_minutes?: number
          exam_type?: string
          id?: string
          instructions?: Json | null
          materials_required?: Json | null
          max_students?: number | null
          min_supervisors?: number | null
          program_id?: string | null
          status?: string
          subject_id?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          academic_year_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          duration_minutes?: number
          exam_type?: string
          id?: string
          instructions?: Json | null
          materials_required?: Json | null
          max_students?: number | null
          min_supervisors?: number | null
          program_id?: string | null
          status?: string
          subject_id?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "exams_academic_year_id_fkey"
            columns: ["academic_year_id"]
            isOneToOne: false
            referencedRelation: "academic_years"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exams_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exams_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      expenses: {
        Row: {
          amount: number
          approval_status: string | null
          approved_at: string | null
          approved_by: string | null
          created_at: string | null
          created_by: string | null
          description: string
          due_date: string | null
          expense_date: string
          expense_number: string
          financial_category_id: string | null
          fiscal_year_id: string | null
          id: string
          receipt_url: string | null
          supplier_id: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          approval_status?: string | null
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          created_by?: string | null
          description: string
          due_date?: string | null
          expense_date: string
          expense_number: string
          financial_category_id?: string | null
          fiscal_year_id?: string | null
          id?: string
          receipt_url?: string | null
          supplier_id?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          approval_status?: string | null
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string
          due_date?: string | null
          expense_date?: string
          expense_number?: string
          financial_category_id?: string | null
          fiscal_year_id?: string | null
          id?: string
          receipt_url?: string | null
          supplier_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "expenses_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expenses_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expenses_financial_category_id_fkey"
            columns: ["financial_category_id"]
            isOneToOne: false
            referencedRelation: "financial_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expenses_fiscal_year_id_fkey"
            columns: ["fiscal_year_id"]
            isOneToOne: false
            referencedRelation: "fiscal_years"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expenses_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      fee_types: {
        Row: {
          code: string
          created_at: string
          default_amount: number | null
          description: string | null
          fee_category: string
          id: string
          is_active: boolean | null
          is_percentage: boolean | null
          name: string
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          default_amount?: number | null
          description?: string | null
          fee_category?: string
          id?: string
          is_active?: boolean | null
          is_percentage?: boolean | null
          name: string
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          default_amount?: number | null
          description?: string | null
          fee_category?: string
          id?: string
          is_active?: boolean | null
          is_percentage?: boolean | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      financial_aid: {
        Row: {
          aid_type: string
          amount: number
          application_date: string | null
          approval_date: string | null
          approved_by: string | null
          created_at: string | null
          disbursement_date: string | null
          id: string
          notes: string | null
          scholarship_id: string | null
          status: string
          student_id: string
          updated_at: string | null
        }
        Insert: {
          aid_type: string
          amount: number
          application_date?: string | null
          approval_date?: string | null
          approved_by?: string | null
          created_at?: string | null
          disbursement_date?: string | null
          id?: string
          notes?: string | null
          scholarship_id?: string | null
          status?: string
          student_id: string
          updated_at?: string | null
        }
        Update: {
          aid_type?: string
          amount?: number
          application_date?: string | null
          approval_date?: string | null
          approved_by?: string | null
          created_at?: string | null
          disbursement_date?: string | null
          id?: string
          notes?: string | null
          scholarship_id?: string | null
          status?: string
          student_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "financial_aid_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_aid_scholarship_id_fkey"
            columns: ["scholarship_id"]
            isOneToOne: false
            referencedRelation: "scholarships"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_aid_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_categories: {
        Row: {
          account_id: string | null
          category_type: string
          code: string
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          account_id?: string | null
          category_type?: string
          code: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          account_id?: string | null
          category_type?: string
          code?: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "financial_categories_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "chart_of_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      fiscal_years: {
        Row: {
          created_at: string | null
          end_date: string
          id: string
          is_current: boolean | null
          name: string
          start_date: string
          status: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          end_date: string
          id?: string
          is_current?: boolean | null
          name: string
          start_date: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          end_date?: string
          id?: string
          is_current?: boolean | null
          name?: string
          start_date?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      generated_documents: {
        Row: {
          document_number: string
          download_count: number | null
          expires_at: string | null
          file_path: string | null
          file_size: number | null
          generated_at: string | null
          generated_by: string | null
          id: string
          is_valid: boolean | null
          last_downloaded_at: string | null
          request_id: string
        }
        Insert: {
          document_number: string
          download_count?: number | null
          expires_at?: string | null
          file_path?: string | null
          file_size?: number | null
          generated_at?: string | null
          generated_by?: string | null
          id?: string
          is_valid?: boolean | null
          last_downloaded_at?: string | null
          request_id: string
        }
        Update: {
          document_number?: string
          download_count?: number | null
          expires_at?: string | null
          file_path?: string | null
          file_size?: number | null
          generated_at?: string | null
          generated_by?: string | null
          id?: string
          is_valid?: boolean | null
          last_downloaded_at?: string | null
          request_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "generated_documents_generated_by_fkey"
            columns: ["generated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "generated_documents_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "document_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_lines: {
        Row: {
          created_at: string | null
          description: string
          financial_category_id: string
          id: string
          invoice_id: string
          quantity: number | null
          total_price: number
          unit_price: number
        }
        Insert: {
          created_at?: string | null
          description: string
          financial_category_id: string
          id?: string
          invoice_id: string
          quantity?: number | null
          total_price: number
          unit_price: number
        }
        Update: {
          created_at?: string | null
          description?: string
          financial_category_id?: string
          id?: string
          invoice_id?: string
          quantity?: number | null
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoice_lines_financial_category_id_fkey"
            columns: ["financial_category_id"]
            isOneToOne: false
            referencedRelation: "financial_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_lines_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_services: {
        Row: {
          created_at: string
          description: string
          fee_type_id: string | null
          id: string
          invoice_id: string
          quantity: number | null
          service_type_id: string | null
          tax_amount: number | null
          tax_rate: number | null
          total_price: number
          unit_price: number
        }
        Insert: {
          created_at?: string
          description: string
          fee_type_id?: string | null
          id?: string
          invoice_id: string
          quantity?: number | null
          service_type_id?: string | null
          tax_amount?: number | null
          tax_rate?: number | null
          total_price: number
          unit_price: number
        }
        Update: {
          created_at?: string
          description?: string
          fee_type_id?: string | null
          id?: string
          invoice_id?: string
          quantity?: number | null
          service_type_id?: string | null
          tax_amount?: number | null
          tax_rate?: number | null
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoice_services_fee_type_id_fkey"
            columns: ["fee_type_id"]
            isOneToOne: false
            referencedRelation: "fee_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_services_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_services_service_type_id_fkey"
            columns: ["service_type_id"]
            isOneToOne: false
            referencedRelation: "service_types"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          created_at: string | null
          created_by: string | null
          due_date: string
          fiscal_year_id: string
          id: string
          invoice_number: string
          invoice_type: string | null
          issue_date: string
          notes: string | null
          paid_amount: number | null
          recipient_address: string | null
          recipient_email: string | null
          recipient_name: string | null
          status: string
          student_id: string | null
          subtotal: number
          tax_amount: number | null
          total_amount: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          due_date: string
          fiscal_year_id: string
          id?: string
          invoice_number: string
          invoice_type?: string | null
          issue_date?: string
          notes?: string | null
          paid_amount?: number | null
          recipient_address?: string | null
          recipient_email?: string | null
          recipient_name?: string | null
          status?: string
          student_id?: string | null
          subtotal?: number
          tax_amount?: number | null
          total_amount?: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          due_date?: string
          fiscal_year_id?: string
          id?: string
          invoice_number?: string
          invoice_type?: string | null
          issue_date?: string
          notes?: string | null
          paid_amount?: number | null
          recipient_address?: string | null
          recipient_email?: string | null
          recipient_name?: string | null
          status?: string
          student_id?: string | null
          subtotal?: number
          tax_amount?: number | null
          total_amount?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_fiscal_year_id_fkey"
            columns: ["fiscal_year_id"]
            isOneToOne: false
            referencedRelation: "fiscal_years"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_methods: {
        Row: {
          code: string
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          is_online: boolean | null
          name: string
          processing_fee_percentage: number | null
          updated_at: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_online?: boolean | null
          name: string
          processing_fee_percentage?: number | null
          updated_at?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_online?: boolean | null
          name?: string
          processing_fee_percentage?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          invoice_id: string | null
          notes: string | null
          payment_date: string
          payment_method_id: string
          payment_number: string
          processed_by: string | null
          status: string
          student_id: string
          transaction_reference: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          invoice_id?: string | null
          notes?: string | null
          payment_date?: string
          payment_method_id: string
          payment_number: string
          processed_by?: string | null
          status?: string
          student_id: string
          transaction_reference?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          invoice_id?: string | null
          notes?: string | null
          payment_date?: string
          payment_method_id?: string
          payment_number?: string
          processed_by?: string | null
          status?: string
          student_id?: string
          transaction_reference?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_payment_method_id_fkey"
            columns: ["payment_method_id"]
            isOneToOne: false
            referencedRelation: "payment_methods"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_processed_by_fkey"
            columns: ["processed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          department_id: string | null
          email: string
          full_name: string | null
          id: string
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          department_id?: string | null
          email: string
          full_name?: string | null
          id: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          department_id?: string | null
          email?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      program_subjects: {
        Row: {
          created_at: string | null
          id: string
          is_mandatory: boolean | null
          min_grade_to_pass: number | null
          program_id: string | null
          semester: number
          subject_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_mandatory?: boolean | null
          min_grade_to_pass?: number | null
          program_id?: string | null
          semester: number
          subject_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_mandatory?: boolean | null
          min_grade_to_pass?: number | null
          program_id?: string | null
          semester?: number
          subject_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "program_subjects_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "program_subjects_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      programs: {
        Row: {
          code: string
          created_at: string
          department_id: string
          description: string | null
          duration_years: number
          id: string
          level_id: string | null
          name: string
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          department_id: string
          description?: string | null
          duration_years?: number
          id?: string
          level_id?: string | null
          name: string
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          department_id?: string
          description?: string | null
          duration_years?: number
          id?: string
          level_id?: string | null
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "programs_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "programs_level_id_fkey"
            columns: ["level_id"]
            isOneToOne: false
            referencedRelation: "academic_levels"
            referencedColumns: ["id"]
          },
        ]
      }
      rooms: {
        Row: {
          building: string | null
          capacity: number
          code: string
          created_at: string | null
          equipment: Json | null
          id: string
          name: string
          room_type: string
          site_id: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          building?: string | null
          capacity: number
          code: string
          created_at?: string | null
          equipment?: Json | null
          id?: string
          name: string
          room_type: string
          site_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          building?: string | null
          capacity?: number
          code?: string
          created_at?: string | null
          equipment?: Json | null
          id?: string
          name?: string
          room_type?: string
          site_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rooms_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      schedule_conflicts: {
        Row: {
          affected_timetables: Json | null
          conflict_type: string
          created_at: string | null
          description: string
          id: string
          resolution_status: string | null
          resolved_at: string | null
          resolved_by: string | null
          severity: string
          updated_at: string | null
        }
        Insert: {
          affected_timetables?: Json | null
          conflict_type: string
          created_at?: string | null
          description: string
          id?: string
          resolution_status?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string
          updated_at?: string | null
        }
        Update: {
          affected_timetables?: Json | null
          conflict_type?: string
          created_at?: string | null
          description?: string
          id?: string
          resolution_status?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      schedule_generations: {
        Row: {
          academic_year_id: string | null
          completed_at: string | null
          conflicts_count: number | null
          created_at: string | null
          error_message: string | null
          generated_by: string | null
          generation_type: string
          id: string
          parameters: Json | null
          program_id: string | null
          progress_percentage: number | null
          started_at: string | null
          status: string
          success_rate: number | null
        }
        Insert: {
          academic_year_id?: string | null
          completed_at?: string | null
          conflicts_count?: number | null
          created_at?: string | null
          error_message?: string | null
          generated_by?: string | null
          generation_type?: string
          id?: string
          parameters?: Json | null
          program_id?: string | null
          progress_percentage?: number | null
          started_at?: string | null
          status?: string
          success_rate?: number | null
        }
        Update: {
          academic_year_id?: string | null
          completed_at?: string | null
          conflicts_count?: number | null
          created_at?: string | null
          error_message?: string | null
          generated_by?: string | null
          generation_type?: string
          id?: string
          parameters?: Json | null
          program_id?: string | null
          progress_percentage?: number | null
          started_at?: string | null
          status?: string
          success_rate?: number | null
        }
        Relationships: []
      }
      scholarships: {
        Row: {
          academic_year_id: string | null
          amount: number
          application_deadline: string | null
          code: string
          created_at: string | null
          created_by: string | null
          description: string | null
          eligibility_criteria: Json | null
          id: string
          is_active: boolean | null
          max_recipients: number | null
          name: string
          percentage: number | null
          scholarship_type: string
          updated_at: string | null
        }
        Insert: {
          academic_year_id?: string | null
          amount: number
          application_deadline?: string | null
          code: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          eligibility_criteria?: Json | null
          id?: string
          is_active?: boolean | null
          max_recipients?: number | null
          name: string
          percentage?: number | null
          scholarship_type: string
          updated_at?: string | null
        }
        Update: {
          academic_year_id?: string | null
          amount?: number
          application_deadline?: string | null
          code?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          eligibility_criteria?: Json | null
          id?: string
          is_active?: boolean | null
          max_recipients?: number | null
          name?: string
          percentage?: number | null
          scholarship_type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "scholarships_academic_year_id_fkey"
            columns: ["academic_year_id"]
            isOneToOne: false
            referencedRelation: "academic_years"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scholarships_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      service_types: {
        Row: {
          code: string
          created_at: string
          default_price: number | null
          description: string | null
          id: string
          is_active: boolean | null
          is_taxable: boolean | null
          name: string
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          default_price?: number | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_taxable?: boolean | null
          name: string
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          default_price?: number | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_taxable?: boolean | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      sites: {
        Row: {
          address: string | null
          campus_id: string
          code: string
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          campus_id: string
          code: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          campus_id?: string
          code?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sites_campus_id_fkey"
            columns: ["campus_id"]
            isOneToOne: false
            referencedRelation: "campuses"
            referencedColumns: ["id"]
          },
        ]
      }
      specializations: {
        Row: {
          code: string
          created_at: string | null
          credits_required: number | null
          description: string | null
          id: string
          is_mandatory: boolean | null
          max_students: number | null
          name: string
          prerequisites: Json | null
          program_id: string | null
          updated_at: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          credits_required?: number | null
          description?: string | null
          id?: string
          is_mandatory?: boolean | null
          max_students?: number | null
          name: string
          prerequisites?: Json | null
          program_id?: string | null
          updated_at?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          credits_required?: number | null
          description?: string | null
          id?: string
          is_mandatory?: boolean | null
          max_students?: number | null
          name?: string
          prerequisites?: Json | null
          program_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "specializations_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
        ]
      }
      student_grades: {
        Row: {
          academic_year_id: string | null
          comments: string | null
          created_at: string | null
          evaluation_date: string
          evaluation_type_id: string
          grade: number
          id: string
          is_published: boolean | null
          max_grade: number | null
          semester: number
          student_id: string
          subject_id: string
          teacher_id: string | null
          updated_at: string | null
        }
        Insert: {
          academic_year_id?: string | null
          comments?: string | null
          created_at?: string | null
          evaluation_date: string
          evaluation_type_id: string
          grade: number
          id?: string
          is_published?: boolean | null
          max_grade?: number | null
          semester: number
          student_id: string
          subject_id: string
          teacher_id?: string | null
          updated_at?: string | null
        }
        Update: {
          academic_year_id?: string | null
          comments?: string | null
          created_at?: string | null
          evaluation_date?: string
          evaluation_type_id?: string
          grade?: number
          id?: string
          is_published?: boolean | null
          max_grade?: number | null
          semester?: number
          student_id?: string
          subject_id?: string
          teacher_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_grades_academic_year_id_fkey"
            columns: ["academic_year_id"]
            isOneToOne: false
            referencedRelation: "academic_years"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_grades_evaluation_type_id_fkey"
            columns: ["evaluation_type_id"]
            isOneToOne: false
            referencedRelation: "evaluation_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_grades_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_grades_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_grades_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      student_progress: {
        Row: {
          academic_year_id: string
          attendance_rate: number | null
          created_at: string | null
          credits_attempted: number | null
          credits_earned: number | null
          evaluations_count: number | null
          gpa: number | null
          id: string
          justified_absences: number | null
          last_calculated_at: string | null
          overall_average: number | null
          rank_in_class: number | null
          semester: number
          student_id: string
          subject_average: number | null
          subject_id: string | null
          total_absences: number | null
          total_students_in_class: number | null
          updated_at: string | null
        }
        Insert: {
          academic_year_id: string
          attendance_rate?: number | null
          created_at?: string | null
          credits_attempted?: number | null
          credits_earned?: number | null
          evaluations_count?: number | null
          gpa?: number | null
          id?: string
          justified_absences?: number | null
          last_calculated_at?: string | null
          overall_average?: number | null
          rank_in_class?: number | null
          semester: number
          student_id: string
          subject_average?: number | null
          subject_id?: string | null
          total_absences?: number | null
          total_students_in_class?: number | null
          updated_at?: string | null
        }
        Update: {
          academic_year_id?: string
          attendance_rate?: number | null
          created_at?: string | null
          credits_attempted?: number | null
          credits_earned?: number | null
          evaluations_count?: number | null
          gpa?: number | null
          id?: string
          justified_absences?: number | null
          last_calculated_at?: string | null
          overall_average?: number | null
          rank_in_class?: number | null
          semester?: number
          student_id?: string
          subject_average?: number | null
          subject_id?: string | null
          total_absences?: number | null
          total_students_in_class?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_progress_academic_year_id_fkey"
            columns: ["academic_year_id"]
            isOneToOne: false
            referencedRelation: "academic_years"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_progress_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_progress_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          created_at: string
          enrollment_date: string
          id: string
          profile_id: string
          program_id: string
          status: Database["public"]["Enums"]["student_status"]
          student_number: string
          updated_at: string
          year_level: number
        }
        Insert: {
          created_at?: string
          enrollment_date?: string
          id?: string
          profile_id: string
          program_id: string
          status?: Database["public"]["Enums"]["student_status"]
          student_number: string
          updated_at?: string
          year_level?: number
        }
        Update: {
          created_at?: string
          enrollment_date?: string
          id?: string
          profile_id?: string
          program_id?: string
          status?: Database["public"]["Enums"]["student_status"]
          student_number?: string
          updated_at?: string
          year_level?: number
        }
        Relationships: [
          {
            foreignKeyName: "students_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "students_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
        ]
      }
      students_accounts: {
        Row: {
          created_at: string | null
          current_balance: number | null
          fiscal_year_id: string
          id: string
          last_payment_date: string | null
          status: string
          student_id: string
          total_charged: number | null
          total_paid: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          current_balance?: number | null
          fiscal_year_id: string
          id?: string
          last_payment_date?: string | null
          status?: string
          student_id: string
          total_charged?: number | null
          total_paid?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          current_balance?: number | null
          fiscal_year_id?: string
          id?: string
          last_payment_date?: string | null
          status?: string
          student_id?: string
          total_charged?: number | null
          total_paid?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "students_accounts_fiscal_year_id_fkey"
            columns: ["fiscal_year_id"]
            isOneToOne: false
            referencedRelation: "fiscal_years"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "students_accounts_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      subjects: {
        Row: {
          class_group_id: string | null
          code: string
          coefficient: number
          created_at: string | null
          credits_ects: number
          description: string | null
          evaluation_methods: Json | null
          hours_practice: number | null
          hours_project: number | null
          hours_theory: number | null
          id: string
          level_id: string | null
          name: string
          prerequisites: Json | null
          program_id: string | null
          status: string | null
          teaching_methods: Json | null
          updated_at: string | null
        }
        Insert: {
          class_group_id?: string | null
          code: string
          coefficient?: number
          created_at?: string | null
          credits_ects: number
          description?: string | null
          evaluation_methods?: Json | null
          hours_practice?: number | null
          hours_project?: number | null
          hours_theory?: number | null
          id?: string
          level_id?: string | null
          name: string
          prerequisites?: Json | null
          program_id?: string | null
          status?: string | null
          teaching_methods?: Json | null
          updated_at?: string | null
        }
        Update: {
          class_group_id?: string | null
          code?: string
          coefficient?: number
          created_at?: string | null
          credits_ects?: number
          description?: string | null
          evaluation_methods?: Json | null
          hours_practice?: number | null
          hours_project?: number | null
          hours_theory?: number | null
          id?: string
          level_id?: string | null
          name?: string
          prerequisites?: Json | null
          program_id?: string | null
          status?: string | null
          teaching_methods?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      suppliers: {
        Row: {
          address: string | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
          payment_terms: number | null
          siret: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          payment_terms?: number | null
          siret?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          payment_terms?: number | null
          siret?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      teacher_availability: {
        Row: {
          academic_year_id: string | null
          created_at: string | null
          day_of_week: number
          end_time: string
          id: string
          is_preferred: boolean | null
          start_time: string
          teacher_id: string
          updated_at: string | null
        }
        Insert: {
          academic_year_id?: string | null
          created_at?: string | null
          day_of_week: number
          end_time: string
          id?: string
          is_preferred?: boolean | null
          start_time: string
          teacher_id: string
          updated_at?: string | null
        }
        Update: {
          academic_year_id?: string | null
          created_at?: string | null
          day_of_week?: number
          end_time?: string
          id?: string
          is_preferred?: boolean | null
          start_time?: string
          teacher_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      timetables: {
        Row: {
          academic_year_id: string | null
          created_at: string | null
          day_of_week: number | null
          end_time: string
          exceptions: Json | null
          group_id: string | null
          id: string
          is_flexible: boolean | null
          max_daily_hours: number | null
          min_break_minutes: number | null
          preferred_end_time: string | null
          preferred_start_time: string | null
          priority: number | null
          program_id: string | null
          recurrence_pattern: Json | null
          room_id: string | null
          slot_type: string
          start_time: string
          status: string | null
          subject_id: string | null
          teacher_id: string | null
          updated_at: string | null
          weight: number | null
        }
        Insert: {
          academic_year_id?: string | null
          created_at?: string | null
          day_of_week?: number | null
          end_time: string
          exceptions?: Json | null
          group_id?: string | null
          id?: string
          is_flexible?: boolean | null
          max_daily_hours?: number | null
          min_break_minutes?: number | null
          preferred_end_time?: string | null
          preferred_start_time?: string | null
          priority?: number | null
          program_id?: string | null
          recurrence_pattern?: Json | null
          room_id?: string | null
          slot_type: string
          start_time: string
          status?: string | null
          subject_id?: string | null
          teacher_id?: string | null
          updated_at?: string | null
          weight?: number | null
        }
        Update: {
          academic_year_id?: string | null
          created_at?: string | null
          day_of_week?: number | null
          end_time?: string
          exceptions?: Json | null
          group_id?: string | null
          id?: string
          is_flexible?: boolean | null
          max_daily_hours?: number | null
          min_break_minutes?: number | null
          preferred_end_time?: string | null
          preferred_start_time?: string | null
          priority?: number | null
          program_id?: string | null
          recurrence_pattern?: Json | null
          room_id?: string | null
          slot_type?: string
          start_time?: string
          status?: string | null
          subject_id?: string | null
          teacher_id?: string | null
          updated_at?: string | null
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "timetables_academic_year_id_fkey"
            columns: ["academic_year_id"]
            isOneToOne: false
            referencedRelation: "academic_years"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "timetables_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "class_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "timetables_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "timetables_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "timetables_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "timetables_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          created_at: string | null
          description: string
          financial_category_id: string
          fiscal_year_id: string
          id: string
          processed_by: string | null
          reference_id: string | null
          reference_type: string | null
          student_id: string | null
          transaction_date: string
          transaction_number: string
          transaction_type: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          description: string
          financial_category_id: string
          fiscal_year_id: string
          id?: string
          processed_by?: string | null
          reference_id?: string | null
          reference_type?: string | null
          student_id?: string | null
          transaction_date?: string
          transaction_number: string
          transaction_type: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          description?: string
          financial_category_id?: string
          fiscal_year_id?: string
          id?: string
          processed_by?: string | null
          reference_id?: string | null
          reference_type?: string | null
          student_id?: string | null
          transaction_date?: string
          transaction_number?: string
          transaction_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_financial_category_id_fkey"
            columns: ["financial_category_id"]
            isOneToOne: false
            referencedRelation: "financial_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_fiscal_year_id_fkey"
            columns: ["fiscal_year_id"]
            isOneToOne: false
            referencedRelation: "fiscal_years"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_processed_by_fkey"
            columns: ["processed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_student_averages: {
        Args: {
          p_student_id: string
          p_academic_year_id: string
          p_semester?: number
        }
        Returns: Json
      }
      calculate_student_progress: {
        Args: {
          p_student_id: string
          p_academic_year_id: string
          p_semester: number
        }
        Returns: undefined
      }
      detect_exam_conflicts: {
        Args: { p_academic_year_id?: string }
        Returns: {
          conflict_id: string
          conflict_type: string
          severity: string
          title: string
          description: string
          affected_data: Json
        }[]
      }
      detect_schedule_conflicts: {
        Args: { p_academic_year_id?: string }
        Returns: {
          conflict_id: string
          conflict_type: string
          severity: string
          description: string
          affected_slots: Json
        }[]
      }
      generate_document_number: {
        Args: { doc_type: string }
        Returns: string
      }
      generate_exam_schedule: {
        Args: {
          p_academic_year_id: string
          p_program_id?: string
          p_parameters?: Json
        }
        Returns: string
      }
      generate_expense_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_smart_schedule: {
        Args: {
          p_program_id: string
          p_academic_year_id: string
          p_parameters?: Json
        }
        Returns: string
      }
      generate_student_number: {
        Args: { program_code: string; enrollment_year: number }
        Returns: string
      }
      generate_unique_code: {
        Args: { prefix: string; table_name: string; column_name: string }
        Returns: string
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: Database["public"]["Enums"]["user_role"]
      }
    }
    Enums: {
      student_status: "active" | "suspended" | "graduated" | "dropped"
      user_role: "admin" | "teacher" | "student" | "hr" | "finance"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      student_status: ["active", "suspended", "graduated", "dropped"],
      user_role: ["admin", "teacher", "student", "hr", "finance"],
    },
  },
} as const
