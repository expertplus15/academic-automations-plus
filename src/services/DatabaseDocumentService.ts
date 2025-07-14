import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Student } from '@/hooks/useStudents';
import { Program } from '@/hooks/usePrograms';
import { AcademicYear } from '@/hooks/useAcademicYears';

interface DocumentGenerationData {
  documentType: string;
  student: Student;
  program: Program;
  academicYear: AcademicYear;
}

interface StudentData {
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  student_number: string;
  program_name: string;
  academic_year: string;
}

export class DatabaseDocumentService {
  // Conversion des données de la base vers le format attendu
  private static convertStudentData(data: DocumentGenerationData): StudentData {
    return {
      first_name: data.student.profile.full_name.split(' ')[0] || '',
      last_name: data.student.profile.full_name.split(' ').slice(1).join(' ') || '',
      full_name: data.student.profile.full_name,
      email: data.student.profile.email,
      student_number: data.student.student_number,
      program_name: data.program.name,
      academic_year: data.academicYear.name
    };
  }

  // Templates HTML pour chaque type de document
  private static getDocumentTemplate(documentType: string): string {
    const templates = {
      bulletins: `
        <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; line-height: 1.6;">
          <div style="text-align: center; margin-bottom: 40px; border-bottom: 3px solid #2563eb; padding-bottom: 20px;">
            <h1 style="color: #2563eb; margin-bottom: 10px; font-size: 28px;">BULLETIN DE NOTES</h1>
            <p style="color: #666; font-size: 16px;">Année académique {{academic_year}}</p>
          </div>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 30px;">
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; border-left: 4px solid #2563eb;">
              <h3 style="color: #1e40af; margin-bottom: 15px;">Informations Étudiant</h3>
              <p><strong>Nom complet :</strong> {{full_name}}</p>
              <p><strong>Numéro étudiant :</strong> {{student_number}}</p>
              <p><strong>Email :</strong> {{email}}</p>
            </div>
            
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; border-left: 4px solid #2563eb;">
              <h3 style="color: #1e40af; margin-bottom: 15px;">Programme d'Études</h3>
              <p><strong>Formation :</strong> {{program_name}}</p>
              <p><strong>Année académique :</strong> {{academic_year}}</p>
            </div>
          </div>

          <div style="margin: 30px 0;">
            <h3 style="color: #1e40af; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 2px solid #e5e7eb;">Résultats Académiques</h3>
            <div style="background: #f9fafb; padding: 20px; border-radius: 8px; text-align: center;">
              <p style="color: #6b7280; font-style: italic;">Les notes seront affichées ici une fois le système de notation intégré</p>
              <div style="margin-top: 15px; padding: 15px; background: white; border-radius: 6px; border: 1px solid #e5e7eb;">
                <p><strong>Moyenne générale :</strong> En cours de calcul</p>
                <p><strong>Crédits validés :</strong> En cours de validation</p>
              </div>
            </div>
          </div>
          
          <div style="margin-top: 50px; text-align: right; color: #6b7280;">
            <p>Document généré le {{current_date}}</p>
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p><strong>Le Service Scolarité</strong></p>
            </div>
          </div>
        </div>
      `,

      releves: `
        <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; line-height: 1.6;">
          <div style="text-align: center; margin-bottom: 40px; border-bottom: 3px solid #059669; padding-bottom: 20px;">
            <h1 style="color: #059669; margin-bottom: 10px; font-size: 28px;">RELEVÉ DE NOTES OFFICIEL</h1>
            <p style="color: #666; font-size: 16px;">Année académique {{academic_year}}</p>
          </div>
          
          <div style="margin-bottom: 30px; background: #f0fdf4; padding: 20px; border-radius: 8px; border-left: 4px solid #059669;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px;">
              <div>
                <h3 style="color: #065f46; margin-bottom: 15px;">Identité de l'Étudiant</h3>
                <p><strong>Nom :</strong> {{last_name}}</p>
                <p><strong>Prénom :</strong> {{first_name}}</p>
                <p><strong>N° Étudiant :</strong> {{student_number}}</p>
              </div>
              <div>
                <h3 style="color: #065f46; margin-bottom: 15px;">Formation</h3>
                <p><strong>Programme :</strong> {{program_name}}</p>
                <p><strong>Année :</strong> {{academic_year}}</p>
                <p><strong>Email :</strong> {{email}}</p>
              </div>
            </div>
          </div>

          <div style="margin: 30px 0;">
            <h3 style="color: #065f46; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 2px solid #d1fae5;">Détail des Notes par Semestre</h3>
            
            <div style="background: white; border: 1px solid #d1fae5; border-radius: 8px; overflow: hidden;">
              <div style="background: #ecfdf5; padding: 15px; font-weight: bold; color: #065f46;">
                Semestre 1
              </div>
              <div style="padding: 20px;">
                <table style="width: 100%; border-collapse: collapse;">
                  <thead>
                    <tr style="background: #f9fafb;">
                      <th style="padding: 10px; border: 1px solid #e5e7eb; text-align: left;">Matière</th>
                      <th style="padding: 10px; border: 1px solid #e5e7eb; text-align: center;">Note</th>
                      <th style="padding: 10px; border: 1px solid #e5e7eb; text-align: center;">Crédits</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style="padding: 10px; border: 1px solid #e5e7eb;" colspan="3">
                        <em style="color: #6b7280;">Notes en cours d'intégration depuis la base de données</em>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
          <div style="margin-top: 40px; padding: 20px; background: #f9fafb; border-radius: 8px;">
            <h4 style="color: #374151; margin-bottom: 15px;">Résumé Académique</h4>
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; text-align: center;">
              <div>
                <div style="color: #059669; font-size: 24px; font-weight: bold;">--</div>
                <div style="color: #6b7280; font-size: 14px;">Moyenne Générale</div>
              </div>
              <div>
                <div style="color: #059669; font-size: 24px; font-weight: bold;">--</div>
                <div style="color: #6b7280; font-size: 14px;">Crédits Obtenus</div>
              </div>
              <div>
                <div style="color: #059669; font-size: 24px; font-weight: bold;">--</div>
                <div style="color: #6b7280; font-size: 14px;">Rang de Classe</div>
              </div>
            </div>
          </div>
          
          <div style="margin-top: 50px; text-align: center; color: #6b7280; border-top: 1px solid #e5e7eb; padding-top: 20px;">
            <p>Document officiel généré le {{current_date}}</p>
            <p><strong>Service des Examens et de la Scolarité</strong></p>
          </div>
        </div>
      `,

      attestations: `
        <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; line-height: 1.8;">
          <div style="text-align: center; margin-bottom: 50px;">
            <h1 style="color: #dc2626; margin-bottom: 15px; font-size: 32px; text-transform: uppercase; letter-spacing: 2px;">ATTESTATION DE SCOLARITÉ</h1>
            <div style="width: 100px; height: 4px; background: #dc2626; margin: 15px auto;"></div>
            <p style="color: #666; font-size: 16px; margin-top: 20px;">Année académique {{academic_year}}</p>
          </div>
          
          <div style="margin: 40px 0; text-align: justify; font-size: 16px;">
            <p style="margin-bottom: 30px; font-size: 18px; text-align: center; font-weight: 500;">
              Le Directeur de l'établissement soussigné certifie que :
            </p>
            
            <div style="background: linear-gradient(135deg, #fef2f2, #fca5a5); padding: 30px; border-radius: 12px; border-left: 6px solid #dc2626; margin: 30px 0;">
              <div style="text-align: center; margin-bottom: 25px;">
                <h2 style="color: #991b1b; font-size: 24px; margin-bottom: 5px;">{{full_name}}</h2>
                <p style="color: #7f1d1d; font-size: 16px; font-weight: 500;">Numéro étudiant : {{student_number}}</p>
              </div>
              
              <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                  <div>
                    <p><strong style="color: #991b1b;">Email :</strong> {{email}}</p>
                    <p><strong style="color: #991b1b;">Formation :</strong> {{program_name}}</p>
                  </div>
                  <div>
                    <p><strong style="color: #991b1b;">Année académique :</strong> {{academic_year}}</p>
                    <p><strong style="color: #991b1b;">Statut :</strong> Étudiant régulier</p>
                  </div>
                </div>
              </div>
            </div>
            
            <p style="margin: 30px 0; font-size: 17px; text-align: center; font-weight: 500;">
              Est régulièrement inscrit(e) et suit assidûment les cours dans notre établissement 
              pour l'année académique <strong>{{academic_year}}</strong> dans le programme 
              <strong>{{program_name}}</strong>.
            </p>
            
            <p style="margin: 30px 0; font-size: 16px; text-align: center;">
              Cette attestation est délivrée pour servir et valoir ce que de droit.
            </p>
          </div>
          
          <div style="margin-top: 60px;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 50px;">
              <div style="text-align: center;">
                <p style="color: #666; margin-bottom: 5px;">Fait le</p>
                <p style="font-weight: bold; font-size: 16px;">{{current_date}}</p>
              </div>
              <div style="text-align: center;">
                <p style="color: #666; margin-bottom: 20px;">Le Directeur</p>
                <div style="height: 60px; border-bottom: 1px solid #ccc; margin-bottom: 10px;"></div>
                <p style="font-weight: bold;">Signature et cachet officiel</p>
              </div>
            </div>
          </div>
        </div>
      `,

      divers: `
        <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; line-height: 1.6;">
          <div style="text-align: center; margin-bottom: 40px; border-bottom: 3px solid #7c3aed; padding-bottom: 20px;">
            <h1 style="color: #7c3aed; margin-bottom: 10px; font-size: 28px;">DOCUMENT ADMINISTRATIF</h1>
            <p style="color: #666; font-size: 16px;">Année académique {{academic_year}}</p>
          </div>
          
          <div style="background: #f3f4f6; padding: 30px; border-radius: 8px; border-left: 4px solid #7c3aed; margin-bottom: 30px;">
            <h3 style="color: #5b21b6; margin-bottom: 20px;">Informations de l'Étudiant</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
              <div>
                <p><strong>Nom complet :</strong> {{full_name}}</p>
                <p><strong>Numéro étudiant :</strong> {{student_number}}</p>
                <p><strong>Email :</strong> {{email}}</p>
              </div>
              <div>
                <p><strong>Programme :</strong> {{program_name}}</p>
                <p><strong>Année académique :</strong> {{academic_year}}</p>
                <p><strong>Date d'émission :</strong> {{current_date}}</p>
              </div>
            </div>
          </div>

          <div style="margin: 30px 0; padding: 20px; background: white; border: 1px solid #e5e7eb; border-radius: 8px;">
            <h4 style="color: #374151; margin-bottom: 15px;">Contenu du Document</h4>
            <div style="min-height: 200px; padding: 20px; background: #f9fafb; border-radius: 6px; border: 2px dashed #d1d5db;">
              <p style="color: #6b7280; text-align: center; margin-top: 80px; font-style: italic;">
                Contenu personnalisable selon le type de document requis
              </p>
            </div>
          </div>
          
          <div style="margin-top: 50px; text-align: right; color: #6b7280;">
            <p>Document généré le {{current_date}}</p>
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p><strong>Administration</strong></p>
            </div>
          </div>
        </div>
      `
    };

    return templates[documentType as keyof typeof templates] || templates.divers;
  }

  // Remplace les variables dans le template
  private static replaceVariables(template: string, data: StudentData): string {
    const currentDate = new Date().toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    return template
      .replace(/{{first_name}}/g, data.first_name)
      .replace(/{{last_name}}/g, data.last_name)
      .replace(/{{full_name}}/g, data.full_name)
      .replace(/{{email}}/g, data.email)
      .replace(/{{student_number}}/g, data.student_number)
      .replace(/{{program_name}}/g, data.program_name)
      .replace(/{{academic_year}}/g, data.academic_year)
      .replace(/{{current_date}}/g, currentDate);
  }

  // Génère le HTML du document
  static generateHTML(data: DocumentGenerationData): string {
    const template = this.getDocumentTemplate(data.documentType);
    const studentData = this.convertStudentData(data);
    
    return this.replaceVariables(template, studentData);
  }

  // Ouvre le document dans une nouvelle fenêtre pour impression
  static printDocument(data: DocumentGenerationData): void {
    const htmlContent = this.generateHTML(data);
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Document - ${data.student.profile.full_name}</title>
            <style>
              body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
              @media print {
                body { margin: 0; padding: 10px; }
                @page { margin: 2cm; }
              }
            </style>
          </head>
          <body>
            ${htmlContent}
          </body>
        </html>
      `);
      printWindow.document.close();
      
      setTimeout(() => {
        printWindow.print();
      }, 1000);
    }
  }

  // Génère un PDF
  static async generatePDF(data: DocumentGenerationData): Promise<Blob> {
    try {
      const htmlContent = this.generateHTML(data);
      
      // Créer un élément temporaire pour le rendu
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = htmlContent;
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.width = '800px';
      tempDiv.style.backgroundColor = 'white';
      tempDiv.style.padding = '20px';
      tempDiv.style.fontFamily = 'Arial, sans-serif';
      document.body.appendChild(tempDiv);

      // Attendre que le rendu soit complet
      await new Promise(resolve => setTimeout(resolve, 500));

      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        width: 800,
        height: tempDiv.scrollHeight,
        logging: false,
        allowTaint: true,
        foreignObjectRendering: true
      });
      
      const imgData = canvas.toDataURL('image/png', 1.0);
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Gérer les pages multiples si nécessaire
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Nettoyer l'élément temporaire
      document.body.removeChild(tempDiv);

      return pdf.output('blob');
    } catch (error) {
      console.error('Erreur lors de la génération PDF:', error);
      throw new Error('Impossible de générer le PDF. Veuillez réessayer.');
    }
  }

  // Obtient les types de documents disponibles
  static getAvailableDocumentTypes() {
    return [
      { id: 'bulletins', name: 'Bulletin de Notes', description: 'Document récapitulatif des notes de l\'étudiant' },
      { id: 'releves', name: 'Relevé de Notes', description: 'Document officiel détaillé des résultats' },
      { id: 'attestations', name: 'Attestation de Scolarité', description: 'Certificat de présence et d\'inscription' },
      { id: 'divers', name: 'Document Divers', description: 'Autres documents administratifs' }
    ];
  }
}