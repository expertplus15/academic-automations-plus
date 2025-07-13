import { StudentsModuleLayout } from "@/components/layouts/StudentsModuleLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  CreditCard, 
  User, 
  Calendar, 
  QrCode, 
  Download, 
  Printer, 
  Search, 
  Filter,
  Plus,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react";
import { useState } from "react";

export default function Cards() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Mock data pour les cartes étudiants
  const studentCards = [
    {
      id: "1",
      studentName: "Emma Dubois",
      studentNumber: "GC25001",
      cardNumber: "CRD25001",
      status: "active",
      issueDate: "2025-01-10",
      expiryDate: "2026-01-10",
      template: "Standard",
      printed: true,
      printedAt: "2025-01-11"
    },
    {
      id: "2", 
      studentName: "Lucas Martin",
      studentNumber: "GC25002",
      cardNumber: "CRD25002",
      status: "pending",
      issueDate: "2025-01-12",
      expiryDate: "2026-01-12",
      template: "Standard",
      printed: false,
      printedAt: null
    }
  ];

  const stats = {
    total: studentCards.length,
    active: studentCards.filter(c => c.status === 'active').length,
    pending: studentCards.filter(c => c.status === 'pending').length,
    expired: studentCards.filter(c => c.status === 'expired').length,
    toPrint: studentCards.filter(c => !c.printed).length
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: { variant: "default" as const, label: "Active", icon: CheckCircle },
      pending: { variant: "secondary" as const, label: "En attente", icon: Clock },
      expired: { variant: "destructive" as const, label: "Expirée", icon: XCircle },
      suspended: { variant: "outline" as const, label: "Suspendue", icon: XCircle }
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

  const filteredCards = studentCards.filter(card => {
    const matchesSearch = card.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         card.studentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         card.cardNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || card.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <StudentsModuleLayout 
      title="Cartes Étudiants" 
      subtitle="Gestion et génération des cartes d'étudiants"
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
                <CreditCard className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Actives</p>
                  <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
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
                  <p className="text-sm text-muted-foreground">Expirées</p>
                  <p className="text-2xl font-bold text-red-600">{stats.expired}</p>
                </div>
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">À imprimer</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.toPrint}</p>
                </div>
                <Print className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="list" className="space-y-6">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="list">Liste des cartes</TabsTrigger>
              <TabsTrigger value="generation">Génération</TabsTrigger>
              <TabsTrigger value="templates">Modèles</TabsTrigger>
            </TabsList>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Exporter
              </Button>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Nouvelle carte
              </Button>
            </div>
          </div>

          <TabsContent value="list" className="space-y-4">
            {/* Filtres */}
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Rechercher par nom, numéro étudiant ou carte..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filtrer par statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="active">Actives</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="expired">Expirées</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Liste des cartes */}
            <div className="grid gap-4">
              {filteredCards.map((card) => (
                <Card key={card.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-8 bg-gradient-to-r from-primary/20 to-primary/10 rounded border flex items-center justify-center">
                          <CreditCard className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-3">
                            <h3 className="font-semibold">{card.studentName}</h3>
                            {getStatusBadge(card.status)}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                            <span>N° étudiant: {card.studentNumber}</span>
                            <span>N° carte: {card.cardNumber}</span>
                            <span>Expire le: {card.expiryDate}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {card.printed ? (
                          <Badge variant="outline" className="text-green-600">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Imprimée
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            <Clock className="w-3 h-3 mr-1" />
                            À imprimer
                          </Badge>
                        )}
                        
                        <Button variant="ghost" size="sm">
                          <QrCode className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Printer className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="generation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RefreshCw className="w-5 h-5" />
                  Génération automatique
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Actions rapides</h4>
                    <div className="space-y-2">
                      <Button className="w-full justify-start">
                        <Plus className="w-4 h-4 mr-2" />
                        Générer toutes les cartes manquantes
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Régénérer les cartes expirées
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Printer className="w-4 h-4 mr-2" />
                        Imprimer toutes les cartes en attente
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3">Paramètres</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Modèle par défaut</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un modèle" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="standard">Standard</SelectItem>
                            <SelectItem value="premium">Premium</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium">Durée de validité</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner la durée" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1year">1 an</SelectItem>
                            <SelectItem value="2years">2 ans</SelectItem>
                            <SelectItem value="3years">3 ans</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Modèles de cartes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div className="border rounded-lg p-4 text-center">
                    <div className="w-full h-32 bg-gradient-to-r from-primary/20 to-primary/10 rounded mb-3 flex items-center justify-center">
                      <CreditCard className="w-16 h-16 text-primary" />
                    </div>
                    <h4 className="font-medium">Modèle Standard</h4>
                    <p className="text-sm text-muted-foreground mt-1">Format classique avec QR code</p>
                    <Button variant="outline" size="sm" className="mt-3">
                      Personnaliser
                    </Button>
                  </div>
                  
                  <div className="border rounded-lg p-4 text-center">
                    <div className="w-full h-32 bg-gradient-to-r from-gold-light/20 to-gold-light/10 rounded mb-3 flex items-center justify-center">
                      <CreditCard className="w-16 h-16 text-gold-dark" />
                    </div>
                    <h4 className="font-medium">Modèle Premium</h4>
                    <p className="text-sm text-muted-foreground mt-1">Format premium avec hologramme</p>
                    <Button variant="outline" size="sm" className="mt-3">
                      Personnaliser
                    </Button>
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