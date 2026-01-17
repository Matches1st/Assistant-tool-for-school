import React, { useState, useRef, useEffect } from 'react';
import { Send, Image as ImageIcon, X, Loader2 } from 'lucide-react';

interface InputAreaProps {
  onSend: (text: string, images: string[]) => void;
  isLoading: boolean;
}

const InputArea: React.FC<InputAreaProps> = ({ onSend, isLoading }) => {
  const [input, setInput] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = e.clipboardData.items;
    
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const blob = items[i].getAsFile();
        if (blob) {
          const reader = new FileReader();
          reader.onload = (event) => {
            if (typeof event.target?.result === 'string') {
              setImages(prev => [...prev, event.target!.result as string]);
            }
          };
          reader.readAsDataURL(blob);
        }
      }
    }
  };

  const handleSend = () => {
    if ((!input.trim() && images.length === 0) || isLoading) return;
    onSend(input, images);
    setInput('');
    setImages([]);
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages: string[] = [];
      Array.from(e.target.files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            setImages(prev => [...prev, reader.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
    // Reset input so same file can be selected again if needed
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 pb-6">
      <div className="bg-gemini-gray rounded-3xl p-3 shadow-lg border border-gemini-accent/30 relative">
        {/* Image Previews */}
        {images.length > 0 && (
          <div className="flex gap-3 overflow-x-auto p-2 mb-2 scrollbar-thin">
            {images.map((img, idx) => (
              <div key={idx} className="relative flex-shrink-0 group">
                <img 
                  src={img} 
                  alt={`upload-${idx}`} 
                  className="h-20 w-20 object-cover rounded-lg border border-gray-600"
                />
                <button
                  onClick={() => removeImage(idx)}
                  className="absolute -top-2 -right-2 bg-gray-800 text-white rounded-full p-1 shadow-md hover:bg-gray-700 transition-colors"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-end gap-2">
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="p-3 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors flex-shrink-0"
            title="Upload Image"
          >
            <ImageIcon size={24} />
          </button>
          <input 
            type="file" 
            multiple 
            accept="image/*" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleFileSelect} 
          />

          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            placeholder="Enter a prompt here"
            className="w-full bg-transparent text-gemini-text placeholder-gray-500 text-lg resize-none focus:outline-none py-3 max-h-[200px]"
            rows={1}
          />

          <button
            onClick={handleSend}
            disabled={(!input.trim() && images.length === 0) || isLoading}
            className={`p-3 rounded-full transition-all flex-shrink-0 ${
              (input.trim() || images.length > 0) && !isLoading
                ? 'bg-white text-gemini-dark hover:bg-gray-200'
                : 'bg-transparent text-gray-500 cursor-not-allowed'
            }`}
          >
            {isLoading ? <Loader2 className="animate-spin" size={24} /> : <Send size={24} />}
          </button>
        </div>
      </div>
      <div className="text-center text-xs text-gray-500 mt-2 flex flex-col items-center gap-1">
        <p>Gemini may display inaccurate info, so double-check its responses.</p>
        <p className="opacity-70 text-[10px] md:text-xs">
          Free keys have low daily limits (~50 msgs/day). Consider <a href="https://ai.google.dev/pricing" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-300">pay-as-you-go</a> for heavier use.
        </p>
      </div>
    </div>
  );
};

export default InputArea;