import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Clock, User, MapPin } from 'lucide-react';

interface IncidentFormProps {
  onSubmit: (incident: any) => void;
  onCancel: () => void;
}

export function IncidentForm({ onSubmit, onCancel }: IncidentFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    severity: 'medium',
    type: 'student_behavior',
    room: '',
    exam_session: '',
    reporter: '',
    student_involved: '',
    witnesses: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      id: `INC-${Date.now()}`,
      status: 'open',
      created_at: new Date().toISOString(),
      resolved_at: null
    });
  };

  const incidentTypes = [
    { value: 'student_behavior', label: 'Comportement étudiant' },
    { value: 'cheating', label: 'Tricherie' },
    { value: 'technical_issue', label: 'Problème technique' },
    { value: 'medical_emergency', label: 'Urgence médicale' },
    { value: 'security_breach', label: 'Problème de sécurité' },
    { value: 'other', label: 'Autre' }
  ];

  const severityLevels = [
    { value: 'low', label: 'Faible', color: 'bg-green-100 text-green-700' },
    { value: 'medium', label: 'Moyen', color: 'bg-yellow-100 text-yellow-700' },
    { value: 'high', label: 'Élevé', color: 'bg-orange-100 text-orange-700' },
    { value: 'critical', label: 'Critique', color: 'bg-red-100 text-red-700' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-orange-500" />
          Déclarer un Incident
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Titre de l'incident</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData(prev => ({...prev, title: e.target.value}))}
                placeholder="Résumé de l'incident..."
                required
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Type d'incident</label>
              <Select 
                value={formData.type} 
                onValueChange={(value) => setFormData(prev => ({...prev, type: value}))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {incidentTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Niveau de gravité</label>
              <Select 
                value={formData.severity} 
                onValueChange={(value) => setFormData(prev => ({...prev, severity: value}))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {severityLevels.map(level => (
                    <SelectItem key={level.value} value={level.value}>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${level.color.split(' ')[0]}`} />
                        {level.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Salle/Lieu</label>
              <Input
                value={formData.room}
                onChange={(e) => setFormData(prev => ({...prev, room: e.target.value}))}
                placeholder="Ex: Amphi A, Salle 205..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Rapporteur</label>
              <Input
                value={formData.reporter}
                onChange={(e) => setFormData(prev => ({...prev, reporter: e.target.value}))}
                placeholder="Nom du surveillant/responsable"
                required
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Étudiant impliqué (optionnel)</label>
              <Input
                value={formData.student_involved}
                onChange={(e) => setFormData(prev => ({...prev, student_involved: e.target.value}))}
                placeholder="Nom ou numéro étudiant"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Description détaillée</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}
              placeholder="Décrivez l'incident en détail : contexte, actions, conséquences..."
              rows={4}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Témoins (optionnel)</label>
            <Textarea
              value={formData.witnesses}
              onChange={(e) => setFormData(prev => ({...prev, witnesses: e.target.value}))}
              placeholder="Noms des témoins présents..."
              rows={2}
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onCancel}>
              Annuler
            </Button>
            <Button type="submit" className="bg-red-600 hover:bg-red-700">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Déclarer l'Incident
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}