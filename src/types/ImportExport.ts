export interface LevelExportData {
  name: string;
  code: string;
  education_cycle: string;
  duration_years: number;
  semesters: number;
  ects_credits?: number;
  order_index: number;
}

export interface ImportValidationError {
  row: number;
  field: string;
  message: string;
}

export interface ImportPreviewData {
  valid: LevelExportData[];
  errors: ImportValidationError[];
  totalRows: number;
}

export interface ExportOptions {
  format: 'excel' | 'pdf';
  includeAll: boolean;
  selectedIds?: string[];
}

export interface ImportResult {
  success: boolean;
  imported: number;
  errors: ImportValidationError[];
  skipped: number;
}