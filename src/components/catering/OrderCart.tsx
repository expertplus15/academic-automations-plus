import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { ShoppingCart, Plus, Minus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  meal_type: string;
}

interface OrderCartProps {
  items: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
}

export function OrderCart({ items, onUpdateQuantity, onRemoveItem, onClearCart }: OrderCartProps) {
  const [specialRequests, setSpecialRequests] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const { toast } = useToast();

  const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handlePlaceOrder = async () => {
    if (items.length === 0) {
      toast({
        title: "Panier vide",
        description: "Ajoutez des articles à votre panier avant de commander",
        variant: "destructive"
      });
      return;
    }

    setIsPlacingOrder(true);

    try {
      // Get current user's student ID
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non connecté");

      const { data: student } = await supabase
        .from('students')
        .select('id')
        .eq('profile_id', user.id)
        .single();

      if (!student) throw new Error("Profil étudiant non trouvé");

      // Check balance
      const { data: balance } = await supabase
        .from('catering_balances')
        .select('balance')
        .eq('student_id', student.id)
        .single();

      if (!balance || balance.balance < totalAmount) {
        toast({
          title: "Solde insuffisant",
          description: "Veuillez recharger votre compte restauration",
          variant: "destructive"
        });
        return;
      }

      // Create orders for each item
      for (const item of items) {
        const { data: menu } = await supabase
          .from('catering_menus')
          .select('id')
          .eq('name', item.name)
          .single();

        if (menu) {
          await supabase.from('catering_orders').insert({
            student_id: student.id,
            menu_id: menu.id,
            quantity: item.quantity,
            total_amount: item.price * item.quantity,
            pickup_time: pickupTime || null,
            special_requests: specialRequests || null,
            order_date: new Date().toISOString().split('T')[0]
          });
        }
      }

      // Update balance
      await supabase
        .from('catering_balances')
        .update({ 
          balance: balance.balance - totalAmount,
          updated_at: new Date().toISOString()
        })
        .eq('student_id', student.id);

      toast({
        title: "Commande confirmée",
        description: `Votre commande de ${totalAmount.toFixed(2)}€ a été enregistrée`
      });

      onClearCart();
      setSpecialRequests("");
      setPickupTime("");

    } catch (error) {
      console.error('Error placing order:', error);
      toast({
        title: "Erreur",
        description: "Impossible de passer la commande",
        variant: "destructive"
      });
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="h-4 w-4" />
          Votre commande ({items.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">
            Votre panier est vide
          </p>
        ) : (
          <>
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">{item.price}€</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onUpdateQuantity(item.id, Math.max(0, item.quantity - 1))}
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    
                    <span className="w-8 text-center">{item.quantity}</span>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onRemoveItem(item.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <Separator />

            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium">Heure de récupération (optionnel)</label>
                <input
                  type="time"
                  value={pickupTime}
                  onChange={(e) => setPickupTime(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border rounded-md"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Demandes spéciales</label>
                <Textarea
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="Allergies, préférences..."
                  className="mt-1"
                />
              </div>
            </div>

            <Separator />

            <div className="flex justify-between font-semibold text-lg">
              <span>Total:</span>
              <span>{totalAmount.toFixed(2)}€</span>
            </div>

            <div className="space-y-2">
              <Button 
                onClick={handlePlaceOrder}
                className="w-full"
                disabled={isPlacingOrder}
              >
                {isPlacingOrder ? "Commande en cours..." : "Passer commande"}
              </Button>
              
              {items.length > 0 && (
                <Button 
                  onClick={onClearCart}
                  variant="outline"
                  className="w-full"
                >
                  Vider le panier
                </Button>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}