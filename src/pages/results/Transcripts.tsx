import React from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { ModuleLayout } from "@/components/layouts/ModuleLayout";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Award, Download, FileText, Calculator, Archive } from 'lucide-react';

export default function Transcripts() {
  return (
    <ProtectedRoute allowedRoles={['admin', 'teacher']}>
      <ModuleLayout 
        title="Relevés standards" 
        subtitle="Relevés officiels de notes et attestations"
        showHeader={true}
      >
        <div className="p-6 space-y-6">
          {/* Types de relevés */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-blue-500" />
                  Relevé officiel
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Relevé complet avec tampons et signatures
                </p>
                <Button className="w-full">
                  <FileText className="w-4 h-4 mr-2" />
                  Générer
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-green-500" />
                  Relevé provisoire
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Version provisoire pour consultation
                </p>
                <Button variant="outline" className="w-full">
                  <FileText className="w-4 h-4 mr-2" />
                  Générer
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Archive className="w-5 h-5 text-purple-500" />
                  Attestation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Attestation de réussite ou de présence
                </p>
                <Button variant="outline" className="w-full">
                  <FileText className="w-4 h-4 mr-2" />
                  Générer
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="w-5 h-5 text-orange-500" />
                  Export global
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Export en lot pour toute une promotion
                </p>
                <Button variant="outline" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Export lot
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Paramètres et configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Configuration des relevés</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Award className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Module de configuration en cours de développement
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Personnalisation des modèles, signatures et tampons
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </ModuleLayout>
    </ProtectedRoute>
  );
}