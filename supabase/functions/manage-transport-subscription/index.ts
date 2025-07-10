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

    // Get student record
    const { data: student, error: studentError } = await supabaseClient
      .from('students')
      .select('id')
      .eq('profile_id', user.id)
      .single();

    if (studentError || !student) {
      throw new Error('Student record not found');
    }

    if (req.method === 'GET') {
      // Fetch existing subscriptions
      console.log('Fetching transport subscriptions for student:', student.id);
      
      const { data: subscriptions, error: subscriptionsError } = await supabaseClient
        .from('transport_subscriptions')
        .select(`
          *,
          transport_lines (
            id,
            name,
            code,
            price
          )
        `)
        .eq('student_id', student.id)
        .order('created_at', { ascending: false });

      if (subscriptionsError) {
        console.error('Error fetching subscriptions:', subscriptionsError);
        throw subscriptionsError;
      }

      // Transform the data
      const transformedSubscriptions = subscriptions?.map(subscription => ({
        ...subscription,
        line_name: subscription.transport_lines?.name,
        line_code: subscription.transport_lines?.code,
        transport_lines: undefined
      })) || [];

      return new Response(JSON.stringify({ 
        subscriptions: transformedSubscriptions,
        success: true 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });

    } else if (req.method === 'POST') {
      // Create new subscription
      const { line_id, subscription_type } = await req.json();

      console.log('Creating transport subscription:', {
        student_id: student.id,
        line_id,
        subscription_type
      });

      // Validate required fields
      if (!line_id || !subscription_type) {
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

      // Check for existing active subscription on the same line
      const { data: existingSubscription, error: existingError } = await supabaseClient
        .from('transport_subscriptions')
        .select('id')
        .eq('student_id', student.id)
        .eq('line_id', line_id)
        .eq('status', 'active');

      if (existingError) {
        console.error('Error checking existing subscriptions:', existingError);
        throw existingError;
      }

      if (existingSubscription && existingSubscription.length > 0) {
        throw new Error('You already have an active subscription for this line');
      }

      // Calculate dates and amount based on subscription type
      const startDate = new Date();
      let endDate: Date;
      let amount: number;

      switch (subscription_type) {
        case 'weekly':
          endDate = new Date(startDate);
          endDate.setDate(endDate.getDate() + 7);
          amount = 15.00;
          break;
        case 'monthly':
          endDate = new Date(startDate);
          endDate.setMonth(endDate.getMonth() + 1);
          amount = 50.00;
          break;
        case 'semester':
          endDate = new Date(startDate);
          endDate.setMonth(endDate.getMonth() + 6);
          amount = 250.00;
          break;
        default:
          throw new Error('Invalid subscription type');
      }

      // Create the subscription
      const { data: subscription, error: subscriptionError } = await supabaseClient
        .from('transport_subscriptions')
        .insert({
          student_id: student.id,
          line_id,
          subscription_type,
          start_date: startDate.toISOString().split('T')[0],
          end_date: endDate.toISOString().split('T')[0],
          amount,
          status: 'active',
          payment_date: new Date().toISOString()
        })
        .select()
        .single();

      if (subscriptionError) {
        console.error('Error creating subscription:', subscriptionError);
        throw subscriptionError;
      }

      console.log('Successfully created subscription:', subscription.id);

      return new Response(JSON.stringify({ 
        subscription,
        success: true,
        message: 'Subscription created successfully'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });

    } else {
      return new Response('Method not allowed', { status: 405, headers: corsHeaders });
    }

  } catch (error) {
    console.error('Error in manage-transport-subscription function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});