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

    if (req.method === 'POST') {
      const formData = await req.formData();
      const file = formData.get('file') as File;
      const type = formData.get('type') as string;

      if (!file) {
        return new Response(
          JSON.stringify({ error: 'No file provided' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Validate file type
      const allowedTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
        'text/csv', // .csv
        'application/vnd.ms-excel' // .xls
      ];

      if (!allowedTypes.includes(file.type)) {
        return new Response(
          JSON.stringify({ error: 'Invalid file type. Only Excel and CSV files are allowed.' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        return new Response(
          JSON.stringify({ error: 'File size too large. Maximum 10MB allowed.' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Generate unique filename
      const fileName = `${Date.now()}-${file.name}`;
      const filePath = `uploads/${type}/${fileName}`;

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('imports')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        return new Response(
          JSON.stringify({ error: 'Failed to upload file' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Process the file based on type
      let processedData = null;
      if (type === 'grades') {
        processedData = await processGradesFile(file);
      } else if (type === 'students') {
        processedData = await processStudentsFile(file);
      }

      // Create import job record
      const { data: jobData, error: jobError } = await supabase
        .from('import_jobs')
        .insert({
          file_name: file.name,
          file_path: filePath,
          file_size: file.size,
          type: type,
          status: 'completed',
          processed_records: processedData?.records || 0,
          total_records: processedData?.total || 0
        })
        .select()
        .single();

      if (jobError) {
        console.error('Job creation error:', jobError);
      }

      return new Response(
        JSON.stringify({
          success: true,
          uploadData,
          processedData,
          jobId: jobData?.id
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in upload-file function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function processGradesFile(file: File) {
  // Parse Excel/CSV file for grades
  // This is a simplified version - you'd use a proper Excel parser
  const text = await file.text();
  const lines = text.split('\n');
  
  return {
    records: lines.length - 1, // Excluding header
    total: lines.length - 1,
    preview: lines.slice(0, 5)
  };
}

async function processStudentsFile(file: File) {
  // Parse Excel/CSV file for students
  const text = await file.text();
  const lines = text.split('\n');
  
  return {
    records: lines.length - 1,
    total: lines.length - 1,
    preview: lines.slice(0, 5)
  };
}