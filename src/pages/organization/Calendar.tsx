
import React from 'react';
import { ModuleLayout } from '@/components/layouts/ModuleLayout';
import { OrganizationModuleSidebar } from '@/components/OrganizationModuleSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, Plus, Filter } from 'lucide-react';

export default function Calendar() {
  return (
    <ModuleLayout 
      sidebar={OrganizationModuleSidebar}
      title="Calendrier"
      subtitle="Calendrier académique et événements"
    >
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Calendrier Académique</h1>
            <p className="text-muted-foreground">
              Gérez les événements, périodes et calendrier académique
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filtres
            </Button>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nouvel événement
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Événements à venir</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <div className="font-medium">Examens de fin de semestre</div>
                    <div className="text-sm text-muted-foreground">Dans 2 semaines</div>
                  </div>
                  <div className="border-l-4 border-green-500 pl-4">
                    <div className="font-medium">Vacances d'hiver</div>
                    <div className="text-sm text-muted-foreground">Dans 1 mois</div>
                  </div>
                  <div className="border-l-4 border-purple-500 pl-4">
                    <div className="font-medium">Rentrée S2</div>
                    <div className="text-sm text-muted-foreground">Dans 2 mois</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Vue calendrier</CardTitle>
                <CardDescription>
                  Calendrier interactif des événements académiques
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-16 text-muted-foreground">
                  <CalendarIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Interface de calendrier en développement</p>
                  <p className="text-sm mt-2">
                    Cette section affichera bientôt le calendrier interactif
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Périodes académiques</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Semestre 1</span>
                  <span className="text-green-600 font-medium">En cours</span>
                </div>
                <div className="flex justify-between">
                  <span>Examens S1</span>
                  <span className="text-blue-600 font-medium">À venir</span>
                </div>
                <div className="flex justify-between">
                  <span>Semestre 2</span>
                  <span className="text-muted-foreground">Planifié</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Jours fériés</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Noël</span>
                  <span className="text-sm text-muted-foreground">25 Déc</span>
                </div>
                <div className="flex justify-between">
                  <span>Nouvel An</span>
                  <span className="text-sm text-muted-foreground">1er Jan</span>
                </div>
                <div className="flex justify-between">
                  <span>Pâques</span>
                  <span className="text-sm text-muted-foreground">31 Mars</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions rapides</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button size="sm" className="w-full" variant="outline">
                  Planifier période d'examens
                </Button>
                <Button size="sm" className="w-full" variant="outline">
                  Ajouter jour férié
                </Button>
                <Button size="sm" className="w-full" variant="outline">
                  Paramètres calendrier
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ModuleLayout>
  );
}
