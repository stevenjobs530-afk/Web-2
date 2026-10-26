import LocomotiveScroll from 'locomotive-scroll';
import { gsap, ScrollTrigger } from './gsap.js';
let instance;
export const getScroll = () => instance;
export function initScroll() {
  history.scrollRestoration = 'manual';
  window.scrollTo(0, 0);
  instance = new LocomotiveScroll({
    lenisOptions:{ lerp:0.07, wheelMultiplier:0.85, touchMultiplier:1.3, syncTouch:false },
    initCustomTicker:(r) => gsap.ticker.add(r),
    destroyCustomTicker:(r) => gsap.ticker.remove(r),
  });
  instance.lenisInstance.on('scroll', ScrollTrigger.update);
  gsap.ticker.lagSmoothing(0);
  function target(hash) {
    try { return hash.length > 1 && document.getElementById(decodeURIComponent(hash.slice(1))); }
    catch { return null; }
  }
  document.addEventListener('click', (event) => {
    const a = event.target.closest('a[href*="#"]');
    if (!a || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey || a.target === '_blank') return;
    const url = new URL(a.href);
    if (url.origin !== location.origin || url.pathname !== location.pathname || url.search !== location.search || !target(url.hash)) return;
    event.preventDefault();
    instance.scrollTo(url.hash, { duration:2 });
  });
  if (target(location.hash)) requestAnimationFrame(() => instance.scrollTo(location.hash, { duration:2 }));
  return instance;
}
