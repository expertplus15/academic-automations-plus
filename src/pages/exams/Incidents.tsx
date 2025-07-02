import { useState } from 'react';
import { ExamsModuleLayout } from "@/components/layouts/ExamsModuleLayout";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, Plus, FileText, TrendingUp, Clock } from 'lucide-react';
import { IncidentForm } from '@/components/exams/incidents/IncidentForm';
import { IncidentsList } from '@/components/exams/incidents/IncidentsList';

export default function Incidents() {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  
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

  // Données simulées d'incidents
  const [incidents, setIncidents] = useState<Incident[]>([
    {
      id: 'INC-001',
      title: 'Tentative de tricherie détectée',
      description: 'Étudiant surpris avec des notes cachées pendant l\'examen de mathématiques.',
      type: 'cheating',
      severity: 'high',
      status: 'investigating',
      room: 'Amphi A',
      reporter: 'Dr. Martin',
      student_involved: 'Jean Dupont - 12345',
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'INC-002', 
      title: 'Malaise étudiant',
      description: 'Étudiante victime d\'un malaise vagal durant l\'examen de physique.',
      type: 'medical_emergency',
      severity: 'medium',
      status: 'resolved',
      room: 'Salle 205',
      reporter: 'Mme. Dubois',
      student_involved: 'Marie Claire - 67890',
      created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      resolved_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'INC-003',
      title: 'Panne électrique',
      description: 'Coupure de courant pendant 15 minutes dans le bâtiment B.',
      type: 'technical_issue',
      severity: 'critical',
      status: 'resolved',
      room: 'Bâtiment B - Tous locaux',
      reporter: 'Service Technique',
      created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      resolved_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
    }
  ]);

  const filteredIncidents = incidents.filter(incident => {
    const matchesSearch = incident.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         incident.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         incident.reporter.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || incident.status === statusFilter;
    const matchesSeverity = severityFilter === 'all' || incident.severity === severityFilter;
    
    return matchesSearch && matchesStatus && matchesSeverity;
  });

  const handleSubmitIncident = (newIncident: any) => {
    setIncidents(prev => [newIncident, ...prev]);
    setShowForm(false);
  };

  const handleResolveIncident = (id: string) => {
    setIncidents(prev => prev.map(incident => 
      incident.id === id 
        ? { ...incident, status: 'resolved' as Incident['status'], resolved_at: new Date().toISOString() }
        : incident
    ));
  };

  const handleViewIncident = (incident: any) => {
    console.log('View incident:', incident);
    // TODO: Implémenter la vue détaillée
  };

  // Métriques
  const totalIncidents = incidents.length;
  const openIncidents = incidents.filter(i => i.status === 'open' || i.status === 'investigating').length;
  const criticalIncidents = incidents.filter(i => i.severity === 'critical').length;
  const resolvedToday = incidents.filter(i => {
    if (!i.resolved_at) return false;
    const today = new Date().toDateString();
    return new Date(i.resolved_at).toDateString() === today;
  }).length;

  return (
    <ExamsModuleLayout 
      title="Incidents & PV" 
      subtitle="Gestion des problèmes et procès-verbaux"
    >
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Métriques */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                  <div>
                    <p className="text-2xl font-bold">{totalIncidents}</p>
                    <p className="text-sm text-muted-foreground">Total Incidents</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Clock className="w-8 h-8 text-orange-600" />
                  <div>
                    <p className="text-2xl font-bold">{openIncidents}</p>
                    <p className="text-sm text-muted-foreground">En Cours</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                  <div>
                    <p className="text-2xl font-bold">{criticalIncidents}</p>
                    <p className="text-sm text-muted-foreground">Critiques</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold">{resolvedToday}</p>
                    <p className="text-sm text-muted-foreground">Résolus Aujourd'hui</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions rapides */}
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Gestion des Incidents</h2>
            <Button 
              onClick={() => setShowForm(true)}
              className="bg-red-600 hover:bg-red-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Déclarer un Incident
            </Button>
          </div>

          <Tabs defaultValue="incidents" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="incidents">Liste des Incidents</TabsTrigger>
              <TabsTrigger value="reports">Procès-Verbaux</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
            
            <TabsContent value="incidents" className="space-y-6">
              {showForm ? (
                <IncidentForm 
                  onSubmit={handleSubmitIncident}
                  onCancel={() => setShowForm(false)}
                />
              ) : (
                <IncidentsList
                  incidents={filteredIncidents}
                  onViewIncident={handleViewIncident}
                  onResolveIncident={handleResolveIncident}
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  statusFilter={statusFilter}
                  onStatusFilterChange={setStatusFilter}
                  severityFilter={severityFilter}
                  onSeverityFilterChange={setSeverityFilter}
                />
              )}
            </TabsContent>
            
            <TabsContent value="reports" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-500" />
                    Procès-Verbaux
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Génération de Procès-Verbaux</h3>
                    <p className="text-muted-foreground mb-4">
                      Générez automatiquement des procès-verbaux pour les incidents résolus.
                    </p>
                    <Button variant="outline">
                      <FileText className="w-4 h-4 mr-2" />
                      Générer un PV
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Répartition par Type</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(
                        incidents.reduce((acc, incident) => {
                          acc[incident.type] = (acc[incident.type] || 0) + 1;
                          return acc;
                        }, {} as Record<string, number>)
                      ).map(([type, count]) => (
                        <div key={type} className="flex justify-between">
                          <span className="capitalize">{type.replace('_', ' ')}</span>
                          <span className="font-semibold">{count}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Temps de Résolution Moyen</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <p className="text-3xl font-bold text-green-600">2.3h</p>
                      <p className="text-sm text-muted-foreground">Temps moyen de résolution</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ExamsModuleLayout>
  );
}