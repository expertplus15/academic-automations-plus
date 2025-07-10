import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Book, Calendar, User, Star, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Book {
  id: string;
  title: string;
  author: string;
  isbn?: string;
  category: string;
  publication_year?: number;
  publisher?: string;
  description?: string;
  cover_url?: string;
  total_copies: number;
  available_copies: number;
  digital_url?: string;
  rating?: number;
  tags: string[];
}

export function BookCatalog() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("title");
  const { toast } = useToast();

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('search-catalog', {
        body: {
          search: searchTerm || undefined,
          category: selectedCategory !== "all" ? selectedCategory : undefined,
          sort_by: sortBy,
        }
      });

      if (error) throw error;
      setBooks(data?.books || []);
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger le catalogue.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setLoading(true);
    fetchBooks();
  };

  const handleBookLoan = async (bookId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('request-book-loan', {
        body: { book_id: bookId }
      });

      if (error) throw error;

      toast({
        title: "Demande envoyée",
        description: "Votre demande d'emprunt a été enregistrée.",
      });
    } catch (error) {
      console.error('Erreur lors de la demande d\'emprunt:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer votre demande.",
        variant: "destructive",
      });
    }
  };

  const renderStars = (rating?: number) => {
    if (!rating) return null;
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`w-3 h-3 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
          />
        ))}
        <span className="text-xs text-muted-foreground ml-1">({rating}/5)</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filtres de recherche */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Rechercher dans le catalogue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              placeholder="Titre, auteur, ISBN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les catégories</SelectItem>
                <SelectItem value="fiction">Fiction</SelectItem>
                <SelectItem value="science">Sciences</SelectItem>
                <SelectItem value="history">Histoire</SelectItem>
                <SelectItem value="technology">Technologie</SelectItem>
                <SelectItem value="art">Art</SelectItem>
                <SelectItem value="philosophy">Philosophie</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Trier par" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="title">Titre</SelectItem>
                <SelectItem value="author">Auteur</SelectItem>
                <SelectItem value="publication_year">Année</SelectItem>
                <SelectItem value="rating">Note</SelectItem>
                <SelectItem value="availability">Disponibilité</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleSearch}>
              <Search className="w-4 h-4 mr-2" />
              Rechercher
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Résultats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map((book) => (
          <Card key={book.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  {book.cover_url ? (
                    <img 
                      src={book.cover_url} 
                      alt={book.title}
                      className="w-16 h-20 object-cover rounded"
                    />
                  ) : (
                    <div className="w-16 h-20 bg-muted rounded flex items-center justify-center">
                      <Book className="w-8 h-8 text-muted-foreground" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm mb-1 line-clamp-2">
                    {book.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {book.author}
                  </p>
                  
                  {book.publication_year && (
                    <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {book.publication_year}
                    </p>
                  )}
                  
                  {renderStars(book.rating)}
                  
                  <div className="flex items-center justify-between mt-3">
                    <Badge variant={book.available_copies > 0 ? "default" : "secondary"}>
                      {book.available_copies}/{book.total_copies} dispo
                    </Badge>
                    <Badge variant="outline">{book.category}</Badge>
                  </div>
                </div>
              </div>
              
              {book.tags && book.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3">
                  {book.tags.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
              
              <div className="flex gap-2 mt-4">
                <Button 
                  size="sm" 
                  className="flex-1"
                  disabled={book.available_copies === 0}
                  onClick={() => handleBookLoan(book.id)}
                >
                  {book.available_copies > 0 ? "Emprunter" : "Non disponible"}
                </Button>
                {book.digital_url && (
                  <Button size="sm" variant="outline">
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {books.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Book className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucun livre trouvé</h3>
            <p className="text-muted-foreground">
              Aucun livre ne correspond à vos critères de recherche.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}