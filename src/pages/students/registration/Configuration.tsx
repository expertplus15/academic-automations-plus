import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { StudentsModuleLayout } from "@/components/layouts/StudentsModuleLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GeneralSettingsTab } from '@/components/students/registration/GeneralSettingsTab';
import { ImportTab } from '@/components/students/import/ImportTab';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Settings, 
  Upload, 
  FileText, 
  Bell,
  Database,
  Users
} from 'lucide-react';

export default function Configuration() {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['general', 'import', 'templates', 'notifications'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);
  return (
    <StudentsModuleLayout 
      title="Configuration du Module Étudiants" 
      subtitle="Paramètres, importation et gestion des fonctionnalités du module étudiants"
    >
      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Paramètres Généraux
            </TabsTrigger>
            <TabsTrigger value="import" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Import d'Étudiants
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Modèles de Documents
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Notifications Automatiques
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <GeneralSettingsTab />
          </TabsContent>

          <TabsContent value="import">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="w-5 h-5 text-blue-500" />
                    Import d'Étudiants CSV
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Importez des étudiants en masse à partir d'un fichier CSV. Le système prend en charge 
                    le format DUTGE et crée automatiquement les comptes utilisateurs correspondants.
                  </p>
                </CardContent>
              </Card>
              <ImportTab />
            </div>
          </TabsContent>

          <TabsContent value="templates">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-green-500" />
                  Modèles de Documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Modèles de Documents</h3>
                  <p className="text-muted-foreground mb-4">
                    Configuration des modèles pour les cartes d'étudiants, relevés de notes, 
                    certificats de scolarité et autres documents officiels.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Cette fonctionnalité sera disponible prochainement.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-orange-500" />
                  Notifications Automatiques
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Bell className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Notifications Automatiques</h3>
                  <p className="text-muted-foreground mb-4">
                    Configuration des notifications automatiques pour les inscriptions, 
                    les échéances, les rappels de paiement et autres événements importants.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Cette fonctionnalité sera disponible prochainement.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </StudentsModuleLayout>
  );
}