import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Settings, Clock, Users, FileText, AlertTriangle, UserCheck } from 'lucide-react';
import { ExamCreationData } from '@/hooks/exams/useExamCreation';

interface ConfigurationProps {
  data: ExamCreationData;
  onChange: (updates: Partial<ExamCreationData>) => void;
}

export function Configuration({ data, onChange }: ConfigurationProps) {
  const materialOptions = [
    { id: 'calculator', label: 'Calculatrice', selected: data.materials?.includes('calculator') },
    { id: 'dictionary', label: 'Dictionnaire', selected: data.materials?.includes('dictionary') },
    { id: 'computer', label: 'Ordinateur', selected: data.materials?.includes('computer') },
    { id: 'books', label: 'Livres autorisés', selected: data.materials?.includes('books') },
    { id: 'notes', label: 'Notes personnelles', selected: data.materials?.includes('notes') },
  ];

  const toggleMaterial = (materialId: string) => {
    const currentMaterials = data.materials || [];
    const updated = currentMaterials.includes(materialId)
      ? currentMaterials.filter(m => m !== materialId)
      : [...currentMaterials, materialId];
    onChange({ materials: updated });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-violet-100 rounded-lg">
          <Settings className="w-5 h-5 text-violet-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">Configuration détaillée</h2>
          <p className="text-muted-foreground">Paramètres techniques et organisationnels de l'examen</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Durée */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-violet-500" />
            <h3 className="font-medium">Durée de l'examen</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={data.durationMinutes || ''}
                onChange={(e) => onChange({ durationMinutes: parseInt(e.target.value) })}
                placeholder="120"
                className="w-20"
                min="30"
                max="300"
              />
              <span className="text-sm text-muted-foreground">minutes</span>
            </div>
            <div className="text-xs text-muted-foreground">
              Durée recommandée : {data.examType === 'oral' ? '30-60 min' : '90-180 min'}
            </div>
          </div>
        </Card>

        {/* Nombre d'étudiants */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-4 h-4 text-violet-500" />
            <h3 className="font-medium">Nombre d'étudiants</h3>
          </div>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs">Minimum</Label>
                <Input
                  type="number"
                  value={data.minStudents || ''}
                  onChange={(e) => onChange({ minStudents: parseInt(e.target.value) })}
                  placeholder="1"
                  min="1"
                />
              </div>
              <div>
                <Label className="text-xs">Maximum</Label>
                <Input
                  type="number"
                  value={data.maxStudents || ''}
                  onChange={(e) => onChange({ maxStudents: parseInt(e.target.value) })}
                  placeholder="50"
                  min="1"
                />
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              Inscrits actuels : {data.registeredStudents || 0}
            </div>
          </div>
        </Card>

        {/* Nombre de surveillants */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <UserCheck className="w-4 h-4 text-violet-500" />
            <h3 className="font-medium">Surveillants requis</h3>
          </div>
          <div className="space-y-3">
            <Input
              type="number"
              value={data.minSupervisors || ''}
              onChange={(e) => onChange({ minSupervisors: parseInt(e.target.value) })}
              placeholder="2"
              min="1"
              max="5"
            />
            <div className="text-xs text-muted-foreground">
              Recommandé : 1 surveillant pour {Math.ceil((data.maxStudents || 30) / 15)} étudiants
            </div>
          </div>
        </Card>

        {/* Coefficient */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-4 h-4 text-violet-500" />
            <h3 className="font-medium">Coefficient</h3>
          </div>
          <div className="space-y-3">
            <Input
              type="number"
              step="0.5"
              value={data.coefficient || ''}
              onChange={(e) => onChange({ coefficient: parseFloat(e.target.value) })}
              placeholder="1.0"
              min="0.5"
              max="5.0"
            />
            <div className="text-xs text-muted-foreground">
              Impact sur la note finale de la matière
            </div>
          </div>
        </Card>
      </div>

      {/* Matériel autorisé */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Matériel autorisé</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {materialOptions.map((material) => (
              <Badge
                key={material.id}
                variant={material.selected ? "default" : "outline"}
                className={`cursor-pointer transition-colors ${
                  material.selected 
                    ? 'bg-violet-500 hover:bg-violet-600' 
                    : 'hover:bg-violet-50'
                }`}
                onClick={() => toggleMaterial(material.id)}
              >
                {material.label}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Instructions spéciales */}
      <div className="space-y-2">
        <Label htmlFor="instructions">Instructions spéciales</Label>
        <Textarea
          id="instructions"
          value={data.instructions || ''}
          onChange={(e) => onChange({ instructions: e.target.value })}
          placeholder="Instructions particulières pour les étudiants et surveillants..."
          rows={3}
          className="resize-none"
        />
      </div>

      {/* Options avancées */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Options avancées</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Rattrapage autorisé</Label>
              <p className="text-xs text-muted-foreground">Permettre un examen de rattrapage</p>
            </div>
            <Switch
              checked={data.allowMakeup || false}
              onCheckedChange={(checked) => onChange({ allowMakeup: checked })}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Documents numériques</Label>
              <p className="text-xs text-muted-foreground">Autoriser l'accès à des documents en ligne</p>
            </div>
            <Switch
              checked={data.allowDigitalDocuments || false}
              onCheckedChange={(checked) => onChange({ allowDigitalDocuments: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Anonymat des copies</Label>
              <p className="text-xs text-muted-foreground">Correction à l'aveugle</p>
            </div>
            <Switch
              checked={data.anonymousGrading || false}
              onCheckedChange={(checked) => onChange({ anonymousGrading: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Validation en temps réel */}
      {(data.durationMinutes && data.durationMinutes > 240) && (
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5" />
              <div className="text-sm text-amber-700">
                <p className="font-medium">Durée inhabituellement longue</p>
                <p>Les examens de plus de 4h nécessitent une pause obligatoire et des surveillants supplémentaires.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}