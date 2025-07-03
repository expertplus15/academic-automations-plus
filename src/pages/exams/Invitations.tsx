import { useState } from 'react';
import { ExamsModuleLayout } from "@/components/layouts/ExamsModuleLayout";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InvitationTemplates } from '@/components/exams/invitations/InvitationTemplates';
import { BulkInvitations } from '@/components/exams/invitations/BulkInvitations';
import { 
  Mail, 
  FileText, 
  Users, 
  Send,
  BarChart3,
  CheckCircle
} from 'lucide-react';

export default function Invitations() {
  const stats = [
    {
      title: "Invitations envoyées",
      value: "1,247",
      change: "+12%",
      trend: "up",
      icon: Send
    },
    {
      title: "Taux de réception",
      value: "98.5%",
      change: "+1.2%", 
      trend: "up",
      icon: Mail
    },
    {
      title: "Accusés de réception",
      value: "892",
      change: "+8%",
      trend: "up", 
      icon: CheckCircle
    },
    {
      title: "Templates actifs",
      value: "12",
      change: "+2",
      trend: "up",
      icon: FileText
    }
  ];

  return (
    <ExamsModuleLayout 
      title="Convocations Massives"
      subtitle="Génération automatique et envoi groupé de convocations"
    >
      <div className="p-8 space-y-8">
        
        {/* Stats rapides */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-white rounded-2xl shadow-sm border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <div className="flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-600">{stat.change}</span>
                    </div>
                  </div>
                  <div className="p-3 bg-violet-100 rounded-xl">
                    <stat.icon className="w-6 h-6 text-violet-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Interface à onglets */}
        <Tabs defaultValue="bulk" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="bulk" className="flex items-center gap-2">
              <Send className="w-4 h-4" />
              Envoi Groupé
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Modèles
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bulk" className="space-y-6">
            <BulkInvitations />
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <InvitationTemplates />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card className="bg-white rounded-2xl shadow-sm border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-violet-500" />
                  Analytics des convocations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Analytics détaillées des convocations</p>
                    <p className="text-sm mt-1">Statistiques d'envoi, taux de réception, performances</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ExamsModuleLayout>
  );
}