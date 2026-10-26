import React, { useState } from 'react';
import { Bookmark, Volume2, Trash2, RotateCw, Sparkles, BookOpen, Layers, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { DetectedWord } from '../types';
import { audioService } from '../services/audioService';
import { getToneBadgeClass } from '../data/toneData';
import { WordCard } from './WordCard';

interface VocabNotebookProps {
  savedWords: DetectedWord[];
  onRemoveWord: (chinese: string) => void;
  onClearAll: () => void;
  onAddDefaultStarters: () => void;
  onOpenRecorder: (word: DetectedWord) => void;
}

export const VocabNotebook: React.FC<VocabNotebookProps> = ({
  savedWords,
  onRemoveWord,
  onClearAll,
  onAddDefaultStarters,
  onOpenRecorder,
}) => {
  const [viewMode, setViewMode] = useState<'list' | 'flashcards'>('list');
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const categories = ['all', ...Array.from(new Set(savedWords.map((w) => w.category || 'Other')))];

  const filteredWords = savedWords.filter((w) => {
    if (filterCategory === 'all') return true;
    return (w.category || 'Other') === filterCategory;
  });

  const currentFlashcard = filteredWords[currentCardIndex] || null;

  const handleNextCard = () => {
    setIsFlipped(false);
    setCurrentCardIndex((prev) => (prev + 1) % filteredWords.length);
  };

  const handlePrevCard = () => {
    setIsFlipped(false);
    setCurrentCardIndex((prev) => (prev - 1 + filteredWords.length) % filteredWords.length);
  };

  const handleFlipCard = () => {
    setIsFlipped(!isFlipped);
    if (!isFlipped && currentFlashcard) {
      audioService.speak(currentFlashcard.chinese, 0.9);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            <h2 className="text-2xl font-black text-slate-900">
              我的生字簿 (Vocab Notebook &amp; Flashcards)
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            已儲存 {savedWords.length} 個由日常照片與查詢所收集的粵語生字詞
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-white text-indigo-600 shadow-2xs' : 'text-slate-600'
              }`}
            >
              清單模式 List
            </button>
            <button
              onClick={() => {
                setViewMode('flashcards');
                setCurrentCardIndex(0);
                setIsFlipped(false);
              }}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                viewMode === 'flashcards' ? 'bg-white text-indigo-600 shadow-2xs' : 'text-slate-600'
              }`}
            >
              抽卡溫習 Flashcard
            </button>
          </div>

          {savedWords.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm('確定要清空所有收藏的生字嗎？ (Clear all?)')) {
                  onClearAll();
                }
              }}
              className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors"
              title="清空生字簿"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Empty State */}
      {savedWords.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 border-2 border-dashed border-slate-300 text-center my-6">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
            <Bookmark className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">生字簿目前是空的</h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-5 leading-relaxed">
            你可以在「拍照識別」或「即時查拼」中點擊「收藏」按鈕，將想複習的生活詞彙加入生字簿。
          </p>
          <button
            onClick={onAddDefaultStarters}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            <span>加入香港非華語日常精選生字包 (Add HK Starter Pack)</span>
          </button>
        </div>
      ) : (
        <>
          {/* Category Filter Pills */}
          {categories.length > 2 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setFilterCategory(cat);
                    setCurrentCardIndex(0);
                    setIsFlipped(false);
                  }}
                  className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
                    filterCategory === cat
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
                  }`}
                >
                  {cat === 'all' ? '全部 All' : cat}
                </button>
              ))}
            </div>
          )}

          {/* Flashcard Review Mode */}
          {viewMode === 'flashcards' && currentFlashcard && (
            <div className="max-w-md mx-auto my-6">
              <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-3 px-1">
                <span>
                  卡片 {currentCardIndex + 1} / {filteredWords.length}
                </span>
                <span>點擊卡片翻面 (Click to flip)</span>
              </div>

              {/* Interactive Flip Card */}
              <div
                onClick={handleFlipCard}
                className={`relative w-full aspect-4/3 rounded-3xl p-8 cursor-pointer transition-all duration-300 shadow-lg border-2 ${
                  isFlipped
                    ? 'bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-300'
                    : 'bg-white hover:border-indigo-400 border-slate-200'
                } flex flex-col items-center justify-center text-center`}
              >
                {!isFlipped ? (
                  /* Front: Chinese Character */
                  <div>
                    <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest block mb-4">
                      {currentFlashcard.category || 'CANTONESE'}
                    </span>
                    <div className="text-5xl font-black text-slate-900 mb-4 tracking-tight">
                      {currentFlashcard.chinese}
                    </div>
                    <div className="inline-flex items-center gap-1.5 text-xs text-slate-400">
                      <RotateCw className="w-3.5 h-3.5" />
                      <span>點擊查看粵拼與發音</span>
                    </div>
                  </div>
                ) : (
                  /* Back: Jyutping directly underneath, tone badges, English */
                  <div className="animate-in fade-in duration-200">
                    <div className="text-3xl font-black text-slate-800 mb-2">
                      {currentFlashcard.chinese}
                    </div>

                    {/* Ruby Jyutping underneath */}
                    <div className="font-mono text-2xl font-bold text-indigo-700 tracking-wider mb-2">
                      {currentFlashcard.jyutping}
                    </div>

                    <div className="text-base font-semibold text-slate-700 mb-3">
                      {currentFlashcard.english}
                    </div>

                    <div className="flex justify-center gap-1.5 flex-wrap">
                      {currentFlashcard.characters?.map((c, i) => (
                        <span
                          key={i}
                          className={`text-xs px-2 py-0.5 rounded-md font-bold ${getToneBadgeClass(
                            c.tone
                          )}`}
                        >
                          {c.char}: {c.jyutping}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Card Controls */}
              <div className="flex items-center justify-between gap-3 mt-5">
                <button
                  onClick={handlePrevCard}
                  className="p-3 rounded-2xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 transition-colors shadow-2xs"
                  title="上一張 Previous"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <button
                  onClick={() => audioService.speak(currentFlashcard.chinese, 0.9)}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-sm shadow-md transition-all active:scale-95"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>聆聽發音 (Listen)</span>
                </button>

                <button
                  onClick={handleNextCard}
                  className="p-3 rounded-2xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 transition-colors shadow-2xs"
                  title="下一張 Next"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* List Mode */}
          {viewMode === 'list' && (
            <div>
              {filteredWords.map((word, idx) => (
                <div key={idx} className="relative group">
                  <WordCard
                    word={word}
                    index={idx}
                    isSaved={true}
                    onToggleSave={() => onRemoveWord(word.chinese)}
                    onOpenRecorder={onOpenRecorder}
                  />
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};
