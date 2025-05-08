/// <reference types="gsap" />

declare module 'gsap/dist/DrawSVGPlugin' {
  export interface DrawSVGVars {
    drawSVG?: string | number;
  }

  export interface TweenVars {
    drawSVG?: string | number;
  }

  export interface DrawSVGPlugin extends Plugin {
    version: string;
  }

  export const DrawSVGPlugin: DrawSVGPlugin;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export function getLength(element: any): number;
}

declare module 'gsap' {
  interface TweenVars {
    drawSVG?: string | number;
    autoAlpha?: number;
  }
}

// Также добавляем определения для более безопасного импорта из dist
declare module 'gsap/dist/ScrollTrigger' {
  export * from 'gsap/ScrollTrigger';
} 