
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OverviewMetrics } from "./OverviewMetrics";
import { StudentPerformanceTable } from "./StudentPerformanceTable";
import { AttendanceOverview } from "./AttendanceOverview";
import { AcademicAlerts } from "./AcademicAlerts";
import { PerformanceCharts } from "./PerformanceCharts";

export function AcademicTrackingDashboard() {
  return (
    <div className="space-y-6">
      <OverviewMetrics />
      
      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="performance">Performances</TabsTrigger>
          <TabsTrigger value="attendance">Assiduité</TabsTrigger>
          <TabsTrigger value="alerts">Alertes</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="performance" className="space-y-4">
          <StudentPerformanceTable />
        </TabsContent>
        
        <TabsContent value="attendance" className="space-y-4">
          <AttendanceOverview />
        </TabsContent>
        
        <TabsContent value="alerts" className="space-y-4">
          <AcademicAlerts />
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <PerformanceCharts />
        </TabsContent>
      </Tabs>
    </div>
  );
}
