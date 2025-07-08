import React, { useState } from 'react';
import { ModuleLayout } from '@/components/layouts/ModuleLayout';
import { HrModuleSidebar } from '@/components/HrModuleSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Star,
  Search,
  Plus,
  Eye,
  Edit,
  Award,
  BookOpen,
  Lightbulb,
  Settings,
  Users
} from 'lucide-react';
import { useTeacherSpecialties } from '@/hooks/hr/useTeacherSpecialties';
import { useToast } from '@/hooks/use-toast';

export default function Specialties() {
  const { specialties, assignments, loading, error } = useTeacherSpecialties();
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const filteredSpecialties = specialties.filter(specialty =>
    specialty.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    specialty.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    specialty.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAssignments = assignments.filter(assignment =>
    assignment.teacher_profile?.profile?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assignment.specialty?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assignment.proficiency_level.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'technical':
        return <BookOpen className="w-4 h-4" />;
      case 'pedagogical':
        return <Lightbulb className="w-4 h-4" />;
      case 'research':
        return <Star className="w-4 h-4" />;
      case 'administrative':
        return <Settings className="w-4 h-4" />;
      default:
        return <BookOpen className="w-4 h-4" />;
    }
  };

  const getCategoryBadge = (category: string) => {
    const colors = {
      technical: 'bg-blue-100 text-blue-700 border-blue-200',
      pedagogical: 'bg-green-100 text-green-700 border-green-200',
      research: 'bg-purple-100 text-purple-700 border-purple-200',
      administrative: 'bg-orange-100 text-orange-700 border-orange-200'
    };
    return <Badge className={colors[category as keyof typeof colors] || colors.technical}>{category}</Badge>;
  };

  const getLevelBadge = (level: string) => {
    const colors = {
      basic: 'bg-gray-100 text-gray-700 border-gray-200',
      intermediate: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      advanced: 'bg-orange-100 text-orange-700 border-orange-200',
      expert: 'bg-red-100 text-red-700 border-red-200'
    };
    return <Badge className={colors[level as keyof typeof colors] || colors.basic}>{level}</Badge>;
  };

  const stats = [
    {
      label: "Spécialités actives",
      value: specialties.filter(s => s.is_active).length,
      icon: BookOpen
    },
    {
      label: "Affectations",
      value: assignments.length,
      icon: Users
    },
    {
      label: "Certifiés",
      value: assignments.filter(a => a.certified_date).length,
      icon: Award
    },
    {
      label: "Experts",
      value: assignments.filter(a => a.proficiency_level === 'expert').length,
      icon: Star
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
            <h1 className="text-3xl font-bold text-foreground">Spécialités & Compétences</h1>
            <p className="text-muted-foreground mt-1">Gérer les compétences et spécialités des enseignants</p>
          </div>
          <Button 
            className="bg-amber-500 hover:bg-amber-600 text-white"
            onClick={() => toast({
              title: "Nouvelle spécialité",
              description: "Fonctionnalité de création de spécialité en développement",
            })}
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle spécialité
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
                placeholder="Rechercher spécialités, enseignants ou compétences..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="specialties" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="specialties">Spécialités</TabsTrigger>
            <TabsTrigger value="assignments">Affectations</TabsTrigger>
          </TabsList>

          {/* Specialties Tab */}
          <TabsContent value="specialties">
            <Card className="bg-white rounded-2xl shadow-sm border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-amber-500" />
                  Spécialités ({filteredSpecialties.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredSpecialties.map((specialty) => (
                    <div
                      key={specialty.id}
                      className="flex items-center justify-between p-4 rounded-xl border border-border/50 hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                          {getCategoryIcon(specialty.category)}
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-3">
                            <h3 className="font-semibold text-foreground">{specialty.name}</h3>
                            {getCategoryBadge(specialty.category)}
                            {getLevelBadge(specialty.level_required)}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <span className="font-medium">Code:</span> {specialty.code}
                            </span>
                            <span>Niveau requis: {specialty.level_required}</span>
                          </div>
                          {specialty.description && (
                            <p className="text-sm text-muted-foreground">{specialty.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => toast({
                            title: "Voir spécialité",
                            description: "Affichage des détails de spécialité en développement",
                          })}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => toast({
                            title: "Modifier spécialité",
                            description: "Modification de spécialité en développement",
                          })}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  {filteredSpecialties.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <BookOpen className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>Aucune spécialité trouvée</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Assignments Tab */}
          <TabsContent value="assignments">
            <Card className="bg-white rounded-2xl shadow-sm border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-amber-500" />
                  Affectations ({filteredAssignments.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredAssignments.map((assignment) => (
                    <div
                      key={assignment.id}
                      className="flex items-center justify-between p-4 rounded-xl border border-border/50 hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                          <Users className="w-6 h-6 text-amber-600" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-3">
                            <h3 className="font-semibold text-foreground">
                              {assignment.teacher_profile?.profile?.full_name}
                            </h3>
                            {assignment.is_primary && (
                              <Badge className="bg-green-100 text-green-700 border-green-200">
                                <Star className="w-3 h-3 mr-1" />
                                Principale
                              </Badge>
                            )}
                            {getLevelBadge(assignment.proficiency_level)}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <BookOpen className="w-3 h-3" />
                              {assignment.specialty?.name}
                            </span>
                            <span>{assignment.years_experience} ans d'expérience</span>
                            {assignment.certified_date && (
                              <span className="flex items-center gap-1">
                                <Award className="w-3 h-3" />
                                Certifié le {new Date(assignment.certified_date).toLocaleDateString('fr-FR')}
                              </span>
                            )}
                          </div>
                          {assignment.certification_authority && (
                            <p className="text-sm text-muted-foreground">
                              Autorité: {assignment.certification_authority}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => toast({
                            title: "Voir affectation",
                            description: "Affichage des détails d'affectation en développement",
                          })}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => toast({
                            title: "Modifier affectation",
                            description: "Modification d'affectation en développement",
                          })}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  {filteredAssignments.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>Aucune affectation trouvée</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ModuleLayout>
  );
}