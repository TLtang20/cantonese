import { PhotoAnalysisResult } from '../types';

export interface SamplePhoto {
  id: string;
  nameZh: string;
  nameEn: string;
  badge: string;
  category: string;
  svgDataUrl: string;
  analysis: PhotoAnalysisResult;
}

// Generate realistic HK styled SVG mock image data URLs
function createHkStreetSignSvg(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
    <defs>
      <linearGradient id="sky" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#38bdf8"/>
        <stop offset="100%" stop-color="#bae6fd"/>
      </linearGradient>
      <linearGradient id="greenSign" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#047857"/>
        <stop offset="100%" stop-color="#065f46"/>
      </linearGradient>
    </defs>
    <rect width="800" height="600" fill="url(#sky)"/>
    <!-- Buildings background -->
    <rect x="50" y="80" width="160" height="520" fill="#cbd5e1" opacity="0.8"/>
    <rect x="230" y="140" width="200" height="460" fill="#94a3b8" opacity="0.7"/>
    <rect x="460" y="100" width="180" height="500" fill="#cbd5e1" opacity="0.8"/>
    <!-- Hong Kong Street Sign Post -->
    <rect x="385" y="240" width="30" height="360" fill="#64748b"/>
    <!-- HK Green/White Street Sign -->
    <g transform="translate(180, 160)">
      <rect width="440" height="150" rx="16" fill="#ffffff" stroke="#0f172a" stroke-width="8"/>
      <rect x="12" y="12" width="416" height="126" rx="10" fill="url(#greenSign)"/>
      <text x="220" y="65" font-family="'Noto Sans TC', sans-serif" font-size="44" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="4">彌敦道</text>
      <text x="220" y="108" font-family="Arial, sans-serif" font-size="26" font-weight="bold" fill="#ffffff" text-anchor="middle" letter-spacing="2">NATHAN ROAD</text>
    </g>
    <!-- Speed sign -->
    <circle cx="210" cy="380" r="45" fill="#ffffff" stroke="#ef4444" stroke-width="12"/>
    <text x="210" y="392" font-family="Arial" font-size="34" font-weight="900" fill="#0f172a" text-anchor="middle">50</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function createCafeMenuSvg(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
    <defs>
      <linearGradient id="wood" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#fffbeb"/>
        <stop offset="100%" stop-color="#fef3c7"/>
      </linearGradient>
    </defs>
    <rect width="800" height="600" fill="#f8fafc"/>
    <!-- Menu Board -->
    <rect x="100" y="40" width="600" height="520" rx="20" fill="url(#wood)" stroke="#d97706" stroke-width="6"/>
    <!-- Header -->
    <rect x="140" y="70" width="520" height="70" rx="12" fill="#b45309"/>
    <text x="400" y="118" font-family="'Noto Sans TC', sans-serif" font-size="36" font-weight="bold" fill="#fef3c7" text-anchor="middle">金記冰室 • 精選常餐</text>
    <!-- Menu items -->
    <g transform="translate(150, 180)">
      <circle cx="25" cy="20" r="12" fill="#d97706"/>
      <text x="55" y="28" font-family="'Noto Sans TC', sans-serif" font-size="30" font-weight="bold" fill="#1e293b">凍檸茶</text>
      <text x="440" y="28" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="#b45309">$22</text>
    </g>
    <g transform="translate(150, 270)">
      <circle cx="25" cy="20" r="12" fill="#d97706"/>
      <text x="55" y="28" font-family="'Noto Sans TC', sans-serif" font-size="30" font-weight="bold" fill="#1e293b">雲吞麵</text>
      <text x="440" y="28" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="#b45309">$45</text>
    </g>
    <g transform="translate(150, 360)">
      <circle cx="25" cy="20" r="12" fill="#d97706"/>
      <text x="55" y="28" font-family="'Noto Sans TC', sans-serif" font-size="30" font-weight="bold" fill="#1e293b">菠蘿油</text>
      <text x="440" y="28" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="#b45309">$18</text>
    </g>
    <!-- Footnote -->
    <text x="400" y="490" font-family="'Noto Sans TC', sans-serif" font-size="20" fill="#64748b" text-anchor="middle">多謝惠顧 • 熱飲減$3</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function createMtrSignSvg(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
    <rect width="800" height="600" fill="#0f172a"/>
    <!-- MTR overhead sign panel -->
    <rect x="60" y="100" width="680" height="220" rx="16" fill="#1e293b" stroke="#334155" stroke-width="4"/>
    <!-- Exit symbol yellow square -->
    <rect x="90" y="130" width="160" height="160" rx="14" fill="#fbbf24"/>
    <text x="170" y="200" font-family="'Noto Sans TC', sans-serif" font-size="42" font-weight="900" fill="#0f172a" text-anchor="middle">出口</text>
    <text x="170" y="250" font-family="Arial, sans-serif" font-size="30" font-weight="bold" fill="#0f172a" text-anchor="middle">Exit A</text>
    <!-- Direction sign -->
    <g transform="translate(290, 150)">
      <text x="0" y="45" font-family="'Noto Sans TC', sans-serif" font-size="40" font-weight="bold" fill="#ffffff">往中環</text>
      <text x="0" y="85" font-family="Arial, sans-serif" font-size="24" fill="#94a3b8">To Central</text>
      <!-- Red line pill -->
      <rect x="0" y="105" width="220" height="12" rx="6" fill="#ef4444"/>
    </g>
    <!-- Warning sign -->
    <rect x="140" y="380" width="520" height="120" rx="14" fill="#ffffff"/>
    <circle cx="210" cy="440" r="38" fill="#fee2e2" stroke="#dc2626" stroke-width="6"/>
    <path d="M190 440 L230 440" stroke="#dc2626" stroke-width="6"/>
    <text x="270" y="430" font-family="'Noto Sans TC', sans-serif" font-size="32" font-weight="bold" fill="#dc2626">請勿飲食</text>
    <text x="270" y="465" font-family="Arial, sans-serif" font-size="20" fill="#475569">No Eating or Drinking</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function createSupermarketSvg(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
    <rect width="800" height="600" fill="#f1f5f9"/>
    <!-- Fresh fruit stand -->
    <rect x="80" y="60" width="640" height="480" rx="16" fill="#ffffff" stroke="#e2e8f0" stroke-width="4"/>
    <!-- Store Banner -->
    <rect x="120" y="90" width="560" height="70" rx="10" fill="#15803d"/>
    <text x="400" y="138" font-family="'Noto Sans TC', sans-serif" font-size="34" font-weight="bold" fill="#ffffff" text-anchor="middle">惠康超市 • 新鮮蔬果專區</text>
    <!-- Product Tag 1 -->
    <g transform="translate(130, 200)">
      <rect width="250" height="140" rx="12" fill="#fef2f2" stroke="#f87171" stroke-width="3"/>
      <text x="125" y="55" font-family="'Noto Sans TC', sans-serif" font-size="32" font-weight="bold" fill="#b91c1c" text-anchor="middle">新鮮蘋果</text>
      <text x="125" y="90" font-family="Arial" font-size="18" fill="#7f1d1d" text-anchor="middle">Fresh Apples</text>
      <text x="125" y="122" font-family="Arial" font-size="24" font-weight="bold" fill="#dc2626" text-anchor="middle">$15 / 3個</text>
    </g>
    <!-- Product Tag 2 -->
    <g transform="translate(420, 200)">
      <rect width="250" height="140" rx="12" fill="#ecfdf5" stroke="#34d399" stroke-width="3"/>
      <text x="125" y="55" font-family="'Noto Sans TC', sans-serif" font-size="32" font-weight="bold" fill="#047857" text-anchor="middle">有機香蕉</text>
      <text x="125" y="90" font-family="Arial" font-size="18" fill="#064e3b" text-anchor="middle">Organic Bananas</text>
      <text x="125" y="122" font-family="Arial" font-size="24" font-weight="bold" fill="#059669" text-anchor="middle">$12 / 磅</text>
    </g>
    <!-- Checkout sign -->
    <rect x="130" y="380" width="540" height="100" rx="12" fill="#eff6ff" stroke="#3b82f6" stroke-width="3"/>
    <text x="400" y="425" font-family="'Noto Sans TC', sans-serif" font-size="28" font-weight="bold" fill="#1d4ed8" text-anchor="middle">自助付款通道 (八達通 / 信用卡)</text>
    <text x="400" y="460" font-family="Arial" font-size="18" fill="#3b82f6" text-anchor="middle">Self-Service Checkout (Octopus / Cards)</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const SAMPLE_PHOTOS: SamplePhoto[] = [
  {
    id: 'cafe-menu',
    nameZh: '茶餐廳點餐 (Hong Kong Cafe Menu)',
    nameEn: 'Cha Chaan Teng Menu',
    badge: '飲食 Food',
    category: 'Food & Dining',
    svgDataUrl: createCafeMenuSvg(),
    analysis: {
      title: '茶餐廳精選常餐 (Cha Chaan Teng Menu)',
      sceneSummary: 'This is a typical menu board from a Hong Kong Cha Chaan Teng (茶餐廳). Non-Chinese speaking students can learn how to order the most popular local drinks and dishes!',
      culturalTips: [
        'When ordering iced lemon tea (凍檸茶), you can ask for "少甜" (siu2 tim4 - less sweet) or "走甜" (zau2 tim4 - unsweetened).',
        'Use the spoon to gently poke the fresh lemon slices to release the tangy citrus flavor into your tea!',
        'Hot drinks are usually $3 cheaper than cold drinks in Hong Kong diners.',
      ],
      detectedTexts: [
        {
          chinese: '凍檸茶',
          jyutping: 'dung3 ning4 caa4',
          english: 'Iced Lemon Tea (HK iconic beverage)',
          category: 'Food & Dining',
          colloquialNote: 'The ultimate Hong Kong diner drink! Often written colloquially as "0T" on handwritten receipts.',
          characters: [
            { char: '凍', jyutping: 'dung3', tone: 3, toneName: 'Tone 3 (陰去 - Mid Level 33)', meaning: 'Cold / Iced' },
            { char: '檸', jyutping: 'ning4', tone: 4, toneName: 'Tone 4 (陽平 - Low Falling 21)', meaning: 'Lemon (short for 檸檬 ning4 mung1)' },
            { char: '茶', jyutping: 'caa4', tone: 4, toneName: 'Tone 4 (陽平 - Low Falling 21)', meaning: 'Tea' },
          ],
          exampleSentence: {
            chinese: '唔該一杯凍檸茶，少甜！',
            jyutping: 'm4 goi1 jat1 bui1 dung3 ning4 caa4, siu2 tim4!',
            english: 'Please give me one iced lemon tea, less sweet!',
          },
        },
        {
          chinese: '雲吞麵',
          jyutping: 'wan4 tan1 min6',
          english: 'Wonton Noodles',
          category: 'Food & Dining',
          colloquialNote: 'Traditional HK wonton noodles feature plump shrimp wrapped in thin skin in savory broth.',
          characters: [
            { char: '雲', jyutping: 'wan4', tone: 4, toneName: 'Tone 4 (陽平 - Low Falling 21)', meaning: 'Cloud' },
            { char: '吞', jyutping: 'tan1', tone: 1, toneName: 'Tone 1 (陰平 - High Level 55)', meaning: 'Swallow' },
            { char: '麵', jyutping: 'min6', tone: 6, toneName: 'Tone 6 (陽去 - Low Level 22)', meaning: 'Noodles' },
          ],
          exampleSentence: {
            chinese: '我要一碗細雲吞麵。',
            jyutping: 'ngo5 jiu3 jat1 wun2 sai3 wan4 tan1 min6.',
            english: 'I would like a small bowl of wonton noodles.',
          },
        },
        {
          chinese: '菠蘿油',
          jyutping: 'bo1 lo4 jau4',
          english: 'Pineapple Bun with Butter',
          category: 'Food & Dining',
          colloquialNote: 'Hot crispy pineapple bun stuffed with a thick slice of cold fresh butter. Sweet and salty heaven!',
          characters: [
            { char: '菠', jyutping: 'bo1', tone: 1, toneName: 'Tone 1 (陰平 - High Level 55)', meaning: 'Pineapple prefix' },
            { char: '蘿', jyutping: 'lo4', tone: 4, toneName: 'Tone 4 (陽平 - Low Falling 21)', meaning: 'Pineapple suffix' },
            { char: '油', jyutping: 'jau4', tone: 4, toneName: 'Tone 4 (陽平 - Low Falling 21)', meaning: 'Butter / Oil (牛油 ngau4 jau4)' },
          ],
          exampleSentence: {
            chinese: '個菠蘿油熱辣辣，好好食！',
            jyutping: 'go3 bo1 lo4 jau4 jit6 laat6 laat6, hou2 hou2 sik6!',
            english: 'This pineapple bun with butter is piping hot and delicious!',
          },
        },
        {
          chinese: '多謝惠顧',
          jyutping: 'do1 ze6 wai6 gu3',
          english: 'Thank you for your patronage!',
          category: 'Signs & Notices',
          colloquialNote: 'Polite formal phrase printed on receipts and shop signs across Hong Kong.',
          characters: [
            { char: '多', jyutping: 'do1', tone: 1, toneName: 'Tone 1 (陰平 - High Level 55)', meaning: 'Much / Many' },
            { char: '謝', jyutping: 'ze6', tone: 6, toneName: 'Tone 6 (陽去 - Low Level 22)', meaning: 'Thanks / Gratitude' },
            { char: '惠', jyutping: 'wai6', tone: 6, toneName: 'Tone 6 (陽去 - Low Level 22)', meaning: 'Favor / Benefit' },
            { char: '顧', jyutping: 'gu3', tone: 3, toneName: 'Tone 3 (陰去 - Mid Level 33)', meaning: 'Visit / Customer' },
          ],
          exampleSentence: {
            chinese: '多謝惠顧，歡迎下次再來！',
            jyutping: 'do1 ze6 wai6 gu3, fun1 jing4 haa6 ci3 zoi3 lai4!',
            english: 'Thank you for your visit, please come again next time!',
          },
        },
      ],
    },
  },
  {
    id: 'mtr-signs',
    nameZh: '港鐵車站指示 (MTR Station & Exits)',
    nameEn: 'MTR Subway Signage',
    badge: '交通 Transport',
    category: 'Transport & Directions',
    svgDataUrl: createMtrSignSvg(),
    analysis: {
      title: '港鐵車站出入口與乘車指示 (MTR Station Direction Signs)',
      sceneSummary: 'Essential directional signs seen every day on the Hong Kong MTR network, showing exits, train destinations, and passenger notices.',
      culturalTips: [
        'The Hong Kong MTR uses letters (A, B, C...) for exits. If meeting friends, specify the exact exit letter!',
        'No eating or drinking is strictly enforced inside paid MTR areas (請勿飲食).',
        'Stand on the right side of escalators to allow rushing commuters to walk on the left.',
      ],
      detectedTexts: [
        {
          chinese: '出口',
          jyutping: 'ceot1 hau2',
          english: 'Exit / Way out',
          category: 'Transport & Directions',
          colloquialNote: 'Vital word for finding your way anywhere in HK subway stations and shopping malls.',
          characters: [
            { char: '出', jyutping: 'ceot1', tone: 1, toneName: 'Tone 1 (陰平 - High Level 55)', meaning: 'Go out / Exit' },
            { char: '口', jyutping: 'hau2', tone: 2, toneName: 'Tone 2 (陰上 - High Rising 35)', meaning: 'Opening / Mouth' },
          ],
          exampleSentence: {
            chinese: '我哋喺 A 出口等啦！',
            jyutping: 'ngo5 dei6 hai2 ei1 ceot1 hau2 dang2 laa1!',
            english: "Let's wait at Exit A!",
          },
        },
        {
          chinese: '往中環',
          jyutping: 'wong5 zung1 waan4',
          english: 'Towards Central',
          category: 'Transport & Directions',
          colloquialNote: '"往" (wong5) means towards / bound for. Central is the financial hub on HK Island.',
          characters: [
            { char: '往', jyutping: 'wong5', tone: 5, toneName: 'Tone 5 (陽上 - Low Rising 23)', meaning: 'Towards / Bound for' },
            { char: '中', jyutping: 'zung1', tone: 1, toneName: 'Tone 1 (陰平 - High Level 55)', meaning: 'Center' },
            { char: '環', jyutping: 'waan4', tone: 4, toneName: 'Tone 4 (陽平 - Low Falling 21)', meaning: 'Ring / Central district' },
          ],
          exampleSentence: {
            chinese: '下一班車係往中環方向。',
            jyutping: 'haa6 jat1 baan1 ce1 hai6 wong5 zung1 waan4 fong1 hoeng3.',
            english: 'The next train is heading in the direction of Central.',
          },
        },
        {
          chinese: '請勿飲食',
          jyutping: 'cing2 mat6 jam2 sik6',
          english: 'Please do not eat or drink',
          category: 'Signs & Notices',
          colloquialNote: 'Notice posted at all MTR turnstiles and carriages to keep the train system clean.',
          characters: [
            { char: '請', jyutping: 'cing2', tone: 2, toneName: 'Tone 2 (陰上 - High Rising 35)', meaning: 'Please' },
            { char: '勿', jyutping: 'mat6', tone: 6, toneName: 'Tone 6 (陽去 - Low Level 22)', meaning: 'Do not' },
            { char: '飲', jyutping: 'jam2', tone: 2, toneName: 'Tone 2 (陰上 - High Rising 35)', meaning: 'Drink' },
            { char: '食', jyutping: 'sik6', tone: 6, toneName: 'Tone 6 (陽去 - Low Level 22)', meaning: 'Eat' },
          ],
          exampleSentence: {
            chinese: '入到月台請勿飲食。',
            jyutping: 'jap6 dou3 jyut6 toi4 cing2 mat6 jam2 sik6.',
            english: 'Please do not eat or drink once you enter the platform.',
          },
        },
      ],
    },
  },
  {
    id: 'street-sign',
    nameZh: '香港街頭路牌 (Nathan Road Street Sign)',
    nameEn: 'HK Street Signboard',
    badge: '日常 Daily Life',
    category: 'Daily Life & Shopping',
    svgDataUrl: createHkStreetSignSvg(),
    analysis: {
      title: '香港街道名牌：彌敦道 (Nathan Road Street Sign)',
      sceneSummary: 'The iconic green-and-white Hong Kong bilingual street signs found on every corner, representing the cultural history of the city.',
      culturalTips: [
        'Nathan Road (彌敦道) runs from Tsim Sha Tsui all the way north to Sham Shui Po, often nicknamed the "Golden Mile".',
        '"道" (dou6) is used for major avenues and boulevards, while "街" (gaai1) is used for standard streets.',
      ],
      detectedTexts: [
        {
          chinese: '彌敦道',
          jyutping: 'nei4 deon1 dou6',
          english: 'Nathan Road (Famous major avenue in Kowloon)',
          category: 'Transport & Directions',
          colloquialNote: 'Named after Sir Matthew Nathan, a former Governor of Hong Kong in the early 1900s.',
          characters: [
            { char: '彌', jyutping: 'nei4', tone: 4, toneName: 'Tone 4 (陽平 - Low Falling 21)', meaning: 'Nathan prefix (phonetic)' },
            { char: '敦', jyutping: 'deon1', tone: 1, toneName: 'Tone 1 (陰平 - High Level 55)', meaning: 'Nathan suffix (phonetic)' },
            { char: '道', jyutping: 'dou6', tone: 6, toneName: 'Tone 6 (陽去 - Low Level 22)', meaning: 'Road / Avenue' },
          ],
          exampleSentence: {
            chinese: '我哋喺彌敦道等巴士啦。',
            jyutping: 'ngo5 dei6 hai2 nei4 deon1 dou6 dang2 baa1 si2 laa1.',
            english: "Let's wait for the bus on Nathan Road.",
          },
        },
      ],
    },
  },
  {
    id: 'supermarket',
    nameZh: '超市蔬果特惠 (Supermarket Produce & Checkout)',
    nameEn: 'Supermarket Groceries',
    badge: '購物 Shopping',
    category: 'Daily Life & Shopping',
    svgDataUrl: createSupermarketSvg(),
    analysis: {
      title: '超級市場蔬果與自助結帳 (Supermarket Produce & Self-Checkout)',
      sceneSummary: 'Everyday shopping labels and instructions at local supermarkets like Wellcome (惠康) and PARKnSHOP (百佳).',
      culturalTips: [
        'Supermarkets in HK charge a small statutory plastic bag levy ($1 HKD), so bring your own reusable bag (自備環保袋 zi6 bei6 waan4 bou2 doi2)!',
        'Octopus card (八達通) is the fastest payment method in Hong Kong supermarkets.',
      ],
      detectedTexts: [
        {
          chinese: '新鮮蘋果',
          jyutping: 'san1 sin1 ping4 gwo2',
          english: 'Fresh Apples',
          category: 'Daily Life & Shopping',
          colloquialNote: '"新鮮" (san1 sin1) is used everywhere for fresh food, fruits, and bakery goods.',
          characters: [
            { char: '新', jyutping: 'san1', tone: 1, toneName: 'Tone 1 (陰平 - High Level 55)', meaning: 'New' },
            { char: '鮮', jyutping: 'sin1', tone: 1, toneName: 'Tone 1 (陰平 - High Level 55)', meaning: 'Fresh' },
            { char: '蘋', jyutping: 'ping4', tone: 4, toneName: 'Tone 4 (陽平 - Low Falling 21)', meaning: 'Apple (prefix)' },
            { char: '果', jyutping: 'gwo2', tone: 2, toneName: 'Tone 2 (陰上 - High Rising 35)', meaning: 'Fruit' },
          ],
          exampleSentence: {
            chinese: '呢啲蘋果好新鮮又好甜！',
            jyutping: 'ni1 di1 ping4 gwo2 hou2 san1 sin1 jau6 hou2 tim4!',
            english: 'These apples are very fresh and sweet!',
          },
        },
        {
          chinese: '自助付款',
          jyutping: 'zi6 zo6 fu6 fun2',
          english: 'Self-Service Checkout / Payment',
          category: 'Daily Life & Shopping',
          colloquialNote: 'High tech self checkout stations found throughout Hong Kong supermarkets and convenience stores.',
          characters: [
            { char: '自', jyutping: 'zi6', tone: 6, toneName: 'Tone 6 (陽去 - Low Level 22)', meaning: 'Self' },
            { char: '助', jyutping: 'zo6', tone: 6, toneName: 'Tone 6 (陽去 - Low Level 22)', meaning: 'Assist / Help' },
            { char: '付', jyutping: 'fu6', tone: 6, toneName: 'Tone 6 (陽去 - Low Level 22)', meaning: 'Pay' },
            { char: '款', jyutping: 'fun2', tone: 2, toneName: 'Tone 2 (陰上 - High Rising 35)', meaning: 'Money / Sum' },
          ],
          exampleSentence: {
            chinese: '你可以去自助付款機拍八達通。',
            jyutping: 'nei5 ho2 ji5 heoi3 zi6 zo6 fu6 fun2 gei1 paak3 baat3 daat6 tung1.',
            english: 'You can go to the self-checkout kiosk to tap your Octopus card.',
          },
        },
      ],
    },
  },
];
