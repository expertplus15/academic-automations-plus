import React from 'react';
import { StudentsModuleLayout } from "@/components/layouts/StudentsModuleLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Plus, Settings } from "lucide-react";

export default function Groups() {
  return (
    <StudentsModuleLayout 
      title="Gestion des Groupes" 
      subtitle="Organisation et gestion des classes et groupes d'étudiants"
      showHeader={true}
    >
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Groupes et Classes</h2>
            <p className="text-muted-foreground">Gérez l'organisation des étudiants en groupes</p>
          </div>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nouveau Groupe
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Groupes</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">+2 depuis le mois dernier</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Étudiants Assignés</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">247</div>
              <p className="text-xs text-muted-foreground">92% des étudiants</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Capacité Totale</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">320</div>
              <p className="text-xs text-muted-foreground">77% d'occupation</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Liste des Groupes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">DUT2 GE - Groupe A</h3>
                  <p className="text-sm text-muted-foreground">25 étudiants • Génie Électrique</p>
                </div>
                <Button variant="outline" size="sm">Gérer</Button>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">DUT2 GE - Groupe B</h3>
                  <p className="text-sm text-muted-foreground">23 étudiants • Génie Électrique</p>
                </div>
                <Button variant="outline" size="sm">Gérer</Button>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">DUT1 GC - Groupe A</h3>
                  <p className="text-sm text-muted-foreground">30 étudiants • Génie Civil</p>
                </div>
                <Button variant="outline" size="sm">Gérer</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </StudentsModuleLayout>
  );
}