import { gsap, ScrollTrigger, reduced } from './gsap.js';
import { setVar, setClass } from './vars.js';
export function initHero({ header, beats, ready }) {
  const hero = document.querySelector('[data-hero]');
  const headerEl = document.querySelector('[data-header]');
  const title = hero.querySelector('[data-hero-title]');
  const ui = [...hero.querySelectorAll('[data-hero-ui]')];
  const all = [title, ...ui];
  let introRunning = true, started = false, timeline, titleOut = 0;
  function align() {
    const r = headerEl.querySelector('.header__ghost').getBoundingClientRect();
    if (r.width > 0) hero.style.setProperty('--title-left', Math.round(r.left) + 'px');
    else hero.style.removeProperty('--title-left');
  }
  align();
  document.fonts.ready.then(align);
  ScrollTrigger.addEventListener('refreshInit', align);
  const show = () => gsap.set([headerEl, hero], { visibility:'visible' });
  function exits() {
    ScrollTrigger.create({ trigger:hero, start:'top top', end:() => '+=' + beats().heroOutTitle * innerHeight,
      onUpdate:({ progress }) => { titleOut = progress; setVar(title, '--out', progress); setClass(title, 'is-anim', introRunning || (progress > 0 && progress < 1)); } });
    ScrollTrigger.create({ trigger:hero, start:'top top', end:() => '+=' + beats().heroOutUi * innerHeight,
      onUpdate:({ progress }) => ui.forEach((el) => setVar(el, '--out', progress)) });
  }
  function start() {
    if (started) return;
    started = true;
    if (reduced) { all.forEach((el) => setVar(el, '--in', 1)); introRunning = false; show(); return; }
    all.forEach((el) => { setVar(el, '--in', 0); setClass(el, 'is-anim', true); });
    header.playIntro();
    timeline = gsap.timeline({ onComplete:() => {
      introRunning = false;
      setClass(title, 'is-anim', titleOut > 0 && titleOut < 1);
      ui.forEach((el) => setClass(el, 'is-anim', false));
    } });
    function enter(el, at, duration, ease) {
      const p = { v:0 };
      timeline.to(p, { v:1, duration, ease, onUpdate:() => setVar(el, '--in', p.v) }, at);
    }
    enter(title, .15, 1.4, 'outExpo');
    ui.forEach((el, i) => enter(el, .45 + i * .09, .9, 'expoOut'));
    show();
    exits();
  }
  Promise.all([document.fonts.ready, ready]).then(() => requestAnimationFrame(start));
  function failsafe() {
    if (document.hidden) { setTimeout(failsafe, 4000); return; }
    if (started) return;
    started = true;
    if (!reduced) exits();
    introRunning = false;
    all.forEach((el) => { setVar(el, '--in', 1); setClass(el, 'is-anim', el === title && titleOut > 0 && titleOut < 1); });
    show();
  }
  setTimeout(failsafe, 4000);
}
