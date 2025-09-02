# 🎯 个人学术主页配置系统

## 概述

这是一个完全可配置的个人学术主页系统，允许您通过编辑单个配置文件来管理整个网站的内容。该系统将内容与展示分离，使维护和更新变得极其简单。

## 🚀 系统特点

- **🎛️ 集中配置**：所有内容在一个 JavaScript 文件中管理
- **🔄 实时更新**：修改配置后立即生效，无需重新编译
- **📱 多页面同步**：一次修改，所有相关页面同时更新
- **🛡️ 类型安全**：结构化配置，减少配置错误
- **📖 详细文档**：完整的中文维护指南
- **🎨 主题一致**：保持网站设计风格统一
- **⚡ 高性能**：客户端渲染，快速响应

## 📁 文件结构

```
📦 配置系统文件
├── 📁 config/
│   └── 📄 site-config.js           # 主配置文件
├── 📁 js/
│   └── 📄 config-loader.js         # 配置加载器
├── 📁 docs/
│   └── 📄 maintenance-guide.md     # 维护指南（中文）
├── 📄 test-config.html            # 配置测试页面
├── 📄 demo-config-usage.html      # 演示页面
└── 📄 README-CONFIG-SYSTEM.md     # 系统说明文档（本文件）
```

## 🔧 快速开始

### 1. 编辑配置文件

打开 `/config/site-config.js` 文件，这是您需要修改的唯一文件：

```javascript
const SITE_CONFIG = {
  // 个人信息
  personal: {
    name: {
      english: "Your Name",
      chinese: "你的中文姓名"
    },
    avatar: "resources/your-avatar.jpg",
    // ... 更多配置
  },
  
  // 新闻动态
  news: {
    items: [
      {
        date: "Dec 2024",
        title: "最新成果",
        content: "成果描述...",
        type: "publication"
      }
    ]
  },
  
  // 出版物
  projects: {
    publications: [
      {
        year: "2024",
        items: [
          {
            title: "论文标题",
            authors: ["作者1", "作者2"],
            venue: "期刊/会议名称"
          }
        ]
      }
    ]
  }
  
  // ... 更多配置部分
};
```

### 2. 保存并查看效果

保存文件后，刷新您的网站即可看到更新的内容。

### 3. 测试配置

访问 `/test-config.html` 页面来验证您的配置是否正确加载。

## 📝 配置详解

### 基础信息配置

```javascript
personal: {
  name: {
    english: "English Name",        // 英文姓名
    chinese: "中文姓名",             // 中文姓名  
    display: "Display Name"         // 主要显示名称
  },
  avatar: "resources/avatar.jpg",   // 头像路径
  position: {
    title: "PhD Candidate",         // 职位
    institution: "University Name", // 机构名称
    department: "Department Name",  // 院系
    supervisor: {
      name: "Prof. Name",           // 导师姓名
      url: "supervisor-homepage"    // 导师主页
    }
  },
  contact: {
    emails: [                       // 邮箱列表
      "email1@university.edu",
      "email2@gmail.com"
    ],
    cv: "pdf/your-cv.pdf"          // 简历路径
  },
  social: [                         // 社交媒体
    {
      name: "Google Scholar",
      icon: "fas fa-graduation-cap",
      url: "https://scholar.google.com/...",
      tooltip: "Google Scholar"
    }
    // 更多社交链接...
  ]
}
```

### 动态新闻配置

```javascript
news: {
  title: "Latest News",
  subtitle: "Recent updates and achievements",
  items: [
    {
      date: "Oct 2024",              // 日期
      title: "重要成果",             // 标题
      content: "成果描述...",        // 内容
      link: {                        // 可选链接
        url: "https://example.com",
        text: "查看详情 →"
      },
      type: "publication"            // 类型：award, publication, media, conference
    }
  ]
}
```

### 研究项目配置

```javascript
projects: {
  title: "Projects & Publications",
  
  // 特色项目
  featured: [
    {
      title: "项目名称",
      description: "项目描述...",
      image: "images/project.png",
      tags: ["标签1", "标签2"],
      links: [
        {
          type: "paper",
          url: "paper-url",
          text: "论文"
        },
        {
          type: "code", 
          url: "github-url",
          text: "代码"
        }
      ]
    }
  ],
  
  // 出版物列表
  publications: [
    {
      year: "2024",
      items: [
        {
          title: "论文标题",
          authors: ["作者1", "作者2", "作者3"],
          venue: "会议或期刊名称",
          date: "发表日期",
          links: [
            {
              type: "arxiv",
              url: "https://arxiv.org/abs/..."
            },
            {
              type: "journal",
              url: "journal-url"
            }
          ],
          tags: ["机器学习", "计算机视觉"]
        }
      ]
    }
  ]
}
```

### 教学经历配置

```javascript
teaching: {
  title: "Teaching & Talks",
  courses: [
    {
      title: "课程名称",
      period: "Spring 2024",
      role: "Teaching Assistant",
      institution: "大学名称",
      description: "课程描述...",
      link: "course-page.html",
      materials: [
        {
          title: "课程资料",
          description: "资料描述",
          items: [
            {
              name: "第一周课件",
              file: "materials/week1.pdf"
            }
          ]
        }
      ]
    }
  ]
}
```

## 🎨 页面定制

### SEO 配置

每个页面都可以有独立的SEO设置：

```javascript
seo: {
  title: "页面标题",
  description: "页面描述",
  keywords: "关键词1, 关键词2",
  
  openGraph: {
    title: "Open Graph 标题",
    description: "Open Graph 描述",
    image: "og-image.jpg"
  },
  
  twitter: {
    card: "summary_large_image",
    title: "Twitter 标题", 
    description: "Twitter 描述"
  }
}
```

### 导航配置

```javascript
navigation: {
  sidebar: [
    {
      id: "about",
      label: "About",
      icon: "fas fa-user",
      href: "#about"
    },
    {
      id: "projects",
      label: "Projects", 
      icon: "fas fa-project-diagram",
      href: "projects.html"
    }
    // 更多导航项...
  ]
}
```

## 🔍 常用图标

系统使用 Font Awesome 图标库：

**学术相关**
- `fas fa-graduation-cap` - 学者帽
- `fas fa-book` - 书籍
- `fas fa-microscope` - 研究
- `fas fa-trophy` - 奖项

**社交媒体**
- `fab fa-github` - GitHub
- `fab fa-google` - Google
- `fab fa-linkedin` - LinkedIn
- `fab fa-twitter` - Twitter
- `fab fa-researchgate` - ResearchGate

**联系方式**
- `fas fa-envelope` - 邮件
- `fas fa-phone` - 电话
- `fas fa-map-marker-alt` - 地址

## 📊 系统测试

### 1. 配置验证

访问 `test-config.html` 进行配置完整性检查。

### 2. 演示效果

访问 `demo-config-usage.html` 查看配置系统的实际效果。

### 3. 浏览器控制台

检查浏览器开发者工具的控制台，确保没有JavaScript错误。

## 🛠️ 维护指南

### 添加新内容的步骤

1. **添加新闻**：在 `news.items` 数组开头添加新项
2. **添加论文**：在相应年份的 `publications[].items` 中添加
3. **添加奖项**：在 `awards.items` 数组中添加
4. **更新个人信息**：修改 `personal` 对象
5. **添加课程**：在 `teaching.courses` 中添加新课程

### 备份和恢复

```bash
# 备份配置文件
cp config/site-config.js config/site-config.backup.js

# 恢复配置文件
cp config/site-config.backup.js config/site-config.js
```

### 版本控制

```bash
# 提交配置更改
git add config/site-config.js
git commit -m "Update personal information and recent publications"
git push origin main
```

## ⚠️ 注意事项

### 语法要求

- 保持 JavaScript 对象语法正确
- 字符串用引号包围
- 数组和对象正确闭合
- 注意逗号的使用

### 文件路径

- 所有路径相对于网站根目录
- 图片建议放在 `resources/` 文件夹
- PDF文件建议放在 `pdf/` 文件夹

### 特殊字符

在配置中使用特殊字符时：
- 引号：使用 `\"` 
- 反斜杠：使用 `\\`
- HTML标签：可直接在文本中使用

## 🐞 故障排除

### 常见问题

1. **页面内容不更新**
   - 检查配置文件语法
   - 清除浏览器缓存
   - 查看控制台错误信息

2. **图片无法显示**
   - 确认图片路径正确
   - 检查图片文件是否存在
   - 确保图片格式支持

3. **链接无法访问**
   - 验证URL正确性
   - 检查外部链接有效性
   - 确认内部文件存在

### 调试技巧

```javascript
// 在浏览器控制台中检查配置
console.log(SITE_CONFIG);

// 检查特定部分
console.log(SITE_CONFIG.personal);
console.log(SITE_CONFIG.news.items);

// 使用工具函数获取配置值
console.log(getConfigValue('personal.name.english'));
```

## 📈 扩展功能

### 添加新页面

1. 创建HTML文件
2. 在 `navigation.sidebar` 中添加链接
3. 在 `pages` 配置中添加SEO信息
4. 更新配置加载器支持新页面类型

### 多语言支持

可以扩展配置结构支持多语言：

```javascript
// 扩展示例
content: {
  zh: "中文内容",
  en: "English content"
}
```

### 主题定制

在CSS文件中定义自定义样式，配置文件可以包含主题相关的配置。

## 📞 技术支持

如需帮助：

1. 查看 `docs/maintenance-guide.md` 详细文档
2. 访问测试页面进行诊断
3. 检查浏览器控制台错误
4. 联系系统维护人员

## 📝 更新日志

- **v1.0.0** (2024-12) - 初始版本发布
  - 完整的配置系统
  - 多页面支持
  - 中文维护文档
  - 测试和演示页面

---

**系统作者**：Claude Code Assistant  
**最后更新**：2024年12月  
**版本**：1.0.0

> 💡 **提示**：定期备份您的配置文件，并在重大更改前进行测试。