import type { LanguageCode } from "@/data/portfolio";

// Copy for the Web 2 sections that sit below the (unchanged) hero.
// Facts stay aligned with portfolio.ts — nothing here claims more than the evidence supports.

export const cinematicVideos = {
  desk: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4",
  window: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260713_140751_abc85684-bfd2-459d-b87b-ce808ede692b.mp4",
} as const;

export type Place = {
  id: "jinan" | "beijing" | "bristol";
  city: string;
  country: string;
  timeZone: string;
  years: string;
  headline: string;
  lines: string[];
  hue: "amber" | "rose" | "azure";
};

export type Web2Copy = {
  statement: {
    eyebrow: string;
    words: string;
    accent: string;
  };
  numbers: {
    eyebrow: string;
    title: string;
  };
  strengths: {
    eyebrow: string;
    title: string;
    tiles: { kicker: string; title: string; body: string }[];
  };
  deskFilm: {
    eyebrow: string;
    titleLead: string;
    titleAccent: string;
    body: string;
    caption: string;
  };
  places: {
    eyebrow: string;
    titleLines: [string, string];
    body: string;
    localTimeLabel: string;
    items: Place[];
  };
  finale: {
    eyebrow: string;
    titleLead: string;
    titleAccent: string;
    titleTail: string;
    body: string;
    availability: string;
  };
};

const en: Web2Copy = {
  statement: {
    eyebrow: "In one sentence",
    words:
      "I take the messy exports nobody wants to open, clean them with SQL and Python, and turn them into reporting that finance and business teams can actually",
    accent: "use.",
  },
  numbers: {
    eyebrow: "By the numbers",
    title: "Real datasets. Checked row by row.",
  },
  strengths: {
    eyebrow: "Why me",
    title: "Four things I bring to an analyst team.",
    tiles: [
      {
        kicker: "Foundation",
        title: "Finance first.",
        body: "International trade and financial risk management training — useful for KPIs, reporting and commercial context.",
      },
      {
        kicker: "Craft",
        title: "Clean data, honestly.",
        body: "Validation rules, issue flags and analysis-ready tables across million-row datasets.",
      },
      {
        kicker: "Focus",
        title: "Questions before charts.",
        body: "Every project starts from a business question and ends with a decision-ready narrative.",
      },
      {
        kicker: "Voice",
        title: "Two languages. One story.",
        body: "Native Chinese, English-taught postgraduate study, and comfort explaining numbers to non-analysts.",
      },
    ],
  },
  deskFilm: {
    eyebrow: "The work",
    titleLead: "Built at a desk,",
    titleAccent: "one dataset at a time.",
    body:
      "Three case studies from real SQL, Python and research files — plus a product concept and the small tools I build on the side.",
    caption: "Scroll to explore the projects",
  },
  places: {
    eyebrow: "Where I've worked and studied",
    titleLines: ["Three cities.", "One standard of work."],
    body: "From internships in Jinan to economics in Beijing and big-data study in Bristol — each city holds a chapter.",
    localTimeLabel: "Local time",
    items: [
      {
        id: "jinan",
        city: "Jinan",
        country: "China",
        timeZone: "Asia/Shanghai",
        years: "2021 · 2025",
        headline: "Two internships",
        lines: ["Data Analysis Intern — Licheng Holdings Group", "Sales Intern — Aerospace Information (Shandong)"],
        hue: "amber",
      },
      {
        id: "beijing",
        city: "Beijing",
        country: "China",
        timeZone: "Asia/Shanghai",
        years: "2021 — 2025",
        headline: "Undergraduate",
        lines: ["Central University of Finance and Economics", "International Trade · Financial Risk Management", "GPA 87.36 / 100"],
        hue: "rose",
      },
      {
        id: "bristol",
        city: "Bristol",
        country: "United Kingdom",
        timeZone: "Europe/London",
        years: "2025 — 2026",
        headline: "Postgraduate",
        lines: ["University of Bristol", "MSc Management (Digitalisation and Big Data)", "Applied Extended Project research"],
        hue: "azure",
      },
    ],
  },
  finale: {
    eyebrow: "Contact",
    titleLead: "Let's turn your data into",
    titleAccent: "something clear",
    titleTail: "together.",
    body: "Open to data analyst, BI analyst, business analyst, finance analyst and graduate scheme opportunities in the UK.",
    availability: "Available from October 2026 · Based in Bristol",
  },
};

const zh: Web2Copy = {
  statement: {
    eyebrow: "一句话介绍",
    words: "我把没人愿意打开的杂乱数据，用 SQL 和 Python 清洗整理，变成财务与业务团队真正",
    accent: "用得上的报告。",
  },
  numbers: {
    eyebrow: "数据说话",
    title: "真实数据集，逐行校验。",
  },
  strengths: {
    eyebrow: "我的优势",
    title: "我能为分析团队带来的四件事。",
    tiles: [
      {
        kicker: "底色",
        title: "金融出身。",
        body: "国际贸易与金融风险管理训练，让我更懂 KPI、报表口径与商业语境。",
      },
      {
        kicker: "功底",
        title: "认真清洗数据。",
        body: "在百万级数据集上建立校验规则、问题标记与可分析的数据表。",
      },
      {
        kicker: "思路",
        title: "先问题，后图表。",
        body: "每个项目都从业务问题出发，最终落到可支持决策的结论。",
      },
      {
        kicker: "表达",
        title: "双语，讲清楚。",
        body: "中文母语，英文授课硕士，习惯把数字讲给非技术同事听。",
      },
    ],
  },
  deskFilm: {
    eyebrow: "作品",
    titleLead: "在书桌前，",
    titleAccent: "一个数据集一个数据集地打磨。",
    body: "三个基于真实 SQL、Python 与研究文件的案例，以及一个产品概念和若干业余小工具。",
    caption: "继续向下浏览项目",
  },
  places: {
    eyebrow: "学习与工作的城市",
    titleLines: ["三座城市，", "同一种做事标准。"],
    body: "从济南的实习，到北京的经济学本科，再到布里斯托的大数据硕士——每座城市都是一段经历。",
    localTimeLabel: "当地时间",
    items: [
      {
        id: "jinan",
        city: "济南",
        country: "中国",
        timeZone: "Asia/Shanghai",
        years: "2021 · 2025",
        headline: "两段实习",
        lines: ["数据分析实习生 — Licheng Holdings Group", "销售实习生 — Aerospace Information (Shandong)"],
        hue: "amber",
      },
      {
        id: "beijing",
        city: "北京",
        country: "中国",
        timeZone: "Asia/Shanghai",
        years: "2021 — 2025",
        headline: "本科",
        lines: ["中央财经大学", "国际经济与贸易 · 金融风险管理", "GPA 87.36 / 100"],
        hue: "rose",
      },
      {
        id: "bristol",
        city: "布里斯托",
        country: "英国",
        timeZone: "Europe/London",
        years: "2025 — 2026",
        headline: "硕士",
        lines: ["布里斯托大学", "Management (Digitalisation and Big Data) 硕士", "Applied Extended Project 应用研究"],
        hue: "azure",
      },
    ],
  },
  finale: {
    eyebrow: "联系我",
    titleLead: "一起把数据变成",
    titleAccent: "清晰的答案",
    titleTail: "。",
    body: "正在寻找英国的数据分析、BI 分析、商业分析、金融分析及管培生机会。",
    availability: "2026 年 10 月起可入职 · 现居布里斯托",
  },
};

export const web2ByLanguage: Record<LanguageCode, Web2Copy> = {
  en,
  "zh-CN": zh,
};
