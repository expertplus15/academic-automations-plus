import { StudentsModuleLayout } from "@/components/layouts/StudentsModuleLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  FileText, 
  Download, 
  Upload, 
  Eye, 
  Send,
  Calendar,
  User,
  CheckCircle,
  Clock,
  XCircle,
  Search,
  Filter,
  Plus,
  Settings
} from "lucide-react";
import { useState } from "react";

export default function Documents() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  // Mock data pour les documents
  const documents = [
    {
      id: "1",
      type: "certificate",
      title: "Certificat de scolarité",
      student: "Emma Dubois",
      studentNumber: "GC25001",
      status: "generated",
      requestDate: "2025-01-13",
      generatedDate: "2025-01-13",
      validUntil: "2025-07-13",
      requestedBy: "Étudiant",
      purpose: "Demande de bourse",
      documentNumber: "CERT25001"
    },
    {
      id: "2",
      type: "transcript",
      title: "Relevé de notes",
      student: "Lucas Martin",
      studentNumber: "GC25002", 
      status: "pending",
      requestDate: "2025-01-12",
      generatedDate: null,
      validUntil: null,
      requestedBy: "Administration",
      purpose: "Transfert d'établissement",
      documentNumber: null
    },
    {
      id: "3",
      type: "diploma",
      title: "Attestation de diplôme",
      student: "Emma Dubois",
      studentNumber: "GC25001",
      status: "approved",
      requestDate: "2025-01-10",
      generatedDate: null,
      validUntil: null,
      requestedBy: "Employeur",
      purpose: "Candidature emploi",
      documentNumber: null
    }
  ];

  const documentTypes = [
    {
      id: "certificate",
      name: "Certificat de scolarité",
      description: "Atteste de l'inscription de l'étudiant",
      template: "template_certificate.pdf",
      requiredFields: ["student_name", "program", "academic_year"],
      validityPeriod: "6 mois",
      autoGenerate: true
    },
    {
      id: "transcript",
      name: "Relevé de notes",
      description: "Détail des notes et crédits obtenus",
      template: "template_transcript.pdf",
      requiredFields: ["student_name", "grades", "credits", "semester"],
      validityPeriod: "Permanent",
      autoGenerate: false
    },
    {
      id: "diploma",
      name: "Attestation de diplôme",
      description: "Certifie l'obtention du diplôme",
      template: "template_diploma.pdf",
      requiredFields: ["student_name", "diploma_title", "graduation_date"],
      validityPeriod: "Permanent",
      autoGenerate: false
    }
  ];

  const stats = {
    total: documents.length,
    pending: documents.filter(d => d.status === 'pending').length,
    generated: documents.filter(d => d.status === 'generated').length,
    approved: documents.filter(d => d.status === 'approved').length,
    expired: documents.filter(d => d.status === 'expired').length
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: { variant: "secondary" as const, label: "En attente", icon: Clock },
      approved: { variant: "default" as const, label: "Approuvé", icon: CheckCircle },
      generated: { variant: "outline" as const, label: "Généré", icon: FileText },
      sent: { variant: "outline" as const, label: "Envoyé", icon: Send },
      expired: { variant: "destructive" as const, label: "Expiré", icon: XCircle }
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
      certificate: FileText,
      transcript: FileText,
      diploma: FileText,
      letter: FileText
    };
    return icons[type as keyof typeof icons] || FileText;
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.studentNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || doc.status === statusFilter;
    const matchesType = typeFilter === 'all' || doc.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <StudentsModuleLayout 
      title="Documents Administratifs" 
      subtitle="Génération et gestion des documents étudiants"
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
                <FileText className="w-8 h-8 text-primary" />
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
                  <p className="text-sm text-muted-foreground">Générés</p>
                  <p className="text-2xl font-bold text-green-600">{stats.generated}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Approuvés</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.approved}</p>
                </div>
                <User className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Expirés</p>
                  <p className="text-2xl font-bold text-red-600">{stats.expired}</p>
                </div>
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="requests" className="space-y-6">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="requests">Demandes</TabsTrigger>
              <TabsTrigger value="generate">Génération</TabsTrigger>
              <TabsTrigger value="templates">Modèles</TabsTrigger>
              <TabsTrigger value="settings">Configuration</TabsTrigger>
            </TabsList>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Exporter
              </Button>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Nouvelle demande
              </Button>
            </div>
          </div>

          <TabsContent value="requests" className="space-y-4">
            {/* Filtres */}
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Rechercher par étudiant, type ou numéro..."
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
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="approved">Approuvé</SelectItem>
                  <SelectItem value="generated">Généré</SelectItem>
                  <SelectItem value="sent">Envoyé</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filtrer par type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  <SelectItem value="certificate">Certificat</SelectItem>
                  <SelectItem value="transcript">Relevé</SelectItem>
                  <SelectItem value="diploma">Diplôme</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Liste des demandes */}
            <div className="grid gap-4">
              {filteredDocuments.map((doc) => {
                const TypeIcon = getTypeIcon(doc.type);
                return (
                  <Card key={doc.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <TypeIcon className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold">{doc.title}</h3>
                              {getStatusBadge(doc.status)}
                              {doc.documentNumber && (
                                <Badge variant="outline">N° {doc.documentNumber}</Badge>
                              )}
                            </div>
                            <div className="space-y-1 text-sm text-muted-foreground">
                              <div className="flex items-center gap-4">
                                <span>Étudiant: {doc.student} ({doc.studentNumber})</span>
                                <span>Demandé par: {doc.requestedBy}</span>
                              </div>
                              <div className="flex items-center gap-4">
                                <span>Demandé le: {doc.requestDate}</span>
                                {doc.generatedDate && <span>Généré le: {doc.generatedDate}</span>}
                                {doc.validUntil && <span>Valide jusqu'au: {doc.validUntil}</span>}
                              </div>
                              <div>Motif: {doc.purpose}</div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          {doc.status === 'generated' && (
                            <Button variant="ghost" size="sm">
                              <Download className="w-4 h-4" />
                            </Button>
                          )}
                          {doc.status === 'pending' && (
                            <Button variant="default" size="sm">
                              Approuver
                            </Button>
                          )}
                          {doc.status === 'approved' && (
                            <Button variant="default" size="sm">
                              Générer
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="generate" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Génération de documents</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-4">Génération individuelle</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Étudiant</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un étudiant" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="GC25001">Emma Dubois (GC25001)</SelectItem>
                            <SelectItem value="GC25002">Lucas Martin (GC25002)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium">Type de document</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner le type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="certificate">Certificat de scolarité</SelectItem>
                            <SelectItem value="transcript">Relevé de notes</SelectItem>
                            <SelectItem value="diploma">Attestation de diplôme</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium">Motif (optionnel)</label>
                        <Textarea placeholder="Préciser le motif de la demande..." />
                      </div>
                      
                      <Button className="w-full">
                        <FileText className="w-4 h-4 mr-2" />
                        Générer le document
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-4">Génération en lot</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Programme</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un programme" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="informatique">Informatique</SelectItem>
                            <SelectItem value="gestion">Gestion</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium">Niveau</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner le niveau" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="L1">Licence 1</SelectItem>
                            <SelectItem value="L2">Licence 2</SelectItem>
                            <SelectItem value="L3">Licence 3</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium">Type de document</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner le type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="certificate">Certificats de scolarité</SelectItem>
                            <SelectItem value="transcript">Relevés de notes</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <Button variant="outline" className="w-full">
                        <Upload className="w-4 h-4 mr-2" />
                        Générer pour tous (0 étudiants)
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <div className="grid gap-4">
              {documentTypes.map((template) => (
                <Card key={template.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <FileText className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{template.name}</h3>
                          <p className="text-sm text-muted-foreground">{template.description}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                            <span>Validité: {template.validityPeriod}</span>
                            <span>Génération: {template.autoGenerate ? 'Automatique' : 'Manuelle'}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Settings className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
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
                    <h4 className="font-medium">Paramètres de génération</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium">Signature électronique</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner le signataire" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="director">Directeur</SelectItem>
                            <SelectItem value="secretary">Secrétaire générale</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium">Logo de l'établissement</label>
                        <Button variant="outline" className="w-full">
                          <Upload className="w-4 h-4 mr-2" />
                          Changer le logo
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-medium">Notifications</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-sm">Notification à l'étudiant</label>
                        <input type="checkbox" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="text-sm">Copie à l'administration</label>
                        <input type="checkbox" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="text-sm">Archivage automatique</label>
                        <input type="checkbox" defaultChecked />
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