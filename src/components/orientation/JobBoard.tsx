import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Clock, Building, Euro, Search, Filter, Bookmark, ExternalLink } from 'lucide-react';

export function JobBoard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [jobTypeFilter, setJobTypeFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');

  const jobOffers = [
    {
      id: 1,
      title: 'Développeur Frontend React',
      company: 'TechCorp Solutions',
      location: 'Paris',
      type: 'stage',
      duration: '6 mois',
      salary: '800-1200€',
      postedDate: '2024-01-10',
      deadline: '2024-02-15',
      description: 'Rejoignez notre équipe de développement pour travailler sur des projets innovants avec React, TypeScript et Node.js.',
      requirements: ['React', 'TypeScript', 'Git', 'Agile'],
      remote: true,
      bookmarked: false,
      applied: false
    },
    {
      id: 2,
      title: 'Assistant Marketing Digital',
      company: 'Digital Agency Pro',
      location: 'Lyon',
      type: 'emploi',
      duration: 'CDI',
      salary: '28-32k€',
      postedDate: '2024-01-08',
      deadline: '2024-01-25',
      description: 'Poste d\'assistant marketing digital dans une agence dynamique. Gestion des réseaux sociaux, campagnes publicitaires.',
      requirements: ['Marketing digital', 'Réseaux sociaux', 'Google Ads', 'Analytics'],
      remote: false,
      bookmarked: true,
      applied: false
    },
    {
      id: 3,
      title: 'Stagiaire Comptabilité',
      company: 'Cabinet Expertise Comptable',
      location: 'Bordeaux',
      type: 'stage',
      duration: '4 mois',
      salary: '600€',
      postedDate: '2024-01-12',
      deadline: '2024-02-01',
      description: 'Stage en cabinet comptable. Saisie comptable, révision des comptes, aide à la préparation des bilans.',
      requirements: ['Comptabilité', 'Excel', 'Sage', 'Rigueur'],
      remote: false,
      bookmarked: false,
      applied: true
    },
    {
      id: 4,
      title: 'Chargé de Communication',
      company: 'Association Environnement',
      location: 'Toulouse',
      type: 'emploi',
      duration: 'CDD 12 mois',
      salary: '25-28k€',
      postedDate: '2024-01-09',
      deadline: '2024-01-30',
      description: 'Poste de chargé de communication pour une association environnementale. Création de contenu, événements.',
      requirements: ['Communication', 'Rédaction', 'Photoshop', 'Événementiel'],
      remote: true,
      bookmarked: false,
      applied: false
    },
    {
      id: 5,
      title: 'Développeur Full Stack',
      company: 'StartUp Innovante',
      location: 'Remote',
      type: 'stage',
      duration: '6 mois',
      salary: '1000-1400€',
      postedDate: '2024-01-11',
      deadline: '2024-02-10',
      description: 'Stage développeur full stack dans une startup en forte croissance. Technologies modernes, équipe jeune.',
      requirements: ['JavaScript', 'Python', 'PostgreSQL', 'Docker'],
      remote: true,
      bookmarked: true,
      applied: false
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'stage': return 'bg-blue-100 text-blue-800';
      case 'emploi': return 'bg-green-100 text-green-800';
      case 'alternance': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredJobs = jobOffers.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = jobTypeFilter === 'all' || job.type === jobTypeFilter;
    const matchesLocation = locationFilter === 'all' || job.location.toLowerCase().includes(locationFilter.toLowerCase());
    return matchesSearch && matchesType && matchesLocation;
  });

  return (
    <div className="space-y-6">
      {/* Statistiques */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Building className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{jobOffers.length}</div>
                <div className="text-sm text-muted-foreground">Offres disponibles</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <ExternalLink className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">1</div>
                <div className="text-sm text-muted-foreground">Candidatures envoyées</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Bookmark className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">2</div>
                <div className="text-sm text-muted-foreground">Offres sauvegardées</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">3</div>
                <div className="text-sm text-muted-foreground">Nouvelles cette semaine</div>
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
            placeholder="Rechercher un poste, entreprise..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={jobTypeFilter} onValueChange={setJobTypeFilter}>
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder="Type d'offre" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les types</SelectItem>
            <SelectItem value="stage">Stages</SelectItem>
            <SelectItem value="emploi">Emplois</SelectItem>
            <SelectItem value="alternance">Alternance</SelectItem>
          </SelectContent>
        </Select>
        <Select value={locationFilter} onValueChange={setLocationFilter}>
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder="Localisation" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les villes</SelectItem>
            <SelectItem value="paris">Paris</SelectItem>
            <SelectItem value="lyon">Lyon</SelectItem>
            <SelectItem value="bordeaux">Bordeaux</SelectItem>
            <SelectItem value="toulouse">Toulouse</SelectItem>
            <SelectItem value="remote">Remote</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Liste des offres */}
      <div className="space-y-4">
        {filteredJobs.map((job) => (
          <Card key={job.id} className={`hover:shadow-lg transition-shadow ${job.applied ? 'border-green-200 bg-green-50' : ''}`}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge className={getTypeColor(job.type)}>
                      {job.type === 'stage' ? 'Stage' : job.type === 'emploi' ? 'Emploi' : 'Alternance'}
                    </Badge>
                    {job.remote && (
                      <Badge variant="outline">Remote</Badge>
                    )}
                    {job.applied && (
                      <Badge className="bg-green-100 text-green-800">Candidature envoyée</Badge>
                    )}
                  </div>
                  <CardTitle className="text-xl">{job.title}</CardTitle>
                  <CardDescription className="text-base font-medium">{job.company}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Bookmark className={`w-4 h-4 ${job.bookmarked ? 'fill-current text-yellow-500' : ''}`} />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">{job.description}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span>{job.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Euro className="w-4 h-4 text-muted-foreground" />
                  <span>{job.salary}</span>
                </div>
                <div className="text-muted-foreground">
                  Publié le {new Date(job.postedDate).toLocaleDateString('fr-FR')}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium">Compétences requises:</div>
                <div className="flex flex-wrap gap-2">
                  {job.requirements.map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="text-sm text-muted-foreground">
                  Date limite: {new Date(job.deadline).toLocaleDateString('fr-FR')}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Voir détails
                  </Button>
                  <Button 
                    size="sm"
                    disabled={job.applied}
                  >
                    {job.applied ? 'Candidature envoyée' : 'Postuler'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground">Aucune offre trouvée</div>
        </div>
      )}
    </div>
  );
}