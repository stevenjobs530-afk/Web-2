(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const zh = document.documentElement.lang.startsWith('zh');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Mobile menu
  const menuBtn = $('.menu-btn');
  const nav = $('#site-nav');
  if (menuBtn && nav) {
    menuBtn.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', String(open));
      menuBtn.setAttribute('aria-label', zh ? (open ? '关闭菜单' : '打开菜单') : (open ? 'Close menu' : 'Open menu'));
      document.body.classList.toggle('menu-open', open);
    });
  }

  // Home carousel
  const carousel = $('.carousel');
  if (carousel) {
    const slides = $$('.slide', carousel);
    const dots = $$('.dot', carousel);
    const caption = $('[data-caption]', carousel);
    const playBtn = $('.play', carousel);
    let idx = 0;
    let playing = !reduceMotion;
    const show = (n) => {
      idx = (n + slides.length) % slides.length;
      slides.forEach((s, i) => s.classList.toggle('is-active', i === idx));
      dots.forEach((d, i) => d.setAttribute('aria-pressed', String(i === idx)));
      caption.innerHTML = slides[idx].dataset.caption;
    };
    const setPlaying = (p) => {
      playing = p;
      playBtn.textContent = zh ? (p ? '暂停' : '播放') : (p ? 'PAUSE' : 'PLAY');
    };
    dots.forEach((d, i) => d.addEventListener('click', () => { show(i); setPlaying(false); }));
    playBtn.addEventListener('click', () => setPlaying(!playing));
    setPlaying(playing);
    setInterval(() => { if (playing && !document.hidden) show(idx + 1); }, 6500);
  }

  // Works filter
  const filters = $('.filters');
  if (filters) {
    const cards = $$('[data-series]');
    const apply = (f) => {
      $$('.chip', filters).forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.filter === f)));
      cards.forEach((c) => { c.hidden = f !== 'all' && c.dataset.series !== f; });
    };
    filters.addEventListener('click', (e) => {
      const chip = e.target.closest('.chip');
      if (!chip) return;
      apply(chip.dataset.filter);
      history.replaceState(null, '', chip.dataset.filter === 'all' ? location.pathname : '#' + chip.dataset.filter);
    });
    const initial = location.hash.slice(1);
    if (initial && $(`.chip[data-filter="${initial}"]`, filters)) apply(initial);
  }

  // Work viewer
  const viewer = $('.viewer');
  if (viewer) {
    const chips = $$('.views .chip');
    chips.forEach((chip) => chip.addEventListener('click', () => {
      chips.forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
      $$('.view', viewer).forEach((v) => v.classList.toggle('is-active', v.dataset.view === chip.dataset.view));
    }));
  }

  // Forms: post to the endpoint if one is set, otherwise open an email draft.
  const toMail = (form, fields) => {
    const to = form.dataset.mailto;
    const subject = form.dataset.subject || (zh ? '咨询' : 'Enquiry');
    const body = fields.map(([k, v]) => `${k}: ${v}`).join('\n');
    location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };
  $$('form[data-form]').forEach((form) => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      const data = new FormData(form);
      const fields = [...data.entries()].filter(([k]) => k !== 'consent');
      const done = $(form.dataset.done);
      try {
        if (form.action && form.getAttribute('action')) {
          const res = await fetch(form.action, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
          if (!res.ok) throw new Error(String(res.status));
        } else {
          toMail(form, fields);
        }
        if (done) { form.hidden = true; done.hidden = false; done.focus(); }
      } catch (err) {
        toMail(form, fields);
      }
    });
  });

  // Enquire page: preselect the work from ?work=
  const workSelect = $('#f-work');
  if (workSelect) {
    const params = new URLSearchParams(location.search);
    const slug = params.get('work');
    const opt = slug && $(`option[data-slug="${CSS.escape(slug)}"]`, workSelect);
    if (opt) opt.selected = true;
    if (params.get('photos')) $('#f-msg').value = zh ? '请发给我一张可售作品的实物照片，包括签名和编号。' : 'Please send me photographs of an available impression, with its signature and edition number.';
  }
})();
