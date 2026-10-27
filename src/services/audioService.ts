/**
 * Audio Service for Cantonese Pronunciation
 * Prioritizes high-speed local Cantonese (zh-HK) speech synthesis,
 * with graceful fallback to server-side Gemini audio.
 */

type AudioCallback = (isPlaying: boolean, activeText?: string) => void;

class AudioService {
  private currentAudio: HTMLAudioElement | null = null;
  private audioCache = new Map<string, string>(); // text -> blobUrl
  private listeners: AudioCallback[] = [];
  private activeText: string | null = null;
  private voicesLoaded = false;

  constructor() {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = () => {
        this.voicesLoaded = true;
      };
      // Trigger voice load
      window.speechSynthesis.getVoices();
    }
  }

  // Find native browser Cantonese voice
  public getCantoneseVoice(): SpeechSynthesisVoice | null {
    if (typeof window === 'undefined' || !window.speechSynthesis) return null;
    const voices = window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) return null;

    // Prioritize zh-HK or cantonese
    const hkVoice = voices.find(
      (v) =>
        v.lang === 'zh-HK' ||
        v.lang === 'yue-Hant-HK' ||
        v.lang === 'zh_HK' ||
        v.name.toLowerCase().includes('cantonese') ||
        v.name.toLowerCase().includes('hong kong') ||
        v.name.toLowerCase().includes('粵語') ||
        v.name.toLowerCase().includes('广东话')
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
   */
  public async speak(text: string, speed: number = 1.0): Promise<void> {
    this.stop();
    if (!text || !text.trim()) return;

    this.notify(true, text);

    // 1. Try Browser SpeechSynthesis (zh-HK) first: instant, reliable, zero-quota
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      try {
        const voice = this.getCantoneseVoice();
        await this.speakWithBrowser(text, speed, voice);
        return;
      } catch (browserErr) {
        console.warn('Browser speech synthesis error, trying cached/server audio', browserErr);
      }
    }

    // 2. Try Cache if available
    const cacheKey = `${text}_${speed}`;
    if (this.audioCache.has(cacheKey)) {
      try {
        await this.playAudioUrl(this.audioCache.get(cacheKey)!, speed, text);
        return;
      } catch (err) {
        console.warn('Cache playback failed', err);
      }
    }

    // 3. Try Gemini TTS as secondary fallback
    try {
      await this.speakWithGemini(text, speed);
    } catch (err) {
      console.warn('Server TTS not available, notifying completion', err);
      this.notify(false);
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
        // Do not reject on cancel
        if (e.error === 'canceled' || e.error === 'interrupted') {
          resolve();
        } else {
          reject(e);
        }
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
