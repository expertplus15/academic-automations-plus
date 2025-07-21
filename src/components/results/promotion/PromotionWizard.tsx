import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronRight, 
  ChevronLeft, 
  Wand2, 
  Settings, 
  Users, 
  CheckCircle,
  AlertTriangle,
  Play,
  Calendar,
  Target,
  FileCheck
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface WizardData {
  campaignName: string;
  description: string;
  sourceAcademicYearId: string;
  targetAcademicYearId: string;
  selectedCriteria: string[];
  autoPromote: boolean;
  simulationMode: boolean;
}

export function PromotionWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [wizardData, setWizardData] = useState<WizardData>({
    campaignName: '',
    description: '',
    sourceAcademicYearId: '',
    targetAcademicYearId: '',
    selectedCriteria: [],
    autoPromote: false,
    simulationMode: true
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: academicYears } = useQuery({
    queryKey: ['academic-years'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('academic_years')
        .select('*')
        .order('start_date', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const { data: criteria } = useQuery({
    queryKey: ['promotion-criteria'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('promotion_criteria')
        .select('*')
        .eq('is_active', true)
        .order('name');
      
      if (error) throw error;
      return data;
    }
  });

  const { data: simulationResults, isLoading: isSimulating } = useQuery({
    queryKey: ['promotion-simulation', wizardData.sourceAcademicYearId, wizardData.selectedCriteria],
    queryFn: async () => {
      if (!wizardData.sourceAcademicYearId || wizardData.selectedCriteria.length === 0) {
        return null;
      }

      // Simuler les résultats de promotion
      return {
        totalStudents: 456,
        eligibleStudents: 389,
        conditionalStudents: 45,
        repeatingStudents: 22,
        details: [
          { program: 'Informatique', total: 120, eligible: 102, conditional: 12, repeat: 6 },
          { program: 'Commerce', total: 98, eligible: 87, conditional: 8, repeat: 3 },
          { program: 'Gestion', total: 180, eligible: 156, conditional: 18, repeat: 6 },
          { program: 'Communication', total: 58, eligible: 44, conditional: 7, repeat: 7 }
        ]
      };
    },
    enabled: currentStep >= 3 && !!wizardData.sourceAcademicYearId && wizardData.selectedCriteria.length > 0
  });

  const createCampaignMutation = useMutation({
    mutationFn: async (campaignData: any) => {
      const { data, error } = await supabase
        .from('promotion_campaigns')
        .insert(campaignData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      toast({
        title: "Campagne créée",
        description: `La campagne "${data.name}" a été créée avec succès.`,
      });
      queryClient.invalidateQueries({ queryKey: ['promotion-campaigns'] });
      // Reset wizard
      setCurrentStep(1);
      setWizardData({
        campaignName: '',
        description: '',
        sourceAcademicYearId: '',
        targetAcademicYearId: '',
        selectedCriteria: [],
        autoPromote: false,
        simulationMode: true
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de créer la campagne de promotion.",
        variant: "destructive",
      });
    }
  });

  const steps = [
    { number: 1, title: 'Configuration', icon: Settings },
    { number: 2, title: 'Critères', icon: Target },
    { number: 3, title: 'Simulation', icon: Users },
    { number: 4, title: 'Validation', icon: CheckCircle },
    { number: 5, title: 'Exécution', icon: Play }
  ];

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1:
        return wizardData.campaignName && wizardData.sourceAcademicYearId && wizardData.targetAcademicYearId;
      case 2:
        return wizardData.selectedCriteria.length > 0;
      case 3:
        return simulationResults !== null;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const executePromotion = () => {
    const campaignData = {
      name: wizardData.campaignName,
      description: wizardData.description,
      source_academic_year_id: wizardData.sourceAcademicYearId,
      target_academic_year_id: wizardData.targetAcademicYearId,
      status: wizardData.simulationMode ? 'draft' : 'in_progress',
      metadata: {
        selected_criteria: wizardData.selectedCriteria,
        auto_promote: wizardData.autoPromote,
        simulation_mode: wizardData.simulationMode
      }
    };

    createCampaignMutation.mutate(campaignData);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Wand2 className="h-5 w-5 text-violet-500" />
            Assistant de Promotion
          </h2>
          <p className="text-muted-foreground">
            Configurez et exécutez une campagne de promotion étape par étape
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`
                  flex items-center justify-center w-10 h-10 rounded-full border-2 
                  ${currentStep >= step.number 
                    ? 'bg-violet-500 border-violet-500 text-white' 
                    : 'border-gray-300 text-gray-500'
                  }
                `}>
                  <step.icon className="h-5 w-5" />
                </div>
                <div className="ml-2 hidden md:block">
                  <p className={`text-sm font-medium ${
                    currentStep >= step.number ? 'text-violet-500' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <ChevronRight className="h-4 w-4 text-gray-400 mx-4" />
                )}
              </div>
            ))}
          </div>
          <Progress value={(currentStep / steps.length) * 100} className="h-2" />
        </CardContent>
      </Card>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle>
            Étape {currentStep}: {steps[currentStep - 1].title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step 1: Configuration */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="campaignName">Nom de la campagne</Label>
                <Input
                  id="campaignName"
                  value={wizardData.campaignName}
                  onChange={(e) => setWizardData({ ...wizardData, campaignName: e.target.value })}
                  placeholder="ex: Promotion 2024-2025"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={wizardData.description}
                  onChange={(e) => setWizardData({ ...wizardData, description: e.target.value })}
                  placeholder="Description de la campagne de promotion..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Année académique source</Label>
                  <Select
                    value={wizardData.sourceAcademicYearId}
                    onValueChange={(value) => setWizardData({ ...wizardData, sourceAcademicYearId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner l'année source" />
                    </SelectTrigger>
                    <SelectContent>
                      {academicYears?.map((year) => (
                        <SelectItem key={year.id} value={year.id}>
                          {year.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Année académique cible</Label>
                  <Select
                    value={wizardData.targetAcademicYearId}
                    onValueChange={(value) => setWizardData({ ...wizardData, targetAcademicYearId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner l'année cible" />
                    </SelectTrigger>
                    <SelectContent>
                      {academicYears?.map((year) => (
                        <SelectItem key={year.id} value={year.id}>
                          {year.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Criteria Selection */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-4">Sélectionner les critères de promotion</h3>
                <div className="space-y-3">
                  {criteria?.map((criterion) => (
                    <Card key={criterion.id} className="p-4">
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          checked={wizardData.selectedCriteria.includes(criterion.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setWizardData({
                                ...wizardData,
                                selectedCriteria: [...wizardData.selectedCriteria, criterion.id]
                              });
                            } else {
                              setWizardData({
                                ...wizardData,
                                selectedCriteria: wizardData.selectedCriteria.filter(id => id !== criterion.id)
                              });
                            }
                          }}
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{criterion.name}</h4>
                            {criterion.is_mandatory && (
                              <Badge variant="destructive">Obligatoire</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {criterion.description}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <span>Type: {criterion.criteria_type}</span>
                            <span>Seuil: {criterion.threshold_value}</span>
                            <span>Pondération: {criterion.weight}</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Simulation */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                <h3 className="text-lg font-medium">Simulation des résultats</h3>
              </div>

              {isSimulating ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500 mx-auto mb-4"></div>
                  <p>Simulation en cours...</p>
                </div>
              ) : simulationResults ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="bg-blue-50 border-blue-200">
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-blue-900">
                          {simulationResults.totalStudents}
                        </div>
                        <p className="text-sm text-blue-600">Total étudiants</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-green-50 border-green-200">
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-green-900">
                          {simulationResults.eligibleStudents}
                        </div>
                        <p className="text-sm text-green-600">Promus</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-orange-50 border-orange-200">
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-orange-900">
                          {simulationResults.conditionalStudents}
                        </div>
                        <p className="text-sm text-orange-600">Conditionnels</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-red-50 border-red-200">
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-red-900">
                          {simulationResults.repeatingStudents}
                        </div>
                        <p className="text-sm text-red-600">Redoublants</p>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Détail par programme</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {simulationResults.details.map((detail, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded">
                            <span className="font-medium">{detail.program}</span>
                            <div className="flex gap-4 text-sm">
                              <span className="text-green-600">{detail.eligible} promus</span>
                              <span className="text-orange-600">{detail.conditional} conditionnels</span>
                              <span className="text-red-600">{detail.repeat} redoublants</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  Veuillez compléter les étapes précédentes pour voir la simulation
                </p>
              )}
            </div>
          )}

          {/* Step 4: Validation */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium mb-4">Validation et options finales</h3>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={wizardData.simulationMode}
                    onCheckedChange={(checked) => setWizardData({ ...wizardData, simulationMode: checked as boolean })}
                  />
                  <Label>Mode simulation (aucune modification ne sera appliquée)</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={wizardData.autoPromote}
                    onCheckedChange={(checked) => setWizardData({ ...wizardData, autoPromote: checked as boolean })}
                    disabled={wizardData.simulationMode}
                  />
                  <Label>Promotion automatique des étudiants éligibles</Label>
                </div>
              </div>

              <Card className="bg-amber-50 border-amber-200">
                <CardContent className="p-4">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-amber-900">Important</p>
                      <p className="text-sm text-amber-800 mt-1">
                        {wizardData.simulationMode 
                          ? "En mode simulation, aucune modification ne sera appliquée aux données étudiantes. Vous pourrez analyser les résultats en toute sécurité."
                          : "Cette action modifiera définitivement les données des étudiants. Assurez-vous d'avoir vérifié tous les paramètres."
                        }
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 5: Execution */}
          {currentStep === 5 && (
            <div className="space-y-4 text-center">
              <div className="mx-auto w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center">
                <Play className="h-8 w-8 text-violet-600" />
              </div>
              <h3 className="text-lg font-medium">Prêt à exécuter</h3>
              <p className="text-muted-foreground">
                Votre campagne de promotion est configurée et prête à être {wizardData.simulationMode ? 'simulée' : 'exécutée'}.
              </p>
              
              <Button 
                size="lg" 
                onClick={executePromotion}
                disabled={createCampaignMutation.isPending}
              >
                {createCampaignMutation.isPending ? 'Exécution...' : 
                 wizardData.simulationMode ? 'Lancer la simulation' : 'Exécuter la promotion'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={prevStep}
          disabled={currentStep === 1}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Précédent
        </Button>

        {currentStep < steps.length ? (
          <Button 
            onClick={nextStep}
            disabled={!canProceedToNext()}
          >
            Suivant
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        ) : null}
      </div>
    </div>
  );
}