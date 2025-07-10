import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, Euro } from "lucide-react";

interface TransportStop {
  stop: string;
  coordinates: [number, number];
  time: string;
}

interface TransportLine {
  id: string;
  name: string;
  code: string;
  description: string;
  route_data: TransportStop[];
  schedule: {
    weekdays: string[];
    weekends: string[];
  };
  price: number;
  is_active: boolean;
}

interface TransportLinesMapProps {
  onLineSelect?: (line: TransportLine) => void;
}

export function TransportLinesMap({ onLineSelect }: TransportLinesMapProps) {
  const [lines, setLines] = useState<TransportLine[]>([]);
  const [selectedLine, setSelectedLine] = useState<TransportLine | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLines();
  }, []);

  const fetchLines = async () => {
    try {
      setLoading(true);
      // Simulate API call for now
      const mockLines: TransportLine[] = [
        {
          id: '1',
          name: 'Ligne A - Centre Ville',
          code: 'LN-A',
          description: 'Dessert le centre-ville et les quartiers résidentiels',
          route_data: [
            { stop: "Université", coordinates: [2.3522, 48.8566], time: "07:30" },
            { stop: "Place de la République", coordinates: [2.3631, 48.8677], time: "07:45" },
            { stop: "Gare Centrale", coordinates: [2.3486, 48.8534], time: "08:00" },
            { stop: "Centre Commercial", coordinates: [2.3701, 48.8589], time: "08:15" }
          ],
          schedule: {
            weekdays: ["07:30", "12:30", "17:30"],
            weekends: ["09:00", "15:00"]
          },
          price: 2.50,
          is_active: true
        },
        {
          id: '2',
          name: 'Ligne B - Banlieue Nord',
          code: 'LN-B',
          description: 'Dessert les quartiers nord de la ville',
          route_data: [
            { stop: "Université", coordinates: [2.3522, 48.8566], time: "07:45" },
            { stop: "Quartier Nord", coordinates: [2.3423, 48.8734], time: "08:00" },
            { stop: "Zone Industrielle", coordinates: [2.3289, 48.8801], time: "08:20" },
            { stop: "Terminus Nord", coordinates: [2.3156, 48.8867], time: "08:35" }
          ],
          schedule: {
            weekdays: ["07:45", "12:45", "17:45"],
            weekends: ["09:15", "15:15"]
          },
          price: 3.00,
          is_active: true
        },
        {
          id: '3',
          name: 'Ligne C - Campus Universitaire',
          code: 'LN-C',
          description: 'Navette campus avec tous les bâtiments universitaires',
          route_data: [
            { stop: "Entrée Principale", coordinates: [2.3522, 48.8566], time: "08:00" },
            { stop: "Bibliothèque", coordinates: [2.3534, 48.8578], time: "08:05" },
            { stop: "Laboratoires", coordinates: [2.3567, 48.8589], time: "08:10" },
            { stop: "Résidences Étudiantes", coordinates: [2.3601, 48.8601], time: "08:15" }
          ],
          schedule: {
            weekdays: ["08:00", "10:00", "14:00", "16:00", "18:00"],
            weekends: []
          },
          price: 1.50,
          is_active: true
        }
      ];
      setLines(mockLines);
    } catch (error) {
      console.error('Error fetching transport lines:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLineSelect = (line: TransportLine) => {
    setSelectedLine(line);
    onLineSelect?.(line);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-20 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Map placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Plan du réseau de transport
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <MapPin className="h-8 w-8 mx-auto mb-2" />
              <p>Carte interactive des lignes de transport</p>
              <p className="text-sm">(Intégration carte à venir)</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lines list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {lines.map((line) => (
          <Card 
            key={line.id} 
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedLine?.id === line.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => handleLineSelect(line)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="font-mono">
                  {line.code}
                </Badge>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Euro className="h-3 w-3" />
                  {line.price.toFixed(2)}
                </div>
              </div>
              <CardTitle className="text-lg">{line.name}</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground mb-3">
                {line.description}
              </p>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>Horaires: {line.schedule.weekdays.join(', ')}</span>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {line.route_data.slice(0, 3).map((stop, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {stop.stop}
                    </Badge>
                  ))}
                  {line.route_data.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{line.route_data.length - 3}
                    </Badge>
                  )}
                </div>
              </div>

              <Button 
                variant="outline" 
                size="sm" 
                className="w-full mt-3"
                onClick={(e) => {
                  e.stopPropagation();
                  handleLineSelect(line);
                }}
              >
                Voir les détails
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Selected line details */}
      {selectedLine && (
        <Card>
          <CardHeader>
            <CardTitle>Détails de la {selectedLine.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Arrêts et horaires</h4>
                <div className="space-y-2">
                  {selectedLine.route_data.map((stop, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                      <span>{stop.stop}</span>
                      <Badge variant="outline">{stop.time}</Badge>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Planning hebdomadaire</h4>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium">Lundi - Vendredi:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedLine.schedule.weekdays.map((time, index) => (
                        <Badge key={index} variant="secondary">{time}</Badge>
                      ))}
                    </div>
                  </div>
                  {selectedLine.schedule.weekends.length > 0 && (
                    <div>
                      <span className="text-sm font-medium">Week-end:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedLine.schedule.weekends.map((time, index) => (
                          <Badge key={index} variant="secondary">{time}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}