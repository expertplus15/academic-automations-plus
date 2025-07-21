
import { useMemo } from 'react';
import { useMatrixFilters } from './useMatrixFilters';
import { useSubjects } from './useSubjects';

export function useMatrixConfiguration() {
  const { filters } = useMatrixFilters();
  
  // Convertir les filtres pour les hooks
  const filterParams = useMemo(() => ({
    programId: filters.program && filters.program !== 'all' ? filters.program : undefined,
    levelId: filters.level && filters.level !== 'all' ? filters.level : undefined,
  }), [filters.program, filters.level]);

  const { subjects, loading: subjectsLoading, error: subjectsError } = useSubjects(
    filterParams.programId,
    filterParams.levelId
  );

  // Déterminer si la configuration est disponible
  const isConfigurationAvailable = useMemo(() => {
    return !!(filterParams.programId && subjects.length > 0);
  }, [filterParams.programId, subjects.length]);

  // Messages d'aide pour l'utilisateur
  const configurationMessage = useMemo(() => {
    if (!filterParams.programId) {
      return 'Veuillez sélectionner un programme pour configurer la saisie des notes.';
    }
    if (subjectsLoading) {
      return 'Chargement des matières...';
    }
    if (subjectsError) {
      return 'Erreur lors du chargement des matières.';
    }
    if (subjects.length === 0) {
      return 'Aucune matière trouvée pour ce programme et ce niveau.';
    }
    return `${subjects.length} matière(s) disponible(s) pour la saisie.`;
  }, [filterParams.programId, subjectsLoading, subjectsError, subjects.length]);

  return {
    subjects,
    loading: subjectsLoading,
    error: subjectsError,
    isConfigurationAvailable,
    configurationMessage,
    filters,
    filterParams
  };
}
