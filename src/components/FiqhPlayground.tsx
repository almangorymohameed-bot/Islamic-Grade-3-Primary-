import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Award, 
  HelpCircle, 
  HeartHandshake, 
  Check, 
  Flame, 
  Sparkles, 
  Coins, 
  Info, 
  X,
  Volume2,
  Bookmark,
  Droplets,
  Trash2,
  RotateCcw,
  Sparkle
} from 'lucide-react';
import SoundEngine from '../lib/audio';

// Wudu Steps Interface for Sudanese Curriculum (Grade 3)
interface WuduStep {
  id: number;
  label: string;
  isRequired: 'faridha' | 'sunnah';
  desc: string;
}

const correctWuduSteps: WuduStep[] = [
  { id: 1, label: "النية والتسمية بالقلب", isRequired: "faridha", desc: "استحضار نية طهارة الصلاة بالقلب وقول: بسم الله." },
  { id: 2, label: "غسل الكفين ثلاثاً", isRequired: "sunnah", desc: "غسل كفي اليدين إلى الكوعين بالماء الطهور النظيف ثلاثاً." },
  { id: 3, label: "المضمضة ثلاثاً باليمين", isRequired: "sunnah", desc: "إدخال مياه طهورة في الفم باليد اليمنى وتحريكها ثم مجها." },
  { id: 4, label: "الاستنشاق والاستنثار ثلاثاً", isRequired: "sunnah", desc: "جذب الماء برفق مع عضل الأنفس باليمين ونثره مستعيناً باليسرى." },
  { id: 5, label: "غسل الوجه كاملاً", isRequired: "faridha", desc: "من منابت شعر الرأس جبهةً إلى أسفل الذقن، ومن الأذن السليمة للأذن." },
  { id: 6, label: "غسل اليدين مع المرفقين", isRequired: "faridha", desc: "غسل اليد اليمنى ثم اليسرى جيداً متضمناً مفصل المرفق العاقد." },
  { id: 7, label: "مسح الرأس المبلل بالماء", isRequired: "faridha", desc: "مسح خصلات شعر الرأس ذهاباً وإياباً باليدين المبللتين مرّة واحدة." },
  { id: 8, label: "مسح الأذنين وباطنهما", isRequired: "sunnah", desc: "تطهير ومسح تجاويف الأذن من الداخل والخارج إحياءً للملامح." },
  { id: 9, label: "غسل الرجلين مع الكعبين", isRequired: "faridha", desc: "تنظيف القدم اليمنى واليسرى مع خلل الأصابع حتى عظمي الكعبين." },
  { id: 10, label: "الفور والدلك لأعضاء الوضوء", isRequired: "faridha", desc: "متابعة الغسل بغير انقطاع يجفف العضو، مع إمرار اليد بالدلك." }
];

// Water Items Radar Interface for Purity Evaluation
interface WaterItem {
  id: number;
  label: string;
  type: 'pure' | 'impure';
  explanation: string;
  iconText: string;
}

const waterItems: WaterItem[] = [
  { id: 1, label: "مياه الأمطار الكونية العذبة الصافية", type: "pure", explanation: "ماء طهور نزل من السماء طاهر في نفسه ومطهر لغيره يفيد للوضوء والصلوات.", iconText: "🌧️" },
  { id: 2, label: "ماء بركة راكدة تغير لونه ورائحته بدم ملوث", type: "impure", explanation: "ينجس الماء بملاقاة النجاسات كالبول والدم، فلا تصح الصلاة ولا الطهارة به.", iconText: "🩸" },
  { id: 3, label: "مياه نهر النيل العظيم الجارية الباقية على طبيعتها", type: "pure", explanation: "أشرف مياه النيل العذب الصافي الباقي على لونه وطعمه، وهو ماء طهور مبهج.", iconText: "🌊" },
  { id: 4, label: "مياه آبار وعيون عذبة متفجرة من بطن الأرض السودانية", type: "pure", explanation: "مياه الآبار طبيعية طهورة معافاة مباركة صالحة لغسل البدن والألبسة.", iconText: "🕳️" },
  { id: 5, label: "ماء اختلط بنقاط من البول أو فضلات حيوانات جافة", type: "impure", explanation: "ماء نجس لا يجوز استخدامه ويفسد طهارة وصحة البدن فوراً.", iconText: "🚽" },
  { id: 6, label: "مياه تغيرت خصائصها الطبيعية وصارت سوداء برائحة المجاري", type: "impure", explanation: "مياه نجسة كريهة تضر الجلد ومعاش البشر وتفسد سائر العبادات.", iconText: "🤮" },
  { id: 7, label: "ماء دافئ نظيف باق على لونه وطعمه ورائحته بغير شوائب", type: "pure", explanation: "الماء باق على أصله طبيعياً طهوراً يستحب به إسباغ الاستنجاء والوضوء.", iconText: "💧" },
  { id: 8, label: "مياه البحار المالحة الجارية الوافرة بغير ملوث طارئ", type: "pure", explanation: "هو الطهور ماؤه والحل ميتته كما علمنا رسولنا الحليم في الهدي.", iconText: "⛵" }
];

// Toilet Manners Option Interface for checklist
interface ToiletMannersOption {
  id: string;
  title: string;
  type: 'manner' | 'forbidden';
  desc: string;
  badge: string;
}

const toiletOptions: ToiletMannersOption[] = [
  { id: '1', title: "تقديم الرجل اليسرى والاستعاذة بالداخل", type: "manner", desc: "نقول أدباً: «بِسْمِ اللَّهِ، اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْخُبُثِ وَالْخَبَائِثِ» تحصيناً للبدن من الميكروبات وظلم الشياطين.", badge: "أدب مسنون ✔️" },
  { id: '2', title: "التبول أو التغوط في طريق الناس وممشاهم", type: "forbidden", desc: "محذور شرعي ومنكر كبير لأنه يفسد الطرق السالكة للناس ويسبب انتشار العدوى والأذى والروائح.", badge: "محذور منهي عنه ❌" },
  { id: '3', title: "استخدام اليد اليسرى للاستنجاء طهارةً", type: "manner", desc: "تخصيص اليد اليسرى لتنظيف العورة بالماء صوناً لليمين الكريمة وتكريماً لها للتحية والقرآن والأكل.", badge: "أدب مسنون ✔️" },
  { id: '4', title: "قضاء الحاجة في الظل الذي يستريح فيه الناس", type: "forbidden", desc: "أثر سيئ يلحق بالأذى بالناس الذين يجلسون تحت الظلال طلباً للأمان من أشعة الشمس السودانية القاسية.", badge: "محذور منهي عنه ❌" },
  { id: '5', title: "تقديم الرجل اليمنى والاستغفار عند الخروج", type: "manner", desc: "نلج خارج دورة المياه بالقدم اليمنى متبسمين مستبشرين بنطقنا: «غُفْرَانَك» حمداً لله على عافية البدن ونعمة التخلص من الفضلات.", badge: "أدب مسنون ✔️" },
  { id: '6', title: "قضاء الحاجة تحت شجرة مثمرة يتغذى الناس بفاكهتها", type: "forbidden", desc: "محذور ينجس الأرض تحت الأشجار ويوسخ الثمار ويفزع حيوانات البساتين.", badge: "محذور منهي عنه ❌" },
  { id: '7', title: "غسل اليدين بالماء والصابون تعقيماً جيداً", type: "manner", desc: "أهم ركائز النظافة الصحية والفروع الفقهية بعد الاستجمار لغسل سائر الجراثيم وتجنب الأمراض الطينية.", badge: "أدب مسنون ✔️" },
  { id: '8', title: "قضاء الحاجة في جحور الحيوانات والحشرات الأرضية", type: "forbidden", desc: "منهي عنه صيانة ودفاعاً عن الحيوانات والزواحف الصغيرة بداخل جحورها، وتفادياً للدغاتها الطارئة.", badge: "محذور منهي عنه ❌" }
];

// Wudu Sorting Interface (Faridha vs Sunnah sorting game)
interface SortItem {
  id: number;
  label: string;
  category: 'faridha' | 'sunnah';
  desc: string;
  iconText: string;
}

const wuduSortingItems: SortItem[] = [
  { id: 1, label: "النية بالقلب", category: "faridha", desc: "استحضار طهارة العبادة بالوجدان مع التسمية.", iconText: "❤️" },
  { id: 2, label: "غسل الكفين ثلاثاً", category: "sunnah", desc: "غسل الكفيين مرتين أو ثلاثاً عند بدء الوضوء.", iconText: "🤲" },
  { id: 3, label: "المضمضة ثلاثاً باليد اليمنى", category: "sunnah", desc: "إدخال الماء في الفم وتحريكه ومجه.", iconText: "👄" },
  { id: 4, label: "الاستنشاق والاستنثار", category: "sunnah", desc: "جذب الماء بالأنف ونثره لتنظيف الخيشوم.", iconText: "👃" },
  { id: 5, label: "غسل الوجه كاملاً", category: "faridha", desc: "من منابت شعر الجبهة إلى ما انحدر من اللحيين.", iconText: "👤" },
  { id: 6, label: "غسل اليدين مع المرفقين", category: "faridha", desc: "غسل المرفقين كاملاً وتخليل الأصابع.", iconText: "💪" },
  { id: 7, label: "مسح الرأس المبلل بالماء", category: "faridha", desc: "مسح كل أو غالب الرأس ذهاباً وإياباً.", iconText: "🙋" },
  { id: 8, label: "مسح الأذنين وباطنهما", category: "sunnah", desc: "مسح باطن الأذنين وظاهرهما بماء جديد.", iconText: "👂" },
  { id: 9, label: "غسل الرجلين مع الكعبين", category: "faridha", desc: "غسل القدمين حتى مجاوزة عظمتي الكعب البارزتين.", iconText: "🦶" },
  { id: 10, label: "الفور والموالاة", category: "faridha", desc: "إتمام الوضوء بالتتابع والسرعة المسترسلة بغير جفاف عضو.", iconText: "⏱️" },
  { id: 11, label: "الدلك باليد", category: "faridha", desc: "إمرار باطن الكف على العضو المغسول مع صب الماء.", iconText: "🧼" }
];

// Sudanese Grade 3 Fiqh Practical Scenarios Context
interface Scenario {
  id: number;
  question: string;
  options: { text: string; isCorrect: boolean }[];
  explanation: string;
  iconText: string;
}

const sudaneseScenarios: Scenario[] = [
  {
    id: 1,
    question: "ذهب كرم ليتوضأ في ساقية المزرعة بضواحي الخرطوم، فوجد الماء قد تغير لونه بالكامل ورائحته كريهة لفعل نجس ملوث تسرب إليه. ما حكم وضوء كرم بهذا الماء؟",
    options: [
      { text: "لا يجوز الوضوء به لأنه ماء نجس يبطل الطهارة", isCorrect: true },
      { text: "يجوز الوضوء به دون كراهة لأنه ماء جاري على أي حال", isCorrect: false }
    ],
    explanation: "ينجس الماء إذا خالطته نجاسة فافتر التغير في لونه أو طعمه أو رائحته، وبالتالي يمتنع استخدامه في العبادات وصوناً لسلامة البدن.",
    iconText: "🚜"
  },
  {
    id: 2,
    question: "أثناء ركض كرم في بستان النخيل والمانجو، وجد ماء أمطار عذباً متجمعاً في حوض طين نظيف، وتغير لون الماء قليلاً بالمرقد الطيني الطاهر دون زوال اسمه كـ(ماء). ما حكم الوضوء به؟",
    options: [
      { text: "يصح الوضوء به لأن الطين تراب طاهر والماء باق على طهوريته", isCorrect: true },
      { text: "لا يصح الوضوء به لأن الطين يفسد خصائص الماء بالكامل", isCorrect: false }
    ],
    explanation: "الماء المخلوط بالطين النظيف أو التراب البسيط يبقى في حكم الماء الطهور ويصح الغسل والوضوء به بغير حرج.",
    iconText: "🌴"
  },
  {
    id: 3,
    question: "أراد كرم قضاء حاجته في الحقل، وصادف شجرة ليمون مظللة ودافئة يستلقي تحتها المزارعون والسابلة طلباً للأمان من أشعة الشمس القاسية. هل يحق له قضاء الحاجة هناك؟",
    options: [
      { text: "يحرم قضاء الحاجة في ظل الناس وتحت الأشجار المثمرة منعاً للأذى والعدوى", isCorrect: true },
      { text: "يجوز قضاء الحاجة هناك كونه مكاناً وارفاً وخفياً عن الأنظار", isCorrect: false }
    ],
    explanation: "نهى ديننا الحنيف ورسولنا الكريم عن إفساد ظلال الناس ومواضع جلوسهم تحت الأشجار المثمرة لعدم تلويث البيئة ونشر الجراثيم.",
    iconText: "🍋"
  },
  {
    id: 4,
    question: "أثناء دخول كرم إلى دورة المياه، بأي قَدَم يستحب له الدخول، وما هو دعاء التحصين المسنون الذي يلقيه بقلبه ولسانه طهارةً؟",
    options: [
      { text: "يدخل باليسرى قائلاً: بسم الله، اللهم إني أعوذ بك من الخبث والخبائث", isCorrect: true },
      { text: "يدخل باليمين قائلاً: غفرانك يا واهب العافية الدائمة", isCorrect: false }
    ],
    explanation: "من آداب الخلاء العظيمة تقديم الرجل اليسرى طهارة والاستعاذة بالرحمن من الخبث والخبائث للوقاية المعافاة من آثام الشياطين والميكروبات.",
    iconText: "🚪"
  },
  {
    id: 5,
    question: "توضأ كرم ونسي كلياً 'دلك الأعضاء' و'الفور' حيث قفل يتحدث مع أخيه الصغير عدة دقائق حتى جف وضوء وجهه ويديه قبل مسح رأسه ورجليه. ما حكم صحة وضوئه؟",
    options: [
      { text: "وضوؤه غير صحيح ويجب إعادته لأن الفور والدلك فرضان ركنيان في المنهج", isCorrect: true },
      { text: "وضوؤه صحيح وصالح ولا يبطل لأن الفور والدلك مجرد سنتين وضوء", isCorrect: false }
    ],
    explanation: "وفق ما جاء بالمنهج السوداني للفقه المالكي، يعتبر الفور (الموالاة بالتوالي المنسجم) والدلك من فرائض الوضوء السبعة التي لا يصح الطهور بتركها.",
    iconText: "⏱️"
  }
];

export default function FiqhPlayground({ onEarnStars }: { onEarnStars: (stars: number) => void }) {
  const [activeSubTab, setActiveSubTab] = useState<'sequence' | 'sorting' | 'radar' | 'eid' | 'scenarios'>('sequence');

  // Game 1 State: Wudu Sequence
  const [scrambled, setScrambled] = useState<WuduStep[]>(() => {
    return [...correctWuduSteps].sort(() => Math.random() - 0.5);
  });
  const [arranged, setArranged] = useState<WuduStep[]>([]);
  const [sequenceStarClaimed, setSequenceStarClaimed] = useState<boolean>(false);

  // Game 2 State: Faridha vs Sunnah sorting
  const [sortIndex, setSortIdx] = useState<number>(0);
  const [sortPoints, setSortPoints] = useState<number>(0);
  const [sortAnswers, setSortAnswers] = useState<{ item: SortItem; correct: boolean }[]>([]);
  const [sortComplete, setSortComplete] = useState<boolean>(false);

  // Game 3 State: Water Radar Purity
  const [radarIndex, setRadarIdx] = useState<number>(0);
  const [points, setPoints] = useState<number>(0);
  const [radarAnswers, setRadarAnswers] = useState<{ item: WaterItem; correct: boolean }[]>([]);
  const [radarComplete, setRadarComplete] = useState<boolean>(false);

  // Game 4 State: Toilet Manners Checklist
  const [checkedIdeas, setCheckedIdeas] = useState<string[]>([]);

  // Game 5 State: Sudanese Scenarios Challenge
  const [scenarioIdx, setScenarioIdx] = useState<number>(0);
  const [scenarioPoints, setScenarioPoints] = useState<number>(0);
  const [scenarioAnswers, setScenarioAnswers] = useState<{ scenario: Scenario; correct: boolean }[]>([]);
  const [scenarioComplete, setScenarioComplete] = useState<boolean>(false);

  // Logic 1: Sequence placement
  const selectScrambledStep = (step: WuduStep) => {
    const expectedStep = correctWuduSteps[arranged.length];
    if (step.id === expectedStep.id) {
      setArranged(prev => [...prev, step]);
      setScrambled(prev => prev.filter(s => s.id !== step.id));
      SoundEngine.playSuccess();

      if (arranged.length + 1 === correctWuduSteps.length) {
        SoundEngine.playTrophy();
        if (!sequenceStarClaimed) {
          onEarnStars(5);
          setSequenceStarClaimed(true);
        }
      }
    } else {
      SoundEngine.playFailure();
    }
  };

  const resetSequenceGame = () => {
    setScrambled([...correctWuduSteps].sort(() => Math.random() - 0.5));
    setArranged([]);
    SoundEngine.playSparkle();
  };

  // Logic 2: Wudu Sorting (Faridha vs Sunnah)
  const handleSortChoice = (choice: 'faridha' | 'sunnah') => {
    const item = wuduSortingItems[sortIndex];
    const isCorrect = item.category === choice;

    let computedPoints = sortPoints;
    if (isCorrect) {
      computedPoints = sortPoints + 10;
      setSortPoints(computedPoints);
      SoundEngine.playSuccess();
    } else {
      SoundEngine.playFailure();
    }

    setSortAnswers(prev => [...prev, { item, correct: isCorrect }]);

    if (sortIndex < wuduSortingItems.length - 1) {
      setSortIdx(prev => prev + 1);
    } else {
      setSortComplete(true);
      SoundEngine.playTrophy();
      const scoredStars = computedPoints >= 80 ? 5 : 2;
      onEarnStars(scoredStars);
    }
  };

  const resetSortingGame = () => {
    setSortIdx(0);
    setSortPoints(0);
    setSortAnswers([]);
    setSortComplete(false);
    SoundEngine.playSparkle();
  };

  // Logic 3: Purity Radar sorting
  const handleRadarChoice = (choice: 'pure' | 'impure') => {
    const item = waterItems[radarIndex];
    const isCorrect = item.type === choice;

    let computedPoints = points;
    if (isCorrect) {
      computedPoints = points + 10;
      setPoints(computedPoints);
      SoundEngine.playSuccess();
    } else {
      SoundEngine.playFailure();
    }

    setRadarAnswers(prev => [...prev, { item, correct: isCorrect }]);

    if (radarIndex < waterItems.length - 1) {
      setRadarIdx(prev => prev + 1);
    } else {
      setRadarComplete(true);
      SoundEngine.playTrophy();
      const obtainedStars = computedPoints >= 60 ? 5 : 2;
      onEarnStars(obtainedStars);
    }
  };

  const resetRadarGame = () => {
    setRadarIdx(0);
    setPoints(0);
    setRadarAnswers([]);
    setRadarComplete(false);
    SoundEngine.playSparkle();
  };

  // Logic 4: Checklist Toilet manners
  const toggleIdea = (id: string) => {
    SoundEngine.playSparkle();
    if (checkedIdeas.includes(id)) {
      setCheckedIdeas(prev => prev.filter(item => item !== id));
    } else {
      setCheckedIdeas(prev => [...prev, id]);
      if (checkedIdeas.length + 1 === toiletOptions.length) {
        onEarnStars(4);
        SoundEngine.playTrophy();
      }
    }
  };

  // Logic 5: Sudanese Scenarios
  const handleScenarioChoice = (isCorrect: boolean) => {
    const scenario = sudaneseScenarios[scenarioIdx];
    let computedPoints = scenarioPoints;

    if (isCorrect) {
      computedPoints = scenarioPoints + 20;
      setScenarioPoints(computedPoints);
      SoundEngine.playSuccess();
    } else {
      SoundEngine.playFailure();
    }

    setScenarioAnswers(prev => [...prev, { scenario, correct: isCorrect }]);

    if (scenarioIdx < sudaneseScenarios.length - 1) {
      setScenarioIdx(prev => prev + 1);
    } else {
      setScenarioComplete(true);
      SoundEngine.playTrophy();
      const obtainedStars = computedPoints >= 80 ? 5 : 2;
      onEarnStars(obtainedStars);
    }
  };

  const resetScenariosGame = () => {
    setScenarioIdx(0);
    setScenarioPoints(0);
    setScenarioAnswers([]);
    setScenarioComplete(false);
    SoundEngine.playSparkle();
  };

  return (
    <div className="max-w-4xl mx-auto py-2 pr-1 pl-1 text-right relative z-10 font-sans" dir="rtl" id="fiqh-playground-main">
      {/* Title & Introduction of the Sudanese Grade 3 Fiqh Playground */}
      <div className="bg-gradient-to-r from-[#2c5332] to-[#1a3820] p-6 rounded-[2rem] text-[#FAF9F6] mb-6 shadow-md border-b-4 border-[#3c7042]">
        <div className="flex justify-between items-center gap-4 flex-col sm:flex-row">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-[#6b9970] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">المنهج السوداني الجديد</span>
              <span className="bg-[#b38f4d] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">التربية الإسلامية - الصف الثالث</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight mb-2 flex items-center gap-2">
              💧 مهرجان الفقه والعبادات التفاعلي الأكبر 💧
            </h1>
            <p className="text-[#e2ebd5] text-xs leading-relaxed max-w-xl font-medium">
              أهلاً بك يا فقيهنا المستكشف! لقد قمنا بفتح ألعاب فقهية جديدة بالكامل لسلامة دينك وقرآنك. تدرّج بين مصفاة الوضوء، ميزان الفرائض، كاشف المياه الكونية، وآداب قضاء الحاجة والسيناريوهات العملية الماتعة لتحصل على الذهب والنجوم اللامعة!
            </p>
          </div>
          <div className="bg-white/10 shrink-0 text-[#FAF9F6] font-bold px-4 py-2.5 rounded-2xl border border-white/20 text-xs flex items-center gap-1.5 self-end sm:self-center">
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span>نجوم الملعب الأقصى: +٢٣ نجمة ⭐</span>
          </div>
        </div>
      </div>

      {/* Extended Sub Tabs Picker (Grid of 5 items for perfect layout) */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-6 bg-[#FAF9F6] border border-[#DCD3C1] p-1.5 rounded-2xl shadow-sm">
        <button
          onClick={() => { setActiveSubTab('sequence'); SoundEngine.playSparkle(); }}
          className={`py-2 px-1 rounded-xl text-[10px] sm:text-xs font-black transition flex items-center justify-center gap-1 cursor-pointer outline-none border-b-2 ${
            activeSubTab === 'sequence'
              ? 'bg-[#E9E1CD] text-[#2c5332] border-[#2c5332] shadow-sm'
              : 'text-[#8E8268] border-transparent hover:text-[#2c5332]'
          }`}
          id="btn-subtab-sequence"
        >
          <Bookmark className="w-4 h-4 shrink-0 text-[#6b9970]" />
          <span>مصفاة الوضوء</span>
        </button>

        <button
          onClick={() => { setActiveSubTab('sorting'); SoundEngine.playSparkle(); }}
          className={`py-2 px-1 rounded-xl text-[10px] sm:text-xs font-black transition flex items-center justify-center gap-1 cursor-pointer outline-none border-b-2 ${
            activeSubTab === 'sorting'
              ? 'bg-[#E9E1CD] text-[#2c5332] border-[#2c5332] shadow-sm'
              : 'text-[#8E8268] border-transparent hover:text-[#2c5332]'
          }`}
          id="btn-subtab-sorting"
        >
          <Award className="w-4 h-4 shrink-0 text-[#b38f4d]" />
          <span>فرائض وسنن وضوئي</span>
        </button>

        <button
          onClick={() => { setActiveSubTab('radar'); SoundEngine.playSparkle(); }}
          className={`py-2 px-1 rounded-xl text-[10px] sm:text-xs font-black transition flex items-center justify-center gap-1 cursor-pointer outline-none border-b-2 ${
            activeSubTab === 'radar'
              ? 'bg-[#E9E1CD] text-[#2c5332] border-[#2c5332] shadow-sm'
              : 'text-[#8E8268] border-transparent hover:text-[#2c5332]'
          }`}
          id="btn-subtab-radar"
        >
          <Droplets className="w-4 h-4 shrink-0 text-[#3c7042]" />
          <span>كاشف مياه طهوري</span>
        </button>

        <button
          onClick={() => { setActiveSubTab('eid'); SoundEngine.playSparkle(); }}
          className={`py-2 px-1 rounded-xl text-[10px] sm:text-xs font-black transition flex items-center justify-center gap-1 cursor-pointer outline-none border-b-2 ${
            activeSubTab === 'eid'
              ? 'bg-[#E9E1CD] text-[#2c5332] border-[#2c5332] shadow-sm'
              : 'text-[#8E8268] border-transparent hover:text-[#2c5332]'
          }`}
          id="btn-subtab-eid"
        >
          <HeartHandshake className="w-4 h-4 shrink-0 text-[#d4563a]" />
          <span>آداب قضاء الحاجة</span>
        </button>

        <button
          onClick={() => { setActiveSubTab('scenarios'); SoundEngine.playSparkle(); }}
          className={`py-2 px-1 rounded-xl text-[10px] sm:text-xs font-black transition flex items-center justify-center gap-1 cursor-pointer col-span-2 md:col-span-1 outline-none border-b-2 ${
            activeSubTab === 'scenarios'
              ? 'bg-[#E9E1CD] text-[#2c5332] border-[#2c5332] shadow-sm'
              : 'text-[#8E8268] border-transparent hover:text-[#2c5332]'
          }`}
          id="btn-subtab-scenarios"
        >
          <HelpCircle className="w-4 h-4 shrink-0 text-[#1a5b8c]" />
          <span>تحدي المواقف اليومية</span>
        </button>
      </div>

      {/* Tab Contents */}
      <AnimatePresence mode="wait">
        
        {/* GAME 1: Organized Wudu sequence */}
        {activeSubTab === 'sequence' && (
          <motion.div
            key="sequence"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start animate-fade-in"
          >
            {/* Left Side: Arranged steps as they are clicked */}
            <div className="md:col-span-7 bg-[#FAF9F6] border border-[#DCD3C1] p-5 rounded-3xl shadow-sm min-h-[420px]">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-sm text-[#2c5332] flex items-center gap-1.5">
                  <span>خطوات الوضوء المرتبة الفاضلة</span>
                  <span className="text-xs bg-[#E9E1CD] border border-[#DCD3C1]/50 text-[#fff] bg-[#2c5332] py-0.5 px-2 rounded-full font-black">
                    {arranged.length} من {correctWuduSteps.length}
                  </span>
                </h3>
                {arranged.length === correctWuduSteps.length && (
                  <span className="text-xs font-black text-white bg-[#2c5332] border border-[#2c5332]/20 py-1 px-3 rounded-full animate-bounce">
                    وضوء صحيح! +٥ نجوم ⭐
                  </span>
                )}
              </div>

              {arranged.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[320px] border-2 border-dashed border-[#DCD3C1] rounded-2xl p-4 text-center">
                  <span className="text-4xl mb-3">💧</span>
                  <p className="text-xs text-[#8E8268] max-w-xs leading-relaxed font-semibold">
                    انقر على بطاقات الوضوء بالترتيب الشرعي الصحيح المتتالي من الجانب الأيسر لبناء وضوء طاهر متكامل!
                  </p>
                  <p className="text-[10px] text-gray-450 mt-2 font-medium">
                    ابدأ بـ (النية والتسمية بالقلب) ثم تدرّج في السنن والفرائض بالتوالي.
                  </p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1" id="arranged-cards-list">
                  {arranged.map((step, idx) => (
                    <motion.div
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      key={step.id}
                      className="p-3 bg-white border border-[#2c5332]/30 rounded-xl flex items-center justify-between gap-3 text-right hover:border-[#2c5332] shadow-sm"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 bg-[#2c5332] text-white font-sans text-xs rounded-full flex items-center justify-center font-bold">
                          {idx + 1}
                        </span>
                        <div>
                          <h4 className="text-xs font-bold text-[#2c5332]">
                            {step.label}
                          </h4>
                          <p className="text-[10px] text-[#8E8268] font-medium leading-normal block sm:hidden">
                            {step.desc}
                          </p>
                        </div>
                      </div>
                      <p className="text-[10px] text-[#8E8268] leading-normal max-w-sm hidden sm:block font-medium">
                        {step.desc}
                      </p>
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded shrink-0 ${
                        step.isRequired === 'faridha' 
                        ? 'bg-[#ffebe5] text-[#d4563a] border border-[#d4563a]/10' 
                        : 'bg-[#eefbeb] text-[#2c5332] border border-[#2c5332]/10'
                      }`}>
                        {step.isRequired === 'faridha' ? 'فرض' : 'سنة'}
                      </span>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Side: Options collection to select */}
            <div className="md:col-span-5 bg-[#F1EBDC] border border-[#DCD3C1] p-5 rounded-3xl">
              <div className="flex justify-between items-center mb-4">
                <span className="font-bold text-xs text-[#8E8268] text-right">انقر الخطوة التالية الشرعية:</span>
                <button
                  onClick={resetSequenceGame}
                  className="text-[10px] font-black text-[#D48166] hover:underline cursor-pointer flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>إعادة خلط 🔄</span>
                </button>
              </div>

              {scrambled.length > 0 ? (
                <div className="grid grid-cols-2 gap-2.5" id="scrambled-option-grid">
                  {scrambled.map((step) => (
                    <button
                      key={step.id}
                      onClick={() => selectScrambledStep(step)}
                      className="p-3 bg-[#FAF9F6] hover:bg-[#2c5332] hover:text-white border border-[#DCD3C1] hover:border-[#2c5332] rounded-xl text-xs font-bold text-[#4A453E] transition duration-200 text-center shadow-xs cursor-pointer outline-none min-h-[54px] flex items-center justify-center leading-tight animate-fade-in"
                    >
                      {step.label}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-[#2c5332] text-white rounded-2xl text-center py-8">
                  <span className="text-3xl block mb-2 font-emoji">🎉</span>
                  <h4 className="font-black text-sm mb-1">أتممت إسباغ الوضوء!</h4>
                  <p className="text-[10px] text-[#e2ebd5] leading-relaxed max-w-[200px] mx-auto font-medium">
                    ما شاء الله! قمت برص فرائض الوضوء السبعة وسننه الشهيرة بنجاح تام، فأصبح وضوؤك ناضراً وعافيتك مكتملة.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* GAME 2: Faridha vs Sunnah Sorting Game */}
        {activeSubTab === 'sorting' && (
          <motion.div
            key="sorting"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="max-w-2xl mx-auto"
          >
            {!sortComplete ? (
              <div className="bg-[#FAF9F6] border border-[#DCD3C1] p-6 rounded-3xl shadow-sm text-center">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-xs bg-[#E9E1CD] text-[#2c5332] px-3 py-1.5 rounded-full font-black border border-[#DCD3C1]/50">
                    ميزان الوضوء {sortIndex + 1} من {wuduSortingItems.length}
                  </span>
                  <span className="text-xs text-[#2c5332] font-bold bg-[#FAF9F6] border border-[#DCD3C1] px-3 py-1.5 rounded-full flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-yellow-500" />
                    النقاط: {sortPoints}
                  </span>
                </div>

                {/* Focus text item of water type */}
                <span className="text-4xl block mb-2 font-emoji">{wuduSortingItems[sortIndex].iconText}</span>
                <h3 className="text-base sm:text-lg font-bold text-[#2c5332] mb-1.5 leading-relaxed">
                  « {wuduSortingItems[sortIndex].label} »
                </h3>
                <p className="text-[11px] text-[#8E8268] max-w-sm mx-auto mb-8 font-semibold leading-relaxed">
                  {wuduSortingItems[sortIndex].desc}
                  <br />
                  هل هذه الخطوة هي <span className="text-[#d4563a] font-bold">فرض ركني (يبطل الوضوء بدونه)</span> أم <span className="text-[#2c5332] font-bold">سنة وضوء مستحبة</span>؟
                </p>

                {/* Choices triggers */}
                <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                  <button
                    onClick={() => handleSortChoice('faridha')}
                    className="p-5 bg-white hover:bg-[#ffebe5] border-2 border-dashed border-[#d4563a]/45 hover:border-[#d4563a] text-[#d4563a] font-black rounded-2xl text-xs sm:text-sm transition text-center cursor-pointer outline-none"
                  >
                    <span className="block text-2xl mb-1 font-emoji">🧱</span>
                    <span>فَرْض رُكني</span>
                    <span className="block text-[9px] font-medium text-[#8E8268] mt-1">من الفرائض السبعة للوضوء</span>
                  </button>

                  <button
                    onClick={() => handleSortChoice('sunnah')}
                    className="p-5 bg-white hover:bg-[#eefbeb] border-2 border-dashed border-[#2c5332]/45 hover:border-[#2c5332] text-[#2c5332] font-black rounded-2xl text-xs sm:text-sm transition text-center cursor-pointer outline-none"
                  >
                    <span className="block text-2xl mb-1 font-emoji">✨</span>
                    <span>سُنّة مستحبة</span>
                    <span className="block text-[9px] font-medium text-[#8E8268] mt-1">تزيد من أجر وجمال الوضوء</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Completion screen */
              <div className="bg-[#FAF9F6] border border-[#DCD3C1] p-8 rounded-3xl shadow-sm text-center">
                <span className="text-5xl block mb-2 font-emoji">👑</span>
                <h3 className="font-sans text-xl font-bold mb-2 text-[#2c5332]">مبارك! أتممت ميزان السنن والفرائض!</h3>
                <p className="text-xs text-[#8E8268] mb-6 font-medium leading-relaxed">
                  لقد فرّقت بين دلك الأعضاء والفور وغسل الوجه (الفرائض) وبين غسل الكفين ثلاثاً والمسح للأذن والمضمضة (السنن) بمهارة فقهية ممتازة.
                </p>

                <div className="inline-flex flex-col items-center bg-[#E9E1CD] border border-[#DCD3C1] p-4 rounded-3xl mb-6 min-w-[200px]">
                  <span className="text-3xl font-black font-sans text-[#2c5332] mb-1">{sortPoints} / {wuduSortingItems.length * 10}</span>
                  <span className="text-xs text-[#2c5332] font-bold">نلت {sortPoints >= 80 ? "٥ نجوم مضيئة" : "نجمتين"} بجدارة عقلية ⭐</span>
                </div>

                <div className="space-y-2 mt-4 max-h-[180px] overflow-y-auto border-t border-[#DCD3C1] pt-4" id="sorting-answers-log">
                  {sortAnswers.map((ans, i) => (
                    <div key={i} className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs text-right py-2 border-b border-[#DCD3C1]/20 gap-1 sm:gap-4 font-sans font-medium">
                      <div className="flex items-center gap-1.5">
                        <span className="text-base font-emoji">{ans.item.iconText}</span>
                        <span className="font-bold text-[#4A453E]">{ans.item.label}</span>
                        <span className="text-[10px] bg-gray-100 text-gray-650 px-1.5 py-0.5 rounded">
                          ({ans.item.category === 'faridha' ? 'فرض ركني' : 'سنة'})
                        </span>
                      </div>
                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <span className="text-[10px] text-gray-500 font-medium">{ans.item.desc}</span>
                        <span className={`font-bold px-2 py-0.5 rounded ${ans.correct ? 'bg-[#2c5332]/10 text-[#2c5332]' : 'bg-[#d4563a]/10 text-[#d4563a]'}`}>
                          {ans.correct ? 'أصبت ✔️' : 'أخطأت ❌'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={resetSortingGame}
                  className="bg-[#2c5332] hover:bg-[#1a3820] text-white font-black py-2.5 px-6 rounded-xl mt-6 text-xs transition cursor-pointer"
                >
                  إعادة خوض ميزان الوضوء 🔄
                </button>
              </div>
            )}
          </motion.div>
        )}

        {/* GAME 3: Water Radar Sorting */}
        {activeSubTab === 'radar' && (
          <motion.div
            key="radar"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="max-w-2xl mx-auto"
          >
            {!radarComplete ? (
              <div className="bg-[#FAF9F6] border border-[#DCD3C1] p-6 rounded-3xl shadow-sm text-center">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-xs bg-[#e2ebd5] text-[#2c5332] px-3 py-1.5 rounded-full font-black border border-[#DCD3C1]/50">
                    رادار المياه {radarIndex + 1} من {waterItems.length}
                  </span>
                  <span className="text-xs text-[#2c5332] font-bold bg-[#FAF9F6] border border-[#DCD3C1] px-3 py-1.5 rounded-full flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-yellow-500" />
                    النقاط: {points}
                  </span>
                </div>

                {/* Focus text item of water type */}
                <div className="text-4xl mb-3 font-emoji">{waterItems[radarIndex].iconText}</div>
                <h3 className="text-base sm:text-lg font-bold text-[#2c5332] mb-2 leading-relaxed">
                  « {waterItems[radarIndex].label} »
                </h3>
                <p className="text-xs text-[#8E8268] max-w-sm mx-auto mb-8 font-medium">
                  تأمل هذا الماء بدقة وفق فقهك: هل هو ماء "طهور" يصح الوضوء وإسباغ الطهارة به، أم هو ماء "نجس" محرم استخدامه ويجب الفرار منه؟
                </p>

                {/* Binary choices triggers */}
                <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                  <button
                    onClick={() => handleRadarChoice('pure')}
                    className="p-5 bg-white hover:bg-[#eefbeb] border-2 border-dashed border-[#2c5332]/40 hover:border-[#2c5332] text-[#2c5332] font-black rounded-2xl text-xs sm:text-sm transition text-center cursor-pointer outline-none"
                  >
                    <span className="block text-2xl mb-1 font-emoji">💧</span>
                    <span>ماء طَهُور</span>
                    <span className="block text-[9px] font-medium text-[#8E8268] mt-1">يصلح للعبادة والوضوء</span>
                  </button>

                  <button
                    onClick={() => handleRadarChoice('impure')}
                    className="p-5 bg-white hover:bg-[#ffebe5] border-2 border-dashed border-[#d4563a]/40 hover:border-[#d4563a] text-[#d4563a] font-black rounded-2xl text-xs sm:text-sm transition text-center cursor-pointer outline-none"
                  >
                    <span className="block text-2xl mb-1 font-emoji">🤮</span>
                    <span>ماء نَجِس</span>
                    <span className="block text-[9px] font-medium text-[#8E8268] mt-1">لا تجوز به طهارة ولا صلاة</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Completion screen */
              <div className="bg-[#FAF9F6] border border-[#DCD3C1] p-8 rounded-3xl shadow-sm text-center">
                <span className="text-5xl block mb-2 font-emoji">🌊</span>
                <h3 className="font-sans text-xl font-bold mb-2 text-[#2c5332]">مبارك! أكملت فحص رادار الطهارة!</h3>
                <p className="text-xs text-[#8E8268] mb-6 font-medium">
                  لقد استطعت تصنيف مياه النيل والأمطار بمهارة، وعزلت المياه الملوثة الكريهة بحكمة المتقين.
                </p>

                <div className="inline-flex flex-col items-center bg-[#E9E1CD] border border-[#DCD3C1] p-4 rounded-3xl mb-6 min-w-[200px]">
                  <span className="text-3xl font-black font-sans text-[#2c5332] mb-1">{points} / {waterItems.length * 10}</span>
                  <span className="text-xs text-[#2c5332] font-bold">حزت على {points >= 60 ? "٥ نجوم" : "نجمتين"} بجدارة عقلية ⭐</span>
                </div>

                <div className="space-y-2 mt-4 max-h-[180px] overflow-y-auto border-t border-[#DCD3C1] pt-4" id="radar-answers-log">
                  {radarAnswers.map((ans, i) => (
                    <div key={i} className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs text-right py-2 border-b border-[#DCD3C1]/20 gap-1 sm:gap-4">
                      <div className="flex items-center gap-1.5">
                        <span className="text-base font-emoji">{ans.item.iconText}</span>
                        <span className="font-medium text-[#4A453E] font-bold">{ans.item.label}</span>
                      </div>
                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <span className="text-[10px] text-gray-500 font-medium">{ans.item.explanation}</span>
                        <span className={`font-bold px-2 py-0.5 rounded ${ans.correct ? 'bg-[#2c5332]/10 text-[#2c5332]' : 'bg-[#d4563a]/10 text-[#d4563a]'}`}>
                          {ans.correct ? 'أصبت ✔️' : 'أخطأت ❌'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={resetRadarGame}
                  className="bg-[#2c5332] hover:bg-[#1a3820] text-white font-black py-2.5 px-6 rounded-xl mt-6 text-xs transition cursor-pointer"
                >
                  إعادة خوض فحص المياه 🔄
                </button>
              </div>
            )}
          </motion.div>
        )}

        {/* GAME 4: Toilet Manners & Forbidden Places */}
        {activeSubTab === 'eid' && (
          <motion.div
            key="eid"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-[#FAF9F6] border border-[#DCD3C1] p-6 rounded-3xl shadow-sm animate-fade-in"
          >
            <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
              <div>
                <h3 className="font-bold text-sm text-[#2c5332] flex items-center gap-1.5">
                  <span>أخلاقيات وآداب قضاء الحاجة</span>
                  <span className="bg-[#b38f4d] text-white text-[10px] px-2 py-0.5 rounded-full font-bold">وقاية وصحة</span>
                </h3>
                <p className="text-[#8E8268] text-[10px] leading-relaxed mt-1 font-medium">
                  حدد جميع السلوكات القويمة (الآداب المستحبة، والفرار من المحظورات) لتطهير عاداتك واحصد +٤ نجوم إضافية ⭐
                </p>
              </div>
              <span className="text-xs bg-[#E9E1CD] text-[#2c5332] font-bold px-3 py-1.5 rounded-full border border-[#DCD3C1]">
                {checkedIdeas.length} من {toiletOptions.length}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" id="eid-friday-checklist">
              {toiletOptions.map((item) => {
                const isSelected = checkedIdeas.includes(item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => toggleIdea(item.id)}
                    className={`p-4 rounded-2xl border-2 text-right transition cursor-pointer flex gap-3 items-start outline-none ${
                      isSelected
                        ? 'border-[#2c5332] bg-[#2c5332]/5 shadow-xs'
                        : 'border-[#DCD3C1] hover:bg-[#E9E1CD]/40 bg-white'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                      isSelected ? 'bg-[#2c5332] border-[#2c5332] text-white' : 'border-[#DCD3C1]'
                    }`}>
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="text-xs font-black text-[#2c5332]">
                          {item.title}
                        </h4>
                        <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded leading-none ${
                          item.type === 'manner'
                            ? 'bg-[#eefbeb] text-[#2c5332] border border-[#2c5332]/20'
                            : 'bg-[#ffebe5] text-[#d4563a] border border-[#d4563a]/20'
                        }`}>
                          {item.badge}
                        </span>
                      </div>
                      <p className="text-[10px] text-[#8E8268] mt-1.5 leading-relaxed font-semibold">
                        {item.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {checkedIdeas.length === toiletOptions.length && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 bg-[#eefbeb] border border-[#2c5332] rounded-2xl text-center flex items-center justify-center gap-2 shadow-xs"
              >
                <span className="text-2xl font-emoji">💫</span>
                <span className="text-xs font-black text-[#2c5332]">
                  أشهد أنك فقيه نبيه ومتقٍ فاضل! لقد ميزت جميع آداب المحافظة على الطهارة البدنية والبيئية بنجاح! نلت +٤ من النجوم ⭐
                </span>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* GAME 5: Practical Scenarios Challenge */}
        {activeSubTab === 'scenarios' && (
          <motion.div
            key="scenarios"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="max-w-2xl mx-auto"
          >
            {!scenarioComplete ? (
              <div className="bg-[#FAF9F6] border border-[#DCD3C1] p-6 rounded-3xl shadow-sm text-center">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-xs bg-[#e4ecf5] text-[#1a5b8c] px-3 py-1.5 rounded-full font-black border border-[#DCD3C1]/50">
                    تحدي المواقف {scenarioIdx + 1} من {sudaneseScenarios.length}
                  </span>
                  <span className="text-xs text-[#1a5b8c] font-bold bg-[#FAF9F6] border border-[#DCD3C1] px-3 py-1.5 rounded-full flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                    النقاط: {scenarioPoints}
                  </span>
                </div>

                {/* Question item */}
                <span className="text-4xl block mb-2 font-emoji">{sudaneseScenarios[scenarioIdx].iconText}</span>
                <h3 className="text-sm sm:text-base font-bold text-[#1a5b8c] mb-6 leading-relaxed max-w-xl mx-auto text-right bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
                  {sudaneseScenarios[scenarioIdx].question}
                </h3>

                {/* Choices */}
                <div className="space-y-3 max-w-lg mx-auto text-right">
                  {sudaneseScenarios[scenarioIdx].options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleScenarioChoice(opt.isCorrect)}
                      className="w-full p-4 bg-white hover:bg-[#e4ecf5]/30 border-2 border-dashed border-[#DCD3C1] hover:border-[#1a5b8c] text-slate-800 hover:text-[#1a5b8c] font-black rounded-2xl text-xs sm:text-sm transition cursor-pointer text-right flex items-center justify-between gap-3 outline-none"
                    >
                      <span>{opt.text}</span>
                      <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px] text-slate-400 shrink-0 font-sans">
                        {i + 1}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* Completion screen */
              <div className="bg-[#FAF9F6] border border-[#DCD3C1] p-8 rounded-3xl shadow-sm text-center">
                <span className="text-5xl block mb-2 font-emoji">🎓</span>
                <h3 className="font-sans text-xl font-bold mb-2 text-[#1a5b8c]">تهانينا يا فقيه المستقبل الفطن!</h3>
                <p className="text-xs text-[#8E8268] mb-6 font-medium leading-relaxed">
                  لقد فرغت اليوم من حل جميع سيناريوهات الطهارة ومواقف المياه والوضوء اليومية التي تهمك في بلدنا السودان.
                </p>

                <div className="inline-flex flex-col items-center bg-[#e4ecf5] border border-[#1a5b8c]/25 p-4 rounded-3xl mb-6 min-w-[200px]">
                  <span className="text-3xl font-black font-sans text-[#1a5b8c] mb-1">{scenarioPoints} / {sudaneseScenarios.length * 20}</span>
                  <span className="text-xs text-[#1a5b8c] font-bold">حصدت {scenarioPoints >= 80 ? "٥ نجومات تفوق" : "نجمتين"} بجدارة ⭐</span>
                </div>

                <div className="space-y-3 mt-4 max-h-[190px] overflow-y-auto border-t border-[#DCD3C1] pt-4" id="scenarios-answers-log">
                  {scenarioAnswers.map((ans, i) => (
                    <div key={i} className="flex flex-col text-right py-3 border-b border-[#DCD3C1]/25 gap-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-extrabold text-[#1a5b8c] flex items-center gap-1">
                          <span className="font-emoji">{ans.scenario.iconText}</span>
                          الموقف رقم {i + 1}
                        </span>
                        <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${ans.correct ? 'bg-green-100 text-green-700' : 'bg-red-105 text-red-650 bg-red-100 text-red-700'}`}>
                          {ans.correct ? 'أصبت بالشرع ✔️' : 'أخطأت ❌'}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-550 leading-relaxed font-semibold text-[#4A453E]">
                        {ans.scenario.question}
                      </p>
                      <p className="text-[10px] text-gray-400 bg-white p-2 rounded border border-gray-100">
                        💡 {ans.scenario.explanation}
                      </p>
                    </div>
                  ))}
                </div>

                <button
                  onClick={resetScenariosGame}
                  className="bg-[#1a5b8c] hover:bg-[#124268] text-white font-black py-2.5 px-6 rounded-xl mt-6 text-xs transition cursor-pointer"
                >
                  خوض تحدي المواقف مجدداً 🔄
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
