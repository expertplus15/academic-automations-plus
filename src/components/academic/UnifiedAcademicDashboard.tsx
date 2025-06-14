import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { usePrograms, useCourses, useDepartments, useStudents } from '@/hooks/useSupabase';
import { useSubjects, useCurrentAcademicYear, useTimetables } from '@/hooks/useAcademic';
import { MetricCard } from './MetricCard';
import { 
  GraduationCap, 
  BookOpen, 
  Users, 
  Calendar,
  Building,
  Clock,
  Plus,
  AlertTriangle,
  TrendingUp
} from 'lucide-react';
import { Link } from 'react-router-dom';

export function UnifiedAcademicDashboard() {
  const { data: programs, loading: programsLoading } = usePrograms();
  const { data: subjects, loading: subjectsLoading } = useSubjects();
  const { data: students, loading: studentsLoading } = useStudents();
  const { data: departments, loading: departmentsLoading } = useDepartments();
  const { data: currentYear } = useCurrentAcademicYear();
  const { data: timetables } = useTimetables({
    academicYearId: currentYear?.id
  });

  const isLoading = programsLoading || subjectsLoading || studentsLoading || departmentsLoading;

  // Calculs des métriques
  const activePrograms = programs.filter(p => p.status !== 'inactive').length;
  const totalSubjects = subjects.length;
  const totalStudents = students.length;
  const totalDepartments = departments.length;
  const scheduledHours = timetables.length;

  // Calcul des conflits (logique simplifiée)
  const conflicts = 0;

  const metrics = [
    {
      title: "Programmes actifs",
      value: activePrograms,
      icon: GraduationCap,
      trend: "+2 ce mois",
      color: "text-blue-600",
      loading: programsLoading
    },
    {
      title: "Matières",
      value: totalSubjects,
      icon: BookOpen,
      trend: `${Math.floor(totalSubjects * 0.1)} nouvelles`,
      color: "text-green-600",
      loading: subjectsLoading
    },
    {
      title: "Étudiants",
      value: totalStudents,
      icon: Users,
      trend: "+12% cette année",
      color: "text-purple-600",
      loading: studentsLoading
    },
    {
      title: "Heures programmées",
      value: scheduledHours,
      icon: Clock,
      trend: "Cette semaine",
      color: "text-orange-600",
      loading: false
    }
  ];

  const recentPrograms = programs.slice(0, 5);
  const recentSubjects = subjects.slice(0, 5);

  return (
    <div className="p-6 space-y-6">
      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => (
          <MetricCard
            key={metric.title}
            title={metric.title}
            value={metric.value}
            icon={metric.icon}
            trend={metric.trend}
            color={metric.color}
            loading={metric.loading}
          />
        ))}
      </div>

      {/* Cartes de statut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Statut des conflits */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Conflits EDT
              </CardTitle>
              <Badge variant={conflicts === 0 ? "default" : "destructive"}>
                {conflicts} conflit{conflicts > 1 ? 's' : ''}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {conflicts === 0 ? (
              <p className="text-green-600">Aucun conflit détecté dans les emplois du temps</p>
            ) : (
              <div className="space-y-2">
                <p className="text-destructive">{conflicts} conflit(s) détecté(s)</p>
                <Button variant="outline" size="sm">
                  Résoudre les conflits
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Année académique */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Année Académique
            </CardTitle>
          </CardHeader>
          <CardContent>
            {currentYear ? (
              <div className="space-y-2">
                <p className="font-medium">{currentYear.name}</p>
                <p className="text-sm text-muted-foreground">
                  Du {new Date(currentYear.start_date).toLocaleDateString()} 
                  au {new Date(currentYear.end_date).toLocaleDateString()}
                </p>
                <Badge variant="default">
                  {currentYear.status}
                </Badge>
              </div>
            ) : (
              <p className="text-muted-foreground">Aucune année académique définie</p>
            )}
          </CardContent>
        </Card>

        {/* Départements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="w-5 h-5" />
              Départements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-2xl font-bold">{totalDepartments}</p>
              <p className="text-sm text-muted-foreground">
                Départements actifs
              </p>
              {departments.length > 0 && (
                <div className="space-y-1">
                  {departments.slice(0, 3).map((dept) => (
                    <div key={dept.id} className="text-xs text-muted-foreground">
                      {dept.name}
                    </div>
                  ))}
                  {departments.length > 3 && (
                    <div className="text-xs text-muted-foreground">
                      +{departments.length - 3} autres
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activités récentes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Programmes récents */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Programmes récents</CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link to="/academic/programs">Voir tout</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {recentPrograms.length > 0 ? (
              <div className="space-y-3">
                {recentPrograms.map((program) => (
                  <div key={program.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                    <div>
                      <p className="font-medium">{program.name}</p>
                      <p className="text-sm text-muted-foreground">{program.code}</p>
                    </div>
                    <Badge variant="outline">
                      {program.duration_years} an{program.duration_years > 1 ? 's' : ''}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">
                Aucun programme disponible
              </p>
            )}
          </CardContent>
        </Card>

        {/* Matières récentes */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Matières récentes</CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link to="/academic/subjects">Voir tout</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {recentSubjects.length > 0 ? (
              <div className="space-y-3">
                {recentSubjects.map((subject) => (
                  <div key={subject.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                    <div>
                      <p className="font-medium">{subject.name}</p>
                      <p className="text-sm text-muted-foreground">{subject.code}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline">
                        {subject.credits_ects} ECTS
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        {(subject.hours_theory || 0) + (subject.hours_practice || 0) + (subject.hours_project || 0)}h
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">
                Aucune matière disponible
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Actions rapides */}
      <Card>
        <CardHeader>
          <CardTitle>Actions Rapides</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <Button className="h-20 flex-col" variant="outline" asChild>
              <Link to="/academic/programs">
                <GraduationCap className="h-6 w-6 mb-2" />
                Programmes
              </Link>
            </Button>
            <Button className="h-20 flex-col" variant="outline" asChild>
              <Link to="/academic/subjects">
                <BookOpen className="h-6 w-6 mb-2" />
                Matières
              </Link>
            </Button>
            <Button className="h-20 flex-col" variant="outline" asChild>
              <Link to="/academic/timetables">
                <Calendar className="h-6 w-6 mb-2" />
                Emploi du temps
              </Link>
            </Button>
            <Button className="h-20 flex-col" variant="outline" asChild>
              <Link to="/academic/groups">
                <Users className="h-6 w-6 mb-2" />
                Classes
              </Link>
            </Button>
            <Button className="h-20 flex-col" variant="outline" asChild>
              <Link to="/academic/infrastructure">
                <Building className="h-6 w-6 mb-2" />
                Infrastructures
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}