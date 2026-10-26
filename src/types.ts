export interface CharacterBreakdown {
  char: string;
  jyutping: string;
  tone: number;
  toneName: string;
  meaning: string;
}

export interface ExampleSentence {
  chinese: string;
  jyutping: string;
  english: string;
}

export interface DetectedWord {
  id?: string;
  chinese: string;
  jyutping: string;
  english: string;
  category?: string;
  characters: CharacterBreakdown[];
  colloquialNote?: string;
  exampleSentence?: ExampleSentence;
  savedAt?: number;
}

export interface PhotoAnalysisResult {
  title: string;
  sceneSummary: string;
  culturalTips?: string[];
  detectedTexts: DetectedWord[];
}

export interface ToneInfo {
  tone: number;
  nameZh: string;
  nameEn: string;
  pitch: string;
  pitchContour: number[]; // 5-level pitch values [start, end] or [start, mid, end]
  descriptionEn: string;
  mnemonicChar: string;
  mnemonicJyutping: string;
  mnemonicMeaning: string;
  examples: {
    char: string;
    jyutping: string;
    meaning: string;
  }[];
}

export type ActiveTab = 'scanner' | 'text-tool' | 'tone-guide' | 'notebook' | 'quiz';
