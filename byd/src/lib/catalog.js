import { gsap, ScrollTrigger, reduced } from './gsap.js';
export function initCatalog({ words }) {
  const catalog = document.querySelector('[data-catalog]');
  const cars = JSON.parse(document.querySelector('#cars').textContent);
  const fields = Object.fromEntries(['name','desc','price','loc','extra','link'].map((key) => [key, catalog.querySelector(`[data-w-${key}]`)]));
  const texts = ['name','desc','price','loc','extra'].map((key) => fields[key]);
  const targets = [...catalog.querySelectorAll('.widget'), catalog.querySelector('[data-credits]')];
  let pending = 0, swapTween;
  function fill(i) {
    const car = cars[i];
    fields.name.textContent = car.name;
    fields.desc.textContent = car.desc;
    fields.price.textContent = car.price;
    fields.loc.textContent = car.powertrain;
    const n = car.trims.length - 1;
    fields.extra.textContent = (fields.extra.dataset.tpl || '+{n} trims').replace('{n}', n);
    fields.extra.hidden = n === 0;
    fields.link.href = car.bydUrl;
  }
  function swap(i) {
    if (i === pending) return;
    pending = i;
    swapTween?.kill();
    if (reduced) { fill(i); return; }
    swapTween = gsap.timeline({ defaults:{ ease:'magic', overwrite:true } })
      .to(texts, { autoAlpha:0, y:'-.4em', duration:.25, stagger:.03 })
      .call(() => fill(i))
      .fromTo(texts, { autoAlpha:0, y:'.4em' }, { autoAlpha:1, y:0, duration:.4, stagger:.04, clearProps:'transform,opacity,visibility' });
  }
  function reset(i = 0) {
    swapTween?.kill();
    gsap.set(texts, { clearProps:'transform,opacity,visibility' });
    fill(i); pending = i;
  }
  fill(0);
  if (reduced) {
    words.setP(1);
    gsap.set(targets, { autoAlpha:1 });
  } else {
    ScrollTrigger.create({ start:() => catalog.offsetTop, end:() => catalog.offsetTop + innerHeight, onUpdate:({ progress }) => words.setP(progress) });
    ScrollTrigger.create({ start:() => catalog.offsetTop + innerHeight, end:() => catalog.offsetTop + 1.4 * innerHeight, onUpdate:({ progress }) => words.setOut(progress) });
    const entrance = gsap.timeline({ paused:true }).fromTo(targets, { y:56, autoAlpha:0, scale:.96, transformOrigin:'50% 100%' }, { y:0, autoAlpha:1, scale:1, duration:.85, ease:'outExpo', stagger:.07 });
    ScrollTrigger.create({ start:() => catalog.offsetTop + 1.85 * innerHeight, end:() => catalog.offsetTop + 1.85 * innerHeight + 1, onEnter:() => entrance.play(), onLeaveBack:() => entrance.reverse() });
  }
  return { fill, swap, reset };
}
