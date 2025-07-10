import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Clock, Pill, Calendar, AlertTriangle } from 'lucide-react';

export function MedicationTracker() {
  const medications = [
    {
      id: 1,
      name: 'Paracétamol',
      dosage: '500mg',
      frequency: '3 fois par jour',
      duration: '7 jours',
      startDate: '2024-01-10',
      endDate: '2024-01-17',
      nextDose: '2024-01-16 14:00',
      taken: 15,
      total: 21,
      status: 'active'
    },
    {
      id: 2,
      name: 'Vitamines D3',
      dosage: '1000 UI',
      frequency: '1 fois par jour',
      duration: 'Cure de 3 mois',
      startDate: '2024-01-01',
      endDate: '2024-04-01',
      nextDose: '2024-01-16 08:00',
      taken: 45,
      total: 90,
      status: 'active'
    }
  ];

  return (
    <div className="space-y-6">
      {medications.map((med) => (
        <Card key={med.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Pill className="w-5 h-5" />
                  {med.name}
                </CardTitle>
                <CardDescription>{med.dosage} - {med.frequency}</CardDescription>
              </div>
              <Badge className="bg-green-100 text-green-800">Actif</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span>Début: {new Date(med.startDate).toLocaleDateString('fr-FR')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span>Prochaine prise: {new Date(med.nextDose).toLocaleString('fr-FR')}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progression du traitement</span>
                <span>{med.taken}/{med.total} prises</span>
              </div>
              <Progress value={(med.taken / med.total) * 100} />
            </div>
            <div className="flex gap-2">
              <Button size="sm">Marquer comme pris</Button>
              <Button variant="outline" size="sm">Rappeler plus tard</Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}