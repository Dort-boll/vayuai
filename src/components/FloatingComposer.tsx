import { useState, useRef, useEffect } from 'react';
import { Plus, ArrowUp, Square, Mic, MicOff, Globe, Image as ImageIcon, BrainCircuit, X, FileText } from 'lucide-react';
import PlusMenu from './PlusMenu';
import { AttachmentItem, ToolMode } from '../types';

interface FloatingComposerProps {
  onSendMessage: (params: {
    content: string;
    toolMode: ToolMode;
    attachments: AttachmentItem[];
  }) => void;
  isLoading: boolean;
  onStopGeneration?: () => void;
}

export default function FloatingComposer({
  onSendMessage,
  isLoading,
  onStopGeneration,
}: FloatingComposerProps) {
  const [input, setInput] = useState('');
  const [toolMode, setToolMode] = useState<ToolMode>('chat');
  const [attachments, setAttachments] = useState<AttachmentItem[]>([]);
  const [isPlusMenuOpen, setIsPlusMenuOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto-resize textarea smoothly without glitching
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(Math.max(scrollHeight, 44), 200)}px`;
    }
  }, [input]);

  // Web Speech API for voice dictation
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            transcript += event.results[i][0].transcript;
          }
        }
        if (transcript) {
          setInput(prev => (prev ? `${prev} ${transcript.trim()}` : transcript.trim()));
        }
      };

      recognition.onerror = (err: any) => {
        console.warn('Speech recognition notice:', err);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.warn("Failed to start voice recognition:", err);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newAttachments: AttachmentItem[] = [];
    Array.from(files).forEach(file => {
      const isImg = file.type.startsWith('image/');
      newAttachments.push({
        id: Math.random().toString(36).substring(7),
        name: file.name,
        type: file.type || 'file',
        size: file.size,
        previewUrl: isImg ? URL.createObjectURL(file) : undefined,
        isImage: isImg,
      });
    });

    setAttachments(prev => [...prev, ...newAttachments]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(a => a.id !== id));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if ((!input.trim() && attachments.length === 0) || isLoading) return;

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    onSendMessage({
      content: input.trim(),
      toolMode,
      attachments,
    });

    setInput('');
    setAttachments([]);
    if (toolMode === 'image') {
      setToolMode('chat');
    }
  };

  const placeholderText =
    toolMode === 'image'
      ? 'Describe the image to generate...'
      : toolMode === 'search'
      ? 'Search the web with Vayu AI...'
      : toolMode === 'reasoning'
      ? 'Ask for deep analytical reasoning...'
      : 'Message Vayu AI...';

  const hasContent = input.trim().length > 0 || attachments.length > 0;

  return (
    <div className="w-full max-w-3xl mx-auto px-4 pb-3">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        multiple
        className="hidden"
        accept="image/*,text/*,application/pdf"
      />

      <div className="relative rounded-[28px] bg-[#212121] border border-[#383838] shadow-[0_12px_45px_rgba(0,0,0,0.65)] focus-within:border-[#525252] transition-all duration-200">
        
        {/* Attachment Previews */}
        {attachments.length > 0 && (
          <div className="flex items-center gap-2 px-4 pt-3.5 pb-1 overflow-x-auto custom-scrollbar">
            {attachments.map(att => (
              <div
                key={att.id}
                className="relative group flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-[#2b2b2b] border border-[#404040] shrink-0 text-xs text-[#F5F5F5]"
              >
                {att.isImage && att.previewUrl ? (
                  <img
                    src={att.previewUrl}
                    alt={att.name}
                    className="w-7 h-7 rounded-lg object-cover"
                  />
                ) : (
                  <FileText size={16} className="text-zinc-400" />
                )}
                <span className="max-w-[120px] truncate font-medium">{att.name}</span>
                <button
                  type="button"
                  onClick={() => removeAttachment(att.id)}
                  className="p-0.5 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                >
                  <X size={13} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Active Tool Chip Indicator */}
        {toolMode !== 'chat' && (
          <div className="flex items-center gap-2 px-4 pt-3 pb-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border bg-[#181818] border-[#333333]">
              {toolMode === 'search' && (
                <>
                  <Globe size={13} className="text-sky-400" />
                  <span className="text-sky-300">Web Search Active</span>
                </>
              )}
              {toolMode === 'image' && (
                <>
                  <ImageIcon size={13} className="text-cyan-400" />
                  <span className="text-cyan-300">Image Generation Mode</span>
                </>
              )}
              {toolMode === 'reasoning' && (
                <>
                  <BrainCircuit size={13} className="text-emerald-400" />
                  <span className="text-emerald-300">Deep Reasoning Mode</span>
                </>
              )}
              <button
                type="button"
                onClick={() => setToolMode('chat')}
                className="ml-1 p-0.5 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white"
              >
                <X size={12} />
              </button>
            </div>
          </div>
        )}

        {/* Textarea Field - Auto-expanding and Smooth */}
        <textarea
          ref={textareaRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholderText}
          rows={1}
          className="w-full bg-transparent px-5 pt-3.5 pb-2 text-[15px] text-[#F5F5F5] placeholder-[#737373] outline-none resize-none min-h-[48px] max-h-[200px] leading-relaxed custom-scrollbar font-normal"
        />

        {/* Bottom Composer Toolbar */}
        <div className="flex items-center justify-between px-3.5 pb-3 pt-1">
          {/* Left: Plus Button & Popover */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsPlusMenuOpen(prev => !prev)}
              aria-label="Add tools or attachments"
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                isPlusMenuOpen
                  ? 'bg-[#3b3b3b] text-[#F5F5F5] rotate-45'
                  : 'bg-[#2b2b2b] text-[#A3A3A3] hover:text-[#F5F5F5] hover:bg-[#383838]'
              }`}
            >
              <Plus size={18} className="transition-transform duration-200" />
            </button>

            {/* Plus Menu Popover */}
            <PlusMenu
              isOpen={isPlusMenuOpen}
              onClose={() => setIsPlusMenuOpen(false)}
              onSelectUpload={() => fileInputRef.current?.click()}
              onToggleImageGen={() => setToolMode(prev => (prev === 'image' ? 'chat' : 'image'))}
              onToggleWebSearch={() => setToolMode(prev => (prev === 'search' ? 'chat' : 'search'))}
              onToggleReasoning={() => setToolMode(prev => (prev === 'reasoning' ? 'chat' : 'reasoning'))}
              isImageGenActive={toolMode === 'image'}
              isWebSearchActive={toolMode === 'search'}
              isReasoningActive={toolMode === 'reasoning'}
            />
          </div>

          {/* Right: Voice Input & The White Box Arrow in Lite Blue Color */}
          <div className="flex items-center gap-2">
            {/* Real Web Speech Voice Dictation */}
            <button
              type="button"
              onClick={toggleVoiceInput}
              title={isListening ? 'Stop listening' : 'Dictate with voice'}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                isListening
                  ? 'bg-rose-500 text-white animate-pulse shadow-lg shadow-rose-500/30'
                  : 'bg-transparent text-[#737373] hover:text-[#F5F5F5] hover:bg-[#2b2b2b]'
              }`}
            >
              {isListening ? <MicOff size={16} /> : <Mic size={16} />}
            </button>

            {/* Primary Action Button: White Box with Lite Blue Arrow */}
            {isLoading ? (
              <button
                type="button"
                onClick={onStopGeneration}
                title="Stop response"
                className="w-9 h-9 rounded-xl bg-white hover:bg-slate-100 shadow-md flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Square size={13} className="fill-sky-400 text-sky-400" />
              </button>
            ) : hasContent ? (
              <button
                type="button"
                onClick={() => handleSubmit()}
                title="Send message"
                className="w-9 h-9 rounded-xl bg-white hover:bg-slate-100 shadow-md flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <ArrowUp size={19} strokeWidth={2.75} className="text-sky-400" />
              </button>
            ) : (
              <button
                type="button"
                disabled
                title="Send message"
                className="w-9 h-9 rounded-xl bg-white/15 text-sky-300/40 flex items-center justify-center cursor-not-allowed transition-all"
              >
                <ArrowUp size={19} strokeWidth={2.5} className="text-sky-300/40" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Subtle Bottom Assurance in ChatGPT Style */}
      <div className="mt-2 text-center text-[11px] text-[#737373] flex items-center justify-center gap-1.5 select-none">
        <span>Vayu AI v6.1 can make mistakes. Verify critical facts & reasoning.</span>
      </div>
    </div>
  );
}
