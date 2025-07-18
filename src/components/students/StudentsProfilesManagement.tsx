
import React from 'react';
import { StudentsList } from './StudentsList';
import { Button } from '@/components/ui/button';
import { Plus, Upload } from 'lucide-react';
import { useStudentsData } from '@/hooks/students/useStudentsData';
import { useNavigate } from 'react-router-dom';

export function StudentsProfilesManagement() {
  const { students, loading } = useStudentsData();
  const navigate = useNavigate();

  console.log('🔍 Rendering with students:', students);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
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
            <p className="text-muted-foreground">Aucun étudiant trouvé dans le système</p>
          </div>
        </div>

        <div className="text-center py-12 bg-card rounded-lg border">
          <div className="max-w-md mx-auto">
            <h3 className="text-lg font-semibold mb-4">Aucun étudiant inscrit</h3>
            <p className="text-muted-foreground mb-6">
              Il semble qu'aucun étudiant ne soit encore inscrit dans le système. 
              Vous pouvez commencer par importer des étudiants ou créer de nouveaux profils.
            </p>
            
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
                  console.log('Créer un nouvel étudiant');
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Créer un étudiant
              </Button>
            </div>
            
            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Info :</strong> Utilisez l'import CSV pour ajouter plusieurs étudiants rapidement, 
                ou créez des profils individuels manuellement.
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
          </p>
        </div>
        
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

      <StudentsList />
    </div>
  );
}
