import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StudentCard } from '@/hooks/students/useStudentCards';
import { 
  CreditCard, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  QrCode,
  SortAsc,
  SortDesc,
  Calendar,
  User
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface EnhancedCardsTableProps {
  cards: StudentCard[];
  loading: boolean;
  onBulkExport?: (cardIds: string[]) => void;
  onViewCard?: (card: StudentCard) => void;
}

export function EnhancedCardsTable({ 
  cards, 
  loading, 
  onBulkExport, 
  onViewCard 
}: EnhancedCardsTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [templateFilter, setTemplateFilter] = useState('all');
  const [sortField, setSortField] = useState<'name' | 'card_number' | 'issue_date' | 'expiry_date'>('issue_date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedCards, setSelectedCards] = useState<string[]>([]);

  const filteredAndSortedCards = useMemo(() => {
    let filtered = cards.filter(card => {
      const matchesSearch = 
        card.students.profiles.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.students.student_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.card_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.students.programs.name.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'to_print' && card.status === 'active' && !card.is_printed) ||
        (statusFilter === 'printed' && card.is_printed) ||
        card.status === statusFilter;

      const matchesTemplate = templateFilter === 'all' || 
        card.student_card_templates.name === templateFilter;

      return matchesSearch && matchesStatus && matchesTemplate;
    });

    // Sort
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortField) {
        case 'name':
          aValue = a.students.profiles.full_name;
          bValue = b.students.profiles.full_name;
          break;
        case 'card_number':
          aValue = a.card_number;
          bValue = b.card_number;
          break;
        case 'issue_date':
          aValue = new Date(a.issue_date);
          bValue = new Date(b.issue_date);
          break;
        case 'expiry_date':
          aValue = a.expiry_date ? new Date(a.expiry_date) : new Date(0);
          bValue = b.expiry_date ? new Date(b.expiry_date) : new Date(0);
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [cards, searchTerm, statusFilter, templateFilter, sortField, sortOrder]);

  const uniqueTemplates = useMemo(() => {
    const templates = new Set(cards.map(card => card.student_card_templates.name));
    return Array.from(templates);
  }, [cards]);

  const getStatusBadge = (status: string, isPrinted: boolean) => {
    if (status === 'active' && !isPrinted) {
      return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">À imprimer</Badge>;
    }
    if (status === 'active' && isPrinted) {
      return <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">Active</Badge>;
    }
    if (status === 'expired') {
      return <Badge variant="secondary" className="bg-red-100 text-red-800">Expirée</Badge>;
    }
    if (status === 'suspended') {
      return <Badge variant="secondary" className="bg-gray-100 text-gray-800">Suspendue</Badge>;
    }
    return <Badge variant="outline">{status}</Badge>;
  };

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleSelectCard = (cardId: string) => {
    setSelectedCards(prev => 
      prev.includes(cardId) 
        ? prev.filter(id => id !== cardId)
        : [...prev, cardId]
    );
  };

  const handleSelectAll = () => {
    if (selectedCards.length === filteredAndSortedCards.length) {
      setSelectedCards([]);
    } else {
      setSelectedCards(filteredAndSortedCards.map(card => card.id));
    }
  };

  if (loading) {
    return (
      <Card className="animate-fade-in">
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="text-muted-foreground">Chargement des cartes...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Cartes Étudiants ({filteredAndSortedCards.length})
          </CardTitle>
          {selectedCards.length > 0 && (
            <Button
              onClick={() => onBulkExport?.(selectedCards)}
              size="sm"
              className="animate-scale-in"
            >
              <Download className="w-4 h-4 mr-2" />
              Exporter ({selectedCards.length})
            </Button>
          )}
        </div>
        
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par nom, numéro étudiant, numéro de carte..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="to_print">À imprimer</SelectItem>
              <SelectItem value="printed">Imprimées</SelectItem>
              <SelectItem value="active">Actives</SelectItem>
              <SelectItem value="expired">Expirées</SelectItem>
              <SelectItem value="suspended">Suspendues</SelectItem>
            </SelectContent>
          </Select>

          <Select value={templateFilter} onValueChange={setTemplateFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Template" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les templates</SelectItem>
              {uniqueTemplates.map(template => (
                <SelectItem key={template} value={template}>{template}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        {filteredAndSortedCards.length === 0 ? (
          <div className="text-center py-8">
            <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-muted-foreground mb-2">
              Aucune carte trouvée
            </h3>
            <p className="text-muted-foreground">
              Aucune carte ne correspond aux critères de recherche.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-3 w-8">
                    <input
                      type="checkbox"
                      checked={selectedCards.length === filteredAndSortedCards.length}
                      onChange={handleSelectAll}
                      className="rounded"
                    />
                  </th>
                  <th 
                    className="pb-3 font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      Étudiant
                      {sortField === 'name' && (
                        sortOrder === 'asc' ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="pb-3 font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                    onClick={() => handleSort('card_number')}
                  >
                    <div className="flex items-center gap-1">
                      <CreditCard className="w-4 h-4" />
                      Numéro de carte
                      {sortField === 'card_number' && (
                        sortOrder === 'asc' ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />
                      )}
                    </div>
                  </th>
                  <th className="pb-3 font-medium text-muted-foreground">Programme</th>
                  <th 
                    className="pb-3 font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                    onClick={() => handleSort('issue_date')}
                  >
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Date d'émission
                      {sortField === 'issue_date' && (
                        sortOrder === 'asc' ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />
                      )}
                    </div>
                  </th>
                  <th className="pb-3 font-medium text-muted-foreground">Expiration</th>
                  <th className="pb-3 font-medium text-muted-foreground">Statut</th>
                  <th className="pb-3 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredAndSortedCards.map((card) => (
                  <tr key={card.id} className="hover:bg-muted/30 transition-colors animate-fade-in">
                    <td className="py-3">
                      <input
                        type="checkbox"
                        checked={selectedCards.includes(card.id)}
                        onChange={() => handleSelectCard(card.id)}
                        className="rounded"
                      />
                    </td>
                    <td className="py-3">
                      <div>
                        <div className="font-medium">{card.students.profiles.full_name}</div>
                        <div className="text-sm text-muted-foreground">
                          {card.students.student_number}
                        </div>
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="font-mono text-sm font-medium">
                        {card.card_number}
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="text-sm">{card.students.programs.name}</div>
                    </td>
                    <td className="py-3">
                      <div className="text-sm">
                        {format(new Date(card.issue_date), 'dd/MM/yyyy', { locale: fr })}
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="text-sm">
                        {card.expiry_date 
                          ? format(new Date(card.expiry_date), 'dd/MM/yyyy', { locale: fr })
                          : 'N/A'
                        }
                      </div>
                    </td>
                    <td className="py-3">
                      {getStatusBadge(card.status, card.is_printed)}
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:scale-105 transition-transform"
                          title="Voir la carte"
                          onClick={() => onViewCard?.(card)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:scale-105 transition-transform"
                          title="Code QR"
                        >
                          <QrCode className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:scale-105 transition-transform"
                          title="Télécharger PDF"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}