
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  AlertTriangle, 
  Activity, 
  RefreshCw,
  BookOpen,
  Users,
  MapPin 
} from 'lucide-react';

interface ExamIntegrationOverviewProps {
  academicStatus: string;
  studentStatus: string;
  resourceStatus: string;
  syncProgress: number;
}

export function ExamIntegrationOverview({ 
  academicStatus, 
  studentStatus, 
  resourceStatus, 
  syncProgress 
}: ExamIntegrationOverviewProps) {
  const getStatusBadge = (status: string) => {
    const configs = {
      synced: { label: 'Synchronisé', className: 'bg-green-100 text-green-800', icon: CheckCircle },
      conflict: { label: 'Conflit', className: 'bg-red-100 text-red-800', icon: AlertTriangle },
      partial: { label: 'Partiel', className: 'bg-yellow-100 text-yellow-800', icon: Activity },
      pending: { label: 'En attente', className: 'bg-gray-100 text-gray-800', icon: RefreshCw },
      error: { label: 'Erreur', className: 'bg-red-100 text-red-800', icon: AlertTriangle }
    };

    const config = configs[status as keyof typeof configs] || configs.pending;
    const Icon = config.icon;

    return (
      <Badge className={`${config.className} flex items-center gap-1`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-blue-600" />
          <span className="font-medium">Académique</span>
        </div>
        {getStatusBadge(academicStatus)}
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-green-600" />
          <span className="font-medium">Étudiants</span>
        </div>
        {getStatusBadge(studentStatus)}
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-orange-600" />
          <span className="font-medium">Ressources</span>
        </div>
        {getStatusBadge(resourceStatus)}
      </div>
      
      <div className="space-y-2">
        <span className="font-medium">Progression Globale</span>
        <div className="space-y-1">
          <Progress value={syncProgress} className="h-2" />
          <span className="text-xs text-muted-foreground">
            {Math.round(syncProgress)}% synchronisé
          </span>
        </div>
      </div>
    </div>
  );
}
