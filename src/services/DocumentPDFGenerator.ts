import jsPDF from 'jspdf';
import { supabase } from '@/integrations/supabase/client';

interface StudentData {
  id: string;
  student_number: string;
  enrollment_date: string;
  status: string;
  profiles: {
    full_name: string;
    email: string;
  } | null;
  programs?: {
    name: string;
    code: string;
  } | null;
  academic_levels?: {
    name: string;
  } | null;
  [key: string]: any; // Allow additional properties
}

interface GradeData {
  subjects: {
    name: string;
    code: string;
  };
  grade: number;
  max_grade: number;
  semester: number;
}

interface TemplateData {
  id: string;
  name: string;
  template_type: string;
  template_content: string;
  variables: any;
}

export class DocumentPDFGenerator {
  private static async getStudentData(studentId: string): Promise<StudentData> {
    // Valider l'UUID de l'étudiant
    if (!studentId || studentId === 'none' || typeof studentId !== 'string' || !studentId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
      throw new Error(`ID étudiant invalide: ${studentId}`);
    }

    const { data, error } = await supabase
      .from('students')
      .select(`
        *,
        profiles:profile_id(full_name, email),
        programs:program_id(name, code)
      `)
      .eq('id', studentId)
      .single();

    if (error) throw new Error(`Erreur récupération étudiant: ${error.message}`);
    if (!data) throw new Error('Étudiant non trouvé');

    return data;
  }

  private static async getStudentGrades(studentId: string, academicYearId?: string): Promise<GradeData[]> {
    let query = supabase
      .from('student_grades')
      .select(`
        grade,
        max_grade,
        semester,
        subjects:subject_id(name, code)
      `)
      .eq('student_id', studentId)
      .eq('is_published', true);

    if (academicYearId) {
      query = query.eq('academic_year_id', academicYearId);
    }

    const { data, error } = await query;
    if (error) throw new Error(`Erreur récupération notes: ${error.message}`);
    return data || [];
  }

  private static async getTemplate(templateId: string): Promise<TemplateData> {
    // Valider l'UUID du template
    if (!templateId || typeof templateId !== 'string' || !templateId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
      throw new Error(`ID template invalide: ${templateId}`);
    }

    const { data, error } = await supabase
      .from('document_templates')
      .select('*')
      .eq('id', templateId)
      .single();

    if (error) throw new Error(`Erreur récupération template: ${error.message}`);
    if (!data) throw new Error('Template non trouvé');

    // Extraire le contenu du template selon son format
    let templateContent = '';
    if (typeof data.template_content === 'string') {
      templateContent = data.template_content;
    } else if (data.template_content && typeof data.template_content === 'object' && !Array.isArray(data.template_content)) {
      // Si c'est un objet JSON avec une clé 'template'
      const contentObj = data.template_content as Record<string, any>;
      templateContent = contentObj.template || JSON.stringify(data.template_content);
    } else {
      templateContent = 'Template vide';
    }

    return {
      ...data,
      template_content: templateContent
    };
  }

  private static replaceVariables(content: string, variables: Record<string, any>): string {
    let processedContent = content;
    
    // Remplacer les variables {{nom_variable}}
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
      processedContent = processedContent.replace(regex, String(value || ''));
    });

    return processedContent;
  }

  private static buildVariables(student: StudentData, grades: GradeData[], additionalData?: any): Record<string, any> {
    const currentDate = new Date().toLocaleDateString('fr-FR');
    const averageGrade = grades.length > 0 
      ? grades.reduce((sum, g) => sum + (g.grade / g.max_grade * 20), 0) / grades.length 
      : 0;

    return {
      // Informations étudiant
      student_name: student.profiles?.full_name || '',
      student_number: student.student_number || '',
      student_email: student.profiles?.email || '',
      enrollment_date: new Date(student.enrollment_date).toLocaleDateString('fr-FR'),
      
      // Programme et niveau
      program_name: student.programs?.name || '',
      program_code: student.programs?.code || '',
      level_name: student.academic_levels?.name || '',
      
      // Notes et moyennes
      average_grade: averageGrade.toFixed(2),
      total_subjects: grades.length,
      
      // Informations date
      current_date: currentDate,
      academic_year: new Date().getFullYear(),
      
      // Données supplémentaires
      ...additionalData
    };
  }

  public static async generatePDF(
    templateId: string, 
    studentId: string, 
    additionalData?: any
  ): Promise<{ pdfBlob: Blob; fileName: string }> {
    try {
      // Récupérer toutes les données
      const [template, student, grades] = await Promise.all([
        this.getTemplate(templateId),
        this.getStudentData(studentId),
        this.getStudentGrades(studentId)
      ]);

      // Construire les variables
      const variables = this.buildVariables(student, grades, additionalData);
      
      // Traiter le contenu du template
      const processedContent = this.replaceVariables(template.template_content, variables);

      // Générer le PDF
      const pdf = new jsPDF();
      
      // Configuration de base
      pdf.setFont('helvetica');
      pdf.setFontSize(12);
      
      // En-tête
      pdf.setFontSize(16);
      pdf.text(template.name, 20, 30);
      
      // Contenu principal
      pdf.setFontSize(12);
      const lines = processedContent.split('\n');
      let yPosition = 50;
      
      lines.forEach((line) => {
        if (yPosition > 250) {
          pdf.addPage();
          yPosition = 30;
        }
        pdf.text(line, 20, yPosition);
        yPosition += 7;
      });
      
      // Pied de page
      const pageCount = pdf.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.setFontSize(10);
        pdf.text(`Page ${i}/${pageCount}`, 180, 280);
        pdf.text(`Généré le ${new Date().toLocaleDateString('fr-FR')}`, 20, 280);
      }
      
      // Créer le blob
      const pdfBlob = pdf.output('blob');
      const fileName = `${template.template_type}_${student.student_number}_${Date.now()}.pdf`;
      
      return { pdfBlob, fileName };
      
    } catch (error) {
      console.error('Erreur génération PDF:', error);
      throw error;
    }
  }

  public static async previewHTML(
    templateId: string, 
    studentId: string, 
    additionalData?: any
  ): Promise<string> {
    try {
      const [template, student, grades] = await Promise.all([
        this.getTemplate(templateId),
        this.getStudentData(studentId),
        this.getStudentGrades(studentId)
      ]);

      const variables = this.buildVariables(student, grades, additionalData);
      const processedContent = this.replaceVariables(template.template_content, variables);

      return `
        <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
          <h1 style="text-align: center; color: #333;">${template.name}</h1>
          <div style="white-space: pre-line; line-height: 1.6;">
            ${processedContent}
          </div>
          <hr style="margin: 20px 0;" />
          <p style="font-size: 12px; color: #666;">
            Généré le ${new Date().toLocaleDateString('fr-FR')} pour ${student.profiles?.full_name}
          </p>
        </div>
      `;
    } catch (error) {
      console.error('Erreur prévisualisation:', error);
      throw error;
    }
  }
}