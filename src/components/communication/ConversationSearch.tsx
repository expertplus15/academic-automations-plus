import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Filter, Calendar, User, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface SearchResult {
  id: string;
  content: string;
  sender_name: string;
  created_at: string;
  message_type: string;
  conversation_id: string;
}

interface ConversationSearchProps {
  onSelectResult: (result: SearchResult) => void;
  conversationId?: string;
}

export function ConversationSearch({ onSelectResult, conversationId }: ConversationSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [filters, setFilters] = useState({
    messageType: 'all',
    dateRange: 'all',
    sender: 'all'
  });

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      // Simulate search results for now
      // In real implementation, this would query the database
      const mockResults: SearchResult[] = [
        {
          id: '1',
          content: `Message contenant "${searchQuery}"...`,
          sender_name: 'Jean Dupont',
          created_at: new Date().toISOString(),
          message_type: 'TEXT',
          conversation_id: conversationId || '1'
        },
        {
          id: '2',
          content: `Autre résultat avec "${searchQuery}"...`,
          sender_name: 'Marie Martin',
          created_at: new Date(Date.now() - 86400000).toISOString(),
          message_type: 'FILE',
          conversation_id: conversationId || '2'
        }
      ];
      
      setSearchResults(mockResults);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const getMessageTypeIcon = (type: string) => {
    switch (type) {
      case 'FILE':
        return <FileText className="w-3 h-3" />;
      case 'IMAGE':
        return <FileText className="w-3 h-3" />;
      default:
        return null;
    }
  };

  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, index) => 
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={index} className="bg-yellow-200 px-1 rounded">
          {part}
        </mark>
      ) : part
    );
  };

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher dans les messages..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <Button onClick={handleSearch} disabled={isSearching}>
          {isSearching ? 'Recherche...' : 'Rechercher'}
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <Badge 
          variant={filters.messageType === 'all' ? 'default' : 'secondary'}
          className="cursor-pointer"
          onClick={() => setFilters(prev => ({ ...prev, messageType: 'all' }))}
        >
          Tous les types
        </Badge>
        <Badge 
          variant={filters.messageType === 'TEXT' ? 'default' : 'secondary'}
          className="cursor-pointer"
          onClick={() => setFilters(prev => ({ ...prev, messageType: 'TEXT' }))}
        >
          Texte
        </Badge>
        <Badge 
          variant={filters.messageType === 'FILE' ? 'default' : 'secondary'}
          className="cursor-pointer"
          onClick={() => setFilters(prev => ({ ...prev, messageType: 'FILE' }))}
        >
          Fichiers
        </Badge>
        <Badge 
          variant={filters.messageType === 'IMAGE' ? 'default' : 'secondary'}
          className="cursor-pointer"
          onClick={() => setFilters(prev => ({ ...prev, messageType: 'IMAGE' }))}
        >
          Images
        </Badge>
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          <p className="text-sm text-muted-foreground">
            {searchResults.length} résultat{searchResults.length > 1 ? 's' : ''} trouvé{searchResults.length > 1 ? 's' : ''}
          </p>
          {searchResults.map((result) => (
            <Card 
              key={result.id} 
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => onSelectResult(result)}
            >
              <CardContent className="p-3">
                <div className="flex items-start gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium">{result.sender_name}</span>
                      {getMessageTypeIcon(result.message_type)}
                      <Badge variant="outline" className="text-xs">
                        {result.message_type}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {highlightText(result.content, searchQuery)}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      {format(new Date(result.created_at), 'dd/MM/yyyy à HH:mm', { locale: fr })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {searchQuery && searchResults.length === 0 && !isSearching && (
        <p className="text-sm text-muted-foreground text-center py-4">
          Aucun résultat trouvé pour "{searchQuery}"
        </p>
      )}
    </div>
  );
}