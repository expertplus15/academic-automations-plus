
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Users, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { useAcademicMetrics } from "@/hooks/useAcademicMetrics";

export function OverviewMetrics() {
  const { metrics, loading } = useAcademicMetrics();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-16 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const metricCards = [
    {
      title: "Moyenne Générale",
      value: metrics?.averageGrade?.toFixed(2) || "0.00",
      description: "Sur 20",
      icon: TrendingUp,
      trend: metrics?.gradeTrend || 0,
      color: "text-blue-600"
    },
    {
      title: "Taux de Présence",
      value: `${metrics?.attendanceRate?.toFixed(1) || "0.0"}%`,
      description: "Moyenne institutionnelle",
      icon: CheckCircle,
      trend: metrics?.attendanceTrend || 0,
      color: "text-green-600"
    },
    {
      title: "Étudiants à Risque",
      value: metrics?.studentsAtRisk || "0",
      description: "Alertes actives",
      icon: AlertTriangle,
      trend: metrics?.riskTrend || 0,
      color: "text-red-600"
    },
    {
      title: "Évaluations Récentes",
      value: metrics?.recentEvaluations || "0",
      description: "Cette semaine",
      icon: Clock,
      trend: metrics?.evaluationTrend || 0,
      color: "text-purple-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metricCards.map((metric, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {metric.title}
            </CardTitle>
            <metric.icon className={`h-4 w-4 ${metric.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
            <p className="text-xs text-muted-foreground">
              {metric.description}
            </p>
            <div className="flex items-center mt-2">
              {metric.trend > 0 ? (
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
              )}
              <span className={`text-xs ${metric.trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {Math.abs(metric.trend).toFixed(1)}%
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
