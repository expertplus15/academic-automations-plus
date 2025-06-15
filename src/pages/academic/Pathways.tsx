import { useState } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AcademicPageHeader } from "@/components/AcademicPageHeader";
import { PathwaysList } from '@/components/academic/PathwaysList';
import { PathwayForm } from '@/components/academic/PathwayForm';
import { useSpecializations } from '@/hooks/useSupabase';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function Pathways() {
  const { data: pathways, loading, refetch } = useSpecializations();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingPathway, setEditingPathway] = useState<any>(null);

  const handleCreateSuccess = () => {
    setShowCreateForm(false);
    refetch();
  };

  const handleEditSuccess = () => {
    setEditingPathway(null);
    refetch();
  };

  const handleEdit = (pathway: any) => {
    setEditingPathway(pathway);
  };

  return (
    <ProtectedRoute allowedRoles={['admin', 'teacher']}>
      <div className="min-h-screen bg-background">
        <AcademicPageHeader 
          title="Filières" 
          subtitle="Gestion des filières et spécialisations" 
        />
        <div className="p-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Filières et spécialisations</h1>
              <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Nouvelle Filière
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Créer une filière</DialogTitle>
                  </DialogHeader>
                  <PathwayForm 
                    onSuccess={handleCreateSuccess}
                    onCancel={() => setShowCreateForm(false)}
                  />
                </DialogContent>
              </Dialog>
            </div>
            
            <PathwaysList 
              pathways={pathways} 
              loading={loading}
              onEdit={handleEdit}
              onRefresh={refetch}
            />

            {/* Edit Dialog */}
            <Dialog open={!!editingPathway} onOpenChange={() => setEditingPathway(null)}>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Modifier la filière</DialogTitle>
                </DialogHeader>
                <PathwayForm 
                  pathway={editingPathway}
                  onSuccess={handleEditSuccess}
                  onCancel={() => setEditingPathway(null)}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}