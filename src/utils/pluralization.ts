/**
 * Utility functions for French pluralization and text formatting
 * Handles proper singular/plural forms to fix issues like "1 factures" -> "1 facture"
 */

export interface PluralizationOptions {
  showCount?: boolean;
  capitalizeFirst?: boolean;
  gender?: 'masculine' | 'feminine';
}

/**
 * Pluralize a French word based on count
 * @param count - The number/count
 * @param singular - Singular form of the word
 * @param plural - Optional plural form (auto-generated if not provided)
 * @param options - Additional formatting options
 */
export function pluralize(
  count: number,
  singular: string,
  plural?: string,
  options: PluralizationOptions = {}
): string {
  const { showCount = true, capitalizeFirst = false } = options;
  
  // Determine if plural form is needed
  const isPlural = count === 0 || count > 1;
  
  // Use provided plural or generate it
  const word = isPlural ? (plural || generatePlural(singular)) : singular;
  
  // Format the result
  let result = showCount ? `${count} ${word}` : word;
  
  if (capitalizeFirst) {
    result = result.charAt(0).toUpperCase() + result.slice(1);
  }
  
  return result;
}

/**
 * Auto-generate French plural forms based on common rules
 */
function generatePlural(singular: string): string {
  const word = singular.toLowerCase();
  
  // Special cases - common French words
  const irregulars: { [key: string]: string } = {
    'conflit': 'conflits',
    'facture': 'factures',
    'étudiant': 'étudiants',
    'enseignant': 'enseignants',
    'examen': 'examens',
    'cours': 'cours',
    'bus': 'bus',
    'contrat': 'contrats',
    'paiement': 'paiements',
    'notification': 'notifications',
    'document': 'documents',
    'salle': 'salles',
    'élève': 'élèves',
    'professeur': 'professeurs'
  };
  
  if (irregulars[word]) {
    return irregulars[word];
  }
  
  // Standard French pluralization rules
  if (word.endsWith('s') || word.endsWith('x') || word.endsWith('z')) {
    return word; // No change
  }
  
  if (word.endsWith('au') || word.endsWith('eau') || word.endsWith('eu')) {
    return word + 'x';
  }
  
  if (word.endsWith('al')) {
    return word.slice(0, -2) + 'aux';
  }
  
  // Default: add 's'
  return word + 's';
}

/**
 * Format conflict detection messages
 */
export function formatConflictMessage(count: number): string {
  if (count === 0) {
    return "Aucun conflit détecté";
  }
  if (count === 1) {
    return "1 conflit détecté";
  }
  return `${count} conflits détectés`;
}

/**
 * Format invoice/billing messages
 */
export function formatInvoiceMessage(count: number): string {
  return pluralize(count, 'facture');
}

/**
 * Format student/teacher counts
 */
export function formatStudentCount(count: number): string {
  return pluralize(count, 'étudiant');
}

export function formatTeacherCount(count: number): string {
  return pluralize(count, 'enseignant');
}

export function formatContractCount(count: number): string {
  return pluralize(count, 'contrat');
}

/**
 * Format notification counts for badges
 */
export function formatNotificationCount(count: number): string {
  if (count === 0) return '';
  return count.toString();
}

/**
 * Format status messages with proper pluralization
 */
export function formatStatusMessage(count: number, type: string): string {
  const typeMap: { [key: string]: { singular: string; plural: string } } = {
    'active': { singular: 'actif', plural: 'actifs' },
    'pending': { singular: 'en attente', plural: 'en attente' },
    'inactive': { singular: 'inactif', plural: 'inactifs' },
    'confirmed': { singular: 'confirmé', plural: 'confirmés' },
    'scheduled': { singular: 'planifié', plural: 'planifiés' }
  };
  
  const forms = typeMap[type] || { singular: type, plural: type + 's' };
  const word = count <= 1 ? forms.singular : forms.plural;
  
  return `${count} ${word}`;
}