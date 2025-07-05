import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Download } from 'lucide-react';
import { Student, useStudentsData } from '@/hooks/students/useStudentsData';
import { StudentCard } from './StudentCard';
import { StudentForm } from './StudentForm';
import { StudentsSearch } from './StudentsSearch';
import { StudentProfileDialog } from './StudentProfileDialog';

interface StudentsListProps {
  searchable?: boolean;
  showActions?: boolean;
  className?: string;
}

export function StudentsList({ 
  searchable = true, 
  showActions = true, 
  className = '' 
}: StudentsListProps) {
  const { students, loading, createStudent, updateStudent } = useStudentsData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.profiles.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.profiles.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.student_number.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === 'all' || student.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  const handleCreateStudent = () => {
    setSelectedStudent(null);
    setFormOpen(true);
  };

  const handleEditStudent = (student: Student) => {
    setSelectedStudent(student);
    setFormOpen(true);
  };

  const handleViewStudent = (student: Student) => {
    setSelectedStudent(student);
    setViewDialogOpen(true);
  };

  const handleSaveStudent = async (data: any) => {
    if (selectedStudent) {
      return await updateStudent(selectedStudent.id, data);
    } else {
      return await createStudent(data);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Liste des Étudiants ({filteredStudents.length})</CardTitle>
            {showActions && (
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Exporter
                </Button>
                <Button onClick={handleCreateStudent} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Nouvel étudiant
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {searchable && (
            <div className="mb-6">
              <StudentsSearch
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                selectedStatus={selectedStatus}
                onStatusChange={setSelectedStatus}
                totalResults={filteredStudents.length}
              />
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredStudents.map((student) => (
              <StudentCard
                key={student.id}
                student={student}
                onView={handleViewStudent}
                onEdit={handleEditStudent}
              />
            ))}
          </div>

          {filteredStudents.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">Aucun étudiant trouvé</p>
              {searchTerm || selectedStatus !== 'all' ? (
                <p className="text-sm text-muted-foreground mt-2">
                  Essayez de modifier vos critères de recherche
                </p>
              ) : (
                showActions && (
                  <Button onClick={handleCreateStudent} className="mt-4">
                    <Plus className="w-4 h-4 mr-2" />
                    Créer le premier étudiant
                  </Button>
                )
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <StudentForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        student={selectedStudent}
        onSave={handleSaveStudent}
      />

      <StudentProfileDialog
        student={selectedStudent}
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        onStudentUpdated={() => {
          setViewDialogOpen(false);
        }}
      />
    </div>
  );
}