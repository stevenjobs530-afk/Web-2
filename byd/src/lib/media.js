import { gsap, ScrollTrigger, reduced } from './gsap.js';
import { N } from './beats.js';
import { clamp01, setVar, setClass } from './vars.js';
export function initMedia({ heroVideo, beats, onPol }) {
  const stage = document.querySelector('[data-stage]');
  const about = document.querySelector('[data-about]');
  const catalog = document.querySelector('[data-catalog]');
  const media = document.querySelector('[data-media]');
  const row = document.querySelector('[data-row]');
  const cars = [...row.querySelectorAll('[data-car]')];
  const slot = document.querySelector('[data-media-slot]');
  const state = { cur:0, wind:0, zoom:0, rin:0 };
  let tl;
  const easeIO = gsap.parseEase('power2.inOut');
  function facts() {
    const H = innerHeight, yA = about.offsetTop, yC = catalog.offsetTop;
    return { H, yA, yAe:yA + about.offsetHeight - H, yC, yCe:yC + catalog.offsetHeight - H };
  }
  function measure() {
    const W = innerWidth, H = innerHeight;
    const r = slot.getBoundingClientRect(), p = slot.parentElement.getBoundingClientRect();
    const R1 = { x:r.left, y:r.top - p.top, w:r.width, h:r.height };
    const s0 = Math.max(1, H / (.5625 * W));
    const s1 = Math.max(R1.w / W, R1.h / (.5625 * W));
    const pw = W * s1, ph = .5625 * W * s1;
    setVar(media, '--s0', s0); setVar(media, '--x0', 0, 'px'); setVar(media, '--y0', 0, 'px');
    setVar(media, '--s1', s1);
    setVar(media, '--x1', R1.x + R1.w / 2 - W / 2, 'px');
    setVar(media, '--y1', R1.y + R1.h / 2 - H / 2, 'px');
    setVar(media, '--cx1', (pw - R1.w) / 2 / pw * 100, '%');
    setVar(media, '--cy1', (ph - R1.h) / 2 / ph * 100, '%');
  }
  function setCur(cur) {
    state.cur = cur;
    const eff = cur * state.wind;
    cars.forEach((car, i) => {
      let d = i - eff;
      d -= N * Math.round(d / N);
      const ad = Math.abs(d), vis = 1 - state.zoom * clamp01((ad - .5) / .4);
      setVar(car, '--d', d); setVar(car, '--dir', ad < .001 ? 0 : Math.sign(d)); setVar(car, '--vis', vis);
      setClass(car, 'is-anim', vis > 0 && vis < 1);
      car.style.zIndex = 10 - Math.round(ad);
      setClass(car, 'is-hidden', vis <= 0 || (i !== 0 && state.rin <= 0));
    });
  }
  function build() {
    tl?.scrollTrigger?.kill(); tl?.kill();
    measure();
    const { H, yAe, yC, yCe } = facts(), b = beats();
    if (reduced) {
      state.rin = state.wind = state.zoom = 1;
      for (const name of ['--g1', '--g2', '--dis']) setVar(media, name, 1);
      for (const name of ['--rin', '--par', '--zoom']) setVar(row, name, 1);
      onPol(1); setCur(state.cur); return;
    }
    state.rin = state.wind = state.zoom = 0;
    for (const name of ['--g1', '--g2', '--dis']) setVar(media, name, 0);
    for (const name of ['--rin', '--par', '--zoom']) setVar(row, name, 0);
    setClass(media, 'is-dissolving', false); setClass(row, 'is-anim', false);
    onPol(0); setCur(state.cur);
    tl = gsap.timeline({ defaults:{ ease:'none' }, scrollTrigger:{ trigger:stage, start:'top top', end:() => facts().yCe, scrub:true, invalidateOnRefresh:true } });
    function leg(pos, duration, apply) {
      const proxy = { v:0 };
      tl.to(proxy, { v:1, duration, onUpdate:() => apply(proxy.v) }, pos);
    }
    leg(0, b.videoEnd * H, heroVideo.scrub);
    leg(0, b.g1 * H, (v) => setVar(media, '--g1', easeIO(v)));
    leg(b.pol[0] * H, (b.pol[1] - b.pol[0]) * H, onPol);
    leg(yAe - .1 * H, .5 * H, (v) => setVar(media, '--g2', easeIO(v)));
    leg(yAe + .4 * H, .4 * H, (v) => { setVar(media, '--dis', v); setClass(media, 'is-dissolving', v > 0 && v < 1); });
    leg(yAe + .5 * H, .5 * H, (v) => { state.rin = v; setVar(row, '--rin', v); setClass(row, 'is-anim', v > 0 && v < 1); setCur(state.cur); });
    leg(yC, 1.4 * H, (v) => setVar(row, '--par', v));
    leg(yC + 1.0 * H, 1.0 * H, (v) => { state.wind = easeIO(v); setCur(state.cur); });
    leg(yC + 1.2 * H, .8 * H, (v) => { state.zoom = easeIO(v); setVar(row, '--zoom', state.zoom); setCur(state.cur); });
    tl.to({}, { duration:.001 }, yCe);
  }
  ScrollTrigger.addEventListener('refreshInit', build);
  setCur(0); build();
  return { state, media, cars, N, setCur, facts };
}
