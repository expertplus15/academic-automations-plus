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

    console.log('Fetching maintenance requests for user:', user.id);

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

    // Mock maintenance requests data for now
    const requests = [
      {
        id: 'maint_001',
        title: 'Robinet qui fuit',
        description: 'Le robinet de la salle de bain fuit depuis hier matin',
        category: 'plumbing',
        priority: 'medium',
        status: 'pending',
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-01-15T10:00:00Z',
        assigned_to: null,
        completed_at: null,
        response: null
      },
      {
        id: 'maint_002',
        title: 'Problème de chauffage',
        description: 'Le radiateur ne chauffe plus dans ma chambre',
        category: 'heating',
        priority: 'high',
        status: 'in_progress',
        created_at: '2024-01-10T14:30:00Z',
        updated_at: '2024-01-12T09:15:00Z',
        assigned_to: 'Jean Dupont',
        completed_at: null,
        response: 'Intervention prévue demain matin'
      },
      {
        id: 'maint_003',
        title: 'Ampoule grillée',
        description: 'L\'ampoule du plafond est grillée',
        category: 'electrical',
        priority: 'low',
        status: 'completed',
        created_at: '2024-01-05T16:45:00Z',
        updated_at: '2024-01-07T11:20:00Z',
        assigned_to: 'Marie Martin',
        completed_at: '2024-01-07T11:20:00Z',
        response: 'Ampoule remplacée avec succès'
      }
    ];

    console.log(`Found ${requests.length} maintenance requests for student ${student.id}`);

    return new Response(
      JSON.stringify({ requests }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in get-maintenance-requests:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});