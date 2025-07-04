import React, { useState } from 'react';
import { ModuleLayout } from '@/components/layouts/ModuleLayout';
import { HrModuleSidebar } from '@/components/HrModuleSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp,
  Search,
  Plus,
  Eye,
  Edit,
  Star,
  Users,
  Target,
  Award,
  Calendar
} from 'lucide-react';
import { PerformanceEvaluationModal } from '@/components/hr/PerformanceEvaluationModal';
import { useToast } from '@/hooks/use-toast';

export default function Performance() {
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvaluation, setSelectedEvaluation] = useState(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');
  const { toast } = useToast();

  // Données factices pour les évaluations
  const mockEvaluations = [
    {
      id: '1',
      teacher_name: 'Dr. Marie Dubois',
      employee_number: 'EMP001',
      evaluation_period: '2023-2024',
      overall_score: 87,
      pedagogical_skills: 90,
      subject_mastery: 92,
      student_relations: 85,
      administrative_tasks: 80,
      professional_development: 88,
      evaluator: 'Prof. Jean Directeur',
      evaluation_date: '2024-06-15',
      status: 'completed',
      goals_achieved: 4,
      total_goals: 5
    },
    {
      id: '2',
      teacher_name: 'Prof. Jean Martin',
      employee_number: 'EMP002',
      evaluation_period: '2023-2024',
      overall_score: 94,
      pedagogical_skills: 95,
      subject_mastery: 96,
      student_relations: 92,
      administrative_tasks: 90,
      professional_development: 95,
      evaluator: 'Prof. Jean Directeur',
      evaluation_date: '2024-06-20',
      status: 'completed',
      goals_achieved: 5,
      total_goals: 5
    },
    {
      id: '3',
      teacher_name: 'Dr. Sarah Wilson',
      employee_number: 'EMP003',
      evaluation_period: '2023-2024',
      overall_score: 0,
      evaluator: 'Prof. Jean Directeur',
      status: 'pending',
      goals_achieved: 0,
      total_goals: 4
    }
  ];

  const filteredEvaluations = mockEvaluations.filter(evaluation =>
    evaluation.teacher_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    evaluation.employee_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    evaluation.evaluation_period.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-700 border-green-200">Terminée</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">En attente</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-100 text-blue-700 border-blue-200">En cours</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-yellow-600';
    if (score >= 70) return 'text-orange-600';
    return 'text-red-600';
  };

  const completedEvaluations = mockEvaluations.filter(e => e.status === 'completed');
  const averageScore = completedEvaluations.length > 0 
    ? Math.round(completedEvaluations.reduce((sum, e) => sum + e.overall_score, 0) / completedEvaluations.length)
    : 0;

  const handleCreateEvaluation = () => {
    setSelectedEvaluation(null);
    setModalMode('create');
    setModalOpen(true);
  };

  const handleViewEvaluation = (evaluation: any) => {
    setSelectedEvaluation(evaluation);
    setModalMode('view');
    setModalOpen(true);
  };

  const handleEditEvaluation = (evaluation: any) => {
    setSelectedEvaluation(evaluation);
    setModalMode('edit');
    setModalOpen(true);
  };

  const handleSaveEvaluation = (data: any) => {
    console.log('Saving evaluation:', data);
    toast({
      title: "Évaluation sauvegardée",
      description: "L'évaluation a été sauvegardée avec succès.",
    });
  };

  const stats = [
    {
      label: "Évaluations totales",
      value: mockEvaluations.length,
      icon: Target
    },
    {
      label: "Terminées",
      value: completedEvaluations.length,
      icon: Award
    },
    {
      label: "Score moyen",
      value: `${averageScore}%`,
      icon: TrendingUp
    },
    {
      label: "En attente",
      value: mockEvaluations.filter(e => e.status === 'pending').length,
      icon: Calendar
    }
  ];

  return (
    <ModuleLayout sidebar={<HrModuleSidebar />}>
      <div className="p-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Performance & Évaluations</h1>
            <p className="text-muted-foreground mt-1">Suivi des performances et évaluations des enseignants</p>
          </div>
          <Button 
            className="bg-amber-500 hover:bg-amber-600 text-white"
            onClick={handleCreateEvaluation}
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle évaluation
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="bg-white rounded-2xl shadow-sm border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    </div>
                    <div className="p-3 bg-amber-100 rounded-xl">
                      <Icon className="w-6 h-6 text-amber-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Search */}
        <Card className="bg-white rounded-2xl shadow-sm border-0">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Rechercher par enseignant, numéro employé ou période..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Evaluations List */}
        <Card className="bg-white rounded-2xl shadow-sm border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-amber-500" />
              Évaluations ({filteredEvaluations.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredEvaluations.map((evaluation) => (
                <div
                  key={evaluation.id}
                  className="flex items-center justify-between p-4 rounded-xl border border-border/50 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-amber-600" />
                    </div>
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-foreground">{evaluation.teacher_name}</h3>
                        {getStatusBadge(evaluation.status)}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <span className="font-medium">N°:</span> {evaluation.employee_number}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Période: {evaluation.evaluation_period}
                        </span>
                        {evaluation.evaluation_date && (
                          <span>Évalué le {new Date(evaluation.evaluation_date).toLocaleDateString('fr-FR')}</span>
                        )}
                      </div>
                      
                      {evaluation.status === 'completed' && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-4">
                            <span className={`text-lg font-bold ${getScoreColor(evaluation.overall_score)}`}>
                              Score global: {evaluation.overall_score}%
                            </span>
                            <span className="text-sm text-muted-foreground">
                              Objectifs: {evaluation.goals_achieved}/{evaluation.total_goals}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-xs">
                            <div>
                              <p className="text-muted-foreground">Pédagogie</p>
                              <Progress value={evaluation.pedagogical_skills} className="h-2" />
                              <span className="font-medium">{evaluation.pedagogical_skills}%</span>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Expertise</p>
                              <Progress value={evaluation.subject_mastery} className="h-2" />
                              <span className="font-medium">{evaluation.subject_mastery}%</span>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Relations</p>
                              <Progress value={evaluation.student_relations} className="h-2" />
                              <span className="font-medium">{evaluation.student_relations}%</span>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Admin</p>
                              <Progress value={evaluation.administrative_tasks} className="h-2" />
                              <span className="font-medium">{evaluation.administrative_tasks}%</span>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Développement</p>
                              <Progress value={evaluation.professional_development} className="h-2" />
                              <span className="font-medium">{evaluation.professional_development}%</span>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <p className="text-sm text-muted-foreground">
                        Évaluateur: {evaluation.evaluator}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewEvaluation(evaluation)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEditEvaluation(evaluation)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
              
              {filteredEvaluations.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Aucune évaluation trouvée</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Modal */}
        <PerformanceEvaluationModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleSaveEvaluation}
          evaluation={selectedEvaluation}
          mode={modalMode}
        />
      </div>
    </ModuleLayout>
  );
}