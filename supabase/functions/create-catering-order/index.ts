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

    const { items, pickup_time, special_requests } = await req.json();

    console.log('Creating catering order with items:', items);

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

    // Calculate total amount
    const totalAmount = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);

    // Check balance
    const { data: balance, error: balanceError } = await supabaseClient
      .from('catering_balances')
      .select('balance')
      .eq('student_id', student.id)
      .single();

    if (balanceError) {
      console.error('Balance check error:', balanceError);
      throw new Error('Impossible de vérifier le solde');
    }

    if (!balance || balance.balance < totalAmount) {
      throw new Error('Solde insuffisant');
    }

    const orderDate = new Date().toISOString().split('T')[0];
    const createdOrders = [];

    // Create orders for each item
    for (const item of items) {
      const { data: menu, error: menuError } = await supabaseClient
        .from('catering_menus')
        .select('id')
        .eq('name', item.name)
        .single();

      if (menuError || !menu) {
        console.error('Menu not found for item:', item.name);
        continue;
      }

      const { data: order, error: orderError } = await supabaseClient
        .from('catering_orders')
        .insert({
          student_id: student.id,
          menu_id: menu.id,
          quantity: item.quantity,
          total_amount: item.price * item.quantity,
          pickup_time: pickup_time || null,
          special_requests: special_requests || null,
          order_date: orderDate,
          status: 'confirmed'
        })
        .select()
        .single();

      if (orderError) {
        console.error('Order creation error:', orderError);
        throw new Error('Erreur lors de la création de la commande');
      }

      createdOrders.push(order);
    }

    // Update balance
    const { error: updateError } = await supabaseClient
      .from('catering_balances')
      .update({ 
        balance: balance.balance - totalAmount,
        updated_at: new Date().toISOString()
      })
      .eq('student_id', student.id);

    if (updateError) {
      console.error('Balance update error:', updateError);
      throw new Error('Erreur lors de la mise à jour du solde');
    }

    console.log(`Order created successfully. Total: ${totalAmount}€, Orders: ${createdOrders.length}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: {
          orders: createdOrders,
          total_amount: totalAmount,
          new_balance: balance.balance - totalAmount
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
    console.error('Error in create-catering-order:', error);
    
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