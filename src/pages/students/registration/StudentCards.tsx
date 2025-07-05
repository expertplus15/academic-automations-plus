import React from 'react';
import { StudentsModuleLayout } from "@/components/layouts/StudentsModuleLayout";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  CreditCard, 
  Plus,
  Download,
  Printer,
  Settings,
  Users
} from 'lucide-react';

export default function StudentCards() {
  return (
    <StudentsModuleLayout 
      title="Cartes Étudiants"
      subtitle="Génération et gestion des cartes d'identité étudiantes"
    >
      <div className="p-6 space-y-6">
        {/* Statistics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <CreditCard className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Cartes Actives</p>
                  <p className="text-2xl font-bold">1,247</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">En Attente</p>
                  <p className="text-2xl font-bold">23</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Printer className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">À Imprimer</p>
                  <p className="text-2xl font-bold">15</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Download className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Expirées</p>
                  <p className="text-2xl font-bold">8</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-500" />
                Actions Rapides
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Générer Nouvelles Cartes
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Printer className="w-4 h-4 mr-2" />
                Impression en Lot
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Gérer Templates
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Activité Récente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">15 nouvelles cartes générées automatiquement</p>
                    <p className="text-xs text-muted-foreground">Suite aux approbations d'aujourd'hui</p>
                  </div>
                  <span className="text-xs text-muted-foreground">Il y a 2h</span>
                </div>

                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Lot d'impression de 50 cartes créé</p>
                    <p className="text-xs text-muted-foreground">Prêt pour l'impression</p>
                  </div>
                  <span className="text-xs text-muted-foreground">Hier 14h30</span>
                </div>

                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Template "Nouvelle Charte" mis à jour</p>
                    <p className="text-xs text-muted-foreground">Nouveau logo appliqué</p>
                  </div>
                  <span className="text-xs text-muted-foreground">2 jours</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Coming Soon Notice */}
        <Card className="border-dashed border-2 border-muted-foreground/20">
          <CardContent className="p-8 text-center">
            <CreditCard className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Module en Développement</h3>
            <p className="text-muted-foreground mb-4">
              Le système complet de gestion des cartes étudiants sera bientôt disponible.
            </p>
            <div className="flex flex-wrap justify-center gap-2 text-sm text-muted-foreground">
              <span className="px-2 py-1 bg-muted rounded">Génération automatique</span>
              <span className="px-2 py-1 bg-muted rounded">Templates personnalisables</span>
              <span className="px-2 py-1 bg-muted rounded">Codes QR</span>
              <span className="px-2 py-1 bg-muted rounded">Impression optimisée</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </StudentsModuleLayout>
  );
}