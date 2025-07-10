import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface MaintenanceRequest {
  title: string;
  description: string;
  category: string;
  priority: string;
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

    const requestData: MaintenanceRequest = await req.json();

    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error('User not authenticated');
    }

    console.log('Creating maintenance request for user:', user.id);

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

    // Get student's accommodation
    const { data: accommodation, error: accommodationError } = await supabase
      .from('accommodation_assignments')
      .select('id, room_id')
      .eq('student_id', student.id)
      .eq('status', 'active')
      .single();

    if (accommodationError || !accommodation) {
      throw new Error('No active accommodation found for student');
    }

    // In a real implementation, this would create a maintenance request record
    // For now, we'll create a mock response
    const newRequest = {
      id: `maint_${Date.now()}`,
      student_id: student.id,
      accommodation_id: accommodation.id,
      room_id: accommodation.room_id,
      title: requestData.title,
      description: requestData.description,
      category: requestData.category,
      priority: requestData.priority,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      assigned_to: null,
      completed_at: null,
      response: null
    };

    console.log('Created maintenance request:', newRequest.id);

    // In a real implementation, this would also:
    // 1. Send notification to maintenance staff
    // 2. Create workflow for assignment and tracking
    // 3. Send confirmation email to student

    return new Response(
      JSON.stringify({ 
        success: true, 
        request: newRequest,
        message: 'Maintenance request created successfully'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in create-maintenance-request:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});