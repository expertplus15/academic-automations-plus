import React from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ExamsModuleSidebar } from "@/components/ExamsModuleSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Users } from "lucide-react";

export default function Planning() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <ExamsModuleSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-12 flex items-center border-b bg-card px-4">
            <SidebarTrigger />
            <div className="ml-4">
              <h1 className="text-lg font-semibold">Planification des Examens</h1>
            </div>
          </header>
          
          <main className="flex-1 p-6 space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Planning des Examens</h2>
                <p className="text-muted-foreground">Organisation et planification des sessions d'examen</p>
              </div>
              <Button>Nouveau Planning</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Examens Programmés</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">24</div>
                  <p className="text-xs text-muted-foreground">Ce semestre</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Salles Disponibles</CardTitle>
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground">Salles d'examen</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Surveillants Requis</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">35</div>
                  <p className="text-xs text-muted-foreground">Enseignants mobilisés</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Durée Moyenne</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2h</div>
                  <p className="text-xs text-muted-foreground">Par examen</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Prochains Examens</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h3 className="font-medium">Mathématiques - DUT2 GE</h3>
                        <p className="text-sm text-muted-foreground">Lundi 25 Nov • 8h-10h • Salle A101</p>
                      </div>
                      <Button variant="outline" size="sm">Détails</Button>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h3 className="font-medium">Électronique - DUT1 GE</h3>
                        <p className="text-sm text-muted-foreground">Mardi 26 Nov • 14h-16h • Salle B203</p>
                      </div>
                      <Button variant="outline" size="sm">Détails</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Conflits Détectés</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border border-destructive/20 rounded-lg bg-destructive/5">
                      <div>
                        <h3 className="font-medium text-destructive">Conflit de salle</h3>
                        <p className="text-sm text-muted-foreground">Salle A101 - 25 Nov 8h-10h</p>
                      </div>
                      <Button variant="outline" size="sm">Résoudre</Button>
                    </div>
                    <div className="flex items-center justify-between p-3 border border-orange-200 rounded-lg bg-orange-50">
                      <div>
                        <h3 className="font-medium text-orange-600">Surveillant indisponible</h3>
                        <p className="text-sm text-muted-foreground">Prof. Martin - 26 Nov 14h-16h</p>
                      </div>
                      <Button variant="outline" size="sm">Résoudre</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}