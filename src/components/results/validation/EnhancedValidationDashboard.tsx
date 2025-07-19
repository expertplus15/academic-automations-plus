import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CheckCircle, 
  AlertCircle, 
  Eye, 
  Clock,
  TrendingUp,
  Filter,
  Search,
  Play,
  RotateCcw,
  CheckSquare,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useRealTimeValidation, ValidationFilter } from '@/hooks/useRealTimeValidation';

export function EnhancedValidationDashboard() {
  const navigate = useNavigate();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const {
    metrics,
    pendingItems,
    loading,
    filter,
    setFilter,
    autoValidate,
    batchApprove,
    batchReject,
    refreshData
  } = useRealTimeValidation();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500 text-white';
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-orange-100 text-orange-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleSelectAll = () => {
    if (selectedItems.length === pendingItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(pendingItems.map(item => item.id));
    }
  };

  const handleItemSelect = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleBatchApprove = async () => {
    if (selectedItems.length > 0) {
      await batchApprove(selectedItems, 'Approbation en lot');
      setSelectedItems([]);
    }
  };

  const handleBatchReject = async () => {
    if (selectedItems.length > 0) {
      await batchReject(selectedItems, 'Rejet en lot');
      setSelectedItems([]);
    }
  };

  const applyFilter = (newFilter: Partial<ValidationFilter>) => {
    setFilter({ ...filter, ...newFilter });
  };

  const filteredItems = pendingItems.filter(item => {
    if (searchTerm && !item.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !item.submittedBy.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    if (filter.priority && item.priority !== filter.priority) return false;
    if (filter.type && item.type !== filter.type) return false;
    if (filter.hasAnomalies !== undefined && (item.anomalies > 0) !== filter.hasAnomalies) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Enhanced Metrics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <Card className="md:col-span-1">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">En attente</p>
                <p className="text-2xl font-bold">{metrics.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-1">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Approuvés</p>
                <p className="text-2xl font-bold">{metrics.approved}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-1">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <X className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Rejetés</p>
                <p className="text-2xl font-bold">{metrics.rejected}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-1">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Anomalies</p>
                <p className="text-2xl font-bold">{metrics.anomalies}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-1">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Score qualité</p>
                <p className="text-2xl font-bold">{metrics.qualityScore}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-1">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Clock className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Temps moy.</p>
                <p className="text-2xl font-bold">{metrics.averageProcessingTime}h</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-1">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Play className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Aujourd'hui</p>
                <p className="text-2xl font-bold">{metrics.todayActivity}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Validations en Attente</CardTitle>
              <CardDescription>
                {filteredItems.length} éléments · {selectedItems.length} sélectionné(s)
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filtres
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={refreshData}
                disabled={loading}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Actualiser
              </Button>
              {selectedItems.length > 0 && (
                <>
                  <Button
                    size="sm"
                    onClick={handleBatchApprove}
                    disabled={loading}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approuver ({selectedItems.length})
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleBatchReject}
                    disabled={loading}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Rejeter ({selectedItems.length})
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Search and Filters */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Rechercher par titre ou auteur..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
                <Select
                  value={filter.priority || ''}
                  onValueChange={(value) => applyFilter({ priority: value || undefined })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Priorité" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Toutes les priorités</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="high">Élevée</SelectItem>
                    <SelectItem value="medium">Moyenne</SelectItem>
                    <SelectItem value="low">Faible</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={filter.type || ''}
                  onValueChange={(value) => applyFilter({ type: value || undefined })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Tous les types</SelectItem>
                    <SelectItem value="transcript">Relevés</SelectItem>
                    <SelectItem value="bulletin">Bulletins</SelectItem>
                    <SelectItem value="certificate">Certificats</SelectItem>
                    <SelectItem value="document">Documents</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="anomalies"
                    checked={filter.hasAnomalies || false}
                    onCheckedChange={(checked) => 
                      applyFilter({ hasAnomalies: checked ? true : undefined })
                    }
                  />
                  <label htmlFor="anomalies" className="text-sm">
                    Avec anomalies uniquement
                  </label>
                </div>

                <Button
                  variant="outline"
                  onClick={() => {
                    setFilter({});
                    setSearchTerm('');
                  }}
                >
                  Réinitialiser
                </Button>
              </div>
            )}
          </div>

          {/* Items List with Selection */}
          <div className="space-y-4 mt-6">
            {filteredItems.length > 0 && (
              <div className="flex items-center space-x-2 pb-4 border-b">
                <Checkbox
                  id="select-all"
                  checked={selectedItems.length === filteredItems.length}
                  onCheckedChange={handleSelectAll}
                />
                <label htmlFor="select-all" className="text-sm font-medium">
                  Sélectionner tout ({filteredItems.length})
                </label>
              </div>
            )}

            {filteredItems.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {searchTerm || Object.keys(filter).length > 0 
                    ? 'Aucun résultat trouvé' 
                    : 'Toutes les validations sont terminées !'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredItems.map((item) => (
                  <Card key={item.id} className="border border-border/50 hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Checkbox
                            checked={selectedItems.includes(item.id)}
                            onCheckedChange={() => handleItemSelect(item.id)}
                          />
                          <div className="p-2 bg-orange-100 rounded-lg">
                            <Clock className="w-5 h-5 text-orange-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium">{item.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {item.studentCount} étudiant(s) • {item.submittedBy}
                              {item.anomalies > 0 && (
                                <> • <span className="text-red-600">{item.anomalies} anomalie(s)</span></>
                              )}
                              {item.estimatedTime && (
                                <> • Temps estimé: {item.estimatedTime}min</>
                              )}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <Badge className={getPriorityColor(item.priority)}>
                            {item.priority === 'urgent' ? 'Urgent' : 
                             item.priority === 'high' ? 'Élevée' :
                             item.priority === 'medium' ? 'Moyenne' : 'Faible'}
                          </Badge>
                          
                          {item.anomalies > 0 && (
                            <Badge className="bg-red-100 text-red-700">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              {item.anomalies}
                            </Badge>
                          )}
                          
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4 mr-2" />
                            Consulter
                          </Button>
                          
                          <Button 
                            size="sm"
                            onClick={() => autoValidate(item.id)}
                            disabled={loading}
                          >
                            <Play className="w-4 h-4 mr-2" />
                            Auto
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}