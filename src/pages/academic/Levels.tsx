import { useState } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AcademicModuleLayout } from '@/components/layouts/AcademicModuleLayout';
import { LevelsList } from '@/components/academic/LevelsList';
import { LevelForm } from '@/components/academic/LevelForm';
import { ImportExportToolbar } from '@/components/academic/import-export/ImportExportToolbar';
import { useAcademicLevels } from '@/hooks/academic/useAcademicData';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function Levels() {
  const { data: levels, loading, refetch } = useAcademicLevels();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingLevel, setEditingLevel] = useState<any>(null);

  const handleCreateSuccess = () => {
    setShowCreateForm(false);
    refetch();
  };

  const handleEditSuccess = () => {
    setEditingLevel(null);
    refetch();
  };

  const handleEdit = (level: any) => {
    setEditingLevel(level);
  };

  return (
    <ProtectedRoute allowedRoles={['admin', 'teacher']}>
      <AcademicModuleLayout 
        title="Niveaux d'Études" 
        subtitle="Gestion des niveaux et cycles d'études"
        showHeader={true}
      >
        <div className="p-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Niveaux d'études</h1>
              <div className="flex gap-2">
                <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Nouveau Niveau
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Créer un niveau</DialogTitle>
                    </DialogHeader>
                    <LevelForm 
                      onSuccess={handleCreateSuccess}
                      onCancel={() => setShowCreateForm(false)}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            
            <ImportExportToolbar 
              data={levels || []} 
              onImportSuccess={refetch}
            />
            
            <LevelsList 
              levels={levels} 
              loading={loading}
              onEdit={handleEdit}
              onRefresh={refetch}
            />

            {/* Edit Dialog */}
            <Dialog open={!!editingLevel} onOpenChange={() => setEditingLevel(null)}>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Modifier le niveau</DialogTitle>
                </DialogHeader>
                <LevelForm 
                  level={editingLevel}
                  onSuccess={handleEditSuccess}
                  onCancel={() => setEditingLevel(null)}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </AcademicModuleLayout>
    </ProtectedRoute>
  );
}