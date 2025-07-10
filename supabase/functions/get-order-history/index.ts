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

    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const status = url.searchParams.get('status');

    console.log('Getting order history with limit:', limit, 'status:', status);

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

    let query = supabaseClient
      .from('catering_orders')
      .select(`
        *,
        catering_menus!inner(name, meal_type, description, allergens, nutritional_info)
      `)
      .eq('student_id', student.id)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (status) {
      query = query.eq('status', status);
    }

    const { data: orders, error: ordersError } = await query;

    if (ordersError) {
      console.error('Orders fetch error:', ordersError);
      throw new Error('Impossible de récupérer l\'historique');
    }

    // Format response data
    const formattedOrders = orders?.map(order => ({
      id: order.id,
      order_date: order.order_date,
      pickup_time: order.pickup_time,
      quantity: order.quantity,
      total_amount: order.total_amount,
      status: order.status,
      special_requests: order.special_requests,
      created_at: order.created_at,
      menu: order.catering_menus
    })) || [];

    console.log(`Found ${formattedOrders.length} orders`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: formattedOrders,
        total: formattedOrders.length
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Error in get-order-history:', error);
    
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