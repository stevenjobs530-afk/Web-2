// Builds the static site, English at / and Chinese at /zh/. No dependencies: `node src/build.mjs`.
// DING_BASE: path the site is served under, e.g. "/ding-fang" inside the portfolio (default: site root).
// DING_OUT: output folder (default: dist/).
import { mkdirSync, rmSync, writeFileSync, cpSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  site, edition, series, works, exhibitions, cities,
  siteZh, editionZh, seriesZh, worksZh, originalZh, exhibitionsZh, citiesZh,
} from './data.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = process.env.DING_OUT ? resolve(process.env.DING_OUT) : join(root, 'dist');
const BASE = (process.env.DING_BASE || '').replace(/\/+$/, '');
// Where the "back to portfolio" link goes when the site lives inside the portfolio.
const PORTFOLIO = process.env.DING_PORTFOLIO || '';

const esc = (s = '') => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const asset = (p) => BASE + p;
const img = (name, small = false) => asset(`/img/works/${name}${small ? '-sm' : ''}.jpg`);
const hasDomain = !site.url.includes('[');
const mailOk = !site.email.includes('[');
const cmToIn = (cm) => (cm / 2.54).toFixed(1);

const icons = {
  menu: '<svg aria-hidden="true" viewBox="0 0 22 14" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M0 1h22M0 7h22M0 13h22"/></svg>',
  sign: '<svg aria-hidden="true" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M5 23c4-1 6-6 9-6s3 4 6 4 5-5 7-8"/><path d="M5 27h22"/></svg>',
  doc: '<svg aria-hidden="true" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.3"><rect x="6" y="4" width="20" height="24"/><path d="M11 11h10M11 16h10M11 21h6"/></svg>',
  box: '<svg aria-hidden="true" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M4 10l12-6 12 6v12l-12 6-12-6z"/><path d="M4 10l12 6 12-6M16 16v12"/></svg>',
};

// ---------- Interface text ----------
const UI = {
  en: {
    htmlLang: 'en', prefix: '', other: 'zh', switchLabel: '中文', switchAria: 'View this page in Chinese',
    nav: ['Works', 'Artist', 'Exhibitions', 'Enquire'], navAria: 'Main', openMenu: 'Open menu', skip: 'Skip to content',
    portfolio: 'Zishun Gao’s portfolio',
    nlTitle: 'Letters from the studio', nlBody: 'New editions and exhibitions, a few times a year.', nlSubject: 'Subscribe: Letters from the studio',
    emailLabel: 'Email address', emailPh: 'Your email', subscribe: 'SUBSCRIBE', nlDone: 'Thank you. You are on the list.',
    footSite: 'Site', footContact: 'Contact', homeAria: 'Oriental Renaissance, home',
    rights: (y) => `© ${y} · All artwork images © Ding Fang · Authorised representative of the artist`,
    titleFull: (t) => (t ? `${t} · Ding Fang · ${site.name}` : `Ding Fang 丁方 · Signed editions · ${site.name}`),
    cardCta: 'SIGNED EDITION · PRICE ON REQUEST', works: 'WORKS', detail: 'detail',
    sheet: (w) => `${w.sheet[1]} × ${w.sheet[0]} cm · ${cmToIn(w.sheet[1])} × ${cmToIn(w.sheet[0])} in`,
  },
  zh: {
    htmlLang: 'zh-CN', prefix: '/zh', other: 'en', switchLabel: 'EN', switchAria: 'View this page in English',
    nav: ['作品', '艺术家', '展览', '咨询'], navAria: '主导航', openMenu: '打开菜单', skip: '跳到正文',
    portfolio: '高子舜的个人网站',
    nlTitle: '画室来信', nlBody: '新作品与展览消息，每年几封。', nlSubject: '订阅：画室来信',
    emailLabel: '电子邮箱', emailPh: '你的邮箱', subscribe: '订阅', nlDone: '谢谢，已加入名单。',
    footSite: '网站', footContact: '联系', homeAria: 'Oriental Renaissance 首页',
    rights: (y) => `© ${y} · 所有作品图片 © 丁方 · 艺术家授权代表`,
    titleFull: (t) => (t ? `${t} · 丁方 · ${site.name}` : `丁方 · 亲笔签名限量版 · ${site.name}`),
    cardCta: '亲笔签名限量版 · 价格请询', works: '件作品', detail: '局部',
    sheet: (w) => `${w.sheet[1]} × ${w.sheet[0]} cm`,
  },
};

function build(lang) {
  const L = UI[lang];
  const zh = lang === 'zh';
  const link = (p) => BASE + L.prefix + p;
  const S = zh ? seriesZh : series;
  const E = zh ? editionZh : edition;
  const description = zh ? siteZh.description : site.description;
  const workUrl = (w) => link(`/works/${w.slug}/`);
  // Primary and secondary title of a work in this language.
  const tPrimary = (w) => (zh ? w.zh : w.title);
  const tSecondary = (w) => (zh ? w.title : w.zh);
  const altOf = (w) => (zh ? worksZh[w.slug].alt : w.alt);
  const quoteOf = (w) => (zh ? worksZh[w.slug].quote : w.quote);
  const orig = (w) => (zh ? originalZh(w.original) : w.original);
  const secondary = (w) => (zh ? `<span>${esc(w.title)}</span>` : `<span class="zh">${w.zh}</span>`);

  const brand = (extra = '') => `<a class="brand" href="${link('/')}"${extra}><span class="seal" aria-hidden="true">丁方</span><span class="brand-name">ORIENTAL RENAISSANCE</span></a>`;

  const navItems = [
    ['/works/', L.nav[0], 'works'],
    ['/artist/', L.nav[1], 'artist'],
    ['/artist/#exhibitions', L.nav[2], null],
    ['/enquire/', L.nav[3], 'enquire'],
  ];

  function header(active, dark, path) {
    const links = navItems
      .map(([href, label, key]) => `<a href="${link(href)}"${key && key === active ? ' aria-current="page"' : ''}>${label}</a>`)
      .join('');
    const other = UI[L.other];
    const sw = `<a class="lang-switch" href="${BASE + other.prefix + path}" hreflang="${other.htmlLang}" lang="${other.htmlLang}" aria-label="${L.switchAria}">${L.switchLabel}</a>`;
    return `<header class="site-header${dark ? ' dark' : ''}"><div class="wrap">${brand()}
<nav id="site-nav" class="nav" aria-label="${L.navAria}">${links}${sw}</nav>
<button class="menu-btn" type="button" aria-expanded="false" aria-controls="site-nav" aria-label="${L.openMenu}">${icons.menu}</button>
</div></header>`;
  }

  const formAttrs = (subject, done) =>
    `data-form data-mailto="${esc(site.email)}" data-subject="${esc(subject)}" data-done="${done}"${site.formEndpoint ? ` action="${esc(site.formEndpoint)}" method="post"` : ''}`;

  function footer() {
    return `<footer class="site-footer">
<div class="wrap footer-top">
<div class="newsletter">
<p class="title">${L.nlTitle}</p>
<p>${L.nlBody}</p>
<form class="inline-form" ${formAttrs(L.nlSubject, '#nl-done')}>
<label class="sr-only" for="nl-email">${L.emailLabel}</label>
<input id="nl-email" name="email" type="email" autocomplete="email" placeholder="${L.emailPh}" required>
<button type="submit">${L.subscribe}</button>
</form>
<p id="nl-done" class="form-msg" tabindex="-1" hidden>${L.nlDone}</p>
</div>
<div class="footer-links">
<nav aria-label="Footer"><p class="eyebrow">${L.footSite}</p>${navItems.map(([href, label]) => `<a href="${link(href)}">${label}</a>`).join('')}</nav>
<div><p class="eyebrow">${L.footContact}</p><a href="mailto:${esc(site.email)}">${esc(site.email)}</a><a href="${site.instagram}">Instagram</a>${PORTFOLIO ? `<a href="${PORTFOLIO}">${L.portfolio}</a>` : ''}</div>
</div>
</div>
<div class="footer-bottom"><div class="wrap">${brand(` aria-label="${L.homeAria}"`)}
<span>${L.rights(new Date().getFullYear())}</span></div></div>
</footer>`;
  }

  function page({ path, title, desc = description, body, active, darkHeader = false, ogImage = '/img/og.jpg', jsonld }) {
    const full = L.titleFull(title);
    const abs = (p) => (hasDomain ? site.url + p : p);
    const alt = (lg) => `<link rel="alternate" hreflang="${UI[lg].htmlLang}" href="${abs(BASE + UI[lg].prefix + path)}">`;
    return `<!doctype html>
<html lang="${L.htmlLang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(full)}</title>
<meta name="description" content="${esc(desc)}">
${hasDomain ? `<link rel="canonical" href="${abs(link(path))}">` : ''}
${alt('en')}
${alt('zh')}
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(site.name)}">
<meta property="og:title" content="${esc(full)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:image" content="${abs(asset(ogImage))}">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#111010">
${hasDomain ? '' : '<meta name="robots" content="noindex">'}
<link rel="icon" href="${asset('/favicon.svg')}" type="image/svg+xml">
<link rel="stylesheet" href="${asset('/assets/fonts.css')}">
<link rel="stylesheet" href="${asset('/assets/site.css')}">
${jsonld ? `<script type="application/ld+json">${JSON.stringify(jsonld)}</script>` : ''}
</head>
<body>
<a class="skip" href="#main">${L.skip}</a>
${header(active, darkHeader, path)}
<main id="main">
${body}
</main>
${footer()}
<script src="${asset('/assets/site.js')}" defer></script>
</body>
</html>
`;
  }

  function card(w, { tall = false, showSeries = false } = {}) {
    return `<a class="card${tall ? ' card--tall' : ''}" href="${workUrl(w)}" data-series="${w.series}">
<div class="frame"><img src="${img(w.img, true)}" alt="${esc(altOf(w))}" loading="lazy"></div>
${showSeries ? `<p class="series-tag">${S[w.series].label}</p>` : ''}
<p class="title${zh ? ' zh' : ''}">${esc(tPrimary(w))}</p>
<p class="meta">${secondary(w)} · ${w.year}${showSeries ? ` · ${w.sheet[1]} × ${w.sheet[0]} cm` : ''}</p>
<p class="cta">${L.cardCta}</p>
</a>`;
  }

  // ---------- Home ----------
  const heroSlides = ['high-mountains-rising-from-clear-water', 'heartbeat-of-the-rock', 'blossoming-peaks'].map((s) => works.find((w) => w.slug === s));
  const slideCaption = (w) => (zh
    ? `<span class="zh">${w.zh}</span> <em>${esc(w.title)}</em>，${w.year}（局部）`
    : `<em>${esc(w.title)}</em> <span class="zh">${w.zh}</span>, ${w.year} — detail`);
  const T = zh ? {
    eyebrow: '亲笔签名、编号的限量版',
    lede: '神圣山水与致敬文艺复兴大师的作品，限量发行，每一件都由“85 新潮”代表画家之一亲笔签名。',
    slidesAria: '神圣山水', showSlide: (w) => `显示《${w.zh}》`, pause: '暂停',
    theWork: '作品',
    statement: '对丁方来说，山从来不只是风景。亚洲的高山、高原与河流，用他的话说，是<em>一种精神地理。</em>',
    col1: '自 1980 年走上黄土高原起，他把峭壁、山脊与河流画成信仰与坚忍之地，像岩石一样把画面层层堆积起来。',
    col2: '与山水并行的另一条线索，是与波提切利、达·芬奇和佛鲁里对话的水墨，东方与西方在纸上相遇。',
    aboutArtist: '关于艺术家 →', available: '在售作品', viewAll: '查看全部作品 →',
    theArtist: '艺术家', artistH: '画家、学者、教师。',
    facts: [['1956', '出生；就读于南京艺术学院'], ['1985', '“85 新潮”代表人物之一'], ['北京', '曾任中国人民大学艺术学院院长'], ['2015', '<em class="serif">文艺复兴在东方</em>，佛罗伦萨美第奇宫']],
    readBio: '阅读艺术家生平 →', abroad: '海外展览',
    cityNote: '佛罗伦萨：<em>文艺复兴在东方</em>，美第奇宫，2015。香港：<em>后八九中国新艺术</em>，之后到海外巡展。其他城市：群展。',
    promises: [
      ['亲笔签名并编号', '每一张都有艺术家的亲笔签名和它在限量中的编号。没有编号的不属于这一版。'],
      ['经艺术家授权销售', '作品依据艺术家的书面授权出售，每次购买都附有相关文件。'],
      ['妥善包装寄送', '未装框的作品平放或卷起，用无酸材料包装，从北京发货，全程保价送到你手上。'],
    ],
    ctaH: '价格请询。', ctaP: '告诉我们你感兴趣的作品。我们会在两个工作日内回复价格、这一张的实物照片和它的编号。', ctaBtn: '发起咨询',
    portrait: '丁方坐着讲话，一只手在比划',
  } : {
    eyebrow: 'Signed and numbered editions',
    lede: 'Sacred Landscapes and homages to the Renaissance masters, in limited editions hand-signed by one of the painters of China’s ’85 New Wave.',
    slidesAria: 'Sacred Landscapes', showSlide: (w) => `Show ${esc(w.title)}`, pause: 'PAUSE',
    theWork: 'The work',
    statement: 'For Ding Fang a mountain is never just scenery. The mountains, plateaus and rivers of Asia are, in his words, <em>a geography of the spirit.</em>',
    col1: 'Since a journey to the Loess Plateau in 1980, he has painted cliffs, ridges and rivers as places of faith and endurance, building the surface up in layers like rock.',
    col2: 'Alongside the landscapes runs a second line of work: ink drawings in dialogue with Botticelli, Leonardo and Melozzo da Forlì, where East and West meet on paper.',
    aboutArtist: 'About the artist →', available: 'Available editions', viewAll: 'View all works →',
    theArtist: 'The artist', artistH: 'Painter, scholar, teacher.',
    facts: [['1956', 'Born; trained at Nanjing Arts Institute'], ['1985', 'A leading figure of the ’85 New Wave'], ['Beijing', 'Former Dean, School of Arts, Renmin University of China'], ['2015', '<em class="serif">Oriental Renaissance</em>, Palazzo Medici, Florence']],
    readBio: 'Read the biography →', abroad: 'Exhibited abroad',
    cityNote: 'Florence: <em>Oriental Renaissance</em>, Palazzo Medici, 2015. Hong Kong: <em>China’s New Art, Post-1989</em>, which later toured abroad. Other cities: group exhibitions.',
    promises: [
      ['Hand-signed and numbered', 'Every impression carries the artist’s signature and its number in the edition. An unnumbered sheet is not part of the edition.'],
      ['An authorised sale', 'Works are offered under a written authorisation from the artist. Documentation is provided with every purchase.'],
      ['Packed and shipped with care', 'Unframed sheets travel flat or rolled in archival packing from Beijing, insured to your door.'],
    ],
    ctaH: 'Prices on request.', ctaP: 'Tell us which work interests you. We reply within two working days with the price, photographs of the sheet and its edition number.', ctaBtn: 'Make an enquiry',
    portrait: 'Ding Fang, seated, speaking and gesturing with one hand',
  };
  const cityName = (i) => (zh ? citiesZh[i] : cities[i][0]);

  const home = page({
    path: '/',
    active: null,
    darkHeader: true,
    body: `<section class="dark hero">
<div class="wrap">
<p class="eyebrow">${T.eyebrow}</p>
<div class="hero-head">
<h1>${zh ? '丁方<span class="zh">Ding Fang</span>' : 'Ding Fang<span class="zh">丁方</span>'}</h1>
<p class="hero-lede">${T.lede}</p>
</div>
</div>
<figure class="carousel" aria-roledescription="carousel" aria-label="${T.slidesAria}">
<div class="slides">
${heroSlides.map((w, i) => `<img class="slide${i === 0 ? ' is-active' : ''}" src="${img(w.img)}" alt="${esc(tPrimary(w) + (zh ? '，' : ', ') + w.year + (zh ? '：' : ': ') + altOf(w))}" data-caption="${esc(slideCaption(w))}"${i ? ' loading="lazy"' : ' fetchpriority="high"'}>`).join('\n')}
</div>
<figcaption class="wrap carousel-bar">
<span data-caption aria-live="polite">${slideCaption(heroSlides[0])}</span>
<span class="dots">${heroSlides.map((w, i) => `<button class="dot" type="button" aria-label="${T.showSlide(w)}" aria-pressed="${i === 0}"><span></span></button>`).join('')}<button class="play" type="button">${T.pause}</button></span>
</figcaption>
</figure>
</section>

<section class="section">
<div class="wrap split">
<p class="side eyebrow">${T.theWork}</p>
<div class="main">
<p class="statement">${T.statement}</p>
<div class="cols">
<p>${T.col1}</p>
<p>${T.col2}</p>
</div>
<p style="margin-top:40px"><a class="link-line" href="${link('/artist/')}">${T.aboutArtist}</a></p>
</div>
</div>
</section>

<section class="section" style="padding-top:0">
<div class="wrap series-grid">
${[['landscapes', 'blossoming', '2013'], ['homages', 'botticelli', '2011–12']].map(([key, im, yrs]) => {
      const n = works.filter((w) => w.series === key).length;
      const w = works.find((x) => x.img === im);
      return `<a class="series-card" href="${link(`/works/#${key}`)}">
<div class="frame"><img src="${img(im)}" alt="${esc(tPrimary(w) + (zh ? '，' : ', ') + w.year)}" loading="lazy"></div>
<div class="row"><h2>${S[key].name}</h2><span class="count">${zh ? `${n} ${L.works} · ${yrs}` : `${n} ${L.works} · ${yrs}`}</span></div>
<p>${S[key].blurb}</p>
</a>`;
    }).join('\n')}
</div>
</section>

<section class="section section--top">
<div class="wrap">
<div class="section-head"><h2 class="h2">${T.available}</h2><a class="link-line" href="${link('/works/')}">${T.viewAll}</a></div>
<div class="grid grid--2up">
${works.filter((w) => w.featured).map((w) => card(w, { tall: true })).join('\n')}
</div>
</div>
</section>

<section class="dark">
<div class="wrap section artist-teaser">
<img src="${asset('/img/artist/portrait.jpg')}" alt="${T.portrait}" loading="lazy">
<div>
<p class="eyebrow">${T.theArtist}</p>
<h2 class="h2" style="margin-top:20px">${T.artistH}</h2>
<dl class="facts">
${T.facts.map(([dt, dd]) => `<dt>${dt}</dt><dd>${dd}</dd>`).join('')}
</dl>
<p style="margin-top:40px"><a class="link-line" href="${link('/artist/')}">${T.readBio}</a></p>
</div>
</div>
</section>

<section class="section" style="border-bottom:1px solid var(--line)">
<div class="wrap">
<p class="eyebrow" style="margin-bottom:48px">${T.abroad}</p>
<div class="cities">${cities.map(([, y], i) => `<div><p class="city">${cityName(i)}</p><p class="yrs">${y}</p></div>`).join('')}</div>
<p class="note">${T.cityNote}</p>
</div>
</section>

<section class="section">
<div class="wrap promises">
${T.promises.map(([h, p], i) => `<div>${[icons.sign, icons.doc, icons.box][i]}<h3>${h}</h3><p>${p}</p></div>`).join('')}
</div>
</section>

<section class="matbg cta-band">
<div class="wrap">
<div><h2>${T.ctaH}</h2><p>${T.ctaP}</p></div>
<a class="btn" href="${link('/enquire/')}">${T.ctaBtn}</a>
</div>
</section>`,
  });

  // ---------- Works ----------
  const countOf = (k) => works.filter((w) => w.series === k).length;
  const W = zh ? {
    title: '作品', desc: '丁方全部在售限量版作品：神圣山水与致敬文艺复兴。亲笔签名并编号，价格请询。',
    eyebrow: '收藏', lede: '纸本限量版，每一件都由丁方亲笔签名并编号。价格请询。', filterAria: '按系列筛选',
    all: '全部作品', homages: '致敬与水墨人物',
    soonT: '更多作品正在拍摄', soonP: '一组六幅的少女肖像（2013）和六幅小尺幅装框石版画（2008–2013）即将上线。想先看看的话，欢迎问我们。', soonBtn: '申请预览',
  } : {
    title: 'Works', desc: 'All available editions by Ding Fang: Sacred Landscapes and Homages to the Renaissance. Hand-signed and numbered. Prices on request.',
    eyebrow: 'The collection', lede: 'Limited editions on paper, each hand-signed and numbered by Ding Fang. Prices are given on request.', filterAria: 'Filter by series',
    all: 'All works', homages: 'Homages &amp; Ink Figures',
    soonT: 'More works are being photographed', soonP: 'A series of six portraits of young women (2013) and six small framed lithographs (2008–2013) will be added soon. Ask us if you would like to see them first.', soonBtn: 'Ask for a preview',
  };
  const worksPage = page({
    path: '/works/',
    title: W.title,
    active: 'works',
    desc: W.desc,
    body: `<section class="wrap page-head">
<p class="eyebrow" style="margin-bottom:20px">${W.eyebrow}</p>
<div class="hero-head" style="margin:0"><h1>${W.title}</h1><p class="lede">${W.lede}</p></div>
<div class="filters" role="group" aria-label="${W.filterAria}">
<button class="chip" type="button" data-filter="all" aria-pressed="true">${W.all} <span class="n">${works.length}</span></button>
<button class="chip" type="button" data-filter="landscapes" aria-pressed="false">${S.landscapes.name} <span class="n">${countOf('landscapes')}</span></button>
<button class="chip" type="button" data-filter="homages" aria-pressed="false">${W.homages} <span class="n">${countOf('homages')}</span></button>
</div>
</section>
<section class="wrap" style="padding-block:56px clamp(80px,9vw,128px)">
<div class="grid grid--2up">
${works.map((w) => card(w, { showSeries: true })).join('\n')}
</div>
<div class="soon">
<div><p class="t">${W.soonT}</p><p>${W.soonP}</p></div>
<a class="btn" href="${link('/enquire/')}">${W.soonBtn}</a>
</div>
</section>`,
  });

  // ---------- Work detail ----------
  const D = zh ? {
    crumbs: '面包屑导航', views: [['full', '完整作品'], ['detail', '表面局部'], ['wall', '挂在墙上'], ['sig', '签名与编号']], viewsAria: '作品视图',
    detailTag: '表面局部', wallTag: '大致比例 · 3 米墙面 · 装裱后效果', framing: '可按需安排装框。',
    artistLine: '丁方 <span style="letter-spacing:.1em">Ding Fang</span> · 1956 年生',
    facts: ['系列', '媒介', '纸张尺寸', '限量', '原作', '品相', '发货'], after: (o) => `原作：${esc(o)}`,
    price: '价格请询', avail: '● 可售', enquire: '咨询这件作品', photos: '索取实物照片',
    reply: '我们会在两个工作日内回复。依据艺术家书面授权销售。',
    about: '关于作品', scale: '比例', scaleNote: (w) => `纸张 ${w.sheet[1]} × ${w.sheet[0]} cm，旁边是一个 175 cm 高的人。`,
    authEyebrow: '真伪', authH: '每一张都由艺术家亲笔签名并编号。',
    auth1: '购买前，我们会发给你即将收到的那一张的照片，包括签名和编号。',
    auth2: '每次购买都附发票和艺术家授权书复印件。［鉴定证书待确认］',
    same: '同系列作品', allWorks: '全部作品 →', short: '咨询',
    closeUp: (w) => `《${w.zh}》表面特写`, onWall: (w) => `《${w.zh}》挂在长凳上方的展墙上，大致按比例`,
    sigAlt: '签名与编号', svgLabel: (w) => `${w.sheet[1]} × ${w.sheet[0]} 厘米的纸张，旁边是一个 175 厘米高的人`,
    metaDesc: (w) => `丁方《${w.zh}》（${w.title}），${w.year}。${editionZh.size}。纸张 ${w.sheet[1]} × ${w.sheet[0]} cm。价格请询。`,
  } : {
    crumbs: 'Breadcrumb', views: [['full', 'Full work'], ['detail', 'Surface detail'], ['wall', 'On the wall'], ['sig', 'Signature & number']], viewsAria: 'Views of the work',
    detailTag: 'SURFACE DETAIL', wallTag: 'APPROXIMATE SCALE · 3 M WALL · SHOWN MOUNTED', framing: 'Framing can be arranged on request.',
    artistLine: 'Ding Fang <span class="zh" style="letter-spacing:.1em">丁方</span> · b. 1956',
    facts: ['Series', 'Medium', 'Sheet size', 'Edition', 'After', 'Condition', 'Ships from'], after: (o) => `The original, ${esc(o)}`,
    price: 'Price on request', avail: '● AVAILABLE', enquire: 'Enquire about this work', photos: 'Request photos',
    reply: 'We reply within two working days. Sold under a written authorisation from the artist.',
    about: 'About the work', scale: 'Scale', scaleNote: (w) => `Sheet ${w.sheet[1]} × ${w.sheet[0]} cm, beside a figure 175 cm tall.`,
    authEyebrow: 'Authenticity', authH: 'Every sheet is signed and numbered by the artist.',
    auth1: 'Before you buy, we send photographs of the exact impression you will receive, including the signature and edition number.',
    auth2: 'Each purchase comes with an invoice and a copy of the artist’s authorisation. [Certificate of authenticity to confirm]',
    same: 'From the same series', allWorks: 'All works →', short: 'Enquire',
    closeUp: (w) => `Close-up of the surface of ${esc(w.title)}`, onWall: (w) => `${esc(w.title)} on a gallery wall above a bench, at approximate scale`,
    sigAlt: 'Signature and edition number', svgLabel: (w) => `The ${w.sheet[1]} by ${w.sheet[0]} centimetre sheet beside a figure 175 centimetres tall`,
    metaDesc: (w) => `${w.title} (${w.zh}), ${w.year}, by Ding Fang. ${edition.size}. Sheet ${w.sheet[1]} × ${w.sheet[0]} cm. Price on request.`,
  };

  function scaleSvg(w) {
    const k = 1.01; // px per cm; the figure is 175 cm
    const rw = w.sheet[0] * k, rh = w.sheet[1] * k;
    const ry = 239 - 145 * k - rh / 2;
    const fx = Math.min(40 + rw + 60, 290);
    return `<svg role="img" aria-label="${D.svgLabel(w)}" viewBox="0 0 320 240">
<rect x="40" y="${ry.toFixed(1)}" width="${rw.toFixed(1)}" height="${rh.toFixed(1)}" fill="#b8afa0" stroke="#17150f"/>
<line x1="0" y1="239" x2="320" y2="239" stroke="#17150f"/>
<circle cx="${fx}" cy="73" r="11" fill="none" stroke="#17150f" stroke-width="1.2"/>
<path d="M${fx} 85v70M${fx} 98l-20 34M${fx} 98l20 34M${fx} 155l-14 84M${fx} 155l14 84" fill="none" stroke="#17150f" stroke-width="1.2"/>
</svg>`;
  }

  function workPage(w) {
    const s = S[w.series];
    const related = works.filter((x) => x.series === w.series && x.slug !== w.slug).slice(0, 3);
    const artPct = ((w.sheet[0] / 300) * 100).toFixed(1);
    const enquire = link(`/enquire/?work=${w.slug}`);
    const views = D.views.filter(([k]) => k !== 'sig' || w.sigImg);
    const jsonld = {
      '@context': 'https://schema.org',
      '@type': 'VisualArtwork',
      name: w.title,
      alternateName: w.zh,
      creator: { '@type': 'Person', name: 'Ding Fang', alternateName: '丁方' },
      dateCreated: w.year,
      artform: 'Print',
      artEdition: edition.size,
      width: { '@type': 'Distance', name: `${w.sheet[0]} cm` },
      height: { '@type': 'Distance', name: `${w.sheet[1]} cm` },
      image: (hasDomain ? site.url : '') + img(w.img),
    };
    const quote = quoteOf(w);
    return page({
      path: `/works/${w.slug}/`,
      title: tPrimary(w),
      active: 'works',
      ogImage: `/img/works/${w.img}.jpg`,
      desc: D.metaDesc(w),
      jsonld,
      body: `<nav class="wrap crumbs" aria-label="${D.crumbs}"><a href="${link('/works/')}">${W.title}</a> / <a href="${link(`/works/#${w.series}`)}">${s.name}</a> / <span aria-current="page">${esc(tPrimary(w))}</span></nav>
<section class="wrap work">
<div class="work-media">
<div class="viewer">
<div class="view view--full is-active" data-view="full"><img src="${img(w.img)}" alt="${esc(tPrimary(w) + (zh ? '，' : ', ') + w.year + (zh ? '：' : ': ') + altOf(w))}"></div>
<div class="view view--detail" data-view="detail"><img src="${img(w.img)}" alt="${D.closeUp(w)}" loading="lazy"><p class="view-tag">${D.detailTag}</p></div>
<div class="view view--wall" data-view="wall"><div class="floor"></div><div class="skirting"></div>
<img class="art" src="${img(w.img, true)}" alt="${D.onWall(w)}" style="width:${artPct}%" loading="lazy">
<div class="bench"></div><div class="leg" style="left:32%"></div><div class="leg" style="right:32%"></div>
<p class="view-tag">${D.wallTag}</p></div>
${w.sigImg ? `<div class="view view--full" data-view="sig"><img src="${asset(w.sigImg)}" alt="${D.sigAlt}" loading="lazy"></div>` : ''}
</div>
<div class="views" role="group" aria-label="${D.viewsAria}">${views.map(([k, l], i) => `<button class="chip" type="button" data-view="${k}" aria-pressed="${i === 0}">${l}</button>`).join('')}</div>
<p class="small">${D.framing}</p>
</div>
<div class="work-info">
<p class="eyebrow">${D.artistLine}</p>
<h1${zh ? ' class="zh"' : ''}>${esc(tPrimary(w))}</h1>
<p class="zh-title">${zh ? `<span>${esc(w.title)}</span><span>，${w.year}</span>` : `<span class="zh">${w.zh}</span><span>, ${w.year}</span>`}</p>
<dl class="facts facts--light">
<dt>${D.facts[0]}</dt><dd><a href="${link(`/works/#${w.series}`)}">${s.name}</a></dd>
<dt>${D.facts[1]}</dt><dd>${esc(E.medium)}</dd>
<dt>${D.facts[2]}</dt><dd>${L.sheet(w)}</dd>
<dt>${D.facts[3]}</dt><dd>${esc(E.size)}</dd>
<dt>${D.facts[4]}</dt><dd>${D.after(orig(w))}</dd>
<dt>${D.facts[5]}</dt><dd>${esc(E.condition)}</dd>
<dt>${D.facts[6]}</dt><dd>${esc(E.shipsFrom)}</dd>
</dl>
<div class="price-row"><p class="p">${D.price}</p><p class="avail">${D.avail}</p></div>
<a class="btn btn--block" href="${enquire}">${D.enquire}</a>
<a class="btn btn--ghost btn--block" href="${enquire}&amp;photos=1">${D.photos}</a>
<p class="small">${D.reply}</p>
</div>
</section>

<section class="section section--top">
<div class="wrap split">
<div class="main" style="flex-basis:560px">
<p class="eyebrow" style="margin-bottom:24px">${D.about}</p>
${quote ? `<p class="statement statement--sm">${esc(quote)}</p>` : ''}
<div class="prose" style="margin-top:${quote ? '36px' : '0'}">${s.about.map((p) => `<p>${esc(p)}</p>`).join('')}</div>
</div>
<div class="side" style="flex:1 1 340px;padding:0">
<p class="eyebrow" style="margin-bottom:24px">${D.scale}</p>
<div class="matbg scale-box">${scaleSvg(w)}</div>
<p class="small" style="margin-top:14px">${D.scaleNote(w)}</p>
</div>
</div>
</section>

<section class="dark">
<div class="wrap auth">
<div><p class="eyebrow">${D.authEyebrow}</p><p class="serif">${D.authH}</p></div>
<p>${D.auth1}</p>
<p>${D.auth2}</p>
</div>
</section>

${related.length ? `<section class="section">
<div class="wrap">
<div class="section-head"><h2 class="h2">${D.same}</h2><a class="link-line" href="${link('/works/')}">${D.allWorks}</a></div>
<div class="grid grid--2up">${related.map((x) => card(x)).join('\n')}</div>
</div>
</section>` : ''}

<div class="sticky-buy"><div><p class="p">${D.price}</p><p class="avail">${D.avail}</p></div><a class="btn" href="${enquire}">${D.short}</a></div>`,
    });
  }

  // ---------- Artist ----------
  const X = zh ? exhibitionsZh : exhibitions;
  const A = zh ? {
    title: '艺术家', desc: '丁方（Ding Fang，1956 年生）：画家、学者、教师，“85 新潮”代表人物之一。生平与部分展览。',
    eyebrow: '艺术家 · 1956 年生', h1: '丁方 <span class="zh">Ding Fang</span>',
    lede: '画家、学者、教师，他的作品把亚洲的高山与意大利文艺复兴的精神连在一起。',
    studio: '丁方在画室里，对着画架上的一幅山的画布作画',
    bio: '生平',
    statement: '丁方毕业于南京艺术学院，先学<em>工笔</em>人物，后转向油画。他的老师包括刘海粟和苏天赐。',
    prose: [
      '1980 年的一次黄土高原之行改变了他的创作方向。整个八十年代，他一次次徒步回到中国的河流、峭壁与古迹之间；到八十年代中期，他已是“85 新潮”的代表人物之一。',
      '此后他先后执教于南京大学和北京的中国人民大学，并担任中国人民大学艺术学院院长。他的创作贯穿两条主线：把山画成精神之地的“神圣山水”，以及向意大利文艺复兴大师致敬的作品。',
      '2015 年，他的展览<em>文艺复兴在东方</em>在佛罗伦萨美第奇宫展出。',
    ],
    taihang: '1983 年，年轻的丁方在太行山攀登岩坡的黑白照片', taihangCap: '太行山，1983',
    road: '在路上，1981–1988', roadH: '在山成为画之前，他先用脚走过了它们。',
    roadP: '1981 年的黄河，1982 年的圆明园遗址，1983 年的太行山，1985 年的云冈石窟。几十年后，这些峭壁与山脊回到了“神圣山水”之中。',
    shows: '部分展览', showsP: '四十多年来，他的作品在瑞典、德国、奥地利、法国、英国、美国、加拿大和新加坡展出。',
    th: ['年份', '展览', '城市', '类型'], ctaH: '看看这些作品。', ctaBtn: '查看全部作品',
  } : {
    title: 'The Artist', desc: 'Ding Fang (丁方, b. 1956): painter, scholar and teacher; a leading figure of the ’85 New Wave. Biography and selected exhibitions.',
    eyebrow: 'The artist · b. 1956', h1: 'Ding Fang <span class="zh">丁方</span>',
    lede: 'Painter, scholar and teacher, whose work joins the mountains of Asia to the spirit of the Italian Renaissance.',
    studio: 'Ding Fang in his studio, painting a mountain canvas on an easel',
    bio: 'Biography',
    statement: 'Ding Fang trained at the Nanjing Arts Institute, first in <em>gongbi</em> figure painting and then in oil. His teachers included Liu Haisu and Su Tianci.',
    prose: [
      'A journey to the Loess Plateau in 1980 changed the direction of his work. Through the decade he kept returning on foot to China’s rivers, cliffs and ancient sites, and by the mid-1980s he was one of the leading figures of the ’85 New Wave.',
      'He went on to teach at Nanjing University and at Renmin University of China in Beijing, where he served as Dean of the School of Arts. Two bodies of work run through his career: the Sacred Landscapes, in which mountains become places of the spirit, and his homages to the masters of the Italian Renaissance.',
      'In 2015 his exhibition <em>Oriental Renaissance</em> was shown at the Palazzo Medici in Florence.',
    ],
    taihang: 'Black-and-white photograph of young Ding Fang climbing a rocky slope in the Taihang Mountains, 1983', taihangCap: 'Taihang Mountains, 1983',
    road: 'On the road, 1981–1988', roadH: 'Before the mountains became paintings, he walked them.',
    roadP: 'The Yellow River in 1981, the ruins of the Old Summer Palace in 1982, the Taihang Mountains in 1983, the Yungang Grottoes in 1985. Decades later those cliffs and ridges return in the Sacred Landscapes.',
    shows: 'Selected exhibitions', showsP: 'Over four decades his work has been shown in Sweden, Germany, Austria, France, the UK, the United States, Canada and Singapore.',
    th: ['YEAR', 'EXHIBITION', 'CITY', 'TYPE'], ctaH: 'See the editions.', ctaBtn: 'View all works',
  };
  const artist = page({
    path: '/artist/',
    title: A.title,
    active: 'artist',
    darkHeader: true,
    ogImage: '/img/artist/studio.jpg',
    desc: A.desc,
    jsonld: {
      '@context': 'https://schema.org', '@type': 'Person', name: 'Ding Fang', alternateName: '丁方', birthDate: '1956', jobTitle: 'Painter',
      alumniOf: 'Nanjing Arts Institute', sameAs: ['https://en.wikipedia.org/wiki/Ding_Fang'],
    },
    body: `<section class="dark artist-hero">
<div class="wrap">
<div><p class="eyebrow" style="margin-bottom:24px">${A.eyebrow}</p><h1>${A.h1}</h1></div>
<p class="hero-lede">${A.lede}</p>
</div>
<img class="wide" src="${asset('/img/artist/studio.jpg')}" alt="${A.studio}" fetchpriority="high">
</section>

<section class="section">
<div class="wrap split">
<p class="side eyebrow">${A.bio}</p>
<div class="main" style="max-width:820px">
<p class="statement statement--sm">${A.statement}</p>
<div class="prose" style="margin-top:40px">
${A.prose.map((p) => `<p>${p}</p>`).join('\n')}
</div>
</div>
</div>
</section>

<section class="matbg">
<div class="wrap road">
<figure><img src="${asset('/img/artist/taihang.jpg')}" alt="${A.taihang}" loading="lazy"><figcaption>${A.taihangCap}</figcaption></figure>
<div>
<p class="eyebrow" style="margin-bottom:24px">${A.road}</p>
<p class="statement statement--sm">${A.roadH}</p>
<p class="prose" style="margin-top:28px">${A.roadP}</p>
</div>
</div>
</section>

<section class="section" id="exhibitions">
<div class="wrap">
<div class="section-head"><h2 class="h2" style="font-size:clamp(44px,5vw,76px)">${A.shows}</h2><p style="max-width:420px;color:var(--muted)">${A.showsP}</p></div>
<div class="table-scroll">
<table class="shows">
<thead><tr>${A.th.map((h) => `<th scope="col">${h}</th>`).join('')}</tr></thead>
<tbody>
${exhibitions.map((x, i) => { const y = X[i]; return `<tr><td class="y">${x.year}</td><td><em>${esc(y.title)}</em>${y.venue ? `<span class="v">${esc(y.venue)}</span>` : ''}</td><td>${y.city}</td><td class="t">${y.type}</td></tr>`; }).join('\n')}
</tbody>
</table>
</div>
</div>
</section>

<section class="dark cta-band">
<div class="wrap"><h2>${A.ctaH}</h2><a class="btn btn--light" href="${link('/works/')}">${A.ctaBtn}</a></div>
</section>`,
  });

  // ---------- Enquire ----------
  const Q = zh ? {
    title: '咨询', desc: '咨询丁方的作品。我们会在两个工作日内回复价格、运费和这一张的实物照片。',
    h1: '咨询一件作品。', lede: '告诉我们你感兴趣的作品和所在地区。我们会在两个工作日内回复价格、寄到你所在地区的运费，以及这一张的实物照片。',
    subject: '网站咨询（中文）', fields: ['姓名', '邮箱', '国家或地区', '作品'], msg: '留言', opt: '（选填）', notSure: '还没想好，请给些建议',
    consent: '我同意我的信息仅用于回复这次咨询。', send: '发送咨询',
    thanks: '谢谢。', got: '我们已收到你的咨询，会在两个工作日内回复。', back: '返回作品 →',
    how: '流程', steps: [['咨询', '选择作品，给我们留言。'], ['收到详情', '价格、运费，以及你将收到的那一张的实物照片，包括签名和编号。'], ['确认并付款', '凭发票付款。［付款方式待确认］'], ['寄送', '平放或卷起包装，全程保价，从北京发货并提供物流单号。']],
    prefer: '更习惯用邮件？请写信到', ig: 'Instagram：',
  } : {
    title: 'Enquire', desc: 'Ask about a work by Ding Fang. We reply within two working days with the price, shipping and photographs of the impression.',
    h1: 'Ask about a work.', lede: 'Tell us which work interests you and where you are. We reply within two working days with the price, shipping to your country and photographs of the impression.',
    subject: 'Enquiry from the website', fields: ['Name', 'Email', 'Country', 'Work'], msg: 'Message', opt: '(optional)', notSure: 'Not sure yet: please advise',
    consent: 'I agree that my details are used only to answer this enquiry.', send: 'Send enquiry',
    thanks: 'Thank you.', got: 'Your enquiry has been received. We will write to you within two working days.', back: 'Back to the works →',
    how: 'How it works', steps: [['Enquire', 'Choose a work and send us a note.'], ['Receive the details', 'Price, shipping cost and photographs of the exact impression, with its signature and number.'], ['Confirm and pay', 'By invoice. [Payment method to confirm]'], ['Delivery', 'Packed flat or rolled, insured, shipped from Beijing with tracking.']],
    prefer: 'Prefer email? Write to', ig: 'Instagram:',
  };
  const enquirePage = page({
    path: '/enquire/',
    title: Q.title,
    active: 'enquire',
    desc: Q.desc,
    body: `<section class="wrap enquire">
<div class="main">
<p class="eyebrow" style="margin-bottom:20px">${Q.title}</p>
<h1>${Q.h1}</h1>
<p style="margin-top:24px;max-width:560px;font-size:17px;color:var(--text-2)">${Q.lede}</p>
<form class="form" ${formAttrs(Q.subject, '#enquiry-done')}>
<div class="field"><label for="f-name">${Q.fields[0]}</label><input id="f-name" name="name" autocomplete="name" required></div>
<div class="field"><label for="f-email">${Q.fields[1]}</label><input id="f-email" name="email" type="email" autocomplete="email" required></div>
<div class="field"><label for="f-country">${Q.fields[2]}</label><input id="f-country" name="country" autocomplete="country-name" required></div>
<div class="field"><label for="f-work">${Q.fields[3]}</label><select id="f-work" name="work">
${works.map((w) => `<option data-slug="${w.slug}">${esc(zh ? `${w.zh}（${w.title}）` : w.title)}</option>`).join('\n')}
<option>${Q.notSure}</option>
</select></div>
<div class="field field--wide"><label for="f-msg">${Q.msg} <span class="opt">${Q.opt}</span></label><textarea id="f-msg" name="message" rows="5"></textarea></div>
<div class="check"><input id="f-consent" name="consent" type="checkbox" required><label for="f-consent">${Q.consent}</label></div>
<div class="field--wide"><button class="btn" type="submit">${Q.send}</button></div>
</form>
<div id="enquiry-done" class="thanks" role="status" tabindex="-1" hidden>
<p class="serif">${Q.thanks}</p>
<p>${Q.got}</p>
<p><a class="link-line" href="${link('/works/')}">${Q.back}</a></p>
</div>
</div>
<aside class="dark how">
<p class="eyebrow">${Q.how}</p>
<ol>
${Q.steps.map(([t, d], i) => `<li><span class="n">${i + 1}</span><div><p class="st">${t}</p><p class="sd">${d}</p></div></li>`).join('\n')}
</ol>
<div class="contact"><p>${Q.prefer} <a href="mailto:${esc(site.email)}">${esc(site.email)}</a></p><p style="margin-top:8px">${Q.ig} <a href="${site.instagram}">${site.instagramHandle}</a></p></div>
</aside>
</section>`,
  });

  const notFound = page({
    path: '/404.html',
    title: zh ? '页面不存在' : 'Page not found',
    body: zh
      ? `<section class="wrap not-found"><p class="eyebrow">404</p><h1 style="margin-top:20px">这个页面不在这里。</h1><p>作品可能换了位置。全部作品只差一步。</p><a class="btn" href="${link('/works/')}">查看全部作品</a></section>`
      : `<section class="wrap not-found"><p class="eyebrow">404</p><h1 style="margin-top:20px">This page is not here.</h1><p>The work may have moved. The full collection is one click away.</p><a class="btn" href="${link('/works/')}">View all works</a></section>`,
  });

  const pages = [['index.html', home], ['works/index.html', worksPage], ['artist/index.html', artist], ['enquire/index.html', enquirePage]];
  works.forEach((w) => pages.push([`works/${w.slug}/index.html`, workPage(w)]));
  pages.push(['404.html', notFound]);
  return pages.map(([rel, html]) => [(zh ? 'zh/' : '') + rel, html]);
}

// ---------- Write ----------
rmSync(out, { recursive: true, force: true });
const write = (rel, html) => {
  const file = join(out, rel);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
};
cpSync(join(root, 'public'), out, { recursive: true });
cpSync(join(root, 'src/assets'), join(out, 'assets'), { recursive: true });
const all = [...build('en'), ...build('zh')];
all.forEach(([rel, html]) => write(rel, html));
write('robots.txt', `User-agent: *\n${hasDomain ? 'Allow: /' : 'Disallow: /'}\n${hasDomain ? `Sitemap: ${site.url}/sitemap.xml\n` : ''}`);
if (hasDomain) {
  const paths = all.map(([rel]) => '/' + rel.replace(/index\.html$/, '')).filter((p) => !p.endsWith("404.html"));
  write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths.map((p) => `<url><loc>${site.url}${BASE}${p}</loc></url>`).join('\n')}\n</urlset>\n`);
}
console.log(`Built ${all.length} pages (English + 中文) into ${out}${BASE ? ` for ${BASE}/` : ''}${mailOk ? '' : '  (contact email is still a placeholder)'}`);
