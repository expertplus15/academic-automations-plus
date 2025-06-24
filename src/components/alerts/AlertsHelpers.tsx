
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

export function getSeverityColor(severity: string): string {
  switch (severity.toLowerCase()) {
    case 'critical':
      return 'border-red-500 bg-red-50';
    case 'high':
      return 'border-orange-500 bg-orange-50';
    case 'medium':
      return 'border-yellow-500 bg-yellow-50';
    case 'low':
      return 'border-blue-500 bg-blue-50';
    default:
      return 'border-gray-300 bg-gray-50';
  }
}
