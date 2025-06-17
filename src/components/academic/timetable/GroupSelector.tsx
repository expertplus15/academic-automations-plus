
import React from 'react';
import { Label } from '@/components/ui/label';
import { Combobox } from '@/components/ui/combobox';
import { useClassGroups } from '@/hooks/useClassGroups';

interface GroupSelectorProps {
  value: string;
  onChange: (value: string) => void;
  programId?: string;
  academicYearId?: string;
}

export function GroupSelector({ value, onChange, programId, academicYearId }: GroupSelectorProps) {
  const { groups, loading } = useClassGroups(programId, academicYearId);

  const options = groups.map(group => ({
    value: group.id,
    label: group.name,
    description: `${group.code} • ${group.current_students}/${group.max_students} étudiants • ${group.group_type}`
  }));

  return (
    <div>
      <Label>Groupe</Label>
      <Combobox
        options={options}
        value={value}
        onValueChange={onChange}
        placeholder={loading ? "Chargement..." : "Sélectionner un groupe (optionnel)"}
        searchPlaceholder="Rechercher un groupe..."
        emptyMessage="Aucun groupe trouvé."
        disabled={loading}
      />
    </div>
  );
}
