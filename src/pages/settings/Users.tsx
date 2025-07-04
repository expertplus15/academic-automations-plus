import { SettingsModuleLayout } from "@/components/layouts/SettingsModuleLayout";
import { SettingsPageHeader } from "@/components/SettingsPageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Users as UsersIcon,
  Plus,
  Shield,
  Key,
  UserPlus,
  Settings,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Lock,
  Unlock,
  Crown,
  User,
  GraduationCap,
  BookOpen,
  DollarSign
} from "lucide-react";

export default function Users() {
  const users = [
    {
      id: 1,
      name: "Marie Dubois",
      email: "marie.dubois@example.com",
      role: "admin",
      status: "active",
      lastLogin: "Il y a 2h",
      avatar: null,
      institution: "Campus Principal"
    },
    {
      id: 2,
      name: "Jean Martin",
      email: "jean.martin@example.com",
      role: "teacher",
      status: "active",
      lastLogin: "Il y a 1j",
      avatar: null,
      institution: "Campus Principal"
    },
    {
      id: 3,
      name: "Sophie Leroy",
      email: "sophie.leroy@example.com",
      role: "finance",
      status: "active",
      lastLogin: "Il y a 3h",
      avatar: null,
      institution: "Antenne Lyon"
    },
    {
      id: 4,
      name: "Pierre Durand",
      email: "pierre.durand@example.com",
      role: "student",
      status: "inactive",
      lastLogin: "Il y a 2 sem",
      avatar: null,
      institution: "Campus Principal"
    }
  ];

  const roles = [
    {
      id: "admin",
      name: "Administrateur",
      description: "Accès complet au système",
      icon: Crown,
      permissions: ["read", "write", "delete", "admin"],
      userCount: 3,
      color: "bg-red-100 text-red-600"
    },
    {
      id: "teacher",
      name: "Enseignant",
      description: "Gestion des cours et étudiants",
      icon: GraduationCap,
      permissions: ["read", "write"],
      userCount: 45,
      color: "bg-blue-100 text-blue-600"
    },
    {
      id: "finance",
      name: "Finance",
      description: "Gestion financière",
      icon: DollarSign,
      permissions: ["read", "write"],
      userCount: 8,
      color: "bg-green-100 text-green-600"
    },
    {
      id: "student",
      name: "Étudiant",
      description: "Accès aux cours et services",
      icon: UsersIcon,
      permissions: ["read"],
      userCount: 2450,
      color: "bg-gray-100 text-gray-600"
    }
  ];

  const permissions = [
    { id: "read", name: "Lecture", description: "Voir les données" },
    { id: "write", name: "Écriture", description: "Modifier les données" },
    { id: "delete", name: "Suppression", description: "Supprimer les données" },
    { id: "admin", name: "Administration", description: "Gestion complète du système" }
  ];

  const getRoleInfo = (roleId: string) => {
    return roles.find(r => r.id === roleId);
  };

  const getStatusBadge = (status: string) => {
    return status === "active" ? (
      <Badge variant="default">Actif</Badge>
    ) : (
      <Badge variant="secondary">Inactif</Badge>
    );
  };

  return (
    <SettingsModuleLayout>
      <SettingsPageHeader 
        title="Utilisateurs & rôles" 
        subtitle="RBAC et contrôle d'accès" 
      />
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <Tabs defaultValue="users" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="users">Utilisateurs</TabsTrigger>
              <TabsTrigger value="roles">Rôles</TabsTrigger>
              <TabsTrigger value="permissions">Permissions</TabsTrigger>
              <TabsTrigger value="security">Sécurité</TabsTrigger>
            </TabsList>

            <TabsContent value="users" className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">Gestion des utilisateurs</h3>
                  <p className="text-muted-foreground">Gérez les comptes utilisateurs et leurs accès</p>
                </div>
                <Button>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Inviter un utilisateur
                </Button>
              </div>

              {/* Filtres et recherche */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex gap-4 items-end">
                    <div className="flex-1 space-y-2">
                      <Label>Rechercher</Label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Nom, email..." className="pl-10" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Rôle</Label>
                      <Select defaultValue="all">
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tous les rôles</SelectItem>
                          <SelectItem value="admin">Administrateur</SelectItem>
                          <SelectItem value="teacher">Enseignant</SelectItem>
                          <SelectItem value="finance">Finance</SelectItem>
                          <SelectItem value="student">Étudiant</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Statut</Label>
                      <Select defaultValue="all">
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tous</SelectItem>
                          <SelectItem value="active">Actifs</SelectItem>
                          <SelectItem value="inactive">Inactifs</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button variant="outline">
                      <Filter className="h-4 w-4 mr-2" />
                      Filtrer
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Liste des utilisateurs */}
              <div className="grid gap-4">
                {users.map((user) => {
                  const roleInfo = getRoleInfo(user.role);
                  const RoleIcon = roleInfo?.icon || UsersIcon;
                  
                  return (
                    <Card key={user.id}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={user.avatar} />
                              <AvatarFallback>
                                {user.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold">{user.name}</h4>
                                {getStatusBadge(user.status)}
                              </div>
                              <p className="text-sm text-muted-foreground">{user.email}</p>
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <RoleIcon className="h-3 w-3" />
                                  <span>{roleInfo?.name}</span>
                                </div>
                                <span>{user.institution}</span>
                                <span>Dernière connexion: {user.lastLogin}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            {user.status === "active" ? (
                              <Button variant="ghost" size="sm">
                                <Lock className="h-4 w-4" />
                              </Button>
                            ) : (
                              <Button variant="ghost" size="sm">
                                <Unlock className="h-4 w-4" />
                              </Button>
                            )}
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Formulaire d'invitation */}
              <Card>
                <CardHeader>
                  <CardTitle>Inviter un nouvel utilisateur</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input placeholder="utilisateur@example.com" />
                    </div>
                    <div className="space-y-2">
                      <Label>Rôle</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un rôle" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="teacher">Enseignant</SelectItem>
                          <SelectItem value="finance">Finance</SelectItem>
                          <SelectItem value="student">Étudiant</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Message d'invitation (optionnel)</Label>
                    <Input placeholder="Bienvenue dans notre équipe..." />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1">Annuler</Button>
                    <Button className="flex-1">Envoyer l'invitation</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="roles" className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">Gestion des rôles</h3>
                  <p className="text-muted-foreground">Définissez les rôles et leurs permissions</p>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Créer un rôle
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {roles.map((role) => {
                  const RoleIcon = role.icon;
                  return (
                    <Card key={role.id}>
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${role.color}`}>
                                <RoleIcon className="h-6 w-6" />
                              </div>
                              <div>
                                <h4 className="font-semibold">{role.name}</h4>
                                <p className="text-sm text-muted-foreground">{role.description}</p>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm">
                              <Settings className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span>Utilisateurs</span>
                              <span className="font-medium">{role.userCount}</span>
                            </div>
                            <div className="space-y-1">
                              <span className="text-sm text-muted-foreground">Permissions:</span>
                              <div className="flex flex-wrap gap-1">
                                {role.permissions.map((perm) => (
                                  <Badge key={perm} variant="outline" className="text-xs">
                                    {permissions.find(p => p.id === perm)?.name}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Création de rôle */}
              <Card>
                <CardHeader>
                  <CardTitle>Créer un nouveau rôle</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Nom du rôle</Label>
                      <Input placeholder="Ex: Coordinateur" />
                    </div>
                    <div className="space-y-2">
                      <Label>Identifiant</Label>
                      <Input placeholder="coordinator" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Input placeholder="Description du rôle..." />
                  </div>
                  <div className="space-y-3">
                    <Label>Permissions</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {permissions.map((permission) => (
                        <div key={permission.id} className="flex items-center space-x-2">
                          <input type="checkbox" id={permission.id} />
                          <label htmlFor={permission.id} className="text-sm">
                            <span className="font-medium">{permission.name}</span>
                            <span className="text-muted-foreground"> - {permission.description}</span>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1">Annuler</Button>
                    <Button className="flex-1">Créer le rôle</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="permissions" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Matrice des permissions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-3">Module / Rôle</th>
                          {roles.map((role) => (
                            <th key={role.id} className="text-center p-3 min-w-32">
                              {role.name}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {["Étudiants", "Académique", "Finance", "Examens", "Ressources"].map((module) => (
                          <tr key={module} className="border-b">
                            <td className="p-3 font-medium">{module}</td>
                            {roles.map((role) => (
                              <td key={`${module}-${role.id}`} className="p-3 text-center">
                                <div className="flex justify-center space-x-1">
                                  <input type="checkbox" defaultChecked={role.permissions.includes("read")} />
                                  <span className="text-xs">L</span>
                                  <input type="checkbox" defaultChecked={role.permissions.includes("write")} />
                                  <span className="text-xs">E</span>
                                  <input type="checkbox" defaultChecked={role.permissions.includes("delete")} />
                                  <span className="text-xs">S</span>
                                </div>
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-4 text-xs text-muted-foreground">
                    L = Lecture, E = Écriture, S = Suppression
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="h-5 w-5" />
                    Paramètres de sécurité
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Authentification à deux facteurs obligatoire</p>
                        <p className="text-sm text-muted-foreground">Exiger 2FA pour tous les administrateurs</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Durée de session (minutes)</Label>
                      <Select defaultValue="480">
                        <SelectTrigger className="w-48">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="60">60 minutes</SelectItem>
                          <SelectItem value="240">4 heures</SelectItem>
                          <SelectItem value="480">8 heures</SelectItem>
                          <SelectItem value="1440">24 heures</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Verrouillage automatique du compte</p>
                        <p className="text-sm text-muted-foreground">Après 5 tentatives de connexion échouées</p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="space-y-2">
                      <Label>Politique de mot de passe</Label>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="min-length" defaultChecked />
                          <label htmlFor="min-length" className="text-sm">Minimum 8 caractères</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="uppercase" defaultChecked />
                          <label htmlFor="uppercase" className="text-sm">Au moins une majuscule</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="numbers" defaultChecked />
                          <label htmlFor="numbers" className="text-sm">Au moins un chiffre</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="special" />
                          <label htmlFor="special" className="text-sm">Au moins un caractère spécial</label>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Expiration des mots de passe (jours)</Label>
                      <Select defaultValue="never">
                        <SelectTrigger className="w-48">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30">30 jours</SelectItem>
                          <SelectItem value="60">60 jours</SelectItem>
                          <SelectItem value="90">90 jours</SelectItem>
                          <SelectItem value="never">Jamais</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Audit et logs de sécurité</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Enregistrer les connexions</p>
                      <p className="text-sm text-muted-foreground">Tracer les connexions et déconnexions</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Enregistrer les modifications de permissions</p>
                      <p className="text-sm text-muted-foreground">Tracer les changements de rôles et permissions</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="space-y-2">
                    <Label>Rétention des logs de sécurité</Label>
                    <Select defaultValue="365">
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 jours</SelectItem>
                        <SelectItem value="90">90 jours</SelectItem>
                        <SelectItem value="365">1 an</SelectItem>
                        <SelectItem value="unlimited">Illimité</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-3">
            <Button variant="outline">Annuler</Button>
            <Button>
              <UsersIcon className="h-4 w-4 mr-2" />
              Enregistrer les modifications
            </Button>
          </div>
        </div>
      </div>
    </SettingsModuleLayout>
  );
}