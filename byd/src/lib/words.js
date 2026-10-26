import { SplitText, reduced } from './gsap.js';
import { setVar, setClass } from './vars.js';
export function initWords() {
  const el = document.querySelector('[data-words]');
  let p = reduced ? 1 : 0, out = 0;
  function apply() {
    setVar(el, '--p', p); setVar(el, '--out', out);
    setClass(el, 'is-words', p > 0 && p < 1);
    setClass(el, 'is-anim', out > 0 && out < 1);
    setClass(el, 'is-hidden', !reduced && (p <= 0 || out >= 1));
  }
  apply();
  document.fonts.ready.then(() => requestAnimationFrame(() => {
    const split = SplitText.create(el, { type:'words', wordsClass:'word', propIndex:true, autoSplit:false });
    setVar(el, '--n', split.words.length);
    apply();
  }));
  return { setP(v) { p = v; apply(); }, setOut(v) { out = v; apply(); } };
}
