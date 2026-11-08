# Oriental Renaissance · 丁方版画网站

面向海外的英文作品网站：只展示和询价，不带支付。设计稿在 Claude Design：https://claude.ai/artifact/DdwDZE5rvFq8nJsFWbmV9s

## 怎么改内容

- 作品、系列介绍、展览：`src/data.mjs`。新增作品就照着已有条目加一条，图片放进 `public/img/works/`（大图 `名字.jpg`，小图 `名字-sm.jpg`，长边约 900px）。
- 联系邮箱、域名、表单地址：`src/data.mjs` 顶部的 `site`。
- 样式：`src/assets/site.css`；交互（轮播、筛选、菜单、表单）：`src/assets/site.js`；页面结构：`src/build.mjs`。
- 方括号 `[ ]` 里的是还没确认的内容，上线前要换掉。

## 本地预览

```bash
npm run dev
```

打开 http://localhost:4321 。不需要安装任何依赖（Node 18 以上）。

## 上线

Vercel 直接读 `vercel.json`：构建命令 `npm run build`，输出目录 `dist/`。

## 表单

`site.formEndpoint` 为空时，询价和订阅表单会打开访客的邮件程序，发到 `site.email`。以后接 Formspree 之类的表单服务，把地址填进 `formEndpoint` 即可。
