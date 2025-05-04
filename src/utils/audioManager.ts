// src/utils/audioManager.ts

'use client'

import { Howl } from 'howler';
import { Track } from '@/data/player';

type AudioCallback = () => void;

class AudioManager {
  private static instance: AudioManager;
  private sound: Howl | null = null;
  private tracks: Track[] = [];
  private currentIndex: number = 0;
  private progressAnimationId: number | null = null;

  private onPlayCallback: AudioCallback | null = null;
  private onPauseCallback: AudioCallback | null = null;
  private onStopCallback: AudioCallback | null = null;
  private onEndCallback: AudioCallback | null = null;
  private onLoadCallback: AudioCallback | null = null;
  private onSeekCallback: AudioCallback | null = null;
  private onProgressCallback: ((position: number, duration: number) => void) | null = null;
  private onTrackChangeCallback: ((index: number) => void) | null = null;

  private constructor() { }

  public static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  public setTracks(tracks: Track[]): void {
    this.tracks = tracks;
  }

  public initTrack(index: number): void {
    if (index < 0 || index >= this.tracks.length) return;

    const isTrackChange = this.currentIndex !== index;

    if (this.sound) {
      this.sound.stop();
      this.sound.unload();
      this.sound = null;
    }

    this.currentIndex = index;
    const track = this.tracks[index];

    if (isTrackChange && this.onTrackChangeCallback) {
      this.onTrackChangeCallback(index);
    }

    this.sound = new Howl({
      src: [track.src],
      html5: true,
      onload: () => {
        if (this.onLoadCallback) this.onLoadCallback();
      },
      onplay: () => {
        if (this.onPlayCallback) this.onPlayCallback();
        this.startProgressTracking();
      },
      onpause: () => {
        if (this.onPauseCallback) this.onPauseCallback();
        this.stopProgressTracking();
      },
      onstop: () => {
        if (this.onStopCallback) this.onStopCallback();
        this.stopProgressTracking();
      },
      onend: () => {
        if (this.onEndCallback) this.onEndCallback();
      },
      onseek: () => {
        if (this.onSeekCallback) this.onSeekCallback();
      }
    });
  }

  public setCallbacks({
    onPlay,
    onPause,
    onStop,
    onEnd,
    onLoad,
    onSeek,
    onProgress,
    onTrackChange
  }: {
    onPlay?: AudioCallback,
    onPause?: AudioCallback,
    onStop?: AudioCallback,
    onEnd?: AudioCallback,
    onLoad?: AudioCallback,
    onSeek?: AudioCallback,
    onProgress?: (position: number, duration: number) => void,
    onTrackChange?: (index: number) => void
  }): void {
    if (onPlay) this.onPlayCallback = onPlay;
    if (onPause) this.onPauseCallback = onPause;
    if (onStop) this.onStopCallback = onStop;
    if (onEnd) this.onEndCallback = onEnd;
    if (onLoad) this.onLoadCallback = onLoad;
    if (onSeek) this.onSeekCallback = onSeek;
    if (onProgress) this.onProgressCallback = onProgress;
    if (onTrackChange) this.onTrackChangeCallback = onTrackChange;
  }

  private startProgressTracking(): void {
    this.stopProgressTracking();

    const updateProgress = () => {
      if (!this.sound) {
        this.stopProgressTracking();
        return;
      }

      try {
        const position = typeof this.sound.seek() === 'number'
          ? this.sound.seek()
          : 0;
        const duration = this.sound.duration() || 0;

        if (this.onProgressCallback && duration > 0) {
          this.onProgressCallback(position, duration);
        }
      } catch (error) {
        console.error('Progress tracking error:', error);
      }

      this.progressAnimationId = requestAnimationFrame(updateProgress);
    };

    this.progressAnimationId = requestAnimationFrame(updateProgress);
  }

  private stopProgressTracking(): void {
    if (this.progressAnimationId !== null) {
      cancelAnimationFrame(this.progressAnimationId);
      this.progressAnimationId = null;
    }
  }

  public updateProgressManually(): void {
    if (!this.sound) return;

    try {
      const position = typeof this.sound.seek() === 'number'
        ? this.sound.seek()
        : 0;
      const duration = this.sound.duration() || 0;

      if (this.onProgressCallback && duration > 0) {
        this.onProgressCallback(position, duration);
      }
    } catch (error) {
      console.error('Manual progress update error:', error);
    }
  }

  public play(): void {
    if (this.sound) {
      this.sound.play();
      this.startProgressTracking();
    }
  }

  public pause(): void {
    if (this.sound) {
      this.sound.pause();
    }
  }

  public stop(): void {
    if (this.sound) {
      this.sound.stop();
    }
  }

  public togglePlayPause(): void {
    if (!this.sound) return;

    if (this.sound.playing()) {
      this.sound.pause();
    } else {
      this.sound.play();
    }
  }

  public nextTrack(): number {
    const newIndex = (this.currentIndex + 1) % this.tracks.length;
    this.initTrack(newIndex);
    return newIndex;
  }

  public prevTrack(): number {
    const newIndex = (this.currentIndex - 1 + this.tracks.length) % this.tracks.length;
    this.initTrack(newIndex);
    return newIndex;
  }

  public seek(position: number): void {
    if (this.sound) {
      this.sound.seek(position);
      this.updateProgressManually();
    }
  }

  public getCurrentIndex(): number {
    return this.currentIndex;
  }

  public getDuration(): number {
    return this.sound ? this.sound.duration() : 0;
  }

  public getCurrentPosition(): number {
    return this.sound ? this.sound.seek() as number : 0;
  }

  public isPlaying(): boolean {
    return this.sound ? this.sound.playing() : false;
  }

  public destroy(): void {
    if (this.sound) {
      this.sound.stop();
      this.sound.unload();
      this.sound = null;
    }

    this.stopProgressTracking();

    this.onPlayCallback = null;
    this.onPauseCallback = null;
    this.onStopCallback = null;
    this.onEndCallback = null;
    this.onLoadCallback = null;
    this.onSeekCallback = null;
    this.onProgressCallback = null;
    this.onTrackChangeCallback = null;
  }
}

export default AudioManager;
