import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCourses } from '@/hooks/useCourses';
import { useCourseCategories } from '@/hooks/useCourseCategories';
import { useToast } from '@/hooks/use-toast';
import { courseFormSchema, type CourseFormData } from '@/lib/validations';
import { z } from 'zod';
import { 
  Save, 
  X, 
  Plus, 
  Trash2, 
  GraduationCap,
  Clock,
  Users,
  BookOpen,
  DollarSign
} from 'lucide-react';

interface CourseFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course?: any;
  onSuccess?: () => void;
}

export function CourseFormModal({ open, onOpenChange, course, onSuccess }: CourseFormModalProps) {
  const { createCourse, updateCourse } = useCourses();
  const { categories: courseCategories } = useCourseCategories();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<CourseFormData>>({});
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    code: '',
    description: '',
    category_id: '',
    difficulty_level: 'beginner',
    duration_hours: 10,
    max_students: 50,
    price: 0,
    language: 'fr',
    is_published: false,
    is_featured: false,
    prerequisites: [] as string[],
    learning_objectives: [] as string[],
    enrollment_start_date: '',
    enrollment_end_date: '',
    course_start_date: '',
    course_end_date: '',
    thumbnail_url: ''
  });

  const [newPrerequisite, setNewPrerequisite] = useState('');
  const [newObjective, setNewObjective] = useState('');

  useEffect(() => {
    if (course) {
      setFormData({
        title: course.title || '',
        code: course.code || '',
        description: course.description || '',
        category_id: course.category_id || '',
        difficulty_level: course.difficulty_level || 'beginner',
        duration_hours: course.duration_hours || 10,
        max_students: course.max_students || 50,
        price: course.price || 0,
        language: course.language || 'fr',
        is_published: course.is_published || false,
        is_featured: course.is_featured || false,
        prerequisites: course.prerequisites || [],
        learning_objectives: course.learning_objectives || [],
        enrollment_start_date: course.enrollment_start_date || '',
        enrollment_end_date: course.enrollment_end_date || '',
        course_start_date: course.course_start_date || '',
        course_end_date: course.course_end_date || '',
        thumbnail_url: course.thumbnail_url || ''
      });
    } else {
      // Reset form for new course
      setFormData({
        title: '',
        code: '',
        description: '',
        category_id: '',
        difficulty_level: 'beginner',
        duration_hours: 10,
        max_students: 50,
        price: 0,
        language: 'fr',
        is_published: false,
        is_featured: false,
        prerequisites: [],
        learning_objectives: [],
        enrollment_start_date: '',
        enrollment_end_date: '',
        course_start_date: '',
        course_end_date: '',
        thumbnail_url: ''
      });
    }
  }, [course, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      // Validate form data
      const validatedData = courseFormSchema.parse(formData);
      
      if (course) {
        await updateCourse(course.id, validatedData as any);
        toast({
          title: "Succès",
          description: "Cours mis à jour avec succès"
        });
      } else {
        await createCourse(validatedData as any);
        toast({
          title: "Succès", 
          description: "Cours créé avec succès"
        });
      }
      
      onSuccess?.();
      onOpenChange(false);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Partial<CourseFormData> = {};
        error.errors.forEach((err) => {
          const path = err.path.join('.');
          (fieldErrors as any)[path] = err.message;
        });
        setErrors(fieldErrors);
        
        toast({
          title: "Erreur de validation",
          description: "Veuillez corriger les erreurs dans le formulaire",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de l'enregistrement",
          variant: "destructive"
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const addPrerequisite = () => {
    if (newPrerequisite.trim()) {
      setFormData(prev => ({
        ...prev,
        prerequisites: [...prev.prerequisites, newPrerequisite.trim()]
      }));
      setNewPrerequisite('');
    }
  };

  const removePrerequisite = (index: number) => {
    setFormData(prev => ({
      ...prev,
      prerequisites: prev.prerequisites.filter((_, i) => i !== index)
    }));
  };

  const addObjective = () => {
    if (newObjective.trim()) {
      setFormData(prev => ({
        ...prev,
        learning_objectives: [...prev.learning_objectives, newObjective.trim()]
      }));
      setNewObjective('');
    }
  };

  const removeObjective = (index: number) => {
    setFormData(prev => ({
      ...prev,
      learning_objectives: prev.learning_objectives.filter((_, i) => i !== index)
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-cyan-500" />
            {course ? 'Modifier le cours' : 'Nouveau cours'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Informations de base</TabsTrigger>
              <TabsTrigger value="details">Détails</TabsTrigger>
              <TabsTrigger value="dates">Dates</TabsTrigger>
              <TabsTrigger value="settings">Paramètres</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Titre du cours *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="code">Code du cours *</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Catégorie</Label>
                  <Select 
                    value={formData.category_id} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      {courseCategories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="difficulty">Niveau de difficulté</Label>
                  <Select 
                    value={formData.difficulty_level} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, difficulty_level: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Débutant</SelectItem>
                      <SelectItem value="intermediate">Intermédiaire</SelectItem>
                      <SelectItem value="advanced">Avancé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="details" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="duration">Durée (heures)</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="duration"
                      type="number"
                      min="1"
                      value={formData.duration_hours}
                      onChange={(e) => setFormData(prev => ({ ...prev, duration_hours: parseInt(e.target.value) || 0 }))}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="max_students">Étudiants max</Label>
                  <div className="relative">
                    <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="max_students"
                      type="number"
                      min="1"
                      value={formData.max_students}
                      onChange={(e) => setFormData(prev => ({ ...prev, max_students: parseInt(e.target.value) || 0 }))}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="price">Prix (€)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              {/* Prerequisites */}
              <Card>
                <CardContent className="p-4">
                  <Label className="text-sm font-medium">Prérequis</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      placeholder="Ajouter un prérequis..."
                      value={newPrerequisite}
                      onChange={(e) => setNewPrerequisite(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPrerequisite())}
                    />
                    <Button type="button" variant="outline" size="sm" onClick={addPrerequisite}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.prerequisites.map((prereq, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {prereq}
                        <button
                          type="button"
                          onClick={() => removePrerequisite(index)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Learning Objectives */}
              <Card>
                <CardContent className="p-4">
                  <Label className="text-sm font-medium">Objectifs d'apprentissage</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      placeholder="Ajouter un objectif..."
                      value={newObjective}
                      onChange={(e) => setNewObjective(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addObjective())}
                    />
                    <Button type="button" variant="outline" size="sm" onClick={addObjective}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.learning_objectives.map((objective, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {objective}
                        <button
                          type="button"
                          onClick={() => removeObjective(index)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="dates" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="enrollment_start">Début des inscriptions</Label>
                  <Input
                    id="enrollment_start"
                    type="date"
                    value={formData.enrollment_start_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, enrollment_start_date: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="enrollment_end">Fin des inscriptions</Label>
                  <Input
                    id="enrollment_end"
                    type="date"
                    value={formData.enrollment_end_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, enrollment_end_date: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="course_start">Début du cours</Label>
                  <Input
                    id="course_start"
                    type="date"
                    value={formData.course_start_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, course_start_date: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="course_end">Fin du cours</Label>
                  <Input
                    id="course_end"
                    type="date"
                    value={formData.course_end_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, course_end_date: e.target.value }))}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Cours publié</Label>
                    <p className="text-sm text-muted-foreground">
                      Le cours sera visible par les étudiants
                    </p>
                  </div>
                  <Switch
                    checked={formData.is_published}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_published: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Cours à la une</Label>
                    <p className="text-sm text-muted-foreground">
                      Le cours sera mis en avant
                    </p>
                  </div>
                  <Switch
                    checked={formData.is_featured}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_featured: checked }))}
                  />
                </div>

                <div>
                  <Label htmlFor="language">Langue</Label>
                  <Select 
                    value={formData.language} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, language: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="thumbnail">URL de l'image</Label>
                  <Input
                    id="thumbnail"
                    value={formData.thumbnail_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, thumbnail_url: e.target.value }))}
                    placeholder="https://..."
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading} className="bg-cyan-500 hover:bg-cyan-600">
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Enregistrement...' : course ? 'Mettre à jour' : 'Créer'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}