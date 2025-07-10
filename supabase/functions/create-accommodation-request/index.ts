import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface AccommodationRequest {
  room_id: string;
  start_date: string;
  end_date?: string;
  monthly_rent: number;
  deposit_amount?: number;
  notes?: string;
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

    const requestData: AccommodationRequest = await req.json();

    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error('User not authenticated');
    }

    console.log('Creating accommodation request for user:', user.id);

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

    // Validate room exists and is available
    const { data: room, error: roomError } = await supabase
      .from('accommodation_rooms')
      .select('id, room_number, building_name, is_available')
      .eq('id', requestData.room_id)
      .single();

    if (roomError || !room) {
      throw new Error('Room not found');
    }

    if (!room.is_available) {
      throw new Error('Room is not available');
    }

    // Check if student already has an active accommodation
    const { data: existingAssignment, error: existingError } = await supabase
      .from('accommodation_assignments')
      .select('id')
      .eq('student_id', student.id)
      .eq('status', 'active')
      .single();

    if (existingAssignment) {
      throw new Error('Student already has an active accommodation assignment');
    }

    // Create the accommodation assignment
    const { data: assignment, error: assignmentError } = await supabase
      .from('accommodation_assignments')
      .insert({
        student_id: student.id,
        room_id: requestData.room_id,
        start_date: requestData.start_date,
        end_date: requestData.end_date,
        monthly_rent: requestData.monthly_rent,
        deposit_amount: requestData.deposit_amount,
        notes: requestData.notes,
        status: 'pending'
      })
      .select()
      .single();

    if (assignmentError) {
      console.error('Error creating assignment:', assignmentError);
      throw new Error('Failed to create accommodation assignment');
    }

    console.log('Created accommodation assignment:', assignment.id);

    // In a real implementation, this would also:
    // 1. Send notification to accommodation staff
    // 2. Create workflow for approval process
    // 3. Send confirmation email to student

    return new Response(
      JSON.stringify({ 
        success: true, 
        assignment,
        message: 'Accommodation request created successfully'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in create-accommodation-request:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});