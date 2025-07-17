// Service pour créer des templates prédéfinis riches et professionnels

import { DocumentTemplate } from '@/hooks/useDocumentTemplates';

export interface DefaultTemplateConfig {
  name: string;
  description: string;
  template_type: string;
  elements: Array<{
    id: string;
    type: string;
    label: string;
    content: string;
    style: {
      fontSize?: number;
      fontWeight?: string;
      color?: string;
      textAlign?: string;
      marginTop?: number;
      marginBottom?: number;
    };
  }>;
}

export class DefaultTemplateService {
  static getDefaultTemplates(): DefaultTemplateConfig[] {
    return [
      {
        name: "Attestation de Scolarité",
        description: "Attestation officielle de scolarité pour un étudiant",
        template_type: "attestation",
        elements: [
          {
            id: "institution_header",
            type: "header",
            label: "En-tête établissement",
            content: "ÉTABLISSEMENT D'ENSEIGNEMENT SUPÉRIEUR",
            style: {
              fontSize: 24,
              fontWeight: "bold",
              color: "#1e40af",
              textAlign: "center",
              marginBottom: 32
            }
          },
          {
            id: "document_title",
            type: "title",
            label: "Titre du document",
            content: "ATTESTATION DE SCOLARITÉ",
            style: {
              fontSize: 20,
              fontWeight: "bold",
              color: "#1f2937",
              textAlign: "center",
              marginBottom: 24
            }
          },
          {
            id: "academic_year",
            type: "text",
            label: "Année académique",
            content: "Année académique {{academic_year}}",
            style: {
              fontSize: 14,
              fontWeight: "normal",
              color: "#6b7280",
              textAlign: "center",
              marginBottom: 32
            }
          },
          {
            id: "certification_text",
            type: "text",
            label: "Texte de certification",
            content: "Je soussigné, certifie que :",
            style: {
              fontSize: 16,
              fontWeight: "normal",
              color: "#374151",
              textAlign: "left",
              marginBottom: 24
            }
          },
          {
            id: "student_info_header",
            type: "text",
            label: "Informations étudiant",
            content: "INFORMATIONS DE L'ÉTUDIANT",
            style: {
              fontSize: 14,
              fontWeight: "bold",
              color: "#1f2937",
              textAlign: "left",
              marginBottom: 16
            }
          },
          {
            id: "student_name",
            type: "variable",
            label: "Nom complet",
            content: "Nom : {{student.full_name}}",
            style: {
              fontSize: 14,
              fontWeight: "normal",
              color: "#374151",
              textAlign: "left",
              marginBottom: 8
            }
          },
          {
            id: "student_number",
            type: "variable",
            label: "Numéro étudiant",
            content: "Numéro étudiant : {{student.student_number}}",
            style: {
              fontSize: 14,
              fontWeight: "normal",
              color: "#374151",
              textAlign: "left",
              marginBottom: 8
            }
          },
          {
            id: "student_program",
            type: "variable",
            label: "Formation",
            content: "Formation : {{student.program_name}}",
            style: {
              fontSize: 14,
              fontWeight: "normal",
              color: "#374151",
              textAlign: "left",
              marginBottom: 24
            }
          },
          {
            id: "enrollment_confirmation",
            type: "text",
            label: "Confirmation d'inscription",
            content: "Est régulièrement inscrit(e) dans notre établissement pour l'année académique {{academic_year}}.",
            style: {
              fontSize: 16,
              fontWeight: "normal",
              color: "#374151",
              textAlign: "left",
              marginBottom: 48
            }
          },
          {
            id: "date_signature",
            type: "text",
            label: "Date et signature",
            content: "Fait le {{current_date}}",
            style: {
              fontSize: 14,
              fontWeight: "normal",
              color: "#374151",
              textAlign: "right",
              marginBottom: 24
            }
          },
          {
            id: "signature_space",
            type: "signature",
            label: "Espace signature",
            content: "Le Directeur\n\n\nSignature et cachet",
            style: {
              fontSize: 14,
              fontWeight: "normal",
              color: "#374151",
              textAlign: "right",
              marginTop: 32
            }
          }
        ]
      },
      {
        name: "Certificat de Formation",
        description: "Certificat officiel attestant de la réussite d'une formation",
        template_type: "certificate",
        elements: [
          {
            id: "certificate_header",
            type: "header",
            label: "En-tête certificat",
            content: "CERTIFICAT DE FORMATION",
            style: {
              fontSize: 28,
              fontWeight: "bold",
              color: "#dc2626",
              textAlign: "center",
              marginBottom: 16
            }
          },
          {
            id: "decoration_line",
            type: "separator",
            label: "Ligne de décoration",
            content: "═══════════════════════════════════════",
            style: {
              fontSize: 16,
              fontWeight: "bold",
              color: "#dc2626",
              textAlign: "center",
              marginBottom: 32
            }
          },
          {
            id: "certification_intro",
            type: "text",
            label: "Introduction certification",
            content: "Nous certifions que",
            style: {
              fontSize: 18,
              fontWeight: "normal",
              color: "#374151",
              textAlign: "center",
              marginBottom: 24
            }
          },
          {
            id: "student_name_certificate",
            type: "variable",
            label: "Nom de l'étudiant",
            content: "{{student.full_name}}",
            style: {
              fontSize: 24,
              fontWeight: "bold",
              color: "#1e40af",
              textAlign: "center",
              marginBottom: 24
            }
          },
          {
            id: "formation_text",
            type: "variable",
            label: "Texte formation",
            content: "a suivi avec succès la formation en\n{{student.program_name}}",
            style: {
              fontSize: 16,
              fontWeight: "normal",
              color: "#374151",
              textAlign: "center",
              marginBottom: 32
            }
          },
          {
            id: "student_details_box",
            type: "text",
            label: "Détails étudiant",
            content: "DÉTAILS DE LA FORMATION",
            style: {
              fontSize: 14,
              fontWeight: "bold",
              color: "#1f2937",
              textAlign: "center",
              marginBottom: 16
            }
          },
          {
            id: "student_number_cert",
            type: "variable",
            label: "Numéro étudiant",
            content: "Numéro étudiant : {{student.student_number}}",
            style: {
              fontSize: 14,
              fontWeight: "normal",
              color: "#374151",
              textAlign: "center",
              marginBottom: 8
            }
          },
          {
            id: "academic_year_cert",
            type: "variable",
            label: "Année académique",
            content: "Année académique : {{academic_year}}",
            style: {
              fontSize: 14,
              fontWeight: "normal",
              color: "#374151",
              textAlign: "center",
              marginBottom: 48
            }
          },
          {
            id: "issue_date",
            type: "variable",
            label: "Date d'émission",
            content: "Date d'émission : {{current_date}}",
            style: {
              fontSize: 14,
              fontWeight: "normal",
              color: "#374151",
              textAlign: "left",
              marginBottom: 24
            }
          },
          {
            id: "authority_signature",
            type: "signature",
            label: "Signature autorité",
            content: "Direction des Études\n\n\nSignature et sceau officiel",
            style: {
              fontSize: 14,
              fontWeight: "normal",
              color: "#374151",
              textAlign: "right",
              marginTop: 32
            }
          }
        ]
      },
      {
        name: "Bulletin de Notes",
        description: "Bulletin de notes détaillé pour un semestre",
        template_type: "bulletin",
        elements: [
          {
            id: "school_header",
            type: "header",
            label: "En-tête école",
            content: "BULLETIN DE NOTES",
            style: {
              fontSize: 24,
              fontWeight: "bold",
              color: "#059669",
              textAlign: "center",
              marginBottom: 24
            }
          },
          {
            id: "semester_info",
            type: "text",
            label: "Informations semestre",
            content: "Semestre 1 - Année {{academic_year}}",
            style: {
              fontSize: 16,
              fontWeight: "normal",
              color: "#6b7280",
              textAlign: "center",
              marginBottom: 32
            }
          },
          {
            id: "student_section",
            type: "text",
            label: "Section étudiant",
            content: "INFORMATIONS ÉTUDIANT",
            style: {
              fontSize: 16,
              fontWeight: "bold",
              color: "#1f2937",
              textAlign: "left",
              marginBottom: 16
            }
          },
          {
            id: "student_full_name",
            type: "variable",
            label: "Nom et prénom",
            content: "Étudiant(e) : {{student.full_name}}",
            style: {
              fontSize: 14,
              fontWeight: "normal",
              color: "#374151",
              textAlign: "left",
              marginBottom: 8
            }
          },
          {
            id: "student_id",
            type: "variable",
            label: "Identifiant",
            content: "N° Étudiant : {{student.student_number}}",
            style: {
              fontSize: 14,
              fontWeight: "normal",
              color: "#374151",
              textAlign: "left",
              marginBottom: 8
            }
          },
          {
            id: "student_program_bulletin",
            type: "variable",
            label: "Programme d'études",
            content: "Formation : {{student.program_name}}",
            style: {
              fontSize: 14,
              fontWeight: "normal",
              color: "#374151",
              textAlign: "left",
              marginBottom: 24
            }
          },
          {
            id: "grades_section",
            type: "text",
            label: "Section notes",
            content: "RÉSULTATS ACADÉMIQUES",
            style: {
              fontSize: 16,
              fontWeight: "bold",
              color: "#1f2937",
              textAlign: "left",
              marginBottom: 16
            }
          },
          {
            id: "grades_placeholder",
            type: "text",
            label: "Notes à remplir",
            content: "[Tableau des notes sera généré automatiquement]\n\nMoyenne générale : [À calculer]\nMention : [À déterminer selon la moyenne]",
            style: {
              fontSize: 14,
              fontWeight: "normal",
              color: "#6b7280",
              textAlign: "left",
              marginBottom: 32
            }
          },
          {
            id: "comments_section",
            type: "text",
            label: "Section commentaires",
            content: "OBSERVATIONS",
            style: {
              fontSize: 16,
              fontWeight: "bold",
              color: "#1f2937",
              textAlign: "left",
              marginBottom: 16
            }
          },
          {
            id: "comments_placeholder",
            type: "text",
            label: "Commentaires",
            content: "L'étudiant(e) a montré un engagement satisfaisant durant ce semestre.",
            style: {
              fontSize: 14,
              fontWeight: "normal",
              color: "#374151",
              textAlign: "left",
              marginBottom: 32
            }
          },
          {
            id: "bulletin_date",
            type: "variable",
            label: "Date du bulletin",
            content: "Édité le {{current_date}}",
            style: {
              fontSize: 12,
              fontWeight: "normal",
              color: "#6b7280",
              textAlign: "right",
              marginBottom: 16
            }
          },
          {
            id: "academic_signature",
            type: "signature",
            label: "Signature académique",
            content: "Le Responsable Pédagogique\n\n\n_________________________",
            style: {
              fontSize: 14,
              fontWeight: "normal",
              color: "#374151",
              textAlign: "right"
            }
          }
        ]
      },
      {
        name: "Relevé de Notes",
        description: "Relevé officiel des notes et crédits obtenus",
        template_type: "transcript",
        elements: [
          {
            id: "transcript_header",
            type: "header",
            label: "En-tête relevé",
            content: "RELEVÉ DE NOTES OFFICIEL",
            style: {
              fontSize: 22,
              fontWeight: "bold",
              color: "#7c3aed",
              textAlign: "center",
              marginBottom: 24
            }
          },
          {
            id: "official_subtitle",
            type: "text",
            label: "Sous-titre officiel",
            content: "Document officiel - Ne peut être reproduit sans autorisation",
            style: {
              fontSize: 12,
              fontWeight: "normal",
              color: "#6b7280",
              textAlign: "center",
              marginBottom: 32
            }
          },
          {
            id: "student_identity",
            type: "text",
            label: "Identité étudiant",
            content: "IDENTITÉ DE L'ÉTUDIANT",
            style: {
              fontSize: 16,
              fontWeight: "bold",
              color: "#1f2937",
              textAlign: "left",
              marginBottom: 16
            }
          },
          {
            id: "name_transcript",
            type: "variable",
            label: "Nom",
            content: "Nom et Prénom : {{student.full_name}}",
            style: {
              fontSize: 14,
              fontWeight: "normal",
              color: "#374151",
              textAlign: "left",
              marginBottom: 8
            }
          },
          {
            id: "number_transcript",
            type: "variable",
            label: "Numéro",
            content: "Numéro d'inscription : {{student.student_number}}",
            style: {
              fontSize: 14,
              fontWeight: "normal",
              color: "#374151",
              textAlign: "left",
              marginBottom: 8
            }
          },
          {
            id: "program_transcript",
            type: "variable",
            label: "Programme",
            content: "Formation suivie : {{student.program_name}}",
            style: {
              fontSize: 14,
              fontWeight: "normal",
              color: "#374151",
              textAlign: "left",
              marginBottom: 8
            }
          },
          {
            id: "period_transcript",
            type: "variable",
            label: "Période",
            content: "Période : {{academic_year}}",
            style: {
              fontSize: 14,
              fontWeight: "normal",
              color: "#374151",
              textAlign: "left",
              marginBottom: 32
            }
          },
          {
            id: "academic_results",
            type: "text",
            label: "Résultats académiques",
            content: "RÉSULTATS ACADÉMIQUES DÉTAILLÉS",
            style: {
              fontSize: 16,
              fontWeight: "bold",
              color: "#1f2937",
              textAlign: "left",
              marginBottom: 16
            }
          },
          {
            id: "results_table",
            type: "text",
            label: "Tableau des résultats",
            content: "Matière                    | Note | Coeff. | ECTS | Mention\n" +
                     "─────────────────────────────────────────────────────────\n" +
                     "[Les notes seront remplies automatiquement]\n" +
                     "─────────────────────────────────────────────────────────\n" +
                     "TOTAL ECTS OBTENUS : [XX] / [XX]",
            style: {
              fontSize: 12,
              fontWeight: "normal",
              color: "#374151",
              textAlign: "left",
              marginBottom: 32
            }
          },
          {
            id: "legend",
            type: "text",
            label: "Légende",
            content: "Échelle de notation : 0-20 | Mention : TB (≥16), B (≥14), AB (≥12), P (≥10)",
            style: {
              fontSize: 10,
              fontWeight: "normal",
              color: "#6b7280",
              textAlign: "left",
              marginBottom: 32
            }
          },
          {
            id: "issue_info",
            type: "text",
            label: "Informations d'émission",
            content: "Document émis le {{current_date}}",
            style: {
              fontSize: 12,
              fontWeight: "normal",
              color: "#6b7280",
              textAlign: "left",
              marginBottom: 16
            }
          },
          {
            id: "registrar_signature",
            type: "signature",
            label: "Signature secrétariat",
            content: "Le Secrétaire Général\n\n\nSignature et cachet officiel",
            style: {
              fontSize: 14,
              fontWeight: "normal",
              color: "#374151",
              textAlign: "right"
            }
          }
        ]
      }
    ];
  }

  static createTemplateFromConfig(config: DefaultTemplateConfig): Omit<DocumentTemplate, 'id' | 'created_at' | 'updated_at'> {
    return {
      name: config.name,
      code: config.name.toLowerCase().replace(/\s+/g, '_'),
      description: config.description,
      template_type: config.template_type,
      template_content: {
        elements: config.elements
      },
      variables: {},
      is_active: true,
      requires_approval: false,
      category_id: null,
      program_id: null,
      level_id: null,
      academic_year_id: null,
      auto_generate: false,
      target_audience: {}
    };
  }
}