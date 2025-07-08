import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { 
  MoreHorizontal, 
  CheckSquare, 
  Square, 
  Trash2, 
  Archive, 
  Eye, 
  EyeOff,
  Download,
  Share2
} from 'lucide-react';

interface BulkActionItem {
  id: string;
  title: string;
  type?: string;
  selected?: boolean;
}

interface BulkActionButtonProps {
  items: BulkActionItem[];
  onSelectionChange: (selectedIds: string[]) => void;
  onBulkAction: (action: string, selectedIds: string[]) => Promise<void>;
  className?: string;
}

export function BulkActionButton({
  items,
  onSelectionChange,
  onBulkAction,
  className
}: BulkActionButtonProps) {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<{ action: string; title: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const selectedCount = selectedItems.length;
  const isAllSelected = selectedCount === items.length && items.length > 0;
  const isPartialSelected = selectedCount > 0 && selectedCount < items.length;

  const handleSelectAll = () => {
    const newSelection = isAllSelected ? [] : items.map(item => item.id);
    setSelectedItems(newSelection);
    onSelectionChange(newSelection);
  };

  const handleSelectItem = (itemId: string) => {
    const newSelection = selectedItems.includes(itemId)
      ? selectedItems.filter(id => id !== itemId)
      : [...selectedItems, itemId];
    
    setSelectedItems(newSelection);
    onSelectionChange(newSelection);
  };

  const handleBulkAction = async (action: string, requiresConfirmation = false) => {
    if (selectedCount === 0) {
      toast({
        title: "Aucune sélection",
        description: "Veuillez sélectionner au moins un élément",
        variant: "destructive"
      });
      return;
    }

    if (requiresConfirmation) {
      setPendingAction({ 
        action, 
        title: getActionTitle(action) 
      });
      setIsConfirmDialogOpen(true);
      return;
    }

    await executeBulkAction(action);
  };

  const executeBulkAction = async (action: string) => {
    setIsLoading(true);
    try {
      await onBulkAction(action, selectedItems);
      
      toast({
        title: "Action terminée",
        description: `${getActionTitle(action)} appliquée à ${selectedCount} élément(s)`,
      });

      // Reset selection after successful action
      setSelectedItems([]);
      onSelectionChange([]);
      
    } catch (error) {
      console.error('Bulk action error:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'exécution de l'action",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const confirmAction = async () => {
    if (pendingAction) {
      await executeBulkAction(pendingAction.action);
      setIsConfirmDialogOpen(false);
      setPendingAction(null);
    }
  };

  const getActionTitle = (action: string) => {
    switch (action) {
      case 'mark_read': return 'Marquer comme lu';
      case 'mark_unread': return 'Marquer comme non lu';
      case 'archive': return 'Archiver';
      case 'delete': return 'Supprimer';
      case 'download': return 'Télécharger';
      case 'share': return 'Partager';
      default: return action;
    }
  };

  return (
    <>
      <div className={`flex items-center gap-3 ${className}`}>
        {/* Select All Checkbox */}
        <div className="flex items-center gap-2">
          <Checkbox
            checked={isAllSelected}
            onCheckedChange={handleSelectAll}
          />
          <span className="text-sm text-muted-foreground">
            {selectedCount > 0 ? `${selectedCount} sélectionné(s)` : 'Tout sélectionner'}
          </span>
        </div>

        {/* Bulk Actions Menu */}
        {selectedCount > 0 && (
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="px-2 py-1">
              {selectedCount} élément(s)
            </Badge>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <MoreHorizontal className="w-4 h-4" />
                  )}
                  Actions
                </Button>
              </DropdownMenuTrigger>
              
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => handleBulkAction('mark_read')}>
                  <Eye className="w-4 h-4 mr-2" />
                  Marquer comme lu
                </DropdownMenuItem>
                
                <DropdownMenuItem onClick={() => handleBulkAction('mark_unread')}>
                  <EyeOff className="w-4 h-4 mr-2" />
                  Marquer comme non lu
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem onClick={() => handleBulkAction('archive')}>
                  <Archive className="w-4 h-4 mr-2" />
                  Archiver
                </DropdownMenuItem>
                
                <DropdownMenuItem onClick={() => handleBulkAction('download')}>
                  <Download className="w-4 h-4 mr-2" />
                  Télécharger
                </DropdownMenuItem>
                
                <DropdownMenuItem onClick={() => handleBulkAction('share')}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Partager
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem 
                  onClick={() => handleBulkAction('delete', true)}
                  className="text-red-600 focus:text-red-600"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Supprimer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      {/* Individual Item Checkboxes */}
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-3 p-2 rounded hover:bg-muted/30">
            <Checkbox
              checked={selectedItems.includes(item.id)}
              onCheckedChange={() => handleSelectItem(item.id)}
            />
            <div className="flex-1">
              <p className="text-sm font-medium">{item.title}</p>
              {item.type && (
                <Badge variant="outline" className="text-xs">
                  {item.type}
                </Badge>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer l'action</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir {pendingAction?.title.toLowerCase()} {selectedCount} élément(s) ?
              {pendingAction?.action === 'delete' && (
                <span className="block mt-2 text-red-600 font-medium">
                  Cette action est irréversible.
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmDialogOpen(false)}>
              Annuler
            </Button>
            <Button 
              variant={pendingAction?.action === 'delete' ? 'destructive' : 'default'}
              onClick={confirmAction}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
              ) : null}
              Confirmer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}