import { useState } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AcademicPageHeader } from "@/components/AcademicPageHeader";
import { DepartmentsList } from '@/components/academic/DepartmentsList';
import { DepartmentForm } from '@/components/academic/DepartmentForm';
import { useDepartments } from '@/hooks/useSupabase';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function Departments() {
  const { data: departments, loading, refetch } = useDepartments();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<any>(null);

  const handleCreateSuccess = () => {
    setShowCreateForm(false);
    refetch();
  };

  const handleEditSuccess = () => {
    setEditingDepartment(null);
    refetch();
  };

  const handleEdit = (department: any) => {
    setEditingDepartment(department);
  };

  return (
    <ProtectedRoute allowedRoles={['admin', 'teacher']}>
      <div className="min-h-screen bg-background">
        <AcademicPageHeader 
          title="Départements" 
          subtitle="Gestion des départements et structures organisationnelles" 
        />
        <div className="p-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Départements</h1>
              <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Nouveau Département
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Créer un département</DialogTitle>
                  </DialogHeader>
                  <DepartmentForm 
                    onSuccess={handleCreateSuccess}
                    onCancel={() => setShowCreateForm(false)}
                  />
                </DialogContent>
              </Dialog>
            </div>
            
            <DepartmentsList 
              departments={departments} 
              loading={loading}
              onEdit={handleEdit}
              onRefresh={refetch}
            />

            {/* Edit Dialog */}
            <Dialog open={!!editingDepartment} onOpenChange={() => setEditingDepartment(null)}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Modifier le département</DialogTitle>
                </DialogHeader>
                <DepartmentForm 
                  department={editingDepartment}
                  onSuccess={handleEditSuccess}
                  onCancel={() => setEditingDepartment(null)}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}