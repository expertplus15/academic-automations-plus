import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';
import { EmptyState } from '@/components/common/EmptyState';
import { useHRModule } from '@/hooks/useHRModule';
import { formatTeacherCount, formatContractCount } from '@/utils/pluralization';
import { getMessage } from '@/constants/messages';
import { 
  Users, 
  UserPlus, 
  FileText, 
  Upload,
  Download,
  Search,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';

export default function HRDashboard() {
  const { teachers, contracts, stats, loading, error, addTeacher, importTeachers } = useHRModule();

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center">{getMessage('info.loading')}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="text-center text-red-600">{error}</div>
      </div>
    );
  }

  // Show empty state if no teachers exist
  if (!stats.hasData) {
    return (
      <div className="p-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Ressources Humaines</h1>
            <p className="text-muted-foreground">Référentiel maître enseignants</p>
          </div>
        </div>

        <EmptyState
          icon={Users}
          title={getMessage('modules.hr.noTeachers')}
          description="Commencez par importer ou ajouter des enseignants au système pour gérer les ressources humaines."
          actionLabel="Ajouter un enseignant"
          onAction={() => console.log('Add teacher')}
          variant="centered"
        />

        {/* Quick actions for empty state */}
        <div className="flex justify-center gap-4">
          <Button 
            onClick={() => console.log('Import teachers')}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Upload className="w-4 h-4 mr-2" />
            Importer depuis Excel
          </Button>
          <Button 
            variant="outline"
            onClick={() => console.log('Download template')}
          >
            <Download className="w-4 h-4 mr-2" />
            Télécharger modèle
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Ressources Humaines</h1>
          <p className="text-muted-foreground">Référentiel maître enseignants</p>
        </div>
        
        <div className="flex gap-3">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <UserPlus className="w-4 h-4 mr-2" />
            Ajouter enseignant
          </Button>
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Import Excel
          </Button>
          <Button variant="outline">
            <Search className="w-4 h-4 mr-2" />
            Rechercher
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white rounded-2xl shadow-sm border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{formatTeacherCount(stats.totalTeachers)}</p>
                <p className="text-2xl font-bold text-foreground">{stats.totalTeachers}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <StatusBadge variant="success-outline" size="sm">
                <CheckCircle className="w-3 h-3 mr-1" />
                {formatTeacherCount(stats.activeTeachers)} actifs
              </StatusBadge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-2xl shadow-sm border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{formatContractCount(stats.totalContracts)}</p>
                <p className="text-2xl font-bold text-foreground">{stats.totalContracts}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <StatusBadge variant="success-outline" size="sm">
                <CheckCircle className="w-3 h-3 mr-1" />
                {formatContractCount(stats.activeContracts)} actifs
              </StatusBadge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-2xl shadow-sm border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Recrutements</p>
                <p className="text-2xl font-bold text-foreground">{stats.pendingTeachers}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-xl">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              {stats.pendingTeachers > 0 ? (
                <StatusBadge variant="warning-outline" size="sm">
                  <Clock className="w-3 h-3 mr-1" />
                  En cours
                </StatusBadge>
              ) : (
                <StatusBadge variant="success-outline" size="sm">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  À jour
                </StatusBadge>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-2xl shadow-sm border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Contrats expirant</p>
                <p className="text-2xl font-bold text-foreground">{stats.expiringSoon}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-xl">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              {stats.expiringSoon > 0 ? (
                <StatusBadge variant="critical-outline" size="sm">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Attention requise
                </StatusBadge>
              ) : (
                <StatusBadge variant="success-outline" size="sm">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  OK
                </StatusBadge>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Teachers List */}
      <Card className="bg-white rounded-2xl shadow-sm border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Liste des enseignants
          </CardTitle>
        </CardHeader>
        <CardContent>
          {teachers.length > 0 ? (
            <div className="space-y-4">
              {teachers.map((teacher) => (
                <div
                  key={teacher.id}
                  className="flex items-center justify-between p-4 rounded-xl border border-border/50 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Users className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{teacher.full_name}</p>
                      <p className="text-sm text-muted-foreground">{teacher.email}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">📍 {teacher.department}</span>
                        <span className="text-xs text-muted-foreground">💼 {teacher.contract_type}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <StatusBadge
                      variant={teacher.status === 'active' ? 'success-outline' : 'warning-outline'}
                      size="sm"
                    >
                      {teacher.status === 'active' ? 'Actif' : 'Inactif'}
                    </StatusBadge>
                    <Button variant="ghost" size="sm">
                      Modifier
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Users}
              title="Aucun enseignant trouvé"
              description="Commencez par ajouter des enseignants au système."
              actionLabel="Ajouter un enseignant"
              onAction={() => console.log('Add teacher')}
              variant="compact"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}