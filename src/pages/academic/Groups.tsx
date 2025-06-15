import { useState } from 'react';
import { AcademicPageHeader } from "@/components/AcademicPageHeader";
import { GroupsList } from '@/components/academic/GroupsList';
import { GroupForm } from '@/components/academic/GroupForm';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useClassGroups } from '@/hooks/useClassGroups';

export default function Groups() {
  const [editingGroup, setEditingGroup] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const { data: groups, loading, refetch } = useClassGroups();

  const handleEdit = (group: any) => {
    setEditingGroup(group);
    setShowForm(true);
  };

  const handleSuccess = () => {
    setShowForm(false);
    setEditingGroup(null);
    refetch();
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingGroup(null);
  };

  const handleCreate = () => {
    setEditingGroup(null);
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <AcademicPageHeader 
        title="Classes et Groupes" 
        subtitle="Gestion des groupes d'étudiants" 
      />
      <div className="p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {!showForm ? (
            <>
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-semibold">Gestion des Groupes</h2>
                  <p className="text-muted-foreground">
                    Organisez vos étudiants en classes, groupes de TD, TP et projets.
                  </p>
                </div>
                <Button onClick={handleCreate}>
                  <Plus className="w-4 h-4 mr-2" />
                  Nouveau Groupe
                </Button>
              </div>

              <GroupsList
                groups={groups || []}
                loading={loading}
                onEdit={handleEdit}
                onRefresh={refetch}
              />
            </>
          ) : (
            <GroupForm
              group={editingGroup}
              onSuccess={handleSuccess}
              onCancel={handleCancel}
            />
          )}
        </div>
      </div>
    </div>
  );
}