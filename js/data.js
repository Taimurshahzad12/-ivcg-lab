// ============================================================
//  ALL SITE CONTENT LIVES HERE. Edit this file to update the site.
//  Every visible text is { en: "...", ko: "..." }.
//  Names, emails, links and paper titles are plain strings.
// ============================================================
window.LAB = {
  name: { en: "Intelligent Vision Computing and Graphics Laboratory", ko: "지능형 비전 컴퓨팅 및 그래픽스 연구실" },
  short: "IVCG Lab",
  university: { en: "Jeju National University", ko: "제주대학교" },
  department: { en: "Department of Computer Engineering", ko: "컴퓨터공학과" },
  room: "D430",
  phone: "+82-64-754-3659",
  email: "kimsk@jejunu.ac.kr",
  address: { en: "102 Jejudaehak-ro, Jeju-si, Jeju-do, 63243, Republic of Korea", ko: "제주특별자치도 제주시 제주대학로 102 (63243)" },
  tagline: {
    en: "Teaching machines to see, understand and generate the visual world.",
    ko: "기계가 시각 세계를 보고, 이해하고, 생성하도록 연구합니다."
  },
  intro: {
    en: "We study computer vision, deep-learning-based computer graphics, and augmented / virtual reality. Our goal is to build intelligent systems that perceive images and video, and turn that understanding into useful, interactive applications.",
    ko: "우리 연구실은 컴퓨터 비전, 딥러닝 기반 컴퓨터 그래픽스, 증강/가상현실을 연구합니다. 영상을 인식하고 이해하여 유용한 상호작용 응용으로 연결하는 지능형 시스템을 만드는 것이 목표입니다."
  },

  // Open positions banner (set to null to hide)
  recruiting: {
    en: "We are recruiting M.S. / Ph.D. students and interns. Please contact the professor by email.",
    ko: "석사/박사 과정생 및 학부 연구생을 모집합니다. 교수님께 이메일로 문의해 주세요."
  },

  research: [
    { id: "01", title: { en: "Computer Vision", ko: "컴퓨터 비전" },
      text: { en: "Recognition, detection and analysis of images and video, including facial expression analysis and face recognition.", ko: "표정 분석, 얼굴 인식을 포함한 영상 및 비디오의 인식·검출·분석." } },
    { id: "02", title: { en: "Deep Learning for Graphics", ko: "딥러닝 기반 그래픽스" },
      text: { en: "Neural methods for 3D geometry, mesh processing, panorama mosaicing and procedural content generation.", ko: "3D 형상, 메시 처리, 파노라마 모자이크, 절차적 콘텐츠 생성을 위한 신경망 기법." } },
    { id: "03", title: { en: "AR / VR / Mixed Reality", ko: "AR / VR / 혼합현실" },
      text: { en: "Immersive systems for education and training: AR learning media, virtual labs and wearable sensing interfaces.", ko: "AR 학습 미디어, 가상 실험실, 웨어러블 센싱 인터페이스 등 교육·훈련용 몰입형 시스템." } },
    { id: "04", title: { en: "Machine Learning & Big Data", ko: "머신러닝 & 빅데이터" },
      text: { en: "Learning from large-scale data, from traffic forecasting to language and mental-health classification.", ko: "교통 예측부터 언어 및 정신건강 분류까지 대규모 데이터 기반 학습." } }
  ],

  professor: {
    name: { en: "Prof. Soo Kyun Kim", ko: "김수균 교수" },
    title: { en: "Professor, Department of Computer Engineering", ko: "컴퓨터공학과 교수" },
    photo: "img/professor.jpg",          // put the photo here (optional)
    specialization: { en: "Intelligent Vision Computing / Computer Graphics / Virtual Reality", ko: "지능형 비전 컴퓨팅 / 컴퓨터 그래픽스 / 가상현실" },
    interests: [
      { en: "Computer Vision", ko: "컴퓨터 비전" },
      { en: "Deep Learning based Computer Graphics", ko: "딥러닝 기반 컴퓨터 그래픽스" },
      { en: "Virtual Reality", ko: "가상현실" }
    ],
    office: "D430",
    phone: "064-754-3659",
    email: "kimsk@jejunu.ac.kr",
    scholar: "https://scholar.google.com/citations?user=Yj0Vd7oAAAAJ&hl=en"
  },

  // ---- Add new members by copying one block into the right list ----
  members: {
    phd: [
      {
        name: { en: "Taimur Shahzad", ko: "타이무르 샤자드" },
        role: { en: "Ph.D. Student", ko: "박사과정" },
        photo: "img/taimur.jpg",
        interests: [
          { en: "Computer Vision", ko: "컴퓨터 비전" },
          { en: "Machine Learning", ko: "머신러닝" },
          { en: "Facial Expression Analysis", ko: "표정 분석" }
        ],
        email: "",
        scholar: "https://scholar.google.com/citations?user=ZRskuloAAAAJ&hl=en"
      }
    ],
    ms: [
      // { name:{en:"",ko:""}, role:{en:"M.S. Student",ko:"석사과정"}, photo:"img/x.jpg", interests:[{en:"",ko:""}], email:"", scholar:"" }
    ],
    undergrad: [],
    alumni: []
  },

  news: [
    { date: "2026-01-15",
      title: { en: "Paper published in Scientific Reports", ko: "Scientific Reports 논문 게재" },
      text: { en: "\"A large-scale annotated Urdu corpus and deep learning benchmark for mental health classification\" is now published.", ko: "\"A large-scale annotated Urdu corpus and deep learning benchmark for mental health classification\" 논문이 게재되었습니다." } },
    { date: "2023-03-01",
      title: { en: "IEEE Access paper", ko: "IEEE Access 논문 게재" },
      text: { en: "\"Role of zoning in facial expression using deep learning\" published in IEEE Access 11.", ko: "\"Role of zoning in facial expression using deep learning\" 논문이 IEEE Access 11권에 게재되었습니다." } }
  ],

  // Publications (from Google Scholar). Titles stay in English.
  publications: [
    { year: 2026, title: "A large-scale annotated Urdu corpus and deep learning benchmark for mental health classification", authors: "M Fatima, MS Khan, MS Faisal, T Shahzad, MA Iqbal, SK Kim", venue: "Scientific Reports" },
    { year: 2023, title: "Role of zoning in facial expression using deep learning", authors: "T Shahzad, K Iqbal, MA Khan, N Iqbal", venue: "IEEE Access 11, 16493-16508" },
    { year: 2021, title: "TrafficBERT: Pre-trained model with large-scale data for long-range traffic flow forecasting", authors: "KH Jin, JA Wi, EJ Lee, SJ Kang, SK Kim, YB Kim", venue: "Expert Systems with Applications 186, 115738" },
    { year: 2021, title: "Learning Media on Mathematical Education based on Augmented Reality", authors: "K Kounlaxay, Y Shim, SJ Kang, HY Kwak, SK Kim", venue: "KSII Trans. on Internet & Information Systems 15(3), 1015-1029" },
    { year: 2021, title: "Face recognition comparative analysis using different machine learning approaches", authors: "N Ahmed, FA Khan, Z Ullah, H Ahmed, T Shahzad, N Ali", venue: "Advances in Science and Technology Research Journal 15(1), 265-272" },
    { year: 2021, title: "Automatic Facial Expression Analysis and Recognition using Zone Based Active and Salient Facial Patches", authors: "K Iqbal, T Shahzad, M Faseeh", venue: "Foundation University Journal of Engineering and Applied Sciences 2(2), 12-20" },
    { year: 2020, title: "Mixed Reality System for Virtual Chemistry Lab", authors: "X Duan, SJ Kang, JI Choi, SK Kim", venue: "KSII Trans. on Internet & Information Systems 14(4), 1673" },
    { year: 2020, title: "Graph based wave function collapse algorithm for procedural content generation in games", authors: "H Kim, T Hahn, S Kim, S Kang", venue: "IEICE Trans. on Information and Systems 103(8), 1901-1910" },
    { year: 2020, title: "Application of FlexSim software for developing cyber learning factory for smart factory education and training", authors: "JW Kim, JS Park, SK Kim", venue: "Multimedia Tools and Applications 79(23), 16281-16297" },
    { year: 2018, title: "Development of a low-cost wearable sensing glove with multiple inertial sensors and a light and fast orientation estimation algorithm", authors: "Y Choi, K Yoo, SJ Kang, B Seo, SK Kim", venue: "The Journal of Supercomputing 74(8), 3639-3652" },
    { year: 2017, title: "Augmented-reality survey: from concept to application", authors: "SK Kim, SJ Kang, YJ Choi, MH Choi, M Hong", venue: "KSII Trans. on Internet & Information Systems 11(2), 982" },
    { year: 2013, title: "Extraction of ridge and valley lines from unorganized points", authors: "SK Kim", venue: "Multimedia Tools and Applications 63(1), 265-279" },
    { year: 2008, title: "Embedded panoramic mosaic system using auto-shot interface", authors: "SJ Ha, SH Lee, NI Cho, SK Kim, B Son", venue: "IEEE Trans. on Consumer Electronics 54(1), 16-24" },
    { year: 2007, title: "Panorama mosaic optimization for mobile camera systems", authors: "SJ Ha, HI Koo, SH Lee, NI Cho, SK Kim", venue: "IEEE Trans. on Consumer Electronics 53(4), 1217-1225" },
    { year: 2006, title: "Finding ridges and valleys in a discrete surface using a modified MLS approximation", authors: "SK Kim, CH Kim", venue: "Computer-Aided Design 38(2), 173-180" }
  ],

  projects: [
    // { title:{en:"",ko:""}, period:"2024 - 2026", funder:{en:"",ko:""}, text:{en:"",ko:""} }
  ]
};

// UI strings
window.UI = {
  nav: {
    home:         { en: "Home", ko: "홈" },
    professor:    { en: "Professor", ko: "교수진" },
    members:      { en: "Members", ko: "구성원" },
    research:     { en: "Research", ko: "연구분야" },
    publications: { en: "Publications", ko: "논문" },
    news:         { en: "News", ko: "소식" },
    contact:      { en: "Contact", ko: "연락처" }
  },
  s: {
    news: { en: "News", ko: "소식" },
    all: { en: "All →", ko: "전체 보기 →" },
    areas: { en: "Research Areas", ko: "연구 분야" },
    areasSub: { en: "What we work on", ko: "우리가 연구하는 분야" },
    prof: { en: "Professor", ko: "지도교수" },
    members: { en: "Members", ko: "구성원" },
    phd: { en: "Ph.D. Students", ko: "박사과정" },
    ms: { en: "M.S. Students", ko: "석사과정" },
    undergrad: { en: "Undergraduate Interns", ko: "학부 연구생" },
    alumni: { en: "Alumni", ko: "졸업생" },
    soon: { en: "Coming soon.", ko: "곧 추가됩니다." },
    pubs: { en: "Publications", ko: "논문 및 특허" },
    search: { en: "Search title, author, venue…", ko: "제목, 저자, 학술지 검색…" },
    projects: { en: "Projects", ko: "연구 과제" },
    contact: { en: "Contact", ko: "연락처" },
    phone: { en: "Phone", ko: "전화" },
    email: { en: "Email", ko: "이메일" },
    office: { en: "Office", ko: "연구실" },
    addr: { en: "Address", ko: "주소" },
    spec: { en: "Specialization", ko: "전공 분야" },
    explore: { en: "Our Research", ko: "연구 소개" },
    joinUs: { en: "Join Us", ko: "함께하기" },
    scholar: { en: "Google Scholar", ko: "구글 스칼라" },
    rights: { en: "All rights reserved.", ko: "모든 권리 보유." }
  }
};
