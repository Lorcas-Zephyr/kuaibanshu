# 陕西快板书体验一条龙

这是一个可直接部署到 GitHub Pages 的静态网页。网站由首页、点位地图和数字人三个页面组成。页面优先使用高德地图 Web JS API，加载失败时自动回退到项目内置 SVG 地图；包含四个点位、地图内介绍卡片、Word 文档图片和完整路线交互；音频模块已按需求移除。

## 本地预览

直接双击 `index.html` 即可预览，也可以在当前目录启动任意静态服务器：

```bash
python -m http.server 8080
```

## 部署到 GitHub Pages

1. 新建 GitHub 仓库，把 `index.html`、`map.html`、`digital-human.html`、`styles.css`、`app.js`、`assets` 和 `README.md` 推送到仓库根目录。
2. 在仓库 Settings → Pages 中选择 `Deploy from a branch`，分支选 `main`，目录选 `/ (root)`。
3. 等待 GitHub Pages 发布后，先用 `https://用户名.github.io/仓库名/` 访问。
4. 绑定域名时，在仓库根目录新增一个名为 `CNAME` 的纯文本文件，内容只写你的域名，例如 `map.example.com`。
5. 在域名 DNS 中添加：`map` 的 CNAME 指向 `用户名.github.io`。如果使用根域名，则按域名服务商要求配置 GitHub Pages 提供的 A 记录。
6. 回到 Settings → Pages 勾选强制 HTTPS。

上线前需要在高德控制台把 Web Key 的域名白名单配置为本地域名和正式域名，并核验 `app.js` 中的点位位置和正式图片。人民剧院简介已根据文档写入页面。高德加载失败时仍可使用本地 SVG 地图和路线。

