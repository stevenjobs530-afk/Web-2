import { SplitText, reduced } from './gsap.js';
import { setVar, setClass } from './vars.js';
// Chinese copy marks its phrase breaks with zero-width spaces instead of spaces.
const delim = document.documentElement.lang.startsWith('zh') ? '\u200b' : ' ';
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
    const split = SplitText.create(el, { type:'words', wordsClass:'word', propIndex:true, autoSplit:false, wordDelimiter:delim });
    setVar(el, '--n', split.words.length);
    apply();
  }));
  return { setP(v) { p = v; apply(); }, setOut(v) { out = v; apply(); } };
}
