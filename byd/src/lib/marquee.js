export function initMarquee() {
  const marquees = [...document.querySelectorAll('[data-marquee]')];
  marquees.forEach((el) => {
    const track = el.querySelector('.marquee__track');
    [...track.children].forEach((child) => { const clone = child.cloneNode(true); clone.setAttribute('aria-hidden', 'true'); track.append(clone); });
  });
  const measure = () => marquees.forEach((el) => el.style.setProperty('--marquee-dur', (el.querySelector('.marquee__track').scrollWidth / 2 / 40).toFixed(2) + 's'));
  measure();
  document.fonts.ready.then(measure);
  let timer;
  window.addEventListener('resize', () => { clearTimeout(timer); timer = setTimeout(measure, 150); });
}
