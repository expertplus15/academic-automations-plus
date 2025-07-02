import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin,
  Edit,
  Save,
  X,
  GraduationCap,
  Clock,
  AlertCircle
} from "lucide-react";
import { useStudentsCRUD } from "@/hooks/useStudentsCRUD";

interface Student {
  id: string;
  student_number: string;
  status: string;
  year_level: number;
  enrollment_date: string;
  profiles: {
    id: string;
    full_name: string;
    email: string;
    phone?: string;
  };
  programs: {
    id: string;
    name: string;
    code: string;
    departments: {
      name: string;
    };
  };
}

interface StudentProfileDialogProps {
  student: Student | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStudentUpdated: () => void;
}

export function StudentProfileDialog({ student, open, onOpenChange, onStudentUpdated }: StudentProfileDialogProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<any>({});
  const { updateStudent, loading } = useStudentsCRUD();

  useEffect(() => {
    if (student) {
      setEditData({
        full_name: student.profiles.full_name,
        email: student.profiles.email,
        phone: student.profiles.phone || '',
        year_level: student.year_level,
        status: student.status
      });
    }
  }, [student]);

  const handleSave = async () => {
    if (!student) return;

    const result = await updateStudent(student.id, editData);
    if (result.success) {
      setIsEditing(false);
      onStudentUpdated();
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
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!student) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src="" alt={student.profiles.full_name} />
              <AvatarFallback className="bg-students text-white text-lg">
                {student.profiles.full_name?.[0] || 'E'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <DialogTitle className="text-2xl">{student.profiles.full_name}</DialogTitle>
              <DialogDescription className="text-base">
                {student.student_number} • {student.programs.name}
              </DialogDescription>
              <div className="flex items-center gap-2 mt-2">
                {getStatusBadge(student.status)}
                <Badge variant="outline">Niveau {student.year_level}</Badge>
              </div>
            </div>
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button onClick={handleSave} disabled={loading} size="sm">
                    <Save className="w-4 h-4 mr-2" />
                    Sauvegarder
                  </Button>
                  <Button onClick={() => setIsEditing(false)} variant="outline" size="sm">
                    <X className="w-4 h-4 mr-2" />
                    Annuler
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                  <Edit className="w-4 h-4 mr-2" />
                  Modifier
                </Button>
              )}
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="profile" className="mt-6">
          <TabsList>
            <TabsTrigger value="profile">Profil</TabsTrigger>
            <TabsTrigger value="academic">Académique</TabsTrigger>
            <TabsTrigger value="activity">Activité</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Informations Personnelles
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="full_name">Nom complet</Label>
                    {isEditing ? (
                      <Input
                        id="full_name"
                        value={editData.full_name}
                        onChange={(e) => setEditData({...editData, full_name: e.target.value})}
                      />
                    ) : (
                      <div className="flex items-center gap-2 mt-1 p-2 border rounded">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span>{student.profiles.full_name}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    {isEditing ? (
                      <Input
                        id="email"
                        type="email"
                        value={editData.email}
                        onChange={(e) => setEditData({...editData, email: e.target.value})}
                      />
                    ) : (
                      <div className="flex items-center gap-2 mt-1 p-2 border rounded">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span>{student.profiles.email}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="phone">Téléphone</Label>
                    {isEditing ? (
                      <Input
                        id="phone"
                        value={editData.phone}
                        onChange={(e) => setEditData({...editData, phone: e.target.value})}
                      />
                    ) : (
                      <div className="flex items-center gap-2 mt-1 p-2 border rounded">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span>{student.profiles.phone || 'Non renseigné'}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label>Date d'inscription</Label>
                    <div className="flex items-center gap-2 mt-1 p-2 border rounded">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>{formatDate(student.enrollment_date)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="academic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  Informations Académiques
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Programme</Label>
                    <div className="flex items-center gap-2 mt-1 p-2 border rounded">
                      <GraduationCap className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{student.programs.name}</div>
                        <div className="text-sm text-muted-foreground">{student.programs.departments.name}</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="year_level">Niveau d'étude</Label>
                    {isEditing ? (
                      <Select 
                        value={editData.year_level?.toString()} 
                        onValueChange={(value) => setEditData({...editData, year_level: parseInt(value)})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5, 6].map(level => (
                            <SelectItem key={level} value={level.toString()}>
                              Niveau {level}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="flex items-center gap-2 mt-1 p-2 border rounded">
                        <span>Niveau {student.year_level}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="status">Statut</Label>
                    {isEditing ? (
                      <Select 
                        value={editData.status} 
                        onValueChange={(value) => setEditData({...editData, status: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Actif</SelectItem>
                          <SelectItem value="suspended">Suspendu</SelectItem>
                          <SelectItem value="graduated">Diplômé</SelectItem>
                          <SelectItem value="dropped">Abandonné</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="mt-1">
                        {getStatusBadge(student.status)}
                      </div>
                    )}
                  </div>

                  <div>
                    <Label>Numéro étudiant</Label>
                    <div className="flex items-center gap-2 mt-1 p-2 border rounded">
                      <span className="font-mono">{student.student_number}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Activité Récente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="w-2 h-2 bg-students rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Inscription complétée</p>
                      <p className="text-xs text-muted-foreground">{formatDate(student.enrollment_date)}</p>
                    </div>
                  </div>
                  
                  <div className="text-center py-8">
                    <AlertCircle className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">Données d'activité disponibles prochainement</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}