# 博客维护

博客入口为 [`../blog.html`](../blog.html)，文章索引为 [`posts.json`](posts.json)。目前索引为空，两个栏目均没有已发布文章。不要添加虚构文章、阅读量、评论或未经作者确认的观点。

栏目：

- `technical`：技术博客，适合原理推导、论文解读、实验和工程记录。
- `business`：商业判断，适合产品、产业与创业问题的分析。

采用静态 HTML 文章，不需要框架、构建工具或后端。索引页只请求本站 `blog/posts.json`，搜索范围为标题、摘要和标签；没有已发布文章时不显示搜索和年份筛选。

## 发布一篇文章

1. 获得作者提供或确认的文章正文、标题、栏目和发布日期。
2. 在 `blog/` 下创建语义明确的 HTML 文件，例如 `topic-name.html`。不要把草稿加入索引。涉及身份、学术成果及个人链接时仍以 `config/site-config.js` 为准。
3. 参考 `blog.html` 复用网站布局。文章文件位于子目录，CSS、JS、图片及主导航地址须使用 `../` 前缀；博客主页链接为 `../blog.html`。不要在文章页加载 `js/blog.js` 或 `js/dynamic-content-loader.js`。
4. 将正文放入 `<article class="blog-article">`。引入 `../style/refinement.css` 后再引入 `../style/blog.css`；保留主题、手机导航和跳转正文功能。
5. 设置文章自身的 `title`、description、canonical、Open Graph 信息及 `BlogPosting` 结构化数据。发布日期和修改日期必须真实。`author` 为作者确认的署名，不因使用模板自动默认他人署名。
6. 把索引条目加入 `posts.json`。索引使用 JSON 数组，日期必须为真实 `YYYY-MM-DD`，`url` 必须指向本站 `blog/` 内的 `.html` 文件。按日期自动倒序展示，无需手工排序。
7. 更新网站 `sitemap.xml`，本地 HTTP 预览后再发布。若首次加入文章，同步更新 `blog.html` 的 `<noscript>` 提示，最好在其中添加静态文章链接。

单条索引结构（以下是字段示例，不是可发布文章）：

```json
{
  "title": "作者确认后的文章标题",
  "date": "YYYY-MM-DD",
  "category": "technical",
  "summary": "准确概括文章问题与结论的纯文本摘要。",
  "tags": ["主题标签"],
  "url": "blog/topic-name.html"
}
```

所有字段均必填；`tags` 可以是空数组。`title`、`summary` 和 `tags` 只接受纯文本，索引渲染不会将它们解释为 HTML。索引文件缺失或格式错误会显示加载失败状态，避免把错误当成空归档。

## 长文结构

先写清楚问题、动机及结论，再给出推导或证据。适合技术长文的顺序是：问题与背景、符号与假设、方法或推导、实验设置与结果、局限、参考文献。已有文献观点应标明出处，复现实验注明版本、环境、数据、超参数及与原文的差异。

使用一个 `h1` 作为文章标题，正文使用 `h2` 和 `h3`。为长文章手写目录，确保每个锚点真实存在；目录可采用 `.blog-toc`。避免仅为装饰插入过多卡片。

```html
<article class="blog-article">
  <header>
    <h1>文章标题</h1>
    <p class="blog-post-meta"><time datetime="YYYY-MM-DD">YYYY-MM-DD</time></p>
  </header>
  <nav class="blog-toc" aria-label="本文目录">
    <h2>本文目录</h2>
    <ol><li><a href="#problem">问题与背景</a></li></ol>
  </nav>
  <h2 id="problem">问题与背景</h2>
  <!-- 作者确认的正文 -->
</article>
```

代码使用 `<pre><code>`，并转义 `<`、`>` 和 `&`。CSS 已支持横向滚动，不强制折断代码。需要语法高亮时在具体文章页按需加载，并固定已核验的版本。

公式渲染库不在博客首页加载。第一篇需要公式的文章发布时，再选择并核验 MathJax 或 KaTeX 的官方文档和版本，仅在该文章页加载。长公式放入 `.math-block`，表格放入 `.table-scroll`，避免移动端撑破正文。图片使用 `figure` / `figcaption`，提供有意义的 alt 文字、来源和必要授权说明。

## 商业判断的写法

区分已经发生的事实、第三方观点、作者推断及待验证假设。引用数字时写明口径、时间和来源；推断写清前提和反例，不把个案推广为普遍结论。预测说明适用期限，后续重要修订可在文末保留日期与修改原因。

这部分是写作指导，不是作者已发表的立场，不应原样作为文章发布。

## 预览与检查

在仓库根目录运行 `python3 -m http.server 8000`，访问 `http://localhost:8000/blog.html`。

- 检查两个栏目、搜索、年份筛选、清空条件及无结果状态。
- 检查 `?category=technical`、`?category=business`、`?q=关键词&year=年份` 可直接访问。
- 检查 390px 手机及桌面宽度、深浅色、键盘焦点、手机导航和无水平溢出。
- 检查文章链接、正文目录、图片、公式、代码和引用来源。不要把测试文章写入正式 `posts.json`。

组织方式参考 [科学空间](https://kexue.fm/) 的标题、日期、分类、标签和归档，以及其 [浏览指南](https://www.kexue.fm/archives/6508) 对长文公式与响应式阅读的说明。创建时直连返回 403，参考来自搜索索引中的页面文本，未复刻其完整视觉或文章内容。
