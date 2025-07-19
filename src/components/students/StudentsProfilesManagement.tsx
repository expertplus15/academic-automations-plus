
import React from 'react';
import { StudentsList } from './StudentsList';
import { AcademicYearFilter } from './AcademicYearFilter';
import { Button } from '@/components/ui/button';
import { Plus, Upload } from 'lucide-react';
import { useStudentsData } from '@/hooks/students/useStudentsData';
import { useAcademicYearContext } from '@/contexts/AcademicYearContext';
import { useNavigate } from 'react-router-dom';

export function StudentsProfilesManagement() {
  const { selectedAcademicYear } = useAcademicYearContext();
  const { students, loading } = useStudentsData(selectedAcademicYear?.id);
  const navigate = useNavigate();

  console.log('🔍 Rendering with students for academic year:', selectedAcademicYear?.name, students);
  console.log('📊 Students count:', students.length);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
        <span className="ml-2 text-muted-foreground">
          Chargement des étudiants{selectedAcademicYear ? ` pour ${selectedAcademicYear.name}` : ''}...
        </span>
      </div>
    );
  }

  // Si aucun étudiant n'est trouvé, proposer de créer de nouveaux profils
  if (students.length === 0) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Gestion des Profils Étudiants</h2>
            <p className="text-muted-foreground">
              {selectedAcademicYear 
                ? `Aucun étudiant trouvé pour l'année académique ${selectedAcademicYear.name}`
                : 'Veuillez sélectionner une année académique pour afficher les étudiants'
              }
            </p>
          </div>
          <AcademicYearFilter />
        </div>

        <div className="text-center py-12 bg-card rounded-lg border">
          <div className="max-w-md mx-auto">
            <h3 className="text-lg font-semibold mb-4">
              {selectedAcademicYear ? 'Aucun étudiant inscrit' : 'Sélectionner une année académique'}
            </h3>
            <p className="text-muted-foreground mb-6">
              {selectedAcademicYear
                ? `Il semble qu'aucun étudiant ne soit inscrit pour l'année académique ${selectedAcademicYear.name}. Vous pouvez commencer par importer des étudiants ou créer de nouveaux profils.`
                : "Veuillez d'abord sélectionner une année académique pour voir les étudiants inscrits."
              }
            </p>
            
            {selectedAcademicYear && (
              <div className="flex justify-center gap-4">
                <Button 
                  onClick={() => navigate('/students/import')}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Importer des Étudiants
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => {
                    console.log('Créer un nouvel étudiant pour l\'année:', selectedAcademicYear.name);
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Créer un étudiant
                </Button>
              </div>
            )}
            
            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Info :</strong> Le filtrage par année académique permet de gérer les étudiants 
                de façon organisée selon leur année d'inscription.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Gestion des Profils Étudiants</h2>
          <p className="text-muted-foreground">
            Gérez les informations personnelles et académiques des étudiants
            {selectedAcademicYear && (
              <span className="inline-flex items-center ml-2 px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                {selectedAcademicYear.name} • {students.length} étudiant{students.length > 1 ? 's' : ''}
              </span>
            )}
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <AcademicYearFilter />
          
          <div className="flex gap-2">
            <Button 
              onClick={() => navigate('/students/import')}
              variant="outline"
            >
              <Upload className="w-4 h-4 mr-2" />
              Importer des Étudiants
            </Button>
            
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nouvel Étudiant
            </Button>
          </div>
        </div>
      </div>

      <StudentsList />
    </div>
  );
}
