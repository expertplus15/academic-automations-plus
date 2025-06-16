
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Brain, Zap, AlertTriangle, CheckCircle, Clock, Users } from 'lucide-react';
import { useScheduleGeneration, GenerationParameters } from '@/hooks/useScheduleGeneration';
import { usePrograms } from '@/hooks/useSupabase';
import { toast } from 'sonner';

export function SmartScheduleGenerator() {
  const { generations, conflicts, loading, generateSchedule, detectConflicts } = useScheduleGeneration();
  const { data: programs } = usePrograms();
  const [selectedProgram, setSelectedProgram] = useState<string>('');
  const [selectedAcademicYear] = useState<string>('2024-2025'); // À remplacer par une sélection dynamique
  const [generationInProgress, setGenerationInProgress] = useState(false);

  const handleGenerateSchedule = async () => {
    if (!selectedProgram) {
      toast.error('Veuillez sélectionner un programme');
      return;
    }

    setGenerationInProgress(true);
    const parameters: GenerationParameters = {
      max_daily_hours: 8,
      min_break_minutes: 15,
      preferred_start_time: '08:00',
      preferred_end_time: '18:00',
      respect_teacher_preferences: true,
      optimize_room_usage: true
    };

    const result = await generateSchedule(selectedProgram, selectedAcademicYear, parameters);
    
    if (result) {
      toast.success('Emploi du temps généré avec succès !');
      // Détecter les conflits après génération
      await detectConflicts(selectedAcademicYear);
    } else {
      toast.error('Erreur lors de la génération de l\'emploi du temps');
    }
    
    setGenerationInProgress(false);
  };

  const latestGeneration = generations[0];

  return (
    <div className="space-y-6">
      {/* En-tête avec contrôles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-600" />
            Générateur d'Emploi du Temps Intelligent
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Programme</label>
              <Select value={selectedProgram} onValueChange={setSelectedProgram}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un programme" />
                </SelectTrigger>
                <SelectContent>
                  {programs?.map((program: any) => (
                    <SelectItem key={program.id} value={program.id}>
                      {program.name} ({program.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Année Académique</label>
              <Select value={selectedAcademicYear} disabled>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button 
              onClick={handleGenerateSchedule} 
              disabled={!selectedProgram || generationInProgress || loading}
              className="flex items-center gap-2"
            >
              <Zap className="h-4 w-4" />
              {generationInProgress ? 'Génération...' : 'Générer l\'Emploi du Temps'}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => detectConflicts(selectedAcademicYear)}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <AlertTriangle className="h-4 w-4" />
              Détecter les Conflits
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* État de la dernière génération */}
      {latestGeneration && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Dernière Génération</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {latestGeneration.progress_percentage}%
                </div>
                <div className="text-sm text-muted-foreground">Progression</div>
                <Progress value={latestGeneration.progress_percentage} className="mt-2" />
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {latestGeneration.success_rate || 0}%
                </div>
                <div className="text-sm text-muted-foreground">Taux de Réussite</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {latestGeneration.conflicts_count}
                </div>
                <div className="text-sm text-muted-foreground">Conflits Détectés</div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Badge 
                variant={latestGeneration.status === 'completed' ? 'default' : 'secondary'}
                className="flex items-center gap-1"
              >
                {latestGeneration.status === 'completed' ? (
                  <CheckCircle className="h-3 w-3" />
                ) : (
                  <Clock className="h-3 w-3" />
                )}
                {latestGeneration.status === 'completed' ? 'Terminé' : 'En cours'}
              </Badge>
              
              <div className="text-sm text-muted-foreground">
                {latestGeneration.completed_at 
                  ? `Terminé le ${new Date(latestGeneration.completed_at).toLocaleString('fr-FR')}`
                  : `Démarré le ${new Date(latestGeneration.started_at || '').toLocaleString('fr-FR')}`
                }
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Alertes de conflits */}
      {conflicts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-600">
              <AlertTriangle className="h-5 w-5" />
              Conflits Détectés ({conflicts.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {conflicts.map((conflict, index) => (
              <Alert key={index} variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-1">
                    <div className="font-semibold">{conflict.description}</div>
                    <Badge variant="outline" className="text-xs">
                      {conflict.conflict_type} - {conflict.severity}
                    </Badge>
                  </div>
                </AlertDescription>
              </Alert>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Algorithme et fonctionnalités */}
      <Card>
        <CardHeader>
          <CardTitle>Fonctionnalités de l'Algorithme IA</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-semibold flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Anti-Conflits Automatique
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                <li>• Détection des chevauchements de salles</li>
                <li>• Vérification des disponibilités enseignants</li>
                <li>• Respect des contraintes horaires</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-600" />
                Optimisation Intelligente
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                <li>• Maximisation de l'utilisation des salles</li>
                <li>• Respect des préférences enseignants</li>
                <li>• Équilibrage de la charge de travail</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
