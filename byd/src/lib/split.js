import { SplitText, ScrollTrigger } from './gsap.js';
// Chinese copy marks its phrase breaks with zero-width spaces instead of spaces.
const delim = document.documentElement.lang.startsWith('zh') ? '\u200b' : ' ';
export function initSplit() {
  let queued = false;
  const refresh = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => { queued = false; ScrollTrigger.refresh(); });
  };
  document.fonts.ready.then(() => requestAnimationFrame(() => {
    document.querySelectorAll('[data-split]').forEach((el) => new SplitText(el, {
      tag:'span', type:'lines', mask:'lines', linesClass:'line', wordsClass:'word', charsClass:'char', propIndex:true, autoSplit:true, onSplit:refresh, wordDelimiter:delim,
    }));
  }));
}
