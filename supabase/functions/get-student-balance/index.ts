import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get current user
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      throw new Error('Utilisateur non authentifié');
    }

    console.log('Getting balance for user:', user.id);

    // Get student profile
    const { data: student, error: studentError } = await supabaseClient
      .from('students')
      .select('id')
      .eq('profile_id', user.id)
      .single();

    if (studentError || !student) {
      throw new Error('Profil étudiant non trouvé');
    }

    // Get or create balance record
    let { data: balance, error: balanceError } = await supabaseClient
      .from('catering_balances')
      .select('*')
      .eq('student_id', student.id)
      .single();

    if (balanceError && balanceError.code === 'PGRST116') {
      // No balance record exists, create one
      const { data: newBalance, error: createError } = await supabaseClient
        .from('catering_balances')
        .insert({ 
          student_id: student.id, 
          balance: 0 
        })
        .select()
        .single();

      if (createError) {
        console.error('Error creating balance:', createError);
        throw new Error('Impossible de créer le compte restauration');
      }

      balance = newBalance;
    } else if (balanceError) {
      console.error('Balance fetch error:', balanceError);
      throw new Error('Impossible de récupérer le solde');
    }

    console.log('Balance retrieved:', balance);

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: {
          balance: balance.balance || 0,
          last_recharge_date: balance.last_recharge_date,
          last_recharge_amount: balance.last_recharge_amount,
          updated_at: balance.updated_at
        }
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Error in get-student-balance:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 400,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
})