import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Send, CheckCircle } from 'lucide-react';

interface ValidateInvoiceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: any;
  onSuccess: () => void;
}

export function ValidateInvoiceModal({ open, onOpenChange, invoice, onSuccess }: ValidateInvoiceModalProps) {
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleValidate = async () => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('invoices')
        .update({ 
          status: 'sent',
          notes: notes || invoice.notes
        })
        .eq('id', invoice.id);

      if (error) throw error;

      toast({
        title: "Facture validée",
        description: `La facture ${invoice.invoice_number} a été validée et envoyée`,
      });

      onSuccess();
      onOpenChange(false);
      setNotes('');
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de valider la facture",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Valider & Envoyer la Facture
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="p-4 bg-accent/50 rounded-lg">
            <h4 className="font-medium">{invoice?.invoice_number}</h4>
            <p className="text-sm text-muted-foreground">
              {invoice?.invoice_type === 'student' ? 
                invoice?.student?.profile?.full_name : 
                invoice?.recipient_name
              }
            </p>
            <p className="text-lg font-semibold">
              €{invoice?.total_amount?.toLocaleString()}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes supplémentaires (optionnel)</Label>
            <Textarea
              id="notes"
              placeholder="Ajouter des notes à la facture..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Annuler
            </Button>
            <Button 
              onClick={handleValidate}
              disabled={loading}
              className="gap-2"
            >
              <Send className="w-4 h-4" />
              {loading ? 'Validation...' : 'Valider & Envoyer'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}