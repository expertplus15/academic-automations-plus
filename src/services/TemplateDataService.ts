import { MockDataService } from './MockDataService';
import { getDefaultDataForTemplate } from '@/components/documents/templates/predefined/TemplateRenderer';
import { Template } from './TemplateService';

/**
 * Service pour centraliser les données de templates et assurer leur cohérence
 * entre l'aperçu et la génération de documents
 */
export class TemplateDataService {
  /**
   * Récupère les données par défaut pour un type de template donné
   * en utilisant la même source pour tous les composants
   */
  static getDataForTemplate(templateType: string) {
    // Utiliser la fonction existante dans TemplateRenderer pour garantir la cohérence
    return getDefaultDataForTemplate(templateType);
  }

  /**
   * Récupère les données pour un template spécifique
   */
  static getDataForTemplateObject(template?: Template) {
    if (!template) return {};
    
    return this.getDataForTemplate(template.type);
  }

  /**
   * Remplace les variables dans un contenu texte
   */
  static replaceVariables(content: string, variables?: Record<string, string>): string {
    return MockDataService.replaceVariables(content, variables);
  }

  /**
   * Vérifie si le templateType est valide et peut être rendu avec TemplateRenderer
   */
  static isValidTemplateType(templateType: string): boolean {
    return [
      'emd_releve',
      'transcript',
      'bulletin',
      'attestation',
      'attestation_scolarite',
      'certificat',
      'certificate',
      'diplome',
      'cert_scol_v1'
    ].includes(templateType);
  }
}