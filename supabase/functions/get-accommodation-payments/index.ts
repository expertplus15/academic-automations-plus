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

    console.log('Fetching accommodation payments for user:', user.id);

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

    // Mock payment data for now (would come from actual payment system)
    const payments = [
      {
        id: 'pay_001',
        amount: 450,
        due_date: '2024-01-15',
        paid_date: '2024-01-14',
        status: 'paid',
        payment_method: 'bank_transfer',
        reference: 'RENT-202401',
        notes: 'Loyer janvier 2024'
      },
      {
        id: 'pay_002',
        amount: 450,
        due_date: '2024-02-15',
        paid_date: null,
        status: 'pending',
        payment_method: null,
        reference: 'RENT-202402',
        notes: 'Loyer février 2024'
      },
      {
        id: 'pay_003',
        amount: 450,
        due_date: '2024-03-15',
        paid_date: null,
        status: 'pending',
        payment_method: null,
        reference: 'RENT-202403',
        notes: 'Loyer mars 2024'
      }
    ];

    // Calculate summary
    const summary = {
      total_paid: payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0),
      total_pending: payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0),
      next_payment_due: payments.find(p => p.status === 'pending')?.due_date || null,
      next_payment_amount: payments.find(p => p.status === 'pending')?.amount || null
    };

    console.log(`Found ${payments.length} payments for student ${student.id}`);

    return new Response(
      JSON.stringify({ payments, summary }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in get-accommodation-payments:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});