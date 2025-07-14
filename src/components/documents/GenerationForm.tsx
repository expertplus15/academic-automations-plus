import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { FileText, Users, Download, Settings, Play, Eye, X } from "lucide-react";
import { usePrograms } from "@/hooks/usePrograms";
import { useStudents } from "@/hooks/useStudents";
import { useDocuments } from "@/hooks/useDocuments";
import { useToast } from "@/hooks/use-toast";

interface GenerationFormProps {
  type: "bulletin" | "transcript" | "certificate" | "attestation" | "batch";
  templateId?: string;
  onGenerate?: (config: any) => void;
  onCancel?: () => void;
}

export function GenerationForm({ type, templateId, onGenerate, onCancel }: GenerationFormProps) {
  const { programs, loading: programsLoading } = usePrograms();
  const { students, loading: studentsLoading } = useStudents();
  const { templates, previewDocument } = useDocuments();
  const { toast } = useToast();
  
  const [config, setConfig] = useState({
    template: templateId || "",
    academicYear: "",
    semester: "",
    program: "",
    student_id: "", // Étudiant spécifique pour génération unique
    students: [], // Liste d'étudiants pour génération par lot
    includeGrades: true,
    includeAttendance: false,
    includeComments: true,
    format: "pdf",
    language: "fr"
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [preview, setPreview] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const handleGenerate = async () => {
    if (!config.template) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un template",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    // Simulation du processus de génération
    for (let i = 0; i <= 100; i += 10) {
      setProgress(i);
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    setIsGenerating(false);
    onGenerate?.(config);
  };

  const handlePreview = async () => {
    if (!config.template) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un template",
        variant: "destructive"
      });
      return;
    }

    try {
      const previewData = await previewDocument(
        config.template,
        config.student_id === "none" ? undefined : config.student_id,
        config
      );
      
      setPreview(previewData.html);
      setShowPreview(true);
    } catch (error) {
      console.error('Preview error:', error);
      toast({
        title: "Erreur d'aperçu",
        description: "Impossible de générer l'aperçu",
        variant: "destructive"
      });
    }
  };

  if (isGenerating) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5 text-primary" />
            Génération en cours...
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-muted-foreground">
            Traitement des données et génération du document ({progress}%)
          </p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsGenerating(false)}>
              Annuler
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Configuration de Génération
            <Badge variant="outline">
              {type === "bulletin" && "Bulletin"}
              {type === "transcript" && "Relevé"}
              {type === "certificate" && "Certificat"}
              {type === "attestation" && "Attestation"}
              {type === "batch" && "Lot"}
            </Badge>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
        {/* Sélection du template */}
        <div className="space-y-2">
          <Label htmlFor="template">Template</Label>
          <Select value={config.template} onValueChange={(value) => 
            setConfig(prev => ({ ...prev, template: value }))
          }>
            <SelectTrigger>
              <SelectValue placeholder="Choisir un template" />
            </SelectTrigger>
            <SelectContent>
              {templates.filter(t => t.type === type).map((template) => (
                <SelectItem key={template.id} value={template.id}>
                  {template.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Période académique */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="year">Année Académique</Label>
            <Select value={config.academicYear} onValueChange={(value) => 
              setConfig(prev => ({ ...prev, academicYear: value }))
            }>
              <SelectTrigger>
                <SelectValue placeholder="Année" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2023-2024">2023-2024</SelectItem>
                <SelectItem value="2024-2025">2024-2025</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="semester">Semestre</Label>
            <Select value={config.semester} onValueChange={(value) => 
              setConfig(prev => ({ ...prev, semester: value }))
            }>
              <SelectTrigger>
                <SelectValue placeholder="Semestre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Semestre 1</SelectItem>
                <SelectItem value="2">Semestre 2</SelectItem>
                <SelectItem value="all">Toute l'année</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Programme/Classe */}
        <div className="space-y-2">
          <Label htmlFor="program">Programme/Classe</Label>
          <Select value={config.program} onValueChange={(value) => 
            setConfig(prev => ({ ...prev, program: value }))
          }>
            <SelectTrigger>
              <SelectValue placeholder={programsLoading ? "Chargement..." : "Sélectionner un programme"} />
            </SelectTrigger>
            <SelectContent>
              {programs.map((program) => (
                <SelectItem key={program.id} value={program.id}>
                  {program.name} {program.code && `(${program.code})`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sélection d'étudiant (pour génération unique) */}
        {type !== "batch" && (
          <div className="space-y-2">
            <Label htmlFor="student">Étudiant (optionnel)</Label>
            <Select value={config.student_id} onValueChange={(value) => 
              setConfig(prev => ({ ...prev, student_id: value }))
            }>
              <SelectTrigger>
                <SelectValue placeholder={studentsLoading ? "Chargement..." : "Sélectionner un étudiant"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Aucun étudiant spécifique</SelectItem>
                {students.map((student) => (
                  <SelectItem key={student.id} value={student.id}>
                    {student.profile?.full_name || student.student_number}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Options d'inclusion */}
        <div className="space-y-4">
          <Label className="text-base font-medium">Contenu à inclure</Label>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="grades" 
                checked={config.includeGrades}
                onCheckedChange={(checked) => 
                  setConfig(prev => ({ ...prev, includeGrades: !!checked }))
                }
              />
              <Label htmlFor="grades" className="text-sm">Notes et moyennes</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="attendance" 
                checked={config.includeAttendance}
                onCheckedChange={(checked) => 
                  setConfig(prev => ({ ...prev, includeAttendance: !!checked }))
                }
              />
              <Label htmlFor="attendance" className="text-sm">Assiduité</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="comments" 
                checked={config.includeComments}
                onCheckedChange={(checked) => 
                  setConfig(prev => ({ ...prev, includeComments: !!checked }))
                }
              />
              <Label htmlFor="comments" className="text-sm">Commentaires</Label>
            </div>
          </div>
        </div>

        {/* Format de sortie */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="format">Format</Label>
            <Select value={config.format} onValueChange={(value) => 
              setConfig(prev => ({ ...prev, format: value }))
            }>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="docx">Word</SelectItem>
                <SelectItem value="xlsx">Excel</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="language">Langue</Label>
            <Select value={config.language} onValueChange={(value) => 
              setConfig(prev => ({ ...prev, language: value }))
            }>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="en">Anglais</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button onClick={handleGenerate} className="flex-1" disabled={!config.template}>
            <Download className="h-4 w-4 mr-2" />
            Générer le Document
          </Button>
          
          <Button variant="secondary" onClick={handlePreview} disabled={!config.template}>
            <Eye className="h-4 w-4 mr-2" />
            Aperçu
          </Button>
          
          <Button variant="outline" onClick={onCancel}>
            Annuler
          </Button>
        </div>
        </CardContent>
      </Card>

      {/* Preview Dialog */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg p-6 max-w-4xl max-h-[80vh] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Aperçu du document</h3>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowPreview(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="bg-white p-6 rounded border min-h-[400px]">
              <pre className="whitespace-pre-wrap text-sm text-black">{preview}</pre>
            </div>
          </div>
        </div>
      )}
    </>
  );
}