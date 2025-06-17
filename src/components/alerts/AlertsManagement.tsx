
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, AlertTriangle, CheckCircle, Clock, Search, Filter, Plus } from 'lucide-react';

const mockAlerts = [
  {
    id: '1',
    type: 'absence',
    severity: 'high',
    title: 'Absence répétée',
    message: 'Jean Dupont a été absent 5 fois ce mois',
    student: 'Jean Dupont',
    studentNumber: 'INF24001',
    date: '2024-01-15',
    status: 'active'
  },
  {
    id: '2',
    type: 'grade',
    severity: 'medium',
    title: 'Notes en baisse',
    message: 'Marie Martin a une moyenne de 8/20 en mathématiques',
    student: 'Marie Martin',
    studentNumber: 'MAT24002',
    date: '2024-01-14',
    status: 'resolved'
  },
  {
    id: '3',
    type: 'attendance',
    severity: 'low',
    title: 'Retard fréquent',
    message: 'Pierre Moreau arrive souvent en retard',
    student: 'Pierre Moreau',
    studentNumber: 'GC24003',
    date: '2024-01-13',
    status: 'pending'
  }
];

export function AlertsManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('all');

  const getSeverityBadge = (severity: string) => {
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

  const getStatusBadge = (status: string) => {
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

  const getAlertIcon = (type: string) => {
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

  const filteredAlerts = mockAlerts.filter(alert => {
    const matchesSearch = alert.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.studentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTab = selectedTab === 'all' || alert.status === selectedTab;
    
    return matchesSearch && matchesTab;
  });

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">3</p>
                <p className="text-sm text-muted-foreground">Alertes actives</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Bell className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">7</p>
                <p className="text-sm text-muted-foreground">Cette semaine</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">12</p>
                <p className="text-sm text-muted-foreground">Résolues</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">85%</p>
                <p className="text-sm text-muted-foreground">Taux de résolution</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-students" />
                Alertes Automatiques
              </CardTitle>
              <CardDescription>
                Surveillance en temps réel des performances et de l'assiduité
              </CardDescription>
            </div>
            <Button className="bg-students hover:bg-students/90">
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle règle
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par étudiant, numéro ou titre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filtres
            </Button>
          </div>

          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="all">Toutes</TabsTrigger>
              <TabsTrigger value="active">Actives</TabsTrigger>
              <TabsTrigger value="pending">En attente</TabsTrigger>
              <TabsTrigger value="resolved">Résolues</TabsTrigger>
            </TabsList>

            <TabsContent value={selectedTab} className="space-y-4">
              {filteredAlerts.map((alert) => (
                <div key={alert.id} className="flex items-center gap-4 p-4 border border-border/50 rounded-lg hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-3">
                    {getAlertIcon(alert.type)}
                    <div>
                      <p className="font-medium text-foreground">{alert.title}</p>
                      <p className="text-sm text-muted-foreground">{alert.message}</p>
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <p className="text-sm font-medium">{alert.student}</p>
                    <p className="text-xs text-muted-foreground">{alert.studentNumber}</p>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">{alert.date}</p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {getSeverityBadge(alert.severity)}
                    {getStatusBadge(alert.status)}
                    <Button variant="ghost" size="sm">
                      Traiter
                    </Button>
                  </div>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
