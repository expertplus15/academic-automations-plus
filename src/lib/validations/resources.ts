import { z } from 'zod';

// Asset validation schema
export const assetSchema = z.object({
  name: z.string().min(2, 'Nom requis (min 2 caractères)').max(255, 'Nom trop long'),
  description: z.string().optional(),
  brand: z.string().optional(),
  model: z.string().optional(),
  serial_number: z.string().optional(),
  location: z.string().min(1, 'Emplacement requis'),
  status: z.enum(['active', 'maintenance', 'retired', 'reserved']),
  condition_status: z.enum(['excellent', 'good', 'fair', 'poor']),
  category_id: z.string().uuid('ID catégorie invalide').optional(),
  purchase_date: z.date().max(new Date(), 'Date ne peut être future').optional(),
  purchase_price: z.number().positive('Prix doit être positif').optional(),
  current_value: z.number().positive('Valeur doit être positive').optional(),
  warranty_end_date: z.date().optional(),
  qr_code: z.string().optional()
});

// Maintenance validation schema
export const maintenanceSchema = z.object({
  asset_id: z.string().uuid('ID équipement requis'),
  maintenance_type: z.enum(['preventive', 'corrective', 'inspection']),
  scheduled_date: z.date().min(new Date(), 'Date doit être future'),
  description: z.string().min(10, 'Description trop courte (min 10 caractères)'),
  cost: z.number().positive('Coût doit être positif').optional(),
  performed_by: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  estimated_duration: z.number().positive('Durée estimée doit être positive').optional()
});

// Asset booking validation schema
export const assetBookingSchema = z.object({
  asset_id: z.string().uuid('ID équipement invalide').optional(),
  room_id: z.string().uuid('ID salle invalide').optional(),
  start_date: z.date().min(new Date(), 'Date début doit être future'),
  end_date: z.date(),
  purpose: z.string().min(5, 'Objectif requis (min 5 caractères)'),
  notes: z.string().optional()
}).refine(data => data.end_date > data.start_date, {
  message: "Date fin doit être après date début",
  path: ["end_date"]
}).refine(data => data.asset_id || data.room_id, {
  message: "Équipement ou salle requis",
  path: ["asset_id"]
});

// Procurement request validation schema
export const procurementRequestSchema = z.object({
  title: z.string().min(5, 'Titre requis (min 5 caractères)'),
  description: z.string().min(20, 'Description trop courte (min 20 caractères)'),
  category_id: z.string().uuid('Catégorie requise'),
  quantity: z.number().int().positive('Quantité doit être positive'),
  unit_price: z.number().positive('Prix unitaire doit être positif'),
  total_amount: z.number().positive('Montant total doit être positif'),
  justification: z.string().min(10, 'Justification requise'),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  expected_delivery_date: z.date().min(new Date(), 'Date livraison doit être future').optional(),
  supplier_preference: z.string().optional()
});

// Asset movement validation schema
export const assetMovementSchema = z.object({
  asset_id: z.string().uuid('ID équipement requis'),
  movement_type: z.enum(['transfer', 'acquisition', 'disposal', 'maintenance', 'loan']),
  from_location: z.string().optional(),
  to_location: z.string().min(1, 'Nouvel emplacement requis'),
  reason: z.string().min(10, 'Raison du mouvement requise'),
  notes: z.string().optional()
});

// Category validation schema  
export const categorySchema = z.object({
  name: z.string().min(2, 'Nom requis (min 2 caractères)'),
  code: z.string().min(2, 'Code requis').regex(/^[A-Z0-9_]+$/, 'Code doit être en majuscules'),
  description: z.string().optional(),
  parent_category_id: z.string().uuid().optional()
});

// Export type definitions
export type AssetFormData = z.infer<typeof assetSchema>;
export type MaintenanceFormData = z.infer<typeof maintenanceSchema>;
export type AssetBookingFormData = z.infer<typeof assetBookingSchema>;
export type ProcurementRequestFormData = z.infer<typeof procurementRequestSchema>;
export type AssetMovementFormData = z.infer<typeof assetMovementSchema>;
export type CategoryFormData = z.infer<typeof categorySchema>;