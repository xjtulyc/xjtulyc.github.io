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
    name: {
      english: "Youcheng Li",
      chinese: "利友诚",
      display: "Youcheng Li"
    },
    avatar: "resources/avatar.jpg",
    position: {
      title: "PhD Candidate",
      institution: "Peking University",
      department: "School of Intelligence Science and Technology",
      departmentUrl: "https://www.cis.pku.edu.cn/",
      supervisor: {
        name: "Prof. Liwei Wang",
        url: "https://www.liweiwang-pku.com/"
      },
      company: {
        name: "Isoplex Intelligence",
        chineseName: "壹索智能",
        role: "Co-founder & CTO",
        url: "https://www.sciland.cn/"
      }
    },
    contact: {
      emails: ["youchengli@stu.pku.edu.cn", "1246321319@qq.com"],
      cv: "pdf/youcheng_li_cv.pdf",
      cvEnglish: "pdf/youcheng_li_cv.pdf",
      cvChinese: "pdf/youcheng_li_cv_ch.pdf"
    },
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
    title: "Youcheng Li | PhD Candidate · Peking University",
    description: "Youcheng Li is a PhD candidate at Peking University researching medical AI, generative foundation models and diagnostic reasoning. Publications, projects, teaching and experience.",
    keywords: "Youcheng Li, 利友诚, Peking University, Medical AI, Generative Models, Diagnostic Reasoning, Scientific Agents, Isoplex Intelligence",
    author: "Youcheng Li",
    siteUrl: "https://youchengli.com",
    openGraph: {
      title: "Youcheng Li | PhD Candidate · Peking University",
      description: "Youcheng Li is a PhD candidate at Peking University researching medical AI, generative foundation models and diagnostic reasoning. Publications, projects, teaching and experience.",
      image: "https://youchengli.com/resources/avatar.jpg",
      type: "website"
    },
    twitter: {
      card: "summary_large_image",
      title: "Youcheng Li | PhD Candidate · Peking University",
      description: "Youcheng Li is a PhD candidate at Peking University researching medical AI, generative foundation models and diagnostic reasoning. Publications, projects, teaching and experience.",
      image: "https://youchengli.com/resources/avatar.jpg"
    },
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Person",
      name: "Youcheng Li",
      alternateName: "利友诚",
      jobTitle: "PhD Candidate",
      worksFor: {
        "@type": "Organization",
        name: "Peking University",
        sameAs: "https://www.pku.edu.cn"
      },
      alumniOf: {
        "@type": "Organization",
        name: "Xi'an Jiaotong University"
      },
      email: "youchengli@stu.pku.edu.cn",
      image: "https://youchengli.com/resources/avatar.jpg",
      sameAs: ["https://scholar.google.com/citations?hl=zh-CN&user=cRWgAzcAAAAJ", "https://github.com/xjtulyc", "https://www.researchgate.net/profile/Youcheng-Li-2"],
      url: "https://youchengli.com/"
    }
  },

  // ========================================
  // 关于我部分 / About Section
  // ========================================
  about: {
    title: "Youcheng Li · 利友诚",
    subtitle: "Medical AI, generative models and diagnostic reasoning",
    content: [
      {
        type: "paragraph",
        text: "I am a PhD candidate in Artificial Intelligence at the <a href=\"https://www.cis.pku.edu.cn/\" target=\"_blank\" rel=\"noopener noreferrer\">School of Intelligence Science and Technology</a>, Peking University, advised by <a href=\"https://www.liweiwang-pku.com/\" target=\"_blank\" rel=\"noopener noreferrer\">Prof. Liwei Wang</a>."
      },
      {
        type: "paragraph",
        text: "My research connects medical image analysis, generative foundation models and diagnostic reasoning. I develop models and benchmarks for breast ultrasound and mammography, and have worked on cell segmentation for spatial transcriptomics. My first-author and co-first-author publications appear in Nature Biomedical Engineering, Scientific Data, KDD and PLOS Computational Biology."
      },
      {
        type: "paragraph",
        text: "Alongside my research, I co-founded Isoplex Intelligence (壹索智能) and serve as CTO, working on scientific agents and research software. <a href=\"experience.html\">More about my industry experience →</a>"
      }
    ],
    researchInterests: {
      title: "Research Interests",
      interests: ["Medical AI", "Generative Foundation Models", "Medical Image Analysis", "Diagnostic Reasoning", "Scientific Agents", "Spatial Transcriptomics"]
    },
    mission: "Build medical AI and scientific tools that connect research with practice."
  },

  // ========================================
  // 新闻动态 / News Section
  // ========================================
  news: {
    title: "Latest News",
    subtitle: "Recent updates and achievements",
    items: [
      {
        date: "Aug 2026",
        title: "MammoExpert published at KDD 2026",
        content: "Our mammography reasoning benchmark is published in the KDD 2026 AI4Sciences track.",
        link: {
          url: "https://doi.org/10.1145/3770855.3818933",
          text: "Read Paper →"
        },
        type: "publication"
      },
      {
        date: "Apr 2026",
        title: "BUSGen published in Nature Biomedical Engineering",
        content: "Our foundation generative model for breast ultrasound image analysis is now published.",
        link: {
          url: "https://www.nature.com/articles/s41551-026-01639-1",
          text: "Read Paper →"
        },
        type: "publication"
      },
      {
        date: "Feb 2026",
        title: "BUS-CoT published in Scientific Data",
        content: "Our breast ultrasound reasoning dataset covers 99 histopathology categories and includes expert-verified diagnostic annotations.",
        link: {
          url: "https://www.nature.com/articles/s41597-026-06702-9",
          text: "Read Paper →"
        },
        type: "publication"
      },
      {
        date: "Apr 2025",
        title: "Breast tissue classification study published",
        content: "Our collaborative study of AI-assisted breast ultrasound tissue classification is published in Scientific Reports.",
        link: {
          url: "https://www.nature.com/articles/s41598-025-95871-5",
          text: "Read Paper →"
        },
        type: "publication"
      },
      {
        date: "Jan 2025",
        title: "BUSGen preprint released",
        content: "The BUSGen preprint introduces a generative model for breast ultrasound image analysis.",
        link: {
          url: "https://arxiv.org/abs/2501.06869",
          text: "Read Paper →"
        },
        type: "publication"
      },
      {
        date: "Dec 2024",
        title: "National Digital Health Innovation Competition First Prize",
        content: "Our team received a national first prize in the 2nd National Digital Health Innovation Application Competition for work on ultrasound-based differentiation of ductal carcinoma in situ and fibroadenoma.",
        link: {
          url: "https://mp.weixin.qq.com/s/fJIdh25YOHuIbezn_XZSDQ",
          text: "Read News →"
        },
        type: "award"
      },
      {
        date: "Oct 2024",
        title: "National Scholarship Award",
        content: "I received the National Scholarship at Peking University for the 2023–2024 academic year.",
        type: "award"
      },
      {
        date: "Jul 2024",
        title: "TAILOR preprint released",
        content: "Our preprint explores knowledge-driven synthetic data for breast ultrasound diagnosis, including rare cases.",
        link: {
          url: "https://arxiv.org/abs/2407.16634",
          text: "Read Paper →"
        },
        type: "publication"
      },
      {
        date: "Jun 2024",
        title: "ST-CellSeg published in PLOS Computational Biology",
        content: "Our work on multi-scale manifold learning for cell segmentation in imaging-based spatial transcriptomics is published.",
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
    subtitle: "Three connected directions in medical and scientific AI",
    highlights: [
      {
        title: "Medical Foundation Models",
        description: "Generative models and synthetic data for breast imaging, with applications in screening, diagnosis and prognosis.",
        link: "research.html#projects"
      },
      {
        title: "Diagnostic Reasoning",
        description: "Structured reasoning datasets and benchmarks that connect imaging observations, clinical features and pathology.",
        link: "research.html#publications"
      },
      {
        title: "Scientific Agents",
        description: "Research workspaces and agent systems that connect literature, data analysis, model development and experimental feedback.",
        link: "experience.html"
      }
    ]
  },

  // ========================================
  // 项目和出版物 / Projects and Publications
  // ========================================
  projects: {
    title: "Projects & Publications",
    subtitle: "Research projects and academic publications",
    featured: [
      {
        title: "BUSGen: A Foundation Generative Model for Breast Ultrasound",
        semanticScholarId: "DOI:10.1038/s41551-026-01639-1",
        description: "A generative model pretrained on more than 3.5 million breast ultrasound images. Few-shot adaptation produces task-specific synthetic data for downstream screening, diagnosis and prognosis research.",
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
        title: "BUS-CoT: Breast Ultrasound Diagnostic Reasoning",
        semanticScholarId: "DOI:10.1038/s41597-026-06702-9",
        description: "A breast ultrasound dataset with 11,439 images, 11,850 lesions and 4,838 patients, covering 99 histopathology categories. Expert annotations connect observations, imaging features, diagnoses and pathology.",
        image: "pub/BUSCoT.png",
        tags: ["Medical AI", "Dataset"],
        links: [
          {
            type: "journal",
            url: "https://www.nature.com/articles/s41597-026-06702-9",
            text: "Scientific Data"
          },
          {
            type: "arxiv",
            url: "https://www.arxiv.org/abs/2509.17046",
            text: "arXiv"
          },
          {
            type: "dataset",
            url: "https://doi.org/10.6084/m9.figshare.30838715",
            text: "Dataset"
          }
        ],
        highlight: true
      },
      {
        title: "MammoExpert: Reasoning in Mammography",
        semanticScholarId: "DOI:10.1145/3770855.3818933",
        description: "A mammography benchmark with 2,379 images and 67 histopathology subtypes. Structured annotations cover observation, assessment and diagnostic synthesis.",
        tags: ["Medical AI", "Diagnostic Reasoning", "Dataset"],
        links: [
          {
            type: "conference",
            url: "https://doi.org/10.1145/3770855.3818933",
            text: "KDD 2026"
          },
          {
            type: "code",
            url: "https://github.com/Ericdd90/MammoExpert",
            text: "Code & Dataset"
          }
        ],
        highlight: true
      },
      {
        title: "ST-CellSeg: Spatial Transcriptomics Cell Segmentation",
        semanticScholarId: "DOI:10.1371/journal.pcbi.1012254",
        description: "A cell segmentation method for imaging-based spatial transcriptomics that combines image information with multi-scale manifold learning.",
        image: "pub/STCellSeg.png",
        tags: ["Computer Vision", "Machine Learning"],
        links: [
          {
            type: "paper",
            url: "https://journals.plos.org/ploscompbiol/article?id=10.1371/journal.pcbi.1012254",
            text: "PLOS Comp Bio"
          }
        ]
      },
      {
        title: "UltraDet: Real-time Ultrasound Lesion Detection",
        semanticScholarId: "DOI:10.1007/978-3-031-43987-2_1",
        description: "A video-based lesion detection method that uses negative temporal context to suppress false positives in real-time breast ultrasound.",
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
        ]
      },
      {
        title: "TAILOR: Knowledge-driven AI-generated Data Pipeline",
        semanticScholarId: "ARXIV:2407.16634",
        description: "A knowledge-driven pipeline for generating synthetic breast ultrasound data to study diagnosis under long-tailed and rare-case data distributions.",
        image: "pub/TAILOR.png",
        tags: ["Medical AI", "Generative AI"],
        links: [
          {
            type: "arxiv",
            url: "https://arxiv.org/abs/2407.16634",
            text: "arXiv"
          }
        ]
      }
    ],
    publications: [
      {
        year: "2026",
        items: [
          {
            title: "MammoExpert: Benchmarking Chain-of-Thought Reasoning in Mammography Diagnosis",
            semanticScholarId: "DOI:10.1145/3770855.3818933",
            authors: ["Di Dai", "Bo Liu", "Youcheng Li", "Haojun Yu", "Zhuohang Bian", "Quanlin Wu", "Dong Wang", "Sichen Meng", "Hongye Xuan", "Zijie Lan", "Shenda Hong", "Liwei Wang"],
            coFirst: ["Di Dai", "Bo Liu", "Youcheng Li", "Haojun Yu"],
            venue: "Proceedings of the 32nd ACM SIGKDD Conference on Knowledge Discovery and Data Mining V.2",
            publisher: "ACM",
            date: "August 2026",
            links: [
              {
                type: "conference",
                url: "https://doi.org/10.1145/3770855.3818933",
                text: "KDD 2026"
              },
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
            highlight: true,
            doi: "10.1145/3770855.3818933",
            year: "2026",
            publicationType: "inproceedings",
            track: "AI4Sciences",
            pages: "10785-10794"
          },
          {
            title: "A foundation generative model for breast ultrasound image analysis",
            semanticScholarId: "DOI:10.1038/s41551-026-01639-1",
            authors: ["Haojun Yu", "Youcheng Li", "Nan Zhang", "Zihan Niu", "Xuantong Gong", "Yanwen Luo", "Haotian Ye", "Siyu He", "Quanlin Wu", "Wangyan Qin", "Mengyuan Zhou", "Jie Han", "Jia Tao", "Ziwei Zhao", "Di Dai", "Di He", "Dong Wang", "Binghui Tang", "Ling Huo", "James Zou", "Qingli Zhu", "Yong Wang", "Liwei Wang"],
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
                url: "https://arxiv.org/pdf/2501.06869",
                text: "Preprint PDF"
              },
              {
                type: "demo",
                url: "./demo/BUSGen/index.html",
                text: "Online Demo"
              }
            ],
            tags: ["Medical AI", "Generative AI"],
            highlight: true,
            doi: "10.1038/s41551-026-01639-1",
            year: "2026",
            publicationType: "article",
            coFirst: ["Haojun Yu", "Youcheng Li", "Nan Zhang", "Zihan Niu"],
            note: "Published online on 7 April 2026; volume and final page range not yet assigned in the publisher and Crossref records (checked 6 October 2026)."
          },
          {
            title: "A Chain-of-thought Reasoning Breast Ultrasound Dataset Covering All Histopathology Categories",
            semanticScholarId: "DOI:10.1038/s41597-026-06702-9",
            authors: ["Haojun Yu", "Youcheng Li", "Zihan Niu", "Nan Zhang", "Xuantong Gong", "Huan Li", "Zhiying Zou", "Haifeng Qi", "Zhenxiao Cao", "Zijie Lan", "Xingjian Yuan", "Jiating He", "Haokai Zhang", "Shengtao Zhang", "Zicheng Wang", "Dong Wang", "Ziwei Zhao", "Congying Chen", "Yong Wang", "Wangyan Qin", "Qingli Zhu", "Liwei Wang"],
            venue: "Scientific Data",
            date: "February 2026",
            links: [
              {
                type: "journal",
                url: "https://www.nature.com/articles/s41597-026-06702-9",
                text: "Scientific Data"
              },
              {
                type: "arxiv",
                url: "https://arxiv.org/abs/2509.17046"
              },
              {
                type: "pdf",
                url: "https://arxiv.org/pdf/2509.17046",
                text: "Preprint PDF"
              },
              {
                type: "dataset",
                url: "https://doi.org/10.6084/m9.figshare.30838715",
                text: "Dataset"
              }
            ],
            tags: ["Medical AI", "Dataset"],
            highlight: true,
            doi: "10.1038/s41597-026-06702-9",
            year: "2026",
            publicationType: "article",
            volume: "13",
            issue: "1",
            pages: "370",
            articleNumber: "370",
            coFirst: ["Haojun Yu", "Youcheng Li", "Zihan Niu", "Nan Zhang", "Xuantong Gong", "Huan Li", "Zhiying Zou", "Haifeng Qi", "Zhenxiao Cao"]
          }
        ]
      },
      {
        year: "2025",
        items: [
          {
            title: "Using artificial intelligence system for assisting the classification of breast ultrasound glandular tissue components in dense breast tissue",
            semanticScholarId: "DOI:10.1038/s41598-025-95871-5",
            authors: ["Hongju Yan", "Chaochao Dai", "Xiaojing Xu", "Yuxuan Qiu", "Lifang Yu", "Lewen Huang", "Bei Lin", "Jianan Huang", "Chenxiang Jiang", "Yingzhao Shen", "Jing Ji", "Youcheng Li", "Lingyun Bao"],
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
            doi: "10.1038/s41598-025-95871-5",
            year: "2025",
            publicationType: "article",
            articleNumber: "11754"
          }
        ]
      },
      {
        year: "2024",
        items: [
          {
            title: "Knowledge-driven AI-generated data for accurate and interpretable breast ultrasound diagnoses",
            semanticScholarId: "ARXIV:2407.16634",
            authors: ["Haojun Yu", "Youcheng Li", "Nan Zhang", "Zihan Niu", "Xuantong Gong", "Yanwen Luo", "Quanlin Wu", "Wangyan Qin", "Mengyuan Zhou", "Jie Han", "Jia Tao", "Ziwei Zhao", "Di Dai", "Di He", "Dong Wang", "Binghui Tang", "Ling Huo", "Qingli Zhu", "Yong Wang", "Liwei Wang"],
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
            year: "2024",
            publicationType: "misc",
            doi: "10.48550/arXiv.2407.16634",
            eprint: "2407.16634",
            archivePrefix: "arXiv",
            primaryClass: "eess.IV"
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
            doi: "10.1371/journal.pcbi.1012254",
            year: "2024",
            publicationType: "article"
          }
        ]
      },
      {
        year: "2023",
        items: [
          {
            title: "Mining Negative Temporal Contexts for False Positive Suppression in Real-Time Ultrasound Lesion Detection",
            semanticScholarId: "DOI:10.1007/978-3-031-43987-2_1",
            authors: ["Haojun Yu", "Youcheng Li", "QuanLin Wu", "Ziwei Zhao", "Dengbo Chen", "Dong Wang", "Liwei Wang"],
            venue: "Medical Image Computing and Computer Assisted Intervention – MICCAI 2023",
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
            highlight: true,
            doi: "10.1007/978-3-031-43987-2_1",
            year: "2023",
            publicationType: "inproceedings"
          }
        ]
      }
    ]
  },

  // Professional experience / 创业与产业经历
  experience: {
    title: "Experience",
    subtitle: "From medical AI research to scientific software and product development",
    items: [
      {
        organization: "Isoplex Intelligence · 壹索智能",
        role: "Co-founder & CTO",
        period: "June 2025 – Present",
        description: "I lead technical strategy, product development and engineering teams at Isoplex Intelligence.",
        highlights: ["Lead development of Iso-Sciland, a research workspace that brings together scientific agents, tool use, data analysis and research collaboration.", "Develop the technical roadmap, model training and evaluation for Iso-SWM, a scientific world model research program.", "Design systems and prototypes for Iso-LabOS, connecting model-based reasoning with experimental execution and feedback.", "Support product delivery and partnerships with hospitals, universities and pharmaceutical companies."],
        url: "https://www.sciland.cn/"
      },
      {
        organization: "医准智能科技（北京）有限公司",
        role: "Algorithm Research Intern",
        period: "January 2023 – June 2025",
        description: "Worked on breast ultrasound screening, diagnosis, video lesion detection and generative models.",
        highlights: ["Research contributions led to publications at MICCAI 2023 and in Nature Biomedical Engineering (2026).", "Developed ultrasound detection and diagnostic algorithms, and worked on model compression and hardware acceleration.", "Contributed to the DCIS diagnosis project awarded a national first prize in the 2nd National Digital Health Innovation Application Competition."]
      },
      {
        organization: "Western University",
        role: "Research Assistant · Advisor: Prof. Pingzhao Hu",
        period: "September 2022 – July 2023",
        description: "Remote research supported by Mitacs and the China Scholarship Council.",
        highlights: ["Developed ST-CellSeg for cell segmentation in imaging-based spatial transcriptomics.", "Implemented and benchmarked the method; published as first author in PLOS Computational Biology."]
      },
      {
        organization: "深圳安科高新技术股份有限公司",
        role: "Embedded Engineering Assistant Intern",
        period: "July 2020 – September 2020",
        description: "Early engineering experience in medical devices.",
        highlights: ["Worked on circuit debugging, firmware optimization and ARM-based embedded system integration."]
      }
    ]
  },

  // ========================================
  // 奖项荣誉 / Awards and Honors
  // ========================================
  awards: {
    title: "Honors & Awards",
    subtitle: "Selected scholarships and honors",
    items: [
      {
        name: "BYD Scholarship; Merit Student · Peking University",
        year: "2025–2026",
        type: "scholarship"
      },
      {
        name: "Huawei Scholarship · Peking University",
        year: "2024–2025",
        type: "scholarship"
      },
      {
        name: "National First Prize · 2nd National Digital Health Innovation Application Competition",
        year: "2024",
        type: "competition"
      },
      {
        name: "National Scholarship; Merit Student · Peking University",
        year: "2023–2024",
        type: "scholarship"
      },
      {
        name: "Outstanding Graduate · Xi’an Jiaotong University",
        year: "2022–2023",
        type: "honor"
      },
      {
        name: "China Scholarship Council & Mitacs scholarships",
        year: "2021–2022",
        type: "fellowship"
      },
      {
        name: "MEGVII Scholarship · Xi’an Jiaotong University",
        year: "2020–2021",
        type: "scholarship"
      },
      {
        name: "National Scholarship; Merit Student · Xi’an Jiaotong University",
        year: "2019–2020",
        type: "scholarship"
      }
    ]
  },

  // ========================================
  // 教学经历 / Teaching Experience
  // ========================================
  teaching: {
    title: "Teaching",
    subtitle: "Teaching assistant experience and shared course materials",
    courses: [
      {
        title: "Information Theory",
        link: "teaching/information_theory_24_spring.html",
        period: "Spring 2024",
        role: "Teaching Assistant",
        institution: "Peking University",
        description: "Teaching assistant for Information Theory at Peking University.",
        expanded: false
      },
      {
        title: "Machine Learning",
        link: "teaching/machine_learning_23_fall.html",
        period: "Fall 2023",
        role: "Teaching Assistant",
        institution: "Peking University",
        description: "Teaching assistant for Machine Learning at Peking University.",
        expanded: false,
        materials: [
          {
            title: "Course Notes",
            description: "Lecture notes from the Fall 2023 course.",
            items: [
              {
                name: "Week 2 lecture notes",
                file: "teaching/machine_learning_notes/2023_Fall_ML_Note__Week_2__Lecture_2_.pdf"
              },
              {
                name: "Week 3 lecture notes",
                file: "teaching/machine_learning_notes/2023_Fall_ML_Note__Week_3__Lecture_3_.pdf"
              },
              {
                name: "Week 4 lecture notes",
                file: "teaching/machine_learning_notes/2023_Fall_ML_Note__Week_4__Lecture_4_.pdf"
              },
              {
                name: "Week 5 lecture notes",
                file: "teaching/machine_learning_notes/2023_Fall_ML_Note__Week_5__Lecture_5_.pdf"
              },
              {
                name: "Week 6 lecture notes",
                file: "teaching/machine_learning_notes/2023_Fall_ML_Note__Week_6__Lecture_6_.pdf"
              },
              {
                name: "Week 7 lecture notes",
                file: "teaching/machine_learning_notes/2023_Fall_ML_Note__Week_7__Lecture_7_.pdf"
              },
              {
                name: "Week 8 lecture notes",
                file: "teaching/machine_learning_notes/2023_Fall_ML_Note__Week_8__Lecture_8_.pdf"
              },
              {
                name: "Week 9 lecture notes",
                file: "teaching/machine_learning_notes/2023_Fall_ML_Note__Week_9__Lecture_9_.pdf"
              },
              {
                name: "Week 10 lecture notes",
                file: "teaching/machine_learning_notes/2023_Fall_ML_Note__Week_10__Lecture_10_.pdf"
              },
              {
                name: "Week 11 lecture notes",
                file: "teaching/machine_learning_notes/2023_Fall_ML_Note__Week_11__Lecture_11_.pdf"
              },
              {
                name: "Week 12 lecture notes",
                file: "teaching/machine_learning_notes/2023_Fall_ML_Note__Week_12__Lecture_12_.pdf"
              }
            ]
          }
        ]
      }
    ],
    talks: []
  },

  // ========================================
  // 资源链接 / Resources and Links
  // ========================================
  resources: {
    title: "Research Resources",
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
    sidebar: [
      { id: "home", label: "Home", icon: "fas fa-user", href: "index.html" },
      { id: "research", label: "Research", icon: "fas fa-microscope", href: "research.html" },
      { id: "experience", label: "Experience", icon: "fas fa-briefcase", href: "experience.html" },
      { id: "teaching", label: "Teaching & Resources", icon: "fas fa-chalkboard-teacher", href: "teaching.html" },
      { id: "blog", label: "Blog", icon: "fas fa-pen-nib", href: "blog.html" }
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
    research: { seo: {
      title: "Research & Publications | Youcheng Li",
      description: "Research projects and publications by Youcheng Li in medical AI, generative models and diagnostic reasoning."
    } },
    experience: { seo: {
      title: "Experience | Youcheng Li",
      description: "Entrepreneurship and research experience of Youcheng Li, co-founder and CTO of Isoplex Intelligence and PhD candidate at Peking University."
    } },
    teaching: { seo: {
      title: "Teaching & Resources | Youcheng Li",
      description: "Teaching experience, machine learning lecture notes and research resources from Youcheng Li."
    } },
    blog: { seo: {
      title: "Blog | Youcheng Li",
      description: "Bilingual technical analysis of AI for Science and large language models, and business perspectives on technology trends at leading companies."
    } }
  }

};

// 导出配置以供其他脚本使用
// Export configuration for use by other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SITE_CONFIG;
}
