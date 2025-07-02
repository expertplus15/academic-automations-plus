import { StudentsModuleLayout } from "@/components/layouts/StudentsModuleLayout";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Cog, Sliders } from 'lucide-react';

export default function RegistrationSettings() {
  return (
    <StudentsModuleLayout 
      title="Configuration des Inscriptions"
      subtitle="Paramètres et configuration du processus d'inscription"
    >
      <div className="p-8 space-y-8">
        <Card className="bg-white rounded-2xl shadow-sm border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-emerald-500" />
              Configuration du processus
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <Settings className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Module de configuration en développement</p>
                <p className="text-sm mt-1">Paramètres et options d'inscription à venir</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </StudentsModuleLayout>
  );
}