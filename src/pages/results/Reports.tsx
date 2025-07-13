import React from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { ModuleLayout } from "@/components/layouts/ModuleLayout";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileOutput, Download, Eye, Settings, Zap, Users } from 'lucide-react';

export default function Reports() {
  return (
    <ProtectedRoute allowedRoles={['admin', 'teacher']}>
      <ModuleLayout 
        title="Bulletins personnalisables" 
        subtitle="Génération ultra-rapide en moins de 5 secondes"
        showHeader={true}
      >
        <div className="p-6 space-y-6">
          {/* Actions rapides */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  Génération Express
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Bulletins prêts en moins de 5 secondes
                </p>
                <Button className="w-full">
                  <FileOutput className="w-4 h-4 mr-2" />
                  Générer les bulletins
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-blue-500" />
                  Aperçu & Templates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Prévisualiser et personnaliser les modèles
                </p>
                <Button variant="outline" className="w-full">
                  <Eye className="w-4 h-4 mr-2" />
                  Aperçu modèles
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-green-500" />
                  Bulletins par classe
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Génération par programme ou niveau
                </p>
                <Button variant="outline" className="w-full">
                  <Users className="w-4 h-4 mr-2" />
                  Par classe
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Historique et téléchargements */}
          <Card>
            <CardHeader>
              <CardTitle>Bulletins générés récemment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <FileOutput className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Aucun bulletin généré récemment
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Utilisez les actions ci-dessus pour commencer la génération
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </ModuleLayout>
    </ProtectedRoute>
  );
}