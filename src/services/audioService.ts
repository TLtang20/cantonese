/**
 * Audio Service for Cantonese Pronunciation
 * Combines high-fidelity Gemini 3.8 Flash Lite TTS and Web Speech API (zh-HK)
 */

type AudioCallback = (isPlaying: boolean, activeText?: string) => void;

class AudioService {
  private currentAudio: HTMLAudioElement | null = null;
  private audioCache = new Map<string, string>(); // text -> blobUrl
  private listeners: AudioCallback[] = [];
  private activeText: string | null = null;
  private preferredEngine: 'auto' | 'gemini' | 'browser' = 'auto';

  // Find native browser Cantonese voice
  public getCantoneseVoice(): SpeechSynthesisVoice | null {
    if (typeof window === 'undefined' || !window.speechSynthesis) return null;
    const voices = window.speechSynthesis.getVoices();
    // Prioritize zh-HK or cantonese
    const hkVoice = voices.find(
      (v) =>
        v.lang === 'zh-HK' ||
        v.lang === 'yue-Hant-HK' ||
        v.lang === 'zh_HK' ||
        v.name.toLowerCase().includes('cantonese') ||
        v.name.toLowerCase().includes('hong kong')
    );
    if (hkVoice) return hkVoice;

    // Fallback: zh-TW or any Chinese
    return voices.find((v) => v.lang.startsWith('zh')) || null;
  }

  public subscribe(cb: AudioCallback) {
    this.listeners.push(cb);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== cb);
    };
  }

  private notify(isPlaying: boolean, text?: string) {
    this.activeText = isPlaying ? text || null : null;
    this.listeners.forEach((cb) => cb(isPlaying, text));
  }

  public isCurrentlyPlaying(text?: string): boolean {
    if (!text) return !!this.activeText;
    return this.activeText === text;
  }

  public stop() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    this.notify(false);
  }

  /**
   * Speak Cantonese text
   * @param text The Chinese word or phrase to pronounce
   * @param speed Playback speed (0.75 for slow practice, 1.0 for normal)
   * @param forceEngine Optional engine override
   */
  public async speak(
    text: string,
    speed: number = 1.0,
    forceEngine?: 'gemini' | 'browser'
  ): Promise<void> {
    this.stop();
    if (!text.trim()) return;

    this.notify(true, text);

    const engine = forceEngine || this.preferredEngine;

    // First attempt: If Gemini TTS is requested or in auto mode with cache
    const cacheKey = `${text}_${speed}`;
    if (this.audioCache.has(cacheKey)) {
      try {
        await this.playAudioUrl(this.audioCache.get(cacheKey)!, speed, text);
        return;
      } catch (err) {
        console.warn('Cache playback failed, falling back to live speech', err);
      }
    }

    // Try Gemini TTS first if specified
    if (engine === 'gemini') {
      try {
        await this.speakWithGemini(text, speed);
        return;
      } catch (err) {
        console.warn('Gemini TTS failed, falling back to Browser voice', err);
      }
    }

    // Attempt browser Web Speech API with zh-HK
    const browserVoice = this.getCantoneseVoice();
    if (browserVoice || engine === 'browser') {
      try {
        await this.speakWithBrowser(text, speed, browserVoice);
        return;
      } catch (err) {
        console.warn('Browser TTS failed, trying Gemini API', err);
      }
    }

    // Fallback: Try Gemini API
    try {
      await this.speakWithGemini(text, speed);
    } catch (err) {
      console.error('All TTS attempts failed:', err);
      this.notify(false);
      throw err;
    }
  }

  private speakWithBrowser(
    text: string,
    speed: number,
    voice: SpeechSynthesisVoice | null
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !window.speechSynthesis) {
        return reject(new Error('SpeechSynthesis not supported'));
      }

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-HK';
      if (voice) {
        utterance.voice = voice;
      }
      utterance.rate = Math.max(0.5, Math.min(2.0, speed));
      utterance.pitch = 1.0;

      utterance.onend = () => {
        this.notify(false);
        resolve();
      };

      utterance.onerror = (e) => {
        this.notify(false);
        reject(e);
      };

      window.speechSynthesis.speak(utterance);
    });
  }

  private async speakWithGemini(text: string, speed: number): Promise<void> {
    const cacheKey = `${text}_${speed}`;
    const res = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, speed }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `TTS server error: ${res.status}`);
    }

    const data = await res.json();
    if (!data.audio) {
      throw new Error('No audio returned from TTS');
    }

    const audioUrl = `data:audio/wav;base64,${data.audio}`;
    this.audioCache.set(cacheKey, audioUrl);
    await this.playAudioUrl(audioUrl, speed, text);
  }

  private playAudioUrl(url: string, speed: number, text: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const audio = new Audio(url);
      this.currentAudio = audio;
      audio.playbackRate = speed;

      audio.onended = () => {
        this.currentAudio = null;
        this.notify(false);
        resolve();
      };

      audio.onerror = (err) => {
        this.currentAudio = null;
        this.notify(false);
        reject(err);
      };

      audio.play().catch((err) => {
        this.currentAudio = null;
        this.notify(false);
        reject(err);
      });
    });
  }
}

export const audioService = new AudioService();
