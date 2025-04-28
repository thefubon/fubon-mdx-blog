"use client";

import { useEffect, useRef } from "react";
import { Howl } from "howler";
import { Button } from "./ui/button";

const FADE_DURATION = 1000;
const VOLUME = 1;

export default function Player() {
  // Используем refs для хранения состояний
  const soundRef = useRef<Howl | null>(null);
  const isWaveActiveRef = useRef<boolean>(false);
  const animationFrameIdRef = useRef<number | null>(null);
  const wavePhaseRef = useRef<number>(0);
  const currentAmplitudeRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const wavePathRef = useRef<SVGPathElement | null>(null);

  const waveAmplitude = 16;
  const waveFrequency = 0.08;

  function createWave(timestamp: number) {
    if (!wavePathRef.current) return;

    const deltaTime = timestamp - (lastTimeRef.current || timestamp);
    lastTimeRef.current = timestamp;

    const safeDeltaTime = Math.min(deltaTime, 32);

    const points = [];
    for (let x = 0; x <= 100; x += 5) {
      const y =
        10 +
        currentAmplitudeRef.current *
          Math.sin(waveFrequency * x + wavePhaseRef.current);
      points.push(`${x} ${y}`);
    }

    wavePathRef.current.setAttribute("d", `M${points.join(" L")}`);

    wavePhaseRef.current += (safeDeltaTime / 16) * 0.08;

    if (
      isWaveActiveRef.current &&
      currentAmplitudeRef.current < waveAmplitude
    ) {
      currentAmplitudeRef.current += 0.1 * (safeDeltaTime / 16);
    } else if (!isWaveActiveRef.current && currentAmplitudeRef.current > 0) {
      currentAmplitudeRef.current -= 0.1 * (safeDeltaTime / 16);
    }

    currentAmplitudeRef.current = Math.min(
      currentAmplitudeRef.current,
      waveAmplitude,
    );

    if (isWaveActiveRef.current || currentAmplitudeRef.current > 0) {
      animationFrameIdRef.current = requestAnimationFrame(createWave);
    } else {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
        animationFrameIdRef.current = null;
      }
      wavePathRef.current.setAttribute("d", "M0 10 L100 10");
    }
  }

  function handleClick() {
    const sound = soundRef.current;
    if (!sound) return;

    if (sound.playing()) {
      isWaveActiveRef.current = false;
      sound.fade(sound.volume(), 0, FADE_DURATION);
      setTimeout(() => {
        sound.pause();
      }, FADE_DURATION);
    } else {
      isWaveActiveRef.current = true;
      sound.play();
      sound.fade(0, VOLUME, FADE_DURATION);

      if (!animationFrameIdRef.current) {
        createWave(performance.now());
      }
    }
  }

  useEffect(() => {
    // Инициализация звука
    soundRef.current = new Howl({
      src: ["/sound/generic.webm", "/sound/generic.ogg", "/sound/generic.mp3"],
      loop: true,
      volume: 0,
    });

    // Получаем ссылку на SVG path
    wavePathRef.current = document.getElementById(
      "wavePath",
    ) as unknown as SVGPathElement;

    return () => {
      // Очистка при размонтировании
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }

      if (soundRef.current) {
        soundRef.current.unload();
      }
    };
  }, []);

  return (
    <Button
      className="animation-trigger relative size-12 cursor-pointer rounded-full"
      aria-label="Кнопка управления музыкой"
      onClick={handleClick}
      size="icon"
    >
      <svg
        viewBox="-10 -10 120 30"
        preserveAspectRatio="xMidYMid meet"
        className="!h-4 !w-7"
      >
        <path
          id="wavePath"
          className="fill-none"
          d="M0 10 L100 10"
          stroke="currentColor"
          strokeWidth="12"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="currentColor"
        ></path>
      </svg>
    </Button>
  );
}
