import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Settings, 
  Target,
  AlertCircle
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PromotionCriteria {
  id?: string;
  name: string;
  description: string;
  criteria_type: 'minimum_average' | 'attendance_rate' | 'ects_credits' | 'subject_validation' | 'custom';
  program_id?: string;
  level_id?: string;
  is_mandatory: boolean;
  threshold_value?: number;
  weight: number;
  is_active: boolean;
}

export function PromotionCriteriaManager() {
  const [isCreating, setIsCreating] = useState(false);
  const [editingCriteria, setEditingCriteria] = useState<PromotionCriteria | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: criteria, isLoading } = useQuery({
    queryKey: ['promotion-criteria'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('promotion_criteria')
        .select(`
          *,
          program:programs(name),
          level:academic_levels(name)
        `)
        .order('created_at', { ascending: false });
      
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

  const { data: levels } = useQuery({
    queryKey: ['academic-levels'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('academic_levels')
        .select('id, name')
        .order('name');
      
      if (error) throw error;
      return data;
    }
  });

  const createCriteriaMutation = useMutation({
    mutationFn: async (newCriteria: Omit<PromotionCriteria, 'id'>) => {
      const { data, error } = await supabase
        .from('promotion_criteria')
        .insert(newCriteria)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promotion-criteria'] });
      setIsCreating(false);
      toast({
        title: "Critère créé",
        description: "Le critère de promotion a été créé avec succès.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de créer le critère.",
        variant: "destructive",
      });
    }
  });

  const updateCriteriaMutation = useMutation({
    mutationFn: async ({ id, ...updates }: PromotionCriteria) => {
      const { data, error } = await supabase
        .from('promotion_criteria')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promotion-criteria'] });
      setEditingCriteria(null);
      toast({
        title: "Critère modifié",
        description: "Le critère de promotion a été modifié avec succès.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de modifier le critère.",
        variant: "destructive",
      });
    }
  });

  const deleteCriteriaMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('promotion_criteria')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promotion-criteria'] });
      toast({
        title: "Critère supprimé",
        description: "Le critère de promotion a été supprimé avec succès.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le critère.",
        variant: "destructive",
      });
    }
  });

  const CriteriaForm = ({ 
    criteria, 
    onSubmit, 
    onCancel 
  }: { 
    criteria?: PromotionCriteria; 
    onSubmit: (data: Omit<PromotionCriteria, 'id'>) => void;
    onCancel: () => void;
  }) => {
    const [formData, setFormData] = useState<Omit<PromotionCriteria, 'id'>>({
      name: criteria?.name || '',
      description: criteria?.description || '',
      criteria_type: criteria?.criteria_type || 'minimum_average',
      program_id: criteria?.program_id || undefined,
      level_id: criteria?.level_id || undefined,
      is_mandatory: criteria?.is_mandatory ?? true,
      threshold_value: criteria?.threshold_value || 10,
      weight: criteria?.weight || 1,
      is_active: criteria?.is_active ?? true
    });

    return (
      <Card>
        <CardHeader>
          <CardTitle>
            {criteria ? 'Modifier le Critère' : 'Nouveau Critère'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom du critère</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="ex: Moyenne minimale L1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="criteria_type">Type de critère</Label>
              <Select
                value={formData.criteria_type}
                onValueChange={(value: any) => setFormData({ ...formData, criteria_type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="minimum_average">Moyenne minimale</SelectItem>
                  <SelectItem value="attendance_rate">Taux de présence</SelectItem>
                  <SelectItem value="ects_credits">Crédits ECTS</SelectItem>
                  <SelectItem value="subject_validation">Validation matière</SelectItem>
                  <SelectItem value="custom">Personnalisé</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="program">Programme (optionnel)</Label>
              <Select
                value={formData.program_id || ''}
                onValueChange={(value) => setFormData({ ...formData, program_id: value || undefined })}
              >
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="level">Niveau (optionnel)</Label>
              <Select
                value={formData.level_id || ''}
                onValueChange={(value) => setFormData({ ...formData, level_id: value || undefined })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tous les niveaux" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tous les niveaux</SelectItem>
                  {levels?.map((level) => (
                    <SelectItem key={level.id} value={level.id}>
                      {level.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="threshold">Valeur seuil</Label>
              <Input
                id="threshold"
                type="number"
                step="0.01"
                value={formData.threshold_value || ''}
                onChange={(e) => setFormData({ ...formData, threshold_value: parseFloat(e.target.value) || undefined })}
                placeholder="10.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight">Pondération</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) || 1 })}
                placeholder="1.0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Description détaillée du critère..."
            />
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Switch
                checked={formData.is_mandatory}
                onCheckedChange={(checked) => setFormData({ ...formData, is_mandatory: checked })}
              />
              <Label>Critère obligatoire</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
              <Label>Actif</Label>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={() => onSubmit(formData)}>
              {criteria ? 'Modifier' : 'Créer'}
            </Button>
            <Button variant="outline" onClick={onCancel}>
              Annuler
            </Button>
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
          <h2 className="text-xl font-semibold">Gestion des Critères</h2>
          <p className="text-muted-foreground">
            Configurez les règles de promotion pour chaque niveau et programme
          </p>
        </div>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau Critère
        </Button>
      </div>

      {(isCreating || editingCriteria) && (
        <CriteriaForm
          criteria={editingCriteria || undefined}
          onSubmit={(data) => {
            if (editingCriteria) {
              updateCriteriaMutation.mutate({ ...data, id: editingCriteria.id! });
            } else {
              createCriteriaMutation.mutate(data);
            }
          }}
          onCancel={() => {
            setIsCreating(false);
            setEditingCriteria(null);
          }}
        />
      )}

      <div className="grid gap-4">
        {criteria?.map((criterion) => (
          <Card key={criterion.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-violet-500" />
                    {criterion.name}
                    {criterion.is_mandatory && (
                      <Badge variant="destructive">Obligatoire</Badge>
                    )}
                    {!criterion.is_active && (
                      <Badge variant="secondary">Inactif</Badge>
                    )}
                  </CardTitle>
                  <CardDescription>
                    {criterion.description}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingCriteria(criterion as PromotionCriteria)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteCriteriaMutation.mutate(criterion.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="font-medium">Type</p>
                  <p className="text-muted-foreground capitalize">
                    {criterion.criteria_type.replace('_', ' ')}
                  </p>
                </div>
                <div>
                  <p className="font-medium">Seuil</p>
                  <p className="text-muted-foreground">
                    {criterion.threshold_value || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="font-medium">Pondération</p>
                  <p className="text-muted-foreground">{criterion.weight}</p>
                </div>
                <div>
                  <p className="font-medium">Scope</p>
                  <p className="text-muted-foreground">
                    {criterion.program?.name || 'Tous programmes'} - {criterion.level?.name || 'Tous niveaux'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {(!criteria || criteria.length === 0) && (
          <Card>
            <CardContent className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Aucun critère de promotion configuré
              </p>
              <Button className="mt-4" onClick={() => setIsCreating(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Créer le premier critère
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}