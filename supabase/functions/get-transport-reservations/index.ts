import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    // Get authenticated user
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;

    if (!user) {
      throw new Error('User not authenticated');
    }

    // Get student record
    const { data: student, error: studentError } = await supabaseClient
      .from('students')
      .select('id')
      .eq('profile_id', user.id)
      .single();

    if (studentError || !student) {
      throw new Error('Student record not found');
    }

    console.log('Fetching transport reservations for student:', student.id);

    // Fetch reservations with line information
    const { data: reservations, error: reservationsError } = await supabaseClient
      .from('transport_reservations')
      .select(`
        *,
        transport_lines (
          id,
          name,
          code,
          price
        )
      `)
      .eq('student_id', student.id)
      .order('reservation_date', { ascending: false });

    if (reservationsError) {
      console.error('Error fetching reservations:', reservationsError);
      throw reservationsError;
    }

    // Transform the data to include line information at the top level
    const transformedReservations = reservations?.map(reservation => ({
      ...reservation,
      line_name: reservation.transport_lines?.name,
      line_code: reservation.transport_lines?.code,
      price: reservation.transport_lines?.price,
      transport_lines: undefined // Remove nested object
    })) || [];

    console.log(`Successfully fetched ${transformedReservations.length} reservations`);

    return new Response(JSON.stringify({ 
      reservations: transformedReservations,
      success: true 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Error in get-transport-reservations function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});