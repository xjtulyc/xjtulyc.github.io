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
      cv: "pdf/youcheng_li_cv.pdf",
      cvEnglish: "pdf/youcheng_li_cv.pdf",
      cvChinese: "pdf/youcheng_li_cv_ch.pdf"
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
        text: "My research focuses on the application of machine learning, computer vision, generative models, and reasoning systems in biomedical engineering. I am particularly interested in developing AI-powered medical diagnosis systems and benchmarks that can make healthcare more accessible, accurate, and interpretable."
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
        "Medical Image Analysis",
        "Chain-of-Thought Reasoning"
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
        date: "Jun 2026",
        title: "MammoExpert accepted to KDD 2026 AI4Sciences Track",
        content: "Our work \"MammoExpert: Benchmarking Chain-of-Thought Reasoning in Mammography Diagnosis\" has been accepted to the KDD 2026 AI4Sciences Track.",
        link: {
          url: "https://arxiv.org/abs/2606.21119",
          text: "Read Paper →"
        },
        type: "publication"
      },
      {
        date: "Apr 2026",
        title: "🔥BUSGen published in Nature Biomedical Engineering🔥",
        content: "Our work \"A foundation generative model for breast ultrasound image analysis\" has been published in Nature Biomedical Engineering.",
        link: {
          url: "https://www.nature.com/articles/s41551-026-01639-1",
          text: "Read Paper →"
        },
        type: "publication"
      },
      {
        date: "Sept 2025",
        title: "Breast Ultrasound Chain-of-Thought Dataset Released",
        content: "We are excited to announce the release of the Breast Ultrasound Chain-of-Thought Dataset, a valuable resource for advancing research in breast ultrasound analysis.",
        link: {
          url: "https://www.arxiv.org/abs/2509.17046",
          text: "Read Paper →"
        },
        type: "publication"
      },
      {
        date: "Jan 2025",
        title: "BUSGen preprint released",
        content: "Our work \"A Foundational Generative Model for Breast Ultrasound Image Analysis\" has been released as a preprint, featuring the first foundational model for breast ultrasound analysis.",
        link: {
          url: "https://arxiv.org/abs/2501.06869",
          text: "Read Paper →"
        },
        type: "publication"
      },
      {
        date: "Apr 2025",
        title: "Scientific Reports Publication",
        content: "Our collaborative work on AI-assisted classification of breast ultrasound glandular tissue components has been published in Scientific Reports (Nature).",
        link: {
          url: "https://www.nature.com/articles/s41598-025-95871-5",
          text: "Read Paper →"
        },
        type: "publication"
      },
      {
        date: "Dec 2024",
        title: "National Digital Health Innovation Competition First Prize",
        content: "Our team won the first prize in the 2nd National Digital Health Innovation Application Competition organized by the National Health Commission. Our project \"Differentiation of Breast Ductal Carcinoma In Situ and Fibroadenoma Based on Conventional Ultrasound Images\" stood out among 265 finalist teams.",
        link: {
          url: "https://mp.weixin.qq.com/s/fJIdh25YOHuIbezn_XZSDQ",
          text: "Read News →"
        },
        type: "award"
      },
      {
        date: "Oct 2024",
        title: "National Scholarship Award",
        content: "I am honored to receive the National Scholarship for my research contributions.",
        type: "award"
      },
      {
        date: "Jul 2024",
        title: "TAILOR Pipeline Published",
        content: "Our work \"Knowledge-driven AI-generated data for accurate and interpretable breast ultrasound diagnoses\" is now available on arXiv, introducing the TAILOR pipeline for medical data generation.",
        link: {
          url: "https://arxiv.org/abs/2407.16634",
          text: "Read Paper →"
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
        title: "BUSGen: Foundational Generative Model for Breast Ultrasound",
        semanticScholarId: "DOI:10.1038/s41551-026-01639-1",
        description: "The first foundational generative model specifically designed for breast ultrasound image analysis. Pretrained on over 3.5 million breast ultrasound images, BUSGen has acquired extensive knowledge of breast structures, pathological features, and clinical variations. Outperformed all board-certified radiologists with 16.5% sensitivity improvement.",
        image: "pub/BUSGen.png",
        tags: ["Medical AI", "Generative AI"],
        links: [
          {
            type: "journal",
            url: "https://www.nature.com/articles/s41551-026-01639-1",
            text: "Nature BME"
          },
          {
            type: "demo",
            url: "./demo/BUSGen/index.html",
            text: "Demo"
          }
        ],
        highlight: true
      },
      {
        title: "A Chain-of-thought Reasoning Breast Ultrasound Dataset Covering All Histopathology Categories",
        semanticScholarId: "ARXIV:2509.17046",
        description: "Breast ultrasound (BUS) is an essential tool for diagnosing breast lesions, with millions of examinations per year. However, publicly available high-quality BUS benchmarks for AI development are limited in data scale and annotation richness. In this work, we present BUS-CoT, a BUS dataset for chain-of-thought (CoT) reasoning analysis, which contains 11,439 images of 10,019 lesions from 4,838 patients and covers all 99 histopathology types. To facilitate research on incentivizing CoT reasoning, we construct the reasoning processes based on observation, feature, diagnosis and pathology labels, annotated and verified by experienced experts. Moreover, by covering lesions of all histopathology types, we aim to facilitate robust AI systems in rare cases, which can be error-prone in clinical practice.",
        image: "pub/BUSCoT.png",
        tags: ["Medical AI", "Dataset"],
        links: [
          {
            type: "arxiv",
            url: "https://www.arxiv.org/abs/2509.17046",
            text: "arXiv"
          },
          {
            type: "dataset",
            url: "https://figshare.com/articles/dataset/A_Chain-of-thought_Reasoning_Breast_Ultrasound_Dataset_Covering_All_Histopathology_Categories/29036876/1?file=54466433",
            text: "Dataset"
          }
        ],
        highlight: true
      },
      {
        title: "UltraDet: Real-time Ultrasound Lesion Detection",
        semanticScholarId: "DOI:10.1007/978-3-031-43987-2_1",
        description: "Mining negative temporal contexts for false positive suppression in real-time ultrasound lesion detection. This model leverages temporal information from video sequences to significantly reduce false positives while maintaining real-time inference speed.",
        image: "pub/UltraDet.png",
        tags: ["Medical AI", "Computer Vision"],
        links: [
          {
            type: "paper",
            url: "https://link.springer.com/chapter/10.1007/978-3-031-43987-2_1",
            text: "MICCAI 2023"
          },
          {
            type: "arxiv",
            url: "https://arxiv.org/abs/2305.18060",
            text: "arXiv"
          }
        ],
        citations: 4
      },
      {
        title: "TAILOR: Knowledge-driven AI-generated Data Pipeline",
        semanticScholarId: "ARXIV:2407.16634",
        description: "A pipeline that builds knowledge-driven generative models to produce tailored synthetic data for rare medical cases. Using 3,749 lesions as source data, can generate millions of breast-US images, especially for error-prone rare cases like DCIS.",
        image: "pub/TAILOR.png",
        tags: ["Medical AI", "Generative AI"],
        links: [
          {
            type: "arxiv",
            url: "https://arxiv.org/abs/2407.16634",
            text: "arXiv"
          }
        ],
        citations: 5
      },
      {
        title: "ST-CellSeg: Spatial Transcriptomics Cell Segmentation",
        semanticScholarId: "DOI:10.1371/journal.pcbi.1012254",
        description: "An image-based machine learning method for spatial transcriptomics that uses manifold for cell segmentation. Novel in its consideration of multi-scale information, significantly outperforms baseline models in ARI, NMI, and Silhouette coefficient metrics.",
        image: "pub/STCellSeg.png",
        tags: ["Computer Vision", "Machine Learning"],
        links: [
          {
            type: "paper",
            url: "https://journals.plos.org/ploscompbiol/article?id=10.1371/journal.pcbi.1012254",
            text: "PLOS Comp Bio"
          }
        ],
        citations: 3
      }
    ],

    // 出版物列表
    publications: [
      {
        year: "2026",
        items: [
          {
            title: "MammoExpert: Benchmarking Chain-of-Thought Reasoning in Mammography Diagnosis",
            semanticScholarId: "ARXIV:2606.21119",
            authors: ["Di Dai", "Bo Liu", "Youcheng Li", "Haojun Yu", "Zhuohang Bian", "Quanlin Wu", "Dong Wang", "Sichen Meng", "Hongye Xuan", "Zijie Lan", "Shenda Hong", "Liwei Wang"],
            coFirst: ["Di Dai", "Bo Liu", "Youcheng Li", "Haojun Yu"],
            venue: "Proceedings of the 32nd ACM SIGKDD Conference on Knowledge Discovery and Data Mining (KDD 2026), AI4Sciences Track",
            publisher: "ACM",
            date: "June 2026",
            links: [
              {
                type: "arxiv",
                url: "https://arxiv.org/abs/2606.21119"
              },
              {
                type: "pdf",
                url: "https://arxiv.org/pdf/2606.21119"
              },
              {
                type: "code",
                url: "https://github.com/Ericdd90/MammoExpert",
                text: "Code & Dataset"
              }
            ],
            tags: ["Medical AI", "Mammography", "Chain-of-Thought", "Dataset"],
            highlight: true
          }
        ]
      },
      {
        year: "2025",
        items: [
          {
            title: "A Chain-of-thought Reasoning Breast Ultrasound Dataset Covering All Histopathology Categories",
            semanticScholarId: "ARXIV:2509.17046",
            authors: ["Haojun Yu", "Youcheng Li", "et al."],
            venue: "arXiv preprint arXiv:2509.17046",
            date: "January 2025",
            links: [
              {
                type: "arxiv",
                url: "https://arxiv.org/abs/2509.17046"
              },
              {
                type: "pdf",
                url: "https://arxiv.org/pdf/2509.17046"
              },
              {
                type: "dataset",
                url: "https://figshare.com/articles/dataset/A_Chain-of-thought_Reasoning_Breast_Ultrasound_Dataset_Covering_All_Histopathology_Categories/29036876/1?file=54466433",
                text: "Dataset"
              }
            ],
            tags: ["Medical AI", "Dataset"],
            highlight: true
          },
          {
            title: "A foundation generative model for breast ultrasound image analysis",
            semanticScholarId: "DOI:10.1038/s41551-026-01639-1",
            authors: ["Haojun Yu", "Youcheng Li", "Nan Zhang", "Zihan Niu", "Xuantong Gong", "Yanwen Luo", "et al."],
            venue: "Nature Biomedical Engineering",
            date: "April 2026",
            links: [
              {
                type: "journal",
                url: "https://www.nature.com/articles/s41551-026-01639-1",
                text: "Nature BME"
              },
              {
                type: "pdf",
                url: "https://arxiv.org/pdf/2501.06869"
              },
              {
                type: "demo",
                url: "./demo/BUSGen/index.html",
                text: "Online Demo"
              }
            ],
            tags: ["Medical AI", "Generative AI"],
            highlight: true
          },
          {
            title: "Using artificial intelligence system for assisting the classification of breast ultrasound glandular tissue components in dense breast tissue",
            semanticScholarId: "DOI:10.1038/s41598-025-95871-5",
            authors: ["Hongju Yan", "Chaochao Dai", "Xiaojing Xu", "et al."],
            venue: "Scientific Reports",
            volume: "15",
            issue: "1",
            pages: "11754",
            date: "April 2025",
            links: [
              {
                type: "journal",
                url: "https://www.nature.com/articles/s41598-025-95871-5"
              }
            ],
            tags: ["Medical AI"],
            citations: 1
          }
        ]
      },
      {
        year: "2024",
        items: [
          {
            title: "Knowledge-driven AI-generated data for accurate and interpretable breast ultrasound diagnoses",
            semanticScholarId: "ARXIV:2407.16634",
            authors: ["Haojun Yu", "Youcheng Li", "Nan Zhang", "Zihan Niu", "Xuantong Gong", "Yanwen Luo", "et al."],
            venue: "arXiv preprint arXiv:2407.16634",
            date: "July 2024",
            links: [
              {
                type: "arxiv",
                url: "https://arxiv.org/abs/2407.16634"
              },
              {
                type: "pdf",
                url: "https://arxiv.org/pdf/2407.16634"
              }
            ],
            tags: ["Medical AI", "Generative AI"],
            citations: 5
          },
          {
            title: "ST-CellSeg: Cell segmentation for imaging-based spatial transcriptomics using multi-scale manifold learning",
            semanticScholarId: "DOI:10.1371/journal.pcbi.1012254",
            authors: ["Youcheng Li", "Leann Lac", "Qian Liu", "Pingzhao Hu"],
            venue: "PLOS Computational Biology",
            volume: "20",
            issue: "6",
            pages: "e1012254",
            date: "June 2024",
            links: [
              {
                type: "journal",
                url: "https://journals.plos.org/ploscompbiol/article?id=10.1371/journal.pcbi.1012254"
              }
            ],
            tags: ["Computer Vision", "Machine Learning"],
            citations: 3
          }
        ]
      },
      {
        year: "2023",
        items: [
          {
            title: "Mining Negative Temporal Contexts For False Positive Suppression In Real-Time Ultrasound Lesion Detection",
            semanticScholarId: "DOI:10.1007/978-3-031-43987-2_1",
            authors: ["Haojun Yu", "Youcheng Li", "QuanLin Wu", "Ziwei Zhao", "Dengbo Chen", "Dong Wang", "Liwei Wang"],
            venue: "International Conference on Medical Image Computing and Computer-Assisted Intervention (MICCAI 2023)",
            publisher: "Springer Nature Switzerland",
            pages: "3-13",
            date: "October 2023",
            links: [
              {
                type: "conference",
                url: "https://link.springer.com/chapter/10.1007/978-3-031-43987-2_1"
              },
              {
                type: "arxiv",
                url: "https://arxiv.org/abs/2305.18060"
              },
              {
                type: "pdf",
                url: "https://arxiv.org/pdf/2305.18060"
              }
            ],
            tags: ["Medical AI", "Computer Vision"],
            citations: 4,
            highlight: true
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
        name: "Huawei Scholarship",
        year: "2025",
        type: "scholarship"
      },
      {
        name: "National Digital Health Innovation Competition First Prize",
        year: "2024",
        type: "competition"
      },
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
      }
    ],

    talks: [
      {
        title: "AI in Medical Diagnosis: Current Trends and Future Directions",
        venue: "PKU AI Workshop",
        date: "Sep 2024",
        type: "invited",
        description: "Overview of current AI applications in medical diagnosis and emerging opportunities."
      },
      {
        title: "Deep Learning for Medical Imaging: Challenges and Solutions",
        venue: "PKU AI Workshop",
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
