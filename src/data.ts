export interface SortChip {
  id: string;
  textEn: string;
  textZh: string;
  textJa: string;
  correctCol: "manager" | "leader";
}

export const SORT_CHIPS: SortChip[] = [
  { id: "m1", textEn: "Follows the existing process", textZh: "遵循既有的作業流程", textJa: "既有のプロセスに従う", correctCol: "manager" },
  { id: "m2", textEn: "Focuses on this quarter's targets", textZh: "專注於本季度的數字指標", textJa: "今期の数値目標に注力する", correctCol: "manager" },
  { id: "m3", textEn: "Directs tasks step by step", textZh: "一步步指派並監控具體工作", textJa: "業務を一つずつ指示・監視する", correctCol: "manager" },
  { id: "m4", textEn: "Protects stability and predictability", textZh: "維護團隊穩定性與結果可預測性", textJa: "安定性と結果の予測可能性を維持する", correctCol: "manager" },
  { id: "m5", textEn: "Solves problems as they appear", textZh: "在問題浮現時進行被動解決", textJa: "問題が発生した際に対処する（受動的解決）", correctCol: "manager" },
  { id: "m6", textEn: "Optimizes the current system", textZh: "優化既有系統的運行效率", textJa: "既存システムの効率を最大化する", correctCol: "manager" },
  { id: "l1", textEn: "Questions whether the process still makes sense", textZh: "質疑既有流程是否依然符合當前目標", textJa: "既存のプロセスが現在も適切であるか疑問を投げかける", correctCol: "leader" },
  { id: "l2", textEn: "Focuses on where the industry is heading", textZh: "專注於產業未來五到十年的演進趨勢", textJa: "業界の今後のトレンドや進むべき方向性に注力する", correctCol: "leader" },
  { id: "l3", textEn: "Builds shared purpose across teams", textZh: "凝聚跨部門的共同願景與核心價值", textJa: "部門を超えた共通のビジョンと価値観を構築する", correctCol: "leader" },
  { id: "l4", textEn: "Invites productive disruption", textZh: "在適當時機引入破壞式創新", textJa: "適切なタイミングで創造的破壊や革新を促す", correctCol: "leader" },
  { id: "l5", textEn: "Anticipates problems before they appear", textZh: "提前預測並防範潛在的系統風險", textJa: "問題が発生する前に予測し、予防策を講じる", correctCol: "leader" },
  { id: "l6", textEn: "Designs new systems and capabilities", textZh: "設計全新的核心能力與技術架構", textJa: "新しいシステムや組織のコア機能を設計する", correctCol: "leader" },
];

export const DISCOVERY_QUESTIONS = [
  {
    en: "What surprised you in this reading?",
    zh: "在本次閱讀中，有什麼觀點最令您感到意外或驚奇？",
    ja: "今回のリーディングにおいて、最も意外に感じた、または驚いた視点は何ですか？",
  },
  {
    en: "What problem is the author trying to solve?",
    zh: "作者在此篇閱讀中試圖解決的根本核心問題是什麼？",
    ja: "著者がこの文章を通じて解決しようとしている、根本的な課題は何でしょうか？",
  },
  {
    en: "What would happen if AI never improved further — would this argument still matter?",
    zh: "如果 AI 的技術從此不再進步，作者關於管理與領導的論點是否依然成立？為什麼？",
    ja: "もしAIの技術革新がここで止まったとしても、著者の管理者とリーダーに関する論説は依然として有効でしょうか？それはなぜですか？",
  },
  {
    en: "Where do you disagree, even a little?",
    zh: "在本文的推論中，有哪些論點是您抱持保留態度、甚至些微反對的？",
    ja: "本文の主張の中で、少しでも疑問を抱いたり、同意しかねる部分はありますか？",
  },
];

export interface ConceptCard {
  nameEn: string;
  nameZh: string;
  nameJa: string;
  bodyEn: string;
  bodyZh: string;
  bodyJa: string;
}

export const CONCEPTS: ConceptCard[] = [
  {
    nameEn: "Technical Fluency",
    nameZh: "技術敏銳度 (Technical Fluency)",
    nameJa: "技術的リテラシー (Technical Fluency)",
    bodyEn: "Understanding what AI systems can and cannot responsibly do — not becoming a software engineer, but knowing enough to ask sharp questions before adopting a tool.",
    bodyZh: "理解 AI 系統能做到什麼、不能負責任地做到什麼——不需要成為軟體工程師，但必須了解足夠的底層邏輯，以便在引進技術時提出犀利的問題。",
    bodyJa: "AIシステムに何ができて何ができない（または責任を持てない）のかを理解すること。エンジニアになる必要はありませんが、新しい技術を導入する際に鋭い質問ができる知識を持つことを指します。",
  },
  {
    nameEn: "Cultural Fluency",
    nameZh: "文化敏銳度 (Cultural Fluency)",
    nameJa: "文化的リテラシー (Cultural Fluency)",
    bodyEn: "Recognizing that trust, hierarchy, feedback, and decision-making look different across cultures — and adapting your leadership style rather than exporting one default.",
    bodyZh: "體認到信任、組織層級、反饋機制與決策模式在不同文化背景下可能截然不同——並據此靈活調整您的領導風格，而非死板地複製單一默认模式。",
    bodyJa: "信頼関係、階層構造、フィードバック、意思決定のあり方が文化によって異なることを認識し、自国のルールを押し付けるのではなく、現地の文化に適応したリーダーシップスタイルをとること。",
  },
  {
    nameEn: "Ethical Fluency",
    nameZh: "倫理敏銳度 (Ethical Fluency)",
    nameJa: "倫理的リテラシー (Ethical Fluency)",
    bodyEn: "Asking who benefits and who is put at risk by a system before it is built, not after it fails. Ethical fluency is a design habit, not a compliance checklist.",
    bodyZh: "在系統建立之前（而非失敗之後）主動詢問：誰將從中受益？誰又將面臨風險？倫理敏銳度應是內化的「設計習慣」，而非流於形式的「法規合規清單」。",
    bodyJa: "システムが構築された後ではなく、構築する前に「誰が恩恵を受け、誰がリスクにさらされるのか」を問うこと。倫理的リテラシーは単なるコンプライアンスのチェックリストではなく、設計段階からの習慣であるべきです。",
  },
  {
    nameEn: "Judgment Over Execution",
    nameZh: "判斷力重於執行力 (Judgment Over Execution)",
    nameJa: "実行よりも判断力の重視 (Judgment Over Execution)",
    bodyEn: "As AI absorbs more routine execution, the leader's scarce contribution shifts toward deciding which problems are worth solving at all.",
    bodyZh: "隨著 AI 吸收越來越多常規的執行性工作，領導者最稀缺、最具價值的貢獻，正向「決定哪些問題根本值得去解決」轉移。",
    bodyJa: "AIがルーティン的な実行業務を吸収するにつれて、リーダーがもたらす希少かつ高価値な貢献は、「そもそもどの課題を解決すべきか」を決定することへとシフトします。",
  },
];

export interface MapNode {
  id: string;
  labelEn: string;
  labelZh: string;
  labelJa: string;
  x: number; // percentage coordinate
  y: number; // percentage coordinate
}

export const MAP_NODES: MapNode[] = [
  { id: "ai", labelEn: "AI", labelZh: "人工智慧", labelJa: "人工知能 (AI)", x: 50, y: 15 },
  { id: "leadership", labelEn: "Leadership", labelZh: "領導力", labelJa: "リーダーシップ", x: 15, y: 55 },
  { id: "ethics", labelEn: "Ethics", labelZh: "倫理與道德", labelJa: "倫理と道徳", x: 50, y: 90 },
  { id: "culture", labelEn: "Culture", labelZh: "組織文化", labelJa: "組織文化", x: 85, y: 55 },
  { id: "innovation", labelEn: "Innovation", labelZh: "技術創新", labelJa: "技術革新", x: 50, y: 52 },
];

export const REFLECTION_SENTENCE_PROMPTS = [
  {
    key: "s1",
    en: "Sentence 1 — What is the main idea or shift you recognized in this reading?",
    zh: "第一句 — 您在本次閱讀中，體會到的核心論點或觀點轉變是什麼？",
    ja: "第1文 — 今回のリーディングを通じて認識した、核心的な論点やマインドセットの転換は何ですか？",
  },
  {
    key: "s2",
    en: "Sentence 2 — What specific concept or detail surprised you, and why?",
    zh: "第二句 — 閱讀中哪個具體概念或細節最令您感到意外？為什麼？",
    ja: "第2文 — 記事の中で最も意外だった、または興味深かった具体的な概念や詳細と、その理由は何ですか？",
  },
  {
    key: "s3",
    en: "Sentence 3 — Why is this shift critical for organizations facing the rise of AI?",
    zh: "第三句 — 面對 AI 的崛起，為什麼上述的心態轉變對組織來說至關重要？",
    ja: "第3文 — AIが台頭する組織にとって、なぜこのマインドセットの転換が極めて重要なのでしょうか？",
  },
  {
    key: "s4",
    en: "Sentence 4 — How can you apply this directly to your own current or future leadership role?",
    zh: "第四句 — 您將如何把這個觀點直接應用於您現在或未來的領導實踐中？",
    ja: "第4文 — この考え方を、あなた自身が現在または将来就くリーダーシップの役割にどのように直接応用できますか？",
  },
  {
    key: "s5",
    en: "Sentence 5 — What is your ultimate, highest-level takeaway or vision for AI leadership?",
    zh: "第五句 — 關於「AI 時代的全球領導力」，您最終總結出的最高層次願景是什麼？",
    ja: "第5文 — 「AI時代のグローバルリーダーシップ」について、最終的にあなたが得た最高のビジョンやビジョンは何ですか？",
  },
];

export const FINAL_REFLECTION_FIELDS = [
  {
    key: "biggest",
    en: "1. What is the single biggest lesson you are taking away from today's work?",
    zh: "1. 您從今天的工作坊中，帶走最重要的一堂課是什麼？",
    ja: "1. 本日のワークショップから得た、最も重要だと思う教訓（レッスン）は何ですか？",
  },
  {
    key: "surprising",
    en: "2. What did you discover about your own writing or thinking style that surprised you?",
    zh: "2. 對於自己平常的「寫作」或「思考」風格，您發現了什麼令您驚奇的新特色？",
    ja: "2. ご自身の「執筆」や「思考」のスタイルについて、驚いた新しい発見はありましたか？",
  },
  {
    key: "insight",
    en: "3. Formulate a new leadership core insight that you did not possess prior to today.",
    zh: "3. 試著為自己定出一個「在今天之前，您不曾擁有過」的全新領導力核心洞察。",
    ja: "3. 本日を始める前には持っていなかった、新しいリーダーシップに関する核心的なインサイトを言葉にしてください。",
  },
  {
    key: "application",
    en: "4. Identify one concrete situation in the next 30 days where you will act as a Leader, not a Manager.",
    zh: "4. 指出未來 30 天內的一個具體工作/學習情境，在那裡您將像「領導者」而非僅僅是「管理者」般行動。",
    ja: "4. 今後30日間で、単なる管理者ではなく「リーダー」として行動する具体的な状況を1つ特定してください。",
  },
  {
    key: "appreciation",
    en: "5. Write a brief note of appreciation for a virtual classmate or colleague, thanking them for encouraging productive disruption.",
    zh: "5. 寫一封簡短的感謝信給一位虛擬同學或同事，感謝他們在日常中激發了極具成效的思維破壞與創新。",
    ja: "5. 生産的な挑戦や破壊的思考を促してくれた（バーチャルな）同僚やクラスメートへの、短い感謝のメッセージを書いてください。",
  },
];
