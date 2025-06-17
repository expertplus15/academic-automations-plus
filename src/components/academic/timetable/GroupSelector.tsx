
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useTable } from '@/hooks/useSupabase';

interface GroupSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
  programId?: string;
}

export function GroupSelector({ value, onValueChange, programId }: GroupSelectorProps) {
  const { data: groups, loading } = useTable('class_groups', `
    *,
    programs!class_groups_program_id_fkey(name)
  `, programId ? { program_id: programId } : undefined);

  return (
    <div>
      <Label>Groupe</Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger>
          <SelectValue placeholder={loading ? "Chargement..." : "Sélectionner un groupe (optionnel)"} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">Aucun groupe</SelectItem>
          {groups?.map((group) => (
            <SelectItem key={group.id} value={group.id}>
              {group.code} - {group.name} ({group.current_students}/{group.max_students})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
