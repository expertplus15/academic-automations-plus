import { StudentsModuleLayout } from "@/components/layouts/StudentsModuleLayout";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Video, Calendar, Users } from 'lucide-react';

export default function RegistrationInterviews() {
  return (
    <StudentsModuleLayout 
      title="Entretiens d'Admission"
      subtitle="Planification et gestion des entretiens"
    >
      <div className="p-8 space-y-8">
        <Card className="bg-white rounded-2xl shadow-sm border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="w-5 h-5 text-emerald-500" />
              Gestion des entretiens
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <Video className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Module d'entretiens en développement</p>
                <p className="text-sm mt-1">Planification et conduite d'entretiens à venir</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </StudentsModuleLayout>
  );
}