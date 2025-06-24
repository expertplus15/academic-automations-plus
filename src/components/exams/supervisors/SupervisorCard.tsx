
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Clock,
  UserCheck,
  Eye
} from 'lucide-react';
import { Supervisor } from '@/hooks/supervisors/types';

interface SupervisorCardProps {
  supervisor: Supervisor;
  onAssign: (supervisorId: string) => void;
  onViewDetails: (supervisor: Supervisor) => void;
  isAssignable?: boolean;
}

export function SupervisorCard({ 
  supervisor, 
  onAssign, 
  onViewDetails, 
  isAssignable = true 
}: SupervisorCardProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge className="bg-green-100 text-green-800">Disponible</Badge>;
      case 'busy':
        return <Badge className="bg-orange-100 text-orange-800">Occupé</Badge>;
      case 'unavailable':
        return <Badge variant="destructive">Indisponible</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getLoadColor = (load: number, maxLoad: number) => {
    const percentage = (load / maxLoad) * 100;
    if (percentage < 25) return 'text-green-600';
    if (percentage < 75) return 'text-orange-600';
    return 'text-red-600';
  };

  const initials = supervisor.full_name
    .split(' ')
    .map(name => name.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">{supervisor.full_name}</h3>
              <p className="text-sm text-muted-foreground">{supervisor.email}</p>
            </div>
          </div>
          {getStatusBadge(supervisor.status)}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Informations de contact */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Mail className="w-4 h-4 text-gray-500" />
            <span className="truncate">{supervisor.email}</span>
          </div>
          {supervisor.phone && (
            <div className="flex items-center gap-2 text-sm">
              <Phone className="w-4 h-4 text-gray-500" />
              <span>{supervisor.phone}</span>
            </div>
          )}
        </div>

        {/* Charge de travail */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Charge de travail</span>
            <span className={`text-sm font-semibold ${getLoadColor(supervisor.current_load || 0, supervisor.max_load || 20)}`}>
              {supervisor.current_load || 0}/{supervisor.max_load || 20}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all ${
                ((supervisor.current_load || 0) / (supervisor.max_load || 20)) * 100 < 25 
                  ? 'bg-green-500' 
                  : ((supervisor.current_load || 0) / (supervisor.max_load || 20)) * 100 < 75 
                    ? 'bg-orange-500' 
                    : 'bg-red-500'
              }`}
              style={{ 
                width: `${Math.min(((supervisor.current_load || 0) / (supervisor.max_load || 20)) * 100, 100)}%` 
              }}
            />
          </div>
        </div>

        {/* Disponibilités */}
        {supervisor.availability && supervisor.availability.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium">Disponibilités</span>
            </div>
            <div className="text-sm text-muted-foreground">
              {supervisor.availability.slice(0, 2).map((av, index) => (
                <div key={index} className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>
                    Jour {av.day_of_week}: {av.start_time} - {av.end_time}
                    {av.is_preferred && ' (préféré)'}
                  </span>
                </div>
              ))}
              {supervisor.availability.length > 2 && (
                <span className="text-xs text-muted-foreground">
                  +{supervisor.availability.length - 2} autres créneaux
                </span>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(supervisor)}
            className="flex items-center gap-1"
          >
            <Eye className="w-3 h-3" />
            Détails
          </Button>
          
          {isAssignable && supervisor.status === 'available' && (
            <Button
              size="sm"
              onClick={() => onAssign(supervisor.teacher_id)}
              className="flex items-center gap-1"
            >
              <UserCheck className="w-3 h-3" />
              Assigner
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
