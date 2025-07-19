import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface WorkflowStep {
  id: string;
  name: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'skipped';
  startDate?: string;
  endDate?: string;
  assignedTo?: string;
  dependencies: string[];
  metadata: any;
}

export interface WorkflowInstance {
  id: string;
  examId: string;
  examTitle: string;
  currentStep: string;
  status: 'active' | 'completed' | 'failed' | 'paused';
  steps: WorkflowStep[];
  createdAt: string;
  updatedAt: string;
}

export function useWorkflowSystem() {
  const [workflows, setWorkflows] = useState<WorkflowInstance[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Template de workflow standard : Convocation → Examen → Saisie → Validation → Document
  const createWorkflowTemplate = (examId: string, examTitle: string, examDate: string): WorkflowStep[] => {
    const exam = new Date(examDate);
    
    return [
      {
        id: 'convocation',
        name: 'Envoi des convocations',
        status: 'pending',
        startDate: new Date(exam.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        dependencies: [],
        metadata: { 
          description: 'Générer et envoyer les convocations aux étudiants',
          estimatedDuration: '2h',
          automatable: true
        }
      },
      {
        id: 'exam_session',
        name: 'Session d\'examen',
        status: 'pending',
        startDate: examDate,
        dependencies: ['convocation'],
        metadata: { 
          description: 'Déroulement de la session d\'examen',
          estimatedDuration: '3h',
          automatable: false
        }
      },
      {
        id: 'grade_entry',
        name: 'Saisie des notes',
        status: 'pending',
        startDate: new Date(exam.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        endDate: new Date(exam.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        dependencies: ['exam_session'],
        metadata: { 
          description: 'Saisie et correction des copies d\'examen',
          estimatedDuration: '5 jours',
          automatable: false
        }
      },
      {
        id: 'validation',
        name: 'Validation des notes',
        status: 'pending',
        startDate: new Date(exam.getTime() + 8 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        endDate: new Date(exam.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        dependencies: ['grade_entry'],
        metadata: { 
          description: 'Validation et publication des notes',
          estimatedDuration: '2 jours',
          automatable: true
        }
      },
      {
        id: 'document_generation',
        name: 'Génération des documents',
        status: 'pending',
        startDate: new Date(exam.getTime() + 11 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        dependencies: ['validation'],
        metadata: { 
          description: 'Génération des bulletins et relevés',
          estimatedDuration: '1h',
          automatable: true
        }
      },
      {
        id: 'notification',
        name: 'Notification aux étudiants',
        status: 'pending',
        startDate: new Date(exam.getTime() + 12 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        dependencies: ['document_generation'],
        metadata: { 
          description: 'Envoi des notifications de disponibilité des résultats',
          estimatedDuration: '30min',
          automatable: true
        }
      }
    ];
  };

  // Créer un nouveau workflow pour un examen
  const createWorkflow = useCallback(async (examId: string, examTitle: string, examDate: string) => {
    try {
      const steps = createWorkflowTemplate(examId, examTitle, examDate);
      
      const workflow: WorkflowInstance = {
        id: crypto.randomUUID(),
        examId,
        examTitle,
        currentStep: steps[0].id,
        status: 'active',
        steps,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Sauvegarder dans Supabase
      const { error } = await supabase
        .from('workflow_instances')
        .insert({
          id: workflow.id,
          exam_id: examId,
          exam_title: examTitle,
          current_step: workflow.currentStep,
          status: workflow.status,
          steps: workflow.steps,
          created_at: workflow.createdAt,
          updated_at: workflow.updatedAt
        });

      if (error) throw error;

      setWorkflows(prev => [...prev, workflow]);
      
      toast({
        title: "Workflow créé",
        description: `Workflow créé pour l'examen "${examTitle}"`,
      });

      return workflow;
    } catch (error) {
      console.error('Error creating workflow:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer le workflow",
        variant: "destructive",
      });
    }
  }, [toast]);

  // Mettre à jour l'état d'une étape
  const updateStepStatus = useCallback(async (workflowId: string, stepId: string, status: WorkflowStep['status']) => {
    try {
      const workflow = workflows.find(w => w.id === workflowId);
      if (!workflow) return;

      const updatedSteps = workflow.steps.map(step => 
        step.id === stepId ? { ...step, status, endDate: status === 'completed' ? new Date().toISOString().split('T')[0] : step.endDate } : step
      );

      // Déterminer la prochaine étape
      let nextStep = workflow.currentStep;
      if (status === 'completed') {
        const currentStepIndex = workflow.steps.findIndex(s => s.id === stepId);
        const nextStepIndex = currentStepIndex + 1;
        if (nextStepIndex < workflow.steps.length) {
          nextStep = workflow.steps[nextStepIndex].id;
          // Démarrer automatiquement la prochaine étape si possible
          updatedSteps[nextStepIndex].status = 'in_progress';
        }
      }

      const updatedWorkflow = {
        ...workflow,
        steps: updatedSteps,
        currentStep: nextStep,
        status: status === 'completed' && stepId === workflow.steps[workflow.steps.length - 1].id ? 'completed' as const : workflow.status,
        updatedAt: new Date().toISOString()
      };

      // Mettre à jour dans Supabase
      const { error } = await supabase
        .from('workflow_instances')
        .update({
          current_step: updatedWorkflow.currentStep,
          status: updatedWorkflow.status,
          steps: updatedWorkflow.steps,
          updated_at: updatedWorkflow.updatedAt
        })
        .eq('id', workflowId);

      if (error) throw error;

      setWorkflows(prev => prev.map(w => w.id === workflowId ? updatedWorkflow : w));

      // Créer une notification pour la prochaine étape
      if (status === 'completed' && nextStep !== workflow.currentStep) {
        await createStepNotification(updatedWorkflow, nextStep);
      }

      toast({
        title: "Étape mise à jour",
        description: `Étape "${workflow.steps.find(s => s.id === stepId)?.name}" ${status === 'completed' ? 'terminée' : 'mise à jour'}`,
      });

    } catch (error) {
      console.error('Error updating step status:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour l'étape",
        variant: "destructive",
      });
    }
  }, [workflows, toast]);

  // Créer une notification pour une étape
  const createStepNotification = async (workflow: WorkflowInstance, stepId: string) => {
    const step = workflow.steps.find(s => s.id === stepId);
    if (!step) return;

    try {
      await supabase
        .from('notifications')
        .insert({
          type: 'workflow_step',
          title: `Nouvelle étape: ${step.name}`,
          message: `L'étape "${step.name}" pour l'examen "${workflow.examTitle}" est prête à être exécutée`,
          severity: 'info',
          related_entity_id: workflow.examId,
          related_entity_type: 'exam',
          scheduled_for: step.startDate ? new Date(step.startDate).toISOString() : new Date().toISOString(),
          data: {
            workflowId: workflow.id,
            stepId: step.id,
            automatable: step.metadata.automatable
          }
        });
    } catch (error) {
      console.error('Error creating step notification:', error);
    }
  };

  // Charger tous les workflows
  const loadWorkflows = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('workflow_instances')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const mappedWorkflows: WorkflowInstance[] = (data || []).map(item => ({
        id: item.id,
        examId: item.exam_id,
        examTitle: item.exam_title,
        currentStep: item.current_step,
        status: item.status,
        steps: item.steps,
        createdAt: item.created_at,
        updatedAt: item.updated_at
      }));

      setWorkflows(mappedWorkflows);
    } catch (error) {
      console.error('Error loading workflows:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les workflows",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Exécuter automatiquement les étapes automatisables
  const executeAutomaticSteps = useCallback(async () => {
    const today = new Date().toISOString().split('T')[0];
    
    for (const workflow of workflows) {
      const currentStep = workflow.steps.find(s => s.id === workflow.currentStep);
      if (currentStep && 
          currentStep.status === 'in_progress' && 
          currentStep.metadata.automatable &&
          currentStep.startDate === today) {
        
        // Simuler l'exécution automatique
        await new Promise(resolve => setTimeout(resolve, 1000));
        await updateStepStatus(workflow.id, currentStep.id, 'completed');
      }
    }
  }, [workflows, updateStepStatus]);

  return {
    workflows,
    loading,
    createWorkflow,
    updateStepStatus,
    loadWorkflows,
    executeAutomaticSteps
  };
}