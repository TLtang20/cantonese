import { ToneInfo } from '../types';

export const CANTONESE_TONES: ToneInfo[] = [
  {
    tone: 1,
    nameZh: '第1聲 陰平',
    nameEn: 'Tone 1: High Level',
    pitch: '55',
    pitchContour: [5, 5],
    descriptionEn: 'High, steady, flat pitch like singing a high "la".',
    mnemonicChar: '詩',
    mnemonicJyutping: 'si1',
    mnemonicMeaning: 'Poem',
    examples: [
      { char: '天', jyutping: 'tin1', meaning: 'Sky / Day' },
      { char: '三', jyutping: 'saam1', meaning: 'Three' },
      { char: '花', jyutping: 'faa1', meaning: 'Flower' },
      { char: '心', jyutping: 'sam1', meaning: 'Heart' },
    ],
  },
  {
    tone: 2,
    nameZh: '第2聲 陰上',
    nameEn: 'Tone 2: High Rising',
    pitch: '35',
    pitchContour: [3, 5],
    descriptionEn: 'Rises sharply from mid to high pitch, like asking "What?!" in surprise.',
    mnemonicChar: '史',
    mnemonicJyutping: 'si2',
    mnemonicMeaning: 'History',
    examples: [
      { char: '九', jyutping: 'gau2', meaning: 'Nine' },
      { char: '水', jyutping: 'seoi2', meaning: 'Water' },
      { char: '好', jyutping: 'hou2', meaning: 'Good' },
      { char: '點', jyutping: 'dim2', meaning: 'Point / How' },
    ],
  },
  {
    tone: 3,
    nameZh: '第3聲 陰去',
    nameEn: 'Tone 3: Mid Level',
    pitch: '33',
    pitchContour: [3, 3],
    descriptionEn: 'Steady, neutral pitch right in the middle of your vocal range.',
    mnemonicChar: '試',
    mnemonicJyutping: 'si3',
    mnemonicMeaning: 'Try / Test',
    examples: [
      { char: '四', jyutping: 'sei3', meaning: 'Four' },
      { char: '去', jyutping: 'heoi3', meaning: 'To go' },
      { char: '叫', jyutping: 'giu3', meaning: 'To call / order' },
      { char: '快', jyutping: 'faai3', meaning: 'Fast' },
    ],
  },
  {
    tone: 4,
    nameZh: '第4聲 陽平',
    nameEn: 'Tone 4: Low Falling',
    pitch: '21',
    pitchContour: [2, 1],
    descriptionEn: 'Starts low and drops lower, like a quiet disappointed sigh "oh...".',
    mnemonicChar: '時',
    mnemonicJyutping: 'si4',
    mnemonicMeaning: 'Time',
    examples: [
      { char: '零', jyutping: 'ling4', meaning: 'Zero' },
      { char: '門', jyutping: 'mun4', meaning: 'Door / Gate' },
      { char: '人', jyutping: 'jan4', meaning: 'Person' },
      { char: '茶', jyutping: 'caa4', meaning: 'Tea' },
    ],
  },
  {
    tone: 5,
    nameZh: '第5聲 陽上',
    nameEn: 'Tone 5: Low Rising',
    pitch: '23',
    pitchContour: [2, 3],
    descriptionEn: 'Starts low and gently lifts up to the middle level, like an inquisitive "huh?".',
    mnemonicChar: '市',
    mnemonicJyutping: 'si5',
    mnemonicMeaning: 'Market / City',
    examples: [
      { char: '五', jyutping: 'ng5', meaning: 'Five' },
      { char: '我', jyutping: 'ngo5', meaning: 'I / Me' },
      { char: '你', jyutping: 'nei5', meaning: 'You' },
      { char: '買', jyutping: 'maai5', meaning: 'To buy' },
    ],
  },
  {
    tone: 6,
    nameZh: '第6聲 陽去',
    nameEn: 'Tone 6: Low Level',
    pitch: '22',
    pitchContour: [2, 2],
    descriptionEn: 'Steady flat pitch at the bottom register of your voice.',
    mnemonicChar: '事',
    mnemonicJyutping: 'si6',
    mnemonicMeaning: 'Matter / Affair',
    examples: [
      { char: '二', jyutping: 'ji6', meaning: 'Two' },
      { char: '係', jyutping: 'hai6', meaning: 'To be / Yes' },
      { char: '食', jyutping: 'sik6', meaning: 'To eat' },
      { char: '話', jyutping: 'waa6', meaning: 'To say / language' },
    ],
  },
];

export const TONE_COLORS: Record<number, { bg: string; text: string; border: string; badge: string }> = {
  1: { bg: 'bg-red-50 text-red-700', text: 'text-red-600', border: 'border-red-300', badge: 'bg-red-600 text-white' },
  2: { bg: 'bg-amber-50 text-amber-700', text: 'text-amber-600', border: 'border-amber-300', badge: 'bg-amber-600 text-white' },
  3: { bg: 'bg-emerald-50 text-emerald-700', text: 'text-emerald-600', border: 'border-emerald-300', badge: 'bg-emerald-600 text-white' },
  4: { bg: 'bg-blue-50 text-blue-700', text: 'text-blue-600', border: 'border-blue-300', badge: 'bg-blue-600 text-white' },
  5: { bg: 'bg-purple-50 text-purple-700', text: 'text-purple-600', border: 'border-purple-300', badge: 'bg-purple-600 text-white' },
  6: { bg: 'bg-rose-50 text-rose-700', text: 'text-rose-600', border: 'border-rose-300', badge: 'bg-rose-600 text-white' },
};

export function getToneBadgeClass(tone: number): string {
  return TONE_COLORS[tone]?.badge || 'bg-slate-700 text-white';
}

export function getToneColor(tone: number) {
  return TONE_COLORS[tone] || { bg: 'bg-slate-50 text-slate-700', text: 'text-slate-600', border: 'border-slate-300', badge: 'bg-slate-700 text-white' };
}
