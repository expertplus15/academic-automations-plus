import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Clock, MapPin, Euro } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";

interface TransportStop {
  stop: string;
  coordinates: [number, number];
  time: string;
}

interface TransportLine {
  id: string;
  name: string;
  code: string;
  route_data: TransportStop[];
  schedule: {
    weekdays: string[];
    weekends: string[];
  };
  price: number;
}

interface ReservationFormProps {
  lines?: TransportLine[];
  selectedLine?: TransportLine;
  onReservationCreated?: () => void;
}

export function ReservationForm({ lines = [], selectedLine, onReservationCreated }: ReservationFormProps) {
  const [formData, setFormData] = useState({
    lineId: selectedLine?.id || '',
    reservationDate: undefined as Date | undefined,
    departureTime: '',
    pickupStop: '',
    destinationStop: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const currentLine = selectedLine || lines.find(line => line.id === formData.lineId);
  const availableTimes = currentLine?.schedule.weekdays || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.lineId || !formData.reservationDate || !formData.departureTime || 
        !formData.pickupStop || !formData.destinationStop) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Here would be the actual API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      toast({
        title: "Réservation confirmée",
        description: "Votre réservation a été créée avec succès"
      });

      // Reset form
      setFormData({
        lineId: selectedLine?.id || '',
        reservationDate: undefined,
        departureTime: '',
        pickupStop: '',
        destinationStop: ''
      });

      onReservationCreated?.();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de créer la réservation",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Nouvelle réservation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Line selection */}
          {!selectedLine && (
            <div className="space-y-2">
              <Label htmlFor="line-select">Ligne de transport*</Label>
              <Select
                value={formData.lineId}
                onValueChange={(value) => setFormData({...formData, lineId: value, pickupStop: '', destinationStop: ''})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez une ligne" />
                </SelectTrigger>
                <SelectContent>
                  {lines.map((line) => (
                    <SelectItem key={line.id} value={line.id}>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">{line.code}</Badge>
                        <span>{line.name}</span>
                        <span className="text-muted-foreground">({line.price.toFixed(2)}€)</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Selected line info */}
          {currentLine && (
            <div className="p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">{currentLine.code}</Badge>
                <span className="font-medium">{currentLine.name}</span>
                <div className="flex items-center gap-1 text-sm text-muted-foreground ml-auto">
                  <Euro className="h-3 w-3" />
                  {currentLine.price.toFixed(2)}
                </div>
              </div>
              <div className="flex flex-wrap gap-1">
                {currentLine.route_data.map((stop, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {stop.stop} ({stop.time})
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Date selection */}
          <div className="space-y-2">
            <Label>Date de réservation*</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.reservationDate ? (
                    format(formData.reservationDate, "PPP", { locale: fr })
                  ) : (
                    <span>Sélectionnez une date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.reservationDate}
                  onSelect={(date) => setFormData({...formData, reservationDate: date})}
                  disabled={(date) => date < new Date()}
                  locale={fr}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Time selection */}
          <div className="space-y-2">
            <Label htmlFor="time-select">Heure de départ*</Label>
            <Select
              value={formData.departureTime}
              onValueChange={(value) => setFormData({...formData, departureTime: value})}
              disabled={!currentLine}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un horaire" />
              </SelectTrigger>
              <SelectContent>
                {availableTimes.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Pickup stop */}
          <div className="space-y-2">
            <Label htmlFor="pickup-select">Arrêt de montée*</Label>
            <Select
              value={formData.pickupStop}
              onValueChange={(value) => setFormData({...formData, pickupStop: value})}
              disabled={!currentLine}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un arrêt" />
              </SelectTrigger>
              <SelectContent>
                {currentLine?.route_data.map((stop) => (
                  <SelectItem key={stop.stop} value={stop.stop}>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3 w-3" />
                      <span>{stop.stop}</span>
                      <Badge variant="outline" className="text-xs">{stop.time}</Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Destination stop */}
          <div className="space-y-2">
            <Label htmlFor="destination-select">Arrêt de descente*</Label>
            <Select
              value={formData.destinationStop}
              onValueChange={(value) => setFormData({...formData, destinationStop: value})}
              disabled={!currentLine || !formData.pickupStop}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un arrêt" />
              </SelectTrigger>
              <SelectContent>
                {currentLine?.route_data
                  .filter(stop => stop.stop !== formData.pickupStop)
                  .map((stop) => (
                    <SelectItem key={stop.stop} value={stop.stop}>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3 w-3" />
                        <span>{stop.stop}</span>
                        <Badge variant="outline" className="text-xs">{stop.time}</Badge>
                      </div>
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {/* Submit button */}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Création en cours..." : "Créer la réservation"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}