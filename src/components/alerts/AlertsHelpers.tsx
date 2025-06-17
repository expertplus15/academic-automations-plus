
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Bell, CheckCircle, Clock } from 'lucide-react';

export const getSeverityBadge = (severity: string) => {
  switch (severity) {
    case 'high':
      return <Badge variant="destructive">Élevée</Badge>;
    case 'medium':
      return <Badge className="bg-orange-100 text-orange-800 border-orange-200">Moyenne</Badge>;
    case 'low':
      return <Badge variant="secondary">Faible</Badge>;
    default:
      return <Badge variant="outline">{severity}</Badge>;
  }
};

export const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'high':
      return 'destructive';
    case 'medium':
      return 'secondary';
    case 'low':
      return 'outline';
    default:
      return 'outline';
  }
};

export const getStatusBadge = (status: string) => {
  switch (status) {
    case 'active':
      return <Badge className="bg-red-100 text-red-800 border-red-200">Active</Badge>;
    case 'resolved':
      return <Badge className="bg-green-100 text-green-800 border-green-200">Résolue</Badge>;
    case 'pending':
      return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">En attente</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export const getAlertIcon = (type: string) => {
  switch (type) {
    case 'absence':
      return <AlertTriangle className="w-4 h-4 text-red-500" />;
    case 'grade':
      return <CheckCircle className="w-4 h-4 text-orange-500" />;
    case 'attendance':
      return <Clock className="w-4 h-4 text-blue-500" />;
    default:
      return <Bell className="w-4 h-4 text-gray-500" />;
  }
};

export const getAlertTypeLabel = (type: string) => {
  switch (type) {
    case 'absence':
      return 'Absence';
    case 'grade':
      return 'Note';
    case 'attendance':
      return 'Assiduité';
    case 'performance':
      return 'Performance';
    case 'behavior':
      return 'Comportement';
    default:
      return type;
  }
};
