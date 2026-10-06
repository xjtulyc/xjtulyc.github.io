/**
 * 中文内容配置。保留原始论文元数据、链接、资源路径与行为字段。
 * Chinese content snapshot for the English base configuration.
 * Arrays are replaced as complete arrays by the language merge layer.
 */
const SITE_CONFIG_ZH = {
  "personal": {
    "name": {
      "english": "Youcheng Li",
      "chinese": "利友诚",
      "display": "利友诚"
    },
    "avatar": "resources/avatar.jpg",
    "position": {
      "title": "人工智能博士研究生",
      "institution": "北京大学",
      "department": "智能学院",
      "departmentUrl": "https://www.cis.pku.edu.cn/",
      "supervisor": {
        "name": "王立威教授",
        "url": "https://www.liweiwang-pku.com/"
      },
      "company": {
        "name": "Isoplex Intelligence",
        "chineseName": "壹索智能",
        "role": "联合创始人兼 CTO",
        "url": "https://www.sciland.cn/"
      }
    },
    "contact": {
      "emails": [
        "youchengli@stu.pku.edu.cn",
        "1246321319@qq.com"
      ],
      "cv": "pdf/youcheng_li_cv.pdf",
      "cvEnglish": "pdf/youcheng_li_cv.pdf",
      "cvChinese": "pdf/youcheng_li_cv_ch.pdf"
    },
    "social": [
      {
        "name": "Google Scholar",
        "icon": "fas fa-graduation-cap",
        "url": "https://scholar.google.com/citations?hl=zh-CN&user=cRWgAzcAAAAJ",
        "tooltip": "Google Scholar"
      },
      {
        "name": "GitHub",
        "icon": "fab fa-github",
        "url": "https://github.com/xjtulyc",
        "tooltip": "GitHub"
      },
      {
        "name": "ResearchGate",
        "icon": "fab fa-researchgate",
        "url": "https://www.researchgate.net/profile/Youcheng-Li-2",
        "tooltip": "ResearchGate"
      },
      {
        "name": "小红书",
        "icon": "fas fa-book",
        "url": "https://www.xiaohongshu.com/user/profile/649ad7e3000000002b009eb5",
        "tooltip": "小红书"
      },
      {
        "name": "LinkedIn",
        "icon": "fab fa-linkedin",
        "url": "https://www.linkedin.com/in/youcheng-li-121396289/",
        "tooltip": "LinkedIn"
      },
      {
        "name": "知乎",
        "icon": "fab fa-zhihu",
        "url": "https://www.zhihu.com/people/yan-cheng-86-84",
        "tooltip": "知乎"
      }
    ]
  },
  "seo": {
    "title": "利友诚 | 北京大学人工智能博士研究生",
    "description": "利友诚，北京大学人工智能博士研究生，研究医疗人工智能、生成式基础模型与诊断推理。了解论文、科研项目、教学资料与产业经历。",
    "keywords": "利友诚, Youcheng Li, 北京大学, 医疗人工智能, 生成式基础模型, 诊断推理, 科学智能体, 壹索智能",
    "author": "Youcheng Li",
    "siteUrl": "https://youchengli.com",
    "openGraph": {
      "title": "利友诚 | 北京大学人工智能博士研究生",
      "description": "利友诚，北京大学人工智能博士研究生，研究医疗人工智能、生成式基础模型与诊断推理。了解论文、科研项目、教学资料与产业经历。",
      "image": "https://youchengli.com/resources/avatar.jpg",
      "type": "website"
    },
    "twitter": {
      "card": "summary_large_image",
      "title": "利友诚 | 北京大学人工智能博士研究生",
      "description": "利友诚，北京大学人工智能博士研究生，研究医疗人工智能、生成式基础模型与诊断推理。了解论文、科研项目、教学资料与产业经历。",
      "image": "https://youchengli.com/resources/avatar.jpg"
    },
    "structuredData": {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "Youcheng Li",
      "alternateName": "利友诚",
      "jobTitle": "人工智能博士研究生",
      "worksFor": {
        "@type": "Organization",
        "name": "北京大学",
        "sameAs": "https://www.pku.edu.cn"
      },
      "alumniOf": {
        "@type": "Organization",
        "name": "西安交通大学"
      },
      "email": "youchengli@stu.pku.edu.cn",
      "image": "https://youchengli.com/resources/avatar.jpg",
      "sameAs": [
        "https://scholar.google.com/citations?hl=zh-CN&user=cRWgAzcAAAAJ",
        "https://github.com/xjtulyc",
        "https://www.researchgate.net/profile/Youcheng-Li-2"
      ],
      "url": "https://youchengli.com/"
    }
  },
  "about": {
    "title": "利友诚 · Youcheng Li",
    "subtitle": "医疗人工智能、生成式模型与诊断推理",
    "content": [
      {
        "type": "paragraph",
        "text": "我目前是北京大学<a href=\"https://www.cis.pku.edu.cn/\" target=\"_blank\" rel=\"noopener noreferrer\">智能学院</a>人工智能方向博士研究生，导师为<a href=\"https://www.liweiwang-pku.com/\" target=\"_blank\" rel=\"noopener noreferrer\">王立威教授</a>。"
      },
      {
        "type": "paragraph",
        "text": "我的研究围绕医学影像分析、生成式基础模型与诊断推理展开，开发面向乳腺超声和乳腺 X 线影像的模型与评测基准，也曾研究空间转录组学中的细胞分割方法。以第一作者或共同第一作者在 Nature Biomedical Engineering、Scientific Data、KDD 和 PLOS Computational Biology 发表论文。"
      },
      {
        "type": "paragraph",
        "text": "科研之外，我联合创立壹索智能（Isoplex Intelligence）并担任 CTO，研发科学智能体与科研软件。<a href=\"experience.html\">了解我的产业经历 →</a>"
      }
    ],
    "researchInterests": {
      "title": "研究兴趣",
      "interests": [
        "医疗人工智能",
        "生成式基础模型",
        "医学影像分析",
        "诊断推理",
        "科学智能体",
        "空间转录组学"
      ]
    },
    "mission": "构建连接研究与实践的医疗人工智能系统与科学工具。"
  },
  "news": {
    "title": "近期动态",
    "subtitle": "最新研究进展与个人动态",
    "items": [
      {
        "date": "2026 年 8 月",
        "title": "MammoExpert 发表于 KDD 2026",
        "content": "我们的乳腺 X 线影像诊断推理基准发表于 KDD 2026 AI4Sciences 专题。",
        "link": {
          "url": "https://doi.org/10.1145/3770855.3818933",
          "text": "阅读论文 →"
        },
        "type": "publication"
      },
      {
        "date": "2026 年 4 月",
        "title": "BUSGen 发表于 Nature Biomedical Engineering",
        "content": "我们的乳腺超声图像分析生成式基础模型研究正式发表。",
        "link": {
          "url": "https://www.nature.com/articles/s41551-026-01639-1",
          "text": "阅读论文 →"
        },
        "type": "publication"
      },
      {
        "date": "2026 年 2 月",
        "title": "BUS-CoT 发表于 Scientific Data",
        "content": "我们的乳腺超声推理数据集覆盖 99 类组织病理类别，并提供经专家核验的诊断标注。",
        "link": {
          "url": "https://www.nature.com/articles/s41597-026-06702-9",
          "text": "阅读论文 →"
        },
        "type": "publication"
      },
      {
        "date": "2025 年 4 月",
        "title": "乳腺组织分类研究正式发表",
        "content": "我们参与的人工智能辅助乳腺超声组织分类研究发表于 Scientific Reports。",
        "link": {
          "url": "https://www.nature.com/articles/s41598-025-95871-5",
          "text": "阅读论文 →"
        },
        "type": "publication"
      },
      {
        "date": "2025 年 1 月",
        "title": "BUSGen 预印本发布",
        "content": "BUSGen 预印本介绍了面向乳腺超声图像分析的生成式模型。",
        "link": {
          "url": "https://arxiv.org/abs/2501.06869",
          "text": "阅读论文 →"
        },
        "type": "publication"
      },
      {
        "date": "2024 年 12 月",
        "title": "获全国数字健康创新应用大赛一等奖",
        "content": "团队凭借基于超声区分导管原位癌与纤维腺瘤的研究，获得第二届全国数字健康创新应用大赛全国一等奖。",
        "link": {
          "url": "https://mp.weixin.qq.com/s/fJIdh25YOHuIbezn_XZSDQ",
          "text": "查看报道 →"
        },
        "type": "award"
      },
      {
        "date": "2024 年 10 月",
        "title": "获国家奖学金",
        "content": "获得北京大学 2023–2024 学年国家奖学金。",
        "type": "award"
      },
      {
        "date": "2024 年 7 月",
        "title": "TAILOR 预印本发布",
        "content": "我们的预印本研究利用知识驱动的合成数据开展乳腺超声诊断，关注罕见病例等场景。",
        "link": {
          "url": "https://arxiv.org/abs/2407.16634",
          "text": "阅读论文 →"
        },
        "type": "publication"
      },
      {
        "date": "2024 年 6 月",
        "title": "ST-CellSeg 发表于 PLOS Computational Biology",
        "content": "我们利用多尺度流形学习开展成像型空间转录组学细胞分割的研究正式发表。",
        "link": {
          "url": "https://journals.plos.org/ploscompbiol/article?id=10.1371/journal.pcbi.1012254",
          "text": "阅读论文 →"
        },
        "type": "publication"
      },
      {
        "date": "2023 年 7 月",
        "title": "入选学校宣传学生代表",
        "content": "入选西安交通大学优秀学生代表，参与学校宣传。",
        "link": {
          "url": "http://news.xjtu.edu.cn/info/1011/198755.htm",
          "text": "查看报道 →"
        },
        "type": "media"
      },
      {
        "date": "2023 年 5 月",
        "title": "论文获 MICCAI 2023 提前接收",
        "content": "我们的论文“Mining Negative Temporal Contexts for False Positive Suppression in Real-Time Ultrasound Lesion Detection”获 MICCAI 2023 提前接收。",
        "link": {
          "url": "https://arxiv.org/abs/2305.18060",
          "text": "阅读论文 →"
        },
        "type": "publication"
      }
    ]
  },
  "research": {
    "title": "研究方向",
    "subtitle": "医疗人工智能与科学智能中的三个关联方向",
    "highlights": [
      {
        "title": "医学基础模型",
        "description": "研究用于乳腺影像的生成式模型与合成数据，探索其在筛查、诊断和预后中的应用。",
        "link": "research.html#projects"
      },
      {
        "title": "诊断推理",
        "description": "构建结构化推理数据集与评测基准，连接影像观察、临床特征与病理诊断。",
        "link": "research.html#publications"
      },
      {
        "title": "科学智能体",
        "description": "研发科研工作空间与智能体系统，连接文献、数据分析、模型开发与实验反馈。",
        "link": "experience.html"
      }
    ]
  },
  "projects": {
    "title": "科研项目与论文",
    "subtitle": "研究项目与学术成果",
    "featured": [
      {
        "title": "BUSGen：乳腺超声生成式基础模型",
        "semanticScholarId": "DOI:10.1038/s41551-026-01639-1",
        "description": "在超过 350 万幅乳腺超声图像上预训练生成式模型，通过少样本适配生成特定任务的合成数据，支持后续筛查、诊断与预后研究。",
        "image": "pub/BUSGen.png",
        "tags": [
          "医疗人工智能",
          "生成式人工智能"
        ],
        "links": [
          {
            "type": "journal",
            "url": "https://www.nature.com/articles/s41551-026-01639-1",
            "text": "Nature BME"
          },
          {
            "type": "demo",
            "url": "./demo/BUSGen/index.html",
            "text": "演示"
          }
        ],
        "highlight": true
      },
      {
        "title": "BUS-CoT：乳腺超声诊断推理",
        "semanticScholarId": "DOI:10.1038/s41597-026-06702-9",
        "description": "乳腺超声数据集包含 11,439 幅图像、11,850 个病灶与 4,838 位患者，覆盖 99 类组织病理类别。专家标注连接观察、影像特征、诊断与病理。",
        "image": "pub/BUSCoT.png",
        "tags": [
          "医疗人工智能",
          "数据集"
        ],
        "links": [
          {
            "type": "journal",
            "url": "https://www.nature.com/articles/s41597-026-06702-9",
            "text": "Scientific Data"
          },
          {
            "type": "arxiv",
            "url": "https://www.arxiv.org/abs/2509.17046",
            "text": "arXiv"
          },
          {
            "type": "dataset",
            "url": "https://doi.org/10.6084/m9.figshare.30838715",
            "text": "数据集"
          }
        ],
        "highlight": true
      },
      {
        "title": "MammoExpert：乳腺 X 线影像诊断推理",
        "semanticScholarId": "DOI:10.1145/3770855.3818933",
        "description": "乳腺 X 线影像评测基准包含 2,379 幅图像与 67 类组织病理亚型，结构化标注涵盖观察、评估与诊断综合三个阶段。",
        "tags": [
          "医疗人工智能",
          "诊断推理",
          "数据集"
        ],
        "links": [
          {
            "type": "conference",
            "url": "https://doi.org/10.1145/3770855.3818933",
            "text": "KDD 2026"
          },
          {
            "type": "code",
            "url": "https://github.com/Ericdd90/MammoExpert",
            "text": "代码与数据集"
          }
        ],
        "highlight": true
      },
      {
        "title": "ST-CellSeg：空间转录组学细胞分割",
        "semanticScholarId": "DOI:10.1371/journal.pcbi.1012254",
        "description": "面向成像型空间转录组学的细胞分割方法，将图像信息与多尺度流形学习相结合。",
        "image": "pub/STCellSeg.png",
        "tags": [
          "计算机视觉",
          "机器学习"
        ],
        "links": [
          {
            "type": "paper",
            "url": "https://journals.plos.org/ploscompbiol/article?id=10.1371/journal.pcbi.1012254",
            "text": "PLOS Comp Bio"
          }
        ]
      },
      {
        "title": "UltraDet：实时超声病灶检测",
        "semanticScholarId": "DOI:10.1007/978-3-031-43987-2_1",
        "description": "基于视频的病灶检测方法，利用负时序上下文抑制实时乳腺超声检测中的假阳性。",
        "image": "pub/UltraDet.png",
        "tags": [
          "医疗人工智能",
          "计算机视觉"
        ],
        "links": [
          {
            "type": "paper",
            "url": "https://link.springer.com/chapter/10.1007/978-3-031-43987-2_1",
            "text": "MICCAI 2023"
          },
          {
            "type": "arxiv",
            "url": "https://arxiv.org/abs/2305.18060",
            "text": "arXiv"
          }
        ]
      },
      {
        "title": "TAILOR：知识驱动的合成数据生成流程",
        "semanticScholarId": "ARXIV:2407.16634",
        "description": "利用知识驱动的流程生成乳腺超声合成数据，研究长尾分布和罕见病例场景中的诊断问题。",
        "image": "pub/TAILOR.png",
        "tags": [
          "医疗人工智能",
          "生成式人工智能"
        ],
        "links": [
          {
            "type": "arxiv",
            "url": "https://arxiv.org/abs/2407.16634",
            "text": "arXiv"
          }
        ]
      }
    ],
    "publications": [
      {
        "year": "2026",
        "items": [
          {
            "title": "MammoExpert: Benchmarking Chain-of-Thought Reasoning in Mammography Diagnosis",
            "semanticScholarId": "DOI:10.1145/3770855.3818933",
            "authors": [
              "Di Dai",
              "Bo Liu",
              "Youcheng Li",
              "Haojun Yu",
              "Zhuohang Bian",
              "Quanlin Wu",
              "Dong Wang",
              "Sichen Meng",
              "Hongye Xuan",
              "Zijie Lan",
              "Shenda Hong",
              "Liwei Wang"
            ],
            "coFirst": [
              "Di Dai",
              "Bo Liu",
              "Youcheng Li",
              "Haojun Yu"
            ],
            "venue": "Proceedings of the 32nd ACM SIGKDD Conference on Knowledge Discovery and Data Mining V.2",
            "publisher": "ACM",
            "date": "August 2026",
            "links": [
              {
                "type": "conference",
                "url": "https://doi.org/10.1145/3770855.3818933",
                "text": "KDD 2026"
              },
              {
                "type": "arxiv",
                "url": "https://arxiv.org/abs/2606.21119"
              },
              {
                "type": "pdf",
                "url": "https://arxiv.org/pdf/2606.21119"
              },
              {
                "type": "code",
                "url": "https://github.com/Ericdd90/MammoExpert",
                "text": "代码与数据集"
              }
            ],
            "tags": [
              "医疗人工智能",
              "乳腺 X 线影像",
              "思维链",
              "数据集"
            ],
            "highlight": true,
            "doi": "10.1145/3770855.3818933",
            "year": "2026",
            "publicationType": "inproceedings",
            "track": "AI4Sciences",
            "pages": "10785-10794"
          },
          {
            "title": "A foundation generative model for breast ultrasound image analysis",
            "semanticScholarId": "DOI:10.1038/s41551-026-01639-1",
            "authors": [
              "Haojun Yu",
              "Youcheng Li",
              "Nan Zhang",
              "Zihan Niu",
              "Xuantong Gong",
              "Yanwen Luo",
              "Haotian Ye",
              "Siyu He",
              "Quanlin Wu",
              "Wangyan Qin",
              "Mengyuan Zhou",
              "Jie Han",
              "Jia Tao",
              "Ziwei Zhao",
              "Di Dai",
              "Di He",
              "Dong Wang",
              "Binghui Tang",
              "Ling Huo",
              "James Zou",
              "Qingli Zhu",
              "Yong Wang",
              "Liwei Wang"
            ],
            "venue": "Nature Biomedical Engineering",
            "date": "April 2026",
            "links": [
              {
                "type": "journal",
                "url": "https://www.nature.com/articles/s41551-026-01639-1",
                "text": "Nature BME"
              },
              {
                "type": "pdf",
                "url": "https://arxiv.org/pdf/2501.06869",
                "text": "预印本 PDF"
              },
              {
                "type": "demo",
                "url": "./demo/BUSGen/index.html",
                "text": "在线演示"
              }
            ],
            "tags": [
              "医疗人工智能",
              "生成式人工智能"
            ],
            "highlight": true,
            "doi": "10.1038/s41551-026-01639-1",
            "year": "2026",
            "publicationType": "article",
            "coFirst": [
              "Haojun Yu",
              "Youcheng Li",
              "Nan Zhang",
              "Zihan Niu"
            ],
            "note": "Published online on 7 April 2026; volume and final page range not yet assigned in the publisher and Crossref records (checked 6 October 2026)."
          },
          {
            "title": "A Chain-of-thought Reasoning Breast Ultrasound Dataset Covering All Histopathology Categories",
            "semanticScholarId": "DOI:10.1038/s41597-026-06702-9",
            "authors": [
              "Haojun Yu",
              "Youcheng Li",
              "Zihan Niu",
              "Nan Zhang",
              "Xuantong Gong",
              "Huan Li",
              "Zhiying Zou",
              "Haifeng Qi",
              "Zhenxiao Cao",
              "Zijie Lan",
              "Xingjian Yuan",
              "Jiating He",
              "Haokai Zhang",
              "Shengtao Zhang",
              "Zicheng Wang",
              "Dong Wang",
              "Ziwei Zhao",
              "Congying Chen",
              "Yong Wang",
              "Wangyan Qin",
              "Qingli Zhu",
              "Liwei Wang"
            ],
            "venue": "Scientific Data",
            "date": "February 2026",
            "links": [
              {
                "type": "journal",
                "url": "https://www.nature.com/articles/s41597-026-06702-9",
                "text": "Scientific Data"
              },
              {
                "type": "arxiv",
                "url": "https://arxiv.org/abs/2509.17046"
              },
              {
                "type": "pdf",
                "url": "https://arxiv.org/pdf/2509.17046",
                "text": "预印本 PDF"
              },
              {
                "type": "dataset",
                "url": "https://doi.org/10.6084/m9.figshare.30838715",
                "text": "数据集"
              }
            ],
            "tags": [
              "医疗人工智能",
              "数据集"
            ],
            "highlight": true,
            "doi": "10.1038/s41597-026-06702-9",
            "year": "2026",
            "publicationType": "article",
            "volume": "13",
            "issue": "1",
            "pages": "370",
            "articleNumber": "370",
            "coFirst": [
              "Haojun Yu",
              "Youcheng Li",
              "Zihan Niu",
              "Nan Zhang",
              "Xuantong Gong",
              "Huan Li",
              "Zhiying Zou",
              "Haifeng Qi",
              "Zhenxiao Cao"
            ]
          }
        ]
      },
      {
        "year": "2025",
        "items": [
          {
            "title": "Using artificial intelligence system for assisting the classification of breast ultrasound glandular tissue components in dense breast tissue",
            "semanticScholarId": "DOI:10.1038/s41598-025-95871-5",
            "authors": [
              "Hongju Yan",
              "Chaochao Dai",
              "Xiaojing Xu",
              "Yuxuan Qiu",
              "Lifang Yu",
              "Lewen Huang",
              "Bei Lin",
              "Jianan Huang",
              "Chenxiang Jiang",
              "Yingzhao Shen",
              "Jing Ji",
              "Youcheng Li",
              "Lingyun Bao"
            ],
            "venue": "Scientific Reports",
            "volume": "15",
            "issue": "1",
            "pages": "11754",
            "date": "April 2025",
            "links": [
              {
                "type": "journal",
                "url": "https://www.nature.com/articles/s41598-025-95871-5"
              }
            ],
            "tags": [
              "医疗人工智能"
            ],
            "doi": "10.1038/s41598-025-95871-5",
            "year": "2025",
            "publicationType": "article",
            "articleNumber": "11754"
          }
        ]
      },
      {
        "year": "2024",
        "items": [
          {
            "title": "Knowledge-driven AI-generated data for accurate and interpretable breast ultrasound diagnoses",
            "semanticScholarId": "ARXIV:2407.16634",
            "authors": [
              "Haojun Yu",
              "Youcheng Li",
              "Nan Zhang",
              "Zihan Niu",
              "Xuantong Gong",
              "Yanwen Luo",
              "Quanlin Wu",
              "Wangyan Qin",
              "Mengyuan Zhou",
              "Jie Han",
              "Jia Tao",
              "Ziwei Zhao",
              "Di Dai",
              "Di He",
              "Dong Wang",
              "Binghui Tang",
              "Ling Huo",
              "Qingli Zhu",
              "Yong Wang",
              "Liwei Wang"
            ],
            "venue": "arXiv preprint arXiv:2407.16634",
            "date": "July 2024",
            "links": [
              {
                "type": "arxiv",
                "url": "https://arxiv.org/abs/2407.16634"
              },
              {
                "type": "pdf",
                "url": "https://arxiv.org/pdf/2407.16634"
              }
            ],
            "tags": [
              "医疗人工智能",
              "生成式人工智能"
            ],
            "year": "2024",
            "publicationType": "misc",
            "doi": "10.48550/arXiv.2407.16634",
            "eprint": "2407.16634",
            "archivePrefix": "arXiv",
            "primaryClass": "eess.IV"
          },
          {
            "title": "ST-CellSeg: Cell segmentation for imaging-based spatial transcriptomics using multi-scale manifold learning",
            "semanticScholarId": "DOI:10.1371/journal.pcbi.1012254",
            "authors": [
              "Youcheng Li",
              "Leann Lac",
              "Qian Liu",
              "Pingzhao Hu"
            ],
            "venue": "PLOS Computational Biology",
            "volume": "20",
            "issue": "6",
            "pages": "e1012254",
            "date": "June 2024",
            "links": [
              {
                "type": "journal",
                "url": "https://journals.plos.org/ploscompbiol/article?id=10.1371/journal.pcbi.1012254"
              }
            ],
            "tags": [
              "计算机视觉",
              "机器学习"
            ],
            "doi": "10.1371/journal.pcbi.1012254",
            "year": "2024",
            "publicationType": "article"
          }
        ]
      },
      {
        "year": "2023",
        "items": [
          {
            "title": "Mining Negative Temporal Contexts for False Positive Suppression in Real-Time Ultrasound Lesion Detection",
            "semanticScholarId": "DOI:10.1007/978-3-031-43987-2_1",
            "authors": [
              "Haojun Yu",
              "Youcheng Li",
              "QuanLin Wu",
              "Ziwei Zhao",
              "Dengbo Chen",
              "Dong Wang",
              "Liwei Wang"
            ],
            "venue": "Medical Image Computing and Computer Assisted Intervention – MICCAI 2023",
            "publisher": "Springer Nature Switzerland",
            "pages": "3-13",
            "date": "October 2023",
            "links": [
              {
                "type": "conference",
                "url": "https://link.springer.com/chapter/10.1007/978-3-031-43987-2_1"
              },
              {
                "type": "arxiv",
                "url": "https://arxiv.org/abs/2305.18060"
              },
              {
                "type": "pdf",
                "url": "https://arxiv.org/pdf/2305.18060"
              }
            ],
            "tags": [
              "医疗人工智能",
              "计算机视觉"
            ],
            "highlight": true,
            "doi": "10.1007/978-3-031-43987-2_1",
            "year": "2023",
            "publicationType": "inproceedings"
          }
        ]
      }
    ]
  },
  "experience": {
    "title": "个人经历",
    "subtitle": "从医疗人工智能研究到科研软件与产品研发",
    "items": [
      {
        "organization": "壹索智能 · Isoplex Intelligence",
        "role": "联合创始人兼 CTO",
        "period": "2025 年 6 月 – 至今",
        "description": "在壹索智能负责技术战略、产品研发与工程团队建设。",
        "highlights": [
          "主导 Iso-Sciland 科研工作空间研发，整合科学智能体、工具调用、数据分析与科研协作能力。",
          "制定科学世界模型研究项目 Iso-SWM 的技术路线，推进模型训练与评测。",
          "设计 Iso-LabOS 系统与验证原型，连接模型推演、实验执行与结果反馈。",
          "参与产品交付，推进与医院、高校及药企的合作。"
        ],
        "url": "https://www.sciland.cn/"
      },
      {
        "organization": "医准智能科技（北京）有限公司",
        "role": "算法研究实习生",
        "period": "2023 年 1 月 – 2025 年 6 月",
        "description": "从事乳腺超声筛查、诊断、视频病灶检测与生成式模型研究。",
        "highlights": [
          "参与的研究成果发表于 MICCAI 2023 与 Nature Biomedical Engineering（2026）。",
          "研发超声检测与诊断算法，并开展模型压缩和硬件加速工作。",
          "参与的导管原位癌（DCIS）诊断项目获第二届全国数字健康创新应用大赛全国一等奖。"
        ]
      },
      {
        "organization": "西安大略大学 · Western University",
        "role": "科研助理 · 导师：Pingzhao Hu 教授",
        "period": "2022 年 9 月 – 2023 年 7 月",
        "description": "获 Mitacs 与国家留学基金委资助开展远程科研。",
        "highlights": [
          "研发 ST-CellSeg，用于成像型空间转录组学中的细胞分割。",
          "完成算法实现与基准评测，并以第一作者发表于 PLOS Computational Biology。"
        ]
      },
      {
        "organization": "深圳安科高新技术股份有限公司",
        "role": "嵌入式工程师助理（实习）",
        "period": "2020 年 7 月 – 2020 年 9 月",
        "description": "在医疗设备领域积累早期工程经验。",
        "highlights": [
          "参与电路调试、固件优化与 ARM 平台嵌入式系统集成。"
        ]
      }
    ]
  },
  "awards": {
    "title": "荣誉奖项",
    "subtitle": "代表性奖学金与荣誉",
    "items": [
      {
        "name": "比亚迪奖学金、三好学生 · 北京大学",
        "year": "2025–2026",
        "type": "scholarship"
      },
      {
        "name": "华为奖学金 · 北京大学",
        "year": "2024–2025",
        "type": "scholarship"
      },
      {
        "name": "全国一等奖 · 第二届全国数字健康创新应用大赛",
        "year": "2024",
        "type": "competition"
      },
      {
        "name": "国家奖学金、三好学生 · 北京大学",
        "year": "2023–2024",
        "type": "scholarship"
      },
      {
        "name": "优秀毕业生 · 西安交通大学",
        "year": "2022–2023",
        "type": "honor"
      },
      {
        "name": "国家留学基金委奖学金、Mitacs 奖学金",
        "year": "2021–2022",
        "type": "fellowship"
      },
      {
        "name": "旷视奖学金 · 西安交通大学",
        "year": "2020–2021",
        "type": "scholarship"
      },
      {
        "name": "国家奖学金、三好学生 · 西安交通大学",
        "year": "2019–2020",
        "type": "scholarship"
      }
    ]
  },
  "teaching": {
    "title": "教学经历",
    "subtitle": "助教经历与课程资料",
    "courses": [
      {
        "title": "信息论",
        "link": "teaching/information_theory_24_spring.html",
        "period": "2024 年春季",
        "role": "助教",
        "institution": "北京大学",
        "description": "担任北京大学信息论课程助教。",
        "expanded": false
      },
      {
        "title": "机器学习",
        "link": "teaching/machine_learning_23_fall.html",
        "period": "2023 年秋季",
        "role": "助教",
        "institution": "北京大学",
        "description": "担任北京大学机器学习课程助教。",
        "expanded": false,
        "materials": [
          {
            "title": "课程讲义",
            "description": "2023 年秋季课程讲义。",
            "items": [
              {
                "name": "第 2 周讲义",
                "file": "teaching/machine_learning_notes/2023_Fall_ML_Note__Week_2__Lecture_2_.pdf"
              },
              {
                "name": "第 3 周讲义",
                "file": "teaching/machine_learning_notes/2023_Fall_ML_Note__Week_3__Lecture_3_.pdf"
              },
              {
                "name": "第 4 周讲义",
                "file": "teaching/machine_learning_notes/2023_Fall_ML_Note__Week_4__Lecture_4_.pdf"
              },
              {
                "name": "第 5 周讲义",
                "file": "teaching/machine_learning_notes/2023_Fall_ML_Note__Week_5__Lecture_5_.pdf"
              },
              {
                "name": "第 6 周讲义",
                "file": "teaching/machine_learning_notes/2023_Fall_ML_Note__Week_6__Lecture_6_.pdf"
              },
              {
                "name": "第 7 周讲义",
                "file": "teaching/machine_learning_notes/2023_Fall_ML_Note__Week_7__Lecture_7_.pdf"
              },
              {
                "name": "第 8 周讲义",
                "file": "teaching/machine_learning_notes/2023_Fall_ML_Note__Week_8__Lecture_8_.pdf"
              },
              {
                "name": "第 9 周讲义",
                "file": "teaching/machine_learning_notes/2023_Fall_ML_Note__Week_9__Lecture_9_.pdf"
              },
              {
                "name": "第 10 周讲义",
                "file": "teaching/machine_learning_notes/2023_Fall_ML_Note__Week_10__Lecture_10_.pdf"
              },
              {
                "name": "第 11 周讲义",
                "file": "teaching/machine_learning_notes/2023_Fall_ML_Note__Week_11__Lecture_11_.pdf"
              },
              {
                "name": "第 12 周讲义",
                "file": "teaching/machine_learning_notes/2023_Fall_ML_Note__Week_12__Lecture_12_.pdf"
              }
            ]
          }
        ]
      }
    ],
    "talks": []
  },
  "resources": {
    "title": "科研资源",
    "subtitle": "实用的科研平台与工具",
    "categories": [
      {
        "name": "学术平台",
        "items": [
          {
            "name": "Google Scholar",
            "url": "https://scholar.google.com",
            "icon": "resources/google-scholar.png",
            "description": "学术论文检索与引用追踪"
          },
          {
            "name": "ResearchGate",
            "url": "https://www.researchgate.net",
            "icon": "resources/rg.png",
            "description": "学术交流社区"
          },
          {
            "name": "Semantic Scholar",
            "url": "https://www.semanticscholar.org",
            "icon": "resources/semantic_scholar.png",
            "description": "人工智能辅助学术检索"
          }
        ]
      },
      {
        "name": "代码与数据",
        "items": [
          {
            "name": "GitHub",
            "url": "https://github.com",
            "icon": "resources/github.png",
            "description": "代码托管与协作"
          },
          {
            "name": "Papers with Code",
            "url": "https://paperswithcode.com",
            "icon": "resources/paperswithcode.png",
            "description": "机器学习论文与开源实现"
          }
        ]
      },
      {
        "name": "资讯与社区",
        "items": [
          {
            "name": "机器之心",
            "url": "https://www.jiqizhixin.com",
            "icon": "resources/ml-e1610553826718.jpg",
            "description": "人工智能中文资讯与研究解读"
          },
          {
            "name": "AI研习社",
            "url": "https://www.yanxishe.com",
            "icon": "resources/yanxishe.png",
            "description": "人工智能学习社区"
          }
        ]
      }
    ]
  },
  "navigation": {
    "sidebar": [
      {
        "id": "home",
        "label": "首页",
        "icon": "fas fa-user",
        "href": "index.html"
      },
      {
        "id": "research",
        "label": "学术研究",
        "icon": "fas fa-microscope",
        "href": "research.html"
      },
      {
        "id": "experience",
        "label": "个人经历",
        "icon": "fas fa-briefcase",
        "href": "experience.html"
      },
      {
        "id": "teaching",
        "label": "教学与资源",
        "icon": "fas fa-chalkboard-teacher",
        "href": "teaching.html"
      },
      {
        "id": "blog",
        "label": "博客",
        "icon": "fas fa-pen-nib",
        "href": "blog.html"
      }
    ]
  },
  "spa": {
    "displaySettings": {
      "news": {
        "initialCount": 3,
        "expandText": "查看更多动态",
        "collapseText": "收起"
      },
      "projects": {
        "showFilters": true,
        "expandable": true,
        "initialExpanded": false
      },
      "publications": {
        "groupByYear": true,
        "collapsibleYears": true,
        "showTags": true
      },
      "teaching": {
        "expandableCourses": true,
        "showMaterials": true,
        "initialExpanded": false
      },
      "talks": {
        "initialCount": 3,
        "expandText": "查看全部报告",
        "collapseText": "仅显示近期报告"
      },
      "resources": {
        "collapsibleCategories": true,
        "gridLayout": true
      }
    },
    "scrollSettings": {
      "smoothScroll": true,
      "offset": 80,
      "activeClassThreshold": 100,
      "scrollSpyThrottle": 100
    },
    "animations": {
      "fadeInDuration": 600,
      "slideToggleDuration": 400,
      "scrollDuration": 800,
      "staggerDelay": 100
    },
    "breakpoints": {
      "mobile": 768,
      "tablet": 1024,
      "desktop": 1200
    }
  },
  "pages": {
    "research": {
      "seo": {
        "title": "学术研究与论文 | 利友诚",
        "description": "利友诚在医疗人工智能、生成式模型与诊断推理领域的研究项目和学术论文。"
      }
    },
    "experience": {
      "seo": {
        "title": "个人经历 | 利友诚",
        "description": "利友诚的创业与科研经历：壹索智能联合创始人兼 CTO，北京大学人工智能博士研究生。"
      }
    },
    "teaching": {
      "seo": {
        "title": "教学与科研资源 | 利友诚",
        "description": "利友诚的教学经历、机器学习课程讲义与实用科研资源。"
      }
    },
    "blog": {
      "seo": {
        "title": "博客 | 利友诚 Youcheng Li",
        "description": "利友诚的中英文博客：深入解读 AI4S 与大语言模型的技术机制，分析国内外头部公司的技术与商业趋势。"
      }
    }
  }
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = SITE_CONFIG_ZH;
}
