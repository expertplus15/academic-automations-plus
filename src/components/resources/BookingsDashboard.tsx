import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Plus, Search, Clock, CheckCircle, AlertTriangle, Users, MapPin } from 'lucide-react';

interface Booking {
  id: string;
  resource_name: string;
  resource_type: 'room' | 'equipment';
  user_name: string;
  start_date: string;
  end_date: string;
  status: 'pending' | 'approved' | 'rejected' | 'active' | 'completed';
  purpose: string;
  location: string;
  capacity?: number;
  participants?: number;
}

export function BookingsDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  // Mock data - à remplacer par les vrais hooks
  const bookings: Booking[] = [
    {
      id: '1',
      resource_name: 'Salle de conférence A1',
      resource_type: 'room',
      user_name: 'Marie Dubois',
      start_date: '2024-01-20T14:00',
      end_date: '2024-01-20T16:00',
      status: 'approved',
      purpose: 'Réunion équipe pédagogique',
      location: 'Bâtiment A - 1er étage',
      capacity: 20,
      participants: 12
    },
    {
      id: '2',
      resource_name: 'Projecteur Epson Pro',
      resource_type: 'equipment',
      user_name: 'Jean Martin',
      start_date: '2024-01-22T09:00',
      end_date: '2024-01-22T12:00',
      status: 'pending',
      purpose: 'Cours magistral',
      location: 'Amphithéâtre B'
    },
    {
      id: '3',
      resource_name: 'Laboratoire Informatique',
      resource_type: 'room',
      user_name: 'Sophie Laurent',
      start_date: '2024-01-25T10:00',
      end_date: '2024-01-25T12:00',
      status: 'active',
      purpose: 'TP Programmation',
      location: 'Bâtiment C - RDC',
      capacity: 30,
      participants: 25
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
          <Clock className="w-3 h-3 mr-1" />
          En attente
        </Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-700 border-green-200">
          <CheckCircle className="w-3 h-3 mr-1" />
          Approuvée
        </Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-700 border-red-200">
          <AlertTriangle className="w-3 h-3 mr-1" />
          Rejetée
        </Badge>;
      case 'active':
        return <Badge className="bg-blue-100 text-blue-700 border-blue-200">
          <Calendar className="w-3 h-3 mr-1" />
          En cours
        </Badge>;
      case 'completed':
        return <Badge className="bg-gray-100 text-gray-700 border-gray-200">
          <CheckCircle className="w-3 h-3 mr-1" />
          Terminée
        </Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'room':
        return <Badge variant="outline" className="border-blue-200 text-blue-700">Salle</Badge>;
      case 'equipment':
        return <Badge variant="outline" className="border-green-200 text-green-700">Équipement</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.resource_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.purpose.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    const matchesType = typeFilter === 'all' || booking.resource_type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const stats = [
    {
      label: "Réservations actives",
      value: bookings.filter(b => b.status === 'active').length,
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      label: "En attente d'approbation",
      value: bookings.filter(b => b.status === 'pending').length,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100"
    },
    {
      label: "Salles disponibles",
      value: "12",
      icon: MapPin,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      label: "Taux d'occupation",
      value: "78%",
      icon: Users,
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
              <Calendar className="w-5 h-5 text-primary" />
              Gestion des Réservations
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Calendar className="w-4 h-4 mr-2" />
                Vue calendrier
              </Button>
              <Button className="bg-primary text-primary-foreground">
                <Plus className="w-4 h-4 mr-2" />
                Nouvelle réservation
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Rechercher par ressource, utilisateur ou motif..."
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
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="approved">Approuvées</SelectItem>
                <SelectItem value="active">En cours</SelectItem>
                <SelectItem value="completed">Terminées</SelectItem>
                <SelectItem value="rejected">Rejetées</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrer par type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="room">Salles</SelectItem>
                <SelectItem value="equipment">Équipements</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Bookings List */}
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <div
                key={booking.id}
                className="flex items-center justify-between p-4 rounded-xl border border-border/50 hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-primary" />
                  </div>
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-foreground">{booking.resource_name}</h3>
                      {getTypeBadge(booking.resource_type)}
                      {getStatusBadge(booking.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">{booking.purpose}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>
                        <span className="font-medium">Demandeur:</span> {booking.user_name}
                      </span>
                      <span>
                        <span className="font-medium">Date:</span> {new Date(booking.start_date).toLocaleDateString('fr-FR')}
                      </span>
                      <span>
                        <span className="font-medium">Horaire:</span> {new Date(booking.start_date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} - {new Date(booking.end_date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span>
                        <span className="font-medium">Lieu:</span> {booking.location}
                      </span>
                      {booking.capacity && booking.participants && (
                        <span>
                          <span className="font-medium">Participants:</span> {booking.participants}/{booking.capacity}
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
                  {booking.status === 'pending' && (
                    <>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                        Approuver
                      </Button>
                      <Button size="sm" variant="destructive">
                        Rejeter
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredBookings.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">Aucune réservation trouvée</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}