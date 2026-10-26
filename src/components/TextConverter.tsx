import React, { useState } from 'react';
import { Search, Sparkles, Volume2, ArrowRight, RefreshCw, Bookmark, BookmarkCheck } from 'lucide-react';
import { DetectedWord } from '../types';
import { WordCard } from './WordCard';

interface TextConverterProps {
  onSaveWord: (word: DetectedWord) => void;
  savedWordsMap: Record<string, boolean>;
  onOpenRecorder: (word: DetectedWord) => void;
}

const COMMON_NCS_PROMPTS = [
  '早晨 (Good morning)',
  '唔該借借 (Excuse me, please let me pass)',
  '呢個幾多錢？ (How much is this?)',
  '我想買外賣 (I want to order takeout)',
  '多謝你嘅幫忙 (Thank you for your help)',
  '我要搭港鐵 (I want to take the MTR)',
];

export const TextConverter: React.FC<TextConverterProps> = ({
  onSaveWord,
  savedWordsMap,
  onOpenRecorder,
}) => {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resultWord, setResultWord] = useState<DetectedWord | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleConvert = async (textToConvert = inputText) => {
    const trimmed = textToConvert.trim();
    if (!trimmed) return;

    setIsLoading(true);
    setErrorMsg(null);
    setResultWord(null);

    try {
      const response = await fetch('/api/convert-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: trimmed }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to convert text');
      }

      const data: DetectedWord = await response.json();
      setResultWord(data);
    } catch (err: any) {
      setErrorMsg(err.message || '查詢失敗，請再試一次。');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePromptClick = (promptWithEn: string) => {
    // Extract just the Chinese portion before the bracket
    const chinese = promptWithEn.split('(')[0].trim();
    setInputText(chinese);
    handleConvert(chinese);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-xs font-semibold text-indigo-700 mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>即時粵拼查詢 &amp; 發音工作室 (Custom Text to Jyutping)</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-2">
          輸入或粘貼任何中文字詞
        </h2>
        <p className="text-sm text-slate-500 max-w-xl mx-auto">
          遇上作業生字或街頭看見的字？輸入繁體中文或簡體字，即刻在字元下方生成標準粵拼與真人自然示範發音。
        </p>
      </div>

      {/* Input Form */}
      <div className="bg-white rounded-3xl p-6 border-2 border-slate-200/90 shadow-sm mb-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleConvert();
          }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <div className="relative flex-1">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="例如：凍檸茶、唔該、圖書館、香港..."
              className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 font-medium focus:bg-white focus:border-indigo-600 focus:outline-hidden transition-all text-base"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !inputText.trim()}
            className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-bold text-sm shadow-md transition-all active:scale-95"
          >
            {isLoading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <ArrowRight className="w-4 h-4" />
            )}
            <span>{isLoading ? '生成粵拼中...' : '生成粵拼與發音'}</span>
          </button>
        </form>

        {/* Quick prompt suggestions for NCS learners */}
        <div className="mt-4 pt-4 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-500 block mb-2">
            非華語常用生活句推薦 (Click to try):
          </span>
          <div className="flex flex-wrap gap-2">
            {COMMON_NCS_PROMPTS.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handlePromptClick(p)}
                className="text-xs bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 text-slate-700 px-3 py-1.5 rounded-xl border border-slate-200 transition-colors"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {errorMsg && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
            {errorMsg}
          </div>
        )}
      </div>

      {/* Result Display */}
      {resultWord && (
        <div className="animate-in fade-in duration-200">
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              查詢結果 (Character &amp; Jyutping Result):
            </span>
          </div>

          <WordCard
            word={resultWord}
            isSaved={!!savedWordsMap[resultWord.chinese]}
            onToggleSave={onSaveWord}
            onOpenRecorder={onOpenRecorder}
          />
        </div>
      )}
    </div>
  );
};
