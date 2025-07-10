import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Calendar, RotateCcw, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface Loan {
  id: string;
  book: {
    id: string;
    title: string;
    author: string;
    isbn?: string;
  };
  loan_date: string;
  due_date: string;
  return_date?: string;
  status: string;
  renewal_count: number;
  max_renewals: number;
  fine_amount?: number;
}

interface Reservation {
  id: string;
  book: {
    id: string;
    title: string;
    author: string;
  };
  reservation_date: string;
  status: string;
  queue_position: number;
  estimated_availability?: string;
}

export function LoanManager() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchLoansAndReservations();
  }, []);

  const fetchLoansAndReservations = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('get-my-loans');

      if (error) throw error;
      setLoans(data?.loans || []);
      setReservations(data?.reservations || []);
    } catch (error) {
      console.error('Erreur lors de la récupération des emprunts:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger vos emprunts.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRenewLoan = async (loanId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('renew-loan', {
        body: { loan_id: loanId }
      });

      if (error) throw error;

      toast({
        title: "Emprunt prolongé",
        description: "Votre emprunt a été prolongé avec succès.",
      });

      fetchLoansAndReservations();
    } catch (error) {
      console.error('Erreur lors du renouvellement:', error);
      toast({
        title: "Erreur",
        description: "Impossible de renouveler cet emprunt.",
        variant: "destructive",
      });
    }
  };

  const handleCancelReservation = async (reservationId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('cancel-reservation', {
        body: { reservation_id: reservationId }
      });

      if (error) throw error;

      toast({
        title: "Réservation annulée",
        description: "Votre réservation a été annulée.",
      });

      fetchLoansAndReservations();
    } catch (error) {
      console.error('Erreur lors de l\'annulation:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'annuler cette réservation.",
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <BookOpen className="w-4 h-4 text-green-600" />;
      case 'overdue':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'returned':
        return <CheckCircle className="w-4 h-4 text-blue-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'En cours';
      case 'overdue':
        return 'En retard';
      case 'returned':
        return 'Rendu';
      case 'pending':
        return 'En attente';
      case 'available':
        return 'Disponible';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'overdue':
        return 'destructive';
      case 'returned':
        return 'secondary';
      case 'available':
        return 'default';
      default:
        return 'outline';
    }
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  const canRenew = (loan: Loan) => {
    return loan.status === 'active' && loan.renewal_count < loan.max_renewals;
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
      <Tabs defaultValue="loans" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="loans">Mes emprunts</TabsTrigger>
          <TabsTrigger value="reservations">Mes réservations</TabsTrigger>
        </TabsList>

        <TabsContent value="loans" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Emprunts en cours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Livre</TableHead>
                    <TableHead>Date d'emprunt</TableHead>
                    <TableHead>Date de retour</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Renouvellements</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loans.map((loan) => (
                    <TableRow key={loan.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{loan.book.title}</p>
                          <p className="text-sm text-muted-foreground">{loan.book.author}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {format(new Date(loan.loan_date), "dd/MM/yyyy", { locale: fr })}
                      </TableCell>
                      <TableCell className={isOverdue(loan.due_date) && loan.status === 'active' ? 'text-red-600 font-medium' : ''}>
                        {format(new Date(loan.due_date), "dd/MM/yyyy", { locale: fr })}
                        {isOverdue(loan.due_date) && loan.status === 'active' && (
                          <div className="text-xs text-red-600">En retard</div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(loan.status)} className="flex items-center gap-1 w-fit">
                          {getStatusIcon(loan.status)}
                          {getStatusLabel(loan.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {loan.renewal_count}/{loan.max_renewals}
                      </TableCell>
                      <TableCell>
                        {canRenew(loan) ? (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleRenewLoan(loan.id)}
                          >
                            <RotateCcw className="w-3 h-3 mr-1" />
                            Renouveler
                          </Button>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            {loan.status === 'returned' ? 'Rendu' : 'Non renouvelable'}
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {loans.length === 0 && (
                <div className="text-center py-8">
                  <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Aucun emprunt</h3>
                  <p className="text-muted-foreground">
                    Vous n'avez actuellement aucun livre emprunté.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reservations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Réservations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Livre</TableHead>
                    <TableHead>Date de réservation</TableHead>
                    <TableHead>Position dans la file</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Disponibilité estimée</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reservations.map((reservation) => (
                    <TableRow key={reservation.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{reservation.book.title}</p>
                          <p className="text-sm text-muted-foreground">{reservation.book.author}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {format(new Date(reservation.reservation_date), "dd/MM/yyyy", { locale: fr })}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          #{reservation.queue_position}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(reservation.status)}>
                          {getStatusLabel(reservation.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {reservation.estimated_availability 
                          ? format(new Date(reservation.estimated_availability), "dd/MM/yyyy", { locale: fr })
                          : "À déterminer"
                        }
                      </TableCell>
                      <TableCell>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleCancelReservation(reservation.id)}
                        >
                          Annuler
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {reservations.length === 0 && (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Aucune réservation</h3>
                  <p className="text-muted-foreground">
                    Vous n'avez actuellement aucune réservation.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}