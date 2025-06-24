
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Info, AlertCircle } from 'lucide-react';

export function getSeverityBadge(severity: string) {
  switch (severity.toLowerCase()) {
    case 'critical':
      return (
        <Badge variant="destructive" className="flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" />
          Critique
        </Badge>
      );
    case 'high':
      return (
        <Badge className="bg-orange-500 text-white flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          Élevé
        </Badge>
      );
    case 'medium':
      return (
        <Badge className="bg-yellow-500 text-white flex items-center gap-1">
          <Info className="w-3 h-3" />
          Moyen
        </Badge>
      );
    case 'low':
      return (
        <Badge variant="outline" className="flex items-center gap-1">
          <Info className="w-3 h-3" />
          Faible
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="flex items-center gap-1">
          <Info className="w-3 h-3" />
          {severity}
        </Badge>
      );
  }
}

export function getSeverityIcon(severity: string) {
  switch (severity.toLowerCase()) {
    case 'critical':
      return <AlertTriangle className="w-4 h-4 text-red-600" />;
    case 'high':
      return <AlertCircle className="w-4 h-4 text-orange-500" />;
    case 'medium':
      return <Info className="w-4 h-4 text-yellow-500" />;
    case 'low':
      return <Info className="w-4 h-4 text-blue-500" />;
    default:
      return <Info className="w-4 h-4 text-gray-500" />;
  }
}

export function getSeverityColor(severity: string): "default" | "destructive" | "secondary" | "outline" {
  switch (severity.toLowerCase()) {
    case 'critical':
      return 'destructive';
    case 'high':
      return 'destructive';
    case 'medium':
      return 'secondary';
    case 'low':
      return 'outline';
    default:
      return 'default';
  }
}

export function getAlertTypeLabel(alertType: string): string {
  switch (alertType.toLowerCase()) {
    case 'attendance':
      return 'Assiduité';
    case 'performance':
      return 'Performance';
    case 'behavior':
      return 'Comportement';
    case 'academic':
      return 'Académique';
    case 'administrative':
      return 'Administratif';
    case 'financial':
      return 'Financier';
    case 'health':
      return 'Santé';
    case 'disciplinary':
      return 'Disciplinaire';
    default:
      return alertType;
  }
}
