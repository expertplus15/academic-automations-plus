
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileText, Download, Plus, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useDocumentTemplates, useDocumentRequests } from '@/hooks/useDocumentTemplates';
import { useStudents } from '@/hooks/useSupabase';
import { useToast } from '@/hooks/use-toast';

export function DocumentsManagement() {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const { templates, loading: templatesLoading } = useDocumentTemplates();
  const { requests, loading: requestsLoading, createRequest, updateRequestStatus } = useDocumentRequests();
  const { data: students, loading: studentsLoading } = useStudents();
  const { toast } = useToast();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'default';
      case 'approved': return 'default';
      case 'generated': return 'default';
      case 'delivered': return 'default';
      case 'rejected': return 'destructive';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-3 w-3" />;
      case 'approved': return <CheckCircle className="h-3 w-3" />;
      case 'generated': return <FileText className="h-3 w-3" />;
      case 'delivered': return <Download className="h-3 w-3" />;
      case 'rejected': return <XCircle className="h-3 w-3" />;
      default: return <AlertCircle className="h-3 w-3" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'approved': return 'Approuvé';
      case 'generated': return 'Généré';
      case 'delivered': return 'Livré';
      case 'rejected': return 'Rejeté';
      default: return status;
    }
  };

  const getTemplateTypeLabel = (type: string) => {
    switch (type) {
      case 'certificate': return 'Certificat';
      case 'transcript': return 'Relevé';
      case 'attestation': return 'Attestation';
      default: return type;
    }
  };

  const handleCreateRequest = async () => {
    if (!selectedTemplate || !selectedStudent) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un template et un étudiant",
        variant: "destructive"
      });
      return;
    }

    const { error } = await createRequest(selectedTemplate, selectedStudent);
    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de créer la demande",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Succès",
        description: "Demande créée avec succès"
      });
      setIsCreateDialogOpen(false);
      setSelectedTemplate('');
      setSelectedStudent('');
    }
  };

  const handleApprove = async (requestId: string) => {
    const { error } = await updateRequestStatus(requestId, 'approved');
    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'approuver la demande",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Succès",
        description: "Demande approuvée"
      });
    }
  };

  const handleReject = async (requestId: string) => {
    const { error } = await updateRequestStatus(requestId, 'rejected', 'Demande rejetée par l\'administrateur');
    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de rejeter la demande",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Succès",
        description: "Demande rejetée"
      });
    }
  };

  // Statistics
  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    approved: requests.filter(r => r.status === 'approved').length,
    generated: requests.filter(r => r.status === 'generated').length
  };

  if (templatesLoading || requestsLoading || studentsLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestion des Documents</h1>
          <p className="text-muted-foreground">
            Demandes et génération de documents administratifs
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle Demande
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Créer une Demande de Document</DialogTitle>
              <DialogDescription>
                Sélectionnez le type de document et l'étudiant concerné
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Type de Document</label>
                <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un template" />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name} ({getTemplateTypeLabel(template.template_type)})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Étudiant</label>
                <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un étudiant" />
                  </SelectTrigger>
                  <SelectContent>
                    {students.map((student) => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.profiles?.full_name} ({student.student_number})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={handleCreateRequest}>
                  Créer la Demande
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Total</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-orange-600" />
              <div>
                <p className="text-sm font-medium">En attente</p>
                <p className="text-2xl font-bold">{stats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm font-medium">Approuvés</p>
                <p className="text-2xl font-bold">{stats.approved}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Download className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-sm font-medium">Générés</p>
                <p className="text-2xl font-bold">{stats.generated}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Templates disponibles */}
      <Card>
        <CardHeader>
          <CardTitle>Documents Disponibles</CardTitle>
          <CardDescription>
            Templates de documents configurés dans le système
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {templates.map((template) => (
              <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">{template.name}</h3>
                      <p className="text-sm text-muted-foreground">{template.description}</p>
                      <Badge variant="outline" className="mt-2">
                        {getTemplateTypeLabel(template.template_type)}
                      </Badge>
                    </div>
                    <FileText className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Requests Table */}
      <Card>
        <CardHeader>
          <CardTitle>Demandes de Documents</CardTitle>
          <CardDescription>
            {requests.length} demande(s) enregistrée(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Étudiant</TableHead>
                <TableHead>Document</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Date de demande</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{request.student?.profiles?.full_name}</p>
                      <p className="text-sm text-muted-foreground">{request.student?.student_number}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{request.template?.name}</p>
                      <p className="text-sm text-muted-foreground">{request.template?.description}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {getTemplateTypeLabel(request.template?.template_type || '')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(request.status)} className="flex items-center gap-1 w-fit">
                      {getStatusIcon(request.status)}
                      {getStatusLabel(request.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(request.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {request.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleApprove(request.id)}
                          >
                            <CheckCircle className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleReject(request.id)}
                          >
                            <XCircle className="h-3 w-3" />
                          </Button>
                        </>
                      )}
                      {request.status === 'generated' && (
                        <Button size="sm" variant="outline">
                          <Download className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
