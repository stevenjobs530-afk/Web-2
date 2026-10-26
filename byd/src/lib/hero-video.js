import { reduced } from './gsap.js';
export function initHeroVideo() {
  const video = document.querySelector('[data-hero-video]');
  let pending = null, seeking = false;
  function applyNext() {
    if (pending === null) { seeking = false; return; }
    const t = pending;
    pending = null;
    if (Math.abs(video.currentTime - t) < .01) { seeking = false; return; }
    seeking = true;
    video.currentTime = t;
  }
  video.addEventListener('seeked', applyNext);
  function scrub(p01) {
    const d = video.duration;
    if (reduced || !Number.isFinite(d) || !d || video.readyState < 1) return;
    if (!video.paused) video.pause();
    const target = Math.min(d - .001, Math.max(0, p01 * d));
    if (!seeking && Math.abs(video.currentTime - target) < .03) return;
    pending = target;
    if (!seeking) applyNext();
  }
  const ready = new Promise((resolve) => {
    let done = false, warming = false;
    const finish = () => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      video.removeEventListener('loadedmetadata', metadata);
      video.removeEventListener('canplay', warm);
      video.removeEventListener('error', finish);
      video.removeEventListener('seeked', warmed);
      resolve();
    };
    const metadata = () => { video.pause(); if (!reduced) video.currentTime = .001; };
    const warmed = () => { video.currentTime = .001; finish(); };
    const warm = () => {
      if (warming || done) return;
      if (reduced) { finish(); return; }
      warming = true;
      video.addEventListener('seeked', warmed, { once:true });
      video.currentTime = Math.min(.12, video.duration * .03);
    };
    const timer = setTimeout(finish, 4000);
    video.addEventListener('loadedmetadata', metadata, { once:true });
    video.addEventListener('canplay', warm);
    video.addEventListener('error', finish, { once:true });
    if (video.readyState >= 1) metadata();
    if (video.readyState >= 3) warm();
    if (video.error) finish();
  });
  return { scrub, ready, video };
}
