// src/data/player.ts

export interface Track {
  id: number;
  title: string;
  artist: string;
  date?: string;
  src: string;
  cover?: string;
  top?: boolean;
  carousel?: string;
}

export const tracks: Track[] = [
  {
    id: 1,
    title: "С выгодой для жизни (RMX)",
    artist: "Fubon",
    date: "20 января 2025 г.",
    src: "/audio/Gazprom-Bonus-Benefit-for-Life.mp3",
    cover: "/cover/Gazprom-Bonus-Benefit-for-Life.png",
    top: true,
    carousel: "/music/carousel/AudioCarousel-1.png"
  },
  {
    id: 2,
    title: "Сиреноголовый (Siren Head)",
    artist: "Fubon",
    date: "18 января 2025 г.",
    src: "/audio/fubon-sirenhead.mp3",
    cover: "/cover/Fubon-SirenHead.png",
    top: true,
    carousel: "/music/carousel/AudioCarousel-2.png"
  },
  {
    id: 3,
    title: "Играем вместе",
    artist: "Fubon",
    date: "14 января 2025 г.",
    src: "/audio/fubon-igraem-vmeste.mp3",
    cover: "/cover/fubon-igraem-vmeste.png",
    top: true,
    carousel: "/music/carousel/AudioCarousel-3.png"
  },
  {
    id: 4,
    title: "Dance All Night",
    artist: "Hard & Pixel",
    date: "21 мая 2024 г.",
    src: "/audio/harda&pixel-dance-all-night.mp3",
    cover: "/cover/dance-all-night.png",
    top: true,
    carousel: "/music/carousel/AudioCarousel-4.png"
  },
  {
    id: 5,
    title: "Ambient",
    artist: "TheFubon",
    date: "28 февраля 2023 г.",
    src: "/audio/thefubon-ambient.mp3",
    cover: "/cover/TheFubon-Ambient.webp",
    top: true,
    carousel: "/music/carousel/AudioCarousel-5.png"
  },
  {
    id: 6,
    title: "Sentimental Moods",
    artist: "TheFubon & Jazz Soul",
    date: "26 декабря 2022 г.",
    src: "/audio/thefubon&jazz-soul-sentimental-moods.mp3",
    cover: "/cover/sentimental-moods.webp"
  }
];
