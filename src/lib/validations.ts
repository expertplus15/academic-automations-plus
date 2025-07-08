import { z } from 'zod';

// Teacher validation schema
export const teacherFormSchema = z.object({
  employee_number: z.string().min(1, "Le numéro employé est requis"),
  profile: z.object({
    full_name: z.string().min(2, "Le nom complet doit contenir au moins 2 caractères"),
    email: z.string().email("Email invalide")
  }),
  department_id: z.string().optional(),
  hire_date: z.string().min(1, "La date d'embauche est requise"),
  status: z.enum(['active', 'inactive', 'on_leave', 'terminated']),
  phone: z.string().optional(),
  emergency_contact: z.object({
    name: z.string().optional(),
    phone: z.string().optional(),
    relationship: z.string().optional()
  }).optional(),
  salary_grade: z.string().optional(),
  office_location: z.string().optional(),
  bio: z.string().optional(),
  cv_url: z.string().url("URL invalide").optional().or(z.literal("")),
  photo_url: z.string().url("URL invalide").optional().or(z.literal("")),
  specialties: z.array(z.string()).default([]),
  qualifications: z.array(z.string()).default([])
});

// Course validation schema
export const courseFormSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  code: z.string().min(1, "Le code est requis"),
  description: z.string().optional(),
  category_id: z.string().optional(),
  difficulty_level: z.enum(['beginner', 'intermediate', 'advanced']),
  duration_hours: z.number().min(1, "La durée doit être d'au moins 1 heure"),
  max_students: z.number().min(1, "Le nombre maximum d'étudiants doit être d'au moins 1"),
  price: z.number().min(0, "Le prix ne peut pas être négatif"),
  language: z.string().default('fr'),
  is_published: z.boolean().default(false),
  is_featured: z.boolean().default(false),
  prerequisites: z.array(z.string()).default([]),
  learning_objectives: z.array(z.string()).default([]),
  enrollment_start_date: z.string().optional(),
  enrollment_end_date: z.string().optional(),
  course_start_date: z.string().optional(),
  course_end_date: z.string().optional(),
  thumbnail_url: z.string().url("URL invalide").optional().or(z.literal(""))
}).refine((data) => {
  if (data.enrollment_start_date && data.enrollment_end_date) {
    return new Date(data.enrollment_start_date) <= new Date(data.enrollment_end_date);
  }
  return true;
}, {
  message: "La date de fin d'inscription doit être après la date de début",
  path: ["enrollment_end_date"]
}).refine((data) => {
  if (data.course_start_date && data.course_end_date) {
    return new Date(data.course_start_date) <= new Date(data.course_end_date);
  }
  return true;
}, {
  message: "La date de fin du cours doit être après la date de début",
  path: ["course_end_date"]
});

// Student enrollment validation
export const enrollmentSchema = z.object({
  student_id: z.string().uuid("ID étudiant invalide"),
  course_id: z.string().uuid("ID cours invalide"),
  enrollment_date: z.date().default(() => new Date()),
  status: z.enum(['pending', 'active', 'completed', 'dropped']).default('pending'),
  progress_percentage: z.number().min(0).max(100).default(0)
});

// Performance evaluation validation
export const performanceEvaluationSchema = z.object({
  teacher_id: z.string().uuid("ID enseignant invalide"),
  evaluation_period_start: z.date(),
  evaluation_period_end: z.date(),
  overall_rating: z.number().min(1).max(5),
  criteria_scores: z.record(z.number().min(1).max(5)),
  strengths: z.array(z.string()).default([]),
  areas_for_improvement: z.array(z.string()).default([]),
  goals: z.array(z.string()).default([]),
  comments: z.string().optional(),
  evaluator_id: z.string().uuid("ID évaluateur invalide")
}).refine((data) => {
  return data.evaluation_period_start <= data.evaluation_period_end;
}, {
  message: "La date de fin doit être après la date de début",
  path: ["evaluation_period_end"]
});

// Student validation schema
export const studentFormSchema = z.object({
  full_name: z.string().min(2, "Le nom complet doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  phone: z.string().optional().or(z.literal("")),
  program_id: z.string().uuid("Veuillez sélectionner un programme"),
  year_level: z.number().min(1, "Le niveau doit être au moins 1").max(5, "Le niveau ne peut pas dépasser 5"),
  status: z.enum(['active', 'suspended', 'graduated', 'dropped']).optional()
}).refine((data) => {
  // Custom validation for email uniqueness could be added here
  return true;
}, {
  message: "Validation personnalisée échouée"
});

export type TeacherFormData = z.infer<typeof teacherFormSchema>;
export type CourseFormData = z.infer<typeof courseFormSchema>;
export type EnrollmentData = z.infer<typeof enrollmentSchema>;
export type PerformanceEvaluationData = z.infer<typeof performanceEvaluationSchema>;
export type StudentFormData = z.infer<typeof studentFormSchema>;