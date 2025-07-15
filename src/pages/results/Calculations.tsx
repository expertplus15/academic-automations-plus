import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { ModuleLayout } from "@/components/layouts/ModuleLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CalculationCard } from "@/components/calculations/CalculationCard";
import { SimulationForm } from "@/components/calculations/SimulationForm";
import { StatisticsChart, CalculationStatsCard, PerformanceStatsCard } from "@/components/calculations/StatisticsChart";
import { ConfigurationPanel } from "@/components/calculations/ConfigurationPanel";
import { CalculationMonitoringDashboard } from "@/components/calculations/CalculationMonitoringDashboard";
import { AdvancedStatisticsViewer } from "@/components/calculations/AdvancedStatisticsViewer";
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
  History,
  Home,
  ChevronRight,
  Play,
  Pause,
  AlertTriangle,
  Clock,
  CheckCircle,
  Activity,
  Server,
  ArrowRight
} from "lucide-react";

export default function Calculations() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [calculationStates, setCalculationStates] = useState<Record<string, "idle" | "running" | "completed" | "error">>({});
  const [activeTab, setActiveTab] = useState(() => searchParams.get('tab') || "auto");
  const [globalProgress, setGlobalProgress] = useState(0);
  const [lastExecution, setLastExecution] = useState({
    time: "14:32",
    success: true,
    duration: "3m 24s",
    recordsProcessed: 2847
  });
  
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
      <div className="p-6 space-y-6">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Home className="w-4 h-4" />
          <ChevronRight className="w-4 h-4" />
          <span className="text-results">Résultats</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground font-medium">Calculs & Traitements</span>
        </div>

        {/* Header avec indicateurs en temps réel */}
        <div className="bg-gradient-to-r from-background to-muted/20 border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Centre de Calculs Avancés</h1>
              <p className="text-muted-foreground">Orchestration intelligente des traitements de données académiques</p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Indicateur d'état global */}
              <Card className="min-w-0">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium">Système Actif</span>
                    </div>
                    <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
                      Opérationnel
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Actions principales */}
              <div className="flex gap-2">
                <DropdownRecalculate
                  variant="default"
                  size="default"
                  onCalculationComplete={(type, success) => {
                    if (success) {
                      toast({
                        title: "Calcul terminé",
                        description: `${type} exécuté avec succès`,
                      });
                      setLastExecution({
                        time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
                        success: true,
                        duration: "3m 24s",
                        recordsProcessed: Math.floor(Math.random() * 1000) + 2000
                      });
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
          </div>

          {/* Métriques de dernière exécution */}
          <div className="grid grid-cols-4 gap-4">
            <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg border border-border/50">
              <Clock className="w-5 h-5 text-blue-500" />
              <div>
                <div className="text-sm text-muted-foreground">Dernière Exécution</div>
                <div className="font-semibold">{lastExecution.time}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg border border-border/50">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <div>
                <div className="text-sm text-muted-foreground">Statut</div>
                <div className="font-semibold text-green-600">
                  {lastExecution.success ? "Succès" : "Erreur"}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg border border-border/50">
              <Activity className="w-5 h-5 text-purple-500" />
              <div>
                <div className="text-sm text-muted-foreground">Durée</div>
                <div className="font-semibold">{lastExecution.duration}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg border border-border/50">
              <Users className="w-5 h-5 text-orange-500" />
              <div>
                <div className="text-sm text-muted-foreground">Enregistrements</div>
                <div className="font-semibold">{lastExecution.recordsProcessed.toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation fluide */}
        <NavigationQuickLinks currentContext="calculations" />

        {/* Actions suggérées contextuelles */}
        <Card className="border-dashed border-2 border-blue-200 bg-blue-50/50 dark:bg-blue-950/20 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-semibold text-blue-900 dark:text-blue-100">Suggestions Intelligentes</div>
                  <div className="text-sm text-blue-700 dark:text-blue-300">
                    Le système recommande un recalcul des moyennes après les dernières saisies
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100">
                  Plus tard
                </Button>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Play className="w-4 h-4 mr-2" />
                  Exécuter maintenant
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full max-w-2xl bg-background border border-border">
            <TabsTrigger value="auto" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500/10 data-[state=active]:to-violet-500/5">
              <Zap className="w-4 h-4" />
              Calculs Auto
            </TabsTrigger>
            <TabsTrigger value="processing" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/10 data-[state=active]:to-blue-500/5">
              <Cpu className="w-4 h-4" />
              Traitement
            </TabsTrigger>
            <TabsTrigger value="statistics" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500/10 data-[state=active]:to-green-500/5">
              <BarChart3 className="w-4 h-4" />
              Statistiques
            </TabsTrigger>
            <TabsTrigger value="config" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500/10 data-[state=active]:to-orange-500/5">
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
            {/* Dashboard de monitoring en temps réel */}
            <CalculationMonitoringDashboard />
            
            {/* Grille de cartes de traitement avancé */}
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
                  title="Détection d'Anomalies"
                  description="Analyse intelligente pour détecter les incohérences de données"
                  icon={<Brain className="w-5 h-5 text-purple-500" />}
                  status={calculationStates.anomalies || "idle"}
                  lastRun="Il y a 4h"
                  resultCount={12}
                  onExecute={() => {}}
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
              </div>

              <div className="space-y-6">
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
                
                {/* Historique des calculs */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <History className="w-5 h-5 text-slate-500" />
                      Historique Récent
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { type: "Moyennes", time: "14:32", status: "success", records: 2847 },
                        { type: "ECTS", time: "13:45", status: "success", records: 456 },
                        { type: "Lot", time: "12:15", status: "error", records: 0 },
                        { type: "Sync", time: "11:30", status: "success", records: 89 }
                      ].map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Badge 
                              variant={item.status === "success" ? "default" : "destructive"}
                              className={item.status === "success" ? "bg-green-100 text-green-800 border-green-200" : ""}
                            >
                              {item.status === "success" ? <CheckCircle className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                            </Badge>
                            <span className="font-medium">{item.type}</span>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium">{item.time}</div>
                            <div className="text-xs text-muted-foreground">
                              {item.records > 0 ? `${item.records} enreg.` : "Échec"}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="statistics" className="space-y-6">
            {/* Viewer de statistiques avancées */}
            <AdvancedStatisticsViewer />
            
            {/* Statistiques existantes améliorées */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CalculationStatsCard />
              <PerformanceStatsCard />
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