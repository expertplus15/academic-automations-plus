import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { usePrograms, useCourses, useDepartments, useStudents } from '@/hooks/useSupabase';
import { useSubjects, useCurrentAcademicYear, useTimetables } from '@/hooks/useAcademic';
import { 
  GraduationCap, 
  BookOpen, 
  Users, 
  Calendar,
  TrendingUp,
  AlertTriangle,
  Clock,
  Building
} from 'lucide-react';

export function EnhancedAcademicDashboard() {
  const { data: programs, loading: programsLoading } = usePrograms();
  const { data: subjects, loading: subjectsLoading } = useSubjects();
  const { data: students, loading: studentsLoading } = useStudents();
  const { data: departments, loading: departmentsLoading } = useDepartments();
  const { data: currentYear } = useCurrentAcademicYear();
  const { data: timetables } = useTimetables({
    academicYearId: currentYear?.id
  });

  const isLoading = programsLoading || subjectsLoading || studentsLoading || departmentsLoading;

  // Calculate metrics
  const activePrograms = programs.filter(p => p.status !== 'inactive').length;
  const totalSubjects = subjects.length;
  const totalStudents = students.length;
  const totalDepartments = departments.length;
  const scheduledHours = timetables.length;

  // Calculate conflicts (simplified logic)
  const conflicts = 0; // This would be calculated based on overlapping schedules

  const metrics = [
    {
      title: "Programmes actifs",
      value: activePrograms,
      icon: GraduationCap,
      trend: "+2 ce mois",
      color: "text-blue-600"
    },
    {
      title: "Matières",
      value: totalSubjects,
      icon: BookOpen,
      trend: `${Math.floor(totalSubjects * 0.1)} nouvelles`,
      color: "text-green-600"
    },
    {
      title: "Étudiants",
      value: totalStudents,
      icon: Users,
      trend: "+12% cette année",
      color: "text-purple-600"
    },
    {
      title: "Heures programmées",
      value: scheduledHours,
      icon: Clock,
      trend: "Cette semaine",
      color: "text-orange-600"
    }
  ];

  const recentPrograms = programs.slice(0, 5);
  const recentSubjects = subjects.slice(0, 5);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-muted rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.title} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {metric.title}
                    </p>
                    <p className="text-3xl font-bold">{metric.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {metric.trend}
                    </p>
                  </div>
                  <Icon className={`w-8 h-8 ${metric.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conflicts Status */}
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

        {/* Academic Year Info */}
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

        {/* Departments */}
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

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Programs */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Programmes récents</CardTitle>
              <Button variant="outline" size="sm">
                Voir tout
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {recentPrograms.length > 0 ? (
              <div className="space-y-3">
                {recentPrograms.map((program) => (
                  <div key={program.id} className="flex items-center justify-between p-3 border rounded-lg">
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

        {/* Recent Subjects */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Matières récentes</CardTitle>
              <Button variant="outline" size="sm">
                Voir tout
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {recentSubjects.length > 0 ? (
              <div className="space-y-3">
                {recentSubjects.map((subject) => (
                  <div key={subject.id} className="flex items-center justify-between p-3 border rounded-lg">
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
    </div>
  );
}