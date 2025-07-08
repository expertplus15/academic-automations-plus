import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, Plus, Search, Clock, CheckCircle, AlertTriangle, Users, MapPin, Trash2, CalendarIcon } from 'lucide-react';
import { useBookings } from '@/hooks/resources/useBookings';
import { useAssets } from '@/hooks/resources/useAssets';
import { useRooms } from '@/hooks/useRooms';
import { useToast } from '@/hooks/use-toast';

// Interface is imported from useBookings hook

export function BookingsDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    resource_type: 'room' as 'room' | 'equipment',
    asset_id: '',
    room_id: '',
    start_date: '',
    end_date: '',
    purpose: '',
    notes: ''
  });

  const { toast } = useToast();
  const { bookings, loading, createBooking, cancelBooking, approveBooking } = useBookings();
  const { assets } = useAssets();
  const { rooms } = useRooms();

  const handleCreateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createBooking({
        asset_id: formData.resource_type === 'equipment' ? formData.asset_id : null,
        room_id: formData.resource_type === 'room' ? formData.room_id : null,
        start_date: formData.start_date,
        end_date: formData.end_date,
        purpose: formData.purpose,
        notes: formData.notes
      });
      setIsFormOpen(false);
      setFormData({
        resource_type: 'room',
        asset_id: '',
        room_id: '',
        start_date: '',
        end_date: '',
        purpose: '',
        notes: ''
      });
    } catch (error) {
      console.error('Error creating booking:', error);
    }
  };

  const handleDeleteBooking = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette réservation ?')) {
      try {
        await cancelBooking(id);
      } catch (error) {
        console.error('Error deleting booking:', error);
      }
    }
  };

  const handleApproveBooking = async (id: string) => {
    try {
      await approveBooking(id, true);
    } catch (error) {
      console.error('Error approving booking:', error);
    }
  };

  const handleRejectBooking = async (id: string) => {
    try {
      await approveBooking(id, false);
    } catch (error) {
      console.error('Error rejecting booking:', error);
    }
  };

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
    const resourceName = booking.asset?.name || booking.room?.name || '';
    const userName = booking.user?.full_name || '';
    const resourceType = booking.asset_id ? 'equipment' : 'room';
    
    const matchesSearch = resourceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.purpose.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    const matchesType = typeFilter === 'all' || resourceType === typeFilter;
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Calendar className="w-8 h-8 mx-auto mb-4 text-muted-foreground opacity-50 animate-spin" />
          <p className="text-muted-foreground">Chargement des réservations...</p>
        </div>
      </div>
    );
  }

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
              <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-primary text-primary-foreground">
                    <Plus className="w-4 h-4 mr-2" />
                    Nouvelle réservation
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Nouvelle réservation</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleCreateBooking} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Type de ressource</Label>
                        <Select
                          value={formData.resource_type}
                          onValueChange={(value: 'room' | 'equipment') =>
                            setFormData(prev => ({ ...prev, resource_type: value, asset_id: '', room_id: '' }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="room">Salle</SelectItem>
                            <SelectItem value="equipment">Équipement</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>
                          {formData.resource_type === 'room' ? 'Salle' : 'Équipement'}
                        </Label>
                        <Select
                          value={formData.resource_type === 'room' ? formData.room_id : formData.asset_id}
                          onValueChange={(value) =>
                            setFormData(prev => ({
                              ...prev,
                              [formData.resource_type === 'room' ? 'room_id' : 'asset_id']: value
                            }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={`Sélectionner ${formData.resource_type === 'room' ? 'une salle' : 'un équipement'}`} />
                          </SelectTrigger>
                          <SelectContent>
                            {formData.resource_type === 'room'
                              ? rooms.map((room) => (
                                  <SelectItem key={room.id} value={room.id}>
                                    {room.name}
                                  </SelectItem>
                                ))
                              : assets.filter(asset => asset.status === 'active').map((asset) => (
                                  <SelectItem key={asset.id} value={asset.id}>
                                    {asset.name}
                                  </SelectItem>
                                ))
                            }
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Date et heure de début</Label>
                        <Input
                          type="datetime-local"
                          value={formData.start_date}
                          onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Date et heure de fin</Label>
                        <Input
                          type="datetime-local"
                          value={formData.end_date}
                          onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Motif de la réservation</Label>
                      <Input
                        value={formData.purpose}
                        onChange={(e) => setFormData(prev => ({ ...prev, purpose: e.target.value }))}
                        placeholder="Ex: Réunion équipe, Cours magistral..."
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Notes complémentaires</Label>
                      <Textarea
                        value={formData.notes}
                        onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                        placeholder="Informations supplémentaires..."
                        rows={3}
                      />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                      <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                        Annuler
                      </Button>
                      <Button type="submit">
                        Créer la réservation
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
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
            {filteredBookings.map((booking) => {
              const resourceName = booking.asset?.name || booking.room?.name || 'Ressource inconnue';
              const resourceType = booking.asset_id ? 'equipment' : 'room';
              const userName = booking.user?.full_name || 'Utilisateur inconnu';
              
              return (
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
                        <h3 className="font-semibold text-foreground">{resourceName}</h3>
                        {getTypeBadge(resourceType)}
                        {getStatusBadge(booking.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">{booking.purpose}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>
                          <span className="font-medium">Demandeur:</span> {userName}
                        </span>
                        <span>
                          <span className="font-medium">Date:</span> {new Date(booking.start_date).toLocaleDateString('fr-FR')}
                        </span>
                        <span>
                          <span className="font-medium">Horaire:</span> {new Date(booking.start_date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} - {new Date(booking.end_date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {booking.notes && (
                          <span>
                            <span className="font-medium">Notes:</span> {booking.notes}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => console.log('Modifier', booking.id)}>
                      Modifier
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => console.log('Détails', booking.id)}>
                      Détails
                    </Button>
                    {booking.status === 'pending' && (
                      <>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => handleApproveBooking(booking.id)}>
                          Approuver
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleRejectBooking(booking.id)}>
                          Rejeter
                        </Button>
                      </>
                    )}
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => handleDeleteBooking(booking.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
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