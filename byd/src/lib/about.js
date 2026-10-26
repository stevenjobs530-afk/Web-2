import { ScrollTrigger, reduced } from './gsap.js';
import { setVar, setClass } from './vars.js';
export function initAbout({ beats }) {
  const about = document.querySelector('[data-about]');
  const els = [...about.querySelectorAll('[data-about-in]')];
  const statement = about.querySelector('.about__statement');
  if (reduced) { els.forEach((el) => setVar(el, '--in', 1)); return; }
  const yAe = () => about.offsetTop + about.offsetHeight - innerHeight;
  ScrollTrigger.create({ start:() => about.offsetTop - (1 - beats().aboutIn[0]) * innerHeight, end:() => about.offsetTop,
    onUpdate:({ progress }) => els.forEach((el) => setVar(el, '--in', progress)) });
  ScrollTrigger.create({ start:() => yAe() - .5 * innerHeight, end:() => yAe() - .1 * innerHeight,
    onUpdate:({ progress }) => { els.forEach((el) => setVar(el, '--out', progress)); setClass(statement, 'is-anim', progress > 0 && progress < 1); } });
}
