
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AcademicModuleLayout } from '@/components/layouts/AcademicModuleLayout';
import { Brain, Zap, Grid3X3, CalendarDays, Calendar, BarChart3, BookOpen } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TimetablesBanner } from '@/components/academic/timetables/TimetablesBanner';
import { TimetablesStats } from '@/components/academic/timetables/TimetablesStats';
import { TimetablesTabsContent } from '@/components/academic/timetables/TimetablesTabsContent';

export default function Timetables() {
  return (
    <ProtectedRoute allowedRoles={['admin', 'teacher']}>
      <AcademicModuleLayout 
        title="Emploi du Temps" 
        subtitle="Planning intelligent et gestion des créneaux avec IA"
        showHeader={true}
      >
        <div className="p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            
            {/* Bannière du nouveau générateur IA */}
            <TimetablesBanner />

            <Tabs defaultValue="interactive" className="space-y-6">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="interactive" className="flex items-center gap-2">
                  <Grid3X3 className="h-4 w-4" />
                  Interface Interactive
                </TabsTrigger>
                <TabsTrigger value="calendar" className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" />
                  Vue Calendrier
                </TabsTrigger>
                <TabsTrigger value="intelligent" className="flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  Générateur IA
                </TabsTrigger>
                <TabsTrigger value="schedule" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Vue Liste
                </TabsTrigger>
                <TabsTrigger value="academic-calendar" className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Calendrier Académique
                </TabsTrigger>
                <TabsTrigger value="analytics" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Analytics
                </TabsTrigger>
              </TabsList>

              {/* Contenu des onglets */}
              <TimetablesTabsContent />
            </Tabs>

            {/* Statistiques améliorées */}
            <TimetablesStats />
          </div>
        </div>
      </AcademicModuleLayout>
    </ProtectedRoute>
  );
}
