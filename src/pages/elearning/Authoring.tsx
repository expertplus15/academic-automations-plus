import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ModuleLayout } from '@/components/layouts/ModuleLayout';
import { ElearningModuleSidebar } from '@/components/ElearningModuleSidebar';
import { ElearningPageHeader } from "@/components/ElearningPageHeader";
import { LessonEditor } from '@/components/elearning/LessonEditor';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  BookOpen, 
  PlayCircle, 
  Settings, 
  Users,
  BarChart3
} from 'lucide-react';
import { useCourses } from '@/hooks/useCourses';
import { useLessons } from '@/hooks/useLessons';

export default function Authoring() {
  const [searchParams] = useSearchParams();
  const courseId = searchParams.get('courseId');
  const [selectedView, setSelectedView] = useState('overview');
  const [selectedLesson, setSelectedLesson] = useState(null);
  const { courses } = useCourses();
  const { lessons, createLesson, updateLesson } = useLessons(courseId);

  const currentCourse = courses.find(c => c.id === courseId);

  const handleCreateLesson = () => {
    setSelectedLesson(null);
    setSelectedView('lesson-editor');
  };

  const handleEditLesson = (lesson: any) => {
    setSelectedLesson(lesson);
    setSelectedView('lesson-editor');
  };

  const handleSaveLesson = async (lessonData: any) => {
    try {
      if (selectedLesson) {
        await updateLesson(selectedLesson.id, lessonData);
      } else {
        await createLesson({ ...lessonData, course_id: courseId });
      }
      setSelectedView('overview');
      setSelectedLesson(null);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  if (!courseId) {
    return (
      <ModuleLayout sidebar={<ElearningModuleSidebar />}>
        <div className="p-8">
          <ElearningPageHeader 
            title="Authoring WYSIWYG" 
            subtitle="Sélectionnez un cours pour commencer à créer du contenu" 
          />
          <Card className="mt-6">
            <CardContent className="p-12 text-center">
              <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">Aucun cours sélectionné</h3>
              <p className="text-muted-foreground">
                Retournez à la page des cours pour sélectionner un cours à éditer.
              </p>
            </CardContent>
          </Card>
        </div>
      </ModuleLayout>
    );
  }

  return (
    <ModuleLayout sidebar={<ElearningModuleSidebar />}>
      <div className="p-8">
        <ElearningPageHeader 
          title={`Authoring - ${currentCourse?.title || 'Cours'}`}
          subtitle="Créez et gérez le contenu de votre cours" 
        />

        {selectedView === 'lesson-editor' ? (
          <LessonEditor
            lesson={selectedLesson}
            onSave={handleSaveLesson}
            onCancel={() => setSelectedView('overview')}
          />
        ) : (
          <div className="mt-6 space-y-6">
            <Tabs value={selectedView} onValueChange={setSelectedView}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Vue d'ensemble
                </TabsTrigger>
                <TabsTrigger value="content">
                  <PlayCircle className="w-4 h-4 mr-2" />
                  Contenu
                </TabsTrigger>
                <TabsTrigger value="students">
                  <Users className="w-4 h-4 mr-2" />
                  Étudiants
                </TabsTrigger>
                <TabsTrigger value="analytics">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Analytics
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Informations du cours</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p><strong>Code:</strong> {currentCourse?.code}</p>
                      <p><strong>Statut:</strong> {currentCourse?.status}</p>
                      <p><strong>Niveau:</strong> {currentCourse?.difficulty_level}</p>
                      <p><strong>Durée:</strong> {currentCourse?.estimated_duration || 'Non définie'} min</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Progression</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p><strong>Leçons:</strong> {lessons.length}</p>
                      <p><strong>Publiées:</strong> {lessons.filter(l => l.is_published).length}</p>
                      <p><strong>Brouillons:</strong> {lessons.filter(l => !l.is_published).length}</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Actions rapides</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Button className="w-full" onClick={handleCreateLesson}>
                        <Plus className="w-4 h-4 mr-2" />
                        Nouvelle leçon
                      </Button>
                      <Button variant="outline" className="w-full">
                        <Settings className="w-4 h-4 mr-2" />
                        Paramètres du cours
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Leçons</CardTitle>
                      <Button onClick={handleCreateLesson}>
                        <Plus className="w-4 h-4 mr-2" />
                        Ajouter une leçon
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {lessons.length > 0 ? (
                      <div className="space-y-4">
                        {lessons.map((lesson, index) => (
                          <div
                            key={lesson.id}
                            className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent cursor-pointer"
                            onClick={() => handleEditLesson(lesson)}
                          >
                            <div>
                              <h4 className="font-medium">{lesson.title}</h4>
                              <p className="text-sm text-muted-foreground">
                                {lesson.description || 'Aucune description'}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                                  {lesson.lesson_type}
                                </span>
                                {lesson.is_published && (
                                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                                    Publié
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Leçon {index + 1}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <PlayCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="text-lg font-semibold mb-2">Aucune leçon</h3>
                        <p className="text-muted-foreground mb-4">
                          Commencez par créer votre première leçon
                        </p>
                        <Button onClick={handleCreateLesson}>
                          <Plus className="w-4 h-4 mr-2" />
                          Créer une leçon
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="content">
                <Card>
                  <CardHeader>
                    <CardTitle>Gestion du contenu</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Fonctionnalité à développer</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="students">
                <Card>
                  <CardHeader>
                    <CardTitle>Gestion des étudiants</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Fonctionnalité à développer</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analytics">
                <Card>
                  <CardHeader>
                    <CardTitle>Analytics du cours</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Fonctionnalité à développer</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </ModuleLayout>
  );
}