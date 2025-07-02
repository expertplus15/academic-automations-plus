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
import { 
  Search, 
  Plus, 
  Calendar, 
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  Lock
} from 'lucide-react';

interface FiscalYear {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  status: 'active' | 'closed' | 'planning';
  is_current: boolean;
}

export default function FiscalYears() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    start_date: '',
    end_date: ''
  });

  // Mock data
  const fiscalYears: FiscalYear[] = [
    {
      id: '1',
      name: '2024-2025',
      start_date: '2024-09-01',
      end_date: '2025-08-31',
      status: 'active',
      is_current: true
    },
    {
      id: '2',
      name: '2023-2024',
      start_date: '2023-09-01',
      end_date: '2024-08-31',
      status: 'closed',
      is_current: false
    },
    {
      id: '3',
      name: '2025-2026',
      start_date: '2025-09-01',
      end_date: '2026-08-31',
      status: 'planning',
      is_current: false
    }
  ];

  const stats = [
    {
      label: "Année actuelle",
      value: fiscalYears.find(y => y.is_current)?.name || "Aucune",
      change: "2024-2025",
      changeType: "positive" as const
    },
    {
      label: "Années actives",
      value: fiscalYears.filter(y => y.status === 'active').length.toString(),
      change: "+1",
      changeType: "positive" as const
    },
    {
      label: "Années fermées",
      value: fiscalYears.filter(y => y.status === 'closed').length.toString(),
      change: "1",
      changeType: "neutral" as const
    },
    {
      label: "En planification",
      value: fiscalYears.filter(y => y.status === 'planning').length.toString(),
      change: "+1",
      changeType: "positive" as const
    }
  ];

  const getStatusBadge = (status: string, isCurrent: boolean) => {
    if (isCurrent) {
      return <Badge className="bg-blue-100 text-blue-700 border-blue-200">Courante</Badge>;
    }
    
    const variants = {
      active: "bg-green-100 text-green-700 border-green-200",
      closed: "bg-gray-100 text-gray-700 border-gray-200",
      planning: "bg-yellow-100 text-yellow-700 border-yellow-200"
    };

    const labels = {
      active: "Active",
      closed: "Fermée",
      planning: "Planification"
    };

    return (
      <Badge className={variants[status as keyof typeof variants]}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'closed':
        return <Lock className="w-5 h-5 text-gray-600" />;
      case 'planning':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      default:
        return <Calendar className="w-5 h-5 text-[rgb(245,158,11)]" />;
    }
  };

  const filteredYears = fiscalYears.filter(year =>
    year.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating fiscal year:', formData);
    setShowForm(false);
    setFormData({
      name: '',
      start_date: '',
      end_date: ''
    });
  };

  return (
    <ModuleLayout sidebar={<FinanceModuleSidebar />}>
      <div className="p-8 space-y-8">
        <FinancePageHeader
          title="Années fiscales"
          subtitle="Gestion des périodes comptables"
          stats={stats}
          showCreateButton={false}
          showExportButton={true}
          showBackButton={true}
          backPath="/finance"
        />

        {/* Filtres et actions */}
        <Card className="bg-white rounded-2xl shadow-sm border-0">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher une année fiscale..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Dialog open={showForm} onOpenChange={setShowForm}>
                <DialogTrigger asChild>
                  <Button className="gap-2 bg-[rgb(245,158,11)] hover:bg-[rgb(245,158,11)]/90">
                    <Plus className="w-4 h-4" />
                    Nouvelle année
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Nouvelle année fiscale</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nom de l'année</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Ex: 2025-2026"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="start_date">Date de début</Label>
                        <Input
                          id="start_date"
                          type="date"
                          value={formData.start_date}
                          onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="end_date">Date de fin</Label>
                        <Input
                          id="end_date"
                          type="date"
                          value={formData.end_date}
                          onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                          required
                        />
                      </div>
                    </div>
                    <div className="flex gap-3 pt-4">
                      <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="flex-1">
                        Annuler
                      </Button>
                      <Button type="submit" className="flex-1 bg-[rgb(245,158,11)] hover:bg-[rgb(245,158,11)]/90">
                        Créer
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        {/* Liste des années */}
        <Card className="bg-white rounded-2xl shadow-sm border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[rgb(245,158,11)]" />
              Années fiscales ({filteredYears.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredYears.map((year) => (
                <div
                  key={year.id}
                  className="flex items-center justify-between p-4 rounded-xl border border-border/50 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-[rgb(245,158,11)]/10 rounded-xl">
                      {getStatusIcon(year.status)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-foreground text-lg">{year.name}</p>
                        {getStatusBadge(year.status, year.is_current)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Du {new Date(year.start_date).toLocaleDateString('fr-FR')} 
                        au {new Date(year.end_date).toLocaleDateString('fr-FR')}
                      </p>
                      <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                        <span>
                          Durée: {Math.round((new Date(year.end_date).getTime() - new Date(year.start_date).getTime()) / (1000 * 60 * 60 * 24))} jours
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {year.status === 'planning' && (
                      <Button size="sm" className="gap-1 bg-[rgb(245,158,11)] hover:bg-[rgb(245,158,11)]/90">
                        <CheckCircle className="w-3 h-3" />
                        Activer
                      </Button>
                    )}
                    {year.status === 'active' && !year.is_current && (
                      <Button size="sm" variant="outline" className="gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Définir courante
                      </Button>
                    )}
                    <Button size="sm" variant="outline" className="gap-1">
                      <Edit className="w-3 h-3" />
                      Éditer
                    </Button>
                    {year.status !== 'closed' && (
                      <Button size="sm" variant="outline" className="gap-1 text-red-600 hover:text-red-700">
                        <Lock className="w-3 h-3" />
                        Fermer
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Actions rapides */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white rounded-2xl shadow-sm border-0">
            <CardHeader>
              <CardTitle className="text-lg">Clôture d'année</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Fermer l'année fiscale actuelle et préparer la suivante
              </p>
              <Button variant="outline" className="w-full gap-2">
                <Lock className="w-4 h-4" />
                Processus de clôture
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white rounded-2xl shadow-sm border-0">
            <CardHeader>
              <CardTitle className="text-lg">Rapport annuel</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Générer le rapport financier de l'année
              </p>
              <Button variant="outline" className="w-full gap-2">
                <Calendar className="w-4 h-4" />
                Générer rapport
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white rounded-2xl shadow-sm border-0">
            <CardHeader>
              <CardTitle className="text-lg">Planification</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Planifier les années fiscales futures
              </p>
              <Button variant="outline" className="w-full gap-2">
                <Clock className="w-4 h-4" />
                Assistant planification
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </ModuleLayout>
  );
}