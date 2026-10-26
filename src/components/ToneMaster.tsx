import React, { useState } from 'react';
import { Volume2, Play, Sparkles, Award, CheckCircle2, XCircle, RotateCcw, HelpCircle } from 'lucide-react';
import { CANTONESE_TONES, getToneBadgeClass, getToneColor } from '../data/toneData';
import { audioService } from '../services/audioService';

export const ToneMaster: React.FC = () => {
  const [activeTone, setActiveTone] = useState<number>(1);
  const [isPlayingAll, setIsPlayingAll] = useState<boolean>(false);

  // Quiz state
  const [quizQuestion, setQuizQuestion] = useState<{ char: string; jyutping: string; tone: number; meaning: string } | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizTotal, setQuizTotal] = useState<number>(0);

  const handlePlaySound = async (text: string) => {
    try {
      await audioService.speak(text, 0.85);
    } catch (e) {
      console.error(e);
    }
  };

  // Play mnemonic "詩 史 試 時 市 事" (si1 si2 si3 si4 si5 si6) sequentially
  const handlePlayToneSequence = async () => {
    if (isPlayingAll) return;
    setIsPlayingAll(true);
    const chars = ['詩', '史', '試', '時', '市', '事'];
    for (let i = 0; i < chars.length; i++) {
      setActiveTone(i + 1);
      await audioService.speak(chars[i], 0.8);
      await new Promise((r) => setTimeout(r, 650));
    }
    setIsPlayingAll(false);
  };

  // Generate random quiz question
  const startNewQuizQuestion = () => {
    const allExamples: { char: string; jyutping: string; tone: number; meaning: string }[] = [];
    CANTONESE_TONES.forEach((t) => {
      allExamples.push({
        char: t.mnemonicChar,
        jyutping: t.mnemonicJyutping,
        tone: t.tone,
        meaning: t.mnemonicMeaning,
      });
      t.examples.forEach((ex) => {
        allExamples.push({
          char: ex.char,
          jyutping: ex.jyutping,
          tone: t.tone,
          meaning: ex.meaning,
        });
      });
    });

    const randomIndex = Math.floor(Math.random() * allExamples.length);
    const question = allExamples[randomIndex];
    setQuizQuestion(question);
    setSelectedAnswer(null);

    // Auto play audio for the question
    setTimeout(() => {
      audioService.speak(question.char, 0.85);
    }, 150);
  };

  const handleAnswer = (tone: number) => {
    if (selectedAnswer !== null || !quizQuestion) return;
    setSelectedAnswer(tone);
    setQuizTotal((prev) => prev + 1);
    if (tone === quizQuestion.tone) {
      setQuizScore((prev) => prev + 1);
    }
  };

  const currentToneData = CANTONESE_TONES.find((t) => t.tone === activeTone) || CANTONESE_TONES[0];

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>粵語九聲六調入門指南 (Cantonese 6 Tones Master)</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black mb-2">
          掌握廣東話六個聲調與音高走勢
        </h1>
        <p className="text-sm sm:text-base text-purple-100 max-w-2xl leading-relaxed">
          Cantonese is a tonal language. The same syllable pronounced with different tones means
          completely different things! Learn the 6 core tones through visual pitch curves and soundboards.
        </p>

        {/* Play Sequence Button */}
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            onClick={handlePlayToneSequence}
            disabled={isPlayingAll}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm shadow-md transition-all active:scale-95"
          >
            <Play className={`w-4 h-4 fill-slate-950 ${isPlayingAll ? 'animate-pulse' : ''}`} />
            <span>{isPlayingAll ? '依序示範中...' : '連續聆聽 1 至 6 聲：詩史試時市事'}</span>
          </button>
        </div>
      </div>

      {/* Tone Soundboard Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
        {CANTONESE_TONES.map((t) => {
          const isSelected = activeTone === t.tone;
          const toneCol = getToneColor(t.tone);

          return (
            <button
              key={t.tone}
              onClick={() => {
                setActiveTone(t.tone);
                handlePlaySound(t.mnemonicChar);
              }}
              className={`p-4 rounded-2xl text-left border-2 transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-white border-indigo-600 shadow-md ring-2 ring-indigo-500/20 scale-102'
                  : 'bg-white hover:bg-slate-50 border-slate-200 shadow-2xs'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-black px-2 py-0.5 rounded-md ${t.tone ? getToneBadgeClass(t.tone) : ''}`}>
                  Tone {t.tone}
                </span>
                <span className="font-mono text-xs font-bold text-slate-500">
                  {t.pitch}
                </span>
              </div>

              <div className="my-1">
                <div className="text-3xl font-black text-slate-900">{t.mnemonicChar}</div>
                <div className="font-mono text-sm font-bold text-indigo-700">{t.mnemonicJyutping}</div>
              </div>

              <div className="text-[11px] font-medium text-slate-500 truncate mt-1">
                {t.nameZh}
              </div>
            </button>
          );
        })}
      </div>

      {/* Deep Dive on Selected Tone with Pitch Contour Graphic */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200/90 shadow-sm mb-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Pitch Visualization Chart */}
          <div className="w-full lg:w-72 bg-slate-900 rounded-2xl p-5 text-white flex flex-col items-center shrink-0">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-3">
              五度標調法 (Pitch Contour 1-5)
            </span>

            {/* SVG Pitch Chart */}
            <svg viewBox="0 0 240 160" className="w-full h-40">
              {/* Pitch grid lines 5 to 1 */}
              {[5, 4, 3, 2, 1].map((p, idx) => {
                const y = 20 + idx * 28;
                return (
                  <g key={p}>
                    <line x1="40" y1={y} x2="220" y2={y} stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />
                    <text x="25" y={y + 4} fill="#94a3b8" fontSize="12" fontFamily="monospace" textAnchor="middle">
                      {p}
                    </text>
                  </g>
                );
              })}

              {/* Dynamic Tone Curve */}
              {(() => {
                const [start, end] = currentToneData.pitchContour;
                const y1 = 20 + (5 - start) * 28;
                const y2 = 20 + (5 - end) * 28;
                return (
                  <g>
                    <line
                      x1="60"
                      y1={y1}
                      x2="200"
                      y2={y2}
                      stroke="#818cf8"
                      strokeWidth="5"
                      strokeLinecap="round"
                    />
                    <circle cx="60" cy={y1} r="6" fill="#38bdf8" />
                    <circle cx="200" cy={y2} r="6" fill="#a855f7" />
                  </g>
                );
              })()}
            </svg>

            <div className="mt-2 text-center">
              <span className="font-mono text-xl font-black text-amber-400">
                調值 Pitch: {currentToneData.pitch}
              </span>
              <p className="text-xs text-slate-400 mt-1">
                {currentToneData.descriptionEn}
              </p>
            </div>
          </div>

          {/* Details & Practice Examples */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${getToneBadgeClass(currentToneData.tone)}`}>
                {currentToneData.nameZh}
              </span>
              <span className="text-sm font-semibold text-slate-500">
                {currentToneData.nameEn}
              </span>
            </div>

            <h3 className="text-2xl font-black text-slate-900 mb-2">
              口訣代表字：{currentToneData.mnemonicChar} ({currentToneData.mnemonicJyutping})
            </h3>
            <p className="text-sm text-slate-600 mb-5 leading-relaxed">
              {currentToneData.descriptionEn} English mnemonic meaning: "{currentToneData.mnemonicMeaning}".
            </p>

            {/* Example Words in this tone */}
            <div className="mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
                同調常用生活字例 (Practice Everyday Words in Tone {currentToneData.tone}):
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {currentToneData.examples.map((ex, i) => (
                  <button
                    key={i}
                    onClick={() => handlePlaySound(ex.char)}
                    className="group p-3 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-left transition-all active:scale-95 flex flex-col"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-slate-800 group-hover:text-indigo-600">
                        {ex.char}
                      </span>
                      <Volume2 className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
                    </div>
                    <span className="font-mono text-xs font-bold text-indigo-700 mt-1">
                      {ex.jyutping}
                    </span>
                    <span className="text-[11px] text-slate-500 truncate mt-0.5">
                      {ex.meaning}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => handlePlaySound(currentToneData.mnemonicChar)}
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-sm transition-all"
            >
              <Volume2 className="w-4 h-4" />
              <span>示範發音「{currentToneData.mnemonicChar}」</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tone Ear Training Mini Quiz */}
      <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Award className="w-5 h-5 text-amber-400" />
              <h3 className="text-lg sm:text-xl font-bold">聽音辨調挑戰 (Tone Ear-Training Challenge)</h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-300">
              Listen to the Cantonese audio clip and guess which of the 6 tones it is!
            </p>
          </div>

          {quizTotal > 0 && (
            <div className="px-4 py-2 bg-white/10 rounded-2xl backdrop-blur-xs text-xs font-bold text-amber-300">
              得分 Score: {quizScore} / {quizTotal} ({Math.round((quizScore / quizTotal) * 100)}%)
            </div>
          )}
        </div>

        {!quizQuestion ? (
          <div className="text-center py-6">
            <button
              onClick={startNewQuizQuestion}
              className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-2xl text-sm shadow-lg transition-transform active:scale-95"
            >
              開始聽音辨調挑戰 Start Challenge
            </button>
          </div>
        ) : (
          <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-xs border border-white/15">
            {/* Audio Play Trigger */}
            <div className="flex flex-col items-center justify-center my-3">
              <button
                onClick={() => audioService.speak(quizQuestion.char, 0.85)}
                className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-500 to-pink-500 hover:from-indigo-400 hover:to-pink-400 flex items-center justify-center shadow-lg transition-transform active:scale-90"
              >
                <Volume2 className="w-10 h-10 text-white animate-pulse" />
              </button>
              <span className="text-xs text-indigo-200 mt-2 font-semibold">
                點擊重播發音 (Click to Replay)
              </span>
            </div>

            {/* Answer Options: Tone 1 to 6 */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5 my-5">
              {[1, 2, 3, 4, 5, 6].map((toneNum) => {
                const isSelected = selectedAnswer === toneNum;
                const isCorrect = selectedAnswer !== null && toneNum === quizQuestion.tone;
                const isWrong = isSelected && toneNum !== quizQuestion.tone;

                let btnClass = 'bg-white/15 hover:bg-white/25 text-white border-white/20';
                if (isCorrect) {
                  btnClass = 'bg-emerald-500 text-white border-emerald-400 font-bold';
                } else if (isWrong) {
                  btnClass = 'bg-rose-500 text-white border-rose-400 font-bold';
                }

                return (
                  <button
                    key={toneNum}
                    disabled={selectedAnswer !== null}
                    onClick={() => handleAnswer(toneNum)}
                    className={`py-3 px-2 rounded-xl text-center border font-bold text-sm transition-all ${btnClass}`}
                  >
                    第 {toneNum} 聲
                  </button>
                );
              })}
            </div>

            {/* Quiz Result Feedback */}
            {selectedAnswer !== null && (
              <div className="mt-4 p-4 rounded-xl bg-white/10 border border-white/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {selectedAnswer === quizQuestion.tone ? (
                    <CheckCircle2 className="w-7 h-7 text-emerald-400 shrink-0" />
                  ) : (
                    <XCircle className="w-7 h-7 text-rose-400 shrink-0" />
                  )}
                  <div>
                    <div className="font-bold text-base">
                      {selectedAnswer === quizQuestion.tone ? '答對了！Bingo!' : '差一點！Keep Going!'}
                    </div>
                    <div className="text-xs text-indigo-200">
                      正確答案是：<strong>「{quizQuestion.char}」</strong> (
                      <span className="font-mono text-amber-300 font-bold">{quizQuestion.jyutping}</span>
                      ) - 第 {quizQuestion.tone} 聲 ({quizQuestion.meaning})
                    </div>
                  </div>
                </div>

                <button
                  onClick={startNewQuizQuestion}
                  className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs shrink-0 transition-transform active:scale-95"
                >
                  下一題 Next Question →
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
