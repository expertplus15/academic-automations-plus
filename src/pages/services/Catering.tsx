import { useState, useCallback } from "react";
import { ServicesModuleLayout } from "@/components/layouts/ServicesModuleLayout";
import { MenuDisplay } from "@/components/catering/MenuDisplay";
import { OrderCart } from "@/components/catering/OrderCart";
import { BalanceWidget } from "@/components/catering/BalanceWidget";
import { OrderHistory } from "@/components/catering/OrderHistory";
import { NutritionTracker } from "@/components/catering/NutritionTracker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  meal_type: string;
}

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  allergens: string[];
  nutritional_info: any;
  meal_type: string;
  is_available: boolean;
}

export default function Catering() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const handleAddToCart = useCallback((item: MenuItem, quantity: number) => {
    setCartItems(prev => {
      const existingItem = prev.find(cartItem => cartItem.id === item.id);
      
      if (existingItem) {
        return prev.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + quantity }
            : cartItem
        );
      }
      
      return [...prev, {
        id: item.id,
        name: item.name,
        price: item.price,
        quantity,
        meal_type: item.meal_type
      }];
    });
  }, []);

  const handleUpdateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity === 0) {
      handleRemoveItem(id);
      return;
    }
    
    setCartItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  }, []);

  const handleRemoveItem = useCallback((id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  }, []);

  const handleClearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  return (
    <ServicesModuleLayout title="Restauration" subtitle="Menus & paiements">
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <Tabs defaultValue="order" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="order">Commander</TabsTrigger>
              <TabsTrigger value="balance">Mon solde</TabsTrigger>
              <TabsTrigger value="history">Historique</TabsTrigger>
              <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
            </TabsList>

            <TabsContent value="order" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <MenuDisplay onAddToCart={handleAddToCart} />
                </div>
                <div>
                  <OrderCart
                    items={cartItems}
                    onUpdateQuantity={handleUpdateQuantity}
                    onRemoveItem={handleRemoveItem}
                    onClearCart={handleClearCart}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="balance" className="space-y-6">
              <div className="max-w-md mx-auto">
                <BalanceWidget />
              </div>
            </TabsContent>

            <TabsContent value="history" className="space-y-6">
              <OrderHistory />
            </TabsContent>

            <TabsContent value="nutrition" className="space-y-6">
              <NutritionTracker />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ServicesModuleLayout>
  );
}