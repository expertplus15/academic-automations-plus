import { useState } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AcademicModuleLayout } from '@/components/layouts/AcademicModuleLayout';
import { GroupsList } from '@/components/academic/GroupsList';
import { GroupForm } from '@/components/academic/GroupForm';
import { useTable } from '@/hooks/useSupabase';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function Groups() {
  const { data: groups, loading, refetch } = useTable('class_groups');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingGroup, setEditingGroup] = useState<any>(null);

  const handleCreateSuccess = () => {
    setShowCreateForm(false);
    refetch();
  };

  const handleEditSuccess = () => {
    setEditingGroup(null);
    refetch();
  };

  const handleEdit = (group: any) => {
    setEditingGroup(group);
  };

  return (
    <ProtectedRoute allowedRoles={['admin', 'teacher']}>
      <AcademicModuleLayout 
        title="Classes" 
        subtitle="Gestion des groupes et classes"
        showHeader={true}
      >
        <div className="p-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Groupes et classes</h1>
              <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Nouvelle Classe
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Créer une classe</DialogTitle>
                  </DialogHeader>
                  <GroupForm 
                    onSuccess={handleCreateSuccess}
                    onCancel={() => setShowCreateForm(false)}
                  />
                </DialogContent>
              </Dialog>
            </div>
            
            <GroupsList 
              groups={groups} 
              loading={loading}
              onEdit={handleEdit}
              onRefresh={refetch}
            />

            {/* Edit Dialog */}
            <Dialog open={!!editingGroup} onOpenChange={() => setEditingGroup(null)}>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Modifier la classe</DialogTitle>
                </DialogHeader>
                <GroupForm 
                  group={editingGroup}
                  onSuccess={handleEditSuccess}
                  onCancel={() => setEditingGroup(null)}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </AcademicModuleLayout>
    </ProtectedRoute>
  );
}