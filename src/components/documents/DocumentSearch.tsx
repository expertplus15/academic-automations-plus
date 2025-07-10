import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDocumentSearch } from '@/hooks/useDocumentSearch';
import { useDocumentTemplates } from '@/hooks/useDocumentTemplates';
import { Search, Filter, Download, Eye, Calendar, User, FileText, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export function DocumentSearch() {
  const { results, loading, error, totalCount, searchDocuments, getRecentDocuments, clearResults } = useDocumentSearch();
  const { templates } = useDocumentTemplates();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    document_type: '',
    student_id: '',
    date_from: '',
    date_to: '',
    status: '',
    template_id: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  // Load recent documents on mount
  useEffect(() => {
    getRecentDocuments();
  }, []);

  const handleSearch = () => {
    setCurrentPage(1);
    searchDocuments(searchQuery, filters, 1, 20);
  };

  const handleClearFilters = () => {
    setFilters({
      document_type: '',
      student_id: '',
      date_from: '',
      date_to: '',
      status: '',
      template_id: ''
    });
    setSearchQuery('');
    clearResults();
    getRecentDocuments();
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'generated': return 'default';
      case 'archived': return 'secondary';
      case 'expired': return 'destructive';
      default: return 'outline';
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Inconnu';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Recherche de Documents</h2>
          <p className="text-muted-foreground">Recherchez et gérez vos documents générés</p>
        </div>
        <Button variant="outline" onClick={() => getRecentDocuments()}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Actualiser
        </Button>
      </div>

      {/* Search Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <Search className="w-5 h-5 mr-2" />
              Recherche
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filtres
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Input
              placeholder="Rechercher par nom d'étudiant, numéro de document..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1"
            />
            <Button onClick={handleSearch} disabled={loading}>
              <Search className="w-4 h-4 mr-2" />
              Rechercher
            </Button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
              <div>
                <label className="text-sm font-medium mb-2 block">Modèle</label>
                <Select
                  value={filters.template_id}
                  onValueChange={(value) => setFilters({ ...filters, template_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tous les modèles" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Tous les modèles</SelectItem>
                    {templates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Statut</label>
                <Select
                  value={filters.status}
                  onValueChange={(value) => setFilters({ ...filters, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tous les statuts" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Tous les statuts</SelectItem>
                    <SelectItem value="generated">Généré</SelectItem>
                    <SelectItem value="archived">Archivé</SelectItem>
                    <SelectItem value="expired">Expiré</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Date de début</label>
                <Input
                  type="date"
                  value={filters.date_from}
                  onChange={(e) => setFilters({ ...filters, date_from: e.target.value })}
                />
              </div>

              <div className="md:col-span-3 flex justify-end space-x-2">
                <Button variant="outline" onClick={handleClearFilters}>
                  Effacer
                </Button>
                <Button onClick={handleSearch}>
                  Appliquer les filtres
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Résultats ({totalCount})</span>
            {loading && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {results.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Aucun document trouvé</p>
              <p className="text-sm">Essayez de modifier vos critères de recherche</p>
            </div>
          ) : (
            <div className="space-y-4">
              {results.map((document) => (
                <div
                  key={document.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <FileText className="w-8 h-8 text-primary" />
                    <div>
                      <h3 className="font-medium">{document.template_name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {document.student_name} ({document.student_number})
                      </p>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-xs text-muted-foreground flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {format(new Date(document.generated_at), 'dd MMM yyyy', { locale: fr })}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatFileSize(document.file_size)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {document.download_count} téléchargements
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Badge variant={getStatusBadgeVariant(document.status)}>
                      {document.status}
                    </Badge>
                    <Button size="sm" variant="ghost">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}