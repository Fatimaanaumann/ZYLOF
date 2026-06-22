import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

// Define the structure of a Track
interface Track {
  id: string;
  title: string;
  artist: string;
  audioUrl: string;
  coverArt: string;
}

// Define what information this audio engine shares with the rest of the app
interface AudioContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  duration: number;
  currentTime: number;
  volume: number;
  playTrack: (track: Track) => void;
  togglePlay: () => void;
  setVolume: (volume: number) => void;
  startSleepTimer: (minutes: number) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [volume, _setVolume] = useState<number>(0.8); // Default 80% volume

  // References to native browser audio mechanics and intervals
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const sleepTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize the audio element safely inside the browser
  useEffect(() => {
    audioRef.current = new Audio();
    
    const audio = audioRef.current;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration || 0);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
    };
  }, []);

  // Sync play/pause actions with the audio hardware
  useEffect(() => {
    if (!audioRef.current || !currentTrack) return;

    if (isPlaying) {
      audioRef.current.play().catch(() => setIsPlaying(false));
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrack]);

  // Handle playing a brand new track selection
  const playTrack = (track: Track) => {
    if (!audioRef.current) return;
    setCurrentTrack(track);
    audioRef.current.src = track.audioUrl;
    audioRef.current.load();
    setIsPlaying(true);
  };

  const togglePlay = () => {
    if (currentTrack) setIsPlaying(!isPlaying);
  };

  const setVolume = (val: number) => {
    const clampedVolume = Math.max(0, Math.min(1, val));
    _setVolume(clampedVolume);
    if (audioRef.current) {
      audioRef.current.volume = clampedVolume;
    }
  };

  // Sleep Timer with Auto-Fade Logic
  const startSleepTimer = (minutes: number) => {
    // Clear any previous active timers
    if (sleepTimeoutRef.current) clearTimeout(sleepTimeoutRef.current);
    if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);

    const msUntilFade = minutes * 60 * 1000 - 10000; // Start fade 10 seconds before cutoff

    sleepTimeoutRef.current = setTimeout(() => {
      // Begin incremental fade down to zero over 10 seconds
      fadeIntervalRef.current = setInterval(() => {
        if (audioRef.current && audioRef.current.volume > 0.05) {
          setVolume(audioRef.current.volume - 0.1);
        } else {
          // Completely stop playback once faded out
          setIsPlaying(false);
          if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
        }
      }, 1000);
    }, Math.max(0, msUntilFade));
  };

  return (
    <AudioContext.Provider value={{
      currentTrack, isPlaying, duration, currentTime, volume,
      playTrack, togglePlay, setVolume, startSleepTimer
    }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) throw new Error('useAudio must be used within an AudioProvider');
  return context;
};
