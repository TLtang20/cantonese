import React, { useState } from 'react';
import { Volume2, Bookmark, BookmarkCheck, Mic, Sparkles, MessageSquare, ChevronRight, Gauge } from 'lucide-react';
import { DetectedWord } from '../types';
import { audioService } from '../services/audioService';
import { getToneBadgeClass, getToneColor } from '../data/toneData';

interface WordCardProps {
  word: DetectedWord;
  isSaved?: boolean;
  onToggleSave?: (word: DetectedWord) => void;
  onOpenRecorder?: (word: DetectedWord) => void;
  index?: number;
}

export const WordCard: React.FC<WordCardProps> = ({
  word,
  isSaved = false,
  onToggleSave,
  onOpenRecorder,
  index = 0,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<number>(1.0);
  const [activeCharIndex, setActiveCharIndex] = useState<number | null>(null);

  const handlePlayWord = async (chosenSpeed = speed) => {
    try {
      setIsPlaying(true);
      await audioService.speak(word.chinese, chosenSpeed);
    } catch (e) {
      console.error(e);
    } finally {
      setIsPlaying(false);
    }
  };

  const handlePlaySingleChar = async (char: string, idx: number) => {
    try {
      setActiveCharIndex(idx);
      await audioService.speak(char, 0.85);
    } catch (e) {
      console.error(e);
    } finally {
      setActiveCharIndex(null);
    }
  };

  const handlePlaySentence = async (sentence: string) => {
    try {
      await audioService.speak(sentence, 0.9);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-slate-200/80 shadow-sm hover:shadow-md transition-all overflow-hidden p-5 sm:p-6 mb-5">
      {/* Top Bar: Category badge & Save button */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {word.category && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              {word.category}
            </span>
          )}
          <span className="text-xs text-slate-500 font-medium">#{index + 1}</span>
        </div>

        {onToggleSave && (
          <button
            onClick={() => onToggleSave(word)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              isSaved
                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
            }`}
            title={isSaved ? '已收藏在生字簿' : '收藏到生字簿'}
          >
            {isSaved ? <BookmarkCheck className="w-3.5 h-3.5 text-amber-700" /> : <Bookmark className="w-3.5 h-3.5" />}
            <span>{isSaved ? '已收藏 Saved' : '收藏 Save'}</span>
          </button>
        )}
      </div>

      {/* Main Pronunciation Block: Chinese Characters with Jyutping DIRECTLY BELOW */}
      <div className="bg-slate-50/80 rounded-xl p-4 sm:p-5 border border-slate-200/60 mb-4">
        <div className="flex flex-wrap items-end gap-3 sm:gap-4 justify-center sm:justify-start">
          {word.characters && word.characters.length > 0 ? (
            word.characters.map((item, idx) => {
              const toneCol = getToneColor(item.tone);
              const isActive = activeCharIndex === idx;

              return (
                <div
                  key={idx}
                  onClick={() => handlePlaySingleChar(item.char, idx)}
                  className={`group cursor-pointer flex flex-col items-center p-2.5 rounded-xl border transition-all duration-150 ${
                    isActive
                      ? 'bg-indigo-100 border-indigo-400 scale-105 shadow-sm'
                      : 'bg-white hover:bg-slate-100/90 border-slate-200 hover:border-indigo-300 shadow-2xs'
                  }`}
                  title={`點擊聆聽單字發音「${item.char}」: ${item.jyutping} (${item.toneName})`}
                >
                  {/* Chinese Character on Top */}
                  <span className="text-3xl sm:text-4xl font-bold text-slate-800 tracking-tight transition-transform group-hover:scale-105">
                    {item.char}
                  </span>

                  {/* Jyutping directly BELOW the Chinese Character */}
                  <div className="mt-1 flex items-center gap-1">
                    <span className="font-mono text-base sm:text-lg font-bold text-slate-700">
                      {item.jyutping}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md ${getToneBadgeClass(
                        item.tone
                      )}`}
                    >
                      T{item.tone}
                    </span>
                  </div>

                  {/* Single Character English Meaning */}
                  <span className="text-[11px] text-slate-600 mt-1 max-w-[80px] text-center truncate font-medium">
                    {item.meaning}
                  </span>
                </div>
              );
            })
          ) : (
            <div>
              <div className="text-3xl font-bold text-slate-800">{word.chinese}</div>
              <div className="text-lg font-mono font-bold text-indigo-700 mt-1">{word.jyutping}</div>
            </div>
          )}
        </div>

        {/* English Translation */}
        <div className="mt-3 pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="text-xs uppercase tracking-wider text-slate-600 font-semibold mr-2">Meaning:</span>
            <span className="text-base sm:text-lg font-semibold text-slate-800">{word.english}</span>
          </div>

          <div className="text-xs text-indigo-700 font-medium flex items-center gap-1 bg-indigo-50 px-2 py-1 rounded">
            <span>💡 點擊個別字元可單獨聽單音</span>
          </div>
        </div>
      </div>

      {/* Audio Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-gradient-to-r from-indigo-50/70 via-purple-50/50 to-pink-50/50 rounded-xl border border-indigo-100 mb-4">
        {/* Play Button & Speed toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePlayWord(speed)}
            disabled={isPlaying}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-white font-medium text-sm transition-all shadow-sm ${
              isPlaying
                ? 'bg-indigo-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95'
            }`}
          >
            <Volume2 className={`w-4 h-4 ${isPlaying ? 'animate-pulse' : ''}`} />
            <span>{isPlaying ? '播放中 Playing...' : '真人發音 Pronounce'}</span>
          </button>

          {/* Speed Selector (0.75x Slow / 1.0x Normal) */}
          <div className="flex items-center bg-white rounded-lg p-0.5 border border-slate-200 text-xs">
            <button
              onClick={() => {
                setSpeed(0.75);
                handlePlayWord(0.75);
              }}
              className={`px-2 py-1 rounded font-medium transition-colors ${
                speed === 0.75 ? 'bg-indigo-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-100'
              }`}
              title="0.75倍慢速發音 (Slow for learning)"
            >
              慢速 0.75x
            </button>
            <button
              onClick={() => {
                setSpeed(1.0);
                handlePlayWord(1.0);
              }}
              className={`px-2 py-1 rounded font-medium transition-colors ${
                speed === 1.0 ? 'bg-indigo-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-100'
              }`}
              title="1.0倍正常速度 (Normal native pace)"
            >
              標準 1.0x
            </button>
          </div>
        </div>

        {/* Practice & Compare Button */}
        {onOpenRecorder && (
          <button
            onClick={() => onOpenRecorder(word)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-50 text-indigo-700 border border-indigo-200 text-xs font-semibold shadow-2xs hover:border-indigo-300 transition-all active:scale-95"
          >
            <Mic className="w-3.5 h-3.5 text-indigo-600" />
            <span>跟讀錄音對比 Shadow &amp; Compare</span>
          </button>
        )}
      </div>

      {/* Practical Colloquial Note for Hong Kong Life */}
      {word.colloquialNote && (
        <div className="mb-3.5 bg-amber-50/70 border border-amber-200/80 rounded-xl p-3 text-xs sm:text-sm text-amber-900 flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-amber-950">日常粵語口語小知識 (HK Daily Tip): </span>
            <span className="text-amber-900 leading-relaxed">{word.colloquialNote}</span>
          </div>
        </div>
      )}

      {/* Example Everyday Dialogue Sentence with Jyutping */}
      {word.exampleSentence && (
        <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 text-xs sm:text-sm">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-semibold text-slate-700 flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
              <span>日常例句 Example Dialogue</span>
            </span>
            <button
              onClick={() => handlePlaySentence(word.exampleSentence!.chinese)}
              className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-medium"
            >
              <Volume2 className="w-3 h-3" />
              <span>聆聽例句 Listen</span>
            </button>
          </div>

          <div className="text-slate-900 font-semibold text-sm sm:text-base mb-0.5">
            {word.exampleSentence.chinese}
          </div>
          <div className="font-mono text-xs text-indigo-700 mb-1">
            {word.exampleSentence.jyutping}
          </div>
          <div className="text-slate-600 text-xs italic">
            "{word.exampleSentence.english}"
          </div>
        </div>
      )}
    </div>
  );
};
