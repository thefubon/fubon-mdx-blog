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
    id: 29,
    title: "С выгодой для жизни (RMX)",
    artist: "Fubon",
    date: "20 января 2025 г.",
    src: "/audio/Gazprom-Bonus-Benefit-for-Life.mp3",
    cover: "/cover/Gazprom-Bonus-Benefit-for-Life.png",
    top: true,
    carousel: "/music/carousel/AudioCarousel-1.png"
  },
  {
    id: 28,
    title: "Сиреноголовый (Siren Head)",
    artist: "Fubon",
    date: "18 января 2025 г.",
    src: "/audio/fubon-sirenhead.mp3",
    cover: "/cover/Fubon-SirenHead.png",
    top: true,
    carousel: "/music/carousel/AudioCarousel-2.png"
  },
  {
    id: 27,
    title: "Играем вместе",
    artist: "Fubon",
    date: "14 января 2025 г.",
    src: "/audio/fubon-igraem-vmeste.mp3",
    cover: "/cover/fubon-igraem-vmeste.png",
    top: true,
    carousel: "/music/carousel/AudioCarousel-3.png"
  },
  {
    id: 26,
    title: "Dance All Night",
    artist: "Hard & Pixel",
    date: "21 мая 2024 г.",
    src: "/audio/harda&pixel-dance-all-night.mp3",
    cover: "/cover/dance-all-night.png",
    top: true,
    carousel: "/music/carousel/AudioCarousel-4.png"
  },
  {
    id: 25,
    title: "Ambient",
    artist: "TheFubon",
    date: "28 февраля 2023 г.",
    src: "/audio/thefubon-ambient.mp3",
    cover: "/cover/TheFubon-Ambient.webp",
    top: true,
    carousel: "/music/carousel/AudioCarousel-5.png"
  },
  {
    id: 24,
    title: "Sentimental Moods",
    artist: "TheFubon & Jazz Soul",
    date: "26 декабря 2022 г.",
    src: "/audio/thefubon&jazz-soul-sentimental-moods.mp3",
    cover: "/cover/sentimental-moods.webp"
  },
  {
    id: 23,
    title: "Flying Phoenix",
    artist: "TheFubon",
    date: "25 ноября 2022 г.",
    src: "/audio/thefubon-flying-phoenix.mp3",
    cover: "/cover/flying-pohenix.webp"
  },
  {
    id: 22,
    title: "Time For Freedom",
    artist: "TheFubon",
    date: "25 ноября 2022 г.",
    src: "/audio/thefubon-time-for-freedom.mp3",
    cover: "/cover/time-for-freedom.webp"
  },
  {
    id: 21,
    title: "Fun At Noise",
    artist: "TheFubon",
    date: "11 ноября 2022 г.",
    src: "/audio/thefubon-fun-at-noise.mp3",
    cover: "/cover/fun-at-noise.webp"
  },
  {
    id: 20,
    title: "Soul of Space",
    artist: "TheFubon",
    date: "11 ноября 2022 г.",
    src: "/audio/thefubon-soul-of-space.mp3",
    cover: "/cover/soul-of-space.webp"
  },
  {
    id: 19,
    title: "Quantum",
    artist: "TheFubon",
    date: "24 сентября 2022 г.",
    src: "/audio/thefubon-quantum.mp3",
    cover: "/cover/quantum.webp"
  },
  {
    id: 18,
    title: "Under The Stars",
    artist: "TheFubon",
    date: "24 сентября 2022 г.",
    src: "/audio/thefubon-under-the-stars.mp3",
    cover: "/cover/under-the-stars.webp"
  },
  {
    id: 17,
    title: "Deeper House",
    artist: "TheFubon",
    date: "16 сентября 2022 г.",
    src: "/audio/thefubon-deeper-house.mp3",
    cover: "/cover/deeper-house.webp"
  },
  {
    id: 16,
    title: "Retrospective",
    artist: "TheFubon",
    date: "16 сентября 2022 г.",
    src: "/audio/thefubon-retrospective.mp3",
    cover: "/cover/retrospective.webp"
  },
  {
    id: 15,
    title: "Until",
    artist: "TheFubon",
    date: "16 сентября 2022 г.",
    src: "/audio/thefubon-until.mp3",
    cover: "/cover/until.webp"
  },
  {
    id: 14,
    title: "Your Love",
    artist: "TheFubon",
    date: "11 июля 2022 г.",
    src: "/audio/thefubon-your-love.mp3",
    cover: "/cover/your-love.webp"
  },
  {
    id: 13,
    title: "Where Did You Go",
    artist: "TheFubon",
    date: "8 июля 2022 г.",
    src: "/audio/thefubon-where-did-you-go.mp3",
    cover: "/cover/where-did-you-go.webp"
  },
  {
    id: 12,
    title: "Feelings of Youth",
    artist: "TheFubon",
    date: "13 февраля 2021 г.",
    src: "/audio/thefubon-feelings-of-youth.mp3",
    cover: "/cover/feelings-of-youth.webp"
  },
  {
    id: 11,
    title: "SunSet (Extended)",
    artist: "TheFubon",
    date: "9 февраля 2021 г.",
    src: "/audio/thefubon-sunset-extented-version.mp3",
    cover: "/cover/sunset-extended-version.webp"
  },
  {
    id: 10,
    title: "By My Side",
    artist: "yagelProject",
    date: "5 мая 2020 г.",
    src: "/audio/yagelproject-by-my-side.mp3",
    cover: "/cover/by-my-side.webp"
  },
  {
    id: 9,
    title: "Prey",
    artist: "yagelProject",
    date: "25 сентября 2019 г.",
    src: "/audio/yagelproject-prey.mp3",
    cover: "/cover/prey.webp"
  },
  {
    id: 8,
    title: "SunSet",
    artist: "yagelProject",
    date: "23 августа 2019 г.",
    src: "/audio/yagelproject-sunset.mp3",
    cover: "/cover/sunset.webp"
  },
  {
    id: 7,
    title: "Atmosphere",
    artist: "yagelProject",
    date: "16 августа 2019 г.",
    src: "/audio/yagelproject-atmosphere.mp3",
    cover: "/cover/atmosphere.webp"
  },
  {
    id: 6,
    title: "Big Tree",
    artist: "yagelProject",
    date: "12 августа 2019 г.",
    src: "/audio/yagelproject-big-tree.mp3",
    cover: "/cover/big-tree.webp"
  },
  {
    id: 5,
    title: "Eximinds Trance",
    artist: "yagelProject",
    date: "8 августа 2019 г.",
    src: "/audio/yagelproject-eximinds-trance.mp3",
    cover: "/cover/eximinds-trance.webp"
  },
  {
    id: 4,
    title: "Мама, Я Танцую",
    artist: "#2Маши & yagelProject",
    date: "17 июля 2019 г.",
    src: "/audio/yagelproject-mama-ya-tancuyu.mp3",
    cover: "/cover/mama-ya-tancuyu.webp"
  },
  {
    id: 3,
    title: "Black Beach",
    artist: "yagelProject",
    date: "28 декабря 2017 г.",
    src: "/audio/yagelproject-black-beach.mp3",
    cover: "/cover/black-beach.webp"
  },
  {
    id: 2,
    title: "Тихая правда",
    artist: "Перекати поле",
    date: "20 июля 2015 г.",
    src: "/audio/perekati-pole-tichaya-pravda.mp3",
    cover: "/cover/tichaya-pravda.webp"
  },
  {
    id: 1,
    title: "Teachers Preach",
    artist: "yagelProject",
    date: "11 июня 2013 г.",
    src: "/audio/yagelproject-teachers-preach.mp3",
    cover: "/cover/teachers-preach.webp"
  }
];
