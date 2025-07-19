// Utilitaire pour formater les noms d'étudiants (Prénom NOM)

export interface StudentProfile {
  first_name?: string;
  last_name?: string;
  full_name?: string;
}

/**
 * Formate le nom d'un étudiant en mettant le prénom avant le nom
 * Priorité : first_name + last_name > full_name inversé > fallback
 */
export function formatStudentName(profile: StudentProfile | null | undefined): string {
  if (!profile) return 'N/A';

  // Si on a first_name et last_name séparés, les utiliser
  if (profile.first_name && profile.last_name) {
    return `${profile.first_name} ${profile.last_name.toUpperCase()}`;
  }

  // Sinon, utiliser full_name et l'inverser (supposant format "NOM Prénom")
  if (profile.full_name) {
    const parts = profile.full_name.trim().split(' ');
    if (parts.length >= 2) {
      const lastName = parts[0]; // Premier mot = nom de famille
      const firstName = parts.slice(1).join(' '); // Reste = prénom(s)
      return `${firstName} ${lastName.toUpperCase()}`;
    }
    return profile.full_name;
  }

  return 'N/A';
}

/**
 * Retourne les initiales d'un étudiant
 */
export function getStudentInitials(profile: StudentProfile | null | undefined): string {
  if (!profile) return '?';

  if (profile.first_name && profile.last_name) {
    return (profile.first_name[0] + profile.last_name[0]).toUpperCase();
  }

  if (profile.full_name) {
    const parts = profile.full_name.trim().split(' ');
    if (parts.length >= 2) {
      const lastName = parts[0];
      const firstName = parts[1];
      return (firstName[0] + lastName[0]).toUpperCase();
    }
    return profile.full_name[0]?.toUpperCase() || '?';
  }

  return '?';
}