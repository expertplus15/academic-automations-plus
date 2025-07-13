import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Clock, 
  FileText, 
  Download, 
  Eye, 
  Search, 
  Filter,
  Calendar,
  User,
  Activity,
  BarChart3,
  Archive,
  Trash2,
  RefreshCw
} from 'lucide-react';

interface HistoryEntry {
  id: string;
  type: 'import' | 'calculation' | 'generation' | 'export' | 'validation' | 'modification';
  action: string;
  description: string;
  userId: string;
  userName: string;
  timestamp: string;
  status: 'success' | 'warning' | 'error' | 'in_progress';
  details: {
    recordsAffected?: number;
    duration?: number;
    fileSize?: number;
    errorMessage?: string;
  };
  metadata: {
    program?: string;
    level?: string;
    semester?: string;
    studentCount?: number;
    subjectCount?: number;
  };
}

interface SystemEvent {
  id: string;
  event: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  message: string;
  timestamp: string;
  source: string;
  resolved: boolean;
  resolvedBy?: string;
  resolvedAt?: string;
}

export function HistoryManager() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPeriod, setFilterPeriod] = useState('week');

  const [historyEntries] = useState<HistoryEntry[]>([
    {
      id: 'hist-001',
      type: 'import',
      action: 'Import Excel',
      description: 'Import des notes de Mathématiques L3',
      userId: 'user-001',
      userName: 'Prof. Durand',
      timestamp: '2024-01-20T10:30:00Z',
      status: 'success',
      details: {
        recordsAffected: 45,
        duration: 120,
        fileSize: 2048
      },
      metadata: {
        program: 'Licence Mathématiques',
        level: 'L3',
        semester: 'S5',
        studentCount: 45,
        subjectCount: 1
      }
    },
    {
      id: 'hist-002',
      type: 'calculation',
      action: 'Calcul moyennes',
      description: 'Recalcul automatique des moyennes semestrielles',
      userId: 'system',
      userName: 'Système',
      timestamp: '2024-01-20T14:15:00Z',
      status: 'success',
      details: {
        recordsAffected: 230,
        duration: 45
      },
      metadata: {
        program: 'Tous',
        level: 'Tous',
        semester: 'S5',
        studentCount: 230
      }
    },
    {
      id: 'hist-003',
      type: 'generation',
      action: 'Génération bulletins',
      description: 'Bulletins M1 Informatique - Semestre 1',
      userId: 'user-002',
      userName: 'Admin. Martin',
      timestamp: '2024-01-19T16:45:00Z',
      status: 'warning',
      details: {
        recordsAffected: 38,
        duration: 180,
        errorMessage: '2 bulletins avec notes manquantes'
      },
      metadata: {
        program: 'Master Informatique',
        level: 'M1',
        semester: 'S1',
        studentCount: 38
      }
    },
    {
      id: 'hist-004',
      type: 'validation',
      action: 'Validation notes',
      description: 'Validation des notes de Physique L2',
      userId: 'user-003',
      userName: 'Prof. Leblanc',
      timestamp: '2024-01-19T11:20:00Z',
      status: 'error',
      details: {
        recordsAffected: 0,
        errorMessage: 'Accès refusé - notes déjà validées'
      },
      metadata: {
        program: 'Licence Physique',
        level: 'L2',
        semester: 'S3',
        studentCount: 52
      }
    },
    {
      id: 'hist-005',
      type: 'export',
      action: 'Export CSV',
      description: 'Export des statistiques de classe',
      userId: 'user-001',
      userName: 'Prof. Durand',
      timestamp: '2024-01-18T09:10:00Z',
      status: 'success',
      details: {
        recordsAffected: 150,
        duration: 30,
        fileSize: 1024
      },
      metadata: {
        program: 'Licence Mathématiques',
        studentCount: 150
      }
    }
  ]);

  const [systemEvents] = useState<SystemEvent[]>([
    {
      id: 'evt-001',
      event: 'Sauvegarde automatique',
      severity: 'info',
      message: 'Sauvegarde quotidienne des données réalisée avec succès',
      timestamp: '2024-01-20T02:00:00Z',
      source: 'System Backup',
      resolved: true
    },
    {
      id: 'evt-002',
      event: 'Performance dégradée',
      severity: 'warning',
      message: 'Temps de réponse supérieur à la normale (>2s)',
      timestamp: '2024-01-19T18:30:00Z',
      source: 'Performance Monitor',
      resolved: true,
      resolvedBy: 'Équipe Technique',
      resolvedAt: '2024-01-19T19:15:00Z'
    },
    {
      id: 'evt-003',
      event: 'Erreur calcul ECTS',
      severity: 'error',
      message: 'Échec du calcul ECTS pour 5 étudiants M2',
      timestamp: '2024-01-19T15:45:00Z',
      source: 'ECTS Calculator',
      resolved: false
    }
  ]);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { label: string; className: string }> = {
      success: { label: 'Succès', className: 'bg-green-100 text-green-800' },
      warning: { label: 'Attention', className: 'bg-yellow-100 text-yellow-800' },
      error: { label: 'Erreur', className: 'bg-red-100 text-red-800' },
      in_progress: { label: 'En cours', className: 'bg-blue-100 text-blue-800' }
    };
    
    const variant = variants[status] || variants.success;
    return <Badge className={variant.className}>{variant.label}</Badge>;
  };

  const getSeverityBadge = (severity: string) => {
    const variants: Record<string, { label: string; className: string }> = {
      info: { label: 'Info', className: 'bg-blue-100 text-blue-800' },
      warning: { label: 'Attention', className: 'bg-yellow-100 text-yellow-800' },
      error: { label: 'Erreur', className: 'bg-red-100 text-red-800' },
      critical: { label: 'Critique', className: 'bg-red-100 text-red-900 font-bold' }
    };
    
    const variant = variants[severity] || variants.info;
    return <Badge className={variant.className}>{variant.label}</Badge>;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'import':
        return <Download className="h-4 w-4" />;
      case 'calculation':
        return <BarChart3 className="h-4 w-4" />;
      case 'generation':
        return <FileText className="h-4 w-4" />;
      case 'export':
        return <Archive className="h-4 w-4" />;
      case 'validation':
        return <Eye className="h-4 w-4" />;
      case 'modification':
        return <RefreshCw className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    return `${Math.floor(seconds / 60)}min ${seconds % 60}s`;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

  const filteredHistory = historyEntries.filter(entry => {
    const matchesSearch = entry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.userName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || entry.type === filterType;
    const matchesStatus = filterStatus === 'all' || entry.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const filteredEvents = systemEvents.filter(event => {
    const matchesSearch = event.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.source.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      <Tabs defaultValue="activities" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="activities">Activités</TabsTrigger>
          <TabsTrigger value="events">Événements Système</TabsTrigger>
          <TabsTrigger value="analytics">Analyses</TabsTrigger>
        </TabsList>

        <TabsContent value="activities" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filtres
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-5 gap-4">
                <div className="space-y-2">
                  <Label>Recherche</Label>
                  <Input
                    placeholder="Rechercher..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Type d'action</Label>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les types</SelectItem>
                      <SelectItem value="import">Import</SelectItem>
                      <SelectItem value="calculation">Calcul</SelectItem>
                      <SelectItem value="generation">Génération</SelectItem>
                      <SelectItem value="export">Export</SelectItem>
                      <SelectItem value="validation">Validation</SelectItem>
                      <SelectItem value="modification">Modification</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Statut</Label>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les statuts</SelectItem>
                      <SelectItem value="success">Succès</SelectItem>
                      <SelectItem value="warning">Attention</SelectItem>
                      <SelectItem value="error">Erreur</SelectItem>
                      <SelectItem value="in_progress">En cours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Période</Label>
                  <Select value={filterPeriod} onValueChange={setFilterPeriod}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="day">Aujourd'hui</SelectItem>
                      <SelectItem value="week">Cette semaine</SelectItem>
                      <SelectItem value="month">Ce mois</SelectItem>
                      <SelectItem value="year">Cette année</SelectItem>
                      <SelectItem value="all">Tout</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>&nbsp;</Label>
                  <Button className="w-full">
                    <Search className="h-4 w-4 mr-2" />
                    Filtrer
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activity History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Historique des Activités ({filteredHistory.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredHistory.map((entry) => (
                  <div key={entry.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          {getTypeIcon(entry.type)}
                        </div>
                        <div>
                          <h3 className="font-semibold">{entry.action}</h3>
                          <p className="text-muted-foreground">{entry.description}</p>
                          <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                            <User className="h-3 w-3" />
                            <span>{entry.userName}</span>
                            <Calendar className="h-3 w-3 ml-2" />
                            <span>{new Date(entry.timestamp).toLocaleString('fr-FR')}</span>
                          </div>
                        </div>
                      </div>
                      {getStatusBadge(entry.status)}
                    </div>

                    {/* Metadata */}
                    <div className="grid md:grid-cols-2 gap-4 mb-3">
                      <div className="space-y-1">
                        {entry.metadata.program && (
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Programme:</span>
                            <span>{entry.metadata.program}</span>
                          </div>
                        )}
                        {entry.metadata.level && (
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Niveau:</span>
                            <span>{entry.metadata.level}</span>
                          </div>
                        )}
                        {entry.metadata.semester && (
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Semestre:</span>
                            <span>{entry.metadata.semester}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-1">
                        {entry.details.recordsAffected && (
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Enregistrements:</span>
                            <span>{entry.details.recordsAffected}</span>
                          </div>
                        )}
                        {entry.details.duration && (
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Durée:</span>
                            <span>{formatDuration(entry.details.duration)}</span>
                          </div>
                        )}
                        {entry.details.fileSize && (
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Taille:</span>
                            <span>{formatFileSize(entry.details.fileSize)}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {entry.details.errorMessage && (
                      <Alert variant="destructive">
                        <AlertDescription>{entry.details.errorMessage}</AlertDescription>
                      </Alert>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Événements Système ({filteredEvents.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredEvents.map((event) => (
                  <div key={event.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold">{event.event}</h3>
                        <p className="text-muted-foreground">{event.message}</p>
                        <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                          <span>{event.source}</span>
                          <Calendar className="h-3 w-3 ml-2" />
                          <span>{new Date(event.timestamp).toLocaleString('fr-FR')}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {getSeverityBadge(event.severity)}
                        {event.resolved ? (
                          <Badge className="bg-green-100 text-green-800">Résolu</Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-800">En cours</Badge>
                        )}
                      </div>
                    </div>
                    
                    {event.resolved && event.resolvedBy && (
                      <div className="text-sm text-muted-foreground">
                        Résolu par {event.resolvedBy} le {new Date(event.resolvedAt!).toLocaleString('fr-FR')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Analyses d'Utilisation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-6 border rounded-lg">
                  <h3 className="text-2xl font-bold text-primary">{historyEntries.length}</h3>
                  <p className="text-muted-foreground">Actions cette semaine</p>
                </div>
                
                <div className="text-center p-6 border rounded-lg">
                  <h3 className="text-2xl font-bold text-green-600">
                    {historyEntries.filter(e => e.status === 'success').length}
                  </h3>
                  <p className="text-muted-foreground">Actions réussies</p>
                </div>
                
                <div className="text-center p-6 border rounded-lg">
                  <h3 className="text-2xl font-bold text-red-600">
                    {historyEntries.filter(e => e.status === 'error').length}
                  </h3>
                  <p className="text-muted-foreground">Actions en erreur</p>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="font-semibold mb-3">Actions par type</h3>
                <div className="space-y-2">
                  {['import', 'calculation', 'generation', 'export', 'validation'].map(type => {
                    const count = historyEntries.filter(e => e.type === type).length;
                    const percentage = count > 0 ? (count / historyEntries.length) * 100 : 0;
                    
                    return (
                      <div key={type} className="flex items-center gap-3">
                        <div className="w-20 text-sm capitalize">{type}</div>
                        <div className="flex-1 bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <div className="w-12 text-sm text-right">{count}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}