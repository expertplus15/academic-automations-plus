/**
 * Centralized message dictionary for MyAcademics platform
 * Provides consistent messaging across all modules
 */

export const messages = {
  // Error messages
  errors: {
    generic: "Une erreur est survenue. Veuillez réessayer.",
    network: "Problème de connexion. Vérifiez votre réseau.",
    permission: "Vous n'avez pas les droits nécessaires pour cette action.",
    notFound: "Élément non trouvé.",
    validation: "Veuillez vérifier les informations saisies.",
    timeout: "Délai d'attente dépassé. Veuillez réessayer.",
    server: "Erreur serveur. Veuillez contacter l'administrateur."
  },

  // Success messages
  success: {
    saved: "Enregistrement effectué avec succès.",
    deleted: "Suppression effectuée avec succès.",
    sent: "Envoi effectué avec succès.",
    updated: "Mise à jour effectuée avec succès.",
    created: "Création effectuée avec succès.",
    imported: "Import effectué avec succès.",
    exported: "Export effectué avec succès.",
    processed: "Traitement effectué avec succès."
  },

  // Warning messages
  warnings: {
    unsaved: "Des modifications non sauvegardées seront perdues.",
    maintenance: "Maintenance prévue le {date} à {time}.",
    expiring: "Attention : {item} expire dans {days} jours.",
    quota: "Attention : quota presque atteint ({percentage}%).",
    backup: "Dernière sauvegarde : {date}",
    conflict: "Conflit détecté : {description}"
  },

  // Information messages
  info: {
    loading: "Chargement en cours...",
    processing: "Traitement en cours...",
    noData: "Aucune donnée disponible.",
    empty: "Aucun élément à afficher.",
    updating: "Mise à jour en cours...",
    syncing: "Synchronisation en cours...",
    connecting: "Connexion en cours...",
    searching: "Recherche en cours..."
  },

  // Module-specific messages
  modules: {
    academic: {
      noSchedule: "Aucun emploi du temps configuré.",
      conflictResolved: "Conflit résolu automatiquement.",
      scheduleGenerated: "Emploi du temps généré avec succès."
    },
    students: {
      noStudents: "Aucun étudiant enregistré.",
      enrollmentComplete: "Inscription terminée.",
      noEnrollments: "Aucune inscription en cours."
    },
    finance: {
      noInvoices: "Aucune facture émise.",
      paymentReceived: "Paiement reçu et traité.",
      invoiceGenerated: "Facture générée automatiquement."
    },
    exams: {
      noConflicts: "Aucun conflit détecté.",
      optimizationComplete: "Optimisation IA terminée.",
      scheduleOptimal: "Planning optimal généré."
    },
    hr: {
      noTeachers: "Aucun enseignant enregistré - Commencer l'import",
      noContracts: "Aucun contrat actif.",
      profileIncomplete: "Profil enseignant incomplet."
    },
    transport: {
      noRoutes: "Aucune ligne configurée.",
      maintenanceScheduled: "Maintenance programmée.",
      serviceDisruption: "Perturbation de service détectée."
    },
    accommodation: {
      maintenanceMode: "Mode maintenance activé.",
      noRooms: "Aucune chambre disponible.",
      bookingConfirmed: "Réservation confirmée."
    }
  },

  // Action labels
  actions: {
    create: "Créer",
    edit: "Modifier",
    delete: "Supprimer",
    save: "Enregistrer",
    cancel: "Annuler",
    confirm: "Confirmer",
    refresh: "Actualiser",
    export: "Exporter",
    import: "Importer",
    search: "Rechercher",
    filter: "Filtrer",
    sort: "Trier",
    back: "Retour",
    next: "Suivant",
    previous: "Précédent",
    finish: "Terminer",
    start: "Commencer",
    pause: "Suspendre",
    resume: "Reprendre",
    stop: "Arrêter"
  },

  // Status labels
  status: {
    active: "Actif",
    inactive: "Inactif",
    pending: "En attente",
    processing: "En cours",
    completed: "Terminé",
    failed: "Échec",
    cancelled: "Annulé",
    scheduled: "Planifié",
    confirmed: "Confirmé",
    expired: "Expiré",
    draft: "Brouillon",
    published: "Publié"
  }
};

/**
 * Get message with dynamic values
 */
export function getMessage(
  path: string, 
  replacements: { [key: string]: string | number } = {}
): string {
  const keys = path.split('.');
  let message: any = messages;
  
  for (const key of keys) {
    message = message?.[key];
  }
  
  if (typeof message !== 'string') {
    return path; // Return path if message not found
  }
  
  // Replace placeholders
  let result = message;
  Object.entries(replacements).forEach(([key, value]) => {
    result = result.replace(`{${key}}`, String(value));
  });
  
  return result;
}

/**
 * Quick access functions for common messages
 */
export const quickMessages = {
  loading: () => getMessage('info.loading'),
  saved: () => getMessage('success.saved'),
  error: () => getMessage('errors.generic'),
  noData: () => getMessage('info.noData'),
  processing: () => getMessage('info.processing'),
  unsaved: () => getMessage('warnings.unsaved')
};