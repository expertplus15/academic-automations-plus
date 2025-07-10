import { ServicesModuleLayout } from "@/components/layouts/ServicesModuleLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ActivityCatalog } from "@/components/activities/ActivityCatalog";
import { MyActivities } from "@/components/activities/MyActivities";
import { ActivityCalendar } from "@/components/activities/ActivityCalendar";
import { ActivityStats } from "@/components/activities/ActivityStats";
import { Calendar, Trophy, User, BookOpen } from "lucide-react";

export default function Activities() {
  return (
    <ServicesModuleLayout title="Activités extra-scolaires" subtitle="Sports, clubs et associations">
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <Tabs defaultValue="catalog" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="catalog" className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Catalogue
              </TabsTrigger>
              <TabsTrigger value="my-activities" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Mes activités
              </TabsTrigger>
              <TabsTrigger value="calendar" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Planning
              </TabsTrigger>
              <TabsTrigger value="stats" className="flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                Statistiques
              </TabsTrigger>
            </TabsList>

            <TabsContent value="catalog">
              <ActivityCatalog />
            </TabsContent>

            <TabsContent value="my-activities">
              <MyActivities />
            </TabsContent>

            <TabsContent value="calendar">
              <ActivityCalendar />
            </TabsContent>

            <TabsContent value="stats">
              <ActivityStats />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ServicesModuleLayout>
  );
}