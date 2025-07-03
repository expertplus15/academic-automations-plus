import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Settings,
  SkipBack,
  SkipForward,
  Subtitles
} from 'lucide-react';
import { useVideoStreams } from '@/hooks/useVideoStreams';

interface VideoPlayerProps {
  videoStream: any;
  studentId?: string;
  autoplay?: boolean;
  onProgressUpdate?: (progress: number) => void;
}

export function AdaptiveVideoPlayer({ 
  videoStream, 
  studentId, 
  autoplay = false,
  onProgressUpdate 
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { trackVideoView } = useVideoStreams();
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [selectedQuality, setSelectedQuality] = useState('auto');
  const [subtitlesEnabled, setSubtitlesEnabled] = useState(false);
  const [chapters, setChapters] = useState([]);

  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => setDuration(video.duration);
    
    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateDuration);
    video.addEventListener('play', () => setIsPlaying(true));
    video.addEventListener('pause', () => setIsPlaying(false));

    // Auto-hide controls after 3 seconds
    const handleMouseMove = () => {
      setShowControls(true);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      controlsTimeoutRef.current = setTimeout(() => {
        if (isPlaying) setShowControls(false);
      }, 3000);
    };

    video.addEventListener('mousemove', handleMouseMove);

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', updateDuration);
      video.removeEventListener('play', () => setIsPlaying(true));
      video.removeEventListener('pause', () => setIsPlaying(false));
      video.removeEventListener('mousemove', handleMouseMove);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [isPlaying]);

  // Track viewing progress
  useEffect(() => {
    if (!studentId || !videoStream) return;

    const trackingInterval = setInterval(() => {
      if (videoRef.current && !videoRef.current.paused) {
        const progress = (currentTime / duration) * 100;
        
        trackVideoView(videoStream.id, studentId, {
          watch_time_seconds: Math.floor(currentTime),
          progress_percentage: progress,
          playback_speed: playbackSpeed,
          quality_selected: selectedQuality,
          last_position_seconds: Math.floor(currentTime),
          completion_status: progress >= 95 ? 'completed' : 'in_progress',
          engagement_events: [],
        });

        onProgressUpdate?.(progress);
      }
    }, 10000); // Track every 10 seconds

    return () => clearInterval(trackingInterval);
  }, [currentTime, duration, studentId, videoStream, playbackSpeed, selectedQuality, trackVideoView, onProgressUpdate]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  };

  const handleSeek = (value: number[]) => {
    const video = videoRef.current;
    if (!video) return;
    
    const newTime = (value[0] / 100) * duration;
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (value: number[]) => {
    const video = videoRef.current;
    if (!video) return;
    
    const newVolume = value[0] / 100;
    video.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    
    if (isMuted) {
      video.volume = volume;
      setIsMuted(false);
    } else {
      video.volume = 0;
      setIsMuted(true);
    }
  };

  const skipTime = (seconds: number) => {
    const video = videoRef.current;
    if (!video) return;
    
    const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const changePlaybackSpeed = (speed: number) => {
    const video = videoRef.current;
    if (!video) return;
    
    video.playbackRate = speed;
    setPlaybackSpeed(speed);
  };

  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;

    if (!document.fullscreenElement) {
      video.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getCurrentChapter = () => {
    const chapters = videoStream?.chapters;
    if (!chapters || !Array.isArray(chapters)) return null;
    
    return chapters.find((chapter: any, index: number) => {
      const nextChapter = chapters[index + 1];
      return currentTime >= chapter.start_time && 
             (!nextChapter || currentTime < nextChapter.start_time);
    });
  };

  const currentChapter = getCurrentChapter();

  return (
    <div className="relative w-full bg-black rounded-lg overflow-hidden group">
      <video
        ref={videoRef}
        className="w-full h-auto"
        src={videoStream?.streaming_url || videoStream?.file_path}
        poster={videoStream?.thumbnail_url}
        autoPlay={autoplay}
        onContextMenu={(e) => e.preventDefault()}
      >
        {videoStream?.subtitles?.map((subtitle: any) => (
          <track
            key={subtitle.id}
            kind="subtitles"
            src={subtitle.file_path}
            srcLang={subtitle.language_code}
            label={subtitle.title}
            default={subtitle.is_default}
          />
        ))}
      </video>

      {/* Chapter overlay */}
      {currentChapter && (
        <div className="absolute top-4 left-4 bg-black/80 text-white px-3 py-1 rounded text-sm">
          {currentChapter.title}
        </div>
      )}

      {/* Controls overlay */}
      <div 
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
        onMouseEnter={() => setShowControls(true)}
      >
        {/* Progress bar */}
        <div className="mb-4">
          <Slider
            value={[duration ? (currentTime / duration) * 100 : 0]}
            onValueChange={handleSeek}
            max={100}
            step={0.1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-white/70 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Control buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => skipTime(-10)}
              className="text-white hover:bg-white/20"
            >
              <SkipBack className="w-4 h-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={togglePlay}
              className="text-white hover:bg-white/20"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => skipTime(10)}
              className="text-white hover:bg-white/20"
            >
              <SkipForward className="w-4 h-4" />
            </Button>

            <div className="flex items-center gap-2 ml-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMute}
                className="text-white hover:bg-white/20"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </Button>
              
              <div className="w-20">
                <Slider
                  value={[isMuted ? 0 : volume * 100]}
                  onValueChange={handleVolumeChange}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Speed control */}
            <select
              value={playbackSpeed}
              onChange={(e) => changePlaybackSpeed(parseFloat(e.target.value))}
              className="bg-transparent text-white text-sm border border-white/30 rounded px-2 py-1"
            >
              <option value={0.5} className="bg-black">0.5x</option>
              <option value={0.75} className="bg-black">0.75x</option>
              <option value={1} className="bg-black">Normal</option>
              <option value={1.25} className="bg-black">1.25x</option>
              <option value={1.5} className="bg-black">1.5x</option>
              <option value={2} className="bg-black">2x</option>
            </select>

            {/* Quality selector */}
            <select
              value={selectedQuality}
              onChange={(e) => setSelectedQuality(e.target.value)}
              className="bg-transparent text-white text-sm border border-white/30 rounded px-2 py-1"
            >
              <option value="auto" className="bg-black">Auto</option>
              <option value="1080p" className="bg-black">1080p</option>
              <option value="720p" className="bg-black">720p</option>
              <option value="480p" className="bg-black">480p</option>
            </select>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSubtitlesEnabled(!subtitlesEnabled)}
              className="text-white hover:bg-white/20"
            >
              <Subtitles className="w-4 h-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={toggleFullscreen}
              className="text-white hover:bg-white/20"
            >
              <Maximize className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}