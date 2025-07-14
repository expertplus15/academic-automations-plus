import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Users, CheckCircle, Clock, AlertTriangle, Settings } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ApprovalSettingsProps {
  data: any;
  onDataChange: (data: any) => void;
}

interface Approver {
  id: string;
  full_name: string;
  email: string;
  role: string;
}

export function ApprovalSettings({ data, onDataChange }: ApprovalSettingsProps) {
  const [approvers, setApprovers] = useState<Approver[]>([]);
  const [loading, setLoading] = useState(true);
  const [approvalSettings, setApprovalSettings] = useState({
    isRequired: data.template?.requires_approval || false,
    workflow: 'single', // single, sequential, parallel
    approvers: [] as string[],
    deadlineHours: 48,
    comments: '',
    autoReminder: true,
    reminderInterval: 24,
    priority: 'normal',
    ...data.approvalSettings
  });

  useEffect(() => {
    loadApprovers();
  }, []);

  useEffect(() => {
    onDataChange({ 
      ...data, 
      approvalSettings: approvalSettings.isRequired ? approvalSettings : null 
    });
  }, [approvalSettings]);

  const loadApprovers = async () => {
    try {
      const { data: approversData, error } = await supabase
        .from('profiles')
        .select('id, full_name, email, role')
        .in('role', ['admin', 'teacher'])
        .order('full_name');

      if (error) throw error;
      setApprovers(approversData || []);
    } catch (error) {
      console.error('Erreur lors du chargement des approbateurs:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = (updates: Partial<typeof approvalSettings>) => {
    setApprovalSettings(prev => ({ ...prev, ...updates }));
  };

  const handleApproverToggle = (approverId: string) => {
    const newApprovers = approvalSettings.approvers.includes(approverId)
      ? approvalSettings.approvers.filter(id => id !== approverId)
      : [...approvalSettings.approvers, approverId];
    
    updateSettings({ approvers: newApprovers });
  };

  const workflowOptions = [
    {
      value: 'single',
      label: 'Approbation simple',
      description: 'Un seul approbateur suffit'
    },
    {
      value: 'sequential',
      label: 'Approbation séquentielle',
      description: 'Approbation dans l\'ordre défini'
    },
    {
      value: 'parallel',
      label: 'Approbation parallèle',
      description: 'Tous les approbateurs doivent approuver'
    }
  ];

  const priorityOptions = [
    { value: 'low', label: 'Basse', color: 'bg-gray-500' },
    { value: 'normal', label: 'Normale', color: 'bg-blue-500' },
    { value: 'high', label: 'Haute', color: 'bg-orange-500' },
    { value: 'urgent', label: 'Urgente', color: 'bg-red-500' }
  ];

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-4 bg-muted rounded w-1/4 animate-pulse"></div>
        <div className="space-y-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-12 bg-muted rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Configuration principale */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-base">
            <Settings className="w-4 h-4 mr-2" />
            Configuration de l'approbation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="requireApproval"
              checked={approvalSettings.isRequired}
              onCheckedChange={(checked) => updateSettings({ isRequired: !!checked })}
            />
            <label htmlFor="requireApproval" className="text-sm font-medium">
              Requérir une approbation avant génération finale
            </label>
          </div>

          {data.template?.requires_approval && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-blue-800">
                  Ce template requiert obligatoirement une approbation
                </span>
              </div>
            </div>
          )}

          {approvalSettings.isRequired && (
            <div className="space-y-4 pt-4 border-t">
              {/* Type de workflow */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Type d'approbation
                </label>
                <Select 
                  value={approvalSettings.workflow} 
                  onValueChange={(value) => updateSettings({ workflow: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {workflowOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        <div>
                          <div className="font-medium">{option.label}</div>
                          <div className="text-xs text-muted-foreground">{option.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Priorité */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Priorité de la demande
                </label>
                <Select 
                  value={approvalSettings.priority} 
                  onValueChange={(value) => updateSettings({ priority: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {priorityOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${option.color}`}></div>
                          <span>{option.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Délai d'approbation */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Délai d'approbation (heures)
                </label>
                <Input
                  type="number"
                  value={approvalSettings.deadlineHours}
                  onChange={(e) => updateSettings({ deadlineHours: parseInt(e.target.value) || 48 })}
                  min="1"
                  max="168"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Délai après lequel une relance automatique sera envoyée
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sélection des approbateurs */}
      {approvalSettings.isRequired && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-base">
              <Users className="w-4 h-4 mr-2" />
              Sélection des approbateurs
            </CardTitle>
          </CardHeader>
          <CardContent>
            {approvers.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h4 className="font-medium mb-2">Aucun approbateur disponible</h4>
                <p className="text-sm text-muted-foreground">
                  Contactez l'administrateur pour configurer les approbateurs.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {approvers.map(approver => (
                  <div
                    key={approver.id}
                    className={`
                      flex items-center justify-between p-3 rounded-lg border transition-all
                      ${approvalSettings.approvers.includes(approver.id) 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:bg-muted/50'
                      }
                    `}
                  >
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        checked={approvalSettings.approvers.includes(approver.id)}
                        onCheckedChange={() => handleApproverToggle(approver.id)}
                      />
                      <div>
                        <h4 className="font-medium">{approver.full_name}</h4>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <span>{approver.email}</span>
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {approver.role}
                    </Badge>
                  </div>
                ))}

                {approvalSettings.approvers.length > 0 && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-800">
                        {approvalSettings.approvers.length} approbateur(s) sélectionné(s)
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Options avancées */}
      {approvalSettings.isRequired && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Options avancées</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="autoReminder"
                  checked={approvalSettings.autoReminder}
                  onCheckedChange={(checked) => updateSettings({ autoReminder: !!checked })}
                />
                <label htmlFor="autoReminder" className="text-sm">
                  Envoyer des rappels automatiques
                </label>
              </div>

              {approvalSettings.autoReminder && (
                <div className="ml-6">
                  <label className="text-sm font-medium mb-1 block">
                    Intervalle de rappel (heures)
                  </label>
                  <Input
                    type="number"
                    value={approvalSettings.reminderInterval}
                    onChange={(e) => updateSettings({ reminderInterval: parseInt(e.target.value) || 24 })}
                    min="1"
                    max="48"
                    className="w-32"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Commentaires pour les approbateurs
              </label>
              <Textarea
                placeholder="Informations supplémentaires ou instructions spéciales..."
                value={approvalSettings.comments}
                onChange={(e) => updateSettings({ comments: e.target.value })}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Résumé */}
      {approvalSettings.isRequired && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-base">
              <Clock className="w-4 h-4 mr-2" />
              Résumé du processus d'approbation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Type d'approbation :</span>
                <span className="font-medium">
                  {workflowOptions.find(w => w.value === approvalSettings.workflow)?.label}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Approbateurs :</span>
                <span className="font-medium">{approvalSettings.approvers.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Délai :</span>
                <span className="font-medium">{approvalSettings.deadlineHours}h</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Priorité :</span>
                <Badge 
                  variant="outline" 
                  className={`text-xs ${priorityOptions.find(p => p.value === approvalSettings.priority)?.color} text-white`}
                >
                  {priorityOptions.find(p => p.value === approvalSettings.priority)?.label}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}