import { StudentsModuleLayout } from "@/components/layouts/StudentsModuleLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  XCircle, 
  User, 
  GraduationCap,
  Calendar,
  BookOpen,
  Bell,
  Settings,
  Search,
  Filter,
  Plus
} from "lucide-react";
import { useState } from "react";

export default function Alerts() {
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");

  // Mock data pour les alertes
  const alerts = [
    {
      id: "1",
      type: "attendance",
      title: "Absence répétée",
      message: "Emma Dubois - 5 absences consécutives en Mathématiques",
      student: "Emma Dubois",
      studentNumber: "GC25001",
      severity: "high",
      status: "active",
      createdAt: "2025-01-13 09:30",
      subject: "Mathématiques",
      threshold: "5 absences"
    },
    {
      id: "2", 
      type: "grades",
      title: "Note en dessous du seuil",
      message: "Lucas Martin - Note de 7/20 en Physique",
      student: "Lucas Martin",
      studentNumber: "GC25002",
      severity: "medium",
      status: "pending",
      createdAt: "2025-01-13 14:15",
      subject: "Physique",
      threshold: "< 10/20"
    },
    {
      id: "3",
      type: "documents",
      title: "Documents manquants",
      message: "3 étudiants n'ont pas fourni leurs certificats médicaux",
      student: "Multiples",
      studentNumber: "-",
      severity: "low",
      status: "resolved",
      createdAt: "2025-01-12 16:45",
      subject: "-",
      threshold: "Documents requis"
    }
  ];

  const alertRules = [
    {
      id: "1",
      name: "Absences répétées",
      description: "Déclencher une alerte après 3 absences consécutives",
      type: "attendance",
      threshold: "3",
      enabled: true,
      severity: "high"
    },
    {
      id: "2",
      name: "Notes insuffisantes", 
      description: "Alerte si note < 10/20",
      type: "grades",
      threshold: "10",
      enabled: true,
      severity: "medium"
    },
    {
      id: "3",
      name: "Documents manquants",
      description: "Documents non fournis après 7 jours",
      type: "documents", 
      threshold: "7",
      enabled: false,
      severity: "low"
    }
  ];

  const stats = {
    total: alerts.length,
    active: alerts.filter(a => a.status === 'active').length,
    pending: alerts.filter(a => a.status === 'pending').length,
    resolved: alerts.filter(a => a.status === 'resolved').length,
    high: alerts.filter(a => a.severity === 'high').length
  };

  const getSeverityBadge = (severity: string) => {
    const variants = {
      high: { variant: "destructive" as const, label: "Critique", icon: AlertTriangle },
      medium: { variant: "default" as const, label: "Moyenne", icon: Clock },
      low: { variant: "secondary" as const, label: "Faible", icon: CheckCircle }
    };
    
    const config = variants[severity as keyof typeof variants] || variants.medium;
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: { variant: "destructive" as const, label: "Active", icon: AlertTriangle },
      pending: { variant: "default" as const, label: "En attente", icon: Clock },
      resolved: { variant: "outline" as const, label: "Résolue", icon: CheckCircle }
    };
    
    const config = variants[status as keyof typeof variants] || variants.pending;
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      attendance: Calendar,
      grades: GraduationCap,
      documents: BookOpen,
      behavior: User
    };
    return icons[type as keyof typeof icons] || Bell;
  };

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.studentNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = severityFilter === 'all' || alert.severity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  return (
    <StudentsModuleLayout 
      title="Alertes Automatiques" 
      subtitle="Configuration et gestion des alertes étudiants"
    >
      <div className="p-6 space-y-6">
        {/* Statistiques */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <Bell className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Actives</p>
                  <p className="text-2xl font-bold text-red-600">{stats.active}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">En attente</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Résolues</p>
                  <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Critiques</p>
                  <p className="text-2xl font-bold text-red-600">{stats.high}</p>
                </div>
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="alerts" className="space-y-6">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="alerts">Alertes actives</TabsTrigger>
              <TabsTrigger value="rules">Règles d'alerte</TabsTrigger>
              <TabsTrigger value="settings">Configuration</TabsTrigger>
            </TabsList>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Paramètres
              </Button>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Nouvelle règle
              </Button>
            </div>
          </div>

          <TabsContent value="alerts" className="space-y-4">
            {/* Filtres */}
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Rechercher par étudiant, titre ou message..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger className="w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filtrer par sévérité" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les sévérités</SelectItem>
                  <SelectItem value="high">Critique</SelectItem>
                  <SelectItem value="medium">Moyenne</SelectItem>
                  <SelectItem value="low">Faible</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Liste des alertes */}
            <div className="grid gap-4">
              {filteredAlerts.map((alert) => {
                const TypeIcon = getTypeIcon(alert.type);
                return (
                  <Card key={alert.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <TypeIcon className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold">{alert.title}</h3>
                              {getSeverityBadge(alert.severity)}
                              {getStatusBadge(alert.status)}
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{alert.message}</p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>Étudiant: {alert.student}</span>
                              {alert.subject !== '-' && <span>Matière: {alert.subject}</span>}
                              <span>Seuil: {alert.threshold}</span>
                              <span>Créée le: {alert.createdAt}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">Voir détails</Button>
                          {alert.status === 'active' && (
                            <Button variant="default" size="sm">Résoudre</Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="rules" className="space-y-4">
            <div className="grid gap-4">
              {alertRules.map((rule) => {
                const TypeIcon = getTypeIcon(rule.type);
                return (
                  <Card key={rule.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <TypeIcon className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <div className="flex items-center gap-3">
                              <h3 className="font-semibold">{rule.name}</h3>
                              {getSeverityBadge(rule.severity)}
                              {rule.enabled ? (
                                <Badge variant="outline" className="text-green-600">
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Activée
                                </Badge>
                              ) : (
                                <Badge variant="secondary">
                                  <XCircle className="w-3 h-3 mr-1" />
                                  Désactivée
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{rule.description}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <Switch checked={rule.enabled} />
                          <Button variant="ghost" size="sm">
                            <Settings className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuration générale</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Notifications</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-sm">Notifications email</label>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="text-sm">Notifications SMS</label>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="text-sm">Notifications en temps réel</label>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-medium">Seuils par défaut</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm">Absences consécutives</label>
                        <Input type="number" defaultValue="3" className="mt-1" />
                      </div>
                      <div>
                        <label className="text-sm">Note minimale</label>
                        <Input type="number" defaultValue="10" className="mt-1" />
                      </div>
                      <div>
                        <label className="text-sm">Délai documents (jours)</label>
                        <Input type="number" defaultValue="7" className="mt-1" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </StudentsModuleLayout>
  );
}