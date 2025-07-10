import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { Wallet, Plus, History } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BalanceWidgetProps {
  onRechargeSuccess?: () => void;
}

export function BalanceWidget({ onRechargeSuccess }: BalanceWidgetProps) {
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [rechargeAmount, setRechargeAmount] = useState("");
  const [isRecharging, setIsRecharging] = useState(false);
  const [lastRecharge, setLastRecharge] = useState<{date: string, amount: number} | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchBalance();
  }, []);

  const fetchBalance = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: student } = await supabase
        .from('students')
        .select('id')
        .eq('profile_id', user.id)
        .single();

      if (!student) return;

      const { data: balanceData, error } = await supabase
        .from('catering_balances')
        .select('*')
        .eq('student_id', student.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (balanceData) {
        setBalance(balanceData.balance || 0);
        if (balanceData.last_recharge_date && balanceData.last_recharge_amount) {
          setLastRecharge({
            date: balanceData.last_recharge_date,
            amount: balanceData.last_recharge_amount
          });
        }
      } else {
        // Create balance record if doesn't exist
        await supabase
          .from('catering_balances')
          .insert({ student_id: student.id, balance: 0 });
        setBalance(0);
      }
    } catch (error) {
      console.error('Error fetching balance:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger le solde",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRecharge = async () => {
    const amount = parseFloat(rechargeAmount);
    if (!amount || amount <= 0) {
      toast({
        title: "Montant invalide",
        description: "Veuillez saisir un montant valide",
        variant: "destructive"
      });
      return;
    }

    setIsRecharging(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non connecté");

      const { data: student } = await supabase
        .from('students')
        .select('id')
        .eq('profile_id', user.id)
        .single();

      if (!student) throw new Error("Profil étudiant non trouvé");

      const newBalance = balance + amount;
      const now = new Date().toISOString();

      const { error } = await supabase
        .from('catering_balances')
        .update({
          balance: newBalance,
          last_recharge_amount: amount,
          last_recharge_date: now.split('T')[0],
          updated_at: now
        })
        .eq('student_id', student.id);

      if (error) throw error;

      setBalance(newBalance);
      setLastRecharge({
        date: now.split('T')[0],
        amount: amount
      });
      setRechargeAmount("");

      toast({
        title: "Recharge effectuée",
        description: `${amount.toFixed(2)}€ ajoutés à votre compte`
      });

      onRechargeSuccess?.();

    } catch (error) {
      console.error('Error recharging:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'effectuer la recharge",
        variant: "destructive"
      });
    } finally {
      setIsRecharging(false);
    }
  };

  const getBalanceColor = () => {
    if (balance < 5) return "text-red-600";
    if (balance < 20) return "text-orange-600";
    return "text-green-600";
  };

  const quickAmounts = [10, 20, 50];

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-8 bg-muted rounded w-3/4"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-4 w-4" />
          Solde restauration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className={`text-3xl font-bold ${getBalanceColor()}`}>
            {balance.toFixed(2)}€
          </div>
          {lastRecharge && (
            <div className="text-sm text-muted-foreground mt-1">
              Dernière recharge: {lastRecharge.amount.toFixed(2)}€ le {new Date(lastRecharge.date).toLocaleDateString()}
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium">Montant à recharger</label>
            <div className="flex gap-2 mt-1">
              <Input
                type="number"
                value={rechargeAmount}
                onChange={(e) => setRechargeAmount(e.target.value)}
                placeholder="0.00"
                min="0"
                step="0.01"
              />
              <Button 
                onClick={handleRecharge}
                disabled={isRecharging}
                size="sm"
              >
                <Plus className="h-4 w-4 mr-1" />
                Recharger
              </Button>
            </div>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-2">Montants rapides:</p>
            <div className="flex gap-2">
              {quickAmounts.map((amount) => (
                <Button
                  key={amount}
                  variant="outline"
                  size="sm"
                  onClick={() => setRechargeAmount(amount.toString())}
                  className="flex-1"
                >
                  {amount}€
                </Button>
              ))}
            </div>
          </div>
        </div>

        {balance < 10 && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
            <p className="text-sm text-orange-800">
              ⚠️ Solde faible. Pensez à recharger votre compte pour vos prochaines commandes.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}