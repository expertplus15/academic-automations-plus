// Service ultra-simplifié pour la génération de documents
// Utilise les nouveaux templates améliorés avec TemplateRenderer

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { TemplateRenderer, getDefaultDataForTemplate } from '@/components/documents/templates/predefined/TemplateRenderer';
import { createRoot } from 'react-dom/client';

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

  // Templates HTML améliorés utilisant TemplateRenderer
  private static getTemplates(): SimpleTemplateData[] {
    return [
      {
        id: "attestation_scolarite",
        name: "Attestation de Scolarité",
        html_content: "TEMPLATE_RENDERER:attestation"
      },
      {
        id: "bulletin_notes", 
        name: "Bulletin de Notes",
        html_content: "TEMPLATE_RENDERER:bulletin"
      },
      {
        id: "certificat_formation",
        name: "Certificat de Formation", 
        html_content: "TEMPLATE_RENDERER:certificat"
      },
      {
        id: "releve_notes",
        name: "Relevé de Notes EMD",
        html_content: "TEMPLATE_RENDERER:emd_releve"
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

  // Génère le HTML du document avec les nouveaux templates
  static generateHTML(templateId: string, studentData?: Partial<SimpleStudentData>): string {
    const templates = this.getTemplates();
    const template = templates.find(t => t.id === templateId);
    
    if (!template) {
      throw new Error(`Template ${templateId} non trouvé`);
    }

    // Utilise les données fournies ou les données mock
    const data = { ...this.getMockStudentData(), ...studentData };
    
    // Si c'est un template utilisant TemplateRenderer
    if (template.html_content.startsWith('TEMPLATE_RENDERER:')) {
      const templateType = template.html_content.replace('TEMPLATE_RENDERER:', '');
      return this.renderTemplateToHTML(templateType, data);
    }
    
    return this.replaceVariables(template.html_content, data);
  }

  // Rend un template React en HTML statique  
  private static renderTemplateToHTML(templateType: string, data: SimpleStudentData): string {
    // Pour l'instant, utiliser les templates HTML statiques avec un mapping
    const templateMapping: { [key: string]: string } = {
      'attestation': 'attestation',
      'bulletin': 'bulletin_notes',  
      'certificat': 'certificat_formation',
      'emd_releve': 'releve_notes'
    };

    // Fallback: utiliser les templates par défaut améliorés
    const defaultTemplates = this.getDefaultTemplates();
    const mappedType = templateMapping[templateType] || templateType;
    const defaultTemplate = defaultTemplates.find(t => t.id === mappedType || t.id === templateType);
    
    if (defaultTemplate) {
      return this.replaceVariables(defaultTemplate.html_content, data);
    }
    
    // Utiliser le template attestation par défaut si aucun autre n'est trouvé
    const fallbackTemplate = defaultTemplates[0];
    if (fallbackTemplate) {
      return this.replaceVariables(fallbackTemplate.html_content, data);
    }
    
    throw new Error(`Template ${templateType} non supporté`);
  }

  // Convertit les données SimpleStudentData vers le format TemplateRenderer
  private static convertToTemplateData(templateType: string, data: SimpleStudentData): any {
    const defaultData = getDefaultDataForTemplate(templateType);
    
    // Créer la structure étudiant
    const studentData = {
      full_name: `${data.first_name} ${data.last_name}`,
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      student_number: data.student_number,
      program: data.program_name
    };

    // Fusionner avec les données par défaut en gérant les types
    const result = {
      ...defaultData,
      academic_year: data.academic_year,
      current_date: new Date().toLocaleDateString('fr-FR')
    };

    // Assigner les données étudiant de manière sûre
    if (typeof result === 'object' && result !== null) {
      (result as any).student = {
        ...(defaultData as any)?.student,
        ...studentData
      };
    }
    
    return result;
  }

  // Templates par défaut améliorés
  private static getDefaultTemplates() {
    return [
      {
        id: "attestation",
        name: "Attestation de Scolarité",
        html_content: `
          <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; background: white;">
            <div style="text-align: center; margin-bottom: 40px; padding: 20px; border-bottom: 3px solid hsl(221, 83%, 53%);">
              <div style="color: hsl(221, 83%, 53%); font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">
                RÉPUBLIQUE FRANÇAISE
              </div>
              <h1 style="color: hsl(222, 84%, 55%); font-size: 28px; font-weight: 700; margin: 0; text-transform: uppercase; letter-spacing: 2px;">
                ATTESTATION DE SCOLARITÉ
              </h1>
              <div style="color: hsl(215, 25%, 27%); font-size: 14px; margin-top: 12px; font-weight: 500;">
                Année académique {{academic_year}}
              </div>
            </div>
            
            <div style="margin-bottom: 30px;">
              <p style="line-height: 1.8; margin-bottom: 24px; color: hsl(215, 25%, 27%); font-size: 16px;">
                Je soussigné, <strong>Directeur de l'Établissement</strong>, certifie que :
              </p>
              
              <div style="background: linear-gradient(135deg, hsl(210, 40%, 98%) 0%, hsl(220, 43%, 97%) 100%); padding: 24px; border-left: 5px solid hsl(221, 83%, 53%); margin: 24px 0; border-radius: 0 8px 8px 0; box-shadow: 0 2px 8px hsla(221, 83%, 53%, 0.08);">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
                  <div>
                    <div style="color: hsl(215, 25%, 27%); font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Nom de famille</div>
                    <div style="color: hsl(222, 84%, 55%); font-size: 18px; font-weight: 700;">{{last_name}}</div>
                  </div>
                  <div>
                    <div style="color: hsl(215, 25%, 27%); font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Prénom(s)</div>
                    <div style="color: hsl(222, 84%, 55%); font-size: 18px; font-weight: 700;">{{first_name}}</div>
                  </div>
                </div>
                <div style="border-top: 1px solid hsl(214, 32%, 91%); padding-top: 16px;">
                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                    <div>
                      <div style="color: hsl(215, 25%, 27%); font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">N° Étudiant</div>
                      <div style="color: hsl(222, 84%, 55%); font-size: 16px; font-weight: 600;">{{student_number}}</div>
                    </div>
                    <div>
                      <div style="color: hsl(215, 25%, 27%); font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Formation</div>
                      <div style="color: hsl(222, 84%, 55%); font-size: 16px; font-weight: 600;">{{program_name}}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <p style="line-height: 1.8; margin-top: 24px; color: hsl(215, 25%, 27%); font-size: 16px; text-align: justify;">
                est régulièrement inscrit(e) et assidu(e) dans notre établissement pour l'année académique <strong>{{academic_year}}</strong> 
                dans la formation susmentionnée. Cette attestation est délivrée pour servir et valoir ce que de droit.
              </p>
            </div>
            
            <div style="margin-top: 60px; display: flex; justify-content: space-between; align-items: flex-start;">
              <div style="text-align: left;">
                <div style="color: hsl(215, 25%, 27%); font-size: 14px; margin-bottom: 8px;">
                  Fait à [Ville], le {{current_date}}
                </div>
              </div>
              <div style="text-align: center; min-width: 200px;">
                <div style="color: hsl(215, 25%, 27%); font-size: 14px; font-weight: 600; margin-bottom: 60px;">
                  Le Directeur
                </div>
                <div style="border-top: 1px solid hsl(215, 25%, 27%); padding-top: 8px; font-size: 12px; color: hsl(215, 16%, 47%);">
                  Signature et cachet de l'établissement
                </div>
              </div>
            </div>
          </div>
        `
      },
      {
        id: "bulletin_notes",
        name: "Bulletin de Notes",
        html_content: `
          <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; background: white;">
            <div style="text-align: center; margin-bottom: 40px; padding: 20px; border-bottom: 3px solid hsl(142, 76%, 36%);">
              <div style="color: hsl(142, 76%, 36%); font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">
                ÉTABLISSEMENT SCOLAIRE
              </div>
              <h1 style="color: hsl(142, 76%, 36%); font-size: 28px; font-weight: 700; margin: 0; text-transform: uppercase; letter-spacing: 2px;">
                BULLETIN DE NOTES
              </h1>
              <div style="color: hsl(215, 25%, 27%); font-size: 14px; margin-top: 12px; font-weight: 500;">
                {{first_name}} {{last_name}} - {{academic_year}}
              </div>
            </div>
            
            <div style="background: linear-gradient(135deg, hsl(210, 40%, 98%) 0%, hsl(220, 43%, 97%) 100%); padding: 24px; border-radius: 8px; margin-bottom: 30px;">
              <h3 style="color: hsl(142, 76%, 36%); margin: 0 0 16px 0; font-size: 18px;">Informations Étudiant</h3>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                <div>
                  <div style="color: hsl(215, 25%, 27%); font-size: 13px; font-weight: 600; margin-bottom: 4px;">Numéro étudiant</div>
                  <div style="color: hsl(222, 84%, 55%); font-size: 16px; font-weight: 600;">{{student_number}}</div>
                </div>
                <div>
                  <div style="color: hsl(215, 25%, 27%); font-size: 13px; font-weight: 600; margin-bottom: 4px;">Formation</div>
                  <div style="color: hsl(222, 84%, 55%); font-size: 16px; font-weight: 600;">{{program_name}}</div>
                </div>
              </div>
            </div>

            <div style="margin-bottom: 30px;">
              <h3 style="color: hsl(142, 76%, 36%); margin: 0 0 16px 0; font-size: 18px;">Résultats Scolaires</h3>
              <table style="width: 100%; border-collapse: collapse; margin: 20px 0; box-shadow: 0 2px 8px hsla(0, 0%, 0%, 0.1);">
                <thead>
                  <tr style="background: linear-gradient(135deg, hsl(142, 76%, 36%) 0%, hsl(142, 76%, 30%) 100%); color: white;">
                    <th style="border: 1px solid hsl(142, 76%, 36%); padding: 12px; text-align: left; font-weight: 600;">Matière</th>
                    <th style="border: 1px solid hsl(142, 76%, 36%); padding: 12px; text-align: center; font-weight: 600;">Coef.</th>
                    <th style="border: 1px solid hsl(142, 76%, 36%); padding: 12px; text-align: center; font-weight: 600;">Note</th>
                    <th style="border: 1px solid hsl(142, 76%, 36%); padding: 12px; text-align: center; font-weight: 600;">Appréciation</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style="background: hsl(210, 40%, 98%);">
                    <td style="border: 1px solid hsl(214, 32%, 91%); padding: 12px; font-weight: 500;">Mathématiques</td>
                    <td style="border: 1px solid hsl(214, 32%, 91%); padding: 12px; text-align: center;">3</td>
                    <td style="border: 1px solid hsl(214, 32%, 91%); padding: 12px; text-align: center; font-weight: 600; color: hsl(142, 76%, 36%);">16.5/20</td>
                    <td style="border: 1px solid hsl(214, 32%, 91%); padding: 12px; font-style: italic;">Très bon niveau</td>
                  </tr>
                  <tr>
                    <td style="border: 1px solid hsl(214, 32%, 91%); padding: 12px; font-weight: 500;">Informatique</td>
                    <td style="border: 1px solid hsl(214, 32%, 91%); padding: 12px; text-align: center;">4</td>
                    <td style="border: 1px solid hsl(214, 32%, 91%); padding: 12px; text-align: center; font-weight: 600; color: hsl(142, 76%, 36%);">18/20</td>
                    <td style="border: 1px solid hsl(214, 32%, 91%); padding: 12px; font-style: italic;">Excellent travail</td>
                  </tr>
                  <tr style="background: hsl(210, 40%, 98%);">
                    <td style="border: 1px solid hsl(214, 32%, 91%); padding: 12px; font-weight: 500;">Physique</td>
                    <td style="border: 1px solid hsl(214, 32%, 91%); padding: 12px; text-align: center;">2</td>
                    <td style="border: 1px solid hsl(214, 32%, 91%); padding: 12px; text-align: center; font-weight: 600; color: hsl(142, 76%, 36%);">14/20</td>
                    <td style="border: 1px solid hsl(214, 32%, 91%); padding: 12px; font-style: italic;">Bien</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr style="background: linear-gradient(135deg, hsl(142, 76%, 36%) 0%, hsl(142, 76%, 30%) 100%); color: white; font-weight: 600;">
                    <td style="border: 1px solid hsl(142, 76%, 36%); padding: 12px;">MOYENNE GÉNÉRALE</td>
                    <td style="border: 1px solid hsl(142, 76%, 36%); padding: 12px; text-align: center;">-</td>
                    <td style="border: 1px solid hsl(142, 76%, 36%); padding: 12px; text-align: center; font-size: 18px;">16.2/20</td>
                    <td style="border: 1px solid hsl(142, 76%, 36%); padding: 12px; text-align: center;">MENTION BIEN</td>
                  </tr>
                </tfoot>
              </table>
            </div>
            
            <div style="margin-top: 40px; display: flex; justify-content: space-between; align-items: flex-start;">
              <div style="text-align: left;">
                <div style="color: hsl(215, 25%, 27%); font-size: 14px; margin-bottom: 8px;">
                  Bulletin émis le {{current_date}}
                </div>
              </div>
              <div style="text-align: center; min-width: 200px;">
                <div style="color: hsl(215, 25%, 27%); font-size: 14px; font-weight: 600; margin-bottom: 60px;">
                  Le Directeur des Études
                </div>
                <div style="border-top: 1px solid hsl(215, 25%, 27%); padding-top: 8px; font-size: 12px; color: hsl(215, 16%, 47%);">
                  Signature et cachet
                </div>
              </div>
            </div>
          </div>
        `
      },
      {
        id: "certificat_formation", 
        name: "Certificat de Formation",
        html_content: `
          <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; background: white; border: 3px solid hsl(47, 96%, 53%); border-radius: 12px;">
            <div style="text-align: center; margin-bottom: 40px;">
              <div style="color: hsl(47, 96%, 53%); font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">
                CERTIFICAT OFFICIEL
              </div>
              <h1 style="color: hsl(47, 96%, 53%); font-size: 32px; font-weight: 700; margin: 0; text-transform: uppercase; letter-spacing: 3px; text-shadow: 2px 2px 4px hsla(0, 0%, 0%, 0.1);">
                CERTIFICAT DE FORMATION
              </h1>
              <div style="width: 150px; height: 4px; background: linear-gradient(90deg, hsl(47, 96%, 53%) 0%, hsl(47, 96%, 45%) 100%); margin: 20px auto; border-radius: 2px;"></div>
            </div>
            
            <div style="text-align: center; margin: 50px 0; padding: 30px; background: linear-gradient(135deg, hsl(47, 96%, 98%) 0%, hsl(47, 96%, 95%) 100%); border-radius: 12px; border: 1px solid hsl(47, 96%, 80%);">
              <p style="font-size: 20px; margin-bottom: 25px; color: hsl(215, 25%, 27%); line-height: 1.5;">
                Il est certifié que
              </p>
              <h2 style="color: hsl(47, 96%, 35%); font-size: 28px; margin: 25px 0; font-weight: 700; text-transform: uppercase; letter-spacing: 2px;">
                {{first_name}} {{last_name}}
              </h2>
              <p style="font-size: 18px; margin-bottom: 20px; color: hsl(215, 25%, 27%); line-height: 1.6;">
                a suivi avec <strong style="color: hsl(47, 96%, 35%);">succès et distinction</strong> la formation complète en
              </p>
              <div style="background: white; padding: 15px; border-radius: 8px; margin: 20px 0; border: 2px solid hsl(47, 96%, 53%);">
                <h3 style="color: hsl(47, 96%, 35%); font-size: 22px; margin: 0; font-weight: 700;">{{program_name}}</h3>
              </div>
            </div>
            
            <div style="background: linear-gradient(135deg, hsl(210, 40%, 98%) 0%, hsl(220, 43%, 97%) 100%); padding: 20px; margin: 30px 0; border-radius: 8px; border-left: 5px solid hsl(47, 96%, 53%);">
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; text-align: center;">
                <div>
                  <div style="color: hsl(215, 25%, 27%); font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">Numéro d'étudiant</div>
                  <div style="color: hsl(47, 96%, 35%); font-size: 18px; font-weight: 700;">{{student_number}}</div>
                </div>
                <div>
                  <div style="color: hsl(215, 25%, 27%); font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">Année académique</div>
                  <div style="color: hsl(47, 96%, 35%); font-size: 18px; font-weight: 700;">{{academic_year}}</div>
                </div>
              </div>
            </div>
            
            <div style="margin-top: 60px; display: flex; justify-content: space-between; align-items: flex-start;">
              <div style="text-align: center;">
                <div style="color: hsl(215, 25%, 27%); font-size: 14px; font-weight: 600; margin-bottom: 8px;">
                  Date de délivrance
                </div>
                <div style="color: hsl(47, 96%, 35%); font-size: 16px; font-weight: 700;">{{current_date}}</div>
              </div>
              <div style="text-align: center; min-width: 200px;">
                <div style="color: hsl(215, 25%, 27%); font-size: 14px; font-weight: 600; margin-bottom: 60px;">
                  Le Directeur de Formation
                </div>
                <div style="border-top: 2px solid hsl(47, 96%, 53%); padding-top: 8px; font-size: 12px; color: hsl(215, 16%, 47%); font-weight: 600;">
                  Signature officielle et sceau
                </div>
              </div>
            </div>
          </div>
        `
      }
    ];
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

      // Nettoyer l'élément temporaire de manière sécurisée
      try {
        if (document.body.contains(tempDiv)) {
          document.body.removeChild(tempDiv);
        }
      } catch (error) {
        console.warn('Erreur lors du nettoyage DOM:', error);
      }

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