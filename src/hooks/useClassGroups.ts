import { useTable } from './useSupabase';

export function useClassGroups() {
  return useTable('class_groups', `
    *,
    programs!class_groups_program_id_fkey(*)
  `);
}