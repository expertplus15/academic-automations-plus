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

    const { amount } = await req.json();

    if (!amount || amount <= 0) {
      throw new Error('Montant invalide');
    }

    console.log('Recharging balance with amount:', amount);

    // Get current user
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      throw new Error('Utilisateur non authentifié');
    }

    // Get student profile
    const { data: student, error: studentError } = await supabaseClient
      .from('students')
      .select('id')
      .eq('profile_id', user.id)
      .single();

    if (studentError || !student) {
      throw new Error('Profil étudiant non trouvé');
    }

    // Get current balance
    const { data: currentBalance, error: balanceError } = await supabaseClient
      .from('catering_balances')
      .select('balance')
      .eq('student_id', student.id)
      .single();

    if (balanceError) {
      console.error('Balance fetch error:', balanceError);
      throw new Error('Impossible de récupérer le solde actuel');
    }

    const newBalance = (currentBalance?.balance || 0) + amount;
    const now = new Date().toISOString();

    // Update balance
    const { data: updatedBalance, error: updateError } = await supabaseClient
      .from('catering_balances')
      .update({
        balance: newBalance,
        last_recharge_amount: amount,
        last_recharge_date: now.split('T')[0],
        updated_at: now
      })
      .eq('student_id', student.id)
      .select()
      .single();

    if (updateError) {
      console.error('Balance update error:', updateError);
      throw new Error('Erreur lors de la recharge');
    }

    console.log(`Balance recharged successfully. New balance: ${newBalance}€`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: {
          balance: newBalance,
          recharge_amount: amount,
          recharge_date: now.split('T')[0]
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
    console.error('Error in recharge-balance:', error);
    
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