import React, { useState, useEffect } from 'react';
import { 
  Printer, 
  FileText, 
  Check, 
  RefreshCw, 
  Lock, 
  Unlock, 
  Sparkles, 
  BookOpen, 
  FileQuestion,
  Award,
  Key,
  ShieldCheck,
  Compass,
  LayoutGrid
} from 'lucide-react';
import { lessonsData, unitsData } from '../data/curriculum';
import SoundEngine from '../lib/audio';

interface WorksheetGeneratorProps {
  onBack?: () => void;
  studentName?: string;
  favorites?: string[];
}

export default function WorksheetGenerator({ onBack, studentName = 'مكتشف النور الصغير', favorites = [] }: WorksheetGeneratorProps) {
  // Configuration State
  const [scope, setScope] = useState<'all' | 'unit' | 'lesson' | 'favorites'>('all');
  const [selectedUnitId, setSelectedUnitId] = useState<number>(1);
  const [selectedLessonId, setSelectedLessonId] = useState<string>('surat-al-takathur');
  const [pageCount, setPageCount] = useState<number>(3); // Default 3 pages
  const [watermarkPassword, setWatermarkPassword] = useState<string>('');
  const [isWatermarkRemoved, setIsWatermarkRemoved] = useState<boolean>(false);
  const [seed, setSeed] = useState<number>(1); // For regenerating random layouts
  const [examTitle, setExamTitle] = useState<string>('امتحان مادة التربية الإسلامية الشامل لطلاب الصف الثالث الابتدائي');
  const [schoolName, setSchoolName] = useState<string>('مدارس التميز الأهلية الذكية');

  // Validate password
  useEffect(() => {
    if (watermarkPassword === '20302060') {
      setIsWatermarkRemoved(true);
      SoundEngine.playSparkle();
    } else {
      setIsWatermarkRemoved(false);
    }
  }, [watermarkPassword]);

  // Handle printing
  const handlePrint = () => {
    SoundEngine.playSparkle();
    window.print();
  };

  // Re-generate question order
  const handleRegenerate = () => {
    setSeed(prev => prev + 1);
    SoundEngine.playSparkle();
  };

  // Generate mock questions dynamically based on selected scope
  const getQuestionsForPage = (pageIndex: number) => {
    // Determine active units & lessons under selected scope
    let activeLessons = [...lessonsData];
    if (scope === 'unit') {
      const u = unitsData.find(unit => unit.id === selectedUnitId);
      if (u) {
        activeLessons = lessonsData.filter(l => u.lessons.includes(l.id));
      }
    } else if (scope === 'lesson') {
      activeLessons = lessonsData.filter(l => l.id === selectedLessonId);
    } else if (scope === 'favorites') {
      if (favorites.length > 0) {
        activeLessons = lessonsData.filter(l => favorites.includes(l.id));
      }
    }

     // True/False pool (الصح والخطأ)
    const tfPool = [
      { q: "النية بالقلب من فرائض الوضوء.", a: true, hint: "النية تجب للتمييز" },
      { q: "الملائكة مخلوقون من نور، وهم لا يعصون الله أبداً.", a: true, hint: "مخلوقات نورانية" },
      { q: "الماء الذي خالطه شيء طاهر كالحليب أو الصابون فغير اسمه وصار طاهراً لا يصح الوضوء به.", a: false, hint: "يفقد صفة التطهير" },
      { q: "عند الخروج من دورة المياه نقدم الرجل اليمنى ونقول: غفرانك.", a: true, hint: "نخرج بالرجل اليمنى" },
      { q: "نهانا الإسلام عن قضاء الحاجة في طريق الناس وظلهم.", a: true, hint: "أدب إسلامي رقيق" },
      { q: "الصدق من الأخلاق الحميدة التي تهدي إلى البر والجنة.", a: true, hint: "الصدق منجاه وعماد" },
      { q: "الملك ميكائيل عليه السلام هو الملك الموكل بنزول المطر وسقي العباد.", a: true, hint: "ميكائيل هو الموكل بالقطر" },
      { q: "بر الوالدين وطاعتهما من أعظم القربات إلى الله تعالى.", a: true, hint: "رضا الله في رضا الوالدين" },
      { q: "يحرص المسلم على نظافة ثوبه وبدنه ومكان صلاته دائماً.", a: true, hint: "الطهارة شطر الإيمان" },
      { q: "نزل الوحي الأول على نبينا محمد صلى الله عليه وسلم في غار حراء.", a: true, hint: "بدأ الوحي بغار حراء الشامخ" },
      { q: "استمرت الدعوة السرية في مكة المكرمة لمدة ثلاث سنوات.", a: true, hint: "التحرك الفطن السري" },
      { q: "من آداب الطالب احترام معلمه والإنصات لشرحه.", a: true, hint: "قم للمعلم وفه التبجيلا" },
      { q: "الماء الطهور هو كل ماء نزل من السماء أو نبع من الأرض باق على طبيعته دون تغير.", a: true, hint: "مثل ماء المطر" }
    ];

    // MCQs Pool (الاختيار من متعدد)
    const mcqPool = [
      {
        q: "الملك الموكل بنزول الوحي على الأنبياء هو:",
        opts: ["جبريل عليه السلام", "ميكائيل عليه السلام", "إسرافيل عليه السلام", "رضوان عليه السلام"],
        ans: 0
      },
      {
        q: "الماء النجس الذي تغير لونه أو طعمه أو رائحته بنجاسة، حكمه:",
        opts: ["لا يجوز استعماله في الوضوء والطهارة", "يصح الوضوء به", "يجوز الشرب منه فقط", "مكروه مع جواز الوضوء"],
        ans: 0
      },
      {
        q: "عند الخروج من دورة المياه نقدم الرجل:",
        opts: ["اليسرى قائلاً: بسم الله", "اليمنى قائلاً: غفرانك", "اليسرى قائلاً: غفرانك", "اليمنى قائلاً: بسم الله"],
        ans: 1
      },
      {
        q: "المضمضة والاستنشاق وغسل اليدين إلى الكوعين من:",
        opts: ["سنن الوضوء", "فرائض الوضوء السبعة", "مبطلات الوضوء", "نواقض الصلاة"],
        ans: 0
      },
      {
        q: "نزل الوحي أول مرة على نبينا محمد صلى الله عليه وسلم في:",
        opts: ["غار ثور", "غار حراء", "جبل الصفا", "شعب أبي طالب"],
        ans: 1
      },
      {
        q: "الآية التي تدل على دقة ميزان الله للأعمال يوم القيامة هي:",
        opts: ["فمن يعمل مثقال ذرة خيراً يره", "ألهاكم التكاثر", "إذا زلزلت الأرض زلزالها", "وتكون الجبال كالعهن المنفوش"],
        ans: 0
      },
      {
        q: "الصدق يهدي صاحبه إلى:",
        opts: ["الخسارة والندم", "البر والجنة", "التكاثر والتباهي", "الكسل والخمول"],
        ans: 1
      },
      {
        q: "من أسماء الله الحسنى (البارئ) ومعناه:",
        opts: ["الذي خلق الأجسام سالمة خالية من العيوب", "الذي يعطي لكل مخلوق صورته وشكله", "الذي يرزق العباد بالمطر", "الذي يطوي السماوات بيمينه"],
        ans: 0
      },
      {
        q: "من آداب الطريق التي وصانا بها نبينا محمد صلى الله عليه وسلم:",
        opts: ["إلقاء القمامة في الطريق", "اللعب بالكرة وسط المارة", "كف الأذى وغض البصر وإفشاء السلام", "التحدث بصوت مرتفع ساخر"],
        ans: 2
      },
      {
        q: "كان الرسول صلى الله عليه وسلم يجتمع بالصحابة سراً في بداية الدعوة في:",
        opts: ["دار الندوة", "دار الأرقم بن أبي الأرقم", "شعب بني هاشم", "دار أبي سفيان"],
        ans: 1
      }
    ];

    // Fill in Blanks Pool (املأ الأماكن الشاغرة بالكلمة المناسبة)
    const fillPool = [
      { q: "نحيي بعضنا إفشاءً للسلام بقولنا: ....................................... .", a: "السلام عليكم ورحمة الله وبركاته" },
      { q: "ذكرت سورة الأعلى صحف ....................................... وموسى عليهما السلام.", a: "إبراهيم" },
      { q: "الراحمون في الدنيا يرحمهم الله ....................................... .", a: "الرحمن" },
      { q: "ندخل دورة المياه بتقديم القدم ....................................... .", a: "اليسرى" },
      { q: "الماء ....................................... هو الماء الباقي على طبيعته ويصح به الوضوء.", a: "الطهور" },
      { q: "الأشياء التي تبطل الوضوء تسمى ....................................... .", a: "نواقض الوضوء" },
      { q: "الملك الموكل بإنزال المطر وإحياء الزرع هو الملك ....................................... .", a: "ميكائيل عليه السلام" },
      { q: "أول من آمن بالنبي صلى الله عليه وسلم من النساء هي السيدة ....................................... .", a: "خديجة بنت خويلد رضي الله عنها" },
      { q: "صعد النبي صلى الله عليه وسلم ودعا قريشاً جهراً فوق جبل ....................................... .", a: "الصفا" },
      { q: "يجب علينا احترام وتوقير المعلم لأنه ....................................... .", a: "يبني العقول ويرشدنا للخير والعلوم" }
    ];

    // Odd one out Pool (الكلمة الشاذة)
    const oddPool = [
      { items: ["ماء المطر", "ماء البئر", "الحليب والعصير", "ماء البحر"], odd: "الحليب والعصير", reason: "لأنهما طاهران في أنفسهما ولكن لا يصح بهما الوضوء، بينما البقية مياه طهورة يصح بها الوضوء." },
      { items: ["الملك جبريل", "إبليس", "الملك ميكائيل", "الملك إسرافيل"], odd: "إبليس", reason: "لأنه ليس من الملائكة الكرام المعصومين المطيعين لله." },
      { items: ["النية", "غسل الوجه", "مسح الأذنين", "غسل الرجلين"], odd: "مسح الأذنين", reason: "لأن مسح الأذنين من سنن الوضوء، بينما البقية من فرائض الوضوء السبعة." },
      { items: ["الصدق", "الأمانة", "الكذب والخيانة", "التعاون"], odd: "الكذب والخيانة", reason: "لأن الكذب والخيانة من الأخلاق الذميمة المرفوضة، والبقية من الأخلاق الكريمة." },
      { items: ["سورة التكاثر", "سورة القارعة", "الوضوء بالماء النجس", "سورة الزلزلة"], odd: "الوضوء بالماء النجس", reason: "لأنه حكم فقهي، بينما البقية سور قرآنية مقرية في الوحدة الأولى." }
    ];

    // Column Match Pool (القوائم المتقابلة)
    const matchPool = [
      { a: "الخالق", b: "هو الذي أوجد وخلق الكون وكل شيء من العدم." },
      { a: "البارئ", b: "هو الذي خلق الأجسام سالمة خالية من العيوب." },
      { a: "المصور", b: "هو الذي أعطى لكل مخلوق شكله وصورته الخاصة." },
      { a: "بر الوالدين", b: "من أعظم القربات بعد توحيد الله وسبب لدخول الجنة." },
      { a: "الصدق", b: "من مكارم الأخلاق ويهدي صاحبه إلى البر والجنة." }
    ];

    // Definitions / Essay Pool (التعريفات والتعليلات)
    const essayPool = [
      { q: "عرف مفهوم (الماء الطهور) مع ذكر مثال له؟", space: "...................................................................................................................................................................." },
      { q: "لماذا حثنا نبينا الكريم على كف الأذى وإماطة الأذى عن الطريق؟", space: "...................................................................................................................................................................." },
      { q: "لماذا اتخذ النبي صلى الله عليه وسلم دار الأرقم بن أبي الأرقم سراً لتعليم الصحابة في بداية الدعوة؟", space: "...................................................................................................................................................................." },
      { q: "عرف مفهوم (الصدق) وما هي أهميته في حياة المسلم؟", space: "...................................................................................................................................................................." },
      { q: "علل: نهى الإسلام عن قضاء الحاجة في مجاري المياه وظلال الأشجار المثمرة؟", space: "...................................................................................................................................................................." }
    ];

    // Generate deterministic questions sequence using pageIndex + seed
    // Pseudo-shuffle based on seed and index
    const getShuffledChunk = (array: any[], count: number, offset: number) => {
      const result = [...array];
      for (let i = result.length - 1; i > 0; i--) {
        const j = Math.abs((seed * 31 + offset * 11 + i * 7) % (i + 1));
        const temp = result[i];
        result[i] = result[j];
        result[j] = temp;
      }
      return result.slice(0, count);
    };

    // Filter pools slightly if specific topic is selected to ensure thematic relevance
    let matchedTf = tfPool;
    let matchedMcq = mcqPool;
    let matchedFill = fillPool;
    let matchedOdd = oddPool;
    let matchedMatch = matchPool;
    let matchedEssay = essayPool;

    if (scope === 'unit' || scope === 'lesson' || scope === 'favorites') {
      const keywords = activeLessons.map(al => al.title + " " + al.shortDesc).join(" ").toLowerCase();
      
      const filterByThematics = (item: any, textProp: string) => {
        const txt = String(item[textProp]).toLowerCase();
        // search-friendly words
        if (keywords.includes("ماء") || keywords.includes("فقه") || keywords.includes("حاجة") || keywords.includes("وضوء")) {
          if (txt.includes("ماء") || txt.includes("وضوء") || txt.includes("طهار") || txt.includes("حاج") || txt.includes("طهور") || txt.includes("سبيل")) return true;
        }
        if (keywords.includes("قرآن") || keywords.includes("تكاثر") || keywords.includes("سورة") || keywords.includes("قارعة") || keywords.includes("زلز") || keywords.includes("أعلى")) {
          if (txt.includes("سورة") || txt.includes("تكاثر") || txt.includes("نعيم") || txt.includes("قارع") || txt.includes("زلز") || txt.includes("أعلى") || txt.includes("ذر")) return true;
        }
        if (keywords.includes("حديث") || keywords.includes("بر") || keywords.includes("والد") || keywords.includes("رحم") || keywords.includes("صدق")) {
          if (txt.includes("حديث") || txt.includes("والد") || txt.includes("رحم") || txt.includes("صدق") || txt.includes("أم") || txt.includes("رسول") || txt.includes("جنة")) return true;
        }
        if (keywords.includes("عقيد") || keywords.includes("ملائكة") || keywords.includes("خالق") || keywords.includes("بارئ") || keywords.includes("مصور") || keywords.includes("توحيد")) {
          if (txt.includes("ملك") || txt.includes("ملائك") || txt.includes("جبريل") || txt.includes("اسم") || txt.includes("خالق") || txt.includes("بارئ") || txt.includes("مخلوق")) return true;
        }
        if (keywords.includes("أخلاق") || keywords.includes("تعاون") || keywords.includes("مدرس") || keywords.includes("طريق") || keywords.includes("أثر") || keywords.includes("معلم")) {
          if (txt.includes("تعاون") || txt.includes("مدرس") || txt.includes("طريق") || txt.includes("معلم") || txt.includes("حق") || txt.includes("رقيق")) return true;
        }
        if (keywords.includes("سير") || keywords.includes("غار") || keywords.includes("سري") || keywords.includes("جهر") || keywords.includes("مكة") || keywords.includes("حراء")) {
          if (txt.includes("سير") || txt.includes("غار") || txt.includes("حراء") || txt.includes("سري") || txt.includes("جهر") || txt.includes("مكة") || txt.includes("دعوة")) return true;
        }
        return Math.random() > 0.5; // fallback inclusion
      };

      matchedTf = tfPool.filter(item => filterByThematics(item, 'q'));
      if (matchedTf.length < 5) matchedTf = tfPool;

      matchedMcq = mcqPool.filter(item => filterByThematics(item, 'q'));
      if (matchedMcq.length < 5) matchedMcq = mcqPool;

      matchedFill = fillPool.filter(item => filterByThematics(item, 'q'));
      if (matchedFill.length < 4) matchedFill = fillPool;

      matchedOdd = oddPool.filter(item => filterByThematics(item, 'odd'));
      if (matchedOdd.length < 3) matchedOdd = oddPool;
    }

    // Distribute questions depending on the printed A4 sheet page index
    // Let's create beautiful layout patterns for up to 20 pages
    const pageLayoutIndex = pageIndex % 4; 

    if (pageLayoutIndex === 0) {
      // Pattern 0: True/False + Match table
      return {
        type: 'TF_MATCH',
        title1: "السؤال الأول : ضع علامة (✓) أمام العبارة الصحيحة وعلامة (✗) أمام الخاطئة : (١٠ درجات)",
        tf: getShuffledChunk(matchedTf, 10, pageIndex + 50),
        title2: "السؤال الثاني : صِل عبارات المجموعة (أ) بمدلولاتها من المجموعة (ب) بذكاء وتركيز: (٥ درجات)",
        matching: getShuffledChunk(matchedMatch, 5, pageIndex + 120)
      };
    } else if (pageLayoutIndex === 1) {
      // Pattern 1: MCQs + Fill in the blanks
      return {
        type: 'MCQ_FILL',
        title1: "السؤال الثالث : ضع دائرة متقنة حول حرف الإجابة الصحيحة والكاملة مما يلي: (٨ درجات)",
        mcq: getShuffledChunk(matchedMcq, 8, pageIndex + 20),
        title2: "السؤال الرابع : املأ الفراغات والساحات الشاغرة باللسان العربي المناسب: (٦ درجات)",
        fill: getShuffledChunk(matchedFill, 6, pageIndex + 88)
      };
    } else if (pageLayoutIndex === 2) {
      // Pattern 2: Odd one out + Definitions
      return {
        type: 'ODD_ESSAY',
        title1: "السؤال الخامس : استخرج الكلمة الشاذة أو الغريبة من السلاسل الموضحة مع كتابة السبب: (٦ درجات)",
        odd: getShuffledChunk(matchedOdd, 3, pageIndex + 45),
        title2: "السؤال السادس : وضّح المقصود بالمصطلحات الإسلامية الجوهرية التالية باختصار: (٦ درجات)",
        definitions: getShuffledChunk(matchedEssay.filter(e => e.q.includes("عرف") || e.q.includes("عرّف")), 3, pageIndex + 14)
      };
    } else {
      // Pattern 3: Give Reasons / Verses & Hadith Complete
      return {
        type: 'REASONS_COMPLETE',
        title1: "السؤال السابع : علّل بذكر السبب الشرعي أو الاجتماعي المبرر للمواقف والتعاليم الواردة: (٦ درجات)",
        reasons: getShuffledChunk(matchedEssay.filter(e => e.q.includes("علل") || e.q.includes("علّل")), 3, pageIndex + 99),
        title2: "السؤال الثامن : استرجاع وكتابة نصوص السور الكريمة والأحاديث النبوية المقررة: (١٠ درجات)",
        scriptures: pageIndex % 2 === 0 ? [
          { q: "اكتب من سورة القارعة الكريمة الشريفة بدقة متناهية من قوله تعالى: (الْقَارِعَةُ * مَا الْقَارِعَةُ) إلى قوله تعالى: (فَهُوَ فِي عِيشَةٍ رَّاضِيَةٍ):", lines: ["................................................................................................................................................................", "................................................................................................................................................................"] },
          { q: "أكمل تدوين حديث نبينا الأمين صلى الله عليه وسلم الخاص بالصدق: (إنّ الصدق يهدي إلى ........................................................................):", lines: ["................................................................................................................................................................"] }
        ] : [
          { q: "اكتب من سورة الزلزلة العظيمة الشريفة بضبط سليم من قوله تبارك وتعالى: (إِذَا زُلْزِلَتِ الْأَرْضُ زِلْزَالَهَا) إلى قوله: (يَوْمَئِذٍ تُحَدِّثُ أَخْبَارَهَا):", lines: ["................................................................................................................................................................", "................................................................................................................................................................"] },
          { q: "أكمل حديث الرحمة الرقيق بضبط كلماته: (ليس منا من لم يرحم ................. ويوقر .................):", lines: ["................................................................................................................................................................"] }
        ]
      };
    }
  };

  // Setup list of page indexes to render
  const pagesArray = Array.from({ length: pageCount }, (_, idx) => idx);

  return (
    <div className="bg-white min-h-screen text-[#4A453E] text-right font-sans rounded-3xl overflow-hidden shadow-xs border border-[#DCD3C1]/50 print-wrapper">
      
      {/* Control panel & options header - hidden on print */}
      <div className="bg-[#F1EBDC] border-b border-[#DCD3C1] p-6 no-print">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h2 className="text-xl font-black text-[#3A452E] flex items-center gap-2">
              <Printer className="w-6 h-6 text-[#5A6B47]" />
              <span>مولد اختبارات وأوراق عمل المنهج للطباعة 🖨️</span>
            </h2>
            <p className="text-xs text-[#8E8268] mt-1 font-semibold">
              صمم وهيئ أوراق امتحانات رسمية بحجم <strong className="text-[#5A6B47]">A4</strong> تليق بطلاب الصف الثالث الابتدائي ومطابقة للمناهج السودانية العريقة.
            </p>
          </div>
          
          <div className="flex gap-2 shrink-0">
            <button
              onClick={handleRegenerate}
              className="flex items-center gap-1.5 bg-white hover:bg-[#E9E1CD] text-[#5A6B47] font-extrabold text-xs py-2 px-3.5 rounded-xl border border-[#DCD3C1] transition cursor-pointer shadow-2xs"
            >
              <RefreshCw className="w-4 h-4" />
              <span>إعادة خلط وتوليد الأسئلة 🔄</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 bg-[#5A6B47] hover:bg-[#465337] text-white font-extrabold text-xs py-2.5 px-5 rounded-xl transition cursor-pointer shadow-sm"
            >
              <Printer className="w-4 h-4 animate-bounce" />
              <span>طباعة المستند الورقي بالكامل 🖨️</span>
            </button>
            
            {onBack && (
              <button
                onClick={onBack}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-extrabold text-xs py-2 px-4 rounded-xl transition cursor-pointer"
              >
                رجوع ↩️
              </button>
            )}
          </div>
        </div>

        {/* Configuration settings panel */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 bg-white/70 p-5 rounded-2xl border border-[#DCD3C1]/60">
          
          {/* Scope Select */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-black text-[#5A6B47] flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5" />
              <span>نطاق مادة الامتحان:</span>
            </label>
            <select
              value={scope}
              onChange={(e) => {
                setScope(e.target.value as any);
                SoundEngine.playSparkle();
              }}
              className="bg-white border border-[#DCD3C1] rounded-lg py-2 px-3 text-xs font-bold text-[#4A453E] outline-none focus:border-[#5A6B47] cursor-pointer"
            >
              <option value="all">كامل محتوى المقرر الدراسي 🗺️</option>
              <option value="unit">وحدة دراسية معينة 🗳️</option>
              <option value="lesson">درس تفاعلي محدد 📖</option>
              <option value="favorites">الدروس المفضلة فقط ⭐</option>
            </select>
          </div>

          {/* Conditional selectors for scope */}
          {scope === 'favorites' && (
            <div className="flex flex-col gap-1.5 justify-center">
              <label className="text-xs font-black text-rose-600 flex items-center gap-1">
                <span>❤️</span>
                <span>الدروس المفضلة المحددة:</span>
              </label>
              <div className={`text-xs py-2 px-3 rounded-lg font-bold border ${
                favorites.length > 0
                  ? 'bg-rose-50 border-rose-200 text-rose-700'
                  : 'bg-amber-50 border-amber-200 text-amber-700'
              }`}>
                {favorites.length > 0 ? (
                  <span>تم إدراج {favorites.length} {favorites.length === 1 ? 'درس مفضل' : 'دروس مفضلة'} في ورقة الاختبار!</span>
                ) : (
                  <span>لا توجد دروس مفضلة حالياً. حدد دروسك بـ ❤️ في شاشة الكتب أولاً!</span>
                )}
              </div>
            </div>
          )}
          {scope === 'unit' && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black text-[#5A6B47] flex items-center gap-1">
                <Award className="w-3.5 h-3.5" />
                <span>اختر الوحدة المستهدفة:</span>
              </label>
              <select
                value={selectedUnitId}
                onChange={(e) => {
                  setSelectedUnitId(Number(e.target.value));
                  SoundEngine.playSparkle();
                }}
                className="bg-white border border-[#DCD3C1] rounded-lg py-2 px-3 text-xs font-bold text-[#4A453E] outline-none focus:border-[#5A6B47] cursor-pointer"
              >
                {unitsData.map(u => (
                  <option key={u.id} value={u.id}>{u.title}</option>
                ))}
              </select>
            </div>
          )}

          {scope === 'lesson' && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black text-[#5A6B47] flex items-center gap-1">
                <FileQuestion className="w-3.5 h-3.5" />
                <span>اختر الدرس الدراسي المستهدف:</span>
              </label>
              <select
                value={selectedLessonId}
                onChange={(e) => {
                  setSelectedLessonId(e.target.value);
                  SoundEngine.playSparkle();
                }}
                className="bg-white border border-[#DCD3C1] rounded-lg py-2 px-3 text-xs font-bold text-[#4A453E] outline-none focus:border-[#5A6B47] cursor-pointer"
              >
                {lessonsData.map(l => (
                  <option key={l.id} value={l.id}>{l.title}</option>
                ))}
              </select>
            </div>
          )}

          {/* Page count selector */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-black text-[#5A6B47] flex items-center gap-1">
              <FileText className="w-3.5 h-3.5" />
              <span>عدد الأوراق / الصفحات المطلوبة (حتى ٢٠):</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="1"
                max="20"
                value={pageCount}
                onChange={(e) => {
                  setPageCount(Number(e.target.value));
                }}
                className="flex-1 accent-[#5A6B47]"
              />
              <span className="bg-[#5A6B47] text-white font-black text-xs px-3 py-1 rounded-lg">
                {pageCount} {pageCount === 1 ? 'صفحة' : pageCount <= 10 ? 'صفحات' : 'ورقة'}
              </span>
            </div>
          </div>

          {/* Watermark Verification Password */}
          <div className="flex flex-col gap-1.5 sm:col-span-2 lg:col-span-2">
            <label className="text-xs font-black text-[#5A6B47] flex items-center justify-between">
              <span className="flex items-center gap-1">
                {isWatermarkRemoved ? <Unlock className="w-3.5 h-3.5 text-emerald-600 animate-bounce" /> : <Lock className="w-3.5 h-3.5 text-[#B08933]" />}
                <span>إزالة العلامة المائية (كلمة مرور 20302060):</span>
              </span>
              {isWatermarkRemoved && (
                <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md font-black flex items-center gap-0.5">
                  <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span>مرفوعة!</span>
                </span>
              )}
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-[#8E8268]">
                <Key className="w-4 h-4" />
              </span>
              <input
                type="password"
                placeholder="أدخل الرمز الإداري السري لإخفاء كلمة نقلة للمناهج..."
                value={watermarkPassword}
                onChange={(e) => setWatermarkPassword(e.target.value)}
                className={`w-full bg-white text-[#4A453E] text-xs font-mono py-2 pr-10 pl-4 rounded-xl border outline-none focus:bg-white ${
                  isWatermarkRemoved 
                    ? 'border-emerald-500 text-emerald-700 bg-emerald-50/15' 
                    : 'border-[#DCD3C1] focus:border-[#5A6B47]'
                }`}
              />
            </div>
          </div>

          {/* School Name customizer */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-black text-[#5A6B47] flex items-center gap-1">
              <Compass className="w-3.5 h-3.5" />
              <span>مسمى المدرسة بالأعلى:</span>
            </label>
            <input
              type="text"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              placeholder="اكتب اسم مدرستك لإضافتها بالرأس..."
              className="bg-white border border-[#DCD3C1] rounded-lg py-2 px-3 text-xs font-bold text-[#4A453E] outline-none focus:border-[#5A6B47]"
            />
          </div>

          {/* Exam official subtitle customizer */}
          <div className="flex flex-col gap-1.5 sm:col-span-2 lg:col-span-3">
            <label className="text-xs font-black text-[#5A6B47] flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>عنوان ومانشيت الامتحان الرئيسي:</span>
            </label>
            <input
              type="text"
              value={examTitle}
              onChange={(e) => setExamTitle(e.target.value)}
              placeholder="اكتب العنوان الظاهر في منتصف رأس الصفحة الأولى..."
              className="bg-white border border-[#DCD3C1] rounded-lg py-2 px-3 text-xs font-bold text-[#4A453E] outline-none focus:border-[#5A6B47]"
            />
          </div>

          <div className="col-span-full border-t border-[#DCD3C1]/50 pt-3 flex items-center justify-between text-[11px] text-[#8E8268]">
            <span className="font-extrabold text-[#5A6B47] flex items-center gap-1">
              <LayoutGrid className="w-4 h-4 shrink-0" />
              <span>يرجى الملاحظة:</span> تم صقل تنسيق الصفحات على نموذج المقاييس المدرسية الموحدة وتنسيق الخطوط ليناسب الطباعة أحادية اللون (مونوكروم) بوفاء تام!
            </span>
            <span className="font-black bg-[#E9E1CD] px-2.5 py-1 rounded-full text-[#4A453E]">
              العلامة المائية الافتراضية: نقلة للمناهج الإلكترونية
            </span>
          </div>

        </div>
      </div>

      {/* Pages Container Screen Preview - visually styled pages */}
      <div className="bg-neutral-100 p-8 flex flex-col items-center gap-10 overflow-x-auto select-none print-container">
        <p className="text-xs font-black text-[#8E8268] flex items-center gap-1 no-print">
          <span>👀 معاينة مباشرة للأوراق قبل سحبها بالمطبعة (بحجم A4 حقيقي):</span>
        </p>
        
        {pagesArray.map((pIndex) => {
          const contents = getQuestionsForPage(pIndex);
          return (
            <div
              key={pIndex}
              className="print-page relative w-[210mm] min-h-[297mm] bg-white p-[18mm] border border-neutral-300 shadow-xl rounded-sm text-black shrink-0 flex flex-col justify-between overflow-hidden"
              style={{ direction: 'rtl', fontFamily: 'serif' }}
            >
              
              {/* WATERMARK BACKGROUND EMBEDDED - Controlled by admin password password */}
              {!isWatermarkRemoved && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 overflow-hidden opacity-[0.06]">
                  <div className="text-[#5A6B47] text-4xl font-extrabold border-8 border-dashed border-[#5A6B47] p-8 rounded-3xl tracking-widest whitespace-nowrap -rotate-30 scale-150">
                    نقلة للمناهج الإلكترونية
                  </div>
                </div>
              )}

              {/* Standard Page content container */}
              <div className="z-10 flex-1 flex flex-col justify-between">
                
                {/* FIRST PAGE HEADER & STUDENT METADATA TABLE */}
                {pIndex === 0 && (
                  <div className="border-b-4 border-double border-black pb-4 mb-6">
                    <div className="text-center font-extrabold text-[15px] tracking-widest mb-1">
                      بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                    </div>
                    
                    <div className="flex justify-between items-start mb-4">
                      {/* Right School info */}
                      <div className="text-right text-xs leading-dense space-y-1 font-extrabold">
                        <div>{schoolName}</div>
                        <div>الامتحان الختامي لطلاب الصف الثالث</div>
                        <div>المادة: التربية الإسلامية</div>
                      </div>
                      
                      {/* Left Marks block */}
                      <div className="flex gap-2">
                        <table className="border-collapse border border-black text-center text-xs">
                          <tbody>
                            <tr>
                              <td className="border border-black px-2 py-1 font-bold bg-neutral-100">الدرجة الكلية</td>
                              <td className="border border-black px-3 py-1 font-mono font-bold">١٠٠</td>
                            </tr>
                            <tr>
                              <td className="border border-black px-2 py-1 font-bold bg-neutral-100">درجة التلميذ</td>
                              <td className="border border-black px-3 py-1 min-w-[50px]"></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="text-center py-2 bg-neutral-100/50 border border-black rounded-lg font-black text-sm mb-4 tracking-tight leading-loose">
                      {examTitle}
                    </div>

                    {/* Student Name field border line */}
                    <div className="grid grid-cols-3 gap-4 border border-black p-3 rounded-lg text-xs leading-loose">
                      <div className="col-span-2 font-bold">
                        اسم التلميـــذ رباعياً: ........................................................................................
                      </div>
                      <div className="font-bold">
                        الصف: الثالث الابتدائي (   )
                      </div>
                      <div className="col-span-2 font-bold">
                        اسم لجنة الامتحـان: ........................................................................................
                      </div>
                      <div className="font-bold">
                        رقم الجلوس: ..............................
                      </div>
                    </div>

                    {/* Marking Matrix from screenshot */}
                    <div className="mt-4 grid grid-cols-12 gap-3 items-center">
                      <div className="col-span-7">
                        <table className="w-full border-collapse border border-black text-center text-[10px] leading-tight">
                          <thead>
                            <tr className="bg-neutral-100">
                              <th className="border border-black p-1 font-bold" colSpan={9}>جدول رصد درجات الفروع والأسئلة لغرفة التصحيح (اترك هذا الجدول خالياً)</th>
                            </tr>
                            <tr className="bg-neutral-50 font-bold">
                              <td className="border border-black p-1">السؤال</td>
                              <td className="border border-black p-1">الأول</td>
                              <td className="border border-black p-1">الثاني</td>
                              <td className="border border-black p-1">الثالث</td>
                              <td className="border border-black p-1">الرابع</td>
                              <td className="border border-black p-1">الخامس</td>
                              <td className="border border-black p-1">السادس</td>
                              <td className="border border-black p-1">السابع</td>
                              <td className="border border-black p-1">المجموع</td>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="border border-black p-1 bg-neutral-50 font-bold">المصحح</td>
                              <td className="border border-black p-1"></td>
                              <td className="border border-black p-1"></td>
                              <td className="border border-black p-1"></td>
                              <td className="border border-black p-1"></td>
                              <td className="border border-black p-1"></td>
                              <td className="border border-black p-1"></td>
                              <td className="border border-black p-1"></td>
                              <td className="border border-black p-1"></td>
                            </tr>
                            <tr>
                              <td className="border border-black p-1 bg-neutral-50 font-bold">المراجع</td>
                              <td className="border border-black p-1"></td>
                              <td className="border border-black p-1"></td>
                              <td className="border border-black p-1"></td>
                              <td className="border border-black p-1"></td>
                              <td className="border border-black p-1"></td>
                              <td className="border border-black p-1"></td>
                              <td className="border border-black p-1"></td>
                              <td className="border border-black p-1"></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      <div className="col-span-5 bg-neutral-100/40 p-2 border border-black rounded text-[9px] leading-normal font-extrabold text-right">
                        <div className="font-black text-[10px] mb-1 text-neutral-800 border-b border-black pb-0.5">⚠️ إرشاد وتوجيهات الامتحان:</div>
                        <ol className="list-decimal list-inside space-y-0.5">
                          <li>أكتب بيانات اسمك ورقم جلوسك الرباعي بوضوح كامل بدقة بالرأس.</li>
                          <li>أجب عن كافة البنود والأسئلة بنفس الورقة ولا تغادر دون إجابة.</li>
                          <li>استخدم القلم الصالح الأزرق ولا تقم بشطب أو تغيير الخيارات عشوائياً.</li>
                          <li>ممنوع استخدام المصحح الأبيض السائل طيلة رصد الإجابة تفادياً للإقصاء.</li>
                        </ol>
                      </div>
                    </div>
                  </div>
                )}

                {/* Subheading Header for subsequent pages */}
                {pIndex > 0 && (
                  <div className="border-b border-black pb-2 mb-4 flex justify-between items-center text-xs font-bold font-mono">
                    <span>{schoolName} - الامتحان الختامي لمادة التربية الإسلامية</span>
                    <span>صفحة امتحان التلميذ رقم: {pIndex + 1}</span>
                  </div>
                )}

                {/* DYNAMIC CONTENT FOR THE PAGE */}
                <div className="flex-1 space-y-6 text-xs text-black leading-relaxed font-serif text-justify selection:bg-neutral-200">
                  
                  {/* PATTERN 0: True/False Question + Column Match */}
                  {contents.type === 'TF_MATCH' && (
                    <>
                      <div>
                        <h4 className="font-extrabold text-[12px] bg-neutral-100 p-1.5 border border-black rounded mb-3 flex justify-between">
                          <span>{contents.title1}</span>
                          <span className="font-mono bg-white border border-black px-2.5 rounded">١٠ درجات</span>
                        </h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 mt-2">
                          {contents.tf?.map((item: any, i: number) => (
                            <div key={i} className="flex items-center justify-between border-b border-dashed border-neutral-300 pb-1.5">
                              <span className="font-semibold text-[11px]">
                                {i + 1}) {item.q}
                              </span>
                              <span className="font-mono text-[11.5px] font-bold px-2 whitespace-nowrap">
                                (　　)
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-4">
                        <h4 className="font-extrabold text-[12px] bg-neutral-100 p-1.5 border border-black rounded mb-4 flex justify-between">
                          <span>{contents.title2}</span>
                          <span className="font-mono bg-white border border-black px-2.5 rounded">٥ درجات</span>
                        </h4>

                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse border border-black text-right text-[11px]">
                            <thead>
                              <tr className="bg-neutral-100 text-center font-black">
                                <th className="border border-black p-2 w-[5%]">#</th>
                                <th className="border border-black p-2 w-[25%]">المجموعة (أ)</th>
                                <th className="border border-black p-2 w-[15%]">رمز الربط</th>
                                <th className="border border-black p-2 w-[55%]">المجموعة (ب) المقابلة</th>
                              </tr>
                            </thead>
                            <tbody>
                              {contents.matching?.map((item: any, i: number) => {
                                // Scrambled letter indicators for matching
                                const letters = ['أ', 'ب', 'ج', 'د', 'هـ', 'و', 'ز'];
                                return (
                                  <tr key={i}>
                                    <td className="border border-black p-2 text-center font-bold font-mono">{i + 1}</td>
                                    <td className="border border-black p-2 font-bold">{item.a}</td>
                                    <td className="border border-black p-2 text-center pointer-events-none">
                                      (　　)
                                    </td>
                                    <td className="border border-black p-2 leading-relaxed">
                                      <span className="font-bold font-mono inline-block ml-2 text-neutral-600">[{letters[i]}]</span>
                                      {item.b}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </>
                  )}

                  {/* PATTERN 1: Multiple Choice Question + Fill in Blanks */}
                  {contents.type === 'MCQ_FILL' && (
                    <>
                      <div>
                        <h4 className="font-extrabold text-[12px] bg-neutral-100 p-1.5 border border-black rounded mb-3 flex justify-between">
                          <span>{contents.title1}</span>
                          <span className="font-mono bg-white border border-black px-2.5 rounded">٨ درجات</span>
                        </h4>

                        <div className="space-y-3 mt-2">
                          {contents.mcq?.map((item: any, i: number) => (
                            <div key={i} className="border-b border-dashed border-neutral-200 pb-2">
                              <div className="font-black text-[11px] text-neutral-800">
                                {i + 1}) {item.q}
                              </div>
                              <div className="grid grid-cols-4 gap-2 mt-1 px-4 text-[10.5px]">
                                {item.opts.map((opt: string, idx: number) => {
                                  const letters = ['أ', 'ب', 'ج', 'د'];
                                  return (
                                    <div key={idx} className="flex items-center gap-1 font-semibold leading-relaxed">
                                      <span className="font-mono text-neutral-500 font-extrabold">{letters[idx]}/</span>
                                      <span>{opt}</span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-4">
                        <h4 className="font-extrabold text-[12px] bg-neutral-100 p-1.5 border border-black rounded mb-3 flex justify-between">
                          <span>{contents.title2}</span>
                          <span className="font-mono bg-white border border-black px-2.5 rounded">٦ درجات</span>
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 mt-2">
                          {contents.fill?.map((item: any, i: number) => (
                            <div key={i} className="border-b border-dashed border-neutral-300 pb-1.5 text-[11px] font-semibold">
                              <span>{i + 1}) {item.q}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {/* PATTERN 2: Odd One Out + Definitions */}
                  {contents.type === 'ODD_ESSAY' && (
                    <>
                      <div>
                        <h4 className="font-extrabold text-[12px] bg-neutral-100 p-1.5 border border-black rounded mb-3 flex justify-between">
                          <span>{contents.title1}</span>
                          <span className="font-mono bg-white border border-black px-2.5 rounded">٦ درجات</span>
                        </h4>

                        <div className="space-y-4 mt-2">
                          {contents.odd?.map((item: any, i: number) => (
                            <div key={i} className="border border-neutral-300 p-2.5 rounded-lg bg-neutral-50 border-r-4 border-r-black">
                              <div className="font-black text-[11px] mb-1.5 leading-snug">
                                {i + 1}) حدد الكلمة الشاذة ضمن العناصر التالية:
                                <span className="inline-block bg-white border border-neutral-300 px-3 py-0.5 rounded-full mr-2 font-bold font-sans text-[10px]">
                                  {item.items.join("  |  ")}
                                </span>
                              </div>
                              <div className="grid grid-cols-2 gap-4 mt-1">
                                <div className="font-semibold text-[10.5px]">
                                  * العبارة أو الكلمة الشاذة هي: ................................................................
                                </div>
                                <div className="font-semibold text-[10.5px]">
                                  * السبب في رأيك التعاطفي: ................................................................
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-4">
                        <h4 className="font-extrabold text-[12px] bg-neutral-100 p-1.5 border border-black rounded mb-3 flex justify-between">
                          <span>{contents.title2}</span>
                          <span className="font-mono bg-white border border-black px-2.5 rounded">٦ درجات</span>
                        </h4>

                        <div className="space-y-4 mt-2">
                          {contents.definitions?.map((item: any, i: number) => (
                            <div key={i} className="space-y-1">
                              <div className="font-black text-[11px] text-neutral-800">
                                {i + 1}) {item.q}
                              </div>
                              <div className="text-[11px] font-semibold font-mono tracking-wider">
                                {item.space}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {/* PATTERN 3: Give Reasons / Complete Verses */}
                  {contents.type === 'REASONS_COMPLETE' && (
                    <>
                      <div>
                        <h4 className="font-extrabold text-[12px] bg-neutral-100 p-1.5 border border-black rounded mb-3 flex justify-between">
                          <span>{contents.title1}</span>
                          <span className="font-mono bg-white border border-black px-2.5 rounded">٦ درجات</span>
                        </h4>

                        <div className="space-y-4 mt-2">
                          {contents.reasons?.map((item: any, i: number) => (
                            <div key={i} className="space-y-1">
                              <div className="font-black text-[11px] text-neutral-800">
                                {i + 1}) {item.q}
                              </div>
                              <div className="text-[11px] font-semibold font-mono tracking-wider">
                                {item.space}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-4">
                        <h4 className="font-extrabold text-[12px] bg-neutral-100 p-1.5 border border-black rounded mb-3 flex justify-between">
                          <span>{contents.title2}</span>
                          <span className="font-mono bg-white border border-black px-2.5 rounded">١٠ درجات</span>
                        </h4>

                        <div className="space-y-4 mt-2">
                          {contents.scriptures?.map((item: any, i: number) => (
                            <div key={i} className="space-y-2 border border-neutral-200 p-2.5 rounded-lg bg-neutral-50/50">
                              <div className="font-black text-[11px] leading-snug">
                                {i + 1}) {item.q}
                              </div>
                              <div className="space-y-2.5">
                                {item.lines.map((ln: string, idx: number) => (
                                  <div key={idx} className="text-[11px] font-semibold tracking-wider">{ln}</div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                </div>

                {/* Constant Footer including Allah's success quote and page numbers */}
                <div className="mt-8 pt-2 border-t border-black flex justify-between items-center text-[10px] font-bold">
                  <span>والأجر العظيم من عند الله وحده،،،</span>
                  <span className="text-[11px] font-black underline border-x border-black px-4 font-sans">
                    والله المستعـان والموفـق،،، شعبة التربية الإسلامية
                  </span>
                  <span>صفحة رقم: ({pIndex + 1}) من أصل ({pageCount}) صفحات</span>
                </div>

              </div>

            </div>
          );
        })}
      </div>

      {/* PRINT-ONLY CSS CONTAINER CONFIGURATION */}
      <style>{`
        @media print {
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            box-shadow: none !important;
          }
          
          html, body, #root, main, .min-h-screen {
            background: white !important;
            color: black !important;
            margin: 0 !important;
            padding: 0 !important;
            position: static !important;
            overflow: visible !important;
            height: auto !important;
            min-height: auto !important;
            width: 100% !important;
            direction: rtl !important;
          }
          
          #main-navigation-tabs,
          #app-gold-header,
          header,
          footer,
          .no-print,
          .ornament,
          #sound-control-btn,
          #name-edit-field,
          button,
          select,
          input,
          label {
            display: none !important;
          }

          /* Reset all outer layouts & dimensions so they don't offset A4 on print */
          main {
            background: transparent !important;
            padding: 0 !important;
            margin: 0 !important;
            max-width: none !important;
            width: 100% !important;
            border: none !important;
            overflow: visible !important;
          }

          .print-wrapper {
            background: transparent !important;
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
            overflow: visible !important;
            min-height: auto !important;
            width: 100% !important;
          }

          .print-container {
            background: transparent !important;
            padding: 0 !important;
            margin: 0 !important;
            gap: 0 !important;
            display: block !important;
            overflow: visible !important;
            width: 100% !important;
          }

          .print-page {
            box-shadow: none !important;
            border: none !important;
            border-radius: 0 !important;
            margin: 0 !important;
            padding: 18mm 18mm !important;
            width: 210mm !important;
            height: 297mm !important;
            page-break-after: always !important;
            page-break-inside: avoid !important;
            position: relative !important;
            box-sizing: border-box !important;
            background: white !important;
            color: black !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
            z-index: 10 !important;
            overflow: hidden !important;
          }

          /* Ensure proper page styling */
          @page {
            size: A4;
            margin: 0;
          }
        }
      `}</style>
      
    </div>
  );
}
