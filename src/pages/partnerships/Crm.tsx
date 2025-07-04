import { PartnershipsModuleLayout } from "@/components/layouts/PartnershipsModuleLayout";
import { PartnershipsPageHeader } from "@/components/PartnershipsPageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { 
  Building, 
  Plus, 
  FileText, 
  Mail, 
  Phone, 
  MoreHorizontal, 
  CheckCircle, 
  Clock, 
  TrendingUp 
} from "lucide-react";

export default function Crm() {
  return (
    <PartnershipsModuleLayout>
      <PartnershipsPageHeader 
        title="CRM partenaires" 
        subtitle="Gestion des relations partenaires" 
      />
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header with Actions */}
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Gestion des Partenaires</h2>
              <p className="text-muted-foreground">Gérez vos relations avec les entreprises partenaires</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline">
                <FileText className="w-4 h-4 mr-2" />
                Importer
              </Button>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Nouveau Partenaire
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Partenaires</p>
                    <p className="text-2xl font-bold">34</p>
                  </div>
                  <Building className="h-8 w-8 text-pink-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Actifs</p>
                    <p className="text-2xl font-bold">29</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">En Négociation</p>
                    <p className="text-2xl font-bold">3</p>
                  </div>
                  <Clock className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Nouveaux ce mois</p>
                    <p className="text-2xl font-bold">2</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Input placeholder="Rechercher un partenaire..." className="w-full" />
                </div>
                <Select>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Secteur d'activité" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tech">Technologie</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="industrie">Industrie</SelectItem>
                    <SelectItem value="services">Services</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="actif">Actif</SelectItem>
                    <SelectItem value="negotiation">En négociation</SelectItem>
                    <SelectItem value="suspendu">Suspendu</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Partners List */}
          <Card>
            <CardHeader>
              <CardTitle>Liste des Partenaires</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    name: "TechCorp Solutions",
                    sector: "Technologie",
                    contact: "sarah.martin@techcorp.com",
                    phone: "+33 1 23 45 67 89",
                    students: 12,
                    since: "2023",
                    status: "Actif",
                    logo: "photo-1519389950473-47ba0277781c"
                  },
                  {
                    name: "Global Industries",
                    sector: "Industrie",
                    contact: "pierre.dubois@global.com",
                    phone: "+33 1 98 76 54 32",
                    students: 8,
                    since: "2022",
                    status: "Actif",
                    logo: "photo-1460574283810-2aab119d8511"
                  },
                  {
                    name: "Innovation Labs",
                    sector: "R&D",
                    contact: "marie.rousseau@labs.com",
                    phone: "+33 1 45 67 89 12",
                    students: 5,
                    since: "2024",
                    status: "En négociation",
                    logo: "photo-1605810230434-7631ac76ec81"
                  }
                ].map((partner, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                        <Building className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{partner.name}</h3>
                        <p className="text-sm text-muted-foreground">{partner.sector}</p>
                        <div className="flex items-center gap-4 mt-1">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            {partner.contact}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            {partner.phone}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">{partner.students} étudiants</p>
                        <p className="text-xs text-muted-foreground">Depuis {partner.since}</p>
                      </div>
                      <Badge variant={partner.status === 'Actif' ? 'default' : 'secondary'}>
                        {partner.status}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Voir détails</DropdownMenuItem>
                          <DropdownMenuItem>Modifier</DropdownMenuItem>
                          <DropdownMenuItem>Contacter</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">Supprimer</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PartnershipsModuleLayout>
  );
}