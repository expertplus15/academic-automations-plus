import React, { useState, useEffect } from 'react';
import { Search, User, Users, Check, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';

interface Student {
  id: string;
  student_number: string;
  profiles: {
    full_name: string;
    email: string;
  } | null;
  programs: {
    name: string;
    code: string;
  } | null;
}

interface StudentSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onStudentSelect: (studentIds: string[], students: Student[]) => void;
  documentType: string;
  allowMultiple?: boolean;
}

export function StudentSelector({ 
  isOpen, 
  onClose, 
  onStudentSelect, 
  documentType,
  allowMultiple = false 
}: StudentSelectorProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch students from Supabase
  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('students')
          .select(`
            id,
            student_number,
            profiles:profile_id(full_name, email),
            programs:program_id(name, code)
          `)
          .eq('status', 'active')
          .order('student_number');

        if (error) throw error;
        setStudents(data || []);
        setFilteredStudents(data || []);
      } catch (error) {
        console.error('Error fetching students:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchStudents();
    }
  }, [isOpen]);

  // Filter students based on search query
  useEffect(() => {
    if (!searchQuery) {
      setFilteredStudents(students);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = students.filter(student => 
      student.student_number.toLowerCase().includes(query) ||
      student.profiles?.full_name.toLowerCase().includes(query) ||
      student.profiles?.email.toLowerCase().includes(query) ||
      student.programs?.name.toLowerCase().includes(query)
    );
    setFilteredStudents(filtered);
  }, [searchQuery, students]);

  const handleStudentToggle = (studentId: string) => {
    const newSelected = new Set(selectedStudents);
    
    if (allowMultiple) {
      if (newSelected.has(studentId)) {
        newSelected.delete(studentId);
      } else {
        newSelected.add(studentId);
      }
    } else {
      newSelected.clear();
      newSelected.add(studentId);
    }
    
    setSelectedStudents(newSelected);
  };

  const handleConfirm = () => {
    const selectedStudentData = students.filter(s => selectedStudents.has(s.id));
    onStudentSelect(Array.from(selectedStudents), selectedStudentData);
    onClose();
  };

  const handleClose = () => {
    setSelectedStudents(new Set());
    setSearchQuery('');
    onClose();
  };

  const selectedCount = selectedStudents.size;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {allowMultiple ? <Users className="w-5 h-5" /> : <User className="w-5 h-5" />}
            Sélectionner {allowMultiple ? 'les étudiants' : "l'étudiant"} - {documentType}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Rechercher par nom, numéro ou programme..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Selection summary */}
          {selectedCount > 0 && (
            <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
              <span className="text-sm font-medium">
                {selectedCount} étudiant{selectedCount > 1 ? 's' : ''} sélectionné{selectedCount > 1 ? 's' : ''}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedStudents(new Set())}
              >
                <X className="w-4 h-4 mr-1" />
                Tout désélectionner
              </Button>
            </div>
          )}

          {/* Students list */}
          <div className="max-h-[400px] overflow-y-auto space-y-2">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-sm text-muted-foreground mt-2">Chargement des étudiants...</p>
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="text-center py-8">
                <User className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  {searchQuery ? 'Aucun étudiant trouvé pour cette recherche' : 'Aucun étudiant disponible'}
                </p>
              </div>
            ) : (
              filteredStudents.map((student) => {
                const isSelected = selectedStudents.has(student.id);
                return (
                  <Card
                    key={student.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      isSelected ? 'ring-2 ring-primary shadow-md' : ''
                    }`}
                    onClick={() => handleStudentToggle(student.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                              isSelected 
                                ? 'bg-primary border-primary text-primary-foreground' 
                                : 'border-muted-foreground'
                            }`}>
                              {isSelected && <Check className="w-3 h-3" />}
                            </div>
                            <div>
                              <h4 className="font-medium">{student.profiles?.full_name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {student.student_number} • {student.profiles?.email}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {student.programs?.code && (
                            <Badge variant="secondary" className="text-xs">
                              {student.programs.code}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>

          <Separator />

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleClose}>
              Annuler
            </Button>
            <Button 
              onClick={handleConfirm} 
              disabled={selectedCount === 0}
            >
              Continuer avec {selectedCount} étudiant{selectedCount > 1 ? 's' : ''}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}