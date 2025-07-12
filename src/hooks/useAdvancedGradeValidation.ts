import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ValidationRule {
  id: string;
  rule_name: string;
  rule_type: 'range' | 'format' | 'consistency' | 'mandatory' | 'business';
  conditions: Record<string, any>;
  severity: 'info' | 'warning' | 'error' | 'critical';
  is_active: boolean;
  academic_year_id?: string;
  program_id?: string;
  subject_id?: string;
}

export interface GradeAlert {
  id: string;
  student_id: string;
  subject_id?: string;
  grade_id?: string;
  alert_type: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  message: string;
  status: 'active' | 'resolved' | 'acknowledged' | 'ignored';
  created_at: string;
  metadata?: Record<string, any>;
}

export interface ValidationWorkflow {
  id: string;
  grade_id: string;
  workflow_step: number;
  validator_role: string;
  validator_id?: string;
  validation_status: 'pending' | 'approved' | 'rejected' | 'skipped';
  validation_date?: string;
  comments?: string;
}

export function useAdvancedGradeValidation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [alerts, setAlerts] = useState<GradeAlert[]>([]);
  const [rules, setRules] = useState<ValidationRule[]>([]);

  // Fetch validation rules
  const fetchValidationRules = async (filters?: {
    program_id?: string;
    subject_id?: string;
    academic_year_id?: string;
  }) => {
    try {
      setLoading(true);
      let query = supabase
        .from('grade_validation_rules')
        .select('*')
        .eq('is_active', true);

      if (filters?.program_id) {
        query = query.eq('program_id', filters.program_id);
      }
      if (filters?.subject_id) {
        query = query.eq('subject_id', filters.subject_id);
      }
      if (filters?.academic_year_id) {
        query = query.eq('academic_year_id', filters.academic_year_id);
      }

      const { data, error } = await query;
      if (error) throw error;

      const mappedData = (data || []).map(item => ({
        id: item.id,
        rule_name: item.rule_name,
        rule_type: item.rule_type as 'range' | 'format' | 'consistency' | 'mandatory' | 'business',
        conditions: typeof item.conditions === 'object' ? item.conditions as Record<string, any> : {},
        severity: item.severity as 'info' | 'warning' | 'error' | 'critical',
        is_active: item.is_active,
        academic_year_id: item.academic_year_id,
        program_id: item.program_id,
        subject_id: item.subject_id
      }));
      setRules(mappedData);
      return mappedData;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des règles');
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Fetch active alerts
  const fetchActiveAlerts = async (filters?: {
    student_id?: string;
    subject_id?: string;
    severity?: string;
  }) => {
    try {
      setLoading(true);
      let query = supabase
        .from('grade_alerts')
        .select(`
          *,
          students!inner(student_number, profiles!inner(full_name))
        `)
        .eq('status', 'active');

      if (filters?.student_id) {
        query = query.eq('student_id', filters.student_id);
      }
      if (filters?.subject_id) {
        query = query.eq('subject_id', filters.subject_id);
      }
      if (filters?.severity) {
        query = query.eq('severity', filters.severity);
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;

      const mappedData = (data || []).map(item => ({
        id: item.id,
        student_id: item.student_id,
        subject_id: item.subject_id,
        grade_id: item.grade_id,
        alert_type: item.alert_type,
        severity: item.severity as 'info' | 'warning' | 'error' | 'critical',
        message: item.message,
        status: item.status as 'active' | 'resolved' | 'acknowledged' | 'ignored',
        created_at: item.created_at,
        metadata: typeof item.metadata === 'object' ? item.metadata as Record<string, any> : undefined
      }));
      setAlerts(mappedData);
      return mappedData;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des alertes');
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Validate grade with advanced rules
  const validateGradeAdvanced = async (
    student_id: string,
    subject_id: string,
    grade: number,
    evaluation_type_id: string
  ) => {
    try {
      const { data, error } = await supabase
        .rpc('validate_grade_with_rules', {
          p_student_id: student_id,
          p_subject_id: subject_id,
          p_grade: grade,
          p_evaluation_type_id: evaluation_type_id
        });

      if (error) throw error;
      return data;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Erreur de validation');
    }
  };

  // Create validation rule
  const createValidationRule = async (rule: Omit<ValidationRule, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('grade_validation_rules')
        .insert([rule])
        .select()
        .single();

      if (error) throw error;
      
      await fetchValidationRules();
      return data;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Erreur lors de la création de la règle');
    }
  };

  // Resolve alert
  const resolveAlert = async (alertId: string, resolution_notes?: string) => {
    try {
      const { error } = await supabase
        .from('grade_alerts')
        .update({
          status: 'resolved',
          resolved_at: new Date().toISOString(),
          resolution_notes
        })
        .eq('id', alertId);

      if (error) throw error;
      
      await fetchActiveAlerts();
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Erreur lors de la résolution de l\'alerte');
    }
  };

  // Acknowledge alert
  const acknowledgeAlert = async (alertId: string) => {
    try {
      const { error } = await supabase
        .from('grade_alerts')
        .update({ status: 'acknowledged' })
        .eq('id', alertId);

      if (error) throw error;
      
      await fetchActiveAlerts();
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Erreur lors de l\'accusé de réception');
    }
  };

  // Batch validate grades
  const batchValidateGrades = async (grades: Array<{
    student_id: string;
    subject_id: string;
    grade: number;
    evaluation_type_id: string;
  }>) => {
    try {
      setLoading(true);
      const results = await Promise.allSettled(
        grades.map(grade => validateGradeAdvanced(
          grade.student_id,
          grade.subject_id,
          grade.grade,
          grade.evaluation_type_id
        ))
      );

      return results.map((result, index) => ({
        ...grades[index],
        validation: result.status === 'fulfilled' ? result.value : { valid: false, errors: ['Erreur de validation'] }
      }));
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Erreur lors de la validation en lot');
    } finally {
      setLoading(false);
    }
  };

  // Get validation statistics
  const getValidationStatistics = async () => {
    try {
      const { data: alertStats, error: alertError } = await supabase
        .from('grade_alerts')
        .select('severity, status')
        .eq('status', 'active');

      if (alertError) throw alertError;

      const stats = {
        total_alerts: alertStats?.length || 0,
        critical: alertStats?.filter(a => a.severity === 'critical').length || 0,
        errors: alertStats?.filter(a => a.severity === 'error').length || 0,
        warnings: alertStats?.filter(a => a.severity === 'warning').length || 0,
        info: alertStats?.filter(a => a.severity === 'info').length || 0
      };

      return stats;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Erreur lors du calcul des statistiques');
    }
  };

  return {
    loading,
    error,
    alerts,
    rules,
    fetchValidationRules,
    fetchActiveAlerts,
    validateGradeAdvanced,
    createValidationRule,
    resolveAlert,
    acknowledgeAlert,
    batchValidateGrades,
    getValidationStatistics
  };
}