import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useStudentCards, StudentCard } from '@/hooks/students/useStudentCards';
import { Loader2, Printer } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface PrintBatchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cards: StudentCard[];
}

export function PrintBatchDialog({ open, onOpenChange, cards }: PrintBatchDialogProps) {
  const [batchName, setBatchName] = useState(`Lot ${format(new Date(), 'dd/MM/yyyy')}`);
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const { createPrintBatch, loading } = useStudentCards();

  const unprintedCards = cards.filter(card => 
    card.status === 'active' && !card.is_printed
  );

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCards(unprintedCards.map(card => card.id));
    } else {
      setSelectedCards([]);
    }
  };

  const handleCardSelect = (cardId: string, checked: boolean) => {
    if (checked) {
      setSelectedCards(prev => [...prev, cardId]);
    } else {
      setSelectedCards(prev => prev.filter(id => id !== cardId));
    }
  };

  const handleCreateBatch = async () => {
    if (selectedCards.length === 0) return;
    
    const result = await createPrintBatch(selectedCards, batchName);
    if (result.success) {
      onOpenChange(false);
      setSelectedCards([]);
      setBatchName(`Lot ${format(new Date(), 'dd/MM/yyyy')}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-blue-500" />
            Créer un Lot d'Impression
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="batchName">Nom du lot</Label>
            <Input
              id="batchName"
              value={batchName}
              onChange={(e) => setBatchName(e.target.value)}
              placeholder="Nom du lot d'impression..."
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Cartes à imprimer ({unprintedCards.length} disponibles)</Label>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="selectAll"
                  checked={selectedCards.length === unprintedCards.length && unprintedCards.length > 0}
                  onCheckedChange={handleSelectAll}
                />
                <Label htmlFor="selectAll">Tout sélectionner</Label>
              </div>
            </div>

            <div className="border rounded-lg max-h-64 overflow-y-auto">
              {unprintedCards.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  Aucune carte disponible pour l'impression
                </div>
              ) : (
                <div className="divide-y">
                  {unprintedCards.map((card) => (
                    <div key={card.id} className="flex items-center space-x-3 p-3">
                      <Checkbox
                        checked={selectedCards.includes(card.id)}
                        onCheckedChange={(checked) => handleCardSelect(card.id, checked as boolean)}
                      />
                      <div className="flex-1 grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <div className="font-medium">{card.students.profiles.full_name}</div>
                          <div className="text-muted-foreground">{card.students.student_number}</div>
                        </div>
                        <div>
                          <div className="font-medium">{card.card_number}</div>
                          <div className="text-muted-foreground">{card.students.programs.name}</div>
                        </div>
                        <div>
                          <div className="font-medium">
                            {format(new Date(card.issue_date), 'dd/MM/yyyy', { locale: fr })}
                          </div>
                          <div className="text-muted-foreground">
                            Expire: {card.expiry_date 
                              ? format(new Date(card.expiry_date), 'dd/MM/yyyy', { locale: fr })
                              : 'N/A'
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {selectedCards.length > 0 && (
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="text-sm font-medium">
                  {selectedCards.length} carte(s) sélectionnée(s) pour l'impression
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button 
            onClick={handleCreateBatch}
            disabled={loading || selectedCards.length === 0 || !batchName.trim()}
          >
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Créer le Lot ({selectedCards.length})
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}