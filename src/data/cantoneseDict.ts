import { CharacterBreakdown, DetectedWord } from '../types';

// Tone names mapping
export const TONE_NAMES: Record<number, string> = {
  1: '第1聲 (陰平 - High Level 55)',
  2: '第2聲 (陰上 - High Rising 35)',
  3: '第3聲 (陰去 - Mid Level 33)',
  4: '第4聲 (陽平 - Low Falling 21)',
  5: '第5聲 (陽上 - Low Rising 23)',
  6: '第6聲 (陽去 - Low Level 22)',
};

// Rich Cantonese character dictionary for high-frequency Hong Kong characters
export const CHAR_DICT: Record<string, { jyutping: string; tone: number; meaning: string }> = {
  // Common Greetings & Pronouns
  早: { jyutping: 'zou2', tone: 2, meaning: 'Early / Morning' },
  晨: { jyutping: 'san4', tone: 4, meaning: 'Morning' },
  你: { jyutping: 'nei5', tone: 5, meaning: 'You' },
  好: { jyutping: 'hou2', tone: 2, meaning: 'Good / Well' },
  我: { jyutping: 'ngo5', tone: 5, meaning: 'I / Me' },
  佢: { jyutping: 'keoi5', tone: 5, meaning: 'He / She / It' },
  哋: { jyutping: 'dei6', tone: 6, meaning: 'Plural suffix (we/they)' },
  係: { jyutping: 'hai6', tone: 6, meaning: 'To be / Yes' },
  唔: { jyutping: 'm4', tone: 4, meaning: 'Not / No' },
  該: { jyutping: 'goi1', tone: 1, meaning: 'Ought / Please' },
  多: { jyutping: 'do1', tone: 1, meaning: 'Much / Many' },
  謝: { jyutping: 'ze6', tone: 6, meaning: 'Thanks / Gratitude' },
  再: { jyutping: 'zoi3', tone: 3, meaning: 'Again' },
  見: { jyutping: 'gin3', tone: 3, meaning: 'See / Meet' },
  請: { jyutping: 'cing2', tone: 2, meaning: 'Please / Invite' },
  借: { jyutping: 'ze3', tone: 3, meaning: 'Borrow / Excuse' },
  冇: { jyutping: 'mou5', tone: 5, meaning: 'Have not / None' },
  問: { jyutping: 'man6', tone: 6, meaning: 'Ask' },
  題: { jyutping: 'tai4', tone: 4, meaning: 'Topic / Problem' },

  // Food & Dining (Cha Chaan Teng & Yum Cha)
  凍: { jyutping: 'dung3', tone: 3, meaning: 'Cold / Iced' },
  熱: { jyutping: 'jit6', tone: 6, meaning: 'Hot / Warm' },
  檸: { jyutping: 'ning4', tone: 4, meaning: 'Lemon' },
  檬: { jyutping: 'mung1', tone: 1, meaning: 'Lemon' },
  茶: { jyutping: 'caa4', tone: 4, meaning: 'Tea' },
  奶: { jyutping: 'naai5', tone: 5, meaning: 'Milk' },
  咖: { jyutping: 'gaa3', tone: 3, meaning: 'Coffee (prefix)' },
  啡: { jyutping: 'fe1', tone: 1, meaning: 'Coffee (suffix)' },
  水: { jyutping: 'seoi2', tone: 2, meaning: 'Water' },
  雲: { jyutping: 'wan4', tone: 4, meaning: 'Cloud' },
  吞: { jyutping: 'tan1', tone: 1, meaning: 'Swallow / Wonton' },
  麵: { jyutping: 'min6', tone: 6, meaning: 'Noodles' },
  飯: { jyutping: 'faan6', tone: 6, meaning: 'Rice / Meal' },
  菠: { jyutping: 'bo1', tone: 1, meaning: 'Pineapple (prefix)' },
  蘿: { jyutping: 'lo4', tone: 4, meaning: 'Pineapple (suffix)' },
  油: { jyutping: 'jau4', tone: 4, meaning: 'Oil / Butter' },
  包: { jyutping: 'baau1', tone: 1, meaning: 'Bun / Bread' },
  蛋: { jyutping: 'daan2', tone: 2, meaning: 'Egg' },
  撻: { jyutping: 'taat1', tone: 1, meaning: 'Tart' },
  點: { jyutping: 'dim2', tone: 2, meaning: 'Point / Dim sum' },
  心: { jyutping: 'sam1', tone: 1, meaning: 'Heart' },
  食: { jyutping: 'sik6', tone: 6, meaning: 'To eat' },
  飲: { jyutping: 'jam2', tone: 2, meaning: 'To drink' },
  餐: { jyutping: 'caan1', tone: 1, meaning: 'Meal / Set' },
  常: { jyutping: 'soeng4', tone: 4, meaning: 'Regular / Daily' },
  外: { jyutping: 'ngoi6', tone: 6, meaning: 'Outside / Takeout' },
  賣: { jyutping: 'maai6', tone: 6, meaning: 'To sell' },
  買: { jyutping: 'maai5', tone: 5, meaning: 'To buy' },
  少: { jyutping: 'siu2', tone: 2, meaning: 'Little / Less' },
  甜: { jyutping: 'tim4', tone: 4, meaning: 'Sweet' },
  走: { jyutping: 'zau2', tone: 2, meaning: 'Leave / Without' },
  杯: { jyutping: 'bui1', tone: 1, meaning: 'Cup / Glass' },
  碗: { jyutping: 'wun2', tone: 2, meaning: 'Bowl' },
  碟: { jyutping: 'dip6', tone: 6, meaning: 'Plate' },
  叉: { jyutping: 'caa1', tone: 1, meaning: 'Fork / Char' },
  燒: { jyutping: 'siu1', tone: 1, meaning: 'Roast' },
  牛肉: { jyutping: 'ngau4 juk6', tone: 4, meaning: 'Beef' },
  牛: { jyutping: 'ngau4', tone: 4, meaning: 'Cow / Beef' },
  肉: { jyutping: 'juk6', tone: 6, meaning: 'Meat' },
  豬: { jyutping: 'zyu1', tone: 1, meaning: 'Pork' },
  雞: { jyutping: 'gai1', tone: 1, meaning: 'Chicken' },
  魚: { jyutping: 'jyu4', tone: 4, meaning: 'Fish' },
  蝦: { jyutping: 'haa1', tone: 1, meaning: 'Shrimp' },

  // MTR & Transportation
  出: { jyutping: 'ceot1', tone: 1, meaning: 'Exit / Out' },
  口: { jyutping: 'hau2', tone: 2, meaning: 'Mouth / Opening' },
  入: { jyutping: 'jap6', tone: 6, meaning: 'Enter / In' },
  港: { jyutping: 'gong2', tone: 2, meaning: 'Port / Hong Kong' },
  鐵: { jyutping: 'tit3', tone: 3, meaning: 'Railway / MTR' },
  車: { jyutping: 'ce1', tone: 1, meaning: 'Vehicle / Car / Train' },
  站: { jyutping: 'zaam6', tone: 6, meaning: 'Station / Stop' },
  往: { jyutping: 'wong5', tone: 5, meaning: 'Towards' },
  中: { jyutping: 'zung1', tone: 1, meaning: 'Middle / Central' },
  環: { jyutping: 'waan4', tone: 4, meaning: 'Ring / Central' },
  尖: { jyutping: 'zim1', tone: 1, meaning: 'Point / Sharp' },
  沙: { jyutping: 'saa1', tone: 1, meaning: 'Sand' },
  咀: { jyutping: 'zeoi2', tone: 2, meaning: 'Mouth / Tsim Sha Tsui' },
  旺: { jyutping: 'wong6', tone: 6, meaning: 'Prosperous / Mong Kok' },
  角: { jyutping: 'gok3', tone: 3, meaning: 'Corner' },
  巴: { jyutping: 'baa1', tone: 1, meaning: 'Bus (prefix)' },
  士: { jyutping: 'si2', tone: 2, meaning: 'Bus / Taxi (suffix)' },
  的: { jyutping: 'dik1', tone: 1, meaning: 'Taxi (prefix)' },
  船: { jyutping: 'syun4', tone: 4, meaning: 'Ferry / Boat' },
  月: { jyutping: 'jyut6', tone: 6, meaning: 'Moon / Platform' },
  台: { jyutping: 'toi4', tone: 4, meaning: 'Platform' },
  票: { jyutping: 'piu3', tone: 3, meaning: 'Ticket' },
  卡: { jyutping: 'kaat1', tone: 1, meaning: 'Card' },
  八: { jyutping: 'baat3', tone: 3, meaning: 'Eight' },
  達: { jyutping: 'daat6', tone: 6, meaning: 'Reach / Octopus' },
  通: { jyutping: 'tung1', tone: 1, meaning: 'Through / Octopus' },
  門: { jyutping: 'mun4', tone: 4, meaning: 'Door / Gate' },
  開: { jyutping: 'hoi1', tone: 1, meaning: 'Open' },
  關: { jyutping: 'gwaan1', tone: 1, meaning: 'Close' },
  勿: { jyutping: 'mat6', tone: 6, meaning: 'Do not' },
  緊: { jyutping: 'gan2', tone: 2, meaning: 'Tight / Progress' },

  // Street & Direction
  道: { jyutping: 'dou6', tone: 6, meaning: 'Avenue / Road' },
  街: { jyutping: 'gaai1', tone: 1, meaning: 'Street' },
  路: { jyutping: 'lou6', tone: 6, meaning: 'Road' },
  彌: { jyutping: 'nei4', tone: 4, meaning: 'Nathan prefix' },
  敦: { jyutping: 'deon1', tone: 1, meaning: 'Nathan suffix' },
  皇: { jyutping: 'wong4', tone: 4, meaning: 'Royal / King' },
  后: { jyutping: 'hau6', tone: 6, meaning: 'Queen / Behind' },
  大: { jyutping: 'daai6', tone: 6, meaning: 'Big / Great' },
  小: { jyutping: 'siu2', tone: 2, meaning: 'Small' },
  左: { jyutping: 'zo2', tone: 2, meaning: 'Left' },
  右: { jyutping: 'jau6', tone: 6, meaning: 'Right' },
  直: { jyutping: 'zik6', tone: 6, meaning: 'Straight' },
  行: { jyutping: 'haang4', tone: 4, meaning: 'Walk / Go' },
  轉: { jyutping: 'zyun3', tone: 3, meaning: 'Turn' },
  橋: { jyutping: 'kiu4', tone: 4, meaning: 'Bridge' },
  燈: { jyutping: 'dang1', tone: 1, meaning: 'Light / Traffic light' },
  紅: { jyutping: 'hung4', tone: 4, meaning: 'Red' },
  綠: { jyutping: 'luk6', tone: 6, meaning: 'Green' },

  // School & Learning
  校: { jyutping: 'haau6', tone: 6, meaning: 'School' },
  學: { jyutping: 'hok6', tone: 6, meaning: 'Study / Learn' },
  生: { jyutping: 'saang1', tone: 1, meaning: 'Student / Life' },
  老: { jyutping: 'lou5', tone: 5, meaning: 'Old / Senior' },
  師: { jyutping: 'si1', tone: 1, meaning: 'Teacher' },
  書: { jyutping: 'syu1', tone: 1, meaning: 'Book' },
  圖: { jyutping: 'tou4', tone: 4, meaning: 'Picture / Map' },
  館: { jyutping: 'gun2', tone: 2, meaning: 'Hall / Library' },
  堂: { jyutping: 'tong4', tone: 4, meaning: 'Hall / Lesson' },
  功: { jyutping: 'gung1', tone: 1, meaning: 'Work / Homework' },
  課: { jyutping: 'fo3', tone: 3, meaning: 'Class / Lesson' },
  息: { jyutping: 'sik1', tone: 1, meaning: 'Rest / Recess' },
  時: { jyutping: 'si4', tone: 4, meaning: 'Time' },
  間: { jyutping: 'gaan3', tone: 3, meaning: 'Interval / Time' },
  鐘: { jyutping: 'zung1', tone: 1, meaning: 'Clock / Bell' },
  準: { jyutping: 'zeon2', tone: 2, meaning: 'Accurate / On time' },
  筆: { jyutping: 'bat1', tone: 1, meaning: 'Pen / Pencil' },
  記: { jyutping: 'gei3', tone: 3, meaning: 'Note / Remember' },
  字: { jyutping: 'zi6', tone: 6, meaning: 'Character / Word' },
  音: { jyutping: 'jam1', tone: 1, meaning: 'Sound / Tone' },
  粵: { jyutping: 'jyut6', tone: 6, meaning: 'Cantonese / Yue' },
  拼: { jyutping: 'ping3', tone: 3, meaning: 'Pinyin / Spell' },
  話: { jyutping: 'waa6', tone: 6, meaning: 'Spoken language / Talk' },
  文: { jyutping: 'man4', tone: 4, meaning: 'Language / Writing' },

  // Supermarket & Shopping
  新: { jyutping: 'san1', tone: 1, meaning: 'New' },
  鮮: { jyutping: 'sin1', tone: 1, meaning: 'Fresh' },
  蘋: { jyutping: 'ping4', tone: 4, meaning: 'Apple (prefix)' },
  果: { jyutping: 'gwo2', tone: 2, meaning: 'Fruit' },
  橙: { jyutping: 'caang2', tone: 2, meaning: 'Orange' },
  香: { jyutping: 'hoeng1', tone: 1, meaning: 'Fragrant / Hong Kong' },
  蕉: { jyutping: 'ziu1', tone: 1, meaning: 'Banana' },
  菜: { jyutping: 'coi3', tone: 3, meaning: 'Vegetable / Dish' },
  減: { jyutping: 'gaam2', tone: 2, meaning: 'Reduce / Minus' },
  價: { jyutping: 'gaa3', tone: 3, meaning: 'Price' },
  特: { jyutping: 'dak6', tone: 6, meaning: 'Special' },
  惠: { jyutping: 'wai6', tone: 6, meaning: 'Benefit / Favor' },
  錢: { jyutping: 'cin2', tone: 2, meaning: 'Money' },
  幾: { jyutping: 'gei2', tone: 2, meaning: 'How many / How much' },
  找: { jyutping: 'zaau2', tone: 2, meaning: 'Change / Seek' },
  單: { jyutping: 'daan1', tone: 1, meaning: 'Bill / Receipt' },
  袋: { jyutping: 'doi2', tone: 2, meaning: 'Bag' },
  自: { jyutping: 'zi6', tone: 6, meaning: 'Self' },
  助: { jyutping: 'zo6', tone: 6, meaning: 'Assist / Help' },
  付: { jyutping: 'fu6', tone: 6, meaning: 'Pay' },
  款: { jyutping: 'fun2', tone: 2, meaning: 'Payment / Sum' },

  // Numbers 0 to 10
  零: { jyutping: 'ling4', tone: 4, meaning: 'Zero' },
  一: { jyutping: 'jat1', tone: 1, meaning: 'One' },
  二: { jyutping: 'ji6', tone: 6, meaning: 'Two' },
  兩: { jyutping: 'loeng5', tone: 5, meaning: 'Two (count)' },
  三: { jyutping: 'saam1', tone: 1, meaning: 'Three' },
  四: { jyutping: 'sei3', tone: 3, meaning: 'Four' },
  五: { jyutping: 'ng5', tone: 5, meaning: 'Five' },
  六: { jyutping: 'luk6', tone: 6, meaning: 'Six' },
  七: { jyutping: 'cat1', tone: 1, meaning: 'Seven' },
  九: { jyutping: 'gau2', tone: 2, meaning: 'Nine' },
  十: { jyutping: 'sap6', tone: 6, meaning: 'Ten' },
  百: { jyutping: 'baak3', tone: 3, meaning: 'Hundred' },
  千: { jyutping: 'cin1', tone: 1, meaning: 'Thousand' },
  萬: { jyutping: 'maan6', tone: 6, meaning: 'Ten thousand' },

  // Tones test chars
  詩: { jyutping: 'si1', tone: 1, meaning: 'Poem' },
  史: { jyutping: 'si2', tone: 2, meaning: 'History' },
  試: { jyutping: 'si3', tone: 3, meaning: 'Try / Test' },
  市: { jyutping: 'si5', tone: 5, meaning: 'Market / City' },
  事: { jyutping: 'si6', tone: 6, meaning: 'Matter / Affair' },
};

// Known common phrases with detailed breakdown and everyday notes
export const COMMON_PHRASES: Record<string, Partial<DetectedWord>> = {
  早晨: {
    chinese: '早晨',
    jyutping: 'zou2 san4',
    english: 'Good morning',
    category: 'Social & People',
    colloquialNote: 'The universal Hong Kong friendly greeting said to teachers, classmates, and neighbors!',
    exampleSentence: {
      chinese: '陳老師，早晨！',
      jyutping: 'can4 lou5 si1, zou2 san4!',
      english: 'Good morning, Teacher Chan!',
    },
  },
  唔該: {
    chinese: '唔該',
    jyutping: 'm4 goi1',
    english: 'Please / Thank you (for services)',
    category: 'Social & People',
    colloquialNote: 'Use "唔該" when asking someone for help or receiving a service (like waiters or bus drivers). For gifts, use "多謝"!',
    exampleSentence: {
      chinese: '唔該，我想買一張八達通。',
      jyutping: 'm4 goi1, ngo5 soeng2 maai5 jat1 zoeng1 baat3 daat6 tung1.',
      english: 'Excuse me, I would like to buy an Octopus card.',
    },
  },
  多謝: {
    chinese: '多謝',
    jyutping: 'do1 ze6',
    english: 'Thank you very much (for gifts / compliments)',
    category: 'Social & People',
    colloquialNote: 'Used specifically when receiving a gift, discount, or compliment.',
    exampleSentence: {
      chinese: '多謝你嘅禮物！',
      jyutping: 'do1 ze6 nei5 ge3 lai5 mat6!',
      english: 'Thank you for your gift!',
    },
  },
  凍檸茶: {
    chinese: '凍檸茶',
    jyutping: 'dung3 ning4 caa4',
    english: 'Iced Lemon Tea (HK iconic drink)',
    category: 'Food & Dining',
    colloquialNote: 'Hong Kong staple! Often ordered with "少甜" (siu2 tim4 - less sweet).',
    exampleSentence: {
      chinese: '唔該一杯凍檸茶，少甜！',
      jyutping: 'm4 goi1 jat1 bui1 dung3 ning4 caa4, siu2 tim4!',
      english: 'One iced lemon tea please, less sweet!',
    },
  },
  雲吞麵: {
    chinese: '雲吞麵',
    jyutping: 'wan4 tan1 min6',
    english: 'Wonton Noodles',
    category: 'Food & Dining',
    colloquialNote: 'Shrimp dumplings served over springy egg noodles in hot soup.',
    exampleSentence: {
      chinese: '我要一碗熱騰騰嘅雲吞麵。',
      jyutping: 'ngo5 jiu3 jat1 wun2 jit6 tang4 tang4 ge3 wan4 tan1 min6.',
      english: 'I want a piping hot bowl of wonton noodles.',
    },
  },
  菠蘿油: {
    chinese: '菠蘿油',
    jyutping: 'bo1 lo4 jau4',
    english: 'Pineapple Bun with Butter',
    category: 'Food & Dining',
    colloquialNote: 'Warm sweet crusted bun with a thick slab of cold salted butter inside.',
    exampleSentence: {
      chinese: '下晝茶食個菠蘿油最舒服！',
      jyutping: 'haa6 zau3 caa4 sik6 go3 bo1 lo4 jau4 zeoi3 syu1 fuk6!',
      english: 'Having a pineapple bun with butter for afternoon tea is wonderful!',
    },
  },
  出口: {
    chinese: '出口',
    jyutping: 'ceot1 hau2',
    english: 'Exit / Way out',
    category: 'Transport & Directions',
    colloquialNote: 'Essential word for MTR stations and buildings in Hong Kong.',
    exampleSentence: {
      chinese: '我哋喺 A 出口集合。',
      jyutping: 'ngo5 dei6 hai2 ei1 ceot1 hau2 zaap6 hap6.',
      english: "Let's gather at Exit A.",
    },
  },
  彌敦道: {
    chinese: '彌敦道',
    jyutping: 'nei4 deon1 dou6',
    english: 'Nathan Road',
    category: 'Transport & Directions',
    colloquialNote: 'Major thoroughfare in Kowloon stretching from Tsim Sha Tsui to Sham Shui Po.',
    exampleSentence: {
      chinese: '沿住彌敦道一直行就到。',
      jyutping: 'jyun4 zyu6 nei4 deon1 dou6 jat1 zik6 haang4 zau6 dou3.',
      english: 'Just walk straight along Nathan Road and you will arrive.',
    },
  },
  圖書館: {
    chinese: '圖書館',
    jyutping: 'tou4 syu1 gun2',
    english: 'Library',
    category: 'School & Campus',
    colloquialNote: 'Quiet public or school space for studying and borrowing books.',
    exampleSentence: {
      chinese: '放學後我去圖書館溫習。',
      jyutping: 'fong3 hok6 hau6 ngo5 heoi3 tou4 syu1 gun2 wan1 zaap6.',
      english: 'After school I will go to the library to study.',
    },
  },
  幾多錢: {
    chinese: '幾多錢',
    jyutping: 'gei2 do1 cin2',
    english: 'How much does it cost?',
    category: 'Daily Life & Shopping',
    colloquialNote: 'Must-know shopping phrase in Hong Kong markets and stores.',
    exampleSentence: {
      chinese: '老闆，呢個幾多錢呀？',
      jyutping: 'lou5 baan2, ni1 go3 gei2 do1 cin2 aa3?',
      english: 'Boss, how much is this one?',
    },
  },
  唔該借借: {
    chinese: '唔該借借',
    jyutping: 'm4 goi1 ze3 ze3',
    english: 'Excuse me, please let me pass',
    category: 'Daily Life & Shopping',
    colloquialNote: 'Very polite phrase used when moving through crowded MTR cars or busy sidewalks.',
    exampleSentence: {
      chinese: '唔該借借，我要落車！',
      jyutping: 'm4 goi1 ze3 ze3, ngo5 jiu3 lok6 ce1!',
      english: 'Excuse me please, I need to get off the train!',
    },
  },
};

/**
 * Break down any Chinese text into character-by-character Jyutping and tones
 */
export function convertTextToJyutpingLocally(text: string): DetectedWord {
  const clean = text.trim();

  // Check known phrase first
  if (COMMON_PHRASES[clean]) {
    const phrase = COMMON_PHRASES[clean];
    const characters: CharacterBreakdown[] = [];
    for (const char of clean) {
      const item = CHAR_DICT[char] || {
        jyutping: 'zi6',
        tone: 6,
        meaning: 'Character',
      };
      characters.push({
        char,
        jyutping: item.jyutping,
        tone: item.tone,
        toneName: TONE_NAMES[item.tone] || `Tone ${item.tone}`,
        meaning: item.meaning,
      });
    }

    return {
      chinese: clean,
      jyutping: phrase.jyutping || characters.map((c) => c.jyutping).join(' '),
      english: phrase.english || 'Hong Kong Daily Phrase',
      category: phrase.category || 'Daily Life & Shopping',
      colloquialNote: phrase.colloquialNote,
      characters,
      exampleSentence: phrase.exampleSentence,
    };
  }

  // General character-by-character decomposition
  const characters: CharacterBreakdown[] = [];
  const jyutpingParts: string[] = [];

  for (const char of clean) {
    // Skip punctuation / spaces
    if (/[\s,.?!，。？！、\-]/.test(char)) continue;

    const entry = CHAR_DICT[char];
    if (entry) {
      characters.push({
        char,
        jyutping: entry.jyutping,
        tone: entry.tone,
        toneName: TONE_NAMES[entry.tone] || `Tone ${entry.tone}`,
        meaning: entry.meaning,
      });
      jyutpingParts.push(entry.jyutping);
    } else {
      // Fallback phonetic estimation
      characters.push({
        char,
        jyutping: 'zi6',
        tone: 6,
        toneName: TONE_NAMES[6],
        meaning: 'Character',
      });
      jyutpingParts.push('zi6');
    }
  }

  return {
    chinese: clean,
    jyutping: jyutpingParts.join(' '),
    english: 'Cantonese phrase / vocabulary',
    category: 'Daily Life & Shopping',
    colloquialNote: 'This phrase can be practiced with the 6 tones and spoken Cantonese voice demonstration.',
    characters,
    exampleSentence: {
      chinese: `${clean}，好實用嘅廣東話！`,
      jyutping: `${jyutpingParts.join(' ')}, hou2 sat6 jung6 ge3 gwong2 dung1 waa2!`,
      english: `${clean}, very practical Cantonese!`,
    },
  };
}
