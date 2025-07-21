import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PromotionDashboard } from './PromotionDashboard';
import { PromotionCriteriaManager } from './PromotionCriteriaManager';
import { StudentEvaluationInterface } from './StudentEvaluationInterface';
import { PromotionWizard } from './PromotionWizard';
import { PromotionReports } from './PromotionReports';

export function PromotionManagement() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="flex-1 space-y-6 p-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="dashboard">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="criteria">Critères</TabsTrigger>
          <TabsTrigger value="evaluation">Évaluation</TabsTrigger>
          <TabsTrigger value="wizard">Assistant</TabsTrigger>
          <TabsTrigger value="reports">Rapports</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <PromotionDashboard />
        </TabsContent>

        <TabsContent value="criteria" className="space-y-6">
          <PromotionCriteriaManager />
        </TabsContent>

        <TabsContent value="evaluation" className="space-y-6">
          <StudentEvaluationInterface />
        </TabsContent>

        <TabsContent value="wizard" className="space-y-6">
          <PromotionWizard />
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <PromotionReports />
        </TabsContent>
      </Tabs>
    </div>
  );
}