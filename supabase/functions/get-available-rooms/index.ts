import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface Filters {
  building?: string;
  room_type?: string;
  max_rent?: number;
  search?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const { filters }: { filters: Filters } = await req.json();

    console.log('Fetching available rooms with filters:', filters);

    // Build the query
    let query = supabase
      .from('accommodation_rooms')
      .select('*')
      .eq('is_available', true);

    // Apply filters
    if (filters.building && filters.building !== 'all') {
      query = query.eq('building_name', filters.building);
    }

    if (filters.room_type && filters.room_type !== 'all') {
      query = query.eq('room_type', filters.room_type);
    }

    if (filters.max_rent) {
      query = query.lte('monthly_rent', filters.max_rent);
    }

    if (filters.search) {
      query = query.or(`room_number.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }

    const { data: rooms, error } = await query.order('room_number');

    if (error) {
      console.error('Error fetching rooms:', error);
      throw error;
    }

    console.log(`Found ${rooms?.length || 0} available rooms`);

    return new Response(
      JSON.stringify({ rooms: rooms || [] }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in get-available-rooms:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});