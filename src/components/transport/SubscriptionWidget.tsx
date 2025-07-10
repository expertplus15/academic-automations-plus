import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreditCard, Calendar, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format, addDays, addMonths, addWeeks } from "date-fns";
import { fr } from "date-fns/locale";

interface Subscription {
  id: string;
  line_name: string;
  line_code: string;
  subscription_type: 'weekly' | 'monthly' | 'semester';
  start_date: string;
  end_date: string;
  amount: number;
  status: 'active' | 'expired' | 'cancelled';
  payment_date: string | null;
}

interface SubscriptionOption {
  type: 'weekly' | 'monthly' | 'semester';
  label: string;
  duration: string;
  price: number;
  savings?: string;
}

export function SubscriptionWidget() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [availableLines] = useState([
    { id: '1', name: 'Ligne A - Centre Ville', code: 'LN-A', price: 2.50 },
    { id: '2', name: 'Ligne B - Banlieue Nord', code: 'LN-B', price: 3.00 },
    { id: '3', name: 'Ligne C - Campus Universitaire', code: 'LN-C', price: 1.50 }
  ]);
  const [selectedLine, setSelectedLine] = useState('');
  const [selectedType, setSelectedType] = useState<'weekly' | 'monthly' | 'semester'>('monthly');
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(false);
  const { toast } = useToast();

  const subscriptionOptions: SubscriptionOption[] = [
    {
      type: 'weekly',
      label: 'Hebdomadaire',
      duration: '7 jours',
      price: 15,
      savings: '25% d\'économie'
    },
    {
      type: 'monthly',
      label: 'Mensuel',
      duration: '30 jours',
      price: 50,
      savings: '45% d\'économie'
    },
    {
      type: 'semester',
      label: 'Semestriel',
      duration: '6 mois',
      price: 250,
      savings: '60% d\'économie'
    }
  ];

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockSubscriptions: Subscription[] = [
        {
          id: '1',
          line_name: 'Ligne A - Centre Ville',
          line_code: 'LN-A',
          subscription_type: 'monthly',
          start_date: '2024-01-01',
          end_date: '2024-01-31',
          amount: 50,
          status: 'active',
          payment_date: '2024-01-01T10:00:00Z'
        }
      ];
      
      setSubscriptions(mockSubscriptions);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async () => {
    if (!selectedLine || !selectedType) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une ligne et un type d'abonnement",
        variant: "destructive"
      });
      return;
    }

    setSubscribing(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const selectedLineData = availableLines.find(line => line.id === selectedLine);
      const option = subscriptionOptions.find(opt => opt.type === selectedType);
      
      if (selectedLineData && option) {
        const startDate = new Date();
        let endDate: Date;
        
        switch (selectedType) {
          case 'weekly':
            endDate = addWeeks(startDate, 1);
            break;
          case 'monthly':
            endDate = addMonths(startDate, 1);
            break;
          case 'semester':
            endDate = addMonths(startDate, 6);
            break;
        }

        const newSubscription: Subscription = {
          id: Date.now().toString(),
          line_name: selectedLineData.name,
          line_code: selectedLineData.code,
          subscription_type: selectedType,
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
          amount: option.price,
          status: 'active',
          payment_date: new Date().toISOString()
        };

        setSubscriptions(prev => [...prev, newSubscription]);
        setSelectedLine('');
        setSelectedType('monthly');
        
        toast({
          title: "Abonnement souscrit",
          description: "Votre abonnement a été activé avec succès"
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de souscrire l'abonnement",
        variant: "destructive"
      });
    } finally {
      setSubscribing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'expired': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'cancelled': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Actif';
      case 'expired': return 'Expiré';
      case 'cancelled': return 'Annulé';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-4 bg-muted rounded w-1/3"></div>
          </CardHeader>
          <CardContent>
            <div className="h-20 bg-muted rounded"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Active subscriptions */}
      {subscriptions.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Mes abonnements</h3>
          {subscriptions.map((subscription) => (
            <Card key={subscription.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="font-mono">
                      {subscription.line_code}
                    </Badge>
                    <h4 className="font-medium">{subscription.line_name}</h4>
                  </div>
                  
                  <Badge className={getStatusColor(subscription.status)}>
                    {subscription.status === 'active' && <CheckCircle className="h-3 w-3 mr-1" />}
                    {subscription.status === 'expired' && <AlertCircle className="h-3 w-3 mr-1" />}
                    {getStatusText(subscription.status)}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>
                      Du {format(new Date(subscription.start_date), "dd/MM/yyyy", { locale: fr })} au{" "}
                      {format(new Date(subscription.end_date), "dd/MM/yyyy", { locale: fr })}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <span>{subscription.amount.toFixed(2)}€</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="capitalize">{subscription.subscription_type}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Subscription options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Souscrire un abonnement
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Line selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Ligne de transport</label>
            <Select value={selectedLine} onValueChange={setSelectedLine}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez une ligne" />
              </SelectTrigger>
              <SelectContent>
                {availableLines.map((line) => (
                  <SelectItem key={line.id} value={line.id}>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">{line.code}</Badge>
                      <span>{line.name}</span>
                      <span className="text-muted-foreground">({line.price.toFixed(2)}€/trajet)</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Subscription type selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Type d'abonnement</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {subscriptionOptions.map((option) => (
                <Card 
                  key={option.type}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedType === option.type ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedType(option.type)}
                >
                  <CardContent className="p-4 text-center">
                    <h4 className="font-semibold mb-1">{option.label}</h4>
                    <p className="text-2xl font-bold text-primary mb-1">{option.price}€</p>
                    <p className="text-sm text-muted-foreground mb-2">{option.duration}</p>
                    {option.savings && (
                      <Badge variant="outline" className="text-xs">
                        {option.savings}
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Subscribe button */}
          <Button 
            onClick={handleSubscribe} 
            className="w-full" 
            disabled={subscribing || !selectedLine}
          >
            {subscribing ? "Souscription en cours..." : "Souscrire l'abonnement"}
          </Button>

          {/* Benefits info */}
          <div className="p-4 bg-muted rounded-lg">
            <h5 className="font-medium mb-2">Avantages de l'abonnement</h5>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Voyages illimités sur la ligne sélectionnée</li>
              <li>• Économies importantes par rapport aux trajets individuels</li>
              <li>• Accès prioritaire aux réservations</li>
              <li>• Notifications en temps réel des horaires</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}