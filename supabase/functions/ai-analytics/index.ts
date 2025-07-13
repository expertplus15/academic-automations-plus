import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, ...params } = await req.json();

    switch (action) {
      case 'detect_anomalies':
        return await detectAnomalies(params);
      case 'get_suggestions':
        return await getIntelligentSuggestions(params);
      case 'optimize_grades':
        return await optimizeGrades(params);
      case 'analyze_patterns':
        return await analyzePatterns(params);
      case 'predict_performance':
        return await predictPerformance(params);
      case 'validate_grade':
        return await validateGrade(params);
      case 'generate_feedback':
        return await generateFeedback(params);
      default:
        return new Response(
          JSON.stringify({ error: 'Unknown action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
  } catch (error) {
    console.error('AI Analytics error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function detectAnomalies(params: any) {
  const { filters } = params;
  
  // Simulate anomaly detection logic
  const anomalies = [];
  
  // Get recent grades for analysis
  let query = supabase
    .from('student_grades')
    .select(`
      *,
      students:student_id(id, student_number),
      subjects:subject_id(id, name),
      evaluation_types:evaluation_type_id(id, name)
    `)
    .order('created_at', { ascending: false })
    .limit(1000);

  if (filters?.subjectId) {
    query = query.eq('subject_id', filters.subjectId);
  }

  const { data: grades, error } = await query;
  if (error) throw error;

  // Detect grade outliers
  if (grades && grades.length > 0) {
    const gradeValues = grades.map(g => g.grade).filter(g => g !== null);
    const mean = gradeValues.reduce((a, b) => a + b, 0) / gradeValues.length;
    const std = Math.sqrt(gradeValues.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / gradeValues.length);
    
    grades.forEach(grade => {
      if (grade.grade !== null) {
        const zScore = Math.abs((grade.grade - mean) / std);
        
        if (zScore > 2.5) { // More than 2.5 standard deviations
          anomalies.push({
            id: `outlier_${grade.id}`,
            type: 'grade_outlier',
            severity: zScore > 3 ? 'critical' : 'high',
            title: `Note exceptionnelle détectée`,
            description: `Note de ${grade.grade}/${grade.max_grade} significativement différente de la moyenne (${mean.toFixed(1)})`,
            studentId: grade.student_id,
            subjectId: grade.subject_id,
            data: { grade: grade.grade, mean, std, zScore },
            confidence: Math.min(95, Math.round(zScore * 20)),
            suggestions: [
              'Vérifier la correction de cette évaluation',
              'Confirmer avec l\'étudiant si nécessaire',
              'Examiner les conditions d\'évaluation'
            ],
            timestamp: Date.now(),
            resolved: false
          });
        }
      }
    });
  }

  // Detect inconsistent grading patterns
  const subjectGrades = new Map();
  grades?.forEach(grade => {
    if (!subjectGrades.has(grade.subject_id)) {
      subjectGrades.set(grade.subject_id, []);
    }
    subjectGrades.get(grade.subject_id).push(grade);
  });

  subjectGrades.forEach((subjectGradeList, subjectId) => {
    const recentGrades = subjectGradeList.slice(0, 20);
    const variance = calculateVariance(recentGrades.map(g => g.grade).filter(g => g !== null));
    
    if (variance > 25) { // High variance threshold
      anomalies.push({
        id: `pattern_${subjectId}`,
        type: 'grade_pattern',
        severity: 'medium',
        title: 'Distribution de notes incohérente',
        description: `Variance élevée dans les notes récentes (${variance.toFixed(1)})`,
        subjectId,
        data: { variance, gradesCount: recentGrades.length },
        confidence: 75,
        suggestions: [
          'Revoir les critères d\'évaluation',
          'Standardiser la correction',
          'Former les correcteurs'
        ],
        timestamp: Date.now(),
        resolved: false
      });
    }
  });

  return new Response(
    JSON.stringify({ anomalies }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function getIntelligentSuggestions(params: any) {
  const { context } = params;
  const suggestions = [];

  // Get relevant data for suggestions
  let query = supabase
    .from('student_grades')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(500);

  if (context?.subjectId) {
    query = query.eq('subject_id', context.subjectId);
  }
  if (context?.studentId) {
    query = query.eq('student_id', context.studentId);
  }

  const { data: grades } = await query;

  if (grades && grades.length > 0) {
    const avgGrade = grades.reduce((sum, g) => sum + (g.grade || 0), 0) / grades.length;
    
    // Suggest grade adjustments if average is too low/high
    if (avgGrade < 10) {
      suggestions.push({
        id: `suggestion_grades_low_${Date.now()}`,
        type: 'evaluation_strategy',
        title: 'Moyenne générale faible détectée',
        description: `La moyenne actuelle (${avgGrade.toFixed(1)}/20) suggère une révision des critères d'évaluation`,
        impact: 'high',
        confidence: 85,
        data: { currentAverage: avgGrade },
        actions: [
          { label: 'Appliquer une correction', action: 'adjust_curve', parameters: { type: 'curve' } },
          { label: 'Revoir les critères', action: 'review_criteria', parameters: {} },
          { label: 'Session de rattrapage', action: 'remedial_session', parameters: {} }
        ],
        timestamp: Date.now()
      });
    }

    if (avgGrade > 17) {
      suggestions.push({
        id: `suggestion_grades_high_${Date.now()}`,
        type: 'evaluation_strategy',
        title: 'Moyenne très élevée détectée',
        description: `La moyenne actuelle (${avgGrade.toFixed(1)}/20) pourrait indiquer une évaluation trop facile`,
        impact: 'medium',
        confidence: 70,
        data: { currentAverage: avgGrade },
        actions: [
          { label: 'Augmenter la difficulté', action: 'increase_difficulty', parameters: {} },
          { label: 'Réviser le barème', action: 'review_scale', parameters: {} }
        ],
        timestamp: Date.now()
      });
    }

    // Suggest remedial actions for specific students
    const lowPerformers = grades.filter(g => g.grade && g.grade < 8);
    if (lowPerformers.length > grades.length * 0.3) {
      suggestions.push({
        id: `suggestion_remedial_${Date.now()}`,
        type: 'student_support',
        title: 'Taux d\'échec élevé détecté',
        description: `${lowPerformers.length} étudiants en difficulté identifiés`,
        impact: 'high',
        confidence: 90,
        data: { failingStudents: lowPerformers.length, totalStudents: grades.length },
        actions: [
          { label: 'Tutorat personnalisé', action: 'setup_tutoring', parameters: {} },
          { label: 'Session de révision', action: 'review_session', parameters: {} },
          { label: 'Ressources supplémentaires', action: 'additional_resources', parameters: {} }
        ],
        timestamp: Date.now()
      });
    }
  }

  return new Response(
    JSON.stringify({ suggestions }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function optimizeGrades(params: any) {
  const { subjectId, currentGrades } = params;
  
  // Simulate grade optimization
  const originalGrades = currentGrades || [];
  
  if (originalGrades.length === 0) {
    return new Response(
      JSON.stringify({
        originalGrades: [],
        adjustedGrades: [],
        adjustmentFactor: 0,
        preview: true
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  const mean = originalGrades.reduce((sum, g) => sum + g.grade, 0) / originalGrades.length;
  const targetMean = 12; // Target average of 12/20
  const adjustmentFactor = targetMean / mean;
  
  const adjustedGrades = originalGrades.map(grade => ({
    ...grade,
    adjusted_grade: Math.min(20, Math.max(0, grade.grade * adjustmentFactor))
  }));

  return new Response(
    JSON.stringify({
      originalGrades,
      adjustedGrades,
      adjustmentFactor,
      preview: true
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function analyzePatterns(params: any) {
  const { grades, timeframe, groupBy } = params;
  
  // Simulate pattern analysis
  const trends = [
    { label: 'Moyenne générale', value: 12.5, change: 0.8 },
    { label: 'Taux de réussite', value: 78, change: -2.1 },
    { label: 'Participation', value: 85, change: 1.5 }
  ];

  const patterns = [
    { type: 'seasonal', description: 'Baisse de performance en fin de semestre', confidence: 82 },
    { type: 'difficulty', description: 'Évaluations pratiques mieux réussies', confidence: 91 }
  ];

  const predictions = [
    { metric: 'success_rate', predicted_value: 75, confidence: 78 },
    { metric: 'average_grade', predicted_value: 13.2, confidence: 85 }
  ];

  return new Response(
    JSON.stringify({ trends, patterns, predictions }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function predictPerformance(params: any) {
  const { studentId } = params;
  
  // Get student's historical data
  const { data: grades } = await supabase
    .from('student_grades')
    .select('*')
    .eq('student_id', studentId)
    .order('created_at', { ascending: false });

  const predictions = [
    { subject: 'Mathématiques', predicted_grade: 14.5, confidence: 82, factors: ['Progression constante', 'Bonnes bases'] },
    { subject: 'Informatique', predicted_grade: 16.2, confidence: 91, factors: ['Excellent niveau', 'Participation active'] }
  ];

  const riskLevel = grades && grades.length > 0 && 
    grades.slice(0, 5).some(g => g.grade && g.grade < 10) ? 'medium' : 'low';

  const recommendations = [
    'Continuer sur cette lancée',
    'Approfondir les concepts avancés'
  ];

  return new Response(
    JSON.stringify({
      predictions,
      risk_level: riskLevel,
      recommendations
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function validateGrade(params: any) {
  const { studentId, subjectId, grade } = params;
  
  // Get student's historical grades for comparison
  const { data: historicalGrades } = await supabase
    .from('student_grades')
    .select('*')
    .eq('student_id', studentId)
    .eq('subject_id', subjectId)
    .order('created_at', { ascending: false })
    .limit(10);

  const warnings = [];
  const suggestions = [];
  let confidence = 90;

  if (historicalGrades && historicalGrades.length > 0) {
    const avgHistorical = historicalGrades.reduce((sum, g) => sum + (g.grade || 0), 0) / historicalGrades.length;
    const deviation = Math.abs(grade - avgHistorical);
    
    if (deviation > 5) {
      warnings.push({
        type: 'trend_deviation',
        message: `Note très différente de la moyenne historique (${avgHistorical.toFixed(1)})`,
        severity: deviation > 8 ? 'high' : 'medium'
      });
      confidence -= 20;
    }

    if (grade < 5 && avgHistorical > 12) {
      warnings.push({
        type: 'outlier',
        message: 'Note exceptionnellement basse pour cet étudiant',
        severity: 'high'
      });
      suggestions.push({
        action: 'verify_correction',
        reason: 'Vérifier la correction compte tenu de l\'historique'
      });
    }
  }

  return new Response(
    JSON.stringify({
      isValid: warnings.length === 0,
      confidence,
      warnings,
      suggestions
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function generateFeedback(params: any) {
  const { studentId, subjectId, gradeData, evaluationType } = params;
  
  // Simulate AI-generated feedback
  const grade = gradeData[0]?.grade || 0;
  let feedback = '';
  let tone = 'neutral';
  
  if (grade >= 16) {
    feedback = 'Excellent travail ! Vous maîtrisez parfaitement les concepts abordés. Continuez sur cette voie.';
    tone = 'encouraging';
  } else if (grade >= 12) {
    feedback = 'Bon travail. Quelques points à améliorer pour atteindre l\'excellence.';
    tone = 'constructive';
  } else if (grade >= 8) {
    feedback = 'Des efforts sont nécessaires. Revoir les concepts fondamentaux serait bénéfique.';
    tone = 'constructive';
  } else {
    feedback = 'Difficultés importantes constatées. Un accompagnement personnalisé est recommandé.';
    tone = 'constructive';
  }

  const keyPoints = [
    'Compréhension des concepts',
    'Application pratique',
    'Qualité de la présentation'
  ];

  const improvementAreas = grade < 12 ? [
    'Révision des concepts de base',
    'Pratique d\'exercices supplémentaires'
  ] : [];

  const strengths = grade >= 12 ? [
    'Bonne maîtrise générale',
    'Raisonnement logique'
  ] : [];

  return new Response(
    JSON.stringify({
      feedback,
      tone,
      key_points: keyPoints,
      improvement_areas: improvementAreas,
      strengths
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

function calculateVariance(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  const mean = numbers.reduce((a, b) => a + b, 0) / numbers.length;
  const variance = numbers.reduce((sum, num) => sum + Math.pow(num - mean, 2), 0) / numbers.length;
  return Math.sqrt(variance);
}