import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Package, Plus, Search, Edit, Trash2, Eye } from 'lucide-react';

interface Category {
  id: string;
  code: string;
  name: string;
  description: string;
  parent_category_id?: string;
  is_active: boolean;
  asset_count: number;
  total_value: number;
}

export function CategoriesDashboard() {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - à remplacer par les vrais hooks
  const categories: Category[] = [
    {
      id: '1',
      code: 'AV',
      name: 'Audiovisuel',
      description: 'Équipements audiovisuels et multimédia',
      is_active: true,
      asset_count: 45,
      total_value: 75000
    },
    {
      id: '2',
      code: 'INFO',
      name: 'Informatique',
      description: 'Matériel informatique et réseaux',
      is_active: true,
      asset_count: 120,
      total_value: 180000
    },
    {
      id: '3',
      code: 'BUREAU',
      name: 'Bureau',
      description: 'Mobilier et équipements de bureau',
      is_active: true,
      asset_count: 75,
      total_value: 35000
    },
    {
      id: '4',
      code: 'LAB',
      name: 'Laboratoire',
      description: 'Équipements scientifiques et de laboratoire',
      is_active: true,
      asset_count: 85,
      total_value: 220000
    },
    {
      id: '5',
      code: 'VEHIC',
      name: 'Véhicules',
      description: 'Véhicules et équipements de transport',
      is_active: false,
      asset_count: 3,
      total_value: 45000
    }
  ];

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = [
    {
      label: "Catégories actives",
      value: categories.filter(c => c.is_active).length,
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      label: "Total équipements",
      value: categories.reduce((sum, c) => sum + c.asset_count, 0).toLocaleString(),
      icon: Package,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      label: "Valeur totale",
      value: `${(categories.reduce((sum, c) => sum + c.total_value, 0) / 1000000).toFixed(1)}M€`,
      icon: Package,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    {
      label: "Catégorie principale",
      value: "Informatique",
      icon: Package,
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

      {/* Categories Management */}
      <Card className="bg-white rounded-2xl shadow-sm border-0">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" />
              Gestion des Catégories
            </CardTitle>
            <Button className="bg-primary text-primary-foreground">
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle catégorie
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Rechercher par nom, code ou description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Categories List */}
          <div className="space-y-4">
            {filteredCategories.map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-between p-4 rounded-xl border border-border/50 hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Package className="w-6 h-6 text-primary" />
                  </div>
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-foreground">{category.name}</h3>
                      <span className="text-sm text-muted-foreground">({category.code})</span>
                      <Badge className={category.is_active ? "bg-green-100 text-green-700 border-green-200" : "bg-gray-100 text-gray-700 border-gray-200"}>
                        {category.is_active ? 'Actif' : 'Inactif'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{category.description}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>
                        <span className="font-medium">Équipements:</span> {category.asset_count}
                      </span>
                      <span>
                        <span className="font-medium">Valeur totale:</span> {category.total_value.toLocaleString()}€
                      </span>
                      <span>
                        <span className="font-medium">Valeur moyenne:</span> {category.asset_count > 0 ? Math.round(category.total_value / category.asset_count).toLocaleString() : 0}€
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-1" />
                    Voir
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4 mr-1" />
                    Modifier
                  </Button>
                  {!category.is_active && (
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                      <Trash2 className="w-4 h-4 mr-1" />
                      Supprimer
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredCategories.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">Aucune catégorie trouvée</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}