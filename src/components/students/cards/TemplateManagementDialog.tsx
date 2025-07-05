import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useStudentCards, CardTemplate } from '@/hooks/students/useStudentCards';
import { TemplateForm } from './TemplateForm';
import { TemplatePreview } from './TemplatePreview';
import { TemplatesList } from './TemplatesList';
import { Settings, Plus } from 'lucide-react';

interface TemplateManagementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TemplateManagementDialog({ open, onOpenChange }: TemplateManagementDialogProps) {
  const [activeTab, setActiveTab] = useState('list');
  const [editingTemplate, setEditingTemplate] = useState<CardTemplate | null>(null);
  const { templates, loading } = useStudentCards();

  const handleEditTemplate = (template: CardTemplate) => {
    setEditingTemplate(template);
    setActiveTab('form');
  };

  const handleCreateNew = () => {
    setEditingTemplate(null);
    setActiveTab('form');
  };

  const handleFormSuccess = () => {
    setEditingTemplate(null);
    setActiveTab('list');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-500" />
            Gestion des Templates de Cartes
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="list">Templates</TabsTrigger>
              <TabsTrigger value="form">
                {editingTemplate ? 'Modifier' : 'Nouveau'}
              </TabsTrigger>
              <TabsTrigger value="preview">Aperçu</TabsTrigger>
            </TabsList>

            <Button 
              onClick={handleCreateNew}
              size="sm"
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Nouveau Template
            </Button>
          </div>

          <div className="flex-1 overflow-hidden">
            <TabsContent value="list" className="h-full">
              <TemplatesList 
                templates={templates}
                loading={loading}
                onEdit={handleEditTemplate}
              />
            </TabsContent>

            <TabsContent value="form" className="h-full">
              <TemplateForm
                template={editingTemplate}
                onSuccess={handleFormSuccess}
                onCancel={() => setActiveTab('list')}
              />
            </TabsContent>

            <TabsContent value="preview" className="h-full">
              <TemplatePreview
                template={editingTemplate || templates[0]}
              />
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}