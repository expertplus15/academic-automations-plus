import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen,
  Users,
  Clock,
  TrendingUp,
  TrendingDown,
  Play,
  CheckCircle,
  Star,
  Award,
  BarChart3,
  Download,
  RefreshCw,
  Filter
} from 'lucide-react';
import { useCourses } from '@/hooks/useCourses';
import { useCourseEnrollments } from '@/hooks/useCourseEnrollments';

export function CourseAnalytics() {
  const { courses } = useCourses();
  const { enrollments } = useCourseEnrollments();
  const [timeRange, setTimeRange] = useState('month');
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  // Calculate analytics data
  const analyticsData = {
    totalCourses: courses.length,
    publishedCourses: courses.filter(c => c.is_published).length,
    totalEnrollments: enrollments.length,
    activeEnrollments: enrollments.filter(e => e.status === 'active').length,
    completedEnrollments: enrollments.filter(e => e.status === 'completed').length,
    avgCompletionRate: enrollments.length > 0 ? 
      (enrollments.filter(e => e.status === 'completed').length / enrollments.length) * 100 : 0,
    avgProgressTime: enrollments.reduce((acc, e) => acc + (e.progress_percentage || 0), 0) / enrollments.length || 0
  };

  const courseStats = courses.map(course => {
    const courseEnrollments = enrollments.filter(e => e.course_id === course.id);
    const completedEnrollments = courseEnrollments.filter(e => e.status === 'completed');
    const avgProgress = courseEnrollments.reduce((acc, e) => acc + (e.progress_percentage || 0), 0) / courseEnrollments.length || 0;
    
    return {
      ...course,
      enrollmentCount: courseEnrollments.length,
      completionRate: courseEnrollments.length > 0 ? (completedEnrollments.length / courseEnrollments.length) * 100 : 0,
      averageProgress: avgProgress,
      rating: 4.2 + Math.random() * 0.8 // Mock rating
    };
  }).sort((a, b) => b.enrollmentCount - a.enrollmentCount);

  const topPerformingCourses = courseStats.slice(0, 5);
  const lowPerformingCourses = courseStats.filter(c => c.completionRate < 50).slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics E-learning</h1>
          <p className="text-muted-foreground mt-1">Tableau de bord analytique des cours en ligne</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">7 jours</SelectItem>
              <SelectItem value="month">30 jours</SelectItem>
              <SelectItem value="quarter">3 mois</SelectItem>
              <SelectItem value="year">1 an</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white rounded-2xl shadow-sm border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Cours</p>
                <p className="text-2xl font-bold text-foreground">{analyticsData.totalCourses}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3 text-green-500" />
                  <span className="text-xs text-green-600">+3 ce mois</span>
                </div>
              </div>
              <div className="p-3 bg-cyan-100 rounded-xl">
                <BookOpen className="w-6 h-6 text-cyan-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-2xl shadow-sm border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Inscriptions Actives</p>
                <p className="text-2xl font-bold text-foreground">{analyticsData.activeEnrollments}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3 text-green-500" />
                  <span className="text-xs text-green-600">+12% ce mois</span>
                </div>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-2xl shadow-sm border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Taux de Completion</p>
                <p className="text-2xl font-bold text-foreground">{analyticsData.avgCompletionRate.toFixed(1)}%</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3 text-green-500" />
                  <span className="text-xs text-green-600">+5% ce mois</span>
                </div>
              </div>
              <div className="p-3 bg-purple-100 rounded-xl">
                <CheckCircle className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-2xl shadow-sm border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Temps Moyen</p>
                <p className="text-2xl font-bold text-foreground">{analyticsData.avgProgressTime.toFixed(0)}%</p>
                <div className="flex items-center gap-1 mt-1">
                  <Clock className="w-3 h-3 text-blue-500" />
                  <span className="text-xs text-blue-600">Progression</span>
                </div>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="content">Contenu</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Performing Courses */}
            <Card className="bg-white rounded-2xl shadow-sm border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-500" />
                  Cours Populaires
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topPerformingCourses.map((course, index) => (
                    <div key={course.id} className="flex items-center gap-3">
                      <Badge className="w-6 h-6 rounded-full flex items-center justify-center text-xs">
                        {index + 1}
                      </Badge>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{course.title}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Users className="w-3 h-3" />
                          <span>{course.enrollmentCount} inscrits</span>
                          <Star className="w-3 h-3 text-yellow-500" />
                          <span>{course.rating.toFixed(1)}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-green-600">{course.completionRate.toFixed(1)}%</p>
                        <p className="text-xs text-muted-foreground">Completion</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Enrollment Trends */}
            <Card className="bg-white rounded-2xl shadow-sm border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-500" />
                  Tendances d'Inscription
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Nouvelles inscriptions</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500" style={{ width: '75%' }} />
                      </div>
                      <span className="text-sm font-medium">+75%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Inscriptions complétées</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-green-500" style={{ width: '60%' }} />
                      </div>
                      <span className="text-sm font-medium">+60%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Taux d'abandon</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-red-500" style={{ width: '25%' }} />
                      </div>
                      <span className="text-sm font-medium">-25%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card className="bg-white rounded-2xl shadow-sm border-0">
            <CardHeader>
              <CardTitle>Performance des Cours</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {courseStats.slice(0, 10).map((course) => (
                  <div key={course.id} className="flex items-center justify-between p-4 rounded-lg border border-border/50">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium truncate">{course.title}</h3>
                        <Badge 
                          className={course.is_published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}
                        >
                          {course.is_published ? 'Publié' : 'Brouillon'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {course.enrollmentCount} inscrits
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-500" />
                          {course.rating.toFixed(1)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {(course as any).duration_hours || 0}h
                        </span>
                      </div>
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span>Progression moyenne</span>
                          <span>{course.averageProgress.toFixed(1)}%</span>
                        </div>
                        <Progress value={course.averageProgress} className="h-1" />
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <p className="font-medium text-lg">{course.completionRate.toFixed(1)}%</p>
                      <p className="text-xs text-muted-foreground">Taux de réussite</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-6">
          <Card className="bg-white rounded-2xl shadow-sm border-0">
            <CardHeader>
              <CardTitle>Métriques d'Engagement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Temps passé par session</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>0-15 minutes</span>
                      <span>35%</span>
                    </div>
                    <Progress value={35} className="h-2" />
                    <div className="flex justify-between text-sm">
                      <span>15-30 minutes</span>
                      <span>40%</span>
                    </div>
                    <Progress value={40} className="h-2" />
                    <div className="flex justify-between text-sm">
                      <span>30+ minutes</span>
                      <span>25%</span>
                    </div>
                    <Progress value={25} className="h-2" />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium">Fréquence de connexion</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Quotidienne</span>
                      <span>20%</span>
                    </div>
                    <Progress value={20} className="h-2" />
                    <div className="flex justify-between text-sm">
                      <span>Hebdomadaire</span>
                      <span>50%</span>
                    </div>
                    <Progress value={50} className="h-2" />
                    <div className="flex justify-between text-sm">
                      <span>Mensuelle</span>
                      <span>30%</span>
                    </div>
                    <Progress value={30} className="h-2" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Content Performance */}
            <Card className="bg-white rounded-2xl shadow-sm border-0">
              <CardHeader>
                <CardTitle>Performance du Contenu</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Vidéos complétées</span>
                    <Badge variant="secondary">85%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Exercices réussis</span>
                    <Badge variant="secondary">72%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Quizz passés</span>
                    <Badge variant="secondary">68%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Documents téléchargés</span>
                    <Badge variant="secondary">45%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Low Performing Courses */}
            <Card className="bg-white rounded-2xl shadow-sm border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingDown className="w-5 h-5 text-red-500" />
                  Cours à Améliorer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {lowPerformingCourses.map((course) => (
                    <div key={course.id} className="flex items-center justify-between p-3 rounded-lg border border-red-200 bg-red-50">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{course.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {course.enrollmentCount} inscrits
                        </p>
                      </div>
                      <Badge variant="destructive">
                        {course.completionRate.toFixed(1)}%
                      </Badge>
                    </div>
                  ))}
                  {lowPerformingCourses.length === 0 && (
                    <p className="text-center text-muted-foreground py-4">
                      Aucun cours nécessitant d'amélioration
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}