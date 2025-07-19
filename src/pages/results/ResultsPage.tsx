import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart } from "lucide-react";

export default function ResultsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Résultats et Évaluations</h1>
        <p className="text-muted-foreground">
          Gestion des notes et résultats étudiants
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart className="w-5 h-5" />
            Module Résultats
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Le module résultats sera implémenté dans Module 4.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}