'use client'

import { Track } from '@/data/player'
import Image from 'next/image'
import { Pause, Play } from 'lucide-react'
import { useAudioPlayer } from '@/contexts/AudioPlayerProvider'

interface AudioPlayerPlaylistProps {
  tracks: Track[]
}

export default function AudioPlayerPlaylist({
  tracks,
}: AudioPlayerPlaylistProps) {
  const { currentTrackIndex, isPlaying, progress, togglePlayPause } =
    useAudioPlayer()

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-3">Список треков</h3>
      <div className="space-y-2">
        {tracks.map((track, index) => (
          <div
            key={track.id}
            className={`p-3 rounded-lg flex items-center gap-3 relative ${
              currentTrackIndex === index
                ? 'border bg-background dark:bg-zinc-600'
                : 'border dark:bg-zinc-600/50 dark:hover:bg-zinc-600'
            } cursor-pointer overflow-hidden`}
            onClick={() => togglePlayPause(index)}>
            <div className="w-6 flex justify-center items-center">
              {track.id}
            </div>

            {track.cover ? (
              <Image
                src={track.cover}
                alt={`Миниатюра ${track.title}`}
                className="w-12 h-12 rounded object-cover"
                width={48}
                height={48}
              />
            ) : (
              <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-foreground">
                <span>🎵</span>
              </div>
            )}

            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{track.title}</p>
              <p className="text-xs text-foreground/50 truncate">
                {track.date}
              </p>
              <p className="text-sm truncate">{track.artist}</p>
            </div>

            <div className="w-8 flex justify-center">
              {currentTrackIndex === index && isPlaying ? (
                <span className="text-blue-600 animate-pulse">
                  <Play />
                </span>
              ) : currentTrackIndex === index ? (
                <span className="text-gray-400">
                  <Pause />
                </span>
              ) : (
                <span className="text-gray-400">
                  <Play />
                </span>
              )}
            </div>

            {currentTrackIndex === index && (
              <div
                className="absolute bottom-0 left-0 h-1 bg-blue-600 transition-all"
                style={{ width: `${progress}%` }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
