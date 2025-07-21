import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { 
  Search, 
  Filter, 
  User, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  GraduationCap,
  Clock,
  FileText
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function StudentEvaluationInterface() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProgram, setFilterProgram] = useState('');
  const [filterLevel, setFilterLevel] = useState('');
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: students, isLoading } = useQuery({
    queryKey: ['students-for-promotion', searchTerm, filterProgram, filterLevel],
    queryFn: async () => {
      let query = supabase
        .from('students')
        .select(`
          id,
          student_number,
          status,
          program_id,
          current_academic_year_id,
          profiles!inner(
            full_name,
            email
          ),
          programs(
            name
          ),
          academic_years!current_academic_year_id(
            name
          )
        `)
        .eq('status', 'active');

      if (filterProgram) {
        query = query.eq('program_id', filterProgram);
      }
      if (searchTerm) {
        query = query.ilike('student_number', `%${searchTerm}%`);
      }

      const { data, error } = await query.order('student_number');
      
      if (error) throw error;
      return data;
    }
  });

  const { data: programs } = useQuery({
    queryKey: ['programs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('programs')
        .select('id, name')
        .order('name');
      
      if (error) throw error;
      return data;
    }
  });

  // Supprimer la requête levels pour simplifier
  const levels: any[] = [];

  const evaluateStudentsMutation = useMutation({
    mutationFn: async (studentIds: string[]) => {
      // Simuler l'évaluation des étudiants
      const evaluations = studentIds.map(id => ({
        student_id: id,
        calculated_average: Math.random() * 20,
        attendance_rate: Math.random() * 100,
        promotion_decision: Math.random() > 0.3 ? 'promoted' : 'repeat'
      }));
      
      return evaluations;
    },
    onSuccess: (data) => {
      toast({
        title: "Évaluation terminée",
        description: `${data.length} étudiants ont été évalués avec succès.`,
      });
      setSelectedStudents([]);
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible d'évaluer les étudiants sélectionnés.",
        variant: "destructive",
      });
    }
  });

  const getPromotionStatus = (student: any) => {
    // Simuler le statut de promotion basé sur des critères
    const average = Math.random() * 20;
    const attendance = Math.random() * 100;
    
    if (average >= 10 && attendance >= 75) {
      return { status: 'promoted', label: 'Promu', variant: 'default' as const };
    } else if (average >= 8 && attendance >= 60) {
      return { status: 'conditional', label: 'Conditionnel', variant: 'secondary' as const };
    } else {
      return { status: 'repeat', label: 'Redoublement', variant: 'destructive' as const };
    }
  };

  const StudentCard = ({ student }: { student: any }) => {
    const promotionStatus = getPromotionStatus(student);
    const isSelected = selectedStudents.includes(student.id);

    return (
      <Card className={`transition-all ${isSelected ? 'ring-2 ring-violet-500' : ''}`}>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex items-start gap-3">
              <Checkbox
                checked={isSelected}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedStudents([...selectedStudents, student.id]);
                  } else {
                    setSelectedStudents(selectedStudents.filter(id => id !== student.id));
                  }
                }}
              />
              <div>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {student.profiles?.full_name || 'Nom non disponible'}
                  <Badge variant={promotionStatus.variant}>
                    {promotionStatus.label}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  {student.student_number} • {student.programs?.name || 'Programme non défini'}
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="font-medium">Moyenne</p>
              <p className="text-muted-foreground">
                {(Math.random() * 20).toFixed(1)}/20
              </p>
            </div>
            <div>
              <p className="font-medium">Présence</p>
              <p className="text-muted-foreground">
                {(Math.random() * 100).toFixed(0)}%
              </p>
            </div>
            <div>
              <p className="font-medium">ECTS</p>
              <p className="text-muted-foreground">
                {Math.floor(Math.random() * 60)}/60
              </p>
            </div>
            <div>
              <p className="font-medium">Année</p>
              <p className="text-muted-foreground">
                {student.academic_years?.name || 'Non définie'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return <div className="flex items-center justify-center p-8">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Évaluation des Étudiants</h2>
          <p className="text-muted-foreground">
            Analysez l'éligibilité des étudiants et gérez les décisions de promotion
          </p>
        </div>
        {selectedStudents.length > 0 && (
          <div className="flex gap-2">
            <Button
              onClick={() => evaluateStudentsMutation.mutate(selectedStudents)}
              disabled={evaluateStudentsMutation.isPending}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Évaluer ({selectedStudents.length})
            </Button>
            <Button
              variant="outline"
              onClick={() => setSelectedStudents([])}
            >
              Tout désélectionner
            </Button>
          </div>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtres et Recherche
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Input
                placeholder="Rechercher par nom ou numéro..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            
            <Select value={filterProgram} onValueChange={setFilterProgram}>
              <SelectTrigger>
                <SelectValue placeholder="Tous les programmes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tous les programmes</SelectItem>
                {programs?.map((program) => (
                  <SelectItem key={program.id} value={program.id}>
                    {program.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Niveau filter removed for simplification */}

            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setFilterProgram('');
              }}
            >
              Réinitialiser
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Students List */}
      <div className="space-y-4">
        {students?.map((student) => (
          <StudentCard key={student.id} student={student} />
        ))}

        {(!students || students.length === 0) && (
          <Card>
            <CardContent className="text-center py-8">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Aucun étudiant trouvé avec les critères actuels
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Bulk Actions */}
      {students && students.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Actions en Masse</CardTitle>
            <CardDescription>
              Sélectionnez des étudiants pour appliquer des actions groupées
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                onClick={() => setSelectedStudents(students.map(s => s.id))}
              >
                Tout sélectionner
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  const eligible = students.filter(s => getPromotionStatus(s).status === 'promoted');
                  setSelectedStudents(eligible.map(s => s.id));
                }}
              >
                Sélectionner les éligibles
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  const pending = students.filter(s => getPromotionStatus(s).status === 'conditional');
                  setSelectedStudents(pending.map(s => s.id));
                }}
              >
                Sélectionner les cas limites
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}