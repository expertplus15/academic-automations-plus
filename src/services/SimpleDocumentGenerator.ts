// Service ultra-simplifié pour la génération de documents
// Utilise des templates HTML statiques avec remplacement de variables

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface SimpleStudentData {
  first_name: string;
  last_name: string;
  email: string;
  student_number: string;
  program_name: string;
  academic_year: string;
}

interface SimpleTemplateData {
  id: string;
  name: string;
  html_content: string;
}

export class SimpleDocumentGenerator {
  // Données d'exemple pour éviter les erreurs de base de données
  private static getMockStudentData(): SimpleStudentData {
    return {
      first_name: "Jean",
      last_name: "Dupont",
      email: "jean.dupont@email.com",
      student_number: "STU001",
      program_name: "Informatique",
      academic_year: "2023-2024"
    };
  }

  // Templates HTML simples
  private static getTemplates(): SimpleTemplateData[] {
    return [
      {
        id: "attestation",
        name: "Attestation de Scolarité",
        html_content: `
          <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px;">
            <div style="text-align: center; margin-bottom: 40px;">
              <h1 style="color: #2563eb; margin-bottom: 10px;">ATTESTATION DE SCOLARITÉ</h1>
              <p style="color: #666; font-size: 14px;">Année académique {{academic_year}}</p>
            </div>
            
            <div style="margin-bottom: 30px;">
              <p style="line-height: 1.6; margin-bottom: 20px;">
                Je soussigné, certifie que :
              </p>
              
              <div style="background: #f8fafc; padding: 20px; border-left: 4px solid #2563eb; margin: 20px 0;">
                <p><strong>Nom :</strong> {{last_name}}</p>
                <p><strong>Prénom :</strong> {{first_name}}</p>
                <p><strong>Numéro étudiant :</strong> {{student_number}}</p>
                <p><strong>Email :</strong> {{email}}</p>
                <p><strong>Formation :</strong> {{program_name}}</p>
              </div>
              
              <p style="line-height: 1.6; margin-top: 20px;">
                Est régulièrement inscrit(e) dans notre établissement pour l'année académique {{academic_year}}.
              </p>
            </div>
            
            <div style="margin-top: 50px; text-align: right;">
              <p>Fait le {{current_date}}</p>
              <div style="margin-top: 40px;">
                <p><strong>Le Directeur</strong></p>
                <div style="height: 60px;"></div>
                <p>Signature et cachet</p>
              </div>
            </div>
          </div>
        `
      },
      {
        id: "certificate",
        name: "Certificat de Formation",
        html_content: `
          <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; border: 2px solid #2563eb;">
            <div style="text-align: center; margin-bottom: 40px;">
              <h1 style="color: #2563eb; font-size: 28px; margin-bottom: 10px;">CERTIFICAT DE FORMATION</h1>
              <div style="width: 100px; height: 3px; background: #2563eb; margin: 10px auto;"></div>
            </div>
            
            <div style="text-align: center; margin: 40px 0;">
              <p style="font-size: 18px; margin-bottom: 20px;">Nous certifions que</p>
              <h2 style="color: #1e40af; font-size: 24px; margin: 20px 0;">{{first_name}} {{last_name}}</h2>
              <p style="font-size: 16px; margin-bottom: 30px;">
                a suivi avec succès la formation en <strong>{{program_name}}</strong>
              </p>
            </div>
            
            <div style="background: #f8fafc; padding: 20px; margin: 30px 0; text-align: center;">
              <p><strong>Numéro étudiant :</strong> {{student_number}}</p>
              <p><strong>Année académique :</strong> {{academic_year}}</p>
              <p><strong>Email :</strong> {{email}}</p>
            </div>
            
            <div style="margin-top: 50px; display: flex; justify-content: space-between;">
              <div style="text-align: center;">
                <p>Date d'émission</p>
                <p><strong>{{current_date}}</strong></p>
              </div>
              <div style="text-align: center;">
                <p>Signature</p>
                <div style="height: 40px;"></div>
                <p>Direction</p>
              </div>
            </div>
          </div>
        `
      }
    ];
  }

  // Remplace les variables dans le template
  private static replaceVariables(template: string, data: SimpleStudentData): string {
    const currentDate = new Date().toLocaleDateString('fr-FR');
    
    return template
      .replace(/{{first_name}}/g, data.first_name)
      .replace(/{{last_name}}/g, data.last_name)
      .replace(/{{email}}/g, data.email)
      .replace(/{{student_number}}/g, data.student_number)
      .replace(/{{program_name}}/g, data.program_name)
      .replace(/{{academic_year}}/g, data.academic_year)
      .replace(/{{current_date}}/g, currentDate);
  }

  // Génère le HTML du document
  static generateHTML(templateId: string, studentData?: Partial<SimpleStudentData>): string {
    const templates = this.getTemplates();
    const template = templates.find(t => t.id === templateId);
    
    if (!template) {
      throw new Error(`Template ${templateId} non trouvé`);
    }

    // Utilise les données fournies ou les données mock
    const data = { ...this.getMockStudentData(), ...studentData };
    
    return this.replaceVariables(template.html_content, data);
  }

  // Ouvre le document dans une nouvelle fenêtre pour impression
  static printDocument(templateId: string, studentData?: Partial<SimpleStudentData>): void {
    const htmlContent = this.generateHTML(templateId, studentData);
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Document</title>
            <style>
              body { margin: 0; padding: 20px; }
              @media print {
                body { margin: 0; }
              }
            </style>
          </head>
          <body>
            ${htmlContent}
          </body>
        </html>
      `);
      printWindow.document.close();
      
      // Attendre un peu puis lancer l'impression
      setTimeout(() => {
        printWindow.print();
      }, 1000);
    }
  }

  // Génère un PDF (version simplifiée)
  static async generatePDF(templateId: string, studentData?: Partial<SimpleStudentData>): Promise<Blob> {
    try {
      const htmlContent = this.generateHTML(templateId, studentData);
      
      // Créer un élément temporaire pour le rendu
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = htmlContent;
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.width = '800px';
      tempDiv.style.backgroundColor = 'white';
      tempDiv.style.padding = '20px';
      document.body.appendChild(tempDiv);

      // Attendre un peu pour que le rendu soit complet
      await new Promise(resolve => setTimeout(resolve, 100));

      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        width: 800,
        height: tempDiv.scrollHeight
      });
      
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let position = 0;
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);

      // Nettoyer l'élément temporaire
      document.body.removeChild(tempDiv);

      return pdf.output('blob');
    } catch (error) {
      console.error('Erreur lors de la génération PDF:', error);
      throw new Error('Impossible de générer le PDF');
    }
  }

  // Obtient la liste des templates disponibles
  static getAvailableTemplates(): SimpleTemplateData[] {
    return this.getTemplates();
  }
}