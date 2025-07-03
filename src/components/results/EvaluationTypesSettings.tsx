import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useEvaluationTypes, EvaluationType, EvaluationTypeInput } from '@/hooks/useEvaluationTypes';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Move,
  Save,
  Download,
  Upload,
  AlertTriangle,
  Check,
  X
} from 'lucide-react';
// DragDropContext will be added later

interface EvaluationTypesSettingsProps {
  onClose: () => void;
}

interface EvaluationTypeFormData {
  name: string;
  code: string;
  description: string;
  weight_percentage: number;
  is_active: boolean;
}

export function EvaluationTypesSettings({ onClose }: EvaluationTypesSettingsProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingType, setEditingType] = useState<EvaluationType | null>(null);
  const [formData, setFormData] = useState<EvaluationTypeFormData>({
    name: '',
    code: '',
    description: '',
    weight_percentage: 0,
    is_active: true
  });
  const [weightValidation, setWeightValidation] = useState<{ valid: boolean; total: number }>({
    valid: true,
    total: 0
  });

  const { toast } = useToast();
  const {
    evaluationTypes,
    loading,
    createEvaluationType,
    updateEvaluationType,
    deleteEvaluationType,
    fetchEvaluationTypes
  } = useEvaluationTypes();

  useEffect(() => {
    fetchEvaluationTypes(true); // Include inactive types in settings
  }, [fetchEvaluationTypes]);

  useEffect(() => {
    // Calculate total weight and validate
    const total = evaluationTypes
      .filter(type => type.is_active)
      .reduce((sum, type) => sum + type.weight_percentage, 0);
    setWeightValidation({
      valid: total === 100,
      total
    });
  }, [evaluationTypes]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.code.trim()) {
      toast({
        title: "Erreur",
        description: "Le nom et le code sont obligatoires",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingType) {
        await updateEvaluationType(editingType.id, formData);
      } else {
        await createEvaluationType(formData);
      }
      
      setIsAddDialogOpen(false);
      setEditingType(null);
      resetForm();
    } catch (error) {
      console.error('Error saving evaluation type:', error);
    }
  };

  const handleEdit = (type: EvaluationType) => {
    setEditingType(type);
    setFormData({
      name: type.name,
      code: type.code,
      description: type.description || '',
      weight_percentage: type.weight_percentage,
      is_active: type.is_active
    });
    setIsAddDialogOpen(true);
  };

  const handleDelete = async (typeId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce type d\'évaluation ?')) {
      await deleteEvaluationType(typeId);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      description: '',
      weight_percentage: 0,
      is_active: true
    });
  };

  const handleDialogClose = () => {
    setIsAddDialogOpen(false);
    setEditingType(null);
    resetForm();
  };

  return (
    <div className="space-y-6">
      {/* Header with validation status */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Paramètres des Types d'Évaluation</h2>
          <p className="text-muted-foreground">
            Gérez les types d'évaluation et leurs pondérations
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${
            weightValidation.valid 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {weightValidation.valid ? <Check className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
            <span className="text-sm font-medium">
              Total: {weightValidation.total}%
            </span>
          </div>
          <Button onClick={onClose} variant="outline">
            <X className="w-4 h-4 mr-2" />
            Fermer
          </Button>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2">
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un type
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingType ? 'Modifier le type d\'évaluation' : 'Nouveau type d\'évaluation'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nom *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="ex: Contrôle Continu"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="code">Code *</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="ex: CC"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="weight">Pondération (%)</Label>
                <Input
                  id="weight"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.weight_percentage}
                  onChange={(e) => setFormData({ ...formData, weight_percentage: Number(e.target.value) })}
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Description optionnelle..."
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label htmlFor="active">Actif</Label>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">
                  <Save className="w-4 h-4 mr-2" />
                  {editingType ? 'Mettre à jour' : 'Créer'}
                </Button>
                <Button type="button" variant="outline" onClick={handleDialogClose}>
                  Annuler
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        <Button variant="outline">
          <Upload className="w-4 h-4 mr-2" />
          Importer Excel
        </Button>
        
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Exporter
        </Button>
      </div>

      {/* Evaluation types list */}
      <Card>
        <CardHeader>
          <CardTitle>Types d'Évaluation Configurés</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Chargement...</div>
          ) : evaluationTypes.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Aucun type d'évaluation configuré
            </div>
          ) : (
            <div className="space-y-3">
              {evaluationTypes.map((type) => (
                <div
                  key={type.id}
                  className={`p-4 border rounded-lg ${
                    type.is_active ? 'bg-background' : 'bg-muted/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Move className="w-4 h-4 text-muted-foreground cursor-grab" />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{type.name}</h4>
                          <Badge variant="secondary">{type.code}</Badge>
                          {!type.is_active && (
                            <Badge variant="outline">Inactif</Badge>
                          )}
                        </div>
                        {type.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {type.description}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <div className="font-medium text-lg">
                          {type.weight_percentage}%
                        </div>
                      </div>
                      
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEdit(type)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(type.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Validation summary */}
      {!weightValidation.valid && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="w-5 h-5" />
              <div>
                <h4 className="font-medium">Attention: Pondération incorrecte</h4>
                <p className="text-sm">
                  La somme des pondérations doit égaler 100%. 
                  Actuellement: {weightValidation.total}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}