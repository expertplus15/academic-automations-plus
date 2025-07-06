import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  History, 
  User, 
  Calendar, 
  FileText, 
  Edit, 
  Trash2,
  Download,
  Search,
  Filter,
  Eye,
  RotateCcw
} from 'lucide-react';

export function HistoryDashboard() {
  const [auditLogs] = useState([
    {
      id: 1,
      timestamp: '2024-01-15 14:35:22',
      user: 'Prof. Martin',
      userId: 'martin@school.edu',
      action: 'grade_modified',
      target: 'Note Mathématiques L1 - Dupont Jean',
      details: 'Note modifiée de 12.5 à 14.0',
      ip: '192.168.1.45',
      oldValue: '12.5',
      newValue: '14.0',
      approved: true
    },
    {
      id: 2,
      timestamp: '2024-01-15 14:30:15',
      user: 'Secrétariat',
      userId: 'secretariat@school.edu',
      action: 'bulk_import',
      target: 'Notes Physique L2',
      details: 'Import de 89 notes depuis Excel',
      ip: '192.168.1.12',
      recordsAffected: 89,
      approved: true
    },
    {
      id: 3,
      timestamp: '2024-01-15 14:25:08',
      user: 'Admin Système',
      userId: 'admin@school.edu',
      action: 'grade_published',
      target: 'Bulletin L1 Informatique',
      details: 'Publication des bulletins pour 156 étudiants',
      ip: '192.168.1.1',
      recordsAffected: 156,
      approved: true
    },
    {
      id: 4,
      timestamp: '2024-01-15 14:20:33',
      user: 'Prof. Durand',
      userId: 'durand@school.edu',
      action: 'grade_deleted',
      target: 'Note Chimie L1 - Bernard Marie',
      details: 'Suppression note incorrecte',
      ip: '192.168.1.67',
      oldValue: '8.5',
      approved: false,
      requiresApproval: true
    },
    {
      id: 5,
      timestamp: '2024-01-15 14:15:45',
      user: 'Prof. Lefebvre',
      userId: 'lefebvre@school.edu',
      action: 'calculation_run',
      target: 'Moyennes Semestre 1',
      details: 'Recalcul automatique des moyennes',
      ip: '192.168.1.89',
      recordsAffected: 2341,
      approved: true
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAction, setSelectedAction] = useState('all');
  const [selectedUser, setSelectedUser] = useState('all');

  const auditStats = {
    totalActions: auditLogs.length,
    todayActions: auditLogs.length,
    pendingApprovals: auditLogs.filter(log => !log.approved).length,
    uniqueUsers: new Set(auditLogs.map(log => log.user)).size
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'grade_modified':
        return <Edit className="w-4 h-4 text-blue-600" />;
      case 'grade_deleted':
        return <Trash2 className="w-4 h-4 text-red-600" />;
      case 'grade_published':
        return <FileText className="w-4 h-4 text-green-600" />;
      case 'bulk_import':
        return <Download className="w-4 h-4 text-purple-600" />;
      case 'calculation_run':
        return <RotateCcw className="w-4 h-4 text-amber-600" />;
      default:
        return <History className="w-4 h-4 text-gray-600" />;
    }
  };

  const getActionLabel = (action: string) => {
    switch (action) {
      case 'grade_modified':
        return 'Note modifiée';
      case 'grade_deleted':
        return 'Note supprimée';
      case 'grade_published':
        return 'Publication';
      case 'bulk_import':
        return 'Import en lot';
      case 'calculation_run':
        return 'Calculs automatiques';
      default:
        return 'Action';
    }
  };

  const getStatusColor = (log: any) => {
    if (log.requiresApproval && !log.approved) return 'destructive';
    if (log.approved) return 'default';
    return 'secondary';
  };

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.target.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = selectedAction === 'all' || log.action === selectedAction;
    const matchesUser = selectedUser === 'all' || log.user === selectedUser;
    return matchesSearch && matchesAction && matchesUser;
  });

  const uniqueUsers = [...new Set(auditLogs.map(log => log.user))];
  const uniqueActions = [...new Set(auditLogs.map(log => log.action))];

  return (
    <div className="space-y-6">
      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <History className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{auditStats.totalActions}</p>
                <p className="text-sm text-muted-foreground">Actions totales</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{auditStats.todayActions}</p>
                <p className="text-sm text-muted-foreground">Aujourd'hui</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center">
                <Eye className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{auditStats.pendingApprovals}</p>
                <p className="text-sm text-muted-foreground">En attente</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <User className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{auditStats.uniqueUsers}</p>
                <p className="text-sm text-muted-foreground">Utilisateurs actifs</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="audit" className="space-y-4">
        <TabsList>
          <TabsTrigger value="audit">Journal d'audit</TabsTrigger>
          <TabsTrigger value="changes">Historique des modifications</TabsTrigger>
          <TabsTrigger value="reports">Rapports</TabsTrigger>
          <TabsTrigger value="settings">Configuration</TabsTrigger>
        </TabsList>

        <TabsContent value="audit" className="space-y-4">
          {/* Filtres */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="flex gap-4 flex-1">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher dans l'historique..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <select
                    className="px-3 py-2 border rounded-md"
                    value={selectedAction}
                    onChange={(e) => setSelectedAction(e.target.value)}
                  >
                    <option value="all">Toutes actions</option>
                    {uniqueActions.map(action => (
                      <option key={action} value={action}>
                        {getActionLabel(action)}
                      </option>
                    ))}
                  </select>

                  <select
                    className="px-3 py-2 border rounded-md"
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                  >
                    <option value="all">Tous utilisateurs</option>
                    {uniqueUsers.map(user => (
                      <option key={user} value={user}>
                        {user}
                      </option>
                    ))}
                  </select>
                </div>
                
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtres avancés
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Journal d'audit */}
          <div className="space-y-3">
            {filteredLogs.map(log => (
              <Card key={log.id}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                      {getActionIcon(log.action)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium">{log.target}</h4>
                        <Badge variant={getStatusColor(log) as any}>
                          {getActionLabel(log.action)}
                        </Badge>
                        {log.requiresApproval && !log.approved && (
                          <Badge variant="destructive">Approbation requise</Badge>
                        )}
                      </div>
                      
                      <p className="text-muted-foreground mb-3">{log.details}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Utilisateur:</span>
                          <div className="flex items-center gap-1 mt-1">
                            <User className="w-3 h-3" />
                            <span>{log.user}</span>
                          </div>
                        </div>
                        <div>
                          <span className="font-medium">Date & Heure:</span>
                          <div className="flex items-center gap-1 mt-1">
                            <Calendar className="w-3 h-3" />
                            <span>{log.timestamp}</span>
                          </div>
                        </div>
                        <div>
                          <span className="font-medium">Adresse IP:</span>
                          <div className="mt-1">
                            <span className="font-mono text-xs">{log.ip}</span>
                          </div>
                        </div>
                        <div>
                          <span className="font-medium">Email:</span>
                          <div className="mt-1">
                            <span className="text-xs">{log.userId}</span>
                          </div>
                        </div>
                      </div>
                      
                      {(log.oldValue || log.newValue) && (
                        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                          <div className="text-sm">
                            {log.oldValue && (
                              <div>
                                <span className="font-medium">Ancienne valeur:</span>
                                <span className="ml-2 text-red-600">{log.oldValue}</span>
                              </div>
                            )}
                            {log.newValue && (
                              <div>
                                <span className="font-medium">Nouvelle valeur:</span>
                                <span className="ml-2 text-green-600">{log.newValue}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {log.recordsAffected && (
                        <div className="mt-2 text-sm text-muted-foreground">
                          {log.recordsAffected} enregistrement{log.recordsAffected > 1 ? 's' : ''} affecté{log.recordsAffected > 1 ? 's' : ''}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      {log.requiresApproval && !log.approved && (
                        <Button size="sm">
                          Approuver
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="changes" className="space-y-4">
          <h3 className="text-lg font-semibold">Historique des modifications</h3>
          
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-8 text-muted-foreground">
                <Edit className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold mb-2">Suivi détaillé des modifications</h3>
                <p>Consultez l'historique complet des changements apportés aux notes et évaluations</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <h3 className="text-lg font-semibold">Rapports d'audit</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Rapport mensuel</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Synthèse des activités du mois dernier
                </p>
                <Button variant="outline" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Télécharger PDF
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Analyse des utilisateurs</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Activité par utilisateur et département
                </p>
                <Button variant="outline" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Exporter CSV
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <h3 className="text-lg font-semibold">Configuration de l'audit</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Rétention des données</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Durée de conservation</label>
                  <p className="text-sm text-muted-foreground">24 mois</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Archive automatique</label>
                  <p className="text-sm text-muted-foreground">Activée après 12 mois</p>
                </div>
                <Button variant="outline">Modifier</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Notifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Actions sensibles</label>
                  <p className="text-sm text-muted-foreground">Notification immédiate</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Rapport quotidien</label>
                  <p className="text-sm text-muted-foreground">Envoyé aux administrateurs</p>
                </div>
                <Button variant="outline">Configurer</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}