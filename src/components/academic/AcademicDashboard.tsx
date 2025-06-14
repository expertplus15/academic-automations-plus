import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePrograms, useSubjects, useDepartments, useTable } from '@/hooks/useSupabase';
import { 
  GraduationCap, 
  BookOpen, 
  Users, 
  Calendar,
  Plus,
  Building,
  Settings,
  Users as ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { ProgramsList } from './ProgramsList';

import { ScheduleView } from './ScheduleView';
import { DepartmentsList } from './DepartmentsList';

export function AcademicDashboard() {
  const { data: programs, loading: programsLoading } = usePrograms();
  const { data: subjects, loading: subjectsLoading } = useSubjects();
  const { data: departments } = useDepartments();

  const stats = [
    {
      label: 'Programmes Actifs',
      value: programs?.length || 0,
      icon: GraduationCap,
      color: 'bg-primary',
      change: '+2 ce mois'
    },
    {
      label: 'Matières Disponibles',
      value: subjects?.length || 0,
      icon: BookOpen,
      color: 'bg-secondary',
      change: '+15 ce semestre'
    },
    {
      label: 'Départements',
      value: departments?.length || 0,
      icon: Building,
      color: 'bg-accent',
      change: 'Stable'
    },
    {
      label: 'Classes Actives',
      value: 47,
      icon: Users,
      color: 'bg-muted',
      change: '+8 ce mois'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/dashboard">
                  <Users className="h-4 w-4 mr-2" />
                  Retour
                </Link>
              </Button>
              <div className="flex items-center">
                <GraduationCap className="h-8 w-8 text-primary mr-3" />
                <div>
                  <h1 className="text-xl font-semibold text-foreground">
                    Module Académique
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Gestion des programmes et cursus
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" asChild>
                <Link to="/academic/settings">
                  <Settings className="h-4 w-4 mr-2" />
                  Paramètres
                </Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/academic/programs">
                  <Plus className="h-4 w-4 mr-2" />
                  Gérer les Programmes
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {stat.value}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {stat.change}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <stat.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contenu principal avec onglets */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="programs">Programmes</TabsTrigger>
            <TabsTrigger value="subjects">Matières</TabsTrigger>
            <TabsTrigger value="schedule">Emplois du temps</TabsTrigger>
            <TabsTrigger value="departments">Départements</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Programmes récents */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Programmes Récents
                    <Badge variant="secondary">{programs?.slice(0, 5).length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {programsLoading ? (
                      <div className="animate-pulse space-y-2">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="h-12 bg-muted rounded"></div>
                        ))}
                      </div>
                    ) : (
                      programs?.slice(0, 5).map((program) => (
                        <div key={program.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{program.name}</p>
                            <p className="text-sm text-muted-foreground">{program.code}</p>
                          </div>
                          <Badge variant="outline">{program.duration_years} ans</Badge>
                        </div>
                      ))
                    )}
                    <Button variant="outline" className="w-full" asChild>
                      <Link to="/academic/programs">Voir tous les programmes</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Matières récentes */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Matières Récentes
                    <Badge variant="secondary">{subjects?.slice(0, 5).length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {subjectsLoading ? (
                      <div className="animate-pulse space-y-2">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="h-12 bg-muted rounded"></div>
                        ))}
                      </div>
                    ) : (
                      subjects?.slice(0, 5).map((subject) => (
                        <div key={subject.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{subject.name}</p>
                            <p className="text-sm text-muted-foreground">{subject.code}</p>
                          </div>
                          <Badge variant="outline">{subject.credits_ects} ECTS</Badge>
                        </div>
                      ))
                    )}
                    <Button variant="outline" className="w-full" asChild>
                      <Link to="/academic/subjects">Voir toutes les matières</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Actions rapides */}
            <Card>
              <CardHeader>
                <CardTitle>Actions Rapides</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button className="h-20 flex-col" variant="outline" asChild>
                    <Link to="/academic/programs">
                      <GraduationCap className="h-6 w-6 mb-2" />
                      Gérer les Programmes
                    </Link>
                  </Button>
                  <Button className="h-20 flex-col" variant="outline" asChild>
                    <Link to="/academic/subjects">
                      <BookOpen className="h-6 w-6 mb-2" />
                      Gérer les Matières
                    </Link>
                  </Button>
                  <Button className="h-20 flex-col" variant="outline" asChild>
                    <Link to="/academic/timetables">
                      <Calendar className="h-6 w-6 mb-2" />
                      Emploi du Temps
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="programs">
            <ProgramsList programs={programs} loading={programsLoading} />
          </TabsContent>

          <TabsContent value="subjects">
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Gestion des matières à implémenter. 
                <Link to="/academic/subjects" className="text-primary hover:underline ml-1">
                  Accéder au module complet
                </Link>
              </p>
            </div>
          </TabsContent>

          <TabsContent value="schedule">
            <ScheduleView />
          </TabsContent>

          <TabsContent value="departments">
            <DepartmentsList departments={departments} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}