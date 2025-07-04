import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building, Plus, Search, Home, MapPin, TrendingUp, Calculator, Shield } from 'lucide-react';

interface Property {
  id: string;
  property_number: string;
  name: string;
  property_type: 'building' | 'land' | 'apartment' | 'office';
  address: string;
  surface_area?: number;
  acquisition_cost?: number;
  current_valuation?: number;
  property_status: 'owned' | 'rented' | 'leased';
  usage_type: 'educational' | 'administrative' | 'residential' | 'commercial';
  insurance_expiry?: string;
}

export function PropertyDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  // Mock data - à remplacer par le vrai hook
  const properties: Property[] = [
    {
      id: '1',
      property_number: 'PROP24001',
      name: 'Campus Principal',
      property_type: 'building',
      address: '123 Avenue de l\'Éducation, 75001 Paris',
      surface_area: 5000,
      acquisition_cost: 2500000,
      current_valuation: 3200000,
      property_status: 'owned',
      usage_type: 'educational',
      insurance_expiry: '2024-12-31'
    },
    {
      id: '2',
      property_number: 'PROP24002',
      name: 'Résidence Étudiante Nord',
      property_type: 'building',
      address: '45 Rue des Étudiants, 75018 Paris',
      surface_area: 2800,
      acquisition_cost: 1800000,
      current_valuation: 2100000,
      property_status: 'owned',
      usage_type: 'residential',
      insurance_expiry: '2024-06-30'
    },
    {
      id: '3',
      property_number: 'PROP24003',
      name: 'Bureaux Administration',
      property_type: 'office',
      address: '78 Boulevard de la Gestion, 75009 Paris',
      surface_area: 800,
      acquisition_cost: 950000,
      current_valuation: 1150000,
      property_status: 'rented',
      usage_type: 'administrative',
      insurance_expiry: '2024-09-15'
    }
  ];

  const getPropertyTypeBadge = (type: string) => {
    switch (type) {
      case 'building':
        return <Badge variant="outline" className="border-blue-200 text-blue-700">Bâtiment</Badge>;
      case 'land':
        return <Badge variant="outline" className="border-green-200 text-green-700">Terrain</Badge>;
      case 'apartment':
        return <Badge variant="outline" className="border-purple-200 text-purple-700">Appartement</Badge>;
      case 'office':
        return <Badge variant="outline" className="border-orange-200 text-orange-700">Bureau</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'owned':
        return <Badge className="bg-green-100 text-green-700 border-green-200">Propriété</Badge>;
      case 'rented':
        return <Badge className="bg-blue-100 text-blue-700 border-blue-200">Location</Badge>;
      case 'leased':
        return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">Bail</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getUsageBadge = (usage: string) => {
    switch (usage) {
      case 'educational':
        return <Badge variant="outline" className="border-indigo-200 text-indigo-700">Éducatif</Badge>;
      case 'administrative':
        return <Badge variant="outline" className="border-gray-200 text-gray-700">Administratif</Badge>;
      case 'residential':
        return <Badge variant="outline" className="border-pink-200 text-pink-700">Résidentiel</Badge>;
      case 'commercial':
        return <Badge variant="outline" className="border-emerald-200 text-emerald-700">Commercial</Badge>;
      default:
        return <Badge variant="outline">{usage}</Badge>;
    }
  };

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.property_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || property.property_type === typeFilter;
    return matchesSearch && matchesType;
  });

  const totalValue = properties.reduce((sum, p) => sum + (p.current_valuation || 0), 0);
  const totalSurface = properties.reduce((sum, p) => sum + (p.surface_area || 0), 0);
  const ownedProperties = properties.filter(p => p.property_status === 'owned').length;

  const stats = [
    {
      label: "Valeur totale",
      value: `${(totalValue / 1000000).toFixed(1)}M€`,
      icon: Calculator,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      label: "Surface totale",
      value: `${totalSurface.toLocaleString()} m²`,
      icon: Home,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      label: "Biens en propriété",
      value: ownedProperties,
      icon: Building,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    {
      label: "Plus-value moyenne",
      value: "+12.5%",
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-100"
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
              <Building className="w-5 h-5 text-primary" />
              Patrimoine Immobilier
            </CardTitle>
            <Button className="bg-primary text-primary-foreground">
              <Plus className="w-4 h-4 mr-2" />
              Ajouter bien
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Rechercher par nom, numéro ou adresse..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrer par type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="building">Bâtiments</SelectItem>
                <SelectItem value="land">Terrains</SelectItem>
                <SelectItem value="apartment">Appartements</SelectItem>
                <SelectItem value="office">Bureaux</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Properties List */}
          <div className="space-y-4">
            {filteredProperties.map((property) => {
              const plusValue = property.current_valuation && property.acquisition_cost 
                ? ((property.current_valuation - property.acquisition_cost) / property.acquisition_cost * 100).toFixed(1)
                : null;
              
              const isInsuranceExpiring = property.insurance_expiry && 
                new Date(property.insurance_expiry) <= new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);

              return (
                <div
                  key={property.id}
                  className="flex items-center justify-between p-4 rounded-xl border border-border/50 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Building className="w-6 h-6 text-primary" />
                    </div>
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-foreground">{property.name}</h3>
                        <span className="text-sm text-muted-foreground">({property.property_number})</span>
                        {getPropertyTypeBadge(property.property_type)}
                        {getStatusBadge(property.property_status)}
                        {getUsageBadge(property.usage_type)}
                        {isInsuranceExpiring && (
                          <Badge className="bg-red-100 text-red-700 border-red-200">
                            <Shield className="w-3 h-3 mr-1" />
                            Assurance expire
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">{property.address}</p>
                      </div>
                      <div className="flex items-center gap-6 text-xs text-muted-foreground">
                        {property.surface_area && (
                          <span>
                            <span className="font-medium">Surface:</span> {property.surface_area.toLocaleString()} m²
                          </span>
                        )}
                        {property.current_valuation && (
                          <span>
                            <span className="font-medium">Valeur:</span> {property.current_valuation.toLocaleString()}€
                          </span>
                        )}
                        {plusValue && (
                          <span className={plusValue.startsWith('-') ? 'text-red-600' : 'text-green-600'}>
                            <span className="font-medium">Plus-value:</span> {plusValue.startsWith('-') ? '' : '+'}{plusValue}%
                          </span>
                        )}
                        {property.insurance_expiry && (
                          <span>
                            <span className="font-medium">Assurance:</span> {new Date(property.insurance_expiry).toLocaleDateString('fr-FR')}
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
                      Évaluer
                    </Button>
                    <Button variant="outline" size="sm">
                      Détails
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredProperties.length === 0 && (
            <div className="text-center py-12">
              <Building className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">Aucun bien immobilier trouvé</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}