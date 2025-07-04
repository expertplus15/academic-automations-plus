import React, { useState } from 'react';
import { ModuleLayout } from '@/components/layouts/ModuleLayout';
import { HrModuleSidebar } from '@/components/HrModuleSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  UserPlus,
  Search,
  Users,
  Eye,
  Edit,
  Phone,
  Mail,
  Calendar,
  MapPin
} from 'lucide-react';
import { useTeacherProfiles } from '@/hooks/hr/useTeacherProfiles';
import { TeacherFormModal } from '@/components/hr/TeacherFormModal';

export default function Teachers() {
  const { teacherProfiles, loading, error } = useTeacherProfiles();
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');

  const filteredTeachers = teacherProfiles.filter(teacher =>
    teacher.profile?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.employee_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.profile?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-700 border-green-200">Actif</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-700 border-gray-200">Inactif</Badge>;
      case 'on_leave':
        return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">En congé</Badge>;
      case 'terminated':
        return <Badge className="bg-red-100 text-red-700 border-red-200">Terminé</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const handleCreateTeacher = () => {
    setSelectedTeacher(null);
    setModalMode('create');
    setModalOpen(true);
  };

  const handleViewTeacher = (teacher: any) => {
    setSelectedTeacher(teacher);
    setModalMode('view');
    setModalOpen(true);
  };

  const handleEditTeacher = (teacher: any) => {
    setSelectedTeacher(teacher);
    setModalMode('edit');
    setModalOpen(true);
  };

  const handleSaveTeacher = (data: any) => {
    // Ici on pourrait appeler l'API pour sauvegarder
    console.log('Saving teacher:', data);
  };

  const stats = [
    {
      label: "Total enseignants",
      value: teacherProfiles.length,
      icon: Users
    },
    {
      label: "Actifs",
      value: teacherProfiles.filter(t => t.status === 'active').length,
      icon: Users
    },
    {
      label: "En congé",
      value: teacherProfiles.filter(t => t.status === 'on_leave').length,
      icon: Calendar
    }
  ];

  if (loading) {
    return (
      <ModuleLayout sidebar={<HrModuleSidebar />}>
        <div className="p-8">
          <div className="text-center">Chargement...</div>
        </div>
      </ModuleLayout>
    );
  }

  if (error) {
    return (
      <ModuleLayout sidebar={<HrModuleSidebar />}>
        <div className="p-8">
          <div className="text-center text-red-600">Erreur: {error}</div>
        </div>
      </ModuleLayout>
    );
  }

  return (
    <ModuleLayout sidebar={<HrModuleSidebar />}>
      <div className="p-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Gestion des Enseignants</h1>
            <p className="text-muted-foreground mt-1">Gérer les profils et informations des enseignants</p>
          </div>
          <Button 
            className="bg-amber-500 hover:bg-amber-600 text-white"
            onClick={handleCreateTeacher}
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Ajouter un enseignant
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="bg-white rounded-2xl shadow-sm border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    </div>
                    <div className="p-3 bg-amber-100 rounded-xl">
                      <Icon className="w-6 h-6 text-amber-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Search and Filters */}
        <Card className="bg-white rounded-2xl shadow-sm border-0">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Rechercher par nom, numéro employé ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Teachers List */}
        <Card className="bg-white rounded-2xl shadow-sm border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-500" />
              Liste des Enseignants ({filteredTeachers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredTeachers.map((teacher) => (
                <div
                  key={teacher.id}
                  className="flex items-center justify-between p-4 rounded-xl border border-border/50 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-amber-600" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-foreground">
                          {teacher.profile?.full_name || 'Nom non défini'}
                        </h3>
                        {getStatusBadge(teacher.status)}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <span className="font-medium">N°:</span> {teacher.employee_number}
                        </span>
                        {teacher.profile?.email && (
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {teacher.profile.email}
                          </span>
                        )}
                        {teacher.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {teacher.phone}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Embauché le {new Date(teacher.hire_date).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                      {teacher.qualification_level && (
                        <div className="text-sm">
                          <span className="font-medium">Qualification:</span> {teacher.qualification_level}
                          {teacher.years_experience > 0 && (
                            <span className="ml-2">• {teacher.years_experience} ans d'expérience</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewTeacher(teacher)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEditTeacher(teacher)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
              
              {filteredTeachers.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Aucun enseignant trouvé</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Modal */}
        <TeacherFormModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleSaveTeacher}
          teacher={selectedTeacher}
          mode={modalMode}
        />
      </div>
    </ModuleLayout>
  );
}