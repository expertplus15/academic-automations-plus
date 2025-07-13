import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Settings, 
  Save, 
  RotateCcw, 
  Info,
  Zap,
  Calculator,
  Shield
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ECTSConfig {
  minimum_grade: number;
  compensation_allowed: boolean;
  compensation_threshold: number;
  ects_credits: number;
}

interface GradeRules {
  passing_grade: number;
  excellence_threshold: number;
  cc_weight: number;
  exam_weight: number;
  allow_grade_improvement: boolean;
}

interface SystemSettings {
  auto_calculation: boolean;
  batch_size: number;
  timeout_seconds: number;
  notification_enabled: boolean;
}

export function ConfigurationPanel() {
  const [ectsConfig, setEctsConfig] = useState<ECTSConfig>({
    minimum_grade: 10,
    compensation_allowed: true,
    compensation_threshold: 8,
    ects_credits: 30
  });

  const [gradeRules, setGradeRules] = useState<GradeRules>({
    passing_grade: 10,
    excellence_threshold: 16,
    cc_weight: 40,
    exam_weight: 60,
    allow_grade_improvement: true
  });

  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    auto_calculation: true,
    batch_size: 100,
    timeout_seconds: 300,
    notification_enabled: true
  });

  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Configuration sauvegardée",
      description: "Les paramètres ont été mis à jour avec succès."
    });
  };

  const handleReset = () => {
    // Reset to default values
    setEctsConfig({
      minimum_grade: 10,
      compensation_allowed: true,
      compensation_threshold: 8,
      ects_credits: 30
    });
    setGradeRules({
      passing_grade: 10,
      excellence_threshold: 16,
      cc_weight: 40,
      exam_weight: 60,
      allow_grade_improvement: true
    });
    setSystemSettings({
      auto_calculation: true,
      batch_size: 100,
      timeout_seconds: 300,
      notification_enabled: true
    });
    
    toast({
      title: "Configuration réinitialisée",
      description: "Les paramètres par défaut ont été restaurés."
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-500" />
            Configuration du Système
          </CardTitle>
          <div className="flex gap-2">
            <Button
              onClick={handleReset}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Réinitialiser
            </Button>
            <Button
              onClick={handleSave}
              size="sm"
              className="flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Sauvegarder
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="ects" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="ects" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              ECTS
            </TabsTrigger>
            <TabsTrigger value="grades" className="flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              Notes
            </TabsTrigger>
            <TabsTrigger value="system" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Système
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="ects" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-muted-foreground">
                  Configuration des règles de validation des crédits ECTS
                </span>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="minimum_grade">Note minimale de validation</Label>
                    <Input
                      id="minimum_grade"
                      type="number"
                      min="0"
                      max="20"
                      step="0.5"
                      value={ectsConfig.minimum_grade}
                      onChange={(e) => setEctsConfig({
                        ...ectsConfig,
                        minimum_grade: parseFloat(e.target.value) || 0
                      })}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Note minimale requise pour valider les ECTS
                    </p>
                  </div>
                  
                  <div>
                    <Label htmlFor="ects_credits">Crédits ECTS par semestre</Label>
                    <Input
                      id="ects_credits"
                      type="number"
                      min="1"
                      max="60"
                      value={ectsConfig.ects_credits}
                      onChange={(e) => setEctsConfig({
                        ...ectsConfig,
                        ects_credits: parseInt(e.target.value) || 0
                      })}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Compensation autorisée</Label>
                      <p className="text-xs text-muted-foreground">
                        Permettre la compensation entre matières
                      </p>
                    </div>
                    <Switch
                      checked={ectsConfig.compensation_allowed}
                      onCheckedChange={(checked) => setEctsConfig({
                        ...ectsConfig,
                        compensation_allowed: checked
                      })}
                    />
                  </div>
                  
                  {ectsConfig.compensation_allowed && (
                    <div>
                      <Label htmlFor="compensation_threshold">Seuil de compensation</Label>
                      <Input
                        id="compensation_threshold"
                        type="number"
                        min="0"
                        max="20"
                        step="0.5"
                        value={ectsConfig.compensation_threshold}
                        onChange={(e) => setEctsConfig({
                          ...ectsConfig,
                          compensation_threshold: parseFloat(e.target.value) || 0
                        })}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Note minimale pour bénéficier de la compensation
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="grades" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-muted-foreground">
                  Configuration des règles de calcul des notes
                </span>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="passing_grade">Note de passage</Label>
                    <Input
                      id="passing_grade"
                      type="number"
                      min="0"
                      max="20"
                      step="0.5"
                      value={gradeRules.passing_grade}
                      onChange={(e) => setGradeRules({
                        ...gradeRules,
                        passing_grade: parseFloat(e.target.value) || 0
                      })}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="excellence_threshold">Seuil d'excellence</Label>
                    <Input
                      id="excellence_threshold"
                      type="number"
                      min="0"
                      max="20"
                      step="0.5"
                      value={gradeRules.excellence_threshold}
                      onChange={(e) => setGradeRules({
                        ...gradeRules,
                        excellence_threshold: parseFloat(e.target.value) || 0
                      })}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Amélioration de notes</Label>
                      <p className="text-xs text-muted-foreground">
                        Autoriser l'amélioration des notes
                      </p>
                    </div>
                    <Switch
                      checked={gradeRules.allow_grade_improvement}
                      onCheckedChange={(checked) => setGradeRules({
                        ...gradeRules,
                        allow_grade_improvement: checked
                      })}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-4 p-4 border border-border rounded-lg">
                    <Label className="text-sm font-medium">Pondération des évaluations</Label>
                    
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <Label htmlFor="cc_weight" className="text-xs">Contrôle Continu</Label>
                          <Badge variant="outline">{gradeRules.cc_weight}%</Badge>
                        </div>
                        <Input
                          id="cc_weight"
                          type="range"
                          min="0"
                          max="100"
                          value={gradeRules.cc_weight}
                          onChange={(e) => {
                            const ccWeight = parseInt(e.target.value);
                            setGradeRules({
                              ...gradeRules,
                              cc_weight: ccWeight,
                              exam_weight: 100 - ccWeight
                            });
                          }}
                          className="w-full"
                        />
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <Label htmlFor="exam_weight" className="text-xs">Examen Final</Label>
                          <Badge variant="outline">{gradeRules.exam_weight}%</Badge>
                        </div>
                        <Input
                          id="exam_weight"
                          type="range"
                          min="0"
                          max="100"
                          value={gradeRules.exam_weight}
                          onChange={(e) => {
                            const examWeight = parseInt(e.target.value);
                            setGradeRules({
                              ...gradeRules,
                              exam_weight: examWeight,
                              cc_weight: 100 - examWeight
                            });
                          }}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="system" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-muted-foreground">
                  Configuration des paramètres système
                </span>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Calcul automatique</Label>
                      <p className="text-xs text-muted-foreground">
                        Activer le recalcul automatique des moyennes
                      </p>
                    </div>
                    <Switch
                      checked={systemSettings.auto_calculation}
                      onCheckedChange={(checked) => setSystemSettings({
                        ...systemSettings,
                        auto_calculation: checked
                      })}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Notifications</Label>
                      <p className="text-xs text-muted-foreground">
                        Recevoir des notifications sur les calculs
                      </p>
                    </div>
                    <Switch
                      checked={systemSettings.notification_enabled}
                      onCheckedChange={(checked) => setSystemSettings({
                        ...systemSettings,
                        notification_enabled: checked
                      })}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="batch_size">Taille des lots</Label>
                    <Input
                      id="batch_size"
                      type="number"
                      min="10"
                      max="1000"
                      step="10"
                      value={systemSettings.batch_size}
                      onChange={(e) => setSystemSettings({
                        ...systemSettings,
                        batch_size: parseInt(e.target.value) || 100
                      })}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Nombre d'étudiants traités par lot
                    </p>
                  </div>
                  
                  <div>
                    <Label htmlFor="timeout_seconds">Timeout (secondes)</Label>
                    <Input
                      id="timeout_seconds"
                      type="number"
                      min="30"
                      max="600"
                      step="30"
                      value={systemSettings.timeout_seconds}
                      onChange={(e) => setSystemSettings({
                        ...systemSettings,
                        timeout_seconds: parseInt(e.target.value) || 300
                      })}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Délai d'expiration pour les opérations longues
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}