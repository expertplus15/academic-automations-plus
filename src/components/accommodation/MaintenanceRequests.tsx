import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Wrench, Plus, AlertTriangle, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const maintenanceSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  description: z.string().min(10, "La description doit contenir au moins 10 caractères"),
  category: z.string().min(1, "Veuillez sélectionner une catégorie"),
  priority: z.string().min(1, "Veuillez sélectionner une priorité"),
});

type MaintenanceFormValues = z.infer<typeof maintenanceSchema>;

interface MaintenanceRequest {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  created_at: string;
  updated_at: string;
  assigned_to?: string;
  completed_at?: string;
  response?: string;
}

export function MaintenanceRequests() {
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<MaintenanceFormValues>({
    resolver: zodResolver(maintenanceSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      priority: "",
    },
  });

  useEffect(() => {
    fetchMaintenanceRequests();
  }, []);

  const fetchMaintenanceRequests = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('get-maintenance-requests');

      if (error) throw error;
      setRequests(data?.requests || []);
    } catch (error) {
      console.error('Erreur lors de la récupération des demandes:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger vos demandes de maintenance.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (values: MaintenanceFormValues) => {
    setSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-maintenance-request', {
        body: values
      });

      if (error) throw error;

      toast({
        title: "Demande créée",
        description: "Votre demande de maintenance a été envoyée avec succès.",
      });

      form.reset();
      setDialogOpen(false);
      fetchMaintenanceRequests();
    } catch (error) {
      console.error('Erreur lors de la création de la demande:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer votre demande de maintenance.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'in_progress':
        return <Clock className="w-4 h-4 text-blue-600" />;
      case 'pending':
        return <AlertCircle className="w-4 h-4 text-orange-600" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Terminé';
      case 'in_progress':
        return 'En cours';
      case 'pending':
        return 'En attente';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'in_progress':
        return 'secondary';
      case 'pending':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'secondary';
      case 'low':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'Haute';
      case 'medium':
        return 'Moyenne';
      case 'low':
        return 'Basse';
      default:
        return priority;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Wrench className="w-5 h-5" />
              Demandes de maintenance
            </CardTitle>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Nouvelle demande
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Nouvelle demande de maintenance</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Titre</FormLabel>
                          <FormControl>
                            <Input placeholder="Résumé du problème" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Catégorie</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionner une catégorie" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="plumbing">Plomberie</SelectItem>
                              <SelectItem value="electrical">Électricité</SelectItem>
                              <SelectItem value="heating">Chauffage</SelectItem>
                              <SelectItem value="furniture">Mobilier</SelectItem>
                              <SelectItem value="cleaning">Nettoyage</SelectItem>
                              <SelectItem value="other">Autre</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="priority"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Priorité</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionner une priorité" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="low">Basse</SelectItem>
                              <SelectItem value="medium">Moyenne</SelectItem>
                              <SelectItem value="high">Haute</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Décrivez le problème en détail..."
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                        Annuler
                      </Button>
                      <Button type="submit" disabled={submitting}>
                        {submitting ? "Envoi..." : "Envoyer"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titre</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Priorité</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Date de création</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">
                    {request.title}
                  </TableCell>
                  <TableCell>{request.category}</TableCell>
                  <TableCell>
                    <Badge variant={getPriorityColor(request.priority)}>
                      {getPriorityLabel(request.priority)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(request.status)} className="flex items-center gap-1 w-fit">
                      {getStatusIcon(request.status)}
                      {getStatusLabel(request.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {format(new Date(request.created_at), "dd/MM/yyyy", { locale: fr })}
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline">
                      Voir détails
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {requests.length === 0 && (
            <div className="text-center py-8">
              <Wrench className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Aucune demande</h3>
              <p className="text-muted-foreground">
                Vous n'avez pas encore fait de demande de maintenance.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}