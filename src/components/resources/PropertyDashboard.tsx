import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Building2, Home, MapPin, Euro, Plus, Edit, TrendingUp, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Property {
  id: string;
  name: string;
  type: 'building' | 'land' | 'equipment' | 'vehicle';
  address: string;
  value: number;
  acquisition_date: string;
  status: 'owned' | 'rented' | 'leased' | 'sold';
  surface_area?: number;
  rooms_count?: number;
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  insurance_expiry?: string;
  maintenance_cost: number;
  depreciation_rate: number;
  description?: string;
}

const mockProperties: Property[] = [
  {
    id: '1',
    name: 'Bâtiment Principal Campus',
    type: 'building',
    address: '123 Avenue de l\'Éducation, 75001 Paris',
    value: 2500000,
    acquisition_date: '2010-09-01',
    status: 'owned',
    surface_area: 1500,
    rooms_count: 25,
    condition: 'good',
    insurance_expiry: '2024-12-31',
    maintenance_cost: 15000,
    depreciation_rate: 2.5,
    description: 'Bâtiment principal avec salles de classe et amphithéâtres'
  },
  {
    id: '2',
    name: 'Résidence Étudiante Nord',
    type: 'building',
    address: '45 Rue des Étudiants, 75002 Paris',
    value: 1800000,
    acquisition_date: '2015-06-15',
    status: 'owned',
    surface_area: 2000,
    rooms_count: 40,
    condition: 'excellent',
    insurance_expiry: '2024-08-30',
    maintenance_cost: 12000,
    depreciation_rate: 3.0,
    description: 'Résidence avec 40 studios pour étudiants'
  },
  {
    id: '3',
    name: 'Terrain de Sport',
    type: 'land',
    address: '78 Avenue du Sport, 75003 Paris',
    value: 450000,
    acquisition_date: '2018-03-20',
    status: 'owned',
    surface_area: 5000,
    condition: 'good',
    maintenance_cost: 3000,
    depreciation_rate: 0,
    description: 'Terrain de sport avec courts de tennis et football'
  }
];

export function PropertyDashboard() {
  const [properties, setProperties] = useState<Property[]>(mockProperties);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const { toast } = useToast();

  const [formData, setFormData] = useState<Partial<Property>>({
    type: 'building',
    status: 'owned',
    condition: 'good',
    depreciation_rate: 2.5
  });

  const totalValue = properties.reduce((sum, prop) => sum + prop.value, 0);
  const maintenanceCosts = properties.reduce((sum, prop) => sum + prop.maintenance_cost, 0);
  const averageCondition = properties.filter(p => p.condition === 'excellent' || p.condition === 'good').length / properties.length * 100;

  const filteredProperties = properties.filter(property => {
    const statusMatch = filterStatus === 'all' || property.status === filterStatus;
    const typeMatch = filterType === 'all' || property.type === filterType;
    return statusMatch && typeMatch;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedProperty) {
      setProperties(prev => 
        prev.map(prop => 
          prop.id === selectedProperty.id 
            ? { ...prop, ...formData }
            : prop
        )
      );
      toast({
        title: "Bien mis à jour",
        description: "Les informations du bien ont été mises à jour avec succès",
      });
    } else {
      const newProperty: Property = {
        id: Date.now().toString(),
        name: formData.name || '',
        type: formData.type || 'building',
        address: formData.address || '',
        value: formData.value || 0,
        acquisition_date: formData.acquisition_date || new Date().toISOString().split('T')[0],
        status: formData.status || 'owned',
        surface_area: formData.surface_area,
        rooms_count: formData.rooms_count,
        condition: formData.condition || 'good',
        insurance_expiry: formData.insurance_expiry,
        maintenance_cost: formData.maintenance_cost || 0,
        depreciation_rate: formData.depreciation_rate || 2.5,
        description: formData.description
      };
      
      setProperties(prev => [...prev, newProperty]);
      toast({
        title: "Bien ajouté",
        description: "Le nouveau bien a été ajouté au patrimoine",
      });
    }
    
    setIsFormOpen(false);
    setSelectedProperty(null);
    setFormData({
      type: 'building',
      status: 'owned',
      condition: 'good',
      depreciation_rate: 2.5
    });
  };

  const openEditForm = (property: Property) => {
    setSelectedProperty(property);
    setFormData(property);
    setIsFormOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'owned': return 'bg-green-100 text-green-700 border-green-200';
      case 'rented': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'leased': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'sold': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'excellent': return 'bg-green-100 text-green-700 border-green-200';
      case 'good': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'fair': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'poor': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'building': return Building2;
      case 'land': return MapPin;
      case 'equipment': return Home;
      case 'vehicle': return Home;
      default: return Building2;
    }
  };

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Valeur Totale</p>
                <p className="text-2xl font-bold">{totalValue.toLocaleString()}€</p>
              </div>
              <Euro className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Biens Gérés</p>
                <p className="text-2xl font-bold">{properties.length}</p>
              </div>
              <Building2 className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Coûts Maintenance</p>
                <p className="text-2xl font-bold">{maintenanceCosts.toLocaleString()}€</p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">État Moyen</p>
                <p className="text-2xl font-bold">{averageCondition.toFixed(0)}%</p>
                <p className="text-xs text-muted-foreground">Bon/Excellent</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Gestion du Patrimoine Immobilier</CardTitle>
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Nouveau Bien
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {selectedProperty ? 'Modifier le bien' : 'Ajouter un bien'}
                  </DialogTitle>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Nom du bien</Label>
                      <Input
                        value={formData.name || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Nom du bien"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Type</Label>
                      <Select
                        value={formData.type}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as Property['type'] }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="building">Bâtiment</SelectItem>
                          <SelectItem value="land">Terrain</SelectItem>
                          <SelectItem value="equipment">Équipement</SelectItem>
                          <SelectItem value="vehicle">Véhicule</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Adresse</Label>
                    <Textarea
                      value={formData.address || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                      placeholder="Adresse complète"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Valeur (€)</Label>
                      <Input
                        type="number"
                        value={formData.value || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, value: parseFloat(e.target.value) || 0 }))}
                        placeholder="Valeur en euros"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Date d'acquisition</Label>
                      <Input
                        type="date"
                        value={formData.acquisition_date || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, acquisition_date: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsFormOpen(false)}
                    >
                      Annuler
                    </Button>
                    <Button type="submit">
                      {selectedProperty ? 'Mettre à jour' : 'Ajouter'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Label>Statut:</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="owned">Propriété</SelectItem>
                  <SelectItem value="rented">Location</SelectItem>
                  <SelectItem value="leased">Bail</SelectItem>
                  <SelectItem value="sold">Vendu</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2">
              <Label>Type:</Label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="building">Bâtiment</SelectItem>
                  <SelectItem value="land">Terrain</SelectItem>
                  <SelectItem value="equipment">Équipement</SelectItem>
                  <SelectItem value="vehicle">Véhicule</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Properties Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => {
              const TypeIcon = getTypeIcon(property.type);
              
              return (
                <Card key={property.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <TypeIcon className="w-5 h-5 text-primary" />
                        <div>
                          <h3 className="font-semibold text-sm">{property.name}</h3>
                          <p className="text-xs text-muted-foreground">
                            {property.type === 'building' && 'Bâtiment'}
                            {property.type === 'land' && 'Terrain'}
                            {property.type === 'equipment' && 'Équipement'}
                            {property.type === 'vehicle' && 'Véhicule'}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditForm(property)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="text-muted-foreground truncate">
                        {property.address}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-lg">
                        {property.value.toLocaleString()}€
                      </span>
                      <div className="flex gap-2">
                        <Badge className={getStatusColor(property.status)}>
                          {property.status === 'owned' && 'Propriété'}
                          {property.status === 'rented' && 'Location'}
                          {property.status === 'leased' && 'Bail'}
                          {property.status === 'sold' && 'Vendu'}
                        </Badge>
                        <Badge className={getConditionColor(property.condition)}>
                          {property.condition === 'excellent' && 'Excellent'}
                          {property.condition === 'good' && 'Bon'}
                          {property.condition === 'fair' && 'Moyen'}
                          {property.condition === 'poor' && 'Mauvais'}
                        </Badge>
                      </div>
                    </div>
                    
                    {property.surface_area && (
                      <div className="text-sm text-muted-foreground">
                        Surface: {property.surface_area} m²
                        {property.rooms_count && ` • ${property.rooms_count} pièces`}
                      </div>
                    )}
                    
                    <div className="text-sm text-muted-foreground">
                      Maintenance: {property.maintenance_cost.toLocaleString()}€/an
                    </div>
                    
                    {property.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {property.description}
                      </p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}