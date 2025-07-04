import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock, Search, Filter, Download, Eye, Package, ArrowRight, User } from 'lucide-react';

interface MovementRecord {
  id: string;
  asset_number: string;
  asset_name: string;
  movement_type: 'acquisition' | 'transfer' | 'maintenance' | 'disposal' | 'reservation';
  from_location?: string;
  to_location?: string;
  user_name: string;
  timestamp: string;
  description: string;
  status: 'completed' | 'pending' | 'cancelled';
}

export function HistoryDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('last_week');

  // Mock data - à remplacer par les vrais hooks
  const movements: MovementRecord[] = [
    {
      id: '1',
      asset_number: 'AST240001',
      asset_name: 'Projecteur Epson EB-2250U',
      movement_type: 'transfer',
      from_location: 'Salle A1',
      to_location: 'Salle B2',
      user_name: 'Marie Dubois',
      timestamp: '2024-01-18T14:30:00',
      description: 'Déplacement pour séminaire',
      status: 'completed'
    },
    {
      id: '2',
      asset_number: 'AST240002',
      asset_name: 'Ordinateur portable Dell',
      movement_type: 'maintenance',
      from_location: 'Lab Info B2',
      user_name: 'Jean Martin',
      timestamp: '2024-01-17T09:15:00',
      description: 'Maintenance préventive programmée',
      status: 'completed'
    },
    {
      id: '3',
      asset_number: 'AST240045',
      asset_name: 'Tableau interactif Smart',
      movement_type: 'acquisition',
      to_location: 'Salle C1',
      user_name: 'Sophie Laurent',
      timestamp: '2024-01-16T11:00:00',
      description: 'Nouveau matériel acquis',
      status: 'completed'
    },
    {
      id: '4',
      asset_number: 'AST240003',
      asset_name: 'Imprimante HP LaserJet',
      movement_type: 'reservation',
      from_location: 'Administration',
      to_location: 'Salle réunion A3',
      user_name: 'Paul Durand',
      timestamp: '2024-01-15T16:45:00',
      description: 'Réservation pour réunion équipe',
      status: 'pending'
    }
  ];

  const getMovementTypeBadge = (type: string) => {
    switch (type) {
      case 'acquisition':
        return <Badge className="bg-green-100 text-green-700 border-green-200">Acquisition</Badge>;
      case 'transfer':
        return <Badge className="bg-blue-100 text-blue-700 border-blue-200">Transfert</Badge>;
      case 'maintenance':
        return <Badge className="bg-orange-100 text-orange-700 border-orange-200">Maintenance</Badge>;
      case 'disposal':
        return <Badge className="bg-red-100 text-red-700 border-red-200">Mise au rebut</Badge>;
      case 'reservation':
        return <Badge className="bg-purple-100 text-purple-700 border-purple-200">Réservation</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-700 border-green-200">Terminé</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">En attente</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-700 border-red-200">Annulé</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const filteredMovements = movements.filter(movement => {
    const matchesSearch = movement.asset_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         movement.asset_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         movement.user_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || movement.movement_type === typeFilter;
    const matchesStatus = statusFilter === 'all' || movement.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const stats = [
    {
      label: "Mouvements aujourd'hui",
      value: "12",
      icon: Clock,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      label: "Transferts ce mois",
      value: "84",
      icon: ArrowRight,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      label: "Maintenances",
      value: "23",
      icon: Package,
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    },
    {
      label: "Utilisateurs actifs",
      value: "15",
      icon: User,
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
              <Clock className="w-5 h-5 text-primary" />
              Historique des mouvements
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filtres avancés
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Exporter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Rechercher par équipement, numéro ou utilisateur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Type de mouvement" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="acquisition">Acquisitions</SelectItem>
                <SelectItem value="transfer">Transferts</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="disposal">Mise au rebut</SelectItem>
                <SelectItem value="reservation">Réservations</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="completed">Terminés</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="cancelled">Annulés</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Période" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Aujourd'hui</SelectItem>
                <SelectItem value="last_week">7 derniers jours</SelectItem>
                <SelectItem value="last_month">30 derniers jours</SelectItem>
                <SelectItem value="last_year">Cette année</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Movements List */}
          <div className="space-y-4">
            {filteredMovements.map((movement) => (
              <div
                key={movement.id}
                className="flex items-center justify-between p-4 rounded-xl border border-border/50 hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-foreground">{movement.asset_name}</h3>
                      <span className="text-sm text-muted-foreground">({movement.asset_number})</span>
                      {getMovementTypeBadge(movement.movement_type)}
                      {getStatusBadge(movement.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">{movement.description}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>
                        <span className="font-medium">Utilisateur:</span> {movement.user_name}
                      </span>
                      <span>
                        <span className="font-medium">Date:</span> {new Date(movement.timestamp).toLocaleDateString('fr-FR')} à {new Date(movement.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {movement.from_location && (
                        <span>
                          <span className="font-medium">De:</span> {movement.from_location}
                        </span>
                      )}
                      {movement.to_location && (
                        <span>
                          <span className="font-medium">Vers:</span> {movement.to_location}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-1" />
                    Détails
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {filteredMovements.length === 0 && (
            <div className="text-center py-12">
              <Clock className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">Aucun mouvement trouvé</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}