import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AIAvatar } from '@/components/common/AIAvatar';
import { ChatBubble } from '@/components/common/ChatBubble';
import { LanguageSelector } from '@/components/common/LanguageSelector';
import { VoiceCounsellingView } from '@/components/chat/VoiceCounsellingView';
import { SupportedLanguage } from '@/types/models';
import { aiChatService } from '@/services/aiChatService';
import { 
  Send, 
  Mic, 
  Trash2, 
  Headphones, 
  MessageSquare, 
  HelpCircle, 
  Plus, 
  Sparkles, 
  GraduationCap, 
  ChevronRight,
  AlertCircle
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  time: string;
  isSimulated?: boolean;
}

export const DemoPage: React.FC = () => {
  const [mode, setMode] = useState<'chat' | 'voice'>('chat');
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>('en');
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationId, setConversationId] = useState<string>('');
  const [activeModel, setActiveModel] = useState<string>('OpenAI LLM');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      sender: 'ai',
      text: "Hello! I'm your AI Admission Counsellor.\n\nI can help you discover courses that match your education, interests, and career goals.",
      time: 'Just now',
      isSimulated: false
    }
  ]);

  const recentSessions = [
    { id: '1', title: 'Computer Science & AI in Germany', date: 'Today, 2:15 PM' },
    { id: '2', title: 'Top 10 MBA Programs under ₹15 Lakhs', date: 'Yesterday' },
    { id: '3', title: 'Biotechnology Eligibility & Scope', date: '3 days ago' },
  ];

  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([
    "I have completed 12th. What can I study?",
    "Which course is best for getting a job?",
    "I want to explore technology courses.",
    "Help me choose a career path."
  ]);

  // Initialize session on mount
  useEffect(() => {
    const initSession = async () => {
      const convId = await aiChatService.createConversation(selectedLanguage);
      if (convId) {
        setConversationId(convId);
      }
    };
    initSession();
  }, [selectedLanguage]);

  // Auto-scroll to latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputVal;
    if (!text.trim()) return;

    setErrorMessage(null);
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputVal('');

    // Trigger typing indicator and query the real backend AI Chat API
    setIsTyping(true);

    try {
      let activeConvId = conversationId;
      if (!activeConvId) {
        activeConvId = await aiChatService.createConversation(selectedLanguage) || `conv_${Date.now()}`;
        setConversationId(activeConvId);
      }

      const response = await aiChatService.sendMessage({
        conversationId: activeConvId,
        message: text.trim(),
        language: selectedLanguage
      });

      if (response.success) {
        if (response.model) {
          setActiveModel(response.model);
        }
        if (response.suggestedQuestions && response.suggestedQuestions.length > 0) {
          setSuggestedQuestions(response.suggestedQuestions);
        }

        setMessages((prev) => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            sender: 'ai',
            text: response.reply,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isSimulated: response.isSimulated
          }
        ]);
      } else {
        setErrorMessage(response.message || 'Unable to generate response from AI server');
        setMessages((prev) => [
          ...prev,
          {
            id: `ai-err-${Date.now()}`,
            sender: 'ai',
            text: response.reply || "I encountered an issue connecting to the admissions knowledge service. Please try again.",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isSimulated: true
          }
        ]);
      }
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Network error');
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearConversation = async () => {
    const newConvId = await aiChatService.createConversation(selectedLanguage);
    if (newConvId) setConversationId(newConvId);

    setMessages([
      {
        id: `m-${Date.now()}`,
        sender: 'ai',
        text: "New counselling session started. Hello! I'm your AI Admission Counsellor. What degree or career pathway would you like to explore?",
        time: 'Just now',
        isSimulated: false
      }
    ]);
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-6 h-[calc(100vh-4rem)] flex flex-col">
      {/* Top Banner Status */}
      <div className="bg-indigo-50/70 border border-indigo-100 text-indigo-900 px-4 py-2 rounded-xl text-xs flex items-center justify-between mb-4 shadow-2xs">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary flex-shrink-0" />
          <span>
            <strong>AI Admission Counsellor Active:</strong> Powered by OpenAI responses API with verified Supabase course data and real-time state extraction.
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-[10px] bg-white border-indigo-200">
            {activeModel}
          </Badge>
        </div>
      </div>

      {errorMessage && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 px-4 py-2 rounded-xl text-xs flex items-center gap-2 mb-4">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Container Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
        {/* Left Panel: Sidebar (Conversations, Language, Support) */}
        <div className="hidden lg:flex lg:col-span-3 flex-col bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 overflow-hidden">
          {/* Header Brand */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="font-bold text-sm text-slate-900">Student Space</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={clearConversation}
              className="h-8 px-2 text-xs text-slate-500 hover:text-rose-600 border-slate-200"
              title="New Conversation"
            >
              <Plus className="w-3.5 h-3.5" />
            </Button>
          </div>

          {/* New Chat Button */}
          <Button
            onClick={clearConversation}
            className="w-full mt-3 gap-2 text-xs font-semibold h-9 shadow-sm"
          >
            <Plus className="w-4 h-4" /> Start New Session
          </Button>

          {/* Language Selector in Sidebar */}
          <div className="mt-4 pt-3 border-t border-slate-100">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1.5">
              Select Counselling Language
            </label>
            <LanguageSelector
              selectedLanguage={selectedLanguage}
              onLanguageChange={setSelectedLanguage}
              className="w-full"
            />
          </div>

          {/* Recent Conversations */}
          <div className="flex-1 overflow-y-auto mt-4 space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-2 px-1">
              Recent Inquiries
            </span>
            {recentSessions.map((session) => (
              <button
                key={session.id}
                onClick={() => handleSendMessage(session.title)}
                className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200/80 transition-all text-xs group"
              >
                <div className="font-medium text-slate-800 truncate group-hover:text-primary">
                  {session.title}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">{session.date}</div>
              </button>
            ))}
          </div>

          {/* Help & Support Card */}
          <div className="mt-4 pt-3 border-t border-slate-100 bg-slate-50 p-3 rounded-xl border border-slate-200/60">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 mb-1">
              <HelpCircle className="w-4 h-4 text-primary" />
              <span>Need Human Guidance?</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed mb-2">
              Book a scheduled callback with our admissions counsellors.
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleSendMessage("I would like to request a callback from a human admission counsellor.")}
              className="w-full text-xs h-7 bg-white"
            >
              Request Callback
            </Button>
          </div>
        </div>

        {/* Main Panel: Chat or Voice Interface */}
        <div className="lg:col-span-9 flex flex-col h-full min-h-0">
          {mode === 'voice' ? (
            <VoiceCounsellingView
              onSwitchToChat={() => setMode('chat')}
              selectedLanguage={selectedLanguage}
              onLanguageChange={setSelectedLanguage}
              conversationId={conversationId}
              onNewMessageFromVoice={(userText, aiText) => {
                setMessages((prev) => [
                  ...prev,
                  {
                    id: `u-${Date.now()}`,
                    sender: 'user',
                    text: userText,
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  },
                  {
                    id: `ai-${Date.now() + 1}`,
                    sender: 'ai',
                    text: aiText,
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  }
                ]);
              }}
            />
          ) : (
            <div className="flex flex-col h-full bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
              {/* Conversation Top Header */}
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white">
                <div className="flex items-center gap-3">
                  <AIAvatar size="md" isSpeaking={isTyping} />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-slate-900">AI Student Admission Counsellor</h3>
                      <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Online
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">Advisory for Courses, Eligibility, and Institutional Admissions</p>
                  </div>
                </div>

                {/* Right controls: Mode Switch & Clear */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                    <button
                      type="button"
                      onClick={() => setMode('chat')}
                      className="px-3 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all bg-white text-primary shadow-sm"
                    >
                      <MessageSquare className="w-3.5 h-3.5" /> Chat
                    </button>
                    <button
                      type="button"
                      onClick={() => setMode('voice')}
                      className="px-3 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all text-slate-600 hover:text-slate-900"
                    >
                      <Headphones className="w-3.5 h-3.5 text-secondary" /> Voice Mode
                    </button>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={clearConversation}
                    className="h-8 w-8 text-slate-400 hover:text-rose-600"
                    title="Clear Conversation"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Chat Message Scroll Area */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/50 space-y-4">
                {/* Welcome Card Box */}
                <div className="bg-gradient-to-r from-primary-50 via-indigo-50/50 to-white p-5 rounded-2xl border border-primary-100 mb-6 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        Hello! I&apos;m your AI Admission Counsellor.
                      </h4>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        I can help you discover courses that match your education, interests, and career goals. Pick a suggested question or write below:
                      </p>
                    </div>
                  </div>

                  {/* Suggested Question Pills */}
                  <div className="grid sm:grid-cols-2 gap-2 mt-4 pt-3 border-t border-primary-100/60">
                    {suggestedQuestions.map((q, i) => (
                      <button
                        key={i}
                        onClick={() => handleSendMessage(q)}
                        className="text-left text-xs bg-white hover:bg-primary-50 text-slate-700 hover:text-primary font-medium p-2.5 rounded-xl border border-slate-200/80 hover:border-primary/30 transition-all flex items-center justify-between shadow-2xs group"
                      >
                        <span className="truncate">{q}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-primary flex-shrink-0 ml-1" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Message Bubble Feed */}
                {messages.map((msg) => (
                  <ChatBubble
                    key={msg.id}
                    sender={msg.sender}
                    text={msg.text}
                    time={msg.time}
                    isSimulated={Boolean(msg.isSimulated)}
                  />
                ))}

                {/* Animated Typing Indicator */}
                {isTyping && (
                  <div className="flex items-center gap-2 p-3 bg-white rounded-2xl border border-slate-200 w-28 text-slate-400">
                    <span className="w-2 h-2 rounded-full bg-primary animate-bounce"></span>
                    <span className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:0.4s]"></span>
                    <span className="text-[10px] text-slate-400 ml-1">typing</span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Message Input Bottom Bar */}
              <div className="p-3 sm:p-4 bg-white border-t border-slate-100">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-center gap-2"
                >
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setMode('voice')}
                    className="h-10 w-10 text-slate-500 hover:text-primary rounded-xl flex-shrink-0"
                    title="Switch to Voice Mode"
                  >
                    <Mic className="w-4 h-4" />
                  </Button>

                  <div className="flex-1 relative">
                    <textarea
                      value={inputVal}
                      onChange={(e) => setInputVal(e.target.value)}
                      onKeyDown={handleKeyDown}
                      rows={1}
                      placeholder="Ask about courses, fees, eligibility, or entrance exams... (Enter to send, Shift+Enter for new line)"
                      className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary max-h-32 shadow-2xs"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={!inputVal.trim() || isTyping}
                    className="h-10 px-4 rounded-xl gap-1.5 text-xs font-semibold shadow-sm flex-shrink-0"
                  >
                    <Send className="w-4 h-4" />
                    <span className="hidden sm:inline">Send</span>
                  </Button>
                </form>

                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 px-1">
                  <span>Press <kbd className="px-1 py-0.5 bg-slate-100 rounded text-[10px] border border-slate-200">Enter</kbd> to send</span>
                  <span className="text-indigo-600 font-medium">Active Language: {selectedLanguage.toUpperCase()}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
