import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, MapPin, Users, AlertTriangle, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAssetBookings } from '@/hooks/resources/useAssetBookings';
import { useRooms } from '@/hooks/useRooms';
import { format, addDays, startOfWeek, endOfWeek, isSameDay, isWithinInterval, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface BookingCalendarProps {
  onNewBooking?: () => void;
}

export function BookingCalendar({ onNewBooking }: BookingCalendarProps) {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedRoom, setSelectedRoom] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'week' | 'day'>('week');

  const { bookings, loading } = useAssetBookings();
  const { rooms } = useRooms();

  // Generate week days
  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 }); // Monday
  const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 1 });
  
  const weekDays = useMemo(() => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      days.push(addDays(weekStart, i));
    }
    return days;
  }, [weekStart]);

  // Time slots (8:00 to 18:00)
  const timeSlots = useMemo(() => {
    const slots = [];
    for (let hour = 8; hour < 18; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    return slots;
  }, []);

  // Filter bookings for current week and selected room
  const filteredBookings = useMemo(() => {
    return bookings.filter(booking => {
      const bookingStart = parseISO(booking.start_date);
      const bookingEnd = parseISO(booking.end_date);
      
      const inWeek = isWithinInterval(bookingStart, { start: weekStart, end: weekEnd }) ||
                     isWithinInterval(bookingEnd, { start: weekStart, end: weekEnd });
      
      const roomMatch = selectedRoom === 'all' || booking.room_id === selectedRoom;
      
      return inWeek && roomMatch;
    });
  }, [bookings, weekStart, weekEnd, selectedRoom]);

  // Check for conflicts
  const getConflicts = (targetBooking: any) => {
    return filteredBookings.filter(booking => {
      if (booking.id === targetBooking.id) return false;
      
      const bookingStart = parseISO(booking.start_date);
      const bookingEnd = parseISO(booking.end_date);
      const targetStart = parseISO(targetBooking.start_date);
      const targetEnd = parseISO(targetBooking.end_date);
      
      // Check room conflict
      const sameRoom = booking.room_id === targetBooking.room_id;
      
      // Check time overlap
      const timeOverlap = bookingStart < targetEnd && bookingEnd > targetStart;
      
      return sameRoom && timeOverlap;
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-700 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
      case 'completed': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'cancelled': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    setCurrentWeek(prev => addDays(prev, direction === 'next' ? 7 : -7));
  };

  const renderBookingCard = (booking: any) => {
    const conflicts = getConflicts(booking);
    const hasConflicts = conflicts.length > 0;
    
    return (
      <div
        key={booking.id}
        className={cn(
          "p-2 mb-1 rounded text-xs border",
          getStatusColor(booking.status),
          hasConflicts && "ring-2 ring-red-400 ring-opacity-50"
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{booking.purpose}</p>
            <p className="text-xs opacity-75">
              {format(parseISO(booking.start_date), 'HH:mm')} - 
              {format(parseISO(booking.end_date), 'HH:mm')}
            </p>
            {booking.room?.name && (
              <p className="text-xs opacity-75 flex items-center">
                <MapPin className="w-3 h-3 mr-1" />
                {booking.room.name}
              </p>
            )}
          </div>
          {hasConflicts && (
            <AlertTriangle className="w-3 h-3 text-red-500 ml-1" />
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return <div className="p-6">Chargement du calendrier...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Calendrier des réservations
            </CardTitle>
            <div className="flex items-center gap-3">
              <Select value={selectedRoom} onValueChange={setSelectedRoom}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les salles</SelectItem>
                  {rooms.map((room) => (
                    <SelectItem key={room.id} value={room.id}>
                      {room.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={() => setViewMode(viewMode === 'week' ? 'day' : 'week')}>
                Vue {viewMode === 'week' ? 'jour' : 'semaine'}
              </Button>
              {onNewBooking && (
                <Button onClick={onNewBooking}>
                  <Plus className="w-4 h-4 mr-2" />
                  Nouvelle réservation
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <Button variant="outline" size="sm" onClick={() => navigateWeek('prev')}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <h3 className="font-semibold">
              {format(weekStart, 'dd MMM', { locale: fr })} - {format(weekEnd, 'dd MMM yyyy', { locale: fr })}
            </h3>
            <Button variant="outline" size="sm" onClick={() => navigateWeek('next')}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Calendar Grid */}
          <div className="border rounded-lg overflow-hidden">
            {/* Header row */}
            <div className="grid grid-cols-8 bg-gray-50">
              <div className="p-3 border-r text-sm font-medium">Heure</div>
              {weekDays.map((day) => (
                <div key={day.toISOString()} className="p-3 border-r text-sm font-medium text-center">
                  <div>{format(day, 'EEE', { locale: fr })}</div>
                  <div className="text-lg">{format(day, 'd')}</div>
                </div>
              ))}
            </div>

            {/* Time slots */}
            {timeSlots.map((timeSlot) => (
              <div key={timeSlot} className="grid grid-cols-8 border-t">
                <div className="p-2 border-r text-xs text-gray-500 bg-gray-25">
                  {timeSlot}
                </div>
                {weekDays.map((day) => {
                  const dayBookings = filteredBookings.filter(booking => {
                    const bookingDate = parseISO(booking.start_date);
                    return isSameDay(bookingDate, day);
                  });

                  return (
                    <div key={`${day.toISOString()}-${timeSlot}`} className="p-1 border-r min-h-[60px] bg-white">
                      {dayBookings.map(renderBookingCard)}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="mt-4 flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-100 border border-green-200 rounded"></div>
              <span>Approuvée</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-100 border border-yellow-200 rounded"></div>
              <span>En attente</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-100 border border-red-200 rounded"></div>
              <span>Rejetée</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-3 h-3 text-red-500" />
              <span>Conflit détecté</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}