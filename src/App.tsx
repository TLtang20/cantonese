import React, { useState, useEffect } from 'react';
import { ActiveTab, DetectedWord } from './types';
import { Navbar } from './components/Navbar';
import { PhotoScanner } from './components/PhotoScanner';
import { TextConverter } from './components/TextConverter';
import { ToneMaster } from './components/ToneMaster';
import { VocabNotebook } from './components/VocabNotebook';
import { VoiceComparisonModal } from './components/VoiceComparisonModal';
import { SAMPLE_PHOTOS } from './data/samplePhotos';
import { Sparkles, Heart } from 'lucide-react';

const STORAGE_KEY = 'jyutping_saved_words_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('scanner');
  const [savedWords, setSavedWords] = useState<DetectedWord[]>([]);
  const [activeComparisonWord, setActiveComparisonWord] = useState<DetectedWord | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load saved words from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSavedWords(JSON.parse(stored));
      } else {
        // Seed initial starter words from sample photo 1 for immediate delight
        const initialStarters = SAMPLE_PHOTOS[0].analysis.detectedTexts;
        setSavedWords(initialStarters);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialStarters));
      }
    } catch (e) {
      console.error('Failed to load saved words:', e);
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  const handleSaveWord = (word: DetectedWord) => {
    const exists = savedWords.some((w) => w.chinese === word.chinese);
    let updated: DetectedWord[];
    if (exists) {
      updated = savedWords.filter((w) => w.chinese !== word.chinese);
      showToast(`已從生字簿移除「${word.chinese}」`);
    } else {
      updated = [{ ...word, savedAt: Date.now() }, ...savedWords];
      showToast(`已成功收藏「${word.chinese}」到生字簿！🌟`);
    }
    setSavedWords(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const handleRemoveWord = (chinese: string) => {
    const updated = savedWords.filter((w) => w.chinese !== chinese);
    setSavedWords(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    showToast(`已移除「${chinese}」`);
  };

  const handleClearAll = () => {
    setSavedWords([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error(e);
    }
    showToast('生字簿已清空');
  };

  const handleAddDefaultStarters = () => {
    const starters: DetectedWord[] = [];
    SAMPLE_PHOTOS.forEach((s) => {
      s.analysis.detectedTexts.forEach((w) => {
        if (!starters.some((x) => x.chinese === w.chinese)) {
          starters.push(w);
        }
      });
    });
    setSavedWords(starters);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(starters));
    } catch (e) {
      console.error(e);
    }
    showToast(`已加入 ${starters.length} 個香港日常高頻詞彙！🎉`);
  };

  // Map of saved words for instant O(1) lookup
  const savedWordsMap = savedWords.reduce<Record<string, boolean>>((acc, w) => {
    acc[w.chinese] = true;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-800">
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        savedCount={savedWords.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {activeTab === 'scanner' && (
          <PhotoScanner
            onSaveWord={handleSaveWord}
            savedWordsMap={savedWordsMap}
            onOpenRecorder={setActiveComparisonWord}
          />
        )}

        {activeTab === 'text-tool' && (
          <TextConverter
            onSaveWord={handleSaveWord}
            savedWordsMap={savedWordsMap}
            onOpenRecorder={setActiveComparisonWord}
          />
        )}

        {activeTab === 'tone-guide' && <ToneMaster />}

        {activeTab === 'notebook' && (
          <VocabNotebook
            savedWords={savedWords}
            onRemoveWord={handleRemoveWord}
            onClearAll={handleClearAll}
            onAddDefaultStarters={handleAddDefaultStarters}
            onOpenRecorder={setActiveComparisonWord}
          />
        )}
      </main>

      {/* Voice Comparison Modal */}
      {activeComparisonWord && (
        <VoiceComparisonModal
          word={activeComparisonWord}
          onClose={() => setActiveComparisonWord(null)}
        />
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl border border-slate-800 text-xs sm:text-sm font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-6 text-center text-xs text-slate-500">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <span className="font-bold text-slate-700">粵拼易學堂 (Jyutping Snap &amp; Speak)</span>
            <span className="mx-2">•</span>
            <span>專為非華語學生（NCS）設計之香港粵語發音與拍照學習系統</span>
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <span>粵拼標準遵從香港語言學學會 (LSHK Jyutping)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
