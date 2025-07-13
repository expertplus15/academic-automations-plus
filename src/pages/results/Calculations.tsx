import { ModuleLayout } from "@/components/layouts/ModuleLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calculator, TrendingUp, RefreshCw, Clock, CheckCircle, AlertTriangle } from "lucide-react";

export default function Calculations() {
  const calculations = [
    {
      name: "Moyennes semestrielles",
      progress: 85,
      status: "running",
      lastRun: "Il y a 15 min",
      totalStudents: 1247,
      processed: 1060
    },
    {
      name: "Calculs ECTS",
      progress: 100,
      status: "completed",
      lastRun: "Il y a 2h",
      totalStudents: 1247,
      processed: 1247
    },
    {
      name: "Classements par promotion",
      progress: 45,
      status: "running",
      lastRun: "Il y a 5 min",
      totalStudents: 1247,
      processed: 561
    },
    {
      name: "Mentions et félicitations",
      progress: 0,
      status: "pending",
      lastRun: "Jamais",
      totalStudents: 1247,
      processed: 0
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'running':
        return <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-amber-600" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'running':
        return 'outline';
      case 'pending':
        return 'secondary';
      default:
        return 'destructive';
    }
  };

  return (
    <ModuleLayout 
      title="Calculs Automatiques" 
      subtitle="Calculs automatisés des moyennes, ECTS et classements"
      showHeader={true}
    >
      <div className="p-6 space-y-6">
        {/* Vue d'ensemble */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <Calculator className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">4</p>
                  <p className="text-sm text-muted-foreground">Calculs actifs</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">2</p>
                  <p className="text-sm text-muted-foreground">Terminés</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
                  <RefreshCw className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">2</p>
                  <p className="text-sm text-muted-foreground">En cours</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">92%</p>
                  <p className="text-sm text-muted-foreground">Taux de réussite</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions rapides */}
        <Card>
          <CardHeader>
            <CardTitle>Actions rapides</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button>
                <Calculator className="w-4 h-4 mr-2" />
                Lancer tous les calculs
              </Button>
              <Button variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Recalculer les moyennes
              </Button>
              <Button variant="outline">
                <TrendingUp className="w-4 h-4 mr-2" />
                Générer classements
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Liste des calculs */}
        <Card>
          <CardHeader>
            <CardTitle>Calculs en cours et programmés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {calculations.map((calc, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(calc.status)}
                      <div>
                        <h4 className="font-medium">{calc.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {calc.processed}/{calc.totalStudents} étudiants traités • {calc.lastRun}
                        </p>
                      </div>
                    </div>
                    <Badge variant={getStatusColor(calc.status) as any}>
                      {calc.status === 'completed' && 'Terminé'}
                      {calc.status === 'running' && 'En cours'}
                      {calc.status === 'pending' && 'En attente'}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progression</span>
                      <span>{calc.progress}%</span>
                    </div>
                    <Progress value={calc.progress} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </ModuleLayout>
  );
}