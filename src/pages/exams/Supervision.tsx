import React from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ExamsModuleSidebar } from "@/components/ExamsModuleSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Clock, CheckCircle, AlertTriangle } from "lucide-react";

export default function Supervision() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <ExamsModuleSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-12 flex items-center border-b bg-card px-4">
            <SidebarTrigger />
            <div className="ml-4">
              <h1 className="text-lg font-semibold">Supervision des Examens</h1>
            </div>
          </header>
          
          <main className="flex-1 p-6 space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Gestion de la Surveillance</h2>
                <p className="text-muted-foreground">Attribution et gestion des surveillants d'examens</p>
              </div>
              <Button>Assigner Surveillant</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Surveillants Actifs</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">18</div>
                  <p className="text-xs text-muted-foreground">En service aujourd'hui</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Sessions en Cours</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">6</div>
                  <p className="text-xs text-muted-foreground">Examens actuels</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Taux de Couverture</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">95%</div>
                  <p className="text-xs text-muted-foreground">Surveillance assurée</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Alertes</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2</div>
                  <p className="text-xs text-muted-foreground">Situations à résoudre</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Sessions Actuelles</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h3 className="font-medium">Mathématiques - Salle A101</h3>
                        <p className="text-sm text-muted-foreground">8h-10h • Prof. Dupont, Prof. Martin</p>
                      </div>
                      <Badge variant="outline" className="text-green-600 border-green-200">
                        En cours
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h3 className="font-medium">Physique - Salle B203</h3>
                        <p className="text-sm text-muted-foreground">10h-12h • Prof. Bernard</p>
                      </div>
                      <Badge variant="outline" className="text-blue-600 border-blue-200">
                        Préparation
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Disponibilité des Surveillants</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h3 className="font-medium">Prof. Laurent</h3>
                        <p className="text-sm text-muted-foreground">Disponible • 3 surveillances cette semaine</p>
                      </div>
                      <Badge variant="outline" className="text-green-600 border-green-200">
                        Libre
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h3 className="font-medium">Prof. Moreau</h3>
                        <p className="text-sm text-muted-foreground">En surveillance • Salle C301</p>
                      </div>
                      <Badge variant="outline" className="text-orange-600 border-orange-200">
                        Occupé
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Planning de Surveillance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="grid grid-cols-5 gap-4 p-3 border rounded-lg bg-muted/50">
                    <div className="font-medium">Horaire</div>
                    <div className="font-medium">Examen</div>
                    <div className="font-medium">Salle</div>
                    <div className="font-medium">Surveillants</div>
                    <div className="font-medium">Actions</div>
                  </div>
                  <div className="grid grid-cols-5 gap-4 p-3 border rounded-lg">
                    <div>14h-16h</div>
                    <div>Électronique</div>
                    <div>A101</div>
                    <div>Prof. Martin, Prof. Durand</div>
                    <Button variant="outline" size="sm">Modifier</Button>
                  </div>
                  <div className="grid grid-cols-5 gap-4 p-3 border rounded-lg">
                    <div>16h-18h</div>
                    <div>Informatique</div>
                    <div>B203</div>
                    <div className="text-destructive">Non assigné</div>
                    <Button variant="outline" size="sm">Assigner</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}