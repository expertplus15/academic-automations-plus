
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  Mail,
  Phone,
  Calendar,
  MapPin,
  GraduationCap,
  Users
} from "lucide-react";
import { useStudentsData } from "@/hooks/useStudentsData";

export function StudentsProfilesManagement() {
  const { students, loading } = useStudentsData();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.profiles.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.profiles.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.student_number.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === "all" || student.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: "Actif", className: "bg-green-100 text-green-800 border-green-200" },
      suspended: { label: "Suspendu", className: "bg-red-100 text-red-800 border-red-200" },
      graduated: { label: "Diplômé", className: "bg-blue-100 text-blue-800 border-blue-200" },
      dropped: { label: "Abandonné", className: "bg-gray-100 text-gray-800 border-gray-200" },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active;
    return (
      <Badge className={config.className}>
        {config.label}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-students/10 rounded-lg">
                <Users className="w-5 h-5 text-students" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Étudiants</p>
                <p className="text-2xl font-bold">{students.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <GraduationCap className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Étudiants Actifs</p>
                <p className="text-2xl font-bold">
                  {students.filter(s => s.status === 'active').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Nouveaux (ce mois)</p>
                <p className="text-2xl font-bold">
                  {students.filter(s => {
                    const enrollmentDate = new Date(s.enrollment_date);
                    const currentMonth = new Date().getMonth();
                    const currentYear = new Date().getFullYear();
                    return enrollmentDate.getMonth() === currentMonth && 
                           enrollmentDate.getFullYear() === currentYear;
                  }).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <MapPin className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Programmes</p>
                <p className="text-2xl font-bold">
                  {new Set(students.map(s => s.programs.id)).size}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Profils Étudiants</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Exporter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par nom, email ou numéro étudiant..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filtres
            </Button>
          </div>

          {/* Students List */}
          <div className="space-y-3">
            {filteredStudents.map((student) => (
              <div key={student.id} className="flex items-center gap-4 p-4 border border-border/50 rounded-lg hover:bg-muted/30 transition-colors">
                <Avatar className="w-12 h-12">
                  <AvatarImage src="" alt={student.profiles.full_name} />
                  <AvatarFallback className="bg-students text-white">
                    {student.profiles.full_name?.[0] || 'E'}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <p className="font-medium text-foreground">{student.profiles.full_name}</p>
                    <p className="text-sm text-muted-foreground">{student.student_number}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-foreground">{student.programs.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Niveau {student.year_level} • {student.programs.departments.name}
                    </p>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                      <Mail className="w-3 h-3" />
                      {student.profiles.email}
                    </div>
                    {student.profiles.phone && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Phone className="w-3 h-3" />
                        {student.profiles.phone}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {getStatusBadge(student.status)}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {filteredStudents.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Aucun étudiant trouvé</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
