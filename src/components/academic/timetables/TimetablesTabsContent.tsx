
import React from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TabsContent } from '@/components/ui/tabs';
import { Calendar, Plus } from 'lucide-react';
import { InteractiveTimetableGrid } from '@/components/academic/InteractiveTimetableGrid';
import { TimetableCalendarView } from '@/components/academic/TimetableCalendarView';
import { SmartScheduleGenerator } from '@/components/academic/SmartScheduleGenerator';
import { TimetableView } from '@/components/academic/TimetableView';
import { AcademicCalendar } from '@/components/academic/AcademicCalendar';
import { TimetableAnalytics } from '@/components/academic/TimetableAnalytics';
import { getCurrentWeekDates } from '@/utils/dateUtils';

export function TimetablesTabsContent() {
  const currentWeek = getCurrentWeekDates();

  return (
    <>
      {/* Onglet Interface Interactive */}
      <TabsContent value="interactive">
        <InteractiveTimetableGrid />
      </TabsContent>

      {/* Onglet Vue Calendrier */}
      <TabsContent value="calendar">
        <TimetableCalendarView />
      </TabsContent>

      {/* Onglet Générateur IA */}
      <TabsContent value="intelligent">
        <SmartScheduleGenerator />
      </TabsContent>

      {/* Onglet Vue Liste */}
      <TabsContent value="schedule">
        <div className="space-y-6">
          {/* En-tête avec informations de la semaine */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Semaine du {currentWeek[0]} au {currentWeek[6]}
                </CardTitle>
                <Button variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter un créneau
                </Button>
              </div>
            </CardHeader>
          </Card>

          {/* Vue de l'emploi du temps */}
          <TimetableView />
        </div>
      </TabsContent>

      {/* Nouvel onglet Calendrier Académique */}
      <TabsContent value="academic-calendar">
        <AcademicCalendar />
      </TabsContent>

      {/* Nouvel onglet Analytics */}
      <TabsContent value="analytics">
        <TimetableAnalytics />
      </TabsContent>
    </>
  );
}
