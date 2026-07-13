export interface VocabCard {
  word: string;
  pronunciation: string;
  simple_def: string;
  business_def: string;
  chinese: string;
  japanese: string;
  example: string;
  mistake: string;
}

export interface MapLink {
  a: string;
  b: string;
}

export interface EnglishCoachItem {
  category: string;
  has_issue: boolean;
  before: string;
  after: string;
  explanation: string;
}

export interface QualityItem {
  category: string;
  score: number;
  feedback: string;
}

export interface AppState {
  name: string;
  confidence: string | null;
  lang: "en" | "zh" | "ja";
  xp: number;
  badges: string[];
  visitDays: string[];
  currentStep: string;
  completedSteps: string[];
  sortPlacements: Record<string, "manager" | "leader">;
  summaryAnswers: Record<number, string>; // Discovery answers
  vocab: VocabCard[] | null;
  criticalQs: string[] | null;
  criticalAnswers: Record<number, string>;
  criticalHints: Record<number, string>;
  mapLinks: MapLink[];
  mapFeedback: string;
  reflection: Record<string, string>; // s1, s2, s3, s4, s5
  reflectionFeedback: Record<string, string>;
  englishCoach: EnglishCoachItem[] | null;
  quality: QualityItem[] | null;
  finalReflection: Record<string, string>; // biggest, surprising, insight, application, appreciation
  wordsWritten: number;
}

export const DEFAULT_STATE: AppState = {
  name: "",
  confidence: null,
  lang: "en",
  xp: 0,
  badges: [],
  visitDays: [],
  currentStep: "welcome",
  completedSteps: [],
  sortPlacements: {},
  summaryAnswers: {},
  vocab: null,
  criticalQs: null,
  criticalAnswers: {},
  criticalHints: {},
  mapLinks: [],
  mapFeedback: "",
  reflection: { s1: "", s2: "", s3: "", s4: "", s5: "" },
  reflectionFeedback: {},
  englishCoach: null,
  quality: null,
  finalReflection: { biggest: "", surprising: "", insight: "", application: "", appreciation: "" },
  wordsWritten: 0,
};

export const SCREENS = [
  "welcome",
  "dashboard",
  "confidence",
  "warmup",
  "t1-overview",
  "t1-read",
  "t1-summary",
  "t1-vocab",
  "t1-concepts",
  "t1-critical",
  "t1-connect",
  "t1-reflection",
  "t1-english",
  "t1-quality",
  "final",
  "export"
];

export const TRAIL_GROUPS = [
  { key: "welcome", icon: "🛫", labelEn: "Welcome", labelZh: "歡迎", labelJa: "ようこそ" },
  { key: "dashboard", icon: "🧭", labelEn: "Mission", labelZh: "學習任務", labelJa: "ミッション" },
  { key: "confidence", icon: "💬", labelEn: "Check-in", labelZh: "信心自評", labelJa: "自己評価" },
  { key: "warmup", icon: "☀️", labelEn: "Warm-up", labelZh: "暖身練習", labelJa: "ウォーミングアップ" },
  { key: "task1", icon: "1", labelEn: "Task 1", labelZh: "任務一", labelJa: "タスク1" },
  { key: "final", icon: "✍️", labelEn: "Reflect", labelZh: "總結反思", labelJa: "最終振り返り" },
  { key: "export", icon: "📄", labelEn: "Export", labelZh: "匯出報告", labelJa: "レポート出力" },
];

export const T1_STEPS = [
  "t1-overview",
  "t1-read",
  "t1-summary",
  "t1-vocab",
  "t1-concepts",
  "t1-critical",
  "t1-connect",
  "t1-reflection",
  "t1-english",
  "t1-quality",
];

export const LOCALES: Record<string, Record<string, string>> = {
  en: {
    // Top Bar & General
    appTitle: "Leading Across Borders",
    appSubTitle: "AI Leadership Learning Studio",
    xpLabel: "XP",
    daysStreak: "day streak",
    badgesEarned: "badges",
    langButton: "日本語",
    next: "Continue →",
    prev: "← Back",
    generate: "Generate",
    regenerate: "Regenerate",
    save: "Save",
    loading: "Thinking with you...",
    errorGeneric: "Failed to connect to the AI coach. Please try again.",

    // Welcome Screen
    welcomeTitle: "Leading Across Borders and Cultures",
    welcomeDesc: "A self-paced AI leadership coaching studio for international MBA students. We won't write your reflections for you — we'll help you think more sharply and write more confidently in English.",
    namePlaceholder: "What should we call you?",
    beginJourney: "Begin the journey →",

    // Dashboard Screen
    missionTitle: "Today's Learning Mission",
    missionSubtitle: "Transitioning from Manager to Global AI Leader",
    welcomeBack: "Welcome back, {name}.",
    welcomeGuest: "Welcome.",
    missionHeader: "Here's what today covers:",
    dateLabel: "Date",
    timeLabel: "Estimated Time",
    courseLabel: "Course",
    instructorLabel: "Instructor",
    instructorVal: "AI Leadership Coach",
    objectivesTitle: "Learning Objectives",
    obj1: "Distinguish manager mindset from leader mindset",
    obj2: "Build 10 advanced business vocabulary words",
    obj3: "Practice Socratic critical thinking in written English",
    obj4: "Produce an original, graduate-level reflection",
    quoteText: '"The very essence of leadership is that you have to have a vision. You can\'t blow an uncertain trumpet." — Theodore Hesburgh',

    // Confidence Screen
    confidenceTitle: "How confident are you today?",
    confidenceDesc: "There's no wrong answer — this just helps your AI coach support you better.",
    veryConfident: "Very confident",
    ready: "Ready",
    unsure: "Unsure",
    needHelp: "Need help",

    // Warmup Screen
    warmupTitle: "What makes a good graduate reflection?",
    warmupDesc: "Academic reflection isn't about whether you liked something. It's about showing how your thinking changed.",
    ladderPoor: "Poor",
    ladderGood: "Good",
    ladderExcellent: "Excellent MBA-level",
    poorVal: '"I like this article."',
    goodVal: '"This article challenged my previous understanding because it showed that management and leadership solve different problems."',
    excellentVal: '"This reading reframed leadership for me: rather than a more senior form of management, it is a distinct discipline of judgment — one that becomes more, not less, valuable as AI absorbs routine execution."',
    academicDesc: "Academic writing becomes stronger when you explain why something matters — not just what happened.",
    startTask1: "Start Task 1 →",

    // T1 Overview (Behavior sorting)
    overviewTitle: "HBR-Style Case: Manager → Leader",
    overviewDesc: "Why study this? This task builds your ability to recognize the difference between managing execution and leading direction — a core AI-era leadership competency.",
    outcomesTitle: "Learning outcomes",
    outcome1: "Identify manager-mindset vs. leader-mindset behaviors",
    outcome2: "Connect the distinction to your own leadership context",
    sortTitle: "Warm exercise: sort the behaviors",
    sortDesc: "Tap a behavior below, then tap the column it belongs in.",
    allSorted: "All sorted — nice work.",
    managerColumn: "Manager Mindset",
    leaderColumn: "Leader Mindset",
    continueReading: "Continue to reading →",

    // T1 Read Screen
    readingTitle: "The Shift from Manager to Global AI Leader",
    readNextBtn: "Continue to AI discovery →",

    // T1 Summary (Discovery Questions)
    discoveryTitle: "Explore before you conclude",
    discoveryDesc: "Click a question below. Your AI coach will help you think it through — not hand you the answer.",
    summaryNextBtn: "Continue to vocabulary →",

    // T1 Vocab Screen
    vocabTitle: "Advanced business vocabulary",
    vocabDesc: "Your AI coach is pulling 10 advanced words from the reading, with translations and example sentences.",
    vocabBtn: "Generate vocabulary list",
    vocabTip: "Click any card to expand or edit translations and definitions.",
    vocabWordLabel: "Word",
    vocabSimpleDefLabel: "Simple definition",
    vocabBusDefLabel: "Business meaning",
    vocabZhLabel: "中文 translation",
    vocabJaLabel: "日本語 translation",
    vocabExLabel: "Example sentence",
    vocabMistakeLabel: "Common mistake to avoid",
    vocabNextBtn: "Continue to concepts →",

    // T1 Concepts Screen
    conceptsTitle: "Key ideas to internalize",
    conceptsDesc: "Tap to expand and digest these core frameworks:",
    conceptsNextBtn: "Continue to critical thinking →",

    // T1 Critical Screen
    criticalTitle: "Socratic critical thinking",
    criticalDesc: "Your AI coach has prepared 5 critical-thinking questions. Type your answers in English. Stuck? Ask for a hint — not the answer.",
    criticalBtn: "Generate questions",
    getHint: "💡 Get Socratic hint",
    criticalNextBtn: "Continue to concept map →",

    // T1 Connect Screen
    connectTitle: "Map the relationships",
    connectDesc: "Tap two ideas to draw a connection between them. Build at least 3 connections.",
    removeBtn: "remove",
    askMapFeedback: "Ask coach about my map",
    connectNextBtn: "Continue to reflection →",

    // T1 Reflection Screen
    reflTitle: "Build your reflection, one sentence at a time",
    reflDesc: "Write your reflection paragraph step-by-step. Get real-time Socratic feedback on each sentence.",
    liveCoachingBtn: "🧑‍🏫 Get live coaching",
    reflNextBtn: "Continue to English coach →",

    // T1 English Screen
    englishTitle: "Let's polish your English",
    englishDesc: "Your coach will review your reflection draft for grammar, vocabulary, transitions, tone, passive voice, wordiness, and clarity — and explain the 'why' behind each suggestion. You remain the author.",
    reviewBtn: "Review my English",
    beforeLabel: "Before",
    afterLabel: "After",
    noIssueMsg: "Looks good here. No major issues detected.",
    englishNextBtn: "Continue to MBA quality check →",

    // T1 Quality Screen
    qualityTitle: "MBA Quality Checker",
    qualityDesc: "Your AI coach will evaluate your reflection against 7 graduate-level dimensions and plot your scores.",
    qualityBtn: "Run quality check",
    qualityNextBtn: "Finish Task 1 →",

    // Final Reflection Screen
    finalTitle: "Bring it all together",
    finalDesc: "Synthesize everything from Task 1 into five final leadership insights.",
    finalNextBtn: "Continue to export →",

    // Export Screen
    exportTitle: "You did it! 🎉",
    exportDesc: "Download or preview your fully structured, custom-designed MBA leadership report — containing all your inputs, Socratic insights, and AI feedback.",
    previewBtn: "👁️ Preview Formatted Report",
    downloadMd: "Download Markdown (.md)",
    downloadTxt: "Download Text (.txt)",
    editReport: "Edit Report Directly",
    closePreview: "Close Preview",
  },
  zh: {
    // Top Bar & General
    appTitle: "跨國領導力學堂",
    appSubTitle: "AI 領導力學習工作坊",
    xpLabel: "經驗值 (XP)",
    daysStreak: "日連續學習",
    badgesEarned: "個徽章",
    langButton: "English",
    next: "繼續下一步 →",
    prev: "← 返回",
    generate: "生成內容",
    regenerate: "重新生成",
    save: "保存修改",
    loading: "AI 導師正在與您一同思考...",
    errorGeneric: "連線至 AI 導師失敗，請重試。",

    // Welcome Screen
    welcomeTitle: "跨越國界與文化的領導力",
    welcomeDesc: "這是一個專為國際 MBA 學生設計的自主式 AI 領導力培訓工作坊。我們不會直接幫您寫心得，而是會引導您進行更深刻的思考，並自信地以英文撰寫反思報告。",
    namePlaceholder: "我們該如何稱呼您？",
    beginJourney: "開啟您的學習旅程 →",

    // Dashboard Screen
    missionTitle: "今日學習任務",
    missionSubtitle: "從管理者轉型為全球 AI 領袖",
    welcomeBack: "歡迎回來，{name}。",
    welcomeGuest: "歡迎。",
    missionHeader: "今天的工作坊包含：",
    dateLabel: "日期",
    timeLabel: "預計時間",
    courseLabel: "課程",
    instructorLabel: "指導導師",
    instructorVal: "AI 領導力導師",
    objectivesTitle: "學習目標",
    obj1: "區分「管理者」與「領導者」的心態差異",
    obj2: "掌握 10 個高階商業英語詞彙",
    obj3: "練習以英文進行蘇格拉底式的批判性思考",
    obj4: "撰寫一篇達到商學院碩士水準的原創反思報告",
    quoteText: '「領導力的精髓在於擁有遠見。如果號角吹出模糊不清的聲音，沒有人會準備戰鬥。」—— 西奧多·赫斯伯格',

    // Confidence Screen
    confidenceTitle: "您今天感覺多有信心？",
    confidenceDesc: "這沒有標準答案——這將幫助您的 AI 導師為您提供更個人化的引導與支持。",
    veryConfident: "信心十足",
    ready: "準備就緒",
    unsure: "有些猶豫",
    needHelp: "需要協助",

    // Warmup Screen
    warmupTitle: "什麼是一篇優秀的商學院反思報告？",
    warmupDesc: "學術反思不是「喜不喜歡」某篇文章，而是展現您的思維模式是如何「轉變與提升」的。",
    ladderPoor: "一般 (Poor)",
    ladderGood: "良好 (Good)",
    ladderExcellent: "商學院優秀水準 (Excellent)",
    poorVal: '「我很喜歡這篇文章。」',
    goodVal: '「這篇文章挑戰了我過去的認知，因為它指出管理和領導解決的是不同的問題。」',
    excellentVal: '「這篇閱讀重塑了我對領導力的看法：領導力並非更高階的管理，而是一門獨特的「判斷力學問」——當 AI 逐漸接管常規執行工作時，領導力的價值不減反增。」',
    academicDesc: "學術寫作的強大在於解釋「為什麼」這件事很重要——而不僅僅是描述發生了什麼。",
    startTask1: "開始任務一 →",

    // T1 Overview (Behavior sorting)
    overviewTitle: "哈佛商學院案例研究：管理者 → 領導者",
    overviewDesc: "為什麼要學這個？本任務將幫助您學會分辨「管理執行」與「引領方向」之間的關鍵差異，這是 AI 時代下核心的領導力素養。",
    outcomesTitle: "預期學習成效",
    outcome1: "分辨管理者與領導者心態下的具體行為特徵",
    outcome2: "將此差異與您自身的領導實踐情境相連結",
    sortTitle: "暖身練習：行為分類卡片",
    sortDesc: "點擊下方的一項行為，接著點擊適合的欄位將它分類。",
    allSorted: "全數分類完成！做得好！",
    managerColumn: "管理者心態 (Manager)",
    leaderColumn: "領導者心態 (Leader)",
    continueReading: "繼續閱讀文章 →",

    // T1 Read Screen
    readingTitle: "從管理者轉型為全球 AI 領袖",
    readNextBtn: "繼續探索 AI 蘇格拉底引導 →",

    // T1 Summary (Discovery Questions)
    discoveryTitle: "在得出結論前進行探索",
    discoveryDesc: "點擊下方任何一個問題。您的 AI 導師將引導您逐步剖析，而不是直接給您標準答案。",
    summaryNextBtn: "繼續學習高階詞彙 →",

    // T1 Vocab Screen
    vocabTitle: "高階商業領導力詞彙",
    vocabDesc: "您的 AI 導師正從閱讀文章中提取 10 個核心商業詞彙，並附帶中文/日文翻譯、例句及常見錯誤提示。",
    vocabBtn: "生成單字詞彙庫",
    vocabTip: "點擊任何字卡即可展開、並可直接編輯翻譯與定義內容以加深記憶。",
    vocabWordLabel: "字彙",
    vocabSimpleDefLabel: "簡單定義",
    vocabBusDefLabel: "商業脈絡釋義",
    vocabZhLabel: "繁體中文翻譯",
    vocabJaLabel: "日文翻譯",
    vocabExLabel: "商業應用例句",
    vocabMistakeLabel: "應避免的常見錯誤",
    vocabNextBtn: "繼續閱讀核心概念 →",

    // T1 Concepts Screen
    conceptsTitle: "值得內化的核心觀念",
    conceptsDesc: "點擊展開並消化以下核心領導力架構：",
    conceptsNextBtn: "繼續批判性思考練習 →",

    // T1 Critical Screen
    criticalTitle: "蘇格拉底式批判思考",
    criticalDesc: "您的 AI 導師準備了 5 個批判性思考問題。請以英文輸入您的回答。遇到瓶頸？可點擊獲取蘇格拉底提示（非標準答案）。",
    criticalBtn: "生成批判性思考問題",
    getHint: "💡 獲取蘇格拉底引導提示",
    criticalNextBtn: "繼續進行概念關聯圖 →",

    // T1 Connect Screen
    connectTitle: "將觀念連結起來",
    connectDesc: "點擊兩個不同的概念，為它們畫出關聯線。請至少建立 3 個關聯。",
    removeBtn: "刪除連結",
    askMapFeedback: "尋求 AI 導師對關係圖的分析",
    connectNextBtn: "繼續撰寫反思報告 →",

    // T1 Reflection Screen
    reflTitle: "逐句建立您的反思報告",
    reflDesc: "一步步寫出您的反思段落。點擊按鈕獲取針對每一句的即時蘇格拉底寫作指導。",
    liveCoachingBtn: "🧑‍🏫 獲取寫作指導",
    reflNextBtn: "繼續進行英語潤色 →",

    // T1 English Screen
    englishTitle: "潤色您的英文表達",
    englishDesc: "導師將會針對您反思報告的語法、詞彙、過渡銜接、語調、被動語態、冗餘表述及清晰度進行全面審閱，並解釋修改原因。您依然是這篇報告的唯一作者。",
    reviewBtn: "進行英文審閱",
    beforeLabel: "修改前",
    afterLabel: "修改後",
    noIssueMsg: "此項表達相當流暢，未檢測出明顯問題。",
    englishNextBtn: "繼續進行商學院水準檢測 →",

    // T1 Quality Screen
    qualityTitle: "MBA 反思報告水準評鑑",
    qualityDesc: "您的 AI 導師將從 7 個維度對您的報告進行學術水準評估，並繪製出分析雷達圖。",
    qualityBtn: "進行報告水準評測",
    qualityNextBtn: "完成任務一 →",

    // Final Reflection Screen
    finalTitle: "總結與沉澱",
    finalDesc: "將任務一中所有的學習體驗與發現，轉化為 5 項對您未來的領導實踐最核心的洞察。",
    finalNextBtn: "繼續匯出學習報告 →",

    // Export Screen
    exportTitle: "太棒了！您已成功完成任務！🎉",
    exportDesc: "下載或預覽您的專屬 MBA 領導力學習報告——包含您所有的原創回答、蘇格拉底思維演練以及 AI 導師的專業回饋。",
    previewBtn: "👁️ 預覽報告格式 (可直接修改)",
    downloadMd: "下載 Markdown 格式 (.md)",
    downloadTxt: "下載純文字格式 (.txt)",
    editReport: "直接編輯報告內容",
    closePreview: "關閉預覽",
  },
  ja: {
    // Top Bar & General
    appTitle: "国境を越えるリーダーシップ",
    appSubTitle: "AIリーダーシップ学習スタジオ",
    xpLabel: "XP",
    daysStreak: "日連続",
    badgesEarned: "個のバッジ",
    langButton: "繁體中文",
    next: "次へ進む →",
    prev: "← 戻る",
    generate: "生成",
    regenerate: "再生成",
    save: "保存",
    loading: "AIコーチが一緒に考えています...",
    errorGeneric: "AIコーチへの接続に失敗しました。もう一度お試しください。",

    // Welcome Screen
    welcomeTitle: "国境と文化を越えるリーダーシップ",
    welcomeDesc: "国際MBA生のための自主学習型AIリーダーシップコーチングスタジオ。私たちはあなたのレポートを代筆することはありません。あなたがより深く思考し、英語で自信を持って振り返りを執筆できるようサポートします。",
    namePlaceholder: "お名前を教えてください。",
    beginJourney: "学習を開始する →",

    // Dashboard Screen
    missionTitle: "本日の学習ミッション",
    missionSubtitle: "管理者からグローバルAIリーダーへの転換",
    welcomeBack: "おかえりなさい、{name}さん。",
    welcomeGuest: "ようこそ。",
    missionHeader: "今日の学習内容：",
    dateLabel: "日付",
    timeLabel: "所要時間（目安）",
    courseLabel: "コース",
    instructorLabel: "指導教官",
    instructorVal: "AIリーダーシップコーチ",
    objectivesTitle: "学習目標",
    obj1: "管理者マインドセットとリーダーマインドセットの違いを理解する",
    obj2: "10の高度なビジネス・リーダーシップ語彙を身につける",
    obj3: "書面での英語によるソクラテス式の批判的思考を実践する",
    obj4: "大学院レベルのオリジナルの振り返りレポートを作成する",
    quoteText: "「リーダーシップの本質とは、ビジョンを持つことである。不確かなラッパを吹くことはできない。」 — セオドア・ヘスバーグ",

    // Confidence Screen
    confidenceTitle: "今日の自信の度合いはいかがですか？",
    confidenceDesc: "正解はありません。AIコーチがあなたを最適にサポートするために役立てられます。",
    veryConfident: "自信に満ちている",
    ready: "準備完了",
    unsure: "少し不安",
    needHelp: "サポートが必要",

    // Warmup Screen
    warmupTitle: "大学院レベルの優れた振り返りとは？",
    warmupDesc: "学術的な振り返りとは、あるトピックが好きか嫌いかを書くことではありません。あなたの「考え方がどのように変化したか」を示すことです。",
    ladderPoor: "不十分 (Poor)",
    ladderGood: "良好 (Good)",
    ladderExcellent: "優秀（MBAレベル） (Excellent)",
    poorVal: "「この記事が気に入りました。」",
    goodVal: "「この記事は私のこれまでの理解に挑戦するものでした。なぜなら、管理とリーダーシップは異なる課題を解決することを教えてくれたからです。」",
    excellentVal: "「このリーディングは、私にとってリーダーシップを再定義してくれました。単に管理職の上位職種なのではなく、判断力という独自の規律であり、AIがルーティン的な実行業務を吸収するにつれて、リーダーシップの価値は下がるどころか高まるのだと実感しました。」",
    academicDesc: "何が起きたか（事実）だけでなく、なぜそれが重要なのか（意義）を説明することで、学術的な執筆は格段に説得力を増します。",
    startTask1: "タスク 1 を開始する →",

    // T1 Overview (Behavior sorting)
    overviewTitle: "HBR風ケーススタディ：管理者からリーダーへ",
    overviewDesc: "なぜこれを学ぶのか？実行の管理と方向性の先導との違いを見極める能力を養います。これは、AI時代における核心的なリーダーシップコンピテンシーです。",
    outcomesTitle: "期待される学習成果",
    outcome1: "管理者マインドセットとリーダーマインドセットの行動特性を識別する",
    outcome2: "この違いを自身のリーダーシップの文脈に関連付ける",
    sortTitle: "ミニ演習：行動分類カード",
    sortDesc: "下の行動をタップし、属する列を選択して分類してください。",
    allSorted: "すべて分類されました。素晴らしい！",
    managerColumn: "管理者マインドセット (Manager)",
    leaderColumn: "リーダーマインドセット (Leader)",
    continueReading: "リーディング記事へ進む →",

    // T1 Read Screen
    readingTitle: "管理者からグローバルAIリーダーへの転換",
    readNextBtn: "AIディスカバリーへ進む →",

    // T1 Summary (Discovery Questions)
    discoveryTitle: "結論を出す前に探求する",
    discoveryDesc: "下の質問をクリックしてください。AIコーチは答えを直接教えるのではなく、あなたが自分で答えを導き出せるようソクラテス式にサポートします。",
    summaryNextBtn: "ビジネス語彙学習へ進む →",

    // T1 Vocab Screen
    vocabTitle: "高度なビジネス語彙",
    vocabDesc: "AIコーチがリーディングから10個の高度な語彙を抽出し、日本語・中国語訳と例文、よくある間違いを解説します。",
    vocabBtn: "単語リストを生成する",
    vocabTip: "任意のカードをクリックして詳細を展開すると、定義や翻訳を自由に編集して記憶を定着させることができます。",
    vocabWordLabel: "語彙",
    vocabSimpleDefLabel: "シンプルな定義",
    vocabBusDefLabel: "ビジネスにおける意味",
    vocabZhLabel: "中国語（繁体字）訳",
    vocabJaLabel: "日本語訳",
    vocabExLabel: "応用例文",
    vocabMistakeLabel: "避けるべきよくある間違い",
    vocabNextBtn: "コアコンセプトへ進む →",

    // T1 Concepts Screen
    conceptsTitle: "内化すべき重要な考え方",
    conceptsDesc: "タップして各コアフレームワークを展開し、理解を深めましょう：",
    conceptsNextBtn: "批判的思考の実践へ進む →",

    // T1 Critical Screen
    criticalTitle: "ソクラテス式批判的思考",
    criticalDesc: "AIコーチが5つの批判的思考のための質問を用意しました。英語で回答を記入してください。行き詰まった場合は、答えではなく、ソクラテス式のヒントを求めましょう。",
    criticalBtn: "質問を生成する",
    getHint: "💡 ソクラテス式ヒントを得る",
    criticalNextBtn: "コンセプトマップへ進む →",

    // T1 Connect Screen
    connectTitle: "コンセプトのつながりをマップ化する",
    connectDesc: "2つのアイデアをタップして、関係性を表す線を引いてください。少なくとも3つのつながりを作成しましょう。",
    removeBtn: "削除",
    askMapFeedback: "マップについてコーチのフィードバックを求める",
    connectNextBtn: "振り返りレポート作成へ進む →",

    // T1 Reflection Screen
    reflTitle: "一文ずつ振り返りを組み立てる",
    reflDesc: "振り返りの段落を一歩一歩作成しましょう。各文章に対してリアルタイムでソクラテス式のライティング指導を受けることができます。",
    liveCoachingBtn: "🧑‍🏫 ライティング指導を受ける",
    reflNextBtn: "英文のブラッシュアップへ進む →",

    // T1 English Screen
    englishTitle: "英語表現を磨き上げる",
    englishDesc: "コーチがあなたの振り返りドラフトの文法、語彙、論理の展開、語調、受動態、冗長な表現、明瞭さをレビューし、なぜその修正が必要なのかを解説します。執筆の主役はあくまであなた自身です。",
    reviewBtn: "英文のレビューを受ける",
    beforeLabel: "修正前",
    afterLabel: "修正後",
    noIssueMsg: "とてもスムーズな表現です。大きな問題は検出されませんでした。",
    englishNextBtn: "MBAレベル品質チェックへ進む →",

    // T1 Quality Screen
    qualityTitle: "MBA振り返り品質チェッカー",
    qualityDesc: "AIコーチがあなたのレポートを7つの大学院生レベルの評価基準で評価し、レーダーチャートでスコアを可視化します。",
    qualityBtn: "品質チェックを実行する",
    qualityNextBtn: "タスク1を完了する →",

    // Final Reflection Screen
    finalTitle: "全体を統合する",
    finalDesc: "タスク1のすべての学びを、あなたの将来に役立つ5つの重要なリーダーシップ・インサイトに昇華させましょう。",
    finalNextBtn: "レポート出力へ進む →",

    // Export Screen
    exportTitle: "やり遂げました！ 🎉",
    exportDesc: "あなたのオリジナル回答、ソクラテス式の演習、AIコーチからのフィードバックがすべて含まれた、美しく構造化されたカスタムMBAリーダーシップレポートをプレビュー、またはダウンロードできます。",
    previewBtn: "👁️ レポートのプレビューと直接編集",
    downloadMd: "Markdown形式でダウンロード (.md)",
    downloadTxt: "テキスト形式でダウンロード (.txt)",
    editReport: "レポートを直接編集する",
    closePreview: "プレビューを閉じる",
  },
};
