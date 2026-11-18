// Speech Recognition & Synthesis Declarations
export interface SpeechRecognitionEventLike {
  resultIndex: number;
  results: {
    length: number;
    [index: number]: {
      isFinal: boolean;
      length: number;
      [index: number]: {
        transcript: string;
        confidence: number;
      };
    };
  };
}

export interface SpeechRecognitionErrorEventLike {
  error: string;
  message?: string;
}

export interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
  }
}

export const getLanguageBcp47 = (langCode: string): string => {
  switch (langCode) {
    case 'hi':
      return 'hi-IN';
    case 'gu':
      return 'gu-IN';
    case 'mr':
      return 'mr-IN';
    case 'bn':
      return 'bn-IN';
    case 'ta':
      return 'ta-IN';
    case 'te':
      return 'te-IN';
    case 'kn':
      return 'kn-IN';
    case 'ml':
      return 'ml-IN';
    case 'pa':
      return 'pa-IN';
    case 'en':
    default:
      return 'en-IN';
  }
};

export const isSpeechRecognitionSupported = (): boolean => {
  return typeof window !== 'undefined' && Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
};

export const isSpeechSynthesisSupported = (): boolean => {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
};

export const createSpeechRecognition = (langCode: string): SpeechRecognitionInstance | null => {
  if (typeof window === 'undefined') return null;
  const SpeechRecognitionConstructor = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognitionConstructor) return null;

  const recognition = new SpeechRecognitionConstructor();
  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.lang = getLanguageBcp47(langCode);
  return recognition;
};

/**
 * Text-to-speech helper that selects the most fitting voice for the given language
 */
export const speakText = (
  text: string, 
  langCode: string, 
  options?: {
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (err: unknown) => void;
  }
): SpeechSynthesisUtterance | null => {
  if (!isSpeechSynthesisSupported()) {
    options?.onEnd?.();
    return null;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  // Strip markdown formatting symbols like asterisks, hashtags, backticks
  const cleanedText = text
    .replace(/[*#`_~]/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\n+/g, '. ')
    .trim();

  if (!cleanedText) {
    options?.onEnd?.();
    return null;
  }

  const utterance = new SpeechSynthesisUtterance(cleanedText);
  const targetBcp = getLanguageBcp47(langCode);
  utterance.lang = targetBcp;
  utterance.rate = 1.0;
  utterance.pitch = 1.05;

  const voices = window.speechSynthesis.getVoices();
  const matchedVoice = voices.find((v) => v.lang === targetBcp || v.lang.startsWith(targetBcp.split('-')[0]))
    || voices.find((v) => v.lang.includes('IN'))
    || voices.find((v) => v.lang.startsWith('en'));

  if (matchedVoice) {
    utterance.voice = matchedVoice;
  }

  utterance.onstart = () => {
    options?.onStart?.();
  };

  utterance.onend = () => {
    options?.onEnd?.();
  };

  utterance.onerror = (e) => {
    options?.onError?.(e);
    options?.onEnd?.();
  };

  window.speechSynthesis.speak(utterance);
  return utterance;
};

export const stopSpeech = () => {
  if (isSpeechSynthesisSupported()) {
    window.speechSynthesis.cancel();
  }
};
