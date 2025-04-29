// src/utils/audioManager.ts
import { Howl } from 'howler';
import { Track } from '@/data/player';

type AudioCallback = () => void;

class AudioManager {
  private static instance: AudioManager;
  private sound: Howl | null = null;
  private tracks: Track[] = [];
  private currentIndex: number = 0;

  // Колбэки для связи с компонентом
  private onPlayCallback: AudioCallback | null = null;
  private onPauseCallback: AudioCallback | null = null;
  private onStopCallback: AudioCallback | null = null;
  private onEndCallback: AudioCallback | null = null;
  private onLoadCallback: AudioCallback | null = null;
  private onSeekCallback: AudioCallback | null = null;
  private onProgressCallback: ((position: number, duration: number) => void) | null = null;
  private onTrackChangeCallback: ((index: number) => void) | null = null;

  private constructor() {
    // Приватный конструктор для Singleton
  }

  // Получение инстанса AudioManager (Singleton)
  public static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  // Установка треков
  public setTracks(tracks: Track[]): void {
    this.tracks = tracks;
  }

  // Инициализация трека
  public initTrack(index: number): void {
    if (index < 0 || index >= this.tracks.length) return;

    // Запоминаем, что происходит смена трека
    const isTrackChange = this.currentIndex !== index;

    // Очистка предыдущего трека
    if (this.sound) {
      this.sound.stop();
      this.sound.unload();
      this.sound = null;
    }

    this.currentIndex = index;
    const track = this.tracks[index];

    console.log(`[AudioManager] Initializing track: ${track.title}`);

    // Если изменился трек, вызываем колбэк
    if (isTrackChange && this.onTrackChangeCallback) {
      this.onTrackChangeCallback(index);
    }

    this.sound = new Howl({
      src: [track.src],
      html5: true,
      onload: () => {
        console.log(`[AudioManager] Track loaded: ${track.title}`);
        if (this.onLoadCallback) this.onLoadCallback();
      },
      onplay: () => {
        console.log(`[AudioManager] Playing: ${track.title}`);
        if (this.onPlayCallback) this.onPlayCallback();
        this.startProgressTracking();
      },
      onpause: () => {
        console.log(`[AudioManager] Paused: ${track.title}`);
        if (this.onPauseCallback) this.onPauseCallback();
        this.stopProgressTracking();
      },
      onstop: () => {
        console.log(`[AudioManager] Stopped: ${track.title}`);
        if (this.onStopCallback) this.onStopCallback();
        this.stopProgressTracking();
      },
      onend: () => {
        console.log(`[AudioManager] Ended: ${track.title}`);
        if (this.onEndCallback) this.onEndCallback();
      },
      onseek: () => {
        console.log(`[AudioManager] Seek performed`);
        if (this.onSeekCallback) this.onSeekCallback();
      }
    });
  }

  // Установка колбэков
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

  // Отслеживание прогресса с использованием requestAnimationFrame
  private progressAnimationId: number | null = null;

  private startProgressTracking(): void {
    this.stopProgressTracking();

    const updateProgress = () => {
      if (!this.sound) {
        this.stopProgressTracking();
        return;
      }

      try {
        // Получаем текущую позицию и продолжительность
        // Важно: принудительно приводим seek к числу!
        const position = typeof this.sound.seek() === 'number'
          ? this.sound.seek()
          : 0;

        const duration = this.sound.duration() || 0;

        // Проверяем, что значения корректные перед отправкой
        if (position >= 0 && duration > 0 && this.onProgressCallback) {
          console.log(`[AudioManager] Progress update: ${position.toFixed(2)}/${duration.toFixed(2)} (${((position / duration) * 100).toFixed(1)}%)`);
          this.onProgressCallback(position, duration);
        }
      } catch (error) {
        console.error('[AudioManager] Error in progress tracking:', error);
      }

      // Продолжаем анимацию только если объект звука существует
      // Важно: используем requestAnimationFrame для плавной анимации
      if (this.sound) {
        this.progressAnimationId = requestAnimationFrame(updateProgress);
      }
    };

    // Запускаем отслеживание
    this.progressAnimationId = requestAnimationFrame(updateProgress);
  }

  private stopProgressTracking(): void {
    if (this.progressAnimationId !== null) {
      cancelAnimationFrame(this.progressAnimationId);
      this.progressAnimationId = null;
    }
  }

  // Добавим метод для вызова обновления прогресса вручную
  public updateProgressManually(): void {
    if (!this.sound) return;

    try {
      const position = typeof this.sound.seek() === 'number'
        ? this.sound.seek()
        : 0;
      const duration = this.sound.duration() || 0;

      if (position >= 0 && duration > 0 && this.onProgressCallback) {
        console.log(`[AudioManager] Manual update: ${position.toFixed(2)}/${duration.toFixed(2)}`);
        this.onProgressCallback(position, duration);
      }
    } catch (error) {
      console.error('[AudioManager] Error in manual progress update:', error);
    }
  }

  // Управление воспроизведением
  public play(): void {
    if (this.sound) {
      this.sound.play();
      // Принудительно запускаем отслеживание прогресса
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

  // Навигация по трекам
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

  // Перемотка
  public seek(position: number): void {
    if (this.sound) {
      this.sound.seek(position);
      // После изменения позиции сразу вызываем обновление
      this.updateProgressManually();
    }
  }

  // Получение информации
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

  // Очистка инстанса AudioManager
  public destroy(): void {
    if (this.sound) {
      this.sound.stop();
      this.sound.unload();
      this.sound = null;
    }

    this.stopProgressTracking();

    // Очистка колбэков
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
