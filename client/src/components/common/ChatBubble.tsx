import React from 'react';
import { User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AIAvatar } from './AIAvatar';

export interface ChatBubbleProps {
  sender: 'ai' | 'user';
  text: string;
  time: string;
  isSimulated?: boolean;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({
  sender,
  text,
  time,
  isSimulated = true
}) => {
  const isUser = sender === 'user';

  return (
    <div className={cn('flex items-start gap-3 my-3', isUser ? 'flex-row-reverse' : 'flex-row')}>
      {isUser ? (
        <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center flex-shrink-0 text-xs shadow-sm">
          <User className="w-4 h-4" />
        </div>
      ) : (
        <AIAvatar size="sm" />
      )}

      <div className={cn('max-w-[85%] sm:max-w-[70%] space-y-1', isUser ? 'text-right' : 'text-left')}>
        <div
          className={cn(
            'inline-block px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm transition-all',
            isUser
              ? 'bg-primary text-white rounded-tr-sm text-left'
              : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-sm text-left'
          )}
        >
          <p className="whitespace-pre-wrap">{text}</p>
        </div>

        <div className={cn('flex items-center gap-1.5 px-1 text-[11px] text-slate-400', isUser ? 'justify-end' : 'justify-start')}>
          <span>{time}</span>
          {!isUser && isSimulated && (
            <span className="inline-flex items-center gap-0.5 text-[10px] text-indigo-500 font-medium">
              &bull; Simulated AI
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
