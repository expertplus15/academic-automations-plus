import { StudentsModuleLayout } from "@/components/layouts/StudentsModuleLayout";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  UserCheck, 
  Clock, 
  AlertTriangle,
  TrendingUp,
  FileText,
  CheckCircle
} from 'lucide-react';

export default function RegistrationDashboard() {
  const registrationStats = [
    {
      label: "Inscriptions en cours",
      value: "127",
      change: "+15",
      changeType: "positive" as const,
      icon: Clock
    },
    {
      label: "Validations en attente",
      value: "43",
      change: "+8",
      changeType: "neutral" as const,
      icon: AlertTriangle
    },
    {
      label: "Inscriptions validées",
      value: "284",
      change: "+67",
      changeType: "positive" as const,
      icon: UserCheck
    },
    {
      label: "Taux de conversion",
      value: "89%",
      change: "+5%",
      changeType: "positive" as const,
      icon: TrendingUp
    }
  ];

  const recentRegistrations = [
    {
      id: 1,
      student: "Marie Dubois",
      program: "Informatique",
      status: "validation",
      date: "2024-01-15"
    },
    {
      id: 2,
      student: "Jean Martin",
      program: "Commerce",
      status: "documents",
      date: "2024-01-14"
    },
    {
      id: 3,
      student: "Sophie Laurent",
      program: "Design",
      status: "completed",
      date: "2024-01-13"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-700 border-green-200"><CheckCircle className="w-3 h-3 mr-1" />Complétée</Badge>;
      case 'validation':
        return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200"><Clock className="w-3 h-3 mr-1" />En validation</Badge>;
      case 'documents':
        return <Badge className="bg-blue-100 text-blue-700 border-blue-200"><FileText className="w-3 h-3 mr-1" />Documents</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getIcon = (IconComponent: React.ElementType) => {
    return <IconComponent className="w-6 h-6 text-emerald-600" />;
  };

  return (
    <StudentsModuleLayout 
      title="Tableau de Bord - Inscriptions"
      subtitle="Vue d'ensemble des inscriptions et validations"
    >
      <div className="p-8 space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {registrationStats.map((stat, index) => (
            <Card key={index} className="bg-white rounded-2xl shadow-sm border-0 hover:shadow-md transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  </div>
                  <div className="p-3 bg-emerald-100 rounded-xl">
                    {getIcon(stat.icon)}
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-600">{stat.change}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Registrations */}
        <Card className="bg-white rounded-2xl shadow-sm border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-500" />
              Inscriptions récentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentRegistrations.map((registration) => (
                <div
                  key={registration.id}
                  className="flex items-center justify-between p-4 rounded-xl border border-border/50 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-emerald-100 rounded-lg">
                      <Users className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{registration.student}</p>
                      <p className="text-sm text-muted-foreground">{registration.program}</p>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="flex items-center gap-2">
                      {getStatusBadge(registration.status)}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {registration.date}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </StudentsModuleLayout>
  );
}