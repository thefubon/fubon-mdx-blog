// src/contexts/AudioPlayerProvider.tsx

'use client'

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import AudioManager from '@/utils/audioManager';
import { tracks } from '@/data/player';

interface AudioPlayerContextType {
  currentTrackIndex: number;
  isPlaying: boolean;
  progress: number;
  duration: number;
  currentTime: number;
  togglePlayPause: (trackIndex?: number) => void;
  nextTrack: () => void;
  prevTrack: () => void;
  seek: (time: number) => void;
  formatTime: (seconds: number) => string;
  topTracks: typeof tracks;
  playTrackFromCarousel: (trackId: number) => void;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | null>(null);

export const useAudioPlayer = () => {
  const context = useContext(AudioPlayerContext);
  if (!context) {
    throw new Error('useAudioPlayer must be used within an AudioPlayerProvider');
  }
  return context;
};

export const AudioPlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);

  const audioManagerRef = useRef<AudioManager | null>(null);
  const topTracks = tracks.filter((track) => track.top && track.carousel);

  const resetProgress = () => {
    setProgress(0);
    setCurrentTime(0);
    setDuration(0);
  };

  const updateProgress = (progress: number, duration: number, currentTime: number) => {
    setProgress(progress);
    setDuration(duration);
    setCurrentTime(currentTime);
  };

  useEffect(() => {
    const audioManager = AudioManager.getInstance();
    audioManager.setTracks(tracks);
    audioManagerRef.current = audioManager;

    audioManager.setCallbacks({
      onPlay: () => {
        setIsPlaying(true);
        const checkInterval = setInterval(() => {
          if (audioManager.isPlaying()) {
            const pos = audioManager.getCurrentPosition();
            const dur = audioManager.getDuration();
            if (pos > 0 && dur > 0) {
              updateProgress((pos / dur) * 100, dur, pos);
            }
          } else {
            clearInterval(checkInterval);
          }
        }, 100);
        setTimeout(() => clearInterval(checkInterval), 1000);
      },
      onPause: () => {
        setIsPlaying(false);
        const pos = audioManager.getCurrentPosition();
        const dur = audioManager.getDuration();
        setCurrentTime(pos);
        setProgress((pos / dur) * 100);
      },
      onStop: () => {
        setIsPlaying(false);
        resetProgress();
      },
      onEnd: () => {
        resetProgress();
        const newIndex = audioManager.nextTrack();
        setCurrentTrackIndex(newIndex);
        audioManager.play();
      },
      onLoad: () => {
        const dur = audioManager.getDuration();
        setDuration(dur);
        setCurrentTime(0);
        setProgress(0);
      },
      onSeek: () => {
        const pos = audioManager.getCurrentPosition();
        const dur = audioManager.getDuration();
        setCurrentTime(pos);
        setProgress((pos / dur) * 100);
      },
      onProgress: (position, trackDuration) => {
        if (position >= 0 && trackDuration > 0) {
          const newProgress = (position / trackDuration) * 100;
          updateProgress(newProgress, trackDuration, position);
        }
      },
      onTrackChange: () => {
        resetProgress();
      },
    });

    audioManager.initTrack(0);

    const updateInterval = setInterval(() => {
      if (audioManager.isPlaying()) {
        audioManager.updateProgressManually();
      }
    }, 100);

    return () => {
      clearInterval(updateInterval);
      audioManager.destroy();
    };
  }, []);

  useEffect(() => {
    if (!audioManagerRef.current) return;

    const currentManagerIndex = audioManagerRef.current.getCurrentIndex();
    if (currentTrackIndex !== currentManagerIndex) {
      resetProgress();
      audioManagerRef.current.initTrack(currentTrackIndex);
      if (isPlaying) {
        audioManagerRef.current.play();
      }
    }
  }, [currentTrackIndex, isPlaying]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const togglePlayPause = (trackIndex?: number): void => {
    if (!audioManagerRef.current) return;

    if (trackIndex !== undefined && trackIndex !== currentTrackIndex) {
      setCurrentTrackIndex(trackIndex);
      resetProgress();
      return;
    }

    audioManagerRef.current.togglePlayPause();
  };

  const nextTrack = (): void => {
    if (!audioManagerRef.current) return;
    resetProgress();
    const newIndex = audioManagerRef.current.nextTrack();
    setCurrentTrackIndex(newIndex);
    if (isPlaying) {
      audioManagerRef.current.play();
    }
  };

  const prevTrack = (): void => {
    if (!audioManagerRef.current) return;
    resetProgress();
    const newIndex = audioManagerRef.current.prevTrack();
    setCurrentTrackIndex(newIndex);
    if (isPlaying) {
      audioManagerRef.current.play();
    }
  };

  const seek = (seekTime: number): void => {
    if (!audioManagerRef.current || duration === 0) return;
    setCurrentTime(seekTime);
    setProgress((seekTime / duration) * 100);
    audioManagerRef.current.seek(seekTime);
  };

  const playTrackFromCarousel = (trackId: number): void => {
    const trackIndex = tracks.findIndex((track) => track.id === trackId);
    if (trackIndex !== -1) {
      setCurrentTrackIndex(trackIndex);
      resetProgress();

      if (audioManagerRef.current) {
        audioManagerRef.current.initTrack(trackIndex);
        audioManagerRef.current.play();
      }
    }
  };

  const contextValue: AudioPlayerContextType = {
    currentTrackIndex,
    isPlaying,
    progress,
    duration,
    currentTime,
    togglePlayPause,
    nextTrack,
    prevTrack,
    seek,
    formatTime,
    topTracks,
    playTrackFromCarousel,
  };

  return (
    <AudioPlayerContext.Provider value={contextValue}>
      {children}
    </AudioPlayerContext.Provider>
  );
};
