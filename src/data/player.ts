// src/data/player.ts

export interface Track {
  id: number;
  title: string;
  artist: string;
  src: string;
  cover?: string;
}

export const tracks: Track[] = [
  {
    id: 1,
    title: "Песня 1",
    artist: "Артист 1",
    src: "/audio/one-love.mp3",
    cover: "/splash-n.jpg",
  },
  {
    id: 2,
    title: "Песня 2",
    artist: "Артист 2",
    src: "/audio/thefubon-deeper-house.mp3",
    cover: "/splash-n.jpg",
  },
];
