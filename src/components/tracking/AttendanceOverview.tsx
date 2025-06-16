
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function AttendanceOverview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Vue d'ensemble de l'Assiduité</CardTitle>
        <CardDescription>
          Suivi des présences et absences
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 border rounded-lg">
            <div className="text-2xl font-bold text-green-600">94.2%</div>
            <div className="text-sm text-muted-foreground">Taux de présence</div>
          </div>
          <div className="text-center p-4 border rounded-lg">
            <div className="text-2xl font-bold text-orange-600">127</div>
            <div className="text-sm text-muted-foreground">Absences non justifiées</div>
          </div>
          <div className="text-center p-4 border rounded-lg">
            <div className="text-2xl font-bold text-blue-600">43</div>
            <div className="text-sm text-muted-foreground">Retards cette semaine</div>
          </div>
        </div>
        <div className="mt-6">
          <h4 className="font-medium mb-3">Étudiants avec absences répétées</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 border rounded">
              <span>Marie Dubois - L3 Info</span>
              <Badge variant="destructive">8 absences</Badge>
            </div>
            <div className="flex items-center justify-between p-2 border rounded">
              <span>Jean Martin - M1 Marketing</span>
              <Badge variant="destructive">6 absences</Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
