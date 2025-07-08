import { useMemo } from 'react';
import { usePayments } from './usePayments';
import { useExpenses } from './useExpenses';
import { useInvoices } from './useInvoices';
import { useTreasuryPeriod, TreasuryPeriod } from './useTreasuryPeriod';

export interface TreasuryIncomeData {
  paymentMethods: {
    name: string;
    amount: number;
    count: number;
    growth: number;
    dailyAmount: number;
    icon: any;
    color: string;
  }[];
  totalIncome: number;
  totalDailyIncome: number;
  transactionCount: number;
  successRate: number;
}

export interface TreasuryExpenseData {
  categories: {
    name: string;
    amount: number;
    count: number;
    growth: number;
    budget: number;
    percentage: number;
    icon: any;
    color: string;
  }[];
  totalExpenses: number;
  totalBudget: number;
  budgetUsagePercentage: number;
}

export interface TreasuryInvoiceData {
  studentInvoices: {
    total: number;
    paid: number;
    pending: number;
    partial: number;
    count: number;
  };
  commercialInvoices: {
    total: number;
    paid: number;
    pending: number;
    partial: number;
    count: number;
  };
  collectionRate: number;
  totalInvoiced: number;
  totalCollected: number;
}

export function useTreasuryData(period?: TreasuryPeriod) {
  const { payments, loading: paymentsLoading } = usePayments();
  const { expenses, loading: expensesLoading } = useExpenses();
  const { invoices, loading: invoicesLoading } = useInvoices();
  const { selectedPeriod: contextPeriod, getPeriodDates } = useTreasuryPeriod();
  
  const currentPeriod = period || contextPeriod;
  const { start, end } = getPeriodDates(currentPeriod);

  // Données d'encaissements calculées
  const incomeData: TreasuryIncomeData = useMemo(() => {
    // Mock data pour les modes de paiement - montants cohérents pour établissement d'enseignement
    const paymentMethodsData = [
      { name: "Cartes Bancaires", amount: 125000, count: 156, growth: 8, dailyAmount: 4200, icon: 'CreditCard', color: "text-blue-500" },
      { name: "Virements SEPA", amount: 280000, count: 89, growth: 12, dailyAmount: 9300, icon: 'ArrowUpDown', color: "text-green-500" },
      { name: "Prélèvements", amount: 450000, count: 320, growth: 5, dailyAmount: 15000, icon: 'Banknote', color: "text-purple-500" },
      { name: "Paiement Mobile", amount: 35000, count: 78, growth: 25, dailyAmount: 1200, icon: 'Smartphone', color: "text-orange-500" },
      { name: "Espèces", amount: 12000, count: 32, growth: -2, dailyAmount: 400, icon: 'Euro', color: "text-gray-500" }
    ];

    const totalIncome = paymentMethodsData.reduce((sum, method) => sum + method.amount, 0);
    const totalDailyIncome = paymentMethodsData.reduce((sum, method) => sum + method.dailyAmount, 0);
    const transactionCount = paymentMethodsData.reduce((sum, method) => sum + method.count, 0);

    return {
      paymentMethods: paymentMethodsData,
      totalIncome,
      totalDailyIncome,
      transactionCount,
      successRate: 96.2
    };
  }, [payments, currentPeriod]);

  // Données de dépenses calculées
  const expenseData: TreasuryExpenseData = useMemo(() => {
    // Mock data pour les catégories - budgets réalistes pour établissement d'enseignement
    const categoriesData = [
      { name: "Personnel & Salaires", amount: 520000, count: 45, growth: 2, budget: 600000, percentage: 87, icon: 'Users', color: "text-blue-500" },
      { name: "Équipements & Infrastructure", amount: 85000, count: 23, growth: -8, budget: 120000, percentage: 71, icon: 'Building', color: "text-purple-500" },
      { name: "Fournitures Pédagogiques", amount: 45000, count: 67, growth: 15, budget: 60000, percentage: 75, icon: 'BookOpen', color: "text-green-500" },
      { name: "Services & Maintenance", amount: 32000, count: 34, growth: 5, budget: 40000, percentage: 80, icon: 'Zap', color: "text-orange-500" },
      { name: "Frais Généraux", amount: 28000, count: 56, growth: -3, budget: 35000, percentage: 80, icon: 'Receipt', color: "text-gray-500" }
    ];

    const totalExpenses = categoriesData.reduce((sum, cat) => sum + cat.amount, 0);
    const totalBudget = categoriesData.reduce((sum, cat) => sum + cat.budget, 0);
    const budgetUsagePercentage = (totalExpenses / totalBudget) * 100;

    return {
      categories: categoriesData,
      totalExpenses,
      totalBudget,
      budgetUsagePercentage
    };
  }, [expenses, currentPeriod]);

  // Données de facturation calculées
  const invoiceData: TreasuryInvoiceData = useMemo(() => {
    // Mock data pour les factures - montants cohérents avec les encaissements
    const studentStats = {
      total: 780000,
      paid: 650000,
      pending: 95000,
      partial: 35000,
      count: 425
    };

    const commercialStats = {
      total: 165000,
      paid: 125000,
      pending: 25000,
      partial: 15000,
      count: 12
    };

    const totalInvoiced = studentStats.total + commercialStats.total;
    const totalCollected = studentStats.paid + commercialStats.paid;
    const collectionRate = (totalCollected / totalInvoiced) * 100;

    return {
      studentInvoices: studentStats,
      commercialInvoices: commercialStats,
      collectionRate,
      totalInvoiced,
      totalCollected
    };
  }, [invoices, currentPeriod]);

  // Position de trésorerie calculée
  const treasuryPosition = useMemo(() => {
    const netPosition = incomeData.totalIncome - expenseData.totalExpenses;
    const cashFlow = incomeData.totalDailyIncome;
    const liquidityRatio = incomeData.totalIncome / expenseData.totalExpenses;

    return {
      netPosition,
      cashFlow,
      liquidityRatio,
      operationalEfficiency: (invoiceData.collectionRate + incomeData.successRate) / 2
    };
  }, [incomeData, expenseData, invoiceData]);

  return {
    incomeData,
    expenseData,
    invoiceData,
    treasuryPosition,
    loading: paymentsLoading || expensesLoading || invoicesLoading,
    period: currentPeriod
  };
}