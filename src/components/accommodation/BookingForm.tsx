import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { CalendarIcon, FileText, Send } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const bookingSchema = z.object({
  room_id: z.string().min(1, "Veuillez sélectionner une chambre"),
  start_date: z.date({
    required_error: "Date de début requise",
  }),
  end_date: z.date().optional(),
  monthly_rent: z.number().min(0, "Le loyer doit être positif"),
  deposit_amount: z.number().min(0, "La caution doit être positive").optional(),
  notes: z.string().optional(),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

interface BookingFormProps {
  selectedRoomId?: string;
  onSuccess?: () => void;
}

export function BookingForm({ selectedRoomId, onSuccess }: BookingFormProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      room_id: selectedRoomId || "",
      monthly_rent: 0,
      deposit_amount: 0,
      notes: "",
    },
  });

  const onSubmit = async (values: BookingFormValues) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-accommodation-request', {
        body: {
          room_id: values.room_id,
          start_date: values.start_date.toISOString(),
          end_date: values.end_date?.toISOString(),
          monthly_rent: values.monthly_rent,
          deposit_amount: values.deposit_amount,
          notes: values.notes,
        }
      });

      if (error) throw error;

      toast({
        title: "Demande envoyée",
        description: "Votre demande de logement a été envoyée avec succès.",
      });

      form.reset();
      onSuccess?.();
    } catch (error) {
      console.error('Erreur lors de la création de la demande:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer votre demande de logement.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Demande de logement
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="room_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chambre souhaitée</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une chambre" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="room1">Chambre 101 - Bâtiment A</SelectItem>
                      <SelectItem value="room2">Chambre 102 - Bâtiment A</SelectItem>
                      <SelectItem value="room3">Chambre 201 - Bâtiment B</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date de début</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "dd MMMM yyyy", { locale: fr })
                            ) : (
                              <span>Sélectionner une date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="end_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date de fin (optionnel)</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "dd MMMM yyyy", { locale: fr })
                            ) : (
                              <span>Sélectionner une date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => 
                            date < new Date() || 
                            (form.getValues("start_date") && date <= form.getValues("start_date"))
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="monthly_rent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Loyer mensuel (€)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="deposit_amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Caution (€)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes additionnelles</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Informations complémentaires sur votre demande..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Send className="w-4 h-4 mr-2" />
              )}
              Envoyer la demande
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}