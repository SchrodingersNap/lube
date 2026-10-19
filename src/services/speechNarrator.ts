// Web Speech Synthesis narrator supporting Bengali (bn-IN), Hindi (hi-IN), and English
import { Language } from '../types';

type SpeechCallback = (speaking: boolean) => void;

class SpeechNarrator {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private listeners: Set<SpeechCallback> = new Set();
  private isSpeakingState: boolean = false;
  private voicesLoaded: boolean = false;
  private voices: SpeechSynthesisVoice[] = [];
  private enabled: boolean = true;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => {
          this.loadVoices();
        };
      }
    }
  }

  private loadVoices() {
    if (!this.synth) return;
    this.voices = this.synth.getVoices();
    if (this.voices.length > 0) {
      this.voicesLoaded = true;
    }
  }

  public subscribe(cb: SpeechCallback) {
    this.listeners.add(cb);
    cb(this.isSpeakingState);
    return () => {
      this.listeners.delete(cb);
    };
  }

  private notify(state: boolean) {
    this.isSpeakingState = state;
    this.listeners.forEach((cb) => cb(state));
  }

  public setEnabled(val: boolean) {
    this.enabled = val;
    if (!val) {
      this.stop();
    }
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public stop() {
    if (this.synth) {
      this.synth.cancel();
      this.notify(false);
    }
  }

  public speak(text: string, lang: Language) {
    if (!this.enabled || !this.synth || !text.trim()) {
      return;
    }

    // Cancel any ongoing speech
    this.synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    this.currentUtterance = utterance;

    // Pick target language code
    let langCode = 'bn-IN';
    if (lang === 'hi') langCode = 'hi-IN';
    if (lang === 'en') langCode = 'en-IN';

    utterance.lang = langCode;
    utterance.rate = 0.95; // Slightly slower for clear comprehension by plant workers
    utterance.pitch = 1.0;

    // Find best matching voice if available
    if (this.voices.length === 0) {
      this.loadVoices();
    }

    const matchedVoice = this.voices.find(
      (v) =>
        v.lang.toLowerCase() === langCode.toLowerCase() ||
        v.lang.toLowerCase().startsWith(langCode.substring(0, 2))
    );

    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onstart = () => {
      this.notify(true);
    };

    utterance.onend = () => {
      this.notify(false);
    };

    utterance.onerror = (e) => {
      console.warn('SpeechSynthesis error:', e);
      this.notify(false);
    };

    try {
      this.synth.speak(utterance);
    } catch (err) {
      console.warn('Error starting speech:', err);
      this.notify(false);
    }
  }
}

export const speechNarrator = new SpeechNarrator();
