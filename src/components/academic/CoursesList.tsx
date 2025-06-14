import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Course {
  id: string;
  name: string;
  code: string;
  credits: number;
  description?: string;
  program_id: string;
  semester: number;
  year_level: number;
  teacher_id?: string;
}

interface CoursesListProps {
  courses: Course[] | undefined;
  loading: boolean;
}

export function CoursesList({ courses, loading }: CoursesListProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCourses = courses?.filter(course =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Cours et Matières</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-20 bg-muted rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Cours et Matières</CardTitle>
          <Button asChild>
            <Link to="/academic/courses/new">
              <Plus className="h-4 w-4 mr-2" />
              Nouveau Cours
            </Link>
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un cours..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredCourses?.map((course) => (
            <div key={course.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50">
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <div>
                    <h3 className="font-semibold text-lg">{course.name}</h3>
                    <p className="text-sm text-muted-foreground">{course.code}</p>
                  </div>
                  <Badge variant="outline">{course.credits} crédits</Badge>
                  <Badge variant="secondary">
                    Année {course.year_level} - S{course.semester}
                  </Badge>
                </div>
                {course.description && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {course.description}
                  </p>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <Clock className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          
          {filteredCourses?.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Aucun cours trouvé
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}