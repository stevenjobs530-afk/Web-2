// Site content. Edit here, then run `npm run build`.
// Anything in [square brackets] is still to be confirmed before launch.

export const site = {
  name: 'Oriental Renaissance',
  url: 'https://[yourdomain.com]',
  email: 'gzs20030423@gmail.com',
  instagram: 'https://www.instagram.com/oriental.renaissance.prints/',
  instagramHandle: '@oriental.renaissance.prints',
  // Where the enquiry and newsletter forms post. Leave empty to fall back to an email draft (mailto).
  formEndpoint: '',
  description:
    'Signed and numbered editions by Ding Fang (丁方): Sacred Landscapes and homages to the Renaissance masters. Prices on request.',
};

// Facts shared by every edition until confirmed per work.
export const edition = {
  medium: 'Print on paper [technique to confirm]',
  size: 'Edition of [100], hand-signed and numbered',
  condition: 'Unframed, never mounted',
  shipsFrom: 'Beijing, insured',
};

export const series = {
  landscapes: {
    name: 'Sacred Landscapes',
    label: 'SACRED LANDSCAPES',
    blurb: 'Peaks and ridges built up in thick layers, then glazed with thin, transparent colour.',
    about: [
      'In Ding Fang’s Sacred Landscapes a mountain is never just scenery. Water-based materials are built up in thick layers like rock, then glazed with thin oil colour, so the peaks seem to rise out of the surface itself.',
      'He calls the mountains, plateaus and rivers of Asia a geography of the spirit. The series grew out of his journeys on foot through China’s plateaus, cliffs and river valleys in the 1980s.',
    ],
  },
  homages: {
    name: 'Homages to the Renaissance',
    label: 'HOMAGES & INK FIGURES',
    blurb: 'Ink figures in conversation with Botticelli, Leonardo and the angels of Melozzo da Forlì.',
    about: [
      'Alongside the landscapes runs a second line of work: ink drawings on paper in dialogue with the masters of the Italian Renaissance, where East and West meet on the same sheet.',
      'The drawings were made in 2011 and 2012 in dense, dry ink (jiaomo) on paper.',
    ],
  },
};

// sheet: print sheet size in cm as [width, height]; original: the work the edition is made after.
export const works = [
  {
    slug: 'high-mountains-rising-from-clear-water', series: 'landscapes',
    title: 'High Mountains Rising from Clear Water', zh: '青水出高山', year: '2013',
    sheet: [100, 60], original: 'mixed media, 45 × 80 cm, 2013', img: 'clearwater', featured: true,
    alt: 'White-capped peaks under a violet-blue sky above thickly layered rock',
    quote: 'Up close the surface is broken and ridged. Step back, and it becomes mountain and water.',
  },
  {
    slug: 'blossoming-peaks', series: 'landscapes',
    title: 'Blossoming Peaks', zh: '绽放的山峰', year: '2013',
    sheet: [65, 53], original: 'mixed media, 53 × 65 cm, 2013', img: 'blossoming',
    alt: 'A rugged peak in thick, textured layers of white, ochre and violet against a blue-to-purple sky',
  },
  {
    slug: 'heartbeat-of-the-rock', series: 'landscapes',
    title: 'Heartbeat of the Rock', zh: '岩石的心跳', year: '2013',
    sheet: [100, 60], original: 'mixed media, 45 × 80 cm, 2013', img: 'heartbeat', featured: true,
    alt: 'A long rocky ridge in thick white and ochre layers under a swirling blue and violet sky',
  },
  {
    slug: 'white-waves', series: 'landscapes',
    title: 'White Waves', zh: '白浪', year: '2013',
    sheet: [100, 60], original: 'mixed media, 45 × 80 cm, 2013', img: 'whitewave', featured: true,
    alt: 'A mountain landscape in thick mixed media',
  },
  {
    slug: 'homage-to-botticelli-two-messengers', series: 'homages',
    title: 'Homage to Botticelli: Two Messengers', zh: '致敬波提切利——两个使者', year: '2011',
    sheet: [45, 64], original: 'ink on paper, 85 × 60 cm, 2011', img: 'botticelli',
    alt: 'Ink drawing on tan paper of two robed messengers holding staffs, after Botticelli',
  },
  {
    slug: 'homage-to-leonardo-book-and-hands', series: 'homages',
    title: 'Homage to Leonardo: Book and Hands', zh: '致敬达·芬奇——书与手', year: '2011',
    sheet: [64, 45], original: 'ink on paper, 60 × 85 cm, 2011', img: 'davinci', featured: true,
    alt: 'Ink drawing of hands and a book, after Leonardo',
  },
  {
    slug: 'homage-to-melozzo-angel-with-a-lute', series: 'homages',
    title: 'Homage to Melozzo: Angel with a Lute', zh: '致敬佛鲁里——弹琴天使', year: '2011',
    sheet: [45, 64], original: 'ink on paper, 85 × 60 cm, 2011', img: 'angel', featured: true,
    alt: 'Ink drawing of an angel playing a lute, after Melozzo da Forlì',
  },
  {
    slug: 'kiss-of-the-clouds', series: 'homages',
    title: 'Kiss of the Clouds', zh: '云之吻', year: '2011',
    sheet: [45, 64], original: 'ink on paper, 84.5 × 60 cm, 2011', img: 'cloudkiss', featured: true,
    alt: 'Ink figure drawing, Kiss of the Clouds',
  },
  {
    slug: 'awakened-by-love', series: 'homages',
    title: 'Awakened by Love', zh: '被爱神唤醒', year: '2011',
    sheet: [45, 64], original: 'ink on paper, 84.5 × 60 cm, 2011', img: 'awakened',
    alt: 'Ink figure drawing, Awakened by Love',
  },
  {
    slug: 'the-beauty-of-love', series: 'homages',
    title: 'The Beauty of Love', zh: '爱之美', year: '2011',
    sheet: [45, 64], original: 'ink on paper, 84.5 × 60 cm, 2011', img: 'love',
    alt: 'Ink figure drawing, The Beauty of Love',
  },
];

// Wording follows instagram/海外展览素材与文案原则.md: venue only where two sources agree; never "solo" or "first".
export const exhibitions = [
  { year: '2015', title: 'Oriental Renaissance', venue: 'Palazzo Medici', city: 'Florence', type: 'Exhibition' },
  { year: '2014', title: 'Inspiration from the Plateau', city: 'Vancouver', type: 'Group exhibition' },
  { year: '2012', title: 'London Olympic Fine Art', city: 'London', type: 'Group exhibition' },
  { year: '2012', title: 'The Revival of Tradition: Chinese Contemporary Art', city: 'London', type: 'Group exhibition' },
  { year: '2012', title: 'Chinese painting special exhibition', city: 'Paris', type: 'Group exhibition' },
  { year: '2009', title: 'Chinese Art Around the World', city: 'Paris · Frankfurt', type: 'Group exhibition' },
  { year: '2001', title: 'Los Angeles Biennial', city: 'Los Angeles', type: 'Group exhibition' },
  { year: '2000', title: 'Chinese Contemporary Art', city: 'Vienna', type: 'Group exhibition' },
  { year: '1996', title: 'Awakening China', city: 'Bonn', type: 'Group exhibition' },
  { year: '1993', title: 'China’s New Art, Post-1989', venue: 'Later toured abroad', city: 'Hong Kong', type: 'Group exhibition' },
  { year: '1988', title: 'Towards the Future', city: 'Gothenburg', type: 'Group exhibition' },
];

export const cities = [
  ['Florence', '2015'], ['London', '2012'], ['Paris', '2009 · 2012'], ['Vienna', '2000'],
  ['Bonn', '1996'], ['Gothenburg', '1988 · 1995'], ['Hong Kong', '1993'], ['Los Angeles', '2001'],
];

// ---------- Chinese (中文版) ----------
// Wording rules: 不写升值/投资/回报/保值/增值/稀缺; 不叫“版画原作”; exhibition names follow
// instagram/海外展览素材与文案原则.md (group shows stay 群展, no venue unless two sources agree).

export const siteZh = {
  description: '丁方亲笔签名、编号的限量版作品：神圣山水系列与致敬文艺复兴系列。价格请询。',
};

export const editionZh = {
  medium: '纸本印刷作品［工艺待确认］',
  size: '限量［100］版，艺术家亲笔签名并编号',
  condition: '未装框，从未装裱',
  shipsFrom: '北京发货，全程保价',
};

export const seriesZh = {
  landscapes: {
    name: '神圣山水',
    label: '神圣山水',
    blurb: '山峰与山脊以厚涂层层堆起，再罩上一层薄而透明的色彩。',
    about: [
      '在丁方的“神圣山水”里，山从来不只是风景。他先用水性材料像岩层一样层层堆积，再以薄油彩罩染，山峰仿佛从画面本身升起。',
      '他把亚洲的高山、高原与河流称为一种“精神地理”。这一系列源于他上世纪八十年代徒步走过中国的高原、峭壁与河谷。',
    ],
  },
  homages: {
    name: '致敬文艺复兴',
    label: '致敬与水墨人物',
    blurb: '与波提切利、达·芬奇和佛鲁里笔下的天使对话的水墨人物。',
    about: [
      '与山水并行的，是他的另一条创作线索：与意大利文艺复兴大师对话的纸本水墨，东方与西方在同一张纸上相遇。',
      '这些作品创作于 2011 年和 2012 年，以浓重的焦墨画在纸上。',
    ],
  },
};

// Per-work Chinese text, keyed by slug.
export const worksZh = {
  'high-mountains-rising-from-clear-water': {
    alt: '紫蓝色天空下，白色山顶从厚重堆叠的岩层中升起',
    quote: '近看，画面破碎而起伏；退后几步，便成了山与水。',
  },
  'blossoming-peaks': { alt: '蓝紫色天空下，一座以白、赭、紫厚涂层层堆起的嶙峋山峰' },
  'heartbeat-of-the-rock': { alt: '涡旋的蓝紫色天空下，一道白色与赭色厚涂的长长岩脊' },
  'white-waves': { alt: '以厚重综合材料画成的山景' },
  'homage-to-botticelli-two-messengers': { alt: '黄褐色纸上的水墨：两位身着长袍、手持权杖的使者，取自波提切利' },
  'homage-to-leonardo-book-and-hands': { alt: '水墨画：双手与书，取自达·芬奇' },
  'homage-to-melozzo-angel-with-a-lute': { alt: '水墨画：弹奏鲁特琴的天使，取自佛鲁里' },
  'kiss-of-the-clouds': { alt: '水墨人物画《云之吻》' },
  'awakened-by-love': { alt: '水墨人物画《被爱神唤醒》' },
  'the-beauty-of-love': { alt: '水墨人物画《爱之美》' },
};

// "mixed media, 45 × 80 cm, 2013" -> "综合材料，45 × 80 cm，2013"
export const originalZh = (s) =>
  s.replace('mixed media', '综合材料').replace('ink on paper', '纸本水墨').replace(/, /g, '，');

// Same order as `exhibitions`.
export const exhibitionsZh = [
  { title: '文艺复兴在东方——丁方美第奇宫学术展', venue: '美第奇宫', city: '佛罗伦萨', type: '展览' },
  { title: '加拿大·中国西藏文化周“灵感高原”绘画唐卡展', city: '温哥华', type: '群展' },
  { title: '2012 伦敦奥林匹克美术大会', city: '伦敦', type: '群展' },
  { title: '传统的复活——中国当代艺术展', city: '伦敦', type: '群展' },
  { title: '中国画画世界法国巴黎特展', city: '巴黎', type: '群展' },
  { title: '中国美术世界行', city: '巴黎 · 法兰克福', type: '群展' },
  { title: '洛杉矶双年展', city: '洛杉矶', type: '群展' },
  { title: '中国当代艺术展', city: '维也纳', type: '群展' },
  { title: '“觉醒的中国”现代艺术展', city: '波恩', type: '群展' },
  { title: '后八九中国新艺术', venue: '之后到海外巡展', city: '香港', type: '群展' },
  { title: '走向未来画展', city: '哥德堡', type: '群展' },
];

export const citiesZh = ['佛罗伦萨', '伦敦', '巴黎', '维也纳', '波恩', '哥德堡', '香港', '洛杉矶'];
