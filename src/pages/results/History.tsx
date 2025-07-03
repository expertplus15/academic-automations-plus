import { ModuleLayout } from "@/components/layouts/ModuleLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, FileText, Download, Eye, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function History() {
  return (
    <ModuleLayout 
      title="Historique & Audit" 
      subtitle="Traçabilité complète des opérations et audit des modifications"
      showHeader={true}
    >
      <div className="p-6 space-y-6">
        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Recherche & Filtres
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Input placeholder="Rechercher..." />
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Type d'opération
              </Button>
              <Button variant="outline">
                <Clock className="w-4 h-4 mr-2" />
                Période
              </Button>
              <Button variant="outline">
                Utilisateur
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Activity Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Opérations Aujourd'hui
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">247</div>
              <p className="text-xs text-muted-foreground">+12% vs hier</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Documents Générés
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">89</div>
              <p className="text-xs text-muted-foreground">bulletins et relevés</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Modifications Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600">23</div>
              <p className="text-xs text-muted-foreground">corrections validées</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Utilisateurs Actifs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">15</div>
              <p className="text-xs text-muted-foreground">connectés aujourd'hui</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Operations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Opérations Récentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">Génération bulletins Master 1</p>
                    <p className="text-sm text-muted-foreground">Par Admin • il y a 5 min</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="default">Terminé</Badge>
                  <Button size="sm" variant="outline">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">Modification note - Marie Dupont</p>
                    <p className="text-sm text-muted-foreground">Par Prof. Martin • il y a 12 min</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Validé</Badge>
                  <Button size="sm" variant="outline">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">Import notes Economics L3</p>
                    <p className="text-sm text-muted-foreground">Par Secrétariat • il y a 1h</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Traité</Badge>
                  <Button size="sm" variant="outline">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-violet-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">Calcul moyennes BTS Gestion</p>
                    <p className="text-sm text-muted-foreground">Par System • il y a 2h</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="default">Automatique</Badge>
                  <Button size="sm" variant="outline">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Audit Trail */}
        <Card>
          <CardHeader>
            <CardTitle>Piste d'Audit Détaillée</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-muted p-3 border-b">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Modification Note - ID: 2024-0412</h4>
                    <span className="text-sm text-muted-foreground">15:34:21</span>
                  </div>
                </div>
                <div className="p-3 space-y-2">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Étudiant:</span>
                      <span className="ml-2 font-medium">Marie Dupont (L3-2024-156)</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Matière:</span>
                      <span className="ml-2 font-medium">Mathématiques Financières</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Avant:</span>
                      <span className="ml-2 font-medium">12.50/20</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Après:</span>
                      <span className="ml-2 font-medium">14.00/20</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Motif:</span>
                      <span className="ml-2 font-medium">Erreur de calcul</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Validé par:</span>
                      <span className="ml-2 font-medium">Directeur Pédagogique</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center py-4">
                <Button variant="outline">
                  Voir plus d'entrées
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ModuleLayout>
  );
}