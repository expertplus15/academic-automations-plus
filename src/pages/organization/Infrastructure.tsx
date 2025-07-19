
import React from 'react';
import { ModuleLayout } from '@/components/layouts/ModuleLayout';
import { OrganizationModuleSidebar } from '@/components/OrganizationModuleSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, MapPin, Plus, Settings } from 'lucide-react';

export default function Infrastructure() {
  return (
    <ModuleLayout 
      sidebar={<OrganizationModuleSidebar />}
      title="Infrastructure"
      subtitle="Gestion des bâtiments et salles"
    >
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Gestion de l'Infrastructure</h1>
            <p className="text-muted-foreground">
              Gérez vos bâtiments, salles et espaces pédagogiques
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              Paramètres
            </Button>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle salle
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Bâtiments
              </CardTitle>
              <CardDescription>Gérer les bâtiments de l'établissement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">3</div>
                  <div className="text-sm text-muted-foreground">Bâtiments actifs</div>
                </div>
                <Button className="w-full" variant="outline">
                  Gérer les bâtiments
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Salles de cours
              </CardTitle>
              <CardDescription>Gestion des salles et amphithéâtres</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">45</div>
                  <div className="text-sm text-muted-foreground">Salles disponibles</div>
                </div>
                <Button className="w-full" variant="outline">
                  Gérer les salles
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Équipements
              </CardTitle>
              <CardDescription>Matériel et équipements techniques</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">120</div>
                  <div className="text-sm text-muted-foreground">Équipements gérés</div>
                </div>
                <Button className="w-full" variant="outline">
                  Gérer les équipements
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Vue d'ensemble des espaces</CardTitle>
            <CardDescription>
              Aperçu de l'utilisation des espaces de l'établissement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-muted-foreground">
              <Building2 className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Interface de gestion des espaces en développement</p>
              <p className="text-sm mt-2">
                Cette section affichera bientôt la vue d'ensemble de vos espaces
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </ModuleLayout>
  );
}
