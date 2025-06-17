
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { User, Mail, Phone, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Supervisor } from '@/hooks/useSupervisors';

interface SupervisorCardProps {
  supervisor: Supervisor;
  onAssign: (supervisorId: string) => void;
  onViewDetails: (supervisor: Supervisor) => void;
  isAssignable?: boolean;
  currentAssignments?: number;
}

export function SupervisorCard({ 
  supervisor, 
  onAssign, 
  onViewDetails,
  isAssignable = true,
  currentAssignments = 0
}: SupervisorCardProps) {
  const workload = supervisor.max_load ? 
    ((supervisor.current_load || 0) / supervisor.max_load) * 100 : 0;

  const getWorkloadColor = (percentage: number) => {
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 70) return 'text-orange-600';
    if (percentage >= 50) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge className="bg-green-100 text-green-800">Disponible</Badge>;
      case 'busy':
        return <Badge className="bg-orange-100 text-orange-800">Occupé</Badge>;
      case 'unavailable':
        return <Badge className="bg-red-100 text-red-800">Indisponible</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg">{supervisor.full_name}</CardTitle>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Mail className="w-3 h-3" />
                {supervisor.email}
              </p>
            </div>
          </div>
          {getStatusBadge(supervisor.status)}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Informations de contact */}
        {supervisor.phone && (
          <div className="flex items-center gap-2 text-sm">
            <Phone className="w-4 h-4 text-muted-foreground" />
            <span>{supervisor.phone}</span>
          </div>
        )}

        {/* Charge de travail */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Charge de travail:</span>
            <span className={`font-medium ${getWorkloadColor(workload)}`}>
              {supervisor.current_load || 0}/{supervisor.max_load || 20} ({Math.round(workload)}%)
            </span>
          </div>
          <Progress value={workload} className="h-2" />
        </div>

        {/* Disponibilités */}
        {supervisor.availability && supervisor.availability.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Disponibilités:</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {supervisor.availability.slice(0, 3).map((avail, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'][avail.day_of_week]} 
                  {' '}{avail.start_time}-{avail.end_time}
                  {avail.is_preferred && <span className="text-green-600">★</span>}
                </Badge>
              ))}
              {supervisor.availability.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{supervisor.availability.length - 3}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Assignations actuelles */}
        {currentAssignments > 0 && (
          <div className="flex items-center gap-2 text-sm">
            <AlertCircle className="w-4 h-4 text-orange-500" />
            <span className="text-muted-foreground">
              {currentAssignments} examen(s) assigné(s) ce mois
            </span>
          </div>
        )}

        {/* Spécialisations */}
        {supervisor.specializations && supervisor.specializations.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Spécialisations:</p>
            <div className="flex flex-wrap gap-1">
              {supervisor.specializations.slice(0, 3).map((spec, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {spec}
                </Badge>
              ))}
              {supervisor.specializations.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{supervisor.specializations.length - 3}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-between pt-3 border-t">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onViewDetails(supervisor)}
            className="flex items-center gap-1"
          >
            <User className="w-3 h-3" />
            Détails
          </Button>
          
          <Button 
            size="sm"
            onClick={() => onAssign(supervisor.teacher_id)}
            disabled={!isAssignable || workload >= 90}
            className="flex items-center gap-1"
          >
            <CheckCircle className="w-3 h-3" />
            {workload >= 90 ? 'Surchargé' : 'Assigner'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
