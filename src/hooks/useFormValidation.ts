
import { useState, useCallback } from 'react';
import { z } from 'zod';

export interface ValidationRule<T = any> {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: T) => string | null;
  type?: 'email' | 'url' | 'number' | 'date';
}

export interface ValidationRules {
  [key: string]: ValidationRule;
}

export interface FormErrors {
  [key: string]: string;
}

export function useFormValidation<T extends Record<string, any>>(
  initialData: T,
  validationRules: ValidationRules = {}
) {
  const [data, setData] = useState<T>(initialData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isValidating, setIsValidating] = useState(false);

  const validateField = useCallback((name: string, value: any): string | null => {
    const rule = validationRules[name];
    if (!rule) return null;

    // Required validation
    if (rule.required && (value === null || value === undefined || value === '')) {
      return 'Ce champ est requis';
    }

    // Skip other validations if field is empty and not required
    if (!rule.required && (value === null || value === undefined || value === '')) {
      return null;
    }

    // Type validation
    if (rule.type) {
      switch (rule.type) {
        case 'email':
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            return 'Format d\'email invalide';
          }
          break;
        case 'url':
          try {
            new URL(value);
          } catch {
            return 'URL invalide';
          }
          break;
        case 'number':
          if (isNaN(Number(value))) {
            return 'Doit être un nombre valide';
          }
          break;
        case 'date':
          if (isNaN(Date.parse(value))) {
            return 'Date invalide';
          }
          break;
      }
    }

    // Length validation
    if (rule.minLength && value.toString().length < rule.minLength) {
      return `Minimum ${rule.minLength} caractères requis`;
    }

    if (rule.maxLength && value.toString().length > rule.maxLength) {
      return `Maximum ${rule.maxLength} caractères autorisés`;
    }

    // Pattern validation
    if (rule.pattern && !rule.pattern.test(value)) {
      return 'Format invalide';
    }

    // Custom validation
    if (rule.custom) {
      return rule.custom(value);
    }

    return null;
  }, [validationRules]);

  const validateForm = useCallback(async (): Promise<boolean> => {
    setIsValidating(true);
    const newErrors: FormErrors = {};

    // Validate all fields
    Object.keys(validationRules).forEach(fieldName => {
      const error = validateField(fieldName, data[fieldName]);
      if (error) {
        newErrors[fieldName] = error;
      }
    });

    setErrors(newErrors);
    setIsValidating(false);

    return Object.keys(newErrors).length === 0;
  }, [data, validateField, validationRules]);

  const setValue = useCallback((name: string, value: any) => {
    setData(prev => ({ ...prev, [name]: value }));
    
    // Real-time validation if field has been touched
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({
        ...prev,
        [name]: error || ''
      }));
    }
  }, [touched, validateField]);

  const setTouched = useCallback((name: string) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    
    // Validate on blur
    const error = validateField(name, data[name]);
    setErrors(prev => ({
      ...prev,
      [name]: error || ''
    }));
  }, [data, validateField]);

  const reset = useCallback(() => {
    setData(initialData);
    setErrors({});
    setTouched({});
  }, [initialData]);

  const setMultipleValues = useCallback((values: Partial<T>) => {
    setData(prev => ({ ...prev, ...values }));
  }, []);

  return {
    data,
    errors,
    touched,
    isValidating,
    setValue,
    setTouched: setTouched,
    validateForm,
    reset,
    setMultipleValues,
    isValid: Object.keys(errors).length === 0,
    hasErrors: Object.keys(errors).length > 0
  };
}

// Schéma de validation Zod pour les examens
export const examValidationSchema = z.object({
  title: z.string().min(1, 'Le titre est requis').max(100, 'Maximum 100 caractères'),
  description: z.string().max(500, 'Maximum 500 caractères').optional(),
  exam_type: z.enum(['written', 'oral', 'practical', 'mixed']),
  duration_minutes: z.number().min(30, 'Durée minimum 30 minutes').max(480, 'Durée maximum 8 heures'),
  max_students: z.number().min(1, 'Au moins 1 étudiant').optional(),
  min_supervisors: z.number().min(1, 'Au moins 1 surveillant').max(10, 'Maximum 10 surveillants'),
  instructions: z.object({
    general: z.string().optional(),
    materials_allowed: z.array(z.string()).optional(),
    special_requirements: z.string().optional()
  }).optional()
});

export type ExamFormData = z.infer<typeof examValidationSchema>;
