export const clamp01 = (v) => Math.min(1, Math.max(0, v));
export function setVar(el, name, v, unit = '') {
  const s = (+v).toFixed(3) + unit;
  el.__vars ??= {};
  if (el.__vars[name] === s) return;
  el.__vars[name] = s;
  el.style.setProperty(name, s);
}
export function setClass(el, cls, on) {
  el.__cls ??= {};
  on = Boolean(on);
  if (el.__cls[cls] === on) return;
  el.__cls[cls] = on;
  el.classList.toggle(cls, on);
}
