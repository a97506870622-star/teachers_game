/**
 * Web Speech Synthesis Engine for Warm Teacher Encouragement Prompts
 * Focuses on natural Traditional Chinese (zh-TW) voice delivery with fallback and subtitle synchronization
 */

class SpeechEngine {
  private isMuted: boolean = false;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private preferredVoice: SpeechSynthesisVoice | null = null;
  private voicesLoaded: boolean = false;
  private onStateChangeCallbacks: Set<(isSpeaking: boolean) => void> = new Set();

  constructor() {
    this.initVoices();
  }

  private initVoices() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        this.voicesLoaded = true;
        // Search for zh-TW voice first, then zh-HK, then zh-CN, then any zh
        const twVoice = voices.find(v => v.lang === 'zh-TW' || v.lang === 'zh_TW');
        const zhVoice = voices.find(v => v.lang.startsWith('zh'));
        this.preferredVoice = twVoice || zhVoice || voices[0] || null;
      }
    };

    loadVoices();
    if (typeof window.speechSynthesis.onvoiceschanged !== 'undefined') {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.stop();
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public subscribeSpeakingState(cb: (isSpeaking: boolean) => void) {
    this.onStateChangeCallbacks.add(cb);
    return () => {
      this.onStateChangeCallbacks.delete(cb);
    };
  }

  private notifyState(isSpeaking: boolean) {
    this.onStateChangeCallbacks.forEach(cb => cb(isSpeaking));
  }

  public speak(
    text: string,
    options?: {
      rate?: number;
      pitch?: number;
      onStart?: () => void;
      onEnd?: () => void;
    }
  ) {
    if (this.isMuted || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (options?.onEnd) options.onEnd();
      return;
    }

    // Stop ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-TW';
    utterance.rate = options?.rate || 0.95; // slightly gentle pace for warm tone
    utterance.pitch = options?.pitch || 1.05; // slightly cheerful, gentle

    if (this.preferredVoice) {
      utterance.voice = this.preferredVoice;
    } else {
      const voices = window.speechSynthesis.getVoices();
      const tw = voices.find(v => v.lang === 'zh-TW' || v.lang === 'zh_TW') || voices.find(v => v.lang.startsWith('zh'));
      if (tw) utterance.voice = tw;
    }

    utterance.onstart = () => {
      this.notifyState(true);
      if (options?.onStart) options.onStart();
    };

    utterance.onend = () => {
      this.notifyState(false);
      this.currentUtterance = null;
      if (options?.onEnd) options.onEnd();
    };

    utterance.onerror = () => {
      this.notifyState(false);
      this.currentUtterance = null;
      if (options?.onEnd) options.onEnd();
    };

    this.currentUtterance = utterance;
    try {
      window.speechSynthesis.speak(utterance);
    } catch {
      this.notifyState(false);
      if (options?.onEnd) options.onEnd();
    }
  }

  public stop() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.currentUtterance = null;
    this.notifyState(false);
  }
}

export const speechEngine = new SpeechEngine();
