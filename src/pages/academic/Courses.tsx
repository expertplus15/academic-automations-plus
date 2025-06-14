import { useState } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AcademicPageHeader } from "@/components/AcademicPageHeader";
import { CoursesList } from '@/components/academic/CoursesList';
import { CourseForm } from '@/components/academic/CourseForm';
import { useCourses } from '@/hooks/useSupabase';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function Courses() {
  const { data: courses, loading, refetch } = useCourses();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any>(null);

  const handleCreateSuccess = () => {
    setShowCreateForm(false);
    refetch();
  };

  const handleEditSuccess = () => {
    setEditingCourse(null);
    refetch();
  };

  const handleEdit = (course: any) => {
    setEditingCourse(course);
  };

  return (
    <ProtectedRoute allowedRoles={['admin', 'teacher']}>
      <div className="min-h-screen bg-background">
        <AcademicPageHeader 
          title="Cours" 
          subtitle="Gestion des cours et matières" 
        />
        <div className="p-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Cours et matières</h1>
              <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Nouveau Cours
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Créer un cours</DialogTitle>
                  </DialogHeader>
                  <CourseForm 
                    onSuccess={handleCreateSuccess}
                    onCancel={() => setShowCreateForm(false)}
                  />
                </DialogContent>
              </Dialog>
            </div>
            
            <CoursesList 
              courses={courses} 
              loading={loading}
              onEdit={handleEdit}
              onRefresh={refetch}
            />

            {/* Edit Dialog */}
            <Dialog open={!!editingCourse} onOpenChange={() => setEditingCourse(null)}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Modifier le cours</DialogTitle>
                </DialogHeader>
                <CourseForm 
                  course={editingCourse}
                  onSuccess={handleEditSuccess}
                  onCancel={() => setEditingCourse(null)}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}