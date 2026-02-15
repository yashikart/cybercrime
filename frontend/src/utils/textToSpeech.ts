/**
 * Text-to-Speech Utility
 * Provides speech synthesis functionality using Web Speech API
 */

export interface TTSOptions {
  rate?: number; // 0.1 to 10 (default: 1)
  pitch?: number; // 0 to 2 (default: 1)
  volume?: number; // 0 to 1 (default: 1)
  voice?: SpeechSynthesisVoice;
  lang?: string; // Language code (default: 'en-US')
}

class TextToSpeechService {
  private synth: SpeechSynthesis;
  private isSupported: boolean;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isPlaying: boolean = false;

  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null as any;
    this.isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  /**
   * Check if TTS is supported
   */
  isTTSSupported(): boolean {
    return this.isSupported;
  }

  /**
   * Get available voices
   */
  getVoices(): SpeechSynthesisVoice[] {
    if (!this.isSupported) return [];
    return this.synth.getVoices();
  }

  /**
   * Speak text
   */
  speak(text: string, options: TTSOptions = {}): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.isSupported) {
        reject(new Error('Text-to-speech is not supported in this browser'));
        return;
      }

      // Stop any current speech
      this.stop();

      const utterance = new SpeechSynthesisUtterance(text);
      
      // Set options
      utterance.rate = options.rate ?? 1;
      utterance.pitch = options.pitch ?? 1;
      utterance.volume = options.volume ?? 1;
      utterance.lang = options.lang ?? 'en-US';
      
      if (options.voice) {
        utterance.voice = options.voice;
      }

      // Event handlers
      utterance.onend = () => {
        this.isPlaying = false;
        this.currentUtterance = null;
        resolve();
      };

      utterance.onerror = (error) => {
        this.isPlaying = false;
        this.currentUtterance = null;
        reject(error);
      };

      this.currentUtterance = utterance;
      this.isPlaying = true;
      this.synth.speak(utterance);
    });
  }

  /**
   * Stop current speech
   */
  stop(): void {
    if (this.isSupported && this.synth.speaking) {
      this.synth.cancel();
      this.isPlaying = false;
      this.currentUtterance = null;
    }
  }

  /**
   * Pause current speech
   */
  pause(): void {
    if (this.isSupported && this.synth.speaking) {
      this.synth.pause();
      this.isPlaying = false;
    }
  }

  /**
   * Resume paused speech
   */
  resume(): void {
    if (this.isSupported && this.synth.paused) {
      this.synth.resume();
      this.isPlaying = true;
    }
  }

  /**
   * Check if currently speaking
   */
  getIsPlaying(): boolean {
    return this.isPlaying;
  }

  /**
   * Speak notification/message with auto-stop after delay
   */
  speakNotification(text: string, options: TTSOptions = {}): void {
    // Stop any current notification speech
    this.stop();
    
    // Speak the notification
    this.speak(text, {
      rate: 1.1,
      pitch: 1.1,
      volume: 0.8,
      ...options
    }).catch(() => {
      // Silently fail for notifications
    });
  }

  /**
   * Speak report summary (longer text)
   */
  speakReport(text: string, options: TTSOptions = {}): void {
    this.speak(text, {
      rate: 1.0,
      pitch: 1.0,
      volume: 1.0,
      ...options
    });
  }
}

// Export singleton
export const ttsService = new TextToSpeechService();

// Helper function to extract readable text from HTML/React content
export function extractTextFromElement(element: HTMLElement | null): string {
  if (!element) return '';
  return element.innerText || element.textContent || '';
}

// Helper to format numbers for speech
export function formatNumberForSpeech(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)} million`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)} thousand`;
  }
  return num.toString();
}

// Helper to format currency for speech
export function formatCurrencyForSpeech(amount: number): string {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(2)} million`;
  }
  if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(2)} thousand`;
  }
  return `$${amount.toFixed(2)}`;
}
