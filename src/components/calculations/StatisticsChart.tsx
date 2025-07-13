import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Activity,
  Users,
  Calculator,
  CheckCircle,
  XCircle
} from "lucide-react";

interface StatisticItem {
  label: string;
  value: number;
  total?: number;
  change?: number;
  trend?: "up" | "down" | "stable";
  status?: "success" | "warning" | "error";
}

interface StatisticsChartProps {
  title: string;
  icon?: React.ReactNode;
  statistics: StatisticItem[];
  className?: string;
}

export function StatisticsChart({
  title,
  icon,
  statistics,
  className = ""
}: StatisticsChartProps) {
  const getTrendIcon = (trend?: "up" | "down" | "stable") => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-3 h-3 text-success" />;
      case "down":
        return <TrendingDown className="w-3 h-3 text-destructive" />;
      default:
        return <Activity className="w-3 h-3 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status?: "success" | "warning" | "error") => {
    switch (status) {
      case "success":
        return "default";
      case "warning":
        return "secondary";
      case "error":
        return "destructive";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status?: "success" | "warning" | "error") => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-3 h-3" />;
      case "error":
        return <XCircle className="w-3 h-3" />;
      default:
        return null;
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          {icon || <BarChart3 className="w-5 h-5 text-violet-500" />}
          {title}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {statistics.map((stat, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{stat.label}</span>
                {stat.status && (
                <Badge
                    variant={getStatusColor(stat.status) as any}
                    className={`h-5 px-2 text-xs flex items-center gap-1 ${
                      stat.status === "success" ? "bg-green-100 text-green-800 border-green-200" : ""
                    }`}
                  >
                    {getStatusIcon(stat.status)}
                    {stat.status === "success" && "OK"}
                    {stat.status === "warning" && "Attention"}
                    {stat.status === "error" && "Erreur"}
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold">
                  {stat.value.toLocaleString()}
                  {stat.total && (
                    <span className="text-muted-foreground font-normal">
                      /{stat.total.toLocaleString()}
                    </span>
                  )}
                </span>
                
                {stat.change !== undefined && (
                  <div className="flex items-center gap-1">
                    {getTrendIcon(stat.trend)}
                    <span className={`text-xs ${
                      stat.trend === "up" ? "text-success" : 
                      stat.trend === "down" ? "text-destructive" : 
                      "text-muted-foreground"
                    }`}>
                      {stat.change > 0 ? "+" : ""}{stat.change}%
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            {stat.total && (
              <div className="space-y-1">
                <Progress 
                  value={(stat.value / stat.total) * 100} 
                  className="h-1.5"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{((stat.value / stat.total) * 100).toFixed(1)}%</span>
                  <span>{stat.total - stat.value} restants</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// Composants prédéfinis pour différents types de statistiques
export function CalculationStatsCard() {
  const stats: StatisticItem[] = [
    {
      label: "Moyennes calculées",
      value: 1247,
      total: 1500,
      change: 12,
      trend: "up",
      status: "success"
    },
    {
      label: "Crédits ECTS validés",
      value: 89,
      total: 120,
      change: -5,
      trend: "down",
      status: "warning"
    },
    {
      label: "Simulations créées",
      value: 23,
      change: 15,
      trend: "up"
    },
    {
      label: "Erreurs détectées",
      value: 3,
      status: "error"
    }
  ];

  return (
    <StatisticsChart
      title="Statistiques des Calculs"
      icon={<Calculator className="w-5 h-5 text-violet-500" />}
      statistics={stats}
    />
  );
}

export function PerformanceStatsCard() {
  const stats: StatisticItem[] = [
    {
      label: "Étudiants traités",
      value: 456,
      total: 500,
      change: 8,
      trend: "up"
    },
    {
      label: "Temps moyen (ms)",
      value: 1250,
      change: -15,
      trend: "up",
      status: "success"
    },
    {
      label: "Taux de réussite",
      value: 97,
      total: 100,
      status: "success"
    }
  ];

  return (
    <StatisticsChart
      title="Performance du Système"
      icon={<Activity className="w-5 h-5 text-green-500" />}
      statistics={stats}
    />
  );
}