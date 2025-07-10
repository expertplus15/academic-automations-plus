import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, Users, Star, Search, Filter } from 'lucide-react';

export function ActivityCatalog() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const activities = [
    {
      id: 1,
      title: 'Football Universitaire',
      description: 'Équipe de football de l\'université. Entraînements 2 fois par semaine.',
      category: 'sport',
      price: 120,
      duration: '2h',
      maxParticipants: 25,
      currentParticipants: 18,
      rating: 4.8,
      schedule: 'Mar/Jeu 18h-20h',
      instructor: 'Coach Martin',
      level: 'Tous niveaux'
    },
    {
      id: 2,
      title: 'Club de Théâtre',
      description: 'Atelier de théâtre avec représentations en fin d\'année.',
      category: 'culture',
      price: 80,
      duration: '1h30',
      maxParticipants: 15,
      currentParticipants: 12,
      rating: 4.9,
      schedule: 'Mer 17h-18h30',
      instructor: 'Marie Dubois',
      level: 'Débutant/Intermédiaire'
    },
    {
      id: 3,
      title: 'Association Humanitaire',
      description: 'Actions de solidarité et projets caritatifs locaux et internationaux.',
      category: 'associatif',
      price: 0,
      duration: 'Variable',
      maxParticipants: 50,
      currentParticipants: 32,
      rating: 4.7,
      schedule: 'Flexible',
      instructor: 'Bureau de l\'association',
      level: 'Tous niveaux'
    },
    {
      id: 4,
      title: 'Natation',
      description: 'Cours de natation et perfectionnement technique.',
      category: 'sport',
      price: 150,
      duration: '1h',
      maxParticipants: 20,
      currentParticipants: 15,
      rating: 4.6,
      schedule: 'Lun/Mer/Ven 12h-13h',
      instructor: 'Sarah Laurent',
      level: 'Intermédiaire/Avancé'
    },
    {
      id: 5,
      title: 'Photographie',
      description: 'Initiation et perfectionnement en photographie numérique.',
      category: 'culture',
      price: 100,
      duration: '2h',
      maxParticipants: 12,
      currentParticipants: 8,
      rating: 4.8,
      schedule: 'Sam 14h-16h',
      instructor: 'Alex Rousseau',
      level: 'Tous niveaux'
    }
  ];

  const categories = [
    { value: 'all', label: 'Toutes les catégories' },
    { value: 'sport', label: 'Sport' },
    { value: 'culture', label: 'Culture' },
    { value: 'associatif', label: 'Associatif' }
  ];

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || activity.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'sport': return 'bg-blue-100 text-blue-800';
      case 'culture': return 'bg-purple-100 text-purple-800';
      case 'associatif': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Filtres */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Rechercher une activité..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Liste des activités */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredActivities.map((activity) => (
          <Card key={activity.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <Badge className={getCategoryColor(activity.category)}>
                    {activity.category}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{activity.rating}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">
                    {activity.price === 0 ? 'Gratuit' : `${activity.price}€`}
                  </div>
                  <div className="text-sm text-muted-foreground">par semestre</div>
                </div>
              </div>
              <CardTitle className="text-lg">{activity.title}</CardTitle>
              <CardDescription>{activity.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span>{activity.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span>{activity.currentParticipants}/{activity.maxParticipants}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs">{activity.schedule}</span>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div><strong>Instructeur:</strong> {activity.instructor}</div>
                <div><strong>Niveau:</strong> {activity.level}</div>
              </div>

              <div className="flex gap-2">
                <Button 
                  className="flex-1"
                  disabled={activity.currentParticipants >= activity.maxParticipants}
                >
                  {activity.currentParticipants >= activity.maxParticipants ? 'Complet' : 'S\'inscrire'}
                </Button>
                <Button variant="outline" size="sm">
                  Détails
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredActivities.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground">Aucune activité trouvée</div>
        </div>
      )}
    </div>
  );
}