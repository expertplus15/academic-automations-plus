import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization')!;
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error('User not authenticated');
    }

    console.log('Fetching accommodation for user:', user.id);

    // Get student record
    const { data: student, error: studentError } = await supabase
      .from('students')
      .select('id')
      .eq('profile_id', user.id)
      .single();

    if (studentError) {
      console.error('Error fetching student:', studentError);
      throw new Error('Student record not found');
    }

    // Get accommodation assignment with room details
    const { data: assignment, error: assignmentError } = await supabase
      .from('accommodation_assignments')
      .select(`
        id,
        start_date,
        end_date,
        monthly_rent,
        deposit_amount,
        status,
        notes,
        created_at,
        room:accommodation_rooms (
          id,
          room_number,
          building_name,
          capacity,
          facilities
        )
      `)
      .eq('student_id', student.id)
      .eq('status', 'active')
      .single();

    if (assignmentError) {
      console.log('No active accommodation assignment found');
      return new Response(
        JSON.stringify({ assignment: null }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    console.log('Found accommodation assignment:', assignment.id);

    return new Response(
      JSON.stringify({ assignment }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in get-my-accommodation:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});