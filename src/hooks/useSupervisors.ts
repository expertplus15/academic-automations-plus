
import { useEffect } from 'react';
import { useSupervisorData } from './supervisors/useSupervisorData';
import { useSupervisorAssignments } from './supervisors/useSupervisorAssignments';
import { useSupervisorAvailability } from './supervisors/useSupervisorAvailability';
import { useAutoAssignSupervisors } from './supervisors/useAutoAssignSupervisors';

export * from './supervisors/types';

export function useSupervisors() {
  const {
    supervisors,
    loading: supervisorLoading,
    error: supervisorError,
    fetchSupervisors
  } = useSupervisorData();

  const {
    assignments,
    loading: assignmentLoading,
    error: assignmentError,
    fetchAssignments,
    assignSupervisor,
    unassignSupervisor,
    confirmAssignment
  } = useSupervisorAssignments();

  const { getSupervisorAvailability } = useSupervisorAvailability();

  const {
    autoAssignSupervisors,
    loading: autoAssignLoading,
    error: autoAssignError
  } = useAutoAssignSupervisors(supervisors, assignSupervisor);

  // Combine loading states
  const loading = supervisorLoading || assignmentLoading || autoAssignLoading;
  
  // Combine error states (prioritize the most recent error)
  const error = autoAssignError || assignmentError || supervisorError;

  useEffect(() => {
    fetchSupervisors();
    fetchAssignments();
  }, []);

  return {
    supervisors,
    assignments,
    loading,
    error,
    fetchSupervisors,
    fetchAssignments,
    assignSupervisor,
    unassignSupervisor,
    confirmAssignment,
    getSupervisorAvailability,
    autoAssignSupervisors
  };
}
