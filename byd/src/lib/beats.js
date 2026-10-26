import { isMobile } from './gsap.js';
export const N = 5;
const DESKTOP = { hold:60, aboutExit:50, catRun:220, tail:0, videoEnd:1.6, heroOutTitle:.25, heroOutUi:.18, g1:.7, pol:[.12,.22], aboutIn:[.35,1] };
const MOBILE = { ...DESKTOP, hold:40, aboutExit:40, videoEnd:1.4 };
export const beats = () => isMobile() ? MOBILE : DESKTOP;
export function applyBeats() {
  const { hold, aboutExit, catRun, tail } = beats();
  const style = document.documentElement.style;
  style.setProperty('--hold', hold + 'svh');
  style.setProperty('--about-exit', aboutExit + 'svh');
  style.setProperty('--cat-run', `calc(${catRun}svh + 0svh + ${tail}svh)`);
}
