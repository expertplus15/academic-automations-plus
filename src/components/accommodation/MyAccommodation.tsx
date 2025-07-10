import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Calendar, Euro, Home, MapPin, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface AccommodationAssignment {
  id: string;
  room: {
    id: string;
    room_number: string;
    building_name: string;
    capacity: number;
    facilities: string[];
  };
  start_date: string;
  end_date?: string;
  monthly_rent: number;
  deposit_amount?: number;
  status: string;
  notes?: string;
  created_at: string;
}

export function MyAccommodation() {
  const [assignment, setAssignment] = useState<AccommodationAssignment | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchMyAccommodation();
  }, []);

  const fetchMyAccommodation = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('get-my-accommodation');

      if (error) throw error;
      setAssignment(data?.assignment || null);
    } catch (error) {
      console.error('Erreur lors de la récupération du logement:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger vos informations de logement.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'expired':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Actif';
      case 'pending':
        return 'En attente';
      case 'expired':
        return 'Expiré';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!assignment) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Home className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Aucun logement attribué</h3>
          <p className="text-muted-foreground mb-4">
            Vous n'avez actuellement aucun logement attribué.
          </p>
          <Button>
            Faire une demande de logement
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Home className="w-5 h-5" />
                Mon logement
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Chambre {assignment.room.room_number} - {assignment.room.building_name}
              </p>
            </div>
            <Badge variant={getStatusColor(assignment.status)}>
              {getStatusLabel(assignment.status)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <MapPin className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm font-medium">{assignment.room.building_name}</p>
                <p className="text-xs text-muted-foreground">Bâtiment</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Users className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Capacité {assignment.room.capacity}</p>
                <p className="text-xs text-muted-foreground">Personnes</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Euro className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm font-medium">{assignment.monthly_rent}€</p>
                <p className="text-xs text-muted-foreground">Par mois</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Calendar className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm font-medium">
                  {format(new Date(assignment.start_date), "dd/MM/yyyy", { locale: fr })}
                </p>
                <p className="text-xs text-muted-foreground">Date d'entrée</p>
              </div>
            </div>
          </div>

          {assignment.room.facilities && assignment.room.facilities.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">Équipements</h4>
              <div className="flex flex-wrap gap-2">
                {assignment.room.facilities.map((facility, index) => (
                  <Badge key={index} variant="outline">
                    {facility}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {assignment.deposit_amount && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">
                  Caution versée: {assignment.deposit_amount}€
                </span>
              </div>
            </div>
          )}

          {assignment.end_date && (
            <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-medium text-orange-900">
                  Date de fin: {format(new Date(assignment.end_date), "dd/MM/yyyy", { locale: fr })}
                </span>
              </div>
            </div>
          )}

          {assignment.notes && (
            <div>
              <h4 className="text-sm font-medium mb-2">Notes</h4>
              <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                {assignment.notes}
              </p>
            </div>
          )}

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1">
              Demander une maintenance
            </Button>
            <Button variant="outline" className="flex-1">
              Contacter l'administration
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}