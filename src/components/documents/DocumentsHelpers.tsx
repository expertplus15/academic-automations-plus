
import { Badge } from '@/components/ui/badge';
import { FileText, Download, CheckCircle, Clock } from 'lucide-react';

export const getStatusBadge = (status: string) => {
  switch (status) {
    case 'approved':
      return <Badge className="bg-green-100 text-green-800 border-green-200">Approuvé</Badge>;
    case 'pending':
      return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">En attente</Badge>;
    case 'generated':
      return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Généré</Badge>;
    case 'rejected':
      return <Badge variant="destructive">Rejeté</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export const getStatusIcon = (status: string) => {
  switch (status) {
    case 'approved':
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    case 'pending':
      return <Clock className="w-4 h-4 text-yellow-500" />;
    case 'generated':
      return <Download className="w-4 h-4 text-blue-500" />;
    default:
      return <FileText className="w-4 h-4 text-gray-500" />;
  }
};
