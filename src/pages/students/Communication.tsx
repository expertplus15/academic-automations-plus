
import { StudentsPageHeader } from "@/components/StudentsPageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MessageSquare, 
  Send, 
  Search, 
  Plus,
  Mail,
  Phone,
  Users,
  Calendar,
  Filter
} from "lucide-react";
import { useState } from "react";

const mockMessages = [
  {
    id: '1',
    from: 'Administration',
    to: 'Tous les étudiants L1',
    subject: 'Rentrée académique 2024-2025',
    preview: 'Les cours reprennent le lundi 2 septembre...',
    date: '2024-01-15',
    status: 'sent',
    type: 'announcement'
  },
  {
    id: '2',
    from: 'Secrétariat Pédagogique',
    to: 'Jean Dupont',
    subject: 'Convocation - Rattrapage Mathématiques',
    preview: 'Vous êtes convoqué le 20 janvier...',
    date: '2024-01-14',
    status: 'delivered',
    type: 'individual'
  },
  {
    id: '3',
    from: 'Service Scolarité',
    to: 'Promotion Master 2024',
    subject: 'Remise des diplômes',
    preview: 'La cérémonie aura lieu le 15 février...',
    date: '2024-01-13',
    status: 'read',
    type: 'group'
  }
];

export default function Communication() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState("messages");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'sent':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Envoyé</Badge>;
      case 'delivered':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Délivré</Badge>;
      case 'read':
        return <Badge className="bg-purple-100 text-purple-800 border-purple-200">Lu</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'announcement':
        return <Users className="w-4 h-4 text-blue-500" />;
      case 'individual':
        return <Mail className="w-4 h-4 text-green-500" />;
      case 'group':
        return <MessageSquare className="w-4 h-4 text-purple-500" />;
      default:
        return <MessageSquare className="w-4 h-4 text-gray-500" />;
    }
  };

  const filteredMessages = mockMessages.filter(message =>
    message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.to.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <StudentsPageHeader 
        title="Communication intégrée" 
        subtitle="Messagerie et communication centralisée avec les étudiants" 
      />
      <div className="p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">156</p>
                    <p className="text-sm text-muted-foreground">Messages envoyés</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">94%</p>
                    <p className="text-sm text-muted-foreground">Taux de lecture</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">2,847</p>
                    <p className="text-sm text-muted-foreground">Destinataires actifs</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Phone className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">23</p>
                    <p className="text-sm text-muted-foreground">SMS ce mois</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-students" />
                    Communication Intégrée
                  </CardTitle>
                  <CardDescription>
                    Messagerie centralisée et canaux de communication
                  </CardDescription>
                </div>
                <Button className="bg-students hover:bg-students/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Nouveau message
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                <TabsList className="grid w-full grid-cols-4 mb-6">
                  <TabsTrigger value="messages">Messages</TabsTrigger>
                  <TabsTrigger value="compose">Composer</TabsTrigger>
                  <TabsTrigger value="templates">Modèles</TabsTrigger>
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                </TabsList>

                <TabsContent value="messages" className="space-y-4">
                  <div className="flex gap-4 mb-6">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Rechercher dans les messages..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Button variant="outline">
                      <Filter className="w-4 h-4 mr-2" />
                      Filtres
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {filteredMessages.map((message) => (
                      <div key={message.id} className="flex items-center gap-4 p-4 border border-border/50 rounded-lg hover:bg-muted/30 transition-colors">
                        <div className="flex items-center gap-3">
                          {getTypeIcon(message.type)}
                          <div>
                            <p className="font-medium text-foreground">{message.subject}</p>
                            <p className="text-sm text-muted-foreground">{message.preview}</p>
                          </div>
                        </div>
                        
                        <div className="flex-1">
                          <p className="text-sm font-medium">De: {message.from}</p>
                          <p className="text-xs text-muted-foreground">À: {message.to}</p>
                        </div>
                        
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">{message.date}</p>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          {getStatusBadge(message.status)}
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="compose" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Nouveau message</CardTitle>
                      <CardDescription>Envoyer un message aux étudiants</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Destinataires</label>
                          <Input placeholder="Sélectionner les destinataires..." />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Canal</label>
                          <Input placeholder="Email + SMS" />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Objet</label>
                        <Input placeholder="Saisir l'objet du message..." />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Message</label>
                        <Textarea 
                          placeholder="Rédiger votre message..." 
                          className="min-h-[120px]"
                        />
                      </div>
                      <div className="flex gap-3">
                        <Button className="bg-students hover:bg-students/90">
                          <Send className="w-4 h-4 mr-2" />
                          Envoyer maintenant
                        </Button>
                        <Button variant="outline">
                          <Calendar className="w-4 h-4 mr-2" />
                          Programmer
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="templates" className="space-y-4">
                  <div className="text-center py-8">
                    <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Modèles de messages</h3>
                    <p className="text-muted-foreground mb-4">
                      Créez et gérez vos modèles de messages pour gagner du temps
                    </p>
                    <Button className="bg-students hover:bg-students/90">
                      <Plus className="w-4 h-4 mr-2" />
                      Créer un modèle
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="analytics" className="space-y-4">
                  <div className="text-center py-8">
                    <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Analytics de communication</h3>
                    <p className="text-muted-foreground">
                      Statistiques détaillées sur l'efficacité de vos communications
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
