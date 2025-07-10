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

    console.log('Fetching transport lines for user:', user.id);

    // Fetch all active transport lines
    const { data: lines, error: linesError } = await supabaseClient
      .from('transport_lines')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (linesError) {
      console.error('Error fetching transport lines:', linesError);
      throw linesError;
    }

    // Fetch schedules for each line
    const { data: schedules, error: schedulesError } = await supabaseClient
      .from('transport_schedules')
      .select('*')
      .eq('is_active', true);

    if (schedulesError) {
      console.error('Error fetching schedules:', schedulesError);
      throw schedulesError;
    }

    // Combine lines with their schedules
    const linesWithSchedules = lines.map(line => ({
      ...line,
      schedules: schedules.filter(schedule => schedule.line_id === line.id)
    }));

    console.log(`Successfully fetched ${linesWithSchedules.length} transport lines`);

    return new Response(JSON.stringify({ 
      lines: linesWithSchedules,
      success: true 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Error in get-transport-lines function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});