import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { Activity, Target, TrendingUp } from "lucide-react";

interface NutritionData {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

interface DailyTargets {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export function NutritionTracker() {
  const [todayNutrition, setTodayNutrition] = useState<NutritionData>({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0
  });
  const [weeklyAverage, setWeeklyAverage] = useState<NutritionData>({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0
  });
  const [loading, setLoading] = useState(true);

  // Objectifs nutritionnels recommandés (exemple pour un étudiant)
  const dailyTargets: DailyTargets = {
    calories: 2200,
    protein: 110, // 20% des calories
    carbs: 275,   // 50% des calories
    fat: 73       // 30% des calories
  };

  useEffect(() => {
    fetchNutritionData();
  }, []);

  const fetchNutritionData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: student } = await supabase
        .from('students')
        .select('id')
        .eq('profile_id', user.id)
        .single();

      if (!student) return;

      const today = new Date().toISOString().split('T')[0];
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      // Récupérer les commandes d'aujourd'hui
      const { data: todayOrders } = await supabase
        .from('catering_orders')
        .select(`
          quantity,
          catering_menus!inner(nutritional_info)
        `)
        .eq('student_id', student.id)
        .eq('order_date', today)
        .eq('status', 'completed');

      // Récupérer les commandes de la semaine
      const { data: weekOrders } = await supabase
        .from('catering_orders')
        .select(`
          quantity,
          catering_menus!inner(nutritional_info)
        `)
        .eq('student_id', student.id)
        .gte('order_date', weekAgo)
        .eq('status', 'completed');

      // Calculer la nutrition d'aujourd'hui
      const todayNutr = calculateNutrition(todayOrders || []);
      setTodayNutrition(todayNutr);

      // Calculer la moyenne de la semaine
      const weekNutr = calculateNutrition(weekOrders || []);
      setWeeklyAverage({
        calories: weekNutr.calories / 7,
        protein: weekNutr.protein / 7,
        carbs: weekNutr.carbs / 7,
        fat: weekNutr.fat / 7,
        fiber: weekNutr.fiber / 7
      });

    } catch (error) {
      console.error('Error fetching nutrition data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateNutrition = (orders: any[]): NutritionData => {
    return orders.reduce((total, order) => {
      const nutrition = order.catering_menus?.nutritional_info || {};
      const quantity = order.quantity || 1;

      return {
        calories: total.calories + (nutrition.calories || 0) * quantity,
        protein: total.protein + (nutrition.protein || 0) * quantity,
        carbs: total.carbs + (nutrition.carbs || 0) * quantity,
        fat: total.fat + (nutrition.fat || 0) * quantity,
        fiber: total.fiber + (nutrition.fiber || 0) * quantity
      };
    }, { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });
  };

  const getProgressColor = (current: number, target: number) => {
    const percentage = (current / target) * 100;
    if (percentage < 50) return "bg-red-500";
    if (percentage < 80) return "bg-orange-500";
    if (percentage > 120) return "bg-orange-500";
    return "bg-green-500";
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Suivi nutritionnel
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i}>
                <div className="h-4 bg-muted rounded w-1/3 mb-2"></div>
                <div className="h-2 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Objectifs du jour
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Calories</span>
              <span>{todayNutrition.calories.toFixed(0)} / {dailyTargets.calories} kcal</span>
            </div>
            <Progress 
              value={(todayNutrition.calories / dailyTargets.calories) * 100} 
              className="h-2"
            />
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Protéines</span>
              <span>{todayNutrition.protein.toFixed(1)} / {dailyTargets.protein} g</span>
            </div>
            <Progress 
              value={(todayNutrition.protein / dailyTargets.protein) * 100} 
              className="h-2"
            />
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Glucides</span>
              <span>{todayNutrition.carbs.toFixed(1)} / {dailyTargets.carbs} g</span>
            </div>
            <Progress 
              value={(todayNutrition.carbs / dailyTargets.carbs) * 100} 
              className="h-2"
            />
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Lipides</span>
              <span>{todayNutrition.fat.toFixed(1)} / {dailyTargets.fat} g</span>
            </div>
            <Progress 
              value={(todayNutrition.fat / dailyTargets.fat) * 100} 
              className="h-2"
            />
          </div>

          {todayNutrition.fiber > 0 && (
            <div className="pt-2 border-t">
              <div className="flex justify-between text-sm">
                <span>Fibres</span>
                <span>{todayNutrition.fiber.toFixed(1)} g</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Moyenne hebdomadaire
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-muted rounded-lg">
              <p className="text-2xl font-bold text-primary">
                {weeklyAverage.calories.toFixed(0)}
              </p>
              <p className="text-sm text-muted-foreground">kcal/jour</p>
            </div>

            <div className="text-center p-3 bg-muted rounded-lg">
              <p className="text-2xl font-bold text-primary">
                {weeklyAverage.protein.toFixed(1)}
              </p>
              <p className="text-sm text-muted-foreground">g protéines</p>
            </div>

            <div className="text-center p-3 bg-muted rounded-lg">
              <p className="text-2xl font-bold text-primary">
                {weeklyAverage.carbs.toFixed(1)}
              </p>
              <p className="text-sm text-muted-foreground">g glucides</p>
            </div>

            <div className="text-center p-3 bg-muted rounded-lg">
              <p className="text-2xl font-bold text-primary">
                {weeklyAverage.fat.toFixed(1)}
              </p>
              <p className="text-sm text-muted-foreground">g lipides</p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              💡 <strong>Conseil:</strong> Variez vos choix pour un équilibre nutritionnel optimal. 
              Pensez aux fruits et légumes !
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}