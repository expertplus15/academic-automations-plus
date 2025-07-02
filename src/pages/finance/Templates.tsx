import React, { useState } from 'react';
import { ModuleLayout } from '@/components/layouts/ModuleLayout';
import { FinanceModuleSidebar } from '@/components/FinanceModuleSidebar';
import { FinancePageHeader } from '@/components/FinancePageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  Plus, 
  FileText, 
  Edit,
  Copy,
  Trash2,
  Eye
} from 'lucide-react';

export default function Templates() {
  const [searchTerm, setSearchTerm] = useState('');

  const templates = [
    {
      id: '1',
      name: 'Facture standard',
      type: 'standard',
      description: 'Modèle standard pour factures étudiants',
      isActive: true,
      usageCount: 145
    },
    {
      id: '2',
      name: 'Facture frais d\'inscription',
      type: 'inscription',
      description: 'Modèle spécifique pour les frais d\'inscription',
      isActive: true,
      usageCount: 89
    },
    {
      id: '3',
      name: 'Facture hébergement',
      type: 'accommodation',
      description: 'Modèle pour facturer l\'hébergement',
      isActive: true,
      usageCount: 56
    },
    {
      id: '4',
      name: 'Facture formation continue',
      type: 'formation',
      description: 'Modèle pour formation professionnelle',
      isActive: false,
      usageCount: 23
    }
  ];

  const stats = [
    {
      label: "Modèles actifs",
      value: templates.filter(t => t.isActive).length.toString(),
      change: "+1",
      changeType: "positive" as const
    },
    {
      label: "Utilisations totales",
      value: templates.reduce((sum, t) => sum + t.usageCount, 0).toString(),
      change: "+12",
      changeType: "positive" as const
    },
    {
      label: "Modèles personnalisés",
      value: "2",
      change: "0",
      changeType: "neutral" as const
    },
    {
      label: "Types disponibles",
      value: "4",
      change: "+1",
      changeType: "positive" as const
    }
  ];

  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ModuleLayout sidebar={<FinanceModuleSidebar />}>
      <div className="p-8 space-y-8">
        <FinancePageHeader
          title="Modèles de factures"
          subtitle="Gestion des modèles et templates"
          stats={stats}
          showCreateButton={true}
          createButtonText="Nouveau modèle"
          showExportButton={true}
          showBackButton={true}
          backPath="/finance"
        />

        {/* Filtres et recherche */}
        <Card className="bg-white rounded-2xl shadow-sm border-0">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher un modèle..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="gap-2">
                  <FileText className="w-4 h-4" />
                  Type
                </Button>
                <Button variant="outline" className="gap-2">
                  <Badge className="w-4 h-4" />
                  Statut
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Liste des modèles */}
        <Card className="bg-white rounded-2xl shadow-sm border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-[rgb(245,158,11)]" />
              Modèles disponibles ({filteredTemplates.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredTemplates.map((template) => (
                <div
                  key={template.id}
                  className="flex items-center justify-between p-4 rounded-xl border border-border/50 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-[rgb(245,158,11)]/10 rounded-xl">
                      <FileText className="w-5 h-5 text-[rgb(245,158,11)]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-foreground">{template.name}</p>
                        <Badge variant="outline" className="text-xs">
                          {template.type}
                        </Badge>
                        <Badge className={template.isActive ? 
                          "bg-green-100 text-green-700 border-green-200" : 
                          "bg-red-100 text-red-700 border-red-200"
                        }>
                          {template.isActive ? 'Actif' : 'Inactif'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{template.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Utilisé {template.usageCount} fois
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" className="gap-1">
                      <Eye className="w-3 h-3" />
                      Prévisualiser
                    </Button>
                    <Button size="sm" variant="outline" className="gap-1">
                      <Copy className="w-3 h-3" />
                      Dupliquer
                    </Button>
                    <Button size="sm" variant="outline" className="gap-1">
                      <Edit className="w-3 h-3" />
                      Éditer
                    </Button>
                    <Button size="sm" variant="outline" className="gap-1 text-red-600 hover:text-red-700">
                      <Trash2 className="w-3 h-3" />
                      Supprimer
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </ModuleLayout>
  );
}