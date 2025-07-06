import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, Bot, RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react';
import { ExamCreationData } from '@/hooks/exams/useExamCreation';

interface SchedulingProps {
  data: ExamCreationData;
  onChange: (updates: Partial<ExamCreationData>) => void;
}

interface TimeSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  room: {
    id: string;
    name: string;
    capacity: number;
    type: string;
  };
  conflicts: string[];
  aiScore: number;
}

interface Supervisor {
  id: string;
  name: string;
  availability: 'available' | 'busy' | 'preferred';
  subjects: string[];
}

export function Scheduling({ data, onChange }: SchedulingProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedSupervisors, setSelectedSupervisors] = useState<string[]>([]);

  // Mock data - En production, ces données viendraient de l'API
  const suggestedSlots: TimeSlot[] = [
    {
      id: '1',
      date: '2024-01-15',
      startTime: '14:00',
      endTime: '16:00',
      room: { id: 'r1', name: 'Amphithéâtre A', capacity: 120, type: 'amphitheater' },
      conflicts: [],
      aiScore: 95
    },
    {
      id: '2',
      date: '2024-01-16',
      startTime: '10:00',
      endTime: '12:00',
      room: { id: 'r2', name: 'Salle 201', capacity: 50, type: 'classroom' },
      conflicts: ['Cours L3 Physique'],
      aiScore: 78
    },
    {
      id: '3',
      date: '2024-01-17',
      startTime: '08:00',
      endTime: '10:00',
      room: { id: 'r3', name: 'Salle Informatique B', capacity: 30, type: 'computer_lab' },
      conflicts: [],
      aiScore: 88
    }
  ];

  const availableSupervisors: Supervisor[] = [
    { id: 's1', name: 'Prof. Martin', availability: 'available', subjects: ['Mathématiques', 'Physique'] },
    { id: 's2', name: 'Dr. Dubois', availability: 'preferred', subjects: ['Mathématiques'] },
    { id: 's3', name: 'Prof. Moreau', availability: 'busy', subjects: ['Informatique'] },
  ];

  const generateSuggestions = async () => {
    setIsGenerating(true);
    // Simulation de génération IA
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsGenerating(false);
  };

  const handleSlotSelection = (slotId: string) => {
    setSelectedSlot(slotId);
    const slot = suggestedSlots.find(s => s.id === slotId);
    if (slot) {
      onChange({
        scheduledDate: slot.date,
        scheduledTime: slot.startTime,
        roomId: slot.room.id,
        roomName: slot.room.name
      });
    }
  };

  const toggleSupervisor = (supervisorId: string) => {
    const updated = selectedSupervisors.includes(supervisorId)
      ? selectedSupervisors.filter(id => id !== supervisorId)
      : [...selectedSupervisors, supervisorId];
    setSelectedSupervisors(updated);
    onChange({ selectedSupervisors: updated });
  };

  const getSlotStatusColor = (slot: TimeSlot) => {
    if (slot.conflicts.length > 0) return 'border-amber-200 bg-amber-50';
    if (slot.aiScore >= 90) return 'border-green-200 bg-green-50';
    return 'border-blue-200 bg-blue-50';
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available': return 'bg-green-100 text-green-700 border-green-200';
      case 'preferred': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'busy': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-violet-100 rounded-lg">
            <Calendar className="w-5 h-5 text-violet-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">Planification intelligente</h2>
            <p className="text-muted-foreground">Créneaux optimisés par IA et attribution des ressources</p>
          </div>
        </div>
        
        <Button
          onClick={generateSuggestions}
          disabled={isGenerating}
          className="bg-violet-600 hover:bg-violet-700"
        >
          <Bot className="w-4 h-4 mr-2" />
          {isGenerating ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Génération...
            </>
          ) : (
            'Regénérer suggestions'
          )}
        </Button>
      </div>

      {/* Créneaux suggérés */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Créneaux recommandés par l'IA
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {suggestedSlots.map((slot) => (
              <div
                key={slot.id}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedSlot === slot.id 
                    ? 'border-violet-300 bg-violet-50 ring-2 ring-violet-200' 
                    : getSlotStatusColor(slot)
                }`}
                onClick={() => handleSlotSelection(slot.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="font-semibold text-foreground">
                        {new Date(slot.date).toLocaleDateString('fr-FR', { 
                          weekday: 'short', 
                          day: 'numeric', 
                          month: 'short' 
                        })}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {slot.startTime} - {slot.endTime}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{slot.room.name}</div>
                        <div className="text-sm text-muted-foreground">
                          Capacité: {slot.room.capacity} places
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Score IA */}
                    <div className="text-center">
                      <div className="text-sm font-medium text-violet-600">
                        Score IA: {slot.aiScore}%
                      </div>
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-2 rounded-full mr-1 ${
                              i < Math.floor(slot.aiScore / 20) 
                                ? 'bg-violet-500' 
                                : 'bg-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Conflits */}
                    {slot.conflicts.length > 0 ? (
                      <div className="flex items-center gap-1">
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                        <Badge variant="outline" className="text-amber-700 border-amber-300">
                          {slot.conflicts.length} conflit(s)
                        </Badge>
                      </div>
                    ) : (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    )}
                  </div>
                </div>

                {/* Détails des conflits */}
                {slot.conflicts.length > 0 && (
                  <div className="mt-3 p-2 bg-amber-100 rounded-lg">
                    <div className="text-sm text-amber-700">
                      <strong>Conflits détectés:</strong>
                      <ul className="list-disc list-inside mt-1">
                        {slot.conflicts.map((conflict, index) => (
                          <li key={index}>{conflict}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Attribution des surveillants */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="w-4 h-4" />
            Attribution des surveillants
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {availableSupervisors.map((supervisor) => (
              <div
                key={supervisor.id}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  selectedSupervisors.includes(supervisor.id)
                    ? 'border-violet-300 bg-violet-50'
                    : 'border-border bg-background hover:bg-accent/50'
                }`}
                onClick={() => toggleSupervisor(supervisor.id)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-foreground">{supervisor.name}</div>
                    <div className="text-sm text-muted-foreground">
                      Spécialités: {supervisor.subjects.join(', ')}
                    </div>
                  </div>
                  
                  <Badge className={getAvailabilityColor(supervisor.availability)}>
                    {supervisor.availability === 'available' && '✅ Disponible'}
                    {supervisor.availability === 'preferred' && '⭐ Recommandé'}
                    {supervisor.availability === 'busy' && '⏳ Occupé'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="text-sm text-blue-700">
              <strong>Recommandation IA:</strong> Sélectionnez au moins {data.minSupervisors || 2} surveillants. 
              Les surveillants "Recommandés" ont une expertise dans la matière de l'examen.
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Récapitulatif de la planification */}
      {selectedSlot && (
        <Card className="bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-base text-green-800 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Planification confirmée
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-green-700 space-y-1">
              <p><strong>Date:</strong> {data.scheduledDate}</p>
              <p><strong>Horaire:</strong> {data.scheduledTime}</p>
              <p><strong>Salle:</strong> {data.roomName}</p>
              <p><strong>Surveillants:</strong> {selectedSupervisors.length} sélectionné(s)</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}