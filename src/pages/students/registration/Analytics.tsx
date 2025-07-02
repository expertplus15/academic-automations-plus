import { StudentsModuleLayout } from "@/components/layouts/StudentsModuleLayout";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp, Users, Calendar } from 'lucide-react';

export default function RegistrationAnalytics() {
  return (
    <StudentsModuleLayout 
      title="Analyses des Inscriptions"
      subtitle="Statistiques détaillées et métriques d'inscription"
    >
      <div className="p-8 space-y-8">
        <Card className="bg-white rounded-2xl shadow-sm border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-500" />
              Analyses des inscriptions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Module d'analyses en développement</p>
                <p className="text-sm mt-1">Graphiques et métriques détaillées à venir</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </StudentsModuleLayout>
  );
}