import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { ModuleLayout } from "@/components/layouts/ModuleLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalculationCard } from "@/components/calculations/CalculationCard";
import { SimulationForm } from "@/components/calculations/SimulationForm";
import { StatisticsChart, CalculationStatsCard, PerformanceStatsCard } from "@/components/calculations/StatisticsChart";
import { ConfigurationPanel } from "@/components/calculations/ConfigurationPanel";
import { useAdvancedCalculations } from "@/hooks/useAdvancedCalculations";
import { DropdownRecalculate } from "@/components/results/DropdownRecalculate";
import { NavigationQuickLinks } from "@/components/results/NavigationQuickLinks";
import { useCalculationContext } from "@/contexts/CalculationContext";
import { useToast } from "@/hooks/use-toast";
import { 
  Calculator, 
  Cpu, 
  Zap, 
  Settings, 
  TrendingUp, 
  Users, 
  Award,
  RefreshCw,
  BarChart3,
  Brain,
  FileText,
  History
} from "lucide-react";

export default function Calculations() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [calculationStates, setCalculationStates] = useState<Record<string, "idle" | "running" | "completed" | "error">>({});
  const [activeTab, setActiveTab] = useState(() => searchParams.get('tab') || "auto");
  
  const { state, executeCalculation } = useCalculationContext();
  
  const {
    calculateECTSWithCompensation,
    simulateWhatIf,
    calculateAcademicHonors,
    getCalculationStatistics,
    fetchECTSConfig,
    updateECTSConfig,
    createGradeSimulation,
    fetchSimulations
  } = useAdvancedCalculations();
  
  const { toast } = useToast();

  // Sync URL params with tab state
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['auto', 'processing', 'statistics', 'config'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab);
    setSearchParams(prev => {
      prev.set('tab', newTab);
      return prev;
    });
  };

  const updateCalculationState = (id: string, state: "idle" | "running" | "completed" | "error") => {
    setCalculationStates(prev => ({ ...prev, [id]: state }));
  };

  const handleCalculateAverages = async () => {
    updateCalculationState("averages", "running");
    try {
      const success = await executeCalculation('averages', {});
      updateCalculationState("averages", success ? "completed" : "error");
    } catch (error) {
      updateCalculationState("averages", "error");
    }
  };

  const handleValidateECTS = async () => {
    updateCalculationState("ects", "running");
    try {
      const success = await executeCalculation('ects', {});
      updateCalculationState("ects", success ? "completed" : "error");
    } catch (error) {
      updateCalculationState("ects", "error");
    }
  };

  const handleBatchProcessing = async () => {
    updateCalculationState("batch", "running");
    try {
      const success = await executeCalculation('all', {});
      updateCalculationState("batch", success ? "completed" : "error");
    } catch (error) {
      updateCalculationState("batch", "error");
    }
  };

  const handleSimulation = async (grades: any[]) => {
    updateCalculationState("simulation", "running");
    try {
      // Ici on appellerait simulateWhatIf avec les vraies données
      await new Promise(resolve => setTimeout(resolve, 1500));
      updateCalculationState("simulation", "completed");
      toast({
        title: "Simulation terminée",
        description: `Impact calculé pour ${grades.length} notes hypothétiques.`
      });
    } catch (error) {
      updateCalculationState("simulation", "error");
      toast({
        title: "Erreur",
        description: "Échec de la simulation.",
        variant: "destructive"
      });
    }
  };

  return (
    <ModuleLayout 
      title="Calculs & Traitements" 
      subtitle="Calculs automatiques et traitement avancé des données académiques"
      showHeader={true}
    >
      <div className="p-6">
        {/* Navigation fluide */}
        <NavigationQuickLinks currentContext="calculations" />

        {/* Quick Actions Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Calculs & Traitements Avancés</h1>
            <p className="text-muted-foreground">Interface complète pour les calculs automatiques et l'administration</p>
          </div>
          <div className="flex gap-2">
            <DropdownRecalculate
              variant="default"
              size="default"
              onCalculationComplete={(type, success) => {
                if (success) {
                  toast({
                    title: "Calcul terminé",
                    description: `${type} exécuté avec succès depuis l'interface avancée`,
                  });
                  // Update relevant calculation states
                  if (type === 'averages') updateCalculationState('averages', 'completed');
                  if (type === 'ects') updateCalculationState('ects', 'completed');
                  if (type === 'all') {
                    updateCalculationState('averages', 'completed');
                    updateCalculationState('ects', 'completed');
                    updateCalculationState('batch', 'completed');
                  }
                }
              }}
            />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full max-w-2xl">
            <TabsTrigger value="auto" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Calculs Auto
            </TabsTrigger>
            <TabsTrigger value="processing" className="flex items-center gap-2">
              <Cpu className="w-4 h-4" />
              Traitement
            </TabsTrigger>
            <TabsTrigger value="statistics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Statistiques
            </TabsTrigger>
            <TabsTrigger value="config" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Configuration
            </TabsTrigger>
          </TabsList>

          <TabsContent value="auto" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <CalculationCard
                title="Moyennes & Notes"
                description="Calcul automatique des moyennes par matière, semestre et année académique"
                icon={<Calculator className="w-5 h-5 text-violet-500" />}
                status={calculationStates.averages || "idle"}
                lastRun="Il y a 2h"
                resultCount={1247}
                onExecute={handleCalculateAverages}
                onConfigure={() => setActiveTab("config")}
              />

              <CalculationCard
                title="Crédits ECTS"
                description="Validation automatique des crédits avec système de compensation"
                icon={<Zap className="w-5 h-5 text-yellow-500" />}
                status={calculationStates.ects || "idle"}
                lastRun="Il y a 1 jour"
                resultCount={456}
                onExecute={handleValidateECTS}
                onConfigure={() => setActiveTab("config")}
              />

              <CalculationCard
                title="Mentions Académiques"
                description="Attribution automatique des mentions selon les critères"
                icon={<Award className="w-5 h-5 text-emerald-500" />}
                status={calculationStates.honors || "idle"}
                lastRun="Il y a 3 jours"
                resultCount={89}
                onExecute={() => {}}
              />

              <CalculationCard
                title="Progression Étudiants"
                description="Mise à jour du taux de progression et des alertes"
                icon={<TrendingUp className="w-5 h-5 text-blue-500" />}
                status={calculationStates.progress || "idle"}
                lastRun="Il y a 6h"
                resultCount={2340}
                onExecute={() => {}}
              />

              <CalculationCard
                title="Statistiques Classe"
                description="Calcul des statistiques globales par classe et promotion"
                icon={<Users className="w-5 h-5 text-indigo-500" />}
                status={calculationStates.stats || "idle"}
                lastRun="Il y a 12h"
                resultCount={125}
                onExecute={() => {}}
              />

              <CalculationCard
                title="Relevés de Notes"
                description="Génération automatique des relevés de notes officiels"
                icon={<FileText className="w-5 h-5 text-slate-500" />}
                status={calculationStates.transcripts || "idle"}
                lastRun="Il y a 1 jour"
                resultCount={567}
                onExecute={() => {}}
              />
            </div>
          </TabsContent>

          <TabsContent value="processing" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <CalculationCard
                  title="Traitement par Lots"
                  description="Recalcul massif pour un programme ou une promotion entière"
                  icon={<Cpu className="w-5 h-5 text-green-500" />}
                  status={calculationStates.batch || "idle"}
                  progress={calculationStates.batch === "running" ? 65 : undefined}
                  lastRun="Il y a 2 jours"
                  resultCount={1500}
                  onExecute={handleBatchProcessing}
                />

                <CalculationCard
                  title="Synchronisation Modules"
                  description="Synchronisation des données avec les autres modules du système"
                  icon={<RefreshCw className="w-5 h-5 text-orange-500" />}
                  status={calculationStates.sync || "idle"}
                  lastRun="Il y a 30 min"
                  resultCount={89}
                  onExecute={() => {}}
                />

                <CalculationCard
                  title="Détection d'Anomalies"
                  description="Analyse intelligente pour détecter les incohérences"
                  icon={<Brain className="w-5 h-5 text-purple-500" />}
                  status={calculationStates.anomalies || "idle"}
                  lastRun="Il y a 4h"
                  resultCount={12}
                  onExecute={() => {}}
                />

                <CalculationCard
                  title="Historique Calculs"
                  description="Gestion et comparaison des historiques de calculs"
                  icon={<History className="w-5 h-5 text-slate-500" />}
                  status={calculationStates.history || "idle"}
                  lastRun="Il y a 1h"
                  resultCount={234}
                  onExecute={() => {}}
                />
              </div>

              <div>
                <SimulationForm
                  academicYearId="current-year"
                  onSimulate={handleSimulation}
                  onSave={(name, grades) => {
                    toast({
                      title: "Simulation sauvegardée",
                      description: `"${name}" avec ${grades.length} notes.`
                    });
                  }}
                  isLoading={calculationStates.simulation === "running"}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="statistics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CalculationStatsCard />
              <PerformanceStatsCard />
              
              <StatisticsChart
                title="Mentions Attribuées"
                icon={<Award className="w-5 h-5 text-emerald-500" />}
                statistics={[
                  { label: "Très Bien", value: 23, total: 150, status: "success" },
                  { label: "Bien", value: 45, total: 150, status: "success" },
                  { label: "Assez Bien", value: 67, total: 150, status: "warning" },
                  { label: "Passable", value: 15, total: 150 }
                ]}
              />
              
              <StatisticsChart
                title="Progression par Semestre"
                icon={<TrendingUp className="w-5 h-5 text-blue-500" />}
                statistics={[
                  { label: "Semestre 1", value: 142, total: 150, change: 5, trend: "up" },
                  { label: "Semestre 2", value: 138, total: 150, change: -2, trend: "down" },
                  { label: "Semestre 3", value: 145, total: 150, change: 8, trend: "up" },
                  { label: "Semestre 4", value: 140, total: 150, change: 0, trend: "stable" }
                ]}
              />
            </div>
          </TabsContent>

          <TabsContent value="config" className="space-y-6">
            <ConfigurationPanel />
          </TabsContent>
        </Tabs>
      </div>
    </ModuleLayout>
  );
}