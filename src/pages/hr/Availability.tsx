import React, { useState } from 'react';
import { ModuleLayout } from '@/components/layouts/ModuleLayout';
import { HrModuleSidebar } from '@/components/HrModuleSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Calendar,
  Search,
  Plus,
  Eye,
  Edit,
  Clock,
  Users,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { useTeacherAvailability } from '@/hooks/hr/useTeacherAvailability';
import { useToast } from '@/hooks/use-toast';

export default function Availability() {
  const { availabilities, loading, error } = useTeacherAvailability();
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const filteredAvailabilities = availabilities.filter(availability =>
    availability.teacher_profile?.profile?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    availability.availability_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getDayName = (dayOfWeek: number) => {
    const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    return days[dayOfWeek];
  };

  const getAvailabilityBadge = (type: string) => {
    switch (type) {
      case 'available':
        return <Badge className="bg-green-100 text-green-700 border-green-200"><CheckCircle className="w-3 h-3 mr-1" />Disponible</Badge>;
      case 'unavailable':
        return <Badge className="bg-red-100 text-red-700 border-red-200"><XCircle className="w-3 h-3 mr-1" />Indisponible</Badge>;
      case 'preferred':
        return <Badge className="bg-blue-100 text-blue-700 border-blue-200"><CheckCircle className="w-3 h-3 mr-1" />Préféré</Badge>;
      case 'limited':
        return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200"><AlertCircle className="w-3 h-3 mr-1" />Limité</Badge>;
      default:
        return <Badge>{type}</Badge>;
    }
  };

  const stats = [
    {
      label: "Créneaux programmés",
      value: availabilities.length,
      icon: Calendar
    },
    {
      label: "Enseignants planifiés",
      value: new Set(availabilities.map(a => a.teacher_id)).size,
      icon: Users
    },
    {
      label: "Disponibilités",
      value: availabilities.filter(a => a.availability_type === 'available').length,
      icon: CheckCircle
    },
    {
      label: "Contraintes",
      value: availabilities.filter(a => a.availability_type === 'unavailable' || a.availability_type === 'limited').length,
      icon: AlertCircle
    }
  ];

  if (loading) {
    return (
      <ModuleLayout sidebar={<HrModuleSidebar />}>
        <div className="p-8">
          <div className="text-center">Chargement...</div>
        </div>
      </ModuleLayout>
    );
  }

  if (error) {
    return (
      <ModuleLayout sidebar={<HrModuleSidebar />}>
        <div className="p-8">
          <div className="text-center text-red-600">Erreur: {error}</div>
        </div>
      </ModuleLayout>
    );
  }

  return (
    <ModuleLayout sidebar={<HrModuleSidebar />}>
      <div className="p-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Disponibilités</h1>
            <p className="text-muted-foreground mt-1">Gérer les disponibilités et contraintes des enseignants</p>
          </div>
          <Button 
            className="bg-amber-500 hover:bg-amber-600 text-white"
            onClick={() => toast({
              title: "Nouvelle disponibilité",
              description: "Fonctionnalité de création de disponibilité en développement",
            })}
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle disponibilité
          </Button>
        </div>

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
                    <div className="p-3 bg-amber-100 rounded-xl">
                      <Icon className="w-6 h-6 text-amber-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Search */}
        <Card className="bg-white rounded-2xl shadow-sm border-0">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Rechercher par enseignant ou type de disponibilité..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Availabilities List */}
        <Card className="bg-white rounded-2xl shadow-sm border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-500" />
              Planning des Disponibilités ({filteredAvailabilities.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredAvailabilities.map((availability) => (
                <div
                  key={availability.id}
                  className="flex items-center justify-between p-4 rounded-xl border border-border/50 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-amber-600" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-foreground">
                          {availability.teacher_profile?.profile?.full_name}
                        </h3>
                        {getAvailabilityBadge(availability.availability_type)}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {availability.specific_date ? 
                            new Date(availability.specific_date).toLocaleDateString('fr-FR') :
                            getDayName(availability.day_of_week)
                          }
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {availability.start_time} - {availability.end_time}
                        </span>
                        {availability.max_hours_per_day && (
                          <span>Max: {availability.max_hours_per_day}h/jour</span>
                        )}
                        {availability.max_hours_per_week && (
                          <span>({availability.max_hours_per_week}h/semaine)</span>
                        )}
                      </div>
                      {availability.notes && (
                        <p className="text-sm text-muted-foreground">{availability.notes}</p>
                      )}
                      <div className="flex items-center gap-2 text-xs">
                        {availability.is_recurring ? (
                          <Badge variant="outline" className="text-xs">Récurrent</Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs">Ponctuel</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => toast({
                        title: "Voir disponibilité",
                        description: "Affichage des détails de disponibilité en développement",
                      })}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => toast({
                        title: "Modifier disponibilité",
                        description: "Modification de disponibilité en développement",
                      })}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
              
              {filteredAvailabilities.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Aucune disponibilité trouvée</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </ModuleLayout>
  );
}