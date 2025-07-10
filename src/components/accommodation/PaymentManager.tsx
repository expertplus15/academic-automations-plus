import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CreditCard, Download, Euro, Calendar, CheckCircle, AlertCircle, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface Payment {
  id: string;
  amount: number;
  due_date: string;
  paid_date?: string;
  status: string;
  payment_method?: string;
  reference: string;
  notes?: string;
}

interface PaymentSummary {
  total_paid: number;
  total_pending: number;
  next_payment_due: string | null;
  next_payment_amount: number | null;
}

export function PaymentManager() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [summary, setSummary] = useState<PaymentSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('get-accommodation-payments');

      if (error) throw error;
      setPayments(data?.payments || []);
      setSummary(data?.summary || null);
    } catch (error) {
      console.error('Erreur lors de la récupération des paiements:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger vos paiements.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (paymentId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('process-accommodation-payment', {
        body: { payment_id: paymentId }
      });

      if (error) throw error;

      toast({
        title: "Paiement traité",
        description: "Votre paiement a été traité avec succès.",
      });

      fetchPayments(); // Rafraîchir les données
    } catch (error) {
      console.error('Erreur lors du paiement:', error);
      toast({
        title: "Erreur",
        description: "Impossible de traiter le paiement.",
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <AlertCircle className="w-4 h-4 text-orange-600" />;
      case 'overdue':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'paid':
        return 'Payé';
      case 'pending':
        return 'En attente';
      case 'overdue':
        return 'En retard';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'overdue':
        return 'destructive';
      default:
        return 'outline';
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
      {/* Résumé des paiements */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold text-green-600">{summary.total_paid}€</p>
                  <p className="text-xs text-muted-foreground">Total payé</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-8 h-8 text-orange-600" />
                <div>
                  <p className="text-2xl font-bold text-orange-600">{summary.total_pending}€</p>
                  <p className="text-xs text-muted-foreground">En attente</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {summary.next_payment_due && (
            <>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-8 h-8 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium">
                        {format(new Date(summary.next_payment_due), "dd MMM", { locale: fr })}
                      </p>
                      <p className="text-xs text-muted-foreground">Prochain paiement</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Euro className="w-8 h-8 text-blue-600" />
                    <div>
                      <p className="text-2xl font-bold text-blue-600">{summary.next_payment_amount}€</p>
                      <p className="text-xs text-muted-foreground">Montant dû</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      )}

      {/* Historique des paiements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Historique des paiements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Référence</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Date d'échéance</TableHead>
                <TableHead>Date de paiement</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">
                    {payment.reference}
                  </TableCell>
                  <TableCell>{payment.amount}€</TableCell>
                  <TableCell>
                    {format(new Date(payment.due_date), "dd/MM/yyyy", { locale: fr })}
                  </TableCell>
                  <TableCell>
                    {payment.paid_date 
                      ? format(new Date(payment.paid_date), "dd/MM/yyyy", { locale: fr })
                      : "-"
                    }
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(payment.status)} className="flex items-center gap-1 w-fit">
                      {getStatusIcon(payment.status)}
                      {getStatusLabel(payment.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {payment.status === 'pending' && (
                        <Button 
                          size="sm" 
                          onClick={() => handlePayment(payment.id)}
                        >
                          Payer
                        </Button>
                      )}
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {payments.length === 0 && (
            <div className="text-center py-8">
              <CreditCard className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Aucun paiement</h3>
              <p className="text-muted-foreground">
                Aucun paiement n'a été trouvé pour votre logement.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}