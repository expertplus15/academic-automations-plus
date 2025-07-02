import { useState } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AcademicModuleLayout } from '@/components/layouts/AcademicModuleLayout';
import { ProgramsList } from '@/components/academic/ProgramsList';
import { ProgramForm } from '@/components/academic/ProgramForm';
import { usePrograms } from '@/hooks/useSupabase';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function Programs() {
  const { data: programs, loading, refetch } = usePrograms();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingProgram, setEditingProgram] = useState<any>(null);

  const handleCreateSuccess = () => {
    setShowCreateForm(false);
    refetch();
  };

  const handleEditSuccess = () => {
    setEditingProgram(null);
    refetch();
  };

  const handleEdit = (program: any) => {
    setEditingProgram(program);
  };

  return (
    <ProtectedRoute allowedRoles={['admin', 'teacher']}>
      <AcademicModuleLayout 
        title="Programmes" 
        subtitle="Gestion des programmes d'études"
        showHeader={true}
      >
        <div className="p-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Programmes d'études</h1>
              <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Nouveau Programme
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Créer un programme</DialogTitle>
                  </DialogHeader>
                  <ProgramForm 
                    onSuccess={handleCreateSuccess}
                    onCancel={() => setShowCreateForm(false)}
                  />
                </DialogContent>
              </Dialog>
            </div>
            
            <ProgramsList 
              programs={programs} 
              loading={loading}
              onEdit={handleEdit}
              onRefresh={refetch}
            />

            {/* Edit Dialog */}
            <Dialog open={!!editingProgram} onOpenChange={() => setEditingProgram(null)}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Modifier le programme</DialogTitle>
                </DialogHeader>
                <ProgramForm 
                  program={editingProgram}
                  onSuccess={handleEditSuccess}
                  onCancel={() => setEditingProgram(null)}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </AcademicModuleLayout>
    </ProtectedRoute>
  );
}