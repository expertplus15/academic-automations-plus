
import React, { useState, useEffect } from 'react';
import { ExamsModuleLayout } from "@/components/layouts/ExamsModuleLayout";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Users, UserCheck, Clock, AlertTriangle, Search, Filter, Zap } from 'lucide-react';
import { useSupervisors } from '@/hooks/useSupervisors';
import { SupervisorCard } from '@/components/exams/supervisors/SupervisorCard';
import { useExams } from '@/hooks/useExams';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function Supervisors() {
  const { 
    supervisors, 
    assignments, 
    loading, 
    error,
    fetchSupervisors,
    assignSupervisor,
    unassignSupervisor,
    autoAssignSupervisors
  } = useSupervisors();

  const { sessions } = useExams();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedSession, setSelectedSession] = useState('');

  const filteredSupervisors = supervisors.filter(supervisor => {
    const matchesSearch = supervisor.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supervisor.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = departmentFilter === 'all' || supervisor.department_id === departmentFilter;
    const matchesStatus = statusFilter === 'all' || supervisor.status === statusFilter;
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const handleAssignSupervisor = async (supervisorId: string) => {
    if (!selectedSession) {
      alert('Veuillez sélectionner une session d\'examen');
      return;
    }
    
    await assignSupervisor(selectedSession, supervisorId);
  };

  const handleAutoAssign = async () => {
    if (!selectedSession) {
      alert('Veuillez sélectionner une session d\'examen');
      return;
    }
    
    await autoAssignSupervisors(selectedSession, 2); // 2 surveillants par défaut
  };

  const handleViewDetails = (supervisor: any) => {
    console.log('View supervisor details:', supervisor);
    // TODO: Implémenter la vue détails
  };

  // Métriques
  const totalSupervisors = supervisors.length;
  const availableSupervisors = supervisors.filter(s => s.status === 'available').length;
  const totalAssignments = assignments.length;
  const confirmedAssignments = assignments.filter(a => a.status === 'confirmed').length;

  const upcomingSessions = sessions.filter(session => {
    const sessionDate = new Date(session.start_time);
    const now = new Date();
    return sessionDate > now;
  }).slice(0, 10);

  return (
    <ExamsModuleLayout 
      title="Attribution surveillants" 
      subtitle="Attribution automatique des surveillants"
    >
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Métriques */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Users className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold">{totalSupervisors}</p>
                    <p className="text-sm text-muted-foreground">Surveillants Total</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <UserCheck className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold">{availableSupervisors}</p>
                    <p className="text-sm text-muted-foreground">Disponibles</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Clock className="w-8 h-8 text-purple-600" />
                  <div>
                    <p className="text-2xl font-bold">{totalAssignments}</p>
                    <p className="text-sm text-muted-foreground">Assignations</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-8 h-8 text-orange-600" />
                  <div>
                    <p className="text-2xl font-bold">{confirmedAssignments}</p>
                    <p className="text-sm text-muted-foreground">Confirmées</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="w-4 h-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Tabs defaultValue="assign" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="assign">Attribution</TabsTrigger>
              <TabsTrigger value="supervisors">Surveillants</TabsTrigger>
              <TabsTrigger value="schedule">Planning</TabsTrigger>
            </TabsList>
            
            <TabsContent value="assign" className="space-y-6">
              {/* Sélection de session et attribution automatique */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-purple-600" />
                    Attribution Automatique
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-4 items-end">
                    <div className="flex-1">
                      <label className="text-sm font-medium mb-2 block">
                        Sélectionner une session d'examen
                      </label>
                      <Select value={selectedSession} onValueChange={setSelectedSession}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choisir une session..." />
                        </SelectTrigger>
                        <SelectContent>
                          {upcomingSessions.map((session) => (
                            <SelectItem key={session.id} value={session.id}>
                              Session {session.id.slice(0, 8)} - {new Date(session.start_time).toLocaleString()}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Button 
                      onClick={handleAutoAssign}
                      disabled={!selectedSession || loading}
                      className="flex items-center gap-2"
                    >
                      <Zap className="w-4 h-4" />
                      Attribution Auto
                    </Button>
                  </div>
                  
                  <div className="bg-blue-50 p-3 rounded text-sm">
                    <p className="font-semibold text-blue-800">🤖 Attribution Intelligente</p>
                    <p className="text-blue-700">
                      L'algorithme sélectionne automatiquement les surveillants selon leur disponibilité, 
                      charge de travail et préférences horaires.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Filtres et recherche */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex gap-4 items-center">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Rechercher un surveillant..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Statut" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous statuts</SelectItem>
                        <SelectItem value="available">Disponible</SelectItem>
                        <SelectItem value="busy">Occupé</SelectItem>
                        <SelectItem value="unavailable">Indisponible</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Liste des surveillants */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSupervisors.map((supervisor) => (
                  <SupervisorCard
                    key={supervisor.id}
                    supervisor={supervisor}
                    onAssign={handleAssignSupervisor}
                    onViewDetails={handleViewDetails}
                    isAssignable={!!selectedSession}
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="supervisors" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Gestion des Surveillants</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      Liste complète des surveillants avec leurs disponibilités et charges de travail.
                    </p>
                    
                    {/* Statistiques des surveillants */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-green-50 p-4 rounded">
                        <h4 className="font-semibold text-green-800">Très Disponibles</h4>
                        <p className="text-2xl font-bold text-green-600">
                          {supervisors.filter(s => (s.current_load || 0) < 5).length}
                        </p>
                        <p className="text-sm text-green-700">Charge &lt; 25%</p>
                      </div>
                      
                      <div className="bg-yellow-50 p-4 rounded">
                        <h4 className="font-semibold text-yellow-800">Moyennement Chargés</h4>
                        <p className="text-2xl font-bold text-yellow-600">
                          {supervisors.filter(s => (s.current_load || 0) >= 5 && (s.current_load || 0) < 15).length}
                        </p>
                        <p className="text-sm text-yellow-700">Charge 25-75%</p>
                      </div>
                      
                      <div className="bg-red-50 p-4 rounded">
                        <h4 className="font-semibold text-red-800">Très Chargés</h4>
                        <p className="text-2xl font-bold text-red-600">
                          {supervisors.filter(s => (s.current_load || 0) >= 15).length}
                        </p>
                        <p className="text-sm text-red-700">Charge &gt; 75%</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="schedule" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Planning des Surveillances</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      Vue d'ensemble du planning des surveillances par periode.
                    </p>
                    
                    {/* Assignments récents */}
                    <div className="space-y-3">
                      <h4 className="font-semibold">Assignations Récentes</h4>
                      {assignments.slice(0, 5).map((assignment) => (
                        <div key={assignment.id} className="flex items-center justify-between p-3 border rounded">
                          <div>
                            <p className="font-medium">Surveillant {assignment.teacher_id.slice(0, 8)}</p>
                            <p className="text-sm text-muted-foreground">
                              Session {assignment.session_id.slice(0, 8)} - {assignment.supervisor_role}
                            </p>
                          </div>
                          <Badge 
                            variant={assignment.status === 'confirmed' ? 'default' : 'outline'}
                          >
                            {assignment.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ExamsModuleLayout>
  );
}
