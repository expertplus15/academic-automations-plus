import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Users,
  Clock,
  CheckCircle,
  Play,
  Pause
} from 'lucide-react';
import { useCourses } from '@/hooks/useCourses';
import { CourseFormModal } from './CourseFormModal';
import { useNavigate } from 'react-router-dom';

export function CourseManagement() {
  const { courses, loading, fetchCourses } = useCourses();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('all');
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const navigate = useNavigate();

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.code.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedTab === 'all') return matchesSearch;
    if (selectedTab === 'published') return matchesSearch && course.is_published;
    if (selectedTab === 'draft') return matchesSearch && !course.is_published;
    
    return matchesSearch && course.status === selectedTab;
  });

  const getStatusBadge = (course: any) => {
    if (!course.is_published) {
      return <Badge variant="secondary" className="bg-gray-100 text-gray-700"><Edit className="w-3 h-3 mr-1" />Brouillon</Badge>;
    }
    
    switch (course.status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-700 border-green-200"><Play className="w-3 h-3 mr-1" />Actif</Badge>;
      case 'archived':
        return <Badge variant="secondary" className="bg-gray-100 text-gray-600"><Pause className="w-3 h-3 mr-1" />Archivé</Badge>;
      default:
        return <Badge variant="outline">{course.status}</Badge>;
    }
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'text-green-600 bg-green-50';
      case 'intermediate': return 'text-yellow-600 bg-yellow-50';
      case 'advanced': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const formatDuration = (minutes?: number) => {
    if (!minutes) return 'Non défini';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-32 bg-gray-100 rounded-lg animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const handleEditCourse = (course: any) => {
    setSelectedCourse(course);
    setShowCourseModal(true);
  };

  const handleViewCourse = (course: any) => {
    navigate(`/elearning/authoring?courseId=${course.id}`);
  };

  const handleModalSuccess = () => {
    fetchCourses();
    setSelectedCourse(null);
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header avec actions */}
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Gestion des Cours</h2>
            <p className="text-muted-foreground">Créez et gérez vos cours en ligne</p>
          </div>
          
          <Button 
            className="bg-cyan-500 hover:bg-cyan-600 text-white"
            onClick={() => setShowCourseModal(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouveau Cours
          </Button>
        </div>

      {/* Filtres et recherche */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Rechercher par titre ou code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-auto">
              <TabsList className="grid grid-cols-4 w-auto">
                <TabsTrigger value="all">Tous</TabsTrigger>
                <TabsTrigger value="published">Publiés</TabsTrigger>
                <TabsTrigger value="draft">Brouillons</TabsTrigger>
                <TabsTrigger value="archived">Archivés</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cyan-100 rounded-lg">
                <BookOpen className="w-5 h-5 text-cyan-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Cours</p>
                <p className="text-2xl font-bold">{courses.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Play className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Cours Actifs</p>
                <p className="text-2xl font-bold">
                  {courses.filter(c => c.status === 'active' && c.is_published).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Edit className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Brouillons</p>
                <p className="text-2xl font-bold">
                  {courses.filter(c => !c.is_published).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Inscriptions</p>
                <p className="text-2xl font-bold">0</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des cours */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <Card key={course.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground truncate">{course.title}</h3>
                  <p className="text-sm text-muted-foreground">{course.code}</p>
                </div>
                {getStatusBadge(course)}
              </div>
              
              <div className="flex items-center gap-2">
                <Badge 
                  variant="outline" 
                  className={`${getDifficultyColor(course.difficulty_level)} text-xs`}
                >
                  {course.difficulty_level}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  <Clock className="w-3 h-3 inline mr-1" />
                  {formatDuration(course.estimated_duration)}
                </span>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-3">
                {course.description || 'Aucune description disponible'}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Users className="w-3 h-3" />
                  <span>0 inscrits</span>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleViewCourse(course)}
                  >
                    <Eye className="w-3 h-3" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleEditCourse(course)}
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold mb-2">Aucun cours trouvé</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? 'Aucun cours ne correspond à votre recherche.' : 'Commencez par créer votre premier cours.'}
            </p>
            <Button 
              className="bg-cyan-500 hover:bg-cyan-600 text-white"
              onClick={() => setShowCourseModal(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Créer un cours
            </Button>
          </CardContent>
        </Card>
      )}
      </div>

      <CourseFormModal
        open={showCourseModal}
        onOpenChange={setShowCourseModal}
        course={selectedCourse}
        onSuccess={handleModalSuccess}
      />
    </>
  );
}