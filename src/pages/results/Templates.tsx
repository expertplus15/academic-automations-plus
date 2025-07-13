import React from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { ModuleLayout } from "@/components/layouts/ModuleLayout";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Layout, Edit, Copy, Plus, Eye, Settings } from 'lucide-react';

export default function Templates() {
  return (
    <ProtectedRoute allowedRoles={['admin', 'teacher']}>
      <ModuleLayout 
        title="Templates & Modèles" 
        subtitle="Gestion des modèles de documents et bulletins"
        showHeader={true}
      >
        <div className="p-6 space-y-6">
          {/* Actions principales */}
          <div className="flex gap-4 mb-6">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nouveau modèle
            </Button>
            <Button variant="outline">
              <Copy className="w-4 h-4 mr-2" />
              Dupliquer modèle
            </Button>
            <Button variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              Paramètres globaux
            </Button>
          </div>

          {/* Types de modèles */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layout className="w-5 h-5 text-blue-500" />
                  Modèles de bulletins
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Templates personnalisables pour les bulletins de notes
                </p>
                <div className="space-y-2">
                  <Button size="sm" variant="outline" className="w-full">
                    <Eye className="w-4 h-4 mr-2" />
                    Modèle Standard
                  </Button>
                  <Button size="sm" variant="outline" className="w-full">
                    <Eye className="w-4 h-4 mr-2" />
                    Modèle Européen
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layout className="w-5 h-5 text-green-500" />
                  Modèles de relevés
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Templates pour relevés de notes officiels
                </p>
                <div className="space-y-2">
                  <Button size="sm" variant="outline" className="w-full">
                    <Eye className="w-4 h-4 mr-2" />
                    Relevé Officiel
                  </Button>
                  <Button size="sm" variant="outline" className="w-full">
                    <Eye className="w-4 h-4 mr-2" />
                    Attestation
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layout className="w-5 h-5 text-purple-500" />
                  Modèles personnalisés
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Créez vos propres modèles selon vos besoins
                </p>
                <Button size="sm" className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Créer modèle
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Éditeur de modèles */}
          <Card>
            <CardHeader>
              <CardTitle>Éditeur de modèles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Layout className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Éditeur de modèles en cours de développement
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Éditeur visuel avec glisser-déposer, mise en forme avancée
                </p>
                <Button className="mt-4">
                  <Edit className="w-4 h-4 mr-2" />
                  Ouvrir l'éditeur (bientôt)
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </ModuleLayout>
    </ProtectedRoute>
  );
}