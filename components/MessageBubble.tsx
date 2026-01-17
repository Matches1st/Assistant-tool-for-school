import React from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Bot, User, Copy, Check } from 'lucide-react';
import { ChatMessage, GroundingChunk } from '../types';

interface MessageBubbleProps {
  message: ChatMessage;
  onImageClick?: (src: string) => void;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, onImageClick }) => {
  const isUser = message.role === 'user';
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex gap-4 mb-8 w-full max-w-4xl mx-auto px-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isUser ? 'bg-gemini-user' : 'bg-transparent'}`}>
        {isUser ? (
          <User size={18} className="text-white" />
        ) : (
          <div className="relative w-8 h-8">
            <img src="https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690345.svg" alt="Gemini" className="w-full h-full" />
            {message.isStreaming && (
              <div className="absolute inset-0 animate-pulse bg-white/20 rounded-full"></div>
            )}
          </div>
        )}
      </div>

      <div className={`flex-1 min-w-0 flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
        <div className={`relative group ${isUser ? '' : 'w-full'}`}>
          {/* User Images */}
          {message.images && message.images.length > 0 && (
             <div className="flex flex-wrap gap-2 mb-3 justify-end">
               {message.images.map((img, idx) => (
                 <img 
                   key={idx} 
                   src={img} 
                   alt="User upload" 
                   onClick={() => onImageClick?.(img)}
                   className="max-w-[200px] max-h-[200px] rounded-xl border border-gray-700 object-cover cursor-pointer hover:opacity-90 transition-opacity" 
                 />
               ))}
             </div>
          )}

          {/* Text Content */}
          <div className={`prose prose-invert max-w-none break-words ${isUser ? 'bg-gemini-user px-5 py-3 rounded-3xl rounded-tr-sm text-base' : 'text-base leading-7'}`}>
             <Markdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  a: ({node, ...props}) => <a {...props} target="_blank" rel="noopener noreferrer" className="text-gemini-blue hover:underline" />
                }}
             >
               {message.text}
             </Markdown>
          </div>

          {/* Grounding Sources (Search Results) */}
          {message.groundingSources && message.groundingSources.length > 0 && !isUser && (
            <div className="mt-4 pt-3 border-t border-gemini-accent/30">
              <p className="text-sm text-gray-400 mb-2">Sources</p>
              <div className="flex flex-wrap gap-2">
                {message.groundingSources.map((source, idx) => {
                   if (!source.web?.uri) return null;
                   return (
                    <a 
                      key={idx}
                      href={source.web.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-gemini-gray hover:bg-gemini-accent/50 px-3 py-2 rounded-full text-xs transition-colors border border-gemini-accent/30 max-w-full truncate"
                    >
                      <div className="w-4 h-4 rounded-full bg-gray-700 flex-shrink-0 flex items-center justify-center text-[8px]">
                        {idx + 1}
                      </div>
                      <span className="truncate max-w-[150px]">{source.web.title}</span>
                    </a>
                   );
                })}
              </div>
            </div>
          )}

          {/* Action Buttons (Copy) */}
          {!isUser && !message.isStreaming && (
            <div className="mt-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={handleCopy}
                className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors"
                title="Copy response"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;