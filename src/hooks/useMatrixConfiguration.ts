
import { useMemo } from 'react';
import { useMatrixFilters } from './useMatrixFilters';
import { useSubjects } from './useSubjects';

export function useMatrixConfiguration() {
  const { filters } = useMatrixFilters();
  
  // Convertir les filtres pour les hooks
  const filterParams = useMemo(() => {
    const programId = filters.program && filters.program !== 'all' && filters.program !== '' ? filters.program : undefined;
    const levelId = filters.level && filters.level !== 'all' && filters.level !== '' ? filters.level : undefined;
    
    console.info('🔍 [MATRIX_CONFIG] Converting filters:', { 
      filters, 
      programId, 
      levelId,
      programSelected: !!programId,
      levelSelected: !!levelId
    });
    
    return {
      programId,
      levelId
    };
  }, [filters.program, filters.level]);

  const { subjects, loading: subjectsLoading, error: subjectsError } = useSubjects(
    filterParams.programId,
    filterParams.levelId
  );

  console.info('🔍 [MATRIX_CONFIG] useSubjects called with:', {
    programId: filterParams.programId,
    levelId: filterParams.levelId,
    subjectsCount: subjects.length,
    subjectsLoading
  });

  // Déterminer si la configuration est disponible
  const isConfigurationAvailable = useMemo(() => {
    const available = !!(filterParams.programId && subjects.length > 0);
    console.info('🔍 [MATRIX_CONFIG] Configuration check:', { 
      programId: filterParams.programId,
      programIdType: typeof filterParams.programId,
      subjectsCount: subjects.length,
      subjectsLoading,
      available
    });
    return available;
  }, [filterParams.programId, subjects.length, subjectsLoading]);

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
