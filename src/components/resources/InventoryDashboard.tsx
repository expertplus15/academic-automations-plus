import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { QrCode, Plus, Search, Package, Scan, Download, Upload, Filter, Eye } from 'lucide-react';

interface Asset {
  id: string;
  asset_number: string;
  name: string;
  category: string;
  location: string;
  status: 'active' | 'maintenance' | 'retired' | 'reserved';
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  purchase_date: string;
  purchase_price: number;
  current_value: number;
  qr_code: string;
}

export function InventoryDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Mock data - à remplacer par les vrais hooks
  const assets: Asset[] = [
    {
      id: '1',
      asset_number: 'AST240001',
      name: 'Projecteur Epson EB-2250U',
      category: 'Audiovisuel',
      location: 'Salle A1',
      status: 'active',
      condition: 'excellent',
      purchase_date: '2024-01-15',
      purchase_price: 1200,
      current_value: 1080,
      qr_code: 'QR_AST240001'
    },
    {
      id: '2',
      asset_number: 'AST240002',
      name: 'Ordinateur portable Dell Latitude',
      category: 'Informatique',
      location: 'Lab Info B2',
      status: 'maintenance',
      condition: 'good',
      purchase_date: '2023-09-20',
      purchase_price: 800,
      current_value: 600,
      qr_code: 'QR_AST240002'
    },
    {
      id: '3',
      asset_number: 'AST240003',
      name: 'Imprimante laser HP LaserJet',
      category: 'Bureau',
      location: 'Administration',
      status: 'active',
      condition: 'good',
      purchase_date: '2023-11-10',
      purchase_price: 350,
      current_value: 280,
      qr_code: 'QR_AST240003'
    }
  ];

  const categories = ['Audiovisuel', 'Informatique', 'Bureau', 'Mobilier', 'Laboratoire'];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-700 border-green-200">Actif</Badge>;
      case 'maintenance':
        return <Badge className="bg-orange-100 text-orange-700 border-orange-200">Maintenance</Badge>;
      case 'retired':
        return <Badge className="bg-gray-100 text-gray-700 border-gray-200">Retiré</Badge>;
      case 'reserved':
        return <Badge className="bg-blue-100 text-blue-700 border-blue-200">Réservé</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getConditionBadge = (condition: string) => {
    switch (condition) {
      case 'excellent':
        return <Badge variant="outline" className="border-green-200 text-green-700">Excellent</Badge>;
      case 'good':
        return <Badge variant="outline" className="border-blue-200 text-blue-700">Bon</Badge>;
      case 'fair':
        return <Badge variant="outline" className="border-yellow-200 text-yellow-700">Correct</Badge>;
      case 'poor':
        return <Badge variant="outline" className="border-red-200 text-red-700">Mauvais</Badge>;
      default:
        return <Badge variant="outline">{condition}</Badge>;
    }
  };

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.asset_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || asset.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || asset.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const stats = [
    {
      label: "Total équipements",
      value: assets.length,
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      label: "Valeur totale",
      value: `${assets.reduce((sum, a) => sum + a.current_value, 0).toLocaleString()}€`,
      icon: Package,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      label: "En maintenance",
      value: assets.filter(a => a.status === 'maintenance').length,
      icon: Package,
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    },
    {
      label: "QR codes générés",
      value: assets.length,
      icon: QrCode,
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
              <Package className="w-5 h-5 text-primary" />
              Inventaire numérique
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Upload className="w-4 h-4 mr-2" />
                Importer
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Exporter
              </Button>
              <Button variant="outline" size="sm">
                <Scan className="w-4 h-4 mr-2" />
                Scanner QR
              </Button>
              <Button className="bg-primary text-primary-foreground">
                <Plus className="w-4 h-4 mr-2" />
                Ajouter équipement
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Rechercher par nom, numéro ou emplacement..."
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
                <SelectItem value="active">Actifs</SelectItem>
                <SelectItem value="maintenance">En maintenance</SelectItem>
                <SelectItem value="retired">Retirés</SelectItem>
                <SelectItem value="reserved">Réservés</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrer par catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes catégories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Assets List */}
          <div className="space-y-4">
            {filteredAssets.map((asset) => (
              <div
                key={asset.id}
                className="flex items-center justify-between p-4 rounded-xl border border-border/50 hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Package className="w-6 h-6 text-primary" />
                  </div>
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-foreground">{asset.name}</h3>
                      <span className="text-sm text-muted-foreground">({asset.asset_number})</span>
                      {getStatusBadge(asset.status)}
                      {getConditionBadge(asset.condition)}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>
                        <span className="font-medium">Catégorie:</span> {asset.category}
                      </span>
                      <span>
                        <span className="font-medium">Emplacement:</span> {asset.location}
                      </span>
                      <span>
                        <span className="font-medium">Valeur actuelle:</span> {asset.current_value.toLocaleString()}€
                      </span>
                      <span>
                        <span className="font-medium">Achat:</span> {new Date(asset.purchase_date).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <QrCode className="w-4 h-4 mr-1" />
                    QR Code
                  </Button>
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-1" />
                    Voir
                  </Button>
                  <Button variant="outline" size="sm">
                    Modifier
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {filteredAssets.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">Aucun équipement trouvé</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}