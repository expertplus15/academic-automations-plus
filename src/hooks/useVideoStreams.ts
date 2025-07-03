import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

type VideoStream = {
  id: string;
  lesson_id: string;
  recording_id?: string | null;
  title: string;
  description?: string | null;
  file_path: string;
  file_size?: number | null;
  duration_seconds?: number | null;
  video_format: string;
  resolution: string;
  bitrate?: number | null;
  thumbnail_url?: string | null;
  chapters: any;
  quality_variants: any;
  streaming_url?: string | null;
  download_url?: string | null;
  status: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export function useVideoStreams(lessonId?: string) {
  const [videoStreams, setVideoStreams] = useState<VideoStream[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchVideoStreams();
  }, [lessonId]);

  const fetchVideoStreams = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('video_streams')
        .select('*')
        .order('created_at', { ascending: false });

      if (lessonId) {
        query = query.eq('lesson_id', lessonId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setVideoStreams(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des vidéos');
      toast({
        title: "Erreur",
        description: "Impossible de charger les flux vidéo",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createVideoStream = async (streamData: any) => {
    try {
      const { data, error } = await supabase
        .from('video_streams')
        .insert([streamData])
        .select()
        .single();

      if (error) throw error;

      setVideoStreams(prev => [data, ...prev]);
      toast({
        title: "Succès",
        description: "Flux vidéo créé avec succès",
      });
      
      return data;
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Impossible de créer le flux vidéo",
        variant: "destructive",
      });
      throw err;
    }
  };

  const updateVideoStream = async (id: string, updates: Partial<VideoStream>) => {
    try {
      const { data, error } = await supabase
        .from('video_streams')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setVideoStreams(prev => prev.map(stream => 
        stream.id === id ? { ...stream, ...data } : stream
      ));
      
      toast({
        title: "Succès",
        description: "Flux vidéo mis à jour avec succès",
      });
      
      return data;
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le flux vidéo",
        variant: "destructive",
      });
      throw err;
    }
  };

  const trackVideoView = async (videoStreamId: string, studentId: string, progressData: any) => {
    try {
      const { error } = await supabase
        .from('viewing_analytics')
        .upsert({
          video_stream_id: videoStreamId,
          student_id: studentId,
          ...progressData,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
    } catch (err) {
      console.error('Erreur lors du tracking vidéo:', err);
    }
  };

  return {
    videoStreams,
    loading,
    error,
    fetchVideoStreams,
    createVideoStream,
    updateVideoStream,
    trackVideoView,
  };
}