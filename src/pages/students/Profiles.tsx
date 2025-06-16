
import { StudentsPageHeader } from "@/components/StudentsPageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Search, 
  Filter, 
  RefreshCw,
  Eye,
  UserPlus,
  Download,
  Users,
  GraduationCap,
  Calendar,
  AlertCircle
} from "lucide-react";
import { useState } from "react";
import { useStudentsData } from "@/hooks/useStudentsData";
import { useNavigate } from "react-router-dom";

export default function Profiles() {
  const [searchTerm, setSearchTerm] = useState("");
  const { students, loading, error, refetch } = useStudentsData();
  const navigate = useNavigate();

  const filteredStudents = students.filter(student => {
    const searchLower = searchTerm.toLowerCase();
    return (
      student.profiles?.full_name?.toLowerCase().includes(searchLower) ||
      student.profiles?.email?.toLowerCase().includes(searchLower) ||
      student.student_number?.toLowerCase().includes(searchLower) ||
      student.programs?.name?.toLowerCase().includes(searchLower)
    );
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Actif</Badge>;
      case "inactive":
        return <Badge variant="secondary">Inactif</Badge>;
      case "suspended":
        return <Badge variant="destructive">Suspendu</Badge>;
      case "graduated":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Diplômé</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleNewRegistration = () => {
    navigate('/students/registration');
  };

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <StudentsPageHeader 
          title="Profils étudiants" 
          subtitle="Profils complets des étudiants" 
        />
        <div className="p-6">
          <div className="max-w-6xl mx-auto">
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 text-red-600">
                  <AlertCircle className="w-5 h-5" />
                  <h3 className="font-semibold">Erreur de chargement</h3>
                </div>
                <p className="text-red-600 mt-2">{error}</p>
                <Button 
                  onClick={refetch} 
                  variant="outline" 
                  className="mt-4"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Réessayer
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <StudentsPageHeader 
        title="Profils étudiants" 
        subtitle="Gestion complète des profils et informations des étudiants" 
      />
      <div className="p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-students/10 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-students" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{students.length}</p>
                    <p className="text-sm text-muted-foreground">Total étudiants</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {students.filter(s => s.status === 'active').length}
                    </p>
                    <p className="text-sm text-muted-foreground">Étudiants actifs</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {students.filter(s => {
                        const enrollmentDate = new Date(s.enrollment_date);
                        const thisMonth = new Date();
                        return enrollmentDate.getMonth() === thisMonth.getMonth() && 
                               enrollmentDate.getFullYear() === thisMonth.getFullYear();
                      }).length}
                    </p>
                    <p className="text-sm text-muted-foreground">Ce mois-ci</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions et recherche */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-students" />
                    Liste des étudiants
                  </CardTitle>
                  <CardDescription>
                    Gérez et consultez tous les profils étudiants
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={handleNewRegistration}
                    className="bg-students hover:bg-students/90"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Nouvelle inscription
                  </Button>
                  <Button variant="outline" onClick={refetch}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Actualiser
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher par nom, email, numéro étudiant ou programme..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtres
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Exporter
                </Button>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="w-6 h-6 animate-spin text-muted-foreground" />
                  <span className="ml-2 text-muted-foreground">Chargement des étudiants...</span>
                </div>
              ) : filteredStudents.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    {searchTerm ? 'Aucun étudiant trouvé' : 'Aucun étudiant inscrit'}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm 
                      ? 'Essayez de modifier vos critères de recherche'
                      : 'Commencez par inscrire votre premier étudiant'
                    }
                  </p>
                  <Button 
                    onClick={handleNewRegistration}
                    className="bg-students hover:bg-students/90"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Première inscription
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Étudiant</TableHead>
                      <TableHead>Numéro</TableHead>
                      <TableHead>Programme</TableHead>
                      <TableHead>Niveau</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Inscription</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{student.profiles?.full_name || 'N/A'}</p>
                            <p className="text-sm text-muted-foreground">{student.profiles?.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <code className="bg-muted px-2 py-1 rounded text-sm">
                            {student.student_number}
                          </code>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{student.programs?.name || 'N/A'}</p>
                            <p className="text-sm text-muted-foreground">
                              {student.programs?.departments?.name}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>Année {student.year_level}</TableCell>
                        <TableCell>{getStatusBadge(student.status)}</TableCell>
                        <TableCell>{formatDate(student.enrollment_date)}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
