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

// Exam validation schema
export const examFormSchema = z.object({
  title: z.string().min(2, "Le titre doit contenir au moins 2 caractères"),
  description: z.string().optional(),
  exam_type: z.enum(['written', 'oral', 'practical', 'mixed']),
  duration_minutes: z.number().min(30, "La durée minimum est de 30 minutes").max(480, "La durée maximum est de 8 heures"),
  max_students: z.number().min(1, "Au moins 1 étudiant requis").optional(),
  min_supervisors: z.number().min(1, "Au moins 1 surveillant requis"),
  subject_id: z.string().uuid("ID de matière invalide").optional(),
  academic_year_id: z.string().uuid("ID d'année académique invalide").optional(),
  program_id: z.string().uuid("ID de programme invalide").optional(),
  instructions: z.object({
    general: z.string().optional(),
    materials_allowed: z.array(z.string()).default([]),
    special_requirements: z.string().optional()
  }).optional(),
  materials_required: z.array(z.string()).default([])
}).refine((data) => {
  // Custom validation for exam duration based on type
  if (data.exam_type === 'oral' && data.duration_minutes > 60) {
    return false;
  }
  return true;
}, {
  message: "Un examen oral ne peut pas dépasser 60 minutes",
  path: ["duration_minutes"]
});

// Invoice validation schema
export const invoiceFormSchema = z.object({
  student_id: z.string().uuid("ID étudiant invalide").optional(),
  fiscal_year_id: z.string().uuid("ID année fiscale invalide"),
  due_date: z.string().min(1, "La date d'échéance est requise"),
  recipient_name: z.string().min(2, "Le nom du destinataire est requis").optional(),
  recipient_email: z.string().email("Email invalide").optional(),
  recipient_address: z.string().optional(),
  invoice_type: z.enum(['student', 'commercial', 'free']).default('student'),
  notes: z.string().optional(),
  services: z.array(z.object({
    service_type_id: z.string().uuid("Type de service invalide").optional(),
    fee_type_id: z.string().uuid("Type de frais invalide").optional(),
    description: z.string().min(1, "La description est requise"),
    quantity: z.number().min(1, "La quantité doit être au moins 1"),
    unit_price: z.number().min(0, "Le prix unitaire ne peut pas être négatif"),
    tax_rate: z.number().min(0).max(100, "Le taux de TVA doit être entre 0 et 100%")
  })).min(1, "Au moins un service est requis")
}).refine((data) => {
  // If invoice_type is 'student', student_id is required
  if (data.invoice_type === 'student' && !data.student_id) {
    return false;
  }
  // If invoice_type is 'commercial' or 'free', recipient info is required
  if ((data.invoice_type === 'commercial' || data.invoice_type === 'free') && !data.recipient_name) {
    return false;
  }
  return true;
}, {
  message: "Les informations du destinataire sont requises selon le type de facture"
});

// Payment validation schema
export const paymentFormSchema = z.object({
  student_id: z.string().uuid("ID étudiant invalide"),
  invoice_id: z.string().uuid("ID facture invalide").optional(),
  payment_method_id: z.string().uuid("Méthode de paiement invalide"),
  amount: z.number().min(0.01, "Le montant doit être supérieur à 0"),
  payment_date: z.string().min(1, "La date de paiement est requise"),
  transaction_reference: z.string().optional(),
  notes: z.string().optional()
}).refine((data) => {
  // Payment date should not be in the future
  const paymentDate = new Date(data.payment_date);
  const today = new Date();
  today.setHours(23, 59, 59, 999); // End of today
  return paymentDate <= today;
}, {
  message: "La date de paiement ne peut pas être dans le futur",
  path: ["payment_date"]
});

// Grade entry validation schema
export const gradeEntrySchema = z.object({
  student_id: z.string().uuid("ID étudiant invalide"),
  subject_id: z.string().uuid("ID matière invalide"),
  evaluation_type_id: z.string().uuid("Type d'évaluation invalide"),
  grade: z.number().min(0, "La note ne peut pas être négative"),
  max_grade: z.number().min(1, "La note maximale doit être au moins 1").default(20),
  coefficient: z.number().min(0.1, "Le coefficient doit être au moins 0.1").default(1),
  academic_year_id: z.string().uuid("ID année académique invalide"),
  semester: z.number().min(1).max(2),
  evaluation_date: z.string().min(1, "La date d'évaluation est requise"),
  comments: z.string().optional(),
  is_published: z.boolean().default(false)
}).refine((data) => {
  // Grade should not exceed max_grade
  return data.grade <= data.max_grade;
}, {
  message: "La note ne peut pas dépasser la note maximale",
  path: ["grade"]
}).refine((data) => {
  // Evaluation date should not be in the future
  const evalDate = new Date(data.evaluation_date);
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  return evalDate <= today;
}, {
  message: "La date d'évaluation ne peut pas être dans le futur",
  path: ["evaluation_date"]
});

// Bulk grade entry validation
export const bulkGradeEntrySchema = z.object({
  subject_id: z.string().uuid("ID matière invalide"),
  evaluation_type_id: z.string().uuid("Type d'évaluation invalide"),
  academic_year_id: z.string().uuid("ID année académique invalide"),
  semester: z.number().min(1).max(2),
  evaluation_date: z.string().min(1, "La date d'évaluation est requise"),
  max_grade: z.number().min(1, "La note maximale doit être au moins 1").default(20),
  coefficient: z.number().min(0.1, "Le coefficient doit être au moins 0.1").default(1),
  grades: z.array(z.object({
    student_id: z.string().uuid("ID étudiant invalide"),
    grade: z.number().min(0, "La note ne peut pas être négative"),
    comments: z.string().optional()
  })).min(1, "Au moins une note est requise")
});

// Resource management validation
export const assetFormSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  asset_number: z.string().min(1, "Le numéro d'asset est requis"),
  category_id: z.string().uuid("Catégorie invalide").optional(),
  description: z.string().optional(),
  brand: z.string().optional(),
  model: z.string().optional(),
  serial_number: z.string().optional(),
  purchase_date: z.string().optional(),
  purchase_price: z.number().min(0, "Le prix d'achat ne peut pas être négatif").optional(),
  current_value: z.number().min(0, "La valeur actuelle ne peut pas être négative").optional(),
  condition_status: z.enum(['excellent', 'good', 'fair', 'poor']).default('good'),
  status: z.enum(['active', 'inactive', 'maintenance', 'retired']).default('active'),
  location: z.string().optional(),
  room_id: z.string().uuid("Salle invalide").optional(),
  responsible_person_id: z.string().uuid("Responsable invalide").optional(),
  warranty_end_date: z.string().optional()
});

// Communication validation
export const messageFormSchema = z.object({
  recipient_ids: z.array(z.string().uuid("ID destinataire invalide")).min(1, "Au moins un destinataire requis"),
  subject: z.string().min(1, "Le sujet est requis"),
  content: z.string().min(1, "Le contenu est requis"),
  message_type: z.enum(['direct', 'announcement', 'notification']).default('direct'),
  priority: z.enum(['low', 'normal', 'high', 'urgent']).default('normal'),
  scheduled_send_at: z.string().optional(),
  attachments: z.array(z.string()).default([])
});

// Service validation
export const serviceRequestSchema = z.object({
  service_type: z.enum(['transport', 'catering', 'accommodation', 'library', 'health']),
  title: z.string().min(2, "Le titre doit contenir au moins 2 caractères"),
  description: z.string().min(10, "La description doit contenir au moins 10 caractères"),
  priority: z.enum(['low', 'normal', 'high', 'urgent']).default('normal'),
  requested_date: z.string().min(1, "La date demandée est requise"),
  student_id: z.string().uuid("ID étudiant invalide").optional(),
  additional_details: z.record(z.any()).default({})
});

// Document template validation
export const documentTemplateSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  code: z.string().min(1, "Le code est requis"),
  description: z.string().optional(),
  template_type: z.enum(['certificate', 'transcript', 'letter', 'report', 'form']),
  template_content: z.record(z.any()),
  is_active: z.boolean().default(true),
  requires_approval: z.boolean().default(false)
});

// System settings validation
export const systemSettingsSchema = z.object({
  institution_name: z.string().min(2, "Le nom de l'institution est requis"),
  institution_email: z.string().email("Email invalide").optional(),
  institution_phone: z.string().optional(),
  institution_address: z.string().optional(),
  default_language: z.string().default('fr'),
  default_currency: z.string().default('EUR'),
  default_timezone: z.string().default('Europe/Paris'),
  date_format: z.string().default('DD/MM/YYYY'),
  grade_scale_max: z.number().min(1, "L'échelle de notation maximum doit être au moins 1").default(20),
  passing_grade_min: z.number().min(0, "La note de passage minimum ne peut pas être négative").default(10),
  attendance_required_percentage: z.number().min(0).max(100, "Le pourcentage requis doit être entre 0 et 100").default(75),
  academic_year_auto_init: z.boolean().default(false)
});

export type TeacherFormData = z.infer<typeof teacherFormSchema>;
export type CourseFormData = z.infer<typeof courseFormSchema>;
export type EnrollmentData = z.infer<typeof enrollmentSchema>;
export type PerformanceEvaluationData = z.infer<typeof performanceEvaluationSchema>;
export type StudentFormData = z.infer<typeof studentFormSchema>;
export type ExamFormData = z.infer<typeof examFormSchema>;
export type InvoiceFormData = z.infer<typeof invoiceFormSchema>;
export type PaymentFormData = z.infer<typeof paymentFormSchema>;
export type GradeEntryData = z.infer<typeof gradeEntrySchema>;
export type BulkGradeEntryData = z.infer<typeof bulkGradeEntrySchema>;
export type AssetFormData = z.infer<typeof assetFormSchema>;
export type MessageFormData = z.infer<typeof messageFormSchema>;
export type ServiceRequestData = z.infer<typeof serviceRequestSchema>;
export type DocumentTemplateData = z.infer<typeof documentTemplateSchema>;
export type SystemSettingsData = z.infer<typeof systemSettingsSchema>;

// Communication schemas
export const communicationPartnerSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  contact_person: z.string().min(2, "Le nom du contact doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  phone: z.string().optional(),
  company: z.string().min(2, "Le nom de l'entreprise doit contenir au moins 2 caractères"),
  sector: z.string().optional(),
  relation_type: z.enum(['internships', 'jobs', 'research', 'projects']),
  status: z.enum(['active', 'inactive', 'negotiation']).default('active'),
  notes: z.string().optional()
});

export const notificationSettingsSchema = z.object({
  email_notifications: z.boolean().default(true),
  sms_notifications: z.boolean().default(false),
  push_notifications: z.boolean().default(true),
  notification_frequency: z.enum(['immediate', 'daily', 'weekly']).default('immediate'),
  notification_types: z.array(z.string()).default([])
});

export const announcementSchema = z.object({
  title: z.string().min(5, "Le titre doit contenir au moins 5 caractères"),
  content: z.string().min(20, "Le contenu doit contenir au moins 20 caractères"),
  target_audience: z.enum(['all', 'students', 'teachers', 'staff', 'alumni']),
  priority: z.enum(['low', 'normal', 'high', 'urgent']).default('normal'),
  publish_date: z.string().optional(),
  expiry_date: z.string().optional(),
  is_published: z.boolean().default(false)
});

export type CommunicationPartnerFormData = z.infer<typeof communicationPartnerSchema>;
export type NotificationSettingsFormData = z.infer<typeof notificationSettingsSchema>;
export type AnnouncementFormData = z.infer<typeof announcementSchema>;