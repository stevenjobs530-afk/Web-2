import { gsap, reduced } from './gsap.js';
export function initHeader() {
  return { playIntro() {
    if (reduced) return;
    gsap.fromTo('[data-header-item]', { y:'1em', autoAlpha:0 }, {
      y:0, autoAlpha:1, duration:.6, ease:'magic', stagger:.08, clearProps:'transform,opacity,visibility',
    });
  } };
}
