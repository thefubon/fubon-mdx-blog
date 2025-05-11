import { create } from "zustand";

interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  cover: string;
  audio: string;
  date?: string;
}

interface MusicPlayerStore {
  currentTrack: Track | null;
  isPlaying: boolean;
  volume: number;
  shuffle: boolean;
  repeat: boolean;
  playlist: Track[];
  setTrack: (track: Track) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setVolume: (volume: number) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  stopPlayback: () => void;
}

export const useMusicPlayerStore = create<MusicPlayerStore>((set, get) => ({
  currentTrack: null,
  isPlaying: false,
  volume: 0.5,
  shuffle: false,
  repeat: false,
  playlist: [
    {
      id: "track-29",
      title: "С выгодой для жизни (RMX)",
      artist: "Fubon",
      date: "20 января 2025 г.",
      audio: "/music/Gazprom-Bonus-Benefit-for-Life.mp3",
      cover: "/playlist/fubon/fubon-gazprombonus.png",
      album: "Сингл",
    },
    {
      id: "track-28",
      title: "Сиреноголовый (Siren Head)",
      artist: "Fubon",
      date: "18 января 2025 г.",
      audio: "/music/fubon-sirenhead.mp3",
      cover: "/cover/Fubon-SirenHead.png",
      album: "Сингл",
    },
    {
      id: "track-27",
      title: "Играем вместе",
      artist: "Fubon",
      date: "14 января 2025 г.",
      audio: "/music/fubon-igraem-vmeste.mp3",
      cover: "/cover/fubon-igraem-vmeste.png",
      album: "Сингл",
    },
    {
      id: "track-26",
      title: "Dance All Night",
      artist: "Hard & Pixel",
      date: "21 мая 2024 г.",
      audio: "/music/harda&pixel-dance-all-night.mp3",
      cover: "/cover/dance-all-night.png",
      album: "Сингл",
    },
    {
      id: "track-25",
      title: "Ambient",
      artist: "TheFubon",
      date: "28 февраля 2023 г.",
      audio: "/music/thefubon-ambient.mp3",
      cover: "/cover/TheFubon-Ambient.webp",
      album: "Сингл",
    },
    {
      id: "track-24",
      title: "Sentimental Moods",
      artist: "TheFubon & Jazz Soul",
      date: "26 декабря 2022 г.",
      audio: "/music/thefubon&jazz-soul-sentimental-moods.mp3",
      cover: "/cover/sentimental-moods.webp",
      album: "Сингл",
    },
    {
      id: "track-23",
      title: "Flying Phoenix",
      artist: "TheFubon",
      date: "25 ноября 2022 г.",
      audio: "/music/thefubon-flying-phoenix.mp3",
      cover: "/cover/flying-pohenix.webp",
      album: "Сингл",
    },
    {
      id: "track-22",
      title: "Time For Freedom",
      artist: "TheFubon",
      date: "25 ноября 2022 г.",
      audio: "/music/thefubon-time-for-freedom.mp3",
      cover: "/cover/time-for-freedom.webp",
      album: "Сингл",
    },
    {
      id: "track-21",
      title: "Fun At Noise",
      artist: "TheFubon",
      date: "11 ноября 2022 г.",
      audio: "/music/thefubon-fun-at-noise.mp3",
      cover: "/cover/fun-at-noise.webp",
      album: "Сингл",
    },
    {
      id: "track-20",
      title: "Soul of Space",
      artist: "TheFubon",
      date: "11 ноября 2022 г.",
      audio: "/music/thefubon-soul-of-space.mp3",
      cover: "/cover/soul-of-space.webp",
      album: "Сингл",
    },
    {
      id: "track-19",
      title: "Quantum",
      artist: "TheFubon",
      date: "24 сентября 2022 г.",
      audio: "/music/thefubon-quantum.mp3",
      cover: "/cover/quantum.webp",
      album: "Сингл",
    },
    {
      id: "track-18",
      title: "Under The Stars",
      artist: "TheFubon",
      date: "24 сентября 2022 г.",
      audio: "/music/thefubon-under-the-stars.mp3",
      cover: "/cover/under-the-stars.webp",
      album: "Сингл",
    },
    {
      id: "track-17",
      title: "Deeper House",
      artist: "TheFubon",
      date: "16 сентября 2022 г.",
      audio: "/music/thefubon-deeper-house.mp3",
      cover: "/cover/deeper-house.webp",
      album: "Сингл",
    },
    {
      id: "track-16",
      title: "Retrospective",
      artist: "TheFubon",
      date: "16 сентября 2022 г.",
      audio: "/music/thefubon-retrospective.mp3",
      cover: "/cover/retrospective.webp",
      album: "Сингл",
    },
    {
      id: "track-15",
      title: "Until",
      artist: "TheFubon",
      date: "16 сентября 2022 г.",
      audio: "/music/thefubon-until.mp3",
      cover: "/cover/until.webp",
      album: "Сингл",
    },
    {
      id: "track-14",
      title: "Your Love",
      artist: "TheFubon",
      date: "11 июля 2022 г.",
      audio: "/music/thefubon-your-love.mp3",
      cover: "/cover/your-love.webp",
      album: "Сингл",
    },
    {
      id: "track-13",
      title: "Where Did You Go",
      artist: "TheFubon",
      date: "8 июля 2022 г.",
      audio: "/music/thefubon-where-did-you-go.mp3",
      cover: "/cover/where-did-you-go.webp",
      album: "Сингл",
    },
    {
      id: "track-12",
      title: "Feelings of Youth",
      artist: "TheFubon",
      date: "13 февраля 2021 г.",
      audio: "/music/thefubon-feelings-of-youth.mp3",
      cover: "/cover/feelings-of-youth.webp",
      album: "Сингл",
    },
    {
      id: "track-11",
      title: "SunSet (Extended)",
      artist: "TheFubon",
      date: "9 февраля 2021 г.",
      audio: "/music/thefubon-sunset-extented-version.mp3",
      cover: "/cover/sunset-extended-version.webp",
      album: "Сингл",
    },
    {
      id: "track-10",
      title: "By My Side",
      artist: "yagelProject",
      date: "5 мая 2020 г.",
      audio: "/music/yagelproject-by-my-side.mp3",
      cover: "/cover/by-my-side.webp",
      album: "Сингл",
    },
    {
      id: "track-9",
      title: "Prey",
      artist: "yagelProject",
      date: "25 сентября 2019 г.",
      audio: "/music/yagelproject-prey.mp3",
      cover: "/cover/prey.webp",
      album: "Сингл",
    },
    {
      id: "track-8",
      title: "SunSet",
      artist: "yagelProject",
      date: "23 августа 2019 г.",
      audio: "/music/yagelproject-sunset.mp3",
      cover: "/cover/sunset.webp",
      album: "Сингл",
    },
    {
      id: "track-7",
      title: "Atmosphere",
      artist: "yagelProject",
      date: "16 августа 2019 г.",
      audio: "/music/yagelproject-atmosphere.mp3",
      cover: "/cover/atmosphere.webp",
      album: "Сингл",
    },
    {
      id: "track-6",
      title: "Big Tree",
      artist: "yagelProject",
      date: "12 августа 2019 г.",
      audio: "/music/yagelproject-big-tree.mp3",
      cover: "/cover/big-tree.webp",
      album: "Сингл",
    },
    {
      id: "track-5",
      title: "Eximinds Trance",
      artist: "yagelProject",
      date: "8 августа 2019 г.",
      audio: "/music/yagelproject-eximinds-trance.mp3",
      cover: "/cover/eximinds-trance.webp",
      album: "Сингл",
    },
    {
      id: "track-4",
      title: "Мама, Я Танцую",
      artist: "#2Маши & yagelProject",
      date: "17 июля 2019 г.",
      audio: "/music/yagelproject-mama-ya-tancuyu.mp3",
      cover: "/cover/mama-ya-tancuyu.webp",
      album: "Сингл",
    },
    {
      id: "track-3",
      title: "Black Beach",
      artist: "yagelProject",
      date: "28 декабря 2017 г.",
      audio: "/music/yagelproject-black-beach.mp3",
      cover: "/cover/black-beach.webp",
      album: "Сингл",
    },
    {
      id: "track-2",
      title: "Тихая правда",
      artist: "Перекати поле",
      date: "20 июля 2015 г.",
      audio: "/music/perekati-pole-tichaya-pravda.mp3",
      cover: "/cover/tichaya-pravda.webp",
      album: "Сингл",
    },
    {
      id: "track-",
      title: "Teachers Preach",
      artist: "yagelProject",
      date: "11 июня 2013 г.",
      audio: "/music/yagelproject-teachers-preach.mp3",
      cover: "/cover/teachers-preach.webp",
      album: "Сингл",
    }
  ],
  setTrack: (track) => set({ currentTrack: track }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setVolume: (volume) => set({ volume }),
  toggleRepeat: () => set((state) => ({ repeat: !state.repeat })),
  toggleShuffle: () => set((state) => ({ shuffle: !state.shuffle })),
  nextTrack: () => {
    const { currentTrack, playlist, shuffle, repeat } = get();
    if (!currentTrack) return;

    const currentIndex = playlist.findIndex((p) => p.id === currentTrack.id);
    let nextIndex;
    if (shuffle) {
      nextIndex = Math.floor(Math.random() * playlist.length);
    } else {
      nextIndex = (currentIndex + 1) % playlist.length;
    }

    if (nextIndex === 0 && !repeat) {
      set({ currentTrack: playlist[0], isPlaying: false });
    } else {
      set({ currentTrack: playlist[nextIndex] });
    }
  },
  prevTrack: () => {
    const { currentTrack, playlist } = get();
    if (!currentTrack) return;

    const currentIndex = playlist.findIndex((p) => p.id === currentTrack.id);

    const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;

    set({ currentTrack: playlist[prevIndex] });
  },
  stopPlayback: () => {
    set({ isPlaying: false });
  },
}));
