import React from 'react';
import { Camera, Search, Music, BookOpen, Volume2, Sparkles } from 'lucide-react';
import { ActiveTab } from '../types';
import { audioService } from '../services/audioService';

interface NavbarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  savedCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  savedCount,
}) => {
  const handleQuickGreetingAudio = () => {
    audioService.speak('早晨，歡迎學習廣東話！', 1.0);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 h-16 sm:h-20 flex items-center justify-between gap-2">
        {/* App Brand */}
        <div
          onClick={() => onTabChange('scanner')}
          className="flex items-center gap-2.5 cursor-pointer select-none group"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center font-black shadow-md group-hover:scale-105 transition-transform">
            <span>粵</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-slate-900 text-base sm:text-lg tracking-tight group-hover:text-indigo-600 transition-colors">
                粵拼易學堂
              </span>
              <span className="hidden sm:inline-block text-[11px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                非華語學生專用 NCS
              </span>
            </div>
            <div className="text-[11px] text-slate-500 font-medium">
              Jyutping Snap &amp; Speak
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => onTabChange('scanner')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'scanner'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span className="hidden md:inline">拍照識別</span>
            <span className="md:hidden">拍照</span>
          </button>

          <button
            onClick={() => onTabChange('text-tool')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'text-tool'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Search className="w-4 h-4" />
            <span className="hidden md:inline">即時查拼</span>
            <span className="md:hidden">查拼</span>
          </button>

          <button
            onClick={() => onTabChange('tone-guide')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'tone-guide'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Music className="w-4 h-4" />
            <span className="hidden md:inline">六聲音調</span>
            <span className="md:hidden">聲調</span>
          </button>

          <button
            onClick={() => onTabChange('notebook')}
            className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'notebook'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span className="hidden md:inline">生字簿</span>
            <span className="md:hidden">生字</span>
            {savedCount > 0 && (
              <span
                className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  activeTab === 'notebook'
                    ? 'bg-white text-indigo-700'
                    : 'bg-indigo-600 text-white'
                }`}
              >
                {savedCount}
              </span>
            )}
          </button>

          {/* Quick Voice Greeting Test */}
          <button
            onClick={handleQuickGreetingAudio}
            title="播放粵語歡迎問候 (Play greeting)"
            className="p-2 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors ml-1"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </nav>
      </div>
    </header>
  );
};
