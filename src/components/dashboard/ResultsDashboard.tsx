import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from 'react-router-dom';
import { 
  Grid, 
  Calculator, 
  FileCheck, 
  BarChart3, 
  Settings,
  TrendingUp,
  Users,
  BookOpen,
  ChevronRight
} from "lucide-react";
import { ResultsQuickActions } from '@/components/results/ResultsQuickActions';

export function ResultsDashboard() {
  const navigate = useNavigate();

  const quickStatsCards = [
    {
      title: "Étudiants Actifs",
      value: "1,247",
      change: "+12%",
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Notes Saisies",
      value: "8,945",
      change: "+23%", 
      icon: Grid,
      color: "text-green-600"
    },
    {
      title: "Moyennes Calculées", 
      value: "2,134",
      change: "+8%",
      icon: Calculator,
      color: "text-purple-600"
    },
    {
      title: "Validations Effectuées",
      value: "456",
      change: "+15%",
      icon: FileCheck,
      color: "text-orange-600"
    }
  ];

  const moduleActions = [
    {
      title: "Saisie des Notes",
      description: "Interface matricielle collaborative",
      icon: Grid,
      href: "/results/grade-entry",
      color: "bg-blue-500"
    },
    {
      title: "Calculs & Moyennes", 
      description: "Moyennes automatiques et ECTS",
      icon: Calculator,
      href: "/results/calculations",
      color: "bg-green-500"
    },
    {
      title: "Validation",
      description: "Consultation et validation", 
      icon: FileCheck,
      href: "/results/validation",
      color: "bg-purple-500"
    },
    {
      title: "Analytics",
      description: "Analyse et statistiques",
      icon: BarChart3,
      href: "/results/analytics", 
      color: "bg-orange-500"
    }
  ];

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <ResultsQuickActions
        onRefresh={handleRefresh}
        onSettings={() => navigate('/results/grading-system')}
        pendingActions={3}
      />

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStatsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover-scale">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className={`text-xs ${stat.color}`}>{stat.change}</p>
                  </div>
                  <Icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Module Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {moduleActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Card 
              key={index} 
              className="hover-scale cursor-pointer transition-all duration-200 hover:shadow-lg"
              onClick={() => navigate(action.href)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{action.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{action.description}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Activité Récente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">Notes saisies pour DUTGE L1 - Mathématiques</span>
              </div>
              <Badge variant="outline">Il y a 2h</Badge>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm">Calculs moyennes automatiques - Semestre 1</span>
              </div>
              <Badge variant="outline">Il y a 4h</Badge>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-sm">Validation bulletins DUTGE L2</span>
              </div>
              <Badge variant="outline">Hier</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}