import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

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
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const url = new URL(req.url);
    const action = url.pathname.split('/').pop();

    if (req.method === 'GET') {
      if (action === 'dashboard') {
        // Get real-time dashboard metrics
        const metrics = await calculateDashboardMetrics(supabase);
        
        return new Response(JSON.stringify(metrics), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      if (action === 'grades-distribution') {
        // Get grades distribution data
        const { data: grades, error } = await supabase
          .from('student_grades')
          .select('grade, max_grade, subjects(name)')
          .eq('is_published', true);

        if (error) {
          throw error;
        }

        const distribution = calculateGradesDistribution(grades);
        
        return new Response(JSON.stringify(distribution), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      if (action === 'success-trends') {
        // Get success rate trends
        const trends = await calculateSuccessTrends(supabase);
        
        return new Response(JSON.stringify(trends), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      if (action === 'live-metrics') {
        // Get live metrics for real-time updates
        const liveMetrics = await getLiveMetrics(supabase);
        
        return new Response(JSON.stringify(liveMetrics), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }

    if (req.method === 'POST') {
      const body = await req.json();

      if (action === 'calculate-metrics') {
        // Trigger metrics calculation
        const { metricType, filters } = body;
        
        const result = await calculateSpecificMetric(supabase, metricType, filters);
        
        // Store calculated metric
        await supabase
          .from('analytics_metrics')
          .insert({
            metric_type: metricType,
            metric_name: result.name,
            value: result.value,
            dimensions: filters || {},
            time_period: 'real_time',
            reference_date: new Date().toISOString().split('T')[0]
          });

        return new Response(JSON.stringify(result), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      if (action === 'collaboration-join') {
        // Join collaboration session
        const { sessionType, resourceId, userId, userName } = body;
        
        // Find or create collaboration session
        let { data: session, error } = await supabase
          .from('collaboration_sessions')
          .select('*')
          .eq('session_type', sessionType)
          .eq('resource_id', resourceId)
          .gt('expires_at', new Date().toISOString())
          .single();

        if (error || !session) {
          // Create new session
          const { data: newSession, error: createError } = await supabase
            .from('collaboration_sessions')
            .insert({
              session_type: sessionType,
              resource_id: resourceId,
              active_users: [{ id: userId, name: userName, joinedAt: new Date().toISOString() }],
              expires_at: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString() // 4 hours
            })
            .select()
            .single();

          if (createError) {
            throw createError;
          }

          session = newSession;
        } else {
          // Add user to existing session
          const activeUsers = session.active_users || [];
          const userExists = activeUsers.find((u: any) => u.id === userId);
          
          if (!userExists) {
            activeUsers.push({ id: userId, name: userName, joinedAt: new Date().toISOString() });
            
            await supabase
              .from('collaboration_sessions')
              .update({ active_users: activeUsers })
              .eq('id', session.id);
          }
        }

        return new Response(JSON.stringify({
          sessionId: session.id,
          activeUsers: session.active_users
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      if (action === 'collaboration-leave') {
        // Leave collaboration session
        const { sessionId, userId } = body;
        
        const { data: session, error } = await supabase
          .from('collaboration_sessions')
          .select('active_users')
          .eq('id', sessionId)
          .single();

        if (error || !session) {
          return new Response(JSON.stringify({ success: true }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        const activeUsers = (session.active_users || []).filter((u: any) => u.id !== userId);
        
        await supabase
          .from('collaboration_sessions')
          .update({ active_users: activeUsers })
          .eq('id', sessionId);

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in realtime-analytics function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function calculateDashboardMetrics(supabase: any) {
  const today = new Date().toISOString().split('T')[0];

  // Get basic counts
  const [studentsResult, gradesResult, subjectsResult] = await Promise.all([
    supabase.from('students').select('id', { count: 'exact', head: true }),
    supabase.from('student_grades').select('grade').eq('is_published', true),
    supabase.from('subjects').select('id', { count: 'exact', head: true })
  ]);

  const studentCount = studentsResult.count || 0;
  const subjectCount = subjectsResult.count || 0;
  const grades = gradesResult.data || [];

  // Calculate average grade
  const averageGrade = grades.length > 0 
    ? grades.reduce((sum: number, g: any) => sum + (g.grade || 0), 0) / grades.length
    : 0;

  // Calculate success rate (grades >= 10)
  const successfulGrades = grades.filter((g: any) => g.grade >= 10).length;
  const successRate = grades.length > 0 ? (successfulGrades / grades.length) * 100 : 0;

  return {
    totalStudents: studentCount,
    totalSubjects: subjectCount,
    totalGrades: grades.length,
    averageGrade: Math.round(averageGrade * 100) / 100,
    successRate: Math.round(successRate * 100) / 100,
    lastUpdated: new Date().toISOString()
  };
}

function calculateGradesDistribution(grades: any[]) {
  const distribution = [
    { range: '0-5', count: 0 },
    { range: '6-10', count: 0 },
    { range: '11-15', count: 0 },
    { range: '16-20', count: 0 }
  ];

  grades.forEach((grade) => {
    const value = grade.grade || 0;
    if (value <= 5) distribution[0].count++;
    else if (value <= 10) distribution[1].count++;
    else if (value <= 15) distribution[2].count++;
    else distribution[3].count++;
  });

  return distribution;
}

async function calculateSuccessTrends(supabase: any) {
  // Simulate monthly trend data
  // In a real implementation, you'd query actual historical data
  return [
    { month: 'Sept', successRate: 78 },
    { month: 'Oct', successRate: 82 },
    { month: 'Nov', successRate: 85 },
    { month: 'Dec', successRate: 88 },
    { month: 'Jan', successRate: 87 }
  ];
}

async function getLiveMetrics(supabase: any) {
  // Get recent analytics metrics
  const { data, error } = await supabase
    .from('analytics_metrics')
    .select('*')
    .eq('time_period', 'real_time')
    .gte('calculated_at', new Date(Date.now() - 60 * 60 * 1000).toISOString()) // Last hour
    .order('calculated_at', { ascending: false });

  if (error) {
    console.error('Error fetching live metrics:', error);
    return [];
  }

  return data || [];
}

async function calculateSpecificMetric(supabase: any, metricType: string, filters: any) {
  switch (metricType) {
    case 'average_grade':
      const { data: grades } = await supabase
        .from('student_grades')
        .select('grade')
        .eq('is_published', true);
      
      const avg = grades?.length > 0 
        ? grades.reduce((sum: number, g: any) => sum + (g.grade || 0), 0) / grades.length
        : 0;
      
      return { name: 'Moyenne Générale', value: Math.round(avg * 100) / 100 };

    case 'attendance_rate':
      // Mock calculation
      return { name: 'Taux de Présence', value: 92.5 };

    case 'success_rate':
      const { data: allGrades } = await supabase
        .from('student_grades')
        .select('grade')
        .eq('is_published', true);
      
      const successCount = allGrades?.filter((g: any) => g.grade >= 10).length || 0;
      const rate = allGrades?.length > 0 ? (successCount / allGrades.length) * 100 : 0;
      
      return { name: 'Taux de Réussite', value: Math.round(rate * 100) / 100 };

    default:
      return { name: 'Métrique Inconnue', value: 0 };
  }
}