
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface CSVGradeRow {
  matricule: string;
  [subject: string]: string | number;
}

export interface ImportValidation {
  valid: boolean;
  errors: string[];
  warnings: string[];
  studentCount: number;
  subjectCount: number;
}

export interface SubjectMapping {
  columnName: string;
  subjectId: string;
  subjectName: string;
  evaluationType: 'CC' | 'Ex';
}

export class CSVGradeImporter {
  private toast: any;

  constructor() {
    this.toast = useToast().toast;
  }

  // Parse CSV content into structured data
  parseCSV(csvContent: string): CSVGradeRow[] {
    const lines = csvContent.split('\n').filter(line => line.trim());
    if (lines.length === 0) return [];

    const headers = lines[0].split(',').map(h => h.trim());
    const rows: CSVGradeRow[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      if (values.length !== headers.length) continue;

      const row: CSVGradeRow = { matricule: '' };
      headers.forEach((header, index) => {
        if (header.toLowerCase() === 'matricule') {
          row.matricule = values[index];
        } else {
          const numValue = parseFloat(values[index]);
          row[header] = isNaN(numValue) ? values[index] : numValue;
        }
      });

      if (row.matricule) {
        rows.push(row);
      }
    }

    return rows;
  }

  // Create subject mappings from CSV headers
  createSubjectMappings(headers: string[]): SubjectMapping[] {
    const mappings: SubjectMapping[] = [];
    
    // Common DUT2-GE subject mappings
    const subjectMap: Record<string, { name: string; id: string }> = {
      'Droit_CC': { name: 'Droit des Affaires', id: 'droit' },
      'Droit_Ex': { name: 'Droit des Affaires', id: 'droit' },
      'PEI_CC': { name: 'Problèmes Économiques Internationaux', id: 'pei' },
      'PEI_Ex': { name: 'Problèmes Économiques Internationaux', id: 'pei' },
      'Mix_CC': { name: 'Mix Marketing', id: 'marketing' },
      'Mix_Ex': { name: 'Mix Marketing', id: 'marketing' },
      'Calc_CC': { name: 'Calcul et Analyse des Coûts', id: 'calcul' },
      'Calc_Ex': { name: 'Calcul et Analyse des Coûts', id: 'calcul' },
      'TQ_CC': { name: 'Techniques Quantitatives', id: 'tq' },
      'TQ_Ex': { name: 'Techniques Quantitatives', id: 'tq' },
      'Info_CC': { name: 'Environnement Informatique', id: 'info' },
      'Info_Ex': { name: 'Environnement Informatique', id: 'info' },
      'Comm_CC': { name: 'Communication Professionnelle', id: 'comm' },
      'Comm_Ex': { name: 'Communication Professionnelle', id: 'comm' },
      'Ang_CC': { name: 'Anglais', id: 'anglais' },
      'Ang_Ex': { name: 'Anglais', id: 'anglais' },
      'PPP3_CC': { name: 'Projet Personnel et Professionnel 3', id: 'ppp3' },
      'PPP3_Ex': { name: 'Projet Personnel et Professionnel 3', id: 'ppp3' },
      // Semestre 4
      'Fin_CC': { name: 'Finance d\'Entreprise', id: 'finance' },
      'Fin_Ex': { name: 'Finance d\'Entreprise', id: 'finance' },
      'Prod_CC': { name: 'Gestion de Production', id: 'production' },
      'Prod_Ex': { name: 'Gestion de Production', id: 'production' },
      'Strat_CC': { name: 'Stratégie et Création', id: 'strategie' },
      'Strat_Ex': { name: 'Stratégie et Création', id: 'strategie' },
      'Nego_CC': { name: 'Négociation', id: 'nego' },
      'Nego_Ex': { name: 'Négociation', id: 'nego' },
      'TCI_CC': { name: 'Commerce International', id: 'tci' },
      'TCI_Ex': { name: 'Commerce International', id: 'tci' },
      'Ang2_CC': { name: 'Anglais 2', id: 'anglais2' },
      'Ang2_Ex': { name: 'Anglais 2', id: 'anglais2' },
      'PPP4_CC': { name: 'Projet Personnel et Professionnel 4', id: 'ppp4' },
      'Proj_CC': { name: 'Projet Tutoré', id: 'projet' },
      'Proj_Ex': { name: 'Projet Tutoré', id: 'projet' },
      'Stage_CC': { name: 'Stage', id: 'stage' },
      'Stage_Ex': { name: 'Stage', id: 'stage' }
    };

    headers.forEach(header => {
      if (header.toLowerCase() !== 'matricule' && subjectMap[header]) {
        const subject = subjectMap[header];
        const evaluationType = header.endsWith('_CC') ? 'CC' : 'Ex';
        
        mappings.push({
          columnName: header,
          subjectId: subject.id,
          subjectName: subject.name,
          evaluationType
        });
      }
    });

    return mappings;
  }

  // Validate CSV data before import
  async validateData(rows: CSVGradeRow[], mappings: SubjectMapping[]): Promise<ImportValidation> {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check if we have data
    if (rows.length === 0) {
      errors.push('Aucune donnée trouvée dans le fichier CSV');
      return { valid: false, errors, warnings, studentCount: 0, subjectCount: 0 };
    }

    // Check student matricules
    const matricules = rows.map(row => row.matricule);
    const duplicates = matricules.filter((item, index) => matricules.indexOf(item) !== index);
    if (duplicates.length > 0) {
      errors.push(`Matricules dupliqués détectés: ${duplicates.join(', ')}`);
    }

    // Validate students exist in database
    const { data: existingStudents } = await supabase
      .from('students')
      .select('student_number')
      .in('student_number', matricules);

    const existingMatricules = existingStudents?.map(s => s.student_number) || [];
    const missingStudents = matricules.filter(m => !existingMatricules.includes(m));
    
    if (missingStudents.length > 0) {
      warnings.push(`${missingStudents.length} étudiants non trouvés en base: ${missingStudents.slice(0, 3).join(', ')}${missingStudents.length > 3 ? '...' : ''}`);
    }

    // Validate grade values
    rows.forEach((row, rowIndex) => {
      mappings.forEach(mapping => {
        const value = row[mapping.columnName];
        if (value !== undefined && value !== '' && value !== 0) {
          const numValue = Number(value);
          if (isNaN(numValue) || numValue < 0 || numValue > 20) {
            errors.push(`Ligne ${rowIndex + 2}, ${mapping.columnName}: valeur invalide (${value})`);
          }
        }
      });
    });

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      studentCount: rows.length,
      subjectCount: new Set(mappings.map(m => m.subjectId)).size
    };
  }

  // Import grades to database
  async importGrades(
    rows: CSVGradeRow[], 
    mappings: SubjectMapping[], 
    academicYearId: string, 
    semester: number
  ): Promise<{ success: number; errors: string[] }> {
    const errors: string[] = [];
    let successCount = 0;

    // Get evaluation types
    const { data: evalTypes } = await supabase
      .from('evaluation_types')
      .select('id, code')
      .eq('is_active', true);

    const ccEvalType = evalTypes?.find(et => et.code === 'CC');
    const efEvalType = evalTypes?.find(et => et.code === 'EF');

    if (!ccEvalType || !efEvalType) {
      errors.push('Types d\'évaluation CC ou EF non trouvés');
      return { success: 0, errors };
    }

    // Get students with their IDs
    const matricules = rows.map(row => row.matricule);
    const { data: students } = await supabase
      .from('students')
      .select('id, student_number')
      .in('student_number', matricules);

    const studentMap = new Map(students?.map(s => [s.student_number, s.id]) || []);

    // Get subjects with their IDs
    const subjectIds = Array.from(new Set(mappings.map(m => m.subjectId)));
    const { data: subjects } = await supabase
      .from('subjects')
      .select('id, code')
      .in('code', subjectIds);

    const subjectMap = new Map(subjects?.map(s => [s.code, s.id]) || []);

    // Prepare grades for batch insert
    const gradesToInsert = [];

    for (const row of rows) {
      const studentId = studentMap.get(row.matricule);
      if (!studentId) {
        errors.push(`Étudiant non trouvé: ${row.matricule}`);
        continue;
      }

      for (const mapping of mappings) {
        const value = row[mapping.columnName];
        if (value === undefined || value === '' || Number(value) === 0) continue;

        const grade = Number(value);
        if (isNaN(grade)) continue;

        const subjectId = subjectMap.get(mapping.subjectId);
        if (!subjectId) {
          errors.push(`Matière non trouvée: ${mapping.subjectName}`);
          continue;
        }

        const evaluationTypeId = mapping.evaluationType === 'CC' ? ccEvalType.id : efEvalType.id;

        gradesToInsert.push({
          student_id: studentId,
          subject_id: subjectId,
          evaluation_type_id: evaluationTypeId,
          grade,
          max_grade: 20,
          semester,
          academic_year_id: academicYearId,
          evaluation_date: new Date().toISOString().split('T')[0],
          is_published: true
        });
      }
    }

    // Batch insert grades
    if (gradesToInsert.length > 0) {
      const { error } = await supabase
        .from('student_grades')
        .upsert(gradesToInsert, {
          onConflict: 'student_id,subject_id,evaluation_type_id,semester,academic_year_id'
        });

      if (error) {
        errors.push(`Erreur d'insertion: ${error.message}`);
      } else {
        successCount = gradesToInsert.length;
      }
    }

    return { success: successCount, errors };
  }
}
