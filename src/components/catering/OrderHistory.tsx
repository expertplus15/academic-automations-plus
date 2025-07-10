import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { History, Clock, CheckCircle, XCircle, Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Order {
  id: string;
  order_date: string;
  pickup_time: string | null;
  quantity: number;
  total_amount: number;
  status: string;
  special_requests: string | null;
  created_at: string;
  menu: {
    name: string;
    meal_type: string;
  };
}

export function OrderHistory() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: student } = await supabase
        .from('students')
        .select('id')
        .eq('profile_id', user.id)
        .single();

      if (!student) return;

      const { data, error } = await supabase
        .from('catering_orders')
        .select(`
          *,
          catering_menus!inner(name, meal_type)
        `)
        .eq('student_id', student.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      setOrders(data?.map(order => ({
        ...order,
        menu: order.catering_menus
      })) || []);

    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger l'historique",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'ready':
        return <Package className="h-4 w-4 text-blue-600" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-orange-600" />;
    }
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      pending: "En attente",
      confirmed: "Confirmée",
      ready: "Prête",
      completed: "Récupérée",
      cancelled: "Annulée"
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'completed':
        return "default";
      case 'ready':
        return "secondary";
      case 'cancelled':
        return "destructive";
      default:
        return "outline";
    }
  };

  const mealTypeLabels = {
    breakfast: "Petit-déjeuner",
    lunch: "Déjeuner",
    dinner: "Dîner",
    snack: "Collation"
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-4 w-4" />
            Historique des commandes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-4 w-4" />
          Historique des commandes
        </CardTitle>
      </CardHeader>
      <CardContent>
        {orders.length === 0 ? (
          <div className="text-center py-6">
            <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Aucune commande trouvée</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium">{order.menu.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {mealTypeLabels[order.menu.meal_type as keyof typeof mealTypeLabels] || order.menu.meal_type}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{order.total_amount.toFixed(2)}€</p>
                    <p className="text-sm text-muted-foreground">Qté: {order.quantity}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(order.status)}
                    <Badge variant={getStatusVariant(order.status)}>
                      {getStatusLabel(order.status)}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(order.created_at).toLocaleDateString()} • {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>

                {order.pickup_time && (
                  <div className="text-sm">
                    <Clock className="h-3 w-3 inline mr-1" />
                    Récupération prévue: {order.pickup_time}
                  </div>
                )}

                {order.special_requests && (
                  <div className="text-sm bg-muted p-2 rounded">
                    <strong>Demandes spéciales:</strong> {order.special_requests}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}