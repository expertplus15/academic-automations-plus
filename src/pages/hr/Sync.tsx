import React, { useState } from 'react';
import { ModuleLayout } from '@/components/layouts/ModuleLayout';
import { HrModuleSidebar } from '@/components/HrModuleSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  RefreshCw,
  Search,
  Play,
  Pause,
  AlertTriangle,
  CheckCircle,
  Clock,
  Settings,
  ArrowRight,
  Database,
  Zap,
  RotateCcw
} from 'lucide-react';
import { useModuleSync } from '@/hooks/module-sync/useModuleSync';
import { useToast } from '@/hooks/use-toast';

export default function Sync() {
  const { 
    syncOperations, 
    syncConfigurations, 
    loading, 
    error, 
    triggerSync, 
    updateConfiguration,
    retryFailedOperation 
  } = useModuleSync();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOperations = syncOperations.filter(operation =>
    operation.source_module.toLowerCase().includes(searchTerm.toLowerCase()) ||
    operation.target_module.toLowerCase().includes(searchTerm.toLowerCase()) ||
    operation.operation_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    operation.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-700 border-green-200"><CheckCircle className="w-3 h-3 mr-1" />Terminé</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-100 text-blue-700 border-blue-200"><Clock className="w-3 h-3 mr-1" />En cours</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-700 border-red-200"><AlertTriangle className="w-3 h-3 mr-1" />Échec</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200"><Clock className="w-3 h-3 mr-1" />En attente</Badge>;
      case 'cancelled':
        return <Badge className="bg-gray-100 text-gray-700 border-gray-200">Annulé</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getModuleIcon = (module: string) => {
    switch (module) {
      case 'hr': return '👥';
      case 'academic': return '🎓';
      case 'finance': return '💰';
      case 'students': return '📚';
      default: return '🔧';
    }
  };

  const getOperationTypeLabel = (type: string) => {
    switch (type) {
      case 'teacher_assignment': return 'Affectation Enseignant';
      case 'salary_sync': return 'Synchronisation Salaire';
      case 'contract_sync': return 'Synchronisation Contrat';
      case 'availability_sync': return 'Synchronisation Disponibilité';
      case 'performance_sync': return 'Synchronisation Performance';
      default: return type;
    }
  };

  const handleTriggerSync = async (configId: string) => {
    const result = await triggerSync(configId);
    if (result.success) {
      toast({
        title: "Synchronisation lancée",
        description: "L'opération de synchronisation a été démarrée avec succès.",
      });
    } else {
      toast({
        title: "Erreur",
        description: result.error,
        variant: "destructive",
      });
    }
  };

  const handleToggleConfig = async (configId: string, enabled: boolean) => {
    const result = await updateConfiguration(configId, { is_enabled: enabled });
    if (result.success) {
      toast({
        title: enabled ? "Synchronisation activée" : "Synchronisation désactivée",
        description: `La configuration a été ${enabled ? 'activée' : 'désactivée'} avec succès.`,
      });
    } else {
      toast({
        title: "Erreur",
        description: result.error,
        variant: "destructive",
      });
    }
  };

  const handleRetryOperation = async (operationId: string) => {
    const result = await retryFailedOperation(operationId);
    if (result.success) {
      toast({
        title: "Opération relancée",
        description: "L'opération a été relancée avec succès.",
      });
    } else {
      toast({
        title: "Erreur",
        description: result.error,
        variant: "destructive",
      });
    }
  };

  const stats = [
    {
      label: "Opérations totales",
      value: syncOperations.length,
      icon: Database
    },
    {
      label: "Synchronisations actives",
      value: syncConfigurations.filter(c => c.is_enabled).length,
      icon: Zap
    },
    {
      label: "Succès",
      value: syncOperations.filter(o => o.status === 'completed').length,
      icon: CheckCircle
    },
    {
      label: "En échec",
      value: syncOperations.filter(o => o.status === 'failed').length,
      icon: AlertTriangle
    }
  ];

  if (loading) {
    return (
      <ModuleLayout sidebar={<HrModuleSidebar />}>
        <div className="p-8">
          <div className="text-center">Chargement...</div>
        </div>
      </ModuleLayout>
    );
  }

  if (error) {
    return (
      <ModuleLayout sidebar={<HrModuleSidebar />}>
        <div className="p-8">
          <div className="text-center text-red-600">Erreur: {error}</div>
        </div>
      </ModuleLayout>
    );
  }

  return (
    <ModuleLayout sidebar={<HrModuleSidebar />}>
      <div className="p-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Synchronisation Inter-Modules</h1>
            <p className="text-muted-foreground mt-1">Gestion des synchronisations RH ↔ Académique ↔ Finance</p>
          </div>
          <Button className="bg-amber-500 hover:bg-amber-600 text-white">
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualiser
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="bg-white rounded-2xl shadow-sm border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    </div>
                    <div className="p-3 bg-amber-100 rounded-xl">
                      <Icon className="w-6 h-6 text-amber-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Search */}
        <Card className="bg-white rounded-2xl shadow-sm border-0">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Rechercher par module, type d'opération ou statut..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="operations" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="operations">Opérations</TabsTrigger>
            <TabsTrigger value="configurations">Configurations</TabsTrigger>
          </TabsList>

          {/* Operations Tab */}
          <TabsContent value="operations">
            <Card className="bg-white rounded-2xl shadow-sm border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RefreshCw className="w-5 h-5 text-amber-500" />
                  Historique des Synchronisations ({filteredOperations.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredOperations.map((operation) => (
                    <div
                      key={operation.id}
                      className="flex items-center justify-between p-4 rounded-xl border border-border/50 hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="flex items-center gap-2 text-2xl">
                          <span>{getModuleIcon(operation.source_module)}</span>
                          <ArrowRight className="w-4 h-4 text-muted-foreground" />
                          <span>{getModuleIcon(operation.target_module)}</span>
                        </div>
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-3">
                            <h3 className="font-semibold text-foreground">
                              {getOperationTypeLabel(operation.operation_type)}
                            </h3>
                            {getStatusBadge(operation.status)}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>
                              {operation.source_module.toUpperCase()} → {operation.target_module.toUpperCase()}
                            </span>
                            <span>ID: {operation.entity_id}</span>
                            <span>
                              {new Date(operation.triggered_at).toLocaleString('fr-FR')}
                            </span>
                            {operation.retry_count > 0 && (
                              <span className="text-yellow-600">
                                Tentatives: {operation.retry_count}/{operation.max_retries}
                              </span>
                            )}
                          </div>
                          {operation.status === 'in_progress' && (
                            <Progress value={65} className="h-2 mt-2" />
                          )}
                          {operation.error_message && (
                            <p className="text-sm text-red-600 mt-1">{operation.error_message}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {operation.status === 'failed' && operation.retry_count < operation.max_retries && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleRetryOperation(operation.id)}
                          >
                            <RotateCcw className="w-4 h-4" />
                          </Button>
                        )}
                        <Button variant="outline" size="sm">
                          <Settings className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  {filteredOperations.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <RefreshCw className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>Aucune opération de synchronisation trouvée</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Configurations Tab */}
          <TabsContent value="configurations">
            <Card className="bg-white rounded-2xl shadow-sm border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-amber-500" />
                  Configurations de Synchronisation ({syncConfigurations.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {syncConfigurations.map((config) => (
                    <div
                      key={config.id}
                      className="flex items-center justify-between p-4 rounded-xl border border-border/50 hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="flex items-center gap-2 text-2xl">
                          <span>{getModuleIcon(config.source_module)}</span>
                          <ArrowRight className="w-4 h-4 text-muted-foreground" />
                          <span>{getModuleIcon(config.target_module)}</span>
                        </div>
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-3">
                            <h3 className="font-semibold text-foreground">
                              {getOperationTypeLabel(config.operation_type)}
                            </h3>
                            <Badge variant={config.is_enabled ? "default" : "secondary"}>
                              {config.is_enabled ? 'Activé' : 'Désactivé'}
                            </Badge>
                            {config.auto_sync && (
                              <Badge variant="outline">Auto</Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>
                              {config.source_module.toUpperCase()} → {config.target_module.toUpperCase()}
                            </span>
                            <span>Fréquence: {config.sync_frequency || 'Manuel'}</span>
                            {config.last_sync_at && (
                              <span>
                                Dernière sync: {new Date(config.last_sync_at).toLocaleString('fr-FR')}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Switch
                          checked={config.is_enabled}
                          onCheckedChange={(checked) => handleToggleConfig(config.id, checked)}
                        />
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleTriggerSync(config.id)}
                          disabled={!config.is_enabled}
                        >
                          <Play className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Settings className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  {syncConfigurations.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Settings className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>Aucune configuration trouvée</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ModuleLayout>
  );
}