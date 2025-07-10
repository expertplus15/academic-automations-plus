import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, MoreHorizontal, AlertCircle } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface Reservation {
  id: string;
  line_name: string;
  line_code: string;
  reservation_date: string;
  departure_time: string;
  pickup_stop: string;
  destination_stop: string;
  status: 'confirmed' | 'cancelled' | 'completed';
  payment_status: 'pending' | 'paid' | 'refunded';
  price: number;
  created_at: string;
}

export function MyReservations() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockReservations: Reservation[] = [
        {
          id: '1',
          line_name: 'Ligne A - Centre Ville',
          line_code: 'LN-A',
          reservation_date: '2024-01-15',
          departure_time: '07:30',
          pickup_stop: 'Université',
          destination_stop: 'Gare Centrale',
          status: 'confirmed',
          payment_status: 'paid',
          price: 2.50,
          created_at: '2024-01-10T10:00:00Z'
        },
        {
          id: '2',
          line_name: 'Ligne B - Banlieue Nord',
          line_code: 'LN-B',
          reservation_date: '2024-01-12',
          departure_time: '17:45',
          pickup_stop: 'Université',
          destination_stop: 'Quartier Nord',
          status: 'completed',
          payment_status: 'paid',
          price: 3.00,
          created_at: '2024-01-08T14:30:00Z'
        },
        {
          id: '3',
          line_name: 'Ligne C - Campus Universitaire',
          line_code: 'LN-C',
          reservation_date: '2024-01-20',
          departure_time: '14:00',
          pickup_stop: 'Bibliothèque',
          destination_stop: 'Résidences Étudiantes',
          status: 'confirmed',
          payment_status: 'pending',
          price: 1.50,
          created_at: '2024-01-10T16:20:00Z'
        }
      ];
      
      setReservations(mockReservations);
    } catch (error) {
      console.error('Error fetching reservations:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger vos réservations",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelReservation = async (reservationId: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setReservations(prev => 
        prev.map(res => 
          res.id === reservationId 
            ? { ...res, status: 'cancelled' as const, payment_status: 'refunded' as const }
            : res
        )
      );
      
      toast({
        title: "Réservation annulée",
        description: "Votre réservation a été annulée avec succès"
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'annuler la réservation",
        variant: "destructive"
      });
    } finally {
      setCancellingId(null);
      setShowCancelDialog(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'refunded': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confirmée';
      case 'completed': return 'Terminée';
      case 'cancelled': return 'Annulée';
      default: return status;
    }
  };

  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case 'paid': return 'Payée';
      case 'pending': return 'En attente';
      case 'refunded': return 'Remboursée';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="h-4 bg-muted rounded w-1/4"></div>
                <div className="h-6 bg-muted rounded w-20"></div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (reservations.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Aucune réservation</h3>
          <p className="text-muted-foreground">
            Vous n'avez pas encore de réservations de transport.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Mes réservations</h3>
        <Badge variant="secondary">
          {reservations.length} réservation{reservations.length > 1 ? 's' : ''}
        </Badge>
      </div>

      {reservations.map((reservation) => (
        <Card key={reservation.id}>
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="font-mono">
                  {reservation.line_code}
                </Badge>
                <h4 className="font-medium">{reservation.line_name}</h4>
              </div>
              
              <div className="flex items-center gap-2">
                <Badge className={getStatusColor(reservation.status)}>
                  {getStatusText(reservation.status)}
                </Badge>
                <Badge className={getPaymentStatusColor(reservation.payment_status)}>
                  {getPaymentStatusText(reservation.payment_status)}
                </Badge>
                
                {reservation.status === 'confirmed' && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          setCancellingId(reservation.id);
                          setShowCancelDialog(true);
                        }}
                        className="text-red-600"
                      >
                        <AlertCircle className="h-4 w-4 mr-2" />
                        Annuler la réservation
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>
                  {format(new Date(reservation.reservation_date), "PPP", { locale: fr })}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{reservation.departure_time}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="font-medium">{reservation.price.toFixed(2)}€</span>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>
                <span className="font-medium">{reservation.pickup_stop}</span>
                <span className="text-muted-foreground mx-2">→</span>
                <span className="font-medium">{reservation.destination_stop}</span>
              </span>
            </div>

            {reservation.payment_status === 'pending' && (
              <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">Paiement en attente - Veuillez finaliser votre paiement</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Annuler la réservation</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir annuler cette réservation ? Cette action ne peut pas être annulée.
              Si le paiement a été effectué, vous serez remboursé.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => cancellingId && handleCancelReservation(cancellingId)}
              className="bg-red-600 hover:bg-red-700"
            >
              Confirmer l'annulation
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}