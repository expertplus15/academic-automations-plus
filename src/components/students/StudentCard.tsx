import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { 
  Mail, 
  Phone, 
  Eye, 
  Edit, 
  MapPin,
  Calendar,
  GraduationCap
} from 'lucide-react';
import { Student } from '@/hooks/students/useStudentsData';

interface StudentCardProps {
  student: Student;
  onView?: (student: Student) => void;
  onEdit?: (student: Student) => void;
  className?: string;
}

export function StudentCard({ student, onView, onEdit, className = '' }: StudentCardProps) {
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: "Actif", className: "bg-emerald-100 text-emerald-800 border-emerald-200" },
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  return (
    <Card className={`hover:shadow-lg transition-all duration-300 ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <Avatar className="w-16 h-16">
            <AvatarImage src="" alt={student.profiles.full_name} />
            <AvatarFallback className="bg-emerald-500 text-white text-lg">
              {student.profiles.full_name?.[0] || 'E'}
            </AvatarFallback>
          </Avatar>

          {/* Main Info */}
          <div className="flex-1 space-y-3">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-lg text-foreground">
                  {student.profiles.full_name}
                </h3>
                <p className="text-sm text-muted-foreground font-mono">
                  {student.student_number}
                </p>
              </div>
              <div className="flex gap-1">
                {onView && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => onView(student)}
                    className="h-8 w-8 p-0"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                )}
                {onEdit && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => onEdit(student)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Program & Department */}
            <div className="flex items-center gap-2 text-sm">
              <GraduationCap className="w-4 h-4 text-emerald-600" />
              <span className="font-medium">{student.programs.name}</span>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground">
                Niveau {student.year_level}
              </span>
            </div>

            {/* Department */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>{student.programs.departments.name}</span>
            </div>

            {/* Contact Info */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span>{student.profiles.email}</span>
              </div>
              {student.profiles.phone && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="w-4 h-4" />
                  <span>{student.profiles.phone}</span>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="w-3 h-3" />
                <span>Inscrit le {formatDate(student.enrollment_date)}</span>
              </div>
              {getStatusBadge(student.status)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}