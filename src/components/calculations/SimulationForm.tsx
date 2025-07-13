import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, X, Calculator, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface HypotheticalGrade {
  subject_id: string;
  subject_name: string;
  grade: number;
  evaluation_type: string;
}

interface SimulationFormProps {
  studentId?: string;
  academicYearId: string;
  onSimulate: (grades: HypotheticalGrade[]) => void;
  onSave?: (name: string, grades: HypotheticalGrade[]) => void;
  isLoading?: boolean;
}

export function SimulationForm({
  studentId,
  academicYearId,
  onSimulate,
  onSave,
  isLoading = false
}: SimulationFormProps) {
  const [hypotheticalGrades, setHypotheticalGrades] = useState<HypotheticalGrade[]>([]);
  const [simulationName, setSimulationName] = useState("");
  const { toast } = useToast();

  const addGrade = () => {
    const newGrade: HypotheticalGrade = {
      subject_id: "",
      subject_name: "",
      grade: 0,
      evaluation_type: "exam"
    };
    setHypotheticalGrades([...hypotheticalGrades, newGrade]);
  };

  const removeGrade = (index: number) => {
    setHypotheticalGrades(hypotheticalGrades.filter((_, i) => i !== index));
  };

  const updateGrade = (index: number, field: keyof HypotheticalGrade, value: any) => {
    const updated = [...hypotheticalGrades];
    updated[index] = { ...updated[index], [field]: value };
    setHypotheticalGrades(updated);
  };

  const handleSimulate = () => {
    if (hypotheticalGrades.length === 0) {
      toast({
        title: "Aucune note ajoutée",
        description: "Veuillez ajouter au moins une note hypothétique",
        variant: "destructive"
      });
      return;
    }

    const validGrades = hypotheticalGrades.filter(g => g.subject_id && g.grade >= 0);
    if (validGrades.length === 0) {
      toast({
        title: "Notes invalides",
        description: "Veuillez sélectionner des matières et saisir des notes valides",
        variant: "destructive"
      });
      return;
    }

    onSimulate(validGrades);
  };

  const handleSave = () => {
    if (!simulationName.trim()) {
      toast({
        title: "Nom requis",
        description: "Veuillez saisir un nom pour la simulation",
        variant: "destructive"
      });
      return;
    }

    if (hypotheticalGrades.length === 0) {
      toast({
        title: "Aucune note ajoutée",
        description: "Veuillez ajouter au moins une note hypothétique",
        variant: "destructive"
      });
      return;
    }

    onSave?.(simulationName, hypotheticalGrades);
    setSimulationName("");
    setHypotheticalGrades([]);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-violet-500" />
          Simulation "What-If"
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="create" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="create">Créer Simulation</TabsTrigger>
            <TabsTrigger value="results">Résultats</TabsTrigger>
          </TabsList>
          
          <TabsContent value="create" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium">Notes Hypothétiques</Label>
                <Button
                  onClick={addGrade}
                  size="sm"
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Ajouter Note
                </Button>
              </div>

              {hypotheticalGrades.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Calculator className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Aucune note hypothétique ajoutée</p>
                  <p className="text-sm">Cliquez sur "Ajouter Note" pour commencer</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {hypotheticalGrades.map((grade, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 border border-border rounded-lg">
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-3">
                        <div>
                          <Label className="text-xs">Matière</Label>
                          <Select
                            value={grade.subject_id}
                            onValueChange={(value) => updateGrade(index, "subject_id", value)}
                          >
                            <SelectTrigger className="h-8">
                              <SelectValue placeholder="Choisir..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="math">Mathématiques</SelectItem>
                              <SelectItem value="physics">Physique</SelectItem>
                              <SelectItem value="chemistry">Chimie</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label className="text-xs">Type</Label>
                          <Select
                            value={grade.evaluation_type}
                            onValueChange={(value) => updateGrade(index, "evaluation_type", value)}
                          >
                            <SelectTrigger className="h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="exam">Examen</SelectItem>
                              <SelectItem value="cc">Contrôle Continu</SelectItem>
                              <SelectItem value="project">Projet</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label className="text-xs">Note /20</Label>
                          <Input
                            type="number"
                            min="0"
                            max="20"
                            step="0.5"
                            value={grade.grade}
                            onChange={(e) => updateGrade(index, "grade", parseFloat(e.target.value) || 0)}
                            className="h-8"
                          />
                        </div>
                        
                        <div className="flex items-end">
                          <Badge
                            variant={grade.grade >= 10 ? "default" : "destructive"}
                            className={`w-full justify-center ${grade.grade >= 10 ? "bg-green-100 text-green-800 border-green-200" : ""}`}
                          >
                            {grade.grade >= 10 ? "Validé" : "Non validé"}
                          </Badge>
                        </div>
                      </div>
                      
                      <Button
                        onClick={() => removeGrade(index)}
                        size="sm"
                        variant="ghost"
                        className="text-destructive hover:text-destructive"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border/50">
                <div className="flex-1">
                  <Label className="text-xs">Nom de la simulation (optionnel)</Label>
                  <Input
                    value={simulationName}
                    onChange={(e) => setSimulationName(e.target.value)}
                    placeholder="Ex: Simulation rattrapage..."
                    className="h-8"
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button
                    onClick={handleSimulate}
                    disabled={isLoading || hypotheticalGrades.length === 0}
                    className="flex items-center gap-2"
                  >
                    <TrendingUp className="w-4 h-4" />
                    Simuler
                  </Button>
                  
                  {onSave && (
                    <Button
                      onClick={handleSave}
                      variant="outline"
                      disabled={isLoading || hypotheticalGrades.length === 0}
                    >
                      Sauvegarder
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="results" className="space-y-4">
            <div className="text-center py-8 text-muted-foreground">
              <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Résultats de simulation</p>
              <p className="text-sm">Les résultats apparaîtront ici après simulation</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}