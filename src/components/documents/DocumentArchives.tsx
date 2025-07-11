import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Archive, Search, Filter, Download, Eye, Calendar } from "lucide-react";

export function DocumentArchives() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  // Mock data - à remplacer par de vraies données
  const archivedDocuments = [
    {
      id: '1',
      name: 'Certificat de Scolarité - Jean Dupont',
      type: 'certificat',
      archivedDate: '2024-01-15',
      size: '245 KB',
      status: 'archived'
    },
    {
      id: '2',
      name: 'Relevé de Notes - Marie Martin',
      type: 'releve',
      archivedDate: '2024-01-10',
      size: '189 KB',
      status: 'archived'
    }
  ];

  const filteredDocuments = archivedDocuments.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || doc.type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Archive className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-bold">Centre d'Archives</h1>
      </div>

      {/* Filtres et recherche */}
      <Card>
        <CardHeader>
          <CardTitle>Recherche et Filtres</CardTitle>
          <CardDescription>
            Recherchez dans vos documents archivés
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un document..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Type de document" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="certificat">Certificats</SelectItem>
                <SelectItem value="releve">Relevés de notes</SelectItem>
                <SelectItem value="attestation">Attestations</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Calendar className="w-4 h-4 mr-2" />
              Filtrer par date
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Liste des documents archivés */}
      <Card>
        <CardHeader>
          <CardTitle>Documents Archivés ({filteredDocuments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredDocuments.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <Archive className="w-8 h-8 text-muted-foreground" />
                  <div>
                    <h3 className="font-medium">{doc.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Archivé le {new Date(doc.archivedDate).toLocaleDateString('fr-FR')} • {doc.size}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">{doc.type}</Badge>
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    Voir
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Télécharger
                  </Button>
                </div>
              </div>
            ))}
            {filteredDocuments.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                Aucun document trouvé avec ces critères
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}