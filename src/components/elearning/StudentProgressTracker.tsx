import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Search,
  Users,
  BookOpen,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Award,
  Play,
  Pause,
  Filter,
  Download,
  Eye,
  Calendar
} from 'lucide-react';
import { useCourseEnrollments } from '@/hooks/useCourseEnrollments';
import { useCourses } from '@/hooks/useCourses';

export function StudentProgressTracker() {
  const { enrollments } = useCourseEnrollments();
  const { courses } = useCourses();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [courseFilter, setCourseFilter] = useState('all');

  // Filter enrollments
  const filteredEnrollments = enrollments.filter(enrollment => {
    const matchesSearch = enrollment.student?.profile?.full_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || enrollment.status === statusFilter;
    const matchesCourse = courseFilter === 'all' || enrollment.course_id === courseFilter;
    
    return matchesSearch && matchesStatus && matchesCourse;
  });

  // Calculate analytics
  const analytics = {
    totalStudents: new Set(enrollments.map(e => e.student_id)).size,
    activeEnrollments: enrollments.filter(e => e.status === 'active').length,
    completedEnrollments: enrollments.filter(e => e.status === 'completed').length,
    avgProgress: enrollments.reduce((acc, e) => acc + (e.progress_percentage || 0), 0) / enrollments.length || 0,
    atRiskStudents: enrollments.filter(e => 
      e.status === 'active' && 
      (e.progress_percentage || 0) < 30 && 
      new Date(e.enrollment_date || new Date()).getTime() < Date.now() - 7 * 24 * 60 * 60 * 1000
    ).length
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'text-green-600';
    if (progress >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusBadge = (status: string, progress: number) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-700">Terminé</Badge>;
      case 'active':
        if (progress < 30) {
          return <Badge className="bg-orange-100 text-orange-700">À risque</Badge>;
        }
        return <Badge className="bg-blue-100 text-blue-700">En cours</Badge>;
      case 'paused':
        return <Badge className="bg-gray-100 text-gray-700">En pause</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-700">{status}</Badge>;
    }
  };

  const getTimeSpent = (enrollment: any) => {
    // Calculate actual time spent based on lesson progress
    const progressPercentage = enrollment.progress_percentage || 0;
    const estimatedDuration = 40; // Average course duration in hours
    const timeSpent = (progressPercentage / 100) * estimatedDuration;
    
    const hours = Math.floor(timeSpent);
    const minutes = Math.floor((timeSpent - hours) * 60);
    
    return `${hours}h ${minutes}m`;
  };

  const getDaysActive = (enrollment: any) => {
    const enrolledDate = new Date(enrollment.enrollment_date || new Date());
    const daysDiff = Math.floor((new Date().getTime() - enrolledDate.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(1, daysDiff);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Suivi des Étudiants</h1>
          <p className="text-muted-foreground mt-1">Suivez la progression et l'engagement des étudiants</p>
        </div>
        <Button variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Exporter le rapport
        </Button>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card className="bg-white rounded-2xl shadow-sm border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Étudiants</p>
                <p className="text-2xl font-bold text-foreground">{analytics.totalStudents}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-2xl shadow-sm border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">En cours</p>
                <p className="text-2xl font-bold text-foreground">{analytics.activeEnrollments}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <Play className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-2xl shadow-sm border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Terminés</p>
                <p className="text-2xl font-bold text-foreground">{analytics.completedEnrollments}</p>
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
                <p className="text-sm text-muted-foreground">Progression Moy.</p>
                <p className="text-2xl font-bold text-foreground">{analytics.avgProgress.toFixed(1)}%</p>
              </div>
              <div className="p-3 bg-cyan-100 rounded-xl">
                <TrendingUp className="w-6 h-6 text-cyan-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-2xl shadow-sm border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">À Risque</p>
                <p className="text-2xl font-bold text-foreground">{analytics.atRiskStudents}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-xl">
                <AlertCircle className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-white rounded-2xl shadow-sm border-0">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Rechercher un étudiant..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="active">En cours</SelectItem>
                <SelectItem value="completed">Terminé</SelectItem>
                <SelectItem value="paused">En pause</SelectItem>
              </SelectContent>
            </Select>
            <Select value={courseFilter} onValueChange={setCourseFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Cours" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les cours</SelectItem>
                {courses.map((course) => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Student Progress List */}
      <Card className="bg-white rounded-2xl shadow-sm border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-500" />
            Progression des Étudiants ({filteredEnrollments.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredEnrollments.map((enrollment) => {
              const course = courses.find(c => c.id === enrollment.course_id);
              const progress = enrollment.progress_percentage || 0;
              const timeSpent = getTimeSpent(enrollment);
              const daysActive = getDaysActive(enrollment);
              
              return (
                <div key={enrollment.id} className="flex items-center gap-4 p-4 rounded-xl border border-border/50 hover:bg-accent/50 transition-colors">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-primary/10 text-primary font-medium">
                      {enrollment.student?.profile?.full_name?.split(' ').map(n => n[0]).join('') || 'ET'}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold truncate">
                        {enrollment.student?.profile?.full_name || 'Étudiant'}
                      </h3>
                      {getStatusBadge(enrollment.status, progress)}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-3 h-3" />
                        {course?.title || 'Cours non trouvé'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {timeSpent}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {daysActive} jour{daysActive > 1 ? 's' : ''} actif{daysActive > 1 ? 's' : ''}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Progress value={progress} className="flex-1 h-2" />
                      <span className={`text-sm font-medium ${getProgressColor(progress)}`}>
                        {progress.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        Inscrit le {new Date(enrollment.enrollment_date || new Date()).toLocaleDateString('fr-FR')}
                      </p>
                      {enrollment.completion_date && (
                        <p className="text-xs text-muted-foreground">
                          Terminé le: {new Date(enrollment.completion_date).toLocaleDateString('fr-FR')}
                        </p>
                      )}
                    </div>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
            
            {filteredEnrollments.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Aucun étudiant trouvé avec ces critères</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}