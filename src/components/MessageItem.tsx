import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  Copy,
  Check,
  RotateCw,
  Volume2,
  VolumeX,
  ThumbsUp,
  ThumbsDown,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Download,
  Brain,
  FileText,
  Pencil,
  Sparkles,
} from 'lucide-react';
import CodeBlock from './CodeBlock';
import { Message } from '../types';

interface MessageItemProps {
  message: Message;
  onRegenerate?: (messageId: string) => void;
  onEditPrompt?: (content: string) => void;
}

export default function MessageItem({
  message,
  onRegenerate,
  onEditPrompt,
}: MessageItemProps) {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);
  const [isReasoningOpen, setIsReasoningOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy message:', err);
    }
  };

  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(message.content);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  const handleDownloadImage = (url: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = `vayu-image-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className={`w-full py-2.5 group ${isUser ? 'flex justify-end' : 'flex justify-start'}`}>
      <div className={`flex gap-3 md:gap-4 max-w-3xl w-full ${isUser ? 'justify-end' : 'justify-start'}`}>
        
        {/* Assistant Avatar in ChatGPT Style */}
        {!isUser && (
          <div className="w-8 h-8 rounded-full bg-[#262626] border border-[#383838] overflow-hidden shrink-0 flex items-center justify-center p-0.5 shadow-sm mt-0.5">
            <img
              src="/logo.png"
              alt="Vayu AI"
              className="w-full h-full object-cover rounded-full"
              onError={e => {
                (e.target as HTMLImageElement).src = 'https://api.dicebear.com/7.x/bottts/svg?seed=vayu';
              }}
            />
          </div>
        )}

        <div className={`flex-1 min-w-0 ${isUser ? 'max-w-[85%] md:max-w-[75%]' : ''}`}>
          
          {/* User Attachments Strip */}
          {message.attachments && message.attachments.length > 0 && (
            <div className={`flex flex-wrap gap-2 mb-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
              {message.attachments.map(att => (
                <div
                  key={att.id}
                  className="flex items-center gap-2 p-2 rounded-xl bg-[#262626] border border-[#383838] text-xs text-[#ECECEC]"
                >
                  {att.isImage && att.previewUrl ? (
                    <img
                      src={att.previewUrl}
                      alt={att.name}
                      className="w-8 h-8 rounded-lg object-cover"
                    />
                  ) : (
                    <FileText size={16} className="text-[#A3A3A3]" />
                  )}
                  <span className="max-w-[140px] truncate">{att.name}</span>
                </div>
              ))}
            </div>
          )}

          {/* User Bubble (ChatGPT style dark rounded bubble) or Assistant Direct Canvas */}
          {isUser ? (
            <div className="inline-block px-5 py-3 rounded-[24px] bg-[#2f2f2f] text-[#ECECEC] text-[15px] leading-relaxed shadow-sm">
              <p className="whitespace-pre-wrap">{message.content}</p>
            </div>
          ) : (
            <div className="space-y-3">
              
              {/* ChatGPT-Style Collapsible Thought / Reasoning Process */}
              {message.reasoning && (
                <div className="rounded-xl border border-[#383838] bg-[#1c1c1c] overflow-hidden">
                  <button
                    onClick={() => setIsReasoningOpen(prev => !prev)}
                    className="w-full flex items-center justify-between px-3.5 py-2 text-xs font-medium text-[#A3A3A3] hover:text-[#ECECEC] hover:bg-[#262626] transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Brain size={14} className="text-emerald-400" />
                      <span className="font-medium text-[#c0c0c0]">Thought for a few seconds</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 font-mono">
                        Vayu Reasoning
                      </span>
                    </div>
                    {isReasoningOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>
                  {isReasoningOpen && (
                    <div className="px-4 py-3 border-t border-[#303030] bg-[#171717] text-xs text-[#b0b0b0] font-mono leading-relaxed whitespace-pre-wrap">
                      {message.reasoning}
                    </div>
                  )}
                </div>
              )}

              {/* Verified Web Sources */}
              {message.sources && message.sources.length > 0 && (
                <div className="rounded-xl border border-[#353535] bg-[#1a1a1a] p-3">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-[#737373] mb-2 flex items-center gap-1.5">
                    <span>Verified Web Sources</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {message.sources.map((source, sIdx) => (
                      <a
                        key={sIdx}
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-2 rounded-lg bg-[#242424] hover:bg-[#2c2c2c] border border-[#353535] text-xs text-[#A3A3A3] hover:text-white transition-all group"
                      >
                        <ExternalLink size={13} className="shrink-0 text-sky-400 group-hover:scale-110 transition-transform" />
                        <span className="truncate flex-1 font-medium">{source.title || source.url}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Generated Image Result Card */}
              {message.imageResult && (
                <div className="rounded-2xl border border-[#353535] bg-[#212121] p-2 overflow-hidden max-w-lg shadow-xl">
                  <div className="relative group rounded-xl overflow-hidden cursor-pointer" onClick={() => setIsImageModalOpen(true)}>
                    <img
                      src={message.imageResult}
                      alt="Generated Artwork"
                      className="w-full h-auto object-cover rounded-xl transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownloadImage(message.imageResult!);
                        }}
                        className="p-2.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur text-white transition-transform hover:scale-110"
                        title="Download image"
                      >
                        <Download size={18} />
                      </button>
                    </div>
                  </div>
                  <div className="px-2 pt-2 pb-1 text-xs text-[#A3A3A3] flex items-center justify-between">
                    <span>Vayu Vision Art</span>
                    <button
                      onClick={() => handleDownloadImage(message.imageResult!)}
                      className="text-sky-400 hover:text-sky-300 font-medium flex items-center gap-1"
                    >
                      <Download size={12} />
                      Save
                    </button>
                  </div>
                </div>
              )}

              {/* Main Markdown Body in ChatGPT Style */}
              <div className="chat-prose text-[#ECECEC] text-[15px] leading-relaxed">
                <ReactMarkdown
                  components={{
                    code({ className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || '');
                      const codeString = String(children).replace(/\n$/, '');
                      if (match) {
                        return <CodeBlock language={match[1]} code={codeString} />;
                      }
                      return (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>

              {/* Action Toolbar for Assistant Response in ChatGPT Style */}
              <div className="flex items-center gap-1 pt-1 opacity-75 group-hover:opacity-100 transition-opacity text-xs text-[#8e8e8e]">
                {/* Copy Text */}
                <button
                  onClick={handleCopy}
                  className="p-1.5 rounded-md hover:bg-[#2e2e2e] hover:text-white transition-colors cursor-pointer"
                  title="Copy response"
                >
                  {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                </button>

                {/* Read Aloud */}
                <button
                  onClick={handleSpeak}
                  className={`p-1.5 rounded-md hover:bg-[#2e2e2e] hover:text-white transition-colors cursor-pointer ${
                    isSpeaking ? 'text-sky-400' : ''
                  }`}
                  title={isSpeaking ? 'Stop speech' : 'Read aloud'}
                >
                  {isSpeaking ? <VolumeX size={14} /> : <Volume2 size={14} />}
                </button>

                {/* Regenerate */}
                {onRegenerate && (
                  <button
                    onClick={() => onRegenerate(message.id)}
                    className="p-1.5 rounded-md hover:bg-[#2e2e2e] hover:text-white transition-colors cursor-pointer"
                    title="Regenerate answer"
                  >
                    <RotateCw size={14} />
                  </button>
                )}

                {/* Thumbs Feedback */}
                <button
                  onClick={() => setFeedback(prev => (prev === 'up' ? null : 'up'))}
                  className={`p-1.5 rounded-md hover:bg-[#2e2e2e] hover:text-white transition-colors cursor-pointer ${
                    feedback === 'up' ? 'text-emerald-400' : ''
                  }`}
                  title="Good response"
                >
                  <ThumbsUp size={14} />
                </button>
                <button
                  onClick={() => setFeedback(prev => (prev === 'down' ? null : 'down'))}
                  className={`p-1.5 rounded-md hover:bg-[#2e2e2e] hover:text-white transition-colors cursor-pointer ${
                    feedback === 'down' ? 'text-rose-400' : ''
                  }`}
                  title="Poor response"
                >
                  <ThumbsDown size={14} />
                </button>

                {/* Model Tag */}
                <span className="ml-2 text-[10px] text-[#6e6e6e] font-mono">
                  Vayu AI v6.1
                </span>
              </div>
            </div>
          )}

          {/* User message edit prompt button on hover */}
          {isUser && onEditPrompt && (
            <div className="flex justify-end pt-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => onEditPrompt(message.content)}
                className="flex items-center gap-1 text-[11px] text-[#737373] hover:text-white px-2 py-1 rounded hover:bg-[#2c2c2c] transition-colors cursor-pointer"
              >
                <Pencil size={11} />
                <span>Edit</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Fullscreen Image Preview Modal */}
      {isImageModalOpen && message.imageResult && (
        <div
          onClick={() => setIsImageModalOpen(false)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img
              src={message.imageResult}
              alt="Fullscreen Preview"
              className="w-full h-full object-contain rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}
