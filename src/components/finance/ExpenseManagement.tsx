import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  Search, 
  Filter, 
  Receipt, 
  Eye, 
  Edit,
  Check,
  X,
  Upload,
  Calendar,
  Building,
  Plus,
  TrendingUp,
  AlertTriangle,
  FileText
} from 'lucide-react';

export function ExpenseManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const { toast } = useToast();

  const handleNewExpense = () => {
    toast({
      title: "Nouvelle Dépense",
      description: "Formulaire de saisie de dépense ouvert",
    });
  };

  const handleApprove = (expenseId: string) => {
    toast({
      title: "Dépense Approuvée",
      description: `Dépense ${expenseId} approuvée avec succès`,
    });
  };

  const handleReject = (expenseId: string) => {
    toast({
      title: "Dépense Rejetée",
      description: `Dépense ${expenseId} rejetée`,
    });
  };

  const expenses = [
    {
      id: "EXP24-0123",
      supplier: "Fournitures Bureau Plus",
      category: "Matériel de bureau",
      amount: 1250.00,
      date: "2024-03-15",
      status: "pending",
      requester: "Marie Dubois",
      receipt: true
    },
    {
      id: "EXP24-0124",
      supplier: "TechCorp Solutions",
      category: "Équipement informatique",
      amount: 3450.00,
      date: "2024-03-18",
      status: "approved",
      requester: "Jean Martin",
      receipt: true
    },
    {
      id: "EXP24-0125",
      supplier: "Électricité de France",
      category: "Énergie",
      amount: 890.50,
      date: "2024-03-20",
      status: "paid",
      requester: "Système Auto",
      receipt: false
    },
    {
      id: "EXP24-0126",
      supplier: "Nettoyage Pro",
      category: "Services",
      amount: 675.00,
      date: "2024-03-22",
      status: "rejected",
      requester: "Sophie Laurent",
      receipt: true
    }
  ];

  const categories = [
    { name: "Matériel de bureau", budget: 5000, used: 3200, percent: 64 },
    { name: "Équipement informatique", budget: 15000, used: 8900, percent: 59 },
    { name: "Énergie", budget: 3000, used: 2100, percent: 70 },
    { name: "Services", budget: 8000, used: 4500, percent: 56 },
    { name: "Formation", budget: 6000, used: 2800, percent: 47 }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">En attente</Badge>;
      case 'approved':
        return <Badge className="bg-blue-100 text-blue-700 border-blue-200">Approuvée</Badge>;
      case 'paid':
        return <Badge className="bg-green-100 text-green-700 border-green-200">Payée</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-700 border-red-200">Rejetée</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterStatus === 'all') return matchesSearch;
    return matchesSearch && expense.status === filterStatus;
  });

  return (
    <div className="space-y-6">
      {/* Actions principales */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex gap-3">
              <Button onClick={handleNewExpense} className="gap-2">
                <Plus className="w-4 h-4" />
                Nouvelle Dépense
              </Button>
              <Button variant="outline" className="gap-2">
                <Upload className="w-4 h-4" />
                Import Factures
              </Button>
            </div>
            
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par fournisseur, catégorie..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="approved">Approuvées</SelectItem>
                  <SelectItem value="paid">Payées</SelectItem>
                  <SelectItem value="rejected">Rejetées</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="gap-2">
                <Calendar className="w-4 h-4" />
                Période
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Suivi budgétaire par catégorie */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            Suivi Budgétaire par Poste
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categories.map((category, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{category.name}</span>
                    <span className="text-sm text-muted-foreground">
                      €{category.used.toLocaleString()} / €{category.budget.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        category.percent > 80 ? 'bg-red-500' : 
                        category.percent > 60 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${category.percent}%` }}
                    />
                  </div>
                </div>
                <div className="ml-4">
                  <span className={`text-sm font-medium ${
                    category.percent > 80 ? 'text-red-600' : 
                    category.percent > 60 ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {category.percent}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Liste des dépenses */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-purple-500" />
            Dépenses ({filteredExpenses.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredExpenses.map((expense, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-xl border border-border/50 hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-500/10 rounded-xl">
                    <Receipt className="w-5 h-5 text-purple-500" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-foreground">{expense.id}</p>
                      {getStatusBadge(expense.status)}
                      {expense.receipt && (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          <FileText className="w-3 h-3 mr-1" />
                          Justificatif
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{expense.supplier}</p>
                    <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                      <span>{expense.category}</span>
                      <span>Par: {expense.requester}</span>
                      <span>{expense.date}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right space-y-1">
                  <span className="font-semibold text-foreground text-lg">
                    €{expense.amount.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" className="gap-1">
                    <Eye className="w-3 h-3" />
                    Voir
                  </Button>
                  
                  {expense.status === 'pending' && (
                    <>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="gap-1 text-green-600 border-green-200 hover:bg-green-50"
                        onClick={() => handleApprove(expense.id)}
                      >
                        <Check className="w-3 h-3" />
                        Approuver
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="gap-1 text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() => handleReject(expense.id)}
                      >
                        <X className="w-3 h-3" />
                        Rejeter
                      </Button>
                    </>
                  )}
                  
                  {expense.status === 'approved' && (
                    <Button size="sm" className="gap-1">
                      <Building className="w-3 h-3" />
                      Payer
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Alertes budgétaires */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            Alertes Budgétaires
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-red-50 rounded-lg border border-red-200">
              <p className="text-sm font-medium text-red-700">Budget Énergie dépassé</p>
              <p className="text-xs text-red-600">70% du budget annuel consommé</p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-sm font-medium text-yellow-700">3 dépenses en attente d'approbation</p>
              <p className="text-xs text-yellow-600">Total: €4,375</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}