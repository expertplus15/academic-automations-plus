import React from 'react';
import { ModuleLayout } from '@/components/layouts/ModuleLayout';
import { FinanceModuleSidebar } from '@/components/FinanceModuleSidebar';
import { FinancePageHeader } from '@/components/FinancePageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Shield, Key, UserPlus } from 'lucide-react';

export default function Users() {
  const stats = [
    {
      label: "Utilisateurs Actifs",
      value: "12",
      change: "+2",
      changeType: "positive" as const
    },
    {
      label: "Administrateurs",
      value: "3",
      change: "Stable",
      changeType: "neutral" as const
    },
    {
      label: "Rôles Définis",
      value: "8",
      change: "+1",
      changeType: "positive" as const
    },
    {
      label: "Dernière Connexion",
      value: "5min",
      change: "Actif",
      changeType: "positive" as const
    }
  ];

  const users = [
    { name: "Marie Dupont", role: "Administrateur", status: "Actif", lastSeen: "En ligne" },
    { name: "Jean Martin", role: "Gestionnaire", status: "Actif", lastSeen: "2h" },
    { name: "Sophie Bernard", role: "Comptable", status: "Actif", lastSeen: "1j" },
    { name: "Pierre Durand", role: "Consultant", status: "Inactif", lastSeen: "5j" }
  ];

  return (
    <ModuleLayout sidebar={<FinanceModuleSidebar />}>
      <div className="p-8 space-y-8">
        <FinancePageHeader
          title="Gestion des Utilisateurs"
          subtitle="Droits & permissions du module Finance"
          stats={stats}
          showCreateButton={true}
          createButtonText="Nouvel Utilisateur"
          showExportButton={true}
          showBackButton={true}
          backPath="/finance"
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-500" />
                  Liste des Utilisateurs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map((user, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.role}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={user.status === 'Actif' ? 'default' : 'secondary'}>
                          {user.status}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{user.lastSeen}</span>
                        <Button size="sm" variant="outline">
                          Modifier
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-500" />
                  Rôles & Permissions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Shield className="w-4 h-4" />
                    Gestion des Rôles
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Key className="w-4 h-4" />
                    Permissions Avancées
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <UserPlus className="w-4 h-4" />
                    Inviter Utilisateur
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ModuleLayout>
  );
}