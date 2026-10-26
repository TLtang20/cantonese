import React, { useState, useEffect, useRef } from 'react';
import { X, Mic, Square, Play, Volume2, RotateCcw, CheckCircle2, Award, Sparkles, VolumeX } from 'lucide-react';
import { DetectedWord } from '../types';
import { audioService } from '../services/audioService';
import { AudioRecorder } from '../services/recorderService';

interface VoiceComparisonModalProps {
  word: DetectedWord | null;
  onClose: () => void;
}

export const VoiceComparisonModal: React.FC<VoiceComparisonModalProps> = ({ word, onClose }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [isTeacherPlaying, setIsTeacherPlaying] = useState(false);
  const [isStudentPlaying, setIsStudentPlaying] = useState(false);
  const [recorderError, setRecorderError] = useState<string | null>(null);
  const [evaluationFeedback, setEvaluationFeedback] = useState<string | null>(null);

  const recorderRef = useRef<AudioRecorder | null>(null);
  const timerRef = useRef<any>(null);
  const studentAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    recorderRef.current = new AudioRecorder();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (studentAudioRef.current) studentAudioRef.current.pause();
    };
  }, []);

  if (!word) return null;

  const handlePlayTeacher = async (speed = 1.0) => {
    try {
      setIsTeacherPlaying(true);
      await audioService.speak(word.chinese, speed);
    } catch (e) {
      console.error(e);
    } finally {
      setIsTeacherPlaying(false);
    }
  };

  const handleStartRecording = async () => {
    try {
      setRecorderError(null);
      setRecordedAudioUrl(null);
      setEvaluationFeedback(null);
      setRecordingDuration(0);

      await recorderRef.current?.start();
      setIsRecording(true);

      timerRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      setRecorderError(err.message || 'Cannot access microphone. Please allow microphone permissions.');
      setIsRecording(false);
    }
  };

  const handleStopRecording = async () => {
    if (!recorderRef.current) return;
    try {
      if (timerRef.current) clearInterval(timerRef.current);
      const { url } = await recorderRef.current.stop();
      setIsRecording(false);
      setRecordedAudioUrl(url);
    } catch (err: any) {
      setRecorderError(err.message || 'Failed to stop recording');
      setIsRecording(false);
    }
  };

  const handlePlayStudentAudio = () => {
    if (!recordedAudioUrl) return;
    if (studentAudioRef.current) {
      studentAudioRef.current.pause();
    }
    const audio = new Audio(recordedAudioUrl);
    studentAudioRef.current = audio;
    setIsStudentPlaying(true);
    audio.play();
    audio.onended = () => setIsStudentPlaying(false);
    audio.onerror = () => setIsStudentPlaying(false);
  };

  // Play native teacher then student recording back-to-back
  const handlePlayBackToBack = async () => {
    if (!recordedAudioUrl) return;
    try {
      setIsTeacherPlaying(true);
      await audioService.speak(word.chinese, 1.0);
      setIsTeacherPlaying(false);

      // Brief pause then play student
      setTimeout(() => {
        handlePlayStudentAudio();
      }, 400);
    } catch (e) {
      console.error(e);
      setIsTeacherPlaying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base sm:text-lg">粵語發音影子跟讀 (Shadowing Lab)</h3>
              <p className="text-xs text-slate-500">Side-by-side Cantonese pronunciation comparison</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Word Display with Ruby Jyutping */}
        <div className="my-5 p-5 bg-gradient-to-b from-indigo-50/50 to-purple-50/40 rounded-2xl border border-indigo-100 text-center">
          <div className="text-4xl sm:text-5xl font-black text-slate-900 tracking-wide mb-2">
            {word.chinese}
          </div>
          <div className="font-mono text-xl sm:text-2xl font-bold text-indigo-700 tracking-wider">
            {word.jyutping}
          </div>
          <div className="text-sm text-slate-600 font-medium mt-1">
            {word.english}
          </div>

          {/* Tone badges sequence */}
          <div className="flex justify-center gap-2 mt-3">
            {word.characters?.map((c, i) => (
              <span
                key={i}
                className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800"
              >
                {c.char}: {c.jyutping} ({c.toneName})
              </span>
            ))}
          </div>
        </div>

        {/* Step 1: Teacher Native Model */}
        <div className="mb-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              第 1 步：聆聽真人標準示範 (Native Teacher Model)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePlayTeacher(1.0)}
              disabled={isTeacherPlaying}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-all shadow-sm active:scale-95"
            >
              <Volume2 className={`w-4 h-4 ${isTeacherPlaying ? 'animate-bounce' : ''}`} />
              <span>{isTeacherPlaying ? '示範中...' : '標準速度 (1.0x)'}</span>
            </button>
            <button
              onClick={() => handlePlayTeacher(0.75)}
              disabled={isTeacherPlaying}
              className="py-2.5 px-3 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold transition-all"
            >
              慢速 (0.75x)
            </button>
          </div>
        </div>

        {/* Step 2: Student Voice Recording */}
        <div className="mb-5 p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              第 2 步：非華語學生錄音跟讀 (Record Your Voice)
            </span>
            {isRecording && (
              <span className="flex items-center gap-1 text-xs text-rose-600 font-bold animate-pulse">
                <span className="w-2 h-2 rounded-full bg-rose-600"></span>
                <span>錄音中 0:0{recordingDuration}</span>
              </span>
            )}
          </div>

          {recorderError && (
            <div className="text-xs text-rose-600 bg-rose-50 p-2 rounded-lg mb-2">
              ⚠️ {recorderError}
            </div>
          )}

          {!isRecording ? (
            <button
              onClick={handleStartRecording}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-95"
            >
              <Mic className="w-4 h-4" />
              <span>{recordedAudioUrl ? '重新錄製 (Re-record)' : '開始錄音 (Start Recording)'}</span>
            </button>
          ) : (
            <button
              onClick={handleStopRecording}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-slate-900 hover:bg-black text-white rounded-xl text-sm font-bold shadow-md transition-all active:scale-95"
            >
              <Square className="w-4 h-4 fill-white" />
              <span>停止錄音 (Done Recording)</span>
            </button>
          )}

          {/* Student Playback & Comparison */}
          {recordedAudioUrl && !isRecording && (
            <div className="mt-3 pt-3 border-t border-slate-200 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePlayStudentAudio}
                  disabled={isStudentPlaying}
                  className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800"
                >
                  <Play className="w-3.5 h-3.5 text-rose-600 fill-rose-600" />
                  <span>{isStudentPlaying ? '播放我的聲音...' : '播放我的錄音 Play Mine'}</span>
                </button>

                <button
                  onClick={handlePlayBackToBack}
                  className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold shadow-sm"
                  title="Play native teacher and then your recording consecutively"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>對比播放 Compare A/B</span>
                </button>
              </div>

              {/* Student Self-Assessment */}
              <div className="mt-2 p-2.5 bg-white rounded-xl border border-slate-200 text-center">
                <p className="text-xs text-slate-600 mb-1.5 font-medium">聽完兩者對比，你覺得自己的音調如何？</p>
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => setEvaluationFeedback('太棒了！你的音調非常接近標準香港粵語！繼續保持！🎉')}
                    className="px-3 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg text-xs font-semibold"
                  >
                    👍 準確 Accurate
                  </button>
                  <button
                    onClick={() => setEvaluationFeedback('很好！試試看注意尾音同聲調的高低起伏，再錄一次吧！💪')}
                    className="px-3 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded-lg text-xs font-semibold"
                  >
                    🔄 需多練 Need Practice
                  </button>
                </div>
                {evaluationFeedback && (
                  <p className="mt-2 text-xs font-bold text-indigo-700 animate-in fade-in">
                    {evaluationFeedback}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold transition-colors"
          >
            完成練習 Done
          </button>
        </div>
      </div>
    </div>
  );
};
