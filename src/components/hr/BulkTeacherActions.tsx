import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, 
  CheckSquare, 
  Square,
  UserCheck,
  UserX,
  Mail,
  Download,
  Upload,
  AlertTriangle,
  Settings,
  Calendar,
  Award
} from 'lucide-react';

interface BulkTeacherActionsProps {
  teachers: any[];
  selectedTeachers: string[];
  onSelectionChange: (teacherIds: string[]) => void;
  onRefresh: () => void;
}

export function BulkTeacherActions({ 
  teachers, 
  selectedTeachers, 
  onSelectionChange,
  onRefresh 
}: BulkTeacherActionsProps) {
  const { toast } = useToast();
  const [bulkAction, setBulkAction] = useState('');
  const [loading, setLoading] = useState(false);
  const [bulkMessage, setBulkMessage] = useState('');
  const [bulkStatus, setBulkStatus] = useState('');

  const allSelected = selectedTeachers.length === teachers.length;
  const someSelected = selectedTeachers.length > 0 && selectedTeachers.length < teachers.length;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(teachers.map(t => t.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleTeacherSelection = (teacherId: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedTeachers, teacherId]);
    } else {
      onSelectionChange(selectedTeachers.filter(id => id !== teacherId));
    }
  };

  const executeBulkAction = async () => {
    if (!bulkAction || selectedTeachers.length === 0) return;

    setLoading(true);
    try {
      switch (bulkAction) {
        case 'activate':
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          toast({
            title: "Succès",
            description: `${selectedTeachers.length} enseignant(s) activé(s)`
          });
          break;
        case 'deactivate':
          await new Promise(resolve => setTimeout(resolve, 1000));
          toast({
            title: "Succès",
            description: `${selectedTeachers.length} enseignant(s) désactivé(s)`
          });
          break;
        case 'send_message':
          if (!bulkMessage.trim()) {
            toast({
              title: "Erreur",
              description: "Veuillez saisir un message",
              variant: "destructive"
            });
            return;
          }
          await new Promise(resolve => setTimeout(resolve, 1500));
          toast({
            title: "Succès",
            description: `Message envoyé à ${selectedTeachers.length} enseignant(s)`
          });
          setBulkMessage('');
          break;
        case 'update_status':
          if (!bulkStatus) {
            toast({
              title: "Erreur",
              description: "Veuillez sélectionner un statut",
              variant: "destructive"
            });
            return;
          }
          await new Promise(resolve => setTimeout(resolve, 1000));
          toast({
            title: "Succès",
            description: `Statut mis à jour pour ${selectedTeachers.length} enseignant(s)`
          });
          break;
        case 'export_data':
          // Simulate export
          await new Promise(resolve => setTimeout(resolve, 800));
          toast({
            title: "Succès",
            description: `Données de ${selectedTeachers.length} enseignant(s) exportées`
          });
          break;
        default:
          break;
      }
      
      onRefresh();
      onSelectionChange([]);
      setBulkAction('');
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'opération",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'activate': return <UserCheck className="w-4 h-4" />;
      case 'deactivate': return <UserX className="w-4 h-4" />;
      case 'send_message': return <Mail className="w-4 h-4" />;
      case 'update_status': return <Settings className="w-4 h-4" />;
      case 'export_data': return <Download className="w-4 h-4" />;
      default: return <Settings className="w-4 h-4" />;
    }
  };

  return (
    <Card className="bg-white rounded-2xl shadow-sm border-0">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-500" />
            Actions Groupées
          </div>
          {selectedTeachers.length > 0 && (
            <Badge variant="secondary">
              {selectedTeachers.length} sélectionné{selectedTeachers.length > 1 ? 's' : ''}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Selection Controls */}
        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
          <Checkbox
            checked={allSelected}
            ref={(el) => {
              if (el) (el as HTMLInputElement).indeterminate = someSelected;
            }}
            onCheckedChange={handleSelectAll}
          />
          <span className="text-sm font-medium">
            {allSelected ? 'Tout désélectionner' : 'Tout sélectionner'}
          </span>
          <span className="text-xs text-muted-foreground">
            ({teachers.length} enseignant{teachers.length > 1 ? 's' : ''} au total)
          </span>
        </div>

        {/* Teacher List with Selection */}
        <div className="max-h-96 overflow-y-auto space-y-2">
          {teachers.map((teacher) => (
            <div 
              key={teacher.id} 
              className="flex items-center gap-3 p-3 rounded-lg border border-border/50 hover:bg-accent/50 transition-colors"
            >
              <Checkbox
                checked={selectedTeachers.includes(teacher.id)}
                onCheckedChange={(checked) => handleTeacherSelection(teacher.id, checked as boolean)}
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">
                  {teacher.profile?.full_name || 'Nom non défini'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {teacher.employee_number} • {teacher.profile?.email}
                </p>
              </div>
              <Badge 
                className={
                  teacher.status === 'active' ? 'bg-green-100 text-green-700' :
                  teacher.status === 'on_leave' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-gray-100 text-gray-700'
                }
              >
                {teacher.status === 'active' ? 'Actif' :
                 teacher.status === 'on_leave' ? 'En congé' : 'Inactif'}
              </Badge>
            </div>
          ))}
        </div>

        {selectedTeachers.length > 0 && (
          <>
            {/* Action Selection */}
            <div className="border-t pt-4">
              <Label htmlFor="bulk-action">Action à effectuer</Label>
              <Select value={bulkAction} onValueChange={setBulkAction}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Choisir une action..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="activate">
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-green-500" />
                      Activer les enseignants
                    </div>
                  </SelectItem>
                  <SelectItem value="deactivate">
                    <div className="flex items-center gap-2">
                      <UserX className="w-4 h-4 text-red-500" />
                      Désactiver les enseignants
                    </div>
                  </SelectItem>
                  <SelectItem value="update_status">
                    <div className="flex items-center gap-2">
                      <Settings className="w-4 h-4 text-blue-500" />
                      Modifier le statut
                    </div>
                  </SelectItem>
                  <SelectItem value="send_message">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-purple-500" />
                      Envoyer un message
                    </div>
                  </SelectItem>
                  <SelectItem value="export_data">
                    <div className="flex items-center gap-2">
                      <Download className="w-4 h-4 text-indigo-500" />
                      Exporter les données
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Action-specific inputs */}
            {bulkAction === 'send_message' && (
              <div className="space-y-2">
                <Label htmlFor="bulk-message">Message</Label>
                <Textarea
                  id="bulk-message"
                  value={bulkMessage}
                  onChange={(e) => setBulkMessage(e.target.value)}
                  placeholder="Saisissez votre message..."
                  rows={3}
                />
              </div>
            )}

            {bulkAction === 'update_status' && (
              <div className="space-y-2">
                <Label htmlFor="bulk-status">Nouveau statut</Label>
                <Select value={bulkStatus} onValueChange={setBulkStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir un statut..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Actif</SelectItem>
                    <SelectItem value="inactive">Inactif</SelectItem>
                    <SelectItem value="on_leave">En congé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Warning for destructive actions */}
            {(bulkAction === 'deactivate') && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Cette action désactivera {selectedTeachers.length} enseignant(s). 
                  Êtes-vous sûr de vouloir continuer ?
                </AlertDescription>
              </Alert>
            )}

            {/* Execute Button */}
            <Button 
              onClick={executeBulkAction} 
              disabled={!bulkAction || loading}
              className="w-full"
              variant={bulkAction === 'deactivate' ? 'destructive' : 'default'}
            >
              {loading ? (
                <>
                  <Settings className="w-4 h-4 mr-2 animate-spin" />
                  Traitement...
                </>
              ) : (
                <>
                  {getActionIcon(bulkAction)}
                  <span className="ml-2">
                    {bulkAction === 'activate' && 'Activer les enseignants'}
                    {bulkAction === 'deactivate' && 'Désactiver les enseignants'}
                    {bulkAction === 'send_message' && 'Envoyer le message'}
                    {bulkAction === 'update_status' && 'Modifier le statut'}
                    {bulkAction === 'export_data' && 'Exporter les données'}
                    {!bulkAction && 'Sélectionner une action'}
                  </span>
                </>
              )}
            </Button>
          </>
        )}

        {selectedTeachers.length === 0 && (
          <div className="text-center py-6 text-muted-foreground">
            <CheckSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>Sélectionnez des enseignants pour effectuer des actions groupées</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}