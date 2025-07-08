import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTeacherProfiles } from '@/hooks/hr/useTeacherProfiles';
import { useToast } from '@/hooks/use-toast';
import { 
  Save, 
  X, 
  Plus, 
  User,
  Phone,
  Mail,
  MapPin,
  GraduationCap,
  Award
} from 'lucide-react';

interface TeacherFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teacher?: any;
  onSuccess?: () => void;
}

export function TeacherFormModal({ open, onOpenChange, teacher, onSuccess }: TeacherFormModalProps) {
  const { createTeacherProfile, updateTeacherProfile } = useTeacherProfiles();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    employee_number: '',
    profile: {
      full_name: '',
      email: ''
    },
    department_id: '',
    hire_date: '',
    status: 'active',
    phone: '',
    emergency_contact: {
      name: '',
      phone: '',
      relationship: ''
    },
    salary_grade: '',
    office_location: '',
    bio: '',
    cv_url: '',
    photo_url: '',
    specialties: [] as string[],
    qualifications: [] as string[]
  });

  const [newSpecialty, setNewSpecialty] = useState('');
  const [newQualification, setNewQualification] = useState('');

  useEffect(() => {
    if (teacher) {
      setFormData({
        employee_number: teacher.employee_number || '',
        profile: {
          full_name: teacher.profile?.full_name || '',
          email: teacher.profile?.email || ''
        },
        department_id: teacher.department_id || '',
        hire_date: teacher.hire_date || '',
        status: teacher.status || 'active',
        phone: teacher.phone || '',
        emergency_contact: teacher.emergency_contact || {
          name: '',
          phone: '',
          relationship: ''
        },
        salary_grade: teacher.salary_grade || '',
        office_location: teacher.office_location || '',
        bio: teacher.bio || '',
        cv_url: teacher.cv_url || '',
        photo_url: teacher.photo_url || '',
        specialties: teacher.specialties || [],
        qualifications: teacher.qualifications || []
      });
    } else {
      // Reset form for new teacher
      setFormData({
        employee_number: '',
        profile: {
          full_name: '',
          email: ''
        },
        department_id: '',
        hire_date: '',
        status: 'active',
        phone: '',
        emergency_contact: {
          name: '',
          phone: '',
          relationship: ''
        },
        salary_grade: '',
        office_location: '',
        bio: '',
        cv_url: '',
        photo_url: '',
        specialties: [],
        qualifications: []
      });
    }
  }, [teacher, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (teacher) {
        await updateTeacherProfile(teacher.id, formData);
        toast({
          title: "Succès",
          description: "Profil enseignant mis à jour avec succès"
        });
      } else {
        await createTeacherProfile(formData);
        toast({
          title: "Succès", 
          description: "Profil enseignant créé avec succès"
        });
      }
      
      onSuccess?.();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addSpecialty = () => {
    if (newSpecialty.trim()) {
      setFormData(prev => ({
        ...prev,
        specialties: [...prev.specialties, newSpecialty.trim()]
      }));
      setNewSpecialty('');
    }
  };

  const removeSpecialty = (index: number) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.filter((_, i) => i !== index)
    }));
  };

  const addQualification = () => {
    if (newQualification.trim()) {
      setFormData(prev => ({
        ...prev,
        qualifications: [...prev.qualifications, newQualification.trim()]
      }));
      setNewQualification('');
    }
  };

  const removeQualification = (index: number) => {
    setFormData(prev => ({
      ...prev,
      qualifications: prev.qualifications.filter((_, i) => i !== index)
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-amber-500" />
            {teacher ? 'Modifier l\'enseignant' : 'Nouvel enseignant'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Informations de base</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
              <TabsTrigger value="professional">Professionnel</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="full_name">Nom complet *</Label>
                  <Input
                    id="full_name"
                    value={formData.profile.full_name}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      profile: { ...prev.profile, full_name: e.target.value }
                    }))}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.profile.email}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      profile: { ...prev.profile, email: e.target.value }
                    }))}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="employee_number">Numéro employé</Label>
                  <Input
                    id="employee_number"
                    value={formData.employee_number}
                    onChange={(e) => setFormData(prev => ({ ...prev, employee_number: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="hire_date">Date d'embauche</Label>
                  <Input
                    id="hire_date"
                    type="date"
                    value={formData.hire_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, hire_date: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="status">Statut</Label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Actif</SelectItem>
                      <SelectItem value="inactive">Inactif</SelectItem>
                      <SelectItem value="on_leave">En congé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="bio">Biographie</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  rows={4}
                />
              </div>
            </TabsContent>

            <TabsContent value="contact" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Téléphone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="office_location">Bureau</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="office_location"
                      value={formData.office_location}
                      onChange={(e) => setFormData(prev => ({ ...prev, office_location: e.target.value }))}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <Card>
                <CardContent className="p-4">
                  <Label className="text-sm font-medium">Contact d'urgence</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
                    <Input
                      placeholder="Nom"
                      value={formData.emergency_contact.name}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        emergency_contact: { ...prev.emergency_contact, name: e.target.value }
                      }))}
                    />
                    <Input
                      placeholder="Téléphone"
                      value={formData.emergency_contact.phone}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        emergency_contact: { ...prev.emergency_contact, phone: e.target.value }
                      }))}
                    />
                    <Input
                      placeholder="Relation"
                      value={formData.emergency_contact.relationship}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        emergency_contact: { ...prev.emergency_contact, relationship: e.target.value }
                      }))}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="professional" className="space-y-4">
              <div>
                <Label htmlFor="salary_grade">Grade salarial</Label>
                <Input
                  id="salary_grade"
                  value={formData.salary_grade}
                  onChange={(e) => setFormData(prev => ({ ...prev, salary_grade: e.target.value }))}
                />
              </div>

              {/* Specialties */}
              <Card>
                <CardContent className="p-4">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <GraduationCap className="w-4 h-4" />
                    Spécialités
                  </Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      placeholder="Ajouter une spécialité..."
                      value={newSpecialty}
                      onChange={(e) => setNewSpecialty(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSpecialty())}
                    />
                    <Button type="button" variant="outline" size="sm" onClick={addSpecialty}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.specialties.map((specialty, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {specialty}
                        <button
                          type="button"
                          onClick={() => removeSpecialty(index)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Qualifications */}
              <Card>
                <CardContent className="p-4">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    Qualifications
                  </Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      placeholder="Ajouter une qualification..."
                      value={newQualification}
                      onChange={(e) => setNewQualification(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addQualification())}
                    />
                    <Button type="button" variant="outline" size="sm" onClick={addQualification}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.qualifications.map((qualification, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {qualification}
                        <button
                          type="button"
                          onClick={() => removeQualification(index)}
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

            <TabsContent value="documents" className="space-y-4">
              <div>
                <Label htmlFor="photo_url">URL Photo</Label>
                <Input
                  id="photo_url"
                  value={formData.photo_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, photo_url: e.target.value }))}
                  placeholder="https://..."
                />
              </div>

              <div>
                <Label htmlFor="cv_url">URL CV</Label>
                <Input
                  id="cv_url"
                  value={formData.cv_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, cv_url: e.target.value }))}
                  placeholder="https://..."
                />
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading} className="bg-amber-500 hover:bg-amber-600">
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Enregistrement...' : teacher ? 'Mettre à jour' : 'Créer'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}