import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  AlertTriangle, 
  Clock, 
  User, 
  MapPin, 
  Eye, 
  Edit, 
  CheckCircle,
  Search,
  Filter
} from 'lucide-react';

interface Incident {
  id: string;
  title: string;
  description: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'investigating' | 'resolved' | 'closed';
  room: string;
  reporter: string;
  student_involved?: string;
  created_at: string;
  resolved_at?: string;
}

interface IncidentsListProps {
  incidents: Incident[];
  onViewIncident: (incident: Incident) => void;
  onResolveIncident: (id: string) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  severityFilter: string;
  onSeverityFilterChange: (severity: string) => void;
}

export function IncidentsList({
  incidents,
  onViewIncident,
  onResolveIncident,
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  severityFilter,
  onSeverityFilterChange
}: IncidentsListProps) {
  const getSeverityBadge = (severity: string) => {
    const colors = {
      low: 'bg-green-100 text-green-700 border-green-200',
      medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      high: 'bg-orange-100 text-orange-700 border-orange-200',
      critical: 'bg-red-100 text-red-700 border-red-200'
    };
    return <Badge className={colors[severity as keyof typeof colors]}>{severity}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      open: 'bg-red-100 text-red-700 border-red-200',
      investigating: 'bg-blue-100 text-blue-700 border-blue-200',
      resolved: 'bg-green-100 text-green-700 border-green-200',
      closed: 'bg-gray-100 text-gray-700 border-gray-200'
    };
    return <Badge className={colors[status as keyof typeof colors]}>{status}</Badge>;
  };

  const getIncidentIcon = (severity: string) => {
    const icons = {
      low: <div className="w-3 h-3 rounded-full bg-green-500" />,
      medium: <div className="w-3 h-3 rounded-full bg-yellow-500" />,
      high: <div className="w-3 h-3 rounded-full bg-orange-500" />,
      critical: <AlertTriangle className="w-4 h-4 text-red-500" />
    };
    return icons[severity as keyof typeof icons];
  };

  return (
    <div className="space-y-6">
      {/* Filtres */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Rechercher un incident..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={onStatusFilterChange}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous statuts</SelectItem>
                <SelectItem value="open">Ouvert</SelectItem>
                <SelectItem value="investigating">En cours</SelectItem>
                <SelectItem value="resolved">Résolu</SelectItem>
                <SelectItem value="closed">Fermé</SelectItem>
              </SelectContent>
            </Select>

            <Select value={severityFilter} onValueChange={onSeverityFilterChange}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Gravité" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes gravités</SelectItem>
                <SelectItem value="critical">Critique</SelectItem>
                <SelectItem value="high">Élevé</SelectItem>
                <SelectItem value="medium">Moyen</SelectItem>
                <SelectItem value="low">Faible</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Liste des incidents */}
      <div className="space-y-4">
        {incidents.map((incident) => (
          <Card key={incident.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    {getIncidentIcon(incident.severity)}
                    <h3 className="font-semibold text-lg">{incident.title}</h3>
                    {getSeverityBadge(incident.severity)}
                    {getStatusBadge(incident.status)}
                  </div>
                  
                  <p className="text-muted-foreground">{incident.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{incident.room || 'Non spécifié'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span>{incident.reporter}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span>{new Date(incident.created_at).toLocaleString()}</span>
                    </div>
                    {incident.student_involved && (
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span>Étudiant: {incident.student_involved}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewIncident(incident)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Détails
                  </Button>
                  
                  {incident.status !== 'resolved' && incident.status !== 'closed' && (
                    <Button
                      size="sm"
                      onClick={() => onResolveIncident(incident.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Résoudre
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {incidents.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <AlertTriangle className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Aucun incident trouvé</h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== 'all' || severityFilter !== 'all' 
                  ? 'Aucun incident ne correspond aux critères de recherche.'
                  : 'Aucun incident déclaré pour le moment.'
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}