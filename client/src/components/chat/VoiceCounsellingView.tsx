import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { AIAvatar } from '@/components/common/AIAvatar';
import { 
  Mic, 
  MicOff, 
  PhoneOff, 
  Volume2, 
  Sparkles, 
  Radio, 
  MessageSquare,
  AlertCircle,
  RotateCcw
} from 'lucide-react';
import { SupportedLanguage } from '@/types/models';
import { LanguageSelector } from '@/components/common/LanguageSelector';
import { aiChatService } from '@/services/aiChatService';
import { 
  createSpeechRecognition, 
  speakText, 
  stopSpeech, 
  isSpeechRecognitionSupported, 
  isSpeechSynthesisSupported,
  SpeechRecognitionInstance 
} from '@/services/voiceService';

export interface VoiceCounsellingViewProps {
  onSwitchToChat: () => void;
  selectedLanguage: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  conversationId?: string;
  onNewMessageFromVoice?: (userText: string, aiText: string) => void;
}

interface TranscriptItem {
  speaker: 'ai' | 'student';
  text: string;
  time: string;
}

export const VoiceCounsellingView: React.FC<VoiceCounsellingViewProps> = ({
  onSwitchToChat,
  selectedLanguage,
  onLanguageChange,
  conversationId: initialConvId,
  onNewMessageFromVoice
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [voiceState, setVoiceState] = useState<'idle' | 'listening' | 'processing' | 'speaking'>('idle');
  const [liveSpeechText, setLiveSpeechText] = useState('');
  const [convId, setConvId] = useState<string>(initialConvId || '');
  const [voiceError, setVoiceError] = useState<string | null>(null);

  const [transcript, setTranscript] = useState<TranscriptItem[]>([
    {
      speaker: 'ai',
      text: "Namaste! I am your AI Admission Counsellor. What degree or career pathway would you like to explore today?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const transcriptBottomRef = useRef<HTMLDivElement>(null);
  const isMutedRef = useRef(isMuted);
  isMutedRef.current = isMuted;

  // Scroll transcript to bottom
  useEffect(() => {
    transcriptBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript, liveSpeechText]);

  // Check browser speech recognition support
  useEffect(() => {
    const supported = isSpeechRecognitionSupported();
    if (!supported) {
      setVoiceError("Your browser doesn't natively support Web Speech Recognition. You can still use the audio controls & simulated queries, or switch to Chrome/Edge for real microphone recognition.");
    }
  }, []);

  // Initialize conversation session for voice channel
  useEffect(() => {
    let isMounted = true;
    const init = async () => {
      if (!convId) {
        const id = await aiChatService.createConversation(selectedLanguage, 'voice');
        if (isMounted && id) {
          setConvId(id);
        }
      }
    };
    init();
    return () => {
      isMounted = false;
    };
  }, [selectedLanguage, convId]);

  // Speak initial greeting once on component mount if user isn't muted
  useEffect(() => {
    if (isSpeechSynthesisSupported() && !isMuted) {
      speakText(
        "Namaste! I am your AI Admission Counsellor. What degree or career pathway would you like to explore today?",
        selectedLanguage,
        {
          onStart: () => setVoiceState('speaking'),
          onEnd: () => setVoiceState('idle')
        }
      );
    }
    return () => {
      stopSpeech();
    };
  }, []);

  // Send student voice query to backend AI
  const processVoiceInput = useCallback(async (spokenText: string) => {
    if (!spokenText.trim()) {
      setVoiceState('idle');
      return;
    }

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setTranscript((prev) => [
      ...prev,
      { speaker: 'student', text: spokenText, time: timeStr }
    ]);
    setLiveSpeechText('');
    setVoiceState('processing');

    try {
      const activeId = convId || `conv_voice_${Date.now()}`;
      const response = await aiChatService.sendMessage({
        conversationId: activeId,
        message: spokenText,
        language: selectedLanguage
      });

      const replyText = response.success
        ? response.reply
        : "I can help you with degree options, eligibility, fees, and career pathways. Could you repeat that or specify what field interests you?";

      setTranscript((prev) => [
        ...prev,
        {
          speaker: 'ai',
          text: replyText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);

      if (onNewMessageFromVoice) {
        onNewMessageFromVoice(spokenText, replyText);
      }

      // Voice synthesize AI response
      if (!isMutedRef.current && isSpeechSynthesisSupported()) {
        speakText(replyText, selectedLanguage, {
          onStart: () => setVoiceState('speaking'),
          onEnd: () => {
            setVoiceState('idle');
          },
          onError: () => setVoiceState('idle')
        });
      } else {
        setVoiceState('idle');
      }
    } catch {
      setVoiceState('idle');
    }
  }, [convId, selectedLanguage, onNewMessageFromVoice]);

  // Start speech recognition listening
  const startListening = useCallback(() => {
    stopSpeech();
    setVoiceError(null);

    if (!isSpeechRecognitionSupported()) {
      // Browser fallback simulation
      setVoiceState('listening');
      return;
    }

    try {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }

      const recognition = createSpeechRecognition(selectedLanguage);
      if (!recognition) return;

      recognition.onstart = () => {
        setVoiceState('listening');
        setLiveSpeechText('');
      };

      recognition.onresult = (event) => {
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const trans = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            final += trans;
          } else {
            interim += trans;
          }
        }

        if (interim) {
          setLiveSpeechText(interim);
        }

        if (final.trim()) {
          setLiveSpeechText(final);
          recognition.stop();
          processVoiceInput(final.trim());
        }
      };

      recognition.onerror = (e) => {
        if (e.error !== 'no-speech') {
          console.warn('[Speech Recognition Warning]:', e.error);
        }
        setVoiceState('idle');
      };

      recognition.onend = () => {
        if (voiceState === 'listening') {
          setVoiceState('idle');
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: unknown) {
      console.warn('Speech recognition start failed:', err);
      setVoiceState('idle');
    }
  }, [selectedLanguage, processVoiceInput, voiceState]);

  // Stop listening
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    }
    setVoiceState('idle');
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopSpeech();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  // Handle Mute toggle
  const toggleMute = () => {
    if (!isMuted) {
      stopSpeech();
      if (voiceState === 'speaking') {
        setVoiceState('idle');
      }
    }
    setIsMuted(!isMuted);
  };

  // Quick preset voice simulation prompts for quick testing or fallback browsers
  const runSimulatedPrompt = (promptText: string) => {
    stopSpeech();
    processVoiceInput(promptText);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
      {/* Voice Session Header */}
      <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/20 text-primary-400 border border-primary-500/30 flex items-center justify-center">
            <Radio className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">Live AI Voice Counselling</h3>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                voiceState === 'listening'
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 animate-pulse'
                  : voiceState === 'speaking'
                  ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30 animate-pulse'
                  : voiceState === 'processing'
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                  : 'bg-slate-800 text-slate-300 border-slate-700'
              }`}>
                {voiceState === 'listening' ? 'Listening...' : voiceState === 'speaking' ? 'Speaking...' : voiceState === 'processing' ? 'Thinking...' : 'Ready'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Speak in your language; the counsellor answers back in voice</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <LanguageSelector
            selectedLanguage={selectedLanguage}
            onLanguageChange={(lang) => {
              onLanguageChange(lang);
              stopSpeech();
            }}
            className="text-slate-900"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              stopSpeech();
              onSwitchToChat();
            }}
            className="text-xs bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700 h-8 gap-1.5"
          >
            <MessageSquare className="w-3.5 h-3.5" /> Switch to Text Chat
          </Button>
        </div>
      </div>

      {voiceError && (
        <div className="px-4 py-2 bg-amber-500/10 border-b border-amber-500/20 text-amber-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{voiceError}</span>
        </div>
      )}

      {/* Main Voice Visualizer Stage */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900">
        {/* Visualizer Ambient Background Glow */}
        <div className={`absolute w-80 h-80 rounded-full blur-3xl pointer-events-none transition-all duration-700 ${
          voiceState === 'listening'
            ? 'bg-emerald-500/20 scale-125'
            : voiceState === 'speaking'
            ? 'bg-indigo-500/20 scale-125'
            : 'bg-primary/10'
        }`}></div>

        {/* Large Animated AI Avatar */}
        <div className="relative mb-6">
          <AIAvatar
            size="xl"
            isSpeaking={voiceState === 'speaking'}
            isListening={voiceState === 'listening'}
            mode="voice"
          />
        </div>

        {/* Status Callout */}
        <div className="text-center space-y-1 mb-6 z-10 max-w-md">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-xs font-medium text-slate-200 shadow-lg">
            {voiceState === 'speaking' ? (
              <>
                <Volume2 className="w-4 h-4 text-indigo-400 animate-bounce" />
                <span>AI Counsellor is speaking...</span>
              </>
            ) : voiceState === 'listening' ? (
              <>
                <Mic className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span>Listening to you... Click mic when done</span>
              </>
            ) : voiceState === 'processing' ? (
              <>
                <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
                <span>AI is formulating guidance...</span>
              </>
            ) : (
              <>
                <Radio className="w-4 h-4 text-primary-400" />
                <span>Click &quot;Start Speaking&quot; or tap the Mic button</span>
              </>
            )}
          </div>

          {liveSpeechText && (
            <div className="mt-2 text-xs text-emerald-300 italic bg-emerald-950/40 border border-emerald-800/40 px-3 py-1.5 rounded-lg animate-pulse">
              &quot;{liveSpeechText}&quot;
            </div>
          )}

          <p className="text-[11px] text-slate-400 pt-1">
            Real speech recognition (STT) and natural voice synthesis (TTS) enabled for English, Hindi, and regional languages.
          </p>
        </div>

        {/* Sound Wave Animation Bars */}
        <div className="flex items-center gap-1.5 h-10 mb-6">
          {[...Array(18)].map((_, i) => (
            <span
              key={i}
              className={`w-1 rounded-full transition-all duration-150 ${
                voiceState === 'speaking'
                  ? 'bg-gradient-to-t from-primary to-indigo-400 animate-wave-1'
                  : voiceState === 'listening'
                  ? 'bg-emerald-400 animate-wave-3'
                  : 'bg-slate-700 h-2'
              }`}
              style={{
                animationDelay: `${(i % 6) * 0.12}s`,
                height: voiceState === 'idle' ? '4px' : undefined
              }}
            />
          ))}
        </div>

        {/* Suggested Voice Prompts */}
        <div className="w-full max-w-xl mb-4 flex items-center justify-center gap-2 flex-wrap">
          <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
            Quick Voice Queries:
          </span>
          {[
            "What courses can I do after 12th?",
            "Tell me about BCA and MCA fees",
            "Are there any scholarship schemes?"
          ].map((q, idx) => (
            <button
              key={idx}
              onClick={() => runSimulatedPrompt(q)}
              className="text-[11px] px-2.5 py-1 rounded-full bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all truncate max-w-[200px]"
            >
              &quot;{q}&quot;
            </button>
          ))}
        </div>

        {/* Live Transcript Drawer */}
        <div className="w-full max-w-xl bg-slate-950/80 border border-slate-800 rounded-xl p-4 max-h-40 overflow-y-auto space-y-2 text-xs">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 pb-1.5 border-b border-slate-800 flex items-center justify-between">
            <span>Voice Conversation Transcript</span>
            <span className="text-emerald-400 text-[10px]">Active Session</span>
          </div>
          {transcript.map((item, idx) => (
            <div key={idx} className="flex items-start gap-2 text-slate-300">
              <span className={`font-semibold uppercase text-[10px] ${item.speaker === 'ai' ? 'text-primary-400' : 'text-emerald-400'}`}>
                {item.speaker === 'ai' ? 'AI' : 'You'}:
              </span>
              <p className="flex-1 text-slate-200">{item.text}</p>
              <span className="text-[10px] text-slate-500 whitespace-nowrap">{item.time}</span>
            </div>
          ))}
          <div ref={transcriptBottomRef} />
        </div>
      </div>

      {/* Voice Controls Bar */}
      <div className="p-4 sm:p-5 bg-slate-950 border-t border-slate-800 flex items-center justify-center gap-4">
        {/* Toggle Mute / Speaker */}
        <Button
          variant="outline"
          size="icon"
          onClick={toggleMute}
          className={`h-12 w-12 rounded-full border-slate-700 ${
            isMuted 
              ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 hover:bg-rose-500/30' 
              : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
          }`}
          title={isMuted ? 'Unmute Audio Voice' : 'Mute Audio Voice'}
        >
          {isMuted ? <MicOff className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </Button>

        {/* Main Mic Push-to-Talk / Toggle */}
        {voiceState === 'listening' ? (
          <Button
            size="default"
            onClick={stopListening}
            className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white px-7 font-semibold shadow-lg shadow-emerald-900/30 h-12 gap-2 animate-pulse"
          >
            <Mic className="w-5 h-5 text-white" />
            <span>Done Speaking</span>
          </Button>
        ) : (
          <Button
            size="default"
            onClick={startListening}
            disabled={voiceState === 'processing'}
            className="rounded-full bg-primary hover:bg-primary-600 text-white px-7 font-semibold shadow-lg shadow-primary/25 h-12 gap-2"
          >
            <Mic className="w-5 h-5" />
            <span>Start Speaking</span>
          </Button>
        )}

        {/* Replay Last AI Speech */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => {
            const lastAiMsg = [...transcript].reverse().find(t => t.speaker === 'ai');
            if (lastAiMsg && !isMuted) {
              speakText(lastAiMsg.text, selectedLanguage, {
                onStart: () => setVoiceState('speaking'),
                onEnd: () => setVoiceState('idle')
              });
            }
          }}
          className="h-12 w-12 rounded-full bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
          title="Replay Last AI Voice"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>

        {/* End Voice Call */}
        <Button
          variant="destructive"
          size="icon"
          onClick={() => {
            stopSpeech();
            onSwitchToChat();
          }}
          className="h-12 w-12 rounded-full bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-900/30"
          title="End Voice Mode & Return to Chat"
        >
          <PhoneOff className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};
