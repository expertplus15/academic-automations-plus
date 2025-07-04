import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Plus, Search, Wrench, Clock, AlertTriangle, CheckCircle } from 'lucide-react';

interface MaintenanceTask {
  id: string;
  asset_name: string;
  asset_number: string;
  maintenance_type: 'preventive' | 'corrective' | 'inspection';
  scheduled_date: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  description: string;
  cost?: number;
  performed_by?: string;
}

export function MaintenanceDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Mock data - à remplacer par les vrais hooks
  const maintenanceTasks: MaintenanceTask[] = [
    {
      id: '1',
      asset_name: 'Projecteur Salle A1',
      asset_number: 'AST240001',
      maintenance_type: 'preventive',
      scheduled_date: '2024-01-20',
      status: 'scheduled',
      description: 'Nettoyage optique et vérification lampe',
      cost: 120
    },
    {
      id: '2',
      asset_name: 'Ordinateur Lab Info',
      asset_number: 'AST240002',
      maintenance_type: 'corrective',
      scheduled_date: '2024-01-18',
      status: 'in_progress',
      description: 'Réparation carte mère défectueuse',
      cost: 350,
      performed_by: 'TechService Plus'
    },
    {
      id: '3',
      asset_name: 'Imprimante Administration',
      asset_number: 'AST240003',
      maintenance_type: 'inspection',
      scheduled_date: '2024-01-15',
      status: 'completed',
      description: 'Contrôle qualité impression et nettoyage',
      cost: 80,
      performed_by: 'Maintenance interne'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Badge className="bg-blue-100 text-blue-700 border-blue-200">
          <Clock className="w-3 h-3 mr-1" />
          Planifiée
        </Badge>;
      case 'in_progress':
        return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
          <Wrench className="w-3 h-3 mr-1" />
          En cours
        </Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-700 border-green-200">
          <CheckCircle className="w-3 h-3 mr-1" />
          Terminée
        </Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-700 border-red-200">
          <AlertTriangle className="w-3 h-3 mr-1" />
          Annulée
        </Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'preventive':
        return <Badge variant="outline" className="border-green-200 text-green-700">Préventive</Badge>;
      case 'corrective':
        return <Badge variant="outline" className="border-orange-200 text-orange-700">Corrective</Badge>;
      case 'inspection':
        return <Badge variant="outline" className="border-blue-200 text-blue-700">Inspection</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const filteredTasks = maintenanceTasks.filter(task => {
    const matchesSearch = task.asset_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.asset_number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = [
    {
      label: "Maintenances planifiées",
      value: maintenanceTasks.filter(t => t.status === 'scheduled').length,
      icon: Clock,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      label: "En cours",
      value: maintenanceTasks.filter(t => t.status === 'in_progress').length,
      icon: Wrench,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100"
    },
    {
      label: "Terminées ce mois",
      value: maintenanceTasks.filter(t => t.status === 'completed').length,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      label: "Coût total",
      value: `${maintenanceTasks.reduce((sum, t) => sum + (t.cost || 0), 0)}€`,
      icon: Calendar,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="bg-white rounded-2xl shadow-sm border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  </div>
                  <div className={`p-3 ${stat.bgColor} rounded-xl`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filters & Actions */}
      <Card className="bg-white rounded-2xl shadow-sm border-0">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Wrench className="w-5 h-5 text-primary" />
              Maintenance Préventive
            </CardTitle>
            <Button className="bg-primary text-primary-foreground">
              <Plus className="w-4 h-4 mr-2" />
              Planifier maintenance
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Rechercher par nom ou numéro d'actif..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="scheduled">Planifiées</SelectItem>
                <SelectItem value="in_progress">En cours</SelectItem>
                <SelectItem value="completed">Terminées</SelectItem>
                <SelectItem value="cancelled">Annulées</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tasks List */}
          <div className="space-y-4">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between p-4 rounded-xl border border-border/50 hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Wrench className="w-6 h-6 text-primary" />
                  </div>
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-foreground">{task.asset_name}</h3>
                      <span className="text-sm text-muted-foreground">({task.asset_number})</span>
                      {getTypeBadge(task.maintenance_type)}
                      {getStatusBadge(task.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">{task.description}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>
                        <span className="font-medium">Date:</span> {new Date(task.scheduled_date).toLocaleDateString('fr-FR')}
                      </span>
                      {task.cost && (
                        <span>
                          <span className="font-medium">Coût:</span> {task.cost}€
                        </span>
                      )}
                      {task.performed_by && (
                        <span>
                          <span className="font-medium">Exécutée par:</span> {task.performed_by}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    Modifier
                  </Button>
                  <Button variant="outline" size="sm">
                    Détails
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}