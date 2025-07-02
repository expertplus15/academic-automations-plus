import React, { useState } from 'react';
import { ModuleLayout } from '@/components/layouts/ModuleLayout';
import { FinanceModuleSidebar } from '@/components/FinanceModuleSidebar';
import { FinancePageHeader } from '@/components/FinancePageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Calendar,
  Eye,
  Edit,
  Pause,
  Play,
  Trash2
} from 'lucide-react';

export default function Schedules() {
  const [searchTerm, setSearchTerm] = useState('');

  const schedules = [
    {
      id: '1',
      name: 'Échéancier frais de scolarité',
      student: 'Marie Dubois',
      studentNumber: 'ETU240001',
      totalAmount: 2500,
      installments: 3,
      paidInstallments: 2,
      nextDueDate: '2024-02-15',
      status: 'active'
    },
    {
      id: '2',
      name: 'Échéancier hébergement',
      student: 'Jean Martin',
      studentNumber: 'ETU240002',
      totalAmount: 3600,
      installments: 12,
      paidInstallments: 8,
      nextDueDate: '2024-02-01',
      status: 'active'
    },
    {
      id: '3',
      name: 'Échéancier formation continue',
      student: 'Sophie Laurent',
      studentNumber: 'ETU240003',
      totalAmount: 1800,
      installments: 6,
      paidInstallments: 6,
      nextDueDate: null,
      status: 'completed'
    },
    {
      id: '4',
      name: 'Échéancier matériel',
      student: 'Pierre Durand',
      studentNumber: 'ETU240004',
      totalAmount: 800,
      installments: 4,
      paidInstallments: 0,
      nextDueDate: '2024-01-30',
      status: 'overdue'
    }
  ];

  const stats = [
    {
      label: "Échéanciers actifs",
      value: schedules.filter(s => s.status === 'active').length.toString(),
      change: "+2",
      changeType: "positive" as const
    },
    {
      label: "Total à recevoir",
      value: `€${schedules.filter(s => s.status === 'active').reduce((sum, s) => sum + (s.totalAmount - (s.totalAmount / s.installments * s.paidInstallments)), 0).toLocaleString()}`,
      change: "-8%",
      changeType: "positive" as const
    },
    {
      label: "Échéances en retard",
      value: schedules.filter(s => s.status === 'overdue').length.toString(),
      change: "+1",
      changeType: "negative" as const
    },
    {
      label: "Taux de recouvrement",
      value: "85.2%",
      change: "+3.1%",
      changeType: "positive" as const
    }
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "bg-blue-100 text-blue-700 border-blue-200",
      completed: "bg-green-100 text-green-700 border-green-200",
      overdue: "bg-red-100 text-red-700 border-red-200",
      paused: "bg-yellow-100 text-yellow-700 border-yellow-200"
    };

    const labels = {
      active: "Actif",
      completed: "Terminé",
      overdue: "En retard",
      paused: "Suspendu"
    };

    return (
      <Badge className={variants[status as keyof typeof variants] || variants.active}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    );
  };

  const filteredSchedules = schedules.filter(schedule =>
    schedule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    schedule.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
    schedule.studentNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ModuleLayout sidebar={<FinanceModuleSidebar />}>
      <div className="p-8 space-y-8">
        <FinancePageHeader
          title="Échéanciers"
          subtitle="Gestion des plans de paiement"
          stats={stats}
          showCreateButton={true}
          createButtonText="Nouvel échéancier"
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
                    placeholder="Rechercher par nom, étudiant..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="gap-2">
                  <Badge className="w-4 h-4" />
                  Statut
                </Button>
                <Button variant="outline" className="gap-2">
                  <Calendar className="w-4 h-4" />
                  Échéance
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Liste des échéanciers */}
        <Card className="bg-white rounded-2xl shadow-sm border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[rgb(245,158,11)]" />
              Échéanciers ({filteredSchedules.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredSchedules.map((schedule) => (
                <div
                  key={schedule.id}
                  className="flex items-center justify-between p-4 rounded-xl border border-border/50 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-[rgb(245,158,11)]/10 rounded-xl">
                      <Calendar className="w-5 h-5 text-[rgb(245,158,11)]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-foreground">{schedule.name}</p>
                        {getStatusBadge(schedule.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {schedule.student} • {schedule.studentNumber}
                      </p>
                      <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                        <span>
                          Échéances: {schedule.paidInstallments}/{schedule.installments}
                        </span>
                        <span>Total: €{schedule.totalAmount.toLocaleString()}</span>
                        {schedule.nextDueDate && (
                          <span>Prochaine: {new Date(schedule.nextDueDate).toLocaleDateString('fr-FR')}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right space-y-1">
                    <div className="flex items-center gap-2 justify-end">
                      <span className="font-semibold text-foreground text-lg">
                        €{(schedule.totalAmount - (schedule.totalAmount / schedule.installments * schedule.paidInstallments)).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Restant à payer
                    </p>
                    <div className="w-32 bg-muted rounded-full h-2">
                      <div 
                        className="bg-[rgb(245,158,11)] h-2 rounded-full" 
                        style={{ width: `${(schedule.paidInstallments / schedule.installments) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" className="gap-1">
                      <Eye className="w-3 h-3" />
                      Détails
                    </Button>
                    <Button size="sm" variant="outline" className="gap-1">
                      <Edit className="w-3 h-3" />
                      Modifier
                    </Button>
                    {schedule.status === 'active' ? (
                      <Button size="sm" variant="outline" className="gap-1">
                        <Pause className="w-3 h-3" />
                        Suspendre
                      </Button>
                    ) : schedule.status === 'paused' ? (
                      <Button size="sm" variant="outline" className="gap-1">
                        <Play className="w-3 h-3" />
                        Reprendre
                      </Button>
                    ) : null}
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