import { gsap, ScrollTrigger, reduced } from './gsap.js';
export function initSlider({ media, onChange, onReset }) {
  const state = { idx:0, cur:0 };
  let tween;
  function go(idx) {
    if (idx === state.idx) return;
    state.idx = idx;
    onChange(idx);
    if (reduced) { state.cur = idx; media.setCur(idx); }
    else tween = gsap.to(state, { cur:idx, duration:1.6, ease:'magic', overwrite:true, onUpdate:() => media.setCur(state.cur) });
  }
  function step(dir) {
    if (media.state.zoom < .99) return;
    go(Math.min(media.N - 1, Math.max(0, state.idx + dir)));
  }
  document.querySelector('[data-prev]').addEventListener('click', () => step(-1));
  document.querySelector('[data-next]').addEventListener('click', () => step(1));
  window.addEventListener('keydown', (event) => {
    if (event.altKey || event.metaKey || event.ctrlKey || media.state.zoom < .99) return;
    if (event.key === 'ArrowRight') { event.preventDefault(); step(1); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); step(-1); }
  });
  ScrollTrigger.create({ start:() => media.facts().yC + innerHeight, end:() => media.facts().yC + innerHeight + 1, invalidateOnRefresh:true,
    onLeaveBack:() => { tween?.kill(); state.idx = state.cur = 0; media.setCur(0); onReset(); } });
  return { state, go, step };
}
