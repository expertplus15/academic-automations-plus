import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Utensils, Clock, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  allergens: any;
  nutritional_info: any;
  meal_type: string;
  is_available: boolean;
}

interface MenuDisplayProps {
  onAddToCart: (item: MenuItem, quantity: number) => void;
}

export function MenuDisplay({ onAddToCart }: MenuDisplayProps) {
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const { toast } = useToast();

  useEffect(() => {
    fetchMenus();
  }, [selectedDate]);

  const fetchMenus = async () => {
    try {
      const { data, error } = await supabase
        .from('catering_menus')
        .select('*')
        .eq('menu_date', selectedDate)
        .eq('is_available', true)
        .order('meal_type');

      if (error) throw error;
      
      // Transform data to ensure allergens is an array
      const transformedMenus = (data || []).map(menu => ({
        ...menu,
        allergens: Array.isArray(menu.allergens) ? menu.allergens : []
      }));
      
      setMenus(transformedMenus);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les menus",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (item: MenuItem) => {
    onAddToCart(item, 1);
    toast({
      title: "Ajouté au panier",
      description: `${item.name} ajouté à votre commande`
    });
  };

  const menusByType = menus.reduce((acc, menu) => {
    if (!acc[menu.meal_type]) acc[menu.meal_type] = [];
    acc[menu.meal_type].push(menu);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  const mealTypeLabels = {
    breakfast: "Petit-déjeuner",
    lunch: "Déjeuner", 
    dinner: "Dîner",
    snack: "Collation"
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Utensils className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Menus du jour</h3>
        </div>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="px-3 py-2 border rounded-md"
        />
      </div>

      {Object.entries(menusByType).map(([mealType, items]) => (
        <Card key={mealType}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {mealTypeLabels[mealType as keyof typeof mealTypeLabels] || mealType}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex items-start justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium">{item.name}</h4>
                    <span className="font-semibold text-primary">{item.price}€</span>
                  </div>
                  
                  {item.description && (
                    <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                  )}
                  
                  {Array.isArray(item.allergens) && item.allergens.length > 0 && (
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-4 w-4 text-orange-500" />
                      <div className="flex gap-1">
                        {item.allergens.map((allergen: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {allergen}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {item.nutritional_info && (
                    <div className="text-xs text-muted-foreground">
                      {item.nutritional_info.calories && `${item.nutritional_info.calories} kcal`}
                      {item.nutritional_info.protein && ` • ${item.nutritional_info.protein}g protéines`}
                    </div>
                  )}
                </div>
                
                <Button 
                  onClick={() => handleAddToCart(item)}
                  size="sm"
                  className="ml-4"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Ajouter
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}

      {Object.keys(menusByType).length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Utensils className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Aucun menu disponible pour cette date</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}