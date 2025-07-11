import * as XLSX from 'xlsx';
import { LevelExportData, SubjectExportData, ImportValidationError, ImportPreviewData, ImportResult } from '@/types/ImportExport';
import { supabase } from '@/integrations/supabase/client';

export class ImportService {
  private static validCycles = ['license', 'master', 'doctorat', 'prepa', 'bts', 'custom'];

  static async parseFile(file: File): Promise<ImportPreviewData> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);

          const result = this.validateData(jsonData);
          resolve(result);
        } catch (error) {
          reject(new Error('Erreur lors de la lecture du fichier'));
        }
      };

      reader.onerror = () => reject(new Error('Erreur lors de la lecture du fichier'));
      reader.readAsArrayBuffer(file);
    });
  }

  private static validateData(data: any[]): ImportPreviewData {
    const valid: LevelExportData[] = [];
    const errors: ImportValidationError[] = [];
    const requiredFields = ['name', 'code', 'education_cycle', 'duration_years', 'semesters', 'order_index'];
    const frenchFieldMap: Record<string, string> = {
      'Nom du niveau': 'name',
      'Code': 'code',
      'Cycle d\'études': 'education_cycle',
      'Durée (années)': 'duration_years',
      'Nombre de semestres': 'semesters',
      'Crédits ECTS': 'ects_credits',
      'Ordre d\'affichage': 'order_index'
    };

    data.forEach((row: any, index: number) => {
      const rowNumber = index + 2; // +2 because Excel rows start at 1 and we have headers
      
      // Map French headers to English field names
      const normalizedRow: any = {};
      Object.entries(row).forEach(([key, value]) => {
        const englishKey = frenchFieldMap[key] || key;
        normalizedRow[englishKey] = value;
      });

      const rowErrors: ImportValidationError[] = [];

      // Check required fields
      requiredFields.forEach(field => {
        if (!normalizedRow[field] || normalizedRow[field] === '') {
          rowErrors.push({
            row: rowNumber,
            field,
            message: `Le champ '${field}' est requis`
          });
        }
      });

      // Validate specific fields
      if (normalizedRow.name && normalizedRow.name.length < 2) {
        rowErrors.push({
          row: rowNumber,
          field: 'name',
          message: 'Le nom doit contenir au moins 2 caractères'
        });
      }

      if (normalizedRow.code && normalizedRow.code.length < 2) {
        rowErrors.push({
          row: rowNumber,
          field: 'code',
          message: 'Le code doit contenir au moins 2 caractères'
        });
      }

      if (normalizedRow.education_cycle && !this.validCycles.includes(normalizedRow.education_cycle)) {
        rowErrors.push({
          row: rowNumber,
          field: 'education_cycle',
          message: `Cycle invalide. Valeurs possibles: ${this.validCycles.join(', ')}`
        });
      }

      if (normalizedRow.duration_years && (!Number.isInteger(normalizedRow.duration_years) || normalizedRow.duration_years < 1)) {
        rowErrors.push({
          row: rowNumber,
          field: 'duration_years',
          message: 'La durée doit être un nombre entier positif'
        });
      }

      if (normalizedRow.semesters && (!Number.isInteger(normalizedRow.semesters) || normalizedRow.semesters < 1)) {
        rowErrors.push({
          row: rowNumber,
          field: 'semesters',
          message: 'Le nombre de semestres doit être un nombre entier positif'
        });
      }

      if (normalizedRow.order_index && (!Number.isInteger(normalizedRow.order_index) || normalizedRow.order_index < 1)) {
        rowErrors.push({
          row: rowNumber,
          field: 'order_index',
          message: 'L\'ordre doit être un nombre entier positif'
        });
      }

      if (normalizedRow.ects_credits && (!Number.isInteger(normalizedRow.ects_credits) || normalizedRow.ects_credits < 1)) {
        rowErrors.push({
          row: rowNumber,
          field: 'ects_credits',
          message: 'Les crédits ECTS doivent être un nombre entier positif'
        });
      }

      if (rowErrors.length === 0) {
        valid.push({
          name: normalizedRow.name,
          code: normalizedRow.code,
          education_cycle: normalizedRow.education_cycle,
          duration_years: Number(normalizedRow.duration_years),
          semesters: Number(normalizedRow.semesters),
          ects_credits: normalizedRow.ects_credits ? Number(normalizedRow.ects_credits) : undefined,
          order_index: Number(normalizedRow.order_index)
        });
      } else {
        errors.push(...rowErrors);
      }
    });

    // Check for duplicate codes
    const codes = valid.map(item => item.code);
    const duplicateCodes = codes.filter((code, index) => codes.indexOf(code) !== index);
    
    if (duplicateCodes.length > 0) {
      duplicateCodes.forEach(code => {
        const duplicateRows = valid
          .map((item, index) => ({ item, originalIndex: index }))
          .filter(({ item }) => item.code === code)
          .map(({ originalIndex }) => originalIndex + 2);
        
        errors.push({
          row: duplicateRows[1], // Second occurrence
          field: 'code',
          message: `Code '${code}' déjà utilisé ligne ${duplicateRows[0]}`
        });
      });
    }

    return {
      valid: valid.filter(item => !duplicateCodes.includes(item.code)),
      errors,
      totalRows: data.length
    };
  }

  static async importData(data: LevelExportData[]): Promise<ImportResult> {
    try {
      // Check for existing codes in database
      const existingCodes = await this.getExistingCodes();
      const conflicts = data.filter(item => existingCodes.includes(item.code));
      
      if (conflicts.length > 0) {
        return {
          success: false,
          imported: 0,
          errors: conflicts.map((item, index) => ({
            row: index + 2,
            field: 'code',
            message: `Le code '${item.code}' existe déjà dans la base de données`
          })),
          skipped: conflicts.length
        };
      }

      // Import data in batches
      const batchSize = 10;
      let imported = 0;
      const errors: ImportValidationError[] = [];

      for (let i = 0; i < data.length; i += batchSize) {
        const batch = data.slice(i, i + batchSize);
        
        try {
          const { error } = await supabase
            .from('academic_levels')
            .insert(batch.map(item => ({
              name: item.name,
              code: item.code,
              education_cycle: item.education_cycle,
              duration_years: item.duration_years,
              semesters: item.semesters,
              ects_credits: item.ects_credits,
              order_index: item.order_index
            })));

          if (error) {
            batch.forEach((_, batchIndex) => {
              errors.push({
                row: i + batchIndex + 2,
                field: 'general',
                message: error.message
              });
            });
          } else {
            imported += batch.length;
          }
        } catch (batchError) {
          batch.forEach((_, batchIndex) => {
            errors.push({
              row: i + batchIndex + 2,
              field: 'general',
              message: 'Erreur lors de l\'insertion'
            });
          });
        }
      }

      return {
        success: errors.length === 0,
        imported,
        errors,
        skipped: data.length - imported
      };
    } catch (error) {
      return {
        success: false,
        imported: 0,
        errors: [{
          row: 0,
          field: 'general',
          message: 'Erreur lors de l\'import: ' + (error as Error).message
        }],
        skipped: data.length
      };
    }
  }

  // Services pour les matières
  static validateSubjectsData(data: any[]): {
    valid: SubjectExportData[];
    errors: string[];
  } {
    const valid: SubjectExportData[] = [];
    const errors: string[] = [];

    data.forEach((row, index) => {
      const rowIndex = index + 1;

      if (!row.Nom || typeof row.Nom !== 'string') {
        errors.push(`Ligne ${rowIndex}: Le nom est requis`);
        return;
      }

      if (!row.Code || typeof row.Code !== 'string') {
        errors.push(`Ligne ${rowIndex}: Le code est requis`);
        return;
      }

      const creditsEcts = parseFloat(row['Crédits ECTS']);
      if (isNaN(creditsEcts) || creditsEcts < 1 || creditsEcts > 30) {
        errors.push(`Ligne ${rowIndex}: Crédits ECTS invalides (1-30)`);
        return;
      }

      const coefficient = parseFloat(row.Coefficient);
      if (isNaN(coefficient) || coefficient < 0.5 || coefficient > 5) {
        errors.push(`Ligne ${rowIndex}: Coefficient invalide (0.5-5.0)`);
        return;
      }

      const hoursTheory = parseInt(row['Heures Théorie']) || 0;
      const hoursPractice = parseInt(row['Heures Pratique']) || 0;
      const hoursProject = parseInt(row['Heures Projet']) || 0;

      if (hoursTheory < 0 || hoursPractice < 0 || hoursProject < 0) {
        errors.push(`Ligne ${rowIndex}: Les heures ne peuvent pas être négatives`);
        return;
      }

      const status = row.Statut?.toLowerCase() || 'active';
      if (!['active', 'inactive', 'archived'].includes(status)) {
        errors.push(`Ligne ${rowIndex}: Statut invalide (active, inactive, archived)`);
        return;
      }

      valid.push({
        name: row.Nom.trim(),
        code: row.Code.trim().toUpperCase(),
        description: row.Description?.trim() || '',
        credits_ects: creditsEcts,
        coefficient: coefficient,
        hours_theory: hoursTheory,
        hours_practice: hoursPractice,
        hours_project: hoursProject,
        status: status
      });
    });

    return { valid, errors };
  }

  static async importSubjectsToDatabase(data: SubjectExportData[]): Promise<{
    success: number;
    errors: string[];
  }> {
    const results = {
      success: 0,
      errors: [] as string[]
    };

    for (const subject of data) {
      try {
        const { error } = await supabase
          .from('subjects')
          .insert({
            name: subject.name,
            code: subject.code,
            description: subject.description,
            credits_ects: subject.credits_ects,
            coefficient: subject.coefficient,
            hours_theory: subject.hours_theory,
            hours_practice: subject.hours_practice,
            hours_project: subject.hours_project,
            status: subject.status
          });

        if (error) {
          results.errors.push(`Erreur pour ${subject.name}: ${error.message}`);
        } else {
          results.success++;
        }
      } catch (error) {
        results.errors.push(`Erreur pour ${subject.name}: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
      }
    }

    return results;
  }

  private static async getExistingCodes(): Promise<string[]> {
    const { data, error } = await supabase
      .from('academic_levels')
      .select('code');

    if (error) {
      throw error;
    }

    return data?.map(item => item.code) || [];
  }
}