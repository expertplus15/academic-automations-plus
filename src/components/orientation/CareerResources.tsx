import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Download, Eye, Search, Filter, BookOpen, Video, Users, Link } from 'lucide-react';

export function CareerResources() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const resources = [
    {
      id: 1,
      title: 'Guide de rédaction CV et lettre de motivation',
      description: 'Guide complet pour créer un CV et une lettre de motivation efficaces',
      category: 'candidature',
      type: 'document',
      format: 'PDF',
      size: '2.3 MB',
      downloadCount: 1247,
      rating: 4.8,
      lastUpdated: '2024-01-10',
      author: 'Service Orientation',
      tags: ['CV', 'Lettre de motivation', 'Candidature']
    },
    {
      id: 2,
      title: 'Préparation aux entretiens d\'embauche',
      description: 'Techniques et conseils pour réussir ses entretiens d\'embauche',
      category: 'entretien',
      type: 'video',
      format: 'MP4',
      duration: '45 min',
      viewCount: 892,
      rating: 4.9,
      lastUpdated: '2024-01-08',
      author: 'Pierre Martin',
      tags: ['Entretien', 'Communication', 'Préparation']
    },
    {
      id: 3,
      title: 'Fiches métiers - Secteur informatique',
      description: 'Fiches détaillées des métiers du numérique et de l\'informatique',
      category: 'metiers',
      type: 'document',
      format: 'PDF',
      size: '5.1 MB',
      downloadCount: 2156,
      rating: 4.7,
      lastUpdated: '2024-01-05',
      author: 'Marie Dubois',
      tags: ['Métiers', 'Informatique', 'Numérique']
    },
    {
      id: 4,
      title: 'Webinaire - Tendances du marché de l\'emploi 2024',
      description: 'Analyse des tendances actuelles du marché de l\'emploi',
      category: 'marche',
      type: 'webinar',
      format: 'Replay',
      duration: '1h 30min',
      viewCount: 567,
      rating: 4.6,
      lastUpdated: '2024-01-12',
      author: 'Experts RH',
      tags: ['Marché emploi', 'Tendances', '2024']
    },
    {
      id: 5,
      title: 'Guide des salaires par secteur',
      description: 'Grilles de salaires et rémunérations par secteur d\'activité',
      category: 'salaires',
      type: 'document',
      format: 'Excel',
      size: '1.2 MB',
      downloadCount: 1456,
      rating: 4.5,
      lastUpdated: '2024-01-09',
      author: 'Cabinet RH Pro',
      tags: ['Salaires', 'Rémunération', 'Secteurs']
    },
    {
      id: 6,
      title: 'Réseau professionnel - Comment bien l\'utiliser',
      description: 'Stratégies pour développer et utiliser efficacement son réseau professionnel',
      category: 'reseau',
      type: 'article',
      format: 'Web',
      readTime: '15 min',
      viewCount: 734,
      rating: 4.4,
      lastUpdated: '2024-01-11',
      author: 'Sophie Laurent',
      tags: ['Réseau', 'LinkedIn', 'Networking']
    }
  ];

  const categories = [
    { value: 'all', label: 'Toutes les catégories' },
    { value: 'candidature', label: 'Candidature' },
    { value: 'entretien', label: 'Entretien' },
    { value: 'metiers', label: 'Métiers' },
    { value: 'marche', label: 'Marché emploi' },
    { value: 'salaires', label: 'Salaires' },
    { value: 'reseau', label: 'Réseau' }
  ];

  const types = [
    { value: 'all', label: 'Tous les types' },
    { value: 'document', label: 'Documents' },
    { value: 'video', label: 'Vidéos' },
    { value: 'webinar', label: 'Webinaires' },
    { value: 'article', label: 'Articles' }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'candidature': return 'bg-blue-100 text-blue-800';
      case 'entretien': return 'bg-green-100 text-green-800';
      case 'metiers': return 'bg-purple-100 text-purple-800';
      case 'marche': return 'bg-orange-100 text-orange-800';
      case 'salaires': return 'bg-yellow-100 text-yellow-800';
      case 'reseau': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'document': return <FileText className="w-4 h-4" />;
      case 'video': return <Video className="w-4 h-4" />;
      case 'webinar': return <Users className="w-4 h-4" />;
      case 'article': return <BookOpen className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === 'all' || resource.category === categoryFilter;
    const matchesType = typeFilter === 'all' || resource.type === typeFilter;
    return matchesSearch && matchesCategory && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Statistiques */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{resources.length}</div>
                <div className="text-sm text-muted-foreground">Ressources disponibles</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Download className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">7.1k</div>
                <div className="text-sm text-muted-foreground">Téléchargements totaux</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Eye className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">3.2k</div>
                <div className="text-sm text-muted-foreground">Vues cette semaine</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <BookOpen className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">4.7</div>
                <div className="text-sm text-muted-foreground">Note moyenne</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Rechercher une ressource..."
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
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {types.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Liste des ressources */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredResources.map((resource) => (
          <Card key={resource.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  {getTypeIcon(resource.type)}
                  <Badge className={getCategoryColor(resource.category)}>
                    {categories.find(c => c.value === resource.category)?.label}
                  </Badge>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-sm">⭐ {resource.rating}</span>
                </div>
              </div>
              <CardTitle className="text-lg">{resource.title}</CardTitle>
              <CardDescription>{resource.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {resource.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Format:</span>
                  <span className="font-medium">{resource.format}</span>
                </div>
                {resource.size && (
                  <div className="flex justify-between">
                    <span>Taille:</span>
                    <span>{resource.size}</span>
                  </div>
                )}
                {resource.duration && (
                  <div className="flex justify-between">
                    <span>Durée:</span>
                    <span>{resource.duration}</span>
                  </div>
                )}
                {resource.readTime && (
                  <div className="flex justify-between">
                    <span>Lecture:</span>
                    <span>{resource.readTime}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Auteur:</span>
                  <span>{resource.author}</span>
                </div>
                <div className="flex justify-between">
                  <span>Mis à jour:</span>
                  <span>{new Date(resource.lastUpdated).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>

              <div className="flex gap-2">
                {resource.type === 'document' && (
                  <Button className="flex-1" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Télécharger
                  </Button>
                )}
                {(resource.type === 'video' || resource.type === 'webinar' || resource.type === 'article') && (
                  <Button className="flex-1" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    Voir
                  </Button>
                )}
                <Button variant="outline" size="sm">
                  <Link className="w-4 h-4" />
                </Button>
              </div>

              {resource.downloadCount && (
                <div className="text-xs text-muted-foreground text-center">
                  {resource.downloadCount} téléchargements
                </div>
              )}
              {resource.viewCount && (
                <div className="text-xs text-muted-foreground text-center">
                  {resource.viewCount} vues
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredResources.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground">Aucune ressource trouvée</div>
        </div>
      )}
    </div>
  );
}