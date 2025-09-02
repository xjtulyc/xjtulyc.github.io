/**
 * 个人学术主页配置文件
 * Personal Academic Homepage Configuration
 * 
 * 所有网站内容都在这个文件中配置
 * All website content is configured in this file
 * 
 * @author Youcheng Li
 * @version 1.0.0
 */

const SITE_CONFIG = {
  // ========================================
  // 基本个人信息 / Basic Personal Information
  // ========================================
  personal: {
    // 姓名信息
    name: {
      english: "Youcheng Li",
      chinese: "利友诚",
      display: "Youcheng Li" // 主要显示名称
    },

    // 头像
    avatar: "resources/avatar.jpg",

    // 职位和机构
    position: {
      title: "PhD Candidate",
      institution: "Peking University",
      department: "School of Intelligence Science and Technology",
      departmentUrl: "https://www.cis.pku.edu.cn/",
      supervisor: {
        name: "Prof. Liwei Wang",
        url: "http://www.liweiwang-pku.com/"
      }
    },

    // 联系方式
    contact: {
      emails: [
        "youchengli@stu.pku.edu.cn",
        "1246321319@qq.com"
      ],
      cv: "pdf/youcheng_li_cv.pdf"
    },

    // 社交链接
    social: [
      {
        name: "Google Scholar",
        icon: "fas fa-graduation-cap",
        url: "https://scholar.google.com/citations?hl=zh-CN&user=cRWgAzcAAAAJ",
        tooltip: "Google Scholar"
      },
      {
        name: "GitHub",
        icon: "fab fa-github",
        url: "https://github.com/xjtulyc",
        tooltip: "GitHub"
      },
      {
        name: "ResearchGate",
        icon: "fab fa-researchgate",
        url: "https://www.researchgate.net/profile/Youcheng-Li-2",
        tooltip: "ResearchGate"
      },
      {
        name: "Xiaohongshu",
        icon: "fas fa-book",
        url: "https://www.xiaohongshu.com/user/profile/649ad7e3000000002b009eb5",
        tooltip: "Xiaohongshu"
      },
      {
        name: "LinkedIn",
        icon: "fab fa-linkedin",
        url: "https://www.linkedin.com/in/youcheng-li-121396289/",
        tooltip: "LinkedIn"
      },
      {
        name: "知乎",
        icon: "fab fa-zhihu",
        url: "https://www.zhihu.com/people/yan-cheng-86-84",
        tooltip: "知乎"
      }
    ]
  },

  // ========================================
  // SEO 和元数据 / SEO and Metadata
  // ========================================
  seo: {
    title: "Youcheng Li | PhD Candidate - Peking University",
    description: "Youcheng Li is a PhD candidate at Peking University, specializing in machine learning and computer vision applications in biomedical engineering. Research focus on AI medical diagnosis systems.",
    keywords: "Youcheng Li, 利友诚, Peking University, PKU, Machine Learning, Computer Vision, AI Medical Diagnosis, PhD Candidate",
    author: "Youcheng Li",
    siteUrl: "https://xjtulyc.github.io",

    // Open Graph 数据
    openGraph: {
      title: "Youcheng Li - PhD Candidate at Peking University",
      description: "Research in Machine Learning and Computer Vision for Medical AI",
      image: "resources/avatar.jpg",
      type: "website"
    },

    // Twitter Card 数据
    twitter: {
      card: "summary_large_image",
      title: "Youcheng Li - PhD Candidate",
      description: "Research in ML and Computer Vision for Medical AI",
      image: "resources/avatar.jpg"
    },

    // 结构化数据
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "Youcheng Li",
      "alternateName": "利友诚",
      "jobTitle": "PhD Candidate",
      "worksFor": {
        "@type": "Organization",
        "name": "Peking University",
        "sameAs": "https://www.pku.edu.cn"
      },
      "alumniOf": {
        "@type": "Organization",
        "name": "Xi'an Jiaotong University"
      },
      "email": "youchengli@stu.pku.edu.cn",
      "image": "resources/avatar.jpg",
      "sameAs": [
        "https://scholar.google.com/citations?hl=zh-CN&user=cRWgAzcAAAAJ",
        "https://github.com/xjtulyc",
        "https://www.researchgate.net/profile/Youcheng-Li-2"
      ]
    }
  },

  // ========================================
  // 关于我部分 / About Section
  // ========================================
  about: {
    title: "About Me",
    subtitle: "Research in AI for Medical Diagnosis",

    // 主要介绍内容
    content: [
      {
        type: "paragraph",
        text: "I am a PhD candidate at the <a href=\"https://www.cis.pku.edu.cn/\" target=\"_blank\">School of Intelligence Science and Technology</a>, Peking University, under the supervision of <a href=\"http://www.liweiwang-pku.com/\" target=\"_blank\">Prof. Liwei Wang</a>."
      },
      {
        type: "paragraph",
        text: "My research focuses on the application of machine learning and computer vision in biomedical engineering. I am particularly interested in developing AI-powered medical diagnosis systems that can make healthcare more accessible and accurate."
      }
    ],

    // 研究兴趣
    researchInterests: {
      title: "Research Interests",
      interests: [
        "Machine Learning",
        "Computer Vision",
        "Medical AI",
        "Deep Learning",
        "Biomedical Engineering",
        "Medical Image Analysis"
      ]
    },

    // 使命宣言
    mission: "Develop artificial intelligence medical diagnosis systems for social good."
  },

  // ========================================
  // 新闻动态 / News Section
  // ========================================
  news: {
    title: "Latest News",
    subtitle: "Recent updates and achievements",

    items: [
      {
        date: "Oct 2024",
        title: "National Scholarship Award",
        content: "I am honored to receive the National Scholarship for my research contributions.",
        type: "award"
      },
      {
        date: "Jul 2024",
        title: "New Paper on arXiv",
        content: "Our work \"Knowledge-driven AI-generated data for accurate and interpretable breast ultrasound diagnoses\" is now available on arXiv.",
        link: {
          url: "https://arxiv.org/abs/2407.16634",
          text: "View Article →"
        },
        type: "publication"
      },
      {
        date: "Jul 2024",
        title: "Paper Accepted at PLOS Computational Biology",
        content: "Our work \"ST-CellSeg: Cell segmentation for imaging-based spatial transcriptomics using multi-scale manifold learning\" has been accepted.",
        link: {
          url: "https://journals.plos.org/ploscompbiol/article?id=10.1371/journal.pcbi.1012254",
          text: "View Article →"
        },
        type: "publication"
      },
      {
        date: "Jul 2023",
        title: "Featured in University Promotion",
        content: "Selected as an outstanding student representative for Xi'an Jiaotong University promotion.",
        link: {
          url: "http://news.xjtu.edu.cn/info/1011/198755.htm",
          text: "View Article →"
        },
        type: "media"
      },
      {
        date: "May 2023",
        title: "Paper Accepted at MICCAI 2023",
        content: "Early acceptance of our work \"Mining Negative Temporal Contexts For False Positive Suppression In Real-Time Ultrasound Lesion Detection\".",
        link: {
          url: "https://arxiv.org/abs/2305.18060",
          text: "View Article →"
        },
        type: "publication"
      }
    ]
  },

  // ========================================
  // 研究亮点 / Research Highlights
  // ========================================
  research: {
    title: "Research Highlights",
    subtitle: "Featured research projects and contributions",

    highlights: [
      {
        title: "Medical Image Analysis",
        description: "Developing advanced deep learning models for medical image interpretation, focusing on ultrasound and CT imaging modalities.",
        link: "projects.html"
      },
      {
        title: "AI Diagnosis Systems",
        description: "Building intelligent systems for automated disease detection and diagnosis, with emphasis on accuracy and interpretability.",
        link: "projects.html"
      }
    ]
  },

  // ========================================
  // 项目和出版物 / Projects and Publications
  // ========================================
  projects: {
    title: "Projects & Publications",
    subtitle: "Research projects and academic publications",

    // 特色项目
    featured: [
      {
        title: "UltraDet: Ultrasound Lesion Detection",
        description: "Real-time ultrasound lesion detection using deep learning with temporal context mining.",
        image: "pub/UltraDet.png",
        tags: ["Medical AI", "Computer Vision", "Ultrasound"],
        links: [
          {
            type: "paper",
            url: "https://arxiv.org/abs/2305.18060",
            text: "Paper"
          },
          {
            type: "bibtex",
            url: "pub/UltraDet.bib",
            text: "BibTeX"
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
            title: "Knowledge-driven AI-generated data for accurate and interpretable breast ultrasound diagnoses",
            authors: ["Youcheng Li", "Shang Zhao", "Kwang-Ting Cheng", "Liwei Wang"],
            venue: "arXiv preprint",
            date: "July 2024",
            links: [
              {
                type: "arxiv",
                url: "https://arxiv.org/abs/2407.16634"
              }
            ],
            tags: ["Medical AI", "Ultrasound", "Generative AI"]
          },
          {
            title: "ST-CellSeg: Cell segmentation for imaging-based spatial transcriptomics using multi-scale manifold learning",
            authors: ["Youcheng Li", "et al."],
            venue: "PLOS Computational Biology",
            date: "July 2024",
            links: [
              {
                type: "journal",
                url: "https://journals.plos.org/ploscompbiol/article?id=10.1371/journal.pcbi.1012254"
              }
            ],
            tags: ["Cell Segmentation", "Spatial Transcriptomics", "Manifold Learning"]
          }
        ]
      },
      {
        year: "2023",
        items: [
          {
            title: "Mining Negative Temporal Contexts For False Positive Suppression In Real-Time Ultrasound Lesion Detection",
            authors: ["Youcheng Li", "et al."],
            venue: "MICCAI 2023",
            date: "May 2023",
            links: [
              {
                type: "arxiv",
                url: "https://arxiv.org/abs/2305.18060"
              }
            ],
            tags: ["Medical AI", "Ultrasound", "Lesion Detection"]
          }
        ]
      }
    ]
  },

  // ========================================
  // 奖项荣誉 / Awards and Honors
  // ========================================
  awards: {
    title: "Honors & Awards",
    subtitle: "Recognition and achievements",

    items: [
      {
        name: "National Scholarship",
        year: "2024",
        type: "scholarship"
      },
      {
        name: "Mitacs Globalink Research Internship Award",
        year: "2023",
        type: "fellowship"
      },
      {
        name: "Zheng Guobin Scholarship",
        year: "2022",
        type: "scholarship"
      },
      {
        name: "MEGVII Scholarship",
        year: "2021",
        type: "scholarship"
      },
      {
        name: "National Scholarship",
        year: "2020",
        type: "scholarship"
      }
    ]
  },

  // ========================================
  // 教学经历 / Teaching Experience
  // ========================================
  teaching: {
    title: "Teaching & Talks",
    subtitle: "Academic teaching and presentations",

    courses: [
      {
        title: "Information Theory",
        period: "Spring 2024",
        role: "Teaching Assistant",
        institution: "Peking University",
        description: "Assisted in course instruction and student mentoring for graduate-level information theory course.",
        link: "teaching/information_theory_24_spring.html",
        expanded: false
      },
      {
        title: "Machine Learning",
        period: "Fall 2023",
        role: "Teaching Assistant",
        institution: "Peking University",
        description: "Led tutorial sessions and graded assignments for undergraduate machine learning course.",
        link: "teaching/machine_learning_23_fall.html",
        expanded: false,
        materials: [
          {
            title: "Course Notes",
            description: "Comprehensive lecture notes covering key ML concepts",
            items: [
              { name: "Week 2 - Linear Regression", file: "teaching/machine_learning_notes/2023_Fall_ML_Note__Week_2__Lecture_2_.pdf" },
              { name: "Week 3 - Logistic Regression", file: "teaching/machine_learning_notes/2023_Fall_ML_Note__Week_3__Lecture_3_.pdf" },
              { name: "Week 4 - Decision Trees", file: "teaching/machine_learning_notes/2023_Fall_ML_Note__Week_4__Lecture_4_.pdf" },
              { name: "Week 5 - Neural Networks", file: "teaching/machine_learning_notes/2023_Fall_ML_Note__Week_5__Lecture_5_.pdf" },
              { name: "Week 6 - Support Vector Machines", file: "teaching/machine_learning_notes/2023_Fall_ML_Note__Week_6__Lecture_6_.pdf" },
              { name: "Week 7 - Ensemble Methods", file: "teaching/machine_learning_notes/2023_Fall_ML_Note__Week_7__Lecture_7_.pdf" },
              { name: "Week 8 - Clustering", file: "teaching/machine_learning_notes/2023_Fall_ML_Note__Week_8__Lecture_8_.pdf" },
              { name: "Week 9 - Dimensionality Reduction", file: "teaching/machine_learning_notes/2023_Fall_ML_Note__Week_9__Lecture_9_.pdf" },
              { name: "Week 10 - Deep Learning Basics", file: "teaching/machine_learning_notes/2023_Fall_ML_Note__Week_10__Lecture_10_.pdf" },
              { name: "Week 11 - Convolutional Networks", file: "teaching/machine_learning_notes/2023_Fall_ML_Note__Week_11__Lecture_11_.pdf" },
              { name: "Week 12 - Recurrent Networks", file: "teaching/machine_learning_notes/2023_Fall_ML_Note__Week_12__Lecture_12_.pdf" }
            ]
          }
        ]
      },
      {
        title: "Major Project Guidance",
        period: "Ongoing",
        role: "Mentor",
        institution: "Peking University",
        description: "Mentoring undergraduate students on their major research projects in AI and computer vision.",
        link: "teaching/major_project.html",
        expanded: false
      }
    ],

    talks: [
      {
        title: "AI in Medical Diagnosis: Current Trends and Future Directions",
        venue: "PKU Medical AI Workshop",
        date: "Sep 2024",
        type: "invited",
        description: "Overview of current AI applications in medical diagnosis and emerging opportunities."
      },
      {
        title: "Mining Temporal Context for Medical Image Analysis",
        venue: "MICCAI 2023",
        date: "Oct 2023",
        type: "conference",
        description: "Presentation of our work on temporal context mining for ultrasound lesion detection.",
        link: "https://arxiv.org/abs/2305.18060"
      },
      {
        title: "Deep Learning for Medical Imaging: Challenges and Solutions",
        venue: "Beijing AI Symposium",
        date: "May 2023",
        type: "invited",
        description: "Discussion on current challenges in applying deep learning to medical imaging tasks."
      }
    ]
  },

  // ========================================
  // 资源链接 / Resources and Links
  // ========================================
  resources: {
    title: "Awesome Resources",
    subtitle: "Useful links and resources for research",

    categories: [
      {
        name: "Academic Platforms",
        items: [
          {
            name: "Google Scholar",
            url: "https://scholar.google.com",
            icon: "resources/google-scholar.png",
            description: "Academic paper search and citation tracking"
          },
          {
            name: "ResearchGate",
            url: "https://www.researchgate.net",
            icon: "resources/rg.png",
            description: "Academic social network"
          },
          {
            name: "Semantic Scholar",
            url: "https://www.semanticscholar.org",
            icon: "resources/semantic_scholar.png",
            description: "AI-powered research tool"
          }
        ]
      },
      {
        name: "Code and Data",
        items: [
          {
            name: "GitHub",
            url: "https://github.com",
            icon: "resources/github.png",
            description: "Code repository and collaboration"
          },
          {
            name: "Papers with Code",
            url: "https://paperswithcode.com",
            icon: "resources/paperswithcode.png",
            description: "Machine learning papers with implementation"
          }
        ]
      },
      {
        name: "News and Media",
        items: [
          {
            name: "机器之心",
            url: "https://www.jiqizhixin.com",
            icon: "resources/ml-e1610553826718.jpg",
            description: "AI news and insights in Chinese"
          },
          {
            name: "AI研习社",
            url: "https://www.yanxishe.com",
            icon: "resources/yanxishe.png",
            description: "AI learning community"
          }
        ]
      }
    ]
  },

  // ========================================
  // 导航配置 / Navigation Configuration
  // ========================================
  navigation: {
    // 侧边栏导航
    sidebar: [
      {
        id: "about",
        label: "About",
        icon: "fas fa-user",
        href: "#about"
      },
      {
        id: "news",
        label: "News",
        icon: "fas fa-newspaper",
        href: "#news"
      },
      {
        id: "research",
        label: "Research",
        icon: "fas fa-microscope",
        href: "#research"
      },
      {
        id: "projects",
        label: "Projects",
        icon: "fas fa-project-diagram",
        href: "#projects"
      },
      {
        id: "publications",
        label: "Publications",
        icon: "fas fa-book",
        href: "#publications"
      },
      {
        id: "awards",
        label: "Awards",
        icon: "fas fa-trophy",
        href: "#awards"
      },
      {
        id: "teaching",
        label: "Teaching",
        icon: "fas fa-chalkboard-teacher",
        href: "#teaching"
      },
      {
        id: "talks",
        label: "Talks",
        icon: "fas fa-microphone",
        href: "#talks"
      },
      {
        id: "resources",
        label: "Resources",
        icon: "fas fa-star",
        href: "#resources"
      }
    ]
  },

  // ========================================
  // Single Page App Configuration
  // ========================================
  spa: {
    // 内容显示设置
    displaySettings: {
      news: {
        initialCount: 3,
        expandText: "Show More News",
        collapseText: "Show Less"
      },
      projects: {
        showFilters: true,
        expandable: true,
        initialExpanded: false
      },
      publications: {
        groupByYear: true,
        collapsibleYears: true,
        showTags: true
      },
      teaching: {
        expandableCourses: true,
        showMaterials: true,
        initialExpanded: false
      },
      talks: {
        initialCount: 3,
        expandText: "Show All Talks",
        collapseText: "Show Recent Only"
      },
      resources: {
        collapsibleCategories: true,
        gridLayout: true
      }
    },

    // 滚动和导航设置
    scrollSettings: {
      smoothScroll: true,
      offset: 80, // Header offset
      activeClassThreshold: 100,
      scrollSpyThrottle: 100
    },

    // 动画设置
    animations: {
      fadeInDuration: 600,
      slideToggleDuration: 400,
      scrollDuration: 800,
      staggerDelay: 100
    },

    // 响应式断点
    breakpoints: {
      mobile: 768,
      tablet: 1024,
      desktop: 1200
    }
  },

  // ========================================
  // 页面特定配置 / Page-specific Configuration
  // ========================================
  pages: {
    // 项目页面配置
    projects: {
      seo: {
        title: "Projects & Publications - Youcheng Li",
        description: "Research projects and publications by Youcheng Li in machine learning and medical AI",
        keywords: "Research Projects, Publications, Machine Learning, Medical AI, Computer Vision"
      }
    },

    // 教学页面配置 
    teaching: {
      seo: {
        title: "Teaching & Talks - Youcheng Li",
        description: "Teaching experience and academic talks by Youcheng Li at Peking University",
        keywords: "Teaching, Academic Talks, Machine Learning, Computer Vision, Peking University"
      }
    },

    // 资源页面配置
    resources: {
      seo: {
        title: "Awesome Resources - Youcheng Li",
        description: "Curated list of useful resources for machine learning and AI research",
        keywords: "Resources, Machine Learning, AI Research, Academic Tools"
      }
    }
  }
};

// 导出配置以供其他脚本使用
// Export configuration for use by other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SITE_CONFIG;
}