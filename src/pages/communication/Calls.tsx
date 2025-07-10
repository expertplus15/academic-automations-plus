import React from 'react';
import { CommunicationModuleLayout } from '@/components/layouts/CommunicationModuleLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Phone, PhoneMissed, PhoneCall, Video, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function Calls() {
  const headerActions = [
    {
      label: "Nouvel appel",
      icon: Phone,
      onClick: () => {},
      variant: 'default' as const
    },
    {
      label: "Visioconférence",
      icon: Video,
      onClick: () => {},
      variant: 'outline' as const
    }
  ];

  const recentCalls = [
    {
      id: 1,
      contact: "Marie Dupont",
      type: "incoming",
      duration: "12:34",
      time: "14:30",
      status: "completed"
    },
    {
      id: 2,
      contact: "Jean Martin",
      type: "outgoing", 
      duration: "05:12",
      time: "11:15",
      status: "missed"
    },
    {
      id: 3,
      contact: "Équipe Pédagogique",
      type: "conference",
      duration: "45:20",
      time: "09:00",
      status: "completed"
    }
  ];

  return (
    <ProtectedRoute allowedRoles={['admin', 'teacher', 'hr', 'student']}>
      <CommunicationModuleLayout 
        showHeader={true}
        title="Appels & Visioconférences"
        subtitle="Gérez vos communications vocales et vidéo"
        actions={headerActions}
      >
        <div className="p-6 space-y-6">
          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Phone className="w-5 h-5 text-primary" />
                  Appel rapide
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button className="w-full">
                  Démarrer un appel
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Video className="w-5 h-5 text-primary" />
                  Visioconférence
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Créer une réunion
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Conférence
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Rejoindre
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Recent Calls */}
          <Card>
            <CardHeader>
              <CardTitle>Appels récents</CardTitle>
              <CardDescription>
                Historique de vos dernières communications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentCalls.map((call) => (
                  <div key={call.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {call.type === 'incoming' && <PhoneCall className="w-4 h-4 text-green-500" />}
                      {call.type === 'outgoing' && <Phone className="w-4 h-4 text-blue-500" />}
                      {call.type === 'conference' && <Video className="w-4 h-4 text-purple-500" />}
                      {call.status === 'missed' && <PhoneMissed className="w-4 h-4 text-red-500" />}
                      
                      <div>
                        <p className="font-medium">{call.contact}</p>
                        <p className="text-sm text-muted-foreground">
                          {call.time} - {call.duration}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Phone className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Video className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Placeholder notice */}
          <Card className="border-dashed">
            <CardContent className="pt-6">
              <div className="text-center text-muted-foreground">
                <Phone className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">Fonctionnalité en développement</p>
                <p>L'intégration complète des appels et visioconférences sera disponible prochainement.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </CommunicationModuleLayout>
    </ProtectedRoute>
  );
}