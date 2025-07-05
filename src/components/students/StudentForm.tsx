import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Student, CreateStudentData, UpdateStudentData } from '@/hooks/students/useStudentsData';
import { supabase } from '@/integrations/supabase/client';

interface StudentFormProps {
  open: boolean;
  onClose: () => void;
  student?: Student;
  onSave: (data: CreateStudentData | UpdateStudentData) => Promise<{ success: boolean; error?: any }>;
}

interface Program {
  id: string;
  name: string;
  code: string;
}

export function StudentForm({ open, onClose, student, onSave }: StudentFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    program_id: '',
    year_level: 1,
    status: 'active' as 'active' | 'suspended' | 'graduated' | 'dropped'
  });
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (student) {
      setFormData({
        full_name: student.profiles.full_name,
        email: student.profiles.email,
        phone: student.profiles.phone || '',
        program_id: student.programs.id,
        year_level: student.year_level,
        status: student.status
      });
    } else {
      setFormData({
        full_name: '',
        email: '',
        phone: '',
        program_id: '',
        year_level: 1,
        status: 'active'
      });
    }
  }, [student, open]);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const { data, error } = await supabase
          .from('programs')
          .select('id, name, code')
          .order('name');

        if (error) throw error;
        setPrograms(data || []);
      } catch (error) {
        console.error('Error fetching programs:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les programmes",
          variant: "destructive"
        });
      }
    };

    if (open) {
      fetchPrograms();
    }
  }, [open, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.full_name || !formData.email || !formData.program_id) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    const result = await onSave(formData);
    
    if (result.success) {
      toast({
        title: "Succès",
        description: student ? "Étudiant mis à jour avec succès" : "Étudiant créé avec succès"
      });
      onClose();
    } else {
      toast({
        title: "Erreur",
        description: result.error?.message || "Une erreur est survenue",
        variant: "destructive"
      });
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {student ? 'Modifier l\'étudiant' : 'Nouvel étudiant'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="full_name">Nom complet *</Label>
            <Input
              id="full_name"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              placeholder="Nom complet de l'étudiant"
              required
            />
          </div>

          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="email@exemple.com"
              required
            />
          </div>

          <div>
            <Label htmlFor="phone">Téléphone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+33 6 12 34 56 78"
            />
          </div>

          <div>
            <Label htmlFor="program_id">Programme *</Label>
            <Select 
              value={formData.program_id} 
              onValueChange={(value) => setFormData({ ...formData, program_id: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un programme" />
              </SelectTrigger>
              <SelectContent>
                {programs.map((program) => (
                  <SelectItem key={program.id} value={program.id}>
                    {program.name} ({program.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="year_level">Niveau d'étude</Label>
            <Select 
              value={formData.year_level.toString()} 
              onValueChange={(value) => setFormData({ ...formData, year_level: parseInt(value) })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5].map((level) => (
                  <SelectItem key={level} value={level.toString()}>
                    Niveau {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {student && (
            <div>
              <Label htmlFor="status">Statut</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value: 'active' | 'suspended' | 'graduated' | 'dropped') => 
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Actif</SelectItem>
                  <SelectItem value="suspended">Suspendu</SelectItem>
                  <SelectItem value="graduated">Diplômé</SelectItem>
                  <SelectItem value="dropped">Abandonné</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Enregistrement...' : (student ? 'Modifier' : 'Créer')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}