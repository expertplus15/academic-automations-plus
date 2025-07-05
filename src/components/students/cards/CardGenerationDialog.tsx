import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useStudentsData } from '@/hooks/students/useStudentsData';
import { useStudentCards, CardTemplate } from '@/hooks/students/useStudentCards';
import { Loader2, Users, Zap } from 'lucide-react';

interface CardGenerationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  templates: CardTemplate[];
}

export function CardGenerationDialog({ open, onOpenChange, templates }: CardGenerationDialogProps) {
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [generationMode, setGenerationMode] = useState<'individual' | 'auto'>('auto');
  
  const { students } = useStudentsData();
  const { generateCard, generateCardsForApprovedStudents, loading } = useStudentCards();

  const handleGenerate = async () => {
    if (generationMode === 'auto') {
      await generateCardsForApprovedStudents();
    } else {
      // Individual generation for selected students
      for (const studentId of selectedStudents) {
        await generateCard(studentId, selectedTemplate);
      }
    }
    onOpenChange(false);
  };

  const studentsWithoutCards = students.filter(student => 
    student.status === 'active'
  );

  const defaultTemplate = templates.find(t => t.is_default);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-emerald-500" />
            Génération de Cartes Étudiants
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant={generationMode === 'auto' ? 'default' : 'outline'}
              onClick={() => setGenerationMode('auto')}
              className="h-20 flex-col gap-2"
            >
              <Zap className="w-6 h-6" />
              <div className="text-center">
                <div className="font-medium">Génération Automatique</div>
                <div className="text-xs opacity-80">Tous les étudiants actifs</div>
              </div>
            </Button>

            <Button
              variant={generationMode === 'individual' ? 'default' : 'outline'}
              onClick={() => setGenerationMode('individual')}
              className="h-20 flex-col gap-2"
            >
              <Users className="w-6 h-6" />
              <div className="text-center">
                <div className="font-medium">Sélection Manuelle</div>
                <div className="text-xs opacity-80">Choisir les étudiants</div>
              </div>
            </Button>
          </div>

          {generationMode === 'auto' && (
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium mb-2">Génération Automatique</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Cette option générera automatiquement des cartes pour tous les étudiants actifs 
                qui n'en ont pas encore.
              </p>
              <div className="text-sm">
                <strong>{studentsWithoutCards.length}</strong> étudiants éligibles
              </div>
            </div>
          )}

          {generationMode === 'individual' && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Sélectionner les étudiants
                </label>
                <Select value={selectedStudents.join(',')} onValueChange={(value) => setSelectedStudents(value.split(',').filter(Boolean))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir les étudiants..." />
                  </SelectTrigger>
                  <SelectContent>
                    {studentsWithoutCards.map(student => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.profiles.full_name} - {student.student_number}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Template de carte
                </label>
                <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir un template..." />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map(template => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name} {template.is_default && '(par défaut)'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {defaultTemplate && generationMode === 'auto' && (
            <div className="text-sm text-muted-foreground">
              Template utilisé: <strong>{defaultTemplate.name}</strong>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button 
            onClick={handleGenerate}
            disabled={loading || (generationMode === 'individual' && selectedStudents.length === 0)}
          >
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Générer les Cartes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}