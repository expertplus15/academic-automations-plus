import { ModuleLayout } from "@/components/layouts/ModuleLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertTriangle, XCircle, Clock } from "lucide-react";

export default function Validation() {
  return (
    <ModuleLayout 
      title="Validation & Contrôle" 
      subtitle="Vérification automatique des données et workflow d'approbation"
      showHeader={true}
    >
      <div className="p-6 space-y-6">
        {/* Validation Status */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                Validées
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">847</div>
              <p className="text-xs text-muted-foreground">notes approuvées</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-500" />
                En attente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600">23</div>
              <p className="text-xs text-muted-foreground">en validation</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-orange-500" />
                Anomalies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">5</div>
              <p className="text-xs text-muted-foreground">à corriger</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <XCircle className="w-4 h-4 text-red-500" />
                Rejetées
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">2</div>
              <p className="text-xs text-muted-foreground">notes rejetées</p>
            </CardContent>
          </Card>
        </div>

        {/* Validation Rules */}
        <Card>
          <CardHeader>
            <CardTitle>Règles de Validation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Notes hors limites</p>
                  <p className="text-sm text-muted-foreground">Vérification des notes entre 0 et 20</p>
                </div>
                <Badge variant="default">Actif</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Cohérence temporelle</p>
                  <p className="text-sm text-muted-foreground">Dates d'évaluation valides</p>
                </div>
                <Badge variant="default">Actif</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Doublons</p>
                  <p className="text-sm text-muted-foreground">Détection des notes dupliquées</p>
                </div>
                <Badge variant="default">Actif</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pending Validations */}
        <Card>
          <CardHeader>
            <CardTitle>Validations en Attente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Toutes les validations sont à jour</h3>
              <p className="text-muted-foreground">
                Aucune validation en attente pour le moment.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </ModuleLayout>
  );
}