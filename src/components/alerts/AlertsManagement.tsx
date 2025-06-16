
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertTriangle, CheckCircle, Eye, EyeOff, Filter, Search } from 'lucide-react';
import { useAcademicAlerts, type AlertsFilters } from '@/hooks/useAcademicAlerts';
import { useToast } from '@/hooks/use-toast';

export function AlertsManagement() {
  const [filters, setFilters] = useState<AlertsFilters>({});
  const [searchTerm, setSearchTerm] = useState('');
  const { alerts, loading, markAsRead, acknowledgeAlert, deactivateAlert } = useAcademicAlerts(filters);
  const { toast } = useToast();

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  const getAlertTypeLabel = (type: string) => {
    switch (type) {
      case 'low_grade': return 'Note faible';
      case 'excessive_absences': return 'Absences excessives';
      case 'failing_subject': return 'Échec matière';
      case 'attendance_drop': return 'Chute assiduité';
      case 'at_risk': return 'Risque d\'échec';
      default: return type;
    }
  };

  const handleMarkAsRead = async (alertId: string) => {
    const { error } = await markAsRead(alertId);
    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de marquer l'alerte comme lue",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Succès",
        description: "Alerte marquée comme lue"
      });
    }
  };

  const handleAcknowledge = async (alertId: string) => {
    const { error } = await acknowledgeAlert(alertId);
    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'acquitter l'alerte",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Succès",
        description: "Alerte acquittée"
      });
    }
  };

  const handleDeactivate = async (alertId: string) => {
    const { error } = await deactivateAlert(alertId);
    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de désactiver l'alerte",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Succès",
        description: "Alerte désactivée"
      });
    }
  };

  const filteredAlerts = alerts.filter(alert =>
    alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    alert.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Statistics
  const stats = {
    total: alerts.length,
    critical: alerts.filter(a => a.severity === 'critical').length,
    unread: alerts.filter(a => !a.is_read).length,
    active: alerts.filter(a => a.is_active).length
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestion des Alertes</h1>
          <p className="text-muted-foreground">
            Surveillance et gestion des alertes académiques
          </p>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Total</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <div>
                <p className="text-sm font-medium">Critiques</p>
                <p className="text-2xl font-bold">{stats.critical}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <EyeOff className="h-4 w-4 text-orange-600" />
              <div>
                <p className="text-sm font-medium">Non lues</p>
                <p className="text-2xl font-bold">{stats.unread}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm font-medium">Actives</p>
                <p className="text-2xl font-bold">{stats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filtres et Recherche
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filters.severity || ''} onValueChange={(value) => 
              setFilters(prev => ({ ...prev, severity: value || undefined }))
            }>
              <SelectTrigger>
                <SelectValue placeholder="Sévérité" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Toutes</SelectItem>
                <SelectItem value="critical">Critique</SelectItem>
                <SelectItem value="high">Élevée</SelectItem>
                <SelectItem value="medium">Moyenne</SelectItem>
                <SelectItem value="low">Faible</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filters.alert_type || ''} onValueChange={(value) => 
              setFilters(prev => ({ ...prev, alert_type: value || undefined }))
            }>
              <SelectTrigger>
                <SelectValue placeholder="Type d'alerte" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tous</SelectItem>
                <SelectItem value="low_grade">Note faible</SelectItem>
                <SelectItem value="excessive_absences">Absences excessives</SelectItem>
                <SelectItem value="failing_subject">Échec matière</SelectItem>
                <SelectItem value="at_risk">Risque d'échec</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filters.is_read?.toString() || ''} onValueChange={(value) => 
              setFilters(prev => ({ ...prev, is_read: value ? value === 'true' : undefined }))
            }>
              <SelectTrigger>
                <SelectValue placeholder="Statut lecture" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Toutes</SelectItem>
                <SelectItem value="false">Non lues</SelectItem>
                <SelectItem value="true">Lues</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Alerts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Alertes</CardTitle>
          <CardDescription>
            {filteredAlerts.length} alerte(s) trouvée(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Étudiant</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Sévérité</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAlerts.map((alert) => (
                <TableRow key={alert.id} className={!alert.is_read ? 'bg-muted/50' : ''}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{alert.students?.profiles?.full_name}</p>
                      <p className="text-sm text-muted-foreground">{alert.students?.student_number}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {getAlertTypeLabel(alert.alert_type)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getSeverityColor(alert.severity)}>
                      {alert.severity}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{alert.title}</p>
                      <p className="text-sm text-muted-foreground">{alert.message}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(alert.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      {!alert.is_read && <Badge variant="secondary">Non lue</Badge>}
                      {!alert.is_active && <Badge variant="outline">Inactive</Badge>}
                      {alert.acknowledged_at && <Badge variant="default">Acquittée</Badge>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {!alert.is_read && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleMarkAsRead(alert.id)}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                      )}
                      {!alert.acknowledged_at && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAcknowledge(alert.id)}
                        >
                          <CheckCircle className="h-3 w-3" />
                        </Button>
                      )}
                      {alert.is_active && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeactivate(alert.id)}
                        >
                          <EyeOff className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
