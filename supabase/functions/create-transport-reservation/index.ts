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

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders });
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

    const { 
      line_id, 
      reservation_date, 
      departure_time, 
      pickup_stop, 
      destination_stop 
    } = await req.json();

    console.log('Creating transport reservation:', {
      student_id: student.id,
      line_id,
      reservation_date,
      departure_time,
      pickup_stop,
      destination_stop
    });

    // Validate required fields
    if (!line_id || !reservation_date || !departure_time || !pickup_stop || !destination_stop) {
      throw new Error('Missing required fields');
    }

    // Check if the line exists and is active
    const { data: line, error: lineError } = await supabaseClient
      .from('transport_lines')
      .select('*')
      .eq('id', line_id)
      .eq('is_active', true)
      .single();

    if (lineError || !line) {
      throw new Error('Transport line not found or inactive');
    }

    // Check for conflicts - student can't have multiple reservations at the same time
    const { data: existingReservations, error: conflictError } = await supabaseClient
      .from('transport_reservations')
      .select('id')
      .eq('student_id', student.id)
      .eq('reservation_date', reservation_date)
      .eq('departure_time', departure_time)
      .neq('status', 'cancelled');

    if (conflictError) {
      console.error('Error checking for conflicts:', conflictError);
      throw conflictError;
    }

    if (existingReservations && existingReservations.length > 0) {
      throw new Error('You already have a reservation at this time');
    }

    // Create the reservation
    const { data: reservation, error: reservationError } = await supabaseClient
      .from('transport_reservations')
      .insert({
        student_id: student.id,
        line_id,
        reservation_date,
        departure_time,
        pickup_stop,
        destination_stop,
        status: 'confirmed',
        payment_status: 'pending'
      })
      .select()
      .single();

    if (reservationError) {
      console.error('Error creating reservation:', reservationError);
      throw reservationError;
    }

    console.log('Successfully created reservation:', reservation.id);

    return new Response(JSON.stringify({ 
      reservation,
      success: true,
      message: 'Reservation created successfully'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Error in create-transport-reservation function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});