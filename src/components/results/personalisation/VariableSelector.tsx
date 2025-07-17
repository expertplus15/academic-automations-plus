import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Variable, Search, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface DocumentVariable {
  id: string;
  name: string;
  label: string;
  variable_type: string;
  category: string;
  description?: string;
}

interface VariableSelectorProps {
  onVariableSelect: (variable: string) => void;
  className?: string;
}

export function VariableSelector({ onVariableSelect, className }: VariableSelectorProps) {
  const [variables, setVariables] = useState<DocumentVariable[]>([]);
  const [filteredVariables, setFilteredVariables] = useState<DocumentVariable[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  // Predefined system variables
  const systemVariables: DocumentVariable[] = [
    { id: 'student_name', name: 'student.full_name', label: 'Nom complet', category: 'student', variable_type: 'text', description: 'Nom et prénom de l\'étudiant' },
    { id: 'student_number', name: 'student.student_number', label: 'Numéro étudiant', category: 'student', variable_type: 'text', description: 'Numéro d\'identification' },
    { id: 'student_email', name: 'student.email', label: 'Email étudiant', category: 'student', variable_type: 'email', description: 'Adresse email' },
    { id: 'program_name', name: 'student.program_name', label: 'Nom du programme', category: 'academic', variable_type: 'text', description: 'Programme d\'études' },
    { id: 'academic_year', name: 'academic_year', label: 'Année académique', category: 'academic', variable_type: 'text', description: 'Année scolaire en cours' },
    { id: 'current_date', name: 'current_date', label: 'Date actuelle', category: 'system', variable_type: 'date', description: 'Date de génération du document' },
    { id: 'institution_name', name: 'institution.name', label: 'Nom établissement', category: 'institution', variable_type: 'text', description: 'Nom de l\'établissement' },
    { id: 'institution_address', name: 'institution.address', label: 'Adresse établissement', category: 'institution', variable_type: 'text', description: 'Adresse complète' },
    { id: 'institution_phone', name: 'institution.phone', label: 'Téléphone', category: 'institution', variable_type: 'text', description: 'Numéro de téléphone' },
    { id: 'institution_email', name: 'institution.email', label: 'Email établissement', category: 'institution', variable_type: 'email', description: 'Email officiel' }
  ];

  useEffect(() => {
    fetchVariables();
  }, []);

  useEffect(() => {
    filterVariables();
  }, [variables, searchTerm, selectedCategory]);

  const fetchVariables = async () => {
    try {
      const { data, error } = await supabase
        .from('document_variables')
        .select('*')
        .order('category', { ascending: true });

      if (error) throw error;

      // Combine system variables with database variables
      const allVariables = [...systemVariables, ...(data || [])];
      setVariables(allVariables);
    } catch (error) {
      console.error('Error fetching variables:', error);
      // Use only system variables if database fetch fails
      setVariables(systemVariables);
    } finally {
      setLoading(false);
    }
  };

  const filterVariables = () => {
    let filtered = variables;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(variable => variable.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(variable =>
        variable.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        variable.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (variable.description && variable.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredVariables(filtered);
  };

  const categories = [...new Set(variables.map(v => v.category))];

  const handleVariableClick = (variableName: string) => {
    onVariableSelect(`{{${variableName}}}`);
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Variable className="w-4 h-4" />
          Variables disponibles
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Search and filter */}
        <div className="space-y-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher une variable..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 h-8"
            />
          </div>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les catégories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Variables list */}
        <ScrollArea className="h-48">
          <div className="space-y-1">
            {loading ? (
              <div className="text-sm text-muted-foreground text-center py-4">
                Chargement des variables...
              </div>
            ) : filteredVariables.length === 0 ? (
              <div className="text-sm text-muted-foreground text-center py-4">
                Aucune variable trouvée
              </div>
            ) : (
              filteredVariables.map(variable => (
                <Button
                  key={variable.id}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-left h-auto p-2 hover:bg-accent"
                  onClick={() => handleVariableClick(variable.name)}
                >
                  <div className="w-full">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-xs">{variable.label}</span>
                      <Badge variant="outline" className="text-xs">
                        {variable.category}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {`{{${variable.name}}}`}
                    </div>
                    {variable.description && (
                      <div className="text-xs text-muted-foreground mt-1 opacity-75">
                        {variable.description}
                      </div>
                    )}
                  </div>
                </Button>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}