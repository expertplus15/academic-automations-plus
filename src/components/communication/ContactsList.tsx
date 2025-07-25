import React, { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Search, MessageSquare, Mail, Phone } from 'lucide-react';

export const ContactsList = memo(function ContactsList() {
  const contacts = [
    {
      id: 1,
      name: 'Marie Dupont',
      email: 'marie.dupont@univ.fr',
      role: 'Étudiante',
      program: 'Master Informatique',
      status: 'online'
    },
    {
      id: 2,
      name: 'Prof. Jean Martin',
      email: 'jean.martin@univ.fr',
      role: 'Enseignant',
      department: 'Informatique',
      status: 'offline'
    },
    {
      id: 3,
      name: 'Sophie Bernard',
      email: 'sophie.bernard@univ.fr',
      role: 'Étudiante',
      program: 'Licence Mathématiques',
      status: 'away'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'Enseignant': return 'bg-primary/10 text-primary';
      case 'Étudiante':
      case 'Étudiant': return 'bg-green-500/10 text-green-500';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Rechercher un contact
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Input placeholder="Nom, email ou rôle..." />
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {contacts.map((contact) => (
          <Card key={contact.id} className="hover:shadow-md transition-all">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar>
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {contact.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(contact.status)}`}></div>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">{contact.name}</h4>
                    <p className="text-sm text-muted-foreground">{contact.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={getRoleBadgeColor(contact.role)}>
                        {contact.role}
                      </Badge>
                      {contact.program && (
                        <span className="text-xs text-muted-foreground">{contact.program}</span>
                      )}
                      {contact.department && (
                        <span className="text-xs text-muted-foreground">{contact.department}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline">
                    <MessageSquare className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Mail className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Phone className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
});