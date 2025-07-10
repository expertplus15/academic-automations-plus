import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Users, Wifi, Car, Tv, Home } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Room {
  id: string;
  room_number: string;
  building_name: string;
  room_type: string;
  capacity: number;
  monthly_rent: number;
  current_occupancy: number;
  is_available: boolean;
  facilities: string[];
  description?: string;
}

export function RoomBrowser() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBuilding, setSelectedBuilding] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [maxRent, setMaxRent] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('get-available-rooms', {
        body: {
          filters: {
            building: selectedBuilding !== "all" ? selectedBuilding : undefined,
            room_type: selectedType !== "all" ? selectedType : undefined,
            max_rent: maxRent ? parseInt(maxRent) : undefined,
            search: searchTerm || undefined
          }
        }
      });

      if (error) throw error;
      setRooms(data?.rooms || []);
    } catch (error) {
      console.error('Erreur lors de la récupération des chambres:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les chambres disponibles.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setLoading(true);
    fetchRooms();
  };

  const getFacilityIcon = (facility: string) => {
    switch (facility.toLowerCase()) {
      case 'wifi': return <Wifi className="w-4 h-4" />;
      case 'parking': return <Car className="w-4 h-4" />;
      case 'tv': return <Tv className="w-4 h-4" />;
      default: return <Home className="w-4 h-4" />;
    }
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
            Rechercher une chambre
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select value={selectedBuilding} onValueChange={setSelectedBuilding}>
              <SelectTrigger>
                <SelectValue placeholder="Bâtiment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les bâtiments</SelectItem>
                <SelectItem value="A">Bâtiment A</SelectItem>
                <SelectItem value="B">Bâtiment B</SelectItem>
                <SelectItem value="C">Bâtiment C</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous types</SelectItem>
                <SelectItem value="single">Chambre simple</SelectItem>
                <SelectItem value="double">Chambre double</SelectItem>
                <SelectItem value="suite">Suite</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Loyer max €"
                value={maxRent}
                onChange={(e) => setMaxRent(e.target.value)}
              />
              <Button onClick={handleSearch}>
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des chambres */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <Card key={room.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">
                    Chambre {room.room_number}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {room.building_name}
                  </p>
                </div>
                <Badge variant={room.is_available ? "default" : "secondary"}>
                  {room.is_available ? "Disponible" : "Occupée"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Users className="w-4 h-4" />
                  {room.current_occupancy}/{room.capacity} occupant(s)
                </div>
                <div className="text-lg font-semibold text-primary">
                  {room.monthly_rent}€/mois
                </div>
              </div>

              {room.description && (
                <p className="text-sm text-muted-foreground">
                  {room.description}
                </p>
              )}

              {room.facilities && room.facilities.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {room.facilities.map((facility, index) => (
                    <Badge key={index} variant="outline" className="flex items-center gap-1">
                      {getFacilityIcon(facility)}
                      {facility}
                    </Badge>
                  ))}
                </div>
              )}

              <Button 
                className="w-full" 
                disabled={!room.is_available}
              >
                {room.is_available ? "Réserver" : "Non disponible"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {rooms.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Home className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucune chambre trouvée</h3>
            <p className="text-muted-foreground">
              Aucune chambre ne correspond à vos critères de recherche.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}