import { useState } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AcademicModuleLayout } from '@/components/layouts/AcademicModuleLayout';
import { SubjectsList } from '@/components/academic/SubjectsList';
import { SubjectForm } from '@/components/academic/SubjectForm';
import { useSubjects } from '@/hooks/useSupabase';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function Subjects() {
  const { data: subjects, loading, refetch } = useSubjects();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingSubject, setEditingSubject] = useState<any>(null);

  const handleCreateSuccess = () => {
    setShowCreateForm(false);
    refetch();
  };

  const handleEditSuccess = () => {
    setEditingSubject(null);
    refetch();
  };

  const handleEdit = (subject: any) => {
    setEditingSubject(subject);
  };

  return (
    <ProtectedRoute allowedRoles={['admin', 'teacher']}>
      <AcademicModuleLayout 
        title="Matières" 
        subtitle="Gestion des matières et programmes d'études"
        showHeader={true}
      >
        <div className="p-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Matières et programmes</h1>
              <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Nouvelle Matière
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Créer une matière</DialogTitle>
                  </DialogHeader>
                  <SubjectForm 
                    onSuccess={handleCreateSuccess}
                    onCancel={() => setShowCreateForm(false)}
                  />
                </DialogContent>
              </Dialog>
            </div>
            
            <SubjectsList 
              subjects={subjects} 
              loading={loading}
              onEdit={handleEdit}
              onRefresh={refetch}
            />

            {/* Edit Dialog */}
            <Dialog open={!!editingSubject} onOpenChange={() => setEditingSubject(null)}>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Modifier la matière</DialogTitle>
                </DialogHeader>
                <SubjectForm 
                  subject={editingSubject}
                  onSuccess={handleEditSuccess}
                  onCancel={() => setEditingSubject(null)}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </AcademicModuleLayout>
    </ProtectedRoute>
  );
}