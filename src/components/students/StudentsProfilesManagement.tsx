
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { 
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
import { useStudentsData } from "@/hooks/students/useStudentsData";
import { StudentProfileDialog } from "./StudentProfileDialog";
import { StudentsSearch } from "./StudentsSearch";
import { StudentsBulkActions } from "./StudentsBulkActions";

export function StudentsProfilesManagement() {
  const { students, loading, refetch } = useStudentsData();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.profiles.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.profiles.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.student_number.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === "all" || student.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  const handleSelectStudent = (studentId: string, checked: boolean) => {
    if (checked) {
      setSelectedStudents(prev => [...prev, studentId]);
    } else {
      setSelectedStudents(prev => prev.filter(id => id !== studentId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedStudents(filteredStudents.map(student => student.id));
    } else {
      setSelectedStudents([]);
    }
  };

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

  console.log('🔍 Rendering with students:', students);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="hover:shadow-lg hover-scale transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Users className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Étudiants</p>
                <p className="text-2xl font-bold text-emerald-600">{students.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg hover-scale transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <GraduationCap className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Étudiants Actifs</p>
                <p className="text-2xl font-bold text-green-600">
                  {students.filter(s => s.status === 'active').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg hover-scale transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Nouveaux (ce mois)</p>
                <p className="text-2xl font-bold text-blue-600">
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
        
        <Card className="hover:shadow-lg hover-scale transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <MapPin className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Programmes</p>
                <p className="text-2xl font-bold text-purple-600">
                  {new Set(students.map(s => s.programs.id)).size}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="hover:shadow-lg transition-all duration-300">
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
          <div className="mb-6">
            <StudentsSearch
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedStatus={selectedStatus}
              onStatusChange={setSelectedStatus}
              totalResults={filteredStudents.length}
            />
          </div>

          {/* Bulk Actions Header */}
          {filteredStudents.length > 0 && (
            <div className="flex items-center justify-between py-2 border-b">
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={selectedStudents.length === filteredStudents.length}
                  onCheckedChange={handleSelectAll}
                  className="data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                />
                <span className="text-sm text-muted-foreground">
                  {selectedStudents.length > 0 
                    ? `${selectedStudents.length} sélectionné(s)`
                    : 'Sélectionner tout'
                  }
                </span>
              </div>
              {selectedStudents.length > 0 && (
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                  Actions en lot disponibles
                </Badge>
              )}
            </div>
          )}

          {/* Students List */}
          <div className="space-y-3 mt-4">
            {filteredStudents.map((student) => (
              <div key={student.id} className="flex items-center gap-4 p-4 border border-border/50 rounded-lg hover:bg-muted/30 hover:shadow-md transition-all duration-200 animate-fade-in">
                <Checkbox
                  checked={selectedStudents.includes(student.id)}
                  onCheckedChange={(checked) => handleSelectStudent(student.id, checked as boolean)}
                  className="data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                />
                <Avatar className="w-12 h-12">
                  <AvatarImage src="" alt={student.profiles.full_name} />
                  <AvatarFallback className="bg-emerald-500 text-white">
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
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      setSelectedStudent(student);
                      setDialogOpen(true);
                    }}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      setSelectedStudent(student);
                      setDialogOpen(true);
                    }}
                  >
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

      <StudentProfileDialog
        student={selectedStudent}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onStudentUpdated={() => {
          refetch();
          setDialogOpen(false);
        }}
      />

      <StudentsBulkActions
        selectedStudents={selectedStudents}
        onClearSelection={() => setSelectedStudents([])}
        onRefresh={refetch}
      />
    </div>
  );
}
