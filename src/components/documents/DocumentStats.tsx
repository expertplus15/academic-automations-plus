import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Download, 
  Users, 
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Calendar
} from "lucide-react";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const generationData = [
  { month: "Jan", bulletins: 45, releves: 23 },
  { month: "Fév", bulletins: 52, releves: 31 },
  { month: "Mar", bulletins: 38, releves: 18 },
  { month: "Avr", bulletins: 61, releves: 44 },
  { month: "Mai", bulletins: 55, releves: 32 },
  { month: "Juin", bulletins: 67, releves: 51 }
];

const statusData = [
  { name: "En attente", value: 12, color: "bg-yellow-500" },
  { name: "En cours", value: 8, color: "bg-blue-500" },
  { name: "Terminé", value: 156, color: "bg-green-500" },
  { name: "Erreur", value: 3, color: "bg-red-500" }
];

export function DocumentStats() {
  return (
    <div className="space-y-6">
      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Documents</p>
                <p className="text-2xl font-semibold">1,234</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Download className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Générations</p>
                <p className="text-2xl font-semibold">89</p>
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +12% ce mois
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Étudiants</p>
                <p className="text-2xl font-semibold">456</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Temps moyen</p>
                <p className="text-2xl font-semibold">2.4s</p>
                <p className="text-xs text-muted-foreground">par document</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Évolution des générations */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Évolution des Générations</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={generationData}>
                <defs>
                  <linearGradient id="colorBulletins" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="colorReleves" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--secondary))" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="hsl(var(--secondary))" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="bulletins" 
                  stackId="1"
                  stroke="hsl(var(--primary))" 
                  fillOpacity={1} 
                  fill="url(#colorBulletins)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="releves" 
                  stackId="1"
                  stroke="hsl(var(--secondary))" 
                  fillOpacity={1} 
                  fill="url(#colorReleves)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Statuts des tâches */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Statut des Générations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {statusData.map((status, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${status.color}`}></div>
                    <span className="text-sm font-medium">{status.name}</span>
                  </div>
                  <Badge variant="outline">{status.value}</Badge>
                </div>
                <Progress 
                  value={(status.value / 179) * 100} 
                  className="h-2"
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Activité récente */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Activité Récente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                action: "Bulletin généré",
                target: "L2 Informatique - Semestre 1",
                time: "Il y a 5 minutes",
                status: "success",
                icon: CheckCircle
              },
              {
                action: "Relevé en cours",
                target: "M1 Informatique - Année complète",
                time: "Il y a 12 minutes",
                status: "processing",
                icon: Clock
              },
              {
                action: "Erreur de génération",
                target: "L3 Informatique - Semestre 2",
                time: "Il y a 1 heure",
                status: "error",
                icon: AlertCircle
              },
              {
                action: "Template créé",
                target: "Bulletin Personnalisé V2",
                time: "Il y a 2 heures",
                status: "success",
                icon: CheckCircle
              }
            ].map((activity, index) => {
              const Icon = activity.icon;
              return (
                <div key={index} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <Icon className={`h-4 w-4 ${
                    activity.status === "success" ? "text-green-600" :
                    activity.status === "error" ? "text-red-600" :
                    "text-blue-600"
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.target}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}